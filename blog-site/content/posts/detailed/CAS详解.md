---
title: "CAS详解"
date: 2020-04-04
draft: false
tags: ["多线程","详解"]
slug: "cas-detail"
---


## CAS
CAS全称为`Compare and Swap`被译为比较并交换，是一种无锁算法。用于实现并发编程中的原子操作。CAS操作检查某个变量是否与预期的值相同，如果相同则将其更新为新值。
CAS操作是原子的，这意味着在多个线程同时执行CAS操作时，不会发生竞争条件。

### 使用示例
`java.util.concurrent.atomic`并发包下的所有原子类都是基于CAS来实现的。
```java
public class CASExample {
    public static void main(String[] args) {
        AtomicInteger atomicInteger = new AtomicInteger(0);

        int expectedValue = 0;
        int newValue = 1;

        boolean result = atomicInteger.compareAndSet(expectedValue, newValue);
        
        if (result) {
            System.out.println("更新成功，当前值：" + atomicInteger.get());
        } else {
            System.out.println("更新失败，当前值：" + atomicInteger.get());
        }
    }
}
```
CAS一些常见使用场景：
- 使用CAS实现线程安全的计数器，避免传统锁的开销。
    ```java
    private AtomicInteger counter = new AtomicInteger(0);
    
    public int increment() {
        int oldValue, newValue;
        do {
            oldValue = counter.get();
            newValue = oldValue + 1;
        } while (!counter.compareAndSet(oldValue, newValue));
        return newValue;
    }
    ```
- 使用CAS来实现无锁队列、栈等数据结构。
    ```java
    public class CASQueue<E> {
        private static class Node<E> {
            final E item;
            final AtomicReference<Node<E>> next = new AtomicReference<>(null);
            Node(E item) { this.item = item; }
        }
    
        private final AtomicReference<Node<E>> head = new AtomicReference<>(null);
        private final AtomicReference<Node<E>> tail = new AtomicReference<>(null);
    
        public void enqueue(E item) {
            Node<E> newNode = new Node<>(item);
            while (true) {
                Node<E> currentTail = tail.get();
                if (currentTail == null) {
                    if (head.compareAndSet(null, newNode)) { tail.set(newNode); return; }
                } else {
                    if (currentTail.next.compareAndSet(null, newNode)) { tail.compareAndSet(currentTail, newNode); return; }
                    else { tail.compareAndSet(currentTail, currentTail.next.get()); }
                }
            }
        }
    
        public E dequeue() {
            while (true) {
                Node<E> currentHead = head.get();
                if (currentHead == null) { return null; }
                Node<E> nextNode = currentHead.next.get();
                if (head.compareAndSet(currentHead, nextNode)) { return currentHead.item; }
            }
        }
    
    }
    ```
- 在数据库中，CAS可以用于实现乐观锁机制，避免长时间持有锁。
    ```java
    public class OptimisticLocking {
        private AtomicInteger version = new AtomicInteger(0);
    
        public boolean updateWithOptimisticLock(int expectedVersion, Runnable updateTask) {
            int currentVersion = version.get();
            if (currentVersion != expectedVersion) { return false; }
            updateTask.run();
            return version.compareAndSet(currentVersion, currentVersion + 1);
        }
    
        public int getVersion() { return version.get(); }
    
        public static void main(String[] args) {
            OptimisticLocking lock = new OptimisticLocking();
            Runnable updateTask = () -> System.out.println("Performing update");
    
            int version = lock.getVersion();
            boolean success = lock.updateWithOptimisticLock(version, updateTask);
            if (success) { System.out.println("Update successful."); } else { System.out.println("Update failed."); }
        }
    }
    ```
