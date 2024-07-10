---
title: "JavaObject类方法"
date: 2021-07-10
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-objectclass-methods"
---

## 概览
`Object`类位于`java.lang`包中，编译时会自动导入。当我们创建一个类时，如果没有明确继承一个父类，那么它就会自动继承`Object`，成为`Object`的子类。
`Object`类可以显示继承，也可以隐式继承，效果都是一样的。
```java
class A extends Object{
    // to do
}

class A {
    // to do
}
```
Java`Object`类是所有类的父类，也就是说Java的所有类都继承了`Object`。因此，`Object`类提供了一组通用的方法，这些方法可以在所有Java对象上调用。

| 方法名称              | 方法作用                                                      |
|-------------------|-----------------------------------------------------------|
| equals    | 比较两个对象是否相同                                                |
| hashCode | 获取对象的哈希值                                                  |
| toString | 返回对象的字符串表示形式                                              |
| clone    | 创建并返回一个对象的拷贝                                              |
| finalize | 当垃圾收集确定不再有对对象的引用时，由垃圾收集器在对象上调用                            |
| getClass | 获取对象运行时的类                                                 |
| notify   | 唤醒在该对象上等待的某个线程                                            |
| notifyAll | 唤醒在该对象上等待的所有线程                                            |
| wait      | 让当前线程进入等待(阻塞)状态。直到其他线程调用此对象的`notify()`方法或`notifyAll()`方法。 |

## equals
`equals`方法是Java中的一个重要方法，用于比较两个对象是否相等。默认情况下，`Object`类中的`equals`方法比较的是对象的内存地址，但许多类会重写这个方法以实现自定义的比较逻辑。
`Object`类中的`equals()`源码如下：
```java
  public boolean equals(Object obj) {
      return (this == obj);
  }
```
该实现只是简单地比较两个对象的引用是否相同，即是否指向同一个内存地址。

### 等价关系
在Java中，`equals`方法用于确定两个对象是否相等。为了正确实现这个方法，必须确保它满足等价关系的要求。等价关系是一种自反的、对称的和传递的关系。
具体来说，`equals`方法必须遵循以下规则：
- 自反性：对于任何非`null`的引用值`x`，`x.equals(x)`必须返回`true`。
- 对称性：对于任何非`null`的引用值`x`和`y`，如果`x.equals(y)`返回`true`，那么`y.equals(x)`也必须返回`true`。
- 传递性：对于任何非`null`的引用值`x`、`y`和`z`，如果`x.equals(y)`返回`true`，并且`y.equals(z)`返回`true`，那么`x.equals(z)`也必须返回`true`。
- 一致性：对于任何非`null`的引用值`x`和`y`，只要对象的状态没有改变，多次调用`x.equals(y)`应当返回相同的结果。
- 非空性：对于任何非`null`的引用值`x`，`x.equals(null)`必须返回`false`。

### 与双等号
对于基本类型，`==`判断两个值是否相等，基本类型没有`equals()`方法。对于引用类型，`==`判断两个变量是否引用同一个对象，而`equals()`判断引用的对象是否等价。
```text
Integer x = new Integer(1);
Integer y = new Integer(1);
System.out.println(x.equals(y)); // true
System.out.println(x == y);      // false
```

`equals()`作用是判断两个对象是否相等，但一般有两种情况：
1. 类没有覆盖`equals`方法，则相当于通过 `==`来比较这两个对象的地址；
2. 类覆盖`equals`方法，一般我们通过`equals()`来比较两个对象的内容是否相等，相等则返回`true`；

之前有一道经典的面试题，问的就是`==`和`equals`的区别。
`==`运算符比较两个引用是否指向同一个对象。
`equals`方法比较两个对象的内容是否相等。默认情况下，`Object`类中的`equals`方法比较的是对象的内存地址，但许多类会重写这个方法以比较对象的内容。

### 重写equals方法
`equals()`在不重写的情况下与`==`作用一样，都是比较的内存中的地址，但是`equals()`可以重写。
重写`equals`方法的目的是为了定义对象内容相等的逻辑。默认的`equals`方法比较内存地址，而我们通常需要比较对象的内容。
重写`equals`方法一般思路：
1. 检查是否为同一个对象的引用，如果是直接返回`true`；
2. 检查是否是同一个类型，如果不是，直接返回`false`；
3. 将`Object`对象进行转型；
4. 判断每个关键域是否相等；
```java
public class EqualExample {

    private int x;
    private int y;
    private int z;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EqualExample that = (EqualExample) o;

        if (x != that.x) return false;
        if (y != that.y) return false;
        return z == that.z;
    }
}
```

