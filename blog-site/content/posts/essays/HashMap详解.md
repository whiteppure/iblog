---
title: "HashMap详解"
date: 2021-05-03
draft: false
tags: ["Java", "集合","详解"]
slug: "java-hashmap"
---


## HashMap
`HashMap`是一个散列表，它存储的内容是键值对(`key-value`)映射。
`HashMap`实现了`Map`接口，根据键的`HashCode`值存储数据，具有很快的访问速度，最多允许一条记录的键为`null`，不支持线程同步。`HashMap`是无序的，即不会记录插入的顺序。

相关操作：
- 存储：通过`key`的`hashcode`方法找到在`hashMap`存储的位置，如果该位置有元素则通过`equals`方法进行比较，如果`equals`返回值为`true`，则覆盖`value`；
  如果`equals`返回值为`false`则在该数组元素的头部追加该元素，形成一个链表结构；
- 读取：通过`key`的`hashcode`方法获取元素存在该数组的位置，然后通过`equals`拿到该值；

总的来说`hashMap`底层将`key-value`当成一个整体来处，`hashMap`底层采用一个`Entry`数组保存所有的键值对。
当存储一个`entry`对象时，会根据`key`的`hashCode`来决定存放在数组中的位置，再根据`equals`方法来确定在链表中的位置，读取一个`entry`对象。
`equals`和`hashCode`在`hashMap`中就像一个坐标一样，来定位`hashMap`中的值。

### HashMap结构
![HashMap结构](/iblog/posts/annex/images/essays/HashMap结构.png)

在JDK1.7及之前结构为`数组+单向链表`，JDK1.8及之后结构为`数组 + 单向链表/红黑树`。
在JDK1.8时，如果存储`Map`中数组元素对应的索引的每个链表超过8，就将单向链表转化为红黑树，当红黑树的节点少于6个的时候又开始使用链表。

那么为什么要使用红黑树？
当有发生大量的`hash`冲突时，因为链表遍历效率很慢，为了提升查询的效率，所以使用了红黑树的数据结构。

为什么不一开始就用红黑树代替链表结构？
> Because TreeNodes are about twice the size of regular nodes, we use them only when bins contain enough nodes to warrant use  (see TREEIFY_THRESHOLD).
And when they become too small (due to removal or resizing) they are converted back to plain bins.

这是JDK文档注释，大意为：单个`TreeNode`需要占用的空间大约是普通`Node`的两倍，所以只有当包含足够多的`Nodes`时才会转成`TreeNodes`，而是否足够多就是由`TREEIFY_THRESHOLD`的值(默认值8)决定的。
而当桶中节点数由于移除或者`resize`变少后，又会变回普通的链表的形式，以便节省空间，这个阈值是`UNTREEIFY_THRESHOLD`(默认值6)。

为什么树化阈值要设置为8？
如果`hashCode`分布良好，也就是`hash`计算的结果离散好的话，那么红黑树这种形式是很少会被用到的，因为各个值都均匀分布，很少出现链表很长的情况。
在理想情况下，链表长度符合泊松分布，各个长度的命中概率依次递减，当长度为8的时候，概率仅为0.00000006。
这是一个小于千万分之一的概率，通常我们的`Map`里面是不会存储这么多的数据的，所以通常情况下，并不会发生从链表向红黑树的转换。

`HashMap`是通过`hash`算法来判断对象应该放在哪个桶里面的。JDK并不能阻止我们用户实现自己的哈希算法，如果我们故意把哈希算法变得不均匀，那么每次存放对象很容易造成`hash`冲突。
链表长度超过8就转为红黑树的设计，更多的是为了防止用户自己实现了不好的哈希算法时导致链表过长，从而导致查询效率低，而此时转为红黑树更多的是一种保底策略，用来保证极端情况下查询的效率。
红黑树的引入保证了在大量`hash`冲突的情况下，`HashMap`还具有良好的查询性能。

那么在JDK1.8引入红黑树后，如果单链表节点个数超过8个是否一定会树化？
这是不一定的，在进行树化之前会进行判断`(n = tab.length) < MIN_TREEIFY_CAPACITY)`是否需要扩容，如果表中数组元素小于这个阈值（默认是64），就会进行扩容。
因为扩容不仅能增加表中的容量，还能缩短单链表的节点数，从而更长远的解决链表遍历慢问题。
```java
/**
 * Replaces all linked nodes in bin at index for given hash unless
 * table is too small, in which case resizes instead.
 */
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
        resize();
    else if ((e = tab[index = (n - 1) & hash]) != null) {
        TreeNode<K,V> hd = null, tl = null;
        do {
            TreeNode<K,V> p = replacementTreeNode(e, null);
            if (tl == null)
                hd = p;
            else {
                p.prev = tl;
                tl.next = p;
            }
            tl = p;
        } while ((e = e.next) != null);
        if ((tab[index] = hd) != null)
            hd.treeify(tab);
    }
}
```

