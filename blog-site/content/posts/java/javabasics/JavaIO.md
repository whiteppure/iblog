---
title: "JavaIO"
date: 2021-04-09
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-io"
---

## 概览
IO，即`in`和`out`的缩写，也就是输入和输出，指应用程序和外部设备之间的数据传递，常见的外部设备包括文件、管道、网络连接。
从计算机结构的角度来看IO，IO就是描述了计算机系统和外部设备之间通信的过程。

传统的IO是通过流技术来处理的。`Java IO`通过数据流、序列化和文件系统提供输入和输出。
流（`Stream`），是一个抽象的概念，是指一连串的数据（字符或字节），是以先进先出的方式发送信息的通道。
代表任何有能力产出数据的数据源对象或者是有能力接受数据的接收端对象。流的作用就是为数据源和目的地建立一个输送通道。

一般来说关于流的特性有以下几点：
- 先进先出：最先写入输出流的数据最先被输入流读取到。
- 顺序存取：可以一个接一个地往流中写入一串字节，读出时也将按写入顺序读取一串字节，不能随机访问中间的数据，`RandomAccessFile`除外。
- 只读或只写：每个流只能是输入流或输出流的一种，不能同时具备两个功能，输入流只能进行读操作，对输出流只能进行写操作。
在一个数据传输通道中，如果既要写入数据又要读取数据，则要分别提供两个流。

## 流的分类
![JavaIO流分类](/posts/annex/images/essays/JavaIO流分类.png)

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
Java中字符是采用`Unicode`标准，一个字符是16位，即一个字符使用两个字节来表示。为此，Java中引入了处理字符的流。因为数据编码的不同，而有了对字符进行高效操作的流对象。本质其实就是基于字节流读取时，去查了指定的码表。
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

对象序列化机制是Java语言内建的一种对象持久化方式，通过对象序列化，可以把对象的状态保存为字节数组，并且可以在有需要的时候将这个字节数组通过反序列化的方式再转换成对象。
对象序列化可以很容易的在JVM中的活动对象和字节流之间进行转换。

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

`Serializable`明明就是一个空的接口，它是怎么保证只有实现了该接口的方法才能进行序列化与反序列化的呢？
对象的序列化过程是通过`ObjectOutputStream`和`ObjectInputputStream`来实现的。在`ObjectOutputStream`中`writeObject`的调用栈如下：
```text
ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream("stringlist"));
objectOutputStream.writeObject(stringList);
IOUtils.close(objectOutputStream);

writeObject
    --->writeObject0
    --->writeOrdinaryObject
    --->writeSerialData
    --->invokeWriteObject
```
`writeObject0`方法中有这么一段代码：
```java
/**
 * Underlying writeObject/writeUnshared implementation.
 */
private void writeObject0(Object obj, boolean unshared) throws IOException {
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
在进行序列化操作时，会判断要被序列化的类是否是`String`、`Enum`、`Array`和`Serializable`类型，如果不是则直接抛出`NotSerializableException`。

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

#### serialVersionUID
虚拟机是否允许反序列化， 不仅取决于类路径和功能代码是否⼀致，⼀个⾮常重要的⼀点是两个类的序列化 ID 是否⼀致，即`serialVersionUID`要求⼀致。
因为⽂件存储中的内容可能被篡改，为了保证数据的安全，在进⾏反序列化时，JVM会把传来的字节流中的`serialVersionUID`与本地相应实体类的`serialVersionUID`进⾏⽐较，如果相同就认为是⼀致的，可以进⾏反序列化。
否则就会出现序列化版本不⼀致的异常，即`InvalidCastException`。

`Serializable`接口注释：
>  If a serializable class does not explicitly declare a serialVersionUID,
then the serialization runtime will calculate a default 
serialVersionUID value for that class based on various aspects of the class, 
as described in the Java(TM) Object Serialization Specification. 
 However, it is strongly recommended that all serializable classes explicitly declare serialVersionUID values,
since the default serialVersionUID computation is highly sensitive to class details that may vary depending on compiler implementations,
and can thus result in unexpectedInvalidClassExceptions during deserialization.
  
大意：当实现`java.io.Serializable`接口的类没有显式地定义⼀个`serialVersionUID`变量时候，Java序列化机制会根据编译的Class⾃动⽣成⼀个`serialVersionUID`作序列化版本⽐较⽤，
这种情况下，如果`class`⽂件没有发⽣变化，就算再编译多次，`serialVersionUID`也不会变化的。但是如果发⽣了变化，那么这个⽂件对应的`serialVersionUID`也就会发⽣变化。

Java强烈建议用户自定义一个`serialVersionUID`，如果我们没有在类中明确的定义一个`serialVersionUID`的话，反序列化时可能会导致`InvalidClassException`这个异常。
```java
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
java.io.InvalidClassException: com.test.User; local class incompatible: stream classdesc serialVersionUID = -2986778152837257883, local class serialVersionUID = 7961728318907695402
```

代码调用链：
```text
ObjectInputStream.readObject 
    -> readObject0
    -> readOrdinaryObject
    -> readClassDesc
    -> readNonProxyDesc
    -> ObjectStreamClass.initNonProxy
