---
title: "Java集合"
date: 2021-10-04
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-java-container"
---

## 概述
Java中的集合主要包括`Collection`和`Map`两种，`Collection`存储着对象的集合，而`Map`存储着键值对的映射表。

![Java中的集合-01](/iblog/posts/annex/images/essays/Java中的集合-01.jpg)

## 数组
如果你看过`ArrayList`类源码，就知道`ArrayList`底层是通过数组来存储元素的，所以如果严格来说，数组也算集合的一种。
Java中提供的数组是用来存储固定大小的同类型元素，所以Java数组就是同类数据元素的集合。
在Java中，数组是一种非常常用的数据结构，用于存储同一类型的一组元素。
```java
// 定义一个整数数组
int[] intArray;

// 初始化数组并赋值
intArray = new int[5]; // 数组长度为5，每个元素默认值为0

// 定义并初始化数组
int[] anotherArray = {1, 2, 3, 4, 5}; // 定义并同时赋值
```

数组是引用数据类型，如果使用了没有开辟空间的数组，则一定会出现`NullPointerException`异常信息。
所以数组本质上也是Java对象，能够向下或者向上转型，能使用`instanceof`关键字。
```java
int[] intArray; // 声明数组但未初始化
System.out.println(intArray[0]); // 这将导致 NullPointerException


Object obj = new int[5]; // 向上转型
if (obj instanceof int[]) {
int[] array = (int[]) obj; // 向下转型
    System.out.println("Successfully casted obj to int[]");
}
```
数组由于其连续的内存分配和高效的下标访问，具有高访问效率，但其固定大小、插入删除低效、单一类型限制和高内存要求使其在实际应用中不如集合灵活
所以我们应该优选集合，而不是数组。只有在已证明性能成为问题的时候，并且确定切换到数组对性能提高有帮助时，才应该将项目重构为使用数组。

### 变长参数
在Java中，变长参数在方法定义中处理方式与数组相同。
变长参数允许你传递任意数量的参数到一个方法中，编译时会将其处理为一个数组。例如：
```java
public void methodName(int... values) {
    for (int value : values) {
        System.out.println(value);
    }
}
// 在这个方法中，可以传递任意数量的整数
methodName(1, 2, 3); // 传递三个参数
methodName(4, 5); // 传递两个参数
methodName(); // 传递零个参数
```
一个方法只能有一个变长参数，即使是不同类型也不行。并且变长参数必须是方法参数列表中的最后一个参数。

### 定义数组
由于数组没有提供任何的封装，所有对元素的操作，都是通过自定义的方法实现的，对数组元素的操作比较麻烦，好在Java自带了一些API供开发者调用。
```java
int[] array1 = { 1,2,3,4,5 }; 
int[] array2 = new int[10];
int[] array3 = new int[]{ 1,2,3,4,5 };
```
需要注意的是[]，写在数组名称的前后都可以，但是推荐第一种写法：
```java
int[] array1 = { 1,2,3,4,5 };
int array2[] = { 1,2,3,4,5 };
```

### 遍历数组
在Java中，遍历数组有多种不同的方式，每种方式适合不同的情况和需求。以下是几种常见的遍历数组的方式：
1. 使用普通for循环；
    ```java
    int[] array = {1, 2, 3, 4, 5};
    
    for (int i = 0; i < array.length; i++) {
        System.out.println(array[i]);
    }
    ```
2. 使用增强for循环；
    ````java
    int[] array = {1, 2, 3, 4, 5};
    
    for (int num : array) {
        System.out.println(num);
    }
    ````
3. 使用Java 8的`Stream API`；
    ```java
    int[] array = {1, 2, 3, 4, 5};
    
    Arrays.stream(array).forEach(num -> System.out.println(num));
    ```