- 在实现线程池时，CAS可以用于安全地管理线程状态和任务队列。
    ```java
    public class CASThreadPool {
        private static class Node<E> {
            final E item;
            final AtomicReference<Node<E>> next = new AtomicReference<>(null);
            Node(E item) { this.item = item; }
        }
    
        private final AtomicReference<Node<Runnable>> head = new AtomicReference<>(null);
        private final AtomicReference<Node<Runnable>> tail = new AtomicReference<>(null);
    
        public void submitTask(Runnable task) {
            Node<Runnable> newNode = new Node<>(task);
            while (true) {
                Node<Runnable> currentTail = tail.get();
                if (currentTail == null) {
                    if (head.compareAndSet(null, newNode)) { tail.set(newNode); return; }
                } else {
                    if (currentTail.next.compareAndSet(null, newNode)) { tail.compareAndSet(currentTail, newNode); return; }
                    else { tail.compareAndSet(currentTail, currentTail.next.get()); }
                }
            }
        }
    
        public Runnable getTask() {
            while (true) {
                Node<Runnable> currentHead = head.get();
                if (currentHead == null) { return null; }
                Node<Runnable> nextNode = currentHead.next.get();
                if (head.compareAndSet(currentHead, nextNode)) { return currentHead.item; }
            }
        }
    }
    ```

### Unsafe
`Unsafe`是CAS的核心类，Java无法直接访问底层操作系统，而是通过`native`方法来访问。不过尽管如此，JVM还是开了一个后门，JDK中有一个类`Unsafe`，它提供了硬件级别的原子操作。

`Unsafe`类位于`sun.misc`包中，它提供了访问底层操作系统的特定功能，如直接内存访问、CAS 操作等。
由于其提供了直接操作内存的能力，使用不当可能导致内存泄漏、数据损坏等问题，应谨慎使用。
`Unsafe`类包含了许多不安全的操作，所以它并不是Java标准的一部分，而且在Java9开始已经标记为受限制的API。

Java中CAS操作的执行依赖于`Unsafe`类的方法，`Unsafe`类中的所有方法都是`native`修饰的，也就是说`Unsafe`类中的方法都直接调用操作系统底层资源执行相应任务。
```java
public class UnsafeExample {
    private static final Unsafe unsafe;
    private static final long valueOffset;

    private volatile int value = 0;

    static {
        try {
            Field field = Unsafe.class.getDeclaredField("theUnsafe");
            field.setAccessible(true);
            unsafe = (Unsafe) field.get(null);
            valueOffset = unsafe.objectFieldOffset(UnsafeExample.class.getDeclaredField("value"));
        } catch (Exception e) {
            throw new Error(e);
        }
    }

    public void increment() {
        int current;
        do {
            current = unsafe.getIntVolatile(this, valueOffset);
        } while (!unsafe.compareAndSwapInt(this, valueOffset, current, current + 1));
    }

}
```

### 实现原理
以`AtomicInteger`原子整型类为例，来看一下CAS实现原理。
```java
public class MainTest {
    public static void main(String[] args) {
        new AtomicInteger().compareAndSet(1,2);
    }
}
```
调用栈如下：
```text
compareAndSet
    --> unsafe.compareAndSwapInt
    ---> unsafe.compareAndSwapInt
    --> (C++) cmpxchg
```
`AtomicInteger`内部方法都是基于`Unsafe`类实现的。
>`Unsafe`是CAS的核心类，Java无法直接访问底层操作系统，而是通过`native`方法来访问。不过尽管如此，JVM还是开了一个后门，JDK中有一个类`Unsafe`，它提供了硬件级别的原子操作。
```java
// setup to use Unsafe.compareAndSwapInt for updates
private static final Unsafe unsafe = Unsafe.getUnsafe();
private static final long valueOffset;
private volatile int value;

static {
    try {
        valueOffset = unsafe.objectFieldOffset
                (AtomicInteger.class.getDeclaredField("value"));
    } catch (Exception ex) { throw new Error(ex); }
}

public final boolean compareAndSet(int expect, int update) {
    return unsafe.compareAndSwapInt(this, valueOffset, expect, update);
}
```
`compareAndSwapInt`方法参数：
- `this`：`Unsafe`对象本身，需要通过这个类来获取 `value` 的内存偏移地址；
- `valueOffset`： `valueOffset` 表示的是变量值在内存中的偏移地址，因为 `Unsafe` 就是根据内存偏移地址获取数据的原值的。
- `expect`：当前预期的值；
- `update`：要设置的新值；

