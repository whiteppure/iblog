---
title: "volatile关键字详解"
date: 2024-07-11
draft: false
tags: ["Java", "关键字","多线程","详解"]
slug: "java-keyword-volatile"
---


## volatile
`volatile`通常被比喻成轻量级的锁，是Java并发编程中比较重要的一个关键字。`volatile`作用：
- 可见性：当一个线程修改了 `volatile` 变量的值，新的值对于其他线程是立即可见的。这避免了其他线程读取到旧的缓存值。
- 有序性：对 `volatile` 变量的读写操作不会被重排序。所有对 `volatile` 变量的写操作在内存中会按照程序的顺序执行，同时在一个线程中的操作不会重排序到 `volatile` 变量的读写操作之后。

注意`volatile`不保证原子性，也就是线程不安全。

### 使用案例
在Java中`volatile`是一个变量修饰符，只能用来修饰变量。`volatile`典型的使用就是单例模式中的双重检查锁实现。
```java
/**
多线程下的单例模式 DCL(double check lock)
**/
class SingletonDemo {

    // volatile 此处作用 禁止指令重排
    public static volatile SingletonDemo singleton = null;

    private SingletonDemo() {
    }

    public static SingletonDemo getInstance() {
        if (singleton == null) {
            synchronized (SingletonDemo.class) {
                if (singleton == null) {
                    singleton = new SingletonDemo();
                }
            }
        }
        return singleton;
    }

}
```
为什么在此处要使用`volatile`修饰`singleton`？
多线程下的DCL单例模式，如果不加`volatile`修饰不是绝对安全的，因为在创建对象的时候JVM底层会进行三个步骤：
1. 分配对象的内存空间；
2. 初始化对象；
3. 设置对象指向刚刚分配的内存地址；

其中步骤2和步骤3是没有数据依赖关系的，而且无论重排前还是重排后的程序执行结果在单线程中并没有改变，因此这种重排优化是允许的。
所以有可能先执行步骤3在执行步骤2，导致分配的对象不为`null`，但对象没有被初始化。所以当一个线程获取对象不为`null`时，由于对象未必已经完成初始化，会存在线程不安全的风险。

### volatile与可见性
各个线程对主内存中共享变量的操作，都是各个线程各自拷贝到自己的工作内存操作后再写回主内存中的。
这就可能存在一个线程AAA修改了共享变量X的值还未写回主内存中时 ，另外一个线程BBB又对内存中的一个共享变量X进行操作，但此时A线程工作内存中的共享比那里X对线程B来说并不不可见。
这种工作内存与主内存同步延迟现象就造成了可见性问题。

这种变量的可见性问题可以用`volatile`来解决。`volatile`的作用简单来说就是当一个线程修改了数据，并且写回主物理内存，其他线程都会得到通知获取最新的数据。
```java
public class MainTest {
    public static void main(String[] args) {
        A a = new A();
        // thread1
        new Thread(() -> {
            System.out.println(Thread.currentThread().getName() + " is come in");
            try {
                // 模拟执行其他业务
                Thread.sleep(3);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            // 用该线程改变A类中 number 变量的值
            a.numberTo100();
        }, "thread1").start();
        
        // 如果number 等于0，则其他线程会一直等待 则证明 volatile 没有保证变量的可见性；相反则保证了变量的可见性
        while (a.number == 0) {
        }
        System.out.println(Thread.currentThread().getName() + " thread is over");
    }
}
class A {
    // 注意: 此时变量要加 volatile 关键字修饰； 可以去掉 volatile 来进行对比测试
    volatile int number = 0;

    public void numberTo100() {
        System.out.println(Thread.currentThread().getName() + " update number");
        this.number = 100;
    }
}
```

为什么`volatile`能确保变量的可见性？
将上面单例模式DCL实现用命令`javap -v SingletonDemo.class >test.txt`命令执行，将反编译后的字节码指令写入到test文件中，可以看到`ACC_VOLATILE`。
```text
public static volatile content.posts.rookie.SingletonDemo singleton;
descriptor: Lcontent/posts/rookie/SingletonDemo;
flags: ACC_PUBLIC, ACC_STATIC, ACC_VOLATILE
```
`volatile`在字节码层面，就是使用访问标志`ACC_VOLATILE`来表示，供后续操作此变量时判断访问标志是否为`ACC_VOLATILE`，来决定是否遵循`volatile`的语义处理。

