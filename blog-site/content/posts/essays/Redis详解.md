---
title: "Redis详解"
date: 2021-06-17
draft: false
tags: ["分布式","详解","Redis"]
slug: "java-redis"
---


## 概述
`Redis`全称`Remote Dictionary Server`，是一个开源的使用`ANSI C`语言编写、遵守BSD协议、支持网络、可基于内存亦可持久化的日志型、`Key-Value`数据库，并提供多种语言的API的非关系型数据库。
简而言之，`Redis`是一个可基于内存亦可持久化的日志型、`Key-Value`非关系型数据库。

非关系型数据库，简称`NoSQL`，是`Not Only SQL`的缩写，是对不同于传统的关系型数据库的数据库管理系统的统称，泛指非关系型的数据库。
`NoSQL`不依赖业务逻辑方式存储，而以简单的`Key-Value`模式存储。因此大大的增加了数据库的扩展能力。

`Redis`提供高性能的内存存储和丰富的数据结构支持，具备灵活的持久化机制以及强大的高可用性和分布式扩展能力。同时，`Redis`通过事务和脚本增强了操作的原子性和灵活性。
但是`Redis`面临内存限制问题，大数据集存储可能受限；持久化操作可能对性能造成影响；单线程模型在高并发情况下可能成为瓶颈；复杂的数据结构和操作也可能需要额外的优化。

`Redis`主要用于缓存数据、会话存储、实时数据处理、排行榜和计数器、分布式锁、发布/订阅系统、数据过期管理和全页缓存等场景。
其高性能、支持丰富数据结构和操作的特性，使其成为处理高并发、快速读写和实时数据需求的理想解决方案。

## Redis数据类型
Redis可以存储键和不同类型的值之间的映射。键的类型只能为字符串，值常见有五种数据类型，字符串、列表、集合、散列表、有序集合，`Redis`后续的更新中又新添加了位图、地理位置等数据类型。

| 数据类型              | 描述                                             | 使用场景                                |
|-------------------|--------------------------------------------------|----------------------------------------|
| 字符串（String）       | 最基本的数据类型，存储文本或二进制数据。                    | 缓存、会话存储、简单数据存储                    |
| 哈希（Hash）          | 存储键值对集合，适用于表示对象或字典。                        | 用户信息存储、配置管理                        |
| 列表（List）          | 双端链表，支持有序的元素集合。                          | 消息队列、任务调度、栈操作                      |
| 集合（Set）           | 无序且不允许重复元素的集合。                           | 标签管理、去重、社交网络好友关系                |
| 有序集合（Sorted Set）  | 每个元素有一个分数，按分数排序。                         | 排行榜、排名系统、延迟队列                    |
| 位图（Bitmap）        | 高效存储和操作位数据。                                | 用户活跃度统计、权限管理                       |
| 基数统计（HyperLogLog） | 用于估算唯一元素的数量，提供近似值。                      | 大规模去重统计、唯一用户数统计                |
| 地理位置（Geospatial）  | 存储和查询地理位置数据。                              | 地理位置服务、位置附近的搜索                  |

### String
`Redis`的`String`类型是`Redis`支持的最基本数据类型之一。它的主要特点是简单、高效，适用于存储和操作文本或二进制数据。
`Redis` `String`类型是一种键值对存储结构，其中键是唯一的，值可以是任意的二进制数据，包括文本、图像等。`String`类型的值可以达到`512MB`，这是`Redis`中支持的最大值长度。

`String`的数据结构为简单动态字符串。是可以修改的字符串，内部结构实现上类似于Java的`ArrayList`，采用预分配冗余空间的方式来减少内存的频繁分配。

![Redis详解-001](/iblog/posts/annex/images/essays/Redis详解-001.png)

内部为当前字符串实际分配的空间`capacity`一般要高于实际字符串长度`len`。当字符串长度小于1M时，扩容都是加倍现有的空间，如果超过`1M`，扩容时一次只会多扩`1M`的空间。需要注意的是字符串最大长度为`512M`。

常用命令：
- 添加键值对：`set <key> <value>`；
- 查询对应键值：`get <key>`；
- 将给定的`<value>`追加到原值的末尾：`append <key> <value>`；
- 获得值的长度：`strlen <key>`；
- 只有在`<key>`不存在时设置<key>的值：`setnx <key> <value>`；
- 将`<key>`中储存的数字值增1，只能对数字值操作，如果为空，新增值为1：`incr <key>`；
- 将`<key>`中储存的数字值减1，只能对数字值操作，如果为空，新增值为-1：`decr <key>`；
- 将`<key>`中储存的数字值增减，自定义步长：`incrby/decrby <key><步长>`；

### List
`Redis`列表是简单的字符串列表，按照插入顺序排序。你可以添加一个元素到列表的头部或者尾部，单键多值。
它的底层实际是个双向链表，对两端的操作性能很高，通过索引下标的操作中间的节点性能会较差。

![Redis详解-002](/iblog/posts/annex/images/essays/Redis详解-002.png)

`List`的数据结构为快速链表`quickList`。首先在列表元素较少的情况下会使用一块连续的内存存储，这个结构是`ziplist`，也即是压缩列表。
它将所有的元素紧挨着一起存储，分配的是一块连续的内存。当数据量比较多的时候才会改成`quicklist`。

常用命令：
- 从左边/右边插入一个或多个值：`lpush/rpush <key><value1><value2><value3>`；
- 从左边/右边吐出一个值：`lpop/rpop <key>`；
- 从`<key1>`列表右边吐出一个值，插到<key2>列表左边：`rpoplpush <key1><key2>`；
- 按照索引下标获得元素，从左到右，`0 -1`表示获取所有：`lrange <key><start><stop>`；
- 获得列表长度：`llen <key>`；
- 在`<value>`的后面插入<newvalue>插入值：`linsert <key> before <value><newvalue>`；
- 从左边删除n个`<value>`：`lrem <key><n><value>`；
- 将列表`key`下标为`<index>`的值替换成value：`lset <key><index><value>`；

### Set
`Redis` `Set`对外提供的功能与`List`类似是一个列表的功能，特殊之处在于`Set`是可以自动去重的。
当你需要存储一个列表数据，又不希望出现重复数据时，`Set`是一个很好的选择，并且`Set`提供了判断某个成员是否在一个`Set`集合内的重要接口，这个也是`List`所不能提供的。

`Redis`的`Set`是`String`类型的无序集合。它底层其实是一个`value`为`null`的`hash`表，所以添加，删除，查找的复杂度都是`O(1)`。
> 复杂度O(1)：数据增加，查找数据的时间不变。

`Set`数据结构是`dict`字典，字典是用哈希表实现的。在Java中`HashSet`的内部实现使用的是`HashMap`，只不过所有的`value`都指向同一个对象。`Redis`的`Set`结构也是一样，它的内部也使用`Hash`结构，所有的`value`都指向同一个内部值。

