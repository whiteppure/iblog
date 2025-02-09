---
title: "Java类加载机制"
date: 2021-02-05
draft: false
tags: ["Java","JVM"]
slug: "jvm-classloader"
---

## 类加载过程
在Java中，类加载器把一个class装入JVM中，要经过以下步骤： 加载、验证、准备、解析和初始化。其中验证，准备，解析统称为连接。
这5个阶段一般是顺序发生的，但在动态绑定的情况下，解析阶段发生在初始化阶段之后。

![Jvm内存图](/posts/annex/images/essays/Jvm内存图.png)

类加载器只负责class文件的加载，至于它是否可以运行，则由执行引擎(Execution Engine)决定。
被加载的类信息存放于一块称为方法区的内存空间。除了类的信息外，方法区中还会存放运行时常量池信息，可能还包括字符串字面量和数字常量。

类加载过程流程图：

![类加载过程](/posts/annex/images/essays/类加载过程.png)

### 加载
加载阶段是类加载过程的第一个阶段。在这个阶段，JVM 的主要目的是将字节码从各个位置（网络、磁盘等）转化为二进制字节流加载到内存中，接着会为这个类在 JVM 的方法区创建一个对应的 Class 对象，这个 Class 对象就是这个类各种数据的访问入口。

类的加载指的是将类的`.class`文件中的二进制数据读入到内存中，将其放在运行时数据区的方法区内，然后在堆区创建一个`java.lang.Class`对象，用来封装类在方法区内的数据结构。
简单来说，加载指的是把从各个来源的class字节码文件，通过类加载器装载入内存中。

类加载器并不需要等到某个类被“首次主动使用”时再加载它，JVM规范允许类加载器在预料某个类将要被使用时就预先加载它，如果在预先加载的过程中遇到了`.class`文件缺失或存在错误，类加载器必须在程序首次主动使用该类时才报告错误（`LinkageError`错误）如果这个类一直没有被程序主动使用，那么类加载器就不会报告错误。

类加载器并不是一开始就把所有的类都加载进内存中，而是只有第一次遇到某个需要运行的类时才会加载，且只加载一次。

类加载阶段的作用：
- 通过类的全限定名获取该类的二进制字节流；
- 将字节流所代表的存储结构转化为方法区的运行时的数据结构；
- 在内存中生成一个该类的`java.lang.Class`对象作为方法区的这个类的各种数据访问入口；

加载阶段与连接阶段的部分动作(如一部分字节码文件格式验证动作)是交叉进行的，加载阶段尚未结束，连接阶段可能就已经开始了。

### 验证
JVM会在该阶段对二进制字节流进行校验，只有符合JVM字节码规范的才能被JVM正确执行。

验证是连接阶段的第一步，这一阶段的目的是确保class文件的字节流中包含的信息符合《Java 虚拟机规范》的全部约束要求，保证这些信息被当作代码运行后不会危害虚拟机自身的安全。

验证阶段这一步在整个类加载过程中耗费的资源还是相对较多的，但很有必要，可以有效防止恶意代码的执行，任何时候，程序安全都是第一位。
不过，验证阶段也不是必须要执行的阶段。如果程序运行的全部代码(包括自己编写的、第三方包中的、从外部加载的、动态生成的等所有代码)都已经被反复使用和验证过，在生产环境的实施阶段就可以考虑使用 `-Xverify:none` 参数来关闭大部分的类验证措施，以缩短虚拟机类加载的时间。

大致都会完成以下四个阶段的验证：
- 文件格式验证；
- 元数据验证，是否符合java语言的规范；
- 字节码验证，确保程序语义合法，符合逻辑；
- 符号引用验证，确保下一步解析能正常执行；

### 准备
准备阶段是正式为类变量分配内存并设置类变量初始值的阶段，这个过程将在方法区中进行分配。

举个例子:
```
public String var1 = "var1";
public static String var2 = "var2";
public static final String var3 = "var3";
```

变量`var1`不会被分配内存，但是`var2`会被分配。`var2`会被分配初始值为`null`而不是`var2`。
这里所设置的初始值通常情况下是数据类型默认的零值（如`0、0L、null、false`等），而不是被在Java代码中被显式地赋予的值。

