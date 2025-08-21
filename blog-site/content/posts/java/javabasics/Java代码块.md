---
title: "Java代码块"
date: 2025-08-21
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-code-block"
---



## 概述
**在Java中，代码块是由大括号`{}`包围的语句集合，必须是类、接口、方法或构造器的一部分，它是一个独立的执行单元。**

代码块定义格式如下：
```text
[修饰符] {
        //方法体语句。（代码）
}
```

代码块也属于类中的成员，和属性、方法一样，是类的一部分，只不过相比方法来看，代码块只有"方法体"。
它没有签名（无名、无参、无返回值），不能被显式调用，其执行完全由JVM根据类型隐式触发。

代码块定义、使用位置注意事项：
1. 对于作为类成员的代码块，唯一可用的修饰符是 `static`，用于区分静态与实例初始化，严禁使用 `public`、`private` 等访问修饰符。
2. 在一个类中，每种类型的代码块都可以定义多个，没有硬性数量限制。它们会按照在代码中出现的顺序依次执行。
3. 代码块必须有一个明确的、语法允许的“宿主”（类、接口或方法/构造器），它不能独立存在，也不能在不允许的位置存在。
4. 静态代码块和实例代码块是类的成员，必须直接定义在类体内部，与字段、方法等成员同级。
   静态代码块可定义于普通类、抽象类以及（自Java8起的）接口中，而实例代码块因涉及实例初始化，不能定义在接口内。局部代码块则必须定义在方法、构造器或其他代码块的内部。

## 代码块的修饰符
代码块定义格式如下：
```text
[修饰符] {
        //方法体语句。（代码）
}
```
**需要注意，代码块前的修饰符，有且只能加 `static`，不能为代码块使用任何其他修饰符。**

question1：为什么不能用 `public`, `private` 等访问修饰符？
- 访问修饰符（`public`, `private`, `protected`）的作用是控制其他类能否访问该成员。
  但是，你如何“访问”一个代码块？
  代码块不是方法，没有名字，不能被调用。它的执行是由JVM在后台自动触发的。因此，谈论一个代码块是 `public`还是`private`是完全没有意义的。你无法从`ClassB`中“调用”`ClassA`的静态块或实例块。它们的执行是内部机制，与外部访问无关。

question2：为什么不能用 `final`, `synchronized` 等？
- `final`: 用于表示不可变。代码块是一次性执行的逻辑，不存在“不可变”的概念。
- `synchronized`: 用于实现同步，控制多线程访问。虽然从技术上来说，也许可以设计成允许给静态块加 `synchronized` 来保证类加载的线程安全，但JVM已经保证了类加载过程本身就是线程安全的，所以不需要开发者额外指定。
  而对于实例块，其逻辑完全可以移到 `synchronized` 方法或块中，没有必要修饰整个初始化块。

所以，`static`对于代码块来说，与其说是一个“修饰符”，不如说是一个关键字标签，可以将代码块分为非静态代码块和静态代码块。

## 局部代码块
局部代码块，也称为普通语句块或局部语句块，是由一对大括号`{}`定义的、位于在方法、构造函数或其他代码块（包括实例代码块）内部的代码集合。
它的核心目的不是执行某些初始化（像实例块或静态块那样），而是为了精细地控制变量的作用域和生命周期。

实际上，你每天都在使用局部代码块，只是可能没意识到。`if`、`for`、`while`、`switch` 等控制流语句后面跟的`{}`就是一个局部代码块。
```java
for (int i = 0; i < 10; i++) { // 这个 { 标志着局部代码块的开始
    String message = "Iteration: " + i; // message 的作用域仅在循环内
    System.out.println(message);
} // 代码块结束，i 和 message 都无法再访问

if (condition) { // 另一个代码块
    int localVar = 42;
    System.out.println(localVar);
}
```

局部代码块核心特点：
1. 作用域限制：在局部代码块内部声明的变量，其作用域被严格限制在该代码块内。一旦执行流离开这个代码块，这些变量就会立即失效，无法再被访问。
2. **没有关键字**：它不像静态代码块或实例代码块那样有 `static` 或特定的位置标识，它就是单纯的一对 `{}`。
3. 执行时机：它不是自动执行的，只有当程序的执行流程进入这个代码块时，其中的代码才会按顺序执行。
4. 命名空间管理：允许在不同的块中使用相同的变量名，因为它们处于不同的作用域，不会冲突。

