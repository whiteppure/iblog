---
title: "高效读取写入百万级MySQL数据的方案与实战技巧"
date: 2025-03-23
draft: true
tags: ["Java小课堂","Java","随笔"]
slug: "select-mysql-100w"
---

文章思路：
1.举例说明引出百万级MySQL数据读取、写入问题
2.分析问题（过渡）
3.给出具体解决方案


某电商财务系统在月度结算时，工作人员通过数据库客户端直接执行
```sql
SELECT
    order_id, amount, status
FROM
    orders 
WHERE
    create_time BETWEEN '2024-05-01' AND '2024-05-31'
ORDER BY amount DESC LIMIT 500000,1000
```
生成对账单。
由于`create_time`字段仅有单列索引，未建立覆盖索引（`create_time`,`amount`,`status`），导致MySQL被迫进行全表扫描，800万行数据触发12次磁盘临时文件排序。
DBA监控发现该查询扫描行数达821万行，锁持有时间超300秒，最终引发连接池占满、主从延迟告警，结算系统瘫痪1小时。

`LIMIT 500000,1000`导致MySQL需先遍历前50万行数据（逻辑读次数=50万+1000），而大多数分页场景用户仅浏览前10页，深分页需求应通过异步导出实现。

这让我联想到从MySQL分页读取大量数据到内存时
