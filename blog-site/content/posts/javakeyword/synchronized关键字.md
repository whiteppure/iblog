---
title: "synchronized关键字"
date: 2024-07-11
draft: false
tags: ["Java", "关键字","多线程"]
slug: "java-keyword-synchronized"
---

## synchronized
`synchronized`是Java提供的关键字译为同步，是Java中用于实现线程同步的一种机制。它可以确保在同一时间只有一个线程能够执行某段代码，从而避免线程安全问题。
当它修饰一个方法或者一个代码块的时候，同一时刻最多只有一个线程执行这段代码。`synchronized`关键字在需要原子性、可见性和有序性这三种特性的时候都可以作为其中一种解决方案，大部分并发控制操作都能使用`synchronized`来完成。

`synchronized`的作用：
- 互斥性：确保在同一时间只有一个线程可以执行被 `synchronized` 修饰的代码块或方法。
- 可见性：当一个线程退出 `synchronized` 代码块时，它所做的所有修改对于进入 `synchronized` 代码块的其他线程是可见的。这是通过释放和获得监视器锁来实现的。

### 使用示例
| 修饰的对象       | 作用范围     | 作用对象           |
| ---------------- | ------------ | ------------------ |
| 同步一个实例方法     | 整个实例方法     | 调用此方法的对象   |
| 同步一个静态方法 | 整个静态方法 | 此类的所有对象     |
| 同步代码块-对象  | 整个代码块   | 调用此代码块的对象 |
| 同步代码块-类   | 整个代码块   | 此类的所有对象     |

- 同步一个实例方法。在这种情况下，`increment`方法被声明为同步方法。当一个线程调用这个方法时，它会获得该实例的监视器锁，其他线程必须等待这个线程释放锁后才能调用这个方法。
    ```java
    public synchronized void increment() {
        count++;
    }
    ```
- 同步一个静态方法。当`synchronized`作用于静态方法时，其锁就是当前类的`class`对象锁。由于静态成员不专属于任何一个实例对象，而是类成员，因此通过`class`对象锁可以控制静态成员的并发操作。
    ```java
    public static synchronized void increment() {
        count++;
    }
    ```
- 同步代码块。在某些情况下，我们编写的方法体可能比较大，同时存在一些比较耗时的操作，而需要同步的代码又只有一小部分，如果直接对整个方法进行同步操作，这样做就有点浪费。此时我们可以使用同步代码块的方式对需要同步的代码进行包裹。
    ```java
    public void increment() {
        synchronized (this) {
            count++;
        }
    }
    ```
  除了使用`synchronized(this)`锁定，当然静态方法是没有this对象的，也可以使用`class`对象来做为锁。
    ```java
    public void increment() {
        synchronized (MainTest.class) {
            count++;
        }
    }
    ```

当如果没有明确的对象作为锁，只是想让一段代码同步时，可以创建一个特殊的对象来充当锁。
```java
private byte[] lock = new byte[0];
public void method(){
  synchronized(lock) {
     // .....
  }
}
```
零长度的`byte`数组对象创建起来将比任何对象都经济。查看编译后的字节码，生成零长度的`byte[]`对象只需3条操作码，而`Object lock = new Object()`则需要7行操作码。
```text
byte[] emptyArray = new byte[0];

0: iconst_0       // 将常量0推送到栈顶
1: newarray byte  // 创建一个新的byte类型数组
3: astore_1       // 将引用类型的数据存储到局部变量表中
```
```text
Object lock = new Object();

0: new           #2   // 创建一个新的对象
3: dup                // 复制栈顶的操作数栈顶的值，并将复制值压入栈顶
4: invokespecial #1   // 调用实例初始化方法, 使用Object.<init>
7: astore_1           // 将引用类型的数据存储到局部变量表中

```

### 实现原理
`synchronized`关键字在Java中通过进入和退出一个监视器来实现同步。监视器本质上是一种锁，它可以是类对象锁或实例对象锁。每个对象在JVM中都有一个与之关联的监视器。
当一个线程进入同步代码块或方法时，它会尝试获得对象的监视器。如果成功获得锁，线程就可以执行同步代码；否则它将被阻塞，直到获得锁为止。