## hashCode
在Java中`hashcode`方法是`Object`类的`native`方法，返回值为int类型，根据一定的规则将与对象相关的信息，如对象的存储地址，对象的字段等，映射成一个数值，这个数值称作为`hash`值。
`hashCode`方法在Java中非常重要，尤其在使用哈希表（如`HashMap`、`HashSet`等）时。`hashCode`方法返回一个整数，该整数称为对象的哈希码。这个哈希码用于确定对象在哈希表中的存储位置。

为了使`hashCode`方法正确工作，并确保在集合中对象的行为正确，必须遵循以下约定：
- 如果两个对象不相等，它们的哈希码不一定要不同。但是不相等的对象产生不同哈希码，总体上呈均匀分布，可以提高哈希表的性能。
- 在程序的同一执行过程中，只要对象的信息没有被修改，多次调用`hashCode`方法应该返回相同的整数。
- 如果根据`equals`方法，两个对象是相等的，那么调用这两个对象的`hashCode`方法必须返回相同的整数。

`hashCode`方法源码：
```java
public native int hashCode();
```
根据这个方法的声明可知，该方法返回一个`int`类型的数值，并且是本地方法，因此在`Object`类中并没有给出具体的实现。

### 唯一性
对于包含容器类型的程序设计语言来说，基本上都会涉及到`hashCode`。
在Java中也一样，`hashCode`方法的主要作用是为了配合基于散列的集合一起正常运行，这样的散列集合包括`HashSet、HashMap`以及`HashTable`。

在集合中已经存在上万条数据或更多的数据场景下向集合中插入对象时，如何判别在集合中是否已经存在该对象了？

如果采用`equals`方法去逐一比较，效率必然是一个问题，此时`hashCode`方法的优点就体现出来了。
因为两个不同的对象可能会有相同的`hashCode`值，所有不能通过`hashCode`值来判断两个对象是否相等，但是可以直接根据`hashcode`值判断两个对象不等，如果两个对象的`hashCode`值不等，则必定是两个不同的对象。
当集合要添加新的对象时，先调用这个对象的`hashCode`方法，得到对应的`hashcode`值，如果存放的`hash`值中没有该`hashcode`值，它就可以直接存进去，不用再进行任何比较了。
如果存在该`hashcode`值，就调用它的`equals`方法与新元素进行比较，相同的话就不存了，不相同就去存。

需要额外注意的是，设计`hashCode`方法时最重要的因素就是，无论何时，对同一个对象调用`hashCode()`都应该产生同样的值。
如果在将一个对象用`put()`添加进`HashMap`时产生一个`hashCdoe`值，而用`get()`取出时却产生了另一个`hashCode`值，那么就无法获取该对象了。
所以如果你的`hashCode`方法依赖于对象中易变的数据，就要当心了，因为此数据发生变化时，`hashCode()`方法就会生成一个不同的散列码，从而获取不到该对象。
所以在重写`hashCode`方法和`equals`方法的时候，如果对象中的数据易变，则最好在`equals`方法和`hashCode`方法中不要依赖于该字段。
```java
public class MainTest {
    public static void main(String[] args) {
        Person p1 = new Person("lucy", 22);
        // 85134311
        System.out.println(p1.hashCode());
        HashMap<Person, Integer> hashMap = new HashMap<>();
        hashMap.put(p1, 1);
        p1.setAge(13);
        // null
        System.out.println(hashMap.get(p1));
    }
}

class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    @Override
    public int hashCode() {
        return name.hashCode() * 37 + age;
    }

    @Override
    public boolean equals(Object obj) {
        return this.name.equals(((Person) obj).name) && this.age == ((Person) obj).age;
    }
}
```

