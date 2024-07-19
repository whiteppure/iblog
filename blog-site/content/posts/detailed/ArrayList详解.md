---
title: "ArrayList详解"
date: 2024-06-26
draft: false
tags: ["Java", "集合","详解"]
slug: "java-arraylist"
---


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
`Cloneable`接口是Java开发中常用的一个接口，它是一个标记接口。
如果一个想要拷贝一个对象，就需要重写`Object`中的`clone`方法并让其实现`Cloneable`接口。如果只重写`clone`方法，不实现`Cloneable`接口就会报`CloneNotSupportedException`异常。

`clone`方法源码：
```java
protected native Object clone() throws CloneNotSupportedException;
```
应当注意的是，`clone()`方法并不是`Cloneable`接口的方法，而是`Object`的一个`protected`方法。
`Cloneable`接口只是规定，如果一个类没有实现`Cloneable`接口又调用了`clone`方法，就会抛出`CloneNotSupportedException`。
换言之，`clone`方法规定了想要拷贝对象，就需要实现`Cloneable`方法，`clone`方法让`Cloneable`接口变得有意义。

拷贝分为浅拷贝与深拷贝：
- 浅拷贝：被复制对象的所有值属性都含有与原来对象的相同，而所有的对象引用属性仍然指向原来的对象；
- 深拷贝：在浅拷贝的基础上，所有引用其他对象的变量也进行了`clone`，并指向被复制过的新对象；

如果一个被复制的属性都是基本类型，那么只需要实现当前类的`Cloneable`机制就可以了，此为浅拷贝。
如果被复制对象的属性包含其他实体类对象引用，那么这些实体类对象都需要实现`Cloneable`接口并覆盖`clone`方法。
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
因为`ArrayList`底层使用数组保存数据的，而数组一旦被创建就不能改变大小，但是`ArrayList`的长度是可以改变的，所以可以通过`ArrayList`类中的`add`方法找到数组扩容方法。
`add`方法调用栈：
```text
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
查询方式为: 首地址＋(元素类型长度*下标)。例如：`new int arr[5]; arr`数组的地址假设为`0x1000`，那么`arr[3]`地址可看作为 `0x1000 + (3 * 4)`，3为数组下标，4为int元素类型长度。

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
众所周知，`ArrayList`是线程不安全的，因为它不保证在多线程环境下的同步操作，当多个线程同时访问和修改同一个`ArrayList`对象时可能会导致数据不一致或抛出异常。
多线程下抛出`ConcurrentModificationException`异常。
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
出现该异常的原因是集合中的`fail-fast`机制。在查看源码的时候，发现调用`remove`方法时，会执行`checkForComodification`方法。
若`modCount`不等于`expectedModCount`，则抛出`ConcurrentModificationException`异常。
```java
final void checkForComodification() {
    if (modCount != expectedModCount)
        throw new ConcurrentModificationException();
}
```
那为什么会抛出`ConcurrentModificationException`异常呢？
在调用`add`方法时，会修改`modCount++`。一个线程调用`add`方法，一个线程调用`next`遍历方法，都共同读取`modCount`变量的值。
因为是多线程操作，`expectedModCount`、`modCount`变量为公共的，所以很容易出现`modCount != expectedModCount`，所以便抛出异常。
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
    ```text
    List list = new Vector();
    list.add(UUID.randomUUID().toString());
    ```
2. 使用`Collections.synchronizedArrayList()` 来创建 `ArrayList`。使用`Collections`工具类来创建`ArrayList`的思路是，在`ArrayList`的外边套了一个`synchronized`外壳，来保证`ArrayList`线程安全；
    ```text
    List list = Collections.synchronizedArrayList();
    list.add(UUID.randomUUID().toString());
    ```
3. 使用`CopyOnWriteArrayList()`来保证 `ArrayList` 线程安全。`CopyWriteArrayList`字面意思就是在写的时候复制，主要思想就是读写分离的思想。
   `CopyWriteArrayList`之所以线程安全的原因是在源码里面使用`ReentrantLock`，所以保证了某个线程在写的时候不会被打断；
    ```text
    CopyOnWriteArrayList<String> list = new CopyOnWriteArrayList<>();
    list.add(UUID.randomUUID().toString());
    ```

其中比较推荐的解决方案是使用`CopyOnWriteArrayList`。
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
当调用`remove`方法时执行了`modCount++`，此时`modCount`变成了`N+1`。然后接着再循环中遍历调用`next`方法，调用`checkForComodification`比较`expectedModCount`和`modCount`的大小，此时`modCount != expectedModCount`，便抛出异常。
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
安全删除的关键在于，确保在遍历和删除操作中不会同时对集合的结构造成不一致性，从而导致程序运行时出现异常或者结果不符合预期。

最经典的解决方案是使用`Iterator`遍历集合，在遍历过程中删除元素。在使用迭代器遍历`ArrayList`时，迭代器会维护一个`expectedModCount`，它记录了迭代开始时的`modCount`。
每次调用迭代器的`next`方法时，都会检查当前的`modCount`是否与`expectedModCount`相等，如果不相等就抛出`ConcurrentModificationException`异常。使用迭代器的`remove()`方法能够确保在删除元素时，同步更新，从而避免异常。
```text
ArrayList<String> list = new ArrayList<>();
// 添加元素到列表中
Iterator<String> iterator = list.iterator();
while (iterator.hasNext()) {
    String element = iterator.next();
    if (/* 满足删除条件 */) {
        iterator.remove(); // 使用迭代器的 remove 方法安全删除元素
    }
}
```