这时候进行内存分配的仅包括类变量（ Class Variables ，即静态变量，被 static 关键字修饰的变量，只与类相关，因此被称为类变量），而不包括实例变量。
实例变量会在对象实例化时随着对象一块分配在Java堆中。

这里不包含`final`修饰的`static`，因为`final`在编译的时候就已经分配了，也就是说`var3`被分配的值为`var3`。

### 解析
解析阶段是虚拟机将常量池内的**符号引用**替换为**直接引用**的过程。 解析动作主要针对类或接口、字段、类方法、接口方法、方法类型、方法句柄和调用限定符 7 类符号引用进行。
对应常量池中的CONSTANT Class info、CONSTANT Fieldref info、CONSTANT Methodref info等。

- 符号引用：符号引用是编译原理中的概念，是相对于直接引用来说的。主要包括了以下三类常量： 类和接口的全限定名 字段的名称和描述符 方法的名称和描述符。
符号引用以一组符号来描述所引用的目标。符号引用可以是任何形式的字面量，只要使用时能无歧义地定位到目标即可，符号引用和虚拟机的布局无关。
- 直接引用：直接引用和虚拟机的布局是相关的，不同的虚拟机对于相同的符号引用所翻译出来的直接引用一般是不同的。
如果有了直接引用，那么直接引用的目标一定被加载到了内存中。直接引用通过对符号引用进行解析，找到引用的实际内存地址。

在编译的时候每个java类都会被编译成一个class文件，但在编译的时候虚拟机并不知道所引用类的地址，所以就用符号引用来代替，而在这个解析阶段就是为了把这个符号引用转化成为真正的地址的阶段。

### 初始化
初始化阶段是执行初始化方法 `<clinit> ()`方法的过程，是类加载的最后一步，这一步 JVM 才开始真正执行类中定义的 Java 程序代码(字节码)。

对于`<clinit> ()` 方法的调用，虚拟机会自己确保其在多线程环境中的安全性。因为 `<clinit> ()` 方法是带锁线程安全，所以在多线程环境下进行类初始化的话可能会引起多个线程阻塞，并且这种阻塞很难被发现。
`<clinit>()` 方法不需定义，是javac编译器自动收集类中的所有类变量的赋值动作和静态代码块中的语句合并而来。
也就是说，当我们代码中包含static变量的时候，就会有`<clinit>()`方法。
在准备阶段，静态变量已经被赋过默认初始值，而在初始化阶段，静态变量将被赋值为代码期望赋的值。

举个例子
```
public static String var2 = "var2";
```
在准备阶段变量`var2`的值为`null`，在初始化阶段赋值为`var2`。

初始化步骤：
- 如果这个类还没有被加载和连接，则程序先加载并连接该类；
- 如果该类的直接父类还没有被初始化，则先初始化其直接父类；
- 如果类中有初始化语句，则系统依次执行这些初始化语句；

何时初始化：
- 创建类的实例，也就是`new`一个对象需要初始化；
- 读取或者设置静态字段的时候需要初始化，但被`final`修饰的字段，在编译时就被放入静态常量池的字段除外；
- 调用类的静态方法；
- 使用反射`Class.forName("");`对类反射调用的时候，该类需要初始化；
- 初始化一个类的时候，有父类，先初始化父类；
    - 接口除外，父接口在调用的时候才会被初始化；
    - 子类引用父类的静态字段，只会引发父类的初始化；
- 被标明为启动类的类(即包含`main()`方法)，需要初始化  ；  

初始化顺序
```
父类静态域 --> 子类静态域 --> 父类成员初始化 -->父类构造块 --->父类构造方法 -->子类成员初始化 -->子类构造块 -->子类构造方法
```

初始化规则：若该类具有父类，JVM会保证子类的`<clinit>()`方法执行前，父类的`<clinit>()`方法已经执行完毕。

