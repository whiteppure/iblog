---
title: "MySQL详解"
date: 2024-05-30
draft: false
tags: ["数据库","详解"]
slug: "java-mysql"
---


## MySQL介绍
MySQL 是一种关系型数据库，主要用于持久化存储我们系统中的一些数据。

MySQL 如此流行的原因，主要具有下面这些优点：
- 成熟稳定，功能完善。
- 开源免费。
- 文档丰富，既有详细的官方文档，又有非常多优质文章可供参考学习。
- 开箱即用，操作简单，维护成本低。
- 兼容性好，支持常见的操作系统，支持多种开发语言。
- 社区活跃，生态完善。
- 事务支持优秀， InnoDB 存储引擎默认使用 REPEATABLE-READ 并不会有任何性能损失，并且，InnoDB 实现的 REPEATABLE-READ 隔离级别其实是可以解决幻读问题发生的。
- 支持分库分表、读写分离、高可用。

## MySQL逻辑架构
主要分为：连接层，服务层，引擎层，存储层。

客户端执行一条select命令的流程如下：

![MySqlSQL优化及锁机制-001](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-001.png)

- 连接层：最上层是一些客户端和连接服务，包含本地sock通信和大多数基于客户端/服务端工具实现的类似于tcplip的通信。主要完成一些类似于连接处理、授权认证、及相关的安全方案。在该层上引入了线程池的概念，为通过认证安全接入的客户端提供线程。同样在该层上可以实现基于SSL的安全链接。服务器也会为安全接入的每个客户端验证它所具有的操作权限。
- 服务层：第二层架构主要完成大多少的核心服务功能，如SQL接口，并完成缓存的查询，SQL的分析和优化及部分内置函数的执行。所有跨存储引擎的功能也在这一层实现，如过程、函数等。在该层，服务器会解析查询并创建相应的内部解析树，并对其完成相应的优化如确定查询表的顺序是否利用索引等，最后生成相应的执行操作。如果是select语句，服务器还会查询内部的缓存。如果缓存空间足够大，这样在解决大量读操作的环境中能够很好的提升系统的性能。
- 引擎层：存储引擎层，存储引擎真正的负责了MySQL中数据的存储和提取，服务器通过API与存储引擎进行通信。不同的存储引擎具有的功能不同这样我们可以根据自己的实际需要进行选取，后面介绍MyISAM和InnoDB。
- 存储层：数据存储层，主要是将数据存储在运行于裸设备的文件系统之上，并完成与存储引擎的交互。

详细一点：

![MySQL基础架构](/iblog/posts/annex/images/essays/MySQL基础架构.png)

- 连接器： 登录 MySQL 的时候需要身份权限认证。
- 查询缓存： 执行查询语句的时候，会先查询缓存，不过在MySQL 8.0 版本后移除。
- 分析器： 没有命中缓存的话，SQL 语句就会经过分析器，分析器说白了就是要先看你的 SQL 语句要干嘛，再检查你的 SQL 语句语法是否正确。
- 优化器： 按照 MySQL 认为最优的方案去执行。
- 执行器： 执行语句，然后从存储引擎返回数据。执行语句之前会先判断是否有权限，如果没有权限的话，就会报错。
- 插件式存储引擎：主要负责数据的存储和读取，采用的是插件式架构，支持 InnoDB、MyISAM、Memory 等多种存储引擎。

## MySQL存储引擎
MySQL 核心在于存储引擎，MySQL 5.5.5 之前，MyISAM 是 MySQL 的默认存储引擎。5.5.5 版本之后，InnoDB 是 MySQL 的默认存储引擎。

可以使用`show engines;`来查看。

![MySQL存储引擎](/iblog/posts/annex/images/essays/MySQL存储引擎.png)

| 特性               | InnoDB                         | MyISAM                       |
|--------------------|--------------------------------|------------------------------|
| 事务支持           | 支持                           | 不支持                       |
| 锁类型             | 行级锁                         | 表级锁                       |
| 外键支持           | 支持                           | 不支持                       |
| 崩溃恢复           | 支持                           | 不支持                       |
| 数据存储           | 表和索引存储在表空间中         | 数据和索引存储在不同文件中   |
| 全文索引           | MySQL 5.6及以上版本支持        | 支持                         |
| 适用场景           | 高并发和事务性要求高的应用      | 读操作多、写操作少的应用     |
| 性能               | 写性能较好，读性能较好          | 读性能高，写性能相对较差     |
| 数据完整性         | 高                              | 低                           |

选择 InnoDB 还是 MyISAM 取决于具体的应用需求。InnoDB 适合需要高并发、高数据完整性和事务支持的应用，而 MyISAM 适合读操作多、数据一致性要求不高的应用。

尽管 MyISAM 在特定场景下仍然有其应用价值，但随着 MySQL 版本的更新和 InnoDB 性能的不断提升，大多数新应用和系统都选择了 InnoDB 作为主要存储引擎。
遗留系统可能继续使用 MyISAM，但在新开发中，使用 InnoDB 已成为主流和最佳实践。


## MySQL事务
什么是事务？举个例子：你去超市买东西，"一手交钱，一手交货"就是一个事务的例子。
交钱和交货必须同时成功，事务才算成功，其中有一个环节失败，事务将会撤销所有已成功的活动。

所以事务可以看作是一次重大的活动，它由不同的小活动组成，这些活动要么全部成功，要么全部失败。

所有的存储引擎中只有 `InnoDB`、`NDB` 是事务性存储引擎，也就是说只有 `InnoDB`、`NDB` 支持事务。

### 事物的实现
只要对数据库稍有了解的人都知道事务具有 ACID 四个基本属性，而我们不知道的可能就是数据库是如何实现这四个属性的。
简单来说，事务是通过事务日志来实现的，事务日志包括：redo log和undo log，下面详细介绍。

#### Atomicity原子性
要么全部都执行，要都不执行，不可能出现部分成功部分失败的情况，这是对原子性最简单的描述。

事务其实和一个操作没有什么太大的区别，它是一系列的数据库操作（可以理解为 SQL）的集合，如果事务不具备原子性，那么就没办法保证同一个事务中的所有操作都被执行或者未被执行了，整个数据库系统就既不可用也不可信。

想要保证事务的原子性，就需要在异常发生时，对已经执行的操作进行回滚，而在 MySQL 中，恢复机制是通过回滚日志（undo log）实现的。
为了能够在发生错误时撤销之前的全部操作，需要将之前的操作都记录下来的，所以所有事务进行的修改都会先记录到这个回滚日志中，然后再对数据库中的对应行进行操作。

回滚日志中保存的是逻辑日志，当回滚日志被使用时，它只会按照日志逻辑地将数据库中的修改撤销，相当于每一条 INSERT 都对应了一条 DELETE，每一条 UPDATE 也都对应一条相反的 UPDATE 语句。

#### Consistency一致性
数据库对于 ACID 中的一致性的定义是这样的：如果一个事务原子地在一个一致地数据库中独立运行，那么在它执行之后，数据库的状态一定是一致的。

对于这个概念，它的第一层意思就是对于数据完整性的约束，包括主键约束、引用约束以及一些约束检查等等，在事务的执行的前后以及过程中，不会违背对数据完整性的约束，所有对数据库写入的操作都应该是合法的，并不能产生不合法的数据状态。
第二层意思其实是指逻辑上的对于开发者的要求，我们要在代码中写出正确的事务逻辑，比如银行转账，事务中的逻辑不可能只扣钱或者只加钱，这是应用层面上对于数据库一致性的要求。

数据库 ACID 中的一致性，对事务的要求不止包含对数据完整性以及合法性的检查，还包含应用层面逻辑的正确。

#### Isolation隔离性
当事务都只是串行执行的时候是不会发生问题的，然而在实际工作中，并行执行的事务才是常态，并行执行下，可能出现非常复杂的问题：

当 Transaction1 在执行的过程中对 `id = 1` 的用户进行了读写，但是没有将修改的内容进行提交或者回滚，在这时 Transaction2 对同样的数据进行了读操作并提交了事务；也就是说 Transaction2 是依赖于 Transaction1 的，当 Transaction1 由于一些错误需要回滚时，因为要保证事务的原子性，需要对 Transaction2 进行回滚，但是由于我们已经提交了 Transaction2，所以我们已经没有办法进行回滚操作。
这种现象称为不可恢复安排，这种情况是我们难以接受的，如果相关的事物都回滚，这会造成性能上的巨大损失。

其实这里可以使用互斥锁来解决这个问题，比如在MySQL中，想要对读取的数据进行更新时需要使用`SELECT ... FOR UPDATE`尝试获取对应行的互斥锁，保证不同事务可以正常运行。

当多个事务同时并发执行时，事务的隔离性可能就会被违反，虽然单个事务的执行可能没有任何错误，但是从总体来看就会造成数据库的一致性出现问题，而串行虽然能够允许开发者忽略并行造成的影响，能够很好地维护数据库的一致性，但是却会影响事务执行的性能。
所以为数据库提供什么样的隔离性，也就决定了数据库的性能以及可以达到什么样的一致性。

在SQL标准中定义了四种数据库的事务的隔离级别：
- RAED UNCOMMITED：使用查询语句不会加锁，可能会读到未提交的行（Dirty Read）；
- READ COMMITED：只对记录加记录锁，而不会在记录之间加间隙锁，所以允许新的记录插入到被锁定记录的附近，所以再多次使用查询语句时，可能得到不同的结果（Non-Repeatable Read）；
- REPEATABLE READ：多次读取同一范围的数据会返回第一次查询的快照，不会返回不同的数据行，但是可能发生幻读（Phantom Read）；
- SERIALIZABLE：InnoDB 隐式地将全部的查询语句加上共享锁，解决了幻读的问题。最高的隔离级别，完全服从 ACID 的隔离级别，所有的事务依次逐个执行，这样事务之间就完全不可能产生干扰；

从 `RAED UNCOMMITED` 到 `SERIALIZABLE`，随着事务隔离级别变得越来越严格，每个事务的隔离级别其实都比上一级多解决了一个问题，但是数据库对于并发执行事务的性能也逐渐下降。

|隔离级别|	脏读	|不可重复读	|幻读|
|------|---|----|-----|
|READ-UNCOMMITTED|	√|√|√|
|READ-COMMITTED|	×|	√|	√|
|REPEATABLE-READ|	×|	×|	√|
|SERIALIZABLE|	×|	×|	×|

数据库对于隔离级别的实现，就是使用并发控制机制对在同一时间执行的事务进行控制，限制不同的事务对于同一资源的访问和更新。

锁是一种最为常见的并发控制机制，在一个事务中，并不会将整个数据库都加锁，而是只会锁住那些需要访问的数据，MySQL 和常见数据库中的锁都分为两种：读锁（共享锁）、写锁（互斥锁）。
读锁保证了读操作可以并发执行，相互不会影响，而写锁保证了在更新数据库数据时，不会有其他的事务访问或者更改同一条记录造成不可预知的问题。

除了锁，另一种实现事务隔离性的方式就是通过时间戳，但实际上就是一种乐观锁思想，PostgreSQL就是使用这种方式实现事务的数据库。
乐观锁在读取数据时不进行加锁操作，它“乐观”地认为在此期间数据不会被其他事务修改。
为了确保数据的一致性，在数据更新时验证数据的版本或者时间戳等标志信息，以此来判断数据是否被其他事务修改过。如果数据确实被修改过，则乐观锁的更新操作会失败，此时可以根据应用需求选择回滚事务。

