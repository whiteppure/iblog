---
title: "Java中常用线程安全的集合"
date: 2020-04-05
draft: false
tags: ["多线程", "Java", "集合","随笔"]
slug: "java-thread-collection"
---


## Java中常用线程安全的集合
在多线程环境中，数据的一致性和线程的安全性是至关重要的。传统的集合类，如`ArrayList`、`HashMap`和`HashSet`，在并发访问时并不安全，可能会导致数据不一致和其他并发问题。
为了在并发编程中高效且安全地操作数据，Java提供了一系列线程安全的集合类来替代这些传统集合。

| 线程不安全 | 线程安全替代                                                  |
| ---------- |---------------------------------------------------------|
| ArrayList  | CopyOnWriteArrayList                                    |
| HashSet    | CopyOnWriteArraySet         |
| HashMap    | HashTable、ConcurrentHashMap |

### CopyWriteArrayList
`CopyOnWriteArrayList`是Java中的一种线程安全的`List`实现，适用于读操作远多于写操作的场景，该集合在线程不安全的情况下可替代`ArrayList`。
```java
public class MainTest {
    public static void main(String[] args) {
        CopyOnWriteArrayList<String> arrayList = new CopyOnWriteArrayList<>();
        for(int i=0; i< 10; i++) {
            new Thread(() -> {
                arrayList.add(UUID.randomUUID().toString());
                System.out.println(arrayList);
            },String.valueOf(i)).start();
        }
    }
}
```

`CopyWriteArrayList`字面意思就是在写的时候复制，思想就是读写分离的思想。它的基本原理是每次修改操作都会创建该列表的一个新副本，因此读操作不需要加锁，可以并发执行。
以下是`CopyOnWriteArrayList`的`add()`方法源码：
```java
    /** The array, accessed only via getArray/setArray. */
    private transient volatile Object[] array;

    /** The lock protecting all mutators */
    final transient ReentrantLock lock = new ReentrantLock();

     /**
     * Gets the array.  Non-private so as to also be accessible
     * from CopyOnWriteArraySet class.
     */
    final Object[] getArray() {
        return array;
    }

    /**
     * Appends the specified element to the end of this list.
     *
     * @param e element to be appended to this list
     * @return {@code true}
     */
    public boolean add(E e) {
        final ReentrantLock lock = this.lock;
        lock.lock();
        try {
            Object[] elements = getArray();
            int len = elements.length;
            Object[] newElements = Arrays.copyOf(elements, len + 1);
            newElements[len] = e;
            setArray(newElements);
            return true;
        } finally {
            lock.unlock();
        }
    }
```
`CopyWriteArrayList`之所以线程安全的原因是在源码里面使用`ReentrantLock`保证了某个线程在写的时候不会被打断。
可以看到源码开始先是复制了一份数组，同一时刻只有一个线程写，其余的线程会读。在复制的数组上边进行写操作，写好以后在返回`true`。
这样就把读写进行了分离，写好以后因为`array`加了`volatile`修饰，所以该数组是对于其他的线程是可见的，就会读取到最新的值。

由于每次写操作都会创建一个数组的新副本，所以写操作的开销较大。但是读取操作非常高效且不需要加锁，因此适用于读操作远多于写操作的场景，例如缓存、白名单等。
不适合写操作频繁的场景，在这种情况下，`ConcurrentLinkedQueue`或`ConcurrentHashMap`等其他线程安全集合可能更合适。