### 数组去重
1. 如果数组元素是对象类型（如`String`、`Integer`等），可以利用集合类的特性来进行去重。这种方法简单直接，适用于不需要保持原始顺序的情况；
    ```java
    public class ArrayDuplicateRemoval {
        public static void main(String[] args) {
            // 示例数组
            Integer[] array = {1, 2, 3, 3, 4, 5, 1, 2};
            
            // 使用Set去重
            Set<Integer> set = new LinkedHashSet<>(Arrays.asList(array));
            Integer[] result = set.toArray(new Integer[0]);
            
            // 输出去重后的数组
            System.out.println(Arrays.toString(result));
        }
    }
    ```
2. Java 8引入的`Stream API`提供了一种更加函数式和流畅的方式进行数组去重。这种方法同样适用于对象类型数组，且可以保持元素的原始顺序；
    ```java
    public class ArrayDuplicateRemoval {
        public static void main(String[] args) {
            // 示例数组
            Integer[] array = {1, 2, 3, 3, 4, 5, 1, 2};
            
            // 使用Stream API去重
            Integer[] result = Arrays.stream(array)
                                     .distinct()
                                     .toArray(Integer[]::new);
            
            // 输出去重后的数组
            System.out.println(Arrays.toString(result));
        }
    }
    ```

### 数组转集合
1. 使用`Arrays.asList`方法；
    ```java
    public class ArrayToCollection {
        public static void main(String[] args) {
            // 示例数组
            String[] array = {"A", "B", "C", "D"};
            
            // 将数组转换为List
            List<String> list = Arrays.asList(array);
            
            // 输出List
            System.out.println(list);
        }
    }
    ```
2. 使用`Collections.addAll`方法；
    ```java
    public class ArrayToCollection {
        public static void main(String[] args) {
            // 示例数组
            String[] array = {"A", "B", "C", "D"};
            
            // 创建一个空的List
            List<String> list = new ArrayList<>();
            
            // 将数组元素添加到List中
            Collections.addAll(list, array);
            
            // 输出List
            System.out.println(list);
        }
    }
    ```
3. 使用`Stream API`；
    ```java
    public class ArrayToCollection {
        public static void main(String[] args) {
            // 示例数组
            String[] array = {"A", "B", "C", "D"};
            
            // 将数组转换为List
            List<String> list = Stream.of(array).collect(Collectors.toList());
            
            // 输出List
            System.out.println(list);
        }
    }
    ```

## ArrayList
在`List`接口实现类中，最常用的就是`ArrayList`，`ArrayList`类是一个可以动态修改的数组，与普通数组的区别就是它是没有固定大小的限制，可以添加或删除元素。
`ArrayList`继承了`AbstractList`，并实现了`List`、`RandomAccess`，`Cloneable`接口：
```java
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess,Cloneable,Serializable{}
```

### RandomAccess
`Random`是随机的意思，`Access`是访问的意思，合起来`RandomAccess`就是随机访问的意思。
`RandomAccess`接口是一个标记接口，用来标记实现的`List`集合具备快速随机访问的能力。
所有的`List`实现都支持随机访问的，只是基于基本结构的不同，实现的速度不同罢了。

