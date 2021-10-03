---
title: "Java反射"
date: 2021-10-02
draft: false
tags: ["Java", "面向菜鸟编程"]
slug: "rookie-reflect"
---

## 概述
### 什么是反射
在运行状态中，对于任意一个实体类，都能够知道这个类的所有属性和方法；对于任意一个对象，都能够调用它的任意方法和属性；这种动态获取信息以及动态调用对象方法的功能称为**Java语言的反射机制。**

>反射是Java语言的一个特性，它允许程序在运行时来进行自我检查并且对内部的成员进行操作.

**通过反射，我们可以在运行时获得程序或程序集中每一个类型的成员和成员的信息。程序中一般的对象的类型都是在编译期就确定下来的，而 Java 反射机制可以动态地创建对象并调用其属性，这样的对象的类型在编译期是未知的。所以我们可以通过反射机制直接创建对象，即使这个对象的类型在编译期是未知的.**

反射的核心是JVM在运行时才动态加载类或调用方法/访问属性，它不需要事先（写代码的时候或编译期）知道运行对象是谁。

## 反射的作用
- 在运行时判断任意一个对象所属的类;
- 在运行时判断任意一个类所具有的成员变量和方法;
- 在运行时任意调用一个对象的方法;
- 在运行时构造任意一个类的对象;

### 反射与注解

注解我们经常会遇到,如:`@Override, @Deprecated ...`

是否思考过注解是怎样工作的呢?
让我们自定义注解体会一下注解是怎样工作的.

创建注解: `MyAnnotation`
```
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface MyAnnotation {
    String value() default "";
}
```

使用注解: `MyAnnotationTest`
```
public class MyAnnotationTest {

    @MyAnnotation("123")
    public void test(String str){
        System.out.println("invoke test ...param: "+ str);
    }

    public void t2(){
        System.out.println("I am t2 ...");
    }

}
```

实现注解`@MyAnnotation`
```
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class AnnotationInvoke {


    public static void main(String[] args) throws NoSuchMethodException, IllegalAccessException, InstantiationException, InvocationTargetException {
        // 获取使用@MyAnnotation注解的类,这里举例子 就直接写了,如果想要实现的话可以参照spring扫描包
        Class<MyAnnotationTest> clazz = MyAnnotationTest.class;
        Method[] methods = clazz.getDeclaredMethods();
        for (Method method : methods) {
            //判断该类是否使用了 @MyAnnotation注解
            MyAnnotation annotation = method.getAnnotation(MyAnnotation.class);
            if (annotation != null) {
                // 可以进行一系列操作 ...
                // 获取该方法上 @MyAnnotation 注解的值
                System.out.println(annotation.value());
                // 执行test方法
                if (method.getName().equals("test")) {
                    method.invoke(clazz.newInstance(), "hello ...");
                }
            }
        }
    }
}
```
执行`main`方法,结果
```
123
invoke test ...param: hello ...
```


### 反射与枚举

经典案例: 用枚举实现单例设计模式,防止反射破坏单例
```
public enum EnumSingleton {

    INSTANCE;

    public EnumSingleton getInstance(){
        return INSTANCE;
    }

    public static void main(String[] args) throws IllegalAccessException, InvocationTargetException, InstantiationException, NoSuchMethodException {
        EnumSingleton singleton1=EnumSingleton.INSTANCE;
        EnumSingleton singleton2=EnumSingleton.INSTANCE;
        System.out.println("正常情况下，实例化两个实例是否相同："+(singleton1==singleton2));
        Constructor<EnumSingleton> constructor= null;
        constructor = EnumSingleton.class.getDeclaredConstructor();
        constructor.setAccessible(true);
        EnumSingleton singleton3= null;
        singleton3 = constructor.newInstance();
        System.out.println(singleton1+"\n"+singleton2+"\n"+singleton3);
        System.out.println("通过反射攻击单例模式情况下，实例化两个实例是否相同："+(singleton1==singleton3));
    }


}

```

结果
```
正常情况下，实例化两个实例是否相同：true
Exception in thread "main" java.lang.NoSuchMethodException
```

原因
`Constructor`类中 `newInstance`方法 不能通过反射来创建对象