局部代码块的主要作用就是**限制变量生命周期，避免命名污染**。在大型方法中，你可能需要一些临时变量来完成中间计算。如果不使用代码块，这些临时变量的作用域将是整个方法，这会导致命名冲突、可读性降低、内存占用。
```java
public void calculateComplexStuff() {
    // ... 一些其他代码 ...

    // 阶段一计算：需要临时变量 temp1, temp2
    {
        double temp1 = doSomeCalculationA();
        double temp2 = doSomeCalculationB();
        double stageOneResult = temp1 * temp2;
        saveIntermediateResult(stageOneResult);
    } // temp1, temp2, stageOneResult 在这里“死亡”

    // ... 更多代码 ...

    // 阶段二计算：我甚至可以再次使用变量名 temp1, temp2，因为它们在上一个块已经失效了。
    {
        int temp1 = getAnotherValue(); // 与上面的 temp1 类型、名字都相同，但无冲突！
        int temp2 = getYetAnotherValue();
        int stageTwoResult = temp1 + temp2;
        processResult(stageTwoResult);
    } // 这个块的变量也在这里失效

    // ... 方法的剩余部分 ...
}
```
匿名内部类不能直接访问非 `final` 的局部变量，使用实例代码块作为一个“桥梁”，将外部方法的非 `final` 参数“捕获”并复制到 `final` 变量中，从而让内部类可以访问。
 ```java
 public class Button {
     private String title;
 
     public void addActionListener(final String userRole) { // 假设userRole不是final
         final String finalUserRole; // 定义一个final变量
 
         // 使用实例代码块将参数值赋给final变量
         {
             finalUserRole = userRole.toUpperCase(); // 甚至可以做一些处理
         }
 
         // 现在匿名内部类可以安全地访问finalUserRole了
         this.addActionListener(new ActionListener() {
             @Override
             public void actionPerformed(ActionEvent e) {
                 // 直接访问userRole会编译错误（如果它不是final）
                 // 但访问finalUserRole是完全合法的
                 System.out.println("Button clicked by: " + finalUserRole);
             }
         });
     }
 }
 ```

局部代码块是一个有用的工具，但不是所有方法都需要它。
如果在短小的方法中强行使用局部代码块来分割逻辑，反而会让代码显得支离破碎，降低可读性。**它的最佳应用场景是在较长、较复杂的方法中。**
好的代码追求的是清晰和简洁，而不是不必要的复杂性和结构。
```java
public class MathCalculator {
    
    // 过于碎片化的实现
    public double calculateCircleArea(double radius) {
        {
            double pi = Math.PI;
            {
                double radiusSquared = radius * radius;
                {
                    double area = pi * radiusSquared;
                    {
                        System.out.println("计算完成");
                        return area;
                    }
                }
            }
        }
    }
    
    // 清晰简洁的实现
    public double calculateCircleArea(double radius) {
        return Math.PI * radius * radius;
    }
}
```

## 实例代码块
实例代码块，也称为实例初始化器，是定义在类体中、没有名称、没有 `static` 关键字修饰、只用一对大括号 `{}` 包裹的代码块。
它的核心作用是在每次创建类的对象时，为对象的实例变量执行初始化操作。
```java
public class DatabaseConnection {
    
    // 实例代码块：所有构造器共享的初始化逻辑
    {
        System.out.println("I am DatabaseConnection ");
    }
    // ... 其他方法 ...
}
```

实例代码块核心特征：
1. 无关键字：它前面没有任何关键字。
2. 自动执行：你不需要显式调用它。每次使用 `new` 关键字创建对象时，JVM都会自动执行它。
3. 执行时机：它在构造函数之前执行。
4. 定义位置：它直接定义在类体中，与字段、方法、构造器是同级关系。

非静态代码块是对对象进行初始化，初始化实例变量或执行实例初始化逻辑：
- 执行时机：在**每次创建对象实例时自动执行**，具体来说：
    1. 只有在使用 `new` 关键字创建对象时，非静态代码块才会执行。
    2. 如果仅仅通过“类名.”的形式调用静态成员（如静态方法或静态字段），不会创建对象，因此非静态代码块不会执行。
- 关键点：非静态代码块的执行依赖于对象实例化，与类加载无关。

