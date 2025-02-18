---
title: "速览Java程序员面试题及答案，持续更新..."
date: 2024-06-17
draft: false
tags: ["面试","Java","持续更新"]
slug: "interview-junior-javaer"
top: true
---

为方便面试，不至于在网上像一个无头苍蝇乱翻，整理了一系列关于面试的资料。本系列文章几乎涵盖了Java所有的知识点，包括：Java基础、网络与安全、常见框架、分布式服务治理、数据库、算法与数据结构、开发中遇到的一些问题以及一些架构设计方案。 如果全都理解并吸收，相信你能轻松吊打绝大多数面试官。

本系列中的面试题更偏向于底层，为方便阅读，在此只简短概述面试题的答案，不做详细解析。 我承诺本资料完全公开免费，资料中的面试题，大多为原创，但也有小部分参考于网络，我将尽可能的把问题和答案概括的通俗易懂。

本人时间精力有限，如有遗漏或错误，欢迎在评论留言补充，我会及时的完善修正。 目录如下：

# Java基础

## 基础汇总
### [如何复制对象](/posts/java/javainterview/java-object-replication)
### [String类为什么设计成不可变的](/posts/java/javainterview/java-string-final)
### [String类型变量有没有长度限制](/posts/java/javainterview/java-string-howlong)
### 简述反射以及它的应用场景
在Java程序运行状态中，对于任意一个实体类，都能够知道这个类的所有属性和方法，对于任意一个对象，都能够调用它的任意方法和属性，以及使用该信息来创建、操作和销毁对象。
这种动态获取信息以及动态调用对象方法的功能称为Java语言的反射机制。

把Java程序比喻成一个复杂的机器，但是每个零件都是封装在盒子里面的，你无法直接看到里面的具体构造。
反射就像是你用一种特殊的工具，可以打开这些盒子并查看里面的零件，甚至可以重新组装它们或者在需要的时候加入新的零件。
这种能力让你在机器运行时能够动态地调整和改进它的组件，但是打开和处理每个盒子都需要额外的时间和努力，因此使用反射可能会带来一些性能上的成本。

Java反射在许多场景中都有广泛的应用，主要包括以下方面：
- 最常见的是搭配注解使用，获取运行时的方法参数、注解值。在许多框架中有对应的示例，比如Spring的`@Autowired`、`@Value`等注解；
- 动态代理也是基于反射来实现的。在运行时生成代理类，通过反射，可以动态地创建代理类，并在运行时将方法调用转发给目标对象；

### 简述Java中的泛型是如何实现的
Java中的泛型通过一种称为类型擦除的机制实现。声明了泛型的`.java`源代码，在编译生成`.class`文件之后，泛型相关的信息就消失了。
可以认为源代码中泛型相关的信息，就是提供给编译器用的，泛型信息对Java编译器可以见，而对Java虚拟机不可见。

