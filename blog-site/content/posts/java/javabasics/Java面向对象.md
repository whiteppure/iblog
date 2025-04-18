---
title: "Java面向对象"
date: 2021-02-15
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-object-oriented"
---

## 概览
面向对象简称OO(`object-oriented`)是相对面向过程(`procedure-oriented`)来说的，是一种编程思想，Java就是一门面向对象的语言，包括三大特性和六大原则。
其中，三大特性指的是封装、继承和多态。六大原则指的是单一职责原则、开放封闭原则、迪米特原则、里氏替换原则、依赖倒置原则以及接口隔离原则。
单一职责原则是指一个类应该是一组相关性很高的函数和数据的封装，这是为了提高程序的内聚性，而其他五个原则是通过抽象来实现的，目的是为了降低程序的耦合性以及提高可扩展性。

面向对象编程简称OOP(`Object-oriented programming`)，是将事务高度抽象化的编程模式。
面向对象编程是以功能来划分问题的，将问题分解成一个一个步骤，对每个步骤进行相应的抽象，形成对应对象，通过不同对象之间的调用，组合成某个功能解决问题。

面向对象是对比面向过程来说的，面向过程编程简称POP(`Procedural oriented programming`)。
面向过程编程是一种以过程为中心的编程方式，主要通过一系列步骤来处理数据。程序通过调用函数一步步完成任务，每个函数都执行特定的操作。
```java
// 面向过程编程示例：计算矩形面积

public class ProceduralExample {
    // 定义计算面积的函数
    public static int calculateArea(int width, int height) {
        return width * height;
    }

    public static void main(String[] args) {
        int width = 5;
        int height = 10;
        int area = calculateArea(width, height);
        System.out.println("矩形的面积是: " + area);
    }
}
```

面向对象编程是一种以对象为中心的编程方式，将数据和操作封装在一起，通过对象的交互来完成程序的功能。对象是类的实例，类定义了对象的属性和方法。
```java
// 面向对象编程示例：计算矩形面积

// 定义矩形类
class Rectangle {
    private int width;
    private int height;

    // 构造函数
    public Rectangle(int width, int height) {
        this.width = width;
        this.height = height;
    }

    // 计算面积的方法
    public int calculateArea() {
        return width * height;
    }
}

public class ObjectOrientedExample {
    public static void main(String[] args) {
        // 创建矩形对象
        Rectangle rectangle = new Rectangle(5, 10);
        // 调用对象的方法计算面积
        int area = rectangle.calculateArea();
        System.out.println("矩形的面积是: " + area);
    }
}
```
通过例子可以看出面向对象更重视不重复造轮子，即创建一次重复使用。
简而言之，用面向过程的方法写出来的程序是一份蛋炒饭，而用面向对象写出来的程序是一份盖浇饭，就是在一碗白米饭上面浇上一份盖菜，你喜欢什么菜，你就浇上什么菜。

面向对象是模型化的，你只需抽象出几个类，进行封装成各个功能，通过不同对象之间的调用来解决问题，而面向过程需要把问题分解为几个步骤，每个步骤用对应的函数调用即可。
面向过程是具体化的、流程化的，解决一个问题需要你一步一步的分析，一步一步的实现。
面向对象的底层其实还是面向过程，把面向过程抽象成类，然后进行封装，方便我们我们使用就是面向对象了。

抽象会使复杂的问题更加简单化，面向对象更符合人类的思维，而面向过程则是机器的思想。
选择哪种编程范式取决于具体的应用场景和开发需求。对于复杂系统的开发，面向对象更有优势，因为它可以更好地组织和管理代码；而对于一些简单的任务，面向过程可能更加直观和高效。

## 软件设计原则
软件设计原则是指导软件开发过程中设计和构建软件系统的一组规则。
这些规则的目的是为了让程序达到高内聚、低耦合以及提高扩展性，其实现手段是面向对象的三大特性：封装、继承以及多态。

| 设计原则名称   | 核心思想                                                         |
| -------------- | ---------------------------------------------------------------- |
| 单一职责原则   | 一个类只负责一个特定的职责                                       |
| 开放封闭原则   | 软件实体应该可以扩展，但不应该修改其已有代码                     |
| 依赖倒转原则   | 高层模块不应该依赖低层模块，两者都应该依赖抽象；抽象不应该依赖细节，细节应该依赖抽象 |
| 里氏替换原则   | 任何基类可以出现的地方，子类也可以出现                           |
| 接口隔离原则   | 使用多个专门的接口，而不是一个通用的接口                         |
| 合成复用原则   | 优先使用组合而不是继承来实现代码复用                             |
| 迪米特法则     | 一个对象应尽量少地了解其他对象，从而降低耦合度                   |


### 单一职责原则
其核心思想为，一个类最好只做一件事。单一职责原则可降低类的复杂度，提高代码可读性、可维护性、降低变更风险。
单一职责原则可以看做是低耦合、高内聚在面向对象原则上的引申，将职责定义为引起变化的原因，以提高内聚性来减少引起变化的原因。
职责过多，可能引起它变化的原因就越多，这将导致职责依赖，相互之间就产生影响，从而大大损伤其内聚性和耦合度。
通常意义下的单一职责，就是指只有一种单一功能，不要为类实现过多的功能点，以保证实体只有一个引起它变化的原因。
专注，是一个人优良的品质；同样的，单一也是一个类的优良设计。交杂不清的职责将使得代码看起来特别别扭牵一发而动全身，有失美感和必然导致丑陋的系统错误风险。
```java
public class MainTest {
    public static void main(String[] args) {
        Vehicle vehicle = new Vehicle();
        vehicle.running("汽车");
        // 飞机不是在路上行驶
        vehicle.running("飞机");
    }
}

/**
 * 在run方法中违反了单一职责原则
 * 解决方法根据不同的交通工具,分解成不同的类即可
 */
class Vehicle{
    public void running(String name) {
        System.out.println(name + "在路上行驶 ....");
    }
}

```
```java
// 解决
public class MainTest {
    public static void main(String[] args) {
        Driving driving = new Driving();
        driving.running("汽车");
        Flight flight = new Flight();
        flight.running("飞机");
    }
}

class Driving {
    public void running(String name) {
        System.out.println(name + "在路上行驶 ....");
    }
}

class Flight {
    public void running(String name) {
        System.out.println(name + "在空中飞行 ....");
    }
}
```
只要类中方法数量足够少，可以在方法级别保持单一职责原则。
```java
public class MainTest {
    public static void main(String[] args) {
        Vehicle2 vehicle2 = new Vehicle2();
        vehicle2.driving("汽车");
        vehicle2.flight("飞机");
    }
}
/*
 * 改进
 *↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
 */

class Vehicle2 {
    public void driving(String name) {
        System.out.println(name + "在路上行驶 ....");
    }
    public void flight(String name) {
        System.out.println(name + "在空中飞行 ....");
    }
}
```

### 开放封闭原则
软件实体应该是可扩展的，而不可修改的。也就是对提供方扩展开放，对使用方修改封闭的。开放封闭原则主要体现在两个方面：
- 对扩展开放，意味着有新的需求或变化时，可以对现有代码进行扩展，以适应新的情况。
- 对修改封闭，意味着类一旦设计完成，就可以独立完成其工作，而不要对其进行任何尝试的修改。 

实现开放封闭原则的核心思想是对抽象编程，而不对具体编程。
因为抽象相对稳定，让类依赖于固定的抽象，所以修改就是封闭的；而通过面向对象的继承和多态机制，又可以实现对抽象类的继承，通过覆写其方法来改变固有行为，实现新的拓展方法，所以就是开放的。
需求总是变化，当我们给程序添加或者修改功能时，需要用开放封闭原则来封闭变化满足需求，同时还能保持软件内部的封装体系稳定，不被需求的变化影响。
编程中遵循其他原则，以及使用其他设计模式的目的就是为了遵循开闭原则。

当软件需要变化时，尽量使用扩展的软件实体的方式行为来实现变化，而不是通过修改已有的代码来实现变化。
```java
public class MainTest {
    public static void main(String[] args) {
        Mother mother = new Mother();

        Son son = new Son();
        Daughter daughter = new Daughter();

        // 注入子类对象 如果扩展需要其他类 换成其他对象即可
        mother.setAbstractFather(son);
        mother.display();
    }
}

abstract class AbstractFather {

    protected abstract void display();

}
class Son  extends AbstractFather{
    @Override
    protected void display() {
        System.out.println("son class ...");
    }
}
class Daughter  extends AbstractFather{

    @Override
    protected void display() {
        System.out.println("daughter class ...");
    }
}

class Mother {

    private AbstractFather abstractFather;

    public void setAbstractFather(AbstractFather abstractFather) {
        this.abstractFather = abstractFather;
    }

    public void display() {
        abstractFather.display();
    }

}
```

### 依赖倒置原则
该原则依赖于抽象，具体而言就是高层模块不依赖于底层模块，二者都同依赖于抽象，抽象不依赖于具体，具体依赖于抽象。
我们知道，依赖一定会存在于类与类、模块与模块之间。当两个模块之间存在紧密的耦合关系时，最好的方法就是分离接口和实现，即在依赖之间定义一个抽象的接口使得高层模块调用接口，而底层模块实现接口的定义，以此来有效控制耦合关系，达到依赖于抽象的设计目标。
抽象的稳定性决定了系统的稳定性，因为抽象是不变的，依赖于抽象是面向对象设计的精髓，也是依赖倒置原则的核心。
依赖于抽象是一个通用的原则，而某些时候依赖于细节则是在所难免的，必须权衡在抽象和具体之间的取舍。

依赖于抽象，就是对接口编程，不要对实现编程。
```java
// 定义一个接口，表示消息发送者
interface MessageSender {
    void sendMessage(String message);
}

// 实现接口的EmailSender类
class EmailSender implements MessageSender {
    @Override
    public void sendMessage(String message) {
        System.out.println("Sending email with message: " + message);
    }
}

// 实现接口的SmsSender类
class SmsSender implements MessageSender {
    @Override
    public void sendMessage(String message) {
        System.out.println("Sending SMS with message: " + message);
    }
}

// 高层模块的MessageService类依赖于MessageSender接口
class MessageService {
    private MessageSender sender;

    // 通过构造函数注入依赖
    public MessageService(MessageSender sender) {
        this.sender = sender;
    }

    public void processMessage(String message) {
        // 使用MessageSender接口发送消息
        sender.sendMessage(message);
    }
}

public class Main {
    public static void main(String[] args) {
        // 使用EmailSender发送消息
        MessageSender emailSender = new EmailSender();
        MessageService emailService = new MessageService(emailSender);
        emailService.processMessage("Hello via Email!");

        // 使用SmsSender发送消息
        MessageSender smsSender = new SmsSender();
        MessageService smsService = new MessageService(smsSender);
        smsService.processMessage("Hello via SMS!");
    }
}
```

### 接口隔离原则
使用多个小的专门的接口，而不要使用一个大的总接口。具体而言，接口隔离原则体现在，接口应该是内聚的，应该避免“胖”接口。
一个类对另外一个类的依赖应该建立在最小的接口上，不要强迫依赖不用的方法，这是一种接口污染。
接口有效地将细节和抽象隔离，体现了对抽象编程的一切好处，接口隔离强调接口的单一性，而胖接口存在明显的弊端，会导致实现的类型必须完全实现接口的所有方法、属性等。
某些时候，实现类并非需要所有的接口定义，在设计上这是“浪费”，而且在实施上这会带来潜在的问题，对胖接口的修改将导致一连串的客户端程序需要修改，有时候这是一种灾难。
在这种情况下，应该将胖接口**分离**为多个特点的定制化方法，使得客户端仅仅依赖于它们的实际调用的方法，从而解除了客户端不会依赖于它们不用的方法。 

分离的手段主要有以下两种：
- 委托分离，通过增加一个新的类型来委托客户的请求，隔离客户和接口的直接依赖，但是会增加系统的开销。
- 多重继承分离，通过接口多继承来实现客户的需求，这种方式是较好的。

```java
public class MainTest {
    public static void main(String[] args) {
        FuncImpl func = new FuncImpl();
        func.func1();
        func.func2();
        func.func3();
    }
}

interface Function1{
    void func1();
    // 如果将接口中的方法都写在一个接口就会造成实现该接口就要重写该接口所有方法。
    // 当然Java 8 接口可以有实现，降低了维护成本，解了决该问题；
    // 但是我们还是应当遵循该原则，使得接口看起来更加清晰
    // void func2();
    // void func3();
}
interface Function2 {
    void func2();
}
interface Function3 {
    void func3();
}

class FuncImpl implements Function1,Function2,Function3{

    @Override
    public void func1() {
        System.out.println("i am function1 impl");
    }

    @Override
    public void func2() {
        System.out.println("i am function2 impl");
    }

    @Override
    public void func3() {
        System.out.println("i am function3 impl");
    }
}
```

### 里氏替换原则
里氏替换原则这一思想体现为对继承机制的约束规范，只有子类能够替换基类时，才能保证系统在运行期内识别子类，这是保证继承复用的基础。
在父类和子类的具体行为中，必须严格把握继承层次中的关系和特征，将基类替换为子类，程序的行为不会发生任何变化。
同时这一约束反过来则是不成立的，子类可以替换基类，但是基类不一定能替换子类。
里氏替换原则，主要着眼于对抽象和多态建立在继承的基础上，因此只有遵循了里氏替换原则，才能保证继承复用是可靠地。

实现的方法是面向接口编程，即将公共部分抽象为基类接口或抽象类，在子类中通过覆写父类的方法实现新的方式支持同样的职责。
里氏替换原则是关于继承机制的设计原则，违反了里氏替换原则就必然导致违反开放封闭原则。
里氏替换原则能够保证系统具有良好的拓展性，同时实现基于多态的抽象机制，能够减少代码冗余，避免运行期的类型判别。

简单来说就是子类可以扩展父类的功能，而不应该改变父类原有的功能。
如果通过重写父类方法来完成新的功能，这样写起来虽然简单，但整个体系的可复用性会非常差，特别是运用多态比较频繁时，程序运行出错的概率会非常大。
```java
public class MainTest {
    public static void main(String[] args) {
        Rectangle rectangle = new Rectangle();
        rectangle.setWidth(20);
        rectangle.setHeight(10);
        resize(rectangle);
        print(rectangle);
        System.out.println("=======================");
        Rectangle square = new Square();
        square.setWidth(10);
        // 因为 Square类 重写了父类 setWidth setHeight 方法，会导致 while 循环变成一个无限循环
        resize(square);
        print(square);
    }
    public static void resize(Rectangle rectangle){
        while (rectangle.getWidth() >= rectangle.getHeight()){
            rectangle.setHeight(rectangle.getHeight() + 1);
        }
    }

    public static void print(Rectangle rectangle){
        System.out.println(rectangle.getWidth());
        System.out.println(rectangle.getHeight());
    }
}

// 正方形
class Square  extends Rectangle{

    @Override
    public void setWidth(Integer width) {
        super.setWidth(width);
        super.setHeight(width);
    }

    @Override
    public void setHeight(Integer height) {
        super.setWidth(height);
        super.setHeight(height);
    }
}

// 长方形
class Rectangle {
    private Integer width;
    private Integer height;

    public void setWidth(Integer width) {
        this.width = width;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getWidth() {
        return width;
    }

    public Integer getHeight() {
        return height;
    }
}
```

### 合成复用原则
在面向对象设计中，可以通过两种方法在不同的环境中复用已有的设计和实现，即通过组合/聚合关系或通过继承。
首先应该考虑使用组合/聚合，因为组合/聚合可以使系统更加灵活，降低类与类之间的耦合度，一个类的变化对其他类造成的影响相对较少；
其次才考虑继承，在使用继承时，需要严格遵循里氏代换原则，有效使用继承会有助于对问题的理解，降低复杂度，而滥用继承反而会增加系统构建和维护的难度以及系统的复杂度，因此需要慎重使用继承复用。

尽量使用对象组合，而不是继承来达到复用的目的。
```java
// 引擎接口
interface Engine {
    void start();
}

// 电动引擎
class ElectricEngine implements Engine {
    @Override
    public void start() {
        System.out.println("Electric engine starts...");
    }
}

// 燃油引擎
class GasEngine implements Engine {
    @Override
    public void start() {
        System.out.println("Gas engine starts...");
    }
}

// 汽车类
class Car {
    private Engine engine;

    public Car(Engine engine) {
        this.engine = engine;
    }

    public void start() {
        engine.start();
        System.out.println("Car starts...");
    }
}

public class Main {
    public static void main(String[] args) {
        // 创建一个电动引擎汽车
        Engine electricEngine = new ElectricEngine();
        Car electricCar = new Car(electricEngine);
        electricCar.start();

        System.out.println("=======================");

        // 创建一个燃油引擎汽车
        Engine gasEngine = new GasEngine();
        Car gasCar = new Car(gasEngine);
        gasCar.start();
    }
}
```

### 迪米特法则
迪米特法则又叫最少知识原则，就是说一个对象应当对其他对象有尽可能少的了解。其核心思想为，降低类之间的耦合。
如果类与类之间的关系越密切，耦合度越大，当一个类发生改变时，对另一个类的影响也越大，所以一个对象应该对其他对象有最少的了解。
通俗地讲，一个类应该对自己需要耦合或调用的类知道得最少，被耦合或调用的类的内部是如何复杂都和我没关系，那是你的事情，我就知道你提供的`public`方法，我就调用这么多，其他的一概不关心。
迪米特法则其根本思想，是强调了类之间的松耦合。类之间的耦合越弱，越有利于复用，一个处在弱耦合的类被修改，不会对有关系的类造成搏击，也就是说，信息的隐藏促进了软件的复用。

迪米特法则还有个更简单的定义，只与直接的**朋友**交谈，不跟“陌生人”说话。
>朋友定义：每个对象都会与其他对象有耦合关系，只要两个对象之间有耦合关系，我们就说这两个对象之间是朋友关系。<br>
耦合的方式很多：依赖、关联、组合、聚合等。其中，我们称出现成员变量、方法参数、方法返回值中的类为直接的朋友，而出现在局部变量中的类不是直接的朋友。也就是说，陌生的类最好不要以局部变量的形式出现在类的内部。