### hashCode与equals
`hashCode()`返回散列值，而`equals()`是用来判断两个对象是否等价。等价的两个对象散列值一定相同，但是散列值相同的两个对象不一定等价。
`equals()`地址比较是通过对象的哈希值来比较的。`hash`值是由`hashCode`方法产生的，`hashCode`属于`Object`类的本地方法，默认使用`==`比较两个对象。
如果`equals()`相等`，hashcode`一定相等，如果`hashcode`相等，`equals`不一定相等。所以在覆盖`equals`方法时应当总是覆盖`hashCode`方法，保证等价的两个对象散列值也相等。

下面的代码中，新建了两个等价的对象，并将它们添加到`HashSet`中。
我们希望将这两个对象当成一样的，只在集合中添加一个对象，但是因为`EqualExample`没有实现`hashCode()`方法，因此这两个对象的散列值是不同的，最终导致集合添加了两个等价的对象。
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
所以在覆盖 `equals()`方法时应当总是覆盖`hashCode`方法，保证等价的两个对象散列值也相等。

### 重写hashCode方法
重写`hashCode`方法规则：
- 把某个非零的常数值，保存在一个名为`result`的int类型的常量中；
- 字段值哈希码的计算：
    - 如果是`boolean`类型，`true`为1，`false`则为0；
    - 如果是`byte、char、short`和`int`类型，需要强制转为int的值；
    - 如果是`long`类型，计算`(int)(f^(f>>32))`；
    - 如果是`float`类型，计算`Float.floatToIntBits(f)`；
    - 如果是`double`类型，计算`Double.doubleToLongBits(f)`，再按照`long`的方法进行计算；
    - 如果是引用类型，则调用其`hashCode`方法，假设其`hashCode`满足你的需求；
- 代入公式`result = result * 31 + c`，返回`result`；

《Effective Java》的作者推荐使用基于17和31的散列码的算法：
```java
@Override
public int hashCode() {
    int result = 17;
    result = 31 * result + x;
    result = 31 * result + y;
    result = 31 * result + z;
    return result;
}
```
Java7新增的`Objects`类提供了计算`hashCode`的通用方法，可以很简洁实现`hashCode`方法：
```java
@Override
public int hashCode() {
    return Objects.hash(name,age);
}
```
现在比较流行的写法是用`Lombok`，在类上使用`@EqualsAndHashCode`注解：
```java
@EqualsAndHashCode
public class Person {
    private String name;
    private int age;

    // 构造方法、getter、setter等略
}
```