再有就是多版本快照隔离思想。通过维护多个版本的数据，数据库可以允许事务在数据被其他事务更新时，对旧版本的数据进行读取，很多数据库都对这一机制进行了实现，也就是 MVCC。
MySQL 和 PostgreSQL 都对这一机制进行自己的实现。

#### Durability持久性
数据被写入到数据库中，那么数据一定是存储在磁盘上。事务的持久性就体现在，一旦事务被提交，那么数据一定会被写入到数据库中并持久存储起来。

当事务已经被提交之后，就无法再次回滚了，唯一能够撤回已经提交的事务的方式就是创建一个相反的事务对原操作进行撤销，这也是事务持久性的体现之一。

与原子性一样，事务的持久性也是通过日志来实现的，MySQL使用重做日志（redo log）实现事务的持久性。
重做日志由两部分组成，一是内存中的重做日志缓冲区，因为它保存在内存中，所以它是易失的，另一个就是在磁盘上的重做日志文件，它是持久的。

当我们在一个事务中尝试对数据进行修改时，首先会先将数据从磁盘读入内存，并更新内存中缓存的数据，然后生成一条重做日志并写入重做日志缓存。
当事务真正提交时，MySQL会将重做日志缓存中的内容，刷新到重做日志文件，即将内存中的数据更新到磁盘上。

在 InnoDB 中，重做日志都是以512字节的块的形式进行存储的，因为块的大小与磁盘扇区大小相同，所以重做日志的写入可以保证原子性，不会由于机器断电导致重做日志仅写入一半并留下脏数据。

### MySQL中的日志
MySQL 日志 主要包括错误日志、查询日志、慢查询日志、事务日志、二进制日志几大类。
其中，比较重要的还要属二进制日志 `binlog（归档日志）`和`redo log（重做|事物日志）`和 `undo log（回滚日志）`。

简单来说，MySQL InnoDB 引擎使用 `redo log(重做日志)` 保证事务的持久性，使用 `undo log(回滚日志)` 来保证事务的原子性。
MySQL的数据备份、主备、主主、主从都离不开 `binlog`，需要依靠 `binlog` 来同步数据，保证数据一致性。

### MVCC并发控制机制
MVCC 是一种并发控制机制，解决多个并发事务同时读写数据库产生的一些问题，用于保持数据的一致性和隔离性。

它是通过在每个数据行上维护多个版本的数据来实现的。当一个事务要对数据库中的数据进行修改时，MVCC 会为该事务创建一个数据快照，而不是直接修改实际的数据行。
读操作使用旧版本数据的快照，写操作创建新版本，并确保原版本仍可用。这样，不同的事务可以在一定程度上并发执行，而不会相互干扰。

当一个事务执行读操作时，它会使用快照读取。因为是快照读取，因此其他并发事务对数据行的修改不会影响当前事务的读取操作。
事务会查找符合条件的数据快照，并选择符合其事务开始时间的数据版本进行读取，读的是旧快照。
如果某个数据快照有多个版本，事务会选择不晚于其开始时间的最新版本，确保事务只读取在它开始之前已经存在的数据。

当一个事务执行写操作时，它会先生成一个新的数据版本快照。原始版本的数据仍然存在，供其他事务使用快照读取，这保证了其他事务不受当前事务的写操作影响。
新版本的数据会带有当前事务的版本号，以便其他事务能够正确读取相应版本的数据。然后将修改后的数据写入新版本。

当一个事务提交时，它所做的修改将成为数据库的最新版本，并且对其他事务可见。
当一个事务回滚时，它所做的修改将被撤销，对其他事务不可见。

为了防止数据库中的版本无限增长，MVCC会定期进行版本的回收。回收机制会删除已经不再需要的旧版本数据，从而释放空间。

InnoDB对MVCC的实现主要是依赖于：隐藏字段、`Read View`、`undo log`。

InnoDB 存储引擎为每行数据添加了三个隐藏字段:
- `DB_TRX_ID（6字节）`：表示最后一次插入或更新该行的事务 id。此外，delete 操作在内部被视为更新，只不过会在记录头 Record header 中的 deleted_flag 字段将其标记为已删除；
- `DB_ROLL_PTR（7字节）` 回滚指针，指向该行的 undo log 。如果该行未被更新，则为空；
- `DB_ROW_ID（6字节）`：如果没有设置主键且该表没有唯一非空索引时，InnoDB 会使用该 id 来生成聚簇索引；

`Read View`主要是用来做可见性判断，里面保存了 “当前对本事务不可见的其他活跃事务”。

`undo log`作用是，当读取记录时，若该记录被其他事务占用或当前版本对该事务不可见，则可以通过 `undo log` 读取之前的版本数据，以此实现**非锁定读**。

非锁定读是什么？

在 InnoDB 存储引擎中，多版本控制就是对非锁定读的实现。
如果读取的行正在执行 DELETE 或 UPDATE 操作，这时读取操作不会去等待行上锁的释放。相反地，InnoDB 存储引擎会去读取行的一个快照数据，对于这种读取历史数据的方式，我们叫它快照读，就是对非锁定读的实现。

具体一点，在 `Repeatable Read` 和 `Read Committed` 两个隔离级别下，如果是执行普通的 select 语句，不包括 `select ... lock in share mode` ,`select ... for update`则会使用一致性非锁定读。

### 操作事物
所有的存储引擎中只有 `InnoDB`、`NDB` 是事务性存储引擎，也就是说只有 `InnoDB`、`NDB` 支持事务。
不支持的存储引擎，比如在MyISAM上操作事务，事务不会生效，SQL语句直接自动执行提交，所以回滚对于不支持事务的存储引擎是无效的。

启动事务的方式：
- `begin`
    ```txt
    mysql> begin;
    Query OK, 0 rows affected (0.00 sec)
    mysql> 事务操作SQL......
    ```
- `start transaction [修饰符]`
    ```txt
    修饰符：
    1. read only //只读
    2. read write //读写 默认
    3. WITH CONSISTENT SNAPSHOT //一致性读
    
    -- 例如
    mysql> start transaction read only;
    Query OK, 0 rows affected (0.00 sec)
    mysql> 事务操作SQL......
    ```

提交事物完整示例：
```txt
mysql> begin;
Query OK, 0 rows affected (0.01 sec)

mysql> update account set balance=balance-20 where id = 1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> update account set balance=balance+20 where id = 2;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> commit;
Query OK, 0 rows affected (0.01 sec)
```

回滚事物完整示例：
```txt
mysql> begin;
Query OK, 0 rows affected (0.00 sec)

mysql> update account set balance=balance-25 where id = 1;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> update account set balance=balance+25 where id = 2;
Query OK, 1 row affected (0.00 sec)
Rows matched: 1  Changed: 1  Warnings: 0

mysql> rollback;
Query OK, 0 rows affected (0.00 sec)
```

默认是事务自动提交的，每执行一条SQL就自动提交。
此时需要操作事务，则需要显式开启（begin or start transaction）和提交（commit）或回滚（rollback）。
如设置成OFF，则需要执行提交（commit）或回滚（rollback）操作时才会真正执行事务。
```txt
--查看事务开启情况：
mysql> SHOW VARIABLES LIKE 'autocommit';
+---------------+-------+
| Variable_name | Value |
+---------------+-------+
| autocommit | ON |
+---------------+-------+
```


## MySQL索引
MySQL官方对索引的定义为：索引（Index）是帮助MySQL高效获取数据的数据结构。
可以得到索引的本质：索引是数据结构。

索引相当于一本书的目录或者字典。
比如，要查“mysql”这个单词，我们肯定需要定位到m字母，然后从下往下找到y字母，再找到剩下的sql；如果没有索引，那么你可能需要逐个逐个寻找。
可以简单理解为，索引维护的就是一组排好序的数据，通过这种有序的数据结构能快速的查找到想要的数据，索引这种数据结构就是以空间换取时间。

我们平常所说的索引，如果没有特别指明，都是指B树结构组织的索引。当然，除了B+树这种类型的索引之外，还有哈稀索引等。

### 索引数据结构
目前大部分数据库系统及文件系统都采用B-树或其变种B+树作为索引结构。

为什么使用B-树、B+树？

一般来说，索引本身也很大，不可能全部存储在内存中，因此索引往往以索引文件的形式存储的磁盘上。
这样的话，索引查找过程中就要产生磁盘I/O消耗，相对于内存存取，I/O存取的消耗要高几个数量级，所以评价一个数据结构作为索引的优劣最重要的指标，就是在查找过程中磁盘I/O操作次数的渐进复杂度。
换句话说，索引的结构组织要尽量减少查找过程中磁盘I/O的存取次数。

B树即B-tree 树，B 即 Balanced 平衡的意思。B树通过重新组织节点，降低树的高度，并且减少IO读写次数来提升效率。
文件系统及数据库系统的设计者，利用了**磁盘预读原理**，将一个节点的大小设为一个页，这样每个节点只需要一次IO就可以完全载入。

磁盘预读原理是什么？

主存即主存储器，是计算机中最重要的存储层次之一，它直接与CPU进行数据交换。主存的访问速度很快，但价格较高，且容量有限。主存用于存储当前正在被CPU处理的数据和程序代码。
磁盘是计算机中重要的辅助存储设备之一，磁盘的容量较大，价格较低，但访问速度较慢。磁盘通常用于长期存储大量的数据和程序代码。

在存储层次结构中，磁盘通常被用作主存的扩展。当主存空间不足时，操作系统会将一些不常用的数据和程序代码从主存中移到磁盘上，以释放主存空间。
当这些数据和程序代码再次被需要时，操作系统会将其从磁盘中读取回主存。这就是所谓的磁盘缓存。

在计算机中，磁盘的读写速度远低于主存和高速缓存，但它的容量较大，可以长期保存大量的数据和程序代码，因此为了提高效率，尽量减少磁盘I/O。
为了达到这个目的，磁盘往往不是严格按需读取，而是每次都会预读，即使只需要一个字节，磁盘也会从这个位置开始，顺序向后读取一定长度的数据放入内存，这个过程是磁盘预读。
磁盘预读的理论依据是**局部性原理**，即当一个数据被用到时，其附近的数据也通常会马上被使用。

磁盘预读的长度一般为页的整倍数。页是计算机管理存储器的逻辑块，硬件及操作系统往往将主存和磁盘存储区分割为连续的大小相等的块，每个存储块称为一页（在许多操作系统中，页得大小通常为4k），主存和磁盘以页为单位交换数据。
当程序要读取的数据不在主存中时，会触发一个缺页异常，此时系统会向磁盘发出读盘信号，磁盘会找到数据的起始位置并向后连续读取一页或几页载入内存中，然后异常返回，程序继续运行。

### 索引的实现
在MySQL中，索引属于存储引擎级别的概念，不同存储引擎对索引的实现方式是不同的，这里主要讨论MyISAM、InnoDB两个不同的存储引擎对索引实现方式。

#### MyISAM索引的实现 
在MyISAM引擎中，建立的索引文件和数据文件是分离的，B+Tree 叶节点存放的是数据记录的地址。

![MyISAM索引结构](/iblog/posts/annex/images/essays/MyISAM索引结构.png)

在索引检索的时候，首先按照 B+Tree 搜索算法搜索索引，如果指定的 Key 存在，则取出其叶子结点的值，然后以叶子结点的值为地址读取相应的数据记录。
这种表示索引结构与数据行存储顺序无关的索引，叫做非聚集索引。