### Hash冲突
在`HashMap`中，哈希冲突，也叫`Hash`碰撞，是指两个不同的键通过同一散列函数计算得到的哈希值相同，从而映射到同一个桶中。
当插入`HashMap`中元素的`key`出现重复时，这个时候就发生了`Hash`冲突了。哈希冲突是哈希表必须处理的问题。

链地址法是处理哈希冲突的常见方法之一，它在每个桶中使用一个链表来存储所有映射到该桶的键值对。具体插入步骤：
1. 计算键的哈希值并确定其在数组中的位置；
2. 如果桶为空，直接将键值对存储在该桶中；
3. 如果桶不为空，则遍历桶中的链表，检查是否存在相同的键；
 - 如果存在相同的键，更新对应的值；
 - 如果不存在相同的键，将新的键值对添加到链表的末尾；

在Java8及更高版本中，为了提高性能，当单个桶中的链表长度超过一定阈值（默认是 8）时，会将链表转换为红黑树。
这种方法在大量冲突的情况下提供了更高效的查找和插入性能。具体插入步骤：
1. 计算键的哈希值确定存储位置；
2. 如果存储位置为空，则直接插入新键值对；
3. 如果存储位置已有节点，当链表长度超过阈值（默认为 8），将链表转换为红黑树，否则继续用链表存储；
4. 如果当前结点为红黑树结点，则根据节点的哈希值和键值比较，找到合适的插入位置；插入后，根据红黑树的性质进行调整，保持平衡；
5. 当桶中元素数量减少到一定阈值以下时（默认是 6），会将红黑树转换回链表，以减少内存开销；

### HashMap容量
`HashMap`在创建时需要指定初始容量，如果不指定默认是16。初始容量指的是`HashMap`中桶的数量，即存储键值对的数组大小。
如果能预估要存储的键值对数量，可以在创建`HashMap`时指定初始容量，以避免频繁的扩容操作。

如果指定容量大小为10，那么实际大小是多少？
先说答案，实际大小是16，其容量为不小于指定容量的2的N次方。

为什么容量始终是2的N次方？
为了减少`Hash`碰撞，尽量使`Hash`算法的结果均匀分布。

当使用`put`方法时，到底存入`HashMap`的哪个数组中？
这是通过`hash`算法决定的，如果某一个数组中的链表过长旧会影响查询的效率。为了避免出现`hash`碰撞，让`hash`尽可能的散列分布，就需要在`hash`算法上做文章。

JDK1.7通过逻辑与运算，判断这个元素该进入哪个数组。在下面的代码中`length`的长度始终为不小于指定容量的2的N次方。
```java
static int indexFor(int h, int length) {
    return h & (length - 1);
}
```
为了更好的理解这个方法，举个例子，假设`h=2`或`h=3`，`length=15`，执行`indexFor`方法，最终逻辑与运算后的结果是一致的，因为最终结果是一致的所以就导致了`hash`碰撞。
这种问题多了以后会造成容器中的元素分布不均匀，都分配在同一个数组上，在查询的时候就减慢了查询的效率，另一方面也造成空间的浪费。
````text
-- 2转换为2进制与15-1进行&运算
  0000 0010
& 0000 1110 
———————————— 
  0000 1110

-- 3转换为2进制与15-1进行&运算
  0000 0011
& 0000 1110 
————————————
  0000 1110
````
为了避免上面`length=15`这类问题出现，所以集合的容量采用必须是2的N次幂这种方式。
因为2的N次幂的结果减一转换为二进制后都是以`...1111`结尾的，所以在进行逻辑与运算时碰撞几率小。

在JDK1.8中，在`putVal`方法中通过`i = (n - 1) & hash`来计算key的散列地址：
```java
final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
    // 此处省略了代码
    // i = (n - 1) & hash]
    if ((p = tab[i = (n - 1) & hash]) == null)
        
        tab[i] = newNode(hash, key, value, null);

    else {
        // 省略了代码
    }
}
```
这里的"&"等同于"%"，但是"%"运算的速度并没有"&"的操作速度快。
"&"操作能代替"%"运算，但必须满足一定的条件，即`a%b=a&(b-1)`仅当b是2的n次方的时候才成立。

