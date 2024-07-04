---
title: "JavaIO"
date: 2021-04-09
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-io"
---

## 概览
IO，即`in`和`out`的缩写，也就是输入和输出，指应用程序和外部设备之间的数据传递，常见的外部设备包括文件、管道、网络连接。
传统的IO是通过流技术来处理的。`Java IO`通过数据流、序列化和文件系统提供输入和输出。

流（`Stream`），是一个抽象的概念，是指一连串的数据（字符或字节），是以先进先出的方式发送信息的通道。
代表任何有能力产出数据的数据源对象或者是有能力接受数据的接收端对象。流的作用就是为数据源和目的地建立一个输送通道。

一般来说关于流的特性有以下几点：
- 先进先出：最先写入输出流的数据最先被输入流读取到。
- 顺序存取：可以一个接一个地往流中写入一串字节，读出时也将按写入顺序读取一串字节，不能随机访问中间的数据，`RandomAccessFile`除外。
- 只读或只写：每个流只能是输入流或输出流的一种，不能同时具备两个功能，输入流只能进行读操作，对输出流只能进行写操作。
在一个数据传输通道中，如果既要写入数据又要读取数据，则要分别提供两个流。

## 流的分类
![JavaIO流分类](/iblog/posts/annex/images/essays/JavaIO流分类.png)

根据数据传输特性将流抽象为各种类，方便更直观的进行数据操作。主要的分类方式有以下3种：
- 按数据流的方向：分为输入流、输出流；
- 按处理数据单位：分为字节流、字符流；
- 按功能：分为节点流、处理流；

看上面的几个分类可能会感觉到有些混乱，那什么时候用字节流？什么时候该用输出流呢？
1. 首先自己要知道是选择输入流还是输出流，这就要根据自己的情况而定，如果你想从程序写东西到别的地方，那么就选择输出流，反之用输入流。
2. 然后考虑你传输数据时，是选择使用字节流传输还是字符流，也就是每次传1个字节还是2个字节，有中文肯定就选择字符流了。
3. 前面两步就可以选出一个合适的节点流了，比如字节输入流`InputStream`，如果要在此基础上增强功能，那么就在处理流中选择一个合适的即可。

### 输入流与输出流
输入流和输出流是Java中用于处理字节数据的抽象类，它们提供了读取和写入数据的方法，用于处理各种数据源和目标，如文件、网络连接等。
此输入、输出是相对于我们写的代码程序而言。
- 输入流：从别的地方获取资源输入到我们的程序中；如从数据源（如文件、网络连接、内存等）读取数据；
  ```java
  InputStream inputStream = new FileInputStream("file.txt");
  int data;
  while ((data = inputStream.read()) != -1) {
      // 处理读取的数据
  }
  inputStream.close();
  ```
- 输出流：从我们的程序中输出到别的地方；如将一个字符串保存到本地文件中，就需要使用输出流；
  ```java
  OutputStream outputStream = new FileOutputStream("output.txt");
  String data = "Hello, World!";
  byte[] bytes = data.getBytes();
  outputStream.write(bytes);
  outputStream.close();
  ```
输入流和输出流是Java中用于处理字节数据的基本抽象，它们提供了读取和写入数据的方法，能够处理各种数据源和目标。
在实际应用中，根据需求选择合适的输入流或输出流的子类，并结合缓冲区等机制提高数据处理效率。

### 字节流与字符流
字节流和字符流的用法几乎完成全一样，区别在于字节流和字符流所操作的数据单元不同。字节流操作的单元是数据单元是8位的字节，而字符流操作的是数据单元为16位的字符。

>字符流的由来
Java中字符是采用`Unicode`标准，一个字符是16位，即一个字符使用两个字节来表示。
为此，Java中引入了处理字符的流。因为数据编码的不同，而有了对字符进行高效操作的流对象。本质其实就是基于字节流读取时，去查了指定的码表。
在`Unicode`编码中，一个英文为一个字节，一个中文为两个字节。如果使用字节流处理中文，如果一次读写一个字符对应的字节数就不会有问题，一旦将一个字符对应的字节分裂开来，就会出现乱码了。

字节流以字节为单位进行数据读写，适合处理二进制数据（如图像、音频等）和文本数据。
```java
InputStream inputStream = new FileInputStream("file.txt");
int data;
while ((data = inputStream.read()) != -1) {
    // 处理读取的字节数据
}
inputStream.close();
```
字符流以字符为单位进行数据读写，适合处理文本数据（如文本文件、字符串等）。
```java
Reader reader = new FileReader("file.txt");
int data;
while ((data = reader.read()) != -1) {
    // 处理读取的字符数据
}
reader.close();
```