MyISAM中的主索引和辅助索引在结构上是类似的，都是采用B-Tree结构。它们之间的主要区别在于，主索引要求索引列的值必须唯一，而辅助索引则可以包含重复值。
但是无论主索引还是辅助索引，它们的叶子节点存储的都是指向数据行实际存储位置的指针，而不是数据本身。
因此，当通过索引访问数据时，MyISAM 需要进行两次查找：首先在索引中找到对应记录的位置，然后根据该位置读取实际的数据行。

#### InnoDB索引的实现
在InnoDB引擎中，其数据文件本身就是索引文件。

![Innodb索引结构](/iblog/posts/annex/images/essays/Innodb索引结构.png)

表数据文件本身就是按B+Tree组织的一个索引结构，这棵树的叶节点data域保存了完整的数据记录。这个索引的key是数据表的主键，因此InnoDB表数据文件本身就是**主索引**。
索引的键值决定了表中数据的物理顺序，这种被称为聚簇索引或聚集索引。

因为InnoDB的数据文件本身要按主键聚集，所以InnoDB要求表必须有主键，MyISAM可以没有。
如果没有显式指定，则MySQL系统会自动选择一个可以唯一标识数据记录的列作为主键。
如果不存在这种列，则MySQL自动为InnoDB表生成一个隐含字段作为主键，这个字段长度为6个字节，类型为长整形。

与MyISAM索引的不同是，InnoDB的**辅助索引**data域，存储相应记录主键的值而不是地址。
换句话说，辅助索引的叶节点存储的是主键值，加上一个指向主键的指针，而不是实际的数据行。
这意味着，当通过辅助索引查询数据时，数据库首先通过辅助索引找到主键，然后用主键到聚簇索引中去查找对应的完整数据行，这个过程称为回表查询。

知道了InnoDB的索引实现后，就很容易明白为什么不建议使用过长的字段作为主键，因为所有辅助索引都引用主索引，过长的主索引会令辅助索引变得过大。
再例如，用非单调递增或递减的字段作为主键在InnoDB中也不是个好主意，因为InnoDB数据文件本身是一颗B+Tree，非单调的主键会造成在插入新记录时数据文件为了维持B+Tree的特性而频繁的分裂调整，十分低效，而使用自增字段作为主键则是一个很好的选择。

主索引、辅助索引是什么？
- 主索引通常是基于表的主键建立的索引，保证了索引列值的唯一性。在InnoDB存储引擎中，主索引实际上是一个聚簇索引，这意味着主键不仅提供唯一性约束，还决定了数据行的物理排列顺序。
  在MyISAM中，主索引通常是基于表的一个唯一键创建的，最常见的是基于主键。如果未明确定义主键，MyISAM 会尽可能选择一个唯一的非空索引作为主索引。
- 辅助索引是相对于主索引而言，指除主索引之外的其他索引，可以是基于非主键列创建的索引，用于加速对这些列的查询。
  在InnoDB存储引擎中辅助索引的叶子结点存储的是主键值。在MyISAM中，叶子节点存储的是指向数据行实际存储位置的指针。

### 索引的优缺点
索引的优点：
- 提高数据检索的效率，降低数据库的IO成本；
- 降低数据排序的成本，降低了CPU的消耗；

索引的缺点：
- 索引本身很大，可以放在内存、硬盘中，通常为硬盘；
- 索引虽然提高了查询的效率，但是会降低增删改的效率，当对表中的数据进行增删改的时候，如果数据有索引，那么索引也需要动态的修改，也就是会降低 SQL 执行效率；

### 索引分类
按照应用维度划分：
- 主键索引：属于唯一索引的一种，但是值不能为null；
- 唯一索引：索引列的值必须唯一，但允许有空值；
- 单值索引：即一个索引只包含单个列，一个表可以有多个单列索引；
- 复合索引：一个索引包含多个列；


按照底层存储方式角度划分：
- 聚簇索引（聚集索引）：索引结构和数据一起存放的索引，InnoDB 中的主键索引就属于聚簇索引。
- 非聚簇索引（非聚集索引）：索引结构和数据分开存放的索引，二级索引(辅助索引)就属于非聚簇索引。MySQL 的 MyISAM 引擎，不管主键还是非主键，使用的都是非聚簇索引。

### 操作索引
创建索引：
```
 CREATE [UNIQUE] INDEX indexName ON mytable(columnName(length));
 ALTER mytable ADD [UNIQUE] INDEX [indexName] ON (columnName(length));
```
删除索引：
```
 DROP INDEX [indexName] ON [tableName];
```
修改索引：
```
-- 该语句添加一个主键，这意味着索引值必须是唯一的，且不能为NULL
 ALTER TABLE [tableName] ADD PRIMARY KEY (column_list);

-- 这条语句创建索引的值必须是唯一的(除了NULL外，NULL可能会出现多次)
 ALTER TABLE [tableName] ADD UNIQUE [indexName] (column_list);

-- 添加普通索引，索引值可出现多次
 ALTER TABLE [tableName] ADD INDEX [indexName] (column_list);

-- 该语句指定了索引为FULLTEXT，用于全文索引
 ALTER TABLE [tableName] ADD FULLTEXT [indexName] (column_list);
```
查看索引：
```
 SHOW INDEX FROM [tableName];
```

### 最左前缀匹配原则
最左前缀匹配原则是指在使用复合索引，即包含多个列的索引时，MySQL优化器会尽可能地根据索引中的字段顺序，从左到右依次匹配查询条件中的字段。
如果查询条件与索引中的最左侧字段相匹配，那么 MySQL 就会使用索引来过滤数据，这样可以提高查询效率。

想要发挥最左前缀匹配的效果，你的查询条件应该至少从复合索引的第一列开始，并且尽可能地包含更多连续的索引列。
如果查询条件没有从第一列开始或者跳过了中间的列，那么索引的部分或全部效果就可能没法用了。

现在有一个students表，它有三个列(id, first_name, last_name)，并且针对这三个列创建了一个复合索引(id, first_name, last_name)。
```sql
-- 可以命中索引
select * from student where id = 1 and first_name = 'lisa' and last_name = 'liu'

-- 无法命中索引
select * from student where first_name = 'lisa'
```

联合索引的最左匹配原则，在遇到范围查询（如 >、<）的时候，就会停止匹配，也就是范围查询的字段可以用到联合索引，但是在范围查询字段后面的字段无法用到联合索引。
但是对于 >=、<=、BETWEEN、like 前缀匹配这四种范围查询，并不会停止匹配。
```sql
-- 可以命中 id、first_name列，没命中last_name 列
select * from student where id = '%123%' and first_name like '%lisa%' and last_name = 'liu'
```

### 索引覆盖
覆盖索引（Covering Index），一说为索引覆盖。如果一个索引包含或者说覆盖所有需要查询的字段的值，就称为索引覆盖。

查询的数据列从索引文件中就能够取得，不必读取原数据、回表查询。
MySQL可以利用索引返回select列表中的字段，而不用根据索引再次读取数据文件，换句话说查询到的列全部都在索引列中就是索引覆盖。

如果要使用覆盖索引，一定要注意select列表中只取出需要的列，不可select*，因为如果将所有字段一起做索引会导致索引文件过大，查询性能下降。 

覆盖索引举例，(id, first_name, last_name)为一个复合索引。
```sql
--  覆盖索引，全部命中
select id,first_name,last_name from student where id = '%123%' and first_name like '%lisa%' and last_name = 'liu'
```

### 索引建立原则
既然索引可以加快查询速度，那么是不是只要是查询语句需要，就建上索引？
答案肯定是不可以。索引虽然加快了查询速度，但索引也是有代价的：索引文件本身要消耗存储空间，同时索引会加重插入、删除和修改记录时的负担，另外MySQL在运行时也要消耗资源维护索引，因此索引并不是越多越好。

以下是建立索引的一些原则：
- 数据量很小则不适合建立：如果数据库的数据量不大，那么使用索引也不一定能够带来很大提升，所以没有必要建立索引；
- 不要建立太多的索引：因为维护索引是需要耗费空间和性能的，MySQl会为了每一个索引维护一个B树，如果索引过多，这无疑是增加了MySQL的负担；
- 频繁增删改的字段不要建立索引：如果某个字段频繁修改，那就意味着也需要修改索引，这必然影响MySQL的性能；
- 为频繁查询的字段建立索引：建立索引要为经常作为查询条件的字段建立索引，这样能提高SQL的查询效率，与之相反的不要为很少使用的字段建立索引；
- 避免为”大字段”建立索引：就是尽量使用字段长度小的字段作为索引；例如，要为`varchar(5)`和`varchar(200)`的字段建立索引，则优先考虑为`varchar(5)`的建立；如果非要为`varchar(200)`的字段建立索引那么可以这样：
    ```
     -- 为varchar(200)的字段建立索引，将其长度设置为 20  
     create index  tbl_001 on dual(address(20));
    ```
- 选择数据区分大的列建立索引：如果某个字段包含许多重复的数据则不适合建立索引。假设现在有一个”性别”字段，里面存放的数据的值要么是男，要么是女，这样的字段很不适合作为索引。
因为如果值出现的几率几乎相等，那么无论搜索哪个值都可能得到一半的数据。在这些情况下，还不如不要索引，因为MySQL他还有一个查询优化器，查询优化器发现某个值出现在表的数据行中的百分比很高的时候，它一般会忽略索引，进行全表扫描。
惯用的百分比界线是”30%”。匹配的数据量超过一定限制的时候查询器会放弃使用索引，这也是索引失效的场景之一。

### 避免索引失效原则
建立索引之后还要保证索引生效，才能发挥索引的作用，以下是避免索引失效的原则：
- 在使用复合索引时，不要跨列使用或无序使用，即最佳左前缀法则，否则索引失效；
跨列使用指，where后边的字段和order by后边的字段拼接起来，看是否满足索引的顺序，如不满足则为跨列，会出现Using filsort。
- 不要在索引上进行任何操作，例如：计算、函数运算、类型转换等，否则索引失效；
    ```
     -- age列为索引，但此时SQL语句age列存在计算，age索引列失效；
     select * from tbl_001 where age*3 = '10';
    
     -- name为索引列，此时在该索引列上进行函数计算，name索引列失效；
     select * from tbl_001 tbl_001 left(name,4)='July'; 
     
     -- typeid为索引列，typeid为int类型，此时发生隐式类型转换，typeid索引列失效；
     select * from tbl_001 c typeid = '1';
    ```
- 复合索引不能使用不等于（!=、<>）或is null、is not null，否则自身及右侧索引全部失效； 
大部分情况下如果复合索引使用上面的运算符索引会失效，但是MySQL在服务层存在SQL优化阶段，所以复合索引即使使用了不等于、is null、is not null等操作，还是可能会存在索引生效的情况。
- 尽量使用覆盖索引，使用覆盖索引会提高系统性能；
    ```
     -- name、tid、cid 为复合索引
      select name,tid,cid from tbl_001 where name = 'zs';
    ```
- like尽量以常量开头，不要以%开头，否则索引失效；
    ```
     -- name 为索引列，此处索引失效
     select * from tbl_002 where name like '%x%';
    
     -- 如果必须要使用%开头，可以使用覆盖索引挽救一下
     select name from tbl_002 where name like '%x%';
    ```
- 不要使用or，否则索引失效；
    ```
     -- authorid、typeid为复合索引，此处or的左右两边索引全部失效
     select * from book_2021 where authorid = 1 or typeid = 1;
    ```
- 避免使用`*`，因为使用`*`之后MySQL还需要计算把`*`替换成对应的列；
    ```
    -- 不要使用*，把*替换成具体需要的列
     select * from book_2021;
    ```