常用命令：
- 将一个或多个元素加入到集合`key`中，已经存在的元素将被忽略：`sadd <key><value1><value2>`
- 取出该集合的所有值：`smembers <key>`
- 判断集合`<key>`是否为含有该`<value>`值，有1，没有0：`sismember <key><value>`
- 返回该集合的元素个数：`scard<key>`
- 删除集合中的某个元素：`srem <key><value1><value2>`
- 随机从该集合中吐出一个值，可指定key，会从集合中删除：`spop <key>`
- 随机从该集合中取出n个值，不会从集合中删除：`srandmember <key><n>`
- 把集合中一个值从一个集合移动到另一个集合：`smove <source Key><destination Key><value>`
- 返回两个集合的交集元素：`sinter <key1><key2>`
- 返回两个集合的并集元素：`sunion <key1><key2>`
- 返回两个集合的差集元素(`key1`中的，不包含`key2`中的)：`sdiff <key1><key2>`

### Hash  
`Redis`中的`hash`是一个键值对集合。`hash`是一个`String`类型的`field`和`value`的映射表，`hash`特别适合用于存储对象。类似Java里面的`Map`。
`hash`类型对应的数据结构是两种，`ziplist`（压缩列表），`hashtable`（哈希表）。当`field-value`长度较短且个数较少时，使用`ziplist`，否则使用`hashtable`。

常用命令：
- 给`<key>`集合中的`<field>`键赋值`<value>`：`hset <key><field><value>`；
- 从`<key1>`集合`<field>`取出`value`：`hget <key1><field>`；
- 批量设置`hash`的值：`hmset <key1><field1><value1><field2><value2>...`；
- 查看哈希表`<key>`中，给定域`<field>`是否存在：`hexists<key1><field>`；
- 列出该`hash`集合的所有`<field>`：`hkeys <key>`；
- 列出该`hash`集合的所有`<value>`：`hvals <key>`；
- 为哈希表`<key>`中的域`<field>`的值加上增量1：`hincrby <key><field><increment>`；
- 将哈希表`<key>`中的域`<field>`的值设置为`<value>`，当且仅当域`<field>`不存在：`hsetnx <key><field><value>`；

### ZSet
`Sorted Set`有序集合也称为`ZSet`，`Redis`有序集合`ZSet`与普通集合`Set`非常相似，是一个没有重复元素的字符串集合。
不同之处是有序集合的每个成员都关联了一个评分，这个评分被用来按照从最低分到最高分的方式排序集合中的成员。集合的成员是唯一的，但是评分可以是重复了 。

因为元素是有序的，所以你也可以很快的根据评分或者次序来获取一个范围的元素。
访问有序集合的中间元素也是非常快的，因此你能够使用有序集合作为一个没有重复成员的智能列表。

`Sorted Set`是`Redis`提供的一个非常特别的数据结构，一方面它等价于Java的数据结构`Map`，可以给每一个元素`value`赋予一个权重`score`，另一方面它又类似于`TreeSet`，内部的元素会按照权重`score`进行排序，可以得到每个元素的名次，还可以通过`score`的范围来获取元素的列表。

`Sorted Set`底层使用了两个数据结构：
- `hash`：`hash`的作用就是关联元素`value`和权重`score`，保障元素`value`的唯一性，可以通过元素`value`找到相应的`score`值;
- 跳跃表：跳跃表的目的在于给元素`value`排序，根据`score`的范围获取元素列表;

有序集合在生活中比较常见，例如根据成绩对学生排名，根据得分对玩家排名等。对于有序集合的底层实现，可以用数组、平衡树、链表等。数组不便元素的插入、删除；平衡树或红黑树虽然效率高但结构复杂；链表查询需要遍历所有效率低。
Redis采用的是跳跃表。跳跃表效率堪比红黑树，实现远比红黑树简单。举例：对比有序链表和跳跃表，从链表中查询出51。
- 有序链表：查找值为51的元素，需要从第一个元素开始依次查找、比较才能找到;共需要6次比较。

   ![Redis详解-003](/iblog/posts/annex/images/essays/Redis详解-003.png)
- 跳跃表：从第2层开始，1节点比51节点小，向后比较；21节点比51节点小，继续向后比较，后面就是NULL了，所以从21节点向下到第1层；在第1层，41节点比51节点小，继续向后，61节点比51节点大，所以从41向下；在第0层，51节点为要查找的节点，节点被找到，共查找4次。
   
   ![Redis详解-004](/iblog/posts/annex/images/essays/Redis详解-004.png)

可以看出跳跃表比有序链表效率要高。

常用命令：
- 将一个或多个元素及其`score`值加入到有序集`key`当中：`zadd  <key><score1><value1><score2><value2>...`；
- 返回有序集`key`中，下标在`<start><stop>`之间的元素，带`withscores`，可以让分数一起和值返回到结果集：`zrange <key><start><stop> [WITHSCORES]`；
- 返回有序集`key`中，所有`score`值介于`min`和`max`之间(包括等于`min`或`max`)的成员，有序集成员按`score`值递增次序排列：`zrangebyscore key minmax [withscores] [limit offset count]`；
- 为元素的`score`加上增量：`zincrby <key><increment><value>`；
- 删除该集合下，指定值的元素：`zrem <key><value>`；
- 统计该集合，分数区间内的元素个数：`zcount <key><min><max>`；
- 返回该值在集合中的排名，从0开始：`zrank <key><value>`；

### Bitmaps
`Bitmaps`并不是一种数据结构，实际上它就是字符串，但是可以对字符串的位进行操作。

>bit（位）简介：现代计算机用二进制（位）作为信息的基础单位，1个字节等于8位， 例如“abc”字符串是由3个字节组成，但实际在计算机存储时将其用二进制表示。“abc”分别对应的ASCII码分别是97、 98、 99， 对应的二进制分别是01100001、 01100010和01100011。

`Bitmaps`单独提供了一套命令，所以在`Redis`中使用`Bitmaps`和使用字符串的方法不太相同。
可以把`Bitmaps`想象成一个以位为单位的数组，数组的每个单元只能存储0和1，数组的下标在`Bitmaps`中叫做偏移量。

![Redis详解-009](/iblog/posts/annex/images/essays/Redis详解-009.png)

常用命令：
- 设置`Bitmaps`中某个偏移量的值0或1，`offset`偏移量从0开始：`setbit <key><offset><value>`；
- 获取`Bitmaps`中某个偏移量的值，获取键的第`offset`位的值，`offset`偏移量从0开始，不存在则返回0：`getbit <key><offset>`；
- 统计字符串从`start`字节到`end`字节`bit`值为1的数量：`bitcount <key>[start end]`；

`Bitmap`主要用于高效存储和处理大量二进制标志数据。它适合用于用户活跃度统计，比如记录用户每日登录状态；权限标志管理，每个权限用一位表示；大规模去重，如日志中的唯一用户统计；以及数据标记，比如任务完成情况。
由于其紧凑的存储和高效的位操作能力，`Bitmap`能够处理大规模的二进制数据，并提供快速的位级访问和操作。

### HyperLogLog
Redis在2.8.9版本添加了`HyperLogLog`结构，`HyperLogLog`是用来做基数统计的算法。
`HyperLogLog`的优点是，在输入元素的数量或者体积非常非常大时，计算基数所需的空间总是固定的、并且是很小的。适用于需要处理大量唯一值而又不要求精确计数的场景。

