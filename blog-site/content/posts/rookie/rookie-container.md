---
title: "Java集合"
date: 2021-10-04
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-java-container"
weight: 40
---

## 概述
Java中的集合主要包括 `Collection` 和 `Map` 两种，`Collection` 存储着对象的集合，而 `Map` 存储着键值对（两个对象）的映射表。

![Java中的集合-01](/iblog/posts/images/essays/Java中的集合-01.jpg)

如果你看过ArrayList类源码，就知道ArrayList底层是通过数组来存储元素的，所以如果严格来说，数组也算集合的一种。

## 数组
Java中提供的数组是用来存储固定大小的同类型元素，所以Java数组就是同类数据元素的集合。

数组是引用数据类型，如果使用了没有开辟空间的数组，则一定会出现`NullPointerException`异常信息。所以数组本质上也是Java对象，能够向下或者向上转型,能使用`instanceof`关键字。
```
// 数组的父类也是Object,可以将a向上转型到Object  
int[] a = new int[8];  
Object obj = a ; 

// 可以进行向下转型 
int[] b = (int[])obj;  

// 可以用instanceof关键字进行类型判定 
if(obj instanceof int[]){ 
}
```

> `void  method_name(int ... value)`方法中变参就是当数组处理的，参数为定参的编译后就是数组。一个方法只能有一个变参，即使是不同的类型也不行，变参参数只能在形参列表的末尾，如果传入的是数组，则只能传一个。

### 优缺点
数组优点:
- 数组元素的内存地址是连续分配的，所以通过下标访问元素的效率很高，可以快速找到指定下标为n的元素的地址；

数组缺点:
- 数组一旦初始化之后长度是固定的不能变的；
- 数组进行元素的删除和插入操作的时候，效率比较低,需要移动大量的元素；
- 数组元素的类型只能是一种；
- 数组元素的内存地址是连续分配的,对内存要求高一些;相对于链表结构比较,链表的内存是连续不连续都可以；

数组的优点是效率高，但为此，所付出的代价就是数组对象的大小被固定。这也使得在工作中，数组并不实用。所以我们应该优选容器，而不是数组。只有在已证明性能成为问题的时候，并且确定切换到数组对性能提高有帮助时，才应该将项目重构为使用数组。

### 操作数组
由于数组没有提供任何的封装，所有对元素的操作，都是通过自定义的方法实现的，对数组元素的操作比较麻烦，好在Java自带了一些API供开发者调用。

#### 定义数组
```
 int[] array1 = { 1,2,3,4,5 }; 
 int[] array2 = new int[10];
 int[] array3 = new int[]{ 1,2,3,4,5 };
```
需要注意的是[],写在数组名称的前后都可以,但是推荐第一种写法：
```
  int[] array1 = { 1,2,3,4,5 };
  int array2[] = { 1,2,3,4,5 };
```

#### 遍历数组
````
 for (int i = 0; i < array1.length; i++) {
       System.out.println(array1[i]);
 }
````

#### 数组去重
````
// 最简单方法，利用 hashSet 集合去重
Set<Integer> set2 = new HashSet<Integer>();
for (int i = 0; i < arr11.length; i++) {
    set2.add(arr11[i]);
}
````

#### 数组与集合转换
```
// 数组转成set集合
Set<String> set = new HashSet<String>(Arrays.asList(array2));

// 数组转list 
List<String > list2 = Arrays.asList(array);
```

#### 数组排序
```
 // 原生方法 或 8种排序算法
 Arrays.sort(arr);
```

#### 复制数组
```
// 待复制的数组
int[] arr = {1, 2, 3, 4};

// 指定新数组的长度
int[] arr2 = Arrays.copyOf(arr, 10);

// 只复制从索引[1]到索引[3]之间的元素（不包括索引[3]的元素）
int[] arr3 = Arrays.copyOfRange(arr, 1, 3);
```
## ArrayList
在List接口实现类中，最常用的就是ArrayList,ArrayList 类是一个可以动态修改的数组，与普通数组的区别就是它是没有固定大小的限制，可以添加或删除元素。

