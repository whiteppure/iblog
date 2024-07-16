---
title: "Java中的锁都有什么"
date: 2020-04-07
draft: false
tags: ["线程", "Java"]
slug: "java-locks"
---


## 锁
在Java中根据锁的特性来划分可以分为很多，锁的主要作用是确保多线程环境下的数据安全，从而保证程序的正确执行。
在Java中具体"锁"的实现，通常可以归纳为三种，使用`synchronized`关键字、调用`juc.locks`包下相关接口、使用`CAS`思想。

| 锁的类型与概念   | 描述                                                                 |
|------------------|----------------------------------------------------------------------|
| 公平锁           | 线程按照请求的顺序获取锁。                                             |
| 非公平锁         | 线程获取锁的顺序不受控制，有可能插队。                                   |
| 可重入锁         | 允许同一个线程多次获取同一把锁，避免死锁。                             |
| 不可重入锁       | 不允许同一个线程多次获取同一把锁。                                     |
| 共享锁           | 多个线程可以同时获取同一把锁。                                         |
| 独占锁           | 同一时间只允许一个线程获取该锁。                                       |
| 悲观锁           | 假设会有并发冲突，每次操作时都加锁。                                   |
| 乐观锁           | 假设不会有并发冲突，操作时不加锁，提交时检查是否冲突。                   |
| 偏向锁           | 当只有一个线程访问同步块时，为该线程加锁，减少获取锁的操作成本。        |
| 轻量级锁         | 针对竞争不激烈的情况下进行优化，通过CAS操作来避免互斥。                |
| 重量级锁         | 竞争激烈时，锁的持有和释放会导致线程阻塞和唤醒。                         |
| 可中断锁         | 允许在等待锁的过程中可以响应中断信号。                                  |
| 互斥锁           | 控制对共享资源的访问，同一时间只有一个线程可以获取锁。                   |
| 死锁             | 几个线程因互相持有对方所需的资源而无法继续执行的状态。                  |


### 公平锁与非公平锁
根据线程获取锁的顺序来划分可分为公平锁和非公平锁。
- 公平锁：公平锁是指多个线程按照申请锁的顺序来获取锁。即先到先得的原则，先请求锁的线程会先获取到锁，后到的线程会排队等待。
  优点是等待锁的线程不会饿死。缺点是整体吞吐效率相对非公平锁要低，等待队列中除第一个线程以外的所有线程都会阻塞，CPU唤醒阻塞线程的开销比非公平锁大。
    ```java
    ReentrantLock fairLock = new ReentrantLock(true); // true 表示使用公平锁
    ```
- 非公平锁：非公平锁是指多个线程获取锁的顺序是不确定的，是随机竞争的。即线程获取锁的顺序是不固定的，有可能新来的线程比等待时间长的线程先获取到锁。
  优点是可以通过减少线程切换的开销来提高并发性能，整体的吞吐效率高。缺点是处于等待队列中的线程可能会饿死，或者等很久才会获得锁。
    ```java
    ReentrantLock nonfairLock = new ReentrantLock(false); // false 表示使用非公平锁（默认）
    ```

通常情况下，如果不特别需要公平性，非公平锁能够提供更高的性能。但是在某些需要严格控制线程执行顺序的场景下，公平锁可能更为适合。
在Java中公平锁和非公平锁的实现为`ReentrantLock`、`synchronized`。
其中`synchronized`是非公平锁，`ReentrantLock`默认是非公平锁，但是可以指定`ReentrantLock`的构造函数创建公平锁。
```java
/**
 * Creates an instance of {@code ReentrantLock}.
 * This is equivalent to using {@code ReentrantLock(false)}.
 */
public ReentrantLock() {
    sync = new NonfairSync();
}

/**
 * Creates an instance of {@code ReentrantLock} with the
 * given fairness policy.
 *
 * @param fair {@code true} if this lock should use a fair ordering policy
 */
public ReentrantLock(boolean fair) {
    sync = fair ? new FairSync() : new NonfairSync();
}
```