```java
// 学生类
class Student {
    private String name;
    private Class myClass;

    public Student(String name, Class myClass) {
        this.name = name;
        this.myClass = myClass;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // 查询自己的班级信息
    public void queryClassInfo() {
        String className = myClass.getClassName();
        System.out.println(name + " is in class " + className);
    }
}

// 班级类
class Class {
    private String className;

    public Class(String className) {
        this.className = className;
    }

    public String getClassName() {
        return className;
    }
}

// 老师类
class Teacher {
    private String name;

    public Teacher(String name) {
        this.name = name;
    }

    // 不符合迪米特法则的方法示例，直接返回班级名
    // public String getStudentClass(Student student) {
    //     return student.myClass.getClassName();
    // }

    // 通过学生对象调用公共方法获取班级信息
    public String getStudentClass(Student student) {
        return student.queryClassInfo();
    }
}

public class Main {
    public static void main(String[] args) {
        // 创建班级
        Class class1 = new Class("Class 1");

        // 创建学生并设置班级
        Student student = new Student("Alice", class1);

        // 学生查询自己的班级信息
        student.queryClassInfo();

        System.out.println("=======================");

        // 创建老师并查询学生的班级信息
        Teacher teacher = new Teacher("Mr. Smith");
        String studentClass = teacher.getStudentClass(student);
        System.out.println(student.getName() + " is in class " + studentClass);
    }
}
```

## 面向对象三大特性
面向对象编程具有三大基本特性，它们是：封装、继承、多态。这些特性是面向对象编程语言如Java、Python等的基础。
面向对象编程的三大特性共同作用，使得程序设计更加灵活、可扩展和易于维护。
封装提供了数据的安全性和访问控制，继承实现了代码的重用和层次化设计，多态增加了代码的适应性和灵活性。这些特性共同构成了面向对象编程范式的核心，是现代软件开发中广泛应用的重要基础。

### 封装
封装是面向对象方法的重要原则，就是把对象的属性和操作（或服务）结合为一个独立的整体，并尽可能隐藏对象的内部实现细节。
简单的说，一个类就是一个封装了数据以及操作这些数据的代码的逻辑实体。在一个对象内部，某些代码或某些数据可以是私有的，不能被外界访问。
通过这种方式，对象对内部数据提供了不同级别的保护，以防止程序中无关的部分意外的改变或错误的使用了对象的私有部分。

良好的封装能够减少耦合，提高了可维护性和灵活性以及可重用性，允许类内部结构自由修改，并对成员变量进行精确控制，同时有效隐藏信息和实现细节。
封装的目的是增强安全性和简化编程，使用者不必了解具体的实现细节，而只是要通过外部接口以特定的访问权限来使用类的成员。
其中包括`private`、`protected`和`public`三个访问权限修饰符，如果不加修饰符，则表示包级可见（`default`）。

| 修饰符       | 当前类 | 同一包下 | 其他包的子类 | 不同包的子类 | 其他包 |
|-----------|-----|------|--------|--------|-----|
| public    | Y   | Y    | Y      | Y      | Y   |
| protected | Y   | Y    | Y      | Y/N    | N   |
| default   | Y   | Y    | Y      | N      | N   |
| private   | Y   | N    | N      | N      | N   |

这四种访问权限的控制符能够控制类中成员的可见性，当然需要满足在不使用Java反射的情况下。
- `private`：仅在定义它们的类内部可见。
- `protected`：同一个包内的类和该类的子类可以访问。
- `default`：包级可见性，同一个包内的类可以访问。
- `public`：任何类都可以访问。

设计良好的模块会隐藏所有的实现细节，把它的`API`与它的实现清晰地隔离开来。
模块之间只通过它们的`API`进行通信，一个模块不需要知道其他模块的内部工作情况，这个概念被称为信息隐藏或封装。因此访问权限应当尽可能地使每个类或者成员不被外界访问。
如果子类的方法重写了父类的方法，那么子类中该方法的访问级别不允许低于父类的访问级别。这是为了确保可以使用父类实例的地方都可以使用子类实例，也就是确保满足里氏替换原则。

某个类的字段决不能是公有的，因为这么做的话就失去了对这个字段修改行为的控制，其他类可以对其随意修改。
下面的例子中，`AccessExample`拥有id公有字段，如果在某个时刻，我们想要使用`int`存储`id`字段，那么就需要修改所有类中的代码。
```java
public class AccessExample {
    public String id;
    // public int id;
}
```
可以使用公有的`getter`和`setter`方法来替换公有字段，这样的话就可以控制对字段的修改行为，实现了封装。
```java
public class AccessExample {

    private int id;

    public String getId() {
        return id + "";
    }

    public void setId(String id) {
        this.id = Integer.valueOf(id);
    }
}
```
但是也有例外，如果是包级私有的类或者私有的嵌套类，那么直接暴露成员不会有特别大的影响。
```java
public class AccessWithInnerClassExample {

    private class InnerClass {
        int x;
    }

    private InnerClass innerClass;

    public AccessWithInnerClassExample() {
        innerClass = new InnerClass();
    }

    public int getValue() {
        return innerClass.x;  // 直接访问
    }
}
```

### 继承
继承可以使用父类的所有功能，并在无需重新编写原来类的情况下对这些功能进行扩展。 通过继承创建的新类称为“子类”或“派生类”，被继承的类称为“基类”、“父类”或“超类”。
继承的过程，就是从一般到特殊的过程。继承概念的实现方式有两种，**实现继承**与**接口继承**。实现继承是指直接使用基类的属性和方法而无需额外编码的能力；接口继承是指仅使用属性和方法的名称、但是子类必须提供实现的能力。
- 实现继承：如果多个类的某个部分的功能相同，那么可以抽象出一个类来，把相同的部分放到父类中，让他们继承这个类；
- 接口继承：如果多个类处理的目标是一样的，但是处理的方法方式不同，那么就定义一个接口，也就是一个标准，让他们的实现这个接口，各自实现自己具体的处理方法来处理那个目标；

继承的根本原因是因为要复用，而实现的根本原因是需要定义一个标准。

#### 继承与组合
继承是实现复用代码的重要手段，但是继承会破坏封装；组合也是代码复用的重要方式，可以提供良好的封装性。

| 特性 | 组合 | 继承                                      |
|---|---|-----------------------------------------|
| 优点 | 不破坏封装，整体类与局部类之间松耦合，彼此相对独立；具有较好的可扩展性；支持动态组合，运行时可以选择不同类型的局部对象；整体类可以对局部类进行包装，提供新的接口。| 子类能自动继承父类的接口；支持扩展父类的功能；创建子类对象时无需创建父类对象。 |
| 缺点 | 整体类不能自动获得和局部类同样的接口；创建整体类对象时需要创建所有局部类的对象。 | 破坏封装，子类与父类之间紧密耦合，子类依赖于父类的实现，缺乏独立性；增加系统结构的复杂度；不支持动态继承，子类无法选择不同的父类。 |

在设计中，通常会同时使用继承和组合来实现代码的复用和关系建模，具体根据需求和设计原则来选择合适的关系模型。
组合比继承更加灵活，所以在写代码如果这个功能组合和继承都能够完成，那么应该优先选择组合，但是继承在一些场景还是要优先于组合的：
- 继承要慎用，其使用场合仅限于你确信使用该技术有效的情况。一个判断方法是，问一问自己是否需要从新类向基类进行向上转型。如果是必须的，则继承是必要的。反之则应该好好考虑是否需要继承。
- 只有当子类真正是超类的子类型时，才适合用继承。换句话说，对于两个类A和B，只有当两者之间确实存在`is-a`关系的时候，类B才应该继承类A。

通过下列代码可以发现，子类可以访问父类的成员变量方法，并且通过重写可以改变父类方法实现从而破坏了封装性。
```java
// 继承
public class MainTest {

    public static void main(String[] args) {
        B b = new B();
        b.test();
    }
}

class A {

    protected int i;

    protected void test() {
        System.out.println("I am super class ... ");
    }

}

class B  extends A{

    // 调用父类成员 
    public void t() {
        System.out.println(super.i);
    }

}
```
在继承结构中，父类的内部细节对于子类是可见的。所以我们通常也可以说通过继承的代码复用是一种白盒式代码复用。
如果基类的实现发生改变，那么派生类的实现也将随之改变，这样就导致了子类行为的不可预知性。

为了保证父类有良好的封装性，不会对子类随意更改，设计父类时应遵循以下原则：
- 尽量隐藏父类的内部数据.尽量把所有父类的所有成员变量都用`private`修饰，不要让子类直接访问父类的成员；
- 不要让子类随意的修改访问父类的方法，父类中那些仅为辅助其他的工具方法，应该使用`private`修饰，让子类无法访问该方法。如果父类中的方法需要被外部类调用，则需以`public`修饰，但又不希望重写父类方法可以使用`final`来修饰方法；
但如果希望父类某个方法被重写，但又不希望其他类访问自由，可以使用`protected`修饰；
- 尽量不要在父类构造器中调用将要被子类重写的方法；

`super`关键字通常用在继承的子类中，通常有以下作用：
- 访问父类的构造函数：可以使用`super`函数访问父类的构造函数，从而委托父类完成一些初始化的工作。
  应该注意到，子类一定会调用父类的构造函数来完成初始化工作，一般是调用父类的默认构造函数，如果子类需要调用父类其它构造函数，那么就可以使用`super`函数。
    ```java
    class Parent {
        Parent() {
            System.out.println("Parent constructor");
        }
    }
    
    class Child extends Parent {
        Child() {
            super(); // 调用父类构造方法
            System.out.println("Child constructor");
        }
    }
    ```
- 访问父类的成员：如果子类重写了父类的某个方法，可以通过使用`super `关键字来引用父类的方法实现。
    ```java
    class Parent {
        String name = "Parent";
    }
    
    class Child extends Parent {
        String name = "Child";
    
        void displayName() {
            System.out.println("Child's name: " + name);     // 输出 Child
            System.out.println("Parent's name: " + super.name); // 输出 Parent
        }
    }
    ```
- 在子类中调用父类的方法：这对于子类重写父类方法时，希望在子类方法中调用父类方法的场景非常有用。
    ```java
    class Parent {
        void display() {
            System.out.println("Parent's display method");
        }
    }
    
    class Child extends Parent {
        @Override
        void display() {
            super.display(); // 调用父类的display方法
            System.out.println("Child's display method");
        }
    }
    ```

继承是类与类或者接口与接口之间最常见的关系，继承是一种`is-a`的关系。而组合强调的是整体与部分、拥有的关系，即`has-a`的关系。
组合是把旧类对象作为新类对象的成员变量组合进来，用以实现新类的功能。
```java
public class MainTest {

    public static void main(String[] args) {
        B b = new B(new A());
        b.test();
    }
}

class A {

    protected int i;

    protected void test() {
        System.out.println("I am super class ... ");
    }

}

class B {

    private final A a;

    public B(A a) {
        this.a = a;
    }
    public void test() {
        // 复用 A 类提供的 test 方法
        a.test();
    }
}
```
组合是通过对现有的对象进行拼装产生新的、更复杂的功能。因为在对象之间，各自的内部细节是不可见的，所以我们也说这种方式的代码复用是黑盒式代码复用。因为组合中一般都定义一个类型，所以在编译期根本不知道具体会调用哪个实现类的方法。

#### 抽象类与接口
抽象类和接口也是Java继承体系中的重要组成部分。
抽象类是用来捕捉子类的通用特性的，而接口则是抽象方法的集合；抽象类不能被实例化，只能被用作子类的超类，是被用来创建继承层级里子类的模板，而接口只是一种形式，自身不能做任何事情。

抽象类和抽象方法都使用`abstract`关键字进行声明。如果一个类中包含抽象方法，那么这个类必须声明为抽象类。
抽象类和普通类最大的区别是，抽象类不能被实例化，需要继承抽象类才能实例化其子类。
```java
public abstract class AbstractClassExample {

    protected int x;
    private int y;

    public abstract void func1();

    public void func2() {
        System.out.println("func2");
    }
}
public class AbstractExtendClassExample extends AbstractClassExample {
    @Override
    public void func1() {
        System.out.println("func1");
    }
}

// 实例化抽象类
// AbstractClassExample ac1 = new AbstractClassExample(); 
// 实例化抽象类子类
// AbstractClassExample ac2 = new AbstractExtendClassExample();
// ac2.func1();
```

接口是抽象类的延伸，在Java8之前，它可以看成是一个完全抽象的类，也就是说它不能有任何的方法实现。
但从Java8 开始，接口也可以拥有默认的方法实现，这是因为不支持默认方法的接口的维护成本太高了。在Java8之前，如果一个接口想要添加新的方法，那么要修改所有实现了该接口的类，现在不用修改所有实现该接口的类。

接口中的成员（字段、方法）默认都是`public`的，并且不允许定义为`private`或者 `protected`。
接口的字段默认都是用`static`和`final`修饰的。
```java
public interface InterfaceExample {

    void func1();

    default void func2(){
        System.out.println("func2");
    }

    int x = 123;
    // int y;               // Variable 'y' might not have been initialized
    public int z = 0;       // Modifier 'public' is redundant for interface fields
    // private int k = 0;   // Modifier 'private' not allowed here
    // protected int l = 0; // Modifier 'protected' not allowed here
    // private void fun3(); // Modifier 'private' not allowed here
}
public class InterfaceImplementExample implements InterfaceExample {
    @Override
    public void func1() {
        System.out.println("func1");
    }
}
```
Java的接口可以多继承：
```java
interface Action extends Serializable,AutoCloseable {
	// to do ...
}
```

从设计层面上看，抽象类提供了一种`is-a`关系，那么就必须满足里式替换原则，即子类对象必须能够替换掉所有父类对象。
而接口更像是一种 `like-a` 关系，它只是提供一种方法实现契约，并不要求接口和实现接口的类具有 `is-a` 关系。
抽象类是一种自下而上的思想，而接口是一种自上而下的思想。抽象类是将多个类的公共特点聚合到同一个类中，然后实现父类的方法；接口更像是对类的一种约束，其他类调用实现某接口的类。

从语法角度来看，一个类可以实现多个接口，但是不能继承多个抽象类。接口的字段只能是`static`和`final`类型的，而抽象类的字段没有这种限制，接口的成员只能是`public`的，而抽象类的成员可以有多种访问权限。

接口适合的情况包括需要让不相关的类都实现相同方法，例如实现`Comparable`接口中的`compareTo`方法，以及需要实现类似多重继承的效果。
抽象类则更适合于多个相关类需要共享代码逻辑，或者需要控制继承来的成员访问权限，以及需要继承非静态和非常量字段的场景。选择使用接口或抽象类取决于设计需求和代码结构的具体情况。

在很多情况下，接口优先于抽象类。因为接口没有抽象类严格的类层次结构要求，可以灵活地为一个类添加行为。
并且从Java8开始，接口也可以有默认的方法实现，使得修改接口的成本也变的很低。

### 多态
多态是面向对象编程中的一个重要概念，它允许对象以多种形式出现。
在Java中，多态主要通过继承和接口来实现。多态性使得一个对象可以被看作是其本身的类型，也可以被看作是其父类或接口的类型。
多态存在的前提，有类继承或者接口实现、子类要重写父类的方法、父类的引用指向子类的对象，如：`Parent p = new Child();`。
```java
class Parent {

    void contextLoads(){
        System.out.println("i am Parent ... ");
    }
}
class Child  extends Parent {
    @Override
    void contextLoads(){
        System.out.println("i am Child ... ");
    }
}
class mainTest{
    public static void main(String[] args) {
        Parent child = new Child();
        // i am Child ... 
        child.contextLoads();
    }
}
```

通过多态，可以将相似的操作封装在父类或接口中，子类只需要实现或重写这些操作，从而减少代码的重复。
多态使得程序更加灵活和可扩展，可以在不修改现有代码的情况下增加新的功能。
通过多态，可以用接口来定义一组可互换的操作，使得代码更具通用性。
但多态不能使用子类特有的方法和属性，在编写代码期间使用多态调用方法或属性时，编译工具首先会检查父类中是否有该方法和属性，如果没有则会编译报错。
```java
class Parent {
    void contextLoads(){
        System.out.println("i am Parent ... ");
    }
}
class Child  extends Parent {

    String  c = "child";

    @Override
    void contextLoads(){
        System.out.println("i am Child ... ");
    }
    void test() {
        System.out.println("i am test method ...");
    }
}
class mainTest{
    public static void main(String[] args) {
        Parent child = new Child();
        // 编译报错: 无法解析 'Parent' 中的方法 'test'
        child.test();
        // 编译报错: 不能解决符号 'c'
        child.c;
    }
}
```

#### 重写与重载
多态分为两种主要类型：静态绑定（编译时多态）和动态绑定（运行时多态）。

动态绑定发生在运行时，主要通过方法重写实现，我们通常所说的多态就是指这个。重写存在于继承体系中，指子类实现了一个与父类在方法声明上完全相同的一个方法。
动态绑定的关键在于：父类的引用可以指向子类的对象，方法调用在运行时根据实际对象类型来决定执行哪个方法。

为了满足里式替换原则，重写有以下三个限制，使用`@Override`注解，可以让编译器帮忙检查是否满足这三个限制条件。
- 子类方法的访问权限必须大于等于父类方法；
- 子类方法的返回类型必须是父类方法返回类型或为其子类型；
- 子类方法抛出的异常类型必须是父类抛出异常类型或为其子类型；
```java
class Animal {
    void makeSound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Dog barks");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Cat meows");
    }
}

public class TestDynamicBinding {
    public static void main(String[] args) {
        Animal myDog = new Dog();
        Animal myCat = new Cat();

        myDog.makeSound(); // 输出 "Dog barks"
        myCat.makeSound(); // 输出 "Cat meows"
    }
}
```
静态绑定发生在编译时，主要通过方法重载实现。
重载是在一个类里面，方法名字相同，但参数类型、个数、顺序至少有一个不同，返回类型可以相同也可以不同。应该注意的是，只有返回值不同，其它都相同不算是重载。编译器在编译时决定调用哪一个方法。
每个重载的方法都必须有一个独一无二的参数类型列表。最常用的地方就是构造器的重载。

