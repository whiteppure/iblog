---
title: "JVM中的垃圾回收器"
date: 2021-05-06
draft: false
tags: ["Java", "JVM"]
slug: "java-garbage-collector"
---

如果说收集算法是内存回收的方法论，那么垃圾收集器就是内存回收的具体实现。

虽然我们对各个收集器进行比较，但并非要挑选出一个最好的收集器。
因为直到现在为止还没有最好的垃圾收集器出现，更加没有万能的垃圾收集器，我们能做的就是根据具体应用场景选择适合自己的垃圾收集器。

## 垃圾回收器发展史
垃圾收集器是和JVM一脉相承的，它是和JVM进行搭配使用，在不同的使用场景对应的收集器也是有区别。
有了虚拟机，就一定需要收集垃圾的机制，这就是`Garbage Collection`，对应的产品我们称为`Garbage Collector`。

经典GC：
- 1999年随JDK1.3.1一起来的是串行方式的serialGc，它是第一款GC。ParNew垃圾收集器是Serial收集器的多线程版本。
- 2002年2月26日，`Parallel GC` 和 `Concurrent Mark Sweep GC`跟随JDK1.4.2一起发布。
- `Parallel GC` 在JDK6之后成为HotSpot默认GC。
- 2012年，在JDK1.7u4版本中，G1可用。
- 2017年，JDK9中G1变成默认的垃圾收集器，以替代CMS。
- 2018年3月，JDK10中G1垃圾回收器的并行完整垃圾回收，实现并行性来改善最坏情况下的延迟。

高性能GC：
- 2018年9月，JDK11发布。引入 `Epsilon` 垃圾回收器，又被称为 "No-Op(无操作)“ 回收器。同时，引入ZGC：可伸缩的低延迟垃圾回收器（Experimental）
- 2019年3月，JDK12发布。增强G1，自动返回未用堆内存给操作系统。同时，引入 `Shenandoah GC`：低停顿时间的GC（Experimental）。·2019年9月，JDK13发布。增强ZGC，自动返回未用堆内存给操作系统。
- 2020年3月，JDK14发布。删除CMS垃圾回收器。扩展zGC在 MacOS 和 Windows 上的应用

## 垃圾回收器分类
垃圾收集器没有在规范中进行过多的规定，可以由不同的厂商、不同版本的JVM来实现。

由于JDK的版本处于高速迭代过程中，因此Java发展至今已经衍生了众多的GC版本。从不同角度分析垃圾收集器，可以将GC分为不同的类型。

### 按线程数分类
- 串行垃圾回收器：在单核CPU的硬件情况下，该收集器会在工作时冻结所有应用程序线程，这使它在所有目的和用途上都无法在服务器环境中使用。
  ![串行垃圾回收器](/posts/annex/images/essays/串行垃圾回收器.png)
- 并行垃圾回收器：在停止用户线程之后，多条GC线程并行进行垃圾回收。和串行回收相反，并行收集可以运用多个CPU同时执行垃圾回收，因此提升了应用的吞吐量。
  ![并行垃圾回收器](/posts/annex/images/essays/并行垃圾回收器.png)

### 按工作模式分类
- 并发式垃圾回收器：不会出现STW现象，指多条垃圾收集线程同时进行工作，GC线程和用户线程同时运行，不会出现STW现象。
  ![并发垃圾回收器](/posts/annex/images/essays/并发垃圾回收器.png)
- 独占式垃圾回收器：会出现STW现象，一旦运行，就停止应用程序中的所有用户线程，直到垃圾回收过程完全结束。