### 可重入锁与不可重入锁
根据一个线程是否可以多次获得同一把锁来划分，可分为可重入锁和不可重入锁。
- 可重入锁：可重入锁是指同一个线程在外层方法获取锁之后，在内层方法仍然能够获取该锁的锁。即同一个线程可以多次获得同一把锁，可重入锁最大的作用就是避免死锁。所以可重入锁又叫做递归锁。
- 不可重入锁：所谓不可重入锁，就是与可冲入锁作用相悖；不可重入锁是指一个线程在持有锁的情况下再次请求锁时，会被阻塞或导致死锁。即同一个线程不能多次获得同一把锁。

举个例子，当你进入你家时门外会有锁，进入房间后厨房卫生间都可以随便进出，这个叫可重入锁。当你进入房间时，发现厨房、卫生间都上锁而且你拿不到钥匙，这个叫不可重入锁。
在Java中`ReentrantLock`和`synchronized`都是可重入锁。
```java
public class ReentrantExample {
    public synchronized void outerMethod() {
        System.out.println("Outer method");
        innerMethod();
    }

    public synchronized void innerMethod() {
        System.out.println("Inner method");
    }

    public static void main(String[] args) {
        ReentrantExample example = new ReentrantExample();
        example.outerMethod();
    }
}
```
```java
public class ReentrantLockExample {
    private final ReentrantLock lock = new ReentrantLock();

    public void outerMethod() {
        lock.lock();
        try {
            System.out.println("Outer method");
            innerMethod();
        } finally {
            lock.unlock();
        }
    }

    public void innerMethod() {
        lock.lock();
        try {
            System.out.println("Inner method");
        } finally {
            lock.unlock();
        }
    }

    public static void main(String[] args) {
        ReentrantLockExample example = new ReentrantLockExample();
        example.outerMethod();
    }
}
```

### 共享锁与独占锁
根据锁的访问权限可划分为共享锁和独占锁。
- 独占锁：独占锁又称排它锁，指一次只能有一个线程获得锁，其他所有尝试获取锁的线程都会被阻塞，直到持有锁的线程释放锁。
  只有一个线程能访问受保护的资源，从而确保资源的独占访问，适用于写操作等需要完全独占资源的场景。
- 共享锁：共享锁允许多个线程同时获得锁，多个线程可以并发地访问受保护的资源。适用于读操作等可以并发访问的场景。
  多个线程可以同时持有锁，但如果某个线程需要进行写操作，则必须等到所有持有共享锁的线程释放锁。

在Java中，对于`ReentrantLock`和`synchronized`都是独占锁。对于`ReentrantReadWriteLock`其读锁是共享锁而写锁是独占锁，读锁的共享可保证并发读是非常高效的。
```java
public class SharedLockExample {
    private final ReentrantReadWriteLock rwLock = new ReentrantReadWriteLock();
    private final ReentrantReadWriteLock.ReadLock readLock = rwLock.readLock();
    private final ReentrantReadWriteLock.WriteLock writeLock = rwLock.writeLock();

    public void readMethod() {
        readLock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " acquired the read lock");
            // Read-only critical section
        } finally {
            readLock.unlock();
            System.out.println(Thread.currentThread().getName() + " released the read lock");
        }
    }

    public void writeMethod() {
        writeLock.lock();
        try {
            System.out.println(Thread.currentThread().getName() + " acquired the write lock");
            // Write critical section
        } finally {
            writeLock.unlock();
            System.out.println(Thread.currentThread().getName() + " released the write lock");
        }
    }

    public static void main(String[] args) {
        SharedLockExample example = new SharedLockExample();
        Runnable readTask = () -> {
            for (int i = 0; i < 3; i++) {
                example.readMethod();
            }
        };

        Runnable writeTask = () -> {
            for (int i = 0; i < 3; i++) {
                example.writeMethod();
            }
        };

        Thread t1 = new Thread(readTask);
        Thread t2 = new Thread(readTask);
        Thread t3 = new Thread(writeTask);
        t1.start();
        t2.start();
        t3.start();
    }
}
```