容器容量怎么保持始终为2的N次方？
`HashMap`的`tableSizeFor`方法做了处理，能保证永远都是2的N次幂。
如果用户指定了初始容量，那么`HashMap`会计算出比该数大的第一个2的幂作为初始容量。另外就是在扩容的时候，也是进行成倍的扩容，即4变成8、8变成16。
```java
/**
 * Returns a power of two size for the given target capacity.
 */
static final int tableSizeFor(int cap) {

    // 假设n=17
    // n = 00010001 - 00010000 = 00010000 = 16
    int n = cap - 1;

    // n = (00010000 | 00001000) = 00011000 = 24
    n |= n >>> 1;

    // n = (00011000 | 00000110) = 00011110 = 30
    n |= n >>> 2;

    // n = (00011110 | 00000001) = 00011111 = 31
    n |= n >>> 4;

    // n = (00011111 | 00000000) = 00011111 = 31
    n |= n >>> 8;

    // n = (00011111 | 00000000) = 00011111 = 31
    n |= n >>> 16;

    // n = 00011111 = 31，MAXIMUM_CAPACITY：Integer的最大长度
    // (31 < 0) ? 1 : (31 >= Integer的最大长度) ? Integer的最大长度 : 31 + 1 ;
    // 即最终返回 32 = 2 的 (n=5)次方
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```
发现上面在进行`>>>`操作时会将`cap`变量的二进制值变为最高位后边全是1，即`00010001 -> 00011111`，所以这个算法就导致了任意传入一个数值，会将该数字变为它的2倍减1，因为任何尾数全为1的在加1都为2的倍数。
至于开头减1，是因为如果给定的n已经是2的次幂，但是不进行减1操作的话，那么得到的值就是大于给定值的最小2的次幂值，例如，传入4就会返回8。
这里面最大右移到16位，因为最大值是32个1，这是int类型存储变量的最大值，在往后就没意义了。

`HashMap`默认初始化容量为什么是16？
这个问题没有找到相关解释。我推断这应该就是个经验值，既然一定要设置一个默认的`2^n`作为初始值，那么就需要在效率和内存使用上做一个权衡。
这个值既不能太小，也不能太大，太小了就有可能频繁发生扩容，影响效率；太大了又浪费空间，不划算。所以16就作为一个经验值被采用了。

关于默认容量的定义，故意把16写成`1 << 4`这种形式，就是提醒开发者，这个地方要是2的次幂，与上面呼应。
```java
/**
 * The default initial capacity - MUST be a power of two.
 */
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
```

那么`HashMap`初始化容量设置多少合适？
当我们使用`HashMap(int initialCapacity)`来初始化容量的时候，`HashMap`并不会使用我们传进来的`initialCapacity`直接作为初始容量。
JDK会默认帮我们计算一个相对合理的值当做初始容量，所谓合理值，其实是找到第一个比用户传入的值大的2的幂。
如果创建`HashMap`初始化容量设置为7，那么`HashMap`通过计算会创建一个初始化为8的`HashMap`。当`HashMap`中的元素到`0.75 * 8 = 6`就会进行**扩容**，这明显是我们不希望看到的。
> 负载因子，表示HashMap满的程度，默认值为0.75f，也就是说默认情况下，当HashMap中元素个数达到了容量的3/4的时候就会进行自动扩容；

设置多少合适，可以参考JDK8中`putAll`方法中的实现：
```text
(int) ((float) expectedSize / 0.75F + 1.0F);
```
通过`expectedSize/0.75F+1.0F`计算，将初始化容量设置为7带入，得到`7/0.75+1=10`，10经过JDK处理之后，会被设置成16，这就大大的减少了扩容的几率。
当我们明确知道`HashMap`中元素的个数的时候，把默认容量设置成`expectedSize/0.75F+1.0F` 是一个在性能上相对好的选择，但同时也会牺牲些内存。

这个算法在`guava`中也有实现，开发的时候，可以直接通过`Maps`类创建一个`HashMap`：
```java
Map<String, String> map = Maps.newHashMapWithExpectedSize(7);
```
```java
public static <K, V> HashMap<K, V> newHashMapWithExpectedSize(int expectedSize) {
    return new HashMap(capacity(expectedSize));
}

static int capacity(int expectedSize) {
    if (expectedSize < 3) {
        CollectPreconditions.checkNonnegative(expectedSize, "expectedSize");
        return expectedSize + 1;
    } else {
        return expectedSize < 1073741824 ? (int)((float)expectedSize / 0.75F + 1.0F) : 2147483647;
    }
}
```