```
    @CallerSensitive
    public T newInstance(Object ... initargs)
        throws InstantiationException, IllegalAccessException,
               IllegalArgumentException, InvocationTargetException
    {
        if (!override) {
            if (!Reflection.quickCheckMemberAccess(clazz, modifiers)) {
                Class<?> caller = Reflection.getCallerClass();
                checkAccess(caller, clazz, null, modifiers);
            }
        }
        if ((clazz.getModifiers() & Modifier.ENUM) != 0)
            throw new IllegalArgumentException("Cannot reflectively create enum objects");
        ConstructorAccessor ca = constructorAccessor;   // read volatile
        if (ca == null) {
            ca = acquireConstructorAccessor();
        }
        @SuppressWarnings("unchecked")
        T inst = (T) ca.newInstance(initargs);
        return inst;
    }

```


枚举类无法通过反射来创建对象,原因是`newInstance`方法加了判断如果是枚举类就抛出异常`throw new IllegalArgumentException("Cannot reflectively create enum objects");`

除了不能创建枚举类的对象外,反射还是能够调用枚举类的方法的

```
public enum EnumSingleton {

    public EnumSingleton getInstance(){
        return INSTANCE;
    }

    public void getTst(){
        System.out.println("enum method ...");
    }
    
    public static void main(String[] args) throws IllegalAccessException, InvocationTargetException, InstantiationException, NoSuchMethodException, ClassNotFoundException {
        Class<?> aClass = Class.forName("com.test.EnumSingleton");
        Method getInstance = aClass.getMethod("getTst");
        // 枚举对应的class没有newInstance方法，会报NoSuchMethodException，应该使用getEnumConstants方法
        Object[] oo = aClass.getEnumConstants();
        getInstance.invoke(oo[0]);
        Method getTst = aClass.getMethod("getTst");
        getTst.invoke(oo[0]);
    }
}
```

结果
```
enum getInstance ... 
enum method ...
```

### 反射与泛型
反射会擦除泛型,因为泛型只在编译期间生效.而反射是在Java程序运行期间生效。

```
public static void main(String[] args) throws Exception {

        ArrayList<Integer> list = new ArrayList<Integer>();

        list.add(1);  //这样调用 add 方法只能存储整形，因为泛型类型的实例为 Integer

        list.getClass().getMethod("add", Object.class).invoke(list, "string");

        for (int i = 0; i < list.size(); i++) 
            System.out.println(list.get(i));// 1 string
        //list.forEach(System.out::print);  //语法详情 见Java8 Lambda表达式
    }
```

### 反射与框架

**反射最重要的用途就是开发各种通用框架。**

