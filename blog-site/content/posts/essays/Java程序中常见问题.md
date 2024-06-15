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
死锁通常被定义为：如果一个进程集合中的每个进程都在等待只能由此集合中的其他进程才能引发的事件，而无限期陷入僵持的局面称为死锁。

举个例子，当线程A持有锁a并尝试获取锁b，线程B持有锁b并尝试获取锁a时，就会出现死锁。
简单来说，死锁问题的产生是由两个或者以上线程并行执行的时候，争夺资源而互相等待造成的。

### 排查过程
死锁经常表现为程序的停顿，或者不再响应用户的请求。从操作系统上观察，对应进程的CPU占用率为零，很快会从top的输出中消失。

这里模拟死锁代码：
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

1. 使用`jps -l`命令找到程序进程；
2. 使用`jstack pid`命令打印堆栈信息；
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

### 解决方案
#### 使用资源有序分配法避免死锁
想要如何避免死锁，就要弄清楚死锁出现的原因，造成死锁必须达成的4个条件：
- 互斥条件：一个资源每次只能被一个线程使用。例如，如果线程 A 已经持有的资源，不能再同时被线程 B 持有，如果线程 B 请求获取线程 A 已经占用的资源，那线程 B 只能等待，直到线程 A 释放了资源。
- 请求与保持条件：一个线程因请求资源而阻塞时，对已获得的资源保持不放。例如，当线程 A 已经持有了资源 1，又想申请资源 2，而资源 2 已经被线程 C 持有了，所以线程 A 就会处于等待状态，但是线程 A 在等待资源 2 的同时并不会释放自己已经持有的资源 1。
- 不剥夺条件：线程已获得的资源，在未使用完之前，不能强行剥夺。例如，当线程A已经持有了资源 ，在自己使用完之前不能被其他线程获取，线程 B 如果也想使用此资源，则只能在线程 A 使用完并释放后才能获取。
- 循环等待条件：若干线程之间形成一种头尾相接的循环等待资源关系。比如，线程 A 已经持有资源 2，而想请求资源 1， 线程 B 已经获取了资源 1，而想请求资源 2，这就形成资源请求等待的环。

避免死锁的产生就只需要破环其中一个条件就可以，最常见的并且可行的就是使用资源有序分配法，来破循环等待条件。

资源有序分配法: 线程 A 和 线程 B 获取资源的顺序要一样，当线程 A 先尝试获取资源 A，然后尝试获取资源 B 的时候，线程 B 同样也是先尝试获取资源 A，然后尝试获取资源 B。也就是说，线程 A 和 线程 B 总是以相同的顺序申请自己想要的资源。

给资源分配一个全局的唯一编号，进程必须按资源编号的顺序请求资源。这种方法可以避免循环等待，从而防止死锁。
```java
class Resource {
    private final int id;

    public Resource(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }
}

class Process extends Thread {
    private final int id;
    private final Resource[] resources;

    public Process(int id, Resource[] resources) {
        this.id = id;
        this.resources = resources;
    }

    @Override
    public void run() {
        try {
            acquireResources();
            // 模拟处理
            Thread.sleep((int) (Math.random() * 1000));
            releaseResources();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void acquireResources() throws InterruptedException {
        for (Resource resource : resources) {
            synchronized (resource) {
                System.out.println("Process " + id + " acquired Resource " + resource.getId());
            }
        }
    }

    private void releaseResources() {
        for (Resource resource : resources) {
            synchronized (resource) {
                System.out.println("Process " + id + " released Resource " + resource.getId());
            }
        }
    }
}

public class ResourceOrderingExample {
    public static void main(String[] args) {
        Resource resource1 = new Resource(1);
        Resource resource2 = new Resource(2);
        Resource resource3 = new Resource(3);

        Process process1 = new Process(1, new Resource[]{resource1, resource2});
        Process process2 = new Process(2, new Resource[]{resource2, resource3});
        Process process3 = new Process(3, new Resource[]{resource3, resource1});

        process1.start();
        process2.start();
        process3.start();
    }
}
```

#### 使用银行家算法避免死锁
![银行家算法](/iblog/posts/annex/images/essays/银行家算法.png)

银行家算法：一个避免死锁（Deadlock）的著名算法，是由艾兹格·迪杰斯特拉在1965年为T.H.E系统设计的一种避免死锁产生的算法。它以银行借贷系统的分配策略为基础，判断并保证系统的安全运行。

