---
title: "JVM中的堆"
date: 2021-04-03
draft: false
tags: ["Java", "JVM"]
slug: "jvm-heap"
---
Java虚拟机定义了若干种程序运行期间会使用到的运行时数据区，其中有一些会随着虚拟机启动而创建，随着虚拟机退出而销毁。
另外一些则是与线程一一对应的，这些与线程对应的数据区域会随着线程开始和结束而创建和销毁。

![运行时数据区](/posts/annex/images/essays/运行时数据区.png)

运行时数据区域包括：
- 程序计数寄存器
- 虚拟机栈
- 本地方法栈
- 堆
- 方法区

其中：方法区、堆为线程共享；程序计数寄存器、虚拟机栈、本地方法栈 为线程私有。

## 堆的核心概念
堆针对一个JVM进程来说是唯一的，也就是一个进程只有一个JVM，但是进程包含多个线程，他们是共享同一堆空间的。
一个JVM实例只存在一个堆内存，堆也是Java内存管理的核心区域。Java堆区在JVM启动的时候即被创建，其空间大小也就确定了，是JVM管理的最大一块内存空间。

《Java虚拟机规范》规定，堆可以处于物理上不连续的内存空间中，但在逻辑上它应该被视为连续的。
所有的线程共享Java堆，在这里还可以划分线程私有的缓冲区（Thread Local Allocation Buffer，TLAB）。

《Java虚拟机规范》中对Java堆的描述是：
>The heap is the run-time data area from which memory for all class instances and arrays is allocated

即所有的对象实例以及数组都应当在运行时分配在堆上。

“几乎”所有的对象实例都在这里分配内存。因为还有一些对象是在栈上分配的。
数组和对象可能永远不会存储在栈上，因为栈帧中保存引用，这个引用指向对象或者数组在堆中的位置。

在方法执行结束后，堆中的对象不会马上被移除，仅仅在垃圾收集的时候才会被移除。
也就是触发了GC的时候，才会进行回收，如果堆中对象马上被回收，那么用户线程就会收到影响，一个方法频繁的调用频繁的回收程序性能会收到影响。
所以堆是GC执行垃圾回收的重点区域。

![堆内存分配](/posts/annex/images/essays/堆内存分配.png)

## 堆内存细分
![堆内存划分](/posts/annex/images/essays/堆内存划分.png)

Java 7及之前，堆内存逻辑上分为三部分：新生区+养老区+永久区
- `Young Generation Space` 新生区，新生区被划分为又被划分为`Eden`区和`Survivor`区；
- `Tenure generation space` 养老区；
- `Permanent Space`永久区；

Java 8及之后，堆内存逻辑上分为三部分：新生区+养老区+元空间
- `Young Generation Space`新生区，新生区被划分为又被划分为`Eden`区和`Survivor`区；
- `Tenure generation space` 养老区；
- `Meta Space` 元空间；

堆空间内部结构，JDK1.8之后永久代替换成了元空间。

![堆内存结构](/posts/annex/images/essays/堆内存结构.png)

## 设置堆内存大小
堆内存的大小是可以调节的，Java堆区用于存储Java对象实例，那么堆的大小在JVM启动时就已经设定好了，可以通过选项`-Xmx`和`-Xms`来进行设置。
- `-Xms`用于表示堆区的起始内存，等价于 -XX:InitialHeapSize；
- `-Xmx`则用于表示堆区的最大内存，等价于 -XX:MaxHeapSize；

![设置堆大小](/posts/annex/images/essays/设置堆大小.png)

默认情况下，初始堆内存大小为，物理电脑内存大小/64；最大堆内存大小为，物理电脑内存大小/4。
在生产环境和开发环境，通常会将`-Xms`和`-Xmx`两个参数配置相同的值，其目的是为了能够在 Java 垃圾回收机制清理完堆区后不需要重新分隔计算堆区的大小，从而提高性能。

代码演示查看默认堆内存大小
```
public class MainTest {
    public static void main(String[] args) {
        // 返回Java虚拟机中的堆内存总量
        long initialMemory = Runtime.getRuntime().totalMemory() / 1024 / 1024;
        // 返回Java虚拟机试图使用的最大堆内存
        long maxMemory = Runtime.getRuntime().maxMemory() / 1024 / 1024;
        System.out.println("-Xms:" + initialMemory + "M");
        System.out.println("-Xmx:" + maxMemory + "M");
    }
}
```

