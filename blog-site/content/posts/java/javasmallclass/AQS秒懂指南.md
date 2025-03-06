---
title: "AQS秒懂指南"
date: 2025-03-06
draft: false
tags: ["Java小课堂","Java","随笔"]
slug: "java-concurrent-understand-aqs"
---


## 并发世界的红绿灯
假设奶茶店只有1个收银台，如何让100个顾客有序排队？这就是AQS（AbstractQueuedSynchronizer）要解决的问题，管理多线程对共享资源的访问规则。

AQS是指`java.util.concurrent.locks`包下的一个抽象类`AbstractQueuedSynchronizer`译为，抽象的队列**同步器**。
> 同步器是在多线程编程中用于管理线程间协作和同步的机制。同步器通常用于协调线程的执行顺序、控制共享资源的访问以及管理线程的状态。常见的同步器包括：CountDownLatch、CyclicBarrier、Semaphore等。

在JUC包下，能够看到有许多类都继承了AQS，如`ReentrantLock`、`CountDownLatch`、`ReentrantReadWriteLock`、`Semaphore`。
它就像一套乐高积木，开发者只需继承AQS并实现几个关键方法，就能快速构建自己的同步器。

![JUC.locks包UML](/posts/annex/images/essays/JUC.locks包UML.png)


## 一张图看透底层设计
![AQS](/posts/annex/images/essays/AQS.png)

AQS可以理解为一个框架，因为它定义了一些JUC包下常用"锁"的标准。AQS简单来说，包含一个`state`状态变量和一个CLH队列。
- `state`状态变量：一个volatile int值，保存线程持有锁的状态，用于判断该线程获没获取到锁，没获取到锁就去队列中排队；
- CLH队列：CLH队列是（Craig， Landin， and Hagerste[三个人名组成]）锁队列的变体，是一个双向队列，让线程公平排队。
队列中的元素即`Node`结点，每个`Node`中包含：头结点、尾结点、等待状态、存放的线程等。`Node`遵循从尾部入队，从头部出队的规则，即先进先出原则。

在多线程并发环境下，使用`lock`加锁，当处在加锁与解锁之间的代码，只能有一个线程来执行。这时候其他线程不能够获取锁，如果不处理线程就会造成了堵塞。
在AQS框架中，会将暂时获取不到锁的线程加入到队列里，这个队列就是AQS的抽象表现。它会将这些线程封装成队列的结点，通过CAS、自旋以及`LockSupport.park()`的方式，维护`state`变量的状态，使并发达到同步的效果。

在使用时，开发者只需实现`tryAcquire()`和`tryRelease()`等钩子方法，就能快速构建自己的同步器。


## 手写极简锁，秒懂AQS核心
当你能用**50行代码**实现一个工业级锁的核心逻辑，就会理解：
- AQS的精华不是复杂的队列管理，而是**状态机思维**
- 高并发设计的本质是**用确定性的规则，管理不确定的线程竞争**

### 第一步：定义锁骨架
```java
// 1. 创建自定义锁  
public class MyLock {  
    private final Sync sync = new Sync(); // 核心：AQS实现类  

    // 2. 继承AQS实现同步逻辑  
    private static class Sync extends AbstractQueuedSynchronizer {  
        // 后续步骤在此补充  
    }  

    // 3. 对外暴露加锁/解锁接口  
    public void lock() { sync.acquire(1); }  
    public void unlock() { sync.release(1); }  
}  
```
### 第二步：实现抢锁逻辑
```java
// 在Sync类中添加：  
@Override  
protected boolean tryAcquire(int acquires) {  
    // CASE 1：无锁状态直接抢  
    if (getState() == 0 && compareAndSetState(0, 1)) {  
        setExclusiveOwnerThread(Thread.currentThread());  
        return true;  
    }  
    // CASE 2：已持有锁（支持重入）  
    else if (getExclusiveOwnerThread() == Thread.currentThread()) {  
        setState(getState() + 1); // state计数+1  
        return true;  
    }  
    return false; // 抢锁失败  
}  
```
要点速记：
- `compareAndSetState`：CAS原子操作
- `setExclusiveOwnerThread`：记录持有线程

### 第三步：实现释放逻辑
```java
// 在Sync类中添加：  
@Override  
protected boolean tryRelease(int releases) {  
    if (Thread.currentThread() != getExclusiveOwnerThread()) {  
        throw new IllegalMonitorStateException(); // 非持有线程禁止释放  
    }  
    int newState = getState() - 1;  
    boolean isFree = (newState == 0);  
    if (isFree) setExclusiveOwnerThread(null);  
    setState(newState); // 更新state  
    return isFree;  
} 
```
避坑指南：
- 必须校验线程身份
- `state`归零时清空持有线程

### 第四步：使用示例
```java
MyLock lock = new MyLock();  

// 线程任务（Lambda简化版）  
Runnable task = () -> {  
    lock.lock();  
    try {  
        System.out.println(Thread.currentThread().getName() + "抢到锁");  
        Thread.sleep(500);  
    } finally {  
        lock.unlock();  
    }  
};  

// 启动3个线程测试  
new Thread(task).start();  
new Thread(task).start();  
new Thread(task).start();  
```

输出效果：
```text
Thread-0抢到锁  
Thread-2抢到锁  
Thread-1抢到锁  
```



