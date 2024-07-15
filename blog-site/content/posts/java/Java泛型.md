---
title: "Java泛型"
date: 2024-07-15
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-generics"
---

## 概览
在Java中，泛型是一种强大的编程特性，允许类、接口和方法在定义时声明一种参数化类型，而在使用时可以指定具体的类型参数。泛型的主要目的是提高代码的重用性和类型安全性。

确切地说，泛型的本质是参数化类型，也就是在代码设计中，将类型作为参数进行传递和使用。这种参数化类型的设计使得代码可以更加灵活和通用，而不需要针对不同的数据类型重复编写类似的代码。
举个例子，最常见的就是使用泛型集合：
```text
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
// 不需要强制转换为 String
String first = names.get(0);
```
需要注意的是，泛型在Java中是通过类型擦除来实现的，这意味着泛型信息只在编译时存在，而在运行时会被擦除。
由于类型擦除，运行时不会保留泛型类型的具体信息。所以对于泛型类的实例，无法在运行时获取其具体的类型参数信息。

## 泛型优点
泛型的好处是在编译的时候检查类型安全，并且所有的强制转换都是自动和隐式的，提高代码的重用率。
通过泛型，编译器能够在编译时检查类型，并确保类型参数的一致性，从而避免了因类型转换错误而导致的运行时异常。这种类型安全性大大提高了代码的健壮性和可靠性。
```text
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
String first = names.get(0); // 不需要强制转换为 String
```
泛型允许编写通用的代码模板，适用于多种数据类型。通过泛型，可以在不同的上下文中重复使用同一段代码，而无需为每种数据类型都编写相似的代码逻辑，从而提高了代码的重用性和灵活性。
```text
// 泛型方法，用于打印任意类型的数组元素
public static <T> void printArray(T[] arr) {
    for (T elem : arr) {
        System.out.print(elem + " ");
    }
    System.out.println();
}
```
使用泛型可以减少或消除代码中的类型转换，使代码更加简洁和易于理解。不再需要在每处使用到集合或类时进行手动类型转换，从而提高了代码的可读性和可维护性。
```text
Map<String, Integer> map = new HashMap<>();
map.put("one", 1);
map.put("two", 2);

// 不需要强制转换为 Integer
int value = map.get("one");
```

## 类型擦除
Java中的泛型通过一种称为类型擦除的机制实现。声明了泛型的`.java`源代码，在编译生成`.class`文件之后，泛型相关的信息就消失了。
可以认为，源代码中泛型相关的信息，就是提供给编译器用的，泛型信息对Java编译器可以见，而对Java虚拟机不可见。

关于如何实现泛型，Java官方文档中有对应的解释，[原文](https://docs.oracle.com/javase/tutorial/java/generics/erasure.html)如下：
```text
Generics were introduced to the Java language to provide tighter type checks at compile time and to support generic programming. To implement generics, the Java compiler applies type erasure to:

- Replace all type parameters in generic types with their bounds or Object if the type parameters are unbounded. The produced bytecode, therefore, contains only ordinary classes, interfaces, and methods.
- Insert type casts if necessary to preserve type safety.
- Generate bridge methods to preserve polymorphism in extended generic types.

Type erasure ensures that no new classes are created for parameterized types; consequently, generics incur no runtime overhead.
```

以下是实现类型擦除的步骤：
1. 当你写泛型代码时，Java编译器会在编译阶段进行类型检查，确保你使用的类型是正确的。例如，如果你声明一个`List<String>`，编译器会确保你只能向这个列表添加字符串；
2. 一旦编译完成，所有的泛型类型信息都会被移除，这个过程叫做“类型擦除”。在类型擦除过程中：
    - 泛型类型参数被替换：所有的泛型类型参数会被替换为它们的上界（如果没有指定上界，就替换为`Object`）。
    - 插入必要的类型转换：在必要的地方，编译器会插入类型转换，以确保类型安全。
3. 当泛型类被继承，并且子类使用具体类型时，编译器会生成桥接方法来保证子类的方法正确覆盖父类的方法。桥接方法是编译器自动生成的，用来保证多态性和类型一致性；
   <br><br>假设有一个父类和一个子类：
    ```java
    class Parent<T> {
        public T getValue() {
            return null;
        }
    }
    
    class Child extends Parent<String> {
        @Override
        public String getValue() {
            return "child value";
        }
    }
    ```
   编译后，`Child`类中会有一个桥方法：
    ```java
    class Child extends Parent<String> {
        @Override
        public String getValue() {
            return "child value";
        }
    
        // 生成的桥方法
        @Override
        public Object getValue() {
            return getValue(); // 调用实际的getValue方法
        }
    }
    ```

在编译时，泛型类型参数会被替换为它们的上限。如果没有明确的上限，则替换为`Object`。泛型擦除示例：
```text
// 泛型类
public class Box<T> {
    private T value;

    public void setValue(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}

// 使用泛型类
Box<String> stringBox = new Box<>();
stringBox.setValue("Hello");
String value = stringBox.getValue();
```
```text
// 擦除后的类
public class Box {
    private Object value;

    public void setValue(Object value) {
        this.value = value;
    }

    public Object getValue() {
        return value;
    }
}

// 使用擦除后的类
Box stringBox = new Box();
stringBox.setValue("Hello");
String value = (String) stringBox.getValue(); // 强制类型转换
```
由于泛型类型在运行时被擦除，无法在运行时获取泛型的实际类型信息。这会导致某些操作无法进行。例如：
```java
public <T> void genericMethod(T t) {
    if (t instanceof T) { // 编译错误
        // ...
    }
}
```
在静态方法或静态上下文中，无法直接引用泛型类的类型参数。
```java
class GenericClass<T> {
    private T value;

    // 静态方法中不能使用泛型类的类型参数
    // public static void staticMethod(T value) { // 编译错误
    //     // ...
    // }

    // 解决方法：定义静态泛型方法
    public static <U> void staticMethod(U value) {
        // ...
    }
}
```
无法直接创建泛型数组。
```text
// 无法直接创建泛型数组
// List<String>[] stringLists = new ArrayList<String>[10]; // 编译错误

// 解决方法：使用原始类型数组并进行类型转换
List<String>[] stringLists = (List<String>[]) new ArrayList[10];
```
泛型类型参数不能是基本数据类型，如`int`、`char`，只能是类类型。这可能会导致额外的装箱和拆箱开销，从而影响性能。
```text
// 使用基本数据类型会导致编译错误
// List<int> intList = new ArrayList<>(); // 编译错误

// 解决方法：使用包装类
List<Integer> intList = new ArrayList<>();
intList.add(1);
int value = intList.get(0); // 需要拆箱操作
```

## 泛型类
在类上使用泛型，从而使类能够处理多种数据类型，而无需为每种数据类型编写单独的类。泛型类在定义时指定了一个或多个类型参数，这些类型参数在类的实例化时被具体的类型所替换。


## 泛型方法

## 泛型接口

## 泛型通配符

## 自定义泛型


