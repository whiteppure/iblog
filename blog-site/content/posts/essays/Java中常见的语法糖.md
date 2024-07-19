---
title: "Java中常见的语法糖"
date: 2024-07-14
draft: false
tags: ["Java","随笔"]
slug: "java-syntax-sugar"
---

## 概览
语法糖是指编程语言中的一种语法结构，它们并不提供新的功能，而是为了让代码更易读、更易写而设计的。
语法糖使得某些常见的编程模式或操作变得更加简洁和直观，但在底层实现上，并没有引入新的语言特性或改变语言的表达能力。

尽管语法糖使得代码更加简洁和易读，但实际执行时，底层代码仍然需要遵循编程语言的基本语法和规则。
在编译阶段，编译器将使用语法糖编写的高级语法转换为更基础、更原始的语法结构，便于生成相应的目标代码，如字节码或机器码，这就是解语法糖的过程。
这个过程确保了最终执行的代码在语义上与原始的语法糖一致，同时能够在目标环境中正确运行。
Java编译器的`desugar()`方法负责这个过程，这个过程确保了Java语言的高级特性可以在不增加JVM复杂性的情况下实现，从而提高了开发效率和代码可读性。

举例来说，假设有如下的Java语法糖：
```text
List<String> list = new ArrayList<>();
list.add("Hello");
String s = list.get(0);
```
在这段代码中，泛型`<String>`是语法糖。编译器在编译这段代码时，会将其转换为如下的基础语法：
```text
List list = new ArrayList();
list.add("Hello");
String s = (String) list.get(0);
```

## 泛型
泛型允许类、接口和方法在声明时使用参数化类型，提供了编译时类型安全检查机制，避免了强制类型转换的麻烦。
但Java中的泛型只在程序源代码中有效，在编译后的字节码中会自动用强制类型转换进行替代。也就是说，Java语言中的泛型机制其实就是一颗语法糖，
```text
// 泛型示例
List<String> names = new ArrayList<>();
names.add("Alice");
String first = names.get(0);
```
```text
// 解语法糖
List names = new ArrayList();
names.add("Alice");
String first = (String) names.get(0);
```

## 增强for循环
增强for循环用于遍历数组或集合，即要么是一个数组，要么实现了`Iterable`接口，与普通for循环相比，功能更强并且代码更简洁。
```text
public static void main(String[] args) {
    String[] params = new String[]{"hello","world"};
    //增强for循环对象为数组
    for(String str : params){
        System.out.println(str);
    }

    List<String> lists = Arrays.asList("hello","world");
    //增强for循环对象实现Iterable接口
    for(String str : lists){
        System.out.println(str);
    }
}
```
```text
// 解语法糖
public static void main(String[] args) {
   String[] params = new String[]{"hello", "world"};
   String[] lists = params;
   int var3 = params.length;
   //数组形式的增强for退化为普通for
   for(int str = 0; str < var3; ++str) {
       String str1 = lists[str];
       System.out.println(str1);
   }

   List var6 = Arrays.asList(new String[]{"hello", "world"});
   Iterator var7 = var6.iterator();
   //实现Iterable接口的增强for使用iterator接口进行遍历
   while(var7.hasNext()) {
       String var8 = (String)var7.next();
       System.out.println(var8);
   }

}
```

## 自动装箱与拆箱
自动装箱和自动拆箱是Java中的语法糖，用于简化基本数据类型和其对应包装类型之间的转换操作。
当将基本数据类型赋值给对应的包装类型时，编译器会调用包装类型的`valueOf()`方法来创建一个包装对象，并将基本数据类型的值传递给这个方法。
当需要使用包装类型对象中的值进行基本数据类型的操作时，编译器会自动调用包装类型对象的`xxxValue()`方法，将包装对象转换为对应的基本数据类型值。
```text
Integer boxedNum = 10; // 自动装箱
int num = boxedNum; // 自动拆箱
```
```text
// 解语法糖
Integer boxedNum = Integer.valueOf(10);
int num = boxedNum.intValue();
```