## MySQL执行计划
执行计划 是指一条 SQL 语句在经过 MySQL 查询优化器 的优化后，具体的执行方式。
使用explain关键字可以模拟优化器执行SQL查询语句，从而知道MySQL是如何处理你的SQL语句的，分析你的查询语句或是表结构的性能瓶颈。
explain不止适用于select也适用于delete、insert、replace和update语句。

当explain可解释语句一起使用时，MySQL会显示来自优化器的关于语句执行计划的信息，也就是说，MySQL解释了它将如何处理语句，包括有关表如何连接以及按顺序连接的信息。

在MySQL中执行任意一条SQL前加上explain关键字，即可看到：
```
 +----+-------------+----------+------+---------------+------+---------+------+------+-------+
 | id | select_type | table    | type | possible_keys | key  | key_len | ref  | rows | Extra |
 +----+-------------+----------+------+---------------+------+---------+------+------+-------+
```

### id、table
table是显示这一行的数据是关于哪张表的。

id是select查询的序列号，包含一组数字，表示查询中执行select子句或操作表的顺序。

- id值相同，执行顺序由上至下；
- id值不同，id值越大优先级越高，越先被执行；

> 表的执行顺序与表中数据息息相关，举个例子：表A：3条数据 表B：4条数据 表C：6条数据
> 
> 假设在执行某条SQL的情况下表A、B、C的id值相同，假设执行顺序：表A、B、C。在给表B添加4条数据后，再次执行前面的这条SQL发现执行顺序变为：表A、C、B。
> <br>
> 这是因为中间结果会影响表的执行顺序：
> 3 * 4 * 2 = 12 * 2 = 24
> 3 * 2 * 4 = 6 * 4 = 24
> 虽然最后结果一样，但是中间过程不一样。中间过程越小占用的空间越小，所以在ID值相同的情况下数据小的表优先查询。

### select_type
select_type是查询的类型，主要是用于区别普通查询、联合查询、子查询等的复杂查询。

查询类型：
- PRIMARY：包含自查询的主查询，最外层部分；
- SUBQUERY：查询语句中包含了子查询，非最外层；
- SIMPLE：简单查询,即SQL中不包含子查询或者UNION查询；
- DERIVED：在查询过程中创建了临时表，例如SQL：
    ```
     explain select name from (select * from table1) t1;
    ```
- UNION：若第二个SELECT出现在UNION之后，则被标记为UNION；若UNION包含在FROM子句的子查询中外层SELECT将被标记为：DERIVED；
    ```
     explain select name from (select * from table1 union select * from table2) t1;
    ```
- UNION RESULT：从UNION表中的结果；

### type
type是索引类型，是较为重要的一个指标，结果值从最好到最坏依次是：
```
 system > const > eq_ref > ref > fulltext > ref_or_null > index_merge > unique_subquery > index_subquery > range > index >ALL
```
实际工作中可能用不到这么多，一般只要记住以下就行了：
```
 system > const > eq_ref > ref > range > index > ALL
```
其中system、const只是理想情况，实际能达到ref、range。

常见索引类型：
- system：表只有一行记录的系统表，或衍生表只有一行数据的主查询；
    ```
     -- 衍生表：(select * from tbl_001) 只有一条记录；id为主键索引
     explain select * from (select * from tbl_001) where id = 1;
    ```
- const：仅仅能查询到一条记录的SQL，并且用于主键索引或者唯一键索引；
    ```
     -- tbl_001表只有一条记录；id为主键索引或唯一键索引
     explain select * from tbl_001 where id = 1;
    ```
- eq_ref：唯一性索引；对于每个索引键的查询，返回匹配唯一一行的数据,有且只有一个，不能多也不能为0；常见于主键或唯一索引扫描；
    ```
     -- tbl_001.tid为索引列；且tbl_001与tbl_002表中数据记录一一对应
     select * from tbl_001,tbl_002 where tbl_001.tid = tbl_002.id
    ```
- ref：非唯一性索引；对于每个索引键的查询，返回多个匹配的所有行，包括0个；
    ```
     -- name 为索引列；tbl_001 表中 name 值为 zs 的有多个
     explain select * from tbl_001 where name = 'zs';
    ```
- range：检索指定范围的行，where后面是一个范围查询常见：between and、in、>、<=；
    ```
     -- tid 为索引列；
     explain select * from tbl_001 where tid <=3;
    ```
- index：查询全部索引中的数据；
    ```
     -- name为索引列；
     explain select name from tbl_001;
    ```
- all：查询全部表中的数据；
    ```
     -- name不是索引列；
     explain select name from tbl_001;
    ```

### possible_keys、key
possible_keys是可能用到的索引，是一种预测,不准确；key是实际用到的索引，如果为null则没有用到索引。
```
 -- name为索引列
 explain select name from tbl_001;
 +----+-------------+---------+-------+---------------+----------+---------+------+------+-------------+
 | id | select_type | table   | type  | possible_keys | key      | key_len | ref  | rows | Extra       |
 +----+-------------+---------+-------+---------------+----------+---------+------+------+-------------+
 |  1 | SIMPLE      | tbl_001 | index | NULL          | idx_name | 83      | NULL |    4 | Using index |
 +----+-------------+---------+-------+---------------+----------+---------+------+------+-------------+
```

### key_len
key_len索引使用的长度，可通过索引列长度，例如：`name vachar(20)`，来判断复合索引到底有没有使用。
```
 -- name为索引列；可以为null；varchar类型；utf8字符集；
 explain select name from tbl_001 name = 'zs';
 +----+-------------+---------+-------+---------------+----------+---------+------+------+-------------+
 | id | select_type | table   | type  | possible_keys | key      | key_len | ref  | rows | Extra       |
 +----+-------------+---------+-------+---------------+----------+---------+------+------+-------------+
 |  1 | SIMPLE      | tbl_001 | index | NULL          | idx_name | 63      | NULL |    4 | Using index |
 +----+-------------+---------+-------+---------------+----------+---------+------+------+-------------+
```
其中，如果索引字段可以为null，MySQL会用一个字节进行标识；varchar为可变长度，MySQL用两个字节来标识。
> utf8：一个字符三个字节；
  gbk：一个字符两个字节；
  latin：一个字符一个字节；

举例，字段`name vachar(20)`，不能为null，utf8编码，执行执行计划name列使用到了索引那么key_len等于`20*3+1+2=63`。

### ref
ref指明当前表所引用的字段。
```
 -- 其中b.d可以为常量，常量用 const 标识
 select ... where a.c = b.d;  
```
```
 -- tid 为索引列
 explain select * from tbl_001 t1,tbl_002 t2 where t1.tid = t2.id and t1.name = 'zs';
 +----+-------------+-------+--------+------------------+----------+---------+-----------------+------+-------------+
 | id | select_type | table | type   | possible_keys    | key      | key_len | ref             | rows | Extra       |
 +----+-------------+-------+--------+------------------+----------+---------+-----------------+------+-------------+
 |  1 | SIMPLE      | t1    | ref    | idx_name,idx_tid | idx_name | 83      | const           |    1 | Using where |
 |  1 | SIMPLE      | t2    | eq_ref | PRIMARY          | PRIMARY  | 4       | sql_demo.t1.tid |    1 | NULL        |
 +----+-------------+-------+--------+------------------+----------+---------+-----------------+------+-------------+
```

### rows
rows表示查询行数，实际通过索引查询到的个数。
```
 mysql> select * from tbl_001 t1,tbl_002 t2 where t1.tid = t2.id and t1.name = 'ls';
 +----+------+------+----+------+-------+-------+
 | id | name | tid  | id | name | name1 | name2 |
 +----+------+------+----+------+-------+-------+
 |  2 | ls   |    2 |  2 | ls   | ls1   | ls2   |
 |  4 | ls   |    1 |  1 | zs   | zs1   | zs2   |
 +----+------+------+----+------+-------+-------+

 mysql> explain select * from tbl_001 t1,tbl_002 t2 where t1.tid = t2.id and t1.name = 'ls';
 +----+-------------+-------+-------+------------------+------------+---------+----------------+------+-------------+
 | id | select_type | table | type  | possible_keys    | key        | key_len | ref            | rows | Extra       |
 +----+-------------+-------+-------+------------------+------------+---------+----------------+------+-------------+
 |  1 | SIMPLE      | t2    | index | PRIMARY          | index_name | 249     | NULL           |    2 | Using index |
 |  1 | SIMPLE      | t1    | ref   | idx_name,idx_tid | idx_tid    | 5       | sql_demo.t2.id |    1 | Using where |
 +----+-------------+-------+-------+------------------+------------+---------+----------------+------+-------------+
```

### Extra
Extra包含不适合在其他列中显示但十分重要的额外信息。

常见值：
- Using filesort：文件内排序；出现这个值代表额外的一次排序（查询），性能消耗比较大，需要进行SQL优化。常见order by语句中；
    ```
     -- name 为单值索引
     explain select * from tbl_001 where name = 'zs' order by tid;
     +----+-------------+---------+------+---------------+----------+---------+-------+------+----------------+
     | id | select_type | table   | type | possible_keys | key      | key_len | ref   | rows | Extra          |
     +----+-------------+---------+------+---------------+----------+---------+-------+------+----------------+
     |  1 | SIMPLE      | tbl_001 | ref  | idx_name      | idx_name | 83      | const |    1 | Using filesort |
     +----+-------------+---------+------+---------------+----------+---------+-------+------+----------------+
    ```
    对于单值索引来说，如果排序和查找的是同一个字段，则不会出现 Using filesort 反之则出现;一般通过where哪些字段就 orderby 哪些字段来避免。
    ```
     -- name，tid 为复合索引
     explain select * from tbl_001 where name = 'zs' order by tid;
     +----+-------------+---------+------+---------------+-----------+---------+-------+------+-------------+
     | id | select_type | table   | type | possible_keys | key       | key_len | ref   | rows | Extra       |
     +----+-------------+---------+------+---------------+-----------+---------+-------+------+-------------+
     |  1 | SIMPLE      | tbl_001 | ref  | idx_trans     | idx_trans | 83      | const |    1 | Using index |
     +----+-------------+---------+------+---------------+-----------+---------+-------+------+-------------+
    ```
    对于复合索引来说要按照建立复合索引的顺序来使用，不要跨列或者无序使用。
    > 跨列使用指，where后边的字段和order by后边的字段拼接起来，看是否满足索引的顺序，如不满足则为跨列，会出现Using filsort。
- Using temporary：使了用临时表保存中间结果，MysQL在对查询结果排序时使用临时表。性能消耗也是很大的，一般出现这个词需要进行SQL优化。常见于分组查询group by语句；
    ```
     -- name、tid、cid 为复合索引
     explain select name from tbl_001 where name = 'zs' group by cid;
     +----+-------------+---------+------+---------------+---------+---------+-------+------+------------------------------+
     | id | select_type | table   | type | possible_keys | key     | key_len | ref   | rows | Extra                        |
     +----+-------------+---------+------+---------------+---------+---------+-------+------+------------------------------+
     |  1 | SIMPLE      | tbl_001 | ref  | idx_ntc       | idx_ntc | 83      | const |    2 | Using index; Using temporary |
     +----+-------------+---------+------+---------------+---------+---------+-------+------+------------------------------+
    ```
  Using temporary出现的原因，已经有表了但是不使用，必须再来一张表。我们可以通过查询哪些列，就通过哪些列来分组来避免。
