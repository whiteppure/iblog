---
title: "JVM中的直接内存"
date: 2021-04-14
draft: false
tags: ["Java", "JVM"]
slug: "jvm-direct-memory"
---

直接内存不是虚拟机运行时数据区的一部分，也不是《Java虚拟机规范》中定义的内存区域。直接内存是在Java堆外的、直接向系统申请的内存区间。
而且也可能导致`OutOfMemoryError`错误出现。操作直接内存演示代码：
```java
public class MainTest {
    public static void main(String[] args) {
        ByteBuffer allocate = ByteBuffer.allocate(1024 * 1024 * 1024);

        System.out.println("直接内存分配完成 ...");
        Scanner scanner = new Scanner(System.in);
        scanner.next();

        System.out.println("直接内存开始释放");
        System.gc();

        scanner.next();
        System.out.println("退出！");
    }
}
```

使用NIO，通过存在堆中的直接内存操作本地内存

![IO读写](/posts/annex/images/essays/IO读写.png)

![NIO读写](/posts/annex/images/essays/NIO读写.png)

通常，访问直接内存的速度会优于Java堆，即读写性能高。因此出于性能考虑，读写频繁的场合可能会考虑使用直接内存。Java的NIO库允许Java程序使用直接内存，用于数据缓冲区。
```java
public class MainTest {
    private static final int BUFFER = 1024 * 1024 * 20;
    public static void main(String[] args) {
        ArrayList<ByteBuffer> list = new ArrayList<>();
        int count = 0;
        try {
            while(true){
                ByteBuffer byteBuffer = ByteBuffer.allocateDirect(BUFFER);
                list.add(byteBuffer);
                count++;
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        } finally {
            System.out.println(count);
        }
    }
}
```
由于直接内存在Java堆外，因此它的大小不会直接受限于`-Xmx`指定的最大堆大小。
直接内存大小可以通过 `MaxDirectMemorySize` 设置，如果不指定，默认与堆的最大值`-Xmx`参数值一致。
系统内存是有限的，Java堆和直接内存的总和依然受限于操作系统能给出的最大内存。
所以直接内存也有一些缺点，分配回收成本较高和不受JVM内存回收管理。