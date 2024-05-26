---
title: "Java内存区域划分"
date: 2024-05-26
draft: false
tags: ["Java", "JVM"]
slug: "java-memory-divide"
---

Java 虚拟机在执行 Java 程序的过程中会把它管理的内存划分成若干个不同的数据区域。

堆空间内部结构，JDK1.8之后 永久代 替换成 元空间。
<div style="width: 48%;display: inline-block">
    <img src="/iblog/posts/annex/images/essays/jvm1.8之前.png" alt="jvm1.8之前">
</div>
<div style="width: 48%;display: inline-block">
    <img src="/iblog/posts/annex/images/essays/jvm1.8.png" alt="jvm1.8">
</div>