```
在`initNonProxy`中 ，关键代码如下：
```java
void initNonProxy(ObjectStreamClass model,
                  Class<?> cl,
                  ClassNotFoundException resolveEx,
                  ObjectStreamClass superDesc)
    throws InvalidClassException {
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
        
        // 在反序列化过程中，对serialVersionUID做了比较，如果发现不相等，则直接抛出异常
        if (!classNamesEqual(model.name, osc.name)) {
            throw new InvalidClassException(osc.name,
                    "local class name incompatible with stream class " +
                            "name \"" + model.name + "\"");
        }

        // ...
    }
}
```
其中`getSerialVersionUID`方法：
```java
public long getSerialVersionUID() {
    // REMIND: synchronize instead of relying on volatile?
    if (suid == null) {
        suid = AccessController.doPrivileged(
            new PrivilegedAction<Long>() {
                public Long run() {
                    // 生成一个默认的serialVersionUID
                    return computeDefaultSUID(cl);
                }
            }
        );
    }
    return suid.longValue();
}
```
这也就是报错的原因，在没有定义`serialVersionUID`的时候，会调用`computeDefaultSUID`方法，生成一个默认的`serialVersionUID`。
所以如果一个类实现了`Serializable`接口，一定要记得定义`serialVersionUID`，否则会发生异常。`serialVersionUID`有两种显示的生成方式： 
- 默认的`1L`，比如：`private static final long serialVersionUID = 1L; `
- 根据类名、接口名、成员方法及属性等来生成一个64位的哈希字段，比如：`private static final  long   serialVersionUID = xxxxL;`

可通过编译器进行设置，让它帮忙提示：
![idea检查serialVersionUID](/posts/annex/images/essays/idea检查serialVersionUID.png)

![idea自动生成serialVersionUID](/posts/annex/images/essays/idea自动生成serialVersionUID.png)

### 自定义序列化和反序列化
想要实现自定义序列化和反序列化，可以在被序列化的类中增加`writeObject`和`readObject`方法来实现。
举个例子，看一下`java.util.ArrayList`中的是如何自定义序列化的：
```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable{
    private static final long serialVersionUID = 8683452581122892189L;
    transient Object[] elementData; // non-private to simplify nested class access
    private int size;
}
```
`ArrayList`实现了`java.io.Serializable`接口且有自定义`serialVersionUID`，那么我们就可以对它进行序列化及反序列化。
`ArrayList`底层是通过数组实现的，其中数组`elementData`其实就是用来保存列表中的元素的。
因为`elementData`是被`transient`修饰的，所以这个成员变量不会被序列化而保留下来。那么为什么却通过序列化和反序列化把`List`中的元素保留下来了呢？
```java
public static void main(String[] args) throws IOException, ClassNotFoundException {
        List<String> stringList = new ArrayList<String>();
        stringList.add("hello");
        stringList.add("world");
        stringList.add("123");
        stringList.add("456");
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
```
`ArrayList`实际上是动态数组，每次在放满以后自动增长设定的长度值，如果数组自动增长长度设为100，而实际只放了一个元素，那就会序列化99个`null`元素。
为了保证在序列化的时候不会将这么多`null`同时进行序列化，`ArrayList`把元素数组设置为`transient`。
为了防止一个包含大量空对象的数组被序列化优化存储，所以`ArrayList`使用`transient`来修饰`elementData`。
但是作为一个集合，在序列化过程中还必须保证其中的元素可以被持久化下来，所以通过重写`writeObject`和`readObject`方法的方式把其中的元素保留下来。

在序列化过程中，如果被序列化的类中定义了`writeObject`和`readObject`方法，虚拟机会试图调用对象类里的`writeObject`和`readObject`方法，进行用户自定义的序列化和反序列化。
如果没有这样的方法，则默认调用是`ObjectOutputStream`的`defaultWriteObject`方法以及`ObjectInputStream`的`defaultReadObject`方法。
用户自定义的`writeObject`和`readObject`方法可以允许用户控制序列化的过程，比如可以在序列化的过程中动态改变序列化的数值。对象的序列化过程通过`ObjectOutputStream`和`ObjectInputputStream`来实现的。

`writeObject`方法把`elementData`数组中的元素遍历的保存到输出流（`ObjectOutputStream`）中。
```java
private void writeObject(java.io.ObjectOutputStream s) throws java.io.IOException{
    // Write out element count, and any hidden stuff
    int expectedModCount = modCount;
    s.defaultWriteObject();

    // Write out size as capacity for behavioural compatibility with clone()
    s.writeInt(size);

    // Write out all elements in the proper order.
    for (int i=0; i<size; i++) {
        s.writeObject(elementData[i]);
    }

    if (modCount != expectedModCount) {
        throw new ConcurrentModificationException();
    }
}
```
`readObject`方法从输入流（`ObjectInputStream`）中读出对象并保存赋值到 `elementData` 数组中。
```java
private void readObject(java.io.ObjectInputStream s) throws java.io.IOException, ClassNotFoundException {
    elementData = EMPTY_ELEMENTDATA;

    // Read in size, and any hidden stuff
    s.defaultReadObject();

    // Read in capacity
    s.readInt(); // ignored

    if (size > 0) {
        // be like clone(), allocate array based upon size not capacity
        ensureCapacityInternal(size);

        Object[] a = elementData;
        // Read in all elements in the proper order.
        for (int i=0; i<size; i++) {
            a[i] = s.readObject();
        }
    }
}
```

那么在一个类中定义了`writeObject`和`readObject`方法，这两个方法是怎么被调用的呢？ 答案是会通过反射的方式调用。

对象的序列化过程是通过`ObjectOutputStream`和`ObjectInputputStream`来实现的。在`ObjectOutputStream`中`writeObject`的调用栈如下：
```text
ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream("stringlist"));
objectOutputStream.writeObject(stringList);
IOUtils.close(objectOutputStream);

