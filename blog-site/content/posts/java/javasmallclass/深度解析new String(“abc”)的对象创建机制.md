---
title: "深度解析new String(“abc”)的对象创建机制"
date: 2025-02-23
draft: false
tags: ["Java小课堂","Java","随笔"]
slug: "java-new-string-object"
---


## 核心结论
**创建对象数：2 个（当字符串常量池不存在 "abc" 时）。**
第一个对象是"abc"，它属于字符串字面量，因此编译时期会在字符串常量池中创建一个字符串对象，指向这个 "abc" 字符串字面量，而使用`new`的方式会在堆中创建一个字符串对象。

| 对象类型         | 存储位置        | 创建时机           | 生命周期       |
|------------------|---------------|------------------|--------------|
| 字符串常量对象    | 字符串常量池    | 类加载阶段         | 永久存在      |
| 普通字符串对象    | 堆内存         | `new` 执行时      | 跟随GC回收    |

## 底层机制分步解析
JDK8 中`new String()`源代码如下：
```java
/**
 * Initializes a newly created {@code String} object so that it represents
 * the same sequence of characters as the argument; in other words, the
 * newly created string is a copy of the argument string. Unless an
 * explicit copy of {@code original} is needed, use of this constructor is
 * unnecessary since Strings are immutable.
 *
 */
public String(String original) {
  // 直接将原字符串的字符数组复制到新对象
  this.value = original.value;
  this.hash = original.hash; // 复用哈希值
}
```
文档注释大意：初始化新创建的`String`对象，使其表示与实参相同的字符序列。换句话说，用这个方法新创建的字符串是实参字符串的副本。
除非需要显式复制形参的值，否则没有必要使用这个构造函数，因为字符串是不可变的。

由于`String`不可变性，此构造函数通常不必要使用，Java 13+已标记为`@Deprecated`。
- **首次出现的字面量**，类加载时触发字符串驻留（`intern`）。
  ```java
  // 类加载时自动执行
  String poolStr = "abc"; // 在常量池注册
  ```
- **已存在的字面量**，则直接引用常量池对象。
  ```java
  String existStr = "abc"; // 不再创建新对象
  ```

## 字节码实证分析
创建一个测试类，用字节码观察，`new String("abc")`是否创建两个对象。
```java
public class MainTest {
  public static void main(String[] args) {
    String s = new String("abc");
  }
}
```
使用`javap -verbose`命令进行反编译，得到以下内容：
```
// ...
Constant pool:
// ...
   #2 = Class              #18            // java/lang/String
   #3 = String             #19            // abc
// ...
  #18 = Utf8               java/lang/String
  #19 = Utf8               abc
// ...

  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=3, locals=2, args_size=1
         0: new           #2                  // class java/lang/String
         3: dup
         4: ldc           #3                  // String abc
         6: invokespecial #4                  // Method java/lang/String."<init>":(Ljava/lang/String;)V
         9: astore_1
// ...
```
在`Constant Pool`中，`#19`存储这字符串字面量`"abc"`，`#3`是`String Pool`的字符串对象，它指向`#19`这个字符串字面量。
在`main`方法中，`0:`行使用`new #2`在堆中创建一个字符串对象，并且使用`ldc #3`将`String Pool`中的字符串对象作为`String`构造函数的参数。
- `ldc #3`：将常量池中的"abc"对象压入操作数栈；
- `new #2`：在堆内存分配新String对象；
- `invokespecial #4`：调用String构造函数，复制原字符串的value数组；

所以能看到使用`new String("abc")`的方式创建字符串是创建两个对象。
![newString创建对象](/posts/annex/images/essays/newString创建对象.png)