实例代码块的一个经典使用场景，当多个构造器中有重复的代码片段时，我们就可以将这些重复的相同代码提取出来，放在一个非静态代码块中，这样每次创建一个该类对象，都会隐式地调用一次代码块，就不用你在每个构造器中都写一遍了，大大提高了代码的复用性。
 ```java
 public class Player {
     private String name;
     private int level;
     private String guild;
     private long createdAt; // 创建时间戳
 
     // 构造器1: 只提供名字，其他用默认值
     public Player(String name) {
         this.name = name;
         this.level = 1;
         this.guild = "None";
         // 重复的代码：记录创建时间
         this.createdAt = System.currentTimeMillis();
         System.out.println("A new player is born!");
     }
 
     // 构造器2: 提供名字和公会
     public Player(String name, String guild) {
         this.name = name;
         this.level = 1;
         this.guild = guild;
         // 重复的代码：记录创建时间
         this.createdAt = System.currentTimeMillis();
         System.out.println("A new player is born!");
     }
 
     // 构造器3: 提供所有信息
     public Player(String name, int level, String guild) {
         this.name = name;
         this.level = level;
         this.guild = guild;
         // 重复的代码：记录创建时间
         this.createdAt = System.currentTimeMillis();
         System.out.println("A new player is born!");
     }
 }
 ```
优化后，使用实例代码块提取重复逻辑。
 ```java
 public class Player {
     private String name;
     private int level;
     private String guild;
     private long createdAt;
 
     // 【实例代码块】：提取所有构造器的公共初始化代码
     {
         this.createdAt = System.currentTimeMillis();
         System.out.println("A new player is born!");
     }
 
     // 构造器1
     public Player(String name) {
         this.name = name;
         this.level = 1;
         this.guild = "None";
         // 公共代码已由实例代码块执行，此处无需再写
     }
 
     // 构造器2
     public Player(String name, String guild) {
         this.name = name;
         this.level = 1;
         this.guild = guild;
     }
 
     // 构造器3
     public Player(String name, int level, String guild) {
         this.name = name;
         this.level = level;
         this.guild = guild;
     }
 }
 ```
如果你的初始化逻辑可能抛出受检异常，而你又不想在每一个构造器的签名上都声明`throws`，实例代码块提供了一个集中处理的地方。
 ```java
 public class ConfigurationLoader {
     private Properties config;
 
     // 实例代码块处理可能抛出异常的复杂初始化
     {
         config = new Properties();
         try (InputStream input = getClass().getClassLoader().getResourceAsStream("config.properties")) {
             if (input == null) {
                 throw new RuntimeException("Config file not found!"); // 转为运行时异常
             }
             config.load(input);
         } catch (IOException e) { // 捕获受检异常
             // 将其封装成运行时异常再抛出，这样构造器签名就不用声明throws
             throw new RuntimeException("Failed to load configuration", e);
         }
     }
 
     // 所有构造器都无需关心配置加载的异常
     public ConfigurationLoader() {
     }
     public ConfigurationLoader(String otherParam) {
         // config已经被成功加载或已抛出异常
     }
 
     public String getProperty(String key) {
         return config.getProperty(key);
     }
 }
```

## 静态代码块
静态代码块，也称为静态初始化器，是使用 `static` 关键字修饰、定义在类体中、并用一对大括号`{}`包裹的代码块。
它的核心作用是**在类被JVM加载到内存时，为类的静态变量执行一次性的、复杂的初始化操作。**

静态代码块核心特点：
1. 有`static`关键字：这是它与实例代码块最显著的区别。
2. 自动执行且仅一次：它会在类加载时自动执行，并且在整个程序生命周期中只执行一次。
3. 执行时机极早：它的执行时机非常早，早于任何对象的创建（`new`）、早于任何静态方法的调用、早于任何静态变量的访问。
4. 无法访问实例成员：它只能访问类的静态成员（静态变量和静态方法），不能直接访问实例变量和实例方法，因为此时可能还没有任何对象被创建。