ArrayList 继承了 AbstractList ，并实现了 List、RandomAccess, Cloneable 接口：
```
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess,Cloneable,Serializable
```

### RandomAccess
Random是随机的意思，Access是访问的意思，合起来就是随机访问的意思。

RandomAccess接口是一个标记接口，用来标记实现的List集合具备快速随机访问的能力。所有的List实现都支持随机访问的，只是基于基本结构的不同，实现的速度不同罢了。

当一个List拥有快速访问功能时，其遍历方法采用随机访问速度最快，而没有快速随机访问的List采用顺序访问的速度最快。如果集合中的数据量过大需要遍历时，此时需要格外注意，因为不同的遍历方式会影响很大，可以使用`instanceof`关键字来判断该类有没有RandomAccess标记:
```
// 假设 list 数据量非常大,推荐写法
List<Object> list = ...;

if(list instanceof RandomAccess){
    // 随机访问
    for (int i = 0;i< list.size();i++) {
        System.out.println(list.get(i));
    }
}else {
    // 顺序访问
    for(Object obj: list) {
        System.out.println(obj);
    }
}
```
在List中ArrayList被RandomAccess接口标记，而LinkedList没有被RandomAccess接口标记，所以ArrayList适合随机访问，LinkedList适合顺序访问。

### Cloneable
Cloneable接口是Java开发中常用的一个接口之一,它是一个标记接口。

如果一个想要拷贝一个对象，就需要重写Object中的clone方法并让其实现Cloneable接口，如果只重写clone方法，不实现Cloneable接口就会报CloneNotSupportedException异常。

JDK中clone方法源码：
```
protected native Object clone() throws CloneNotSupportedException;
```
应当注意的是，`clone()` 方法并不是 `Cloneable` 接口的方法，而是 `Object` 的一个 `protected` 方法。`Cloneable` 接口只是规定，如果一个类没有实现 `Cloneable` 接口又调用了 `clone()` 方法，就会抛出 `CloneNotSupportedException`。

换言之，clone方法规定了想要拷贝对象，就需要实现Cloneable方法，clone方法让Cloneable接口变得有意义。

#### 浅拷贝与深拷贝
- 浅拷贝：被复制对象的所有值属性都含有与原来对象的相同，而所有的对象引用属性仍然指向原来的对象。
- 深拷贝：在浅拷贝的基础上，所有引用其他对象的变量也进行了`clone`，并指向被复制过的新对象。

如果一个被复制的属性都是基本类型，那么只需要实现当前类的`cloneable`机制就可以了，此为浅拷贝。

如果被复制对象的属性包含其他实体类对象引用，那么这些实体类对象都需要实现`cloneable`接口并覆盖`clone()`方法。

**浅拷贝：**
```
public class ShallowCloneExample implements Cloneable {

    private int[] arr;

    public ShallowCloneExample() {
        arr = new int[10];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
    }

    public void set(int index, int value) {
        arr[index] = value;
    }

    public int get(int index) {
        return arr[index];
    }

    @Override
    protected ShallowCloneExample clone() throws CloneNotSupportedException {
        return (ShallowCloneExample) super.clone();
    }
}

```

```
ShallowCloneExample e1 = new ShallowCloneExample();
ShallowCloneExample e2 = null;
try {
    e2 = e1.clone();
} catch (CloneNotSupportedException e) {
    e.printStackTrace();
}
e1.set(2, 222);
System.out.println(e2.get(2)); // 222
```

**深拷贝：**
```
public class DeepCloneExample implements Cloneable {

    private int[] arr;

    public DeepCloneExample() {
        arr = new int[10];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
    }

    public void set(int index, int value) {
        arr[index] = value;
    }

    public int get(int index) {
        return arr[index];
    }

    @Override
    protected DeepCloneExample clone() throws CloneNotSupportedException {
        DeepCloneExample result = (DeepCloneExample) super.clone();
        result.arr = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            result.arr[i] = arr[i];
        }
        return result;
    }
}

```