可以从`openjdk8`中找到对应的源码文件：
```text
openjdk8/hotspot/src/share/vm/interpreter/bytecodeInterpreter.cpp
```
![volitile字节码](/iblog/posts/annex/images/essays/volitile字节码.png)

重点是`cache->is_volatile()`方法，调用栈如下：
```text
bytecodeInterpreter.cpp>is_volatile() 
==> accessFlags.hpp>is_volatile 
==> bytecodeInterpreter.cpprelease_byte_field_put
==> oop.inline.hpp>(oopDesc::byte_field_acquire、oopDesc::release_byte_field_put)
==> orderAccess.hpp
>> orderAccess_linux_x86.inline.hpp.OrderAccess::release_store
```
最终调用了`OrderAccess::release_store`。
```text
inline void     OrderAccess::release_store(volatile jbyte*   p, jbyte   v) { *p = v; }
inline void     OrderAccess::release_store(volatile jshort*  p, jshort  v) { *p = v; }
```
可以从上面看到C++的实现层面，又使用C++中的`volatile`关键字，用来修饰变量，通常用于建立语言级别的内存屏障`memory barrier`。
在《C++ Programming Language》一书中对`volatile`修饰词的解释：
>A volatile specifier is a hint to a compiler that an object may change its value in ways not specified by the language so that aggressive optimizations must be avoided.

- `volatile`修饰的类型变量表示可以被某些编译器未知的因素更改。
- 使用 `volatile` 变量时，避免激进的优化。系统总是重新从内存读取数据，即使它前面的指令刚从内存中读取被缓存，防止出现未知更改和主内存中不一致。

其在64位系统的实现`orderAccess_linux_x86.inline.hpp.OrderAccess::release_store`。
```text
inline void OrderAccess::fence() {
  if (os::is_MP()) {
    // always use locked addl since mfence is sometimes expensive
#ifdef AMD64
    __asm__ volatile ("lock; addl $0,0(%%rsp)" : : : "cc", "memory");
#else
    __asm__ volatile ("lock; addl $0,0(%%esp)" : : : "cc", "memory");
#endif
  }
}
```
其中代码`lock; addl $0,0(%%rsp)`就是常说的**lock前缀**。
>lock前缀，会保证某个处理器对共享内存的独占使用。它将本处理器缓存写入内存，该写入操作会引起其他处理器或内核对应的缓存失效。通过独占内存、使其他处理器缓存失效，达到了“指令重排序无法越过内存屏障”的作用。

对于 `volatile`修饰的变量，当对 `volatile` 修饰的变量进行写操作的时候，JVM会向处理器发送一条带有`lock`前缀的指令，将这个缓存中的变量回写到系统主存中。
但是就算写回到内存，如果其他处理器缓存的值还是旧的，再执行计算操作就会有问题，所以在多处理器下，为了保证各个处理器的缓存是一致的，就会实现**缓存一致性协议**。
>缓存一致性协议: 每个处理器通过嗅探在总线上传播的数据来检查自己缓存的值是不是过期了，当处理器发现自己缓存行对应的内存地址被修改，就会将当前处理器的缓存行设置成无效状态，当处理器要对这个数据进行修改操作的时候，会强制重新从系统内存里把数据读到处理器缓存里。

为了提高CPU处理器的执行速度，在处理器和内存之间增加了多级缓存来提升。但是由于引入了多级缓存，就存在缓存数据不一致问题。

![CPU多级缓存](/iblog/posts/annex/images/essays/CPU多级缓存.jpg)

所以如果一个变量被`volatile`所修饰的话，在每次数据变化之后，其值都会被强制刷入主存。
而其他处理器的缓存由于遵守了缓存一致性协议，也会把这个变量的值从主存加载到自己的缓存中。这就保证了一个`volatile`在并发编程中，其值在多个缓存中是可见的。

### volatile与有序性
有序性指的就是代码按照顺序执行，是对比指令重排来说的。计算机在执行程序时，为了提高性能，编译器和处理器常常会做指令重排。
在上面的使用案例中的代码，单例模式DCL就是一个使用禁止指令重排的案例。

`volatile`禁止指令重排的原因是什么？`volatile` 关键字通过在读写操作前后插入内存屏障来禁止指令重排序，从而确保了内存可见性和操作的有序性。

