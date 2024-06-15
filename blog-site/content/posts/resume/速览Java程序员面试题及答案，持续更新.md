---
title: "【置顶】速览Java程序员面试题及答案，持续更新..."
date: 2024-05-01
draft: false
tags: ["面试","Java"]
slug: "interview-junior-javaer"
weight: 1
---

为方便面试复习，本文几乎涵盖了Java所有的知识点，包括：Java基础、网络与安全、常见框架、分布式服务治理、数据库、常见算法等。
如果全都理解并吸收，相信你能轻松通过大部分面试。

字数较多，为了方便阅读，本文只是简短的概述了面试题的答案，在此不做详细解析，如要详细解析，本文所有的知识点都能在此博客上找到对应的答案。
如有遗漏或错误，欢迎在评论留言补充，我会及时的修正。

## Java基础
### 多线程
#### 说说线程池工作流程
#### 说说synchronized工作原理
#### 说说ReentrantLock、AQS原理
#### CAS原理知道吗
#### ThreadLocal用过吗
#### 在多线程并发中怎么保证线程安全

### 集合
#### HashMap是怎么存储数据
#### HashMap的怎么扩容
#### ArrayList怎么扩容
#### 线程安全集合用过吗
#### 什么时候需要重写equals与hashCode
#### 怎么克隆一个集合


### IO与序列化
- [AIO、BIO、NIO等，IO模型](/iblog/posts/java/rookie-io/#io模型httphollischuanggiteeiotobetopjavaerbasicsjava-basiclinux-ioidlinux-5种io模型)
- [Java序列化底层原理](/iblog/posts/java/rookie-io/#序列化底层原理httphollischuanggiteeiotobetopjavaerbasicsjava-basicserialize-principleid序列化底层原理)
- [序列化与单例模式](/iblog/posts/java/rookie-io/#序列化与单例模式httphollischuanggiteeiotobetopjavaerbasicsjava-basicserialize-singletonid序列化对单例的破坏)

### 设计模式

### 常见算法
#### 手写一个负载算法
#### 排序算法知道几种
#### 手写一个二分查找
#### KMP算法知道吗

### JVM
- [JVM内存区域划分及功能](/iblog/posts/jvm/java-memory-divide/#java内存区域划分)
- [Java类加载机制](/iblog/posts/jvm/java-memory-divide/#java类加载机制)
- [JVM垃圾回收机制](/iblog/posts/jvm/java-memory-divide/#jvm垃圾回收机制iblogpostsjvmjava-garbage-collection)
- [JVM参数调优](/iblog/posts/essays/java-always-problems/#jvm参数调优)

### 网络与安全
- [网络协议](/iblog/posts/essays/net-program-java/#网络协议)
- [Socket](/iblog/posts/essays/net-program-java/#socket)
- SQL注入
- CSRF攻击
- XSS攻击


## 常见框架
### Redis与缓存
- [缓存击穿、缓存穿透、缓存雪崩](/iblog/posts/essays/java-redis/#redis与缓存)
- [Redis数据类型](/iblog/posts/essays/java-redis/#redis数据类型)
- [Redis AOF、RDB持久化机制](/iblog/posts/essays/java-redis/#redis持久化)
- [Redis部署策略](/iblog/posts/essays/java-redis/#redis部署策略)
- [Redis分布式锁](/iblog/posts/essays/java-redis/#redis分布式锁)
- [Redis事务](/iblog/posts/essays/java-redis/#redis事务)
- [Redis内存淘汰策略](/iblog/posts/essays/java-redis/#redis内存淘汰策略)
- [Redis大Key问题](/iblog/posts/essays/java-redis/#redis大key问题)
- [Redis双写一致性问题](/iblog/posts/essays/java-redis/#redis数据库双写一致性问题)

### JMS消息模型与Kafka
- [点对点、发布订阅消息模型](/iblog/posts/essays/java-mq/#jms消息模型)
- [Kafka发布订阅工作流程](/iblog/posts/essays/java-mq/#发布订阅工作流程)
- [Kafka生产者数据存储](/iblog/posts/essays/java-mq/#生产者文件存储)
- [Kafka生产者数据可靠性保证](/iblog/posts/essays/java-mq/#生产者数据可靠性保证)
- [Kafka生产者数据一致性保证](/iblog/posts/essays/java-mq/#生产者数据一致性保证)
- [Kafka生产者ack机制](/iblog/posts/essays/java-mq/#生产者ack机制)
- [ExactlyOnce与事务机制](/iblog/posts/essays/java-mq/#kafka事务)
- [Kafka消费分配策略](/iblog/posts/essays/java-mq/#消费者分区分配策略)
- [Kafka重复消费和漏消费](/iblog/posts/essays/java-mq/#消费者消费数据问题)
- [Kafka消息积压](/iblog/posts/essays/java-mq/#消息积压)
- [对比其他MQ特点及使用场景](/iblog/posts/essays/java-mq/#常见mq对比)

### Elasticsearch
- [特点及使用场景]()
- [读数据流程](/iblog/posts/essays/elasticsearch/#读数据流程)
- [写数据流程](/iblog/posts/essays/elasticsearch/#写数据流程)
- [更新数据流程](/iblog/posts/essays/elasticsearch/#更新流程)
- [搜索数据流程](/iblog/posts/essays/elasticsearch/#搜索数据过程)
- [文档搜索、近实时搜索](/iblog/posts/essays/elasticsearch/#文档搜索)
- [在数据量很大的情况下，如何提高查询效率](/iblog/posts/essays/elasticsearch/#优化)

### Netty
- [Netty使用优缺点、场景](/iblog/posts/essays/java-netty/#概述)
- [Netty Reactor模型](/iblog/posts/essays/java-netty/#线程模型演变)
- [TCP粘包、拆包及解决方案](/iblog/posts/essays/java-netty/#tcp粘包拆包及解决方案)

### Spring
- [对Spring的理解](/iblog/posts/spring/java-spring/#对spring的理解)
- [Bean生命周期](/iblog/posts/spring/java-spring/#bean的生命周期)
- [Bean自动装配原理](/iblog/posts/spring/java-spring/#bean的自动装配)
- [IOC容器启动流程](/iblog/posts/spring/java-spring/#spring启动流程)
- [AOP动态代理](/iblog/posts/spring/java-spring/#aop)
- [Spring循环依赖与三级缓存](/iblog/posts/spring/java-spring/#spring循环依赖与三级缓存)
- [Spring事务传播与隔离级别](/iblog/posts/spring/java-spring/#spring循环依赖与三级缓存)


## 分布式
### 为什么要用微服务
### 从单体架构迁移到微服务架构
### 服务治理治的是什么
### 分布式断路思想与Hystrix
### 微服务网关Spring Cloud Gateway
### Base、CAP分布式事务
### 分布式锁
### 分布式ID


## 数据库
### 数据库基础
#### 存储结构
#### 索引与存储引擎
#### 事务隔离级别
#### 行锁和表锁

### 分库分表
#### 为什么要分库分表
#### 分库分表拆分方案
#### 分库分表迁移方案

### 索引与SQL优化
#### 怎么排查慢SQL
#### SQL优化思路
#### SQL优化方法


## 实际问题
### 线上遇到接口很慢怎么处理
### 线上CPU突然飚高怎么处理
### 死锁了怎么办
### 内存泄漏怎么排查怎么处理
### 如何处理数据量较大的情况


## 设计示例代码
- [管道流设计模式结合业务](/iblog/posts/essays/pipeline-business/)
- [整合支付功能](/iblog/posts/essays/pay-code/)
- [整合文件上传功能](/iblog/posts/essays/uploadfile-code/)