在银行中，客户申请贷款的数量是有限的，每个客户在第一次申请贷款时要声明完成该项目所需的最大资金量，在满足所有贷款要求时，客户应及时归还。银行家在客户申请的贷款数量不超过自己拥有的最大值时，都应尽量满足客户的需要。通过判断借贷是否安全，然后决定借不借。

举例，现有公司B、公司A、公司T，想要从银行分别贷款70亿、40亿、50亿，假设银行只有100亿供放贷，如果借不到企业最大需求的钱，钱将不会归还，怎么才能合理的放贷？
| 公司 | 最大需求 | 已借走 | 最多还借 |
| ---- | -------- | ------ | -------- |
| B    | 70       | 20     | 50       |
| A    | 40       | 10     | 30       |
| T    | 50       | 30     | 20       |

此时公司B、A、T已经从银行借走60亿，银行还剩40亿。此时银行可放贷金额组合：
- 借给公司B10亿、公司A10亿、公司T20亿，等待公司T还钱再将10亿借给公司A，等待公司A还钱，再将钱借给公司B；
- 借给公司T20亿，等公司T还钱再将钱借给公司A，等待公司A还钱再将钱借给公司B；
- 借给公司A10亿，等待公司A还钱再将钱借给公司T，公司T还钱再将钱借给公司B；

```java
class Banker {
    private int[] available;  // 系统可用资源
    private int[][] maximum;  // 每个进程的最大资源需求
    private int[][] allocation; // 每个进程当前已分配的资源
    private int[][] need;      // 每个进程剩余的资源需求

    public Banker(int[] available, int[][] maximum) {
        this.available = available;
        this.maximum = maximum;
        int numProcesses = maximum.length;
        int numResources = available.length;
        allocation = new int[numProcesses][numResources];
        need = new int[numProcesses][numResources];
        for (int i = 0; i < numProcesses; i++) {
            for (int j = 0; j < numResources; j++) {
                need[i][j] = maximum[i][j]; // 初始时，Need等于Maximum
            }
        }
    }

    // 请求资源的方法
    public synchronized boolean requestResources(int processId, int[] request) {
        if (!isRequestValid(processId, request)) {
            return false; // 请求不合法，拒绝请求
        }

        // 试探性分配
        for (int i = 0; i < available.length; i++) {
            available[i] -= request[i];
            allocation[processId][i] += request[i];
            need[processId][i] -= request[i];
        }

        // 安全性检查
        boolean safe = isSafeState();

        if (!safe) {
            // 如果不安全，恢复试探性分配前的状态
            for (int i = 0; i < available.length; i++) {
                available[i] += request[i];
                allocation[processId][i] -= request[i];
                need[processId][i] += request[i];
            }
        }

        return safe;
    }

    private boolean isRequestValid(int processId, int[] request) {
        for (int i = 0; i < request.length; i++) {
            if (request[i] > need[processId][i] || request[i] > available[i]) {
                return false; // 请求超出需求或可用资源
            }
        }
        return true;
    }

    private boolean isSafeState() {
        int[] work = available.clone();
        boolean[] finish = new boolean[allocation.length];

        while (true) {
            boolean found = false;
            for (int i = 0; i < allocation.length; i++) {
                if (!finish[i]) {
                    boolean canProceed = true;
                    for (int j = 0; j < work.length; j++) {
                        if (need[i][j] > work[j]) {
                            canProceed = false;
                            break;
                        }
                    }
                    if (canProceed) {
                        for (int j = 0; j < work.length; j++) {
                            work[j] += allocation[i][j];
                        }
                        finish[i] = true;
                        found = true;
                    }
                }
            }
            if (!found) {
                break;
            }
        }

        for (boolean f : finish) {
            if (!f) {
                return false; // 存在未完成的进程，系统不安全
            }
        }
        return true; // 所有进程都完成，系统安全
    }
}
```
调用示例
```java
public class BankerExample {
    public static void main(String[] args) {
        int[] available = {3, 3, 2};
        int[][] maximum = {
            {7, 5, 3},
            {3, 2, 2},
            {9, 0, 2},
            {2, 2, 2},
            {4, 3, 3}
        };

        Banker banker = new Banker(available, maximum);

        int[] request1 = {1, 0, 2};
        boolean granted1 = banker.requestResources(1, request1);
        System.out.println("Request 1 granted: " + granted1);

        int[] request2 = {3, 3, 0};
        boolean granted2 = banker.requestResources(4, request2);
        System.out.println("Request 2 granted: " + granted2);

        int[] request3 = {2, 0, 0};
        boolean granted3 = banker.requestResources(0, request3);
        System.out.println("Request 3 granted: " + granted3);
    }
}
```