当一个`List`拥有快速访问功能时，其遍历方法采用随机访问速度最快，而没有快速随机访问的`List`采用顺序访问的速度最快。
如果集合中的数据量过大需要遍历时，此时需要格外注意，因为不同的遍历方式会影响很大，可以使用`instanceof`关键字来判断该类有没有`RandomAccess`标记：
```text
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
在`List`中`ArrayList`被`RandomAccess`接口标记，而`LinkedList`没有被`RandomAccess`接口标记，所以`ArrayList`适合随机访问，而`LinkedList`适合顺序访问。

### Cloneable
`Cloneable`接口是Java开发中常用的一个接口之一，它是一个标记接口。
如果一个想要拷贝一个对象，就需要重写`Object`中的`clone`方法并让其实现`Cloneable`接口。如果只重写`clone`方法，不实现`Cloneable`接口就会报`CloneNotSupportedException`异常。

`clone`方法源码：
```java
protected native Object clone() throws CloneNotSupportedException;
```
应当注意的是，`clone()` 方法并不是 `Cloneable` 接口的方法，而是 `Object` 的一个 `protected` 方法。
`Cloneable` 接口只是规定，如果一个类没有实现 `Cloneable` 接口又调用了 `clone()` 方法，就会抛出 `CloneNotSupportedException`。
换言之，`clone`方法规定了想要拷贝对象，就需要实现`Cloneable`方法，`clone`方法让`Cloneable`接口变得有意义。

拷贝分为浅拷贝与深拷贝：
- 浅拷贝：被复制对象的所有值属性都含有与原来对象的相同，而所有的对象引用属性仍然指向原来的对象；
- 深拷贝：在浅拷贝的基础上，所有引用其他对象的变量也进行了`clone`，并指向被复制过的新对象；

如果一个被复制的属性都是基本类型，那么只需要实现当前类的`Cloneable`机制就可以了，此为浅拷贝。
如果被复制对象的属性包含其他实体类对象引用，那么这些实体类对象都需要实现`cloneable`接口并覆盖`clone`方法。
`ArrayList`中`clone`方法可以创建一个浅拷贝。
```java
// ArrayList类
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

// Arrays类
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
在`ArrayList`中核心方法最终调用`Arrays.copyOf`方法，其中调用`Arrays.newInstance`方法或者创建一个新数组，`Arrays.newInstance`方法作用，是创建具有指定组件类型和长度的新数组。
所以不论怎样都会创建一个`Object`数组。最后使用`System.arraycopy`方法将之前的旧数组中的元素拷贝到新创建的数组中，然后赋值给`ArrayList.elementData`对象并返回。

如果需要深拷贝，即复制对象及其引用的所有对象，需要手动实现拷贝逻辑，通常涉及遍历列表并复制每个元素。
```java
class Item implements Cloneable {
    String name;

    Item(String name) {
        this.name = name;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public String toString() {
        return name;
    }
}

public class ArrayListCopy {
    public static void main(String[] args) throws CloneNotSupportedException {
        // 创建并初始化一个ArrayList
        ArrayList<Item> originalList = new ArrayList<>();
        originalList.add(new Item("A"));
        originalList.add(new Item("B"));
        originalList.add(new Item("C"));

        // 深拷贝
        ArrayList<Item> deepCopy = new ArrayList<>();
        for (Item item : originalList) {
            deepCopy.add((Item) item.clone());
        }

        // 修改原始列表的元素
        originalList.get(0).name = "Z";

        // 输出结果
        System.out.println("Original List: " + originalList);
        System.out.println("Deep Copy: " + deepCopy);
    }
}
```

### ArrayList扩容
因为`ArrayLis`t底层使用数组保存数据的，而数组一旦被创建就不能改变大小，但是`ArrayList`的长度是可以改变的，所以可以通过`ArrayList`类中的`add`方法找到数组扩容方法。
`add`方法调用栈：
```
add 
    -> ensureCapacityInternal()
    -> calculateCapacity()
    -> ensureExplicitCapacity()
    -> grow()
```
通过`add`方法，最终找到了`grow`方法，也就是扩容的核心方法：
```java
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
在`ArrayList`如果没有指定容量创建数组，默认会创建一个长度为10的数组用来保存元素，之后通过`grow`方法中的这段代码：
```java
 int newCapacity = oldCapacity + (oldCapacity >> 1);