1. 写入`volatile`变量时：
- 在写操作之前插入一个 `StoreStore` 屏障，确保在写入 `volatile` 变量之前的所有普通写操作都已经完成。
- 在写操作之后插入一个 `StoreLoad` 屏障，确保在写入 `volatile` 变量之后的所有普通读操作都能读取到最新的值。
2. 读取`volatile`变量时：
- 在读操作之前插入一个 `LoadLoad` 屏障，确保在读取 `volatile` 变量之前的所有普通读操作都已经完成。
- 在读操作之后插入一个 `LoadStore` 屏障，确保在读取 `volatile` 变量之后的所有普通写操作都能读取到最新的值。

```java
class Example {
    private volatile boolean flag = false;
    private int value = 0;

    public void writer() {
        value = 42;    // 1. 普通写操作
        flag = true;   // 2. volatile 写操作
    }

    public void reader() {
        if (flag) {    // 3. volatile 读操作
            int result = value; // 4. 普通读操作
        }
    }
}
```

### volatile与原子性
`volatile`不保证原子性，也就是线程不安全。
```java
public class MainTest {

    public static void main(String[] args) {
        A a = new A();
        /**
         * 创建20个线程 每个线程让 number++ 1000次；
         * number 变量用 volatile 修饰
         * 如果 volatile 保证变量的原子性，则最后结果为 20 * 1000，反之则不保证。
         * 当然不排除偶然事件，建议反复多试几次。
         */
        for (int i = 0; i < 20; i++) {
            new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    a.addPlusplus();
                }
            }, String.valueOf(i)).start();
        }
        // 如果当前存活线程大于 2 个(包括main线程) 礼让线程继续执行上边的线程
        while (Thread.activeCount() > 2) {
            Thread.yield();
        }
        System.out.println(Thread.currentThread().getName() + " Thread is over\t" + a.number);

    }

}

class A {
    volatile int number = 0;

    public void addPlusplus() {
        this.number++;
    }
}
```
不保证原子性的原因，由于各个线程之间都是复制主内存的数据到自己的工作空间里边修改数据，CPU的轮询反复切换线程，会导致数据丢失。
即某个线程修改了数据，准备回主内存，此时CPU切换到另一个线程修改了数据，并且写回到了主内存。其他的线程不知道主内存的数据已经被更改，还会执行将之前从主内存复制的数据修改后的，写到主内存，这就导致了数据被覆盖、丢失。

如果要解决原子性的问题，在Java中只能控制线程，在修改的时候不能被中断，即加锁。
```java
public class MainTest {

    public static void main(String[] args) {
        A a = new A();
        /**
         * 创建20个线程 每个线程让 number++ 1000次；
         * number 变量用 volatile 修饰
         * 如果 volatile 保证变量的原子性，则最后结果为 20 * 1000，反之则不保证。
         * 当然不排除偶然事件，建议反复多试几次。
         */
        for (int i = 0; i < 20; i++) {
            new Thread(() -> {
                for (int j = 0; j < 1000; j++) {
                    a.addPlusplus();
                }
            }, String.valueOf(i)).start();
        }
        // 如果当前存活线程大于 2 个(包括main线程) 礼让线程继续执行上边的线程
        while (Thread.activeCount() > 2) {
            Thread.yield();
        }
        System.out.println(Thread.currentThread().getName() + " Thread is over\t" + a.number);

    }

}

class A {

    int number = 0;

    /**
     * 如果要解决原子性的问题可以用synchronized 关键字(这种太浪费性能)
     * 可用JUC下的 AtomicInteger 来解决
     **/
    AtomicInteger atomicInteger = new AtomicInteger(number);

    public void addPlusplus() {
        number = atomicInteger.incrementAndGet();
    }
}
```
对于`AtomicInteger.incrementAndGet`方法来说，原理就是`volatile` + `do...while()` + `CAS`;
```java
public final int incrementAndGet() {
    return unsafe.getAndAddInt(this, valueOffset, 1) + 1;
}
//=========================
public final int getAndAddInt(Object var1, long var2, int var4) {
    int var5;
    do {
        var5 = this.getIntVolatile(var1, var2);
    } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));

    return var5;
}
```
用`volatile`修饰该变量，保证该变量被某个线程修改时，保证其他线程中的这个变量的可见性。
在多线程环境下，CPU轮流切换线程执行，有可能某个线程修改了数据，准备回主内存，此时CPU切换到另一个线程修改了数据，并且写回到了主内存，此时就导致数据的不准确。
`do...while()` + `CAS`的作用就是，当某个线程工作内存中的值与主内存中的值，如果不相同就会一直`while`循环下去，之所以用`do..while`是考虑到做自增操作。