静态代码块是对类进行初始化，初始化静态变量或执行静态初始化逻辑：
- 执行时机：在**类加载**时自动执行，且仅**执行一次**。类加载发生在以下情况：
    1. 创建类的实例（`new MyClass()`）。
    2. 调用类的静态方法（`MyClass.staticMethod()`）。
    3. 访问类的静态字段（`System.out.println(MyClass.staticField)`）。
    4. 使用反射（`Class.forName("MyClass")`）。
    5. 初始化类的子类（会先触发父类的加载）。
  ```java
  class Parent {
      static {
          System.out.println("Parent的静态代码块 - 父类被加载初始化");
      }
  }
  
  class Child extends Parent {
      static {
          System.out.println("Child的静态代码块 - 子类被加载初始化");
      }
  }
  
  public class Test {
      public static void main(String[] args) {
          // 仅仅创建子类对象，但会看到父类的静态块先执行
          Child c = new Child();
      }
  }
  ```
    6. 作为程序入口点（包含 `main()` 方法的类启动时）。
  ```java
  public class MyApp {
      static {
          System.out.println("MyApp的静态代码块 - 主类先被初始化");
      }
  
      public static void main(String[] args) {
          System.out.println("main方法现在才开始执行");
      }
  }
  ```
- 关键点：静态代码块的执行只与类加载有关，与对象实例化无关。一旦类被加载，静态代码块就会运行，之后不会再运行。

加载原生库是静态代码块非常经典且重要的用途，常见于JNI编程中。
```java
public class NativeWrapper {
    // 静态代码块用于在类加载时确保本地库被加载
    static {
        try {
            System.loadLibrary("myNativeLibrary"); // 加载动态链接库 (.dll, .so, .dylib)
            System.out.println("原生库加载成功");
        } catch (UnsatisfiedLinkError e) {
            System.err.println("无法加载原生库: " + e.getMessage());
            System.exit(1); // 库加载失败，程序无法运行，直接退出
        }
    }

    // 声明本地方法
    public native void performNativeOperation();

    // 类的其他部分...
}
```
当静态成员（如`Map`,`List`）需要复杂的初始化，无法用一行简单的赋值完成时，也推荐使用静态初始化块。
```java
public class CountryCodeLookup {
    // 一个需要复杂初始化的静态Map
    private static final Map<String, String> COUNTRY_CODE_MAP;

    // 使用静态代码块进行初始化
    static {
        // 先创建一个普通的HashMap
        Map<String, String> tempMap = new HashMap<>();
        // 执行复杂的填充逻辑，这些逻辑无法在声明时完成
        tempMap.put("US", "United States");
        tempMap.put("GB", "United Kingdom");
        tempMap.put("FR", "France");
        tempMap.put("DE", "Germany");
        // 可以从文件或数据库读取数据来填充
        // loadFromFile(tempMap, "codes.txt"); 

        // 初始化完成后，使其成为不可修改的Map，保证安全
        COUNTRY_CODE_MAP = Collections.unmodifiableMap(tempMap);
        System.out.println("国家代码映射表初始化完成，大小: " + COUNTRY_CODE_MAP.size());
    }

    public static String getCountryName(String code) {
        return COUNTRY_CODE_MAP.get(code);
    }
}
```
总而言之，静态代码块是Java类生命周期起点的“启动装置”。它把那些昂贵、复杂、且必须在类可用之前完成的一次性初始化任务封装起来，是构建健壮、高效应用程序的重要工具。

## 代码块执行顺序
在单个类中，当创建对象时，代码块的执行顺序是：
1. 静态代码块 (仅第一次类加载时执行)
2. 实例代码块 (每次创建对象时执行)
3. 构造方法 (每次创建对象时执行)

在继承关系中，执行顺序遵循"先父后子"的原则，顺序为：
1. 父类静态代码块 (仅第一次类加载时执行)
2. 子类静态代码块 (仅第一次类加载时执行)
3. 父类实例代码块
4. 父类构造方法
5. 子类实例代码块
6. 子类构造方法

代码块执行规则总结：
1. 静态优先于实例：静态代码块在类加载时执行，实例代码块在对象创建时执行。
2. 父类优先于子类：在继承体系中，先执行父类的代码块，再执行子类的代码块。
3. 书写顺序决定执行顺序：在同一类中，代码块按照它们在源代码中的书写顺序执行。
4. 静态代码块只执行一次：无论创建多少对象，静态代码块只在类第一次加载时执行一次。
5. 局部代码块随执行流执行：局部代码块在程序执行到它们时执行，与类加载和对象创建无关。


