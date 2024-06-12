---
title: "Java程序常见问题"
date: 2024-05-28
draft: false
tags: ["其他","Java"]
slug: "java-always-problems"
---

## CPU使用过高
一般在生产环境排查程序故障，都会查看日志什么的，但是有些故障日志是看不出来的，就比如：CPU使用过高。
那应该怎么办呢？我们需要结合linux命令和JDK相关命令来排查程序故障。

### 排查过程
1. 首先使用top命令，找出CPU占比最高的Java进程，然后进一步定位后台程序，如果发现使用过高的进程ID，记录下来方便排查。
2. 定位到具体的线程，使用`ps -mp 进程ID -o THREAD,tid,time`命令可以找到有问题的线程ID。
    ```
    ps -mp 进程ID -o THREAD,tid,time 说明：
    -m：显示所有线程；
    -p：pid进程使用CPU的时间；
    -o：该参数后是用户自定义参数
    ```
3. 获取到线程ID后，需要将线程ID转化为16进制格式，如果有英文要小写格式；可以用命令`printf "%x\n" 线程ID`，当然也可以使用工具从10进制转16进制。
    ```
    printf "%x\n" 16
    ```
4. 线程ID转成16进制后，执行最后一个命令：`jstack 进程ID | grep 16进制线程ID -A50`或者dump下来，`jstack pid > pid.log`，就能看到有问题的代码。

### 解决方案
1. 将dump文件下载下来，上传到第三方网站，如：https://fastthread.io/ 进行分析，然后找到解决方案；
2. 确定是否新部署或有新变更： 首先需要确认是否在最近进行了新的部署或有其他相关的变更，例如代码更新、配置修改等。这些变更可能导致应用出现性能问题，特别是在高负载情况下；
3. 确定是否可重现问题：尝试重现CPU飙高的问题，可以通过模拟实际场景、使用压力测试工具或者观察日志等方式来尽量还原问题。如果能够确定问题的可重现性，将有助于后续的排查和分析；
4. 确定是否为GC造成：Java应用中频繁进行垃圾回收可能会导致CPU飙高。可以通过查看GC日志、分析堆内存使用情况以及GC时间等指标来确认是否为GC引起了性能问题；
5. 确定是否线程阻塞：线程阻塞也是常见的导致CPU飙高的原因之一。可以通过线程监控工具，如JMC、VisualVM，来检查是否存在长时间阻塞的线程，并分析造成线程阻塞的原因；


## 死锁
死锁经常表现为程序的停顿，或者不再响应用户的请求。从操作系统上观察，对应进程的CPU占用率为零，很快会从top或prstat的输出中消失。

死锁示例代码：
```
public class MainTest {

    public static void main(String[] args) {
         String lockA = "lockA";
         String lockB = "lockB";
        new Thread(new ThreadHolderLock(lockA,lockB),"线程AAA").start();
        new Thread(new ThreadHolderLock(lockB,lockA),"线程BBB").start();
    }
}

class ThreadHolderLock implements Runnable{

    private String lockA;
    private String lockB;

    public ThreadHolderLock(String lockA, String lockB){
        this.lockA = lockA;
        this.lockB = lockB;
    }

    @Override
    public void run() {
        synchronized (lockA){
            System.out.println(Thread.currentThread().getName() + "\t 持有锁 "+ lockA+", 尝试获得"+ lockB);

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }

            synchronized (lockB){
                System.out.println(Thread.currentThread().getName() + "\t 持有锁 "+ lockB+", 尝试获得"+ lockA);
            }
        }
    }
}
```

步骤：
- 使用`jps -l`命令找到程序进程；
- 使用`jstack pid`命令打印堆栈信息；

上面死锁示例代码使用`jstack pid`后的一些信息：
```
Found one Java-level deadlock:
=============================
"线程BBB":
  waiting to lock monitor 0x00007feb0d80b018 (object 0x000000076af2d588, a java.lang.String),
  which is held by "线程AAA"
"线程AAA":
  waiting to lock monitor 0x00007feb0d80d8a8 (object 0x000000076af2d5c0, a java.lang.String),
  which is held by "线程BBB"

Java stack information for the threads listed above:
===================================================
"线程BBB":
	at com.github.springcloud.service.ThreadHolderLock.run(MainTest.java:35)
	- waiting to lock <0x000000076af2d588> (a java.lang.String)
	- locked <0x000000076af2d5c0> (a java.lang.String)
	at java.lang.Thread.run(Thread.java:748)
"线程AAA":
	at com.github.springcloud.service.ThreadHolderLock.run(MainTest.java:35)
	- waiting to lock <0x000000076af2d5c0> (a java.lang.String)
	- locked <0x000000076af2d588> (a java.lang.String)
	at java.lang.Thread.run(Thread.java:748)

Found 1 deadlock.
```

