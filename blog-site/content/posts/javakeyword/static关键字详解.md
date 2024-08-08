---
title: "static关键字详解"
date: 2024-08-07
draft: false
tags: ["Java", "关键字","详解"]
slug: "java-keyword-static"
---


## static
`static`是Java中的一个关键字，用于定义类级别的成员。类级别的成员是指那些属于整个类，而不是特定对象实例的成员。在Java中，类级别的成员包括静态变量和静态方法。
```java
public class Example {
    // 静态变量（类级别的成员）
    public static int count = 0;

    // 静态方法（类级别的成员）
    public static void incrementCount() {
        count++;
    }
}
```
因为静态成员属于整个类而不是特定实例，所以它们在所有实例之间共享，减少了内存消耗。
例如，静态变量用于保存所有对象共享的状态，而静态方法可用于提供通用的工具函数，这些功能可以直接通过类名访问，无需实例化对象。

但是由于静态成员在类加载时被初始化并在整个应用程序运行期间存在，可能导致测试变得复杂，因为静态变量的状态会影响所有实例。
此外，静态成员无法通过继承进行扩展，这限制了其灵活性。多个线程访问静态变量时，还需处理线程安全问题。

`static`使用场景包括工具类、常量和共享状态。例如，工具类中的静态方法，如`java.lang.Math`类的数学函数，可以通过类名直接访问，而无需实例化对象。
常量通过`public static final`声明，使其在整个应用中保持一致，并方便访问。静态变量用于存储所有类实例共享的数据，如计数器，所有实例可以访问和修改相同的值。

### 使用示例
`static`关键字可以用于声明静态变量，这些变量在所有实例之间共享；定义静态方法，允许通过类名直接调用；以及创建静态块，用于在类加载时执行初始化操作。
还可用于定义静态内部类，这些类与外部类的实例无关，但可以访问外部类的静态成员。

- 静态变量：声明属于类的变量，而不是实例。所有对象共享同一个静态变量。
    ```java
    public class Example {
        public static int count = 0;
    }
    ```
- 静态方法：定义不依赖于实例的方法，可以直接通过类名调用。
    ```java
    public class Example {
        public static void printMessage() {
            System.out.println("Hello, World!");
        }
    }
    ```
- 静态块：用于在类加载时初始化静态变量，静态块在类加载时执行一次。
    ```java
    public class Example {
        static {
            System.out.println("Static block executed");
        }
    }
    ```
- 静态内部类：定义与外部类实例无关的内部类，静态内部类可以直接访问外部类的静态成员。
    ```java
    public class OuterClass {
        static class StaticInnerClass {
            void display() {
                System.out.println("Static inner class");
            }
        }
    }
    ```
除了静态变量、静态方法、静态块和静态内部类这几种常见的使用方式外，`static`关键字还可用于静态导入和静态方法引用。
- 静态导入：允许在代码中直接使用类的静态成员，无需使用类名。这可以使代码更简洁。
    ```java
    import static java.lang.Math.*;
    
    public class Example {
        public static void main(String[] args) {
            double result = sqrt(25); // 直接使用 sqrt 方法，无需 Math.sqrt()
            System.out.println(result);
        }
    }
    ```
- 静态方法引用：在`lambda`表达式或方法引用中，可以使用静态方法作为目标。这种用法使代码更具表达力。
    ```java
    public class Example {
        public static int multiplyByTwo(int x) {
            return x * 2;
        }
        
        public static void main(String[] args) {
            Function<Integer, Integer> function = Example::multiplyByTwo;
            System.out.println(function.apply(5)); // 输出 10
        }
    }
    ```

### static底层原理
在JVM中，静态变量、静态方法和静态代码块都存储在方法区。方法区是JVM的一部分，用于存储类的结构信息，包括类的元数据、静态变量、静态方法和常量池等。
方法区为静态变量分配的内存区域，在**类加载**时就已经存在，并在整个类的生命周期内保持不变，所以静态变量不需要为每个对象实例重新创建。

举个例子：
```java
public class Example {
    public static int count = 0; // 静态变量
}
```
当类`Example`被加载时，`count`变量在方法区中被分配内存，并初始化为0。这段内存空间只存在一份，并且所有对`Example.count`的访问都指向这段内存空间。

类加载的过程包括三个步骤：
1. 加载：JVM通过类加载器读取`.class`文件的字节码，并将其加载到内存中的方法区；
2. 连接：包括验证（确保字节码文件的正确性）、准备（为静态变量分配内存并赋初始值）、解析（将常量池中的符号引用转换为直接引用）；
3. 初始化：这是类加载机制的最后一步，在这个阶段，Java程序代码才开始真正执行，此阶段负责执行静态变量和执行静态块。
初始化的时候才会为普通成员变量赋值，而在准备阶段已经为静态变量赋过一次值、静态方法已经初始过。也就是说如果我们在静态方法中调用非静态成员变量会超前，可能会调用了一个还未初始化的变量。因此编译器会报错。

### 静态初始化顺序


### 静态与线程安全