### 按处理方式分类
- 压缩式垃圾回收器：压缩式垃圾回收器会在回收完成后，对存活对象进行压缩整理，消除回收后的碎片。所以在为对象分配内存的时候用[指针碰撞](https://whiteppure.github.io(/posts/jvm/java-object/#创建对象的过程及步骤)；
- 非压缩式垃圾回收器：非压缩式的垃圾回收器不进行整理这步操作。所以在为为对象分配内存的时候使用[空闲列表](https://whiteppure.github.io(/posts/jvm/java-object/#创建对象的过程及步骤)；

## 查看默认垃圾收集器
JDK 默认垃圾收集器（使用 java -XX:+PrintCommandLineFlags -version 命令查看）：
- JDK 8：Parallel Scavenge（新生代）+ Parallel Old（老年代）
- JDK 9 ~ JDK20: G1

使用虚拟机参数`-XX:+PrintCommandLineFlags`，查看命令行相关参数。

运行下列程序
```
public class MainTest {
    public static void main(String[] args) {
        try {
            Thread.sleep(100000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

输出结果
```
-XX:InitialHeapSize=268435456 -XX:MaxHeapSize=4294967296 -XX:+PrintCommandLineFlags -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseParallelGC 
```

使用命令行指令：`jinfo -flag`

![jinfo命令查看GC](/posts/annex/images/essays/jinfo命令查看GC.png)

## 评估垃圾回收器性能指标
- 吞吐量：运行用户代码的时间占总运行时间的比例（总运行时间 = 程序的运行时间 + 内存回收的时间）。
- 垃圾收集开销：吞吐量的补数，垃圾收集所用时间与总运行时间的比例。
  - 暂停时间：执行垃圾收集时，程序的工作线程被暂停的时间。
- 收集频率：相对于应用程序的执行，收集操作发生的频率。
  - 内存占用：Java堆区所占的内存大小。
- 快速：一个对象从诞生到被回收所经历的时间。

吞吐量、暂停时间、内存占用 这三者共同构成一个“不可能三角”。
这三项里，暂停时间的重要性日益凸显。因为随着硬件发展，内存占用多些越来越能容忍，硬件性能的提升也有助于降低收集器运行时对应用程序的影响，即提高了吞吐量。
而内存的扩大，对延迟反而带来负面效果。

一款优秀的收集器通常最多同时满足其中的两项，简单来说，主要抓住吞吐量、暂停时间这两点。

### 吞吐量
吞吐量就是CPU用于运行用户代码的时间与CPU总消耗时间的比值。`吞吐量=运行用户代码时间 /(运行用户代码时间+垃圾收集时间)`

在注重吞吐量的这种情况下，应用程序能容忍较高的暂停时间，因此，高吞吐量的应用程序有更长的时间基准，快速响应是不必考虑的。
吞吐量优先，意味着在单位时间内，STW的时间最短。

### 暂停时间
暂停时间是指一个时间段内应用程序线程暂停，让GC线程执行的状态，它关系着用户的体验。

例如，GC期间100毫秒的暂停时间意味着在这100毫秒期间内没有应用程序线程是活动的。暂停时间优先，意味着尽可能让单次STW的时间最短。

### 吞吐量对比暂停时间
高吞吐量较好，因为这会让应用程序的最终用户感觉只有应用程序线程在做“生产性”工作，直觉上吞吐量越高程序运行越快。

低暂停时间较好因为从最终用户的角度来看不管是GC还是其他原因导致一个应用被挂起始终是不好的。
这取决于应用程序的类型，有时候甚至短暂的200毫秒暂停都可能打断终端用户体验。因此，具有低的较大暂停时间是非常重要的，特别是对于一个交互式应用程序。

不幸的是”高吞吐量”和”低暂停时间”是相互矛盾的。

因为如果选择以吞吐量优先，那么必然需要降低内存回收的执行频率，但是这样会导致GC需要更长的暂停时间来执行内存回收。
相反的，如果选择以低延迟优先为原则，那么为了降低每次执行内存回收时的暂停时间，也只能频繁地执行内存回收，但这又引起了年轻代内存的缩减和导致程序吞吐量的下降。

所以，在设计或使用GC算法时，我们必须确定我们的目标：一个GC算法只可能针对两个目标之一即只专注于较大吞吐量或最小暂停时间，或尝试找到一个二者的折中。

## 7种经典的垃圾回收器
- 串行回收器：`Serial`、`Serial old`
- 并行回收器：`ParNew`、`Parallel Scavenge`、`Parallel old`
- 并发回收器：`CMS`、`G1`、`ZGC`

### 垃圾回收器与垃圾分代
![收集器与垃圾分代之间的关系](/posts/annex/images/essays/收集器与垃圾分代之间的关系.png)

- 新生代收集器：`Serial`、`ParNew`、`Parallel Scavenge`
- 老年代收集器：`Serial old`、`Parallel old`、`CMS`
- 整堆收集器：`G1`、`ZGC`

### 垃圾收集器的组合关系
![垃圾回收器组合关系](/posts/annex/images/essays/垃圾回收器组合关系.png)

- 两个收集器间有连线，表明它们可以搭配使用
    - `Serial/Serial old`
    - `Serial/CMS`
    - `ParNew/Serial old`、
    - `ParNew/CMS、Parallel`
    - `Scavenge/Serial 0ld`
    - `Parallel Scavenge/Parallel old`
    - `G1`
- `Serial old`和`CMS`之间的连线表示，`Serial old`作为CMS出现"Concurrent Mode Failure"失败的后备预案
- 红色虚线表示，在JDK 8时将`Serial + CMS`、`ParNew + Serial old`这两个组合声明为废弃；并在JDK9中完全取消了这些组合的支持
- 绿色虚线表示，JDK14中：弃用`Parallel Scavenge`和`Serial old` 组合
- 青色虚线表示，在JDK14中删除CMS垃圾回收器

**为什么要有很多垃圾回收器？**

因为垃圾回收器没有最好的实现，想要STW时间段的就需要吞吐量少一点；所以我们选择的只是对具体应用最合适的收集器。
针对不同的场景，提供不同的垃圾收集器，来提高垃圾收集的性能。
### Serial GC
`Serial GC`由于弊端较大，只有放在单核CPU上才能充分发挥其作用，由于现在都是多核CPU已经不用串行收集器了，所以以下内容了解即可。
对于交互较强的应用而言，这种垃圾收集器是不能接受的。一般在Java web应用程序中是不会采用串行垃圾收集器的。

`Serial GC`(串行垃圾回收回器)是最基本、历史最悠久的垃圾收集器了。JDK1.3之前回收新生代唯一的选择。

`Serial GC`作为[HotSpot中client模式](https://whiteppure.github.io(/posts/jvm/jvm-execute-engine/#即使编译器分类)下的默认新生代垃圾收集器；
`Serial GC`年轻代采用标记-复制算法，老年代采用标记-整理算法、串行回收和STW机制的方式执行内存回收。

![serial-GC](/posts/annex/images/essays/serial-GC.png)

`Serial GC`是一个单线程的收集器，但它的“单线程”的意义并不仅仅说明它只会使用一个CPU或一条收集线程去完成垃圾收集工作，更重要的是在它进行垃圾收集时，必须暂停其他所有的工作线程，直到它收集结束。

`Serial GC`的优点， 简单而高效（与其他收集器的单线程比），对于限定单个CPU的环境来说，`Serial GC`由于没有线程交互的开销，专心做垃圾收集自然可以获得最高的单线程收集效率。
是运行在client模式下的虚拟机是个不错的选择。

运行任意程序，设置虚拟机参数如下，当设置使用`Serial GC`时，新生代和老年代都会使用串行收集器。
```
-XX:+PrintCommandLineFlags -XX:+UseSerialGC
```

输出
```
-XX:InitialHeapSize=268435456 -XX:MaxHeapSize=4294967296 -XX:+PrintCommandLineFlags -XX:+UseCompressedClassPointers -XX:+UseCompressedOops -XX:+UseSerialGC 
```

### ParNew GC
ParNew 收集器其实就是 Serial 收集器的多线程版本，除了使用多线程进行垃圾收集外，其余行为：控制参数、收集算法、回收策略等等和 Serial 收集器完全一样。

![parnew-GC](/posts/annex/images/essays/parnew-GC.png)

它是许多运行在 Server 模式下的虚拟机的首要选择，除了 Serial 收集器外，只有它能与 CMS 收集器配合工作。

### Parallel Scavenge GC
Parallel Scavenge 收集器也是使用标记-复制算法的多线程收集器，它看上去几乎和 ParNew 都一样。

![parallel-scavenge-GC](/posts/annex/images/essays/parallel-scavenge-GC.png)

Parallel Scavenge 收集器关注点是吞吐量（高效率的利用 CPU）。CMS 等垃圾收集器的关注点更多的是用户线程的停顿时间（提高用户体验）。

### Serial Old GC
Serial 收集器的老年代版本，它同样是一个单线程收集器。它主要有两大用途：
- 在 JDK1.5 以及以前的版本中与 Parallel Scavenge 收集器搭配使用；
- 作为 CMS 收集器的后备方案；

![serial-GC](/posts/annex/images/essays/serial-GC.png)

### Parallel Old GC
Parallel Scavenge 收集器的老年代版本。使用多线程和“标记-整理”算法。
在注重吞吐量以及 CPU 资源的场合，都可以优先考虑 Parallel Scavenge 收集器和 Parallel Old 收集器。

![parallel-scavenge-GC](/posts/annex/images/essays/parallel-scavenge-GC.png)

### CMS
CMS全称：Concurrent Mark Sweep，是一种以获取最短回收停顿时间为目标的收集器。它非常符合在注重用户体验的应用上使用。
CMS收集器是 HotSpot 虚拟机第一款真正意义上的并发收集器，它第一次实现了让垃圾收集线程与用户线程（基本上）同时工作。

从名字中的Mark Sweep这两个词可以看出，CMS 收集器是一种 “标记-清除”算法实现的，以获取最短回收停顿时间为目标，采用“标记-清除”算法，分 4 大步进行垃圾收集，其中初始标记和重新标记会 STW，JDK 1.5 时引入，JDK9 被标记弃用，JDK14 被移除。

![cms-GC](/posts/annex/images/essays/cms-GC.png)

- 初始标记，指的是寻找所有被 GCRoots 引用的对象，该阶段需要「Stop the World」。这个步骤仅仅只是标记一下 GC Roots 能直接关联到的对象，并不需要做整个引用的扫描，因此速度很快。
- 并发标记，指的是对「初始标记阶段」标记的对象进行整个引用链的扫描，该阶段不需要「Stop the World」。 对整个引用链做扫描需要花费非常多的时间，因此需要通过垃圾回收线程与用户线程并发执行，降低垃圾回收的时间，所以叫做并发标记。
  这也是 CMS 能极大降低 GC 停顿时间的核心原因，但这也带来了一些问题，即：并发标记的时候，引用可能发生变化，因此可能发生漏标（本应该回收的垃圾没有被回收）和多标（本不应该回收的垃圾被回收）了。
- 重新标记，指的是对「并发标记」阶段出现的问题进行校正，该阶段需要「Stop the World」。正如并发标记阶段说到的，由于垃圾回收算法和用户线程并发执行，虽然能降低响应时间，但是会发生漏标和多标的问题。所以对于 CMS 来说，它需要在这个阶段做一些校验，解决并发标记阶段发生的问题。
- 并发清除，指的是将标记为垃圾的对象进行清除，该阶段不需要「Stop the World」。 在这个阶段，垃圾回收线程与用户线程可以并发执行，因此并不影响用户的响应时间。

CMS 的优点是：并发收集、低停顿，但缺点也很明显：
- 对 CPU 资源非常敏感，因此在 CPU 资源紧张的情况下，CMS 的性能会大打折扣。
默认情况下，CMS 启用的垃圾回收线程数是（CPU数量 + 3)/4，当 CPU 数量很大时，启用的垃圾回收线程数占比就越小。但如果 CPU 数量很小，例如只有 2 个 CPU，垃圾回收线程占用就达到了 50%，这极大地降低系统的吞吐量，无法接受。
- CMS 采用的是「标记-清除」算法，会产生大量的内存碎片，导致空间不连续，当出现大对象无法找到连续的内存空间时，就会触发一次 Full GC，这会导致系统的停顿时间变长。
- CMS 无法处理浮动垃圾，当 CMS 在进行垃圾回收的时候，应用程序还在不断地产生垃圾，这些垃圾会在 CMS 垃圾回收结束之后产生，这些垃圾就是浮动垃圾，CMS 无法处理这些浮动垃圾，只能在下一次 GC 时清理掉。

### G1
G1 (Garbage-First) 是一款面向服务器的垃圾收集器，主要针对配备多颗处理器及大容量内存的机器. 以极高概率满足 GC 停顿时间要求的同时，还具备高吞吐量性能特征。
在 JDK 1.7 时引入，在 JDK 9 时取代 CMS 成为了默认的垃圾收集器。G1 有五个属性：分代、增量、并行、标记整理、可预测的停顿。

1. 分代：
   将堆内存分为多个大小相等的区域（Region），每个区域都可以是 Eden 区、Survivor 区或者 Old 区。
   ![g1分区](/posts/annex/images/essays/g1分区.png)<br/>
   可以通过 -XX:G1HeapRegionSize=n 来设置 Region 的大小，可以设定为 1M、2M、4M、8M、16M、32M（不能超过）。<br/>
   G1 有专门分配大对象的 Region 叫 Humongous 区，而不是让大对象直接进入老年代的 Region 中。
   在 G1 中，大对象的判定规则就是一个大对象超过了一个 Region 大小的 50%，比如每个 Region 是 2M，只要一个对象超过了 1M，就会被放入 Humongous 中，而且一个大对象如果太大，可能会横跨多个 Region 来存放。
   G1 会根据各个区域的垃圾回收情况来决定下一次垃圾回收的区域，这样就避免了对整个堆内存进行垃圾回收，从而降低了垃圾回收的时间。
2. 增量：G1 可以以增量方式执行垃圾回收，这意味着它不需要一次性回收整个堆空间，而是可以逐步、增量地清理。有助于控制停顿时间，尤其是在处理大型堆时。
3. 并行：G1 垃圾回收器可以并行回收垃圾，这意味着它可以利用多个 CPU 来加速垃圾回收的速度，这一特性在年轻代的垃圾回收（Minor GC）中比较明显，因为年轻代的回收通常涉及较多的对象和较高的回收速率。
4. 标记整理：在进行老年代的垃圾回收时，G1 使用标记-整理算法。这个过程分为两个阶段：标记存活的对象和整理（压缩）堆空间。通过整理，G1 能够避免内存碎片化，提高内存利用率。
5. 可预测的停顿：G1 也是基于「标记-清除」算法，因此在进行垃圾回收的时候，仍然需要「Stop the World」。不过，G1 在停顿时间上添加了预测机制，用户可以指定期望停顿时间。

G1 中存在三种 GC 模式，分别是 Young GC、Mixed GC 和 Full GC。
![g1垃圾收集过程](/posts/annex/images/essays/g1垃圾收集过程.png)

当 Eden 区的内存空间无法支持新对象的内存分配时，G1 会触发 Young GC。

当需要分配对象到 Humongous 区域或者堆内存的空间占比超过 -XX:G1HeapWastePercent 设置的 InitiatingHeapOccupancyPercent 值时，G1 会触发一次 concurrent marking，它的作用就是计算老年代中有多少空间需要被回收，当发现垃圾的占比达到 -XX:G1HeapWastePercent 中所设置的 G1HeapWastePercent 比例时，在下次 Young GC 后会触发一次 Mixed GC。
Mixed GC 是指回收年轻代的 Region 以及一部分老年代中的 Region。Mixed GC 和 Young GC 一样，采用的也是复制算法。

在 Mixed GC 过程中，如果发现老年代空间还是不足，此时如果 G1HeapWastePercent 设定过低，可能引发 Full GC。-XX:G1HeapWastePercent 默认是 5，意味着只有 5% 的堆是“浪费”的。如果浪费的堆的百分比大于 G1HeapWastePercent，则运行 Full GC。

在以 Region 为最小管理单元以及所采用的 GC 模式的基础上，G1 建立了停顿预测模型，即 Pause Prediction Model 。这也是 G1 非常被人所称道的特性。
可以借助 -XX:MaxGCPauseMillis 来设置期望的停顿时间（默认 200ms），G1 会根据这个值来计算出一个合理的 Young GC 的回收时间，然后根据这个时间来制定 Young GC 的回收计划。

G1收集垃圾的过程：
![g1-GC](/posts/annex/images/essays/g1-GC.png)
1. 初始标记 (Inital Marking) ：标记 GC Roots 能直接关联到的对象，并且修改 TAMS（Top at Mark Start）指针的值，让下一阶段用户线程并发运行时，能够正确的在 Reigin 中分配新对象。
   G1 为每一个 Reigin 都设计了两个名为 TAMS 的指针，新分配的对象必须位于这两个指针位置以上，位于这两个指针位置以上的对象默认被隐式标记为存活的，不会纳入回收范围；
2. 并发标记 (Concurrent Marking) ：从 GC Roots 能直接关联到的对象开始遍历整个对象图。遍历完成后，还需要处理 SATB 记录中变动的对象。
   SATB（snapshot-at-the-beginning，开始阶段快照）能够有效的解决并发标记阶段因为用户线程运行而导致的对象变动，其效率比 CMS 重新标记阶段所使用的增量更新算法效率更高；
3. 最终标记 (Final Marking) ：对用户线程做一个短暂的暂停，用于处理并发阶段结束后仍遗留下来的少量的 STAB 记录。虽然并发标记阶段会处理 SATB 记录，但由于处理时用户线程依然是运行中的，因此依然会有少量的变动，所以需要最终标记来处理；
4. 筛选回收 (Live Data Counting and Evacuation) ：负责更新 Regin 统计数据，按照各个 Regin 的回收价值和成本进行排序，在根据用户期望的停顿时间进行来指定回收计划，可以选择任意多个 Regin 构成回收集。

然后将回收集中 Regin 的存活对象复制到空的 Regin 中，再清理掉整个旧的 Regin 。此时因为涉及到存活对象的移动，所以需要暂停用户线程，并由多个收集线程并行执行。

### ZGC
ZGC（The Z Garbage Collector）是 JDK11 推出的一款低延迟垃圾收集器，适用于大内存低延迟服务的内存管理和回收，SPEC jbb 2015 基准测试，在 128G 的大堆下，最大停顿时间为 1.68 ms，停顿时间远胜于 G1 和 CMS。

ZGC 在 Java11 中引入，处于试验阶段。经过多个版本的迭代，不断的完善和修复问题，ZGC 在 Java15 已经可以正式使用了。
不过，默认的垃圾回收器依然是 G1。你可以通过`java -XX:+UseZGC className`启用 ZGC。

与 G1 和 CMS 类似，ZGC 也采用了复制算法，只不过做了重大优化，ZGC 在标记、转移和重定位阶段几乎都是并发的，这是 ZGC 实现停顿时间小于 10ms 的关键所在。

关键技术在于：
- 指针染色（Colored Pointer）：一种用于标记对象状态的技术。
- 读屏障（Load Barrier）：一种在程序运行时插入到对象访问操作中的特殊检查，用于确保对象访问的正确性。

这两种技术可以让所有线程在并发的条件下，就指针的状态达成一致。因此，ZGC 可以并发的复制对象，这大大的降低了 GC 的停顿时间。
