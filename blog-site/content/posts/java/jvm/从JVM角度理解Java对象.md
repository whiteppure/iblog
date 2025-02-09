---
title: "从JVM角度理解Java对象"
date: 2021-04-12
draft: false
tags: ["Java", "JVM"]
slug: "jvm-object"
---

## 对象的创建方式
常见的有五种创建对象方式：
1. 使用`new`关键字创建；使用`new`关键字创建对象是最常见的方式，直接调用类的构造方法，优点是语法简单直观，执行效率高，适用于大多数对象创建场景，缺点是需要知道类的具体类型，无法在运行时动态决定要创建的对象类型。
    ```java
    public class MyClass {
        public static void main(String[] args) {
            Object obj = new Object();
        }
    }
    ```
2. 使用反射方式创建；使用反射方式创建对象可以通过`Class.newInstance()`或`Constructor.newInstance()`方法实现，优点是可以在运行时动态创建对象，适用于框架和库需要动态加载类的场景，缺点是性能较低且需要处理反射相关异常。
    ```text
    public class MyClass {
        public MyClass() {
            // 初始化代码
        }
    }
    
    try {
        MyClass obj3 = MyClass.class.newInstance(); // JDK 9 以后被标记为过时
    } catch (InstantiationException | IllegalAccessException e) {
        e.printStackTrace();
    }
    ```
3. 使用`clone()`方法；使用`clone()`方法创建对象不调用构造方法，适用于需要创建对象副本的场景，优点是不依赖构造方法，缺点是需要类实现`Cloneable`接口并重写`clone`方法，且深拷贝较为复杂。
    ```text
    public class MyClass implements Cloneable {
        private String message;
    
        public MyClass(String message) {
            this.message = message;
        }
    
        @Override
        protected Object clone() throws CloneNotSupportedException {
            return super.clone();
        }
    }
    
    try {
        MyClass original = new MyClass("Hello, Clone!");
        MyClass clone = (MyClass) original.clone();
    } catch (CloneNotSupportedException e) {
        e.printStackTrace();
    }
    ```
4. 使用序列化，准确来说是反序列化；使用序列化创建对象通过将对象序列化后再反序列化实现，适用于需要对象持久化或网络传输的场景，优点是可以保存对象状态，缺点是性能较低且需要实现`Serializable`接口。
    ```java
    public class MyClass implements Serializable {
        private static final long serialVersionUID = 6377402142849822126L;
        private String message;
    
        public MyClass(String message) {
            this.message = message;
        }
    
        public String getMessage() {
            return message;
        }
    
        public static void main(String[] args) {
            MyClass original = new MyClass("Hello, Serialization!");
    
            try {
                // 序列化
                FileOutputStream fileOut = new FileOutputStream("myclass.ser");
                ObjectOutputStream out = new ObjectOutputStream(fileOut);
                out.writeObject(original);
                out.close();
                fileOut.close();
    
                // 反序列化
                FileInputStream fileIn = new FileInputStream("myclass.ser");
                ObjectInputStream in = new ObjectInputStream(fileIn);
                MyClass deserialized = (MyClass) in.readObject();
                in.close();
                fileIn.close();
    
                System.out.println(deserialized.getMessage());
            } catch (IOException | ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
    }
    ```
5. 使用第三方库，如`Objenesis`；使用第三方库如`Objenesis`创建对象不依赖构造方法，适用于一些需要绕过构造方法进行对象创建的特殊场景，优点是灵活性高，缺点是依赖外部库且可能影响代码可读性。
    ```text
    public class MyClass {
        private String message;
    
        public MyClass() {
            this.message = "Hello, Objenesis!";
        }
    
        public String getMessage() {
            return message;
        }
    }
    
    Objenesis objenesis = new ObjenesisStd();
    ObjectInstantiator<MyClass> instantiator = objenesis.getInstantiatorOf(MyClass.class);
    MyClass obj5 = instantiator.newInstance();
    ```

## 对象的创建步骤
![对象创建步骤](/posts/annex/images/essays/对象创建步骤.png)