### CopyOnWriteArraySet
`CopyOnWriteArraySet`是Java中一种线程安全的`Set`实现，内部使用了`CopyOnWriteArrayList`来存储元素。
```java
private final CopyOnWriteArrayList<E> al;
/**
 * Creates an empty set.
 */
public CopyOnWriteArraySet() {
    al = new CopyOnWriteArrayList<E>();
}
```
这种集合在读操作远多于写操作的场景中非常有用，因为它通过每次修改创建集合的副本来实现线程安全。
因为底层用`CopyOnWriteArrayList`存储，所以写操作开销大，每次修改都会创建数组副本，适用场景有限。不适用于写操作频繁的场景，否则会导致高昂的内存和时间开销。
与`CopyOnWriteArrayList`不同的是，`CopyOnWriteArraySet`不允许包含重复元素。如果尝试添加一个已经存在的元素，集合将保持不变，所以该集合在线程不安全的情况下可替代`HashSet`。
`CopyOnWriteArraySet`适用于需要唯一性且不关心元素顺序的场景，例如维护一组独特的订阅者或监听器。
```java
public class CopyOnWriteArraySetExample {
    public static void main(String[] args) {
        // 创建一个 CopyOnWriteArraySet
        Set<String> cowSet = new CopyOnWriteArraySet<>();

        // 添加元素
        cowSet.add("Apple");
        cowSet.add("Banana");
        cowSet.add("Apple"); // 不允许重复元素

        // 读取元素
        System.out.println("Set: " + cowSet);

        // 迭代元素
        for (String fruit : cowSet) {
            System.out.println(fruit);
        }

        // 添加新元素
        cowSet.add("Grapes");
        System.out.println("After adding Grapes: " + cowSet);

        // 删除元素
        cowSet.remove("Banana");
        System.out.println("After removing Banana: " + cowSet);
    }
}
```

### HashTable
`HashTable`的出现是为了解决`HashMap`线程不安全的问题，但因为性能的原因，在多线程环境下很少使用，一般都会使用`ConcurrentHashMap`。`HashTable`性能低的原因，就是直接加了`synchronized`修饰。

`HashMap`中的方法大多没有同步，这意味着如果一个线程在遍历`HashMap`的同时，另一个线程修改了`HashMap`，例如添加或删除元素，可能会导致`ConcurrentModificationException`。
当遍历`HashTable`中的元素时，此时另一个线程来修改数据，这个时候加锁是没问题的。但是在没有另一个线程该数据的时候，`HashTable`还是加锁，这时性能就不太好了。可理解为`HashTable`性能不好的原因就是锁的粒度太粗了。

`Hashtable`的线程安全通过在方法级别使用`synchronized`关键字来实现，这确保了每次只有一个线程能够执行任何给定的方法。这种方法级别的锁定提供了基本的线程安全，但在高并发环境下会导致性能瓶颈。
```java
public class HashtableExample {
    public static void main(String[] args) {
        // 创建一个 Hashtable
        Hashtable<Integer, String> hashtable = new Hashtable<>();

        // 添加元素
        hashtable.put(1, "One");
        hashtable.put(2, "Two");
        hashtable.put(3, "Three");

        // 读取元素
        System.out.println("Value for key 1: " + hashtable.get(1));
        System.out.println("Value for key 2: " + hashtable.get(2));

        // 删除元素
        hashtable.remove(2);

        // 迭代元素
        for (Integer key : hashtable.keySet()) {
            System.out.println("Key: " + key + ", Value: " + hashtable.get(key));
        }
    }
}
```

### ConcurrentHashMap
`ConcurrentHashMap`是Java中的一种线程安全的哈希表实现，用来替代传统的`HashMap`，来解决在多线程环境中并发修改带来的问题。
与`Hashtable`不同，`ConcurrentHashMap`不对整个表进行全局加锁。相反它只对具体操作涉及的部分进行加锁，减少了线程之间的竞争。
因为`HashMap`在JDK1.7与JDK1.8做了调整，所以`ConcurrentHashMap`在JDK1.7与JDK1.8实现也有所不同。

#### JDK1.7
JDK1.7`ConcurrentHashMap`采用`segment`的分段锁机制实现线程安全，其中`segment`类继承自`ReentrantLock`。用`ReentrantLock`、CAS来保证线程安全。
每个分段相当于一个独立的哈希表，并且分别加锁。