#### 使用 tryLock 进行超时锁定
使用 `java.util.concurrent.locks.ReentrantLock` 的 `tryLock`方法可以尝试获取锁，并设置超时时间，避免长时间等待造成的死锁。

```java
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;
import java.util.concurrent.TimeUnit;

class Process extends Thread {
    private final int id;
    private final Lock lock1;
    private final Lock lock2;

    public Process(int id, Lock lock1, Lock lock2) {
        this.id = id;
        this.lock1 = lock1;
        this.lock2 = lock2;
    }

    @Override
    public void run() {
        try {
            while (true) {
                if (lock1.tryLock(50, TimeUnit.MILLISECONDS)) {
                    try {
                        if (lock2.tryLock(50, TimeUnit.MILLISECONDS)) {
                            try {
                                System.out.println("Process " + id + " acquired both locks");
                                // 模拟处理
                                Thread.sleep((int) (Math.random() * 1000));
                                return;
                            } finally {
                                lock2.unlock();
                            }
                        }
                    } finally {
                        lock1.unlock();
                    }
                }
                // 等待一段时间再重试
                Thread.sleep((int) (Math.random() * 50));
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

public class TryLockExample {
    public static void main(String[] args) {
        Lock lock1 = new ReentrantLock();
        Lock lock2 = new ReentrantLock();

        Process process1 = new Process(1, lock1, lock2);
        Process process2 = new Process(2, lock2, lock1);

        process1.start();
        process2.start();
    }
}
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

示例参数：
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
1. 多数导致GC问题的Java应用，都不是因为我们参数设置错误，而是代码问题；
2. 在实际使用中，分析GC情况优化代码比优化JVM参数更好；
3. 减少创建对象的数量、减少使用全局变量和大对象；

调优思路：
1. 分析GC日志及dump文件，判断是否需要优化，确定瓶颈问题点。如果各项参数设置合理，系统没有超时日志出现，GC频率不高，GC耗时不高，那么没有必要进行GC优化，如果GC时间超过1-3秒，或者频繁GC，则必须优化；
2. 确定JVM调优目标。如果内存分配过大或过小，或者采用的GC收集器比较慢，则应该优先调整这些参数，并且先找1台或几台机器进行测试，然后比较优化过的机器和没有优化的机器的性能对比，并有针对性的做出最后选择；
3. 不断的分析和调整，直到找到合适的JVM参数配置；

## 线上接口慢

### 定位问题
首先要定位是哪里慢，定位接口哪一个环节比较慢，性能瓶颈在哪里，可以使用应用性能监控工具(APM)定位问题。常见工具: skywalking、pinpoint、cat、zipkin。

如果应用程序没有接入APM，可以在生产环境装一下arthas，利用trace接口方法和火焰图，大概能分析是那一块比较慢，定位能力稍微有点粗糙，亦可以利用程序中的告警日志定位问题。

### 解决方案
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

## @Transactional
`@Transactional`是开发过程中使用比较频繁的注解，但是使用不当也会导致事务失效甚至导致一些其他问题，下面是使用`@Transactional`遇到的几种问题。

### @Transactional失效情况
1. 如果某个方法是非public的，那么`@Transactional`就会失效。因为事务的底层是利用`cglib`代理实现，`cglib`是基于父子类来实现的，子类是不能重载父类的private方法，所以无法很好利用代理，这种情况下会导致@Transactional失效；
2. 使用的数据库引擎不支持事务。因为Spring的事务调用的也是数据库事务的API，如果数据库都不支持事务，那么`@Transactional`注解也就失效了；
3. 添加了`@Transactional`注解的方法不能在同一个类中调用，否则会使事务失效。这是因为Spring AOP通过代理来管理事务，自调用不会经过代理；
4. `@Transactional` 注解属性 `propagation` 设置错误，若是错误的配置以下三种 `propagation`，事务将不会发生回滚：
   - `TransactionDefinition.PROPAGATION_SUPPORTS`：如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。
   - `TransactionDefinition.PROPAGATION_NOT_SUPPORTED`：以非事务方式运行，如果当前存在事务，则把当前事务挂起。
   - `TransactionDefinition.PROPAGATION_NEVER`：以非事务方式运行，如果当前存在事务，则抛出异常。
5. `@Transactional`注解属性`rollbackFor`设置错误，`rollbackFor`可以指定能够触发事务回滚的异常类型。默认情况下，Spring仅在抛出未检查异常（继承自`RuntimeException`）时回滚事务。对于受检异常（继承自 `Exception`），事务不会回滚，除非明确配置了`rollbackFor`属性；
6. 异常被捕获了，导致`@Transactional`失效。当事务方法中抛出一个异常后，应该是需要表示当前事务需要`rollback`，如果在事务方法中手动捕获了该异常，那么事务方法则会认为当前事务应该正常提交，此时就会出现事务方法中明明有报错信息表示当前事务需要回滚，但是事务方法认为是正常，出现了前后不一致，也是因为这样就会抛出`UnexpectedRollbackException`异常；

我们在使用`@Transactional`时，要避免出现上述情况，以确保 `@Transactional` 注解正确生效，从而实现事务管理的可靠性和一致性。

### @Transactional遇到锁
看到这么一段代码，原来当Transactional碰到锁，有个大坑，觉得很有意思，于是便记录下来。

```java
@Service
public class ServiceOne{
    // 设置一把可重入的公平锁
    private Lock lock = new ReentrantLock(true);
    