## 查看堆内存大小
可通过程序启动加入`-XX:+PrintGCDetails`参数来查看堆内存大小。

![-XXPrintGCDetails](/posts/annex/images/essays/-XXPrintGCDetails.png)

![PrintGCDetails查看堆内存](/posts/annex/images/essays/PrintGCDetails查看堆内存.png)

在程序运行过程中可以通过`jstat`命令来查看堆内存大小。

![jstat](/posts/annex/images/essays/jstat.png)


## 年轻代与老年代
存储在JVM中的Java对象，按照生命周期可以被划分为两类：
一类是生命周期较短的瞬时对象，这类对象的创建和消亡都非常迅速，生命周期短的，及时回收；
另外一类对象的生命周期却非常长，在某些极端的情况下还能够与JVM的生命周期保持一致。

Java堆区进一步细分的话，可以划分为年轻代和老年代。其中年轻代又可以划分为Eden区、`Survivor0` 区和 `Survivor1` 区（有时也叫做from区、to区）。
没有明确规定，to 区是 `Survivor1`，这两个区域是不断进行交换的，是从一个区到另外一个区。

![年轻代与老年代](/posts/annex/images/essays/年轻代与老年代.png)

年轻代是对象的诞生、成长、消亡的区域，一个对象在这里产生、应用，最后被垃圾回收器收集、结束生命。

老年代放置长生命周期的对象，通常都是从`Survivor`区域筛选拷贝过来的Java对象。
当然，也有特殊情况，我们知道普通的对象会被分配在TLAB上。如果对象较大，JVM会试图直接分配在`Eden`其他位置上；
如果对象太大，完全无法在新生代找到足够长的连续空闲空间，JVM就会直接分配到老年代。

### -XX:NewRatio
该参数是配置新生代与老年代在堆结构的占比，默认情况下，新生代：老年代为1 : 2。
- 默认`-XX:NewRatio=2`。表示新生代占1，老年代占2，新生代占整个堆的1/3；
- 可以修改`-XX:NewRatio=4`。表示新生代占1，老年代占4，新生代占整个堆的1/5；

![NewRatio](/posts/annex/images/essays/NewRatio.png)

当发现在整个项目中，生命周期长的对象偏多，那么就可以通过调整年轻代与老年代的比例，来进行调优。

### -XX:SurvivorRatio
该命令是调整`Eden`区与`Survivor`区比例，这个参数一般使用默认值就可以了。

在HotSpot中，`Eden`空间和另外两个`Survivor`空间缺省所占的比例是8：1：1，当然开发人员可以通过选项`-XX:SurvivorRatio`调整这个空间比例，比如：`-XX:SurvivorRatio=8`。

![SurvivorRatio](/posts/annex/images/essays/SurvivorRatio.png)

在实际开发中使用hotspot虚拟机，默认情况下不是8：1：1，是因为虚拟机有一个自适应内存分配策略，可以通过`-XX:-UseAdaptiveSizePolicy`关闭再来进行查看。

几乎所有的Java对象都是在Eden区被new出来的，绝大部分的Java对象的销毁都在新生代进行了，有些大的对象在Eden区无法存储时候，将直接进入老年代。
IBM公司的专门研究表明，新生代中80%的对象都是“朝生夕死”的。

![eden与Survivor与tenured](/posts/annex/images/essays/eden与Survivor与tenured.png)

可以使用选项`-Xmn`设置新生代最大内存大小，当`-Xmn`参数与`-XX:NewRatio`设置的值发生冲突时，会以`-Xmn`设置的具体值为准。

## 为对象分配内存
为新对象分配内存是一件非常严谨和复杂的任务，JVM的设计者们需要考虑内存如何分配、在哪里分配等问题，并且由于内存分配算法与内存回收算法密切相关，所以还需要考虑GC执行完内存回收后是否会在内存空间中产生内存碎片。

![对象内存分配策略](/posts/annex/images/essays/对象内存分配策略.png)