关于如何实现泛型，Java官方文档中有对应的解释，[原文](https://docs.oracle.com/javase/tutorial/java/generics/erasure.html)如下：
```text
Generics were introduced to the Java language to provide tighter type checks at compile time and to support generic programming. To implement generics, the Java compiler applies type erasure to:

- Replace all type parameters in generic types with their bounds or Object if the type parameters are unbounded. The produced bytecode, therefore, contains only ordinary classes, interfaces, and methods.
- Insert type casts if necessary to preserve type safety.
- Generate bridge methods to preserve polymorphism in extended generic types.

Type erasure ensures that no new classes are created for parameterized types; consequently, generics incur no runtime overhead.
```

以下是实现类型擦除的步骤：
1. 当你写泛型代码时，Java编译器会在编译阶段进行类型检查，确保你使用的类型是正确的。例如，如果你声明一个`List<String>`，编译器会确保你只能向这个列表添加字符串；
2. 一旦编译完成，所有的泛型类型信息都会被移除，这个过程叫做“类型擦除”。在类型擦除过程中：
   - 泛型类型参数被替换：所有的泛型类型参数会被替换为它们的上界（如果没有指定上界，就替换为`Object`）。
   - 插入必要的类型转换：在必要的地方，编译器会插入类型转换，以确保类型安全。
3. 当泛型类被继承，并且子类使用具体类型时，编译器会生成桥接方法来保证子类的方法正确覆盖父类的方法。桥接方法是编译器自动生成的，用来保证多态性和类型一致性；
   <br><br>假设有一个父类和一个子类：
    ```java
    class Parent<T> {
        public T getValue() {
            return null;
        }
    }
    
    class Child extends Parent<String> {
        @Override
        public String getValue() {
            return "child value";
        }
    }
    ```
    编译后，`Child`类中会有一个桥方法：
    ```java
    class Child extends Parent<String> {
        @Override
        public String getValue() {
            return "child value";
        }
    
        // 生成的桥方法
        @Override
        public Object getValue() {
            return getValue(); // 调用实际的getValue方法
        }
    }
    ```

### new Integer(12)与int b=12是否相等
这道题考察的是Integer缓存池。`Integer`缓存池的大小默认为`-128~127`。
所以`Integer`、`int `在 `-127~128`之间是不会创建新的对象的，即
```
 Integer a = new Integer(12);
 int b = 12;
 System.out.println(a==b);//true
```

### new String("abc")会产生几个对象
答案两个字符串对象，前提是`String`常量池中还没有 "abc" 字符串对象。
第一个对象是"abc"，它属于字符串字面量，因此编译时期会在字符串常量池中创建一个字符串对象，指向这个 "abc" 字符串字面量，而使用`new`的方式会在堆中创建一个字符串对象。

来证明一下，到底是不是创建了两个对象，先看一下JDK8 中`new String()`源代码：
```java
/**
 * Initializes a newly created {@code String} object so that it represents
 * the same sequence of characters as the argument; in other words, the
 * newly created string is a copy of the argument string. Unless an
 * explicit copy of {@code original} is needed, use of this constructor is
 * unnecessary since Strings are immutable.
 *
 */
public String(String original) {
    this.value = original.value;
    this.hash = original.hash;
}
```
文档注释大意：初始化新创建的`String`对象，使其表示与实参相同的字符序列，换句话说，新创建的字符串是实参字符串的副本。
除非需要显式复制形参的值，否则没有必要使用这个构造函数，因为字符串是不可变的。

用字节码看一下，创建一个测试类，其`main`方法中使用这种方式来创建字符串对象。
```java
public class MainTest {
    public static void main(String[] args) {
        String s = new String("abc");
    }
}
```

使用`javap -verbose`命令进行反编译，得到以下内容：
```
// ...
Constant pool:
// ...
   #2 = Class              #18            // java/lang/String
   #3 = String             #19            // abc
// ...
  #18 = Utf8               java/lang/String
  #19 = Utf8               abc
// ...

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=3, locals=2, args_size=1
         0: new           #2                  // class java/lang/String
         3: dup
         4: ldc           #3                  // String abc
         6: invokespecial #4                  // Method java/lang/String."<init>":(Ljava/lang/String;)V
         9: astore_1
// ...
```
在`Constant Pool`中，`#19`存储这字符串字面量`"abc"`，`#3`是`String Pool`的字符串对象，它指向`#19`这个字符串字面量。
在`main`方法中，`0:`行使用`new #2`在堆中创建一个字符串对象，并且使用`ldc #3`将`String Pool`中的字符串对象作为`String`构造函数的参数。
所以能看到使用`new String()`的方式创建字符串是创建两个对象。

## 多线程
### 说说你对并发编程的理解
### 简述线程池工作原理
### 简述线程池中线程复用的原理
### 简述synchronized作用及原理
### 简述synchronized锁升级过程
### 简述volatile作用及原理
### AQS知道吗
### CAS知道吗
### 简述ThreadLocal原理及使用场景
### 如何避免ThreadLocal内存泄漏
### 谈谈你对线程安全的理解
### 什么是乐观锁和悲观锁


## 集合
### HashMap底层是如何实现的
### HashMap底层为什么要用红黑树
### HashMap为什么不一开始就用红黑树代替链表
### HashMap怎么解决哈希冲突
### HashMap为什么负载因子默认是0.75
### HashMap如果指定容量大小为10，实际大小是多少
### HashMap初始化容量设置多少合适
### HashMap的怎么扩容
### ArrayList怎么扩容
### ArrayList如何安全删除
### 什么是fail-fast和fail-safe
### ArrayList与LinkedList区别是什么
### HashSet如何保证数据不重复
### 什么时候需要重写equals与hashCode
### ConcurrentHashMap是如何实现高并发的
### CopyOnWriteArrayList的原理是什么


## IO与序列化
### 如何序列化
### serialVersionUID作用
### 如何自定义的序列化和反序列化策略
### 为什么序列化可以破坏单例了
### NIO、BIO、AIO分别是什么
### IO复用模型及NIO实现原理
### 什么是零拷贝
### 简述Direct-Buffer和Heap-Buffer的区别


## 设计模式
### 为什么要用设计模式
### 谈谈你对设计模式的理解
### 平时开发过程中怎样使用设计模式
### 简述静态代理和动态代理区别及使用场景
### 简述模板设计模式
### 简述策略设计模式
### 简述职责链设计模式


## 数据结构与算法
### 手写一个负载算法
### 手写一个限流算法
### 排序算法知道几种
### 手写二分查找
### KMP算法知道吗
### 手写二叉树的遍历方式
### 怎么反转一个链表
### 怎么实现LRU缓存
### 用两个栈实现一个队列
### 简述B树及其应用场景
### 简述跳表及应用场景



## JVM
### 简述JVM内存区域划分
### 简述对象实例化过程
### 简述对象的组成
### 简述Java类加载机制
### 哪些对象可以作为GCRoots
### 调用System.gc会进行垃圾回收吗
### finalize方法作用是什么
### 简述对象分配内存步骤
### 如何判定一个对象是否是垃圾
### 简述CMS工作原理
### 简述G1工作原理
### 为什么要有很多垃圾回收器
### 什么时候会触发FullGC
### 频繁FullGC如何处理
### 你平时怎么对JVM参数调优
### 简述逃逸分析及其对性能影响


## 网络与安全
### 计算机网络为什么要分层
### TCP为什么要握手三次挥手四次
### TCP如何实现可靠传输
### 简述DNS解析过程
### HTTP与HTTPS区别
### HTTPS工作原理知道吗
### SSL四次握手过程
### 简述非对称加密与对称加密
### 如何自定义一个网络协议
### 分别简述Session、Cookie、Token
### 如何实现跨域
### 如何防范SQL注入
### 如何防范CSRF攻击
### 如何防范XSS攻击
### 简述放火墙的工作原理



# 常见框架

## Redis
### 缓存击穿、缓存穿透、缓存雪崩解决方案
### 为什么要使用Redis
### Redis为什么这么快
### 简述Redis线程模型
### Redis数据类型有几种
### 简述Redis持久化机制
### 简述Redis主从复制
### Redis内存用完了会怎样
### 怎么理解Redis事务
### 如何实现Redis分布式锁
### 手写一下Redis分布式锁lua脚本
### 当key设置过期时间，需要注意什么
### 怎么处理Redis中的大Key
### Redis双写一致性问题
### 简述Redis的LRU实现原理


## Kafka
### 为什么要使用Kafka
### 简述Kafka架构设计
### 简述Kafka发布订阅工作流程
### 生产者数据如何存储
### 生产者数据如何保证可靠性
### 生产者数据如何保证一致性
### Kafka的日志分段存储机制是怎样的
### 简述Kafka生产者ack机制
### 简述ExactlyOnce与事务机制
### 简述Kafka消费分配策略
### Kafka中如何保证顺序消费
### 如何解决重复消费和漏消费
### Kafka消息积压怎么处理
### 简述Kafka分区选举策略


## Elasticsearch
### 为什么要使用Elasticsearch
### 简述搜索流程
### 简述索引文档的流程
### 简述写数据流程
### 简述更新、删除数据流程
### 简述近实时搜索
### 谈谈分词与倒排索引原理
### ES的master选举流程
### ES如何实现高可用
### ES的深度分页与滚动搜索
### 数据量很大的情况下，如何提高查询效率


## Netty
### 为什么要使用Netty
### Netty高性能体现在哪里
### TCP粘包、拆包怎么解决
### 简述NettyIO线程模型
### 说说Netty的零拷贝
### 简述mpsc无锁编程
### 简述select、poll和epoll区别
### Netty的长连接、心跳机制了解吗
### 简述Netty对象池技术
### 如何选择序列化协议


## Spring
### 说说对Spring的理解
### 简述Bean生命周期
### 简述@Autowired自动装配原理
### 简述IOC容器启动流程
### 简述AOP动态代理原理
### 如何解决Spring循环依赖
### 简述Spring事务实现方式及原理
### 使用@Transactional需要注意什么
### 当@Transactional遇到锁需要注意什么


# 分布式
## 为什么要用微服务
## 怎么从单体架构迁移到微服务架构
## 服务治理治的是什么
## 简述负载均衡
## Base、CAP分布式事务知道吗
## 简述Hystrix断路器原理
## 简述SpringCloud Gateway工作原理
## Nacos中保证的是CP还是AP
## Seta工作原理
## Sentinel工作原理
## 简述分布式锁
## 分布式系统中如何实现全局唯一ID


# 数据库
## 简述MySQL索引数据结构
## 简述MySQL索引的实现
## 简述MySQL索引设计原则
## 如何避免索引失效
## 简述事务ACID
## MVCC知道吗
## MySQL都有什么锁
## 为什么要分库分表
## 分库分表怎么拆分
## 分库分表数据怎么迁移
## 简述MySQL主从复制原理
## 怎么排查慢SQL
## 说说怎么优化慢SQL


# 实际问题
## 线上遇到接口很慢怎么处理
## 线上CPU突然飚高怎么处理
## 死锁了怎么办
## 内存泄漏怎么排查怎么处理
## 内存溢出了怎么处理
## 如何处理数据量较大的情况


# 架构设计
## 设计一个二级缓存
## 设计一个流程引擎
## 设计一个分布式ID生成系统
## 设计一个内存池
