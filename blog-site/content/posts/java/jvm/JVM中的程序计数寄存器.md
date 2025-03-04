---
title: "JVM中的程序计数寄存器"
date: 2021-03-27
draft: false
tags: ["Java", "JVM"]
slug: "jvm-pc-register"
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

JVM中的程序计数寄存器（Program Counter Register）中，Register的命名源于CPU的寄存器，寄存器存储指令相关的现场信息。CPU只有把数据装载到寄存器才能够运行。
这里，并非是广义上所指的物理寄存器，或许将其翻译为PC计数器（或指令计数器）会更加贴切（也称为程序钩子），并且也不容易引起一些不必要的误会。
JVM中的PC寄存器是对物理PC寄存器的一种抽象模拟。

特点：
- 它是程序控制流的指示器，分支、循环、跳转、异常处理、线程恢复等基础功能都需要依赖这个计数器来完成。字节码解释器工作时就是通过改变这个计数器的值来选取下一条需要执行的字节码指令。
- 它是一块很小的内存空间，几乎可以忽略不记。也是运行速度最快的存储区域。
- 它是唯一一个在Java虚拟机规范中没有规定任何`outOfMemoryError`情况的区域。

**程序计数器中既不存在GC又不存在OOM，所以不存在垃圾回收问题。**

PC寄存器用来存储指向下一条指令的地址，也即将要执行的指令代码，由执行引擎读取下一条指令。
由于Java的多线程是通过线程轮流切换完成的，一个线程没有执行完时就需要一个东西记录它执行到哪了，下次抢占到了CPU资源时再从这开始，这个东西就是程序计数器，正是因为这样，所以它也是“线程私有”的内存。

代码演示
```
public class MainTest {
    public static void main(String[] args) {
        int i = 10;
        int j = 20;
        int k = i + j;

        String str = "abc";
        System.out.println(str);
        System.out.println(k);
    }
}

```

通过`javap -verbose MainTest.class`命令反编译`.class`文件，得到如下
```
// ...
 public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=5, args_size=1
         0: bipush        10
         2: istore_1
         3: bipush        20
         5: istore_2
         6: iload_1
         7: iload_2
         8: iadd
         9: istore_3
        10: ldc           #2                  // String abc
        12: astore        4
        14: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
        17: aload         4
        19: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        22: getstatic     #3                  // Field java/lang/System.out:Ljava/io/PrintStream;
        25: iload_3
        26: invokevirtual #5                  // Method java/io/PrintStream.println:(I)V
        29: return
// ...

```
通过PC寄存器，我们就可以知道当前程序执行到哪一步了。

![PC寄存器保存指令示意](/posts/annex/images/essays/PC寄存器保存指令示意.png)

**使用PC寄存器存储字节码指令地址有什么用呢？**

因为CPU需要不停的切换各个线程，这时候切换回来以后，就得知道接着从哪开始继续执行。
JVM的字节码解释器就需要通过改变PC寄存器的值来明确下一条应该执行什么样的字节码指令。

**PC寄存器为什么被设定为私有的？**

我们都知道所谓的多线程在一个特定的时间段内只会执行其中某一个线程的方法，CPU会不停地做任务切换，这样必然导致经常中断或恢复，如何保证分毫无差呢？为了能够准确地记录各个线程正在执行的当前字节码指令地址，最好的办法自然是为每一个线程都分配一个PC寄存器，
这样一来各个线程之间便可以进行独立计算，从而不会出现相互干扰的情况。

由于CPU时间片轮限制，众多线程在并发执行过程中，任何一个确定的时刻，一个处理器或者多核处理器中的一个内核，只会执行某个线程中的一条指令。
这样必然导致经常中断或恢复，如何保证分毫无差呢？每个线程在创建后，都会产生自己的程序计数器和栈帧，程序计数器在各个线程之间互不影响。