重载规则：
- 被重载的方法必须改变参数列表(参数个数或类型不一样)；
- 被重载的方法可以改变返回类型；
- 被重载的方法可以改变访问修饰符；
- 被重载的方法可以声明新的或更广的检查异常；
- 方法能够在同一个类中或者在一个子类中被重载；
- 无法以返回值类型作为重载函数的区分标准；

```java
public class Overloading {
    public int test(){
        System.out.println("test1");
        return 1;
    }
 
    public void test(int a){
        System.out.println("test2");
    }   
 
    //以下两个参数类型顺序不同
    public String test(int a,String s){
        System.out.println("test3");
        return "returntest3";
    }   
 
    public String test(String s,int a){
        System.out.println("test4");
        return "returntest4";
    }   
 
    public static void main(String[] args){
        Overloading o = new Overloading();
        System.out.println(o.test());
        o.test(1);
        System.out.println(o.test(1,"test3"));
        System.out.println(o.test("test4",1));
    }
}
```
方法的重写和重载是Java多态性的不同表现，重写是父类与子类之间多态性的一种表现，重载可以理解成多态的具体表现形式。
方法重载是一个类中定义了多个方法名相同，而他们的参数的数量不同或数量相同而类型和次序不同，则称为方法的重载。
方法重写是在子类存在方法与父类的方法的名字相同，而且参数的个数与类型一样，返回值也一样的方法，就称为重写。
方法重载是一个类的多态性的表现，而方法重写是子类与父类的一种多态性表现。