对象分配内存步骤：
1. 新的对象先放伊甸园区，此区有大小限制，如果对象过大可能直接分配在老年代（元空间）。
2. 当伊甸园的空间填满时，程序又需要创建对象，JVM的垃圾回收器将对伊甸园区进行MinorGC，将伊甸园区中的不再被其他对象所引用的对象进行销毁，再将新的对象放到伊甸园区，然后将伊甸园中的剩余对象移动到幸存者0区。
3. 如果再次触发MinorGC，会首先将没有被回收的对象放到幸存者1区，然后判断幸存者0区中的对象是否能被回收，如果没有回收，就会放到幸存者1区。
4. 重复步骤3、4，默认情况下如果一个对象被扫描了15次（阈值），都不能被回收，则将该对象晋升到老年代。
5. 当老年代内存不足时，触发Major GC，进行老年代的内存清理。
6. 若老年代执行了Major GC之后，发现依然无法进行对象的保存，就会产生OOM错误。

可以用 `-XX:MaxTenuringThreshold=N` 进行设置幸存者区到老年代的GC扫描次数，默认15次，不过设置的值应该在 0-15，否则会爆出以下错误。
```
MaxTenuringThreshold of 20 is invalid; must be between 0 and 15
```

**为什么年龄只能是 0-15?**

因为记录年龄的区域在对象头中，这个区域的大小通常是 4 位。这 4 位可以表示的最大二进制数字是 1111，即十进制的 15。因此，对象的年龄被限制为 0 到 15。

**如果幸存者区满了？**

如果Survivor区满了后，将会触发一些特殊的规则，也就是可能直接晋升老年代。
**需要特别注意，在Eden区满了的时候，才会触发MinorGC，而幸存者区满了后，不会触发MinorGC操作。**

代码演示对象分配过程
```
// -Xms600m -Xmx600m
public class HeapInstanceTest {
    byte [] buffer = new byte[new Random().nextInt(1024 * 200)];
    public static void main(String[] args) throws InterruptedException {
        ArrayList<HeapInstanceTest> list = new ArrayList<>();
        while (true) {
            list.add(new HeapInstanceTest());
            Thread.sleep(10);
        }
    }
}
```
打开`VisualVM`图形化界面，通过`VisualGC`进行动态化查看

![代码演示对象分配过程](/posts/annex/images/essays/代码演示对象分配过程.gif)


## GC简单介绍
大致分为三种：
- Minor GC：新生代的GC；
- Major GC：老年代的GC；
- Full GC：整堆收集，收集整个Java堆和方法区的垃圾；

JVM调优的一个环节，也就是垃圾收集，我们需要尽量的避免垃圾回收，因为在垃圾回收的过程中，容易出现 STW 的问题。
Major GC 和 Full GC出现 STW 的时间，是Minor GC的10倍以上。

JVM在进行GC时，并非每次都对上面三个内存区域一起回收的，大部分时候回收的都是指新生代。
针对Hotspot VM的实现，它里面的GC按照回收区域又分为两大种类型：一种是部分收集（Partial GC），一种是整堆收集（FullGC）。
- 部分收集：不是完整收集整个Java堆的垃圾收集。其中又分为：
  - 新生代收集（MinorGC/YoungGC）：只是新生代的垃圾收集
  - 老年代收集（MajorGC/OldGC）：只是老年代的圾收集。目前，只有CMSGC会有单独收集老年代的行为。注意，很多时候Major GC会和FullGC混淆使用，需要具体分辨是老年代回收还是整堆回收。
  - 混合收集（MixedGC）：收集整个新生代以及部分老年代的垃圾收集，目前，只有G1 GC会有这种行为。
- 整堆收集（FullGC）：收集整个Java堆和方法区的垃圾收集。

### Minor GC
当GC只发生在年轻代中，回收年轻代对象的行为被称为MinorGC。当年轻代空间不足时，就会触发MinorGC，这里的年轻代满指的是Eden代满，Survivor满了不会引发Minor GC。
每次Minor GC会清理年轻代的垃圾，因为Java对象大多都具备朝生夕灭的特性，所以Minor GC非常频繁，一般回收速度也比较快。
Minor GC会引发STW，暂停其它用户的线程，等垃圾回收结束，用户线程才恢复运行。