> HyperLogLog中的基数：比如数据集 {1, 3, 5, 7, 5, 7, 8}， 那么这个数据集的基数集为 {1, 3, 5 ,7, 8}，不重复元素为5个，5就是基数。基数估计就是在误差可接受的范围内，快速计算基数。

在`Redis`里面，每个`HyperLogLog`键只需要花费`12KB`内存，就可以计算接近`2^64`个不同元素的基数。这和计算基数时，元素越多耗费内存就越多的集合形成鲜明对比。
但是因为`HyperLogLog`只会根据输入元素来计算基数，而不会储存输入元素本身，所以`HyperLogLog`不能像集合那样，返回输入的各个元素。

常用命令：
- 添加指定元素到`HyperLogLog`中，估计的近似基数发生变化，则返回1，否则返回0：`pfadd <key>< element> [element ...]`；
- 计算`<key>`的近似基数：`pfcount<key> [key ...]`；
- 将一个或多个`<key>`合并后的结果存储在另一个`<key>`中：`pfmerge <destkey><sourcekey> [sourcekey ...]`；

`Redis` `HyperLogLog`主要用于估算大规模数据集中的唯一元素数量，尤其在需要处理大量唯一值但不要求精确计数的场景下。
它适合用于网站或应用中的唯一用户数统计、流量分析、广告点击量、搜索查询以及日志去重等场景。

### Geospatial
`Geospatial`是一种用于存储和处理地理位置信息的功能。它允许你在`Redis`中存储地理坐标，并基于这些坐标进行各种地理空间查询。
这个功能非常适合处理需要地理位置数据的应用场景，如位置服务、地理搜索、附近商店推荐等。
> 两极无法直接添加，一般会下载城市数据，直接通过 Java 程序一次性导入。有效的经度从 -180 度到 180 度。有效的纬度从 -85.05112878 度到 85.05112878 度。当坐标位置超出指定范围时，该命令将会返回一个错误。已经添加的数据，是无法再次往里面添加的。

常用命令：
- 添加地理位置，`key`名称、经度、纬度、名称：`geoadd <key>< longitude><latitude><member> [longitude latitude member...]`；
- 获得指定地区的坐标值：`geopos  <key><member> [member...]`；
- 获取两个位置之间的直线距离，默认单位，米、km表示单位为千米、mi表示单位为英里、ft表示单位为英尺：`geodist <key><member1><member2>  [m|km|ft|mi ]`；
- 以给定的经纬度为中心，找出某一半径内的元素：`georadius <key><longitude><latitude><radius><m|km|ft|mi> [withcoord]`；

## IO多路复用
`Redis`作为一个高性能的内存数据库，设计上必须能够处理大量的并发客户端请求。在传统的线程或进程模型中，每个连接通常会占用一个线程或进程，这在处理高并发时会导致大量的资源消耗和上下文切换开销。
IO多路复用技术允许`Redis`在一个线程中高效地处理多个IO操作，从而解决了这一问题。

`Redis`的IO多路复用通过事件循环机制处理多个并发连接。它利用操作系统的多路复用接口，如`select`、`poll`、`epoll`、`kqueue`和`IOCP`来监控多个IO操作。
在单线程中，`Redis`等待操作系统通知哪些IO操作有数据可读或可写，一旦有数据可用，`Redis`处理这些数据并响应客户端请求。这种方法减少了上下文切换和资源消耗，实现了高效的并发处理。

`Redis` IO复用流程如下：
1. 当`Redis`启动时，初始化IO多路复用机制，`Redis`会根据操作系统选择适当的多路复用机制。
2. 当Redis启动并接受客户端连接时，每个客户端连接的`socket`文件描述符会被注册到多路复用机制中。`Redis`指定需要关注的事件类型，如读取数据或写入数据。
3. 之后`Redis`进入一个无限循环，调用多路复用机制的API进入等待状态。事件循环在等待期间不会消耗CPU资源，直到有IO事件发生。
4. 多路复用机制会监视注册的文件描述符。当这些文件描述符上的IO事件，如数据到达、准备好写入等发生时，会将这些事件通知`Redis`。
5. 如果通知表示文件描述符可读，即客户端发送了请求数据，`Redis`从`socket`中读取数据并将其处理。如果通知表示文件描述符可写，`Redis`需要将响应数据发送到客户端，`Redis`将数据写入`socket`。
6. 处理完当前事件后，`Redis`继续回到事件循环，等待新的IO事件的到来。

## 单线程模型
`Redis`的核心运行在一个主线程中，这个线程负责处理所有的客户端请求。单线程的设计避免了多线程环境中的许多复杂问题，如锁竞争和上下文切换，从而简化了代码并提高了性能。

`Redis`的命令大多数都是原子操作，即在执行过程中不会被中断。这种特性保证了即使在高并发的环境下，操作也能保持一致性。
由于`Redis`采用单线程模型，它避免了多线程环境中的上下文切换开销。这种设计能够减少系统资源的浪费，提高整体性能。

虽然`Redis`运行在单线程中，但它使用了IO多路复用技术来处理多个客户端的连接。
通过IO多路复用，`Redis`能够同时监控多个文件描述符，而不会阻塞主线程。这种技术可以让`Redis`高效地处理大量的并发连接。

在`Redis6.x`引入了多线程机制，主要用于优化网络IO操作，从而提高性能。这一改进是为了充分利用现代多核CPU的优势。

`Redis 6.x`引入的多线程机制主要用于优化网络IO操作，带来了显著的优点和一些潜在的缺点。优点包括提高了高并发环境下的性能，使`Redis`能够更有效地利用多核CPU，从而减少了主线程的阻塞时间和请求延迟。
多线程IO使`Redis`在处理大量客户端连接时表现更为出色，提升了系统的整体吞吐量。但是这也带来了一些复杂性，例如线程安全问题和配置管理。
适当的配置和性能测试是必要的，便于多线程带来的性能提升达到预期效果并避免潜在的问题。使用场景包括高并发环境或需要处理大量并发连接的应用，特别是那些对响应时间有严格要求的系统。

## Redis常用命令

基础命令：
- 设置键`key`的值为`value`：`set <key> <value>`；
- 获取键`key`的值：`get <key>`；
- 查看当前库所有`key`：`keys *`；
- 判断某个`key`是否存在：`exists <key>`；
- 查看`key`是什么类型：`type <key>`；
- 删除指定的`key`数据：`del <key>`；
- 根据`value`选择非阻塞删除，异步删除：`unlink <key>`；
- 为给定的`key`设置过期时间：`expire key <time>`；
- 查看还有多少秒过期，-1表示永不过期，-2表示已过期：`ttl <key>`；
- 切换数据库：`select <dbid>`；
- 查看当前数据库的`key`的数量：`dbsize`；
- 清空当前库(慎用)：`flushdb`；
- 清空全部库(慎用)：`flushall`；