```
`>>`右移几位就是相当于除以2的几次幂，所以每次扩容都是原容量的1.5倍。最后通过`Arrays.copyOf`方法将之前的数组中元素，全部移到新创建的数组上。

由于频繁的扩容数组会对性能产生影响，如果在`ArrayList`中要存储很大的数据，需要在`ArrayList`的有参构造中指定数组的长度，来减少扩容的次数。
需要注意的是创建指定长度的`ArrayList`，在没有`add`之前`ArrayList`中的数组已经初始化了，但是`List`的大小没变，因为`List`的大小是由`size`决定的。
```java
List<String> list = new ArrayList(1000000);
```

### ArrayList与LinkedList
`ArrayList`与`LinkedList`性能比较是一道经典的面试题，先说答案`ArrayList`查找快，增删慢，而`LinkedList`增删快，查找慢。
造成这种原因是因为底层的数据结构不一样。`ArrayList`底层是数组，而数组的中的元素内存分配都是连续的，并且数组中的元素只能存放一种，这就造成了数组中的元素地址是有规律的，数组中查找元素快速的原因正是利用了这一特点。
查询方式为: 首地址＋(元素类型长度*下标)。例如：`new int arr[5];``arr`数组的地址假设为`0x1000`，那么`arr[3]`地址可看作为 `0x1000 + (3 * 4)`，3为数组下标，4为int元素类型长度。

而`LinkedList`在Java中的底层结构是对象，每一个对象结点中都保存了下一个结点的位置形成的链表结构，由于`LinkedList`元素的地址是不连续的，所以没办法按照数组那样去查找，所以就比较慢。

由于数组一旦分配了大小就不能改变，所以`ArrayList`在进行添加操作时会创建新的数组，如果要添加到`ArrayList`中的指定的位置，是通过`System.arraycopy`方法将数组进行复制，新的数组会将待插入的指定位置空余出来，最后在将元素添加到集合中。
在进行删除操作时是通过`System.arraycopy`方法，将待删除元素后面剩余元素复制到待删除元素的位置。当`ArrayList`里有大量数据时，这时候去频繁插入或删除元素会触发底层数组频繁拷贝，所以效率不高，还会造成内存空间的浪费。

`LinkedList`在进行添加，删除操作时，会用二分查找法找到将要添加或删除的元素，之后再设置对象的下一个结点来进行添加或删除操作，所以增加删除的效率高。
> 二分查找法：也称为折半查找法，是一种适用于大量数据查找的方法，但是要求数据必须的排好序的，每次以中间的值进行比较，根据比较的结果可以直接舍去一半的值，直至全部找完（可能会找不到）或者找到数据为止。
此处LinkedList会比较查找的元素是距离头结点比较近，还是尾结点比较近，距离哪边较近则从哪边开始查找。

`ArrayList`获取元素效率非常的高，时间复杂度是`O(1)`，而查找、插入和删除元素效率似乎不太高，时间复杂度为`O(n)`。
`LinkedList`与`ArrayList`相反，获取第几个元素依次遍历复杂度`O(n)`，添加到末尾复杂度`O(1)`，添加到指定位置复杂度`O(n)`，删除元素直接指针指向操作复杂度`O(1)`。

注意，`ArrayList`的增删不一定比`LinkedList`效率低，但是`ArrayList`查找效率一定比`LinkedList`高。
如果在靠近末尾的地方插入，那么`ArrayList`只需要移动较少的数据，而`LinkedList`则需要一直查找到列表尾部，反而耗费较多时间，这时`ArrayList`就比`LinkedList`要快。

所以在实际开发中，`ArrayList`适用于需要快速随机访问和较少插入删除操作的场景，而`LinkedList`适用于频繁插入删除操作和需要实现队列或双端队列的场景。

### 线程安全
众所周知，`ArrayList`是线程不安全的，因为它不保证在多线程环境下的同步操作，这意味着多个线程同时访问和修改同一个`ArrayList`对象时可能会导致数据不一致或抛出异常。
为避免偶然，多试几次这个代码，很大情况会出现`ConcurrentModificationException`，即同步修改异常。
```java
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
出现该异常的原因是`fail-fast`机制。在查看源码的时候，发现调用`remove`方法时，会执行`checkForComodification`方法。
若`modCount` 不等于`expectedModCount`，则抛出`ConcurrentModificationException`异常。
```java
final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}
```
那为什么会抛出`ConcurrentModificationException`异常呢？
在调用`add`方法时，会修改`modCount++`。一个线程调用`add`方法，一个线程调用`next`遍历方法，都共同读取`modCount`变量的值。
因为是多线程操作，就很容易出现`modCount != expectedModCount`，所以便抛出异常。
```java
// 添加元素到指定的位置
public void add(int index, E element) {
    if (index > size || index < 0)
        throw new IndexOutOfBoundsException(
                "Index: " + index + ", Size: " + size);

    // 修改modCount
    ensureCapacity(size + 1);  // Increments modCount!!
    System.arraycopy(elementData, index, elementData, index + 1,
            size - index);
    elementData[index] = element;
    size++;
}
```