在Java中`synchronized`锁对象时，其实就是改变对象中的对象头的`markword`的锁的标志位来实现的。用`javap -v MainTest.class`命令反编译下面代码。
```java
public class MainTest {

    synchronized void demo01() {
        System.out.println("demo 01");
    }

    void demo02() {
        synchronized (MainTest.class) {
            System.out.println("demo 02");
        }
    }

}
```
```text
  synchronized void demo01();
    descriptor: ()V
    flags: ACC_SYNCHRONIZED
    Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         3: ldc           #3                  // String demo 01
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
         8: return
// ...
void demo02();
    descriptor: ()V
    flags:
    Code:
      stack=2, locals=3, args_size=1
         0: ldc           #5                  // class content/posts/rookie/MainTest
         2: dup
         3: astore_1
         4: monitorenter
         5: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
         8: ldc           #6                  // String demo 02
        10: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
        13: aload_1
        14: monitorexit
        15: goto          23
        18: astore_2
        19: aload_1
        20: monitorexit
        21: aload_2
        22: athrow
        23: return
// ...
```
通过反编译后代码可以看出：
- 对于同步方法，JVM采用`ACC_SYNCHRONIZED`标记符来实现同步；
- 对于同步代码块，JVM采用`monitorenter`、`monitorexit`两个指令来实现同步；

其中同步代码块，有两个`monitorexit`指令的原因是为了保证抛异常的情况下也能释放锁，所以`javac`为同步代码块添加了一个隐式的`try-finally`，在`finally`中会调用`monitorexit`命令释放锁。

