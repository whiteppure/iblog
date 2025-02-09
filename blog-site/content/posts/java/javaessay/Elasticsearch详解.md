---
title: "Elasticsearch详解"
date: 2023-02-14
draft: false
tags: ["详解","分布式","Elasticsearch"]
slug: "java-elasticsearch"
---

## 概览
`Elasticsearch`简称为`ES`，它是一个开源的高扩展的分布式全文搜索引擎，是整个`ElasticStack`技术栈的核心。
它可以近乎实时的存储、检索数据，本身扩展性很好，可以扩展到上百台服务器，处理**PB级别**的数据。
> 1PB等于1024TB，这是一个非常大的数据量，通常用于描述大规模的数据存储需求，比如在云计算、大数据分析、数据中心等领域。

> `Elastic Stack`包括`Elasticsearch`、`Kibana`、`Beats`和`Logstash`，也称为 ELK。能够安全可靠地获取任何来源、任何格式的数据，然后实时地对数据进行搜索、分析和可视化。

`Elasticsearch`是面向文档型数据库，一条数据在这里就是一个文档。`Elasticsearch`里存储文档数据和关系型数据库MySQL存储数据的概念进行一个类比，如图：
![Elasticsearch详解-01](/posts/annex/images/essays/Elasticsearch详解-01.png)

`ES`里的`Index`可以看做一个库，而`Types`相当于表，`Documents`则相当于表的行。
这里`Types`的概念已经被逐渐弱化，`Elasticsearch 6.X`中，一个`index`下已经只能包含一个`type`，`Elasticsearch 7.X`中，`Type`的概念已经被删除了。

## 集群架构
一个运行中的`Elasticsearch`实例称为一个节点，而集群是由一个或者多个拥有相同`cluster.name`配置的节点组成的，它们共同承担数据和负载的压力。
当有节点加入集群中或者从集群中移除节点时，集群将会重新平均分布所有的数据。

当一个节点被选举成为主节点时，它将负责管理集群范围内的所有的变更，例如，增加、删除索引，或者增加、删除节点等。
而主节点并不需要涉及到文档级别的变更和搜索等操作，所以当集群只拥有一个主节点的情况下，即使流量的增加它也不会成为瓶颈。
任何节点都可以成为主节点。

作为用户，我们可以将请求发送到集群中的任何节点，包括主节点。每个节点都知道任意文档所处的位置，并且能够将我们的请求直接转发到存储我们所需文档的节点。
无论我们将请求发送到哪个节点，它都能负责从各个包含我们所需文档的节点收集回数据，并将最终结果返回给客户端。

### 搭建集群
1. 创建`elasticsearch-cluster`文件夹，在内部复制三个`elasticsearch`服务。

    ![Elasticsearch详解-02](/posts/annex/images/essays/Elasticsearch详解-02.png)

2. 修改节点配置`config/elasticsearch.yml`文件。
   - `node-1001`节点
      ```yaml
      #集群名称，节点之间要保持一致
      cluster.name: my-elasticsearch
      #节点名称，集群内要唯一
      node.name: node-1001
      node.master: true
      node.data: true
      #ip 地址
      network.host: localhost
      #http 端口
      http.port: 1001
      #tcp 监听端口
      transport.tcp.port: 9301
      #discovery.seed_hosts: ["localhost:9301", "localhost:9302","localhost:9303"]
      #discovery.zen.fd.ping_timeout: 1m
      #discovery.zen.fd.ping_retries: 5
      #集群内的可以被选为主节点的节点列表
      #cluster.initial_master_nodes: ["node-1", "node-2","node-3"]
      #跨域配置
      #action.destructive_requires_name: true
      http.cors.enabled: true
      http.cors.allow-origin: "*"
      ```
   - `node-1002`节点
     ```yaml
      #集群名称，节点之间要保持一致
      cluster.name: my-elasticsearch
      #节点名称，集群内要唯一
      node.name: node-1002
      node.master: true
      node.data: true
      #ip 地址
      network.host: localhost
      #http 端口
      http.port: 1002
      #tcp 监听端口
      transport.tcp.port: 9302
      discovery.seed_hosts: ["localhost:9301"]
      discovery.zen.fd.ping_timeout: 1m
      discovery.zen.fd.ping_retries: 5
      #集群内的可以被选为主节点的节点列表
      #cluster.initial_master_nodes: ["node-1", "node-2","node-3"]
      #跨域配置
      #action.destructive_requires_name: true
      http.cors.enabled: true
      http.cors.allow-origin: "*"
      ```
   - `node-1003`节点
     ```yaml
     #集群名称，节点之间要保持一致
     cluster.name: my-elasticsearch
     #节点名称，集群内要唯一
     node.name: node-1003
     node.master: true
     node.data: true
     #ip 地址
     network.host: localhost
     #http 端口
     http.port: 1003
     #tcp 监听端口
     transport.tcp.port: 9303
     #候选主节点的地址，在开启服务后可以被选为主节点
     discovery.seed_hosts: ["localhost:9301", "localhost:9302"]
     discovery.zen.fd.ping_timeout: 1m
     discovery.zen.fd.ping_retries: 5
     #集群内的可以被选为主节点的节点列表
     #cluster.initial_master_nodes: ["node-1", "node-2","node-3"]
     #跨域配置
     #action.destructive_requires_name: true
     http.cors.enabled: true
     http.cors.allow-origin: "*"
     ```