需要注意的是JDK1.7中的ConcurrentHashMap，分段数量是固定。在创建`ConcurrentHashMap`实例时，必须指定初始的分段数量。
这个初始的分段数量在实例创建后是不可动态修改的，也就是说一旦创建了`ConcurrentHashMap`，其分段数量就固定不变了。数组的长度就是`concurrencyLevel`指定的分段数量。
```java
public ConcurrentHashMap(int initialCapacity, float loadFactor, int concurrencyLevel){}
```
相比之下，JDK1.8中的`ConcurrentHashMap`改进了这一点，不再使用固定的分段数量，而是根据当前的容量动态调整分段的数量，从而更好地适应不同的并发场景，提升了并发性能和灵活性。

![jdk1.7ConcurrentHashMap](/posts/annex/images/essays/jdk1.7ConcurrentHashMap.png)

整个`ConcurrentHashMap`被划分为多个分段，每个分段都是一个独立的哈希表。每个分段独立加锁，细化了锁的粒度，同时允许多个线程同时操作不同的分段，从而提高并发性能。
使用`ReentrantLock`锁定分段，在执行插入、删除或更新操作时，只有操作涉及的分段会被锁定，其他分段不受影响。
在进行插入操作时，先根据键的哈希值确定应该操作哪个分段，然后锁定该分段并进行操作。这种方法可以减少锁争用，提高并发性能。
```text
public V put(K key， V value) {
    Segment<K,V> s;
    if (value == null)
        throw new NullPointerException();
    int hash = hash(key.hashCode());
    int j = (hash >>> segmentShift) & segmentMask;
    if ((s = (Segment<K,V>)UNSAFE.getObject          // nonvolatile; recheck
         (segments, (j << SSHIFT) + SBASE)) == null) //  in ensureSegment
        s = ensureSegment(j);
    return s.put(key, hash, value, false);
}
```
首先判空，然后计算哈希值。计算`put`进来的元素分配到哪个`segment`数组上，判断当前`segments`数组上的元素是否为空，如果分段为空就会使用`ensureSegment`方法创建`segment`对象；
最后调用`Segment.put`方法存放到对应的节点中。

```java
/**
 * Returns the segment for the given index, creating it and
 * recording in segment table (via CAS) if not already present.
 *
 * @param k the index
 * @return the segment
 */
private Segment<K,V> ensureSegment(int k) {
        final Segment<K,V>[] ss = this.segments;
        long u = (k << SSHIFT) + SBASE; // raw offset
        Segment<K,V> seg;
        if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u)) == null) {
            Segment<K,V> proto = ss[0]; // use segment 0 as prototype
            int cap = proto.table.length;
            float lf = proto.loadFactor;
            int threshold = (int)(cap * lf);
            HashEntry<K,V>[] tab = (HashEntry<K,V>[])new HashEntry[cap];
            if ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u))
                == null) { // recheck
                Segment<K,V> s = new Segment<K,V>(lf, threshold, tab);
                while ((seg = (Segment<K,V>)UNSAFE.getObjectVolatile(ss, u))
                       == null) {
                    if (UNSAFE.compareAndSwapObject(ss, u, null, seg = s))
                        break;
                }
            }
        }
        return seg;
    }
```
`ensureSegment`方法作用是返回指定索引的分段对象，通过CAS判断，如果还没有分段则创建它并记录在分段表中。

当多个线程同时执行该方法，同时通过`ensureSegment`方法创建`segment`对象时，只有一个线程能够创建成功。
其中创建的新`segment`对象中的加载因子、存放位置、扩容阈值与`segment[0]`元素保持一致，这样性能更高，因为不用在计算了。