### HashMap扩容
随着`HashMap`中的元素增加，`Hash`碰撞导致获取元素方法的效率就会越来越低。为了保证获取元素方法的效率，所以针对`HashMap`中的数组进行扩容。
扩容数组的方式只能再去开辟一个新的数组，并把之前的元素转移到新数组上。

`HashMap`的容量是有上限的，必须小于`1<<30`，即`1073741824`。如果容量超出了这个数，则不再增长，且阈值会被设置为`Integer.MAX_VALUE`：
```text
// Java8
if (oldCap >= MAXIMUM_CAPACITY) {
    threshold = Integer.MAX_VALUE;
    return oldTab;
}
// Java7
if (oldCapacity == MAXIMUM_CAPACITY) { 
    threshold = Integer.MAX_VALUE;
    return;
}
```

在`HashMap`中有一个概念叫`loadFactor`，即负载因子，它表示`HashMap`满的程度，默认值为`0.75f`，也就是说默认情况下，当`HashMap`中元素个数达到了容量的3/4的时候就会进行自动扩容。
```java
 if (++size > threshold)
    resize();
```
为什么负载因子默认设置为0.75？
```java
/**
 * The load factor used when none specified in constructor.
 */
static final float DEFAULT_LOAD_FACTOR = 0.75f;
```
在[JDK的官方文档](https://docs.oracle.com/javase/6/docs/api/java/util/HashMap.html)中解释如下：
> As a general rule, the default load factor (.75) offers a good tradeoff between time and space costs.
Higher values decrease the space overhead but increase the lookup cost (reflected in most of the operations of the HashMap class, including get and put).
The expected number of entries in the map and its load factor should be taken into account when setting its initial capacity, so as to minimize the number of rehash operations.
If the initial capacity is greater than the maximum number of entries divided by the load factor, no rehash operations will ever occur.

文档大意：一般来说，默认的负载因子(0.75)在时间和空间成本之间提供了很好的权衡。
更高的值减少了空间开销，但增加了查找成本(反映在`HashMap`类的大多数操作中，包括`get`和`put`)。
在设置映射的初始容量时，应该考虑映射中预期的条目数及其负载因子，以便最小化重哈希操作的数量。如果初始容量大于最大条目数除以负载因子，则不会发生重新散列操作。

负载因子和`HashMap`中的扩容有关，当`HashMap`中的元素大于临界值（`threshold = loadFactor * capacity`）就会扩容。
所以负载因子的大小决定了什么时机扩容，扩容又影响到了hash碰撞的频率，所以设置一个合理的负载因子可以有效的避免`hash`碰撞。

设置为0.75的其他解释：
- 根据数学公式推算，这个值在`log(2)`的时候比较合理；
- 为了提升扩容效率，`HashMap`的容量有一个固定的要求，那就是一定是2的幂。如果负载因子是3/4的话，那么和容量的乘积结果就可以是一个整数；

#### 1.7扩容
扩容步骤：
1. 当插入新的键值对使得元素数量超过阈值时，`HashMap`会进行扩容；
   ```java
   void addEntry(int hash, K key, V value, int bucketIndex) {  
       //size：The number of key-value mappings contained in this map.  
       //threshold：The next size value at which to resize (capacity * load factor)  
       //数组扩容条件：1.已经存在的key-value mappings的个数大于等于阈值  
       //             2.底层数组的bucketIndex坐标处不等于null  
       if ((size >= threshold) && (null != table[bucketIndex])) {  
           resize(2 * table.length);//扩容之后，数组长度变了  
           hash = (null != key) ? hash(key) : 0;//为什么要再次计算一下hash值呢？  
           bucketIndex = indexFor(hash, table.length);//扩容之后，数组长度变了，在数组的下标跟数组长度有关，得重算。  
       }  
       createEntry(hash, key, value, bucketIndex);  
   } 
   ```
2. 创建一个新的数组，新的容量是原来的两倍，新阈值=新容量*负载因子；
   ```java
   void resize(int newCapacity) {   //传入新的容量
       Entry[] oldTable = table;    //引用扩容前的Entry数组
       int oldCapacity = oldTable.length;
       if (oldCapacity == MAXIMUM_CAPACITY) {  //扩容前的数组大小如果已经达到最大(2^30)了
           threshold = Integer.MAX_VALUE; //修改阈值为int的最大值(2^31-1)，这样以后就不会扩容了
           return;
       }
   
       Entry[] newTable = new Entry[newCapacity];  //初始化一个新的Entry数组
       transfer(newTable);                         //！！将数据转移到新的Entry数组里
       table = newTable;                           //HashMap的table属性引用新的Entry数组
       threshold = (int) (newCapacity * loadFactor);//修改阈值
   }
   ```
3. 将旧表中的所有元素重新计算哈希值，并放入新表中：通过`transfer`方法将旧数组上的元素转移到扩容后的新数组上。遍历旧表中的每个桶，对于每个桶中的每个节点，重新计算它们在新表中的索引位置，将节点放入新表的相应位置；
   ```java
   void transfer(Entry[] newTable) {
       Entry[] src = table;                   //src引用了旧的Entry数组
       int newCapacity = newTable.length;
       for (int j = 0; j < src.length; j++) { //遍历旧的Entry数组
           Entry<K, V> e = src[j];             //取得旧Entry数组的每个元素
           if (e != null) {
               src[j] = null;//释放旧Entry数组的对象引用（for循环后，旧的Entry数组不再引用任何对象）
               do {
                   Entry<K, V> next = e.next;
                   int i = indexFor(e.hash, newCapacity); //！！重新计算每个元素在数组中的位置
                   e.next = newTable[i]; //标记[1]
                   newTable[i] = e;      //将元素放在数组上
                   e = next;             //访问下一个Entry链上的元素
               } while (e != null);
           }
       }
   }
   ```
4. 将旧表引用指向新表；

#### 1.8扩容
Java1.8的`HashMap`扩容原理与1.7类似，但有一些重要改进。
在1.8时做了一些优化，文档注释写的很清楚："元素的位置要么是在原位置，要么是在原位置再移动**2次幂的位置**"。也就是对比1.7的迁移到新的数组上省去了重新计算`hash`值的时间。

这里的"2次幂的位置"是指长度为原来数组元素两倍的位置。
假设旧容量是16，那么其二进制表示是`10000`，扩容后的新容量是32，其二进制表示是`100000`。`HashMap`通过`h & (length - 1)`计算索引。
在扩容之前，容量为16，根据公式`hash & (oldCapacity - 1)`计算，因为`oldCapacity - 1`的二进制是`0000 1111`，那么计算索引时使用的是哈希值的低四位。
```
扩容之前的位置：
  0101 0101
& 0000 1111
————————————
  0000 0101
```
扩容后，新的索引还是通过`hash & (newCapacity - 1)`计算的，若容量为32，因为`newCapacity - 1`的二进制是`0001 1111`，那么计算索引时使用的是哈希值的低五位。
```
扩容之后的位置：
  0101 0101
& 0001 1111
————————————
  0001 0101
```
扩容后，新的索引位置只受到哈希值高位的影响，所以叫高位优化。
高位优化的关键在于，如果一个哈希值在旧容量下的索引是`index`，那么在新容量下，这个哈希值要么在`index`位置，要么在`index + oldCapacity`位置。
例如上面的例子，容量为16，扩容之前的位置为`0000 0101`即5，扩容之后的位置为`0001 0101`即21（16+5）。
通过这种高位优化技术，Java1.8中的`HashMap`在扩容时无需重新计算所有元素的哈希值，只需根据哈希值的高位来判断元素的新位置，所以提高了扩容的效率。
```java
 /**
     * Initializes or doubles table size.  If null, allocates in
     * accord with initial capacity target held in field threshold.
     * Otherwise, because we are using power-of-two expansion, the
     * elements from each bin must either stay at same index, or move
     * with a power of two offset in the new table.
     *
     * @return the table
     */
    final Node<K,V>[] resize() {
        Node<K,V>[] oldTab = table;
        int oldCap = (oldTab == null) ? 0 : oldTab.length;
        int oldThr = threshold;
        int newCap, newThr = 0;
        if (oldCap > 0) {
            if (oldCap >= MAXIMUM_CAPACITY) {
                threshold = Integer.MAX_VALUE;
                return oldTab;
            }
            else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                     oldCap >= DEFAULT_INITIAL_CAPACITY)
                newThr = oldThr << 1; // double threshold
        }
        else if (oldThr > 0) // initial capacity was placed in threshold
            newCap = oldThr;
        else {               // zero initial threshold signifies using defaults
            newCap = DEFAULT_INITIAL_CAPACITY;
            newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
        }
        if (newThr == 0) {
            float ft = (float)newCap * loadFactor;
            newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                      (int)ft : Integer.MAX_VALUE);
        }
        threshold = newThr;
        @SuppressWarnings({"rawtypes","unchecked"})
        Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
        table = newTab;
        if (oldTab != null) {
            for (int j = 0; j < oldCap; ++j) {
                Node<K,V> e;
                if ((e = oldTab[j]) != null) {
                    oldTab[j] = null;
                    if (e.next == null)
                       // 单个节点，直接移动到新表中的新位置
                        newTab[e.hash & (newCap - 1)] = e;
                    else if (e instanceof TreeNode)
                       // 红黑树节点，处理红黑树的拆分逻辑
                        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                    else { // preserve order
                       // 处理链表节点，使用高位优化技术重新分配节点
                        Node<K,V> loHead = null, loTail = null;
                        Node<K,V> hiHead = null, hiTail = null;
                        Node<K,V> next;
                        do {
                            next = e.next;
                           // 判断节点在新表中的位置，高位优化的关键
                            if ((e.hash & oldCap) == 0) {
                               // 保持在原位置（低位链表）
                                if (loTail == null)
                                    loHead = e;
                                else
                                    loTail.next = e;
                                loTail = e;
                            }else {
                               // 移动到新位置（高位链表）
                                if (hiTail == null)
                                    hiHead = e;
                                else
                                    hiTail.next = e;
                                hiTail = e;
                            }
                        } while ((e = next) != null);

                       // 将低位链表和高位链表分别放入新表中的相应位置
                        if (loTail != null) {
                            loTail.next = null;
                            newTab[j] = loHead;
                        }
                        if (hiTail != null) {
                            hiTail.next = null;
                            newTab[j + oldCap] = hiHead;
                        }
                    }
                }
            }
        }
        return newTab;
    }
```

### 线程安全
`HashMap`是线程不安全的集合类。因为`HashMap`中的方法大多没有同步，这意味着如果一个线程在遍历`HashMap`的同时，另一个线程修改了`HashMap`，例如添加或删除元素，可能会导致`ConcurrentModificationException`。
```java
public class MainTest {
    public static void main(String[] args) {
        HashMap<String,Object> map = new HashMap<>();
        for(int i=0; i< 10; i++) {
            new Thread(() -> {
                map.put(UUID.randomUUID().toString(),Thread.currentThread().getName());
                System.out.println(map);
            },String.valueOf(i)).start();
        }
    }
}
```
更严重的是，当多个线程中的`HashMap`同时扩容时，再使用`put`方法添加元素，如果`hash`值相同，可能出现同时在同一数组下用链表表示，造成闭环，导致在`get`时会出现死循环，CPU飙升到100%。

在大多数并发场景中，推荐使用`ConcurrentHashMap`，因为它设计用于高并发环境，并且在大多数情况下性能优于使用同步包装或手动同步的`HashMap`。
`ConcurrentHashMap`是Java中的一种线程安全的哈希表实现，用来替代传统的`HashMap`，来解决在多线程环境中并发修改带来的问题。
与`Hashtable`不同，`ConcurrentHashMap`不对整个表进行全局加锁。相反它只对具体操作涉及的部分进行加锁，减少了线程之间的竞争。
```java
public class ConcurrentHashMapExample {
    public static void main(String[] args) {
        ConcurrentHashMap<Integer, String> map = new ConcurrentHashMap<>();

        // 添加元素
        map.put(1, "One");
        map.put(2, "Two");

        // 读取元素
        System.out.println("Value for key 1: " + map.get(1));

        // 删除元素
        map.remove(2);

        // 迭代元素
        for (Integer key : map.keySet()) {
            System.out.println("Key: " + key + ", Value: " + map.get(key));
        }
    }
}
```


## 参考文章
- https://blog.csdn.net/u010841296/article/details/82832166
- https://blog.csdn.net/Elliot_Elliot/article/details/115610387
- https://blog.csdn.net/pange1991/article/details/82347284
- https://blog.csdn.net/xiewenfeng520/article/details/107119970
- https://zhuanlan.zhihu.com/p/114363420
- https://www.yuque.com/renyong-jmovm/kb/vso1h5
- https://juejin.cn/post/6844903554264596487
- http://hollischuang.gitee.io/tobetopjavaer/#/basics/java-basic/hashmap-init-capacity