- Using index：出现这个值代表性能还是不错的；表示使用到了覆盖索引，不读取源文件，只从索引文件中获取数据，不需要回表查询。
    ```
     -- name、tid、cid 为复合索引
     explain select name,tid,cid from tbl_001 where name = 'zs';
     +----+-------------+---------+------+---------------+---------+---------+-------+------+-------------+
     | id | select_type | table   | type | possible_keys | key     | key_len | ref   | rows | Extra       |
     +----+-------------+---------+------+---------------+---------+---------+-------+------+-------------+
     |  1 | SIMPLE      | tbl_001 | ref  | idx_ntc       | idx_ntc | 83      | const |    2 | Using index |
     +----+-------------+---------+------+---------------+---------+---------+-------+------+-------------+
    ```
    如果用到了索引覆盖时，会对possible_key和key造成影响：
    - 如果没有使用到where，则索引只出现在key中；
    - 如果有where，则索引出现在key和possible_key中；
- Using where：出现这个值代表需要回表查询；
    ```
     -- name 为单值索引，此时索引中不包含其他字段，想要查询其他字段就必须回表查询
     explain select name,tid,cid from tbl_001 where name = 'zs';
     +----+-------------+---------+------+---------------+---------+---------+-------+------+-------------+
     | id | select_type | table   | type | possible_keys | key     | key_len | ref   | rows | Extra       |
     +----+-------------+---------+------+---------------+---------+---------+-------+------+-------------+
     |  1 | SIMPLE      | tbl_001 | ref  | idx_name      | idx_name | 83     | const |   2  | Using where |
     +----+-------------+---------+------+---------------+---------+---------+-------+------+-------------+
    ```
- Impossible WHERE：where语句永远为false，永远不成立；
    ```
     explain select * from tbl_001 where name = 'zs' and name = 'ls';
     +----+-------------+-------+------+---------------+------+---------+------+------+------------------+
     | id | select_type | table | type | possible_keys | key  | key_len | ref  | rows | Extra            |
     +----+-------------+-------+------+---------------+------+---------+------+------+------------------+
     |  1 | SIMPLE      | NULL  | NULL | NULL          | NULL | NULL    | NULL | NULL | Impossible WHERE |
     +----+-------------+-------+------+---------------+------+---------+------+------+------------------+
    ```

## MySQL优化
为什么要进行优化？
- SQL语句欠佳、执行过程耗时较长、索引失效；
- 单库数据量越来越大，存储出现问题；
- 在高并发场景下，大量请求阻塞；

总之一句话，数据库出现性能瓶颈。

### SQL执行过程
想要进行SQL优化首先要弄懂SQL编写过程和SQL执行过程是存在区别的：
- SQL编写过程：
    ```
     select distinct .. from .. join .. on .. where .. group by .. having .. order by .. limit ..
    ```
- SQL执行过程：
    ```
     from .. on .. join ..  where .. group by .. having .. select distinct .. order by .. limit ..
    ```

之所以SQL的编写过程会和执行过程有区别，是因为MySQL中有专门负责优化Select语句的优化器模块。
>MySQL Query Optimizer：MySQL查询优化器。主要功能:通过计算分析系统中收集到的统计信息，为客户端请求的Select提供MySQL认为最优的执行计划。

当客户端向MySQL请求一条Select，命令解析器模块完成请求分类，区别出是Select并转发给MySQL Query Optimizer时，MySQL Query Optimizer首先会对整条Select进行优化，处理掉一些常量表达式的预算直接换算成常量值。
并对Select中的查询条件进行简化和转换，如去掉一些无用或显而易见的条件、结构调整等。然后分析Select中的Hint信息，看显示Hint信息是否可以完全确定该Select的执行计划。如果没有Hint或Hint信息还不足以完全确定执行计划，则会读取所涉及对象的统计信息，根据Query进行写相应的计算分析，然后再得出最后的执行计划。

> Hint: 简单来说就是在某些特定的场景下人工协助MySQL优化器的工作，使其生成最优的执行计划。
一般来说，优化器的执行计划都是最优化的，不过在某些特定场景下，执行计划可能不是最优化。

### 优化思路
数据库性能优化方案很多，主要分为两大类：软件层面、硬件层面。

软件层面包括：SQL 调优、表结构优化、读写分离、数据库集群、分库分表等；硬件层面主要是增加机器性能。下面是集中常见的优化思路：
1. SQL调优主要目的是尽可能的让那些慢 SQL 变快，手段其实也很简单就是让 SQL 执行尽量命中索引：
    - 避免在 where 子句中对字段进行 null 值判断，创建表默认值是 NULL。尽量使用 NOT NULL，或使用特殊值，如 0、-1
    - 避免在 where 子句中使用 != 或 <> 操作符， MySQL 只有对以下操作符才使用索引：<、<=、=、>、>=、BETWEEN、IN、非 % 开头的 LIKE
    - 避免在 where 子句中使用 or 来连接条件，可以使用 UNION 进行连接
    - 能用 union all 就不用 union，union 过滤重复数据要耗费更多的 CPU 资源
    - 避免全部 like 查询，如 '%ConstXiong%'
    - 避免在索引列上使用计算、函数
    - in 和 not in 慎用，能用 between 不要用 in
    - select 子句中避免使用 *
    - 根据 where 和 order by 使用比较频繁的字段创建索引，提高查询效率
    - 索引不宜过多，单表最好不要超过 6 个。索引过多会导致占用存储空间变大；insert、update 变慢
    - 删除未使用的索引

2. 如果是单表数据量太大，解决办法：
    - 分页查询(在索引上完成排序分页操作、借助主键进行关联)
    - 单表数据过大，进行分库分表
    - 考虑使用非关系型数据库提高查询效率
    - 全文索引场景较多，考虑使用 ElasticSearch、solr

3. 其他优化：
    - 数据库配置参数调整
    - 数据库表结构优化
    - 硬件优化，增加服务器数量，扩大服务器内存，CPU核数

### 排查慢SQL
想要优化SQL，首先要找到慢SQL，慢SQL日志超过响应时间的阈值默认10秒，便会记录该SQL。
慢SQL日志默认是关闭的，建议在开发调优时打开，最终部署上线时关闭。

#### 慢SQL日志设置
通过SQL来查看记录慢SQL日志是否开启：
```
 -- 查看变量 slow_query_log，记录慢查询日志默认关闭
 show variables like '%slow_query_log%';
 +---------------------+----------------------------------------------+
 | Variable_name       | Value                                        |
 +---------------------+----------------------------------------------+
 | slow_query_log      | OFF                                          |
 | slow_query_log_file | /usr/local/mysql/data/MacBook-Pro-2-slow.log |
 +---------------------+----------------------------------------------+
```

可以通过SQL来进行开启记录慢SQL日志：
```
 -- 在内存中开启慢SQL记录日志； 此种方式在 mysql 服务重启后失效
 set global slow_query_log=1;
 
 -- 查看是否开启慢SQL日志记录
 show variables like '%slow_query_log%';
 +---------------------+----------------------------------------------+
 | Variable_name       | Value                                        |
 +---------------------+----------------------------------------------+
 | slow_query_log      | ON                                           |
 | slow_query_log_file | /usr/local/mysql/data/MacBook-Pro-2-slow.log |
 +---------------------+----------------------------------------------+
```
```
 -- 在MySQL my.cnf 配置文件中追加配置;重启MySQL服务后也生效，即永久开启
 slow_query_log=1
 slow_query_log_file=/usr/local/mysql/data/MacBook-Pro-2-slow.log
```

查看慢SQL记录日志阈值：
```
 -- 查看慢SQL记录日志阈值，默认10秒
 show variables like '%long_query_time%';
 +-----------------+-----------+
 | Variable_name   | Value     |
 +-----------------+-----------+
 | long_query_time | 10.000000 |
 +-----------------+-----------+
```

修改慢SQL记录日志阈值：
```
 -- 在内存中修改设置慢查询SQL记录日志阈值为5秒；注意设置后不会立即生效，需要重新登陆mysql客户端才会生效
 set global long_query_time = 5;

 -- 设置之后重新登陆mysql使用命令查看慢SQL查询日志阈值 
 show variables like '%long_query_time%';
 +-----------------+-----------+
 | Variable_name   | Value     |
 +-----------------+-----------+
 | long_query_time | 5.000000 |
 +-----------------+-----------+
```
```
 -- 在MySQL配置文件my.cnf中修改慢查询SQL记录日志阈值,设置为3秒
 long_query_time=3
```

#### 查看慢SQL日志
- 直接查看慢SQL日志；
    ```
      -- 模拟慢查询SQL 
      select sleep(5);
      
      -- 查看是否开启慢SQL日志记录
      show variables like '%slow_query_log%';
      +---------------------+----------------------------------------------+
      | Variable_name       | Value                                        |
      +---------------------+----------------------------------------------+
      | slow_query_log      | ON                                           |
      | slow_query_log_file | /usr/local/mysql/data/MacBook-Pro-2-slow.log |
      +---------------------+----------------------------------------------+
    ```
  查看慢SQL日志记录`cat /usr/local/mysql/data/MacBook-Pro-2-slow.log`执行命令：
    ```
     MacBook-Pro-2:~ root# cat /usr/local/mysql/data/MacBook-Pro-2-slow.log
     /usr/local/mysql/bin/mysqld, Version: 8.0.22 (MySQL Community Server - GPL). started with:
     Tcp port: 3306  Unix socket: /tmp/mysql.sock
     Time                 Id Command    Argument
     # Time: 2021-09-17T06:46:20.655775Z
     # User@Host: root[root] @ localhost []  Id:    15
     # Query_time: 4.003891  Lock_time: 0.000000 Rows_sent: 1  Rows_examined: 1
     use sql_demo;
     SET timestamp=1631861176;
     select sleep(4);
    ```
- 通过`mysqldumpslow`工具来查看,可以通过一些过滤条件快速找到需要定位的慢SQL；
    ```
     语法：mysqldumpslow 各种参数 慢查询日志文件路径
     -s：排序方式
     -r：逆序反转
     -l：锁定时间，不要从总时间中减去锁定时间
     -g：在文件中查找考虑包含此字符串的
     更多指令解析查看 mysqldumpslow --help
  
     -- 获取返回记录最多的3条SQL
     mysqldumpslow -s r -t 3 /usr/local/mysql/data/MacBook-Pro-2-slow.log
    
     -- 获取访问次数最多的3条SQL
     mysqldumpslow -s r -t 3 /usr/local/mysql/data/MacBook-Pro-2-slow.log
    
     -- 按照时间排序，前10条包含 left join 的查询SQL 
     mysqldumpslow -s t -t 10 -g "left join" /usr/local/mysql/data/MacBook-Pro-2-slow.log
    ```