### 悲观锁与乐观锁
根据对数据并发访问来划分，可分为悲观锁和乐观锁。乐观锁与悲观锁是一种广义上的概念，可以理解为一种标准类似于Java中的接口。
- 对于多线程并发操作，加了悲观锁的线程认为每一次修改数据时都会有其他线程来跟它一起修改数据，所以在修改数据之前先会加锁，确保其他线程不会修改该数据。
  由于悲观锁在修改数据前先加锁的特性，能保证写操作时数据正确，所以悲观锁更适合写多读少的场景。
- 乐观锁则与悲观锁相反，每一次修改数据时，都认为没有其他线程来跟它一起修改，所以在修改数据之前不会去添加锁，如果这个数据没有被更新，当前线程将自己修改的数据成功写入。如果数据已经被其他线程更新，则根据不同的实现方式执行不同的操作。
  由于乐观锁是一种无锁操作，所以在使用乐观锁的场景中读的性能会大幅度提升，适合读多写少。

在Java中悲观锁的实现有，`synchronized`、`Lock`实现类，乐观锁的实现有`CAS`。
```java
public class SynchronizedExample {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public synchronized int getCount() {
        return count;
    }

    public static void main(String[] args) {
        SynchronizedExample example = new SynchronizedExample();
        example.increment();
        System.out.println("Count: " + example.getCount());
    }
}
```
```java
public class CASExample {
    private final AtomicInteger count = new AtomicInteger(0);

    public void increment() {
        while (true) {
            int existingValue = count.get();
            int newValue = existingValue + 1;
            if (count.compareAndSet(existingValue, newValue)) {
                break;
            }
        }
    }

    public int getCount() {
        return count.get();
    }

    public static void main(String[] args) {
        CASExample example = new CASExample();
        example.increment();
        System.out.println("Count: " + example.getCount());
    }
}
```

### 自旋锁与适应性自旋锁
自旋锁是一种特殊的锁，它不会让线程立即阻塞。
当一个线程尝试获取某个锁时，如果该锁已被其他线程占用，就一直循环检测锁是否被释放，而不是进入线程挂起或睡眠状态，直到获取到某个锁超过一定的自旋次数后才会阻塞线程。
自旋锁本身是有缺点的，它不能代替阻塞。如果锁被占用的时间很长，那么自旋的线程只会白白浪费处理器资源，带来性能上的浪费，所以使用自旋锁时需要根据具体的应用场景来权衡其利弊。

在Java中，可以使用`java.util.concurrent.atomic`包下的原子类来实现自旋锁，其中`AtomicInteger`常被用来实现简单的自旋锁。
```java
public class SpinLock {
    private volatile boolean locked = false;

    public void lock() {
        // 自旋等待获取锁
        while (locked);
        // 获取到锁后，将 locked 设置为 true
        locked = true;
    }

    public void unlock() {
        // 释放锁
        locked = false;
    }

    public static void main(String[] args) {
        SpinLock spinLock = new SpinLock();

        // 线程1
        new Thread(() -> {
            spinLock.lock();
            try {
                System.out.println("Thread 1 in critical section");
                Thread.sleep(1000); // 模拟临界区代码执行
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                spinLock.unlock();
            }
        }).start();

        // 线程2
        new Thread(() -> {
            spinLock.lock();
            try {
                System.out.println("Thread 2 in critical section");
                Thread.sleep(1000); // 模拟临界区代码执行
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                spinLock.unlock();
            }
        }).start();
    }
}
```

为什么要使用自旋锁？在许多场景中，同步资源的锁定时间很短，为了这一小段时间去切换线程，线程挂起和恢复现场的花费可能会让系统得不偿失。
简单来说就是，避免切换线程带来的开销。自旋等待虽然避免了线程切换的开销，但它要占用处理器时间。如果锁被占用的时间很短，自旋等待的效果就会非常好。
反之，如果锁被占用的时间很长，那么自旋的线程只会白浪费处理器资源。所以自旋等待的时间必须要有一定的限度，如果自旋超过了限定次数（默认是10次，可以使用`-XX:PreBlockSpin`来更改）没有成功获得锁，就应当挂起线程。
>自旋锁在JDK 1.4中引入，默认关闭，但是可以使用`-XX:+UseSpinning`开启。在JDK1.6中默认开启，同时自旋的默认次数为10次，可以通过参数`-XX:PreBlockSpin`来调整。

