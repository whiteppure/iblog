---
title: "JVM中的方法区"
date: 2021-04-08
draft: false
tags: ["Java", "JVM"]
slug: "jvm-method-area"
---

Java虚拟机定义了若干种程序运行期间会使用到的运行时数据区，其中有一些会随着虚拟机启动而创建，随着虚拟机退出而销毁。
另外一些则是与线程一一对应的，这些与线程对应的数据区域会随着线程开始和结束而创建和销毁。

![运行时数据区](/posts/annex/images/essays/运行时数据区.png)

运行时数据区域包括
- 程序计数寄存器
- 虚拟机栈
- 本地方法栈
- 堆
- 方法区

其中：方法区、堆为线程共享；程序计数寄存器、虚拟机栈、本地方法栈 为线程私有。

## 对于方法区的理解
方法区属于是 JVM 运行时数据区域的一块逻辑区域，是各个线程共享的内存区域。
尽管所有的方法区在逻辑上是属于堆的一部分，但一些简单的实现可能不会选择去进行垃圾收集，所以把方法区看作是一块独立于Java堆的内存空间。

把方法区看作是一块独立于Java堆的内存空间。下图说明了栈、堆、方法区的交互关系
![方法区定位](/posts/annex/images/essays/方法区定位.png)

- 方法区主要存放的是 class，而堆中主要存放的是实例化的对象。
- 方法区与Java堆一样，是各个线程共享的内存区域。
- 方法区在JVM启动的时候被创建，并且它的实际的物理内存空间中和Java堆区一样都可以是不连续的。
- 方法区的大小，跟堆空间一样，可以选择固定大小或者可扩展。
- 方法区的大小决定了系统可以保存多少个类，如果系统定义了太多的类，导致方法区溢出，虚拟机同样会抛出内存溢出错误：`java.lang.OuOfMemoryError：PermGen space` 或者`java.lang.OutOfMemoryError:Metaspace`
- 关闭JVM就会释放这个区域的内存。

方法区和永久代以及元空间是什么关系呢？ 

方法区和永久代以及元空间的关系很像 Java 中接口和类的关系，类实现了接口，这里的类就可以看作是永久代和元空间，接口可以看作是方法区，也就是说永久代以及元空间是 HotSpot 虚拟机对虚拟机规范中方法区的两种实现方式。
并且永久代是 JDK 1.8 之前的方法区实现，JDK 1.8 及以后方法区的实现变成了元空间。

## JDK7与JDK8的方法区
在HotSpot，JDK7及以前，习惯上把方法区，称为永久代。JDK8开始，使用元空间取代了永久代，JDK 1.8后，元空间存放在直接内存中。
<div style="width: 45%;display: inline-block">
    <img src="/posts/annex/images/essays/jvm1.8之前.png" alt="jvm1.8之前">
</div>
<div style="width: 45%;display: inline-block">
    <img src="/posts/annex/images/essays/jvm1.8.png" alt="jvm1.8">
</div>

元空间的本质和永久代类似，都是对JVM规范中方法区的实现。不过元空间与永久代最大的区别在于，元空间不在虚拟机设置的内存中，而是使用本地内存。
永久代、元空间二者并不只是名字变了，内部结构也调整了。根据《Java虚拟机规范》的规定，如果方法区无法满足新的内存分配需求时，将抛出OOM异常。

## 设置方法区大小
方法区的大小不必是固定的，JVM可以根据应用的需要动态调整。

### JDK7及之前
通过参数`-XX:Permsize=size`来设置永久代初始分配空间，默认值是20.75M。
通过参数`-XX:MaxPermsize=size`来设定永久代最大可分配空间。32位机器默认是64M，64位机器模式是82M。
当JVM加载的类信息容量超过了这个值，会报异常`OuOfMemoryError:PermGen space`。

### JDK8及之后
元空间大小可以使用参数 `-XX:MetaspaceSize=size` 和 `-XX:MaxMetaspaceSize=size` 来指定。

它的默认值依赖于平台。对于一个64位的服务器端JVM来说，`-XX:MetaspaceSize`是21M，`-XX:MaxMetaspaceSize`的值是-1，由于直接存放在直接内存中所以没有限制。
与永久代不同，如果不指定大小，默认情况下，虚拟机会耗尽所有的可用系统内存。如果元数据区发生溢出，虚拟机一样会抛出异常`OutOfMemoryError:Metaspace`。
可通过`-XX:MetaspaceSize=size`设置初始的元空间大小。

