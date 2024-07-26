---
title: "分布式ID详解"
date: 2023-03-13
draft: false
tags: ["分布式","详解"]
slug: "distributed-id"
---


## 分布式ID
在我们业务数据量不大的时候，单库单表完全可以支撑现有业务，数据再大一点搞个`MySQL`主从同步读写分离也能对付。
但随着数据日渐增长，主从同步也扛不住了，就需要对数据库进行分库分表。在分库之后， 数据遍布在不同服务器上的数据库，数据库的自增主键已经没办法满足生成的主键唯一了，这个时候就需要生成分布式`ID`了。

在分布式系统中，分布式`ID`的使用场景主要包括高并发请求、跨服务的数据一致性和多节点的唯一标识符生成。
例如，在电商平台中，为每个订单生成唯一的`ID`是非常重要的。一个高并发的电商系统可能有多个服务器同时处理订单请求，使用分布式`ID`可以避免`ID`冲突。
类似地，在微服务架构中，各个服务可能需要生成唯一的标识符来标记请求或数据记录。分布式`ID`使得这些标识符在整个系统中保持唯一，从而避免数据混乱或冲突。

分布式`ID`生成一般都需要满足这些条件：
- 全局唯一：必须保证`ID`是全局性唯一的，这是基本要求；
- 高性能：高可用低延时，`ID`生成响应要块，否则反倒会成为业务瓶颈；
- 高可用：100%的可用性是骗人的，但是也要无限接近于100%的可用性；
- 趋势递增：如果要把`ID`存放在数据库的话，`ID`的有序性可以提升数据库写入速度。并且很多时候，我们还很有可能会直接通过`ID`来进行排序；
- 安全：分布式`ID`中不包含敏感信息；

有以下常见几种实现分布式`ID`方式：

| 实现方式          | 描述                                      | 优点                                  | 缺点                                 | 实际使用场景                                    |
|-------------------|-----------------------------------------|--------------------------------------|--------------------------------------|------------------------------------------------|
| UUID              | 生成128位长的唯一标识符，通常表示为32个十六进制字符。 | 实现简单，生成速度快。                 | ID较长，可能影响性能和存储。             | 用户标识、数据跟踪、临时唯一标识。                   |
| Snowflake算法     | 生成64位长的ID，包括时间戳、机器ID和序列号。 | 高效，支持高并发；生成的ID有序。       | 需要配置机器ID，时间回退可能引发问题。     | 订单ID生成、分布式系统中的唯一标识符。               |
| 数据库自增ID      | 依赖数据库的自增字段生成唯一ID。             | 实现简单，适用于单数据库或小规模环境。 | 在高并发环境下可能成为瓶颈；存在单点故障风险。 | 传统数据库应用，如用户ID、订单ID。                 |
| Leaf算法          | 提供高性能的ID生成服务，分为ID生成器和ID分片。 | 高性能，支持高并发。                  | 配置和维护复杂。                        | 高并发系统中的唯一ID生成，如支付系统中的交易ID。      |
| Redis自增ID       | 使用Redis的自增功能生成唯一ID。              | 高性能，支持高并发。                  | 依赖Redis服务，可能成为单点故障。         | 高并发环境中的全局唯一ID生成，如广告投放系统。         |

处理上述这些方案外，利用系统当前时间也能实现。一般如果用这个方案，是将当前时间跟很多其他的业务字段拼接起来，作为一个`ID`，如果业务上你觉得可以接受，那么也是可以的。
你可以将别的业务字段值跟当前时间拼接起来，组成一个全局唯一的编号。

### UUID
`UUID`的全称是 "Universally Unique Identifier"，即通用唯一标识符。
`UUID`是一种128位长的唯一标识符，通常表示为32个十六进制字符，分为5组，形式为`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`，其中每个x表示一个十六进制数字。