为了保证线程安全，在`ensureSegment`方法中用`Unsafe`类中的一些方法做了三次判断，其中最后一次也就是该方法保证线程安全的关键，用到了CAS操作。确保只有一个线程能够成功创建分段。
当多个线程并发执行下面的代码，先执行CAS的线程，判断`segment`数组中某个位置是空的，然后就把这个线程自己创建的`segment`数组赋值给`seg`，即`seg = s`然后`break`跳出循环。
后执行的线程会再次判断seg是否为空，因先执行的线程已经`seg = s`不为空了，所以循环条件不成立，也就不再执行了。
```text
while ((seg = (Segment<K，V>)UNSAFE.getObjectVolatile(ss, u)) == null) {
    if (UNSAFE.compareAndSwapObject(ss, u, null, seg = s))
        break;
}
```

`Segment.put`为了保证线程安全，执行`put`方法时需要加锁，如果未能获取锁，会执行`scanAndLockForPut`方法，确保最终能获取到锁。
```
final V put(K key, int hash, V value, boolean onlyIfAbsent) {
    HashEntry<K,V> node = tryLock() ? null :
        scanAndLockForPut(key, hash, value);
    // ... 插入节点操作 最后释放锁
}
```
`scanAndLockForPut`方法的主要作用就是加锁，如果没有获取锁，就会一致遍历`segment`数组，直到遍历到最后一个元素。
每次遍历完都会尝试获取锁，如果还是获取不到锁，就会重试，最大次数为`MAX_SCAN_RETRIES`在CPU多核下为64次，如果大于64次就会强制加锁。
```java
private HashEntry<K,V> scanAndLockForPut(K key, int hash, V value) {
    HashEntry<K,V> first = entryForHash(this, hash);
    HashEntry<K,V> e = first;
    HashEntry<K,V> node = null;
    int retries = -1; // negative while locating node
    while (!tryLock()) {
        HashEntry<K,V> f; // to recheck first below
        if (retries < 0) {
            if (e == null) {
                if (node == null) // speculatively create node
                    node = new HashEntry<K,V>(hash, key, value, null);
                retries = 0;
            }
            else if (key.equals(e.key))
                retries = 0;
            else
                e = e.next;
        }
        else if (++retries > MAX_SCAN_RETRIES) {
            lock();
            break;
        }
        else if ((retries & 1) == 0 &&
                 (f = entryForHash(this, hash)) != first) {
            e = first = f; // re-traverse if entry changed
            retries = -1;
        }
    }
    return node;
}

static final int MAX_SCAN_RETRIES =
            Runtime.getRuntime().availableProcessors() > 1 ? 64 : 1;
```

#### JDK1.8
在JDK1.8中，`ConcurrentHashMap`进行了重大改进，弃用了分段锁机制，转而采用更细粒度的并发控制机制。
直接用Node数组+链表/红黑树的数据结构来实现，并发控制使用 `synchronized` 和CAS来操作，整体看起来就像是优化过且线程安全的`HashMap`。
虽然在JDK1.8中还能看到`Segment`的数据结构，但是已经简化了其属性，这样做只是为了兼容旧版本。

JDK1.8中彻底放弃了`Segment`转而采用的是`Node`，其设计思想也不再是JDK1.7中的分段锁思想。
`ConcurrentHashMap`在JDK1.8中不再使用分段锁，而是使用与`HashMap`类似的数组+链表/红黑树的数据结构。
数组中的每个桶是一个链表或红黑树的头节点。`HashMap`不同的是`ConcurrentHashMap`只是增加了同步操作来控制并发。

![jdk1.8ConcurrentHashMap](/posts/annex/images/essays/jdk1.8ConcurrentHashMap.png)