```
DeepCloneExample e1 = new DeepCloneExample();
DeepCloneExample e2 = null;
try {
    e2 = e1.clone();
} catch (CloneNotSupportedException e) {
    e.printStackTrace();
}
e1.set(2, 222);
System.out.println(e2.get(2)); // 2
```
#### ArrayList中clone方法
clone方法调用栈：
```
clone 
    -> Object.clone
    -> Arrays.copyOf(T[] original, int newLength)
    -> Arrays.copyOf(U[] original, int newLength, Class<? extends T[]> newType)
```

文档注释大意：返回这个ArrayList实例的浅拷贝(元素本身不会被复制)。
```
public class ArrayList implements Cloneable {

    transient Object[] elementData;     

    /**
     * Returns a shallow copy of this <tt>ArrayList</tt> instance.  (The
     * elements themselves are not copied.)
     *
     * @return a clone of this <tt>ArrayList</tt> instance
     */
    public Object clone() {
        try {
            // 调用Object类的clone方法
            ArrayList<?> v = (ArrayList<?>) super.clone();
            
            // 将集合中的元素进行拷贝
            v.elementData = Arrays.copyOf(elementData, size);
            v.modCount = 0;
            return v;
        } catch (CloneNotSupportedException e) {
            // this shouldn't happen, since we are Cloneable
            throw new InternalError(e);
        }
    }
}
```

```
public class Arrays{
   public static <T> T[] copyOf(T[] original, int newLength) {
        return (T[]) copyOf(original, newLength, original.getClass());
    }
    
    public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType) {
        @SuppressWarnings("unchecked")
        T[] copy = ((Object)newType == (Object)Object[].class)
            ? (T[]) new Object[newLength]
            : (T[]) Array.newInstance(newType.getComponentType(), newLength);
        System.arraycopy(original, 0, copy, 0, Math.min(original.length, newLength));
        return copy;
    }
}
```
ArrayList中clone方法底层是调用父类的clone方法，父类没有重写clone方法所以调用的是Object类的clone方法。

在ArrayList中核心方法最终调用`Arrays.copyOf`方法,不论怎样都会创建一个Object数组。
> `Arrays.newInstance(Class<?> componentType,int length)`方法作用，创建具有指定组件类型和长度的新数组。

最终使用`System.arraycopy`方法将之前的旧数组中的元素拷贝到新创建的数组中，然后赋值给`ArrayList.elementData`对象并返回。

### ArrayList扩容
因为ArrayList底层使用数组保存数据的，而数组一旦被创建就不能改变大小，但是ArrayList的长度是可以改变的，所以可以通过ArrayList类中的add方法找到数组扩容方法。

add方法调用栈：
```
add 
    -> ensureCapacityInternal()
    -> calculateCapacity()
    -> ensureExplicitCapacity()
    -> grow()
```
```
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
```
ArrayList容量：如果没有指定容量创建数组，默认会创建一个长度为10的数组用来保存元素，之后通过：
```
 int newCapacity = oldCapacity + (oldCapacity >> 1);
```
每次扩容都是原容量的1.5倍。
> `>>`,右移几位就是相当于除以2的几次幂
  `<<`,左移几位就是相当于乘以2的几次幂

最后通过Arrays.copyOf方法将之前的数组中元素，全部移到新创建的数组上。

由于频繁的扩容数组会对性能产生影响，如果在ArrayList中要存储很大的数据，就需要在ArrayList的有参构造中指定数组的长度：
```
List<String> list = new ArrayList(1000000);
```
需要注意的是创建指定长度的ArrayList，在没有add之前ArrayList中的数组已经初始化了，但是List的大小没变，因为List的大小是由size决定的。

### ArrayList与LinkedList
ArrayList与LinkedList性能比较是一道经典的面试题，ArrayList查找快，增删慢；而LinkedList增删快，查找慢。

造成这种原因是因为底层的数据结构不一样，ArrayList底层是数组，而数组的中的元素内存分配都是连续的，并且数组中的元素只能存放一种，这就造成了数组中的元素地址是有规律的，数组中查找元素快速的原因正是利用了这一特点。
> 查询方式为: 首地址＋（元素长度＊下标）
> 例如：new int arr[5]; arr数组的地址假设为0x1000，arr[0] ~ arr[5] 地址可看作为 0x1000 + i * 4。