[官方文档](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html#jvms-2.11.10)中关于同步方法和同步代码块的实现原理描述：
> 方法级的同步是隐式的。同步方法的常量池中会有一个 `ACC_SYNCHRONIZED` 标志。当某个线程要访问某个方法的时候，会检查是否有 `ACC_SYNCHRONIZED`，如果有设置，则需要先获得监视器锁，然后开始执行方法，方法执行之后再释放监视器锁。这时如果其他线程来请求执行方法，会因为无法获得监视器锁而被阻断住。值得注意的是，如果在方法执行过程中，发生了异常，并且方法内部并没有处理该异常，那么在异常被抛到方法外面之前监视器锁会被自动释放。<br>
> 同步代码块使用 `monitorenter` 和 `monitorexit` 两个指令实现。可以把执行 `monitorenter` 指令理解为加锁，执行 `monitorexit` 理解为释放锁。 每个对象维护着一个记录着被锁次数的计数器。未被锁定的对象的该计数器为0，当一个线程获得锁（执行 `monitorenter`）后，该计数器自增变为 1 ，当同一个线程再次获得该对象的锁的时候，计数器再次自增。当同一个线程释放锁（执行 `monitorexit` 指令）的时候，计数器再自减。当计数器为0的时候。锁将被释放，其他线程便可以获得锁。

其实无论是`ACC_SYNCHRONIZED`还是`monitorenter`、`monitorexit`都是基于`Monitor`实现的，每一个锁都对应一个`monitor`对象。
在Java虚拟机(HotSpot)中，`Monitor`是基于C++实现的，由`ObjectMonitor`实现。在`/hotspot/src/share/vm/runtime/objectMonitor.hpp`中有`ObjectMonitor`的实现。
```text
// initialize the monitor, exception the semaphore, all other fields
// are simple integers or pointers
ObjectMonitor() {
    _header       = NULL;
    _count        = 0; //记录个数
    _waiters      = 0,
    _recursions   = 0;
    _object       = NULL;
    _owner        = NULL;
    _WaitSet      = NULL; //处于wait状态的线程，会被加入到_WaitSet
    _WaitSetLock  = 0 ;
    _Responsible  = NULL ;
    _succ         = NULL ;
    _cxq          = NULL ;
    FreeNext      = NULL ;
    _EntryList    = NULL ; //处于等待锁block状态的线程，会被加入到该列表
    _SpinFreq     = 0 ;
    _SpinClock    = 0 ;
    OwnerIsThread = 0 ;
  }
```
- `_owner`：指向持有`ObjectMonitor`对象的线程；
- `_WaitSet`：存放处于`wait`状态的线程队列；
- `_EntryList`：存放处于等待锁`block`状态的线程队列；
- `_recursions`：锁的重入次数；
- `_count`：用来记录该线程获取锁的次数；

当多个线程同时访问一段同步代码时，首先会进入`_EntryList`队列中，当某个线程获取到对象的`monitor`后进入`_Owner`区域，并把`monitor`中的`_owner`变量设置为当前线程，同时`monitor`中的计数器`_count`加1，即获得对象锁。

![synchronized原理](/iblog/posts/annex/images/essays/synchronized原理.gif)

若此时持有`monitor`的线程调用`wait()`方法，将释放当前对象持有的`monitor`，`_owner`变量恢复为`null`，`_count`自减1，同时该线程进入`_WaitSet`集合中等待被唤醒。若当前线程执行完毕也将释放`monitor`并复位变量的值，以便其他线程进入获取`monitor`。

`ObjectMonitor`中其他方法：
```text
  bool      try_enter (TRAPS) ;
  void      enter(TRAPS);
  void      exit(bool not_suspended, TRAPS);
  void      wait(jlong millis, bool interruptable, TRAPS);
  void      notify(TRAPS);
  void      notifyAll(TRAPS);
```
`sychronized`加锁的时候，会调用`objectMonitor`的`enter`方法，解锁的时候会调用`exit`方法。
在JDK1.6之前，`synchronized`的实现直接调用`ObjectMonitor`的`enter`和`exit`，这种锁被称之为重量级锁，这也是早期`synchronized`效率低的原因。
所以，在JDK1.6中出现对锁进行了很多的优化，进而出现轻量级锁，偏向锁，锁消除，适应性自旋锁，锁粗化。

> 早期的`synchronized`效率低的原因：
Java的线程是映射到操作系统原生线程之上的，如果要阻塞或唤醒一个线程就需要操作系统的帮忙，监视器锁`monitor`是依赖于底层的操作系统的`Mutex Lock`来实现的，而操作系统实现线程之间的切换时需要从用户态转换到核心态。因此状态转换需要花费很多的处理器时间。
对于代码简单的同步块（如被`synchronized`修饰的`get`、`set`方法）状态转换消耗的时间有可能比用户代码执行的时间还要长，所以说`synchronized`是Java语言中一个重量级的操作。也是为什么早期的`synchronized`效率低的原因。

### 锁的升级
在JDK1.6之前，使用`synchronized`被称作重量级锁，它的实现是基于底层操作系统的`mutex`互斥原语的，这个开销是很大的。所以在JDK1.6时JVM对`synchronized`做了优化。
`synchronized`锁对象时，其实就是改变对象中的对象头的`markword`的锁的标志位来实现的。对象头中`markword`锁状态的表示：
| 锁状态         | `markword` 锁标志位 |
|----------------|----------------------|
| 无锁状态        | `01`                 |
| 偏向锁状态      | `01`                 |
| 轻量级锁状态    | `00`                 |
| 重量级锁状态    | `10`                 |
| 被垃圾回收器标记 | `11`                 |

对象的锁状态，可以分为4种，级别从低到高依次是：无锁状态、偏向锁状态、轻量级锁状态和重量级锁状态。
其中这几个锁只有重量级锁是需要使用操作系统底层`mutex`互斥原语来实现，其他的锁都是使用对象头来实现的。

- 无锁状态：`markword`锁的标志位0，偏向锁的标志位为1；例如：刚被创建出来的对象。
- 偏向锁：如果一个线程获取了锁，此时`markword`的结构变为偏向锁结构，当这个线程再次请求锁时，无需再做任何同步操作，直接可以获取锁。
  省去了大量有关锁申请的操作，从而也就提供程序的性能。
- 轻量级锁：当锁是偏向锁的时候，被另外的线程所访问，偏向锁就会升级为轻量级锁，其他线程会通过自旋的形式尝试获取锁，不会阻塞从而提高性能。
- 重量级锁：升级为重量级锁时，锁标志的状态值变为“10”，此时`MarkWord`中存储的是指向重量级锁的指针，此时等待锁的线程都会进入阻塞状态，所以开销是很大。

随着锁的竞争，锁从偏向锁升级到轻量级锁，再升级的重量级锁。锁升级过程：
1. 无锁状态升级为偏向锁：
   一个对象刚开始实例化的时候，没有任何线程来访问它的时候，它是可偏向的，意味着它现在认为只可能有一个线程来访问它，所以当第一个线程来访问它的时候，它会偏向这个线程。此时对象持有偏向锁。
   偏向第一个线程，这个线程在修改对象头成为偏向锁的时候使用CAS操作，并将对象头中的`ThreadID`改成自己的ID，之后再次访问这个对象时，只需要对比ID，就不需要再使用CAS在进行操作。
2. 偏向锁升级为轻量级锁：
   一旦有第二个线程访问这个对象，因为偏向锁不会主动释放，所以第二个线程可以看到对象的偏向状态。
   这时表明在这个对象上已经存在竞争了，JVM会检查原来持有该对象锁的线程是否依然存活，如果不存活，则可以将对象变为无锁状态，然后重新偏向新的线程。
   如果原来的线程依然存活，则马上执行这个线程的操作栈，检查该对象的使用情况，如果仍然需要持有偏向锁，则偏向锁升级为轻量级锁。
3. 轻量级锁升级为重量级锁：
   轻量级锁认为竞争存在，但是竞争的程度很轻，一般两个线程对于同一个锁的操作都会错开，或者说稍微等待一下，另一个线程就会释放锁。
   但是当自旋超过一定的次数，或者一个线程在持有锁，一个在自旋，又有第三个来访时，轻量级锁膨胀为重量级锁，重量级锁使除了拥有锁的线程以外的线程都阻塞。
   当持有锁的线程退出同步块或方法时，会执行`monitorexit`指令释放锁。如果有其他线程在等待该锁，它们会被唤醒并竞争锁的所有权。

在所有的锁都启用的情况下，线程进入临界区时会先获取偏向锁，如果已经存在偏向锁了，则会尝试获取轻量级锁，启用自旋锁。
如果自旋也没有获取到锁，则使用重量级锁，将没有获取到锁的线程阻塞挂起，直到持有锁的线程执行完同步块唤醒他们。

偏向锁是在无锁争用的情况下使用的，也就是同步代码块在当前线程没有执行完之前，没有其它线程会执行该同步块。
一旦有了第二个线程的争用，偏向锁就会升级为轻量级锁，如果轻量级锁自旋到达阈值后，没有获取到锁，就会升级为重量级锁。

锁可以升级，但是不可以降级，有的观点认为不会进行锁降级。
实际上，锁降级确实是会发生的，当JVM进入**安全点**的时候，会检查是否有闲置的`Monitor，然后试图进行降级。
也就是说，仅仅是发生在STW的时候，只有垃圾回收线程能够观测到它，在我们正常使用的过程中是不会发生锁降级的，只有在GC的时候才会降级。
> 安全点：程序执行时并非在所有地方都能停顿下来开始GC，只有在特定的位置才能停顿下来开始GC，这些位置称为安全点。

### synchronized与可见性
可见性是指当多个线程访问同一个变量时，一个线程修改了这个变量的值，其他线程能够立即看得到修改的值。

Java内存模型规定了所有的变量都存储在主内存中，每条线程还有自己的工作内存，线程的工作内存中保存了该线程中是用到的变量的主内存副本拷贝，线程对变量的所有操作都必须在工作内存中进行，而不能直接读写主内存。
不同的线程之间也无法直接访问对方工作内存中的变量，线程间变量的传递均需要自己的工作内存和主存之间进行数据同步进行。所以就可能出现线程1改了某个变量的值，但是线程2不可见的情况。

被`synchronized`修饰的代码，在开始执行时会加锁，执行完成后会进行解锁。但是为了保证可见性，有一条规则是这样的，“对一个变量解锁之前，必须先把此变量同步回主存中”，这样解锁后，后续线程就可以访问到被修改后的值。
所以`synchronized`关键字锁住的对象，其值是具有可见性的。
```java
public class VisibilityExample {
    private boolean flag = false;

    public synchronized void toggleFlag() {
        // 修改共享变量并确保可见性
        flag = !flag;
        // 其他操作
    }

    public synchronized boolean isFlag() {
        // 读取共享变量并确保可见性
        return flag;
    }
}
```

### synchronized与原子性
原子性是指一个操作是不可中断的，要全部执行完成，要不就都不执行。

线程是CPU调度的基本单位，CPU有时间片的概念，会根据不同的调度算法进行线程调度。当一个线程获得时间片之后开始执行，在时间片耗尽之后，就会失去CPU使用权。所以在多线程场景下，由于时间片在线程间轮换，就会发生原子性问题。
在Java中，为了保证原子性，提供了两个高级的字节码指令`monitorenter`和`monitorexit`，这两个字节码指令，在Java中对应的关键字就是`synchronized`。
通过`monitorexit`和`monitorexit`指令，可以保证被`synchronized`修饰的代码在同一时间只能被一个线程访问，在锁未释放之前，无法被其他线程访问到。
因此在Java中可以使用`synchronized`来保证方法和代码块内的操作是原子性的。

举个例子，线程1在执行`monitorenter`指令的时候，会对`Monitor`进行加锁，加锁后其他线程无法获得锁，除非线程1主动解锁。
即使在执行过程中，由于某种原因，比如CPU时间片用完，线程1放弃了CPU，但是它并没有进行解锁。
而由于`synchronized`的锁是可重入的，下一个时间片还是只能被他自己获取到，还是会继续执行代码，直到所有代码执行完，这就保证了原子性。
```java
public class AtomicityExample {
    private int count = 0;

    public synchronized void increment() {
        // 原子性的递增操作
        count++;
    }

    public synchronized void decrement() {
        // 原子性的递减操作
        count--;
    }

    public synchronized int getCount() {
        // 原子性的读取操作
        return count;
    }

    public static void main(String[] args) {
        AtomicityExample example = new AtomicityExample();

        // 线程1：递增操作
        Thread thread1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                example.increment();
            }
        });

        // 线程2：递减操作
        Thread thread2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                example.decrement();
            }
        });

        // 启动线程
        thread1.start();
        thread2.start();

        try {
            // 等待两个线程执行完成
            thread1.join();
            thread2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        // 输出最终的计数结果
        System.out.println("Final Count: " + example.getCount());
    }
}
```

### synchronized与有序性
有序性即程序执行的顺序按照代码的先后顺序执行。

除了引入了时间片以外，由于处理器优化和指令重排等，CPU还可能对输入代码进行乱序执行，比如`load->add->save`有可能被优化成`load->save->add`这就是可能存在有序性问题。
这里需要注意的是，`synchronized`是无法禁止指令重排和处理器优化的，也就是说`synchronized`无法避免上述提到的问题。
那`synchronized`是如何保证有序性的？

`synchronized`通过两个主要机制来保证有序性。`synchronized`的主要特性是互斥性，意味着在同一时刻只有一个线程可以进入同步块，既然是单线程就需要遵守`as-if-serial`语义，那么就可以认为单线程程序是按照顺序执行的。
>`as-if-serial`语义：不管怎么重排序（编译器和处理器为了提高并行度），单线程程序的执行结果都不能被改变。编译器和处理器无论如何优化，都必须遵守`as-if-serial`语义。

第二个保证就是内存屏障。编译器和CPU在执行代码时，可能会为了优化性能进行指令重排，但`synchronized`块内的指令不会被重排。
原因就是Java内存模型通过在进入和退出`synchronized`块时插入内存屏障，来保证这些操作在多线程环境下的顺序执行。
在进入`synchronized`块时，会插入一个`LoadLoad`屏障和一个`LoadStore`屏障，确保在锁被获取后，前面的所有读操作和写操作都已经完成。
在退出`synchronized`块时，会插入一个`StoreStore`屏障和一个`StoreLoad`屏障，确保在锁被释放前，所有的写操作都已经完成，并且这些写操作对其他线程可见。