## 内存泄露
Java虚拟机是使用引用计数法和可达性分析来判断对象是否可回收，本质是判断一个对象是否还被引用，如果没有引用则回收。
内存泄露是指，程序中己动态分配的堆内存由于某种原因程序未释放或无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果。
简单来说，就是应该被垃圾回收的对象没有回收掉，导致占用的内存越来越多，最终导致内存溢出。

内存泄露主要原因：
- 在内存中加载过大的数据，例如从数据库取出过多数据；
- 资源未关闭造成的内存泄漏；
- 变量不合理的作用域，使用完毕，如果没有及时的赋值为null，则会造成内存泄露；
- 长生命周期的对象中引用短生命周期对象，很可能会出现内存泄露；

举个例子，创建的连接不再使用时，需要调用 close 方法关闭连接，只有连接被关闭后，GC 才会回收对应的对象（Connection，Statement，ResultSet，Session）。忘记关闭这些资源会导致持续占有内存，无法被 GC 回收。
这样就会导致内存泄露，最终导致内存溢出。
```java
public class MemoryLeak {
    public static void main(String[] args) {
      try{
          Connection conn =null;
          Class.forName("com.mysql.jdbc.Driver");
          conn =DriverManager.getConnection("url","","");
          Statement stmt =conn.createStatement();
          ResultSet rs =stmt.executeQuery("....");
      } catch(Exception e){//异常日志
      } finally {
        // 1．关闭结果集 Statement
        // 2．关闭声明的对象 ResultSet
        // 3．关闭连接 Connection
    }
  }
}
```

### 排查过程

根据运维之前收集到的内存数据、GC 日志尝试判断哪里出现了问题。
结果发现老年代的内存使用就算是发生 GC 也一直居高不下，而且随着时间推移也越来越高。

![内存泄漏问题-01](/iblog/posts/annex/images/essays/内存泄漏问题-01.png)

使用`jstat -gc <vmid>` 查看GC垃圾回收统计信息，看Full GC后堆空间使用内存还持续增长，且有增长到Xmx设定值的趋势，基本可以肯定存在内存泄露。
如果当前完全垃圾回收后内存增长到一个值之后，又能回落，总体上处于一个动态平衡，那么内存泄漏基本可以排除；也可以隔断时间抽取老年代占用内存情况，如果老年代占用情况持续上升也很有可能存在内存泄露的情况。

### 解决方案
1. 内存泄漏的主要表象就是内存不足，所以首先要看一下JVM启动参数中内存空间分配是否过小，如果是这种问题调整该参数即可；
2. 确定是否新部署或有新变更，首先需要确认是否在最近进行了新的部署或有其他相关的变更，例如代码更新、配置修改等。这些变更可能导致应用出现性能问题，特别是在高负载情况下；
3. 内存泄漏解决方案，最经典的就是用MAT工具分析dump文件，但如果dump文件巨大就不建议这样，可以使用其他方案，例如：重启、本地复现、`jmap -histo:live <pid>`在线进行分析等其他方案解决。

使用MAT定位内存泄漏思路：
1. 打开MAT中histogram，找到堆内存中占用最大的对象，内存泄漏很有可能就是由大对象导致的；
   ![MAT-01](/iblog/posts/annex/images/essays/MAT-01.png)
2. 由大对象找被哪些线程引用，查看内存占用最大的线程；
   ![MAT-02](/iblog/posts/annex/images/essays/MAT-02.png)
   ![MAT-03](/iblog/posts/annex/images/essays/MAT-03.png)
4. 从线程中的堆栈信息找到项目中自定义的包和对象，从而可定位到具体的代码；
   ![MAT-04](/iblog/posts/annex/images/essays/MAT-04.png)
   ![MAT-05](/iblog/posts/annex/images/essays/MAT-05.png)

## JVM参数调优
JVM优化是到最后不得已才采用的手段，对JVM内存的系统级的调优主要的目的是减少GC的频率和Full GC的次数。
JVM参数说明：https://www.oracle.com/java/technologies/javase/vmoptions-jsp.html

理想的情况下，一个Java程序使用JVM的默认设置也可以运行得很好，所以一般来说，没有必要设置任何JVM参数。然而，由于一些性能问题，我们需要设置合理的JVM参数。

可以通过`java -XX:+PrintFlagsInitial` 命令查看JVM所有参数。

常用参数：