而LinkedList在Java中的底层结构是对象，每一个对象结点中都保存了下一个结点的位置形成的链表结构，由于LinkedList元素的地址是不连续的，所以没办法按照数组那样去查找，所以就比较慢。

由于数组一旦分配了大小就不能改变，所以ArrayList在进行添加操作时会创建新的数组，如果要添加到ArrayList中的指定的位置，是通过System.arraycopy方法将数组进行复制，新的数组会将待插入的指定位置空余出来，最后在将元素添加到集合中。

在进行删除操作时是通过System.arraycopy方法，将待删除元素后面剩余元素复制到待删除元素的位置。当ArrayList里有大量数据时，这时候去频繁插入或删除元素会触发底层数组频繁拷贝，效率不高，还会造成内存空间的浪费。

LinkedList在进行添加，删除操作时，会用二分查找法找到将要添加或删除的元素，之后再设置对象的下一个结点来进行添加或删除操作。
> 二分查找法：也称为折半查找法，是一种适用于大量数据查找的方法，但是要求数据必须的排好序的，每次以中间的值进行比较，根据比较的结果可以直接舍去一半的值，直至全部找完（可能会找不到）或者找到数据为止。
> 
> 此处LinkedList会比较查找的元素是距离头结点比较近，还是尾结点比较近，距离哪边较近则从哪边开始查找。

ArrayList，获取元素效率非常的高，时间复杂度是O(1)，而查找，插入和删除元素效率似乎不太高，时间复杂度为O(n)。

LinkedList，正与ArrayList相反，获取第几个元素依次遍历复杂度O(n)，添加到末尾复杂度O(1)，**添加到指定位置复杂度O(n)**，删除元素，直接指针指向操作复杂度O(1)。

**注意，ArrayList的增删不一定比LinkedList效率低，但是ArrayList查找效率一定比LinkedList高，如果在List靠近末尾的地方插入，那么ArrayList只需要移动较少的数据，而LinkedList则需要一直查找到列表尾部，反而耗费较多时间，这时ArrayList就比LinkedList要快。**

使用场景：
- 如果应用程序对数据有较多的随机访问，ArrayList要优于LinkedList；
- 如果应用程序有更多的插入或者删除操作，较少的随机访问，LinkedList要优于ArrayList；

### 线程安全问题
众所周知，ArrayList是线程不安全的：
```
public class MainTest {
    // 如果没有报错，需要多试几次
    public static void main(String[] args) {
        ArrayList<String> arrayList = new ArrayList<>();
        for(int i=0; i< 10; i++) {
            new Thread(() -> {
                arrayList.add(UUID.randomUUID().toString());
                System.out.println(arrayList);
            },String.valueOf(i)).start();
        }
    }
}
```
为避免偶然事件，请重复多试几次上面的代码,很大情况会出现`ConcurrentModificationException`"同步修改异常"：
```
java.util.ConcurrentModificationException
```
出现该异常的原因是，当某个线程正在执行 `add()`方法时,被某个线程打断,添加到一半被打断,没有被添加完。

保证ArrayList线程安全有以下几种方法：
- 可以使用 `Vector` 来代替 `ArrayList`,`Vector` 是线程安全的 `ArrayList`,但是由于底层是加了`synchronized`,性能略差不推荐使用;
    ```
    List list = new Vector();
    list.add(UUID.randomUUID().toString());
    ```
- 使用`Collections.synchronizedArrayList()` 来创建 `ArrayList`；使用 `Collections` 工具类来创建 `ArrayList` 的思路是,在 `ArrayList` 的外边套了一个`synchronized`外壳,来使 `ArrayList` 线程安全;
    ```
    List list = Collections.synchronizedArrayList();
    list.add(UUID.randomUUID().toString());
    ```