因此，在多线程环境中使用`ArrayList`时，需要手动同步操作，或者使用线程安全的集合类。保证`ArrayList`线程安全有以下几种方法：
1. 可以使用 `Vector` 来代替 `ArrayList`。`Vector`是线程安全的`ArrayList`，但是由于底层是加了`synchronized`，性能略差不推荐使用；
    ```java
    List list = new Vector();
    list.add(UUID.randomUUID().toString());
    ```
2. 使用`Collections.synchronizedArrayList()` 来创建 `ArrayList`。使用`Collections`工具类来创建`ArrayList`的思路是，在`ArrayList`的外边套了一个`synchronized`外壳，来保证`ArrayList`线程安全；
    ```java
    List list = Collections.synchronizedArrayList();
    list.add(UUID.randomUUID().toString());
    ```
3. 使用`CopyOnWriteArrayList()`来保证 `ArrayList` 线程安全。`CopyWriteArrayList`字面意思就是在写的时候复制，主要思想就是读写分离的思想。
`CopyWriteArrayList`之所以线程安全的原因是在源码里面使用`ReentrantLock`，所以保证了某个线程在写的时候不会被打断；
    ```java
    CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
    list.add(UUID.randomUUID().toString());
    ```
### ArrayList安全删除
在`ArrayList`中删除元素时，"安全删除" 指的是在删除元素过程中避免出现异常或错误，并确保集合的结构和元素的状态保持一致。
在使用增强型`for-each`循环遍历`ArrayList`时，如果尝试删除元素，会抛出`ConcurrentModificationException`。
```java
public class ArrayListError {
    public static void main(String[] args) {
        ArrayList<String> list = new ArrayList<>();
        list.add("A");
        list.add("B");
        list.add("C");
        list.add("D");

        for (String element : list) {
            if ("B".equals(element)) {
                list.remove(element); // 这会抛出 ConcurrentModificationException
            }
        }
    }
}
```

在前面讲过`add`方法，会操作`modCount`变量的值，在查看源码的时候，发现调用`remove`方法时，也会操作`modCount`变量的值。
当调用`remove`方法时执行了`modCount++`，此时`modCount`变成了`N+1`。
然后接着遍历调用`next`方法，调用`checkForComodification`比较`expectedModCount`和`modCount`的大小，此时`modCount != expectedModCount`，便抛出异常。
```java
final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}

 // 删除指定位置的元素 
public E remove(int index) {
    RangeCheck(index);

    // 修改modCount
    modCount++;
    E oldValue = (E) elementData[index];

    int numMoved = size - index - 1;
    if (numMoved > 0)
        System.arraycopy(elementData, index+1, elementData, index, numMoved);
    elementData[--size] = null; // Let gc do its work

    return oldValue;
}
```