继续向底层深入，就会看到`Unsafe`类中的一些其他方法：
```java
public final class Unsafe {
    // ...

    public final native boolean compareAndSwapObject(Object var1, long var2, Object var4, Object var5);

    public final native boolean compareAndSwapInt(Object var1, long var2, int var4, int var5);

    public final native boolean compareAndSwapLong(Object var1, long var2, long var4, long var6);
    
    // ...
}
```
对应查看`openjdk`的`hotspot`源码，`src/share/vm/prims/unsafe.cpp`。
```text
#define FN_PTR(f) CAST_FROM_FN_PTR(void*, &f)

{CC"compareAndSwapObject", CC"("OBJ"J"OBJ""OBJ")Z",  FN_PTR(Unsafe_CompareAndSwapObject)},

{CC"compareAndSwapInt",  CC"("OBJ"J""I""I"")Z",      FN_PTR(Unsafe_CompareAndSwapInt)},

{CC"compareAndSwapLong", CC"("OBJ"J""J""J"")Z",      FN_PTR(Unsafe_CompareAndSwapLong)},
``` 
最终在`hotspot`源码实现`/src/share/vm/runtime/Atomic.cpp`中都会调用统一的`cmpxchg`函数。
```cpp
jbyte Atomic::cmpxchg(jbyte exchange_value, volatile jbyte*dest, jbyte compare_value) {
     assert (sizeof(jbyte) == 1,"assumption.");
     uintptr_t dest_addr = (uintptr_t) dest;
     uintptr_t offset = dest_addr % sizeof(jint);
     volatile jint*dest_int = ( volatile jint*)(dest_addr - offset);
     // 对象当前值
     jint cur = *dest_int;
     // 当前值cur的地址
     jbyte * cur_as_bytes = (jbyte *) ( & cur);
     // new_val地址
     jint new_val = cur;
     jbyte * new_val_as_bytes = (jbyte *) ( & new_val);
      // new_val存exchange_value，后面修改则直接从new_val中取值
     new_val_as_bytes[offset] = exchange_value;
     // 比较当前值与期望值，如果相同则更新，不同则直接返回
     while (cur_as_bytes[offset] == compare_value) {
      // 调用汇编指令cmpxchg执行CAS操作，期望值为cur，更新值为new_val
         jint res = cmpxchg(new_val, dest_int, cur);
         if (res == cur) break;
         cur = res;
         new_val = cur;
         new_val_as_bytes[offset] = exchange_value;
     }
     // 返回当前值
     return cur_as_bytes[offset];
}
```
从上述源码可以看出CAS操作通过CPU提供的原子指令`cmpxchg`来实现无锁操作，这个指令会保证在多个处理器同时访问和修改数据时的正确性。

CPU处理器速度远远大于在主内存中的速度，为了加快访问速度，现代CPU引入了多级缓存，如L1、L2、L3 级别的缓存，这些缓存离CPU越近就越快。
这些缓存存储了频繁使用的数据，但在多处理器环境中，缓存的一致性成为了下一个问题。
当CPU中某个处理器对缓存中的共享变量进行了操作后，其他处理器会有个嗅探机制。即将其他处理器共享变量的缓存失效，当其他线程读取时会重新从主内存中读取最新的数据，这是基于`MESI`缓存一致性协议来实现的。

在多线程环境中，CAS就是比较当前线程工作内存中的值和主内存中的值，如果相同则执行规定操作，否则继续比较，直到主内存和当前线程工作内存中的值一致为止。
每个CPU核心都有自己的缓存，用于存储频繁访问的数据。当一个线程在某个CPU核心上修改了共享变量的值时，其他CPU核心上缓存中的该变量会被标记为无效，这样其他线程再访问该变量时就会重新从主内存中获取最新值，从而保证了数据的一致性。
CAS操作通过CPU提供的原子指令`cmpxchg`来比较和交换变量的值，它的原子性和线程安全性依赖于CPU的硬件支持和缓存一致性协议的保障。

![CPU多级缓存](/iblog/posts/annex/images/essays/CPU多级缓存.jpg)

