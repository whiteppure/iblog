---
title: "Java程序员面试题（持续更新）"
date: 2024-05-01
draft: false
tags: ["面试","Java"]
slug: "interview-junior-javaer"
---

## 非专业性问题
### [自我介绍一下](/iblog/posts/resume/interview-questions-and-answers/#自我介绍)
### [你有什么职业规划](/iblog/posts/resume/interview-questions-and-answers/#你的职业规划是什么)
### [你为什么要离职](/iblog/posts/resume/interview-questions-and-answers/#你从上一家公司离职的原因)
### [说一下你的优缺点](/iblog/posts/resume/interview-questions-and-answers/#优缺点)
### [你的期望薪资是多少](/iblog/posts/resume/interview-questions-and-answers/#面试如何谈薪资httpswwwbilibilicomvideobv1ou411f7r4)
### [你为什么要选择我们公司](/iblog/posts/resume/interview-questions-and-answers/#你为什么要选择我们公司)
### [你能否接受加班](/iblog/posts/resume/interview-questions-and-answers/#你能否接受加班httpswwwbilibilicomvideobv1vj411y7ni)
### [你有对象了吗](/iblog/posts/resume/interview-questions-and-answers/#你有对象吗)
### [你还有什么问题要问的吗](/iblog/posts/resume/interview-questions-and-answers/#你还有什么想问的吗)


## 专业问题