#### 模拟数据并分析SQL
- 模拟数据；
    ```
     -- 创建表
     create database testdata;
     use testdata;
     
     create table dept 
     (
     dno int(5) primary key default 0,
     dname varchar(20) not null default '',
     loc varchar(30) default ''
     ) engine=innodb default charset=utf8;
     
     create table emp
     (
     eid int(5) primary key,
     ename varchar(20) not null default '',
     job varchar(20) not null default '',
     deptno int(5) not null default 0
     )engine=innodb default charset=utf8;
    ```

    ```
     -- 创建存储过程：获取随机字符串
     set global log_bin_trust_function_creators=1;
     use testdata;
     delimiter $
     create function randstring(n int) returns varchar(255)
     begin 
     
         declare all_str varchar(100) default 'abcdefghijklmnopqrestuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
         declare return_str varchar(255) default '';
         declare i int default 0;
         while i<n
         do
             set return_str=concat(return_str, substring(all_str, FLOOR(1+rand()*52), 1));
             set i=i+1;
         end while;
         return return_str;
     end $
    ```

    ```
     -- 创建存储函数：插入随机整数
     use testdata;
     create function ran_num() returns int(5)
     begin 
     
     declare i int default 0;
     set i=floor(rand()*100);
     return i;
     
     end$
    ```

    ```
     -- 创建存储过程：向emp表插入数据
     create procedure insert_emp(in eid_start int(10), in data_times int(10))
     begin 
     declare i int default 0;
     set autocommit =0;
     
     repeat 
     insert into emp values(eid_start+i, randstring(5), 'other', ran_num());
     set i=i+1;
     until i=data_times
     end repeat;
     
     commit;
     
     end $
    ```

    ```
     -- 创建存储过程：向dept表插入数据
     create procedure insert_dept(in dno_start int(10), in data_times int(10))
     begin 
     declare i int default 0;
     set autocommit =0;
     
     repeat 
     insert into dept values(dno_start+i, randstring(6), randstring(8));
     set i=i+1;
     until i=data_times
     end repeat;
     
     commit;
     
     end $
    ```

    ```
     -- 向emp、dept表中插入数据
     delimiter ;
     call insert_emp(1000, 800000);
     call insert_dept(10, 30);
    ```

    ```
     -- 验证插入数据量
     select count(1) from emp;
    ```
- 使用`show profile`进行sql分析；
    ```
     -- 查看 profiling 是否开启，默认是关闭的
     show variables like 'profiling';
     +---------------+-------+
     | Variable_name | Value |
     +---------------+-------+
     | profiling     | OFF   |
     +---------------+-------+
    
     -- 如果没开启将其开启
     set profiling=on;
- 执行测试SQL，任意执行均可供之后SQL分析；
    ```
    select * from emp;
    
    select * from emp group by eid order by eid;
    
    select * from emp group by eid limit 150000;
    ```
    ```
    -- 执行命令，查看结果
     show profiles;
     +----------+------------+--------------------------------------------------+
     | Query_ID | Duration   | Query                                            |
     +----------+------------+--------------------------------------------------+
     |        2 | 0.00300900 | show tables                                      |
     |        3 | 0.01485700 | desc emp                                         |
     |        4 | 0.00191200 | select * from emp group by eid%10 limit 150000   |
     |        5 | 0.25516300 | select * from emp                                |
     |        6 | 0.00026400 | select * from emp group by eid%10 limit 150000   |
     |        7 | 0.00019600 | select eid from emp group by eid%10 limit 150000 |
     |        8 | 0.03907500 | select eid from emp group by eid limit 150000    |
     |        9 | 0.06499100 | select * from emp group by eid limit 150000      |
     |       10 | 0.00031500 | select * from emp group by eid%20 order by 5     |
     |       11 | 0.00009100 | select * from emp group by eid%20 order by       |
     |       12 | 0.00012400 | select * from emp group by eid order by          |
     |       13 | 0.25195300 | select * from emp group by eid order by eid      |
     |       14 | 0.00196200 | show variables like 'profiling'                  |
     |       15 | 0.26208900 | select * from emp group by eid order by eid      |
     +----------+------------+--------------------------------------------------+
    ```
- 使用命令`show profile cpu,block io for query 上一步前面执行 show profiles 的 Query_ID ;`诊断SQL；
  > 参数备注，不区分大小写:
  all：显示所有的开销信息;
  block io：显示块lO相关开销;
  context switches：上下文切换相关开销;
  cpu：显示CPU相关开销信息;
  ipc：显示发送和接收相关开销信息;
  memory：显示内存相关开销信息;
  page faults：显示页面错误相关开销信息;
  source：显示和Source_function，Source_file，Source_line相关的开销信息;
  swaps：显示交换次数相关开销的信息;
    ```
     show profile cpu,block io for query 3;
     +----------------------------+----------+----------+------------+--------------+---------------+
     | Status                     | Duration | CPU_user | CPU_system | Block_ops_in | Block_ops_out |
     +----------------------------+----------+----------+------------+--------------+---------------+
     | starting                   | 0.004292 | 0.000268 |   0.000941 |            0 |             0 |
     | checking permissions       | 0.000026 | 0.000012 |   0.000013 |            0 |             0 |
     | checking permissions       | 0.000007 | 0.000005 |   0.000003 |            0 |             0 |
     | Opening tables             | 0.003883 | 0.000865 |   0.000880 |            0 |             0 |
     | init                       | 0.000022 | 0.000013 |   0.000008 |            0 |             0 |
     | System lock                | 0.000013 | 0.000012 |   0.000002 |            0 |             0 |
     | optimizing                 | 0.000994 | 0.000078 |   0.000155 |            0 |             0 |
     | statistics                 | 0.000233 | 0.000222 |   0.000011 |            0 |             0 |
     | preparing                  | 0.000046 | 0.000043 |   0.000003 |            0 |             0 |
     | Creating tmp table         | 0.000075 | 0.000073 |   0.000002 |            0 |             0 |
     | executing                  | 0.001532 | 0.000141 |   0.000266 |            0 |             0 |
     | checking permissions       | 0.000050 | 0.000044 |   0.000005 |            0 |             0 |
     | checking permissions       | 0.000014 | 0.000012 |   0.000002 |            0 |             0 |
     | checking permissions       | 0.001539 | 0.000102 |   0.000356 |            0 |             0 |
     | checking permissions       | 0.000044 | 0.000037 |   0.000007 |            0 |             0 |
     | checking permissions       | 0.000019 | 0.000016 |   0.000002 |            0 |             0 |
     | checking permissions       | 0.001250 | 0.000089 |   0.000318 |            0 |             0 |
     | end                        | 0.000015 | 0.000007 |   0.000008 |            0 |             0 |
     | query end                  | 0.000006 | 0.000004 |   0.000001 |            0 |             0 |
     | waiting for handler commit | 0.000041 | 0.000040 |   0.000002 |            0 |             0 |
     | removing tmp table         | 0.000012 | 0.000010 |   0.000001 |            0 |             0 |
     | waiting for handler commit | 0.000010 | 0.000009 |   0.000002 |            0 |             0 |
     | closing tables             | 0.000019 | 0.000018 |   0.000001 |            0 |             0 |
     | freeing items              | 0.000648 | 0.000081 |   0.000152 |            0 |             0 |
     | cleaning up                | 0.000067 | 0.000047 |   0.000021 |            0 |             0 |
     +----------------------------+----------+----------+------------+--------------+---------------+
    ```
#### 全局查询日志
**不要在生产环境开启这个功能。**

在配置MySQL文件`my.cnf`设置全局查询日志：
```
-- 开启全局查询日志
general_log=1

-- 记录日志文件的路径
general_log_file=/path/logfile

-- 设置输出格式为 FILE
log_output=FILE

-- 通过cat命令直接查看；如果为空则需要造数
cat /var/lib/mysql/bigdata01.log;
```

在mysql客户端设置全局查询日志：
```
-- 查看是否开启全局查询日志
show variables like '%general_log%';

-- 开启全局查询日志
set global general_log=1;

-- 设置输出格式为 TABLE
set global log_output='TABLE';

-- 可在mysql库里的geneial_log表查看；如果为空则需要造数
select * from mysql.general_log;
```

### SQL优化方法
对于后端程序员来说，想让SQL执行的更快，最主要的就是软件层面优化索引和分库分表。

#### exist和in选择
两者可以互相替代，如果主查询的数据集大，使用in的效率高一点；如果子查询的数据集大，使用exist效率高一点；
```
 -- 假设此处主查询数据集较大，使用in
 select * from tbl_001 where tid in (select id from tbl_001);

  -- 假设此处子查询数据集较大，使用exist
  select tid from tbl_001 where exists (select * from tbl_001);
```
> exists语法：将主查询的结果，放到子查询结果中进行判断，看子查询中是否有数据，如果有数据则保留数据并返回；没有则返回空。

#### order by优化
order by 是比较常用的一个关键字，基本上查询出来的数据都要进行排序，否则就太乱了。使用order by的时候常常伴随着Using filesort的发生，Using filesort在底层有两种算法，根据IO的次数分为：
- 双路排序：MySQL4.1之前默认使用双路排序；具体执行流程，双路排序需要扫描两次磁盘上的字段，首先扫描排序的字段对字段进行排序，然后扫描其他字段；
- 单路排序：为了减少IO访问次数在MySQL4.1之后默认使用单路排序；读取一次获取全部的字段，在buffer中进行排序。但是此种方法存在隐患不一定是只读一次数据，如果数据量过大buffer放不下则再需要读取文件，可以通过调节buffer来进行缓解；
    ```
     -- 设置读取文件缓冲区（buffer）的大小,单位字节
     set max_length_for_sort_data = 1024;
    ```
如果需要排序的列的总大小超过了设置的`max_length_for_sort_data`那么MySQL底层会自动从单路排序切换到双路排序。

保证全部索引排序字段的一致性，都是升序或都是降序，不要部分升序部分降序。

### SQL优化案例

#### 单表优化
```
 -- 准备测试表、测试数据
 create table book_2021(
   bid int(4) primary key,
   name varchar(20) not null,
   authorid int(4) not null,
   publicid int(4) not null,
   typeid int(4) not null  
 );
 insert into book_2021 values(1,'java',1,1,2);
 insert into book_2021 values(2,'php',4,1,2);
 insert into book_2021 values(3,'c',1,2,2);
 insert into book_2021 values(4,'c#',3,1,2);
 insert into book_2021 values(5,'c++',3,1,2);
```

需要优化的SQL：
```
 -- SQL原型，优化该SQL 
 select bid from book_2021 where typeid in(2,3) and authorid=1 order by typeid desc;
```
执行计划分析该SQL,发现该SQL存在`Using filesort`,type为ALL，需要进行SQL优化。
```
 explain select bid from book_2021 where typeid in(2,3) and authorid=1 order by typeid desc;
 +----+-------------+-----------+------+---------------+------+---------+------+------+-----------------------------+
 | id | select_type | table     | type | possible_keys | key  | key_len | ref  | rows | Extra                       |
 +----+-------------+-----------+------+---------------+------+---------+------+------+-----------------------------+
 |  1 | SIMPLE      | book_2021 | ALL  | NULL          | NULL | NULL    | NULL |    5 | Using where; Using filesort |
 +----+-------------+-----------+------+---------------+------+---------+------+------+-----------------------------+