    @Transactional(rollbackFor = Exception.class)
    public Result  func(long seckillId, long userId) {
        lock.lock();
        // 执行数据库操作——查询商品库存数量
        // 如果 库存数量 满足要求 执行数据库操作——减少库存数量——模拟卖出货物操作
        lock.unlock();
    }
}
```
`func`方法是原子操作，所以使用事务，为了解决并发访问的问题，用`lock`把整个代码包裹了起来，这么使用锁和事务，是会发生超卖问题的。

在使用MySQL数据库的可重复读隔离机制，如果是高并发的情况下，假设真的就有多个线程同时调用`func`方法。
要保证一定不能出现超卖的情况，那么就需要事务的开启与提交能完整的包裹在`lock`与`unlock`之间。

为什么要保证事务的开启与提交，完整的包裹在`lock`与`unlock`之间呢？

举个例子，假设现在库存就只有一个了，这个时候 A，B 两个线程来请求下单。A 请求先拿到锁，然后查询出库存为一，可以下单，走了下单流程，把库存减为 0 了。
但是由于 A 先执行了 `unlock` 操作，而未提交事务，先释放了锁。B 线程看到后马上就冲过来拿到了锁，并执行了查询库存的操作。
这个时候 A 线程还没来得及提交事务，所以 B 读取到的库存还是 1，如果程序没有做好控制，也走了下单流程，此时就造成了超卖。

那怎么保证事务的开启与提交，完整的包裹在`lock`与`unlock`之间呢？

先来了解一下事务的启动和结束时机，这里直接说结论。
事务的启动时机，在执行到它们之后的第一个操作数据库表的语句，事务才算是真正启动。在上述示例代码中第一个SQL是在加锁之后执行的，所以先加锁再开启事务。
事务的提交是在目标方法执行之后。具体代码可以参考：`TransactionAspectSupport.invokeWithTransaction`方法，从其中可以看出，`invocation.proceedWithInvocation` 是在`commitTransactionAfterReturning`前面的。

所以怎样保证呢？对于声明式事务，解决办法是把锁加在方法外面。如果一定需要加在里面，也可以使用编程式事务。
```java
 public void func(long seckillId, long userId) {
    DefaultTransactionDefinition definition = new DefaultTransactionDefinition();
    definition.setIsolationLevel(TransactionDefinition.ISOLATION_REPEATABLE_READ);
    TransactionStatus status = transactionManager.getTransaction(definition);
    lock.lock();
    try {
       // 执行数据库操作——查询商品库存数量
       // 如果 库存数量 满足要求 执行数据库操作——减少库存数量——模拟卖出货物操作
        transactionManager.commit(status);
    } catch (Exception e) {
        transactionManager.rollback(status);
    } finally {
        lock.unlock();
    }
 }
```
```java
@Service
public class ServiceOne{
    // 设置一把可重入的公平锁
    private Lock lock = new ReentrantLock(true);
    
    @Autowired
    private ServiceTwo serviceTwo;
    
    public Result  func(long seckillId, long userId) {
        lock.lock();
        serviceTwo.sellProduct();
        lock.unlock();
    }

}

@Service
public class ServiceTwo{
    
   @Transactional(rollbackFor = Exception.class)
   public void sellProduct(){
      // 执行数据库操作——查询商品库存数量
      // 如果 库存数量 满足要求 执行数据库操作——减少库存数量——模拟卖出货物操作
   }
}
```