## 字符串拼接
拼接字符串最简单的方式就是直接使用符号"+"来拼接，其实“+”是Java提供的一个语法糖。字符串拼接使用"+"操作符，在编译时会被转换为`StringBuilder`操作。
```text
String message = "Hello, " + name + "!";
```
```text
// 解语法糖
StringBuilder sb = new StringBuilder();
sb.append("Hello, ");
sb.append(name);
sb.append("!");
String message = sb.toString();
```

## 枚举类型
枚举类型就是一些具有相同特性的类常量，在Java中类的定义使用`class`，枚举类的定义使用`enum`。
但在Java的字节码结构中，其实并没有枚举类型，枚举类型只是一个语法糖，在编译完成后被编译成一个普通的类。这个类继承`java.lang.Enum`，并被`final`关键字修饰。
```text
public enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
}
```
```text
// 解语法糖
public final class Day extends Enum<Day> {
    public static final Day MONDAY = new Day("MONDAY", 0);
    public static final Day TUESDAY = new Day("TUESDAY", 1);
    public static final Day WEDNESDAY = new Day("WEDNESDAY", 2);
    public static final Day THURSDAY = new Day("THURSDAY", 3);
    public static final Day FRIDAY = new Day("FRIDAY", 4);
    public static final Day SATURDAY = new Day("SATURDAY", 5);
    public static final Day SUNDAY = new Day("SUNDAY", 6);

    private final String name;
    private final int ordinal;

    private Day(String name, int ordinal) {
        this.name = name;
        this.ordinal = ordinal;
    }

    public String name() {
        return name;
    }

    public int ordinal() {
        return ordinal;
    }

    public static Day[] values() {
        return (Day[]) $VALUES.clone();
    }

    public static Day valueOf(String name) {
        return (Day) Enum.valueOf(Day.class, name);
    }

    private static final Day[] $VALUES = {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    };
}
```

## 可变参数
可变参数就是允许方法接受可变数量的参数。使用变长参数有两个条件，一是变长的那一部分参数具有相同的类型，二是变长参数必须位于方法参数列表的最后面。
变长参数同样是Java中的语法糖，其内部实现是Java数组。
```text
public void printNumbers(int... numbers) {}
```
```text
// 解语法糖
public void printNumbers(int[] numbers) {}
```

## 内部类
内部类就是定义在一个类内部的类，之所以引入内部类是因为有些时候一个类只在另一个类中引用，我们不想让其在另外一个地方被使用。
内部类可以在一个类内部定义，但在编译时会被转换为独立的类文件，并不是真正套在一个类的内部，而是分成两个类编译。
```text
class Outer {
    class Inner {
        void display() {
            System.out.println("Inner class method");
        }
    }
}
```
```text
// 解语法糖
class Outer {
    class Inner {
        final Outer outer;
        Inner(Outer outer) {
            this.outer = outer;
        }
        void display() {
            System.out.println("Inner class method");
        }
    }
}
```

## try-with-resources
`try-with-resources`语句简化了资源管理，使得资源在使用后自动关闭，这个语法糖就能让代码及其简洁。原理是编译器把它转换成了`try-catch-finally`。
```text
try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
} catch (IOException e) {
    e.printStackTrace();
}
```
```text
// 解语法糖
BufferedReader reader = null;
try {
    reader = new BufferedReader(new FileReader("file.txt"));
    String line = reader.readLine();
    System.out.println(line);
} catch (IOException e) {
    e.printStackTrace();
} finally {
    if (reader != null) {
        try {
            reader.close();
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
```

## Lambda表达式
`Lambda`表达式是Java中的一种语法糖，它提供了一种简洁地表示匿名函数的方法，在语法上的简洁性大大提升了代码的可读性和编写效率。
在编译后，`Lambda`表达式会被转换为相应的匿名内部类形式。
```text
Runnable r = () -> System.out.println("Hello, World!");
```
```text
// 解语法糖
Runnable r = new Runnable() {
    @Override
    public void run() {
        System.out.println("Hello, World!");
    }
};
```