```
1. 根据SQL的执行过程可知,建立索引的顺序为`typeid、authorid、bid`；
    ```
     -- sql执行顺序
     from .. on .. join ..  where .. group by .. having .. select distinct .. order by .. limit ..
    ```
    ```
     -- 建立索引
     alter table book_2021 add index idx_tab(typeid,authorid,bid);
    ```
2. 使用in的时候使索引失效，如果in失效那么后面的索引也将会失效，所以将范围条件放到最后；
    ```
     -- 优化后的SQL
     select bid from book_2021 where authorid=1 and typeid in(2,3) order by typeid desc;
    ```
   将旧索引删除，创建字段顺序对应的索引。
   > 温馨提示：索引一旦升级优化，需要删除索引防止干扰
    ```
     -- 删除 idx_tab 索引
     drop index idx_tab on book_2021;
   
     -- 给表 book_2021 添加索引 idx_atb
     alter table book_2021 add index idx_atb(authorid,typeid,bid);
    ```

最终优化后的SQL执行过程：
```
 explain select bid from book_2021 where authorid=1 and typeid in(2,3) order by typeid desc;
 +----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+-----------------------------------------------+
 | id | select_type | table     | partitions | type  | possible_keys | key     | key_len | ref  | rows | filtered | Extra                                         |
 +----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+-----------------------------------------------+
 |  1 | SIMPLE      | book_2021 | NULL       | range | idx_atb       | idx_atb | 8       | NULL |    3 |   100.00 | Using where; Backward index scan; Using index |
 +----+-------------+-----------+------------+-------+---------------+---------+---------+------+------+----------+-----------------------------------------------+
 ```
单表优化总结：
- 最佳左前缀原则，保持索引的定义和使用顺序一致；
- 索引需要逐步优化；
- 将包含范围查询的条件放置到最后；

#### 两表优化
```
 -- 准备测试表、测试数据
 create table teacher2(
   tid int(4) primary key,
   cid int(4) not null  
 );

 insert into teacher2 values(1,2);
 insert into teacher2 values(2,1);
 insert into teacher2 values(3,3);

 create table course2(
   cid int(4) not null,
   cname varchar(20)
 );

 insert into course2 values(1,'java');
 insert into course2 values(2,'phython');
 insert into course2 values(3,'kotlin');
```

需要优化的SQL：
```
 -- SQL原型，优化该SQL 
 select * from teacher2 t left outer join course2 c on t.cid = c.cid where c.cname = 'java';
```
执行过程分析该SQL，发现进行了全表扫描。
```
 explain select * from teacher2 t left outer join course2 c on t.cid = c.cid where c.cname = 'java';
 +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+--------------------------------------------+
 | id | select_type | table | partitions | type | possible_keys | key  | key_len | ref  | rows | filtered | Extra                                      |
 +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+--------------------------------------------+
 |  1 | SIMPLE      | c     | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    3 |    33.33 | Using where                                |
 |  1 | SIMPLE      | t     | NULL       | ALL  | NULL          | NULL | NULL    | NULL |    3 |    33.33 | Using where; Using join buffer (hash join) |
 +----+-------------+-------+------------+------+---------------+------+---------+------+------+----------+--------------------------------------------+
```

优化思路为建立索引，在哪张表哪个字段建立索引？即**小表驱动大表**，索引应建立在经常使用的字段上，假设此时teacher表数据量少，那么应为`t.cid、c.name`字段加索引。

什么是小表驱动大表？
假设小表10条数据；大表300条数据；让大小表做嵌套循环，无论10是外层循环还是300是外层循环，结果都是3000次，但是为了减少表连接创建的次数，应该将10，即小表放在外层循环这样效率会更高。

为什么这么做？
现有两个表A与B ，表A有200条数据，表B有20万条数据。按照循环的概念举个例子：
- 小表驱动大表：
    ```
    for(200条){
    for(20万条){
    ...
    }
    }
    ```
- 大表驱动小表：
    ```
    for(20万条){
    for(200条){
    ...
    }
    }
    ```

如果小的循环在外层，对于表连接来说就只连接200次，如果大的循环在外层，则需要进行20万次表连接，从而浪费资源，增加消耗。
小表驱动大表的主要目的是通过减少表连接创建的次数，加快查询速度。

```
 -- 给表teacher2、course2 添加索引
 alter table teacher2 add index idx_teacher2_cid(cid);
 alter table course2 add index idx_course2_cname(cname);
```
最终优化后的SQL：
```
 -- 添加索引后
 explain select * from teacher2 t left outer join course2 c on t.cid = c.cid where c.cname = 'java';
 +----+-------------+-------+------------+------+-------------------+-------------------+---------+----------------+------+----------+-------------+
 | id | select_type | table | partitions | type | possible_keys     | key               | key_len | ref            | rows | filtered | Extra       |
 +----+-------------+-------+------------+------+-------------------+-------------------+---------+----------------+------+----------+-------------+
 |  1 | SIMPLE      | c     | NULL       | ref  | idx_course2_cname | idx_course2_cname | 83      | const          |    1 |   100.00 | Using where |
 |  1 | SIMPLE      | t     | NULL       | ref  | idx_teacher2_cid  | idx_teacher2_cid  | 4       | sql_demo.c.cid |    1 |   100.00 | Using index |
 +----+-------------+-------+------------+------+-------------------+-------------------+---------+----------------+------+----------+-------------+
```
多表优化总结：
- 小表驱动大表；
- 索引建立在经常查询的字段上；

## MySQL锁机制
在数据库中，除传统的计算资源（如CPU、RAM、I/O等）的争用以外，数据也是一种供许多用户共享的资源。如何保证数据并发访问的一致性、有效性是所有数据库必须解决的一个问题，锁冲突也是影响数据库并发访问性能的一个重要因素。从这个角度来说，锁对数据库而言显得尤其重要，也更加复杂。
简而言之，锁机制是解决因资源共享，而造成的并发问题。

MySQL中的锁按照对数据操作的类型分为：读锁即共享锁，写锁即互斥锁；按照操作粒度来分，分为表锁、行锁，页锁。

- 读锁：对于同一个数据，多个读操作可以同时进行，互不干扰。
- 写锁：如果当前写操作没有完毕，则无法进行其他的读操作、写操作。
- 表锁：一次性对一张表整体加锁。MyISAM存储引擎偏向表锁，开销较小、加锁较快、无死锁、锁的范围较大，但是容易发生发生锁冲突，并发度低。
- 行锁：一次性对一条数据加锁。InnoDB存储引擎偏向行锁，开销较大、加锁较慢、容易出现死锁、锁的范围较小，但是不易发生锁冲突，并发度高。

### 表锁
测试数据：
```
 create table mylock (
     id int not null primary key auto_increment,
     name varchar(20) default ''
 ) engine myisam;
 
 insert into mylock(name) values('a');
 insert into mylock(name) values('b');
 insert into mylock(name) values('c');
 insert into mylock(name) values('d');
 insert into mylock(name) values('e');
```

常用命令：
```
 -- 加锁
 lock table 表名1 read/write, 表名2 read/write, 其他;
 
 -- 解锁
 unlock tables;

 -- 查看表上是否加锁；在In_use列，0代表没有加锁，1代表加锁
 show open tables;
 
 -- 分析表锁
 -- Table_locks_immediate：产生表级锁定的次数，表示可以立即获取锁的查询次数，每立即获取锁值加1
 -- Table_locks_waited：出现表级锁定争用而发生等待的次数(不能立即获取锁的次数，每等待一次锁值加1)，此值高则说明存在着较严重的表级锁争用情况
 show status like 'table_locks%';
```
---

给表添加**读锁**及测试读操作：

![MySqlSQL优化及锁机制-002](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-002.png)

![MySqlSQL优化及锁机制-004](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-004.png)

给表添加**读锁**及测试写操作：

![MySqlSQL优化及锁机制-003](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-003.png)

![MySqlSQL优化及锁机制-005](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-005.png)

给某个表添加读锁之后，所有会话都能对这个表进行读操作，但是当前会话不能对该表进行写操作，对其他表进行读、写操作；其他会话能需要等持有锁的会话释放该表的锁后，才能进行写操作，期间将会一直处于等待状态，可以对其他表进行读写操作。

---

给表添加**写锁**及测试读操作：

![MySqlSQL优化及锁机制-006](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-006.png)

![MySqlSQL优化及锁机制-007](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-007.png)

给表添加**写锁**及测试写操作：

![MySqlSQL优化及锁机制-008](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-008.png)

![MySqlSQL优化及锁机制-009](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-009.png)

给某个表添加写锁之后，当前会话可以对该表进行写操作、读操作，其他会话要想对该表进行读写操作需要等持有锁的会话释放锁，否则期间将会一直等待该锁释放；但是当前持有锁的会话是不能对其他表进行读写操作，其他会话能够对其他表进行读写操作。

对于表锁MyISAM在执行查询语句前，会自动给涉及的所有表加读锁，在执行增删改操作前，会自动给涉及的表加写锁。
- 对MyISAM表的读操作(加读锁)，不会阻塞其他进程对同一表的读请求，但会阻塞对同一表的写请求。只有当读锁释放后，才会执行其它进程的写操作。
- 对MyISAM表的写操作(加写锁)，会阻塞其他进程对同一表的读和写操作，只有当写锁释放后，才会执行其它进程的读写操作。

简而言之，就是读锁会阻塞写，但是不会堵塞读。而写锁则会把读和写都堵塞。

### 行锁
测试数据：
```
 CREATE TABLE test_innodb_lock (a INT(11),b VARCHAR(16))ENGINE=INNODB;
 
 INSERT INTO test_innodb_lock VALUES(1,'b2');
 INSERT INTO test_innodb_lock VALUES(3,'3');
 INSERT INTO test_innodb_lock VALUES(4, '4000');
 INSERT INTO test_innodb_lock VALUES(5,'5000');
 INSERT INTO test_innodb_lock VALUES(6, '6000');
 INSERT INTO test_innodb_lock VALUES(7,'7000');
 INSERT INTO test_innodb_lock VALUES(8, '8000');
 INSERT INTO test_innodb_lock VALUES(9,'9000');
 INSERT INTO test_innodb_lock VALUES(1,'b1');
 
 CREATE INDEX test_innodb_a_ind ON test_innodb_lock(a);
 CREATE INDEX test_innodb_lock_b_ind ON test_innodb_lock(b);
 
```

常用命令：
```
 -- 分析行锁定：
 -- 尤其是当等待次数很高，而且每次等待时长也不小的时候，我们就需要分析系统中为什么会有如此多的等待，然后根据分析结果着手指定优化计划。
 -- Innodb_row_lock_current_waits：当前正在等待锁定的数量；
 -- Innodb_row_lock_time：从系统启动到现在锁定总时间长度；
 -- Innodb_row_lock_time_avg：每次等待所花平均时间；
 -- Innodb_row_lock_time_max：从系统启动到现在等待最常的一次所花的时间；
 -- Innodb_row_lock_waits：系统启动后到现在总共等待的次数；
 -- show status like 'innodb_row_lock%';
```

由于行锁与事务相关，所以在测试之前需要关闭MySQL的自动提交：
```
 -- 关闭自动提交；0关闭，1打开
 set autocommit = 0;
```

测试行锁读写操作：

![MySqlSQL优化及锁机制-010](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-010.png)

![MySqlSQL优化及锁机制-011](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-011.png)

当前会话当关闭MySQL自动提交后，修改表中的某一行数据，未提交前其他会话是不可见该修改的数据的；如果当前会话和修改某一行数据其他会话也修改该行数据则其他会话会一直等待，直到持有锁的会话commit后才会执行。
如果当前会话和其他会话操作同一张表的不同行数据时，则相互不影响。

**使用行锁时注意，无索引行或索引失效都会导致行锁变为表锁。**

**间隙锁：**

当我们用范围条件而不是相等条件检索数据，并请求共享或排他锁时，InnoDB会给符合条件的已有数据记录的索引项加锁，对于键值在条件范围内但并不存在的记录，叫做“间隙”。
InnoDB也会对这个“间隙”加锁，这种锁机制就是所谓的间隙锁。

因为Query执行过程中通过过范围查找的话，他会锁定整个范围内所有的索引键值，即使这个键值并不存在。

间隙锁有一个比较致命的弱点，就是当锁定一个范围键值之后，即使某些不存在的键值也会被无辜的锁定，而造成在锁定的时候无法插入锁定键值范围内的任何数据。在某些场景下这可能会对性能造成很大的危害。


如何锁定一行？在查询语句使用`for update`关键字：
```
 select * from test_innodb_lock where a=8 for update;