对于一个64位的服务器端JVM来说，其默认的`-XX:MetaspaceSize`值为21M。
这就是初始的高水位线，一旦触及这个水位线，`FullGC`将会被触发并卸载没用的类即这些类对应的类加载器不再存活然后这个高水位线将会重置。
新的高水位线的值取决于GC后释放了多少元空间。如果释放的空间不足，那么在不超过`MaxMetaspaceSize`时，适当提高该值。如果释放空间过多，则适当降低该值。

如果初始化的高水位线设置过低，上述高水位线调整情况会发生很多次。通过垃圾回收器的日志可以观察到`FullGC`多次调用。
**为了避免频繁地GC，建议将`-XX:MetaspaceSize=size`设置为一个相对较高的值。**

## 方法区的内部结构
方法区用于存储已被虚拟机加载的类型信息、常量、静态变量、即时编译器编译后的代码缓存等。

![方法区内部结构](/posts/annex/images/essays/方法区内部结构.png)

展示方法区内部结构，演示代码
```
public class MainTest {

    private String string = "awsl";

    public static void context() {
        try {
            int a = 0;
            int b = 20/a;
        }catch (Exception e) {
            e.printStackTrace();
        }
    }

    private String context2() {
        return string;
    }

    public static void main(String[] args) {
        new MainTest().context2();
        context();
    }

}
```
编译该类，找到该类的class文件，打开终端执行`javap -v MainTest.class > test.txt`命令，在当前目录会生成`test.txt`文件。
打开即可查看反编译后的字节码信息。

### 类型信息
对每个加载的类型（类class、接口interface、枚举enum、注解annotation），JVM必须在方法区中存储以下类型信息：
- 这个类型的完整有效名称（包名.类名）；
- 这个类型直接父类的完整有效名（对于interface或是java.lang.object，都没有父类）；
- 这个类型的修饰符（public，abstract，final的某个子集）；
- 这个类型直接接口的一个有序列表；

```
// ...
public class content.posts.jvm.MainTest
  minor version: 0
  major version: 52
  flags: ACC_PUBLIC, ACC_SUPER
//...
```

### 域信息
JVM必须在方法区中，保存类型的所有域的相关信息以及域的声明顺序。
域的相关信息包括：域名称、域类型、域修饰符（public，private，protected，static，final，volatile，transient的某个子集）。
```
// ...
Constant pool:
   #1 = Methodref          #10.#35        // java/lang/Object."<init>":()V
   #2 = String             #36            // awsl
   #3 = Fieldref           #6.#37         // content/posts/jvm/MainTest.string:Ljava/lang/String;

// ...
```

### 方法信息
JVM必须保存所有方法的以下信息，同域信息一样包括声明顺序：
- 方法名称；
- 方法的返回类型（或void）；
- 方法参数的数量和类型（按顺序）；
- 方法的修饰符（`public，private，protected，static，final，synchronized，native，abstract`的一个子集）；
- 方法的字节码（`bytecodes`）、操作数栈、局部变量表及大小（`abstract和native`方法除外）；
- 异常表（`abstract和native`方法除外）；

每个异常处理的开始位置、结束位置、代码处理在程序计数器中的偏移地址、被捕获的异常类的常量池索引。
```
 public static void context();
    descriptor: ()V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=2, args_size=0
         0: iconst_0
         1: istore_0
         2: bipush        20
         4: iload_0
         5: idiv
         6: istore_1
         7: goto          15
        10: astore_0
        11: aload_0
        12: invokevirtual #5                  // Method java/lang/Exception.printStackTrace:()V
        15: return
       // 异常表
      Exception table:
         from    to  target type
             0     7    10   Class java/lang/Exception
       // 代码字节码指令行号对照表
      LineNumberTable:
        line 11: 0
        line 12: 2
        line 15: 7
        line 13: 10
        line 14: 11
        line 16: 15
        // 局部变量表
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            2       5     0     a   I
           11       4     0     e   Ljava/lang/Exception;
      StackMapTable: number_of_entries = 2
        frame_type = 74 /* same_locals_1_stack_item */
          stack = [ class java/lang/Exception ]
        frame_type = 4 /* same */
```


### non-final的类变量
静态变量和类关联在一起，随着类的加载而加载，他们成为类数据在逻辑上的一部分。

类变量被类的所有实例共享，即使没有类实例时，也可以访问它：
```
public class MainTest {

    public static void main(String[] args) {
        Test test = null;
        // 相当于 Test.hello();
        test.hello();
        // Test.count;
        System.out.println(test.count);
    }
}

class Test {
    public static int count = 1;
    public static final int number = 2;

    public static void hello() {
        System.out.println("hello!");
    }
}
```
全局常量就是使用`static final`进行修饰，被声明为`final`的类变量的处理方法则不同，每个全局常量在编译的时候就会被分配了。