`UUID`的生成算法有不同版本，每个版本采用不同的方法来确保唯一性。
- `UUIDv1`通过结合当前时间戳和机器的`MAC`地址生成唯一标识符。生成过程涉及获取当前时间的100纳秒级别精度的时间戳，加上机器的`MAC`地址，以及一个序列号（用于处理同一时间生成多个`UUID`的情况）。时间戳和`MAC`地址确保了`UUID`在全球范围内的唯一性。此版本的`UUID`在时间上有序，但可能会暴露生成`UUID`的计算机信息，适用于需要时间排序的场景。
- `UUIDv3`基于指定的名称和命名空间生成`UUID`。生成过程中，将名称与命名空间拼接后，通过`MD5`哈希算法计算出一个128位的哈希值，然后将其格式化为`UUID`。这种方法确保了相同的名称和命名空间组合总是生成相同的`UUID`。`UUIDv3`适用于需要根据相同名称和命名空间生成一致`UUID`的场景，例如，生成固定格式的`ID`。
- `UUIDv4`使用随机数生成128位的`UUID`，生成过程包括生成122位的随机数，并在`UUID`中设置特定的版本号（4）和变体位。这种`UUID`生成方法完全依赖随机数来保证唯一性，具有很高的随机性，生成过程简单且效率高。`UUIDv4`适合需要高性能和随机性的场景，如生成临时标识符或分布式系统中的唯一`ID`。
- `UUIDv5`类似于`UUIDv3`，但使用`SHA-1`哈希算法代替`MD5`来生成`UUID`。生成过程中，将指定的名称和命名空间拼接后，通过`SHA-1`计算出一个160位的哈希值，然后将其格式化为`UUID`，设置版本号为5。这种方法比`UUIDv3`更安全，适合需要基于名称生成`UUID`的场景，同时提供了更强的哈希安全性。

在实际开发中，`UUIDv4`是最常用的`UUID`版本。`UUIDv4`生成的`UUID`通过随机数确保唯一性，不依赖于时间戳或机器信息。在Java中，可以使用`java.util.UUID`类来生成`UUIDv4`。
```java
public class UUIDExample {
    public static void main(String[] args) {
        // 生成一个UUIDv4
        UUID uuid = UUID.randomUUID();
        System.out.println("生成的UUIDv4: " + uuid.toString());
    }
}
```
`UUID`一般不会作为主键使用，因为`UUID`太长了、占用空间大，作为主键性能太差了，且`UUID`不具有有序性，会导致B+树索引在写的时候有过多的随机写操作，总之就是无序的性能开销大。适合于随机生成个什么文件名、编号之类的。

### Snowflake算法
`Snowflake`算法又称雪花算法，是一种由`Twitter`开发的分布式`ID`生成算法，用于生成唯一的64位`ID`。这种算法特别适合于分布式系统，能够在多个节点上高效地生成唯一`ID`。

算法思路是是把一个64位的`long`型的`ID`，1个`bit`是不用的，用其中的`41bits`作为毫秒数，用`10bits`作为工作机器`ID`，`12bits`作为序列号。

| 位数范围      | 描述             |
| --------------|------------------|
| 0 - 1 bit     | 符号位            |
| 1 - 41 bits    | 时间戳部分        |
| 42 - 47 bits   | 数据中心ID        |
| 48 - 63 bits   | 工作机器ID        |
| 64 - 75 bits   | 序列号            |

- `0-1bit`：不用，为啥呢？因为二进制里第一个`bit`为如果是1，那么都是负数，但是我们生成的`ID`都是正数，所以第一个`bit`统一都是0；
- `1-41bit`：表示的是时间戳，单位是毫秒。`41bits`可以表示的数字多达`2^41 - 1`，也就是可以标识`2^41 - 1`个毫秒值，换算成年就是表示69年的时间；
- `42-47bit`：记录工作机器`ID`，代表的是这个服务最多可以部署在`2^10`台机器上，也就是1024台机器。但是`10bits`里5个`bits`代表机房`ID`，5个`bits`代表机器`ID`。意思就是最多代表`2^5`个机房（32 个机房），每个机房里可以代表 2^5 个机器（32 台机器）；
- `64-75bit`：这个是用来记录同一个毫秒内产生的不同`ID`，`12bits`可以代表的最大正整数是`2^12 - 1 = 4096` ，也就是说可以用这个`12bits`代表的数字来区分同一个毫秒内的4096个不同的`ID`；