一些初始化规则:
- 类从顶至底的顺序初始化，所以声明在顶部的字段的早于底部的字段初始化；
- 超类早于子类和衍生类的初始化；
- 如果类的初始化是由于访问静态域而触发，那么只有声明静态域的类才被初始化，而不会触发超类的初始化或者子类的；
- 初始化即使静态域被子类或子接口或者它的实现类所引用；
- 接口初始化不会导致父接口的初始化；
- 静态域的初始化是在类的静态初始化期间，非静态域的初始化时在类的实例创建期间。这意味这静态域初始化在非静态域之前；
- 非静态域通过构造器初始化，子类在做任何初始化之前构造器会隐含地调用父类的构造器，他保证了非静态或实例变量（父类）初始化早于子类；
- 虚拟机必须保证一个类的`<clinit>()`方法在多线程下被同步加锁。也就是说类只能被初始化一次；

### 类卸载
卸载类即该类的Class对象被 GC。卸载类需要满足 3 个要求：
1. 该类的所有的实例对象都已被 GC，也就是说堆不存在该类的实例对象；
2. 该类没有在其他任何地方被引用；
3. 该类的类加载器的实例已被 GC；

所以在 JVM 生命周期内，由 JVM 自带的类加载器加载的类是不会被卸载的，但是由我们自定义的类加载器加载的类是可能被卸载的。
JDK 自带的 BootstrapClassLoader， ExtClassLoader， AppClassLoader 负责加载 JDK 提供的类，所以它们(类加载器的实例)肯定不会被回收。而我们自定义的类加载器的实例是可以被回收的，所以使用我们自定义加载器加载的类是可以被卸载掉的。

## 类加载器
类加载器是一个负责加载类的对象。ClassLoader 是一个抽象类。给定类的二进制名称，类加载器应尝试定位或生成构成类定义的数据。
典型的策略是将名称转换为文件名，然后从文件系统中读取该名称的“类文件”。
每个 Java 类都有一个引用指向加载它的 ClassLoader。不过，数组类不是通过 ClassLoader 创建的，而是 JVM 在需要的时候自动创建的，数组类通过getClassLoader()方法获取 ClassLoader 的时候和该数组的元素类型的 ClassLoader 是一致的。

简单来说，类加载器的主要作用就是加载 Java 类的字节码（ .class 文件）到 JVM 中，即在内存中生成一个代表该类的 Class 对象。 
字节码可以是 Java 源程序（.java文件）经过 javac 编译得来，也可以是通过工具动态生成或者通过网络下载得来。
其实除了加载类之外，类加载器还可以加载 Java 应用所需的资源如文本、图像、配置文件、视频等等文件资源。

JVM 启动的时候，并不会一次性加载所有的类，而是根据需要去动态加载。也就是说，大部分类在具体用到的时候才会去加载，这样对内存更加友好。
对于已经加载的类会被放在 ClassLoader 中。在类加载的时候，系统会首先判断当前类是否被加载过。已经被加载的类会直接返回，否则才会尝试加载。
也就是说，对于一个类加载器来说，相同二进制名称的类只会被加载一次。

从虚拟机的角度来说，只存在两种不同的类加载器，
一种是启动类加载器(`Bootstrap ClassLoader`)，该类加载器使用C++语言实现(这里仅限于`Hotspot`，也就是JDK1.5之后默认的虚拟机，有很多其他的虚拟机是用Java语言实现的)，属于虚拟机自身的一部分。
另外一种就是自定义类加载器，这些类加载器是由Java语言实现，独立于JVM外部，并且全部继承自抽象类`java.lang.ClassLoader`。

```
public class ClassloaderTest {
    public static void main(String[] args) {
        // 获取系统类加载器
        ClassLoader systemClassLoader = ClassLoader.getSystemClassLoader();
        // sun.misc.Launcher$AppClassLoader@18b4aac2
        System.out.println(systemClassLoader);

        // 获取其上层的：扩展类加载器
        ClassLoader extClassLoader = systemClassLoader.getParent();
        // sun.misc.Launcher$ExtClassLoader@5cad8086
        System.out.println(extClassLoader);

        // 试图获取 启动类加载器
        ClassLoader bootstrapClassLoader = extClassLoader.getParent();
        // null 不能获取到启动类加载器
        System.out.println(bootstrapClassLoader);

        // 获取自定义加载器
        ClassLoader classLoader = ClassloaderTest.class.getClassLoader();
        // sun.misc.Launcher$AppClassLoader@18b4aac2
        System.out.println(classLoader);

        // 获取String类型的加载器
        // Java 核心包都是用启动类加载器加载的
        ClassLoader classLoader1 = String.class.getClassLoader();
        // null
        System.out.println(classLoader1);
    }
}
```
可以看出 启动类加载器无法直接通过代码获取，同时目前用户代码所使用的加载器为系统类加载器。同时我们通过获取String类型的加载器，发现是null，
那么说明String类型是通过根加载器进行加载的，也就是说Java的核心类库都是使用根加载器进行加载的。