### 运行时常量池
运行时常量池是每一个类或接口的常量池的运行时表示形式。

它包括了若干种不同的常量：从编译期可知的数值字面量到必须运行期解析后才能获得的方法或字段引用。
运行时常量池扮演了类似传统语言中符号表的角色，不过它存储数据范围比通常意义上的符号表要更为广泛。

每一个运行时常量池都分配在 Java 虚拟机的方法区之中，在类和接口被加载到虚拟机后，对应的运行时常量池就被创建出来。
- 保存在方法区中的叫运行时常量池；
- 在 class/字节码 文件中的叫class常量池（静态常量池）。

简单说来就是JVM在完成类装载操作后，将class文件中的常量池载入到内存中，并保存在方法区中。
我们常说的常量池，就是指方法区中的运行时常量池。

运行时常量池类似于传统编程语言中的符号表，但是它所包含的数据却比符号表要更加丰富一些。
当创建类或接口的运行时常量池时，如果构造运行时常量池所需的内存空间超过了方法区所能提供的最大值，则JVM会抛`OutOfMemoryError`异常。

## 字节码指令解析
演示代码如下
```
public class MethodAreaDemo {
    public static void main(String args[]) {
        int x = 500;
        int y = 100;
        int a = x / y;
        int b = 50;
        System.out.println(a+b);
    }
}
```

反编译后该方法字节码指令
```
// ....
     // 栈的最大深度为3 局部变量表长度为5 参数长度为1
      stack=3, locals=5, args_size=1
         // 将500压入操作数栈
         0: sipush        500
         // 在局部变量表里存放 500
         3: istore_1
         // 将100压入栈
         4: bipush        100
         // 在局部变量表里存放 100 
         6: istore_2
         // 将 500 从局部变量表里边取出，并压入操作数栈
         7: iload_1
         // 将 100 从局部变量表里边取出，并压入操作数栈
         8: iload_2
         // 调用 CPU 执行除法 500/100=5
         9: idiv
        // 存储在局部变量表里
        10: istore_3
        // 将50压入栈中
        11: bipush        50
        // 将 50 存储在局部变量表中
        13: istore        4
        // 获取 #2 地址上类或接口字段的值并将其推入操作数栈
        15: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
        // 将 5 从本地变量表取出放到栈中
        18: iload_3
        // 将50从本地变量表，压入栈
        19: iload         4
        // 调用cpu执行加法 5 + 50=55
        21: iadd
        // 虚方法调用 #3 中的方法 
        // JVM会根据这个方法的描述，创建新的栈桢，方法的参数从操作数栈中弹出来，压入虚拟机栈，然后虚拟机会开始执行虚拟机栈上最上面的栈桢
        22: invokevirtual #3                  // Method java/io/PrintStream.println:(I)V
        // void 类型返回 main方法执行结束
        25: return
// ...
```

## 方法区演进细节
只有`Hotspot`才有永久代（方法区具体实现）。`BEA JRockit、IBMJ9`等来说，是不存在永久代的概念的。

|JDK版本|方法区变化|
| ---- | ---- |
|JDK1.6及以前|有永久代，字符串常量池、静态变量存储在永久代上|
|JDK1.7|有永久代，但已经逐步 “去永久代”，字符串常量池，静态变量移除，保存在堆中|
|JDK1.8|无永久代，类型信息，字段，方法，常量保存在本地内存的元空间，但字符串常量池、静态变量仍然在堆中|

![Jdk1.6方法区变化](/posts/annex/images/essays/Jdk1.6方法区变化.png)

![Jdk1.7方法区变化](/posts/annex/images/essays/Jdk1.7方法区变化.png)

![Jdk1.8方法区变化](/posts/annex/images/essays/Jdk1.8方法区变化.png)

**为什么永久代要被元空间替代？**

根据官方的解释，替代是`JRockit`和`HotSpot`融合后的结果，因为`JRockit`没有永久代，所以`hotspot`用元空间替代了永久代。