### Major GC
当GC发生在老年代时则被称为MajorGC或者FullGC。一般的，MinorGC的发生频率要比MajorGC高很多，即老年代中垃圾回收发生的频率将大大低于年轻代。
出现了MajorGC，经常会伴随至少一次的Minor GC，但非绝对的，在Parallel Scavenge收集器的收集策略里，就有直接进行MajorGC的策略选择过程。

也就是在老年代空间不足时，会先尝试触发MinorGC。
如果之后空间还不足，则触发Major GC，Major GC的速度一般会比MinorGC慢10倍以上，STW的时间更长，如果Major GC后，内存还不足就报OOM了。

### Full GC
触发Full GC的情况有如下几种：
1. 调用`System.gc`时，系统建议执行Full GC，但是不必然执行；
2. 老年代空间不足；
    - 通过Minor GC后进入老年代的平均大小，大于老年代的可用内存.也就是老年代空间不足。
    - 由Eden区、Survivor space（From Space）区向Survivor space（To Space）区复制时，对象大小大于To Space可用内存，则把该对象转存到老年代，且老年代的可用内存小于该对象大小. 也就是老年代空间不足。
3. 方法区空间不足；

### GC举例
测试GC代码
```
public class MainTest {
    public static void main(String[] args) {
        int i = 0;
        try {
            List<String> list = new ArrayList<>();
            String a = "awsl";
            while(true) {
                list.add(a);
                a = a + a;
                i++;
            }
        }catch (Exception e) {
            e.getStackTrace();
        }
    }
}
```

加入如下虚拟机参数
```
-Xms10m -Xmx10m -XX:+PrintGCDetails
```

GC 日志
```
[GC (Allocation Failure) [PSYoungGen: 1933K->496K(2560K)] 1933K->736K(9728K), 0.0009799 secs] [Times: user=0.01 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 2476K->480K(2560K)] 2716K->1464K(9728K), 0.0014628 secs] [Times: user=0.00 sys=0.00, real=0.01 secs] 
[Full GC (Ergonomics) [PSYoungGen: 2156K->0K(2560K)] [ParOldGen: 7128K->4559K(7168K)] 9284K->4559K(9728K), [Metaspace: 3029K->3029K(1056768K)], 0.0033635 secs] [Times: user=0.01 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 56K->128K(2560K)] 6663K->6735K(9728K), 0.0009897 secs] [Times: user=0.01 sys=0.00, real=0.01 secs] 
[Full GC (Ergonomics) [PSYoungGen: 128K->0K(2560K)] [ParOldGen: 6607K->6509K(7168K)] 6735K->6509K(9728K), [Metaspace: 3047K->3047K(1056768K)], 0.0040646 secs] [Times: user=0.01 sys=0.00, real=0.00 secs] 
[GC (Allocation Failure) [PSYoungGen: 0K->0K(2560K)] 6509K->6509K(9728K), 0.0006842 secs] [Times: user=0.01 sys=0.00, real=0.00 secs] 
[Full GC (Allocation Failure) [PSYoungGen: 0K->0K(2560K)] [ParOldGen: 6509K->6491K(7168K)] 6509K->6491K(9728K), [Metaspace: 3047K->3047K(1056768K)], 0.0039890 secs] [Times: user=0.01 sys=0.00, real=0.00 secs] 
Heap
 PSYoungGen      total 2560K, used 111K [0x00000007bfd00000, 0x00000007c0000000, 0x00000007c0000000)
  eden space 2048K, 5% used [0x00000007bfd00000,0x00000007bfd1bf38,0x00000007bff00000)
  from space 512K, 0% used [0x00000007bff80000,0x00000007bff80000,0x00000007c0000000)
  to   space 512K, 0% used [0x00000007bff00000,0x00000007bff00000,0x00000007bff80000)
 ParOldGen       total 7168K, used 6491K [0x00000007bf600000, 0x00000007bfd00000, 0x00000007bfd00000)
  object space 7168K, 90% used [0x00000007bf600000,0x00000007bfc56f18,0x00000007bfd00000)
 Metaspace       used 3093K, capacity 4496K, committed 4864K, reserved 1056768K
  class space    used 338K, capacity 388K, committed 512K, reserved 1048576K
Exception in thread "main" java.lang.OutOfMemoryError: Java heap space
```