以下面代码为例，创建对象字节码指令如下：
```java
public class MainTest {
    public static void main(String[] args) {
        Object obj = new Object();
    }
}
```
![创建对象字节码指令](/posts/annex/images/essays/创建对象字节码指令.png)

1. 首先是通过`new`指令在堆上为对象分配内存。
2. 紧接着调用构造方法，`dup`指令复制对象引用，并将其压入操作数栈。`invokespecial`指令调用`java.lang.Object`的构造方法`<init>`，用于初始化对象。
3. 然后返回对象引用，`astore_1`指令将新创建的对象引用存储在局部变量表索引为1的位置，即`obj`变量。
4. 最后使用`return`指令将方法返回。

上述四个步骤描述的其实不太准确，一般情况下创建对象时，首先要将进行类加载的过程，将类的字节码加载到JVM中，然后再进行之后的步骤。
除此之外，使用`new`关键字为对象在堆内存中分配一块内存空间，在分配内存后，JVM会根据变量的类型自动将对象的实例变量初始化为默认值。
如果是在多线程的环境中，需要确保对象的创建和初始化过程是线程安全的。一般使用`synchronized`关键字，使用`monitorenter`和`monitorexit`指令形成同步块，
在对象分配内存后，JVM会在对象头部分设置对象的元数据信息，如哈希码、GC年龄、锁状态等。然后执行对象的显式初始化，包括声明时的初始化表达式、执行对象中的初始化代码块，最后执行对象的构造方法，构造方法用于完成对象的最终初始化，可以初始化对象的实例变量。

## 对象的创建过程
1. 判断对象对应的类是否加载、链接、初始化。虚拟机遇到一条`new`指令，首先去检查这个指令的参数能否在 `Metaspace` 的常量池中定位到一个类的符号引用，并且检查这个符号引用代表的类是否已经被加载，解析和初始化。（即判断类元信息是否存在）。
如果没有，那么在双亲委派模式下，使用当前类加载器以 `ClassLoader + 包名 + 类名` 为`key`进行查找对应的 `.class `文件，如果没有找到文件，则抛出 `ClassNotFoundException` 异常，如果找到，则进行类加载，并生成对应的Class对象。
2. 为对象分配内存。首先计算对象占用空间的大小，接着在堆中划分一块内存给新对象。如果实例成员变量是引用类型，仅分配引用变量空间即可，即4个字节大小。如果内存规整，则发生指针碰撞；如果内存不规整，虚拟表需要维护一个列表，即空闲列表分配。
选择哪种分配方式由Java堆是否规整所决定，而Java堆是否规整又由所采用的垃圾收集器是否带有压缩整理功能决定。
   - 指针碰撞：所有用过的内存在一边，空闲的内存放另外一边，中间放着一个指针作为分界点的指示器，分配内存就仅仅是把指针指向空闲那边挪动一段与对象大小相等的距离罢了。
   如果垃圾收集器选择的是`Serial` ，`ParNew`这种基于压缩算法的，虚拟机采用这种分配方式。一般使用带Compact（整理）过程的收集器时，使用指针碰撞。
   - 空闲列表分配：虚拟机维护了一个列表，记录上那些内存块是可用的，再分配的时候从列表中找到一块足够大的空间划分给对象实例，并更新列表上的内容。这种分配方式成为了 “空闲列表（Free List）”。
3. 处理并发问题。
   - 采用CAS配上失败重试保证更新的原子性
   - 每个线程预先分配`TLAB`，通过设置 `-XX:+UseTLAB`参数来设置，在Java8是默认开启的
4. 初始化分配到的内存，就是给对象属性赋值的操作。给所有属性设置默认值，保证对象实例字段在不赋值时可以直接使用。
   - 属性的默认初始化；
   - 显示初始化；
   - 代码块中的初始化；
   - 构造器初始化；
5. 设置对象的对象头。将对象的所属类（即类的元数据信息）、对象的 `HashCode` 和对象的GC信息、锁信息等数据存储在对象的对象头中。这个过程的具体设置方式取决于JVM实现。
6. 执行`init`方法进行初始化。初始化成员变量，执行实例化代码块，调用类的构造方法，并把堆内对象的首地址赋值给引用变量。因此一般来说（由字节码中跟随 `invokespecial` 指令所决定），new指令之后会接着执行方法，把对象按照程序员的意愿进行初始化，这样一个真正可用的对象才算完成创建出来。