以 spring 的 IOC 框架为例：
- 文章: [反射与工工厂模式实现IOC](https://blog.csdn.net/fuzhongmin05/article/details/61614873)

## 操作反射
在Java中，只要给定类的名字，那么就可以通过反射机制来获得类的所有信息.

使用反射会有异常出现.注意处理异常

Class类 和 ``java.lang.reflect``一起对反射提供了支持，``java.lang.reflect ``类库主要包含了以下三个类：
- Field:可以使用``get()``和``set()``方法读取和修改Field对象关联的字段;
- Method:可以使用 ``invoke()`` 方法调用与 ``Method`` 对象关联的方法;
- Constructor:可以用 ``Constructor ``的 ``newInstance()`` 创建新的对象;

### 获取
在程序运行时,反射可以获取Java类中所有的属性,下边举几个经常用的栗子

#### 获取反射入口
在操作反射前我们要先了解一些Class类
>Java的Class类是java反射机制的基础,通过Class类我们可以获得关于一个类的相关信息.<br>
虚拟机为每种类型管理一个独一无二的Class对象。也就是说，每个类（型）都有一个Class对象。运行程序时，Java虚拟机(JVM)首先检查是否所要加载的类对应的Class对象是否已经加载。如果没有加载，JVM就会根据类名查找.class文件，并将其Class对象载入

```
private  Class(ClassLoader loader) { 
    classLoader = loader; 
}
```
class类的构造器时私有的,只有JVM可以创建Class的对象，因此不可以像普通类一样new一个Class对象, 但是却可以通过已有的类得到一个Class对象，共有三种方式

在运行时获取 class 的对象.

1. ``Class.forName("包名+类名");``
例如 连接Oracle数据库加载JDBC驱动
```
// 注意此种方式请写全类名(包名+类名)
String driver = "oracle.jdbc.driver.OracleDriver";
Class.forName(driver);
```
2. ``类名.class``

```
Class<?> clazz = int.class;
Class<?> classInt = Integer.TYPE;
```
3. 调用某个对象的`getClass()`方法. ``实例.getClass()``

```
StringBuilder str = new StringBuilder("123");
Class<?> clazz = str.getClass();
```


反射可以提供运行时的类信息，并且这个类可以在运行时才加载进来，甚至在编译时期该类的 .class 不存在也可以加载进来。

#### 获取方法
创建`MainTest`类,A类,创建一个B类和C接口.让A类去继承B类.A类实现C接口,`MainTest`为主类,A类,B类为内部类
```
public class MainTest {

   class B{
        private void privateMethodB(){
            System.out.println("private method B ...");
        }

        void defaultMethodB(){
            System.out.println("default method B... ");
        }

        protected void protectedMethodB(){
            System.out.println("protected method B...");
        }

        public void publicMethodB(){
            System.out.println("public method B...");
        }
    }
    
    interface C{}

    class A extends B implements C{

        private void privateMethod(){
            System.out.println("private method ...");
        }

        void defaultMethod(){
            System.out.println("default method ... ");
        }

        protected void protectedMethod(){
            System.out.println("protected method ...");
        }

        public void publicMethod(){
            System.out.println("public method ...");
        }

    }
}
```
- `getDeclaredMethods` 方法返回类或接口声明的所有方法，包括公共、保护、默认（包）访问和私有方法，但不包括继承的方法。
执行下边代码
```
    @Test
    public void contextLoad() throws ClassNotFoundException {
        Class<?> clazz = Class.forName("com.test.MainTest$A");
        Method[] methods = clazz.getDeclaredMethods();
        for (Method method : methods) {
            System.out.println(method);
        }
    }
```
打印结果
```
public void com.test.MainTest$A.publicMethod()
private void com.test.MainTest$A.privateMethod()
void com.test.MainTest$A.defaultMethod()
protected void com.test.MainTest$A.protectedMethod()
```
- `getMethods`方法返回某个类的所有公用`public`方法，包括其继承类的公用方法.
```
    @Test
    public void contextLoad() throws ClassNotFoundException {
        Class<?> clazz = Class.forName("com.test.MainTest$A");
        Method[] methods = clazz.getMethods();
        for (Method method : methods) {
            System.out.println(method);
        }
    }
```
打印结果
```
public void com.test.MainTest$A.publicMethod()
public void com.test.MainTest$B.publicMethodB()
public final void java.lang.Object.wait() throws java.lang.InterruptedException
public final void java.lang.Object.wait(long,int) throws java.lang.InterruptedException
public final native void java.lang.Object.wait(long) throws java.lang.InterruptedException
public boolean java.lang.Object.equals(java.lang.Object)
public java.lang.String java.lang.Object.toString()
public native int java.lang.Object.hashCode()
public final native java.lang.Class java.lang.Object.getClass()
public final native void java.lang.Object.notify()
public final native void java.lang.Object.notifyAll()
// 接口也被打印了
public default void com.test.MainTest$C.interfaceC()
```
- `getMethod`方法返回一个特定的方法，其中第一个参数为方法名称，后面的参数为方法的参数对应`Class`的对象.只能获取到`public`修饰的方法.能获取到接口和父类的`public`修饰的方法
```
    @Test
    public void contextLoad() throws ClassNotFoundException, NoSuchMethodException {
        Class<?> clazz = Class.forName("com.test.MainTest$A");
        System.out.println(clazz.getMethod("publicMethod"));
//        System.out.println(clazz.getMethod("defaultMethod"));
//        System.out.println(clazz.getMethod("protectedMethod"));
//        System.out.println(clazz.getMethod("privateMethod"));
        System.out.println(clazz.getMethod("publicMethodB"));
        System.out.println(clazz.getMethod("interfaceC"));
    }
```
打印结果
```
public void com.test.MainTest$A.publicMethod()
public void com.test.MainTest$B.publicMethodB()
public default void com.test.MainTest$C.interfaceC()
```



#### 获取类成员信息

- `getFiled`：访问公有的成员变量
- `getDeclaredField`：所有已声明的成员变量，但不能得到其父类的成员变量
- `getFileds` 和 `getDeclaredFields` 方法用法同上（参照 获取方法）.

### 创建

- 创建数组
```
public static void testArray() throws ClassNotFoundException {
        Class<?> cls = Class.forName("java.lang.String");
        Object array = Array.newInstance(cls,25);
        //往数组里添加内容
        Array.set(array,0,"hello");
        Array.set(array,1,"Java");
        Array.set(array,2,"fuck");
        Array.set(array,3,"Scala");
        Array.set(array,4,"Clojure");
        //获取某一项的内容
        System.out.println(Array.get(array,3));
    }
```
- 创建对象
通过Class类的`getConstructor`方法得到`Constructor`类的一个实例，而`Constructor`类有一个`newInstance`方法可以创建一个对象实例,创建之前要确保该类存在构造无参构造器

```
    @Test
    public void contextLoad() throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InstantiationException {
        Class<?> clazz = Class.forName("com.test.MainTest");
        System.out.println(clazz.newInstance());
    }
```
打印结果
```
com.test.MainTest@65e579dc
```

### 调用方法

在`MainTest` 加入该方法
```
    public void T(){
        System.out.println("t method invoke ... ");
    }
```
执行
```
    public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InstantiationException, InvocationTargetException {
        Class<?> outerClass = Class.forName("com.MainTest");
        outerClass.getMethod("T").invoke(outerClass.newInstance());
    }
```
结果
```
t method invoke ... 
```
内部类调用方法方式
```
    public static void main(String[] args) throws ClassNotFoundException, NoSuchMethodException, IllegalAccessException, InstantiationException, InvocationTargetException {
        Class<?> outerClass = Class.forName("com.MainTest");
        Class<?> innerClass = Class.forName("com.MainTest$A");
        Method method = innerClass.getDeclaredMethod("publicMethod");
        Object o = innerClass.getDeclaredConstructors()[0].newInstance(outerClass.newInstance());
        method.invoke(o);
    }
```
执行结果
```
public method ...
```
当内部类私有化（`private class InnerClass`）时，也可以调用,这里就不列举了

## 反射的优点

通过反射机制我们可以获得类的各种内容，进行反编译。对于JAVA这种先编译再运行的语言来说，反射机制可以使代码更加灵活，更加容易实现面向对象.

- 可扩展性 ：应用程序可以利用全限定名创建可扩展对象的实例，来使用来自外部的用户自定义类。降低模块的耦合性;


- 可视化开发环境：可视化开发环境（如IDE）可以从利用反射中可用的类型信息中受益，以帮助程序员编写正确的代码。


- 调试器和测试工具 ： 调试器需要能够检查一个类里的私有成员。测试工具可以利用反射来自动地调用类里定义的可被发现的API定义，以确保一组测试中有较高的代码覆盖率。

## 反射的缺点

反射功能虽然强大,但不应任意使用.如果一个功能可以不用反射完成，那么最好就不用。通过反射访问代码时，应牢记以下注意事项

- 性能开销 ：反射涉及了动态类型的解析，所以 JVM 无法对这些代码进行优化。因此，反射操作的效率要比那些非反射操作低得多。我们应该避免在经常被执行的代码或对性能要求很高的程序中使用反射。


- 安全限制 ：使用反射通常需要程序的运行没有安全方面的限制。如果一个程序对安全性提出要求，则最好不要使用反射。


- 内部暴露 ：由于反射允许代码执行一些在正常情况下不被允许的操作（例如访问`private`字段和方法），所以使用反射可能会导致意料之外的副作用，这可能导致代码功能失调并破坏可移植性。反射代码破坏了抽象性，因此可能会随着平台的升级而改变行为.