## 设计模式
设计模式是一套被反复使用、多数人知晓的、经过分类编目的、代码设计经验的总结，使用设计模式是为了可重用代码、让代码更容易被他人理解、保证代码可靠性、高内聚低耦合。
虽然[GoF](https://baike.baidu.com/item/GoF/6406151?fr=aladdin)设计模式只有23个，但是它们各具特色，每个模式都为某一个可重复的设计问题提供了一套解决方案。
根据它们的用途，设计模式可分为创建型，结构型和行为型三种，其中创建型模式主要用于描述如何创建对象，结构型模式主要用于描述如何实现类或对象的组合，行为型模式主要用于描述类或对象怎样交互以及怎样分配职责。
在GoF23种设计模式中包含5种创建型设计模式、7种结构型设计模式和11种行为型设计模式。此外，根据某个模式主要是用于处理类之间的关系还是对象之间的关系，设计模式还可以分为类模式和对象模式。

设计模式练习网站: https://java-design-patterns.com/patterns

| 设计模式类型 | 设计模式名称 | 介绍 | 学习难度 | 使用频率 |
|--------------|--------------|------|----------|----------|
| 创建型模式(6种) | 单例模式 | 保证一个类仅有一个对象，并提供一个访问它的全局访问点。 | ★☆☆☆☆ | ★★★★☆ |
|              | 简单工厂模式 | 定义一个工厂类，它可以根据参数的不同返回不同类的实例，被创建的实例通常都具有共同的父类。 | ★★☆☆☆ | ★★★★★ |
|              | 工厂方法模式 | 定义一个用于创建对象的接口，让子类决定将哪一个类实例化。 | ★★☆☆☆ | ★★★★★ |
|              | 抽象工厂模式 | 提供一个创建一系列相关或相互依赖对象的接口，而无需指定它们的具体类。 | ★★★★☆ | ★★★★★ |
|              | 原型模式 | 使用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。 | ★★★☆☆ | ★★★☆☆ |
|              | 建造者模式 | 将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。 | ★★★★☆ | ★★☆☆☆ |
| 结构型模式(7种) | 适配器模式 | 将一个类的接口转换成客户希望的另一个接口。适配器模式使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。 | ★★☆☆☆ | ★★★★☆ |
|              | 桥接模式 | 将抽象部分与它的实现部分分离，使他们都可以独立地变化。 | ★★★☆☆ | ★★★☆☆ |
|              | 组合模式 | 组合多个对象形成树形结构以表示具有“整体—部分”关系的层次结构。组合模式对单个对象和组合对象的使用具有一致性。 | ★★★☆☆ | ★★★★☆ |
|              | 装饰模式 | 动态地给一个对象增加一些额外的职责，就增加对象功能来说，装饰模式比生成子类实现更为灵活。 | ★★★☆☆ | ★★★☆☆ |
|              | 外观模式 | 为子系统中的一组接口提供一个统一的入口。外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。 | ★☆☆☆☆ | ★★★★★ |
|              | 享元模式 | 运用共享技术有效地支持大量细粒度的对象。 | ★★★★☆ | ★☆☆☆☆ |
|              | 代理模式 | 为其他对象提供一个代理以控制对这个对象的访问。 | ★★★☆☆ | ★★★★☆ |
| 行为模式(11种) | 职责链模式 | 为解除请求的发送者和接收者之间的耦合，而使多个对象都有机会处理这个请求。将这些对象连成一条链，并沿着这条链传递该请求，直到有对象处理它。 | ★★★☆☆ | ★★☆☆☆ |
|              | 命令模式 | 将一个请求封装为一个对象，从而使你可用不同的请求对客户进行参数化，对请求排队或记录请求日志，以及支持可取消的操作。 | ★★★☆☆ | ★★★★☆ |
|              | 解释器模式 | 定义一个语言，定义它的文法的一种表示，并定义一个解释器，该解释器使用该表示来解释语言中的句子。 | ★★★★★ | ★☆☆☆☆ |
|              | 迭代器模式 | 提供一种方法顺序访问一个聚合对象中各个元素，而又不需暴露该对象的内部表示。 | ★★★☆☆ | ★★★★★ |
|              | 中介者模式 | 用一个中介对象来封装一系列的对象交互。中介者使各对象不需要显示地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。 | ★★★☆☆ | ★★☆☆☆ |
|              | 备忘录模式 | 在不破坏封装性的前提下，捕获一个对象的内部状态，并在该对象之外保持该状态，这样以后就可以将该对象恢复到保存的状态。 | ★★☆☆☆ | ★★☆☆☆ |
|              | 观察者模式 | 定义对象间的一种一对多的依赖关系，以便当一个对象的状态发生改变时，所有依赖于它的对象都得到通知并自动刷新。 | ★★★☆☆ | ★★★★★ |
|              | 状态模式 | 允许一个对象在其内部状态改变时改变它的行为。对象看起来似乎修改了它所属的类。 | ★★★☆☆ | ★★★☆☆ |
|              | 策略模式 | 定义一系列的算法，把它们一个个封装起来，并且使他们可相互替换。本模式使得算法的变化可以独立于使用它的客户。 | ★☆☆☆☆ | ★★★★☆ |
|              | 模板方法模式 | 定义一个操作中的算法的骨架，而将一些步骤延迟到子类。 | ★★☆☆☆ | ★★★☆☆ |
|              | 访问者模式 | 表示一个作用于某对象结构中的各元素的操作。它使你可以在不改变各元素类别的前提下定义作用于这些元素的新操作。 | ★★★★☆ | ★☆☆☆☆ |


### 单例模式
确保某一个类只有一个实例，而且自行实例化并向整个系统提供这个实例，这个类称为单例类，它提供全局访问的方法。单例模式是一种对象创建型模式。
单例模式设计就是采用一定的方法保证在整个程序中，对某个类只能存在一个对象的实例，并且该类只提供一个取得其对象实例的方法。

单例模式作用：
- 在内存里只有一个实例，减少了内存的开销，尤其是频繁的创建和销毁实例（比如网站首页页面缓存）；
- 避免对资源的多重占用（比如写文件操作）；

单例模式主要应用在需要频繁的进行创建和销毁的对象、创建对象时耗时过多或耗费资源过多、重量级对象，但又经常用到的对象、工具类对象、频繁访问数据库或文件的对象(比如数据源、`session` 工厂等)。
单例模式在Java中有6种实现。

| 名称                | 优点                                     | 缺点                                  |
|-----------------------|------------------------------------------|---------------------------------------|
| 饿汉式                | 线程安全，写法简单                        | 不懒加载，可能造成浪费                |
| 懒汉式(线程不安全)      | 懒加载                                   | 线程不安全                            |
| 懒汉式(线程安全)        | 线程安全，懒加载                          | 效率很低，反序列化破坏单例            |
| 双重校验锁             | 线程安全，懒加载                          | 反序列化破坏单例                      |
| 静态内部类式            | 线程安全，懒加载                          | 反序列化破坏单例                      |
| 枚举式                | 防止反射攻击，反序列化创建对象，写法简单  | 不能传参，不能继承其他类              |

#### 饿汉式
```java
class Singleton {

    private Singleton() {}

    private static final Singleton instance = new Singleton();

    public static Singleton getInstance() {
        return instance;
    }
}
```
这种写法比较简单，就是在类加载的时候就完成实例化。避免了线程同步问题。但是在类装载的时候就完成实例化，没有达到懒加载的效果。如果从始至终从未使用过这个实例，则会造成内存的浪费。

#### 线程不安全的懒汉式
```java
class Singleton {
    private Singleton() {
    }

    private static Singleton instance;

    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```
起到了懒加载的效果，但是只能在单线程下使用。如果在多线程下，一个线程进入了`if (singleton == null)`判断语句块，还未来得及往下执行，另一个线程也通过了这个判断语句，这时便会产生多个实例，所以在多线程环境下不可使用这种方式。

#### 线程安全的懒汉式
```java
class Singleton {

    private static Singleton instance;

    private Singleton() {
    }

    public static synchronized Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}
```
虽然解决了线程安全问题但是效率太低了，每个线程在想获得类的实例时候，执行`getInstance()`方法都要进行同步。而其实这个方法只执行一次实例化代码就够了，后面的想获得该类实例，直接 `return`就行了。

#### 双重校验锁
```java
class Singleton {

    /**
     * volatile在这作用: 禁止JVM指令重排
     */
    private static volatile Singleton instance;

    private Singleton() {
    }

    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
}
```
`Double-Check`概念是多线程开发中常使用到的，如代码中所示，我们进行了两次`if (singleton == null)`检查，这样就可以保证线程安全了。
这样，实例化代码只用执行一次，后面再次访问时，判断`if (singleton == null)`，直接`return`实例化对象，也避免的反复进行方法同步。

#### 静态内部类式
```java
class Singleton {

    private Singleton() {}

    private static class InnerClass {
        private static final Singleton instance = new Singleton();
    }
    public static Singleton getInstance() {
        return InnerClass.instance;
    }
}
```
这种方式同样利用了`classloder`的机制来保证初始化`instance`时只有一个线程，它跟饿汉式不同的是（很细微的差别）：饿汉式是只要`Singleton`类被装载了，那么`instance`就会被实例化（没有达到`lazy loading`效果），而这种方式是`Singleton`类被装载了，`instance`不一定被初始化。
因为`SingletonHolder`类没有被主动使用，只有显示通过调用`getInstance`方法时，才会显示装载`SingletonHolder`类，从而实例化`instance`。
想象一下，如果实例化`instance`很消耗资源，我想让他延迟加载，另外一方面，我不希望在`Singleton`类加载时就实例化，因为我不能确保`Singleton`类还可能在其他的地方被主动使用从而被加载，那么这个时候实例化`instance`显然是不合适的。
这个时候，这种方式相比饿汉式更加合理。

#### 枚举式
```java
enum Singleton {
    INSTAMCE;

    Singleton() {
    }
}
```
这种方式是《Effective Java》作者`Josh Bloch`提倡的方式，借助 JDK1.5 中添加的枚举来实现单例模式。不仅能避免多线程同步问题，而且还能防止反序列化重新创建新的对象。

#### 单例与序列化
上述单例模式6种写法除了枚举式单例外其他5种写法都存在序列化问题。序列化可以破坏单例，原因是序列化会通过反射调用无参数的构造方法创建一个新的对象。

要想防止序列化对单例的破坏，只要在单例类中定义`readResolve`方法就可以解决该问题。原理是反序列化时，会通过反射的方式调用要被反序列化的类的`readResolve`方法，所以在这个方法中可以自定义序列化的方式。
主要在`Singleton`类中定义`readResolve`方法，并在该方法中指定要返回的对象的生成策略，就可以防止单例被破坏。
以双重校验锁为例，在该单例类中插入`readResolve`方法。
```java
public class Singleton implements Serializable{

    private volatile static Singleton singleton;
    
    private Singleton (){}
    
    public static Singleton getSingleton() {
        if (singleton == null) {
            synchronized (Singleton.class) {
                if (singleton == null) {
                    singleton = new Singleton();
                }
            }
        }
        return singleton;
    }

    private Object readResolve() {
        return singleton;
    }
}
```

### 工厂模式
工厂模式是将实例化的对象代码提取出来，放到一个类中统一管理和维护，达到和主项目的依赖关系的解耦，从而提高项目的扩展和维护性。
创建对象实例时不要直接`new`类，而是把这个`new`类的动作放在一个工厂的方法中并返回。不要让类继承具体的类，而是继承抽象类或者实现接口。

#### 简单工厂模式
简单工厂模式，定义一个工厂类，它可以根据参数的不同返回不同类的实例，被创建的实例通常都具有共同的父类。
因为在简单工厂模式中用于创建实例的方法是静态方法，因此简单工厂模式又被称为静态工厂方法模式，它属于类创建型模式。
```java
public class SimpleFactoryDemo {
    public static void main(String[] args) {
        SimpleFactory.getTest(1);
    }
}

class SimpleFactoryImpl1 implements SimpleFactoryInterface {

    @Override
    public void test() {
        System.out.println("i am  simpleFactory 1 ...");
    }
}
class SimpleFactoryImpl2 implements SimpleFactoryInterface {

    @Override
    public void test() {
        System.out.println("i am  simpleFactory 2 ...");
    }
}

class SimpleFactory {
    public static void getTest(int n) {
        switch (n) {
            case 1:
                SimpleFactoryImpl1 simpleFactory = new SimpleFactoryImpl1();
                simpleFactory.test();
                break;
            case 2:
                SimpleFactoryImpl2 simpleFactoryImpl2 = new SimpleFactoryImpl2();
                simpleFactoryImpl2.test();
                break;
            default:
        }
    }
}
```
简单工厂模式的优点是实现了对象创建和使用的分离，符合面向接口编程的思想，从而实现代码解耦。然而，如果工厂内包含的逻辑和职责过多，会导致代码臃肿和扩展困难。
尤其是在产品类型较多时，添加新产品需要修改工厂逻辑，可能导致系统维护和扩展变得复杂。简单工厂模式适用于创建对象较少且业务逻辑不复杂的场景。

#### 工厂方法模式
工厂方法模式，定义一个用于创建对象的接口，让子类决定将哪一个类实例化。工厂方法模式让一个类的实例化延迟到其子类。
工厂方法模式又简称为工厂模式，又可称作虚拟构造器模式或多态工厂模式。工厂方法模式是一种类创建型模式。
```java
public class FactoryMethodDemo {
    public static void main(String[] args) {
        FoodFactory f = new ColdRiceNoodleFactory();
        f.getFood().eat();
        // 扩展需要增加产品及相应产品工厂并实现相关接口
    }
}

interface Food {
    void eat();
}
interface FoodFactory {
    Food getFood();
}

class RiceNoodle implements Food{

    @Override
    public void eat() {
        System.out.println("eat rice noodle ...");
    }
}
class RiceNoodleFactory implements FoodFactory{

    @Override
    public Food getFood() {
        return new RiceNoodle();
    }
}

class ColdRiceNoodle implements Food {

    @Override
    public void eat() {
        System.out.println("eat cold rice noodle ...");
    }
}
class ColdRiceNoodleFactory implements FoodFactory {

    @Override
    public Food getFood() {
        return new ColdRiceNoodle();
    }
}
```
工厂方法模式是简单工厂模式的延伸，它继承了简单工厂模式的优点，同时还弥补了简单工厂模式的不足。
使用工厂方法模式扩展时，无须修改抽象工厂和抽象产品提供的接口，无须修改客户端，也无须修改其他的具体工厂和具体产品，只要添加一个具体工厂和具体产品就可以了，这样系统的可扩展性也就变得非常好，完全符合“开闭原则”。
但是在添加新产品时，需要编写新的具体产品类，而且还要提供与之对应的具体工厂类，系统中类的个数将成对增加，在一定程度上增加了系统的复杂度，有更多的类需要编译和运行，会给系统带来一些额外的开销。

#### 抽象工厂模式
抽象工厂模式，提供一个创建一系列相关或相互依赖对象的接口，而无须指定它们具体的类。抽象工厂模式又称为Kit模式，它是一种对象创建型模式。
```java
interface Food {
    void eat();
}

interface FoodFactory {
    ColdRiceNoodle getColdRiceNoodle();
    RiceNoodle getRiceNoodle();
}
class RiceNoodle implements Food{

    @Override
    public void eat() {
        System.out.println("eating rice noodle");
    }
}
class ColdRiceNoodle implements Food{

    @Override
    public void eat() {
        System.out.println("eating cold rice noodle");
    }
}
class RiceNoodleFactory implements FoodFactory {


    @Override
    public ColdRiceNoodle getColdRiceNoodle() {
        return new ColdRiceNoodle();
    }

    @Override
    public RiceNoodle getRiceNoodle() {
        return new RiceNoodle();
    }
}

class ColdRiceNoodleFactory implements FoodFactory {

    @Override
    public ColdRiceNoodle getColdRiceNoodle() {
        return new ColdRiceNoodle();
    }

    @Override
    public RiceNoodle getRiceNoodle() {
        return new RiceNoodle();
    }
}
```
抽象工厂模式是工厂方法模式的进一步延伸，仍然具有工厂方法和简单工厂的优点。抽象工厂模式隔离了具体类的生成，使得客户并不需要知道什么被创建。
由于这种隔离，更换一个具体工厂就变得相对容易，所有的具体工厂都实现了抽象工厂中定义的那些公共接口，因此只需改变具体工厂的实例，就可以在某种程度上改变整个软件系统的行为。
但是抽象工厂也存在一些缺点，增加新的产品等级结构麻烦，需要对原有系统进行较大的修改，甚至需要修改抽象层代码，这显然会带来较大的不便，违背了“开闭原则”。

### 原型模式
在Java中通过`new`关键字创建的对象是非常繁琐的，在我们需要大量对象的情况下，原型模式就是我们可以考虑实现的方式。
使用原型实例指定创建对象的种类，并且通过拷贝这些原型创建新的对象。原型模式是一种对象创建型模式。

原型模式我们也称为克隆模式，即一个某个对象为原型克隆出来一个一模一样的对象，该对象的属性和原型对象一模一样，而且对于原型对象没有任何影响。
原型模式的克隆方式有两种，浅克隆和深度克隆；浅克隆和深克隆的主要区别在于是否支持引用类型的成员变量的复制。

#### 浅克隆
在浅克隆中，当对象被复制时只复制它本身和其中包含的值类型的成员变量，而引用类型的成员对象并没有复制。
```java
public class ShallowClone {
    public static void main(String[] args) {
        CloneHuman cloneHuman = new CloneHuman("黑色","大眼睛","高鼻梁","大嘴巴",new Date(123231231231L));
        for (int i = 0; i < 20; i++) {
            try {
                CloneHuman clone = (CloneHuman)cloneHuman.clone();
                System.out.printf("头发：%s,眼睛：%s,鼻子：%s,嘴巴：%s,生日：%s",clone.getHair(),clone.getEye(),clone.getNodes(),clone.getMouse(),clone.getBirth());
                System.out.println();
                System.out.println("浅克隆，引用类型地址比较：" + (cloneHuman.getBirth() == clone.getBirth()));
            } catch (CloneNotSupportedException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}

class CloneHuman  implements Cloneable {

    private String hair;

    private String eye;

    private String nodes;

    private String mouse;

    private Date birth;

    public String getHair() {
        return hair;
    }

    public void setHair(String hair) {
        this.hair = hair;
    }

    public String getEye() {
        return eye;
    }

    public void setEye(String eye) {
        this.eye = eye;
    }

    public String getNodes() {
        return nodes;
    }

    public void setNodes(String nodes) {
        this.nodes = nodes;
    }

    public String getMouse() {
        return mouse;
    }

    public void setMouse(String mouse) {
        this.mouse = mouse;
    }

    public CloneHuman(String hair, String eye, String nodes, String mouse,Date brith) {
        this.hair = hair;
        this.eye = eye;
        this.nodes = nodes;
        this.mouse = mouse;
        this.birth = brith;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }
}
```
Java提供的`Cloneable`接口和`Serializable`接口的代码非常简单，它们都是空接口，这种空接口也称为标识接口，标识接口中没有任何方法的定义，其作用是告诉JRE这些接口的实现类是否具有某个功能，如是否支持克隆、是否支持序列化等。

应该注意的是，`clone`方法并不是`Cloneable`接口的方法，而是`Object`的一个`protected`方法。
`Cloneable`接口只是规定，如果一个类没有实现`Cloneable`接口又调用了`clone()`方法，就会抛出 `CloneNotSupportedException`。

#### 深克隆
在深克隆中，除了对象本身被复制外，对象所包含的所有成员变量也将复制。
深克隆有两种实现方式，第一种是在浅克隆的基础上实现，第二种是通过序列化和反序列化实现。

在浅克隆的基础上实现：
```java
public class DeepClone {
    public static void main(String[] args) {
        CloneHuman cloneHuman = new CloneHuman("黑色","大眼睛","高鼻梁","大嘴巴",new Date(123231231231L));
        for (int i = 0; i < 20; i++) {
            try {
                CloneHuman clone = (CloneHuman)cloneHuman.clone();
                System.out.printf("头发：%s,眼睛：%s,鼻子：%s,嘴巴：%s,生日：%s",clone.getHair(),clone.getEye(),clone.getNodes(),clone.getMouse(),clone.getBirth());
                System.out.println();
                System.out.println("深克隆，引用类型地址比较：" + (cloneHuman.getBirth() == clone.getBirth()));
            } catch (CloneNotSupportedException e) {
                System.out.println(e.getMessage());
            }
        }
    }
}
class CloneHuman  implements Cloneable {

    private String hair;

    private String eye;

    private String nodes;

    private String mouse;

    private Date birth;

    public String getHair() {
        return hair;
    }

    public void setHair(String hair) {
        this.hair = hair;
    }

    public String getEye() {
        return eye;
    }

    public void setEye(String eye) {
        this.eye = eye;
    }

    public String getNodes() {
        return nodes;
    }

    public void setNodes(String nodes) {
        this.nodes = nodes;
    }

    public String getMouse() {
        return mouse;
    }

    public void setMouse(String mouse) {
        this.mouse = mouse;
    }

    public CloneHuman(String hair, String eye, String nodes, String mouse,Date brith) {
        this.hair = hair;
        this.eye = eye;
        this.nodes = nodes;
        this.mouse = mouse;
        this.birth = brith;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        CloneHuman human = (CloneHuman)super.clone();
        human.birth = (Date)this.birth.clone();
        return human;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }
}
```
序列化反序列化实现深克隆：
```java
public class DeepClone2 {
    public static void main(String[] args) throws IOException, ClassNotFoundException {
        CloneHuman2 cloneHuman1 = new CloneHuman2("黑色","大眼睛","高鼻梁","大嘴巴",new Date(123231231231L));

        // 使用序列化和反序列化实现深克隆
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        ObjectOutputStream oos = new ObjectOutputStream(bos);
        oos.writeObject(cloneHuman1);
        byte[] bytes = bos.toByteArray();

        ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
        ObjectInputStream ois = new ObjectInputStream(bis);

        // 克隆好的对象
        CloneHuman2 cloneHuman2 = (CloneHuman2) ois.readObject();
        System.out.println("深克隆，引用类型地址比较：" + (cloneHuman1.getBirth() == cloneHuman2.getBirth()));

    }
}
class CloneHuman2  implements Cloneable, Serializable {

    private String hair;

    private String eye;

    private String nodes;

    private String mouse;

    private Date birth;

    public String getHair() {
        return hair;
    }

    public void setHair(String hair) {
        this.hair = hair;
    }

    public String getEye() {
        return eye;
    }

    public void setEye(String eye) {
        this.eye = eye;
    }

    public String getNodes() {
        return nodes;
    }

    public void setNodes(String nodes) {
        this.nodes = nodes;
    }

    public String getMouse() {
        return mouse;
    }

    public void setMouse(String mouse) {
        this.mouse = mouse;
    }

    public CloneHuman2(String hair, String eye, String nodes, String mouse,Date brith) {
        this.hair = hair;
        this.eye = eye;
        this.nodes = nodes;
        this.mouse = mouse;
        this.birth = brith;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        CloneHuman2 human = (CloneHuman2)super.clone();
        human.birth = (Date)this.birth.clone();
        return human;
    }

    public Date getBirth() {
        return birth;
    }

    public void setBirth(Date birth) {
        this.birth = birth;
    }
}
```

#### 总结
原型模式作为一种快速创建大量相同或相似对象的方式，在软件开发中应用较为广泛，很多软件提供的复制和粘贴操作就是原型模式的典型应用。
通过`clone`的方式在获取大量对象的时候性能开销基本没有什么影响，而`new`的方式随着实例的对象越来越多，性能会急剧下降，所以原型模式是一种比较重要的获取实例的方式。

优点：
- 当创建新的对象实例较为复杂时，使用原型模式可以简化对象的创建过程，提高创建对象的效率。
- 可以使用深克隆的方式保存对象的状态，使用原型模式将对象复制一份并将其状态保存起来，可辅助实现撤销操作。
- 扩展性较好，由于在原型模式中提供了抽象原型类，在客户端可以针对抽象原型类进行编程，而将具体原型类写在配置文件中，增加或减少产品类对原有系统都没有任何影响。

缺点：
- 需要为每一个类配备一个克隆方法，而且该克隆方法位于一个类的内部，当对已有的类进行改造时，需要修改源代码，违背了“开闭原则”。
- 在实现深克隆时需要编写较为复杂的代码，而且当对象之间存在多重的嵌套引用时，为了实现深克隆，每一层对象对应的类都必须支持深克隆，实现起来可能会比较麻烦。

使用场景：
- 原型模式很少单独出现，一般是和工厂方法模式一起出现，通过`clone`的方法创建一个对象，然后由工厂方法提供给调用者。
- `Spring`中`bean`的创建实际就是两种：单例模式和原型模式。
- 创建新对象成本较大，新的对象可以通过原型模式对已有对象进行复制来获得。
- 系统要保存对象的状态，而对象的状态变化很小，或者对象本身占用内存较少时，可以使用原型模式配合备忘录模式来实现。

### 建造者模式
建造者模式，将一个复杂对象的构建与它的表示分离，使得同样的构建过程可以创建不同的表示。建造者模式是一种对象创建型模式。
建造者模式是较为复杂的创建型模式，它将客户端与包含多个组成部分的复杂对象的创建过程分离，客户端无须知道复杂对象的内部组成部分与装配方式，只需要知道所需建造者的类型即可。
它关注如何一步一步创建一个的复杂对象，不同的具体建造者定义了不同的创建过程，且具体建造者相互独立，增加新的建造者非常方便，无须修改已有代码，系统具有较好的扩展性。
```java
public class MainTest {
    public static void main(String[] args) {

        Director director = new Director();
        Builder commonBuilder = new CommonRole();

        director.construct(commonBuilder);
        Role commonRole = commonBuilder.getRole();
        System.out.println(commonRole);
    }
}

class Role {
    private String head;
    private String body;
    private String foot;
    private String sp;
    private String hp;
    private String name;

    public void setSp(String sp) {
        this.sp = sp;
    }

    public String getSp() {
        return sp;
    }

    public void setHp(String hp) {
        this.hp = hp;
    }

    public String getHp() {
        return hp;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return "Role{" +
                "head='" + head + '\'' +
                ", body='" + body + '\'' +
                ", foot='" + foot + '\'' +
                ", sp='" + sp + '\'' +
                ", hp='" + hp + '\'' +
                ", name='" + name + '\'' +
                '}';
    }
}

abstract class Builder {

    public abstract void builderHead();

    public abstract void builderBody();

    public abstract void builderFoot();

    public abstract void builderSp();

    public abstract void builderHp();

    public abstract void builderName();

    public Role getRole() {
        return new Role();
    }
}

class CommonRole extends Builder {

    private Role role = new Role();

    @Override
    public void builderHead() {
        System.out.println("building head .....");
    }

    @Override
    public void builderBody() {
        System.out.println("building body .....");
    }

    @Override
    public void builderFoot() {
        System.out.println("building foot .....");
    }

    @Override
    public void builderSp() {
        role.setSp("100");
    }

    @Override
    public void builderHp() {
        role.setHp("100");
    }

    @Override
    public void builderName() {
        role.setName("lucy");
    }

    @Override
    public Role getRole() {
        return role;
    }
}
class Director {

    public void construct(Builder builder) {
        builder.builderHead();
        builder.builderBody();
        builder.builderFoot();
        builder.builderHp();
        builder.builderSp();
        builder.builderName();
    }
}
```

优点：
- 客户端不必知道产品内部组成的细节，将产品本身与产品的创建过程解耦，使得相同的创建过程可以创建不同的产品对象。
- 建造者模式很容易进行扩展。如果有新的需求，通过实现一个新的建造者类就可以完成，基本上不用修改之前已经测试通过的代码，因此也就不会对原有功能引入风险，符合开放封闭原则。

缺点：
- 若产品内部发生变化，建造者都要修改，成本较大；若内部变化复杂，会有很多的建造类。
- 产品必须有共同点，使用范围有限。建造者模式创造出来的产品，其组成部分基本相同。如果产品之间的差异较大，则不适用这个模式。

使用场景：
- 需要生成的产品对象有复杂的内部结构，这些产品对象通常包含多个成员属性。
- 需要生成的产品对象的属性相互依赖，需要指定其生成顺序。
- 对象的创建过程独立于创建该对象的类。在建造者模式中引入了指挥者类，将创建过程封装在指挥者类中，而不在建造者类中。
- 隔离复杂对象的创建和使用，并使得相同的创建过程可以创建不同的产品。

### 适配器模式
适配器模式，将一个接口转换成客户希望的另一个接口(指广义的接口，它可以表示一个方法或者方法的集合)，使接口不兼容的那些类可以一起工作，其别名为包装器。
适配器模式既可以作为类结构型模式，也可以作为对象结构型模式。

在适配器模式中，我们通过增加一个新的适配器类来解决接口不兼容的问题，使得原本没有任何关系的类可以协同工作。根据适配器类与适配者类的关系不同，适配器模式可分为对象适配器和类适配器两种，在对象适配器模式中，适配器与适配者之间是关联关系。
在类适配器模式中，适配器与适配者之间是继承或实现关系。

#### 对象适配器
由于在Java中不支持多重继承，而且有破坏封装之嫌。所以提倡多用组合少用继承，在实际开发中推荐使用对象适配器模式。
```java
public class MainTest {
    public static void main(String[] args) {
        new RedHat(new Linux()).useInputMethod();
        System.out.println("==============");

        new Win10(new Windows()).useInputMethod();
        System.out.println("==============");

        Adapter adapter = new Adapter(new Windows());
        new RedHat(adapter).useInputMethod();
    }
}

interface LinuxSoftware {
    void inputMethod();
}

interface WindowsSoftware {
    void inputMethod();
}

class Linux implements LinuxSoftware {

    @Override
    public void inputMethod() {
        System.out.println("linux 系统输入法 ...");
    }
}

class Windows implements WindowsSoftware {

    @Override
    public void inputMethod() {
        System.out.println("windows 系统输入法 ...");
    }
}

class RedHat {
    private LinuxSoftware linuxSoftware;

    public RedHat(LinuxSoftware linuxSoftware) {
        this.linuxSoftware = linuxSoftware;
    }

    public void useInputMethod() {
        System.out.println("开始使用 redHat 系统输入法 ...");
        linuxSoftware.inputMethod();
        System.out.println("结束使用 redHat 系统输入法 ...");
    }
}

class Win10 {
    private WindowsSoftware windowsSoftware;

    public Win10(WindowsSoftware windowsSoftware) {
        this.windowsSoftware = windowsSoftware;
    }

    public void useInputMethod() {
        System.out.println("开始使用 win10 系统输入法 ...");
        windowsSoftware.inputMethod();
        System.out.println("结束使用 win10 系统输入法 ...");
    }
}

// 在 Linux 系统上使用 windows 输入法
class Adapter implements LinuxSoftware{

    private WindowsSoftware windowsSoftware;

    public Adapter(WindowsSoftware windowsSoftware) {
        this.windowsSoftware = windowsSoftware;
    }

    @Override
    public void inputMethod() {
        windowsSoftware.inputMethod();
    }
}
```

#### 类适配器
类适配器模式和对象适配器模式最大的区别在于适配器和适配者之间的关系不同，对象适配器模式中适配器和适配者之间是关联关系，而类适配器模式中适配器和适配者是继承关系。
```java
public class MainTest {
    public static void main(String[] args) {
        new RedHat(new Linux()).useInputMethod();
        System.out.println("==============");

        new Win10(new Windows()).useInputMethod();
        System.out.println("==============");

        Adapter adapter = new Adapter();
        new RedHat(adapter).useInputMethod();
    }
}

interface LinuxSoftware {
    void inputMethod();
}

interface WindowsSoftware {
    void inputMethod();
}

class Linux implements LinuxSoftware {

    @Override
    public void inputMethod() {
        System.out.println("linux 系统输入法 ...");
    }
}

class Windows implements WindowsSoftware {

    @Override
    public void inputMethod() {
        System.out.println("windows 系统输入法 ...");
    }
}

class RedHat {
    private LinuxSoftware linuxSoftware;

    public RedHat(LinuxSoftware linuxSoftware) {
        this.linuxSoftware = linuxSoftware;
    }

    public void useInputMethod() {
        System.out.println("开始使用 redHat 系统输入法 ...");
        linuxSoftware.inputMethod();
        System.out.println("结束使用 redHat 系统输入法 ...");
    }
}

class Win10 {
    private WindowsSoftware windowsSoftware;

    public Win10(WindowsSoftware windowsSoftware) {
        this.windowsSoftware = windowsSoftware;
    }

    public void useInputMethod() {
        System.out.println("开始使用 win10 系统输入法 ...");
        windowsSoftware.inputMethod();
        System.out.println("结束使用 win10 系统输入法 ...");
    }
}

// 在 Linux 系统上使用 windows 输入法
class Adapter extends Windows implements LinuxSoftware{
    @Override
    public void inputMethod() {
        super.inputMethod();
    }
}
```

#### 总结
适配器模式将现有接口转化为客户类所期望的接口，实现了对现有类的复用，它是一种使用频率非常高的设计模式，在软件开发中得以广泛应用，在`Spring`等开源框架、驱动程序设计（如`JDBC`中的数据库驱动程序）中也使用了适配器模式。

优点：
- 将目标类和适配者类解耦，通过引入一个适配器类来重用现有的适配者类，无须修改原有结构。
- 增加了类的透明性和复用性，同时系统的灵活性和扩展性都非常好，更换适配器或者增加新的适配器都非常方便。可以在不修改原有代码的基础上增加新的适配器类，完全符合开放封闭原则。

缺点：
- 过多地使用适配器，会让系统非常零乱，不易整体进行把握。比如，明明看到调用的是 A 接口，其实内部被适配成了 B 接口的实现，一个系统如果太多出现这种情况，无异于一场灾难。因此如果不是很有必要，可以不使用适配器。
- 对象适配器模式的缺点是很难置换适配者类的方法。
- 类适配器模式中的目标抽象类只能为接口，不能为类，其使用有一定的局限性。

使用场景
- 系统需要使用现有的类，而这些类的接口不符合系统的需要；想要建立一个可以重复使用的类，用于与一些彼此之间没有太大关联的一些类一起工作。
- 系统需要使用现有的类，而此类的接口不符合系统的需要。
- 想要建立一个可以重复使用的类，用于与一些彼此之间没有太大关联的一些类，包括一些可能在将来引进的类一起工作，这些源类不一定有一致的接口。
- 通过接口转换，将一个类插入另一个类系中。如，老虎和飞禽，现在多了一个飞虎，在不增加实体的需求下，增加一个适配器，在里面包容一个虎对象，实现飞的接口。

### 桥接模式
桥接模式，将实现与抽象放在两个不同的类层次中，使两个层次可以独立改变。它是一种对象结构型模式，又称为柄体模式或接口模式。
桥接模式是一种很实用的结构型设计模式，如果软件系统中某个类存在两个独立变化的维度，通过该模式可以将这两个维度分离出来，使两者可以独立扩展，让系统更加符合“单一职责原则”。

如手机制造，内存是一个公司生产，芯片是另一个公司生产，而品牌又是另一个公司。我们需要什么样子的手机就把相应的芯片、内存组装起来。桥接模式就是把两个不同维度的东西桥接起来。
```java
public class MainTest {
    public static void main(String[] args) {
        Phone_A phone_a = new Phone_A();
        phone_a.setAbstractChip(new Chip_A());
        phone_a.setAbstractMemory(new Memory_A());
        phone_a.finished();
        System.out.println("=================");
        Phone_B phone_b = new Phone_B();
        phone_b.setAbstractChip(new Chip_B());
        phone_b.setAbstractMemory(new Memory_A());
        phone_b.finished();
    }
}
abstract class AbstractMemory {
    protected abstract void size();
}

abstract class AbstractChip {
    protected abstract void type();
}
abstract class  AbstractPhone {
    protected AbstractMemory abstractMemory;
    protected AbstractChip abstractChip;

    public void setAbstractChip(AbstractChip abstractChip) {
        this.abstractChip = abstractChip;
    }

    public void setAbstractMemory(AbstractMemory abstractMemory) {
        this.abstractMemory = abstractMemory;
    }

    protected abstract void finished();
}

class Memory_A  extends AbstractMemory{

    @Override
    protected void size() {
        System.out.println("create 6G of memory ...");
    }
}
class Memory_B  extends AbstractMemory{

    @Override
    protected void size() {
        System.out.println("create 8G of memory ...");
    }
}

class Chip_A extends AbstractChip {

    @Override
    protected void type() {
        System.out.println("snapdragon 888 chip ...");
    }
}

class Chip_B extends AbstractChip {

    @Override
    protected void type() {
        System.out.println("A14 chip ...");
    }
}

class Phone_A  extends AbstractPhone{

    @Override
    protected void finished() {
        abstractMemory.size();
        abstractChip.type();
        System.out.println("phone_a assembly completed ...");
    }
}

class Phone_B  extends AbstractPhone{

    @Override
    protected void finished() {
        abstractMemory.size();
        abstractChip.type();
        System.out.println("phone_b assembly completed ...");
    }
}
```
桥接模式是设计Java虚拟机和实现JDBC等驱动程序的核心模式之一，应用较为广泛。
在软件开发中如果一个类或一个系统有多个变化维度时，都可以尝试使用桥接模式对其进行设计。桥接模式为多维度变化的系统提供了一套完整的解决方案，并且降低了系统的复杂度。

优点：
- 实现了抽象和实现部分的分离，从而极大的提供了系统的灵活性，让抽象部分和实现部分独立开来，这有助于系统进行分层设计，从而产生更好的结构化系统。
- 优秀的扩展能力。在两个变化维度中任意扩展一个维度，都不需要修改原有系统，符合开放封闭原则。
- 桥接模式替代多层继承方案，可以减少子类的个数，降低系统的管理和维护成本。

缺点：
- 桥接模式的引入会增加系统的理解与设计难度，由于聚合关联关系建立在抽象层，要求开发者针对抽象进行设计与编程。
- 桥接模式要求正确识别出系统中两个独立变化的维度(抽象、和实现)，因此其使用范围有一定的局限性，即需要有这样的应用场景，如何正确识别两个独立维度也需要一定的经验积累。

使用场景：
- 桥接模式主要解决在有多种可能会变化的情况下，用继承会造成类爆炸问题，扩展起来不灵活。对于两个独立变化的维度，使用桥接模式再适合不过了。
- 如果一个系统需要在构件的抽象化角色和具体化角色之间增加更多的灵活性，避免在两个层次之间建立静态的继承联系，通过桥接模式可以使它们在抽象层建立一个关联关系。

### 组合模式
组合模式，组合多个对象形成树形结构以表示具有“整体—部分”关系的层次结构。组合模式对单个对象和组合对象的使用具有一致性，组合模式又可以称为“整体—部分”模式，它是一种对象结构型模式。
组合模式，是用于把一组相似的对象当作一个单一的对象。组合模式依据树形结构来组合对象，用来表示部分以及整体层次。
```java
public class MainTest {
    public static void main(String[] args) {
        Tree tree = new Tree();
        tree.add(new LeftNode());
        tree.add(new RightNode());
        tree.implmethod();
    }
}

abstract class AbstractTree {
    protected abstract void add(AbstractTree node);

    protected abstract void remove(AbstractTree node);

    protected abstract void implmethod();
}

class LeftNode extends AbstractTree {

    @Override
    protected void add(AbstractTree node) {
        System.out.println("Exception: the method is not supported. ");
    }

    @Override
    protected void remove(AbstractTree node) {
        System.out.println("Exception: the method is not supported. ");
    }

    @Override
    protected void implmethod() {
        System.out.println("left node method ...");
    }
}

class RightNode extends AbstractTree {

    @Override
    protected void add(AbstractTree node) {
        System.out.println("Exception: the method is not supported. ");
    }

    @Override
    protected void remove(AbstractTree node) {
        System.out.println("Exception: the method is not supported. ");
    }

    @Override
    protected void implmethod() {
        System.out.println("right node method ...");
    }
}

class Tree extends AbstractTree {

    private ArrayList<AbstractTree> treeList = new ArrayList<>();


    @Override
    protected void add(AbstractTree node) {
        treeList.add(node);
    }

    @Override
    protected void remove(AbstractTree node) {
        treeList.remove(node);
    }

    @Override
    protected void implmethod() {
        System.out.println("tree node");
        for (AbstractTree node : treeList) {
            node.implmethod();
        }
    }
}
```
组合模式使用面向对象的思想来实现树形结构的构建与处理，描述了如何将容器对象和叶子对象进行递归组合，实现简单，灵活性好。
由于在软件开发中存在大量的树形结构，因此组合模式是一种使用频率较高的结构型设计模式。在XML解析、组织结构树处理、文件系统设计等领域，组合模式都得到了广泛应用。

优点：
- 高层模块调用简单。客户端可以一致地使用一个组合结构或其中单个对象，不必关心处理的是单个对象还是整个组合结构。
- 在组合模式中节点增加自由，无须对现有类库进行任何修改，符合开闭原则。

缺点：
- 在使用组合模式时，其叶子和树的声明都是实现类，而不是接口，违反了依赖倒置原则。

使用场景：
- 部分、整体场景，如树形菜单，文件、文件夹的管理。
- 希望用户忽略组合对象与单个对象的不同，用户将统一地使用组合结构中的所有对象。

### 装饰模式
装饰模式，动态地给一个对象增加一些额外的职责，就增加对象功能来说，装饰模式比生成子类实现更为灵活。装饰模式是一种对象结构型模式。
```java
public class MainTest {
    public static void main(String[] args) {
        Drink coffee = new ShortBlock();
        System.out.println("订单价格："+ coffee.cost());
        System.out.println("订单描述：" + coffee.getDesc());
        System.out.println("=====================");
        coffee = new Chocolate(coffee);
        System.out.println("订单价格："+ coffee.cost());
        System.out.println("订单描述：" + coffee.getDesc());
        System.out.println("=====================");
        coffee = new Milk(coffee);
        System.out.println("订单价格："+ coffee.cost());
        System.out.println("订单描述：" + coffee.getDesc());
    }
}

abstract class Drink {

    public String desc;

    private double price = 0.0;

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getPrice() {
        return price;
    }

    protected abstract double cost();
}

class ShortBlock extends Drink{

    public ShortBlock() {
        super.setPrice(3.0);
        super.setDesc("ShortBlock");
    }

    @Override
    protected double cost() {
        return super.getPrice();
    }
}

class LongBlock extends Drink {

    public LongBlock() {
        super.setPrice(5.0);
        super.setDesc("LongBlock");
    }

    @Override
    protected double cost() {
        return super.getPrice();
    }
}

class CoffeeShop extends Drink {

    private final Drink coffee;

    protected CoffeeShop(Drink coffee) {
        this.coffee = coffee;
    }

    @Override
    protected double cost() {
        return super.getPrice() + coffee.cost();
    }

    @Override
    public String getDesc() {
        return desc + " " + getPrice() +" && "+  coffee.getDesc();
    }
}

class Milk extends CoffeeShop {

    public Milk(Drink seasoning) {
        super(seasoning);
        super.setDesc("Milk");
        super.setPrice(6);
    }

}

class Chocolate extends CoffeeShop {

    public Chocolate(Drink seasoning) {
        super(seasoning);
        super.setDesc("Chocolate");
        super.setPrice(4);
    }

}
```
装饰模式降低了系统的耦合度，可以动态增加或删除对象的职责，并使得需要装饰的具体构件类和具体装饰类可以独立变化，以便增加新的具体构件类和具体装饰类。
在软件开发中，装饰模式应用较为广泛，例如在`JavaIO`中的输入流和输出流的设计、`javax.swing`包中一些图形界面构件功能的增强等地方都运用了装饰模式。

一般的，我们为了扩展一个类经常使用继承方式实现，由于继承为类引入静态特征，并且随着扩展功能的增多，子类会很膨胀，装饰者模式主要解决这个问题。

优点：
- 对于扩展一个对象的功能，装饰模式比继承更加灵活性，不会导致类的个数急剧增加。
- 装饰类和被装饰类可以独立发展，不会相互耦合，装饰模式是继承的一个替代模式，装饰模式可以动态扩展一个实现类的功能。

缺点：
- 多层装饰比较复杂。
- 使用装饰模式进行系统设计时将产生很多小对象，这些对象的区别在于它们之间相互连接的方式有所不同，而不是它们的类或者属性值有所不同，大量小对象的产生势必会占用更多的系统资源，在一定程序上影响程序的性能。

使用场景：
- 这种模式创建了一个装饰类，用来包装原有的类，并在保持类方法签名完整性的前提下，提供了额外的功能，可代替继承。
- 扩展一个类的功能。 
- 动态增加功能，动态撤销功能。
- 当不能采用继承的方式对系统进行扩展或者采用继承不利于系统扩展和维护时可以使用装饰模式。不能采用继承的情况主要有两类：
  - 第一类是系统中存在大量独立的扩展，为支持每一种扩展或者扩展之间的组合将产生大量的子类，使得子类数目呈爆炸性增长；
  - 第二类是因为类已定义为不能被继承；


### 外观模式
外观模式，为子系统中的一组接口提供一个统一的入口。外观模式定义了一个高层接口，这个接口使得这一子系统更加容易使用。
外观模式又称为门面模式，它是一种对象结构型模式。外观模式是迪米特法则的一种具体实现，通过引入一个新的外观角色可以降低原有系统的复杂度，同时降低客户类与子系统的耦合度。
```java
public class MainTest {
    public static void main(String[] args) {
        Facade facade = new Facade();
        facade.aTest();
    }
}
class Facade {
    private final A a;
    private final B b;
    private final C c;
    private final D d;

    public Facade() {
        this.a = A.getInstance();
        this.b = B.getInstance();
        this.c = C.getInstance();
        this.d = D.getInstance();
    }

    public void aTest() {
        a.aTest();
        b.aTest();
        c.aTest();
        d.aTest();
    }
}

/**
 * A调用B类，A调用C类，B调用C类，D调用B类，D调用C类
 */
class A {
   private final static A instance = new A();
   private A(){}
   public static A getInstance() {
       return instance;
   }
   public  void aTest() {
       B.getInstance().aTest();
       C.getInstance().aTest();
       System.out.println("A class test method ...");
   }
}

class B {
    private final static B instance = new B();
    private B(){}
    public static B getInstance() {
        return instance;
    }
    public  void aTest() {
        C.getInstance().aTest();
        System.out.println("B class test method ...");
    }
}

class C {
    private final static C instance = new C();
    private C(){}
    public  static C getInstance() {
        return instance;
    }
    public  void aTest() {
        System.out.println("C class test method ...");
    }
}

class D {
    private final static D instance = new D();
    private D(){}
    public static D getInstance() {
        return instance;
    }
    public  void aTest() {
        B.getInstance().aTest();
        C.getInstance().aTest();
        System.out.println("D class test method ...");
    }
}
```
外观模式的主要目的在于降低系统的复杂程度，在面向对象软件系统中，类与类之间的关系越多，不能表示系统设计得越好，反而表示系统中类之间的耦合度太大，这样的系统在维护和修改时都缺乏灵活性，因为一个类的改动会导致多个类发生变化，而外观模式的引入在很大程度上降低了类与类之间的耦合关系。
引入外观模式之后，增加新的子系统或者移除子系统都非常方便，客户类无须进行修改（或者极少的修改），只需要在外观类中增加或移除对子系统的引用即可。
从这一点来说，外观模式在一定程度上并不符合开放封闭原则，增加新的子系统需要对原有系统进行一定的修改，虽然这个修改工作量不大。

优点：
- 减少关联关系；对客户端屏蔽了具体的实现，使得子系统使用起来更加容易；客户端代码将变得很简单，与之关联的对象也很少。
- 解耦合；具体实现有改变不会影响到调用的客户端，只需要调整外观类即可。

缺点：
- 如果设计不当，扩展时增加新的实现可能需要修改外观类的源代码，违背了开放封闭原则.
- 不能很好地限制客户端直接使用子系统类，如果对客户端访问子系统类做太多的限制则减少了可变性和灵活性。

使用场景：
- 当要为访问一系列复杂的子系统提供一个简单入口时可以使用外观模式。
- 客户端程序与多个子系统之间存在很大的依赖性。引入外观类可以将子系统与客户端解耦，从而提高子系统的独立性和可移植性。
- 在层次化结构中，可以使用外观模式定义系统中每一层的入口，层与层之间不直接产生联系，而通过外观类建立联系，降低层之间的耦合度。

### 享元模式
享元模式，运用共享技术有效地支持大量细粒度对象的复用。系统只使用少量的对象，而这些对象都很相似，状态变化很小，可以实现对象的多次复用。
由于享元模式要求能够共享的对象必须是细粒度对象，因此它又称为轻量级模式，它是一种对象结构型模式。
```java
public class MainTest {
    public static void main(String[] args) {
        WebSiteFactory webSiteFactory = new WebSiteFactory();
        
        webSiteFactory.getWebSite("新闻").use(new User("lucy"));

        webSiteFactory.getWebSite("新闻").use(new User("jane"));

        webSiteFactory.getWebSite("博客").use(new User("jack"));

        webSiteFactory.getWebSite("博客").use(new User("maik"));

        webSiteFactory.getWebSite("博客").use(new User("seven"));

        System.out.println("网站类型共：" + webSiteFactory.countWebSiteType());
    }
}

abstract class WebSite{

    private String name;

    public abstract void use(User user);

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}

class ConcreateWebSite extends WebSite {

    public ConcreateWebSite(String name) {
        super.setName(name);
    }

    @Override
    public void use(User user) {
        System.out.println("网站类型名称：" + super.getName() +"\t 网站用户：" + user.getUsername());
    }
}

class User {

    private String username;

    public User(String username) {
        this.username = username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }
}

class WebSiteFactory{

    private HashMap<String, WebSite> pool = new HashMap<>();

    public WebSite getWebSite(String webSiteName){
        if (!pool.containsKey(webSiteName)) {
            pool.put(webSiteName, new ConcreateWebSite(webSiteName));
        }
        return pool.get(webSiteName);
    }

    public Integer countWebSiteType() {
        return pool.size();
    }

}
```
当系统中存在大量相同或者相似的对象时，享元模式是一种较好的解决方案，它通过共享技术实现相同或相似的细粒度对象的复用，从而节约了内存空间，提高了系统性能。
相比其他结构型设计模式，享元模式的使用频率并不算太高，但是作为一种以“节约内存，提高性能”为出发点的设计模式，它在软件开发中还是得到了一定程度的应用。如：`String`、Java的池技术等。

享元模式主要解决在有大量对象时，有可能会造成内存溢出，我们把其中共同的部分抽象出来，如果有相同的业务请求，直接返回在内存中已有的对象，避免重新创建。

优点：
- 大大减少对象的创建，降低系统的内存，使效率提高。

缺点：
- 提高了系统的复杂度，需要分离出外部状态和内部状态，而且外部状态具有固有化的性质，不应该随着内部状态的变化而变化，否则会造成系统的混乱。

使用场景：
- 在使用享元模式时需要维护一个存储享元对象的享元池，而这需要耗费一定的系统资源，因此，应当在需要多次重复使用享元对象时才值得使用享元模式。
- 系统有大量相似对象。 
- 需要缓冲池的场景。

### 代理模式
代理模式，给某一个对象提供一个代理或占位符，并由代理对象来控制对原对象的访问。
代理模式是为一个对象提供一个替身，以控制对这个对象的访问，即通过代理对象访问目标对象。
这样做的好处是，可以在目标对象实现的基础上，增强额外的功能操作，即扩展目标对象的功能。被代理的对象可以是远程对象、创建开销大的对象或需要安全控制的对象。
代理模式有不同的形式，主要有三种 静态代理、动态代理 (`JDK`代理、`Cglib`代理)。

#### 静态代理
```java
public class MainTest {
    public static void main(String[] args) {
        ProxyImpl proxy = new ProxyImpl();
        StaticProxy staticProxy = new StaticProxy(proxy);
        staticProxy.test();
    }
}

interface ProxyInterface {
    void test();
}

class ProxyImpl implements ProxyInterface{

    @Override
    public void test() {
        System.out.println("helloWorld");
    }

}


class StaticProxy implements ProxyInterface{

    private ProxyImpl target;

    public StaticProxy (ProxyImpl target){
        this.target=target;
    }


    @Override
    public void test() {
        System.out.println("静态代理之前...");
        target.test();
        System.out.println("静态代理之后...");
    }
}
```
静态代理能在不修改目标对象的功能前提下，能通过代理对象对目标进行扩展。
但是因为代理对象需要与目标对象实现相同的接口，所以会有很多代理类一旦接口增加方法后，目标对象与代理对象都需要维护。

#### JDK动态代理
JDK动态代理，代理对象不需要实现接口，但是目标对象需要实现接口，否则不能实现动态代理。代理对象的生产是利用JDK的API，动态的在内存中构建代理对象。
```java
public class MainTest {
    public static void main(String[] args) {
        ProxyImpl proxy = new ProxyImpl();
        ProxyInterface jdkProxyInterface = (ProxyInterface)new JDKProxy().bind(proxy);
        jdkProxyInterface.test();
    }
}
interface ProxyInterface {
    void test();
}

class ProxyImpl implements ProxyInterface{

    @Override
    public void test() {
        System.out.println("helloWorld");
    }

}

class JDKProxy {
    //通用类型，表示被代理的真实对象
    private Object target;

    public Object bind(Object target){
        this.target=target;
        //生成代理类（与被代理对象实现相同接口的兄弟类）
        return Proxy.newProxyInstance(target.getClass().getClassLoader(), target.getClass().getInterfaces(), (proxy, method, args) -> {
            Object res;
            System.out.println("JDK动态代理前");
            res=method.invoke(target, args);
            System.out.println("JDK动态代理后");
            return res;
        });
    }

}
```

#### Cglib动态代理
`Cglib`代理也叫作子类代理，它是在内存中构建一个子类对象从而实现对目标对象功能扩展。
`Cglib`是一个强大的高性能的代码生成包，它可以在运行期扩展Java类与实现Java接口，广泛的被许多AOP的框架使用，例如`Spring AOP`，实现方法拦截。

以下测试代码需要导入`Cglib`和`asm`相关jar包：
```text
asm-3.3.1.jar
cglib-2.2.jar
```

使用`Cglib`实现动态代理时出现了下面这个异常：
```text
Exception in thread "main" java.lang.IncompatibleClassChangeError: 
class net.sf.cglib.core.DebuggingClassWriter has interface org.objectweb.asm.ClassVisitor as super class
```
原因是`cglib.jar`包含`asm.jar`包。报错内容是`ClassVisitor`的父类不相容。[详细原因分析](https://my.oschina.net/itblog/blog/528613)。
测试时用`cglib2.2.jar`和`asm3.3.1.jar`版本，解决jar包冲突问题。
```java
public class MainTest {
    public static void main(String[] args) {
        Target target = new Target();
        Target bind = (Target)new CGLibProxy().bind(target);
        bind.test();
    }
}


class Target{

    public void test() {
        System.out.println("helloWorld");
    }

}

class CGLibProxy implements MethodInterceptor {

    private Object target;

    public  Object bind(Object target) {
        this.target = target;
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(target.getClass());
        enhancer.setCallback(this);
        return enhancer.create();
    }

    @Override
    public Object intercept(Object proxy, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        Object res;
        System.out.println("CGLib动态代理前");
        res=method.invoke(target, args);
        System.out.println("CGLib动态代理后");
        return res;
    }

}
```

#### 总结
代理模式是常用的结构型设计模式之一，它为对象的间接访问提供了一个解决方案，可以对对象的访问进行控制。
代理模式主要解决，在直接访问对象时带来的问题。比如说，要访问的对象在远程的机器上。在面向对象系统中，有些对象由于某些原因，对象创建开销很大，或者某些操作需要安全控制，或者需要进程外的访问，直接访问会给使用者或者系统结构带来很多麻烦，我们可以在访问此对象时加上一个对此对象的访问层。

优点：
- 职责清晰。能够协调调用者和被调用者，在一定程度上降低了系统的耦合度。
- 高扩展性。增加和更换代理类无须修改源代码，符合开闭原则，系统具有较好的灵活性和可扩展性。

缺点：
- 由于在客户端和真实主题之间增加了代理对象，因此有些类型的代理模式可能会造成请求的处理速度变慢。 
- 实现代理模式需要额外的工作，有些代理模式的实现非常复杂。

使用场景：
- 想在访问一个类时做一些控制。

### 职责链模式
职责链模式，避免请求发送者与接收者耦合在一起，让多个对象都有可能接收请求，将这些对象连接成一条链，并且沿着这条链传递请求，直到有对象处理它为止。职责链模式是一种对象行为型模式。
```java
public class MainTest {
    public static void main(String[] args) {
         // 产品
        RequestEntity test = new RequestEntity("test", 2000);

        // 指定职责链
        BeforeHandler before = new BeforeHandler("before");
        AfterHandler after = new AfterHandler("after");
        PostHandler post = new PostHandler("post");

        // 形成链状闭环 要确保会被责任链中的组件处理 否则会一直循环下去 ，当然也可以选择不闭环
        before.setHandler(after);
        after.setHandler(post);
        post.setHandler(before);

        after.handleRequest(test);
    }

}

class RequestEntity {

    public String name;

    public Integer grade;

    public RequestEntity(String name,Integer grade) {
        this.name = name;
        this.grade = grade;
    }

    public String getName() {
        return name;
    }

    public float getGrade() {
        return grade;
    }
}

abstract class Handler {

    // 下一个引用
    protected Handler handler;

    protected String name;

    public Handler(String name) {
        this.name = name;
    }

    public void setHandler(Handler handler) {
        this.handler = handler;
    }

    public abstract void handleRequest(RequestEntity requestEntity);

}

class BeforeHandler extends Handler {

    public BeforeHandler(String name){
        super(name);
    }


    @Override
    public void handleRequest(RequestEntity requestEntity) {
        if (requestEntity.getGrade() < 1000) {
            System.out.println("分数为：" + requestEntity.getGrade() + "，被" + this.name + "处理 ");
        }else {
            handler.handleRequest(requestEntity);
        }
    }
}

class AfterHandler extends Handler {

    public AfterHandler(String name){
        super(name);
    }

    @Override
    public void handleRequest(RequestEntity requestEntity) {
        if (requestEntity.getGrade() <= 2000) {
            System.out.println("分数为：" + requestEntity.getGrade() + "，被" + this.name + "处理 ");
        }else {
            handler.handleRequest(requestEntity);
        }
    }
}

class PostHandler extends Handler {

    public PostHandler(String name){
        super(name);
    }

    @Override
    public void handleRequest(RequestEntity requestEntity) {
        if (requestEntity.getGrade() > 3000) {
            System.out.println("分数为：" + requestEntity.getGrade() + "，被" + this.name + "处理 ");
        }else {
            handler.handleRequest(requestEntity);
        }
    }
}
```

职责链模式通过建立一条链来组织请求的处理者，请求将沿着链进行传递，请求发送者无须知道请求在何时、何处以及如何被处理，实现了请求发送者与处理者的解耦。
在软件开发中，如果遇到有多个对象可以处理同一请求时可以应用职责链模式，例如在Web应用开发中创建一个过滤器(Filter)链来对请求数据进行过滤，在工作流系统中实现公文的分级审批等等，使用职责链模式可以较好地解决此类问题。

优点：
- 增加新的请求处理类很方便，只需要在客户端重新建链即可，从这一点来看是符合开闭原则的。
- 为请求创建了一个接收者对象的链式结构。对请求的发送者和接收者进行解耦。
- 简化了对象，使得对象不需要知道链的结构。
- 增强给对象指派职责的灵活性。通过改变链内的成员或者调动它们的次序，允许动态地新增或者删除责任。

缺点：
- 系统性能将受到一定影响，可能会造成循环调用。特别是在链比较长的时候，因此需控制链中最大节点数量，一般通过在`Handler`中设置一个最大节点数量，在`setNext`方法中判断是否已经超过阀值，超过则不允许该链建立，避免出现超长链无意识地破坏系统性能。
- 调试不方便。采用了类似递归的方式，调试时逻辑可能比较复杂。可能不容易观察运行时的特征，有碍于除错。

使用场景：
- 在处理消息的时候以过滤很多通道。
- 有多个对象可以处理同一个请求，具体哪个对象处理该请求由运行时刻自动确定。
- 在不明确指定接收者的情况下，向多个对象中的一个提交一个请求。
- 可动态指定一组对象处理请求。

### 命令模式
命令模式，将一个请求封装为一个对象，从而让我们可用不同的请求对客户进行参数化；对请求排队或者记录请求日志，以及支持可撤销的操作。
命令模式是一种对象行为型模式，其别名为动作模式或事务模式。
命令模式可以将请求发送者和接收者完全解耦，发送者与接收者之间没有直接引用关系，发送请求的对象只需要知道如何发送请求，而不必知道如何完成请求。
```java
public class MainTest {
    public static void main(String[] args) {
        LightReceiver lightReceiver = new LightReceiver();

        LightOnCommand lightOnCommand = new LightOnCommand(lightReceiver);
        LightOffCommand lightOffCommand = new LightOffCommand(lightReceiver);
        RemoteCommand remoteCommand = new RemoteCommand();
        // 测试
        remoteCommand.setCommand(0,lightOnCommand,lightOffCommand);
        // 按下开灯按钮
        System.out.println("按下开灯按钮 -------");
        remoteCommand.onButtonPushed(0);
        // 按下关灯按钮
        System.out.println("按下关灯按钮 -------");
        remoteCommand.offButtonPushed(0);
        // 按下撤销按钮
        System.out.println("按下撤销按钮 ---------");
        remoteCommand.undoButtonPushed(0);
    }
}

interface Command{

    /**
     * 执行命令
     */
    void exec();

    /**
     * 撤销命令
     */
    void undo();

}

class LightReceiver{

    public void on(){
        System.out.println("开灯 ...");
    }

    public void off() {
        System.out.println("关灯 ...");
    }


}

class LightOnCommand implements Command{

    private LightReceiver lightReceiver;

    public LightOnCommand(LightReceiver lightReceiver) {
        super();
        this.lightReceiver = lightReceiver;
    }

    @Override
    public void exec() {
        lightReceiver.on();
    }

    @Override
    public void undo() {
        lightReceiver.off();
    }
}

class LightOffCommand implements Command {

    private LightReceiver lightReceiver;

    public LightOffCommand(LightReceiver lightReceiver) {
        super();
        this.lightReceiver = lightReceiver;
    }

    @Override
    public void exec() {
        lightReceiver.off();
    }

    @Override
    public void undo() {
        lightReceiver.on();
    }
}

/**
 * 空执行 默认命令实现类
 */
class NoCommand implements Command {

    @Override
    public void exec() {
        System.out.println("默认命令执行");
    }

    @Override
    public void undo() {
        System.out.println("默认撤销方法");
    }
}

class RemoteCommand {

    // 存放开关命令
    private Command onCommands[];

    private Command offCommands[];

    // 存放撤销命令
    private Command undoCommands[];

    public RemoteCommand() {
        undoCommands = new Command[5];
        onCommands = new Command[5];
        offCommands = new Command[5];

        // 默认空命令
        for (int i = 0; i < 5; i++) {
            onCommands[i] = new NoCommand();
            offCommands[i] = new NoCommand();
        }
    }

    // 设置命令
    public  void  setCommand(int no, Command onCommand, Command offCommand) {
        onCommands[no] = onCommand;
        offCommands[no] = offCommand;
    }

    // 按下开的按钮
    public void onButtonPushed(int no) {
        onCommands[no].exec();
        // 记录撤销操作
        undoCommands[no] = onCommands[no];
    }

    // 按下关闭的按钮
    public void offButtonPushed(int no) {
        offCommands[no].exec();
        // 记录撤销操作
        undoCommands[no] = offCommands[no];
    }

    // 按下撤销按钮
    public void undoButtonPushed(int no) {
        undoCommands[no].undo();
    }


}
```
命令模式是一种使用频率非常高的设计模式，它可以将请求发送者与接收者解耦，请求发送者通过命令对象来间接引用请求接收者，使得系统具有更好的灵活性和可扩展性。
在基于GUI的软件开发，无论是在电脑桌面应用还是在移动应用中，命令模式都得到了广泛的应用。
在软件系统中，行为请求者与行为实现者通常是一种紧耦合的关系，但某些场合，比如需要对行为进行记录、撤销或重做、事务等处理时，这种无法抵御变化的紧耦合的设计就不太合适。

优点：
- 降低了系统耦合度。
- 新的命令可以很容易地加入到系统中。由于增加新的具体命令类不会影响到其他类，因此增加新的具体命令类很容易，无须修改原有系统源代码，甚至客户类代码，满足开闭原则的要求。

缺点：
- 使用命令模式可能会导致某些系统有过多的具体命令类。因为针对每一个对请求接收者的调用操作都需要设计一个具体命令类，因此在某些系统中可能需要提供大量的具体命令类，这将影响命令模式的使用。

使用场景：
- 请求调用者需要与请求接收者解耦时，命令模式可以使调用者和接收者不直接交互。
- 当系统需要支持命令的撤销操作和恢复操作时。
- 系统需要在不同的时间指定请求、将请求排队和执行请求。一个命令对象和请求的初始调用者可以有不同的生命期，换言之，最初的请求发出者可能已经不在了，而命令对象本身仍然是活动的，可以通过该命令对象去调用请求接收者，而无须关心请求调用者的存在性，可以通过请求日志文件等机制来具体实现。

### 解释器模式
解释器模式，定义一个语言的文法，并且建立一个解释器来解释该语言中的句子，这里的“语言”是指使用规定格式和语法的代码。解释器模式是一种类行为型模式。
```java
public class MainTest {
    public static void main(String[] args) throws IOException {
        String expStr = getExpStr();
        HashMap<String, Integer> var = getValue(expStr);
        Calculator calculator = new Calculator(expStr);
        System.out.println("运算结果：" + expStr + "=" + calculator.run(var));
    }

    // 获得表达式
    public static String getExpStr() throws IOException {
        System.out.print("请输入表达式：");
        return (new BufferedReader(new InputStreamReader(System.in))).readLine();
    }

    // 获得值映射
    public static HashMap<String, Integer> getValue(String expStr) throws IOException {
        HashMap<String, Integer> map = new HashMap<>();

        for (char ch : expStr.toCharArray()) {
            if (ch != '+' && ch != '-') {
                if (!map.containsKey(String.valueOf(ch))) {
                    System.out.print("请输入" + String.valueOf(ch) + "的值：");
                    String in = (new BufferedReader(new InputStreamReader(System.in))).readLine();
                    map.put(String.valueOf(ch), Integer.valueOf(in));
                }
            }
        }
        return map;
    }

}

abstract class AbstractExpression {

    /**
     * 表达式解释器
     */
    public abstract int interpreter(HashMap<String, Integer> var);

}

/**
 * 终结表达式
 */
class VarExpression extends AbstractExpression {

    private String key;

    public VarExpression(String key) {
        this.key = key;
    }

    @Override
    public int interpreter(HashMap<String, Integer> map) {
        return map.get(key);
    }
}

/**
 * 非终结表达式
 */
class SymbolExpression extends AbstractExpression {

    protected AbstractExpression left;

    protected AbstractExpression right;

    SymbolExpression(AbstractExpression left, AbstractExpression right) {
        this.left = left;
        this.right = right;
    }


    // 因为 SymbolExpression  是让其子类来实现，因此 interpreter 是一个默认实现
    @Override
    public int interpreter(HashMap<String, Integer> var) {
        return 0;
    }

}

/**
 * 减法
 */
class SubExpression extends SymbolExpression {

    public SubExpression(AbstractExpression left, AbstractExpression right) {
        super(left, right);
    }

    @Override
    public int interpreter(HashMap<String, Integer> var) {
        return super.left.interpreter(var) - super.right.interpreter(var);
    }

}

/**
 * 加法
 */
class AddExpression extends SymbolExpression {

    public AddExpression(AbstractExpression left, AbstractExpression right) {
        super(left, right);
    }

    @Override
    public int interpreter(HashMap<String, Integer> var) {
        return super.left.interpreter(var) + super.right.interpreter(var);
    }

}

/**
 * 计算器 调用加减法
 */
class Calculator {

    private AbstractExpression expression;

    public  Calculator(AbstractExpression expression) {
        this.expression = expression;
    }

    public Calculator(String expStr) {
        // 安排运算先后顺序
        Stack<AbstractExpression> stack = new Stack<>();
        // 表达式拆分成字符数组
        char[] charArray = expStr.toCharArray();


        AbstractExpression left = null;
        AbstractExpression right = null;
        //遍历我们的字符数组，  即遍历	[a, +, b]
        //针对不同的情况，做处理
        for (int i = 0; i < charArray.length; i++) {
            switch (charArray[i]) {
                case '+':
                    // 从 stack 取 出 left => "a"
                    left = stack.pop();
                    // 取出右表达式 "b"
                    right = new VarExpression(String.valueOf(charArray[++i]));
                    stack.push(new AddExpression(left, right));
                    // 然后根据得到 left 和 right 构建 AddExpresson 加入 stack
                    break;
                case '-':
                    left = stack.pop();
                    right = new VarExpression(String.valueOf(charArray[++i]));
                    stack.push(new SubExpression(left, right));
                    break;
                default:
                    //如果是一个 Var 就创建要给 VarExpression 对象，并 push 到 stack
                    stack.push(new VarExpression(String.valueOf(charArray[i])));

                    break;
            }
        }
        //当遍历完整个 charArray  数组后，stack 就得到最后
        this.expression = stack.pop();
    }


    public int run(HashMap<String, Integer> var) {
        //最后将表达式 a+b 和 var = {a=10,b=20}
        //然后传递给 expression 的 interpreter 进行解释执行
        return this.expression.interpreter(var);
    }

}
```
解释器模式为自定义语言的设计和实现提供了一种解决方案，它用于定义一组文法规则并通过这组文法规则来解释语言中的句子。
虽然解释器模式的使用频率不是特别高，但是它在正则表达式、XML文档解释等领域还是得到了广泛使用。
与解释器模式类似，目前还诞生了很多基于抽象语法树的源代码处理工具，例如`Eclipse`中的`Eclipse AST`，它可以用于表示Java语言的语法结构，用户可以通过扩展其功能，创建自己的文法规则。

优点：
- 易于改变和扩展文法。增加新的解释表达式较为方便。如果用户需要增加新的解释表达式只需要对应增加一个新的终结符表达式或非终结符表达式类，原有表达式类代码无须修改，符合“开闭原则”。
- 易于实现简单文法。

缺点：
- 可利用场景比较少。
- 对于复杂的文法比较难维护。解释器模式会引起类膨胀，如果一个语言包含太多文法规则，类的个数将会急剧增加，导致系统难以管理和维护。
- 解释器模式采用递归调用方法。

使用场景：
- 对于一些固定文法构建一个解释句子的解释器。
- 可以将一个需要解释执行的语言中的句子表示为一个抽象语法树
- 一些重复出现的问题可以用一种简单的语言来进行表达。
- 一个简单语法需要解释的场景。

### 迭代器模式
迭代器模式，提供一种方法来访问聚合对象，而不用暴露这个对象的内部表示，其别名为游标。迭代器模式是一种对象行为型模式。
迭代器模式的重要用途就是帮助我们遍历容器。迭代器模式，提供一种遍历集合元素的统一接口，用一致的方法遍历集合元素，不需要知道集合对象的底层表示，即不暴露其内部的结构。
在迭代器模式结构中包含聚合和迭代器两个层次结构，考虑到系统的灵活性和可扩展性，在迭代器模式中应用了工厂方法模式。
```java
public class MainTest {
    public static void main(String[] args) {
        Bread bread = new Bread();
        bread.add("面粉");
        bread.add("黄油");
        bread.add("白糖");
        bread.add("鸡蛋");
        Iterator iterator = bread.getIterator();
        while (iterator.hasNext()) {
            System.out.println(iterator.next());
        }
    }
}

class FoodIterator implements Iterator {

    String[] foods;
    int      position = 0;

    public FoodIterator(String[] foods) {
        this.foods = foods;
    }

    @Override
    public boolean hasNext() {
        return position != foods.length;
    }

    @Override
    public Object next() {
        String food = foods[position];
        position += 1;
        return food;
    }

}

interface Food {

    void add(String name);

    Iterator getIterator();
}

class Bread implements Food{
    private String[] foods    = new String[4];
    private int      position = 0;

    @Override
    public void add(String name) {
        foods[position] = name;
        position += 1;
    }

    @Override
    public Iterator getIterator() {
        return new FoodIterator(this.foods);
    }
}
```
迭代器模式是一种使用频率非常高的设计模式，通过引入迭代器可以将数据的遍历功能从聚合对象中分离出来，聚合对象只负责存储数据，而遍历数据由迭代器来完成。
由于很多编程语言的类库都已经实现了迭代器模式，因此在实际开发中，我们只需要直接使用Java、C#等语言已定义好的迭代器即可，迭代器已经成为我们操作聚合对象的基本工具之一。
迭代器的使用现在非常广泛，因为Java中提供了`java.util.Iterator`。而且Java中的很多容器，如`Collection`、`Set`也都提供了对迭代器的支持。

优点：
- 提供一个统一的方法遍历对象，客户不用再考虑聚合的类型，使用一种方法就可以遍历对象了。
- 隐藏了聚合的内部结构，客户端要遍历聚合的时候只能取到迭代器，而不会知道聚合的具体组成。
- 提供了一种设计思想，就是一个类应该只有一个引起变化的原因。
在聚合类中，我们把迭代器分开，就是要把管理对象集合和遍历对象集合的责任分开，这样一来集合改变的话，只影响到聚合对象。而如果遍历方式改变的话，只影响到了迭代器。
- 当要展示一组相似对象，或者遍历一组相同对象时使用，适合使用迭代器模式

缺点：
- 由于迭代器模式将存储数据和遍历数据的职责分离，增加新的聚合类需要对应增加新的迭代器类，类的个数成对增加，这在一定程度上增加了系统的复杂性。

使用场景：
- 需要为一个聚合对象提供多种遍历方式。
- 使用迭代器模式可以为遍历不同的聚合结构提供一个统一的接口，接口的实现类中为不同的聚合结构提供不同的遍历方式，而客户端可以一致性地操作该接口。

### 中介者模式
中介者模式，用一个中介对象（中介者）来封装一系列的对象交互，中介者使各对象不需要显式地相互引用，从而使其耦合松散，而且可以独立地改变它们之间的交互。
中介者模式又称为调停者模式，它是一种对象行为型模式。
如果在一个系统中对象之间存在多对多的相互关系，我们可以将对象之间的一些交互行为从各个对象中分离出来，并集中封装在一个中介者对象中，并由该中介者进行统一协调，这样对象之间多对多的复杂关系就转化为相对简单的一对多关系。
通过引入中介者来简化对象之间的复杂交互，中介者模式是“迪米特法则”的一个典型应用。
```java
public class MainTest {
    public static void main(String[] args) {
        //创建一个中介者对象
        Mediator mediator = new ConcreteMediator();

        //创建 Alarm  并且加入到ConcreteMediator 对象的 HashMap
        Alarm alarm = new Alarm(mediator, "alarm");

        //创建了 CoffeeMachine 对象，并且加入到	ConcreteMediator 对象的 HashMap
        CoffeeMachine coffeeMachine = new CoffeeMachine(mediator, "coffeeMachine");

        //创建  tV , 并	且加入到	ConcreteMediator 对象的 HashMap
        TV tV = new TV(mediator, "TV");

        //让闹钟发出消息 依次调用
        alarm.sendAlarm(0);
        coffeeMachine.finishCoffee();
        alarm.sendAlarm(1);
        tV.startTv();
    }

}

/**
 * 中介者
 */
abstract class Mediator {

    public abstract void register(String colleagueName, Colleague colleague);

    public abstract void getMessage(int stateChange, String name);
}

class ConcreteMediator extends Mediator {

    /**
     * 集合，放入所有的同事对象
     */
    private HashMap<String, Colleague> colleagueMap;
    private HashMap<String, String> interMap;

    public ConcreteMediator() {
        colleagueMap = new HashMap<>();
        interMap = new HashMap<>();
    }


    @Override
    public void register(String colleagueName, Colleague colleague) {
        if (colleague instanceof Alarm) {
            interMap.put("Alarm", colleagueName);
        } else if (colleague instanceof CoffeeMachine) {
            interMap.put("CoffeeMachine", colleagueName);
        } else {
            System.out.println("........");
        }
    }

    @Override
    public void getMessage(int stateChange, String colleagueName) {
        if (colleagueMap.get(colleagueName) instanceof Alarm) {
            if (stateChange == 0) {
                ((CoffeeMachine) (colleagueMap.get(interMap
                        .get("CoffeeMachine")))).startCoffee();
                ((TV) (colleagueMap.get(interMap.get("TV")))).startTv();
            } else if (stateChange == 1) {
                ((TV) (colleagueMap.get(interMap.get("TV")))).stopTv();
            }

        } else if (colleagueMap.get(colleagueName) instanceof TV) {
            //如果 TV 发现消息
        }
    }
}

/**
 * 抽象同事类
 */
abstract class Colleague {

    private final Mediator mediator;
    public String name;

    public Colleague(Mediator mediator, String name) {


        this.mediator = mediator;
        this.name = name;

    }


    public Mediator getMediator() {
        return this.mediator;
    }


    public abstract void sendMessage(int stateChange);
}

class Alarm extends Colleague {

    public Alarm(Mediator mediator, String name) {
        super(mediator, name);
        //在创建 Alarm 同事对象时，将自己放入到 ConcreteMediator 对象中[集合]
        mediator.register(name, this);
    }

    public void sendAlarm(int stateChange) {
        this.sendMessage(stateChange);
    }

    @Override
    public void sendMessage(int stateChange) {
        // 调用的中介者对象的 getMessage 方法
        this.getMediator().getMessage(stateChange, this.name);
    }

}

class TV extends Colleague {


    public TV(Mediator mediator, String name) {
        super(mediator, name);
        mediator.register(name, this);
    }


    @Override
    public void sendMessage(int stateChange) {
        this.getMediator().getMessage(stateChange, this.name);
    }


    public void startTv() {
        System.out.println("It's time to StartTv!");
    }


    public void stopTv() {
        System.out.println("StopTv!");
    }
}


class CoffeeMachine extends Colleague {

    public CoffeeMachine(Mediator mediator, String name) {
        super(mediator, name);
        mediator.register(name, this);
    }


    @Override
    public void sendMessage(int stateChange) {
        this.getMediator().getMessage(stateChange, this.name);
    }


    public void startCoffee() {
        System.out.println("It's time to startcoffee!");
    }


    public void finishCoffee() {
        System.out.println("After 5 minutes!");
        System.out.println("Coffee is ok!");
        sendMessage(0);
    }
}
```
中介者模式将一个网状的系统结构变成一个以中介者对象为中心的星形结构，在这个星型结构中，使用中介者对象与其他对象的一对多关系来取代原有对象之间的多对多关系。
中介者模式在事件驱动类软件中应用较为广泛，特别是基于GUI（图形用户界面）的应用软件，此外，在类与类之间存在错综复杂的关联关系的系统中，中介者模式都能得到较好的应用。

优点：
- 减少类间依赖，降低了耦合，符合迪米特法则。
- 简化了对象之间的交互，它用中介者和同事的一对多交互代替了原来同事之间的多对多交互，一对多关系更容易理解、维护和扩展，将原本难以理解的网状结构转换成相对简单的星型结构。
- 降低了类的复杂度，将一对多转化成了一对一。

缺点：
- 中介者承担了较多的责任，一旦中介者出现了问题，整个系统就会受到影响。
- 如果设计不当，可能会导致具体中介者类非常复杂，使得系统难以维护，在实际使用过程中要特别注意。

使用场景：
- 主要解决对象与对象之间存在大量的关联关系，这样势必会导致系统的结构变得很复杂，同时若一个对象发生改变，我们也需要跟踪与之相关联的对象，同时做出相应的处理。
应当注意不应当在职责混乱的时候使用。
- 系统中对象之间存在比较复杂的引用关系，导致它们之间的依赖关系结构混乱而且难以复用该对象。
- 想通过一个中间类来封装多个类中的行为，而又不想生成太多的子类。

### 备忘录模式
备忘录模式，在不破坏封装的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，这样可以在以后将对象恢复到原先保存的状态。它是一种对象行为型模式，其别名为`Token`。
在设计备忘录类时需要考虑其封装性，除了`Originator`类，不允许其他类来调用备忘录类`Memento`的构造函数与相关方法，如果不考虑封装性，允许其他类调用构造方法，将导致在备忘录中保存的历史状态发生改变，通过撤销操作所恢复的状态就不再是真实的历史状态，备忘录模式也就失去了本身的意义。
所谓备忘录模式就是在不破坏封装的前提下，捕获一个对象的内部状态，并在该对象之外保存这个状态，这样可以在以后将对象恢复到原先保存的状态。
```java
public class MainTest {
    public static void main(String[] args) {
        Originator originator = new Originator();
        CareTaker careTaker = new CareTaker();
        // 保存状态
        careTaker.saveMemento(originator.saveState(" 状态#1 "));
        careTaker.saveMemento(originator.saveState(" 状态#2 "));
        careTaker.saveMemento(originator.saveState(" 状态#3 "));

        System.out.println("目前保存的状态为：" + originator.getState());

        System.out.println("开始恢复以前的状态 ....");
        originator.recover(careTaker.recover(0));

        System.out.println("恢复之后的状态为：" + originator.getState());

    }
}


class Originator{

    private String state;


    public String getState() {
        return state;
    }

    public Memento saveState(String state) {
        this.state = state;
        return new Memento(state);
    }

    public void recover(Memento memento) {
        this.state =  memento.getState();
    }
}

/**
 * 备忘录对象 保存对象信息
 */
class Memento{

    /**
     * 需要保存状态
     */
    private final String state;

    public Memento(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }

}

/**
 * 管理备忘录对象
 */
class CareTaker {

    public ArrayList<Memento> mementos = new ArrayList<>();

    public Memento recover(int index) {
       return mementos.get(index);
    }

    public void saveMemento(Memento memento) {
        mementos.add(memento);
    }

}
```
备忘录模式在很多软件的使用过程中普遍存在，但是在应用软件开发中，它的使用频率并不太高，因为现在很多基于窗体和浏览器的应用软件并没有提供撤销操作。
如果需要为软件提供撤销功能，备忘录模式无疑是一种很好的解决方案。在一些字处理软件、图像编辑软件、数据库管理系统等软件中备忘录模式都得到了很好的应用。
为了符合迪米特原则，还要增加一个管理备忘录的类(`CareTaker`)，为了节约内存，可使用原型模式和备忘录模式。

优点：
- 给用户提供了一种可以恢复状态的机制，可以使用户能够比较方便地回到某个历史的状态。
- 实现了信息的封装，使得用户不需要关心状态的保存细节。

缺点：
- 消耗资源。如果类的成员变量过多，势必会占用比较大的资源，而且每一次保存都会消耗一定的内存。每保存一次对象的状态都需要消耗一定的系统资源。

使用场景：
- 很多时候我们总是需要记录一个对象的内部状态，这样做的目的就是为了允许用户取消不确定或者错误的操作，能够恢复到他原先的状态，使得他有"后悔药"可吃。
- 需要保存/恢复数据的相关状态场景。
- 提供一个可回滚的操作。

### 观察者模式
观察者模式，定义对象之间的一种一对多依赖关系，使得每当一个对象状态发生改变时，其相关依赖对象皆得到通知并被自动更新。
观察者模式的别名包括发布-订阅模式、模型-视图模式、源-监听器模式或从属者模式。观察者模式是一种对象行为型模式。

观察者模式描述了如何建立对象与对象之间的依赖关系，以及如何构造满足这种需求的系统。
观察者模式包含观察目标和观察者两类对象，一个目标可以有任意数目的与之相依赖的观察者，一旦观察目标的状态发生改变，所有的观察者都将得到通知。
作为对这个通知的响应，每个观察者都将监视观察目标的状态以使其状态与目标状态同步，这种交互也称为发布-订阅(Publish-Subscribe)。观察目标是通知的发布者，它发出通知时并不需要知道谁是它的观察者，可以有任意数目的观察者订阅它并接收通知。
```java
public class MainTest {
    public static void main(String[] args) {
        WeatherData weatherData = new WeatherData();
        CurrentCondition currentCondition = new CurrentCondition();
        BaiduSite baiduSite = new BaiduSite();

        // 注册观察者
        weatherData.registerObserver(currentCondition);
        weatherData.registerObserver(baiduSite);
        // 设置数据 一旦数据变化 所有的观察者都会变化
        weatherData.setWeatherData(10f, 20f);

        // 移除注册观察者
        weatherData.removeObserver(baiduSite);
        
        // 唤醒所有已经注册的观察者
        weatherData.notifyObservers();
    }
}

interface Subject {

    void registerObserver(Observer observer);

    void removeObserver(Observer observer);

    void notifyObservers();
}

/**
 * 观察者
 */
interface Observer {

    void update(float  temperature, float humidity);
}

class WeatherData implements Subject{

    private ArrayList<Observer> observers = new ArrayList<>();

    private float temperature;

    private float humidity;

    public void setWeatherData(float humidity, float temperature) {
        this.humidity = humidity;
        this.temperature = temperature;
    }


    @Override
    public void registerObserver(Observer observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(Observer observer) {
        if (observers.contains(observer)) {
            observers.remove(observer);
        }
    }

    @Override
    public void notifyObservers() {
        // 唤醒所有的观察者
        for (Observer observer : observers) {
            observer.update(temperature,humidity);
        }
    }
}

class CurrentCondition implements Observer{

    private float temperature;
    private float humidity;

    @Override
    public void update(float temperature, float humidity) {
        this.temperature = temperature;
        this.humidity = humidity;
        displayed();
    }

    void displayed() {
        System.out.println("===当前天气情况===");
        System.out.println("当前湿度：" + this.temperature);
        System.out.println("当前温度：" + this.humidity);
    }
}

class BaiduSite implements Observer{

    private float temperature;
    private float humidity;

    @Override
    public void update(float temperature, float humidity) {
        this.temperature = temperature;
        this.humidity = humidity;
        displayed();
    }

    void displayed() {
        System.out.println("===当前百度网站天气情况===");
        System.out.println("当前湿度：" + this.temperature);
        System.out.println("当前温度：" + this.humidity);
    }
}
```
观察者模式是一种使用频率非常高的设计模式，无论是移动应用、Web应用或者桌面应用，观察者模式几乎无处不在，它为实现对象之间的联动提供了一套完整的解决方案，凡是涉及到一对一或者一对多的对象交互场景都可以使用观察者模式。
观察者模式广泛应用于各种编程语言的GUI事件处理的实现，在基于事件的XML解析技术（如SAX2）以及Web事件处理中也都使用了观察者模式。

优点：
- 观察者和被观察者是抽象耦合的。观察目标只需要维持一个抽象观察者的集合，无须了解其具体观察者。由于观察目标和观察者没有紧密地耦合在一起，因此它们可以属于不同的抽象化层次。
- 观察者模式满足“开闭原则”的要求，增加新的具体观察者无须修改原有系统代码，在具体观察者与观察目标之间不存在关联关系的情况下，增加新的观察目标也很方便。
- 观察者模式可以实现表示层和数据逻辑层的分离，定义了稳定的消息更新传递机制，并抽象了更新接口，使得可以有各种各样不同的表示层充当具体观察者角色。

缺点：
- 如果一个被观察者对象有很多的直接和间接的观察者的话，将所有的观察者都通知到会花费很多时间。
- 如果在观察者和观察目标之间有循环依赖的话，观察目标会触发它们之间进行循环调用，可能导致系统崩溃。
- 观察者模式没有相应的机制让观察者知道所观察的目标对象是怎么发生变化的，而仅仅只是知道观察目标发生了变化。

使用场景：
- 一个对象状态改变给其他对象通知的问题，而且要考虑到易用和低耦合，保证高度的协作。一个对象（目标对象）的状态发生改变，所有的依赖对象（观察者对象）都将得到通知，进行广播通知。
- 一个抽象模型有两个方面，其中一个方面依赖于另一个方面。将这些方面封装在独立的对象中使它们可以各自独立地改变和复用。
- 一个对象的改变将导致其他一个或多个对象也发生改变，而不知道具体有多少对象将发生改变，可以降低对象之间的耦合度。
- 一个对象必须通知其他对象，而并不知道这些对象是谁。
- 需要在系统中创建一个触发链，A对象的行为将影响B对象，B对象的行为将影响C对象……，可以使用观察者模式创建一种链式触发机制。

注意事项：
- Java中已经有了对观察者模式的支持类。 
- 避免循环引用。 
- 如果顺序执行，某一观察者错误会导致系统卡壳，一般采用异步方式。

### 状态模式
状态模式，允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。其别名为状态对象，状态模式是一种对象行为型模式。
状态模式用于解决系统中复杂对象的状态转换以及不同状态下行为的封装问题。当系统中某个对象存在多个状态，这些状态之间可以进行转换，而且对象在不同状态下行为不相同时可以使用状态模式。
状态模式将一个对象的状态从该对象中分离出来，封装到专门的状态类中，使得对象状态可以灵活变化，对于客户端而言，无须关心对象状态的转换以及对象所处的当前状态，无论对于何种状态的对象，客户端都可以一致处理。
```java
public class MainTest {
    public static void main(String[] args) {
        // 创建活动对象，奖品有 1 个奖品
        RaffleActivity activity = new RaffleActivity(1);

        // 我们连续抽 300 次奖
        for (int i = 0; i < 30; i++) {
            System.out.println("--------第" + (i + 1) + "次抽奖----------");
            // 参加抽奖，第一步点击扣除积分
            activity.debuctMoney();

            // 第二步抽奖
            activity.raffle();
        }
    }
}


abstract class State {


    // 扣除积分 - 50
    public abstract void deductMoney();

    // 是否抽中奖品
    public abstract boolean raffle();

    // 发放奖品
    public abstract void dispensePrize();
}


class RaffleActivity {

    // state 表示活动当前的状态，是变化
    State state = null;

    // 奖品数量
    int count = 0;

    // 四个属性，表示四种状态
    State noRafflleState = new NoRaffleState(this);
    State canRaffleState = new CanRaffleState(this);

    State dispenseState = new DispenseState(this);
    State dispensOutState = new DispenseOutState(this);

    //构造器
    //1. 初始化当前的状态为 noRafflleState（即不能抽奖的状态）
    //2. 初始化奖品的数量
    public RaffleActivity(int count) {
        this.state = getNoRafflleState();
        this.count = count;
    }

    //扣分, 调用当前状态的 deductMoney
    public void debuctMoney() {
        state.deductMoney();
    }

    //抽奖
    public void raffle() {
        // 如果当前的状态是抽奖成功
        if (state.raffle()) {
            //领取奖品
            state.dispensePrize();
        }


    }


    public State getState() {
        return state;
    }


    public void setState(State state) {
        this.state = state;
    }

    //这里请大家注意，每领取一次奖品，count--
    public int getCount() {
        int curCount = count;
        count--;
        return curCount;
    }


    public void setCount(int count) {
        this.count = count;
    }

    public State getNoRafflleState() {
        return noRafflleState;
    }


    public void setNoRafflleState(State noRafflleState) {
        this.noRafflleState = noRafflleState;
    }


    public State getCanRaffleState() {
        return canRaffleState;
    }


    public void setCanRaffleState(State canRaffleState) {
        this.canRaffleState = canRaffleState;
    }


    public State getDispenseState() {
        return dispenseState;
    }


    public void setDispenseState(State dispenseState) {
        this.dispenseState = dispenseState;
    }

    public State getDispensOutState() {
        return dispensOutState;

    }


    public void setDispensOutState(State dispensOutState) {
        this.dispensOutState = dispensOutState;
    }
}


class DispenseOutState extends State {

    // 初始化时传入活动引用
    RaffleActivity activity;


    public DispenseOutState(RaffleActivity activity) {
        this.activity = activity;
    }

    @Override
    public void deductMoney() {
        System.out.println("奖品发送完了，请下次再参加");
    }


    @Override
    public boolean raffle() {
        System.out.println("奖品发送完了，请下次再参加");
        return false;
    }


    @Override
    public void dispensePrize() {
        System.out.println("奖品发送完了，请下次再参加");
    }
}

class DispenseState extends State {

    // 初始化时传入活动引用，发放奖品后改变其状态
    RaffleActivity activity;


    public DispenseState(RaffleActivity activity) {
        this.activity = activity;
    }


    @Override
    public void deductMoney() {
        System.out.println("不能扣除积分");
    }


    @Override
    public boolean raffle() {
        System.out.println("不能抽奖");
        return false;
    }

    //发放奖品
    @Override
    public void dispensePrize() {
        if (activity.getCount() > 0) {
            System.out.println("恭喜中奖了");
            // 改变状态为不能抽奖
            activity.setState(activity.getNoRafflleState());
        } else {
            System.out.println("很遗憾，奖品发送完了");
            // 改变状态为奖品发送完毕, 后面我们就不可以抽奖
            activity.setState(activity.getDispensOutState());
            //System.out.println("抽奖活动结束");
            //System.exit(0);
        }

    }
}

class NoRaffleState extends State {

    // 初始化时传入活动引用，扣除积分后改变其状态
    RaffleActivity activity;


    public NoRaffleState(RaffleActivity activity) {
        this.activity = activity;
    }

    // 当前状态可以扣积分 , 扣除后，将状态设置成可以抽奖状态
    @Override
    public void deductMoney() {
        System.out.println("扣除 50 积分成功，您可以抽奖了");
        activity.setState(activity.getCanRaffleState());
    }

    // 当前状态不能抽奖
    @Override
    public boolean raffle() {
        System.out.println("扣了积分才能抽奖喔！");
        return false;
    }

    // 当前状态不能发奖品
    @Override
    public void dispensePrize() {
        System.out.println("不能发放奖品");
    }
}


class CanRaffleState extends State {

    RaffleActivity activity;

    public CanRaffleState(RaffleActivity activity) {
        this.activity = activity;
    }

    @Override
    public void deductMoney() {
        System.out.println("已经扣取过了积分");
    }

    //可以抽奖, 抽完奖后，根据实际情况，改成新的状态
    @Override
    public boolean raffle() {
        System.out.println("正在抽奖，请稍等！");
        Random r = new Random();
        int num = r.nextInt(10);
        // 10%中奖机会
        if (num == 0) {
            // 改变活动状态为发放奖品
            activity.setState(activity.getDispenseState());
            return true;
        } else {
            System.out.println("很遗憾没有抽中奖品！");
            // 改变状态为不能抽奖
            activity.setState(activity.getNoRafflleState());
            return false;
        }
    }

    // 不能发放奖品
    @Override
    public void dispensePrize() {
        System.out.println("没中奖，不能发放奖品");
    }
}
```
状态模式将一个对象在不同状态下的不同行为封装在一个个状态类中，通过设置不同的状态对象可以让环境对象拥有不同的行为，而状态转换的细节对于客户端而言是透明的，方便了客户端的使用。
在实际开发中，状态模式具有较高的使用频率，在工作流和游戏开发中状态模式都得到了广泛的应用，例如公文状态的转换、游戏中角色的升级等。

优点：
- 封装了状态的转换规则，在状态模式中可以将状态的转换代码封装在环境类或者具体状态类中，可以对状态转换代码进行集中管理，而不是分散在一个个业务方法中。
- 将所有与某个状态有关的行为放到一个类中，只需要注入一个不同的状态对象即可使环境对象拥有不同的行为。
- 可以让多个环境对象共享一个状态对象，从而减少系统中对象的个数。
- 允许状态转换逻辑与状态对象合成一体，而不是提供一个巨大的条件语句块，状态模式可以让我们避免使用庞大的条件语句来将业务方法和状态转换代码交织在一起。

缺点：
- 状态模式的使用必然会增加系统类和对象的个数。
- 状态模式的结构与实现都较为复杂，如果使用不当将导致程序结构和代码的混乱。
- 状态模式对“开闭原则”的支持并不太好，增加新的状态类需要修改那些负责状态转换的源代码，否则无法转换到新增状态；而且修改某个状态类的行为也需修改对应类的源代码。

使用场景：
- 状态模式主要解决对象的行为依赖于它的状态（属性），并且可以根据它的状态改变而改变它的相关行为。
在代码中包含大量与对象状态有关的条件语句时应该考虑使用状态模式。应当注意的是，在行为受状态约束的时候使用状态模式，状态应该不超过5个，太多则导致程序结构、代码混乱。
- 行为随状态改变而改变的场景。
- 条件、分支语句的代替者。

### 策略模式
策略模式，定义一系列算法类，将每一个算法封装起来，并让它们可以相互替换，策略模式让算法独立于使用它的客户而变化，也称为政策模式。策略模式是一种对象行为型模式。
策略模式的主要目的是将算法的定义与使用分开，也就是将算法的行为和环境分开，将算法的定义放在专门的策略类中，每一个策略类封装了一种实现算法，使用算法的环境类针对抽象策略类进行编程，符合“依赖倒转原则”。
在出现新的算法时，只需要增加一个新的实现了抽象策略类的具体策略类即可。
```java
public class MainTest {
    public static void main(String[] args) {
        Bird bird = new Bird();
        bird.fly();

        Duck duck = new Duck();
        duck.fly();

        Dog dog = new Dog();
        dog.fly();

        System.out.println("变为会飞 ：");
        dog.setFlyStrategy(new GoodFlyStrategy());
        dog.fly();
    }
}

abstract class AbstractStrategy {

    protected FlyStrategy flyStrategy;

    public void setFlyStrategy(FlyStrategy flyStrategy) {
        this.flyStrategy = flyStrategy;
    }

    public abstract void fly();

}

class Bird  extends AbstractStrategy{

    public Bird() {
        System.out.print("小鸟");
        flyStrategy = new GoodFlyStrategy();
    }

    @Override
    public void fly() {
        flyStrategy.fly();
    }
}

class Duck extends AbstractStrategy {

    public Duck() {
        System.out.print("鸭子");
        flyStrategy = new BadFlyStrategy();
    }

    @Override
    public void fly() {
        flyStrategy.fly();
    }
}

class Dog extends AbstractStrategy {

    public Dog() {
        System.out.print("狗");
        flyStrategy = new NoFlyStrategy();
    }

    @Override
    public void fly() {
        flyStrategy.fly();
    }
}



interface FlyStrategy {

    void fly();
}

class GoodFlyStrategy implements FlyStrategy {

    @Override
    public void fly() {
        System.out.println("擅长飞翔 ...");
    }
}

class BadFlyStrategy implements FlyStrategy {

    @Override
    public void fly() {
        System.out.println("不擅长飞翔 ...");
    }
}

class NoFlyStrategy implements FlyStrategy {
    @Override
    public void fly() {
        System.out.println("不会飞 ...");
    }
}
```
策略模式用于算法的自由切换和扩展，它是应用较为广泛的设计模式之一。策略模式对应于解决某一问题的一个算法族，允许用户从该算法族中任选一个算法来解决某一问题，同时可以方便地更换算法或者增加新的算法。
只要涉及到算法的封装、复用和切换都可以考虑使用策略模式。如果一个系统的策略多于四个，就需要考虑使用混合模式，解决策略类膨胀的问题。

优点：
- 策略模式提供了对“开闭原则”的完美支持，用户可以在不修改原有系统的基础上选择算法或行为，也可以灵活地增加新的算法或行为。
- 策略模式提供了管理相关的算法族的办法。策略类的等级结构定义了一个算法或行为族，恰当使用继承可以把公共的代码移到抽象策略类中，从而避免重复的代码。
- 策略模式提供了一种算法的复用机制，由于将算法单独提取出来封装在策略类中，因此不同的环境类可以方便地复用这些策略类。

缺点：
- 客户端必须知道所有的策略类，并自行决定使用哪一个策略类。这就意味着客户端必须理解这些算法的区别，以便适时选择恰当的算法。
换言之，策略模式只适用于客户端知道所有的算法或行为的情况。
- 所有策略类都需要对外暴露。

使用场景：
- 一个系统有许多许多类，而区分它们的只是他们直接的行为，那么使用策略模式可以动态地让一个对象在许多行为中选择一种行为。
- 如果一个对象有很多的行为，如果不用恰当的模式，这些行为就只好使用多重的条件选择语句来实现。

### 模板方法模式
模板方法模式，定义一个操作中的算法骨架，而将算法的一些步骤延迟到子类中，使得子类可以不改变该算法结构的情况下重定义该算法的某些特定步骤。
模板方法模式是一种基于继承的代码复用技术，它是一种类行为型模式。
```java
public class MainTest {
    public static void main(String[] args) {
        System.out.println("=====红豆豆浆=====");
        RedBean redBean = new RedBean();
        redBean.template();

        System.out.println("=====花生豆浆=====");
        Peanut peanut = new Peanut();
        peanut.template();

        System.out.println("=====豆浆=====");
        None none = new None();
        none.template();
    }
}

abstract class SoyaMilk {

    final void template(){
        filterMaterial();
        soak();
        if (isAppended()) {
            add();
        }
        over();
    }

    void filterMaterial() {
        System.out.println("第一步：筛选材料");
    }

    void soak() {
        System.out.println("第二步：浸泡");
    }

    abstract void add();

    void over(){
        System.out.println("第四步：打豆浆");
    }

    /**
     * 钩子方法
     * @return
     */
    boolean isAppended(){
        return true;
    }

}

class Peanut extends SoyaMilk{


    @Override
    void add() {
        System.out.println("第三步：加入花生");
    }
}

class RedBean extends SoyaMilk {


    @Override
    void add() {
        System.out.println("第三步：加入红豆");
    }
}

class None extends SoyaMilk {

    @Override
    void add() {

    }

    @Override
    boolean isAppended() {
        return false;
    }

}
```
模板方法模式是基于继承的代码复用技术，它体现了面向对象的诸多重要思想，是一种使用较为频繁的模式。
模板方法模式广泛应用于框架设计中，以确保通过父类来控制处理流程的逻辑顺序（如框架的初始化，测试流程的设置等）。

优点：
- 它封装了不变部分，扩展可变部分。它把认为是不变部分的算法封装到父类中实现，而把可变部分算法由子类继承实现，便于子类继续扩展。
- 它在父类中提取了公共的部分代码，便于代码复用。
- 部分方法是由子类实现的，因此子类可以通过扩展方式增加相应的功能，符合开闭原则。

缺点：
- 需要为每一个基本方法的不同实现提供一个子类，如果父类中可变的基本方法太多，将会导致类的个数增加，系统更加庞大，设计也更加抽象，间接地增加了系统实现的复杂度。此时，可结合桥接模式来进行设计。
- 由于继承关系自身的缺点，如果父类添加新的抽象方法，则所有子类都要改一遍。

使用场景：
- 算法的整体步骤很固定，但其中个别部分易变时，这时候可以使用模板方法模式，将容易变的部分抽象出来，供子类实现。
- 当多个子类存在公共的行为时，可以将其提取出来并集中到一个公共父类中以避免代码重复。首先，要识别现有代码中的不同之处，并且将不同之处分离为新的操作。最后，用一个调用这些新的操作的模板方法来替换这些不同的代码。
- 当需要控制子类的扩展时，模板方法只在特定点调用钩子操作，这样就只允许在这些点进行扩展。

### 访问者模式
访问者模式，提供一个作用于某对象结构中的各元素的操作表示，它使我们可以在不改变各元素的类的前提下定义作用于这些元素的新操作。访问者模式是一种对象行为型模式。
```java
public class MainTest {
    public static void main(String[] args) {
        ObjectStructure objectStructure = new ObjectStructure();
        objectStructure.attach(new Man());
        objectStructure.attach(new WoMan());
        objectStructure.attach(new Man());
        objectStructure.attach(new WoMan());

        // 显示成功的评价
        Success success = new Success();
        objectStructure.display(success);

        System.out.println("==================");

        // 显示失败的评价
        Fail fail = new Fail();
        objectStructure.display(fail);
    }
}

abstract class Action {

    protected abstract void getManResult(Man man);

    protected abstract void getWomanResult(WoMan woman );

}

class Success  extends Action{

    @Override
    protected void getManResult(Man man) {
        System.out.println("男人觉得很赞～");
    }

    @Override
    protected void getWomanResult(WoMan woman) {
        System.out.println("女人觉得很赞～");
    }
}

class Fail  extends Action{

    @Override
    protected void getManResult(Man man) {
        System.out.println("男人觉得很失败～");
    }

    @Override
    protected void getWomanResult(WoMan woman) {
        System.out.println("女人觉得很失败～");
    }
}


abstract class  Person {
    abstract void accpet(Action action);
}

class WoMan extends Person{

    @Override
    void accpet(Action action) {
         action.getWomanResult(this);
    }
}

class Man  extends Person{

    @Override
    void accpet(Action action) {
        action.getManResult(this);
    }
}

class ObjectStructure {

    ArrayList<Person> people =  new ArrayList<>();

    public void attach(Person person) {
        people.add(person);
    }

    public void detach(Person person) {
        people.remove(person);
    }

    public void display(Action acion) {
        people.forEach(item -> {
            item.accpet(acion);
        });
    }

}
```
由于访问者模式的使用条件较为苛刻，本身结构也较为复杂，因此在实际应用中使用频率不是特别高。
当系统中存在一个较为复杂的对象结构，且不同访问者对其所采取的操作也不相同时，可以考虑使用访问者模式进行设计。
在XML文档解析、编译器的设计、复杂集合对象的处理等领域访问者模式得到了一定的应用。

优点：
- 扩展性好。增加新的访问操作很方便。使用访问者模式，增加新的访问操作就意味着增加一个新的具体访问者类，实现简单，无须修改源代码，符合“开闭原则”。
- 复用性好。可以通过访问者来定义整个对象结构通用的功能，从而提高系统的复用程度。
- 灵活性好。访问者模式将数据结构与作用于结构上的操作解耦，使得操作集合可相对自由地演化而不影响系统的数据结构。
- 符合单一职责原则单一职责原则。访问者模式把相关的行为封装在一起，构成一个访问者，使每一个访问者的功能都比较单一。

缺点：
- 破坏封装。访问者模式中具体元素对访问者公布细节，这破坏了对象的封装性。具体元素对访问者公布细节，违反了迪米特法则。
- 违反了依赖倒置原则依赖倒置原则。访问者模式依赖了具体类，而没有依赖抽象类。

使用场景：
- 需要对一个对象结构中的对象进行很多不同的并且不相关的操作，而需要避免让这些操作"污染"这些对象的类，使用访问者模式将这些封装到类中。访问者可以对功能进行统一，可以做报表、UI、拦截器与过滤器。
- 对象结构中对象对应的类很少改变，但经常需要在此对象结构上定义新的操作。
- 需要对一个对象结构中的对象进行很多不同的并且不相关的操作，而需要避免让这些操作"污染"这些对象的类，也不希望在增加新操作时修改这些类。