## 堆空间分代思想
为什么要把Java堆分代？不分代就不能正常工作了吗？经研究，不同对象的生命周期不同，70%-99% 的对象是临时对象。

不分代完全可以，分代的唯一理由就是优化GC性能。
如果没有分代，那所有的对象都在一块，GC的时候要找到哪些对象没用，这样就会对堆的所有区域进行扫描，比较耗费性能。
而很多对象都是朝生夕死的，如果分代的话，把新创建的对象放到某一地方，当GC的时候先把这块存储“朝生夕死”对象的区域进行回收，这样就会腾出很大的空间出来。

## 内存分配策略
如果对象在Eden出生并经过第一次Minor GC后仍然存活，并且能被Survivor容纳的话，将被移动到Survivor空间中，并将对象年龄设为1。
对象在Survivor区中每熬过一次MinorGC，年龄就增加1岁，当它的年龄增加到一定程度（默认为15岁，其实每个JVM、每个GC都有所不同）时，就会被晋升到老年代。

针对不同年龄段的对象分配原则:
- 优先分配到Eden。但是开发中比较长的字符串或者数组，会直接存在老年代。因为新创建的对象都是朝生夕死的，所以这个大对象可能也很快被回收，由于老年代触发Major GC的次数比 Minor GC要更少，因此可能回收起来就会比较慢。
- 大对象直接分配到老年代，尽量避免程序中出现过多的大对象。
- 长期存活的对象分配到老年代。
- 动态对象年龄判断。如果Survivor区中相同年龄的所有对象大小的总和大于Survivor空间的一半，年龄大于或等于该年龄的对象可以直接进入老年代，无须等到 `MaxTenuringThreshold` 中要求的年龄。
- 空间分配担保。就是经过Minor GC后，所有的对象都存活，因为Survivor比较小，所以就需要将Survivor无法容纳的对象，存放到老年代中。通过`-XX:HandlePromotionFailure`参数来调节。

## TLAB
堆空间都是共享的么？ 不是，因为还有 TLAB 这个概念，在堆中划分出一块区域，为每个线程所独占，以此来保证线程安全。

TLAB全称：Thread Local Allocation Buffer 译为，线程本地分配缓冲区。

因为堆区是线程共享区域，任何线程都可以访问到堆区中的共享数据，由于对象实例的创建在JVM中非常频繁，因此在并发环境下从堆区中划分内存空间是线程不安全的。
为避免多个线程操作同一地址，需要使用加锁等机制，进而影响分配速度，使用锁又会影响性能，TLAB应运而生。
多线程同时分配内存时，使用TLAB可以避免一系列的非线程安全问题，同时还能够提升内存分配的吞吐量，因此我们可以将这种内存分配方式称之为快速分配策略。

![TLAB](/posts/annex/images/essays/TLAB.png)

从内存模型而不是垃圾收集的角度，对Eden区域继续进行划分，JVM为每个线程分配了一个私有缓存区域，它包含在Eden空间内。
默认情况下，TLAB空间的内存非常小，仅占有整个Eden空间的1%，当然我们可以通过选项`-XX:TLABWasteTargetPercent`设置TLAB空间所占用Eden空间的百分比大小。

对象首先是通过TLAB开辟空间，如果不能放入，那么需要通过Eden来进行分配。尽管不是所有的对象实例都能够在TLAB中成功分配内存，但JVM确实是将TLAB作为内存分配的首选。
可以通过选项`-XX:UseTLAB`设置是否开启TLAB空间，默认是开启的。一旦对象在TLAB空间分配内存失败时，JVM就会尝试着通过使用加锁机制确保数据操作的原子性，从而直接在Eden空间中分配内存。

![TLAB分配过程.png](/posts/annex/images/essays/TLAB分配过程.png)

## JVM堆空间参数设置
官网：https://docs.oracle.com/javase/8/docs/technotes/tools/unix/java.html