## HashSet
`HashSet`是基于`HashMap`来实现的，支持快速查找，但不支持有序性操作。实现了`Set`接口，同时还实现了序列化和可克隆化。
`Set`不允许存储重复的元素，即集合中的元素是唯一的。当试图添加一个已经存在的元素时，`add`方法会返回`false`，并且集合不会发生改变。
```java
public class HashSetExample {
    public static void main(String[] args) {
        // 创建一个 HashSet 实例
        HashSet<String> set = new HashSet<>();

        // 添加元素
        set.add("Apple");
        set.add("Banana");
        set.add("Orange");

        // 打印 HashSet
        System.out.println("HashSet: " + set);

        // 尝试添加重复元素
        boolean added = set.add("Apple");
        System.out.println("Added duplicate element: " + added); // 输出: false

        // 删除元素
        set.remove("Banana");
        System.out.println("After removing 'Banana': " + set);
    }
}
```

### 去重原理
`HashSet`内部实际上是由一个`HashMap`实例支持的，其中`HashMap`的键值对中的键存储了`HashSet`中的元素，而值则是一个占位对象，用来表示键已经存在。

当调用`HashSet`的`add(E e)`方法添加元素时，首先会调用元素`e`的 `hashCode`方法获取其哈希码。`HashSet`根据哈希码确定元素在内部`HashMap`的存储位置。
如果该位置上已经存在一个元素，则使用 `equals` 方法比较新元素`e`与已存在的元素是否相等。
如果`equals`方法返回`true`，则认为新元素与已存在元素相同，不进行添加操作，返回`false`。
如果`equals`方法返回`false`，则说明哈希码冲突，但实际上是不同的对象，此时将新元素添加到 `HashSet`中，返回`true`。
如果该位置上不存在任何元素，则直接将新元素添加到`HashSet`中，并返回`true`。

简单来说，`HashSet`利用对象的哈希码和`equals`方法来确保集合中不存储重复的元素。
当添加新元素时，先计算其哈希码确定存储位置，如果位置上已存在相同哈希码且通过`equals`方法比较相等的元素，则不添加，否则添加新元素到集合中。

尝试阅读`HashSet`的具体实现源码，`HashSet`添加方法的实现源码如下：
```java
// hashmap 中 put() 返回 null 时，表示操作成功
public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}

// 返回值：如果插入位置没有元素则返回 null，否则返回上一个元素
public V put(K key, V value) {
   return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
               boolean evict) {
   Node<K, V>[] tab;
   Node<K, V> p;
   int n, i;
   //如果哈希表为空，调用 resize() 创建一个哈希表，并用变量 n 记录哈希表长度
   if ((tab = table) == null || (n = tab.length) == 0)
      n = (tab = resize()).length;
   /**
    * 如果指定参数 hash 在表中没有对应的桶，即为没有碰撞
    * Hash函数，(n - 1) & hash 计算 key 将被放置的槽位
    * (n - 1) & hash 本质上是 hash % n 位运算更快
    */
   if ((p = tab[i = (n - 1) & hash]) == null)
      // 直接将键值对插入到 map 中即可
      tab[i] = newNode(hash, key, value, null);
   else {// 桶中已经存在元素
      Node<K, V> e;
      K k;
      // 比较桶中第一个元素(数组中的结点)的 hash 值相等，key 相等
      if (p.hash == hash &&
              ((k = p.key) == key || (key != null && key.equals(k))))
         // 将第一个元素赋值给 e，用 e 来记录
         e = p;
         // 当前桶中无该键值对，且桶是红黑树结构，按照红黑树结构插入
      else if (p instanceof TreeNode)
         e = ((TreeNode<K, V>) p).putTreeVal(this, tab, hash, key, value);
         // 当前桶中无该键值对，且桶是链表结构，按照链表结构插入到尾部
      else {
         for (int binCount = 0; ; ++binCount) {
            // 遍历到链表尾部
            if ((e = p.next) == null) {
               p.next = newNode(hash, key, value, null);
               // 检查链表长度是否达到阈值，达到将该槽位节点组织形式转为红黑树
               if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                  treeifyBin(tab, hash);
               break;
            }
            // 链表节点的<key, value>与 put 操作<key, value>
            // 相同时，不做重复操作，跳出循环
            if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
               break;
            p = e;
         }
      }
      // 找到或新建一个 key 和 hashCode 与插入元素相等的键值对，进行 put 操作
      if (e != null) { // existing mapping for key
         // 记录 e 的 value
         V oldValue = e.value;
         /**
          * onlyIfAbsent 为 false 或旧值为 null 时，允许替换旧值
          * 否则无需替换
          */
         if (!onlyIfAbsent || oldValue == null)
            e.value = value;
         // 访问后回调
         afterNodeAccess(e);
         // 返回旧值
         return oldValue;
      }
   }
   // 更新结构化修改信息
   ++modCount;
   // 键值对数目超过阈值时，进行 rehash
   if (++size > threshold)
      resize();
   // 插入后回调
   afterNodeInsertion(evict);
   return null;
}
```
从上述源码可以看出，当将一个键值对放入`HashMap`时，首先根据`key`的`hashCode()`返回值决定该`Entry`的存储位置。如果有两个`key`的`hash`值相同，则会判断这两个元素`key`的`equals()`是否相同，如果相同就返回`true`，说明是重复键值对，那么`HashSet`中`add`方法的返回值会是`false`，表示`HashSet`添加元素失败。
因此，如果向`HashSet`中添加一个已经存在的元素，新添加的集合元素不会覆盖已有元素，从而保证了元素的不重复。
如果不是重复元素，`put`方法最终会返回`null`，传递到`HashSet`的`add`方法就是添加成功。