插入操作首先根据键的哈希值定位到具体的桶。如果该桶为空，则使用CAS操作插入新的节点。如果该桶非空，则使用`synchronized`锁定该桶，并进行链表或红黑树的插入操作。
```text
final V putVal(K key, V value, boolean onlyIfAbsent) {
    if (key == null || value == null)
        throw new NullPointerException();
    
    // 计算键的哈希值，并将其扩散
    int hash = spread(key.hashCode());
    
    // 记录桶中元素个数
    int binCount = 0;
    
    // 循环查找或插入元素
    for (Node<K,V>[] tab = table;;) {
        Node<K,V> f;
        int n, i, fh;
        
        // 如果表为空或长度为0，则进行初始化
        if (tab == null || (n = tab.length) == 0)
            tab = initTable();
        
        // 计算存储位置
        else if ((f = tabAt(tab, i = (n - 1) & hash)) == null) {
            // 如果位置为空，则尝试使用 CAS 插入新节点
            if (casTabAt(tab, i, null, new Node<K,V>(hash, key, value, null)))
                break;  // 插入成功，退出循环
        }
        
        // 如果位置非空，处理链表或红黑树结构
        else if ((fh = f.hash) == MOVED)
            tab = helpTransfer(tab, f); // 如果处于扩容状态，则帮助进行扩容
        
        else {
            V oldVal = null;
            
            // 使用 synchronized 锁定桶
            synchronized (f) {
                if (tabAt(tab, i) == f) {
                    if (fh >= 0) {
                        // 处理链表结构
                        binCount = 1;
                        for (Node<K,V> e = f;; ++binCount) {
                            K ek;
                            if (e.hash == hash &&
                                ((ek = e.key) == key ||
                                 (ek != null && key.equals(ek)))) {
                                oldVal = e.val;
                                if (!onlyIfAbsent)
                                    e.val = value;
                                break;
                            }
                            Node<K,V> pred = e;
                            if ((e = e.next) == null) {
                                pred.next = new Node<K,V>(hash, key, value, null);
                                break;
                            }
                        }
                    } else if (f instanceof TreeBin) {
                        // 处理红黑树结构
                        Node<K,V> p;
                        binCount = 2;
                        if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key, value)) != null) {
                            oldVal = p.val;
                            if (!onlyIfAbsent)
                                p.val = value;
                        }
                    }
                }
            }
            
            // 根据操作结果进行进一步处理
            if (binCount != 0) {
                if (binCount >= TREEIFY_THRESHOLD)  // 如果链表长度达到阈值，则转为红黑树
                    treeifyBin(tab, i);
                if (oldVal != null)
                    return oldVal;  // 返回旧值
                break;  // 插入完成，退出循环
            }
        }
    }
    
    // 更新计数器
    addCount(1L, binCount);
    return null;
}
```
如果`table`为空或长度为0，则调用`initTable()`方法进行初始化。
```text
private final Node<K,V>[] initTable() {
    Node<K,V>[] tab; int sc;
    while ((tab = table) == null || tab.length == 0) {
        if ((sc = sizeCtl) < 0)
            Thread.yield(); // lost initialization race; just spin
        else if (U.compareAndSwapInt(this, SIZECTL, sc, -1)) {
            try {
                if ((tab = table) == null || tab.length == 0) {
                    int n = (sc > 0) ? sc : DEFAULT_CAPACITY;
                    @SuppressWarnings("unchecked")
                    Node<K,V>[] nt = (Node<K,V>[])new Node<?,?>[n];
                    table = tab = nt;
                    sc = n - (n >>> 2);
                }
            } finally {
                sizeCtl = sc;
            }
            break;
        }
    }
    return tab;
}
```
根据键的哈希值`hash`计算存储在`table`中的位置。如果该位置为空，则使用`casTabAt()`方法尝试通过CAS操作插入新的`Node`节点。
```text
int hash = spread(key.hashCode());

// hash算法，计算存放在map中的位置；要保证尽可能的均匀分散，避免hash冲突
static final int HASH_BITS = 0x7fffffff;
static final int spread(int h) {
    // 等同于： key.hashCode() ^ (key.hashCode() >>> 16) & 0x7fffffff
    return (h ^ (h >>> 16)) & HASH_BITS;
}
```
如果位置非空，首先判断是否处于扩容状态`MOVED`，如果是，则调用`helpTransfer()`方法协助进行扩容操作。
```text
// MOVED = -1
if ((fh = f.hash) == MOVED)
tab = helpTransfer(tab, f);
```
如果位置上是链表结构`(fh >= 0)`，则遍历链表，根据键查找或插入节点。如果位置上是红黑树结构`(f instanceof TreeBin)`，则调用`putTreeVal()`方法在红黑树中插入节点。
然后使用`synchronized (f)`锁定桶，确保在链表或红黑树操作期间其他线程不能修改桶的结构。根据链表长度`binCount >= TREEIFY_THRESHOLD(默认是8)`，则把链表转化为红黑树结构的情况，如果插入操作修改了已有节点的值，则返回旧值。
```text
V oldVal = null;
synchronized (f) {
    if (tabAt(tab, i) == f) {
        if (fh >= 0) {
            binCount = 1;
            for (Node<K,V> e = f;; ++binCount) {
                K ek;
                if (e.hash == hash &&
                    ((ek = e.key) == key ||
                     (ek != null && key.equals(ek)))) {
                    oldVal = e.val;
                    if (!onlyIfAbsent)
                        e.val = value;
                    break;
                }
                Node<K,V> pred = e;
                if ((e = e.next) == null) {
                    pred.next = new Node<K,V>(hash, key,
                                              value, null);
                    break;
                }
            }
        }
        else if (f instanceof TreeBin) {
            Node<K,V> p;
            binCount = 2;
            if ((p = ((TreeBin<K,V>)f).putTreeVal(hash, key,
                                           value)) != null) {
                oldVal = p.val;
                if (!onlyIfAbsent)
                    p.val = value;
            }
        }
    }
}
if (binCount != 0) {
    if (binCount >= TREEIFY_THRESHOLD)
        treeifyBin(tab, i);
    if (oldVal != null)
        return oldVal;
    break;
}
```
最后调用`addCount()`方法更新元素计数器，表示成功插入了一个节点。
```text
// 相当于size++
addCount(1L, binCount);
```
其中`addCount()`方法中也包含了扩容操作。
```java
private final void addCount(long x, int check) {
    CounterCell[] as; long b, s;
    if ((as = counterCells) != null ||
        !U.compareAndSwapLong(this, BASECOUNT, b = baseCount, s = b + x)) {
        CounterCell a; long v; int m;
        boolean uncontended = true;
        if (as == null || (m = as.length - 1) < 0 ||
            (a = as[ThreadLocalRandom.getProbe() & m]) == null ||
            !(uncontended =
              U.compareAndSwapLong(a, CELLVALUE, v = a.value, v + x))) {
            fullAddCount(x, uncontended);
            return;
        }
        if (check <= 1)
            return;
        s = sumCount();
    }
    if (check >= 0) {
        Node<K,V>[] tab, nt; int n, sc;
        while (s >= (long)(sc = sizeCtl) && (tab = table) != null &&
               (n = tab.length) < MAXIMUM_CAPACITY) {
            int rs = resizeStamp(n);
            if (sc < 0) {
                if ((sc >>> RESIZE_STAMP_SHIFT) != rs || sc == rs + 1 ||
                    sc == rs + MAX_RESIZERS || (nt = nextTable) == null ||
                    transferIndex <= 0)
                    break;
                if (U.compareAndSwapInt(this, SIZECTL, sc, sc + 1))
                    transfer(tab, nt);
            }
            else if (U.compareAndSwapInt(this, SIZECTL, sc,
                                         (rs << RESIZE_STAMP_SHIFT) + 2))
                transfer(tab, null);
            s = sumCount();
        }
    }
}
```
节点从`table`移动到`nextTable`，大体思想是遍历、复制的过程。
通过`Unsafe.compareAndSwapInt`修改`sizeCtl`值，保证只有一个线程能够初始化`nextTable`，扩容后的数组长度为原来的两倍，但是容量是原来的1.5。