## 对象组成
![Java对象的布局](/posts/annex/images/essays/Java对象的布局.png)

### 查看对象的组成
```xml
<!-- 引入查看对象布局的依赖 -->
<dependency>
    <groupId>org.openjdk.jol</groupId>
    <artifactId>jol-core</artifactId>
    <version>0.9</version>
</dependency>
```
```java
public class MainTest {
    public static void main(String[] args) {
        //这个对象里面是空的什么都没有
        T t = new T();
        System.out.println(ClassLayout.parseInstance(t).toPrintable());
    }
}
class T{}
```
```text
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header)                           a1 2c 01 20 (10100001 00101100 00000001 00100000) (536947873)
     12     4        (loss due to the next object alignment)
Instance size: 16 bytes
Space losses: 0 bytes internal + 4 bytes external = 4 bytes total
```

在64位JVM下，通过测试的结果我们可以看到Java对象的布局对象头占12byte了，因为JVM规定内存分配的字节必须是8的倍数，否则无法分配内存，所以就出现了4byte的对齐数据。
通过测试发现，Java的对象布局包括：
- 必定存在一个对象头；
- 如果分配的JVM分配的字节不是8的倍数的话，还要存在对齐数据；
- 当该类里边有变量时，还包含实例变量；

### 对象头
[官方文档](http://openjdk.java.net/groups/hotspot/docs/HotSpotGlossary.html)对于对象头的解释
>object header 
Common structure at the beginning of every GC-managed heap object.
 (Every oop points to an object header.) Includes fundamental information about the heap object's layout， type, GC state, synchronization state, and identity hash code.
 Consists of two words. In arrays it is immediately followed by a length field. Note that both Java objects and VM-internal objects have a common object header format.

大意：每个GC管理堆对象开始处的公共结构。(每个oop都指向一个对象头)包括关于堆对象布局、类型、GC状态、同步状态和标识散列代码的基本信息。
**由两个词组成**，在数组中，它后面紧跟着一个长度字段。

其中上面的**两个词**指的是，`mark word`、`klass pointer`。
>mark word
The first word of every object header. Usually a set of bitfields including synchronization state and identity hash code.
May also be a pointer (with characteristic low bit encoding) to synchronization related information.During GC, may contain GC state bits.

大意：每个对象头文件的第一个字。通常是一组位域，包括同步状态和身份散列码。也可以是一个用于同步相关信息的指针(具有特征的低位编码)。在GC期间，可能包含GC状态位。

>klass pointer
The second word of every object header. Points to another object (a metaobject) which describes the layout and behavior of the original object.
For Java objects, the "klass" contains a C++ style "vtable".

大意：每个对象头文件的第二个字。指向另一个对象(元对象)，它描述了原始对象的布局和行为。对于Java对象，“klass”包含一个c++风格的“vtable”。

简单来说，对象头包含了包括两部分，分别是标志词(`mark word`)和类型指针(`klass pointer`)。如果是数组，还需要记录数组的长度。类型指针，是对象指向它的类元数据的指针，虚拟机通过这个指针来确定这个对象是哪个类的实例。

引用上面在64位虚拟机下的测试结果，对象头中的这些二进制数字代表什么呢？
```text
 OFFSET  SIZE   TYPE DESCRIPTION                               VALUE
      0     4        (object header)                           01 00 00 00 (00000001 00000000 00000000 00000000) (1)
      4     4        (object header)                           00 00 00 00 (00000000 00000000 00000000 00000000) (0)
      8     4        (object header)                           a1 2c 01 20 (10100001 00101100 00000001 00100000) (536947873)
```

在`openjdk8-master`中`markOop.hpp`，有对`mark word`的描述：
```text
32 bits:
--------
           hash:25 ------------>| age:4    biased_lock:1 lock:2 (normal object)
           JavaThread*:23 epoch:2 age:4    biased_lock:1 lock:2 (biased object)
           size:32 ------------------------------------------>| (CMS free block)
           PromotedObject*:29 ---------->| promo_bits:3 ----->| (CMS promoted object)

64 bits:
--------
unused:25 hash:31 -->| unused:1   age:4    biased_lock:1 lock:2 (normal object)
JavaThread*:54 epoch:2 unused:1   age:4    biased_lock:1 lock:2 (biased object)
PromotedObject*:61 --------------------->| promo_bits:3 ----->| (CMS promoted object)
size:64 ----------------------------------------------------->| (CMS free block)
```
- 在32位虚拟机下，正常的对象对象头的`mark word`，从前到后的顺序，25个位表示`hash`值，4位表示GC分代的年龄，1位偏向锁的信息，2位锁的状态；
- 在64位虚拟机下，正常的对象对象头的`mark word`，从前到后的顺序，25个未使用，31个位表示hash值，未使用1位，4位表示GC分代的年龄，1位偏向锁的信息，2位锁的状态；

64位虚拟机下对象头共12个字节(96位)，`mark word`占8字节(64位)，所以`klass pointer`占4字节(32位)。但有些资料上显示，`mark word`占8字节(64位)，`klass pointer`也占8字节(64位)。
其实这种说法也正确，因为虚拟机默认开启了指针压缩，所以默认情况下`klass pointer`占4字节(32位)。

从上面可以看出，`mark word`主要存放：
```
哈希值
GC分代年龄
锁标志位
分代年龄
线程ID
```
详细的说，`markword`中存储的内容：
- `lock`：锁标志位;区分锁状态，11时表示对象待GC回收状态， 只有最后2位锁标识(11)有效。
- `biased_lock`：是否偏向锁；由于正常锁和偏向锁的锁标识都是 01，没办法区分，这里引入一位的偏向锁标识位。
- `age`：分代年龄；表示对象被GC的次数，当该次数到达阈值的时候，对象就会转移到老年代。
- `hash`: 对象的 `hashcode` ;运行期间调用`System.identityHashCode()`来计算，延迟计算，并把结果赋值到这里。当对象加锁后，计算的结果31位不够表示，在偏向锁，轻量锁，重量锁，`hashcode`会被转移到`Monitor`中。
- `JavaThread`：偏向锁的线程ID，偏向模式的时候，当某个线程持有对象的时候，对象这里就会被置为该线程的ID。 在后面的操作中，就无需再进行尝试获取锁的动作。
- `epoch`：时间戳，代表偏向锁的有效性；偏向锁在CAS锁操作过程中，偏向性标识，表示对象更偏向哪个锁。
- `ptr_to_lock_record`：轻量级锁状态下，指向栈中锁记录的指针。当锁获取是无竞争的时，JVM使用原子操作而不是OS互斥。这种技术称为轻量级锁定。在轻量级锁定的情况下，JVM通过CAS操作在对象的标题字中设置指向锁记录的指针。
- `ptr_to_heavyweight_monitor`：重量级锁状态下，指向对象监视器`Monitor`的指针。如果两个不同的线程同时在同一个对象上竞争，则必须将轻量级锁定升级到`Monitor`以管理等待的线程。在重量级锁定的情况下，JVM在对象的`ptr_to_heavyweight_monitor`设置指向`Monitor`的指针。

当然`mark word`会根据对象不同状态，存放的也不相同。对象的状态划分为5种：
- 无状态：对象刚被new出来；
- 偏向锁状态: 一个线程持有对象；
- 轻量级锁状态；
- 重量级锁状态；
- 被垃圾回收器标记的状态；

|   对象状态   | 对象头-markword |
| :----------: | ------------------------------------------------------------ |
| 无锁状态状态 | unused:25｜hash:31｜ unused:1 ｜age:4 ｜ biased_lock:1｜lock:2 |
| 偏向锁状态  | JavaThread:54｜ epoch:2｜ unused:1 ｜  age:4｜ biased_lock:1｜lock:2 |
| 轻量级锁状态 | ptr_to_lock_record:62(指向栈中锁记录的指针)｜lock：2         |
| 重量级锁状态 | Ptr_to_heavyweight_monitor:62（指向重量级锁的指针）｜lock：2 |
| 被GC标记状态 | lock：2                                                      |

对象的状态是5种，但是在`markword`中表示对象状态的`lock`却是2bit，`2bit`排列组合为，`00`、`11`、`01`、`10`，最多四种，那么对象的5种状态是怎么表示的？ 对象锁的状态是联合用`biased_lock: 1` 和 `lock: 2` 表示的：
- `biased_lock` ：0， `lock`： 01，表示无锁状态；
- `biased_lock` ：1， `lock`： 01，表示偏向锁状态；
- `lock`： 00，表示轻量级锁状态；
- `lock`： 10，表示重量级锁状态；
- `lock`： 11，表示被垃圾回收器标记的状态；

`markword`在对象的不同状态下会有不同的表现形式，主要有三种状态，无锁状态、加锁状态、GC标记状态。
那么可以理解为Java当中的获取锁，其实可以理解是给对象上锁，也就是改变对象头中`markword-lock`的状态，如果上锁成功则进入同步代码块。
Java中的锁机制分为多种类型，主要包括偏向锁、轻量级锁和重量级锁。每种锁状态对应着不同的`markword-lock`状态。

### 实例数据
实例数据为独立于方法之外的变量，在类里定义的变量无`static`修饰，包括从父类继承下来的变量和本身拥有的字段。

它的一些规则：
- 相同宽度的字段总是被分配到一起（比如都是8个字节的，会放到一起）；
- 父类中定义的变量会出现在子类之前；
- 如果JVM参数`CompactFields`设置为`true`，子类的窄变量可能插入到父类的间隙；

### 对齐填充数据
不是必须的，也没有特别的含义，仅仅起到占位符的作用。
因为JVM规定内存分配的字节必须是8的倍数，否则无法分配内存.如果对象头占得字节 + 实例变量占得字节刚好为8的倍数，对齐填充数据则不存在。

## 对象的访问定位
JVM是如何通过栈帧中的对象引用访问到其内部的对象实例呢？

![对象指针访问](/posts/annex/images/essays/对象指针访问.png)

hotspot使用的是直接访问，因为句柄访问开辟了句柄池，所以直接访问相较于句柄访问效率稍高一点。

### 句柄访问
句柄访问是在栈的局部变量表中，记录的对象的引用，然后在堆空间中开辟了一块空间，也就是句柄池，指向的是方法区中的对象类型数据。

`reference`中存储稳定句柄地址，对象被移动（垃圾收集时移动对象很普遍）时只会改变句柄中实例数据指针即可，`reference` 本身不需要被修改。

![句柄访问](/posts/annex/images/essays/句柄访问.png)

### 直接访问
直接指针是局部变量表中的引用，直接指向堆中的实例，在对象实例中有类型指针，指向的是方法区中的对象类型数据。

![直接访问](/posts/annex/images/essays/直接访问.png)

## 对象的终止机制
`finalize`方法是Java提供的对象终止机制，允许开发人员提供对象被销毁之前的自定义处理逻辑。
当垃圾回收器发现没有引用指向一个对象，即垃圾回收此对象之前，总会先调用这个对象的`finalize`方法。
```java
/**
 * Called by the garbage collector on an object when garbage collection
 * determines that there are no more references to the object.
 * A subclass overrides the {@code finalize} method to dispose of
 * system resources or to perform other cleanup.
 */
protected void finalize() throws Throwable { }
```
文档注释大意：当GC确定不再有对对象的引用时，由垃圾收集器在对象上调用。子类重写`finalize`方法来释放系统资源或执行其他清理。

简而言之，`finalize`方法是与Java中的垃圾回收器有关系。当一个对象变成一个垃圾对象的时候，如果此对象的内存被回收，那么就会调用该类中定义的`finalize`方法。
当一个对象可被回收时，就需要执行该对象的`finalize`方法，那么就有可能在该方法中让对象重新被引用，从而实现自救。自救只能进行一次，如果回收的对象之前调用了`finalize`方法自救，后面回收时不会再调用该方法。

`finalize`方法允许在子类中被重写，用于在对象被回收时进行资源释放。
通常在这个方法中进行一些资源释放和清理的工作，比如关闭文件、套接字和数据库连接等。
```java
public class MyClass {
    @Override
    protected void finalize() throws Throwable {
        try {
            // 执行清理操作，比如关闭文件或释放资源
            System.out.println("Finalize method called");
        } finally {
            super.finalize(); // 确保调用超类的 finalize 方法
        }
    }
}
```
尽管`finalize`可以被用来释放资源，但在实际开发中已经被认为是不可靠和过时的方式。永远不要主动调用某个对象的`finalize`方法，应该交给垃圾回收机制调用的原因：
- 在调用`finalize`方法时时可能会导致对象复活；
- `finalize`方法的执行时间是没有保障的，它完全由GC线程决定，极端情况下，若不发生GC，则`finalize`方法将没有执行机会。
  因为优先级比较低，即使主动调用该方法，也不会因此就直接进行回收；
- 一个糟糕的`finalize`方法会严重影响GC的性能；

如果从所有的根节点都无法访问到某个对象，说明对象己经不再使用了，一般来说，此对象需要被回收。
但事实上，也并非是“非死不可”的，这时候它们暂时处于“缓刑”阶段。一个无法触及的对象有可能在某一个条件下“复活”自己，如果这样那么对它的回收就是不合理的，为此虚拟机中定义了的对象可能的三种状态：
- 可触及的：从根节点开始，可以到达这个对象；对象存活被使用；
- 可复活的：对象的所有引用都被释放，但是对象有可能在`finalize`中复活；对象被复活，对象在`finalize`方法中被重新使用；
- 不可触及的：对象的`finalize`方法被调用，并且没有复活，那么就会进入不可触及状态；对象死亡、对象没有被使用；

只有在对象不可触及时才可以被回收，不可触及的对象不可能被复活，因为`finalize`只会被调用一次。
判定一个对象是否可回收，至少要经历两次标记过程：
- 如果对象没有没有引用链，则进行第一次标记；
- 进行筛选，判断此对象是否有必要执行`finalize`方法；
    1. 如果对象没有重写`finalize`方法，或者`finalize`方法已经被虚拟机调用过，则虚拟机视为“没有必要执行”，对象被判定为不可触及的。
    2. 如果对象重写了`finalize`方法，且还未执行过，那么会被插入到`F-Queue`队列中，由一个虚拟机自动创建的、低优先级的`Finalizer`线程触发其`finalize`方法执行。
    3. `finalize`方法是对象逃脱死亡的最后机会，稍后GC会对`F-Queue`队列中的对象进行第二次标记。如果对象在`finalize`方法中与引用链上的任何一个对象建立了联系，那么在第二次标记时，该对象会被移出“即将回收”集合。
       之后对象会再次出现没有引用存在的情况。在这个情况下，`finalize`方法不会被再次调用，对象会直接变成不可触及的状态，也就是说，一个对象的`finalize`方法只会被调用一次。

代码演示对象能否被回收：
```java
public class MainTest {

    public static MainTest var;

    /**
     * 此方法只能被调用一次
     * 可对该方法进行注释，来测试finalize方法是否能复活对象
     */
    @Override
    protected void finalize() throws Throwable {
        System.out.println("调用当前类重写的finalize()方法");
        // 复活对象 让当前带回收对象重新与引用链中的对象建立联系
        var = this;
    }

    public static void main(String[] args) throws InterruptedException {
        var = new MainTest();
        var = null;
        System.gc();
        System.out.println("-----------------第一次gc操作------------");
        // 因为Finalizer线程的优先级比较低，暂停2秒，以等待它
        Thread.sleep(2000);
        if (var == null) {
            System.out.println("对象已经死了");
            // 如果第一次对象就死亡了 就终止
            return;
        } else {
            System.out.println("对象还活着");
        }

        System.out.println("-----------------第二次gc操作------------");
        var = null;
        System.gc();
        // 下面代码和上面代码是一样的，但是 对象却自救失败了
        Thread.sleep(2000);
        if (var == null) {
            System.out.println("对象已经死了");
        } else {
            System.out.println("对象还活着");
        }
    }

}
```