所以当执行CAS方法时，读取变量当前的值，并与预期值进行比较。如果变量的当前值等于预期值，则将其更新为新值。如果变量的当前值不等于预期值，则不执行更新操作。
注意CAS操作是原子的，即整个过程不会被其他线程打断。
```java
public final int getAndAddInt(Object var1, long var2, int var4) {
        int var5;
        do {
            var5 = this.getIntVolatile(var1, var2);
        } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));
        return var5;
}
```

### CAS问题
- 循环时间长开销：CAS操作在失败时会进行自旋重试，即反复尝试CAS操作直到成功或达到一定的重试次数。自旋次数过多可能会影响性能，因此在使用CAS时需要权衡自旋次数和性能之间的关系。
  例如`getAndAddInt`方法执行，如果CAS失败会一直会进行尝试，如果CAS长时间不成功，可能会给CPU带来很大的开销。
    ```java
    public final int getAndAddInt(Object var1, long var2, int var4) {
            int var5;
            do {
                var5 = this.getIntVolatile(var1, var2);
            } while(!this.compareAndSwapInt(var1, var2, var5, var5 + var4));
            return var5;
    }
    ```
- 原子性问题：CAS操作本身是原子的，即在执行过程中不会被中断。但需要注意的是，CAS操作是针对单个变量的原子操作，而对于判断某个变量的值并根据结果进行另外的操作，需要额外的控制确保整体的原子性。
  这个时候就可以用锁来保证原子性，但是Java从1.5开始JDK提供了`AtomicReference`类来保证引用对象之间的原子性，可以把多个变量放在一个对象里来进行CAS操作。
    ```java
    public class AtomicReferenceSimpleExample {
        static class DataObject {
            private int var1;
            private String var2;
    
            public DataObject(int var1, String var2) {
                this.var1 = var1;
                this.var2 = var2;
            }
        }
    
        public static void main(String[] args) {
            // 创建一个 AtomicReference 实例，并初始化为一个 DataObject 对象
            AtomicReference<DataObject> atomicRef = new AtomicReference<>(new DataObject(1, "Initial"));
    
            // 执行 CAS 操作，修改 DataObject 对象的属性
            atomicRef.updateAndGet(data -> {
                data.setVar1(data.getVar1() + 10);
                data.setVar2("Updated");
                return data;
            });
    
            // 获取修改后的值
            DataObject updatedObject = atomicRef.get();
            System.out.println("Updated var1: " + updatedObject.getVar1());
            System.out.println("Updated var2: " + updatedObject.getVar2());
        }
    }
    ```
- ABA问题：ABA问题指的是，在CAS操作过程中，如果一个变量的值从A变成了B，然后再变回A，那么CAS操作会错误地认为变量的值未改变过。
  比如，线程1从内存位置V取出A，线程2同时也从内存取出A，并且线程2进行一些操作将值改为B，然后线程2又将V位置数据改成A，这时候线程1进行CAS操作发现内存中的值依然时A，然后线程1操作成功。尽管线程1的CAS操作成功，但是不代表这个过程没有问题。
  简而言之就是只比较结果，不比较过程。解决ABA问题的常见方法是使用版本号或者标记来跟踪变量的变化。
    ````java
    public class ABASolutionWithVersion {
        public static void main(String[] args) {
            // 初始值为100，初始版本号为0
            AtomicStampedReference<Integer> atomicRef = new AtomicStampedReference<>(100, 0);
    
            int[] stampHolder = new int[1]; // 用于获取当前版本号
            int expectedValue = 100; // 期望值
            int newValue = 200; // 新值
    
            // 模拟一个线程进行 ABA 操作
            new Thread(() -> {
                int stamp = atomicRef.getStamp(); // 获取当前版本号
                atomicRef.compareAndSet(expectedValue, newValue, stamp, stamp + 1); // 修改值和版本号
                atomicRef.compareAndSet(newValue, expectedValue, stamp + 1, stamp + 2); // 再次修改回原值和新版本号
            }).start();
    
            // 其他线程进行 CAS 操作
            new Thread(() -> {
                int stamp = atomicRef.getStamp(); // 获取当前版本号
                boolean result = atomicRef.compareAndSet(expectedValue, newValue, stamp, stamp + 1);
                System.out.println("CAS Result: " + result); // 输出CAS操作结果
            }).start();
        }
    }
    ````