- 使用`CopyOnWriteArrayList()`来保证 `ArrayList` 线程安全；`CopyWriteArrayList`字面意思就是在写的时候复制,主要思想就是读写分离的思想。`CopyWriteArrayList`之所以线程安全的原因是在源码里面使用`ReentrantLock`，所以保证了某个线程在写的时候不会被打断；
    ```
    CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
    list.add(UUID.randomUUID().toString());
    ```
## Set
- TreeSet：基于红黑树实现，支持有序性操作，例如根据一个范围查找元素的操作。但是查找效率不如 HashSet，HashSet 查找的时间复杂度为 O(1)，TreeSet 则为 O(logN)；
- HashSet：基于哈希表实现，支持快速查找，但不支持有序性操作。并且失去了元素的插入顺序信息，也就是说使用 Iterator 遍历 HashSet 得到的结果是不确定的。HashSet的value作为hashmap的key，来保证不重复；
- LinkedHashSet：具有 HashSet 的查找效率，且内部使用双向链表维护元素的插入顺序；

## Queue
队列是一种经常使用的集合。Queue实际上是实现了一个先进先出（FIFO：First In First Out）的有序列表。它和List的区别在于，List可以在任意位置添加和删除元素，而Queue只有两个操作：
- 把元素添加到队列末尾；
- 从队列头部取出元素；

常见实现：
- LinkedList：可以用它来实现双向队列；
- PriorityQueue：基于堆结构实现，可以用它来实现优先队列；

Queue实现通常不允许插入null元素，尽管一些实现，如LinkedList，不禁止插入null元素。即使在允许它的实现中，null也不应插入Queue中，因为poll方法也使用null作为特殊返回值，用来表示队列不包含任何元素。
> poll(): 检索并删除此队列的头部，如果此队列为空，则返回null
> peek(): 检索但不删除此队列的头部，如果此队列为空，则返回null

## HashMap
- HashMap 是一个散列表，它存储的内容是键值对(key-value)映射；
- HashMap 实现了 Map 接口，根据键的 HashCode 值存储数据，具有很快的访问速度，最多允许一条记录的键为 null，不支持线程同步；
- HashMap 是无序的，即不会记录插入的顺序；

相关操作：
- 存贮: 通过key的hashcode方法找到在hashMap 存贮的位置,如果该位置有元素,则通过equals方法进行比较,equals返回值为true,则覆盖value,equals返回值为false则,在该数组元素的头部追加该元素,形成一个链表结构；
- 读取:通过key的hashcode方法获取元素存在该数组的位置,然后通过equals拿到该值；
- 结构: hashMap是一个散列数据结构,HashMap底层就是一个数组结构，数组中的每一项又是一个链表；

总的来说hashMap底层将key-value(键值对)当成一个整体来处理,hashMap底层采用一个 Entry 数组保存所有的键值对,当存储一个entry对象时,会根据key的hash算法来决定存放在数组中的位置,在根据equals方法来确定在链表中的位置,读取一个entry对象,先根据hash算法确定在数组中的位置,再根据equals来获取该值,equals和equals在hashMap中就像一个坐标一样,来确定hashMap中的值。

### 相关概念
- `capacity`： 容量，默认16；
- `loadFactor`： 负载因子，表示HashMap满的程度，默认值为0.75f，也就是说默认情况下，当HashMap中元素个数达到了容量的3/4的时候就会进行自动扩容；
- `threshold`： 阈值；`阈值 = 容量 * 负载因子`。默认12；
- hash碰撞：即hash冲突，两个不同的输入值，根据同一散列函数计算出的散列值相同的现象叫做碰撞。hash碰撞就是用同一hash散列函数计算出相同的散列值；当插入hashmap中元素的key出现重复时，这个时候就发生了hash碰撞；

### 结构
![HashMap结构](/iblog/posts/images/essays/HashMap结构.png)

- JDK1.7：数组 + 单向链表；
- JDK1.8: 数组 + 单向链表/红黑树；

在JDK1.8时，如果存储Map中数组元素对应的索引的每个链表超过8，就将单向链表转化为红黑树；当红黑树的节点少于6个的时候又开始使用链表。