获取启动类加载器加载的路径
```
public class ClassloaderTest {
    public static void main(String[] args) {
        System.out.println("*********启动类加载器加载的路径************");
        // 获取BootstrapClassLoader 能够加载的API的路径
        URL[] urls = sun.misc.Launcher.getBootstrapClassPath().getURLs();
        for (URL url : urls) {  
            System.out.println(url.toExternalForm());
        }

        // 从上面路径中，随意选择一个类，来看看他的类加载器是什么：得到的是null，说明是根加载器
        ClassLoader classLoader = Provider.class.getClassLoader();
        System.out.println(classLoader);

    }
}
```

### 常见类加载器
>rt.jar：rt 代表“RunTime”，rt.jar是 Java 基础类库，包含 Java doc 里面看到的所有的类的类文件。
我们常用内置库 `java.xxx.*`都在里面，比如`java.util.*`、`java.io.*`、`java.nio.*`、`java.lang.*`、`java.sql.*`、`java.math.*`。

1. 启动类加载器(引导类加载器、Bootstrap ClassLoader)：
   - 该类加载器使用C/C++语言实现的，嵌套在JVM内部，可理解为就是JVM的一部分；
   - 它用来加载Java的核心库（`JAVA_HOME/jre/1ib/rt.jar、resources.jar`或`sun.boot.class.path`路径下的内容），用于提供JVM自身需要的类；
   - 并不继承自`java.lang.ClassLoader`，没有父加载器；
   - 加载扩展类和应用程序类加载器，并指定为他们的父类加载器；
   - 出于安全考虑，Bootstrap启动类加载器只加载包名为java、javax、sun等开头的类；
2. 扩展类加载器：
   - Java语言编写，由`sun.misc.Launcher$ExtClassLoader`实现；
   - 派生于`ClassLoader`类；
   - 父类加载器为启动类加载器；
   - 从`java.ext.dirs`系统属性所指定的目录中加载类库，或从JDK的安装目录的`jre/1ib/ext`子目录（扩展目录）下加载类库。如果用户创建的JAR放在此目录下，也会自动由扩展类加载器加载；
3. 应用程序类加载器(系统类加载器、AppClassLoader)：
   - java语言编写，由`sun.misc.LaunchersAppClassLoader`实现；
   - 派生于ClassLoader类；
   - 父类加载器为扩展类加载器；
   - 它负责加载环境变量`classpath`或系统属性`java.class.path`指定路径下的类库；
   - 该类加载是程序中默认的类加载器，一般来说，Java应用的类都是由它来完成加载；
   - 通过`classLoader#getSystemclassLoader()`方法可以获取到该类加载器；

### 自定义类加载器
除了这三种类加载器之外，用户还可以加入自定义的类加载器来进行拓展，以满足自己的特殊需求。
就比如说，我们可以对 Java 类的字节码（ .class 文件）进行加密，加载时再利用自定义的类加载器对其解密。

自定义加载器使用场景：
1. 隔离加载类；
2. 修改类加载的方式；
3. 扩展加载源；
4. 防止源码泄漏；

若要实现自定义类加载器，只需要继承`java.lang.ClassLoader`类，按需重写相关方法即可。
- 如果不想打破双亲委派模型，那么只需要重写`findClass`方法；
- 如果想打破双亲委派模型，那么就重写整个`loadClass`方法；