由于堆中的参数比较多，这里总结了一些常用的参数：
- `-XX：+PrintFlagsInitial`：查看所有的参数的默认初始值
- `-XX：+PrintFlagsFinal`：查看所有的参数的最终值（可能会存在修改，不再是初始值）
- `-Xms`：初始堆空间内存（默认为物理内存的1/64）
- `-Xmx`：最大堆空间内存（默认为物理内存的1/4）
- `-Xmn`：设置新生代的大小。（初始值及最大值）
- `-XX:NewRatio`：配置新生代与老年代在堆结构的占比(默认是2)
- `-XX:SurvivorRatio`：设置新生代中Eden和S0/S1空间的比例(默认是8)
- `-XX:MaxTenuringThreshold`：设置新生代垃圾的最大年龄（(默认是15）
- `-XX:+PrintGCDetails`：输出详细的GC处理日志
- `-XX:+PrintGC - verbose:gc` 打印gc简要信息
- `-XX:HandlePromotionFailure`：是否设置空间分配担保（默认true）

## 逃逸分析
随着JIT编译期的发展与逃逸分析技术逐渐成熟，栈上分配、标量替换优化技术将会导致一些微妙的变化，所有的对象都分配到堆上也渐渐变得不那么“绝对”了。

在Java虚拟机中，对象是在Java堆中分配内存的，这是一个普遍的常识。
但是有一种特殊情况，那就是如果经过逃逸分析后发现，一个对象并没有逃逸出方法的话，那么就可能被优化成栈上分配。
这样就无需在堆上分配内存，也无须进行垃圾回收了。这也是最常见的堆外存储技术。

还有基于openJDK深度定制的TaoBaoVM，其中创新的GCIH（GC invisible heap）技术实现off-heap：将生命周期较长的Java对象从heap中移至heap外，并且GC不能管理GCIH内部的Java对象，以此达到降低GC的回收频率和提升GC的回收效率的目的。

逃逸分析是一种可以有效减少，Java程序中同步负载和内存堆分配压力的跨函数全局数据流分析算法。
通过逃逸分析，Java Hotspot编译器能够分析出一个新对象的引用使用范围，从而决定是否要将这个对象分配到堆上。

判定是否发生逃逸分析：
- 当一个对象在方法中被定义后，对象只在方法内部使用，则认为没有发生逃逸。
- 当一个对象在方法中被定义后，它被外部方法所引用，则认为发生逃逸，例如作为调用参数传递到其他地方。

### 逃逸分析举例
逃逸分析代码演示
```
public static StringBuffer createStringBuffer(String s1, String s2) {
    StringBuffer sb = new StringBuffer();
    sb.append(s1);
    sb.append(s2);
    return sb;
}
```

如果想要StringBuffer sb对象不发生逃逸方法，则发生逃逸分析，可以这样写
```
public static String createStringBuffer(String s1, String s2) {
    StringBuffer sb = new StringBuffer();
    sb.append(s1);
    sb.append(s2);
    return sb.toString();
}
```
如何快速的判断是否发生了逃逸分析，看new的对象实体是否在方法外被调用。

### 参数设置
在JDK 1.7 版本之后，HotSpot中默认就已经开启了逃逸分析，如果使用的是较早的版本，则可以通过：
- 选项`-XX：+DoEscapeAnalysis`显式开启逃逸分析；
- 通过选项`-XX：+PrintEscapeAnalysis`查看逃逸分析的筛选结果；

### 栈上分配
将堆分配转化为栈分配。如果一个对象在子程序中被分配，要使指向该对象的指针永远不会发生逃逸，对象可能是栈上分配的候选，而不是堆上分配。

JIT即时编译器在编译期间根据逃逸分析的结果，发现如果一个对象并没有逃逸出方法的话，就可能被优化成栈上分配。
分配完成后，继续在调用栈内执行，最后线程结束，栈空间被回收，局部变量对象也被回收。这样就无须进行垃圾回收了。

代码演示
```
/**
 * 通过代码来演示，逃逸分析前，逃逸分析后的变化情况
 * 逃逸分析前虚拟机参数： -Xmx1G -Xms1G -XX:-DoEscapeAnalysis -XX:+PrintGCDetails
 * 逃逸分析后虚拟机参数： -Xmx1G -Xms1G -XX:+DoEscapeAnalysis -XX:+PrintGCDetails
 */
public class MainTest {
    public static void main(String[] args) throws InterruptedException {
        long start = System.currentTimeMillis();
        for (int i = 0; i < 100000000; i++) {
            alloc();
        }
        long end = System.currentTimeMillis();
        System.out.println("花费的时间为：" + (end - start) + " ms");

        // 为了方便查看堆内存中对象个数，线程sleep
        Thread.sleep(10000000);
    }

    private static void alloc() {
        // 未发生逃逸
        User user = new User();
    }
}
class User {
    private String name;
    private String age;
    private String gender;
    private String phone;
}
```

逃逸分析之前
```
花费的时间为：881 ms
```
![栈上分配逃逸分析前](/posts/annex/images/essays/栈上分配逃逸分析前.png)

逃逸分析之后
```
花费的时间为：5 ms
```
![栈上分配逃逸分析后](/posts/annex/images/essays/栈上分配逃逸分析后.png)

### 同步省略
如果一个对象只有一个线程可以访问到，那么对于这个对象的操作可以不考虑同步。
线程同步的代价是相当高的，同步的后果是降低并发性和性能。

在动态编译同步块的时候，JIT编译器可以借助逃逸分析来判断同步块所使用的锁对象是否只能够被一个线程访问而没有被发布到其他线程。
如果没有，那么JIT编译器在编译这个同步块的时候就会取消对这部分代码的同步。这样就能大大提高并发性和性能。这个取消同步的过程就叫同步省略，也叫锁消除。

代码演示
```
public void func() {
    Object obj = new Object();
    synchronized(obj) {
        System.out.println(obj);
    }
}
```

当多个线程同时进来，每个线程都会重新`new Object()` 不会发生线程安全问题。还有obj对象的生命周期只在`func()`方法中，并不会被其他线程所访问到。
所以在JIT编译阶段就会被优化掉，提高效率。
```
public void func() {
    Object obj = new Object();
	System.out.println(obj);
}
```

### 分离对象或标量替换
标量是指一个无法再分解成更小的数据的数据，Java中的原始数据类型就是标量。
相对的，那些还可以分解的数据叫做聚合量（Aggregate），Java中的对象就是聚合量，因为他可以分解成其他聚合量和标量。

在JIT阶段，如果经过逃逸分析，发现一个对象不会被外界访问的话，那么经过JIT优化，就会把这个对象拆解成若干个其中包含的若干个成员变量来代替。这个过程就是标量替换。
有的对象可能不需要作为一个连续的内存结构存在也可以被访问到，那么对象的部分（或全部）可以不存储在内存，而是存储在CPU寄存器中。

代码演示
```
public static void main(String args[]) {
    alloc();
}
class Point {
    private int x;
    private int y;
}
private static void alloc() {
    Point point = new Point(1,2);
    System.out.println("point.x" + point.x + ";point.y" + point.y);
}
```

经过标量替换后
```
private static void alloc() {
    int x = 1;
    int y = 2;
    System.out.println("point.x = " + x + "; point.y=" + y);
}
```
这样做的好处是可以大大减少堆内存的占用。因为一旦不需要创建对象了，那么就不再需要分配堆内存了。 标量替换为栈上分配提供了很好的基础。

### 逃逸分析的不足
关于逃逸分析的论文在1999年就已经发表了，但直到JDK1.6才有实现，而且这项技术到如今也并不是十分成熟。

其根本原因是无法保证逃逸分析的性能消耗一定能高于他的消耗。
虽然经过逃逸分析可以做标量替换、栈上分配、和锁消除，但是逃逸分析自身也是需要进行一系列复杂的分析的，这其实也是一个相对耗时的过程。 
一个极端的例子，就是经过逃逸分析之后，发现没有一个对象是不逃逸的，那这个逃逸分析的过程就白白浪费掉了。

虽然这项技术并不十分成熟，但是它也是即时编译器优化技术中一个十分重要的手段。
注意到有一些观点，认为通过逃逸分析，JVM会在栈上分配那些不会逃逸的对象，这在理论上是可行的，但是取决于JVM设计者的选择。
oracle Hotspot JVM中并未这么做，这一点在逃逸分析相关的文档里已经说明：**可以明确所有的对象实例都是创建在堆上。**

目前很多书籍还是基于JDK7以前的版本，JDK已经发生了很大变化，intern字符串的缓存和静态变量曾经都被分配在永久代上，而永久代已经被元数据区取代。
但是，intern字符串缓存和静态变量并不是被转移到元数据区，而是直接在堆上分配，所以这一点同样符合前面一点的结论：**对象实例都是分配在堆上**。