#### 为什么要使用红黑树
当有发生大量的hash冲突时，因为链表遍历效率很慢，为了提升查询的效率，所以使用了红黑树的数据结构。

#### 为什么不一开始就用红黑树代替链表结构
JDK文档注释：

> Because TreeNodes are about twice the size of regular nodes, we use them only when bins contain enough nodes to warrant use  (see TREEIFY_THRESHOLD). 
And when they become too small (due to removal or resizing) they are converted back to plain bins. 

单个 TreeNode 需要占用的空间大约是普通 Node 的两倍，所以只有当包含足够多的 Nodes 时才会转成 TreeNodes，而是否足够多就是由 TREEIFY_THRESHOLD 的值（默认值8）决定的。而当桶中节点数由于移除或者 resize 变少后，又会变回普通的链表的形式，以便节省空间，这个阈值是 UNTREEIFY_THRESHOLD（默认值6）。

#### 为什么树化阈值为8
JDK1.8HashMap文档注释：
> 如果 hashCode 分布良好，也就是 hash 计算的结果离散好的话，那么红黑树这种形式是很少会被用到的，因为各个值都均匀分布，很少出现链表很长的情况。
在理想情况下，链表长度符合泊松分布，各个长度的命中概率依次递减，当长度为 8 的时候，概率仅为 0.00000006。这是一个小于千万分之一的概率，通常我们的 Map 里面是不会存储这么多的数据的，所以通常情况下，并不会发生从链表向红黑树的转换。

HashMap是通过hash算法，来判断对象应该放在哪个桶里面的；JDK 并不能阻止我们用户实现自己的哈希算法，如果我们故意把哈希算法变得不均匀，那么每次存放对象很容易造成hash冲突。

链表长度超过 8 就转为红黑树的设计，更多的是为了防止用户自己实现了不好的哈希算法时导致链表过长，从而导致查询效率低，而此时转为红黑树更多的是一种保底策略，用来保证极端情况下查询的效率。红黑树的引入保证了在大量hash冲突的情况下，HashMap还具有良好的查询性能。

#### 为什么树化阈值和链表阈值不设置成一样
为了防止出现节点个数频繁在一个相同的数值来回切换。

举个极端例子，现在单链表的节点个数是9，开始变成红黑树，然后红黑树节点个数又变成8，就又得变成单链表，然后节点个数又变成9，就又得变成红黑树，这样的情况消耗严重浪费。因此干脆错开两个阈值的大小，使得变成红黑树后“不那么容易”就需要变回单链表，同样，使得变成单链表后，“不那么容易”就需要变回红黑树。

#### 引入红黑树后，如果单链表节点个数超过8个是否一定会树化
不一定，在进行树化之前会进行判断`(n = tab.length) < MIN_TREEIFY_CAPACITY)`是否需要扩容，如果表中数组元素小于这个阈值（默认是64），就会进行扩容。 因为扩容不仅能增加表中的容量，还能缩短单链表的节点数，从而更长远的解决链表遍历慢问题。
```
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

### 容量

#### 为什么负载因子默认是0.75
HashMap中的负载因子这个值现在在JDK的源码中默认是0.75：
```
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

大意：一般来说，默认的负载因子(0.75)在时间和空间成本之间提供了很好的权衡。更高的值减少了空间开销，但增加了查找成本(反映在HashMap类的大多数操作中，包括get和put)。在设置映射的初始容量时，应该考虑映射中预期的条目数及其负载因子，以便最小化重哈希操作的数量。如果初始容量大于最大条目数除以负载因子，则不会发生重新散列操作。

负载因子和hashmap中的扩容有关，当hashmap中的元素大于临界值（`threshold = loadFactor * capacity`）就会扩容。所以负载因子的大小决定了什么时机扩容，扩容又影响到了hash碰撞的频率。所以设置一个合理的负载因子可以有效的避免hash碰撞。

设置为0.75的其他解释：
- 根据数学公式推算。这个值在`log(2)`的时候比较合理;
- 为了提升扩容效率，HashMap的容量有一个固定的要求，那就是一定是2的幂。如果负载因子是3/4的话，那么和容量的乘积结果就可以是一个整数；