雪花算法相对来说还是比较靠谱的，毫秒数在高位，自增序列在低位，整个ID都是趋势递增的。
不依赖数据库等第三方系统，以服务的方式部署，稳定性更高，生成ID的性能也是非常高的，能达到百万计`QPS`。但是雪花算法强依赖时钟，如果机器上时钟回拨，会导致发号重复或者服务会处于不可用状态。
为了规避雪花算法的缺点，一些国内的大厂做了改进，像美团的[Leaf](https://github.com/Meituan-Dianping/Leaf)，百度的[uid-generator](https://github.com/baidu/uid-generator)，都是基于雪花算法来实现的。
所以你要真是搞分布式 `ID`生成，如果是高并发啥的，那么用这个应该性能比较好，一般每秒几万并发的场景，也足够用了。

以下是一个`Snowflake`算法的简化Java实现，实际开发中可能直接引用第三方库。
```java
public class SnowflakeIdGenerator {
    private final long epoch = 1622548800000L; // 自定义Epoch时间
    private final long dataCenterIdBits = 5L;  // 数据中心ID位数
    private final long workerIdBits = 5L;      // 工作机器ID位数
    private final long sequenceBits = 12L;     // 序列号位数
    
    private final long maxDataCenterId = -1L ^ (-1L << dataCenterIdBits);
    private final long maxWorkerId = -1L ^ (-1L << workerIdBits);
    private final long sequenceMask = -1L ^ (-1L << sequenceBits);
    
    private long dataCenterId; // 数据中心ID
    private long workerId;     // 工作机器ID
    private long sequence = 0L; // 序列号
    private long lastTimestamp = -1L; // 上次生成ID的时间戳

    public SnowflakeIdGenerator(long dataCenterId, long workerId) {
        if (dataCenterId > maxDataCenterId || dataCenterId < 0) {
            throw new IllegalArgumentException("DataCenterId超出范围");
        }
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException("WorkerId超出范围");
        }
        this.dataCenterId = dataCenterId;
        this.workerId = workerId;
    }

    public synchronized long generateId() {
        long timestamp = System.currentTimeMillis();
        
        if (timestamp < lastTimestamp) {
            throw new RuntimeException("系统时间回退");
        }
        
        if (timestamp == lastTimestamp) {
            sequence = (sequence + 1) & sequenceMask;
            if (sequence == 0) {
                timestamp = waitNextMillis(timestamp);
            }
        } else {
            sequence = 0L;
        }
        
        lastTimestamp = timestamp;
        return ((timestamp - epoch) << (dataCenterIdBits + workerIdBits + sequenceBits)) |
               (dataCenterId << (workerIdBits + sequenceBits)) |
               (workerId << sequenceBits) |
               sequence;
    }

    private long waitNextMillis(long lastTimestamp) {
        long timestamp = System.currentTimeMillis();
        while (timestamp <= lastTimestamp) {
            timestamp = System.currentTimeMillis();
        }
        return timestamp;
    }
}
```

### 数据库自增ID
在分布式系统中，使用数据库自增`ID`作为分布式`ID`，通常涉及在一个集中式的数据库系统中生成自增`ID`，然后将其分发到分布式系统的各个节点。

在数据库中创建一个自增`ID`的表。每次需要新的`ID`时，向这个表插入一条记录，然后获取即可。
用数据库的自增`ID`功能，如`MySQL`的`AUTO_INCREMENT`，`PostgreSQL`的`SERIAL`等，用来保证ID的唯一性和递增性。

以下是一个简化的Java代码示例，演示如何从数据库中获取自增`ID`：
```java
public class DistributedIdGenerator {

    private Connection connection;

    public DistributedIdGenerator(String dbUrl, String user, String password) throws Exception {
        connection = DriverManager.getConnection(dbUrl, user, password);
    }

    public long getNextId() throws Exception {
        Statement statement = connection.createStatement();
        // 假设存在一个名为'id_generator'的表，其中包含一个自增列'next_id'
        ResultSet resultSet = statement.executeQuery("SELECT next_id FROM id_generator FOR UPDATE");
        if (resultSet.next()) {
            long nextId = resultSet.getLong("next_id");
            // 更新ID
            statement.executeUpdate("UPDATE id_generator SET next_id = next_id + 1");
            return nextId;
        } else {
            throw new RuntimeException("无法获取新的ID");
        }
    }

    public static void main(String[] args) {
        try {
            DistributedIdGenerator idGenerator = new DistributedIdGenerator("jdbc:mysql://localhost:3306/mydb", "user", "password");
            long newId = idGenerator.getNextId();
            System.out.println("生成的ID: " + newId);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
往一个库的一个表里插入一条没什么业务含义的数据，获取一个数据库自增的一个`ID`，拿到这个`ID`之后再往对应的分库分表里去写入。
缺点是高并发存在瓶颈，优点是简单方便。适用于并发不高，但是数据量太大导致的分库分表扩容，可能每秒最高并发最多就几百，那么就走单独的一个库和表生成自增主键即可。

### Leaf算法
`Leaf`算法是一种用于生成分布式唯一`ID`的算法，由美团点评开发。 
采用了基于`Snowflake`的设计思路，但将`ID`生成和`ID`管理分离。`Leaf-Server`负责分配`ID`段，`Leaf-Worker`负责在本地生成`ID`。

`Leaf`算法通过将`ID`生成和`ID`段管理分开，能够高效地生成`ID`。`Leaf-Worker`本地生成`ID`，减少了对中心服务器的依赖。
通过分布式的`Leaf-Server`，Leaf算法支持高可用的ID生成。即使部分`Leaf-Server`出现故障，系统仍然可以继续生成`ID`。

`Leaf`算法的核心思想是将`ID`生成和`ID`管理分开，利用`ID`段来减少对中心服务器的压力。
1. `Leaf-Server`预分配一段`ID`给`Leaf-Worker`。`ID`段通常包括一个起始`ID`和一个结束`ID`，`Leaf-Worker`在该范围内生成`ID`。
2. `Leaf-Worker`从分配的`ID`段中生成`ID`，并维护一个指针或游标来跟踪当前使用的`ID`。每次生成`ID`时，`Leaf-Worker`都会从本地的`ID`段范围中获取新的`ID`。
3. 当`Leaf-Worker`用完当前`ID`段或需要更多`ID`时，它会向`Leaf-Server`请求一个新的`ID`段。`Leaf-Server`根据当前的负载和可用资源分配新的`ID`段。

以下是一个简化的Java代码示例，展示如何使用`Leaf`算法生成`ID`：
```java
public class LeafWorker {
    private final long segmentStart;
    private final long segmentEnd;
    private final AtomicLong cursor;

    public LeafWorker(long segmentStart, long segmentEnd) {
        this.segmentStart = segmentStart;
        this.segmentEnd = segmentEnd;
        this.cursor = new AtomicLong(segmentStart);
    }

    public long getNextId() {
        long id = cursor.getAndIncrement();
        if (id > segmentEnd) {
            throw new RuntimeException("ID超出段范围");
        }
        return id;
    }
}

public class LeafServer {
    private long currentSegmentStart = 0;
    private long segmentSize = 1000; // 每次分配的ID段大小

    public synchronized LeafWorker requestSegment() {
        long start = currentSegmentStart;
        long end = start + segmentSize - 1;
        currentSegmentStart = end + 1;
        return new LeafWorker(start, end);
    }
}

public class Main {
    public static void main(String[] args) {
        LeafServer leafServer = new LeafServer();
        LeafWorker leafWorker = leafServer.requestSegment();
        
        for (int i = 0; i < 10; i++) {
            System.out.println("生成的ID: " + leafWorker.getNextId());
        }
    }
}
```
在需要高效生成唯一`ID`的分布式环境中，`Leaf`算法提供了高性能和高可用性。它适用于大规模应用和系统，其中`ID`生成的需求很高，且需要支持分布式架构。

### Redis自增ID
`Redis`自增`ID`是基于对数据库自增的改进，原理就是利用`Redis`的`INCR`命令实现`ID`的原子性自增。
不依赖于数据库，灵活方便，且性能优于数据库，但是如果系统中没有`Redis`，还需要引入新的组件，会增加系统复杂度。

`Redis`是内存数据库，`INCR`和`INCRBY`命令都是原子操作，执行速度非常快。
`Redis`在单节点模式下可能成为单点故障。如果`Redis`服务出现故障，可能会影响`ID`生成。

以下是一个使用Java和`Redis`实现自增`ID`生成的示例代码：
```java
public class RedisIdGenerator {
    private Jedis jedis;
    private String key;

    public RedisIdGenerator(String redisHost, int redisPort, String key) {
        this.jedis = new Jedis(redisHost, redisPort);
        this.key = key;
    }

    public long getNextId() {
        return jedis.incr(key);
    }

    public static void main(String[] args) {
        RedisIdGenerator idGenerator = new RedisIdGenerator("localhost", 6379, "unique_id");
        
        for (int i = 0; i < 10; i++) {
            System.out.println("生成的ID: " + idGenerator.getNextId());
        }
    }
}
```
`Redis`是内存数据库，具有极高的性能，`Redis`也能够满足实时系统需要快速生成唯一`ID`的情况。
对于不需要复杂`ID`生成逻辑的应用场景，`Redis`自增`ID`是一种简单且高效的解决方案。例如，为日志条目生成唯一的`ID`，方便日志的管理和查询。