如果通过参数`-XX:PreBlockSpin`来调整自旋锁的自旋次数会带来诸多不便。假如将参数调整为10，但是系统很多线程都是等你刚刚退出的时候就释放了锁，假如多自旋一两次就可以获取锁。于是JDK1.6引入适应性自旋锁。

适应性自旋锁是对自旋的升级、优化，自旋的时间不再固定，它根据当前锁的使用情况动态调整自旋等待时间。
如果在同一个锁对象上，自旋等待刚刚成功获得过锁，并且持有锁的线程正在运行中，那么虚拟机就会认为这次自旋也是很有可能再次成功，进而它将允许自旋等待持续相对更长的时间。
如果对于某个锁，自旋很少成功获得过，那在以后尝试获取这个锁时将可能省略掉自旋过程，直接阻塞线程，避免浪费处理器资源。
```java
public class AdaptiveSpinLock {
    private static final int MIN_SPIN_COUNT = 10;
    private static final int MAX_SPIN_COUNT = 1000;
    private AtomicBoolean locked = new AtomicBoolean(false);
    private int spinCount = MIN_SPIN_COUNT; // 初始自旋等待次数设定为最小值

    public void lock() {
        int spins = spinCount; // 获取当前自旋次数
        while (!locked.compareAndSet(false, true)) {
            if (spins < MAX_SPIN_COUNT) {
                spins++; // 自旋次数递增
            }
            // 在真实场景中，可能需要添加短暂的延时，避免过多占用CPU资源
            for (int i = 0; i < spins; i++) {
                Thread.onSpinWait(); // 在Java 9及以上版本中，可以使用Thread.onSpinWait()来优化自旋等待
            }
        }
        spinCount = spins; // 更新自旋次数
    }

    public void unlock() {
        locked.set(false);
    }

    public static void main(String[] args) {
        AdaptiveSpinLock spinLock = new AdaptiveSpinLock();

        // 线程1
        new Thread(() -> {
            spinLock.lock();
            try {
                System.out.println("Thread 1 in critical section");
                Thread.sleep(1000); // 模拟临界区代码执行
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                spinLock.unlock();
            }
        }).start();

        // 线程2
        new Thread(() -> {
            spinLock.lock();
            try {
                System.out.println("Thread 2 in critical section");
                Thread.sleep(1000); // 模拟临界区代码执行
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                spinLock.unlock();
            }
        }).start();
    }
}
```

### 偏向锁
偏向锁是Java中针对加锁操作进行的一种优化机制，主要针对只有一个线程访问同步块的场景。它的设计初衷是在无竞争的情况下，减少不必要的同步原语的性能消耗。
> 《深入理解Java虚拟机》对偏向锁的解释：
`Hotspot` 的作者经过以往的研究发现大多数情况下锁不仅不存在多线程竞争，而且总是由同一线程多次获得，为了让线程获得锁的代价更低而引入了偏向锁。
当一个线程访问同步块并获取锁时，会在对象头和栈帧中的锁记录里存储锁偏向的线程 ID，以后该线程在进入和退出同步块时不需要花费CAS操作来加锁和解锁，而只需简单的测试一下对象头的 `MarkWord` 里是否存储着指向当前线程的偏向锁，如果测试成功，表示线程已经获得了锁，如果测试失败，则需要再测试下 `MarkWord` 中偏向锁的标识是否设置成 1（表示当前是偏向锁），如果没有设置，则使用 CAS 竞争锁，如果设置了，则尝试使用CAS将对象头的偏向锁指向当前线程。

之所以叫偏向锁是因为偏向于第一个获取到他的线程，如果在程序执行中该锁没有被其他的线程获取，则持有偏向锁的线程将永远不需要再进行同步。
但是如果线程间存在锁竞争，偏向锁会失效，此时会涉及到锁的撤销，将锁状态升级为适合多线程竞争的轻量级锁或者重量级锁，这个过程可能会引入额外的开销，影响性能。