## toString
`toString`方法是`Object`类里定义的，默认返回类名和它的引用地址，即`ToStringExample@4554617c`这种形式。其中@后面的数值为散列码的无符号十六进制表示。
通常情况下，`toString`方法返回一个字符串，该字符串包含对象的状态信息，便于调试和日志记录。`Object`类`toString`源代码如下：
```java
public String toString() {
    return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

### 重写toString方法
当我们打印一个对象的引用时，实际是默认调用这个对象的`toString`方法。
当打印的对象所在类没有重写`Object`中的`toString()`方法时，默认调用的是`Object`类中`toString()`方法，返回此对象所在的类及对应的堆空间对象实体的首地址值。
```java
public class MainTest {
    public static void main(String[] args) {
        // object.ToStringDemo@511d50c0
        System.out.println(new ToStringDemo());
    }
}
class ToStringDemo {
    private String name;
}
```
当我们打印对象所在类重写了`toString()`，调用的就是已经重写了的`toString`方法，一般重写是将类对象的属性信息返回。
```java
public class MainTest {
    public static void main(String[] args) {
        ToStringDemo toStringDemo = new ToStringDemo();
        toStringDemo.setName("lucy");
        // ToStringDemo{name='lucy'}
        System.out.println(toStringDemo);
    }
}
class ToStringDemo {
    private String name;

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "ToStringDemo{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

### 使用toString
一般情况下，使用`toString`：
```java
public class MainTest {
    public static void main(String[] args) {
        // object.ToStringDemo@511d50c0
        System.out.println(new ToStringDemo().toString());
    }
}
```

还有有一种隐式的调用方法，当你将一个对象与字符串进行拼接操作时，如果对象不是字符串类型，Java会自动调用该对象的`toString`方法来获取其字符串表示形式，然后再与其他字符串拼接起来。
这种行为可以让代码更加简洁和易读，而不需要显式调用`toString`方法。 
```java
public class MainTest {
    public static void main(String[] args) {
        Date time = new Date();
        System.out.println("time = " + time);//相当于下一行代码
        System.out.println("time = " + time.toString());
    }
}
```
基本数据类型转换为`String`类型也是调用了对应包装类的`toString`方法，如`Integer`、`Double`等。
```text
int i = 10;
System.out.println("i=" + i);
```

## clone
在Java中可以使用`clone`方法用于创建并返回一个对象的副本，对象克隆指的是创建一个新的对象，新对象的内容与原始对象相同。
```java
protected native Object clone() throws CloneNotSupportedException;
```
要在自定义类中实现对象的克隆，需要执行以下步骤：
- 实现`Cloneable`接口，这是一个标记接口，自身没有方法；
- 覆盖重写`clone`方法，可见性提升为`public`；

### Cloneable接口
`Cloneable`接口是Java开发中常用的一个接口，它是一个标记接口。
如果一个想要拷贝一个对象，就需要重写`Object`中的`clone`方法并让其实现`Cloneable`接口。如果只重写`clone`方法，不实现`Cloneable`接口就会报`CloneNotSupportedException`异常。
```java
protected native Object clone() throws CloneNotSupportedException;
```
应当注意的是，`clone`方法并不是`Cloneable`接口的方法，而是`Object`的一个`protected`方法。
`Cloneable`接口只是规定，如果一个类没有实现`Cloneable`接口又调用了`clone`方法，就会抛出`CloneNotSupportedException`。
换言之，`clone`方法规定了想要拷贝对象，就需要实现`Cloneable`方法，`clone`方法让`Cloneable`接口变得有意义。
```java
public class CloneExample implements Cloneable {
    private int a;
    private int b;

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }
}
```

### 浅拷贝与深拷贝
拷贝分为浅拷贝与深拷贝：
- 浅拷贝：被复制对象的所有值属性都含有与原来对象的相同，而所有的对象引用属性仍然指向原来的对象；
- 深拷贝：在浅拷贝的基础上，所有引用其他对象的变量也进行了`clone`，并指向被复制过的新对象；

如果一个被复制的属性都是基本类型，那么只需要实现当前类的`Cloneable`机制就可以了，此为浅拷贝。
如果被复制对象的属性包含其他实体类对象引用，那么这些实体类对象都需要实现`Cloneable`接口并覆盖`clone`方法。

- 浅拷贝创建一个新对象，这个新对象的字段内容与原对象相同，但如果字段是引用类型（比如数组、对象），浅拷贝只复制引用地址，不复制引用的实际对象。
    ```java
    class MyObject implements Cloneable {
        int value;
        int[] array;
    
        MyObject(int value, int[] array) {
            this.value = value;
            this.array = array;
        }
    
        @Override
        protected Object clone() throws CloneNotSupportedException {
            return super.clone(); // 浅拷贝
        }
    
        public static void main(String[] args) {
            try {
                int[] arr = {1, 2, 3};
                MyObject original = new MyObject(42, arr);
                MyObject copy = (MyObject) original.clone();
                original.array[0] = 99;
                System.out.println(copy.array[0]); // 输出 99
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
            }
        }
    }
    ```
- 深拷贝创建一个新对象，这个新对象和原对象完全独立，包括复制所有引用类型字段的实际对象，而不仅仅是引用地址。
    ```java
    class MyObject implements Cloneable {
        int value;
        int[] array;
    
        MyObject(int value, int[] array) {
            this.value = value;
            this.array = array;
        }
    
        @Override
        protected MyObject clone() throws CloneNotSupportedException {
            int[] arrayCopy = array.clone(); // 复制数组
            return new MyObject(value, arrayCopy);
        }
    
        public static void main(String[] args) {
            try {
                int[] arr = {1, 2, 3};
                MyObject original = new MyObject(42, arr);
                MyObject copy = original.clone();
                original.array[0] = 99;
                System.out.println(copy.array[0]); // 输出 1
            } catch (CloneNotSupportedException e) {
                e.printStackTrace();
            }
        }
    }
    ```

### clone的替代
虽然`Cloneable`和`clone()`方法在Java中是标准的浅拷贝方式，但它们在实际开发中不太常用。主要是因为使用`clone()`方法来拷贝一个对象即复杂又有风险，它会抛出异常，并且还需要类型转换。
《Effective Java》 书上讲到，最好不要去使用 `clone()`，可以使用拷贝构造函数或者拷贝工厂来拷贝一个对象。
```java
public class CloneConstructorExample {

    private int[] arr;

    public CloneConstructorExample() {
        arr = new int[10];
        for (int i = 0; i < arr.length; i++) {
            arr[i] = i;
        }
    }

    public CloneConstructorExample(CloneConstructorExample original) {
        arr = new int[original.arr.length];
        for (int i = 0; i < original.arr.length; i++) {
            arr[i] = original.arr[i];
        }
    }

    public void set(int index, int value) {
        arr[index] = value;
    }

    public int get(int index) {
        return arr[index];
    }
}
```
```text
CloneConstructorExample e1 = new CloneConstructorExample();
CloneConstructorExample e2 = new CloneConstructorExample(e1);
e1.set(2, 222);
System.out.println(e2.get(2)); // 2
```

## finalize
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

## getClass
`getClass`方法是Java中的一个重要方法，它用于返回对象的运行时类。这个方法定义在`java.lang.Object`类中，因此每个Java对象都可以调用它。
```java
/**
 * Returns the runtime class of this {@code Object}. The returned
 * {@code Class} object is the object that is locked by {@code
 * static synchronized} methods of the represented class.
 */
 public final native Class<?> getClass();
```
文档大意：返回这个对象的运行时类，返回的`Class`对象是被表示类的`static synchronized`方法锁定的对象。

`getClass`方法返回对象运行时的类，返回的类型是`Class`类型的对象。可以通过这个`Class`对象来创建调用这个方法的对象和执行一些其他操作，这便是反射的入口。
```java
public class MainTest {
  public static void main(String[] args) throws Exception {
    String str = "Hello, World!";
    Class<?> clazz = str.getClass();

    Method method = clazz.getMethod("substring", int.class, int.class);
    String result = (String) method.invoke(str, 7, 12);

    System.out.println("Result: " + result); // Output: World
  }
}

```
在某些情况下，需要比较两个对象是否属于同一类型。通过`getClass`方法可以方便地进行类型比较。
```java
public class MainTest {
    public static void main(String[] args) {
        String str1 = "Hello";
        String str2 = "World";
        Integer num = 42;

        if (str1.getClass() == str2.getClass()) {
            System.out.println("str1 and str2 are of the same type.");
        }

        if (str1.getClass() != num.getClass()) {
            System.out.println("str1 and num are of different types.");
        }
    }
}
```

## notify
`notify`方法用于唤醒在该对象监视器上等待的一个线程。如果有多个线程在该对象上等待，具体唤醒哪一个线程是由线程调度器决定的，并且是不确定的。
被唤醒的线程将继续执行，从调用`wait`方法的地方开始。
```java
public final void notify();
```
`notify`适用于有多个线程等待一个共享资源，但每次只能一个线程进行处理的情况。
例如，生产者-消费者模型中，当有一个生产者线程生产了一个产品，可以使用`notify`唤醒一个消费者线程来消费该产品。
```java
class SharedResource {
    private Queue<Integer> queue = new LinkedList<>();
    private final int CAPACITY = 5;

    public synchronized void produce(int value) throws InterruptedException {
        while (queue.size() == CAPACITY) {
            wait();
        }
        queue.add(value);
        System.out.println("Produced: " + value);
        notify(); // 唤醒一个等待的消费者线程
    }

    public synchronized void consume() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        int value = queue.poll();
        System.out.println("Consumed: " + value);
        notify(); // 唤醒一个等待的生产者线程
    }
}

public class NotifyExample {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();

        Thread producer = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    resource.produce(i);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        Thread consumer = new Thread(() -> {
            try {
                for (int i = 0; i < 10; i++) {
                    resource.consume();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        producer.start();
        consumer.start();
    }
}
```

## notifyAll
`notifyAll`方法用于唤醒在该对象监视器上等待的所有线程。所有被唤醒的线程将竞争对象的监视器锁，只有一个线程能成功获得锁并继续执行。
```java
public final void notifyAll();
```
`notifyAll`适用于多个线程等待同一个条件，并且当条件满足时，需要所有等待的线程都重新检查条件的情况。
例如，在某些复杂的同步场景中，当某个状态变化需要通知所有等待线程时，使用`notifyAll`可以确保所有等待的线程都被唤醒并检查新状态。
```java
class SharedResource {
    private Queue<Integer> queue = new LinkedList<>();
    private final int CAPACITY = 5;

    public synchronized void produce(int value) throws InterruptedException {
        while (queue.size() == CAPACITY) {
            wait();
        }
        queue.add(value);
        System.out.println("Produced: " + value);
        notifyAll(); // 唤醒所有等待的消费者线程
    }

    public synchronized void consume() throws InterruptedException {
        while (queue.isEmpty()) {
            wait();
        }
        int value = queue.poll();
        System.out.println("Consumed: " + value);
        notifyAll(); // 唤醒所有等待的生产者线程
    }
}

public class NotifyAllExample {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();

        Thread producer1 = new Thread(() -> {
            try {
                for (int i = 0; i < 5; i++) {
                    resource.produce(i);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        Thread producer2 = new Thread(() -> {
            try {
                for (int i = 5; i < 10; i++) {
                    resource.produce(i);
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        Thread consumer1 = new Thread(() -> {
            try {
                for (int i = 0; i < 5; i++) {
                    resource.consume();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        Thread consumer2 = new Thread(() -> {
            try {
                for (int i = 0; i < 5; i++) {
                    resource.consume();
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        });

        producer1.start();
        producer2.start();
        consumer1.start();
        consumer2.start();
    }
}
```

## wait
`wait`方法使当前线程进入等待状态，同时`wait()`也会让当前线程释放它所持有的锁。
直到其他线程调用该对象的`notify`方法或`notifyAll`方法来唤醒它，或者在指定的时间内没有被唤醒。该方法必须在同步块或同步方法中调用。
```java
public final void wait() throws InterruptedException;
public final void wait(long timeout) throws InterruptedException;
public final void wait(long timeout, int nanos) throws InterruptedException;
```
- `wait()`：使当前线程无限期等待，直到被唤醒。
- `wait(long timeout)`：使当前线程等待指定的毫秒数后自动唤醒。
- `wait(long timeout, int nanos)`：使当前线程等待指定的时间（以毫秒和纳秒为单位）后自动唤醒。

```java
public class WaitNotifyExample {
    private static final Object lock = new Object();

    public static void main(String[] args) throws InterruptedException {
        Thread waitingThread = new Thread(() -> {
            synchronized (lock) {
                try {
                    System.out.println("Thread is waiting...");
                    lock.wait();
                    System.out.println("Thread is resumed.");
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

        Thread notifyingThread = new Thread(() -> {
            synchronized (lock) {
                System.out.println("Thread is notifying...");
                lock.notify();
            }
        });

        waitingThread.start();
        Thread.sleep(1000); // Ensure waitingThread starts waiting
        notifyingThread.start();
    }
}
```

需要注意区分`wait`方法与`sleep`方法，很多人分不清。`sleep`和`wait`方法异同点：
- `sleep()`属于`Thread`类，`wait()`属于`Object`类；
- `sleep()`和`wait()`都会抛出`InterruptedException`异常，这个异常属于`checkedException`是不可避免；
- 两者比较的共同之处是，都是使程序等待多长时间。不同的是调用`sleep()`不会释放锁，会使线程堵塞，而调用`wait()`会释放锁，让线程进入等待状态，用 `notify()`、`notifyall()`可以唤醒，或者等待时间到了；这是因为，如果没有释放锁，那么其它线程就无法进入对象的同步方法或者同步控制块中，那么就无法执行 `notify()` 或者 `notifyAll()` 来唤醒挂起的线程，造成死锁。
- `wait()`必须在同步`synchronized`块里使用，`sleep()`可以在任意地方使用；

其中"`wait()`必须在同步`synchronized`块里使用"，使其不止`wait`方法，`notify、notifyAll`也和`wait`方法一样，必须在`synchronized`块里使用，为什么呢？

是为了避免丢失唤醒问题。假设没有`synchronized`修饰，使用了`wait`方法而没有设置等待时间，也没有调用唤醒方法或者唤醒方法调用的时机不对，这个线程将会永远的堵塞下去。
`wait`、`notify`、`notifyAll`方法调用的时候要释放锁，你都没给它加锁，他怎么释放锁。所以如果没在`synchronized`块中调用`wait()、notify、notifyAll`方法是肯定抛异常的。
