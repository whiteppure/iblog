---
title: "Redis详解"
date: 2021-06-17
draft: false
tags: ["Java", "Redis"]
slug: "java-redis"
---

## Redis概述
参考文章：
- [https://www.runoob.com/redis/redis-intro.html](https://www.runoob.com/redis/redis-intro.html)
- [https://www.redis.com.cn/redis-interview-questions.html](https://www.redis.com.cn/redis-interview-questions.html)

### 什么是Redis
Redis(**Remote Dictionary Server**) Redis 是一个开源的使用 ANSI C 语言编写、遵守 BSD 协议、支持网络、可基于内存亦可持久化的日志型、Key-Value 数据库，并提供多种语言的 API 的**非关系型数据库**。

**简而言之，Redis是一个可基于内存亦可持久化的日志型、Key-Value非关系型数据库。**

### 非关系型数据库
非关系型数据库，简称NoSql，是Not Only SQL 的缩写，是对不同于传统的关系型数据库的数据库管理系统的统称，泛指非关系型的数据库。
NoSql 不依赖业务逻辑方式存储，而以简单的key-value模式存储。因此大大的增加了数据库的扩展能力。

NoSql特点:
- 不遵循SQL标准;
- 不支持ACID;
- 远超于SQL的性能;

NoSql适用场景:
- 对数据高并发的读写;
- 海量数据的读写;
- 对数据高可扩展性的;

NoSql不适用场景:
- 需要事务支持;
- 基于sql的结构化查询存储，处理复杂的关系,需要及时查询;
- 用不着sql的和用了sql也不行的情况，请考虑用NoSql；

传统数据库遵循 ACID 规则。而 Nosql 一般为分布式,而分布式一般遵循 [CAP](/iblog/posts/essays/java-transaction/#cap理论) 定理。

### Redis相关知识
Redis 默认16个数据库，类似数组下标从0开始，初始默认使用0号库。可使用命令 `select  <dbid>`来切换数据库。如: `select 8` 。

Redis是单线程+[多路IO复用技术](/iblog/posts/rookie/rookie-io/#reactor-模型)

**多路复用：**
指使用一个线程来检查多个文件描述符（Socket）的就绪状态，比如调用select和poll函数，传入多个文件描述符，如果有一个文件描述符就绪，则返回，否则阻塞直到超时。得到就绪状态后进行真正的操作可以在同一个线程里执行，也可以启动线程执行，比如使用线程池。

**Redis与原子性：**
所谓原子操作是指不会被线程调度机制打断的操作；这种操作一旦开始，就一直运行到结束，中间不会有任何 context switch （切换到另一个线程）。
在单线程中，能够在单条指令中完成的操作都可以认为是"原子操作"，因为中断只能发生于指令之间；在多线程中，不能被其它进程或线程打断的操作就叫原子操作；
**Redis命令的原子性主要得益于Redis的单线程机制。**

Redis使用场景：
- 配合关系型数据库做高速缓存
    - 高频次，热门访问的数据，放入Redis中可降低数据库IO
    - 分布式架构，做session共享
- 多样的数据结构存储持久化数据
    - 利用zset排序，做排行榜功能、大数据去重；
    - 利用Redis key的实效性数据，如将手机验证码放入Redis；
    - 发布订阅消息系统，构建队列；
    - 利用Redis的原子性来做计数器、秒杀等；

Redis特点：
- Redis 支持数据的持久化，可以将内存中的数据保存在磁盘中，重启的时候可以再次加载进行使用;
- Redis 支持数据的备份，即master-slave模式的数据备份;
- Redis 可以存储键与不同数据结构类型之间的映射:
 
Redis优点：
- 性能极高 – 因为是纯内存操作，Redis能读的速度是110000次/s,写的速度是81000次/s；
- 丰富的特性 – Redis还支持 publish/subscribe, 通知, key 过期等等特性；
- 丰富的数据类型 – Redis支持二进制案例的 Strings, Lists, Hashes, Sets 及 Ordered Sets 数据类型操作；
- 原子 – Redis的所有操作都是原子性的，意思就是要么成功执行要么失败完全不执行。单个操作是原子性的。多个操作也支持事务，即原子性，通过MULTI和EXEC指令包起来；

Redis缺点：
- Redis 的主要缺点是数据库容量受到物理内存的限制，不能用作海量数据的高性能读写，因此Redis适合的场景主要局限在较小数据量的高性能操作和运算上。


### Redis基础命令
> 如果你使用docker可以先启动Redis容器再用`docker exec -it <容器ID> redis-cli`命令进入redis客户端。

基础命令：
- 查看当前库所有key：`keys *`
- 判断某个key是否存在：`exists <key>`
- 查看key是什么类型：`type <key>` 
- 删除指定的key数据：`del <key>`
- 根据value选择非阻塞删除,异步删除：`unlink <key>`
- 为给定的key设置过期时间：`expire key <time>`
- 查看还有多少秒过期，-1表示永不过期，-2表示已过期：`ttl <key>`
- 切换数据库：`select <dbid>`
- 查看当前数据库的key的数量：`dbsize`
- **清空当前库(慎用)：`flushdb`**
- **清空全部库(慎用)：`flushall`**

更多命令详见：
- [http://www.redis.cn/commands.html](http://www.redis.cn/commands.html)
- [https://www.redis.com.cn/commands.html](https://www.redis.com.cn/commands.html)

### Redis数据类型
Redis 可以存储键和不同类型的值之间的映射。键的类型只能为字符串，值常见有五种数据类型：字符串、列表、集合、散列表、有序集合，Redis后续的更新中又新添加了位图、地理位置等数据类型。

| 名称                     | 使用场景                                                     |
| ------------------------ | ------------------------------------------------------------ |
| [string-字符串](#string)         | 作为常规的key-value缓存应用                                  |
| [hash-哈希](#hash)             | 主要用来存储对象信息                                         |
| [list-列表](#list)             | 缓存一些列表数据：关注列表、粉丝列表等                       |
| [set-集合](#set)              | 去重；提供了求交集、并集、差集等操作，可以用来做共同关注、共同好友 |
| [sorted set-有序集合](#zset)   | 用来做排行榜                                                 |
| [bitmaps-位图](#bitmaps)         | 可以用来统计状态，如日活是否浏览过某个东西                   |
| [hyperloglog-基数统计](#hyperloglog) | 用来做统计独立IP数、搜索记录数                               |
| [geospatial-地理位置](#geospatial)   | 可以用来做附近的人、地图的一些推送接口   


#### String
String是Redis最基本的类型，一个key对应一个value。String类型是二进制安全的。意味着Redis的string可以包含任何数据。比如jpg图片或者序列化的对象。String类型是Redis最基本的数据类型，一个Redis中字符串value最多可以是512M。

![Redis详解-001](/iblog/posts/images/essays/Redis详解-001.png)

String的数据结构为简单动态字符串(Simple Dynamic String,缩写SDS)。是可以修改的字符串，内部结构实现上类似于Java的ArrayList，采用预分配冗余空间的方式来减少内存的频繁分配.

如图中所示,内部为当前字符串实际分配的空间capacity一般要高于实际字符串长度len。当字符串长度小于1M时，扩容都是加倍现有的空间，如果超过1M，扩容时一次只会多扩1M的空间。需要注意的是字符串最大长度为512M。

常用命令：
- 添加键值对：`set <key> <value>`
- 查询对应键值：`get <key>`
- 将给定的<value>追加到原值的末尾：`append <key> <value>`
- 获得值的长度：`strlen <key>`
- 只有在<key>不存在时设置<key>的值：`setnx <key> <value>`
- 将<key>中储存的数字值增1,只能对数字值操作，如果为空，新增值为1：`incr <key>`
- 将<key>中储存的数字值减1,只能对数字值操作，如果为空，新增值为-1：`decr <key>`
- 将<key>中储存的数字值增减，自定义步长：`incrby/decrby <key><步长>`

#### List
Redis列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部（左边）或者尾部（右边）,单键多值。它的底层实际是个双向链表，对两端的操作性能很高，通过索引下标的操作中间的节点性能会较差。

![Redis详解-002](/iblog/posts/images/essays/Redis详解-002.png)

List的数据结构为快速链表quickList。首先在列表元素较少的情况下会使用一块连续的内存存储，这个结构是ziplist，也即是压缩列表。它将所有的元素紧挨着一起存储，分配的是一块连续的内存。当数据量比较多的时候才会改成quicklist。

常用命令：
- 从左边/右边插入一个或多个值：`lpush/rpush <key><value1><value2><value3>`
- 从左边/右边吐出一个值：`lpop/rpop <key>`
- 从<key1>列表右边吐出一个值，插到<key2>列表左边：`rpoplpush <key1><key2>`
- 按照索引下标获得元素，从左到右，`0 -1`表示获取所有：`lrange <key><start><stop>`
- 获得列表长度：`llen <key>`
- 在<value>的后面插入<newvalue>插入值：`linsert <key> before <value><newvalue>`
- 从左边删除n个<value>：`lrem <key><n><value>`
- 将列表key下标为<index>的值替换成value：`lset <key><index><value>`

#### Set
Redis set对外提供的功能与list类似是一个列表的功能，特殊之处在于set是可以**自动去重的**，当你需要存储一个列表数据，又不希望出现重复数据时，set是一个很好的选择，并且set提供了判断某个成员是否在一个set集合内的重要接口，这个也是list所不能提供的。

Redis的Set是string类型的无序集合。它底层其实是一个value为null的hash表，所以添加，删除，查找的复杂度都是O(1)。
> 复杂度O(1)：数据增加，查找数据的时间不变。

Set数据结构是dict字典，字典是用哈希表实现的。在Java中HashSet的内部实现使用的是HashMap，只不过所有的value都指向同一个对象。Redis的set结构也是一样，它的内部也使用hash结构，所有的value都指向同一个内部值。

常用命令：
- 将一个或多个元素加入到集合key中，已经存在的元素将被忽略：`sadd <key><value1><value2>`
- 取出该集合的所有值：`smembers <key>`
- 判断集合<key>是否为含有该<value>值，有1，没有0：`sismember <key><value>`
- 返回该集合的元素个数：`scard<key>`
- 删除集合中的某个元素：`srem <key><value1><value2>`
- 随机从该集合中吐出一个值，可指定key，会从集合中删除：`spop <key>`
- 随机从该集合中取出n个值，不会从集合中删除：`srandmember <key><n>`
- 把集合中一个值从一个集合移动到另一个集合：`smove <source Key><destination Key><value>`
- 返回两个集合的交集元素：`sinter <key1><key2>`
- 返回两个集合的并集元素：`sunion <key1><key2>`
- 返回两个集合的差集元素(key1中的，不包含key2中的)：`sdiff <key1><key2>`

#### Hash
Redis hash 是一个键值对集合。Redis hash是一个string类型的field和value的映射表，hash特别适合用于存储对象。类似Java里面的Map<String,Object>。

Hash类型对应的数据结构是两种：ziplist（压缩列表），hashtable（哈希表）。当field-value长度较短且个数较少时，使用ziplist，否则使用hashtable。

常用命令：
- 给<key>集合中的<field>键赋值<value>：`hset <key><field><value>`
- 从<key1>集合<field>取出 value：`hget <key1><field>`
- 批量设置hash的值：`hmset <key1><field1><value1><field2><value2>...` 
- 查看哈希表<key>中，给定域<field>是否存在：`hexists<key1><field>`
- 列出该hash集合的所有<field>：`hkeys <key>`
- 列出该hash集合的所有<value>：`hvals <key>`
- 为哈希表<key>中的域<field>的值加上增量1：`hincrby <key><field><increment>`
- 将哈希表<key>中的域<field> 的值设置为<value>,当且仅当域<field>不存在：`hsetnx <key><field><value>`

#### ZSet
sorted set 有序集合也称为 zset，Redis有序集合zset与普通集合set非常相似，是一个没有重复元素的字符串集合。不同之处是有序集合的每个成员都关联了一个评分（score）,这个评分被用来按照从最低分到最高分的方式排序集合中的成员。集合的成员是唯一的，但是评分可以是重复了 。

因为元素是有序的, 所以你也可以很快的根据评分（score）或者次序（position）来获取一个范围的元素。
访问有序集合的中间元素也是非常快的,因此你能够使用有序集合作为一个没有重复成员的智能列表。

SortedSet(zset)是Redis提供的一个非常特别的数据结构，一方面它等价于Java的数据结构Map<String, Double>，可以给每一个元素value赋予一个权重score，另一方面它又类似于TreeSet，内部的元素会按照权重score进行排序，可以得到每个元素的名次，还可以通过score的范围来获取元素的列表。

zset底层使用了两个数据结构:
- hash，hash的作用就是关联元素value和权重score，保障元素value的唯一性，可以通过元素value找到相应的score值;
- 跳跃表，跳跃表的目的在于给元素value排序，根据score的范围获取元素列表;

>跳跃表：<br>
>有序集合在生活中比较常见，例如根据成绩对学生排名，根据得分对玩家排名等。对于有序集合的底层实现，可以用数组、平衡树、链表等。数组不便元素的插入、删除；平衡树或红黑树虽然效率高但结构复杂；链表查询需要遍历所有效率低。Redis采用的是跳跃表。跳跃表效率堪比红黑树，实现远比红黑树简单。
> <br>
>举例：对比有序链表和跳跃表，从链表中查询出51
>
> 有序链表: 查找值为51的元素，需要从第一个元素开始依次查找、比较才能找到;共需要6次比较。
> ![Redis详解-003](/iblog/posts/images/essays/Redis详解-003.png)
>
> 跳跃表:从第2层开始，1节点比51节点小，向后比较；21节点比51节点小，继续向后比较，后面就是NULL了，所以从21节点向下到第1层；在第1层，41节点比51节点小，继续向后，61节点比51节点大，所以从41向下；在第0层，51节点为要查找的节点，节点被找到，共查找4次。
>![Redis详解-004](/iblog/posts/images/essays/Redis详解-004.png)
>
>可以看出跳跃表比有序链表效率要高。

常用命令：
- 将一个或多个元素及其score值加入到有序集key当中：`zadd  <key><score1><value1><score2><value2>...`
- 返回有序集 key 中，下标在<start><stop>之间的元素,带withscores，可以让分数一起和值返回到结果集：`zrange <key><start><stop> [WITHSCORES]`
- 返回有序集 key 中，所有 score 值介于 min 和 max 之间(包括等于 min 或 max )的成员;有序集成员按 score 值递增(从小到大)次序排列：`zrangebyscore key minmax [withscores] [limit offset count]`
- 为元素的 score 加上增量：`zincrby <key><increment><value>`
- 删除该集合下，指定值的元素：`zrem <key><value>`
- 统计该集合，分数区间内的元素个数：`zcount <key><min><max>`
- 返回该值在集合中的排名，从0开始：`zrank <key><value>`

#### Bitmaps
Bitmaps 并不是一种数据结构，实际上它就是字符串，但是可以对字符串的位进行操作。

>bit（位）简介：<br> 
>现代计算机用二进制（位） 作为信息的基础单位， 1个字节等于8位， 例如“abc”字符串是由3个字节组成， 但实际在计算机存储时将其用二进制表示， “abc”分别对应的ASCII码分别是97、 98、 99， 对应的二进制分别是01100001、 01100010和01100011。

Bitmaps单独提供了一套命令， 所以在Redis中使用Bitmaps和使用字符串的方法不太相同。 可以把Bitmaps想象成一个以位为单位的数组， 数组的每个单元只能存储0和1， 数组的下标在Bitmaps中叫做偏移量。

![Redis详解-009](/iblog/posts/images/essays/Redis详解-009.png)

常用命令：
- 设置Bitmaps中某个偏移量的值(0或1),offset偏移量从0开始：`setbit <key><offset><value>`
- 获取Bitmaps中某个偏移量的值,获取键的第offset位的值,offset偏移量从0开始，不存在则返回0：`getbit <key><offset>`
- 统计字符串从start字节到end字节bit值为1的数量：`bitcount <key>[start end]`

虽然使用位操作能够极大提高内存使用效率，但也并非总是如此，合理地使用操作位能才能够有效地提高内存使用率和开发效率。

假设网站有1亿用户， 每天独立访问的用户有5千万， 如果每天用集合类型和Bitmaps分别存储活跃用户可以得到表：

Set和Bitmaps存储一天活跃用户对比：
>- **Set每个用户id占用空间**：假设用户id用的是long存储占8字节，所以Set用户id占用空间是8*8bit=64bit。
>- **Bitmaps需要存储的用户量**：因为Bitmaps 并不是一种数据结构，实际上是字符串，所以在存储的时候需要存储全部的用户，此处为1亿。

| 数据类型 | 每个用户id占用空间                      | 需要存储的用户量 | 全部内存量             |
| -------- | --------------------------------------- | ---------------- | ---------------------- |
| Set      | 64bit | 50000000         | 64位*50000000 = 400MB  |
| Bitmaps  | 1bit  | 100000000        | 1位*100000000 = 12.5MB |

但Bitmaps并不是万金油，假如该网站每天的独立访问用户很少，例如只有10万，这时候使用Bitmaps就不太合适了，两者的对比如下表所示：
| 数据类型 | 每个用户id占用空间 | 需要存储的用户量 | 全部内存量             |
| -------- | ------------------ | ---------------- | ---------------------- |
| Set      | 64位               | 100000           | 64位*100000 = 800KB    |
| Bitmaps  | 1位                | 100000000        | 1位*100000000 = 12.5MB |

#### HyperLogLog
Redis 在 2.8.9 版本添加了 HyperLogLog 结构。Redis HyperLogLog 是用来做**基数**统计的算法，HyperLogLog 的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的。

> HyperLogLog中的基数：比如数据集 {1, 3, 5, 7, 5, 7, 8}， 那么这个数据集的基数集为 {1, 3, 5 ,7, 8}, 不重复元素为5个，5就是基数。 基数估计就是在误差可接受的范围内，快速计算基数。

在 Redis 里面，每个 HyperLogLog 键只需要花费 12 KB 内存，就可以计算接近 2^64 个不同元素的基数。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比。

但是，因为 HyperLogLog 只会根据输入元素来计算基数，而不会储存输入元素本身，所以 HyperLogLog 不能像集合那样，返回输入的各个元素。

常用命令：
- 添加指定元素到 HyperLogLog 中,估计的近似基数发生变化，则返回1，否则返回0：`pfadd <key>< element> [element ...]`
- 计算<key>的近似基数：`pfcount<key> [key ...]`
- 将一个或多个<key>合并后的结果存储在另一个<key>中：`pfmerge <destkey><sourcekey> [sourcekey ...]`

#### Geospatial
GEO，Geographic，地理信息的缩写。该类型，就是元素的2维坐标，在地图上就是经纬度。redis基于该类型，提供了经纬度设置、查询、范围查询、距离查询、经纬度Hash等常见操作。

常用命令：
- 添加地理位置，key名称、经度、纬度、名称：`geoadd <key>< longitude><latitude><member> [longitude latitude member...]`
> 两极无法直接添加，一般会下载城市数据，直接通过 Java 程序一次性导入。有效的经度从 -180 度到 180 度。有效的纬度从 -85.05112878 度到 85.05112878 度。当坐标位置超出指定范围时，该命令将会返回一个错误。已经添加的数据，是无法再次往里面添加的。
- 获得指定地区的坐标值：`geopos  <key><member> [member...]`
- 获取两个位置之间的直线距离,默认单位，米、km表示单位为千米、mi表示单位为英里、ft表示单位为英尺。：`geodist <key><member1><member2>  [m|km|ft|mi ]`
- 以给定的经纬度为中心，找出某一半径内的元素：`georadius <key><longitude><latitude><radius><m|km|ft|mi> [withcoord]`

## Redis发布与订阅
Redis 发布订阅 (pub/sub) 是一种消息通信模式：发送者 (pub) 发送消息，订阅者 (sub) 接收消息。Redis 客户端可以订阅任意数量的频道。

客户端可以订阅频道：

![Redis详解-005](/iblog/posts/images/essays/Redis详解-005.png)

给这个频道发布消息后，消息就会发送给订阅的客户端：

![Redis详解-006](/iblog/posts/images/essays/Redis详解-006.png)

**实现Redis发布订阅模式：**

1. 打开两个Redis客户端;

2. 在其中一个客户端输入：`subscribe <channel>`,channel为订阅的频道名称：
![Redis详解-008](/iblog/posts/images/essays/Redis详解-008.png)

3. 在另外一个客户端输入：`publish <channel> <message>`,channel为订阅的频道名称,message为推送的消息，返回的1是订阅者数量：
![Redis详解-007](/iblog/posts/images/essays/Redis详解-007.png)

## Redis事务
Redis事务是一个单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。

Redis事务的主要作用就是**串联多个命令防止别的命令插队**。

Redis事务操作相关命令：Multi、Exec、discard

![Redis详解-014](/iblog/posts/images/essays/Redis详解-014.png)

从输入Multi命令开始，输入的命令都会依次进入命令队列中，但不会执行，直到输入Exec后，Redis会将之前的命令队列中的命令依次执行。组队的过程中可以通过discard来放弃组队。
可以将exec命令理解为提交操作，discard理解为回滚操作。

multi，exec组队成功，提交成功举例：
```
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> set k3 v3
QUEUED
127.0.0.1:6379(TX)> exec
1) OK
2) OK
3) OK
```

multi，discard组队失败举例：
```
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> set k3 v3
QUEUED
127.0.0.1:6379(TX)> discard
OK
```

如果在组队过程中执行某个命令失败了，则认为组队失败整个队列都会被取消：

![Redis详解-015](/iblog/posts/images/essays/Redis详解-015.png)

```
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2
(error) ERR wrong number of arguments for 'set' command
127.0.0.1:6379(TX)> exec
(error) EXECABORT Transaction discarded because of previous errors.
```

如果执行阶段某个命令出了错，则只有报错的命令不会被执行，而其他的命令都会执行且不会回滚：

![Redis详解-016](/iblog/posts/images/essays/Redis详解-016.png)

```
127.0.0.1:6379> multi 
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> incr k1
QUEUED
127.0.0.1:6379(TX)> set k2 v2
QUEUED
127.0.0.1:6379(TX)> exec
1) OK
2) (error) ERR value is not an integer or out of range
3) OK
```

### Redis事务特性
- 单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。 
- 没有隔离级别的概念：队列中的命令没有提交之前都不会实际被执行，因为事务提交前任何指令都不会被实际执行
- 不保证原子性：事务中如果有一条命令执行失败，其后的命令仍然会被执行，没有回滚 

### 事务冲突

**为什么要使用事务？**

想想一个场景：有很多人有你的账户,同时去参加抢购。一个请求想给金额减8000、一个请求想给金额减5000、一个请求想给金额减1000。

如果不加事务，有可能一个线程在减8000后，还没有写入数据库，此时另一个线程执行减5000操作写入数据库，然后再将减8000的操作写入数据库，就会造成数据异常。针对于高并发这种情况下我们就需要用事务来控制，可以用加锁来处理。

在Redis中可以使用[悲观锁、乐观锁](/iblog/posts/rookie/rookie-multi-thread/#悲观锁与乐观锁)的思想来处理。

#### 悲观锁
![Redis详解-017](/iblog/posts/images/essays/Redis详解-017.png)

悲观锁(Pessimistic Lock), 顾名思义，就是很悲观，每次去拿数据的时候都认为别人会修改，所以每次在拿数据的时候都会上锁，这样别人想拿这个数据就会block直到它拿到锁。传统的关系型数据库里边就用到了很多这种锁机制，比如行锁，表锁等，读锁，写锁等，都是在做操作之前先上锁。

悲观锁实现：在Redis中没有悲观锁，但是可以通过调用lua脚本来实现。
> Lua 是一个小巧的脚本语言，Lua脚本可以很容易的被C/C++ 代码调用，也可以反过来调用C/C++的函数，Lua并没有提供强大的库，一个完整的Lua解释器不过200k，所以Lua不适合作为开发独立应用程序的语言，而是作为嵌入式脚本语言。
  很多应用程序、游戏使用LUA作为自己的嵌入式脚本语言，以此来实现可配置性、可扩展性。

LUA脚本在Redis中的优势：
- 将复杂的或者多步的redis操作，写为一个脚本，一次提交给redis执行，减少反复连接redis的次数。提升性能。
- LUA脚本是类似redis事务，有一定的原子性，不会被其他命令插队，可以完成一些redis事务性的操作。


#### 乐观锁
![Redis详解-018](/iblog/posts/images/essays/Redis详解-018.png)

乐观锁(Optimistic Lock), 顾名思义，就是很乐观，每次去拿数据的时候都认为别人不会修改，所以不会上锁，但是在更新的时候会判断一下在此期间别人有没有去更新这个数据，可以使用版本号等机制。乐观锁适用于多读的应用类型，这样可以提高吞吐量。Redis就是利用这种check-and-set机制实现事务的。

乐观锁实现：在Redis中如果涉及到了操作数据需要用事务控制的情况可以用 WATCH key ... 命令来监控,可以监控多个key。如果在事务执行之前这个key被其他命令所改动，那么事务将被打断。

![Redis详解-019](/iblog/posts/images/essays/Redis详解-019.gif)

UNWATCH 取消 WATCH 命令对所有 key 的监视。如果在执行 WATCH 命令之后，EXEC 命令或DISCARD命令先被执行了的话，那么就不需要再执行UNWATCH了。


## Redis与缓存
参考文章：
- [https://cloud.tencent.com/developer/article/1847904](https://cloud.tencent.com/developer/article/1847904)
- [https://blog.csdn.net/qq_27391133/article/details/80364658](https://blog.csdn.net/qq_27391133/article/details/80364658)

因为Redis操作的是纯内存所以性能极高，常用来做缓存，来存放一些热点数据。

用户第一次访问数据库中的某些数据。整个过程会比较慢，因为是从硬盘上读取的。如果将该用户访问的数据存在数缓存中，这样下一次再访问这些数据的时候就可以直接从缓存中获取了。操作缓存就是直接操作内存，所以速度相当快，但随之而来的也会存在一些问题。

### 缓存穿透
![Redis详解-027](/iblog/posts/images/essays/Redis详解-027.png)

Redis中的key对应的数据在数据源并不存在，每次针对此key的请求从缓存获取不到，请求都会压到数据源，从而可能压垮数据源。简单理解为,避开缓存,疯狂请求数据库里没有的数据.从而造成服务器宕机。

**解决方法**
- 对空值缓存：如果一个查询返回的数据为空，不管是数据是否不存在，我们仍然把这个空结果进行缓存，设置空结果的过期时间会很短，最长不超过五分钟；
```
    @Resource
    private RedisTemplate<Long, String> redisTemplate;
    
    @Resource
    private TestMapper testMapper;

    public Test findById(Long id) {
        String testStr = redisTemplate.opsForValue().get(id);
        //判断缓存是否存在，是否为空对象
        if (StringUtils.isEmpty(testStr)) {
            // 这里的锁，使用的时候注意锁的力度，这里建议换成分布式锁，这里做演示
            synchronized (TestServiceImpl.class){
                testStr = redisTemplate.opsForValue().get(id);
                if (StringUtils.isEmpty(testStr)) {
                    Test test = testMapper.findById(id);
                    if(test == null){
                        //构建一个空对象
                        test= new Test();
                    }
                    testStr = JSON.toJSONString(test);
                    // 存入Redis中，下次再次访问就不访问数据库
                    redisTemplate.opsForValue().set(id, testStr);
                }
            }
        }
        Test test = JSON.parseObject(testStr, Test.class);
        //空对象处理
        if(test.getId() == null){
            return null;
        }
        return JSON.parseObject(testStr, Test.class);
    }
```

- 设置可访问的白名单：使用bitmaps类型定义一个可以访问的名单，名单id作为bitmaps的偏移量，每次访问和bitmap里面的id进行比较，如果访问id不在bitmaps里面，进行拦截，不允许访问。
- 使用布隆过滤器：布隆过滤器（Bloom Filter）是1970年由布隆提出的。它实际上是一个很长的二进制向量(位图)和一系列随机映射函数（哈希函数）。布隆过滤器可以用于检索一个元素是否在一个集合中。它的优点是空间效率和查询时间都远远超过一般的算法，缺点是有一定的误识别率和删除困难。将所有可能存在的数据哈希到一个足够大的bitmaps中，一个一定不存在的数据会被 这个bitmaps拦截掉，从而避免了对底层存储系统的查询压力。
```
    @Resource
    private TestMapper testMapper;

    @Resource
    private RedisTemplate<Long, String> redisTemplate;

    private static BloomFilter<Long> bloomFilter = BloomFilter.create(Funnels.longFunnel(), 1000000000L);

    @Override
    public Test findById(Long id) {
        String testStr = redisTemplate.opsForValue().get(id);
        if (StringUtils.isEmpty(testStr)) {
            //校验是否在布隆过滤器中
            if(bloomFilter.mightContain(id)){
                return null;
            }
            // 这里的锁，使用的时候注意锁的力度，这里建议换成分布式锁，这里做演示
            synchronized (TestServiceImpl.class){
                testStr = redisTemplate.opsForValue().get(id);
                if (StringUtils.isEmpty(testStr) ) {
                    if(bloomFilter.mightContain(id)){
                        return null;
                    }
                    Test test = testMapper.findById(id);
                    if(test == null){
                        //放入布隆过滤器中
                        bloomFilter.put(id);
                        return null;
                    }
                    testStr = JSON.toJSONString(test);
                    redisTemplate.opsForValue().set(id, testStr);
                }
            }
        }
        return JSON.parseObject(testStr, Test.class);
    }
```

### 缓存击穿
![Redis详解-028](/iblog/posts/images/essays/Redis详解-028.png)

key对应的数据存在，但在redis中过期，此时若有大量并发请求过来，这些请求发现缓存过期一般都会从后端数据库加载数据并回设到缓存，大并发集中对这一个点进行访问，当这个key在失效的瞬间，持续的大并发就穿破缓存，直接请求数据库，就像在一个屏障上凿开了一个洞。这个时候大并发的请求可能会瞬间把后端数据源压垮。

**解决方法**
- 预先设置热门数据：在redis高峰访问之前，把一些热门数据提前存入到redis里面，加大这些热门数据key的时长；
- 实时调整：现场监控哪些数据热门，实时调整key的过期时长；
- 使用锁：在缓存失效的时候判断拿出来的值为空，先使用缓存工具的某些带成功操作返回值的操作,去set一个mutex key,而不是立即去访问数据源；当操作返回成功时，再进行访问数据库的操作，并回设缓存,最后删除mutex key；当操作返回失败，证明有线程在访问数据源，当前线程睡眠一段时间再重试整个get缓存的方法；
```
 @Resource
 private RedisTemplate<String,Long> template;
 
 @Resource
 private TestMapper testMapper;
 
 public Long findById(Long id){
     Long value = template.opsForValue().get(id);
     
     if (StringUtils.isEmpty(value)){
         String key = id + ":nx";
         // 使用 redis setnx 命令如果设置为 1 则代表成功
         if (template.opsForValue().setIfAbsent(key, 1L, 3 * 60, TimeUnit.SECONDS)){
             value = testMapper.findById(id);
             template.opsForValue().set(id.toString(),value,30 * 60);
             template.delete(key);
         }else {
             try {
                 // 睡眠50ms后重试
                 Thread.sleep(50);
                 value = template.opsForValue().get(id);
             } catch (InterruptedException e) {
                 Thread.interrupted();
             }
         }
         return value;
     }else {
         return value;
     }
 }
```

### 缓存雪崩
![Redis详解-029](/iblog/posts/images/essays/Redis详解-029.png)

key对应的数据存在，但在redis中过期，此时若有大量并发请求过来，这些请求发现缓存过期一般都会从后端数据源加载数据并回设到缓存，这个时候大并发的请求可能会瞬间把后端数据源压垮，简单理解为,在某一个时间段,缓存key大面积失效,集中过期.可能会导致服务器宕机。

**解决方法**
- 构建多级缓存架构：nginx缓存 + redis缓存 + 其他缓存等；
- 使用锁或队列：限流降级,在同一时间段,只允许某个线程访问，性能较差；
- 设置缓存key永不过期，异步更新；虽然这种方式不会堵塞线程，但是不保证数据一致性，代码复杂度较大，容易堆积垃圾数据；
- 将缓存失效时间分散开：比如我们可以在原有的失效时间基础上增加一个随机值，比如1-5分钟随机，这样每一个缓存的过期时间的重复率就会降低，就很难引发集体失效的事件；
```
    @Resource
    private RedisTemplate<String,Long> template;

    public void setKeys(){
        template.opsForValue().set("k1",1L,30 * 60 + (new Random().nextInt(9999)));
        template.opsForValue().set("k2",2L,30 * 60 + (new Random().nextInt(9999)));
    }
``` 

## Redis部署策略

### Redis主从复制
![Redis详解-022](/iblog/posts/images/essays/Redis详解-022.png)

主从复制，是指将一台Redis服务器的数据，复制到其他的Redis服务器。前者称为主节点(master)，后者称为从节点(slave)；数据的复制是单向的，只能由主节点到从节点。Master以写为主，Slave以读为主。

主从复制的作用：
- 读写分离，性能扩展
- 负载均衡
- 容灾快速恢复

#### 搭建主从复制
1. 至少启动三个redis服务器，并分别连接其客户端；
2. 在客户端使用命令`info replication` 查看主从相关信息；
3. 选定从服务器，并在其客户端执行`slaveof <ip> <port>`命令将该服务器设置为从服务器；
4. 在客户端使用命令`info replication` 查看主从相关信息，查看是否生效；
5. 在主从服务器上测试读写；

#### 主从复制过程
![Redis详解-023](/iblog/posts/images/essays/Redis详解-023.png)

1. 当从服务器连接到主服务器后，从服务器会向主服务器发送同步数据请求；
2. 主服务器接收到从服务器发送过来的请求，首先会把主服务器数据进行持久化，变为rdb文件，把rdb文件发送到从服务器，从服务器拿到rdb文件进行读取；
3. 每次主服务器进行写操作后，会向从服务器进行数据同步；

全量复制：用于初次复制或其他无法进行部分复制的情况，将主节点中的所有数据都发送给从节点，是一个非常重型的操作。

部分复制：用于网络中断等情况后的复制，只将中断期间主节点执行的写命令发送给从节点，与全量复制相比更加高效。需要注意的是，如果网络中断时间过长，导致主节点没有能够完整地保存中断期间执行的写命令，则无法进行部分复制，仍使用全量复制。

### 一主二仆
![Redis详解-024](/iblog/posts/images/essays/Redis详解-024.png)

特点：
- 当主服务挂掉之后，从服务器不会上位；
- 当从服务器挂掉之后，主服务器再次写入数据，此时从服务器再次启动，数据与主服务器保持一致；
- 从服务器不能执行写操作；

### 薪火相传
![Redis详解-025](/iblog/posts/images/essays/Redis详解-025.png)

特点：
- 当主服务挂掉之后，从服务器不会上位；
- 上一个slaver可以是下一个slaver的master，可以有效减轻master的写压力,去中心化降低风险；
- 一旦某个slave宕机，后面的slave都没法备份，主机挂了，从机还是从机，都无法写数据了；

可以使用命令`slaveof <ip> <port>`将该服务器设置为某服务器的从机。

### 反客为主
当一个master宕机后，后面的slave可以立刻升为master，其后面的slave不用做任何修改，手动执行命令`slaveof  no one` 将从机变为主机。可以使用哨兵模式让"反客为主"模式变为自动。

### Redis哨兵模式
![Redis详解-026](/iblog/posts/images/essays/Redis详解-026.png)

反客为主的自动版，能够后台监控主机是否故障，如果故障了根据投票数自动将从库转换为主库。当主机挂掉，从机选举中产生新的主机,当之前的主机再次启动，会变为从机。

#### 搭建哨兵模式
1. 搭建[主从模式](#搭建主从复制)
2. 新建哨兵配置`sentinel.conf`文件：
>- sentinel：哨兵模式
>- monitor：监控
>- mymaster：主服务器别名
>- 127.0.0.1 6379：ip端口
>- 1：至少有多少个哨兵同意迁移的数量
><br>
> sentinel monitor mymaster 127.0.0.1 6379 1
3. 执行`redis-sentinel ./sentinel.conf`启动哨兵

#### 复制延时
由于所有的写操作都是先在Master上操作，然后同步更新到Slave上，所以从Master同步到Slave机器有一定的延迟，当系统很繁忙的时候，延迟问题会更加严重，Slave机器数量的增加也会使这个问题更加严重。

#### 选举机制
1. 优先选择优先级靠前的；
    > 优先级在redis.conf中默认：slave-priority 100，值越小优先级越高。
2. 选择偏移量最大的;
    > 偏移量是指获得原主机数据最全的。
3. 选择runid最小的服务；
    > 每个redis实例启动后都会随机生成一个40位的runid,这里也就是随机选择。

### Redis集群
Redis 集群是 Redis 提供的分布式数据库方案，集群通过分片来实现数据共享，并提供复制和故障转移。

Redis集群模式是哨兵模式的一种拓展，在没有Redis 集群的时候，人们使用哨兵模式，所有的数据都存在 master 上面，master 的压力越来越大，垂直扩容再多的 salve 已经不能分担 master 的压力的，因为所有的写操作集中都集中在 master 上。所以人们就想到了水平扩容，就是搭建多个 master 节点。客户端进行分片，手动的控制访问其中某个节点。但是这几个节点之间的数据是不共享的。并且如果增加一个节点，需要手动的将数据进行迁移，维护起来很麻烦。
另外，主从模式，薪火相传模式，主机宕机，导致ip地址发生变化，应用程序中配置需要修改对应的主机地址、端口等信息。所以才产生了 Redis 集群。

Redis集群是无中心化集群，即每个结点都是入口。Redis 集群通过分区来提供一定程度的可用性;即使集群中有一部分节点失效或者无法进行通讯，集群也可以继续处理命令请求。

Redis集群故障恢复：
- 如果主节点挂掉后，从结点会上位，主节点恢复后，变为从结点；
- 如果某一段插槽的主从节点都宕掉，redis服务是否能运行，这个与redis.conf中的参数`cluster-require-full-coverage`相关；如果为yes则可以继续使用，为no，那么，该插槽数据全都不能使用，也无法存储；

Redis集群优点：
- 实现扩容；
- 分摊服务器压力；
- 无中心配置相对简单；

Redis集群缺点：
- 多键操作是不被支持、多键的Redis事务是不被支持、lua脚本不被支持；
- 由于集群方案出现较晚，很多公司已经采用了其他的集群方案，而代理或者客户端分片的方案想要迁移至redis cluster，需要整体迁移而不是逐步过渡，复杂度较大；

#### 搭建Redis集群
1. 修改`redis.conf`配置文件，修改前建议备份，修改之后启动redis服务；
    > redis.conf:
    > // 引入原始配置文件
    > include /home/bigdata/redis.conf
    > // 端口
      port 6379
    >// pid文件名称
      pidfile "/var/run/redis_6379.pid"
    >// rdb文件名称
      dbfilename "dump6379.rdb"
    >// 日志文件
      logfile "/home/bigdata/redis_cluster/redis_err_6379.log"
    >// 启用集群模式
      cluster-enabled yes
    >// 设定节点配置文件名，启动后会自动生成
      cluster-config-file nodes-6379.conf
    >// 设定节点失联时间，超过该时间（毫秒），集群自动进行主从切换
      cluster-node-timeout 15000
2. 确保所有redis实例启动后,`nodes-xxxx.conf`文件都正常生成；
3. `cd /opt/redis-6.2.1/src`进入redis的src目录，执行：
    > 此处不要用127.0.0.1,请用真实IP地址
    > redis-cli --cluster create --cluster-replicas 1 192.168.11.101:6379 192.168.11.101:6380 192.168.11.101:6381 192.168.11.101:6389 192.168.11.101:6390 192.168.11.101:6391
4. 使用命令`redis-cli -c -p<port>`登陆redis集群；
5. 在客户端使用命令`cluster nodes`查看集群信息；

#### 操作Redis集群
- 执行写入一个键值操作：
    ```
    set k1 v1
    ->Redirected to slot [12706] located at 192.168.137.3:6381
    OK
    ```
    > 这里的slot是插槽：
    > 一个 Redis 集群包含 16384 个插槽（hash slot），数据库中的每个键都属于这 16384 个插槽的其中一个；集群使用公式 CRC16(key) % 16384 来计算键 key 属于哪个槽， 其中 CRC16(key) 语句用于计算键 key 的 CRC16 校验和。集群中的每个节点负责处理一部分插槽。
    > 在redis客户端每次录入、查询键值，redis都会计算出该key应该送往的插槽。 
    >
    > 举个例子，如果一个集群可以有主节点，其中：节点 A 负责处理 0 号至 5460 号插槽;节点 B 负责处理 5461 号至 10922 号插槽;节点 C 负责处理 10923 号至 16383 号插槽。
    >
- 执行写入多个键值操作：
    ```
    mset k1 v1 k2 v2 k3 v3
    (error) CORSSSLOT Keys in request don't hash to the same slot 
    ```
    不在一个slot下的键值，是不能使用mget,mset等多键操作,但是可以可以通过{}来定义组的概念，从而使key中{}内相同内容的键值对放到一个slot中去：
    ```
    mset k1{cust} v1 k2{cust} v2 k3{cust} v3
    ```
- 查询集群中的值：
    - 查询count个slot槽中的键：`cluster getkeysinslot <slot> <count>`
    - 计算key的插槽值：`cluster keyslot <key>`
    - 计算插槽值有几个key：`cluster countkeysinslot <slot>`

## Redis分布式锁
在代码里面我们常用`ReetrantLock、synchronized`保证线程安全。通过上面的锁，在某个时刻只能保证一个线程执行锁作用域内的代码。

类似这样：
```
public class MainTest {

    private static final  ReentrantLock lock = new ReentrantLock();
    
    public static void main(String[] args) {
        lock.lock();
        try {
            System.out.println("hello world");
        }finally {
            lock.unlock();
        }
    }
}
```
但是，当项目采用分布式部署方式之后，再使用`ReetrantLock、synchronized`就不能保证数据的准确性，可能会出现严重bug。
![Redis详解-010](/iblog/posts/images/essays/Redis详解-010.png)

举个例子，当很多个请求过来的时候，会先经过`Nginx`,然后`Nginx`再根据算法分发请求，到哪些服务器的程序上。
此时商品的库存为一件，有两个请求，到达不同服务器上的不同程序的相同代码，先后执行了查询SQL，查出来的数据是相同的，然后依次执行库存减一操作，此时库存会变成-1件。这就造成了超卖问题。

针对超卖问题，我们可以使用Redis分布式锁来解决。当然也有其他分布式锁，这里不做介绍。

### Redis分布式锁演进

#### 方式一
使用Redis，`setnx`：
> SETNX 是SET IF NOT EXISTS的简写.日常命令格式是SETNX key value，如果 key不存在，则SETNX成功返回1，如果这个key已经存在了，则返回0。
```
    @Autowired
    private RedisTemplate redisTemplate;

    // 保证value值唯一,这里是伪代码
    final String value = "";
    final String REDIS_LOCK = "redis_lock_demo";
    public void context(){
        try {
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value);
            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);
    
            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }
    
            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            redisTemplate.delete(REDIS_LOCK);
        }
    }
```
需要注意的是`redisTemplate.delete()`方法要加在`finally`中是为了程序出现异常不释放锁。

但是这种写法会有一个问题，如果Redis服务器宕机了，或Redis服务被其他人kill掉了，此时恰好没有执行`finally`中的代码，就会造成Redis中永远都会存在这把锁，不会释放。

#### 方式二
针对上面Redis宕机的问题，我们可以对这个key加一个过期时间，来解决：
```
    @Autowired
    private RedisTemplate redisTemplate;

    // 保证value值唯一,这里是伪代码
    final String value = "";
    final String REDIS_LOCK = "redis_lock_demo";
    public void context(){
        try {   
            // 加锁
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value);
            // 设置过期时间，假设为10s
            redisTemplate.expire(REDIS_LOCK,10, TimeUnit.SECONDS);
    
            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);
    
            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }
    
            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            redisTemplate.delete(REDIS_LOCK);
        }
    }
```
上面的代码虽然解决了Redis宕机的问题，但是也带来了一个新的问题：设置过期时间和加锁并不再一行，即是非原子操作。

举个例子，如果执行完`setnx`加锁，正要执行`expire`设置过期时间时，进程要重启维护了，那么这个锁就“长生不老”了，别的线程永远获取不到锁了。

#### 方式三
针对上面加锁和设置过期时间的问题，我们可以使用Redis提供的一个方法，使其具备原子性：
```
    @Autowired
    private RedisTemplate redisTemplate;

    // 保证value值唯一,这里是伪代码
    final String value = "";
    final String REDIS_LOCK = "redis_lock_demo";
    public void context(){
        try {
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value, 10, TimeUnit.SECONDS);

            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            redisTemplate.delete(REDIS_LOCK);
        }
    }
```
加过期时间释放锁的这种方式会带来另一个问题，某个线程加锁，然后执行业务代码，业务代码执行的时间超过了限定时间，此时Redis会释放锁，然后第二个请求就进来了，此时第一个线程业务代码执行完毕，执行释放锁步骤。这就造成误删除其他线程的锁。

简单说就是，张冠李戴，当前线程删除了其他线程的锁。

#### 方式四
针对方式三带来的问题，需要加一个判断，来避免误删除其他线程的锁：
```
    @Autowired
    private RedisTemplate redisTemplate;

    final String REDIS_LOCK = "redis_lock_demo";
    // 保证value值唯一,这里是伪代码
    final String value = "";
    public void context(){
        try {
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value, 10, TimeUnit.SECONDS);

            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            // 判断是否是当前线程，如果是当前线程则允许释放锁
            if (redisTemplate.opsForvalue().get(REDIS_LOCK).equalsIgnoreCase(value)){
                redisTemplate.delete(REDIS_LOCK);
            }
        }
    }
```
实际上这种方式判断和删除的操作不是原子的，不是原子性的就会出现问题。即该锁没有保存持有者的唯一标识，可能被别的客户端解锁。

#### 方式五
针对方式四的问题，Redis官网有推荐的解决方法，即，使用[Lua脚本](http://www.redis.cn/commands/set)：
```
if redis.call('setnx',KEYS[1],ARGV[1]) == 1 then
   redis.call('expire',KEYS[1],ARGV[2])
else
   return 0
end;
```

```
    @Autowired
    private RedisTemplate redisTemplate;

    final String REDIS_LOCK = "redis_lock_demo";
    // 保证value值唯一,这里是伪代码
    final String value = "";
    public void context(){
        try {
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value, 10, TimeUnit.SECONDS);

            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            // 伪代码
            JRedis = jedis = JRedisUtils.getJRedis();

            String lua_scripts =
                    "if redis.call('setnx',KEYS[1],ARGV[1]) == 1 then\n" +
                    "   redis.call('expire',KEYS[1],ARGV[2])\n" +
                    "else\n" +
                    "   return 0\n" +
                    "end;";
            Object result = jedis.eval(lua_scripts, Collections.singletonList(REDIS_LOCK), Collections.singletonList(value))
            if (result.equals("1")) {
                System.out.println("删除key成功");
            }
                    
            if (jedis != null) {
                jedis.close();
            }

            if (redisTemplate.opsForvalue().get(REDIS_LOCK).equalsIgnoreCase(value)){
                redisTemplate.delete(REDIS_LOCK);
            }
        }
    }
```
除了用这中方式，也可以用Redis事务来处理方式四带来的问题。

对于上面的解决方法，其实并没有真正的解决缓存续期的问题，还是会带来能存在锁过期释放，业务没执行完的问题。

#### 方式六
参考文章：
- https://www.cnblogs.com/yunlongn/p/14609443.html

针对缓存续期的问题，我们可以开一个守护线程，每隔一段时间检查锁是否还存在，存在则对锁的过期时间延长，防止锁过期提前释放。

`Redisson`框架解决了这个问题：
```
    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedissonClient redisson;

    final String REDIS_LOCK = "redis_lock_demo";
    // 保证value值唯一,这里是伪代码
    final String value = "";
    public void context(){
        RLock lock = redisson.getLock(REDIS_LOCK);
        try {
            lock.lock(REDIS_LOCK);

            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            lock.unlock();
        }
    }
```

`Redisson`大致工作原理：只要线程一加锁成功，就会启动一个`watch dog`看门狗，它是一个后台线程，会每隔10秒检查一下，如果线程一还持有锁，那么就会不断的延长锁key的生存时间。
因此，`Redisson`解决了锁过期释放，业务没执行完问题。

![Redis详解-011](/iblog/posts/images/essays/Redis详解-011.png)

看似完美的解决方案，但是在高并发下可能也会出现下面的异常：
```
Caused by: java.lang.IllegalMonitorStateException: attempt to unlock lock, not locked by current thread by node id: 32caba49-5799-491b-aa7b-47d789dbca93 thread-id: 1
```
异常出现的原因，加锁和解锁的线程不是同一个。

#### 方式七
针对上面的异常，需要判断当前线程是否持有锁，如果还持有，则释放，如果未持有，则说明已被释放:
```
    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedissonClient redisson;

    final String REDIS_LOCK = "redis_lock_demo";
    // 保证value值唯一,这里是伪代码
    final String value = "";
    public void context(){
         RLock lock = redisson.getLock(REDIS_LOCK);
        try {
            lock.lock(REDIS_LOCK);

            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            // 查询当前线程是否持有此锁
            if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
```
这样写，程序的健壮性会更好，代码会更加严谨。


## Redis内存淘汰策略
长期把Redis做缓存用，总有一天Redis内存总会满的。有没有相关这个问题，Redis内存满了会怎么样？

在`redis.conf`中把Redis内存设置为1个字节，做一个测试：
```
// 默认单位就是字节
maxmemory 1 
```
设置完之后重启为了确保测试的准确性，重启一下Redis，之后在用下面的命令，向Redis中存入键值对,模拟Redis打满的情况：
```
set k1 v1
```
执行完后会看到下面的信息：
```
(error) OOM command not allowed when used memory > 'maxmemory'.
```
大意：OOM，当当前内存大于最大内存时，这个命令不允许被执行。

是的，Redis也会出现OOM，正因如此，我们才要避免这种情况发生，正常情况下，不考虑极端业务，Redis不是MySql数据库，不能什么都往里边写，一般情况下Redis只存放热点数据。

Redis默认最大内存是全部的内存，我们在实际配置的时候，一般配实际服务器内存的3/4也就足够了。

### 删除策略
正因为Redis内存打满后报OOM，为了避免出现该情况所以要设置Redis的删除策略。思考一个问题，一个键到了过期时间之后是不是马上就从内存中被删除的？

当然不是的，那过期之后到底什么时候被删除？是个什么操作？

Redis提供了三种删除策略：
1. 定时删除：创建一个定时器，定时随机的对key执行删除操作；
2. 惰性删除：类似与懒加载，每次只有用到key的时候才会检查，该key是否已经过期，如果过期进行删除操作；
3. 定期删除：每隔一段时间，就会检查删除掉过期的key；

定时删除，即用时间换空间；它对于内存来说是友好的，定时清理出干净的空间，但是对于CPU来说并不是友好的，程序需要维护一个定时器，这就会占用CPU资源。

惰性的删除，即用空间换时间；它对于CPU来说是友好的，CPU不需要维护其它额外的操作，但是对于内存来说是不友好的，因为要是有些key一直没有被访问到，就会一直占用着内存。

定期删除，是上面两种方案的折中方案，它每隔一段时间删除过期的key，也就是根据具体的业务，合理的取一个时间定期的删除key。

若果在数据量很大的情况下，定时删除时，key从来没有被检查到过；惰性删除时，key从来没有被使用过，这样就会造成内存泄漏，大量的key堆积在内存中，导致Redis内存空间紧张。

所以我们必须有一个兜底方案，即Redis的内存淘汰策略。

### 淘汰策略
在 `Redis 4.0` 版本之前有 6 种策略，4.0 增加了 2种，主要新增了 `LFU` 算法。下图为 `Redis 6.2.0` 版本的配置文件：

![Redis详解-012](/iblog/posts/images/essays/Redis详解-012.png)

淘汰策略默认,使用`noeviction`，意思是不再驱逐的，即等着内存被打满。
```
The default is:
maxmemory-policy noeviction
```
| 策略名称               | 描述                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `noeviction`(默认策略) | 不会驱逐任何key，即内存满了就报错。   |
| `allkeys-lru`          | 所有key都是使用**LRU算法**进行淘汰。                         |
| `volatile-lru`         | 所有**设置了过期时间的key使用LRU算法**进行淘汰。             |
| `allkeys-random`       | 所有的key使用**随机淘汰**的方式进行淘汰。                    |
| `volatile-random`      | 所有**设置了过期时间的key使用随机淘汰**的方式进行淘汰。      |
| `volatile-ttl`         | 所有设置了过期时间的key**根据过期时间进行淘汰，越早过期就越快被淘汰**。 |

假如在Redis中的数据有一部分是热点数据，而剩下的数据是冷门数据，或者我们不太清楚我们应用的缓存访问分布状况，这时可以使用`allkeys-lru`。

可以在`redis.conf`配置文件中配置:
```
maxmemory-policy allkeys-lru   // 淘汰策略名字
```
当然也可以动态的配置，在Redis运行时修改：
```
// 设置内存淘汰策略
config set maxmemory-policy allkeys-lru

// 查看内存淘汰策略
config get maxmemory-policy
```

### LRU算法及实现
LRU是，`Least Recently Used`的缩写，即最近最少使用，是一种常用的页面置换算法。

>页面置换算法：
>进程运行时，若其访问的页面不在内存而需将其调入，但内存已无空闲空间时，就需要从内存中调出一页程序或数据，送入磁盘的对换区，其中选择调出页面的算法就称为页面置换算法。

这个算法的思想就是： 如果一个数据在最近一段时间没有被访问到，那么在将来它被访问的可能性也很小。所以，当指定的空间已存满数据时，应当把最久没有被访问到的数据淘汰。

明白了思想之后，要实现LRU算法，首先要确定数据结构，再确定实现思路。如果对算法有要求，查询和插入的时间复杂度都是`O(1)`，可以选用链表+哈希的结构来存储：

![Redis详解-013](/iblog/posts/images/essays/Redis详解-013.png)

#### 方式一
链表+哈希，我们不难想到JDK中的`LinkedHashMap`,在`LinkedHashMap`文档注释中找到关于LRU算法的相关描述：
>A special {@link #LinkedHashMap(int,float,boolean) constructor} is provided to create a linked hash map whose order of iteration is the order  in which its entries were last accessed,from least-recently accessed to most-recently (<i>access-order</i>).  This kind of map is well-suited to building LRU caches.

大意：`{@link #LinkedHashMap(int,float,boolean)}`提供了一个特殊的构造器来创建一个链表散列映射，其迭代顺序为其条目最后访问的顺序，从最近最少访问到最近最近(`access-order`)。这种映射非常适合构建LRU缓存。

参照`LinkedHashMap`实现LRU算法：
```
public class MainTest {

    public static void main(String[] args) {
        LRUDemo<Integer,String> list0 = new LRUDemo<>(3,true);
        System.out.println("-------------accessOrder等于true-------------");
        context(list0);
        System.out.println("-------------accessOrder等于false-------------");
        LRUDemo<Integer,String> list1 = new LRUDemo<>(3,false);
        context(list1);
    }
    
    public static void context(LRUDemo<Integer,String> list){
        list.put(1,"a");
        list.put(2,"b");
        list.put(3,"c");
        System.out.println(list.keySet());

        list.put(4,"d");
        System.out.println(list.keySet());
        System.out.println();

        list.put(3,"123");
        System.out.println(list.keySet());

        list.put(3,"1234");
        System.out.println(list.keySet());

        list.put(3,"12345");
        System.out.println(list.keySet());
        System.out.println();

        list.put(5,"123456");
        System.out.println(list.keySet());
    }
}

class LRUDemo<K,V> extends LinkedHashMap<K,V>{

    private int capacity;

    public LRUDemo(int capacity, boolean accessOrder) {
        /**
         * accessOrder the ordering mode -
         * <tt>true</tt> for access-order 存取顺序:如果存贮集合中有相同的元素，再次插入时先删除在插入
         * <tt>false</tt> for insertion-order 插入顺序：不会因为集合中有相同元素，再次插入该元素就会打乱位置
         */
        super(capacity,0.75f,accessOrder);
        this.capacity = capacity;
    }

    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return super.size() > capacity;
    }
}
```

#### 方式二
除了可以参照`LinkedHashMap`，也可以自己手动实现：
```
public class MainTest {

    public static void main(String[] args) {
        LRUDemo<Integer,String> list0 = new LRUDemo<>(3);
        context(list0);
    }

    public static void context(LRUDemo<Integer,String> list){
        list.put(1,"a");
        list.put(2,"b");
        list.put(3,"c");
        System.out.println(list.getMap().keySet());

        list.put(4,"d");
        System.out.println(list.getMap().keySet());
        System.out.println();

        list.put(3,"123");
        System.out.println(list.getMap().keySet());

        list.put(3,"1234");
        System.out.println(list.getMap().keySet());

        list.put(3,"12345");
        System.out.println(list.getMap().keySet());
        System.out.println();

        list.put(5,"123456");
        System.out.println(list.getMap().keySet());
    }
}

class LRUDemo<K, V> {

    static class Node<K,V>{
        K key;
        V value;
        Node<K,V> prev;
        Node<K, V> next;

        public Node(){
            prev = next = null;
        }

        public Node(K key,V value){
            this.key = key;
            this.value = value;
        }
    }

    static class DoubleLinkedList<K,V>{
        Node<K,V> head;
        Node<K, V> tail;

        public DoubleLinkedList(){
            head = new Node<>();
            tail = new Node<>();
            
            // 如果变成尾插法，需要调换头、尾指针的指向
            head.next = tail;
            tail.prev = head;
        }

        public void putHead(Node<K, V> node){
            node.next = head.next;
            node.prev = head; // 将新结点插到头部
            head.next.prev = node;
            head.next = node;
        }

        public void remove(Node<K, V> node){
            node.prev.next = node.next;
            node.next.prev = node.prev;
            node.prev = node.next = null;
        }

        public Node<K,V> getLastNode(){
            return tail.prev;
        }
    }

    private int capacity;
    private Map<K, Node<K,V>> map;
    private DoubleLinkedList<K,V> doubleLinkedList;

    public Map<K, Node<K, V>> getMap() {
        return map;
    }

    public LRUDemo(int capacity){
        this.capacity = capacity;
        this.map = new HashMap<>();
        doubleLinkedList = new DoubleLinkedList<>();
    }

    public void put(K key,V val){
        if (key == null || val == null){
            return;
        }
        // 如果集合中key已经存在，则先删除
        if (map.containsKey(key)){
            Node<K, V> node = map.get(key);
            node.value = val;
            map.put(key,node);

            // 刷新node
            doubleLinkedList.remove(node);
            doubleLinkedList.putHead(node);
        }else {
            // 删除最少使用的key
            if (map.size() == capacity){
                Node<K, V> lastNode = doubleLinkedList.getLastNode();
                doubleLinkedList.remove(lastNode);
                map.remove(lastNode.key);
            }
            Node<K, V> newNode = new Node<>(key,val);
            map.put(key,newNode);
            doubleLinkedList.putHead(newNode);
        }
    }

    public V get(K key){
        if (!map.containsKey(key)){
            return null;
        }
        Node<K, V> node = map.get(key);

        // 刷新结点位置，将该key移动到队列头部
        doubleLinkedList.remove(node);
        doubleLinkedList.putHead(node);
        return node.value;
    }
}
```
## Redis持久化
**什么是Redis持久化？** 持久化就是把内存的数据写到磁盘中去，防止服务宕机了内存数据丢失。Redis 提供了两种持久化方式:RDB（默认） 和AOF。

- RDB，简而言之，就是在指定的时间间隔内，将 redis 存储的数据生成快照并存储到磁盘等介质上；
- AOF，则是换了一个角度来实现持久化，那就是将 redis 执行过的所有写指令记录下来，在下次 redis 重新启动时，只要把这些写指令从前到后再重复执行一遍，就可以实现数据恢复了；

其实 RDB 和 AOF 两种方式也可以同时使用，在这种情况下，则会**优先采用 AOF 方式来进行数据恢复**，这是因为 AOF 方式的数据恢复完整度更高。如果你没有数据持久化的需求，也完全可以关闭 RDB 和 AOF 方式，这样的话，redis 将变成一个纯内存数据库，就像 `memcache` 一样。

### RDB持久化
RDB （Redis DataBase）方式，是将 redis 某一时刻的数据持久化到磁盘中，是一种快照式的持久化方法。

#### 相关配置
- 在redis.conf中配置文件名称,默认是dump.rdb：
    ```
    dbfilename dump.rdb
    ```
- rdb文件的保存路径，也可以修改。默认为Redis启动时命令行所在的目录下：
    ```
    dir ./
    ```
- 默认的快照配置：
    ```
    save 3600 1
    save 30 10
    save 60 10000
    ```
- 当Redis无法写入磁盘的话，直接关掉Redis的写操作,默认yes：
    ```
    stop-writes-on-bgsave-error yes
    ```
- 对于存储到磁盘中的快照，可以设置是否进行压缩存储。如果是的话，redis会采用LZF算法进行压缩：
    ```
    rdbcompression yes
    ```
- 检查数据完整性,在存储快照后，还可以让redis使用CRC64算法来进行数据校验，但是这样做会增加大约10%的性能消耗，如果希望获取到最大的性能提升，可以关闭此功能，推荐yes：
    ```
    rdbchecksum yes
    ```

#### 执行过程
redis 在进行数据持久化的过程中，会先将数据写入到一个临时文件中，待持久化过程都结束了，才会用这个临时文件替换上次持久化好的文件。正是这种特性，让我们可以随时来进行备份，因为快照文件总是完整可用的。对于 RDB 方式，redis 会单独创建（fork）一个子进程来进行持久化，而主进程是不会进行任何 IO 操作的，这样就确保了 redis 极高的性能。

> fork：
>- 在Linux程序中，fork()会产生一个和父进程完全相同的子进程，但子进程在此后多会exec系统调用，出于效率考虑，Linux中引入了“写时复制技术”；
>- 一般情况父进程和子进程会共用同一段物理内存，只有进程空间的各段的内容要发生变化时，才会将父进程的内容复制一份给子进程；

![Redis详解-020](/iblog/posts/images/essays/Redis详解-020.png)

如果需要进行大规模数据的恢复，且对于数据恢复的完整性不是非常敏感，那 RDB 方式要比 AOF 方式更加的高效。虽然 RDB 有不少优点，但它的缺点也是不容忽视的：丢失数据风险较大，fork进程在保存rdb文件时会先复制旧文件，如果文件较大则耗时较多。如果你对数据的完整性非常敏感，那么 RDB 方式就不太适合你，因为即使你每 5 分钟都持久化一次，当 redis 故障时，仍然会有近 5 分钟的数据丢失。所以，redis 还提供了另一种持久化方式，那就是 AOF。

### AOF持久化
AOF，英文是 Append Only File，即只允许追加不允许改写的文件。如前面介绍的，AOF 方式是**将执行过的写指令记录下来**，在数据恢复时按照从前到后的顺序再将指令都执行一遍。

#### 相关配置
- 在redis中AOF默认时不开启的：
    ```
    appendonly no
    ```
- AOF文件名称,文件路径与rdb保持一致：
    ```
    appendfilename "appendonly.aof"
    ```
- AOF同步频率设置：默认的 AOF 持久化策略是每秒钟 fsync 一次（fsync 是指把缓存中的写指令记录到磁盘中），因为在这种情况下，redis 仍然可以保持很好的处理性能，即使 redis 故障，也只会丢失最近 1 秒钟的数据。

    1. 始终同步，每次Redis的写入都会立刻记入日志；性能较差但数据完整性比较好：
    ```
    appendfsync always
    ```
    2. 每秒同步，每秒记入日志一次，如果宕机，本秒的数据可能丢失：
    ```
    appendfsync everysec
    ```
    3. redis不主动进行同步，把同步时机交给操作系统：
    ```
    appendfsync no
    ```
- Rewrite压缩：AOF采用文件追加方式，文件会越来越大为避免出现此种情况，新增了重写机制,当AOF文件的大小超过所设定的阈值时，Redis就会启动AOF文件的内容压缩，只保留可以恢复数据的最小指令集。举个例子或许更形象，假如我们调用了 100 次 INCR 指令，在 AOF 文件中就要存储 100 条指令，但这明显是很低效的，完全可以把这 100 条指令合并成一条 SET 指令，这就是重写机制的原理。在进行 AOF 重写时，仍然是采用先写临时文件，全部完成后再替换的流程，所以断电、磁盘满等问题都不会影响 AOF 文件的可用性。

    1. 设置重写的基准值，文件达到100%时开始重写：
    ```
    auto-aof-rewrite-percentage
    ```
    2. 设置重写的基准值，最小文件64MB。达到这个值开始重写：
    ```
    auto-aof-rewrite-min-size
    ```
    > 例如：文件达到70MB开始重写，降到50MB，下次什么时候开始重写？
    > 系统载入时或者上次重写完毕时，Redis会记录此时AOF大小，设为base_size,如果Redis的AOF文件当前大小>= base_size +base_size*100% (默认)且当前大小>=64mb(默认)的情况下，Redis会对AOF进行重写。
    > 
    >当前base_size为50MB，根据公式：base_size +base_size*100% = 100MB

- 如果在追加日志时，恰好遇到磁盘空间满或断电等情况导致日志写入不完整，也没有关系，可以进行恢复：
    ```
    redis-check-aof --fix AOP文件名称
    ```

#### 执行过程
![Redis详解-021](/iblog/posts/images/essays/Redis详解-021.png)

- 客户端的请求写命令会被append追加到AOF缓冲区内；
- AOF缓冲区根据AOF持久化策略[always,everysec,no]将操作sync同步到磁盘的AOF文件中；
- AOF文件大小超过重写策略或手动重写时，会对AOF文件rewrite重写，压缩AOF文件容量；
- Redis服务重启时，会重新load加载AOF文件中的写操作达到数据恢复的目的；

AOF 方式的一个好处，我们通过一个“场景再现”来说明。某同学在操作 redis 时，不小心执行了 FLUSHALL，导致 redis 内存中的数据全部被清空了，这是很悲剧的事情。不过这也不是世界末日，只要 redis 配置了 AOF 持久化方式，且 AOF 文件还没有被重写（rewrite），我们就可以用最快的速度暂停 redis 并编辑 AOF 文件，将最后一行的 FLUSHALL 命令删除，然后重启 redis，就可以恢复 redis 的所有数据到 FLUSHALL 之前的状态了。这就是 AOF 持久化方式的好处之一。但是如果 AOF 文件已经被重写了，那就无法通过这种方法来恢复数据了。

虽然优点多多，但 AOF 方式也同样存在缺陷，比如在同样数据规模的情况下，AOF 文件要比 RDB 文件的体积大。而且 AOF 方式的恢复速度也要慢于 RDB 方式。

### 对比及使用
官方推荐两个都启用，如果对数据不敏感，可以选单独用RDB，如果对数据不敏感，可以选单独用RDB，如果只是做纯内存缓存，可以都不用。

|              | RDB                                      | AOF                                                          |
| ------------ | ---------------------------------------- | ------------------------------------------------------------ |
| 定义         | 在指定的时间间隔能对你的数据进行快照存储 | 记录每次对服务器的写操作,当服务器重启的时候会重新执行这些命令来恢复原始的数据,AOF命令以redis协议追加保存每次写的操作到文件末尾 |
| 优先级       | 低                                       | 高                                                           |
| 数据完整性   | 易丢失                                   | 不易丢失                                                     |
| 恢复数据速度 | 较快                                     | 较慢                                                         |
| 数据文件损坏 | 不能修复                                 | 可使用命令进行修复                                           |
| 数据文件大小 | 较小                                     | 较大，但是可压缩                                             |