当一个线程访问同步块时，首先会尝试获取偏向锁。如果同步块之前没有被其他线程锁定，当前线程会尝试获取偏向锁，并将对象头的标记位设置为偏向锁。
如果其他线程尝试访问该同步块，会检测到该同步块已经被偏向锁定，会尝试撤销偏向锁，升级为轻量级锁或者重量级锁。
如果偏向线程已经不再访问该同步块，那么该对象头的标记位会被设置成无锁状态，接着是无锁状态。

### 轻量级锁与重量级锁
根据锁的竞争情况来划分可以分为重量级锁和轻量级锁。
- 重量级锁：重量级锁适用于多线程竞争激烈的情况下，它的实现通常依赖于操作系统的底层特性，重量级锁会导致线程堵塞。传统的重量级锁，使用的是系统互斥量实现的。
- 轻量级锁：相对于重量级锁而言的。轻量级锁适用于多线程竞争不激烈的情况下，它的设计目标是在减少传统重量级锁在竞争时带来的性能损耗。

在Java中轻量级锁的经典实现是CAS中的自旋锁。优点是竞争的线程不会阻塞，提高了程序的响应速度；缺点是如果始终得不到锁竞争的线程，使用自旋会消耗CPU。所以轻量级锁适合，追求响应时间，同步块执行速度非常快的场景。
重量级锁依赖于操作系统提供的底层同步机制。优点是线程竞争不使用自旋，不会消耗CPU；缺点是当多个线程竞争同一个锁时，会直接阻塞等待，直到获取到锁的线程释放锁资源。适合追求吞吐量、同步块执行时间较长也就是线程竞争激烈的场景。

轻量级锁不是在任何情况下都比重量级锁快的，要看同步块执行期间有没有多个线程抢占资源的情况。如果有，那么轻量级线程要承担CAS+互斥锁的性能消耗，就会比重量锁执行的更慢。

### 可中断锁
可中断锁顾名思义，就是可以中断的锁。
如果某一线程A正在执行锁中的代码，另一线程B正在等待获取该锁，可能由于等待时间过长，线程B不想等待了，想先处理其他事情，我们可以让它中断自己或者在别的线程中中断它，这种就是可中断锁。

在Java中`synchronized`就是不可中断锁，`Lock`是可中断锁。
```java
public class SynchronizedExample {
    private static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        Thread thread1 = new Thread(() -> {
            synchronized (lock) {
                System.out.println(Thread.currentThread().getName() + " acquired the lock");
                try {
                    Thread.sleep(5000); // 模拟线程持有锁的操作
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }, "Thread-1");

        Thread thread2 = new Thread(() -> {
            synchronized (lock) {
                System.out.println(Thread.currentThread().getName() + " acquired the lock");
            }
        }, "Thread-2");

        thread1.start();
        Thread.sleep(1000); // 让Thread-1先获取锁
        thread2.start();

        // 等待线程执行完成
        thread1.join();
        thread2.join();
    }
}
```
```java
public class LockExample {
    private static final Lock lock = new ReentrantLock();

    public static void main(String[] args) throws InterruptedException {
        Thread thread1 = new Thread(() -> {
            lock.lock();
            try {
                System.out.println(Thread.currentThread().getName() + " acquired the lock");
                Thread.sleep(5000); // 模拟线程持有锁的操作
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                lock.unlock();
            }
        }, "Thread-1");

        Thread thread2 = new Thread(() -> {
            try {
                if (lock.tryLock()) { // 可中断地尝试获取锁
                    try {
                        System.out.println(Thread.currentThread().getName() + " acquired the lock");
                    } finally {
                        lock.unlock();
                    }
                } else {
                    System.out.println(Thread.currentThread().getName() + " unable to acquire the lock");
                }
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "Thread-2");

        thread1.start();
        Thread.sleep(1000); // 让Thread-1先获取锁
        thread2.start();

        // 等待线程执行完成
        thread1.join();
        thread2.join();
    }
}
```