writeObject
    --->writeObject0
    --->writeOrdinaryObject
    --->writeSerialData
    --->invokeWriteObject
```
其中`invokeWriteObject`方法：
```java
/** class-defined writeObject method, or null if none */
private Method writeObjectMethod;

/**
 * Invokes the writeObject method of the represented serializable class.
 * Throws UnsupportedOperationException if this class descriptor is not
 * associated with a class, or if the class is externalizable,
 * non-serializable or does not define writeObject.
 */
void invokeWriteObject(Object obj, ObjectOutputStream out)
    throws IOException, UnsupportedOperationException {
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
文档注释大意：调用表示的`serializable`类的`writeObject`方法，如果类描述符不与类相关联，或者该类是可外部化、不可序列化的，或者没有定义 `writeObject`，则抛出 `UnsupportedOperationException`。
类定义的`writeObject`方法，如果没有则为`null`。

所以基本可以确定是这个方法调用的，其中`writeObjectMethod.invoke(obj, new Object[]{ out });`是关键，而`writeObjectMethod`就是在序列化类中定义的`writeObject`方法，所以确实是通过反射的方式被调用了。

### 单例与序列化
单例模式，是设计模式中最简单的一种。通过单例模式可以保证系统中一个类只有一个实例而且该实例易于外界访问，从而方便对实例个数的控制并节约系统资源。
单例模式真的能够实现实例的唯一性吗？答案是否定的，很多人都知道使用反射可以破坏单例模式，除了反射以外，使用序列化与反序列化也同样会破坏单例。
```java
public class MainTest {
    public static void main(String[] args) throws Exception {
        String path = "/Users/whitepure/github(/blog-site/content/posts/rookie/singleton.txt";

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
输出结果为`false`，结论为`Singleton`的序列化与反序列化得到的对象是一个新的对象，所以序列化破坏了`Singleton`的单例性。

对象的序列化过程是通过`ObjectOutputStream`和`ObjectInputputStream`来实现的。`ObjectInputStream`中`readObject`的调用栈如下：
```text
ObjectOutputStream objectOutputStream = new ObjectOutputStream(new FileOutputStream("stringlist"));
objectOutputStream.writeObject(stringList);
IOUtils.close(objectOutputStream);

readObject
    ---> readObject0
    ---> readOrdinary
    ---> checkResolve
```
其中`readOrdinaryObject` 方法，文档注释大意：读取并返回"ordinary"(即，不是字符串、类、`ObjectStreamClass`、数组或枚举常量)对象，如果对象的类是不可解析的，则为`null`(在这种情况下，`ClassNotFoundException`将与对象的句柄相关联)。设置`passHandle`为对象的赋值句柄。
```java
/**
 * Reads and returns "ordinary" (i.e., not a String, Class,
 * ObjectStreamClass, array, or enum constant) object, or null if object's
 * class is unresolvable (in which case a ClassNotFoundException will be
 * associated with object's handle).  Sets passHandle to object's assigned
 * handle.
 */
private Object readOrdinaryObject(boolean unshared)
    throws IOException {

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
`desc.isInstantiable`方法作用是，如果一个`serializable`/`externalizable`的类可以在运行时被实例化，那么该方法就返回`true`。 
如果返回`true`，就会触发`desc.newInstance`方法执行，该方法通过反射的方式调用无参构造方法新建一个对象。
所以序列化破坏单例的原因是调用了`desc.newInstance`方法，从而序列化会通过反射调用无参数的构造方法创建一个新的对象。

原因清楚了之后，那怎么解决呢？继续向下看`readOrdinaryObject`方法代码。
`hasReadResolveMethod`方法的作用，如果实现了`serializable`或者`externalizable`接口的类中包含`readResolve`则返回`true`。
`invokeReadResolve`是通过反射的方式调用要被反序列化的类的`readResolve`方法。
所以在`Singleton`中定义`readResolve`方法，并在该方法中指定要返回的对象的生成策略，就可以防止单例被破坏。
```java
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
在Unix操作系统中，常见的IO模型有以下五种：阻塞IO、非阻塞IO、信号驱动IO、IO多路转接、异步IO。其中，前四个被称为同步IO。

### 阻塞式IO模型
BIO（`Blocking IO`），最传统的一种IO模型，即在读写数据过程中会发生阻塞现象。

当用户线程发出IO请求之后，内核会去查看数据是否就绪，如果没有就绪就会等待数据就绪，而用户线程就会处于阻塞状态，用户线程交出CPU。
当数据就绪之后，内核会将数据拷贝到用户线程，并返回结果给用户线程，用户线程才解除`block`状态。

BIO编程简单，易于理解和实现，但因为一个请求IO会阻塞进程，不能充分利用CPU，导致低效的资源使用，特别是在处理大量连接时。
所以不适用并发量大的应用，适用并发量小的网络应用开发。
```text
try (Socket socket = new Socket("example.com", 80);
     InputStream input = socket.getInputStream();
     OutputStream output = socket.getOutputStream()) {

    output.write("GET / HTTP/1.1\r\n\r\n".getBytes());
    int data;
    while ((data = input.read()) != -1) {
        System.out.print((char) data);
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

### 非阻塞IO模型
NIO（`NoBlocking IO`），当用户线程发起一个`read`操作后，并不需要等待，而是马上就得到了一个结果。
如果结果是一个`error`时，它就知道数据还没有准备好，于是它可以再次发送`read`操作。
一旦内核中的数据准备好了，并且又再次收到了用户线程的请求，那么它马上就将数据拷贝到了用户线程然后返回。

在NIO中，IO操作立即返回，不会阻塞线程，所以线程可以在数据未准备好时执行其他任务。
用户线程需要不断地询问内核数据是否就绪，也就说非阻塞IO不会交出CPU，而会一直占用CPU。

NIO虽然线程不会被IO操作阻塞，可以同时处理多个连接，但编程复杂度较高，需要处理非阻塞逻辑和轮询。
```text
try (SocketChannel socketChannel = SocketChannel.open()) {
    socketChannel.configureBlocking(false);
    socketChannel.connect(new InetSocketAddress("example.com", 80));

    while (!socketChannel.finishConnect()) {
        // 做其他事情
    }

    ByteBuffer buffer = ByteBuffer.allocate(1024);
    int bytesRead = socketChannel.read(buffer);
} catch (IOException e) {
    e.printStackTrace();
}
```
需要注意的是`Java NIO`不是IO模型中的NIO模型，而是IO多路复用模型。

### IO复用模型
IO复用模型，一个线程不断去轮询多个`socket`的状态，只有当`socket`真正有读写事件时，才真正调用实际的IO读写操作。
在多路复用IO模型中，只需要使用一个线程就可以管理多个`socket`，系统不需要建立新的进程或者线程，也不必维护这些线程和进程，并且只有在真正有`socket`读写事件进行时，才会使用IO资源，所以它大大减少了资源占用。

`Java NIO`实际上就是多路复用IO，通过`selector.select()`查询每个通道是否有到达事件，如果没有事件则一直阻塞在那里。
因此这种方式会导致用户线程的阻塞，所以多路复用IO比较适合连接数比较多的情况。

![IO多路复用模型](/posts/annex/images/essays/IO多路复用模型.png)

单线程可以处理多个通道，提高资源利用率，性能好。适用高并发服务应用开发，一个进程响应多个请求，但编程复杂度较高，需要处理选择器和事件。
常用的实现方式包括`select`、`poll`和`epoll`。
```text
try (Selector selector = Selector.open();
     ServerSocketChannel serverChannel = ServerSocketChannel.open()) {
    
    serverChannel.bind(new InetSocketAddress(8080));
    serverChannel.configureBlocking(false);
    serverChannel.register(selector, SelectionKey.OP_ACCEPT);

    while (true) {
        selector.select();
        Set<SelectionKey> selectedKeys = selector.selectedKeys();
        Iterator<SelectionKey> iter = selectedKeys.iterator();

        while (iter.hasNext()) {
            SelectionKey key = iter.next();
            if (key.isAcceptable()) {
                // 处理接受事件
            } else if (key.isReadable()) {
                // 处理读取事件
            }
            iter.remove();
        }
    }
} catch (IOException e) {
    e.printStackTrace();
}
```

>多路复用IO为何比非阻塞IO模型的效率高？
因为在非阻塞IO中，不断地询问`socket`状态是通过用户线程去进行的，而在多路复用IO中，轮询每个`socket`状态是内核在进行的，这个效率要比用户线程要高的多。

要注意的是，多路复用IO模型是通过轮询的方式来检测是否有事件到达，并且对到达的事件逐一进行响应。
因此对于多路复用IO模型来说，一旦事件响应体很大，那么就会导致后续的事件迟迟得不到处理，并且会影响新的事件轮询。

### 信号驱动IO模型
当用户线程发起一个IO请求操作，会给对应的`socket`注册一个信号函数，然后用户线程会继续执行不阻塞，当内核数据就绪时会发送一个信号给用户线程，用户线程接收到信号之后，便在信号函数中调用IO读写操作来进行实际的IO请求操作。

在Java中，信号驱动IO模型不常见，更多用于`Unix/Linux`系统编程，通过`sigaction`和`SIGIO`信号实现。
虽然信号驱动IO不需要轮询，避免了CPU资源浪费，但是编程复杂，依赖于操作系统的信号机制，且跨平台支持较差，开发中使用较少。

### 异步IO模型
AIO（`Async IO`）模型是比较理想的IO模型，当用户线程发起IO操作后，立刻就可以开始去做其它的事。
从内核的角度看，当它收到一个IO请求之后，它会立刻返回给用户线程，说明IO请求已经成功发起了，因此不会对用户线程产生任何阻塞。
然后，内核会等待数据准备完成，然后将数据拷贝到用户线程，当这一切都完成之后，内核会给用户线程发送一个信号，告诉它IO操作完成了。

用户线程完全不需要知道实际的整个IO操作是如何进行的，只需要先发起一个请求，当接收内核返回的成功信号时表示IO操作已经完成，可以直接去使用数据了。

在异步IO模型中，IO操作的两个阶段都不会阻塞用户线程，这两个阶段都是由内核自动完成，然后发送一个信号告知用户线程操作已完成。
用户线程中不需要再次调用IO函数进行具体的读写。这点是和信号驱动模型有所不同的，在信号驱动模型中，当用户线程接收到信号表示数据已经就绪，然后需要用户线程调用IO函数进行实际的读写操作；
而在异步IO模型中，收到信号表示IO操作已经完成，不需要再在用户线程中调用IO函数进行实际的读写操作。

AIO不会阻塞线程，适用于高并发和低延迟的应用场景，但编程复杂度较高，需要处理异步操作和回调。
```text
try (AsynchronousSocketChannel client = AsynchronousSocketChannel.open()) {
    Future<Void> connectFuture = client.connect(new InetSocketAddress("example.com", 80));
    connectFuture.get();

    ByteBuffer buffer = ByteBuffer.allocate(1024);
    Future<Integer> readFuture = client.read(buffer);
    readFuture.get();
} catch (IOException | InterruptedException | ExecutionException e) {
    e.printStackTrace();
}
```

## NIO
NIO解释为`New IO`或`Non Blocking IO`是从Java 1.4 版本开始引入的一个新的IO API，可以替代标准的`Java IO`API。
NIO支持面向缓冲区的、基于通道的IO操作，所以NIO将以更加高效的方式进行文件的读写操作。

Java中的NIO是一个非常重要的部分，尤其是在处理高性能、高并发的应用时。NIO提供了一种比传统的阻塞IO更高效的方式来处理IO操作。
`Java NIO`属于IO多路复用模型，只不过`Java NIO`组件提供了统一的应用开发API，屏蔽了底层的操作系统的差异。`Java NIO`类库包含以下三个核心组件：
- Channel（通道）
- Buffer（缓冲区）
- Selector（选择器）

### 对比传统IO
| 区别 | 传统IO      | NIO                    |
| ---- |-----------| ---------------------- |
| 传输方式    | 面向流，通过流传输 | 面向缓冲区，通过缓冲区传输 |
| 是否阻塞    | 阻塞IO      | 非阻塞IO               |
| 其他    | 无         | 选择器，可以解决阻塞问题  |

什么是面向流？什么是面向缓冲区呢？
在传统IO操作中，IO的`read`操作总是以流式的方式顺序地从一个流中读取一个或多个字节，因此，我们不能随意地改变读取指针的位置，也不能前后移动流中的数据。
而NIO中引入了`Channel`（通道）和`Buffer`（缓冲区）的概念。面向缓冲区的读取和写入，都是与`Buffer`进行交互。
用户程序只需要从通道中读取数据到缓冲区中，或将数据从缓冲区中写入到通道中。NIO不像OIO那样是顺序操作，可以随意地读取`Buffer`中任意位置的数据，可以随意修改`Buffer`中任意位置的数据。

传统IO的操作是堵塞的，当一个线程调用`read()`或`write()`时，该线程被阻塞，直到有一些数据被读取，或数据完全写入，该线程在此期间不能再干任何事情了。
NIO如何做到非阻塞的呢？当调用`read`方法时，系统底层已经把数据准备好了，应用程序只需要从通道把数据复制到`Buffer`（缓冲区）就行。
如果没有数据，当前线程可以去干别的事情，不需要进行阻塞等待。根本原因是NIO使用了通道和通道的IO多路复用技术。

### 通道
通道(`Channel`)用于源节点与目标节点的连接，在`Java NIO`中负责缓冲区中数据的传输。`Channel`本身不存储数据，需要配合缓冲区进行数据传输。
`Channel`的角色和传统IO中的`Stream`是差不多的。在NIO中，一个网络连接使用一个通道表示，所有的NIO的IO操作都是通过连接通道完成的。
一个通道类似于传统IO中的两个流的结合体，既可以从通道读取数据，也可以向通道写入数据。

![IO](/posts/annex/images/essays/IO与NIO-1.png)

![NIO](/posts/annex/images/essays/IO与NIO-2.png)

通道的主要实现类：
- `FileChannel`：用于读取、写入、映射和操作文件的通道。
- `SocketChannel`：通过TCP读写网络中的数据。
- `ServerSocketChannel`：可以监听新进来的TCP连接，对每一个新进来的连接都会创建一个`SocketChannel`。
- `DatagramChannel`：通过UDP读写网络中的数据通道。

Java针对支持通道的类提供了`getChannel()`方法。
```java
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

### 缓冲区
通道负责传输，缓冲区负责存储，缓冲区底层实现是数组，用于存储不同类型的数据。
若需要使用NIO，需要获取用于连接IO设备的通道以及用于容纳数据的缓冲区，然后操作缓冲区，对数据进行处理。

`Channel`提供从文件、网络读取数据的渠道，但是读写的数据都必须经过Buffer。
所谓通道的读取，就是将数据从通道读取到缓冲区中；所谓通道的写入，就是将数据从缓冲区中写入到通道中。缓冲区的使用，是面向流进行读写操作的OIO所没有的，也是NIO非阻塞的重要前提和基础之一。

根据数据类型的不同(`boolean`除外)，有以下`Buffer`常用子类：
- `ByteBuffer`：用于存储字节数据
- `CharBuffer`：用于存储字符数据
- `ShortBuffer`：用于存储短整型数据
- `IntBuffer`：用于存储整型数据
- `LongBuffer`：用于存储长整型数据
- `FloatBuffer`：用于存储浮点型数据
- `DoubleBuffer`：用于存储双精度浮点型数据

在父类抽象类`Buffer`中存在四个核心属性：
- `capacity`：容量，表示缓冲区中最大存储数据的容量，一旦声明不能改变。一旦写入的对象数量超过了`capacity`容量，缓冲区就满了，不能再写入了。
- `limit`：界限，表示缓冲区中可以写入或者读取的最大上限，`limit`后数据不能进行读写。
- `position`：位置，表示缓冲区中正在操作数据的位置。
- `mark`：标记，用于暂存`position`的值，可以通过`reset()`恢复到`mark`的位置。

当向缓冲区写入数据时，缓冲区处于写模式。在写模式下，数据写入缓冲区，并更新位置属性。
```text
ByteBuffer buffer = ByteBuffer.allocate(10);
buffer.put((byte) 1);
buffer.put((byte) 2);
buffer.put((byte) 3);
// 此时，位置 position = 3，容量 capacity = 10，限制 limit = 10
```
在读数据之前，需要调用`flip()`方法将缓冲区从写模式切换到读模式。`flip()`方法将限制设置为当前位置，然后将位置重置为零。
```text
buffer.flip();
// 此时，位置 position = 0，限制 limit = 3，容量 capacity = 10
```
在读模式下，可以从缓冲区读取数据。每次读取操作都会更新位置属性。
```text
while (buffer.hasRemaining()) {
    // 输出：1, 2, 3
    System.out.println(buffer.get());
}
```
读完数据后，可以调用`clear()`方法将位置重置为零，限制设置为容量，用于准备再次写入整个缓冲区的数据。
```text
buffer.clear();
// 此时，位置 position = 0，限制 limit = 10，容量 capacity = 10
```
`compact()`方法将未读的数据复制到缓冲区的开始位置，然后将位置设置为未读数据的数量。适用于继续写入缓冲区但保留未读数据的情况。
```text
buffer.compact();
// 此时，未读的数据被移到缓冲区的开始位置，位置 position 设置为未读数据的数量
```
完整代码：
```java
public class BufferExample {
    public static void main(String[] args) {
        // 创建一个容量为10的ByteBuffer
        ByteBuffer buffer = ByteBuffer.allocate(10);

        // 写入数据到缓冲区
        buffer.put((byte) 1);
        buffer.put((byte) 2);
        buffer.put((byte) 3);

        // 写入数据后的缓冲区状态:
        // 位置 (Position): 3
        // 限制 (Limit): 10
        // 容量 (Capacity): 10
        System.out.println("写入数据后的缓冲区状态:");
        printBufferStatus(buffer);

        // 翻转缓冲区，准备读取
        buffer.flip();

        // 翻转缓冲区后的状态:
        // 位置 (Position): 0
        // 限制 (Limit): 3
        // 容量 (Capacity): 10
        System.out.println("翻转缓冲区后的状态:");
        printBufferStatus(buffer);

        // 读取数据
        System.out.println("读取数据:");
        while (buffer.hasRemaining()) {
            System.out.println(buffer.get());
        }

        // 读取数据后的缓冲区状态:
        // 位置 (Position): 3
        // 限制 (Limit): 3
        // 容量 (Capacity): 10
        System.out.println("读取数据后的缓冲区状态:");
        printBufferStatus(buffer);

        // 清空缓冲区，准备再次写入
        buffer.clear();

        // 清空缓冲区后的状态:
        // 位置 (Position): 0
        // 限制 (Limit): 10
        // 容量 (Capacity): 10
        System.out.println("清空缓冲区后的状态:");
        printBufferStatus(buffer);
    }

    private static void printBufferStatus(ByteBuffer buffer) {
        System.out.println("位置 (Position): " + buffer.position());
        System.out.println("限制 (Limit): " + buffer.limit());
        System.out.println("容量 (Capacity): " + buffer.capacity());
        System.out.println();
    }
}
```
`mark`方法，记录当前`position`位置，可以通过`reset()`恢复到`mark`的位置。
```java
public class BufferMarkResetExample {
    public static void main(String[] args) {
        // 创建一个容量为10的ByteBuffer
        ByteBuffer buffer = ByteBuffer.allocate(10);

        // 写入数据到缓冲区
        buffer.put((byte) 1);
        buffer.put((byte) 2);
        buffer.put((byte) 3);

        // 标记当前位置
        buffer.mark();
        System.out.println("标记位置 (Position)：" + buffer.position());

        // 继续写入数据
        buffer.put((byte) 4);
        buffer.put((byte) 5);

        System.out.println("当前缓冲区位置 (Position)：" + buffer.position());

        // 调用reset()方法恢复到标记的位置
        buffer.reset();
        System.out.println("重置后的位置 (Position)：" + buffer.position());

        // 从标记的位置继续写入数据
        buffer.put((byte) 6);

        // 翻转缓冲区，准备读取
        buffer.flip();

        // 读取数据
        System.out.println("读取数据：");
        while (buffer.hasRemaining()) {
            System.out.print(buffer.get() + " ");
        }
    }
}
```

### 选择器
选择器是`Java NIO`中的一个核心组件，允许单个线程管理多个通道（`Channel`）。它可以监控多个通道的IO事件，例如数据是否准备好读取、是否可以写入等。
通过选择器，应用程序可以在一个线程中同时管理多个通道的IO操作，而不必为每个通道创建一个单独的线程，这样可以提高系统资源利用率和应用程序的性能。

> 什么是IO事件呢？
表示通道某种IO操作已经就绪、或者说已经做好了准备。例如，如果一个新`Channel`链接建立成功了，就会在`Server Socket Channel`上发生一个IO事件，代表一个新连接一个准备好，这个IO事件叫做“接收就绪”事件。

`Selector`的本质，就是去查询这些IO就绪事件，所以，它的名称就叫做`Selector`查询者。
从编程实现维度来说，IO多路复用编程的第一步，是把通道注册到选择器中，第二步则是通过选择器所提供的事件查询方法，这些注册的通道是否有已经就绪的IO事件。

与传统IO相比，NIO使用选择器的最大优势就是系统开销小，系统不必为每一个网络连接创建进程/线程。
通过`Java NIO`可以达到一个线程负责多个连接通道的IO处理，这是非常高效的。这种高效，恰恰就来自于Java的选择器组件`Selector`以及其底层的操作系统IO多路复用技术的支持。

选择器的使命是完成IO的多路复用，其主要工作是通道的注册、监听、事件查询。
一个通道代表一条连接通路，通过选择器可以同时监控多个通道的IO（输入输出）状况。选择器和通道的关系，是监控和被监控的关系。

![selector示意图](/posts/annex/images/essays/selector示意图.png)

使用选择器，首先需要通过`Selector.open()`方法创建一个选择器对象。选择器允许单个线程管理多个通道的IO操作，实现了IO多路复用的机制。
```text
Selector selector = Selector.open();
```
通过`register`方法将通道注册到选择器上，并指定选择器要监控的IO事件类型，可供选择器监控的通道IO事件类型，包括以下四种：
- 可读：`SelectionKey.OP_READ`
- 可写：`SelectionKey.OP_WRITE`
- 连接：`SelectionKey.OP_CONNECT`
- 接收：`SelectionKey.OP_ACCEPT`
```text
ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
serverSocketChannel.configureBlocking(false); // 非阻塞模式
serverSocketChannel.register(selector, SelectionKey.OP_ACCEPT);
```
使用选择器的`select()`方法阻塞，直到至少有一个通道准备好进行IO操作，并处理每个发生的事件。
```text
selector.select(); // 阻塞直到有通道发生了注册的事件

Set<SelectionKey> selectedKeys = selector.selectedKeys();
Iterator<SelectionKey> keyIterator = selectedKeys.iterator();

while (keyIterator.hasNext()) {
    SelectionKey key = keyIterator.next();
    keyIterator.remove();

    if (key.isAcceptable()) {
        // 处理接受连接事件
        handleAccept(key, selector);
    } else if (key.isReadable()) {
        // 处理读事件
        handleRead(key);
    }
}
```
当有客户端连接时，我们通过服务端通道接受连接，并将客户端通道注册为读事件。
```java
private static void handleAccept(SelectionKey key, Selector selector) throws IOException {
    ServerSocketChannel serverChannel = (ServerSocketChannel) key.channel();
    SocketChannel clientChannel = serverChannel.accept();
    clientChannel.configureBlocking(false);
    clientChannel.register(selector, SelectionKey.OP_READ); // 注册读事件
    System.out.println("Accepted connection from " + clientChannel.getRemoteAddress());
}
```
读事件发生时，我们从通道中读取数据，并进行相应的处理。
```java
private static void handleRead(SelectionKey key) throws IOException {
    SocketChannel channel = (SocketChannel) key.channel();
    ByteBuffer buffer = ByteBuffer.allocate(1024);
    int bytesRead = channel.read(buffer);
    if (bytesRead == -1) {
        // 客户端关闭连接
        channel.close();
        key.cancel();
        System.out.println("Closed connection: " + channel.getRemoteAddress());
        return;
    }
    buffer.flip();
    byte[] data = new byte[buffer.remaining()];
    buffer.get(data);
    System.out.println("Received: " + new String(data));
    buffer.clear();
}
```

## 参考文章
- http://hollischuang.gitee.io/tobetopjavaer
- https://docs.oracle.com/javase/7/docs/api/java/io/Externalizable.html
- https://docs.oracle.com/javase/7/docs/api/java/io/Serializable.html
- https://blog.csdn.net/crazymakercircle/article/details/120946903