```

![MySqlSQL优化及锁机制-012](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-012.png)

Innodb存储引擎由于实现了行级锁定，虽然在锁定机制的实现方面所带来的性能损耗可能比表级锁定会要更高一些，但是在整体并发处理能力方面要远远优于MyISAM的表级锁定的。
当系统并发量较高的时候，Innodb的整体性能和MyISAM相比就会有比较明显的优势了。
但是，Innodb的行级锁定同样也有其脆弱的一面，当我们使用不当的时候，可能会让Innodb的整体性能表现不仅不能比MyISAM高，甚至可能会更差。

### 总结
- MySQL锁分为全局锁、表级锁以及行级锁，不同的存储引擎支持锁的粒度有所不同，MyISAM 只支持到表级锁，InnoDB 则可以支持到行级锁，锁的粒度决定了业务的并发度，因此更推荐使用InnoDB
- InnoDB默认最小加锁粒度为行级锁，并且锁是加在索引上，如果SQL语句未命中索引，则走聚簇索引的全表扫描，表上每条记录都会上锁，导致并发能力下降，增大死锁的概率，因此需要为表合理的添加索引，线上查询尽量命中索引
- 行级锁默认加 next-key lock，而根据不同的索引也有不同的加锁规则，我们可以根据加锁规分析加锁区间
- 尽可能让所有数据检索都通过索引来完成，避免无索引行锁升级为表锁
- 合理设计索引，尽量缩小锁的范围
- 尽可能较少检索条件，避免间隙锁
- 尽量控制事务大小，减少锁定资源量和时间长度
- 尽可能低级别事务隔离

## 分库分表
当数据库存储出现瓶颈的时候，就需要进行分库分表了。
假设你现在在一个小公司，注册用户就 20 万，每天活跃用户就 1 万，每天单表数据量就 1000，然后高峰期每秒钟并发请求最多就 10 个。
随着公司业务发展，过了几年，注册用户数达到了 5000 万，每天活跃用户数 200 万，每天单表数据量 50 万条，数据库磁盘容量不断消耗掉，高峰期并发达到惊人的 5000~8000，这时候你会发现你得系统已经支撑不住了已经挂掉了。

一句话概括，随着业务的发展，数据库会遇到瓶颈，单表得数据量太大，会极大影响你的 sql 执行的性能，到了后面你的 sql 可能就跑的很慢了。
所以为了维持功能的正常使用不得不分库分表。

- 分表：分表就是把一个表的数据放到多个表中，然后查询的时候你就查一个表。比如按照用户 id 来分表，将一个用户的数据就放在一个表中。
然后操作的时候你对一个用户就操作那个表就好了。分表主要是为了减少单张表的大小，解决单表数据量带来的性能问题。当单表数据增量过快，业界流传是超过500万的数据量就要考虑分表了。
当然500万只是一个经验值，大家可以根据实际情况做出决策。
- 分库：一个库一般我们经验而言，最多支撑到并发 2000，超过这个数字就一定要扩容了，而且一个健康的单库并发值你最好保持在每秒 1000 左右，不要太大。
那么你可以将一个库的数据拆分到多个库中，访问的时候就访问一个库好了。

分库分表是两个事情，别搞混了，可能是光分库不分表，也可能是光分表不分库，都有可能，但不管怎样分库分表一定是为了支撑高并发、数据量大两个问题的。
分库分表是能不分就不分，因为分库分表也会带来一些问题：
- 跨库关联查询
- 分布式事务
- 排序、分页、函数计算问题
- 分布式ID
- 多数据源

### 拆分方案
怎么拆分？拆分方案一般分为两种，水平拆分，垂直拆分。

水平拆分的意思，基于数据划分，表结构相同，数据不同。例如，现有一个业务表，新建业务表2，业务表与业务表2中字段一致，将ID为奇数的存储在业务表中，偶数的存放在业务表2中。
就是把一个表的数据给弄到多个库的多个表里去，但是每个库的表结构都一样，只不过每个库表放的数据是不同的，所有库表的数据加起来就是全部数据。
水平拆分的意义，就是将数据均匀放更多的库里，然后用多个库来扛更高的并发，还有就是用多个库的存储容量来进行扩容。

垂直拆分的意思，基于表或字段划分，表结构不同。例如，将业务表中不常用的字段name和age存放到业务表2中。
就是把一个有很多字段的表给拆分成多个表，或者是多个库上去。每个库表的结构都不一样，每个库表都包含部分字段。
一般来说，会将较少的访问频率很高的字段放到一个表里去，然后将较多的访问频率很低的字段放到另外一个表里去。
因为数据库是有缓存的，你访问频率高的行字段越少，就可以在缓存里缓存更多的行，性能就越好，这个一般在表层面做的较多一些。

- 在一个库内拆分多个表：先分库，将不同数据库中的表拆分为了多个子表，多个子表存在于同一数据库中；
  ![MySqlSQL优化及锁机制-013](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-013.png)

- 用多库拆分一个表，将一个数据库中的表拆分到多个数据库中；
  ![MySqlSQL优化及锁机制-014](/iblog/posts/annex/images/essays/MySqlSQL优化及锁机制-014.png)

在一个数据库中将一张表拆分为几个子表，在一定程度上可以解决单表查询性能的问题，但是也会遇到单数据库存储瓶颈这个问题，所以用的更多的还是将子表拆分到多个数据库中。

除了垂直和水平拆分外，还有比较流行的分库分表方式，一种是按照range，即范围来分，就是每个库一段连续的数据，这个一般是按比如时间范围来的。
但是这种一般较少用，因为很容易产生热点问题，大量的流量都打在最新的数据上了；另一种是按照某个字段的hash值，一下均匀分散。

range：好处在于扩容的时候很简单，因为你只要预备好，给每个月都准备一个库就可以了，到了一个新的月份的时候，自然而然，就会写新的库了；
缺点，但是大部分的请求，都是访问最新的数据。实际生产用 range，要看场景。

hash：好处在于可以平均分配每个库的数据量和请求压力；
坏处在于说扩容起来比较麻烦，会有一个数据迁移的过程，之前的数据需要重新计算 hash 值重新分配到不同的库或表。

### 数据迁移方案
现在有一个未分库分表的系统，未来要分库分表，如何设计才可以让系统从未分库分表动态切换到分库分表上？

方案一：停机迁移
1. 网站或者 app 发布公告，例如，0 点到早上 6 点进行运维，无法访问；
2. 到时间将系统停掉，执行导数工具，将单库单表的数据读出来，写到分库分表里面去；
3. 导数完之后，需要改配置，验证一下数据；

方案二：双写迁移
1. 在线上系统里面，之前所有写库的地方，增删改操作，除了对老库增删改，都加上对新库的增删改；
2. 重新部署系统，新数据库数据差太多，就写一个导数工具，跑起来读老库数据写新库，跑的时候要注意，老数据不要覆盖掉新数据；
3. 假设导完数据了，有可能数据还是存在不一致，那么就程序自动做一轮校验，比对新老库每个表的每条数据，就针对那些不一样的，从老库读数据再次写。
反复循环，直到两个库每个表的数据都完全一致为止；

### 常见分库分表中间件
[Cobar](https://github.com/alibaba/cobar/wiki)：
阿里 b2b 团队开发和开源的，属于 proxy 层方案，就是介于应用服务器和数据库服务器之间。应用程序通过 JDBC 驱动访问 Cobar 集群，Cobar 根据 SQL 和分库规则对 SQL 做分解，然后分发到 MySQL 集群不同的数据库实例上执行。早些年还可以用，但是最近几年都没更新了，基本没啥人用，差不多算是被抛弃的状态吧。而且不支持读写分离、存储过程、跨库 join 和分页等操作。

[TDDL](https://github.com/alibaba/tb_tddl)：
淘宝团队开发的，属于 client 层方案。支持基本的 crud 语法和读写分离，但不支持 join、多表查询等语法。目前使用的也不多，因为还依赖淘宝的 diamond 配置管理系统。

[Atlas](https://github.com/Qihoo360/Atlas)：
360 开源的，属于 proxy 层方案，以前是有一些公司在用的，但是确实有一个很大的问题就是社区最新的维护都在 5 年前了。所以，现在用的公司基本也很少了。

[Sharding-jdbc](https://shardingsphere.apache.org/document/legacy/4.x/document/cn/overview)：
当当开源的，属于 client 层方案，是 ShardingSphere 的 client 层方案， ShardingSphere 还提供 proxy 层的方案 Sharding-Proxy。确实之前用的还比较多一些，因为 SQL 语法支持也比较多，没有太多限制，而且截至 2019.4，已经推出到了 4.0.0-RC1 版本，支持分库分表、读写分离、分布式 id 生成、柔性事务（最大努力送达型事务、TCC 事务）。而且确实之前使用的公司会比较多一些（这个在官网有登记使用的公司，可以看到从 2017 年一直到现在，是有不少公司在用的），目前社区也还一直在开发和维护，还算是比较活跃，个人认为算是一个现在也可以选择的方案。

[Mycat](https://www.yuque.com/ccazhw/ml3nkf)：
基于 Cobar 改造的，属于 proxy 层方案，支持的功能非常完善，而且目前应该是非常火的而且不断流行的数据库中间件，社区很活跃，也有一些公司开始在用了。但是确实相比于 Sharding jdbc 来说，年轻一些，经历的锤炼少一些。

综上，现在其实建议考量的，就是 Sharding-jdbc 和 Mycat，这两个都可以去考虑使用。无论分库还是分表，上面说的那些数据库中间件都是可以支持的。就是基本上那些中间件可以做到你分库分表之后，中间件可以根据你指定的某个字段值，比如说 userid，自动路由到对应的库上去，然后再自动路由到对应的表里去。

Sharding-jdbc 这种 client 层方案的优点在于不用部署，运维成本低，不需要代理层的二次转发请求，性能很高，但是如果遇到升级啥的需要各个系统都重新升级版本再发布，各个系统都需要耦合 Sharding-jdbc 的依赖；

Mycat 这种 proxy 层方案的缺点在于需要部署，自己运维一套中间件，运维成本高，但是好处在于对于各个项目是透明的，如果遇到升级之类的都是自己中间件那里搞就行了。

通常来说，这两个方案其实都可以选用，但是建议中小型公司选用 Sharding-jdbc，client 层方案轻便，而且维护成本低，不需要额外增派人手，而且中小型公司系统复杂度会低一些，项目也没那么多；但是中大型公司最好还是选用 Mycat 这类 proxy 层方案，因为可能大公司系统和项目非常多，团队很大，人员充足，那么最好是专门弄个人来研究和维护 Mycat，然后大量项目直接透明使用即可。

## 参考链接
- https://mp.weixin.qq.com/s/-Jipxjwe-jAax4hJSe-9Jg
- https://www.hollischuang.com/archives/6330
- https://dev.mysql.com/doc/refman/8.0/en/using-explain.html
- https://www.javanav.com/interview/7b1d6961b1e344fa9b6ea74819d4f417.html
- http://blog.chinaunix.net/uid-30272888-id-5602128.html
- https://blog.codinglabs.org/articles/theory-of-mysql-index.html
- https://javaguide.cn/database/mysql/mysql-index.html
- https://mp.weixin.qq.com/s/8qemhRg5MgXs1So5YCv0fQ
- https://javaguide.cn/database/mysql/innodb-implementation-of-mvcc.html
- https://javabetter.cn/mysql/shiwu-shixian.html