**在JDK1.2之前，类加载尚未引入双亲委派模式，因此实现自定义类加载器时常常重写`loadClass`方法，提供双亲委派逻辑，从JDK1.2之后，双亲委派模式已经被引入到类加载体系中，自定义类加载器时不需要在自己写双亲委派的逻辑，因此不鼓励重写`loadClass`方法，而推荐重写`findClass`方法。
在Java中，任意一个类都需要由加载它的类加载器和这个类本身一同确定其在java虚拟机中的唯一性，即比较两个类是否相等，只有在这两个类是由同一个类加载器加载的前提之下才有意义，否则，即使这两个类来源于同一个Class类文件，只要加载它的类加载器不相同，那么这两个类必定不相等(这里的相等包括代表类的Class对象的`equals()`方法、`isAssignableFrom()`方法、`isInstance()`方法和`instanceof`关键字的结果)。**

重写`findClass`方法代码演示，准备一个class文件，编译后放到C盘根目录下
```
public class People {
	private String name;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}

```

自定义类加载器，继承`ClassLoader`重写`findClass`方法（其中`defineClass`方法可以把二进制流字节组成的文件转换为一个`java.lang.Class`）
```
public class MyClassLoader extends ClassLoader {

    public MyClassLoader(){}
    
    public MyClassLoader(ClassLoader parent){
        super(parent);
    }
    
    protected Class<?> findClass(String name) throws ClassNotFoundException {
    	File file = new File("C:/People.class");
        try{
            byte[] bytes = getClassBytes(file);
            //defineClass方法可以把二进制流字节组成的文件转换为一个java.lang.Class
            Class<?> c = this.defineClass(name, bytes, 0, bytes.length);
            return c;
        } 
        catch (Exception e){
            e.printStackTrace();
        }
        
        return super.findClass(name);
    }
    
    private byte[] getClassBytes(File file) throws Exception {
        // 这里要读入.class的字节，因此要使用字节流
        FileInputStream fis = new FileInputStream(file);
        FileChannel fc = fis.getChannel();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        WritableByteChannel wbc = Channels.newChannel(baos);
        ByteBuffer by = ByteBuffer.allocate(1024);
        
        while (true){
            int i = fc.read(by);
            if (i == 0 || i == -1)
            break;
            by.flip();
            wbc.write(by);
            by.clear();
        }
        fis.close();
        return baos.toByteArray();
    }
}

```

## 双亲委派模型
![双亲委派模型](/posts/annex/images/essays/双亲委派模型.png)

ClassLoader 类使用委托模型来搜索类和资源，每个 ClassLoader 实例都有一个相关的父类加载器。需要查找类或资源时，ClassLoader 实例会在试图亲自查找类或资源之前，将搜索类或资源的任务委托给其父类加载器。
这种层次关系称为**类加载器的双亲委派模型。** 我们把每一层上面的类加载器叫做当前层类加载器的父加载器，当然，它们之间的父子关系并不是通过继承关系来实现的，而是使用组合关系来复用父加载器中的代码。
该模型在JDK1.2期间被引入并广泛应用于之后几乎所有的Java程序中，但它并不是一个**强制性的约束模型**，而是Java设计者们推荐给开发者的一种类的加载器实现方式。

### 工作流程
- 如果一个类加载器收到了类加载请求，它并不会自己先去加载，而是把这个请求委托给父类的加载器去执行；
- 如果父类加载器还存在其父类加载器，则进一步向上委托，依次递归，请求最终将到达顶层的启动类加载器；
- 如果父类加载器可以完成类加载任务，就成功返回，倘若父类加载器无法完成此加载任务，子加载器才会尝试自己去加载；
- 如果子类加载器也无法加载这个类，那么它会抛出一个`ClassNotFoundException`异常；

JVM 如何判定两个Java类是否相同？

JVM 不仅要看类的全名是否相同，还要看加载此类的类加载器是否一样。只有两者都相同的情况，才认为两个类是相同的。
即使两个类来源于同一个 Class 文件，被同一个虚拟机加载，只要加载它们的类加载器不同，那这两个类就必定不相同。

在`rt.jar`包中的`java.lang.ClassLoader`类中，我们可以查看类加载实现过程`loadClass`方法的代码，具体源码如下：
```
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException{
        synchronized (getClassLoadingLock(name)) {
            // First, check if the class has already been loaded
            // 首先检查该name指定的class是否有被加载
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                   // 如果parent不为null，则调用parent的loadClass进行加载
                        c = parent.loadClass(name, false);
                    } else {
                    // parent为null，则调用BootstrapClassLoader进行加载  
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                   // 如果从非空父类加载器中找不到类，则抛出ClassNotFoundException
                }

                if (c == null) {
                // 如果仍然无法加载成功，则调用自身的findClass进行加载 
                    long t1 = System.nanoTime();
                    c = findClass(name);

                   // 这是定义类加载器；记录统计数据
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
```