在Java中，字节流和字符流之间的转换可以通过`InputStreamReader`和`OutputStreamWriter`进行。
这两个类分别将`InputStream`转换为`Reader`，以及将`OutputStream`转换为`Writer`。
```java
// 字节输入流转换为字符输入流
public class ByteToCharStreamExample {
    public static void main(String[] args) {
        try (FileInputStream fileInputStream = new FileInputStream("example.txt");
             InputStreamReader inputStreamReader = new InputStreamReader(fileInputStream, "UTF-8");
             BufferedReader bufferedReader = new BufferedReader(inputStreamReader)) {

            String line;
            while ((line = bufferedReader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
```java
// 字节输出流转换为字符输出流
public class CharToByteStreamExample {
    public static void main(String[] args) {
        try (FileOutputStream fileOutputStream = new FileOutputStream("output.txt");
             OutputStreamWriter outputStreamWriter = new OutputStreamWriter(fileOutputStream, "UTF-8");
             BufferedWriter bufferedWriter = new BufferedWriter(outputStreamWriter)) {

            bufferedWriter.write("这是一个字符流到字节流的示例。");
            bufferedWriter.newLine();
            bufferedWriter.write("Hello, world!");

        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

字节流一般用来处理图像、视频、音频、`PPT、Word`等类型的文件。字符流一般用于处理纯文本类型的文件，如`txt`文件等，但不能处理图像视频等非文本文件。
用一句话说就是，字节流可以处理一切文件，而字符流只能处理纯文本文件。
字节流本身没有缓冲区，缓冲字节流相对于字节流，效率提升非常高。而字符流本身就带有缓冲区，缓冲字符流相对于字符流效率提升就不是那么大了。

### 节点流与处理流
按功能不同分为节点流、处理流：
- 节点流：节点流直接连接到数据源（如文件、网络连接、内存等），负责实际的数据读写操作。
  ```java
  // 文件输入节点流
  InputStream inputStream = new FileInputStream("file.txt");
  // 文件输出节点流
  OutputStream outputStream = new FileOutputStream("output.txt"); 
  ```
- 处理流：处理流不直接操作数据源，而是通过包装在节点流上来增强其功能和处理能力。处理流的构造方法始终接受另一个流对象作为参数。
通过多层包装，处理流形成了对节点流的封装，但实际的数据处理操作仍由底层节点流完成。
  ```java
  InputStream inputStream = new FileInputStream("file.txt");
  // 使用处理流包装节点流
  BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream)); 
  ```

## 序列化
序列化是将对象的状态信息转换为可存储或传输的形式的过程。一个对象可以被表示为一个字节序列，该字节序列包括该对象的数据、有关对象的类型的信息和存储在对象中数据的类型。
序列化是一种数据的持久化手段。一般广泛应用于网络传输，`RMI`和`RPC`等场景中。一般是以字节码或XML格式传输。而字节码或XML编码格式可以还原为完全相等的对象。

将序列化对象写入文件之后，可以从文件中读取出来，这个相反的过程称为反序列化。

### 序列化作用
序列化机制允许将实现序列化的Java对象转换位字节序列，这些字节序列可以保存在磁盘上，或通过网络传输，以达到以后恢复成原来的对象。
序列化机制使得对象可以脱离程序的运行而独立存在。

对象序列化机制是Java语言内建的一种对象持久化方式，通过对象序列化，可以把对象的状态保存为字节数组，
并且可以在有需要的时候将这个字节数组通过反序列化的方式再转换成对象。对象序列化可以很容易的在JVM中的活动对象和字节流之间进行转换。

由于序列化整个过程都是Java虚拟机独立的，也就是说，在一个平台上序列化的对象可以在另一个完全不同的平台上反序列化该对象。
在Java中，对象的序列化与反序列化被广泛应用到RMI(远程方法调用)及网络传输中。

### 使用序列化
使用Java对象序列化在保存对象时，会把其状态保存为一组字节，在未来再将这些字节组装成对象。
必须注意地是，对象序列化保存的是对象的"状态"，即它的成员变量。所以对象序列化不会关注类中的静态变量。

如果需要将某个对象保存到磁盘上或者通过网络传输，那么这个类应该实现`Serializable`接口或`Externalizable`接口。

#### Serializable
类的可序列化性是通过实现`java.io.Serializable`接口的类来启用的。没有实现此接口的类的任何状态都不会被序列化或反序列化。
可序列化类的所有子类型本身都是可序列化的。序列化接口没有方法或字段，只用于标识可序列化的语义。

为了允许非序列化类的子类型被序列化，子类型可以承担保存和恢复超类型的公共、受保护和(如果可以访问)包字段的状态的责任。
只有当它所继承的类有一个可访问的无参数构造函数来初始化类的状态时，子类型才可以承担这种责任。如果不是这种情况，则声明一个类可序列化是错误的，该错误将在运行时检测到。

当试图对一个对象进行序列化的时候，如果遇到未实现`Serializable`接口的对象。在此情况下，将抛出`NotSerializableException`，并标识非`serializable`对象的类。
实现`Serializable`序列化反序列对象化代码演示：
```java
public class MainTest {
    public static void main(String[] args) {
//       serialUser();
        System.out.println("----------反序列化对象----------");
        unSerialUser();
    }

    private static void serialUser (){
        User user = new User();
        user.setName("Jane");
        user.setAge("100");
        System.out.println(user);
        try(ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("./user.txt"));) {
            oos.writeObject(user);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void unSerialUser() {
        File file = new File("./user.txt");
        try(ObjectInputStream ois  = new ObjectInputStream(new FileInputStream(file))) {
            User newUser = (User) ois.readObject();
            System.out.println(newUser);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

}

class User implements Serializable {
    private String name;
    private String age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age='" + age + '\'' +
                '}';
    }
}
```

#### Externalizable
`Externalizable`继承了`Serializable`，该接口中定义了两个抽象方法：`writeExternal`()与`readExternal()`。
当使用`Externalizable`接口来进行序列化与反序列化的时候，需要开发人员重写`writeExternal()`与`readExternal()`。

还有一点值得注意，在使用`Externalizable`进行序列化的时候，在读取对象时，会调用被序列化类的无参构造器去创建一个新的对象，然后再将被保存对象的字段的值分别填充到新对象中。
所以在实现`Externalizable`接口的类必须要提供一个`public`的无参的构造器。如果`User`类中没有无参数的构造函数，在反序列化时会抛出异常：
```text
java.io.InvalidClassException: content.posts.rookie.User; no valid constructor
```
实现`Externalizable`序列化反序列对象化代码演示：
```java
public class MainTest {
    public static void main(String[] args) {
//       serialUser();
        System.out.println("----------反序列化对象----------");
        unSerialUser();
    }

    private static void serialUser ()  {
        User user = new User();
        user.setName("Jane");
        user.setAge("100");
        System.out.println(user);
        // /将对象序列化到文件
        try(ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("./user.txt"));) {
            oos.writeObject(user);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void unSerialUser() {
        File file = new File("./user.txt");
        try(ObjectInputStream ois  = new ObjectInputStream(new FileInputStream(file))) {
            User newUser = (User) ois.readObject();
            System.out.println(newUser);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

}

class User implements Externalizable {

    public User() {
    }

    private String name;
    private String age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age='" + age + '\'' +
                '}';
    }

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(name);
        out.writeObject(age);
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        name = (String) in.readObject();
        age = (String) in.readObject();
    }
}
```

#### transient
对于一个类中的某些字段如果不需要序列化，就需要加上`transient`关键字。
被`transient`修饰的成员变量，在序列化的时候其值会被忽略，在被反序列化后，`transient`变量的值被设为初始值，如`int`型的是0，引用类型的是`null`。
此时`name`字段将不会被序列化，当然如果一个变量被`static`修饰，它也不会被序列化。这是因为`static`字段属于类，而不是类的具体实例。
```java
// 该字段不会被序列化
private transient String name;
private static String address;
```
当你不希望某个成员变量的状态被序列化时，可以使用`transient`关键字。通常这种情况是因为该变量的状态是临时的，或者该变量包含敏感信息（如密码），不应在序列化过程中保存。

### serialVersionUID
[//]: # (写到了这里)
虚拟机是否允许反序列化， 不仅取决于类路径和功能代码是否⼀致， ⼀个⾮常重要的⼀点是两个类的序列化 ID 是否⼀致， 即`serialVersionUID`要求⼀致。
因为⽂件存储中的内容可能被篡改，为了保证数据的安全，在进⾏反序列化时，JVM会把传来的字节流中的`serialVersionUID`与本地相应实体类的`serialVersionUID`进⾏⽐较， 如果相同就认为是⼀致的， 可以进⾏反序列化。
否则就会出现序列化版本不⼀致的异常，即`InvalidCastException`。

`Serializable`接口注释：
>  If a serializable class does not explicitly declare a serialVersionUID,
then the serialization runtime will calculate a default 
serialVersionUID value for that class based on various aspects of the class, 
as described in the Java(TM) Object Serialization Specification. 
 However, it is strongly recommended that all serializable classes explicitly declare serialVersionUID values,
since the default serialVersionUID computation is highly sensitive to class details that may vary depending on compiler implementations,
and can thus result in unexpectedInvalidClassExceptions during deserialization.
  
大意：当实现`java.io.Serializable`接口的类没有显式地定义⼀个`serialVersionUID`变量时候，Java序列化机制会根据编译的Class⾃动⽣成⼀个`serialVersionUID`作序列化版本⽐较⽤,
这种情况下，如果Class⽂件没有发⽣变化，就算再编译多次， `serialVersionUID`也不会变化的。但是，如果发⽣了变化，那么这个⽂件对应的`serialVersionUID`也就会发⽣变化。

Java强烈建议用户自定义一个`serialVersionUID`,因为默认的`serialVersinUID`对于class的细节非常敏感，
反序列化时可能会导致`InvalidClassException`这个异常。

代码演示序列化、反序列化加上`serialVersionUID`
```
private static final long serialVersionUID = 1L;
```

```
public class MainTest {
    public static void main(String[] args) {
        System.out.println("----------序列化对象----------");
        serialUser();
        System.out.println("----------反序列化对象----------");
        unSerialUser();
    }

    private static void serialUser (){
        User user = new User();
        user.setName("Jane");
        user.setAge("100");
        System.out.println(user);
        try(ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("./user.txt"));) {
            oos.writeObject(user);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void unSerialUser() {
        File file = new File("./user.txt");
        try(ObjectInputStream ois  = new ObjectInputStream(new FileInputStream(file))) {
            User newUser = (User) ois.readObject();
            System.out.println(newUser);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

}

class User implements Serializable {
    private static final long serialVersionUID = 1L;

    private String name;
    private String age;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAge() {
        return age;
    }

    public void setAge(String age) {
        this.age = age;
    }

    @Override
    public String toString() {
        return "User{" +
                "name='" + name + '\'' +
                ", age='" + age + '\'' +
                '}';
    }
}
```
```
java.io.InvalidClassException: co.test.User; local class incompatible: stream classdesc serialVersionUID = -1643371274357194431, local class serialVersionUID = 1
```

代码调用链：
```
ObjectInputStream.readObject -> readObject0 -> readOrdinaryObject -> readClassDesc -> readNonProxyDesc -> ObjectStreamClass.initNonProxy
```

在`initNonProxy`中 ，关键代码如下：
```
 void initNonProxy(ObjectStreamClass model,
                      Class<?> cl,
                      ClassNotFoundException resolveEx,
                      ObjectStreamClass superDesc)
        throws InvalidClassException
    {
        long suid = Long.valueOf(model.getSerialVersionUID());
        ObjectStreamClass osc = null;
        if (cl != null) {
            osc = lookup(cl, true);
            if (osc.isProxy) {
                throw new InvalidClassException(
                        "cannot bind non-proxy descriptor to a proxy class");
            }
            if (model.isEnum != osc.isEnum) {
                throw new InvalidClassException(model.isEnum ?
                        "cannot bind enum descriptor to a non-enum class" :
                        "cannot bind non-enum descriptor to an enum class");
            }

            // ========== 判断反序列化 serializableUID 是否一致 ========== start//
            if (model.serializable == osc.serializable &&
                    !cl.isArray() &&
                    suid != osc.getSerialVersionUID()) {
                throw new InvalidClassException(osc.name,
                        "local class incompatible: " +
                                "stream classdesc serialVersionUID = " + suid +
                                ", local class serialVersionUID = " +
                                osc.getSerialVersionUID());
            }
            // ========== 判断反序列化 serializableUID 是否一致 ========== end//

            if (!classNamesEqual(model.name, osc.name)) {
                throw new InvalidClassException(osc.name,
                        "local class name incompatible with stream class " +
                                "name \"" + model.name + "\"");
            }
            
            // ...
   
```
`getSerialVersionUID`方法：

```
public long getSerialVersionUID() {
    // REMIND: synchronize instead of relying on volatile?
    if (suid == null) {
        suid = AccessController.doPrivileged(
            new PrivilegedAction<Long>() {
                public Long run() {
                    return computeDefaultSUID(cl);
                }
            }
        );
    }
    return suid.longValue();
}
```

在没有定义`serialVersionUID`的时候，会调用`computeDefaultSUID`方法，生成一个默认的`serialVersionUID`。

`serialVersionUID`有两种显示的生成方式： 
- 默认的1L，比如：`private static final long serialVersionUID = 1L; `
- 根据类名、接口名、成员方法及属性等来生成一个64位的哈希字段，比如： `private static final  long   serialVersionUID = xxxxL;`

第二种方式可通过编译器进行配置：
![idea检查serialVersionUID](/iblog/posts/annex/images/essays/idea检查serialVersionUID.png)

![idea自动生成serialVersionUID](/iblog/posts/annex/images/essays/idea自动生成serialVersionUID.png)

### 序列化底层原理

#### 如何自定义的序列化和反序列化策略?

通过在被序列化的类中增加 writeObject 和 readObject 方法来实现。

在`java.util.ArrayList`中我们能找到答案：
```
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{
    private static final long serialVersionUID = 8683452581122892189L;
    transient Object[] elementData; // non-private to simplify nested class access
    private int size;
}

```
ArrayList实现了`java.io.Serializable`接口，那么我们就可以对它进行序列化及反序列化。
因为`elementData`是 `transient` 的，所以这个成员变量不会被序列化而保留下来.

ArrayList底层是通过数组实现的。
那么数组elementData其实就是用来保存列表中的元素的。通过该属性的声明方式我们知道，它是无法通过序列化持久化下来的。
那么为什么却通过序列化和反序列化把List中的元素保留下来了呢？

```
public static void main(String[] args) throws IOException, ClassNotFoundException {
        List<String> stringList = new ArrayList<String>();
        stringList.add("hello");
        stringList.add("world");
        stringList.add("hollis");
        stringList.add("chuang");
        System.out.println("init StringList" + stringList);
        ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream("stringlist"));
        objectOutputStream.writeObject(stringList);

        IOUtils.close(objectOutputStream);
        File file = new File("stringlist");
        ObjectInputStream objectInputStream = new ObjectInputStream(new FileInputStream(file));
        List<String> newStringList = (List<String>)objectInputStream.readObject();
        IOUtils.close(objectInputStream);
        if(file.exists()){
            file.delete();
        }
        System.out.println("new StringList" + newStringList);
    }
//init StringList[hello, world, hollis, chuang]
//new StringList[hello, world, hollis, chuang]

```

> 在序列化过程中，如果被序列化的类中定义了`writeObject` 和 `readObject` 方法，虚拟机会试图调用对象类里的 `writeObject` 和 `readObject` 方法，进行用户自定义的序列化和反序列化。
>  
> 如果没有这样的方法，则默认调用是 `ObjectOutputStream` 的 `defaultWriteObject` 方法以及 `ObjectInputStream` 的 `defaultReadObject` 方法。
>  
> 用户自定义的 `writeObject` 和 `readObject` 方法可以允许用户控制序列化的过程，比如可以在序列化的过程中动态改变序列化的数值。
> 对象的序列化过程通过 `ObjectOutputStream` 和 `ObjectInputputStream` 来实现的.


ArrayList实际上是动态数组，每次在放满以后自动增长设定的长度值，如果数组自动增长长度设为100，
而实际只放了一个元素，那就会序列化99个null元素。为了保证在序列化的时候不会将这么多null同时进行序列化，
ArrayList把元素数组设置为transient。

为了防止一个包含大量空对象的数组被序列化，为了优化存储，所以，ArrayList使用transient来声明elementData。
但是，作为一个集合，在序列化过程中还必须保证其中的元素可以被持久化下来，
所以，通过重写writeObject 和 readObject方法的方式把其中的元素保留下来。

- `writeObject` 方法把 `elementData` 数组中的元素遍历的保存到输出流（`ObjectOutputStream`）中。
- `readObject` 方法从输入流（`ObjectInputStream`）中读出对象并保存赋值到 `elementData` 数组中。



#### 在一个类中定义了 `writeObject` 和 `readObject` 方法，那么这两个方法是怎么被调用的呢?

在使用 `ObjectOutputStream` 的 `writeObject` 方法和 `ObjectInputStream` 的 `readObject` 方法时，会通过反射的方式调用。

`ObjectOutputStream中writeObject`的调用栈：
> writeObject ---> writeObject0 --->writeOrdinaryObject--->writeSerialData--->**invokeWriteObject**

> 调用表示的 `serializable` 类的 `writeObject` 方法。
如果类描述符不与类相关联，或者该类是可外部化、不可序列化的，或者没有定义 `writeObject`，
则抛出 `UnsupportedOperationException`。
>  
>类定义的writeObject方法，如果没有则为null

`invokeWriteObject`方法
```
    /**
     * Invokes the writeObject method of the represented serializable class.
     * Throws UnsupportedOperationException if this class descriptor is not
     * associated with a class, or if the class is externalizable,
     * non-serializable or does not define writeObject.
     */
    void invokeWriteObject(Object obj, ObjectOutputStream out)
        throws IOException, UnsupportedOperationException
    {
        requireInitialized();
        if (writeObjectMethod != null) {
            try {

                // ========== 调用writeObject 方法 start========== //
                writeObjectMethod.invoke(obj, new Object[]{ out });
                // ========== 调用writeObject 方法 end========== //

            } catch (InvocationTargetException ex) {
                Throwable th = ex.getTargetException();
                if (th instanceof IOException) {
                    throw (IOException) th;
                } else {
                    throwMiscException(th);
                }
            } catch (IllegalAccessException ex) {
                // should not occur, as access checks have been suppressed
                throw new InternalError(ex);
            }
        } else {
            throw new UnsupportedOperationException();
        }
    }
```
```
    /** class-defined writeObject method, or null if none */
    private Method writeObjectMethod;
```



#### 为什么实现了`Serializable`接口就能保证对象序列化？

`ObjectOutputStream中writeObject`的调用栈：
> writeObject ---> **writeObject0** --->writeOrdinaryObject--->writeSerialData--->invokeWriteObject

`writeObject0`方法
```
 /**
     * Underlying writeObject/writeUnshared implementation.
     */
    private void writeObject0(Object obj, boolean unshared)
        throws IOException
    {
        boolean oldMode = bout.setBlockDataMode(false);
        depth++;
        try {
           // ... 

            // remaining cases
            if (obj instanceof String) {
                writeString((String) obj, unshared);
            } else if (cl.isArray()) {
                writeArray(obj, desc, unshared);
            } else if (obj instanceof Enum) {
                writeEnum((Enum<?>) obj, desc, unshared);
            // =============================
            } else if (obj instanceof Serializable) {
                writeOrdinaryObject(obj, desc, unshared);
            } else {
                if (extendedDebugInfo) {
                    throw new NotSerializableException(
                        cl.getName() + "\n" + debugInfoStack.toString());
                } else {
                    throw new NotSerializableException(cl.getName());
                }
            }
            // =============================
        } finally {
            // ... 
        }
    }
```

在进行序列化操作时，会判断要被序列化的类是否是 `String、Enum、Array` 和 `Serializable` 类型，
如果不是则直接抛出 `NotSerializableException`。



### 序列化与单例模式

#### 序列化破坏单例
为什么序列化可以破坏单例了？

序列化会通过反射调用无参数的构造方法创建一个新的对象。

```
public class MainTest {
    public static void main(String[] args) throws Exception {
        String path = "/Users/whitepure/github/iblog/blog-site/content/posts/rookie/singleton.txt";

        //Write Obj to file
        ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream(path));
        oos.writeObject(Singleton.getSingleton());

        //Read Obj from file
        File file = new File(path);
        ObjectInputStream ois = new ObjectInputStream(new FileInputStream(file));
        Singleton newInstance = (Singleton) ois.readObject();

        //判断是否是同一个对象
        System.out.println(newInstance == Singleton.getSingleton());
    }

}

class Singleton implements Serializable {
    private static final long serialVersionUID = 6377402142849822126L;

    private volatile static Singleton singleton;

    private Singleton() {
    }

    public static Singleton getSingleton() {
        if (singleton == null) {
            synchronized (MainTest.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }
}
```
输出结果为false，对`Singleton` 的序列化与反序列化得到的对象是一个新的对象，这就破坏了 `Singleton` 的单例性。

#### 分析原因
对象的序列化过程通过 `ObjectOutputStream` 和 `ObjectInputputStream` 来实现的

`ObjectInputStream` 中 `readObject` 的调用栈：
> readObject ---> readObject0 ---> readOrdinary ---> checkResolve

`readOrdinaryObject` 方法

> 读取并返回"ordinary"(即，不是字符串，类，ObjectStreamClass，数组，或枚举常量)对象，如果对象的类是不可解析的，则为null(在这种情况下，ClassNotFoundException将与对象的句柄相关联)。
设置passHandle为对象的赋值句柄。

```
    /**
     * Reads and returns "ordinary" (i.e., not a String, Class,
     * ObjectStreamClass, array, or enum constant) object, or null if object's
     * class is unresolvable (in which case a ClassNotFoundException will be
     * associated with object's handle).  Sets passHandle to object's assigned
     * handle.
     */
    private Object readOrdinaryObject(boolean unshared)
        throws IOException
    {

        // ...

        Object obj;
        try {
            // `desc.isInstantiable()`: 如果一个 `serializable/externalizable` 的类可以在运行时被实例化，那么该方法就返回true
            // `desc.newInstance`：该方法通过反射的方式调用无参构造方法新建一个对象
            obj = desc.isInstantiable() ? desc.newInstance() : null;
        } catch (Exception ex) {
            throw (IOException) new InvalidClassException(
                desc.forClass().getName(),
                "unable to create instance").initCause(ex);
        }

        // ...

        // hasReadResolveMethod:如果实现了serializable 或者 externalizable接口的类中包含readResolve则返回true
        if (obj != null &&
            handles.lookupException(passHandle) == null &&
            desc.hasReadResolveMethod())
        {
            // invokeReadResolve:通过反射的方式调用要被反序列化的类的readResolve方法。
            Object rep = desc.invokeReadResolve(obj);
            if (unshared && rep.getClass().isArray()) {
                rep = cloneArray(rep);
            }
            // ...
        }

        return obj;
    }

```
#### 解决
在 `Singleton` 中定义 `readResolve` 方法，并在该方法中指定要返回的对象的生成策略，就可以防止单例被破坏。
```
class Singleton implements Serializable {
    private static final long serialVersionUID = 6377402142849822126L;

    private volatile static Singleton singleton;

    private Singleton() {
    }

    public static Singleton getSingleton() {
        if (singleton == null) {
            synchronized (MainTest.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }

    public Object readResolve() {
        return singleton;
    }
}
```

## IO模型
IO模型共有5种：阻塞IO、非阻塞IO、信号驱动IO、IO多路转接、异步IO。其中，前四个被称为同步IO。

### 阻塞式IO模型
BIO（Blocking IO）：最传统的一种IO模型，即在读写数据过程中会发生阻塞现象。

当用户线程发出IO请求之后，内核会去查看数据是否就绪，如果没有就绪就会等待数据就绪，而用户线程就会处于阻塞状态，用户线程交出CPU。
当数据就绪之后，内核会将数据拷贝到用户线程，并返回结果给用户线程，用户线程才解除block状态。

特点：
- 进程阻塞挂起不消耗CPU资源，及时响应每个操作；
- 适用并发量小的网络应用开发；

因为一个请求IO会阻塞进程，不能充分利用cpu资源，所以，得为每请求分配一个处理进程（线程）以及时响应，系统开销大；不适用并发量大的应用。

### 非阻塞IO模型
NIO（NoBlocking IO）：当用户线程发起一个read操作后，并不需要等待，而是马上就得到了一个结果。
如果结果是一个error时，它就知道数据还没有准备好，于是它可以再次发送read操作。
一旦内核中的数据准备好了，并且又再次收到了用户线程的请求，那么它马上就将数据拷贝到了用户线程，然后返回。

特点：
- 进程轮询（重复）调用，消耗CPU的资源；
- 适用并发量较小、且不需要及时响应的网络应用开发；

在非阻塞IO模型中，用户线程需要不断地询问内核数据是否就绪，也就说非阻塞IO不会交出CPU，而会一直占用CPU。

### IO复用模型
IO复用模型: 一个线程不断去轮询多个socket的状态，只有当socket真正有读写事件时，才真正调用实际的IO读写操作。
在多路复用IO模型中，只需要使用一个线程就可以管理多个socket，系统不需要建立新的进程或者线程，也不必维护这些线程和进程，并且只有在真正有socket读写事件进行时，才会使用IO资源，所以它大大减少了资源占用。

[Java NIO](#nio)实际上就是多路复用IO。
通过`selector.select()`查询每个通道是否有到达事件，如果没有事件，则一直阻塞在那里，因此这种方式会导致用户线程的阻塞。所以，多路复用IO比较适合连接数比较多的情况。
![IO多路复用模型](/iblog/posts/annex/images/essays/IO多路复用模型.png)

特点：
- 专一进程解决多个进程IO的阻塞问题，性能好;
- 适用高并发服务应用开发：一个进程响应多个请求；

>多路复用IO为何比非阻塞IO模型的效率高？
因为在非阻塞IO中，不断地询问socket状态是通过用户线程去进行的，而在多路复用IO中，轮询每个socket状态是内核在进行的，这个效率要比用户线程要高的多。

多路复用IO模型是通过轮询的方式来检测是否有事件到达，并且对到达的事件逐一进行响应。
因此对于多路复用IO模型来说，一旦事件响应体很大，那么就会导致后续的事件迟迟得不到处理，并且会影响新的事件轮询。

### 信号驱动IO模型
当用户线程发起一个IO请求操作，会给对应的socket注册一个信号函数，然后用户线程会继续执行不阻塞,
当内核数据就绪时会发送一个信号给用户线程，用户线程接收到信号之后，便在信号函数中调用IO读写操作来进行实际的IO请求操作。

进程预先告知内核，使得当某个socket有事件发生时，系统内核使用信号通知相关进程。

特点：
- 回调机制，实现、开发应用难度较大；

### 异步IO模型
AIO（Async IO）：当用户线程发起IO操作后，立刻就可以开始去做其它的事。
另一方面，从内核的角度，当它收到一个IO请求之后，它会立刻返回给用户线程，说明IO请求已经成功发起了，因此不会对用户线程产生任何阻塞。
然后，内核会等待数据准备完成，然后将数据拷贝到用户线程，当这一切都完成之后，内核会给用户线程发送一个信号，告诉它IO操作完成了。

用户线程完全不需要知道实际的整个IO操作是如何进行的，只需要先发起一个请求，当接收内核返回的成功信号时表示IO操作已经完成，可以直接去使用数据了。

在异步IO模型中，IO操作的两个阶段都不会阻塞用户线程，这两个阶段都是由内核自动完成，然后发送一个信号告知用户线程操作已完成。

用户线程中不需要再次调用IO函数进行具体的读写。
这点是和信号驱动模型有所不同的，在信号驱动模型中，当用户线程接收到信号表示数据已经就绪，然后需要用户线程调用IO函数进行实际的读写操作；
而在异步IO模型中，收到信号表示IO操作已经完成，不需要再在用户线程中调用IO函数进行实际的读写操作。

特点：
- 不阻塞，数据一步到位；
- 需要操作系统的底层支持，linux 2.5 版本内核首现，2.6 版本产品的内核标准特性；
- 实现、开发应用难度大，需要开发者合理控制；
- 非常适合高性能高并发应用；

## NIO
`Java NIO `解释为： `New IO` 或 `Non Blocking IO` 是从Java 1.4 版本开始引入的一个新的IO API，可以替代标准的`Java IO` API。
NIO支持面向缓冲区的、基于通道的IO操作。NIO将以更加高效的方式进行文件的读写操作。

与传统IO的区别：
| 区别 | IO                 | NIO                    |
| ---- | ------------------ | ---------------------- |
| 传输方式    | 面向流，通过流传输 | 面向缓冲区，通过缓冲区传输 |
| 是否阻塞    | 阻塞IO             | 非阻塞IO               |
| 其他    | 无                   | 选择器，可以解决阻塞问题  |


![IO](/iblog/posts/annex/images/essays/IO与NIO-1.png)

![NIO](/iblog/posts/annex/images/essays/IO与NIO-2.png)

### 通道与缓冲区
通道负责传输，缓冲区负责存储。

若需要使用 NIO ，需要获取用于连接 IO 设备的通道以及用于容纳数据的缓冲区。然后操作缓冲区，对数据进行处理。

#### 缓冲区
缓冲区：在java NIO 中负者数据的存储。缓冲区底层实现是数组。用于存储不同类型的数据。
根据数据类型的不同(boolean 除外)，有以下 Buffer 常用子类：
- ByteBuffer
- CharBuffer
- ShortBuffer
- IntBuffer
- LongBuffer
- FloatBuffer
- DoubleBuffer

##### 常用API及属性解析
在父类抽象类Buffer中存在四个核心属性：
- capacity：容量，表示缓冲区中最大存储数据的容量。一旦声明不能改变。
- limit：界限，表示缓冲区中可以操作数据的大小。(limit后数据不能进行读写)
- position：位置，表示缓冲区中正在操作数据的位置。
- mark:标记，表示记录当前position位置。可以通过reset()恢复到mark的位置。

大小关系：`0<=mark<=position<=limit<=capacity`

存储数据：
- put():存入数据到缓冲区中
- put(byte b)：将给定单个字节写入缓冲区的当前位置
- put(byte[] src)：将 src 中的字节写入缓冲区的当前位置
- put(int index, byte b)：将指定字节写入缓冲区的索引位置

flip(): 切换为读取数据模式

读取数据：
- get():获取缓存区中的数据
- get() ：读取单个字节
- get(byte[] dst)：批量读取多个字节到 dst 中
- get(int index)：读取指定索引位置的字节

clear(): 清空缓冲区；但是缓冲区中的数据依然存在，只是将position、limit 的值回归到初始值

position、limit 数值变化：
- 使用 put() 存储数据时，把 position 向前移动，移动长度为要存储数据的长度；
- 使用 filp() 切换为只读模式时，把 position 的值赋值给 limit，在将 position 的值归零；
- 使用 get() 读取数据时，在把 position 移动，移动的长度为想要读取的长度，但是要小于等于 limit 的位置；
- 使用 rewind() 切换为重读模式时，将 position、limit 恢复到使用 filp() 方法时的值；
- 使用 clear() 清空缓冲区，将position、limit 的值回归到初始值；

代码演示
```
public class MainTest {
    public static void main(String[] args) {
        String str = "abcde";
        ByteBuffer allocate = ByteBuffer.allocate(1024);
        allocate.put(str.getBytes());
        System.out.println("========向ByteBuffer添加数据========");
        System.out.println(str);
        System.out.println("capacity: "+ allocate.capacity());
        System.out.println("limit: " + allocate.limit());
        System.out.println("position: " + allocate.position());

        allocate.flip();
        System.out.println("========切换为读取数据模式========");
        System.out.println("capacity: "+ allocate.capacity());
        System.out.println("limit: " + allocate.limit());
        System.out.println("position: " + allocate.position());

        byte[] bytes = str.getBytes();
        allocate.get(bytes);
        System.out.println("========从ByteBuffer取出数据========");
        System.out.println(new String(bytes, 0, bytes.length));
        System.out.println("capacity: "+ allocate.capacity());
        System.out.println("limit: " + allocate.limit());
        System.out.println("position: " + allocate.position());

        allocate.rewind();
        System.out.println("========切换重新读取数据模式========");
        System.out.println("capacity: "+ allocate.capacity());
        System.out.println("limit: " + allocate.limit());
        System.out.println("position: " + allocate.position());

        allocate.clear();
        System.out.println("========清空缓冲区========");
        System.out.println("capacity: "+ allocate.capacity());
        System.out.println("limit: " + allocate.limit());
        System.out.println("position: " + allocate.position());
        System.out.println("再来读取数据：" + (char)allocate.get());
    }
}
```

mark方法: 记录当前position位置。可以通过 reset() 恢复到 mark 的位置。

代码演示
```
public class MainTest {
    public static void main(String[] args) {
        String str = "abcde";
        ByteBuffer allocate = ByteBuffer.allocate(1024);

        allocate.put(str.getBytes());

        allocate.flip();

        byte[] bytes = str.getBytes();
        allocate.get(bytes, 0, 2);
        System.out.println("========从ByteBuffer取出数据========");
        System.out.println(new String(bytes, 0, 2));
        System.out.println("capacity: " + allocate.capacity());
        System.out.println("limit: " + allocate.limit());
        System.out.println("position: " + allocate.position());

        allocate.mark();
        System.out.println("========记录当前 `position` 的位置========");
        System.out.println("capacity: " + allocate.capacity());
        System.out.println("limit: " + allocate.limit());
        System.out.println("position: " + allocate.position());

        allocate.get(bytes, 2, 2);
        System.out.println("========从ByteBuffer再次取出数据========");
        System.out.println(new String(bytes, 2, 2));
        System.out.println("capacity: " + allocate.capacity());
        System.out.println("limit: " + allocate.limit());
        System.out.println("position: " + allocate.position());

        allocate.reset();
        System.out.println("========恢复之前被标记的位置========");
        System.out.println("capacity: " + allocate.capacity());
        System.out.println("limit: " + allocate.limit());
        System.out.println("position: " + allocate.position());
    }
}
```

##### 非直接缓冲区与直接缓冲区
直接缓冲区：通过 `allocateDirect()` 方法分配直接缓冲区，将缓冲区建立在物理内存中。可以提高读写效率。

![直接缓冲区](/iblog/posts/annex/images/essays/直接缓冲区.png)

非直接缓冲区：通过 `allocate()` 方法分配缓冲区，将缓冲区建立在JVM的内存中。

`allocate()`方法返回的缓冲区进行分配和取消分配所需成本通常高于非直接缓冲区 。
直接缓冲区的内容可以驻留在常规的垃圾回收堆之外.

![非直接缓冲区](/iblog/posts/annex/images/essays/非直接缓冲区.png)

```
public class MainTest {
    public static void main(String[] args) {
        ByteBuffer allocate = ByteBuffer.allocate(1024);
        ByteBuffer direct = ByteBuffer.allocateDirect(1024);

        if (direct.isDirect()){
            System.out.println("allocateDirect 是直接缓冲区");
        }
        if (!allocate.isDirect()){
            System.out.println("allocate 是非直接缓冲区");
        }
    }
}
```
#### 通道
通道(Channel):用于源节点与目标节点的连接。在 `java NIO` 中负责缓冲区中数据的传输。Channel本身不存储数据，需要配合缓冲区进行数据传输。


在操作系统中，通道是一种通过执行通道程序管理I/O操作的控制器，它使主机（CPU和内存）与I/O操作之间达到更高的并行程度。
需要进行I/O操作时，CPU只需启动通道，然后可以继续执行自身程序，通道则执行通道程序，管理与实现I/O操作。

##### 操作通道
通道的主要实现类：
- `FileChannel`：用于读取、写入、映射和操作文件的通道。
- `SocketChannel`：通过 TCP 读写网络中的数据。
- `ServerSocketChannel`：可以监听新进来的 TCP 连接，对每一个新进来的连接都会创建一个 `SocketChannel`。
- `DatagramChannel`：通过 UDP 读写网络中的数据通道。

Java 针对支持通道的类提供了 `getChannel()` 方法

使用 非直接缓冲区 完成对文件的读写
```
public class MainTest {
    /**
     * 使用非直接缓冲区完成读写操作
     * @param args args
     */
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        try (
                // 获取通道
                FileChannel inChannel = new FileInputStream("1.jpg").getChannel();
                FileChannel outChannel = new FileOutputStream("2.jpg").getChannel();
        ) {
            // 分配指定大小的缓冲区
            ByteBuffer buf = ByteBuffer.allocate(1024);

            // 将通道中的数据存入缓冲区中
            while (inChannel.read(buf) != -1) {

                // 切换读取数据的模式
                buf.flip();

                // 将缓冲区中的数据写入通道中
                outChannel.write(buf);

                // 清空缓冲区
                buf.clear();
            }

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            long end = System.currentTimeMillis();
            System.out.println("耗费的时间为：" + (end - start));
        }
    }
}

```
使用 直接缓冲区 完成对文件的读写
```
public class MainTest {
    /**
     * 使用直接缓冲区完成文件的读写
     *
     * @param args args
     */
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        try (
                FileChannel inChannel = FileChannel.open(Paths.get("1.jpg"), StandardOpenOption.READ);
                FileChannel outChannel = FileChannel.open(Paths.get("2.jpg"), StandardOpenOption.WRITE, StandardOpenOption.READ, StandardOpenOption.CREATE);
        ) {

            //内存映射文件
            MappedByteBuffer inMappedBuf = inChannel.map(FileChannel.MapMode.READ_ONLY, 0, inChannel.size());
            MappedByteBuffer outMappedBuf = outChannel.map(FileChannel.MapMode.READ_WRITE, 0, inChannel.size());

            //直接对缓冲区进行数据的读写操作
            byte[] dst = new byte[inMappedBuf.limit()];
            inMappedBuf.get(dst);
            outMappedBuf.put(dst);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            long end = System.currentTimeMillis();
            System.out.println("耗费的时间为：" + (end - start));
        }
    }
}
```
使用 通道 完成对文件的读写
```
public class MainTest {
    /**
     * 使用通道完成读写操作
     *
     * @param args args
     */
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        try (
                // 获取通道
                FileChannel inChannel = FileChannel.open(Paths.get("1.jpg"), StandardOpenOption.READ);
                FileChannel outChannel = FileChannel.open(Paths.get("2.jpg"), StandardOpenOption.WRITE, StandardOpenOption.READ, StandardOpenOption.CREATE);
        ) {

            //内存映射文件
            MappedByteBuffer inMappedBuf = inChannel.map(FileChannel.MapMode.READ_ONLY, 0, inChannel.size());
            MappedByteBuffer outMappedBuf = outChannel.map(FileChannel.MapMode.READ_WRITE, 0, inChannel.size());
            
            //直接对缓冲区进行数据的读写操作
            byte[] dst = new byte[inMappedBuf.limit()];
            inMappedBuf.get(dst);
            outMappedBuf.put(dst);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            long end = System.currentTimeMillis();
            System.out.println("耗费的时间为：" + (end - start));
        }
    }
}
```
分散读取和聚集写入：
- 分散读取（Scattering Reads）：将通道中的数据分散到多个缓冲区中
- 聚集写入（Gathering Writes）：将多个缓冲区中的数据聚集到通道中
```
public class MainTest {
    /**
     * 分散和聚集
     *
     * @param args args
     */
    public static void main(String[] args) {
        long start = System.currentTimeMillis();
        try (
            // 分散读取通道
            FileChannel channel1 = new RandomAccessFile("1.txt", "rw").getChannel();
            // 聚集写入通道
            FileChannel channel2 = new RandomAccessFile("2.txt", "rw").getChannel();
        ) {
            // 分配指定大小的缓冲区
            ByteBuffer buf1 = ByteBuffer.allocate(100);
            ByteBuffer buf2 = ByteBuffer.allocate(1024);

            // 分散读取
            ByteBuffer[] bufs = {buf1, buf2};
            channel1.read(bufs);

            for (ByteBuffer byteBuffer : bufs) {
                byteBuffer.flip();
            }

            System.out.println(new String(bufs[0].array(), 0, bufs[0].limit()));
            System.out.println("--------------------");
            System.out.println(new String(bufs[1].array(), 0, bufs[1].limit()));

            // 聚集写入
            channel2.write(bufs);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            long end = System.currentTimeMillis();
            System.out.println("耗费的时间为：" + (end - start));
        }
    }
}
```

解码与编码：
- 编码：字符串转化为字符数组的过程
- 解码：字符数组转化为字符串的过程
```
public class MainTest {
    /**
     * 编码与解码
     *
     * @param args args
     */
    public static void main(String[] args) {
        Charset cs1 = Charset.forName("GBK");

        //获取编码器
        CharsetEncoder ce = cs1.newEncoder();

        //获取解码器
        CharsetDecoder cd = cs1.newDecoder();

        CharBuffer cBuf = CharBuffer.allocate(1024);
        cBuf.put("阿伟死了");
        cBuf.flip();

        ByteBuffer bBuf;
        try {
            //编码
            bBuf = ce.encode(cBuf);
            for (int i = 0; i < 8; i++) {
                System.out.println(bBuf.get());
            }
            bBuf.flip();

            //解码
            CharBuffer cBuf2 = cd.decode(bBuf);
            System.out.println(cBuf2.toString());

        } catch (CharacterCodingException e) {
            e.printStackTrace();
        }
    }
}

```
### 阻塞与非阻塞网络通信

#### 阻塞
传统的 IO 流都是阻塞式的。
就是说，当一个线程调用 `read()` 或 `write()` 时，该线程被阻塞，直到有一些数据被读取或写入，该线程在此期间不能执行其他任务。
因此，在完成网络通信进行 IO 操作时，由于线程会阻塞，所以服务器端必须为每个客户端都提供一个独立的线程进行处理，当服务器端需要处理大量客户端时，性能急剧下降。

阻塞式IO,代码演示
```
class Client {
    public static void main(String[] args) throws IOException {
        System.out.println("启动客户端 ...");
        client();
    }

    /**
     * 阻塞NIO 客户端
     */
    public static void client() throws IOException {
        SocketChannel sChannel=SocketChannel.open(new InetSocketAddress("127.0.0.1",9898));
        FileChannel inChannel=FileChannel.open(Paths.get("/Users/whitepure/Desktop/1.txt"), StandardOpenOption.READ);
        ByteBuffer buf=ByteBuffer.allocate(1024);

        while(inChannel.read(buf)!=-1){
            buf.flip();
            sChannel.write(buf);
            buf.clear();
        }

        //关闭发送通道，表明发送完毕
        sChannel.shutdownOutput();

        //接收服务端的反馈
        int len=0;
        while((len=sChannel.read(buf))!=-1){
            buf.flip();
            System.out.println(new String(buf.array(),0,len));
            buf.clear();
        }
        inChannel.close();
        sChannel.close();
    }
}

class Server {
    public static void main(String[] args) throws IOException {
        System.out.println("启动服务端 ...");
        server();
    }
    /**
     * 阻塞IO 服务器方
     */
    public static void server() throws IOException{
        ServerSocketChannel ssChannel=ServerSocketChannel.open();
        FileChannel outChannel=FileChannel.open(Paths.get("/Users/whitepure/Desktop/2.txt"), StandardOpenOption.WRITE,StandardOpenOption.CREATE);
        ssChannel.bind(new InetSocketAddress(9898));
        SocketChannel sChannel=ssChannel.accept();
        ByteBuffer buf=ByteBuffer.allocate(1024);
        
        while(sChannel.read(buf)!=-1){
            buf.flip();
            outChannel.write(buf);
            buf.clear();
        }

        //发送反馈给客户端
        buf.put("服务端接收数据成功".getBytes());
        buf.flip();
        sChannel.write(buf);

        sChannel.close();
        outChannel.close();
        ssChannel.close();
    }
}
```
#### 非阻塞
Java NIO 是非阻塞模式的。
当线程从某通道进行读写数据时，若没有数据可用时，该线程可以进行其他任务。线程通常将非阻塞 IO 的空闲时间用于在其他通道上执行 IO 操作，所以单独的线程可以管理多个输入和输出通道。
因此，NIO 可以让服务器端使用一个或有限几个线程来同时处理连接到服务器端的所有客户端。

非阻塞式IO,代码演示
```
class Client {
    public static void main(String[] args) throws IOException {
        System.out.println("启动客户端 ... 等待输入 ...");
        client();
    }

    /**
     * 非阻塞NIO 客户端
     */
    public static void client() throws IOException {
        SocketChannel sChannel = SocketChannel.open(new InetSocketAddress("127.0.0.1", 9898));
        ByteBuffer buf = ByteBuffer.allocate(1024);

        Scanner scanner = new Scanner(System.in);

        // 发送数据到服务方
        while (scanner.hasNextLine()) {
            buf.put((LocalDate.now() + "\n" + scanner.next()).getBytes());
            buf.flip();
            sChannel.write(buf);
            buf.clear();
        }
        sChannel.close();
    }
}

class Server {
    public static void main(String[] args) throws IOException {
        System.out.println("启动服务端 ... 等待客户端请求 ...");
        server();
    }

    /**
     * 非阻塞IO 服务器方
     */
    public static void server() throws IOException {
        ServerSocketChannel ssChannel = ServerSocketChannel.open();

        // 切换为非阻塞模式
        ssChannel.configureBlocking(false);
        // 绑定链接
        ssChannel.bind(new InetSocketAddress(9898));

        // 获取选择器
        Selector selector = Selector.open();

        /**
         * 将通道注册到选择器上，并且指定“监听接收事件”
         * 使用 SelectionKey 的四个常量 表示
         *
         * 读 : SelectionKey.OP_READ （1）
         * 写 : SelectionKey.OP_WRITE （4）
         * 连接 : SelectionKey.OP_CONNECT （8）
         * 接收 : SelectionKey.OP_ACCEPT （16）
         *
         * 若注册时不止监听一个事件，则可以使用“位或”操作符连接。
         */
        SelectionKey selectionKey = ssChannel.register(selector, SelectionKey.OP_ACCEPT);

        // 轮巡获取 注册器上的接收事件
        while (selector.select() > 0) {
            // 获取当前选择器中所有注册的“选择键（已就绪的监听事件）”
            Iterator<SelectionKey> it = selector.selectedKeys().iterator();

            while (it.hasNext()) {
                // 获取准备“就绪”的事件
                SelectionKey sk = it.next();

                // 判断具体是什么时间准备就绪
                if (sk.isAcceptable()) {
                    // 若“接收就绪”，获取客户端连接
                    SocketChannel sChannel = ssChannel.accept();

                    // 切换非阻塞模式
                    sChannel.configureBlocking(false);

                    // 将该通道注册到选择器上
                    sChannel.register(selector, SelectionKey.OP_READ);
                } else if (sk.isReadable()) {
                    // 获取当前选择器上“读就绪”状态的通道
                    SocketChannel sChannel = (SocketChannel) sk.channel();
                    // 读取数据
                    ByteBuffer buf = ByteBuffer.allocate(1024);
                    int len = 0;
                    while ((len = sChannel.read(buf)) > 0) {
                        buf.flip();
                        System.out.println(new String(buf.array(), 0, len));
                        buf.clear();
                    }
                }

                // 移除注册的选择键，否则会一直轮巡获取
                it.remove();
            }
        }
    }
}

```
#### 通道
Java NIO 管道是2个线程之间的**单向**数据连接。Pipe有一个source通道和一个sink通道。数据会被写到sink通道，从source通道读取。

代码演示
```
public class MainTest {
    public static void main(String[] args) throws IOException {
        //1.获取管道
        Pipe pipe= Pipe.open();

        //2.将缓冲区中的数据写入管道
        ByteBuffer buf= ByteBuffer.allocate(1024);
        Pipe.SinkChannel sinkChannel=pipe.sink();
        buf.put("通过单向管道发送数据".getBytes());
        buf.flip();
        sinkChannel.write(buf);

        //3.读取缓冲区中的数据
        Pipe.SourceChannel sourceChannel=pipe.source();
        buf.flip();
        int len=sourceChannel.read(buf);
        System.out.println(new String(buf.array(),0,len));

        sourceChannel.close();
        sinkChannel.close();
    }
}
```

## 参考文章
- http://hollischuang.gitee.io/tobetopjavaer
- http://hollischuang.gitee.io/tobetopjavaer/#/basics/java-basic/linux-io?id=linux-5种io模型
- http://hollischuang.gitee.io/tobetopjavaer/#/basics/java-basic/serialize-singleton?id=序列化对单例的破坏
- http://hollischuang.gitee.io/tobetopjavaer/#/basics/java-basic/serialize-principle?id=序列化底层原理
- https://docs.oracle.com/javase/7/docs/api/java/io/Externalizable.html
- https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html