| 参数                            | 含义                                      | 描述                                                         |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------------------ |
| -Xms                            | 堆初始值                                  | Xmx和Xms设置为老年代存活对象的3-4倍，即FullGC之后的老年代内存占用的3-4倍 |
| -Xmx                            | 堆最大值                                  | 为了防止自动扩容降低性能，建议将-Xms和-Xmx的值设置为相同值   |
| -XX:MaxHeapFreeRatio            | 最大堆内存使用率                          | 默认70，当超过该比例会进行扩容堆，Xms=Xmx时该参数无效        |
| -XX:MinHeapFreeRatio            | 最小堆内存使用率                          | 默认40，当低于该比例会缩减堆，Xms=Xmx时该参数无效            |
| -Xmn                            | 年轻代内存最大值                          | 年轻代设置的越大，老年代区域就会减少。一般不允许年轻代比老年代还大，因为要考虑GC时最坏情况，所有对象都晋升到老年代。建议设置为老年代存活对象的1-1.5倍，最大可以设置为-Xmx/2 。考虑性能，一般会通过参数 -XX:NewSize 设置年轻代初始大小。如果知道了年轻代初始分配的对象大小，可以节省新生代自动扩展的消耗。 |
| -XX:SurvivorRatio               | 年轻代中两个Survivor区和Eden区大小比率    | 例如： -XX:SurvivorRatio=10 表示伊甸园区是幸存者其中一个区大小的10倍，所以,伊甸园区占新生代大小的10/12, 幸存区From和幸存区To 每个占新生代的1/12 |
| -XX:NewRatio                    | 年轻生代和老年代的比率                    | 例如：-XX:NewRatio=3 指定老年代/新生代为3/1. 老年代占堆大小的 3/4 ，新生代占 1/4 。如果针对新生代,同时定义绝对值和相对值,绝对值将起作用，建议将年轻代的大小为整个堆的3/8左右。 |
| -XX:+HeapDumpOnOutOfMemoryError | 让JVM在发生内存溢出时自动的生成堆内存快照 | 可以通过-XX:HeapDumpPath=path参数将生成的快照放到指定路径下  |
| -XX:OnOutOfMemoryError          | 当内存溢发生时可以执行一些指令            | 比如发个E-mail通知管理员或者执行一些清理工作，执行脚本       |
| -XX:ThreadStackSize             | 每个线程栈最大值                          | 栈设置太大，会导致线程创建减少，栈设置小，会导致深入不够，深度的递归会导致栈溢出，建议栈深度设置在3000-5000k。 |
| -XX:MetaspaceSize               | 初始化的元空间大小                        | 如果元空间大小达到了这个值，就会触发Full GC为了避免频繁的Full GC，建议将- XX：MetaspaceSize设置较大值。如果释放了空间之后，元空间还是不足，那么就会自动增加MetaspaceSize的大小 |
| -XX:MaxMetaspaceSize            | 元空间最大值                              | 默认情况下，元空间最大的大小是系统内存的大小，元空间一直扩大，虚拟机可能会消耗完所有的可用系统内存。 |

完整示例参数：
```
# 必备
-XX:+PrintGCDetails 
-XX:+PrintGCDateStamps 
-XX:+PrintTenuringDistribution 
-XX:+PrintHeapAtGC 
-XX:+PrintReferenceGC 
-XX:+PrintGCApplicationStoppedTime

# 可选
-XX:+PrintSafepointStatistics 
-XX:PrintSafepointStatisticsCount=1

# GC日志输出的文件路径
-Xloggc:/path/to/gc-%t.log
# 开启日志文件分割
-XX:+UseGCLogFileRotation 
# 最多分割几个文件，超过之后从头文件开始写
-XX:NumberOfGCLogFiles=14
# 每个文件上限大小，超过就触发分割
-XX:GCLogFileSize=100M
```

何时调优：
1. Full GC 次数频繁；
2. GC 停顿时间过长；
3. 应用出现OutOfMemory 等内存异常；
4. 堆内存持续上涨达到设置的最大内存值；

调优原则：
1. 多数导致GC问题的Java应用，都不是因为我们参数设置错误，而是代码问题
2. 在实际使用中，分析GC情况优化代码比优化JVM参数更好
3. 减少创建对象的数量、减少使用全局变量和大对象

调优思路：
1. 分析GC日志及dump文件，判断是否需要优化，确定瓶颈问题点。如果各项参数设置合理，系统没有超时日志出现，GC频率不高，GC耗时不高，那么没有必要进行GC优化，如果GC时间超过1-3秒，或者频繁GC，则必须优化。
2. 确定JVM调优目标。如果内存分配过大或过小，或者采用的GC收集器比较慢，则应该优先调整这些参数，并且先找1台或几台机器进行测试，然后比较优化过的机器和没有优化的机器的性能对比，并有针对性的做出最后选择。
3. 不断的分析和调整，直到找到合适的JVM参数配置。

## 线上接口慢