### 互斥锁
互斥锁是一种用于多线程编程中的同步原语，用于确保在任何时刻，只有一个线程可以访问共享资源，从而避免数据竞争和并发访问的冲突。
在编程中，引入了对象互斥锁的概念，来保证共享数据操作的完整性。每个对象都对应于一个可称为"互斥锁"的标记，这个标记用来保证在任一时刻，只能有一个线程访问该对象。

互斥锁在访问共享资源之前对对象进行加锁操作，在访问完成之后进行解锁操作。加锁后，任何其他试图再次加锁的线程会被阻塞，直到当前线程解锁其他线程才能访问公共资源。
如果在解锁时有多个线程在等待获取锁，一旦锁被释放，它们将竞争重新获取锁。只有第一个竞争到锁的线程会变为就绪状态并开始执行，其他线程将继续等待。

在Java里最基本的互斥手段就是使用`synchronized`关键字、`ReentrantLock`。
```java
public class SynchronizedMutexExample {
    private static int counter = 0;
    private static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        Runnable task = () -> {
            synchronized (lock) {
                for (int i = 0; i < 10000; i++) {
                    counter++;
                }
            }
        };

        Thread thread1 = new Thread(task);
        Thread thread2 = new Thread(task);

        thread1.start();
        thread2.start();

        thread1.join();
        thread2.join();

        System.out.println("Counter: " + counter);
    }
}
```

### 死锁
死锁并不是Java程序中通俗意义上的"锁"，而是程序中出现的一种问题。之所以放到“锁”这个标题下是为了方便类比，就类似谐音梗吧。

死锁是指两个或多个线程在执行过程中，由于竞争资源或者互相等待释放资源而造成的一种僵局，使得所有参与的线程无法继续执行。
举个例子，当线程A持有锁a并尝试获取锁b，线程B持有锁b并尝试获取锁a时，就会出现死锁。简单来说，死锁问题的产生是由两个或者以上线程并行执行的时候，争夺资源而互相等待造成的。
```java
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

#### 使用资源有序分配法避免死锁
想要如何避免死锁，就要弄清楚死锁出现的原因，造成死锁必须达成的4个条件：
- 互斥条件：一个资源每次只能被一个线程使用。例如，如果线程 A 已经持有的资源，不能再同时被线程 B 持有，如果线程 B 请求获取线程 A 已经占用的资源，那线程 B 只能等待，直到线程 A 释放了资源。
- 请求与保持条件：一个线程因请求资源而阻塞时，对已获得的资源保持不放。例如，当线程 A 已经持有了资源 1，又想申请资源 2，而资源 2 已经被线程 C 持有了，所以线程 A 就会处于等待状态，但是线程 A 在等待资源 2 的同时并不会释放自己已经持有的资源 1。
- 不剥夺条件：线程已获得的资源，在未使用完之前，不能强行剥夺。例如，当线程A已经持有了资源 ，在自己使用完之前不能被其他线程获取，线程 B 如果也想使用此资源，则只能在线程 A 使用完并释放后才能获取。
- 循环等待条件：若干线程之间形成一种头尾相接的循环等待资源关系。比如，线程 A 已经持有资源 2，而想请求资源 1， 线程 B 已经获取了资源 1，而想请求资源 2，这就形成资源请求等待的环。

避免死锁的产生就只需要破环其中一个条件就可以，最常见的并且可行的就是使用资源有序分配法，来破循环等待条件。
资源有序分配法指的是，线程 A 和 线程 B 获取资源的顺序要一样，当线程 A 先尝试获取资源 A，然后尝试获取资源 B 的时候，线程 B 同样也是先尝试获取资源 A，然后尝试获取资源 B。也就是说，线程 A 和 线程 B 总是以相同的顺序申请自己想要的资源。
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

银行家算法：一个避免死锁的著名算法，是由艾兹格·迪杰斯特拉在1965年为T.H.E系统设计的一种避免死锁产生的算法。它以银行借贷系统的分配策略为基础，判断并保证系统的安全运行。

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

#### 使用tryLock进行超时锁定
使用 `java.util.concurrent.locks.ReentrantLock` 的 `tryLock`方法可以尝试获取锁，并设置超时时间，避免长时间等待造成的死锁。
```java
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