3. 启动集群，点击`bin\elasticsearch.bat`

    ![Elasticsearch详解-03](/posts/annex/images/essays/Elasticsearch详解-03.png)

如果启动不起来，可能原因是分配内存不足，需要修改`config\jvm.options`文件中的内存属性。
启动之后可使用[elasticsearch-head](https://github.com/mobz/elasticsearch-head),[ElasticHD](https://gitee.com/farmerx/ElasticHD)等`ES`可视化工具查看。

### 分布式架构原理
`ElasticSearch`设计的理念就是分布式搜索引擎，底层其实还是基于`lucene`的。
其核心思想就是在多台机器上启动多个`ES`进程实例，组成了一个`ES`集群。
`ES`分布式架构实际上就是对`index`进行拆分，将`index`拆分成多个分片，并将分片分别放到不同的`ES`上实现集群部署。

![Elasticsearch详解-05](/posts/annex/images/essays/Elasticsearch详解-05.png)

分片是其核心架构的一个重要组成部分，分片的设计使得`Elasticsearch`能够水平扩展，处理大规模数据和高负载查询。
分片是索引的子集，用于将数据分布到不同的节点上。每个分片都是一个完整的倒排索引，它独立处理存储和搜索任务。

它支持横向扩展。比如你数据量是3T，3个分片，每个分片就是1T的数据。若现在数据量增加到4T，怎么扩展？很简单，重新建一个有4个分片的索引将数据导进去；
还能提高性能。数据分布在多个分片，即多台服务器上，负载均衡分散了查询和索引操作的压力。查询请求会被分发到各个相关的分片上，提升了查询效率。

分片的数据实际上是有多个备份存在的，会存在一个主分片还有几个副本分片。如果主分片所在的节点发生故障，副本分片可以接管，确保数据不会丢失。
当写入数据的时候先写入主分片，然后并行将数据同步到副本分片上。当读数据的时候会获取到所有分片，然后负载均衡轮询读取。

当某个节点宕机了，还有其他分片副本保存在其他的机器上，从而实现了高可用。如果是非主节点宕机了，那么会由主节点，让那个宕机节点上的主分片的数据转移到其他机器上的副本数据。
接着你要是修复了那个宕机机器，重启了之后，主节点会控制将缺失的副本数据分配过去，同步后续修改的数据之类的，让集群恢复正常。如果是主节点宕机，那么会重新选举一个节点为主节点。

### 故障转移
在一个网络环境里，失败随时都可能发生，在某个分片/节点不知怎么的就处于离线状态，或者由于任何原因消失了。
这种情况下，有一个故障转移机制是非常有用并且是强烈推荐的。为此`Elasticsearch`允许创建分片的一份或多份拷贝，这些拷贝叫做复制分片。

当集群中只有一个节点在运行时，意味着会有一个单点故障问题。幸运的是，我们只需再启动一个节点即可防止数据丢失。
当你在同一台机器上启动了第二个节点时，只要它和第一个节点有同样的`cluster.name`配置，它就会自动发现集群并加入到其中。

集群中的节点是通过心跳机制周期性地检查其他节点的健康状态。当节点未响应时，集群会将其标记为不可用。
如果一个节点上的主分片发生故障，`Elasticsearch`会将其标记为“失效”。集群会自动选举一个副本分片作为新的主分片，来确保数据的可用性。
如果一个节点上的副本分片发生故障，集群会尝试从其他节点上的副本分片中恢复。集群会自动重新分配副本分片到其他健康节点，来保证数据的冗余备份。

当故障的节点恢复时，集群会自动将其重新加入，并重新分配分片。如果原来的主分片已被重新选举，恢复的节点会从其他节点接收数据，确保数据的一致性。
如果主分片发生故障并被替换，集群会将新的主分片的数据从副本分片恢复。`Elasticsearch`会将副本分片同步到恢复的节点，确保副本分片的最新状态。

集群中的节点使用心跳机制定期检查主节点的健康状态。如果主节点在一定时间内未响应，其他节点会认为主节点可能已故障。
当现有主节点故障时，集群会自动开始主节点选举过程。所有节点都可以作为候选主节点参与选举。
参与选举的节点会进行投票，选择一个候选节点成为新的主节点。当候选节点获得多数投票时，它将被选举为新的主节点。选举结果会被通知所有节点，新的主节点开始接管管理任务。

当一个节点掉线，如果该节点是`master`节点，则通过比较`node ID`，选择较小`ID`的节点为`master`。然后由`master`节点决定分片如何重新分配。同理，新加入节点也是由`master`决定如何分配分片。
但是`ES`在主节点的选举中会产生分歧，会产生多个主节点，从而使集群分裂，使得集群处于异常状态，这个现象叫做脑裂。
脑裂问题其实就是同一个集群的不同节点对于整个集群的状态有不同的理解，导致操作错乱，类似于精神分裂。
所以`ES`最好部署三个以上的节点，并且配置仲裁数大于一半节点，来防止`master`选举的脑裂问题。

### 分片控制
当写入一个文档的时候，文档会被存储到一个主分片中。`Elasticsearch`集群是如何知道一个文档应该存放到哪个分片中呢？

`Elasticsearch`集群路由计算公式：
```text
shard = hash(routing) % number_of_primary_shards
```
`routing`是一个可变值，默认是文档的`id`，也可以设置成一个自定义的值。`routing`通过`hash`函数生成一个数字，然后这个数字再除以`number_of_primary_shards`（主分片的数量）后得到余数。
这个分布在0到`number_of_primary_shards-1`之间的余数，就是我们所寻求的文档所在分片的位置。
这也就是创建索引的时候主分片的数量永远也不会改变的原因，如果数量变化了，那么所有之前路由的值都会无效，文档也再也找不到了。

### 写数据流程
![Elasticsearch详解-06](/posts/annex/images/essays/Elasticsearch详解-06.png)

1. 写请求接收：用户发起的写请求（如 `index`、`update`、`delete`）会发送到集群中的任意节点，称为协调节点。
2. 请求路由：协调节点将写请求路由到正确的主分片，负责处理写操作。
3. 主分片处理：主分片将文档写入内存中的缓冲区，并更新索引的内部数据结构。数据会周期性地从内存刷新到磁盘上的段文件中，完成持久化。
4. 同步副本：主分片将数据复制到所有副本分片，副本分片将数据写入内存缓冲区，并最终刷新到磁盘。
5. 写操作确认：主分片和副本分片完成写入和同步后，写请求被标记为成功。协调节点收集分片的确认信息，并将结果返回给客户端。
6. 持久化与刷新：定期刷新操作将内存中的数据刷新到磁盘，用户也可以强制刷新以将最新写操作纳入搜索中。
7. 数据一致性：写操作具有原子性，要么完全成功，要么完全失败。副本分片同步提供数据冗余备份，主分片发生故障时副本分片可以接管。

当客户端收到成功响应时，文档变更已在主分片和所有副本分片中完成。可以通过一些请求参数来影响这一过程，这可能会提升性能，但可能会降低数据安全性。
设置`consistency`参数值会影响写入操作。`consistency`参数的值可以设为：
- `one`：只要主分片状态正常，就允许执行写操作。
- `all`：必须要主分片和所有副本分片的状态正常才允许执行写操作。
- `quorum`：默认值为 `quorum`，即大多数的分片副本状态正常就允许执行写操作。如果没有足够的副本分片，`Elasticsearch`会等待。默认情况下，它最多等待1分钟，可以使用`timeout`参数控制。

### 读数据流程
1. 用户发起读请求（如 `search`、`get`），请求发送到集群中的任意节点，称为协调节点。
2. 协调节点将请求路由到主分片和副本分片。主分片处理请求，查询内存中的数据，必要时从磁盘读取数据，并将结果返回给协调节点。副本分片也接收请求，从内存或磁盘读取数据，返回结果给协调节点。
3. 协调节点从主分片和副本分片收集查询结果，进行合并和排序。
5. 协调节点最终返回的结果可能包括主分片的最新数据和副本分片的同步数据。这样，即使副本分片尚未完全更新，客户端也能收到最新的数据或正确的查询结果。

## 原理
`Elasticsearch`通过将数据存储为JSON格式的文档，并把这些文档组织到索引中来工作。每个索引被拆分成多个主分片，这些分片负责存储数据并处理查询。
为了提高性能和可靠性，主分片有副本分片，这些副本分片用于备份数据并分担查询负载。

`Elasticsearch`使用倒排索引来加速搜索，这种索引方法将文档的字段值映射到包含这些值的文档列表，使得查询速度非常快。
数据在主分片中被分成多个段，段是固定的数据块，存储了倒排索引和实际数据。为了保持性能，系统定期刷新数据，将内存中的变更写入磁盘，并通过合并小段文件来优化存储空间和查询速度。

### 倒排索引
`Elasticsearch`使用一种称为倒排索引的结构，它适用于快速的全文搜索。一个倒排索引由文档中所有不重复词的列表构成，对于其中每个词，有一个包含它的文档列表。
倒排索引也叫反向索引，有反向索引必有正向索引。通俗地来讲，正向索引是通过`key`找`value`，反向索引则是通过`value`找`key`。

它的基本原理是将文档的内容映射到一个倒排列表中，便于快速查找包含特定词汇的文档。
倒排表记录了，出现过某个单词的所有文档的文档列表及单词在该文档中出现的位置信息，每条记录称为一个倒排项。根据倒排列表，即可获知哪些文档包含某个单词。

假设有一个小型的文本数据库，其中包含三个文档：
- 文档1：`"Elasticsearch is a search engine"`
- 文档2：`"Elasticsearch uses inverted index"`
- 文档3：`"Search engine uses inverted index"`

从这些文档中提取出所有独特的词汇，形成一个词汇表。假设词汇表包括这些词：
```text
"Elasticsearch"
"is"
"a"
"search"
"engine"
"uses"
"inverted"
"index"
```
倒排列表为每个词汇创建一个倒排列表，记录这个词汇出现在哪些文档中。例如：
- `"Elasticsearch"`：出现于文档1和文档2；
- `"search"`：出现于文档1和文档3；
- `"engine"`：出现于文档1和文档3；
- `"inverted"`：出现于文档2和文档3；
- `"index"`：出现于文档2和文档3；

倒排索引搜索时，先查询单词是否在词汇表中，如果不在则搜索结束。如果在词汇表中需要查询单词在倒排列表中的指针，获取单词对应的文档ID，根据文档ID查询时哪一条数据。
倒排索引将每个词汇映射到包含该词汇的文档列表中。这样，查询时系统无需遍历所有文档，只需查找词汇的倒排列表，即可快速找到相关文档。相比逐个检查每个文档，查找倒排列表速度更快。

### 分析器
倒排索引总是和分词分不开的，不同语言的分词方式也有所不同。分析器在`Elasticsearch`中负责将文本数据转换成适合于倒排索引的形式。

分析器的主要功能是将一块文本分成适合于倒排索引的独立词条，分析器组成：
- 字符过滤器：主要功能为对输入文本进行预处理，修改或删除字符。在分词前整理字符串，比如字符过滤器可以用来去掉`HTML`或者将`&`转化成`and`；
- 分词器：它的主要作用是将处理后的文本分割成基本的词汇单元或标记。字符串被分词器分为单个的词条，一个简单的分词器遇到空格和标点的时候，可能会将文本拆分成词条；
- 过滤器：对分词器生成的词汇进行进一步处理，如标准化、去除停用词等。按顺序通过每个过滤器，这个过程可能会改变词条例如，小写化`Quick`，删除词条例如，像`a`，`and`，`the`等无用词

举个例子，为了保证文本数据在索引和搜索过程中被适当处理，在`Elasticsearch`中，可以通过如下配置定义分析器：
```json
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_html_analyzer": {
          "type": "custom",
          "char_filter": ["html_strip"],
          "tokenizer": "standard",
          "filter": [
            "lowercase",
            "stop",
            "stemmer"
          ]
        }
      },
      "filter": {
        "stop": {
          "type": "stop",
          "stopwords": "_english_"
        },
        "stemmer": {
          "type": "stemmer",
          "name": "english"
        }
      }
    }
  }
}
```
假设我们有以下文本：
```html
<p>Elasticsearch <b>is</b> a powerful <i>search engine</i> for <a href="https://example.com">full-text search</a>.</p>
```
首先经过字符过滤器，去除HTML标签：
```text
Elasticsearch is a powerful search engine for full-text search.
```
然后经过分词器，将文本分割成词条：
```text
["Elasticsearch", "is", "a", "powerful", "search", "engine", "for", "full-text", "search"]
```
最后经过过滤器，将词条进一步处理，这里配置了三个过滤器`lowercase`、`stop`、`stemmer`，最终经过过滤器后，得到最终的词条列表：
```text
["elastics", "power", "search", "engin", "full-text", "search"]
```

分析器的主要作用是分词，常用中文分词器是[ik分词器](https://github.com/medcl/elasticsearch-analysis-ik/releases/tag/v7.8.0)，将解压后的后的文件夹放入`ES`根目录下的`plugins`目录下，重启`ES`即可使用。

### 倒排索引的更新
早期的全文检索会为整个文档集合建立一个很大的倒排索引并将其写入到磁盘。被写入的索引不可变化，如果需要让一个新的文档可被搜索，你需要重建整个索引。
一旦新的索引就绪，旧的就会被其替换。这样要么对一个索引所能包含的数据量造成了很大的限制，要么对索引可被更新的频率造成了很大的限制。

如何在保留不变性的前提下实现倒排索引的更新？
用更多的索引。通过增加新的补充索引来反映新的修改，而不是直接重写整个倒排索引。每一个倒排索引都会被轮流查询到，从最早的开始查询完后再对结果进行合并。
具体来说，当一个文档被删除时，它实际上只是在文件中被标记删除。被标记删除的文档仍然可以被查询匹配到，但它会在最终结果被返回前从结果集中过滤掉。
文档更新也是类似的操作方式，当一个文档被更新时，旧版本文档被标记删除，文档的新版本被索引到一个新的段中。可能两个版本的文档都会被一个查询匹配到，但被删除的那个旧版本文档在结果集返回前就已经被移除。

### 近实时搜索
`Elasticsearch`的主要功能就是搜索，但是`Elasticsearch`的搜索功能不是实时的，而是近实时的，主要原因在于`ES`搜索是分段搜索。

`Elasticsearch`将索引分为多个段。每个段是倒排索引的一个部分，包含一部分文档的索引数据。
最新的数据更新会体现在最新的段中，而最新的段落盘之后`ES`才能进行搜索，所以磁盘性能极大影响了`ES`软件的搜索。
`ES`的主要作用就是快速准确的获取想要的数据，所以降低处理数据的延迟就显得尤为重要。

![Elasticsearch详解-04](/posts/annex/images/essays/Elasticsearch详解-04.png)

1. 当新文档被索引到`Elasticsearch`中时，它首先被写入到内存中的数据结构，然后被逐渐持久化到磁盘上的倒排索引中。
并且追加到了`translog`事务日志中。(先写入索引中，再写入到日志中，目的防止数据丢失，类似数据库中的事务日志)
2. 为了使新文档可被搜索，`Elasticsearch`会周期性地执行刷新操作。刷新操作将内存中的数据结构（称为“内存索引”或“写入缓冲区”）刷新到磁盘，创建新的搜索段。此时缓冲区的数据可被搜索，当完全将数据写入磁盘会清空缓冲区中的数据。
3. 随着不断的刷写，磁盘中的文件会越来越多，此时需要文件段合并。当一个新的索引文件产生之后，文件的更新，删除便会体现出，此时在合并文件的时候便会真正的将数据删除。
小的段被合并到大的段，然后这些大的段再被合并到更大的段。合并操作是一个渐进的过程，它在后台进行，以避免影响查询性能。

由于刷新操作的周期性，`Elasticsearch`的近实时搜索通常在几秒钟内可以检索到新索引的文档。