#### 如果指定容量大小为10，那么实际大小是多少
实际大小是16。其容量为不小于指定容量的2的幂数。

**为什么容量始终是2的N次方？**

为了减少Hash碰撞，尽量使Hash算法的结果均匀分布。

当使用put方法时，到底存入HashMap中的那个数组中？这时是通过hash算法决定的，如果某一个数组中的链表过长旧会影响查询的效率；那么为了避免出现hash碰撞，让hash尽可能的散列分布，就需要在hash算法上做文章。

JDK1.7通过逻辑与运算，来判断这个元素该进入哪个数组；在下面的代码中length的长度始终为不小于指定容量的2的幂数。
```
static int indexFor(int h, int length) {
    return h & (length - 1);
}
```
为了更好的理解举个例子：假设h=2或h=3，length=15，进行与运算，最终逻辑与运算后的结果是一致的，因为最终结果是一致的所以就发生了hash碰撞，这种问题多了以后会造成容器中的元素分布不均匀，都分配在同一个数组上，在查询的时候就减慢了查询的效率，另一方面也造成空间的浪费。
````
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
为了避免上面`length=15`这类问题出现，所以集合的容量采用必须是2的N次幂这种方式，因为2的N次幂的结果减一转换为二进制后都是以`...1111`结尾的，所以在进行逻辑与运算时碰撞几率小。

在JDK1.8中，在`putVal()`方法中通过`i = (n - 1) & hash`来计算key的散列地址：
```
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
        // 此处省略了代码
        // i = (n - 1) & hash]
        if ((p = tab[i = (n - 1) & hash]) == null)
            
            tab[i] = newNode(hash, key, value, null);
        
 
        else {
            // 省略了代码
        }
}
```
> 这里的 "&" 等同于 %"，但是"%"运算的速度并没有"&"的操作速度快；"&"操作能代替"%"运算，必须满足一定的条件，也就是`a%b=a&(b-1)`仅当b是2的n次方的时候方能成立。

**容器容量怎么保持始终为2的N次方？**

`HashMap`的`tableSizeFor()`方法做了处理，能保证n永远都是2次幂。

如果用户制定了初始容量，那么HashMap会计算出比该数大的第一个2的幂作为初始容量；另外就是在扩容的时候，也是进行成倍的扩容，即4变成8，8变成16。

```
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
发现上面在进行`>>>`操作时会将cap的二进制值变为最高位后边全是1，`00010001 -> 00011111`这个算法就导致了任意传入一个数值，会将该数字变为它的2倍减1，因为任何尾数全为1的在加1都为2的倍数。

至于开头减1，是因为如果给定的n已经是2的次幂，但是不进行减1操作的话，那么得到的值就是大于给定值的最小2的次幂值，例如传入4就会返回8。

为什么最大右移到16位，因为可以得到的最大值是32个1，这个是int类型存储变量的最大值，在往后就没意义了。

#### 默认初始化容量为什么是16
没有找到相关解释，推断这应该就是个经验值，既然一定要设置一个默认的2^n 作为初始值，那么就需要在效率和内存使用上做一个权衡。这个值既不能太小，也不能太大。太小了就有可能频繁发生扩容，影响效率。太大了又浪费空间，不划算。所以，16就作为一个经验值被采用了。

关于默认容量的定义：
```
/**
 * The default initial capacity - MUST be a power of two.
 */
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
```
故意把16写成`1 << 4`这种形式，就是提醒开发者，这个地方要是2的次幂。

#### 初始化容量设置多少合适
当我们使用`HashMap(int initialCapacity)`来初始化容量的时候，`HashMap`并不会使用我们传进来的`initialCapacity`直接作为初始容量。JDK会默认帮我们计算一个相对合理的值当做初始容量。所谓合理值，其实是找到第一个比用户传入的值大的2的幂。

如果创建hashMap初始化容量设置为7，那么JDK通过计算会创建一个初始化为8的hashMap。当hashMap中的元素到`0.75 * 8 = 6`就会进行扩容，这明显是我们不希望看到的。

参考JDK8中`putAll`方法中的实现：
```
(int) ((float) expectedSize / 0.75F + 1.0F);
```
通过`expectedSize / 0.75F + 1.0F`计算，`7/0.75 + 1 = 10` ,10经过JDK处理之后，会被设置成16，这就大大的减少了扩容的几率。

当我们明确知道HashMap中元素的个数的时候，把默认容量设置成`expectedSize / 0.75F + 1.0F` 是一个在性能上相对好的选择，但是，同时也会牺牲些内存。

这个算法在guava中有实现，开发的时候，可以直接通过Maps类创建一个HashMap：
```
Map<String, String> map = Maps.newHashMapWithExpectedSize(7);
```
```
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