### 定位问题
首先要定位是哪里慢，定位接口哪一个环节比较慢，性能瓶颈在哪里，可以使用应用性能监控工具(APM)定位问题。常见工具: skywalking、pinpoint、cat、zipkin。

如果应用程序没有接入APM，可以在生产环境装一下arthas，利用trace接口方法和火焰图，大概能分析是那一块比较慢，定位能力稍微有点粗糙，亦可以利用程序中的告警日志定位问题。

### 解决办法
如果已经定位到具体是哪里的问题了，那么就可以进行解决，如果是最新的功能引起的，那么最快的办法就是回退版本。
以下是几种常见接口慢的情况。

#### 数据库慢sql
如果是数据库sql慢，可以使用执行计划去分析一下，常见sql慢的几种情况：
- 锁表；先把锁表的sqlkill一波，在分析具体原因；
- 未加索引；添加索引，有可能会锁表，引发一系列问题，需要综合评估；
- 索引失效；分析索引失效原因，如：索引列区分度（值大都相同）很低、索引列大量空值、对所索引列加方法转换等；
- 小表驱动大表；在连接查询时尽量过滤数据，使用小表驱动大表，使笛卡尔积尽量小一些；
- sql太复杂；join超过3张表或者子查询比较多，建议拆分为多个sql，接口间相互调用；比如先从某个著接口查询某个表数据，然后关联字段作为条件从另一个表查询，进行内存拼接；
- 返回的数据量数据太多；当超过数据库一定限制的时候返回大量数据就会很慢，可以使用分页多批次完成，针对访问量不多的接口可使用多线程批量查询；
- 单表数据量太大；（mysql超500w较慢）如果单表数据量较大，考虑在数据库设计做文章，如：分片分库、利用es存储等；

#### 调用第三方接口慢
- 设置合理的超时时间；调用第三方接口一定要设置合理的超时时间，在设置时一定要大于调用接口的平均相应时间；
- 第三方接口大量超时；可以集成sentinel或hystrix限流熔断框架，防止第三方接口拖垮自己的接口（兜底逻辑）；
- 事务型操作根据实际情况决定是否采用补偿机制（本地消息表）；比如新增、修改等操作要考虑对方接口是否支持幂等，防止超发；
- 循环调用，改为单次批量调用，减少IO损耗；如：调用根据id查询单条数据的接口，可优化为批量查询接口；
- 缓存查询结果；考虑当前查询结果是否能做缓存，如用户信息等短时间内不会变化的信息，根据业务形态来决定；

#### 中间件慢
- redis慢：是否有大key、热key，可接入hotkeys监控；针对热key可以使用本地缓存来抗，针对大key可以将其拆分，采用set结构的sismember等方法
- kafka：生产端慢：可以使用堵塞队列接收，批量丢消息；消费端慢：消费端慢会造成消息积压，可以扩分区、增加消费节点、增加消费线程，用数据机构接受批量写入库；

#### 程序逻辑慢
- 非法校验逻辑前置；避免无用数据穿透小号系统资源，减少无效调用；
- 循环调用改为单次批量调用；在查询数据库或调用第三方接口，能批量就批量，数据在内存组装处理；
- 同步调用改为异步调用；在接口没有相互依赖的关系的时候可以将其优化为异步查询；
- 非核心逻辑剥离；将接口的大事务拆分为小事务，一些非核心逻辑可以异步处理，可以使用mq异步解耦；
- 线程池合理设置参数；不要使用JDK默认参数，如果在高并发的情况下容易OOM，线程池满了以后要重写拒绝策略，考虑告警加数据持久化处理；
- 锁合理设置；本地读写锁设计使用不合理，要控制锁的力度，尽量小一些；分布式锁合理使用防止热key；
- 优化GC参数；考虑GC是否频繁，调整GC算法，新生代老年代比例，根据长时间观察可以设置出来；
- 只打印必要日志；当并发量比较高的时候打印日志也会损耗性能，所以日志应加上开关能不打就不打；

#### 架构优化
- 高并发读逻辑走redis，尽可能不要穿透到DB；redis查询不到也不要查DB，可通过定时任务，MQ写入redis。尽量不要把风险给DB，DB如果挂了整个应用就用不了了；
- 设计写逻辑数据，尽量异步、批量处理、分库分表提升写入性能；
- 接口接入限流熔断兜底；
- 接入监控告警；error日志告警、接口慢查询或者不可用或限流熔断告警、DB告警、中间件告警、应用系统告警等；
- 接口需要加动态配置开关；能够快速切断流量或降级某些非核心服务调用；
- 设计程序自愈能力；比如如果数据有问题，用配置好的程序逻辑自动去修复；

## @Transactional常见问题