更多命令详见：[https://www.redis.com.cn/commands.html](https://www.redis.com.cn/commands.html)

## Redis发布订阅
`Redis`发布订阅是一种消息通信模式，发布发送者发送消息，订阅者接收消息。允许客户端通过发布消息到频道和订阅频道来实现消息的广播。这种机制支持实时消息推送，非常适合用于聊天系统、实时更新等场景。

客户端将消息发送到一个或多个频道。

![Redis详解-006](/iblog/posts/annex/images/essays/Redis详解-006.png)

`Redis`客户端可以订阅任意数量的频道。客户端订阅一个或多个频道，接收这些频道的消息。

![Redis详解-005](/iblog/posts/annex/images/essays/Redis详解-005.png)

实现`Redis`发布订阅模式：
1. 打开两个`Redis`客户端;
2. 在其中一个客户端输入：`subscribe <channel>`，`channel`为订阅的频道名称：
![Redis详解-008](/iblog/posts/annex/images/essays/Redis详解-008.png)
3. 在另外一个客户端输入：`publish <channel> <message>`，`channel`为订阅的频道名称，`message`为推送的消息，返回的1是订阅者数量：
![Redis详解-007](/iblog/posts/annex/images/essays/Redis详解-007.png)

`Redis`中的发布订阅模式实现简单，支持低延迟的实时消息广播，并且通过模式匹配功能能够满足复杂的订阅需求。适用于实时聊天系统、实时通知和动态内容推送等场景。
但是`Redis`发布订阅不支持消息持久化，导致消息丢失无法恢复，但是消息的可靠性较低，离线客户端可能会错过消息。大量的订阅和消息发布也可能对`Redis`的性能产生影响。

## Redis事务
`Redis`事务是一个单独的隔离操作，事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。
`Redis`事务的核心特性包括批量执行和原子性，但不支持传统意义上的事务隔离级别。`Redis`事务的主要作用就是串联多个命令防止别的命令插队。
由于`Redis`的事务不支持复杂的隔离级别或回滚功能，它们主要用于简单的原子性需求，不适合需要复杂事务管理的场景。

`Redis`事务主要命令：
- `MULTI`：开始一个事务。该命令标志着事务的开始，接下来的所有命令将会被排队。
- `EXEC`：执行事务中的所有命令。此命令将会一次性执行在`MULTI`命令之后排队的所有命令。
- `DISCARD`：放弃事务，取消队列中的所有命令。
- `WATCH key [key ...]`：监视一个或多个键。如果在事务执行前被监视的键被修改，则事务会被打断。
- `UNWATCH`：取消对所有键的监视。

![Redis详解-014](/iblog/posts/annex/images/essays/Redis详解-014.png)

在事务开始之前，可以使用`WATCH`命令监视一个或多个键。如果这些键在事务执行期间被修改，事务会被打断。这样可以防止在事务执行过程中由于数据竞争导致的不一致性问题。

从输入`MULTI`命令开始，输入的命令都会依次进入命令队列中，但不会执行，直到输入`EXEC`后，`Redis`会将之前的命令队列中的命令依次执行。事务内的命令按顺序执行，不会被其他客户端的命令干扰。
组队的过程中可以通过`DISCARD`命令来放弃组队。`Redis`事务在执行过程中发生错误不会自动回滚已经执行的命令。如果其中某个命令失败，其他命令仍会执行。

`MULTI`、`EXEC`组队成功，提交成功示例：
```shell
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

`MULTI`、`DISCARD`组队失败，提交失败示例：
```shell
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

如果在组队过程中执行某个命令失败了，则认为组队失败整个队列都会被取消。

![Redis详解-015](/iblog/posts/annex/images/essays/Redis详解-015.png)

```shell
127.0.0.1:6379> multi
OK
127.0.0.1:6379(TX)> set k1 v1
QUEUED
127.0.0.1:6379(TX)> set k2
(error) ERR wrong number of arguments for 'set' command
127.0.0.1:6379(TX)> exec
(error) EXECABORT Transaction discarded because of previous errors.
```

如果执行阶段某个命令出了错，则只有报错的命令不会被执行，而其他的命令都会执行且不会回滚。

![Redis详解-016](/iblog/posts/annex/images/essays/Redis详解-016.png)

```shell
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

## Redis与缓存
`Redis`作为缓存具有高性能、丰富的数据结构和灵活的过期机制等优点。由于`Redis`将数据存储在内存中，它能提供极低的延迟和高吞吐量，适合用于缓存数据库查询结果、会话数据和实时数据处理等场景。
`Redis`的多种数据结构支持不同的缓存需求，如缓存静态内容、实现简单的消息队列，以及处理实时统计信息。

用户第一次访问数据库中的某些数据。整个过程会比较慢，因为是从硬盘上读取的。如果将该用户访问的数据存在数缓存中，这样下一次再访问这些数据的时候就可以直接从缓存中获取了。
操作缓存就是直接操作内存，所以速度相当快，但随之而来的也会存在一些问题。

### 一致性问题
只要用缓存，就可能会涉及到缓存与数据库双存储双写，你只要是双写，就一定会有数据一致性的问题。
缓存一致性问题发生在缓存中的数据与源数据之间存在不一致的情况。这种不一致可能会导致系统中的数据错误或不准确。

解决一致性问题的关键在于，当源数据发生更改时，缓存中的数据也需要更新。

在更新源数据时，同时更新缓存和源数据库。这种方式保持了数据的一致性，因为所有写操作都会同时在缓存和数据库中完成。写操作的延迟可能增加，特别是在高负载情况下，更新操作可能成为性能瓶颈。
适用于对数据一致性要求高的场景，例如金融系统和实时数据处理系统，其中一致性比性能更重要。

另一种方法是异步更新，先更新缓存，再通过后台任务异步更新源数据库。这种方式提高了写操作的性能，因为数据库更新是异步进行的，减少了写入延迟。缓存的写入速度较快，有助于提升用户体验。但数据库和缓存之间可能出现最终一致性问题，数据库更新的延迟可能导致缓存数据与源数据库不一致。
适用于数据一致性要求可以容忍一定延迟的场景，如在线购物网站和社交媒体平台，其中用户体验和性能优于即时一致性。

缓存失效策略在读取数据时，如果缓存中不存在数据或数据已过期，会从源数据库加载数据并更新缓存。这种方式通过重新加载来保持数据的一致性。
缓存失效或数据过期时，总是从源数据库中获取最新数据，避免了缓存和数据库间的数据不一致问题。读取延迟可能增加，特别是缓存频繁失效时，且频繁的数据库访问可能增加负载。
适用于读取操作较多的场景，例如内容分发网络或新闻网站，通过缓存失效平衡数据一致性和性能。

当缓存或数据库更新失败时，也会导致数据不一致的问题。为了解决这个问题，可以采取几种方法。
可以设置自动重试机制，如果更新操作失败，系统会尝试重新执行更新，增加成功的可能性，虽然这样可能会增加系统的负担。
另一种方法是使用备用缓存，在主缓存更新失败时，将数据写入备用缓存，并在主缓存恢复正常时进行同步，这样可以保持系统的正常运转。记录更新失败的情况，并触发报警，也能帮助快速发现问题，防止问题长时间存在。
还可以将缓存更新操作放在后台任务中，并设置补偿机制来修复数据不一致。如果后台任务失败，补偿机制会尝试重新同步数据。

### 大Key问题
所谓的大`Key`问题是指某个`Key`的`value`比较大，所以本质上是大`value`问题。因为`Key`往往是程序可以自行设置的，`value`往往不受程序控制，因此可能导致`value`很大。
大`Key`占用的内存非常多，可能导致`Redis`实例的内存使用量急剧增加。大Key的读取、写入或删除可能会显著拖慢`Redis`的性能。例如，操作一个非常大的列表会占用大量的CPU和IO资源，导致其他操作的响应时间变慢。

大`Key`问题一般是由于业务方案设计不合理，没有预见`value`的动态增长问题产生的。一直往`value`塞数据，没有删除机制，迟早要爆炸或数据没有合理做分片，将大`Key`变成小`Key`。
在线上一般通过设置`Redis`监控，及时发现和处理大Key问题。可以使用工具监控键的大小，避免存储异常大的数据项。

解决思路：
- 可在应用层或客户端设置最大键值大小限制，防止大`Key`被写入`Redis`。
- 定期检查`Redis`中的大`Key`，并进行必要的清理或优化操作。
- 如果`Redis`中已经存在大`Key`，根据大`Key`的实际用途可以分为可删除和不可删除，如果发现某些大`Key`并非热`Key`就可以在DB中查询使用，则可以在`Redis`中删掉。
如果不可删除，则需要拆分大`Key`，将大`Key`拆分成多个小`Key`，然后进行删除。

### 缓存穿透
缓存穿透是指查询请求绕过缓存直接访问数据库，通常是因为请求中的数据在缓存中不存在。这个问题可能导致缓存失效，增加数据库负担，并影响系统性能。
缓存穿透的原因通常是，用户请求的数据在缓存和数据库中都不存在，或者是请求的数据在缓存中未命中，直接查询数据库，并未将结果正确地缓存起来。

![Redis详解-027](/iblog/posts/annex/images/essays/Redis详解-027.png)

解决方法：
- 布隆过滤器：布隆过滤器是一种空间高效的数据结构，用于判断某个元素是否在集合中。它可以减少对数据库的访问次数，通过在缓存层使用布隆过滤器，来快速判断请求的数据是否可能存在于数据库中。
将可能存在的键加入布隆过滤器。在每次查询之前，先检查布隆过滤器。如果布隆过滤器显示数据不存在，则直接返回空值或错误，不访问数据库。
    ```java
    public class BloomFilterExample {
        private BloomFilter<String> bloomFilter;
        private StringRedisTemplate redisTemplate;
        
        public BloomFilterExample(StringRedisTemplate redisTemplate) {
            this.redisTemplate = redisTemplate;
            // Initialize Bloom Filter with an expected insertions and false positive probability
            this.bloomFilter = BloomFilter.create(Funnels.stringFunnel(Charsets.UTF_8), 100000, 0.01);
        }
    
        public String getData(String key) {
            // Check if the key is in the Bloom Filter
            if (!bloomFilter.mightContain(key)) {
                return null; // Key definitely not in cache or DB
            }
    
            // Check cache
            String value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                return value;
            }
    
            // Load from DB (simulate)
            value = loadFromDatabase(key);
    
            // Cache the result and add to Bloom Filter
            if (value != null) {
                redisTemplate.opsForValue().set(key, value);
                bloomFilter.put(key);
            }
    
            return value;
        }
    
        private String loadFromDatabase(String key) {
            // Simulate DB access
            return "DatabaseValueFor" + key;
        }
    }
    ```
- 缓存空对象：当数据库查询返回空结果时，将空结果缓存到`Redis`中，使用一个特殊的标识，如空字符串、`null`、特定的空值对象等。后续相同的查询可以直接从缓存中获取空结果，避免再次访问数据库。
设置空对象的缓存时间较短，避免长时间缓存无效数据。
    ```java
    public class CacheEmptyObjectExample {
        private static final String EMPTY_OBJECT_PLACEHOLDER = "EMPTY";
        private StringRedisTemplate redisTemplate;
    
        public CacheEmptyObjectExample(StringRedisTemplate redisTemplate) {
            this.redisTemplate = redisTemplate;
        }
    
        public String getData(String key) {
            // Check cache
            String value = redisTemplate.opsForValue().get(key);
            if (EMPTY_OBJECT_PLACEHOLDER.equals(value)) {
                return null; // Data definitely does not exist
            }
            if (value != null) {
                return value;
            }
    
            // Load from DB (simulate)
            value = loadFromDatabase(key);
    
            if (value != null) {
                redisTemplate.opsForValue().set(key, value);
            } else {
                redisTemplate.opsForValue().set(key, EMPTY_OBJECT_PLACEHOLDER);
            }
    
            return value;
        }
    
        private String loadFromDatabase(String key) {
            // Simulate DB access
            return null; // Simulate no data found
        }
    }
    ```


### 缓存击穿
缓存击穿 是指在缓存中某个热点数据的缓存失效时，多个请求同时访问数据库，导致数据库压力剧增的情况。
这种问题通常发生在缓存数据过期或被删除时，如果请求大量集中在短时间内，可能会导致数据库负载急剧上升。

![Redis详解-028](/iblog/posts/annex/images/essays/Redis详解-028.png)

解决方法：
- 加锁机制：在缓存失效时，对数据的访问进行加锁，保证只有一个请求能够从数据库中加载数据并更新缓存。其他请求需要等待锁释放后，才能获取缓存中的数据。
    ```java
    public class CacheLockExample {
        private StringRedisTemplate redisTemplate;
        private RedisTemplate<String, Object> redisLockTemplate;
        private static final String LOCK_KEY_PREFIX = "lock:";
    
        public CacheLockExample(StringRedisTemplate redisTemplate, RedisTemplate<String, Object> redisLockTemplate) {
            this.redisTemplate = redisTemplate;
            this.redisLockTemplate = redisLockTemplate;
        }
    
        public String getData(String key) {
            String cacheKey = "cache:" + key;
            String lockKey = LOCK_KEY_PREFIX + key;
    
            // Check cache
            String value = redisTemplate.opsForValue().get(cacheKey);
            if (value != null) {
                return value;
            }
    
            // Acquire lock
            Boolean lockAcquired = redisLockTemplate.opsForValue().setIfAbsent(lockKey, "locked");
            if (lockAcquired != null && lockAcquired) {
                try {
                    // Load from DB (simulate)
                    value = loadFromDatabase(key);
    
                    // Cache the result
                    if (value != null) {
                        redisTemplate.opsForValue().set(cacheKey, value);
                    }
                } finally {
                    // Release lock
                    redisLockTemplate.delete(lockKey);
                }
            } else {
                // Wait for lock to be released and retry
                try {
                    Thread.sleep(100); // Wait for 100 milliseconds
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                return redisTemplate.opsForValue().get(cacheKey);
            }
    
            return value;
        }
    
        private String loadFromDatabase(String key) {
            // Simulate DB access
            return "DatabaseValueFor" + key;
        }
    }
    ```
- 缓存预热：在缓存过期前，提前将热点数据加载到缓存中，减少缓存失效对数据库的冲击。这可以通过定期刷新缓存或使用缓存预热策略来实现。
    ```java
    public class CachePreheatExample {
        private StringRedisTemplate redisTemplate;
    
        public CachePreheatExample(StringRedisTemplate redisTemplate) {
            this.redisTemplate = redisTemplate;
        }
    
        public void preheatCache() {
            // Simulate loading all hotspot data
            for (String key : getHotspotKeys()) {
                String value = loadFromDatabase(key);
                if (value != null) {
                    redisTemplate.opsForValue().set("cache:" + key, value);
                }
            }
        }
    
        private Iterable<String> getHotspotKeys() {
            // Simulate getting all hotspot keys
            return List.of("key1", "key2", "key3");
        }
    
        private String loadFromDatabase(String key) {
            // Simulate DB access
            return "DatabaseValueFor" + key;
        }
    }
    ```

### 缓存雪崩
缓存雪崩 是指当大量缓存同时失效或遭遇问题时，造成大量请求同时涌入数据库，导致数据库负载过重，从而引发服务不可用的情况。这种情况常见于缓存失效时间集中或缓存服务宕机等场景。

![Redis详解-029](/iblog/posts/annex/images/essays/Redis详解-029.png)

解决方法：
- 缓存过期时间随机化：通过对缓存的过期时间进行随机化，避免所有缓存同时过期。根据业务需求设置合理的缓存过期时间。避免缓存过期时间设置过长或过短，导致缓存失效的集中现象。
    ```java
    public class CacheRandomExpirationExample {
        private StringRedisTemplate redisTemplate;
        private static final int EXPIRATION_TIME = 600; // 10 minutes
    
        public CacheRandomExpirationExample(StringRedisTemplate redisTemplate) {
            this.redisTemplate = redisTemplate;
        }
    
        public String getData(String key) {
            String cacheKey = "cache:" + key;
            String value = redisTemplate.opsForValue().get(cacheKey);
    
            if (value != null) {
                return value;
            }
    
            // Load from DB (simulate)
            value = loadFromDatabase(key);
    
            if (value != null) {
                // Set cache with random expiration time between 10 and 20 minutes
                int expiration = EXPIRATION_TIME + (int) (Math.random() * 600);
                redisTemplate.opsForValue().set(cacheKey, value, expiration, TimeUnit.SECONDS);
            }
    
            return value;
        }
    
        private String loadFromDatabase(String key) {
            // Simulate DB access
            return "DatabaseValueFor" + key;
        }
    }
    ```
- 使用多级缓存：引入多级缓存策略，比如本地缓存和分布式缓存结合使用。这样即使分布式缓存失效，本地缓存仍能提供服务，减少对数据库的压力。
    ```java
    public class MultiLevelCacheExample {
        private StringRedisTemplate redisTemplate;
        private Cache<String, String> localCache;
    
        public MultiLevelCacheExample(StringRedisTemplate redisTemplate) {
            this.redisTemplate = redisTemplate;
            this.localCache = Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .build();
        }
    
        public String getData(String key) {
            // Check local cache first
            String value = localCache.getIfPresent(key);
            if (value != null) {
                return value;
            }
    
            String cacheKey = "cache:" + key;
            value = redisTemplate.opsForValue().get(cacheKey);
            if (value != null) {
                localCache.put(key, value);
                return value;
            }
    
            // Load from DB (simulate)
            value = loadFromDatabase(key);
    
            if (value != null) {
                redisTemplate.opsForValue().set(cacheKey, value, 10, TimeUnit.MINUTES);
                localCache.put(key, value);
            }
    
            return value;
        }
    
        private String loadFromDatabase(String key) {
            // Simulate DB access
            return "DatabaseValueFor" + key;
        }
    }
    ```

## Redis部署策略

| 部署方式        | 描述                                                                                              |
|-----------------|---------------------------------------------------------------------------------------------------|
| 单机部署        | 适用于对数据可靠性要求不高、规模较小的应用。部署简单，但没有冗余和高可用性。                             |
| 主从复制        | 数据从主节点同步到一个或多个从节点，提升读性能和数据备份能力。主节点处理写操作，从节点处理读请求。适用于需要读扩展和备份的场景。 |
| 哨兵模式        | 提供监控、自动故障转移和高可用性。通过多个 Sentinel 节点监控 Redis 实例，主节点故障时自动切换到从节点。适用于需要高可用性的场景。 |
| Redis 集群      | 数据分布在多个节点上，通过分片和复制实现水平扩展和高可用性。适合大规模应用，支持负载均衡和自动故障转移，但配置复杂。       |

### 单机部署
`Redis`单机部署是最基本的部署方式，适用于对数据可靠性和高可用性要求不高的小型应用或开发环境。

单机部署配置简单，通常只需要安装`Redis`并启动即可，不涉及复杂的集群或高可用配置。所有数据和处理任务都集中在一个节点上，因此其性能直接受到单个服务器资源（CPU、内存、磁盘IO）的限制。
但只有一个`Redis`实例，没有数据备份或冗余机制，如果服务器发生故障，则可能会导致数据丢失或服务中断。

Redis单机部署是最基础的使用方式，适用于对高可用性和扩展性要求不高的场景，但在生产环境中，通常需要考虑更复杂的部署策略来提高可靠性和性能。

### 主从复制
主从复制，是指将一台`Redis`服务器的数据，复制到其他的`Redis`服务器。前者称为主节点，后者称为从节点，数据的复制是单向的，只能由主节点到从节点。主节点以写为主，从节点以读为主。

![Redis详解-022](/iblog/posts/annex/images/essays/Redis详解-022.png)

`Redis`主从复制 通过将数据从主节点同步到一个或多个从节点来提高读性能和数据备份能力。其主要优点在于可以分担读操作负载，通过从节点处理读请求，从而减轻主节点的压力，并提供数据备份。
如果主节点出现故障，可以将从节点提升为新的主节点，实现一定程度的容错和数据恢复。适用于读操作频繁的场景，或需要备份数据的环境。

不过，由于主从复制默认是异步的，从节点的数据可能会有延迟，导致读取的数据可能不是最新的。此外，所有写操作仍由主节点处理，主节点可能成为性能瓶颈。
主节点故障时，需要额外的工具来实现自动故障转移和高可用性。主从复制最适合用于读多写少的应用，以及需要数据备份和读扩展的场景。

### 哨兵模式
哨兵模式是`Redis`提供的一种高可用性解决方案，用于管理`Redis`实例的监控、故障转移和通知。
它通过多个`Sentinel`节点来实现`Redis`系统的高可用性和故障恢复，来保证`Redis`服务的持续运行。

![Redis详解-026](/iblog/posts/annex/images/essays/Redis详解-026.png)

`Sentinel`节点周期性地向`Redis`实例发送`ping`请求，检查其响应状态。如果检测到主节点或从节点的响应超时或不正常，`Sentinel`会将其标记为“下线”状态。
当主节点被标记为故障，`Sentinel`节点会进行选举，从多个从节点中选择一个提升为新的主节点。
一旦选定新的主节点，`Sentinel`会通知其他从节点并更新它们的配置，使它们从新的主节点进行数据同步。最后`Sentinel`更新客户端的配置，保证它们能够连接到新的主节点。

`Redis`哨兵模式 提供了高可用性解决方案，通过多个`Sentinel`节点来实现对`Redis`系统的监控和故障转移。它的主要优点是能够自动处理主节点故障，将从节点提升为新的主节点，从而减少服务中断时间，增强系统的稳定性和可靠性。
哨兵模式还可以自动更新客户端配置，使客户端迅速连接到新的主节点，从而减少了人工干预的需求。该模式适用于生产环境中对`Redis`服务有高可用性要求的应用。

但是，哨兵模式也存在一些缺点。配置和管理多个`Sentinel`节点可能增加系统复杂性，特别是在大规模部署时。
此外，监控和故障转移的过程可能带来性能开销，并且在故障转移期间可能会出现短暂的数据不一致。
哨兵模式最适合那些需要高可用性和自动故障恢复的场景，但需要平衡其带来的复杂性和性能影响。

### Redis集群
`Redis`集群是一种分布式部署解决方案，用于在多个`Redis`节点上分片数据，实现高可用性和水平扩展。`Redis`集群可以将数据自动分布到多个主节点上，并提供自动故障转移功能，来保证数据的高可用性。

`Redis`集群模式是哨兵模式的一种拓展，在没有`Redis`集群的时候，人们使用哨兵模式，所有的数据都存在`master`上面，但`master`的压力越来越大，垂直扩容再多的`salve`已经不能分担`master`的压力的，因为所有的写操作集中都集中在`master`上。
所以人们就想到了水平扩容，就是搭建多个`master`节点。客户端进行分片，手动的控制访问其中某个节点。但是这几个节点之间的数据是不共享的。并且如果增加一个节点，需要手动的将数据进行迁移，维护起来很麻烦。

`Redis`集群是无中心化集群，即每个结点都是入口。`Redis`集群通过分区来提供一定程度的可用性，即使集群中有一部分节点失效或者无法进行通讯，集群也可以继续处理命令请求。

`Redis`集群提供了一种分布式解决方案，通过将数据分片到多个主节点上，实现了水平扩展和高可用性。
它的主要优点是能够处理大规模的数据和高并发请求，自动故障转移功能减少了服务中断时间，同时分散了数据和负载，减少了单点故障的风险。
该模式非常适合需要处理大量数据和高流量的应用，例如大型网站、实时数据分析系统以及高性能缓存场景。

不过，`Redis`集群的配置和管理较为复杂，需要处理节点间的通信、数据分片及故障恢复问题。此外，在集群模式下的写操作涉及多个节点，可能会导致操作延迟增加。
网络延迟较高时，集群性能可能会受到影响。因此，这种模式最适合需要高可用性和扩展能力的应用，但在实施时需要考虑到其复杂性和潜在的性能影响。

## Redis内存管理
长期把`Redis`做缓存用，总有一天`Redis`内存总会满的。有没有思考过这个问题，`Redis`内存满了会怎么样？
在`redis.conf`中把`Redis`内存设置为1个字节，做一个测试：
```text
// 默认单位就是字节
maxmemory 1 
```
设置完之后重启是为了保证测试的准确性，重启一下`Redis`，之后在用下面的命令，向`Redis`中存入键值对，模拟`Redis`打满的情况：
```shell
set k1 v1
```
执行完后会看到下面的信息：
```text
(error) OOM command not allowed when used memory > 'maxmemory'.
```
大意：`OOM`，当前内存大于最大内存时，这个命令不允许被执行。

`Redis`也会出现`OOM`，正因如此，我们才要避免这种情况发生。正常情况下，不考虑极端业务，`Redis`只存放热点数据，`Redis`不是`MySQL`数据库，不能什么都往里边写。
`Redis`默认最大内存是全部的内存，我们在实际配置的时候，一般配实际服务器内存的3/4也就足够了。

### 删除策略
正因为`Redis`内存打满后报`OOM`，为了避免出现该情况所以要设置`Redis`的删除策略。`Redis`提供了几种删除策略：
- 定期删除：在后台定期扫描数据库并删除过期数据。这种方法能有效清理过期数据，防止积累大量无用数据，保持内存使用效率。定期删除可能导致性能开销增加，尤其是当数据量很大时。适用于需要清理过期数据的场景，如缓存系统中的临时数据管理。
- 惰性删除：在客户端访问数据时检查数据是否过期，如果过期则删除。实现简单，对 Redis 性能的影响较小，但可能导致过期数据在被访问前仍然存在，占用内存。适合对数据过期处理要求不严格的应用，尤其是在需要高性能的场景中。
- 过期时间：策略允许为每个键设置过期时间，数据到达指定时间后会自动删除。精确控制数据的生命周期，可以避免过期数据占用空间。需要管理过期时间，增加了一定的复杂度。适用于需要精确控制数据生命周期的应用，例如缓存数据和会话管理。
- 主动删除：通过应用逻辑或管理工具手动删除数据，可以根据业务需求自定义删除规则。提供了灵活的删除控制，但需要额外的管理和维护工作，删除操作可能影响 Redis 性能。适合需要手动管理或根据业务逻辑自定义删除规则的场景。

### 淘汰策略
`Redis`的内存淘汰策略用于管理当 Redis 数据库达到最大内存限制时，决定如何处理额外的数据。淘汰策略默认，使用`noeviction`，意思是不再驱逐的，即等着内存被打满。
`Redis`内存淘汰策略在`Redis 4.0`版本之前有6种策略，4.0增加了两种，主要新增了`LFU`算法。下图为`Redis 6.2.0`版本的配置文件：

![Redis详解-012](/iblog/posts/annex/images/essays/Redis详解-012.png)

| 策略名称         | 描述                                           | 优点                                             | 缺点                                             | 使用场景                                            |
|------------------|------------------------------------------------|--------------------------------------------------|--------------------------------------------------|-----------------------------------------------------|
| noeviction       | 当达到最大内存限制时，拒绝所有写操作。         | 保持数据完整性，不会自动删除任何数据。           | 一旦达到内存限制，所有新的写操作都会失败。       | 对数据完整性要求高，不希望数据被自动删除的场景。   |
| allkeys-lru      | 在所有键中使用 LRU 算法来淘汰数据。             | 能够有效释放内存空间，保留活跃数据。             | LRU 算法的性能可能会受到大规模数据集的影响。     | 数据访问模式有明显使用频率差异的场景。             |
| allkeys-random   | 在所有键中随机选择一些进行删除。               | 实现简单，开销较小。                             | 删除的数据是随机的，重要数据可能被淘汰。         | 对数据重要性没有明确排序的场景。                   |
| volatile-lru     | 只在设置了过期时间的键中使用 LRU 算法进行淘汰。 | 优先淘汰过期数据，能更好地利用内存。             | 对没有设置过期时间的键没有影响。                | 希望优先淘汰过期数据，同时保留重要数据的场景。     |
| volatile-random  | 只在设置了过期时间的键中随机选择一些进行删除。 | 实现简单，不需要计算键的使用频率。               | 删除的数据是随机的，可能会淘汰重要的过期数据。   | 需要删除过期数据，但对具体选择方式要求不高的场景。 |
| volatile-ttl     | 只在设置了过期时间的键中，优先淘汰即将过期的键。 | 能够控制内存使用，同时保留即将过期的数据。       | 可能会导致频繁的内存释放操作，增加 Redis 的管理开销。 | 优先删除即将过期的数据的场景。                     |

在`Redis`中，最常使用的内存淘汰策略通常是`allkeys-lru`和`volatile-lru`。

`allkeys-lru`策略在 Redis 达到内存限制时，会在所有存储的键中使用`LRU`算法进行数据淘汰。无论键是否设置了过期时间，`Redis`都会选择最近最少使用的键进行删除，释放内存。
这种策略适用于需要对所有数据进行管理的场景，例如`web`缓存和会话管理，可以有效保留访问频率高的数据。

相比之下，`volatile-lru`策略只对设置了过期时间的键使用 LRU 算法。当`Redis`达到内存限制时，它会在所有设置了过期时间的键中选择最近最少使用的数据进行淘汰。
未设置过期时间的键不会被考虑，这样能够保留重要的未过期数据。这种策略适合有明确过期需求的应用，如缓存系统和用户会话存储，能够有效管理内存而不会影响长期存在的数据。

区别在于处理数据的范围。`allkeys-lru`适用于管理所有存储的键，考虑所有数据的使用情况；`volatile-lru`专注于管理设置了过期时间的键，优先淘汰过期数据，保留未过期的键。
`volatile-lru`适合处理需要管理过期数据的场景，而`allkeys-lru`适用于全面管理所有数据的情况。

### LRU算法
`LRU`是`Least Recently Used`的缩写，即最近最少使用，是一种常用的页面置换算法。

>页面置换算法：进程运行时，若其访问的页面不在内存而需将其调入，但内存已无空闲空间时，就需要从内存中调出一页程序或数据，送入磁盘的对换区，其中选择调出页面的算法就称为页面置换算法。

这个算法的思想是，如果一个数据在最近一段时间没有被访问到，那么在将来它被访问的可能性也很小。所以当指定的空间已存满数据时，应当把最久没有被访问到的数据淘汰。
`LRU`算法常用于缓存管理，目的是在缓存满时，保留最常使用的数据，同时移除最久未被使用的数据。

使用哈希表与双向链表结合实现`LRU`算法：
```java
class LRUCache {
    private final int capacity;
    private final HashMap<Integer, Node> cache;
    private final DoublyLinkedList list;

    class Node {
        int key, value;
        Node prev, next;

        Node(int key, int value) {
            this.key = key;
            this.value = value;
        }
    }

    class DoublyLinkedList {
        private final Node head, tail;

        DoublyLinkedList() {
            head = new Node(-1, -1);
            tail = new Node(-1, -1);
            head.next = tail;
            tail.prev = head;
        }

        void addFirst(Node node) {
            node.next = head.next;
            node.prev = head;
            head.next.prev = node;
            head.next = node;
        }

        void remove(Node node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }

        Node removeLast() {
            if (tail.prev == head) return null;
            Node node = tail.prev;
            remove(node);
            return node;
        }
    }

    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        this.list = new DoublyLinkedList();
    }

    public int get(int key) {
        if (!cache.containsKey(key)) return -1;
        Node node = cache.get(key);
        list.remove(node);
        list.addFirst(node);
        return node.value;
    }

    public void put(int key, int value) {
        if (cache.containsKey(key)) {
            Node node = cache.get(key);
            list.remove(node);
            node.value = value;
            list.addFirst(node);
        } else {
            if (cache.size() >= capacity) {
                Node tail = list.removeLast();
                if (tail != null) cache.remove(tail.key);
            }
            Node node = new Node(key, value);
            list.addFirst(node);
            cache.put(key, node);
        }
    }
}
```
使用哈希表提供快速查找，同时利用链表维护访问顺序。哈希表保证了操作的平均时间复杂度为`O(1)`，适合高效的缓存实现。

## Redis持久化
`Redis`持久化是将内存中的数据保存到磁盘，是防止数据丢失的机制。`Redis`提供了两种主要的持久化方式：
- `RDB`：`Redis`会在指定的时间间隔内创建数据的快照，并将快照保存到磁盘。这种方式会生成一个包含所有数据的二进制文件。
- `AOF`：`Redis`会将所有对数据库的写操作记录到一个日志文件中。每次写操作都会被追加到`AOF`文件的末尾。

| 特性   | RDB（快照）                         | AOF（追加文件）                     |
|--------|------------------------------------|-------------------------------------|
| 描述   | 在指定时间间隔内生成内存数据的快照并保存到磁盘 | 记录所有写操作并追加到日志文件中    |
| 优点 | 1. 快速恢复数据   2. 生成的快照文件压缩，占用磁盘空间较小                   | 1. 数据持久性高，几乎不丢失数据  2. 支持不同的同步策略      |
| 缺点 | 1. 快照生成时 Redis 会阻塞服务  2. 可能丢失快照间隔期间的数据     | 1. 文件可能变得很大，恢复速度较慢  2. 写操作性能可能会受到影响   |
| 使用场景 | 适用于对数据持久化要求不高但需要快速恢复的场景，如缓存和数据分析系统 | 适用于对数据持久性要求高的场景，如金融系统和在线事务处理系统 |

`RDB`持久化方式在设定的时间间隔内将内存数据生成快照并保存到磁盘。
其优点包括生成的快照文件体积较小，占用的磁盘空间较少，且数据恢复速度较快。这种方式适用于对数据持久化要求不高但需要快速恢复的场景，如缓存系统和数据分析应用。
生成快照的过程可能会阻塞`Redis`，影响系统性能。如果发生故障，快照间隔期间的数据可能会丢失。

`AOF`持久化方式通过记录所有的写操作，并将这些操作追加到日志文件中来实现数据持久化。
`AOF`提供了较高的数据持久性，因为几乎不会丢失数据，并且支持多种同步策略，以满足不同的需求。适用于对数据一致性要求高的场景，如金融系统和在线事务处理。
`AOF`文件可能会变得非常大，导致恢复速度较慢，且写操作的性能可能受到影响。`AOF`还需要定期进行日志重写和压缩，来维持文件的管理。

`RDB`和`AOF`这两种方式不是说非要用一种，也可以同时使用。同时使用时，则会优先采用`AOF`方式来进行数据恢复，这是因为`AOF`方式的数据恢复完整度更高。
如果你没有数据持久化的需求，也完全可以关闭`RDB`和`AOF`方式，这样的话，`Redis`将变成一个纯内存数据库，就像`Memcache`一样。
