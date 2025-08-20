---
title: "Java内部类和代码块"
date: 2025-08-20
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-inner-class-code-block"
---


你是否曾写过Lambda表达式，那你有没有思考过，Lambda表达式属于内部类还是代码块？
```java
// 传统匿名内部类方式
Thread thread = new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("线程正在运行 (匿名内部类)");
    }
});

// Lambda 表达式方式
Thread lambdaThread = new Thread(
        () -> {
            System.out.println("线程正在运行 (Lambda)");
        }
);
```
其实Lambda表达式既不属于内部类，也不属于代码块。它是一种独立的、全新的语法结构，用于表示一个函数式接口的实例。

但Lambda表达式与内部类（尤其是匿名内部类）有着密切的“血缘关系”，并且在视觉上看起来像是一个“代码块”。
因为它的实现和设计思想，就是Java两个最基础、最强大的古老特性：内部类与代码块。

## 内部类
### 成员内部类
### 静态内部类
### 局部内部类
### 匿名内部类



## 代码块概述
**在 Java 中，代码块是由大括号 {} 包围的语句集合，必须是类、接口、方法或构造器的一部分，它是一个独立的执行单元。**

代码块也属于类中的成员，和属性，方法一样，是类的一部分，只不过相比方法来看，代码块只有"方法体"。
它没有签名（无名、无参、无返回值），不能被显式调用，其执行完全由 JVM 根据类型隐式触发。

代码块定义格式如下：
```text
[修饰符] {
        //方法体语句。（代码）
}
```

代码块定义位置注意事项：
1. 对于作为类成员的代码块，唯一可用的修饰符是 static，用于区分静态与实例初始化，严禁使用 public、private 等访问修饰符。
2. 在一个类中，每种类型的代码块都可以定义多个，没有硬性数量限制。它们会按照在代码中出现的顺序依次执行。
3. 代码块必须有一个明确的、语法允许的“宿主”（类、接口或方法/构造器），它不能独立存在，也不能在不允许的位置存在。
4. 静态代码块和实例代码块是类的成员，必须直接定义在类体内部，与字段、方法等成员同级。
静态代码块可定义于普通类、抽象类以及（自 Java 8 起的）接口中，而实例代码块因涉及实例初始化，不能定义在接口内。局部代码块则必须定义在方法、构造器或其他代码块的内部。

### 代码块的修饰符
代码块定义格式如下：
```text
[修饰符] {
        //方法体语句。（代码）
}
```
**需要注意，代码块前的修饰符，有且只能加 static，不能为代码块使用任何其他修饰符。**

question1：为什么不能用 public, private 等访问修饰符？
- 访问修饰符（public, private, protected）的作用是控制其他类能否访问该成员。
但是，你如何“访问”一个代码块？
代码块不是方法，没有名字，不能被调用。它的执行是由 JVM 在后台自动触发的。因此，谈论一个代码块是 public（公开可访问）还是 private（私有）是完全没有意义的。你无法从 ClassB 中“调用” ClassA 的静态块或实例块。它们的执行是内部机制，与外部访问无关。

question2：为什么不能用 final, synchronized 等？
- final: 用于表示不可变。代码块是一次性执行的逻辑，不存在“不可变”的概念。
- synchronized: 用于实现同步，控制多线程访问。虽然从技术上来说，也许可以设计成允许给静态块加 synchronized 来保证类加载的线程安全，但 JVM 已经保证了类加载过程本身就是线程安全的，所以不需要开发者额外指定。
而对于实例块，其逻辑完全可以移到 synchronized 方法或块中，没有必要修饰整个初始化块。

所以，static 对于代码块来说，与其说是一个“修饰符”，不如说是一个关键字标签，可以将代码块分为非静态代码块（无static修饰）和静态代码块（添加了static修饰符）。

### 局部代码块
- https://developer.aliyun.com/article/1182863

### 实例代码块
### 静态代码块

### 实际开发中的代码块
1. 经典使用场景，当多个构造器中有重复的代码片段时，我们就可以将这些重复的相同代码提取出来，放在一个非静态代码块中，这样每次创建一个该类对象，都会隐式地调用一次代码块，就不用你在每个构造器中都写一遍了，大大提高了代码的复用性。
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
2. 如果你的初始化逻辑可能抛出受检异常（Checked Exception），而你又不想在每一个构造器的签名上都声明 throws，实例代码块提供了一个集中处理的地方。
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
3. 匿名内部类不能直接访问非 final 的局部变量，使用实例代码块作为一个“桥梁”，将外部方法的非 final 参数“捕获”并复制到 final 变量中，从而让内部类可以访问。
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

## 初始化顺序
## 封装的艺术

