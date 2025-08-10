---
title: "高效读取百万级MySQL数据实战技巧"
date: 2025-03-23
draft: false
tags: ["Java小课堂","Java","随笔"]
slug: "select-mysql-100w"
---


上月财务小姐姐点击“生成月度对账单”后，悠闲地端起咖啡杯。十分钟后，她盯着浏览器的加载动画，眼神从期待变成绝望，整个结算系统卡死了。
经过DBA监控发现，出现问题的正是以下SQL：
```sql
SELECT
    order_id, amount, status
FROM
    orders 
WHERE
    create_time BETWEEN '2024-05-01' AND '2024-05-31'
ORDER BY amount DESC LIMIT 500000,1000
```
由于`create_time`字段仅有单列索引，未建立覆盖索引（`create_time`,`amount`,`status`），导致MySQL被迫进行全表扫描，800万行数据触发12次磁盘临时文件排序。
DBA监控发现该查询扫描行数达821万行，锁持有时间超300秒，最终引发连接池占满、主从延迟告警，结算系统瘫痪1小时。

```text
# 慢查询日志
Rows_examined: 8210000  # 扫描821万行
Sort_merge_passes: 12   # 12次磁盘排序
Lock_time: 302.6s       # 锁表超5分钟
```

为什么这条SQL成了性能杀手？
1. 深分页：`LIMIT 500000,1000` 导致MySQL需要先读取500000+1000条数据，然后丢弃前500000条。
2. 索引缺失：仅有一个`create_time`的单列索引，无法覆盖查询（需要`amount`排序和`status`、`order_id`字段）。
3. 全表扫描：由于索引不合适，导致需要扫描整个5月份的数据（800万行），并且进行排序，产生了磁盘临时文件。

针对以上分析，解决思路如下：
1. 避免深分页：改为游标分页（基于上一页的最大ID或排序字段值）。
2. 优化索引：建立覆盖索引（`create_time`, `amount`, `status`, `order_id`），这样查询可以直接在索引上完成，避免回表。
3. 分批处理：将一次大查询拆分成多个小查询，每次查询一小部分，减轻单次查询压力。
4. 异步导出：对于这种大量数据的导出，采用异步任务，避免阻塞Web请求，同时将结果导出为文件供用户下载。
5. 读写分离：在从库上执行导出操作，避免影响主库。
6. 流式处理：使用数据库的流式读取（例如JDBC的`fetchSize`设置），避免一次性加载所有数据到内存。

具体到该场景的解决方案：
1. 创建覆盖索引（`create_time, amount, status, order_id`），这样查询可以完全在索引上完成，避免回表，同时排序可以利用索引的有序性。
    ```sql
    -- 创建专用索引
    ALTER TABLE orders ADD INDEX idx_cover 
        (create_time, amount, status, order_id)
    ```
2. 将深分页改为游标分页（记录上一批最后一条记录的ID，下一次查询从该ID之后开始），避免使用`LIMIT offset, row_count`中的`offset`。
    ```sql
    /* 优化后查询（响应时间<1s） */
    SELECT order_id, amount, status
    FROM orders
    WHERE create_time BETWEEN '2024-05-01' AND '2024-05-31'
      AND amount < ? -- 上一批最小值（降序时）
      AND order_id > ? -- 解决金额重复问题
    ORDER BY amount DESC, order_id ASC
    LIMIT 5000; -- 分批大小
    ```
3. 将整个导出任务改为异步，用户发起请求后，系统在后台分批处理，处理完成后生成文件并通知用户下载。伪代码如下：
    ```java
    @RestController
    @RequestMapping("/export")
    public class DataExportController {
    
        @PostMapping("/orders")
        public ResponseData createExportTask(@RequestBody ExportRequest request) {
            String taskId = "export_" + System.currentTimeMillis();
            
            // 存入Redis并设置24小时过期
            redisTemplate.opsForValue().set(
                "export:task:" + taskId, 
                ExportTask.builder()
                    .status(ExportStatus.PENDING)
                    .params(request)
                    .progress(0)
                    .build(),
                24, TimeUnit.HOURS
            );
            
            // 提交到线程池异步执行
            exportExecutor.submit(() -> processExportTask(taskId));
            
            return ResponseData.success(taskId);
        }
        
        @GetMapping("/status/{taskId}")
        public ResponseData getTaskStatus(@PathVariable String taskId) {
            ExportTask task = (ExportTask) redisTemplate.opsForValue()
                .get("export:task:" + taskId);
            
            if (task == null) {
                return ResponseData.error("任务不存在或已过期");
            }
            
            return ResponseData.success(task);
        }
    }
    ```
   在代码中使用分批查询，每次查询5000条（举例），处理完一批再查下一批，直到结束。
   ```java
   public void processExportTask(String taskId) {
       ExportTask task = getTask(taskId);
       ExportParams params = task.getParams();
       
       try (Connection conn = dataSource.getConnection();
            Statement stmt = conn.createStatement(
                ResultSet.TYPE_FORWARD_ONLY, 
                ResultSet.CONCUR_READ_ONLY)) {
           
           stmt.setFetchSize(BATCH_SIZE); // 每次读取5000条
           
           String query = buildQuery(params);
           ResultSet rs = stmt.executeQuery(query);
           
           Path tempFile = Files.createTempFile("export_", ".csv");
           try (CSVPrinter printer = new CSVPrinter(
                   Files.newBufferedWriter(tempFile), 
                   CSVFormat.DEFAULT)) {
                   
               int count = 0;
               while (rs.next()) {
                   // 处理结果集
                   printer.printRecord(
                       rs.getString("order_id"),
                       rs.getBigDecimal("amount"),
                       rs.getString("status")
                   );
                   
                   // 每1000条更新一次进度
                   if (++count % 1000 == 0) {
                       updateProgress(taskId, count);
                   }
               }
               updateProgress(taskId, count, ExportStatus.COMPLETED);
               
               // 上传到文件存储
               String fileUrl = fileStorageService.upload(tempFile);
               task.setFileUrl(fileUrl);
               saveTask(taskId, task);
               
               // 发送通知
               notifyService.sendExportComplete(params.getUserId(), fileUrl);
           }
       } catch (Exception e) {
           updateProgress(taskId, 0, ExportStatus.FAILED);
           logger.error("导出任务失败", e);
       }
   }
   
   private String buildQuery(ExportParams params) {
       return String.format(
           "SELECT order_id, amount, status " +
           "FROM orders " +
           "WHERE create_time BETWEEN '%s' AND '%s' " +
           "ORDER BY create_time ASC",  // 按时间顺序避免随机IO
           params.getStartTime(),
           params.getEndTime());
   }
   ```

> 空间换时间（索引） + 分而治之（分批） + 异步解耦（任务队列） = 百万级数据处理最优解

财务系统现在每月处理千万级订单导出，峰值期间系统负载保持在40%以下，财务小姐姐终于能准时下班了。