### Java基础
#### 1.多线程
- [线程池](/iblog/posts/java/rookie-multi-thread/#线程池)
- [Synchronized 原理及锁升级](/iblog/posts/java/rookie-multi-thread/#synchronized)
- [ReentrantLock、AQS、CAS 原理](/iblog/posts/java/rookie-multi-thread/#reentrantlock原理)
- [ThreadLocal 场景、原理](/iblog/posts/java/rookie-multi-thread/#threadlocal)
- [避免死锁问题](/iblog/posts/java/rookie-multi-thread/#如何避免死锁)
- [线程安全](/iblog/posts/java/rookie-multi-thread/#线程安全)

#### 2.集合
- [HashMap 存储结构、扩容](/iblog/posts/essays/java-hashmap/)
- [ArrayList 存储、扩容](/iblog/posts/java/rookie-java-container/#arraylist)
- [线程安全集合 ConcurrentHashMap、CopyOnWriteArrayList](/iblog/posts/java/rookie-multi-thread/#常用的线程安全的集合)

#### 3.JVM
- [JVM内存区域划分及功能](/iblog/posts/jvm/java-memory-divide/#java内存区域划分)
- [Java类加载机制](/iblog/posts/jvm/java-memory-divide/#java类加载机制)
- [JVM垃圾回收机制](/iblog/posts/jvm/java-memory-divide/#jvm垃圾回收机制iblogpostsjvmjava-garbage-collection)
- JVM参数调优
- JVM问题排查思路

#### 4.IO与序列化
- [AIO、BIO、NIO等，IO模型](/iblog/posts/java/rookie-io/#io模型httphollischuanggiteeiotobetopjavaerbasicsjava-basiclinux-ioidlinux-5种io模型)
- [Java序列化底层原理](/iblog/posts/java/rookie-io/#序列化底层原理httphollischuanggiteeiotobetopjavaerbasicsjava-basicserialize-principleid序列化底层原理)
- [序列化与单例模式](/iblog/posts/java/rookie-io/#序列化与单例模式httphollischuanggiteeiotobetopjavaerbasicsjava-basicserialize-singletonid序列化对单例的破坏)

#### 5.常见算法
- [排序算法](/iblog/posts/essays/data-structures-algorithms/#排序算法)
- [二分查找](/iblog/posts/essays/data-structures-algorithms/#二分查找)
- [KMP算法](/iblog/posts/essays/data-structures-algorithms/#kmp算法)
- [负载算法](/iblog/posts/essays/java-small-service/#服务负载)

#### 6.网络与安全
- [网络协议](/iblog/posts/essays/net-program-java/#网络协议)
- [Socket](/iblog/posts/essays/net-program-java/#socket)
- SQL注入
- CSRF攻击
- XSS攻击



### 框架及分布式
#### 1.Redis与缓存
- [缓存击穿、缓存穿透、缓存雪崩](/iblog/posts/essays/java-redis/#redis与缓存)
- [Redis数据类型](/iblog/posts/essays/java-redis/#redis数据类型)
- [Redis AOF、RDB持久化机制](/iblog/posts/essays/java-redis/#redis持久化)
- [Redis部署策略](/iblog/posts/essays/java-redis/#redis部署策略)
- [Redis分布式锁](/iblog/posts/essays/java-redis/#redis分布式锁)
- [Redis事务](/iblog/posts/essays/java-redis/#redis事务)
- [Redis内存淘汰策略](/iblog/posts/essays/java-redis/#redis内存淘汰策略)
- [Redis大Key问题](/iblog/posts/essays/java-redis/#redis大key问题)
- [Redis双写一致性问题](/iblog/posts/essays/java-redis/#redis数据库双写一致性问题)

#### 2.JMS消息模型与Kafka
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

#### 3.Elasticsearch
- [特点及使用场景]()
- [读数据流程](/iblog/posts/essays/elasticsearch/#读数据流程)
- [写数据流程](/iblog/posts/essays/elasticsearch/#写数据流程)
- [更新数据流程](/iblog/posts/essays/elasticsearch/#更新流程)
- [搜索数据流程](/iblog/posts/essays/elasticsearch/#搜索数据过程)
- [文档搜索、近实时搜索](/iblog/posts/essays/elasticsearch/#文档搜索)
- [在数据量很大的情况下，如何提高查询效率](/iblog/posts/essays/elasticsearch/#优化)

#### 4.Netty
- [Netty使用优缺点、场景](/iblog/posts/essays/java-netty/#概述)
- [Netty Reactor模型](/iblog/posts/essays/java-netty/#线程模型演变)
- [TCP粘包、拆包及解决方案](/iblog/posts/essays/java-netty/#tcp粘包拆包及解决方案)

#### 5.Spring
- [对Spring的理解](/iblog/posts/spring/java-spring/#对spring的理解)
- [Bean生命周期](/iblog/posts/spring/java-spring/#bean的生命周期)
- [Bean自动装配原理](/iblog/posts/spring/java-spring/#bean的自动装配)
- [IOC容器启动流程](/iblog/posts/spring/java-spring/#spring启动流程)
- [AOP动态代理](/iblog/posts/spring/java-spring/#aop)
- [Spring循环依赖与三级缓存](/iblog/posts/spring/java-spring/#spring循环依赖与三级缓存)
- [Spring事务传播与隔离级别](/iblog/posts/spring/java-spring/#spring循环依赖与三级缓存)

#### 6.微服务分布式服务治理
- [为什么要用微服务](/iblog/posts/essays/java-small-service/#为什么要使用微服务)
- [从单体架构迁移到微服务架构](/iblog/posts/essays/java-small-service/#从单体架构迁移到微服务架构)
- [服务治理治的是什么](/iblog/posts/essays/java-small-service/#服务治理治的是什么)
- [分布式断路思想与Hystrix](/iblog/posts/essays/java-small-service/#服务熔断降级)
- [微服务网关Spring Cloud Gateway](/iblog/posts/essays/java-small-service/#spring-cloud-gateway)

#### 7.分布式架构基础
- [Base、CAP分布式事务](/iblog/posts/essays/java-transaction/#分布式事务基础理论)
- [分布式锁](/iblog/posts/essays/distributed-lock/)
- [分布式id](/iblog/posts/essays/distributed-id/)



### 数据库
#### 1.数据库基础
- 存储结构与数据库引擎
- 事务隔离级别
- [行锁和表锁](/iblog/posts/essays/sql-select-fast/#sql优化方法)

#### 2.分库分表
- [常见分库分表中间件](/iblog/posts/essays/sql-select-fast/#常见分库分表中间件)
- [拆分方案](/iblog/posts/essays/sql-select-fast/#拆分方案)
- [迁移方案](/iblog/posts/essays/sql-select-fast/#迁移方案)

#### 3.索引与SQL优化
- [排查慢SQL](/iblog/posts/essays/sql-select-fast/#排查sql)
- [SQL优化思路](/iblog/posts/essays/sql-select-fast/#优化思路)
- [SQL优化方法](/iblog/posts/essays/sql-select-fast/#sql优化方法)



### 场景问题
- [线上遇到接口很慢处理思路](/iblog/posts/essays/java-improve/#线上遇到接口很慢处理思路)
- [线上CPU飚高处理思路]()
- [数据量较大如何处理]()



### 设计示例代码
- [管道流设计模式结合业务](/iblog/posts/essays/pipeline-business/)
- [整合支付功能](/iblog/posts/essays/pay-code/)
- [整合文件上传功能](/iblog/posts/essays/uploadfile-code/)