根据代码以及代码中的注释可以很清楚地了解整个过程，先检查是否已经被加载过，如果没有则调用父加载器的`loadClass()`方法，如果父加载器为空则默认使用启动类加载器作为父加载器。
如果父类加载器加载失败，则先抛出`ClassNotFoundException`，然后再调用自己的`findClass()`方法进行加载。

### 优势
双亲委派模型保证了 Java 程序的稳定运行，可以避免类的重复加载（JVM 区分不同类的方式不仅仅根据类名，相同的类文件被不同的类加载器加载产生的是两个不同的类），也保证了 Java 的核心 API 不被篡改。

比如我们编写一个称为 java.lang.Object 类的话，那么程序运行的时候，系统就会出现两个不同的 Object 类。
双亲委派模型可以保证加载的是 JRE 里的那个 Object 类，而不是你写的 Object 类。这是因为 AppClassLoader 在加载你的 Object 类时，会委托给 ExtClassLoader 去加载，而 ExtClassLoader 又会委托给 BootstrapClassLoader，BootstrapClassLoader 发现自己已经加载过了 Object 类，会直接返回，不会去加载你写的 Object 类。

### 沙箱安全机制
自定义String类，但是在加载自定义String类的时候会率先使用引导类加载器加载，而引导类加载器在加载的过程中会先加载jdk自带的文件（rt.jar包中java.lang.String.class），
报错信息说没有main方法，就是因为加载的是rt.jar包中的string类。这样可以保证对java核心源代码的保护，这就是沙箱安全机制。

### 补充

#### 判断两个class对象是否相同
在JVM中表示两个class对象是否为同一个类存在两个必要条件：
- 类的完整类名必须一致，包括包名；
- 加载这个类的ClassLoader（指ClassLoader实例对象）必须相同；

换句话说，在JvM中，即使这两个类对象（class对象）来源同一个Class文件，被同一个虚拟机所加载，
但只要加载它们的ClassLoader实例对象不同，那么这两个类对象也是不相等的。

JVM必须知道一个类型是由启动加载器加载的还是由用户类加载器加载的。如果一个类型是由用户类加载器加载的，那么JVM会将这个类加载器的一个引用作为类型信息的一部分保存在方法区中。
当解析一个类型到另一个类型的引用的时候，JVM需要保证这两个类型的类加载器是相同的。

#### 类的主动使用和被动使用
Java程序对类的使用方式分为：王动使用和被动使用。 主动使用，又分为七种情况：
- 创建类的实例；
- 访问某个类或接口的静态变量，或者对该静态变量赋值；
- 调用类的静态方法；
- 反射，比如：`Class.forName("com.github.Test")`；
- 初始化一个类的子类；
- Java虚拟机启动时被标明为启动类的类；
- JDK7开始提供的动态语言支持；
- `java.lang.invoke.MethodHandle`实例的解析结果REF getStatic、REF putStatic、REF invokeStatic句柄对应的类没有初始化，则初始化;

除了以上七种情况，其他使用Java类的方式都被看作是对类的被动使用，都不会导致类的初始化。

#### 如何打破双亲委派模型 
自定义加载器的话，需要继承 ClassLoader。如果我们不想打破双亲委派模型，就重写 ClassLoader 类中的 findClass() 方法即可，无法被父类加载器加载的类最终会通过这个方法被加载。但是，如果想打破双亲委派模型则需要重写 loadClass() 方法。

类加载器在进行类加载的时候，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器去完成，调用父加载器 loadClass()方法来加载类。
重写 loadClass()方法之后，我们就可以改变传统双亲委派模型的执行流程。
例如，子类加载器可以在委派给父类加载器之前，先自己尝试加载这个类，或者在父类加载器返回之后，再尝试从其他地方加载这个类。具体的规则由我们自己实现，根据项目需求定制化。