### equals与hashCode
因为`HashSet`，底层用到了`equals`和`hashCode`方法，如果对象中的`equals`和`hashCode`方法没有正确地重写，可能会导致`HashSet`在判断元素相等性时出现问题，从而允许添加相同的元素。

`equals()`地址比较是通过对象的哈希值来比较的。`hash`值是由`hashCode`方法产生的，`hashCode`属于`Object`类的本地方法，默认使用`==`比较两个对象，如果`equals()`相等`，hashcode`一定相等，如果`hashcode`相等，`equals`不一定相等。
所以在覆盖`equals`方法时应当总是覆盖`hashCode`方法，保证等价的两个对象散列值也相等。

下面的代码中，新建了两个等价的对象，并将它们添加到`HashSet`中。我们希望将这两个对象当成一样的，只在集合中添加一个对象，但是因为`EqualExample`没有实现`hashCode`方法，因此这两个对象的散列值是不同的，最终导致集合添加了两个等价的对象。
```java
public class MainTest {
    public static void main(String[] args) {
        EqualExample e1 = new EqualExample(1, 1, 1);
        EqualExample e2 = new EqualExample(1, 1, 1);
        // true
        System.out.println(e1.equals(e2));
        HashSet<EqualExample> set = new HashSet<>();
        set.add(e1);
        set.add(e2);
        // 2
        System.out.println(set.size());
    }
}
```
所以在覆盖`equals`方法时应当总是覆盖`hashCode`方法，保证等价的两个对象散列值也相等。

### 线程安全
`HashSet`和`ArrayList`类似，也是线程不安全的集合类，也会报`ConcurrentModificationException` 异常。代码演示线程不安全示例：
```java
public class MainTest {
    public static void main(String[] args) {
        HashSet<String> set = new HashSet<>();
        for(int i=0; i< 10; i++) {
            new Thread(() -> {
                set.add(UUID.randomUUID().toString());
                System.out.println(set);
            },String.valueOf(i)).start();
        }
    }
}
```

参照`ArrayList`解决方案，得到`HashSet`两种解决方案：
- `Collections.synchronizedSet`集合工具类解决；
- 使用 `CopyOnWriteArraySet`保证集合线程安全；