### 扩容
- JDK1.7: 先扩容在添加元素；
- JDK1.8: 先添加元素在扩容；

#### 为什么要进行扩容
随着HashMap中的元素增加，Hash碰撞导致获取元素方法的效率就会越来越低，为了保证获取元素方法的效率，所以针对HashMap中的数组进行扩容。扩容数组的方式只能再去开辟一个新的数组，并把之前的元素转移到新数组上。

> PS 如何能避免哈希碰撞?
>- 容量太小。容量小，碰撞的概率就高了。狼多肉少，就会发生争抢。
>- hash算法不够好。算法不合理，就可能都分到同一个或几个桶中。分配不均，也会发生争抢。

#### 什么时机进行扩容
HashMap的扩容条件就是当HashMap中的元素个数（size）超过临界值（threshold）时就会自动扩容。在HashMap中，`threshold = loadFactor * capacity`。默认情况下负载因子为0.75,理解为当容器中元素到容器的3/4时就会扩容。
```
 if (++size > threshold)
    resize();
```
HashMap的容量是有上限的，必须小于`1<<30`，即`1073741824`。如果容量超出了这个数，则不再增长，且阈值会被设置为`Integer.MAX_VALUE`：
```
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
#### 1.7扩容
- `新容量 = 旧容量 * 2` 
- `新阈值 = 新容量 * 负载因子` 

```
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
```
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
通过transfer方法将旧数组上的元素转移到扩容后的新数组上
```
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


#### 1.8扩容
容量变为原来的2倍，阈值也变为原来的2倍。容量和阈值都变为原来的2倍时，负载因子还是不变。

在1.8时做了一些优化，文档注释写的很清楚："元素的位置要么是在原位置，要么是在原位置再移动2次幂的位置"。也就是对比1.7的迁移到新的数组上省去了重新计算hash值的时间。

这里的"2次幂的位置"是指长度为原来数组元素的两倍的位置;举个例子,现在容量为16，要扩容到32，要将之前的元素迁移过去，要根据hash值来判断迁移过去的位置；假设元素A：hash值：0101 0101；根据代码`h & (length - 1)`可得`元素A & 15`、`元素A & 31`
```
扩容之前的位置：
  0101 0101
& 0000 1111
————————————
  0000 0101

扩容之后的位置：
  0101 0101
& 0001 1111
————————————
  0001 0101
```
发现规律：扩容前的hash值和扩容后的hash值，如果元素A二进制形式第三位如果是0，扩容之后就还是原来的位置，如果是1扩容后就是原来的位置加16，而16就是扩容的大小。


```
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
                        newTab[e.hash & (newCap - 1)] = e;
                    else if (e instanceof TreeNode)
                        ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                    else { // preserve order
                        Node<K,V> loHead = null, loTail = null;
                        Node<K,V> hiHead = null, hiTail = null;
                        Node<K,V> next;
                        do {
                            next = e.next;
                            if ((e.hash & oldCap) == 0) {
                                if (loTail == null)
                                    loHead = e;
                                else
                                    loTail.next = e;
                                loTail = e;
                            }
                            else {
                                if (hiTail == null)
                                    hiHead = e;
                                else
                                    hiTail.next = e;
                                hiTail = e;
                            }
                        } while ((e = next) != null);
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