由于类的元数据分配在本地内存中，元空间的最大可分配空间就是系统可用内存空间，这项改动是很有必要的，原因有：
- 因为永久代设置空间大小是很难确定的。 在某些场景下，如果动态加载类过多，容易产生方法区的OOM。
比如某个实际Web工程中，因为功能点比较多，在运行过程中，要不断动态加载很多类，经常出现致命错误。而元空间和永久代之间最大的区别在于：元空间并不在虚拟机中，而是使用本地内存。 因此，默认情况下，元空间的大小仅受本地内存限制。
- 对永久代进行调优是很困难的。 因为FullGC的花费时间是MinorGC的10倍，所以我们可以降低GC的频率，尽量不让方法区执行GC来提高效率。 
方法区的垃圾收集主要回收两部分内容：常量池中废弃的常量和不在使用的类型。

**字符串常量池为什么要调整位置？**

JDK7中将`StringTable`放到了堆空间中。因为对永久代的回收效率很低，只有在Full GC的时候才会触发。
Full GC 是老年代的空间不足、永久代不足时才会触发。

这就导致`StringTable`回收效率不高。而我们开发中会有大量的字符串被创建，回收效率低，导致永久代内存不足。
所以JDK7之后将字符串常量池放到堆里，能及时回收内存，避免出现错误。

## 方法区的垃圾回收
有些人认为JVM的方法区（如 Hotspot 虚拟机中的元空间或者永久代）是没有垃圾收集行为的，其实不然。
《Java虚拟机规范》对方法区的约束是非常宽松的，提到过可以不要求虚拟机在方法区中实现垃圾收集。
事实上也确实有未实现或未能完整实现方法区类型卸载的收集器存在（如JDK11时期的ZGC收集器就不支持类卸载）。

一般来说这个区域的回收效果比较难令人满意，尤其是类型的卸载，条件相当苛刻。但是这部分区域的回收有时又确实是必要的。
以前sun公司的Bug列表中，曾出现过的若干个严重的Bug就是由于低版本的HotSpot虚拟机对此区域未完全回收而导致内存泄漏。

方法区的垃圾收集主要回收两部分内容：常量池中废弃的常量和不再使用的类型。

方法区内运行时常量池之中主要存放的两大类常量：**字面量**和**符号引用**。
HotSpot虚拟机对常量池的回收策略是很明确的，只要常量池中的常量没有被任何地方引用，就可以被回收。
判定一个常量是否“废弃”还是相对简单，而要判定一个类型是否属于“不再被使用的类”的条件就比较苛刻了，需要同时满足下面三个条件：
- 该类所有的实例都已经被回收，也就是Java堆中不存在该类及其任何派生子类的实例。加载该类的类加载器已经被回收，这个条件除非是经过精心设计的可替换类加载器的场景，如osGi、JSP的重加载等，否则通常是很难达成的。
- 该类对应的`java.lang.C1ass`对象没有在任何地方被引用，无法在任何地方通过反射访问该类的方法。
- 加载该类的类加载器已经被回收，这个条件除非是经过精心设计可替换类加载器的场景，如JSP、OSGi，否则通常很难达成。

Java虚拟机被允许对满足上述三个条件的无用类进行回收，这里说的仅仅是“被允许”，而并不是和对象一样，没有引用了就必然会回收。
关于是否要对类型进行回收，HotSpot虚拟机提供了`-Xnoclassgc`参数进行控制，还可以使用`-verbose:class` 以及 `-XX：+TraceClass-Loading、-XX：+TraceClassUnLoading`查看类加载和卸载信息。

在大量使用反射、动态代理、CGLib等字节码框架，动态生成JSP以及OSGi这类频繁自定义类加载器的场景中，
通常都需要Java虚拟机具备类型卸载的能力，以保证不会对方法区造成过大的内存压力。

**符号引用是什么？**

符号引用是编译原理中的概念，是相对于直接引用来说的，主要包括了以下三类常量： 
- 类和接口的全限定名；
- 字段的名称和描述符；
- 方法的名称和描述符；

符号引用以一组符号来描述所引用的目标。符号引用可以是任何形式的字面量，只要使用时能无歧义地定位到目标即可，符号引用和虚拟机的布局无关。

在编译的时候每个java类都会被编译成一个class文件，但在编译的时候虚拟机并不知道所引用类的地址，所以就用符号引用来代替，而在这个解析阶段就是为了把这个符号引用转化成为真正的地址的阶段。

**字面量是什么？**

在计算机科学中，字面量（literal）是用于表达源代码中一个固定值的表示法（notation）。
几乎所有计算机编程语言都具有对基本值的字面量表示，诸如：整数、浮点数以及字符串；
而有很多也对布尔类型和字符类型的值也支持字面量表示；还有一些甚至对枚举类型的元素以及像数组、记录和对象等复合类型的值也支持字面量表示法。