由于性能因素，一般情况使用 `CopyOnWriteArraySet`场景较多，代码演示
```java
public class MainTest {
    public static void main(String[] args) {
        CopyOnWriteArraySet<String> set = new CopyOnWriteArraySet<>();
        for(int i=0; i< 10; i++) {
            new Thread(() -> {
                set.add(UUID.randomUUID().toString());
                System.out.println(set);
            },String.valueOf(i)).start();
        }
    }
}
```
`CopyOnWriteArraySet`底层调用的是`CopyOnWriteArrayList`：
```java
private final CopyOnWriteArrayList<E> al;
/**
 * Creates an empty set.
 */
public CopyOnWriteArraySet() {
    al = new CopyOnWriteArrayList<E>();
}
```

## Queue
在Java中，队列是一种常用的数据结构，用于按顺序存储元素，通常以先进先出(`FIFO`：`First In First Out`)的方式进行操作。
它和`List`的区别在于，`List`可以在任意位置添加和删除元素，而队列只有两个操作，把元素添加到队列末尾，或者从队列头部取出元素。

常见实现：
- `LinkedList`：`LinkedList`类实现了`Queue`接口，同时也实现了`Deque`接口（双端队列）。它可以作为队列、双端队列或堆栈使用；
   ```java
   Queue<String> queue = new LinkedList<>();
   queue.offer("A");
   queue.offer("B");
   queue.poll(); // 返回 "A" 并移除
   ```
- `PriorityQueue`：`PriorityQueue`是一个基于优先级堆实现的队列，元素根据其自然顺序进行排序；
   ```java
   PriorityQueue<Integer> pq = new PriorityQueue<>();
   pq.offer(2);
   pq.offer(1);
   pq.offer(3);
   pq.poll(); // 返回 1 并移除
   ```
- `ArrayDeque`：`ArrayDeque`类实现了`Deque`接口，是一个可调整大小的数组实现的双端队列，通常比`LinkedList`更快；
   ```java
   Deque<String> deque = new ArrayDeque<>();
   deque.offer("A");
   deque.offerFirst("B");
   deque.pollLast(); // 返回 "A" 并移除
   ```

队列的实现通常不允许插入`null`元素，尽管一些实现，如`LinkedList`，不禁止插入`null`元素。
即使在允许的实现中，`null`也不应插入队列中，因为`poll`方法也使用`null`作为特殊返回值，用来表示队列不包含任何元素。这会导致难以区分队列中的`null`元素和队列为空的情况。

`poll()`和`peek()`方法：
- `poll()`: 检索并删除此队列的头部，如果此队列为空，则返回`null`；
- `peek()`: 检索但不删除此队列的头部，如果此队列为空，则返回`null`；

## HashMap
`HashMap`是一个散列表，它存储的内容是键值对(`key-value`)映射。
`HashMap`实现了`Map`接口，根据键的`HashCode`值存储数据，具有很快的访问速度，最多允许一条记录的键为`null`，不支持线程同步。`HashMap`是无序的，即不会记录插入的顺序。

相关操作：
- 存贮：通过`key`的`hashcode`方法找到在`hashMap`存贮的位置，如果该位置有元素则通过`equals`方法进行比较，如果`equals`返回值为`true`，则覆盖`value`；
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
3. 如果存储位置已有节点，当链表长度超过阈值（默认为 8），将链表转换为红黑树，否则，继续用链表存储；
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
```java
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
```java
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
`HashMap`也是线程不安全的集合类，在多线程环境下使用同样会出现`ConcurrentModificationException`。
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
更严重的是，当多个线程中的 `HashMap` 同时扩容时，再使用`put`方法添加元素，如果`hash`值相同，可能出现同时在同一数组下用链表表示，造成闭环，导致在`get`时会出现死循环，CPU飙升到100%。

在大多数并发场景中，推荐使用`ConcurrentHashMap`，因为它设计用于高并发环境，并且在大多数情况下性能优于使用同步包装或手动同步的`HashMap`。
`ConcurrentHashMap`原理简单理解为，`HashMap` + 分段锁。因为`HashMap`在JDK1.7与JDK1.8结构上做了调整，所以`ConcurrentHashMap`在JDK1.7与JDK1.8结构上也有所不同。
