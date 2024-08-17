---
title: "Java枚举"
date: 2024-07-19
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-enum"
---


## 概述
枚举在Java中是一种特殊的类，用来定义一组固定的常量。它在Java5中引入，提供了一种类型安全的方式来定义和使用常量集合。尽管`enum`看起来像是新的数据类型，但它实际上是一个受限制的类，继承自`java.lang.Enum`。
在编译时，编译器生成的类包含了所有定义的常量，并提供了内置的方法，如`values()`和`valueOf()`，用来获取所有枚举常量或根据名称返回特定常量。枚举的引入不仅增强了代码的可读性，还提供了更强大的功能和灵活性。

Java枚举不仅可以定义常量，还可以实现接口，提供额外的行为和功能。这种设计允许在枚举中定义特定的行为，从而提高代码的重用性和适用性。
枚举的构造函数是私有的，这保证了枚举常量在JVM中只有唯一的实例，防止了创建重复实例的问题。这样的单例机制使得枚举在表示固定的一组常量时，提供了一种既安全又高效的方式。

## 使用枚举
定义枚举时，可以声明一个`enum`类型，并在其中列出所有的常量，常量通常用大写字母表示。
```java
public enum Color {
    RED, GREEN, BLUE;
}
```
如果枚举中没有定义方法，也可以在最后一个实例后面加逗号、分号或什么都不加，下面这三种定义方式是等价的。
```java
enum Color { RED, GREEN, BLUE }
enum Color { RED, GREEN, BLUE, }
enum Color { RED, GREEN, BLUE; }
```
枚举中常用的方法是`values()`和`valueOf()`方法。`values()`方法返回所有枚举常量的数组。
```java
public static void main(String[] args) {
    for (DayOfWeek day : DayOfWeek.values()) {
        System.out.println(day + ": " + day.getDescription());
    }
}
```
`valueOf()`方法根据名称获取对应的枚举常量。
```java
public static void main(String[] args) {
    Color color = Color.valueOf("RED");
    System.out.println("Color selected: " + color);
}
```
如果要为`enum`定义方法，那么必须在`enum`的最后一个实例尾部添加一个分号。此外在`enum`中，必须先定义实例，不能将字段或方法定义在实例前面。否则编译器会报错。
枚举可以包含普通的方法，用于实现枚举常量的行为或操作。这些方法可以在枚举的任何地方定义，并且可以被枚举实例调用。
```java
public enum DayOfWeek {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;

    // 普通方法
    public boolean isWeekend() {
        return this == SATURDAY || this == SUNDAY;
    }
}
```
枚举可以包含静态方法，这些方法不依赖于特定的枚举实例，而是属于枚举类本身。静态方法可以用于执行与枚举相关的操作，但不直接涉及枚举实例的数据。
```java
public enum Shape {
    CIRCLE, SQUARE, TRIANGLE;

    // 静态方法
    public static Shape getDefaultShape() {
        return CIRCLE;
    }
}
```
枚举可以定义抽象方法，这些方法必须在每个枚举常量中实现。抽象方法通常用于要求每个枚举常量提供特定的行为或实现。
```java
public enum Animal {
    DOG {
        @Override
        public String makeSound() {
            return "Woof";
        }
    },
    CAT {
        @Override
        public String makeSound() {
            return "Meow";
        }
    };

    // 抽象方法
    public abstract String makeSound();
}
```
枚举可以定义构造方法，用于初始化枚举常量的属性。构造方法在枚举常量创建时调用，并且只能是`private`或`protected`。
```java
public enum Color {
    RED("#FF0000"), GREEN("#00FF00"), BLUE("#0000FF");

    private final String hexCode;

    // 构造方法
    private Color(String hexCode) {
        this.hexCode = hexCode;
    }

    // 普通方法
    public String getHexCode() {
        return hexCode;
    }
}
```
枚举虽然不能继承，但是可以实现接口，从而增加更多的功能。
通常用来定义枚举类型的异常错误码，这种设计使得不同的枚举可以实现相同的接口，从而保持了错误码管理的一致性。
```java
// 定义一个接口，用于获取错误码的描述信息
public interface ErrorCode {
    String getDescription();
    int getCode();
}
```
```java
// 实现接口的第一个枚举类，用于定义与用户相关的错误码
public enum UserErrorCode implements ErrorCode {
    USER_NOT_FOUND(1001, "The specified user was not found."),
    INVALID_USER_INPUT(1002, "The input provided for the user is invalid."),
    USER_ALREADY_EXISTS(1003, "A user with the same details already exists."),
    USER_ACCESS_DENIED(1004, "Access to the user resource is denied.");

    private final int code;
    private final String description;

    // 构造函数，用于初始化每个错误码的代码和描述
    UserErrorCode(int code, String description) {
        this.code = code;
        this.description = description;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public int getCode() {
        return code;
    }
}
```
```java
// 实现接口的第二个枚举类，用于定义与订单相关的错误码
public enum OrderErrorCode implements ErrorCode {
    ORDER_NOT_FOUND(2001, "The specified order was not found."),
    INVALID_ORDER_INPUT(2002, "The input provided for the order is invalid."),
    ORDER_ALREADY_PROCESSED(2003, "The order has already been processed."),
    ORDER_ACCESS_DENIED(2004, "Access to the order resource is denied.");

    private final int code;
    private final String description;

    // 构造函数，用于初始化每个错误码的代码和描述
    OrderErrorCode(int code, String description) {
        this.code = code;
        this.description = description;
    }

    @Override
    public String getDescription() {
        return description;
    }

    @Override
    public int getCode() {
        return code;
    }
}
```

## 枚举的实现
枚举是一种特殊的类，尽管`enum`关键字看起来像是一种新的数据类型，但实际上`enum`是一种受限制的类，并且具有自己的方法。
在Java中定义枚举时，例如：
```java
public enum Color {
    RED, GREEN, BLUE;
}
```
编译器会生成一个与`Color`枚举对应的类文件，这个类会继承自`java.lang.Enum`，该类的内部实现大致如下：
```java
public final class Color extends Enum<Color> {
    // 枚举常量
    public static final Color RED = new Color("RED", 0);
    public static final Color GREEN = new Color("GREEN", 1);
    public static final Color BLUE = new Color("BLUE", 2);

    // 存储所有枚举常量的静态数组
    private static final Color[] $VALUES = { RED, GREEN, BLUE };

    // 返回所有枚举常量的数组副本
    public static Color[] values() {
        return (Color[]) $VALUES.clone();
    }

    // 根据名称返回指定的枚举常量
    public static Color valueOf(String name) {
        return Enum.valueOf(Color.class, name);
    }

    // 私有构造函数，用于初始化枚举常量
    private Color(String name, int ordinal) {
        super(name, ordinal);
    }
}
```
`Enum`是Java提供的一个抽象类，它定义了枚举的基本行为。由于所有的枚举类型都继承自`Enum`，它们会自动获得`Enum`类中的一些方法，如`name()`、`ordinal()`、`values()`、和`valueOf()`。
```java
public abstract class Enum<E extends Enum<E>> implements Comparable<E>, Serializable {
    private static final long serialVersionUID = -8094561000788783564L;
    private final String name;
    private final int ordinal;
    
    // ...

    // Constructor
    protected Enum(String name, int ordinal) {
        this.name = name;
        this.ordinal = ordinal;
    }

    // Returns the name of the enum constant, exactly as declared in its enum declaration
    public final String name() {
        return name;
    }

    // Returns the ordinal of the enum constant (its position in the enum declaration)
    public final int ordinal() {
        return ordinal;
    }

    // Returns an array containing all of the values of the enum type, in the order they are declared
    public static <T extends Enum<T>> T[] values(Class<T> enumType) {
        return enumType.getEnumConstants();
    }

    // Returns the enum constant of the specified enum type with the specified name
    public static <T extends Enum<T>> T valueOf(Class<T> enumType, String name) {
        try {
            return Enum.valueOf(enumType, name);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("No enum constant " + enumType.getCanonicalName() + "." + name);
        }
    }

    @Override
    public int compareTo(E o) {
        return this.ordinal - o.ordinal();
    }
    
    // ...
}
```
因为`Enum`类实现了`Comparable`接口，这使得所有枚举常量可以进行比较。
`compareTo`方法的实现基于枚举常量的序数。序数是枚举常量在枚举声明中的位置，从0开始计数。
比较时，`compareTo`方法会根据两个枚举常量的序数进行比较，序数小的枚举常量被认为是“较小”的。
```java
public enum DayOfWeek {
    // 在这个枚举中，MONDAY 的序数是 0，TUESDAY 的序数是 1，以此类推。
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
}

DayOfWeek day1 = DayOfWeek.MONDAY;
DayOfWeek day2 = DayOfWeek.FRIDAY;

int comparison = day1.compareTo(day2); // 返回 -4，因为 MONDAY 的序数 (0) 小于 FRIDAY 的序数 (4)
```

除了`Comparable`接口外，`Enum`类还实现了`Serializable`接口，所以枚举常量可以被序列化和反序列化。
在序列化过程中，枚举常量的状态被转换为字节流。由于枚举常量是常量，序列化的过程仅涉及枚举常量的名称。
枚举常量是唯一的，不会重复创建。序列化和反序列化过程会保持这一特性。在反序列化时，Java会根据常量的名称从已加载的枚举类型中获取常量实例，而不是创建新的实例。
```java
public enum Status implements Serializable {
    ACTIVE, INACTIVE, SUSPENDED;
    private static final long serialVersionUID = 1L;
}

public class EnumSerializationExample {
    public static void main(String[] args) {
        // 序列化枚举常量
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("status.ser"))) {
            oos.writeObject(Status.ACTIVE);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 反序列化枚举常量
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("status.ser"))) {
            Status status = (Status) ois.readObject();
            System.out.println("Deserialized Status: " + status);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

枚举常量在类加载时被创建，它们是`public static final`的，这意味着这些常量在内存中只存在一个实例。例如`RED`、`GREEN`和`BLUE`是`Color`类的静态常量，每个常量都是`Color`类的唯一实例。
```java
public static final Color RED = new Color("RED", 0);
public static final Color GREEN = new Color("GREEN", 1);
public static final Color BLUE = new Color("BLUE", 2);
```
编译器为每个枚举类生成一个静态数组`$VALUES`，用来存储所有的枚举常量。`values()`方法返回这个数组的克隆，允许遍历所有枚举常量。
```java
// 返回所有枚举常量的数组副本
public static Color[] values() {
    return (Color[]) $VALUES.clone();
}
```
`Enum`类的构造函数是`protected`的，这个构造函数用于初始化枚举常量的名称和序数。由于构造函数是`protected`的，枚举常量只能在枚举类型内部被创建，这代表外部类无法直接实例化枚举，保证了枚举常量的唯一性。
```java
protected Enum(String name, int ordinal) {
    this.name = name;
    this.ordinal = ordinal;
}
```
而且枚举类是被`final`修饰的，意味着不能被其他类继承，这也跟`Enum`类的构造函数是`protected`作用符合，保证了枚举常量的唯一性和一致性。
```java
public final class Color extends Enum<Color> {}
```
除了不能继承，基本上可以将枚举看做一个常规的类。

反编译后的枚举类中的字段都是被`static`修饰的，被`static`修饰的属性在类加载时被创建和初始化，确保了它们在类加载完成之前不会被访问，从而避免了并发修改的问题。
同时枚举常量的状态是不可变的，字段通常定义为`final`，确保一旦初始化后不再改变，所以Java枚举类是线程安全的。

## 枚举的性能
枚举不仅提供了类型安全的常量，还在性能方面表现出色。

枚举常量在类加载时被创建，它们是`public static final`的，这意味着这些常量在内存中只存在一个实例。例如`RED`、`GREEN`和`BLUE`是`Color`类的静态常量，每个常量都是`Color`类的唯一实例。
JVM在启动时创建`Color`枚举的`RED`、`GREEN`和`BLUE`实例，并将它们存储在内存中。由于这些常量是静态的并且共享内存，这样做可以避免重复创建对象，从而节省内存。
```java
public static final Color RED = new Color("RED", 0);
public static final Color GREEN = new Color("GREEN", 1);
public static final Color BLUE = new Color("BLUE", 2);
```
由于枚举常量是静态的，在访问这些常量时，实际上是在访问类的静态字段。这种访问方式避免了对象的动态创建和内存分配，所以非常快速。
枚举的常量数量是固定的，所以内存消耗可以预测和优化。
所有的枚举实例是在类加载时由JVM初始化的，因此它们是全局唯一的。每个枚举常量的实例在JVM中只有一个，不会有多个实例被创建，从而避免了额外的内存分配开销。
这种设计确保了枚举常量的唯一性和线程安全性。所以可以利用枚举这种特性来实现单例模式，枚举类型在Java是线程安全，而且避免了反序列化创建多个对象问题。
```java
public enum Singleton {
    INSTANCE;

    // 可以定义其他方法和字段
    public void doSomething() {
        System.out.println("Doing something...");
    }
}
```
除了这些，Java提供了专门针对枚举优化的数据结构，如`EnumSet`和`EnumMap`。这些集合类利用枚举的固定性，内部使用位向量或数组来存储元素，从而提高了操作性能。

## 枚举与常量
枚举和常量都是在Java中表示固定值的方式。

常量通常用`static final`变量定义，用于表示一个固定的值。通常是基本数据类型或字符串，它们不能有方法或字段，主要用于存储单一的、固定的值。
所以常量适用于需要存储固定值的简单场景，比如定义配置参数或错误码。常量主要用于那些不需要附加逻辑和行为的场合。
```java
public class ErrorCodes {
    public static final int NOT_FOUND = 404;
    public static final int INTERNAL_ERROR = 500;
}
```
枚举是用`enum`关键字定义的一种特殊类型的类，用于定义一组固定的常量。它们不仅能有常量，还可以有字段、方法和构造函数。
所以枚举适用于需要表示一组相关常量并且需要附加功能的场景，比如定义状态、类别或类型。
```java
public enum ErrorCode {
    NOT_FOUND(404, "Not Found"),
    INTERNAL_ERROR(500, "Internal Server Error");

    private final int code;
    private final String message;

    ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    public int getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
```

| 特性    | 常量                                          | 枚举                                          |
|-------|---------------------------------------------------------|------------------------------------------------------|
| 定义和结构 | 用 `static final` 变量定义，表示单一的固定值。             | 用 `enum` 关键字定义，表示一组相关的固定常量。            |
| 类型安全 | 不提供类型安全，基本数据类型或对象类型的常量。              | 提供类型安全，编译器检查枚举值的合法性。                  |
| 功能扩展 | 无法扩展或拥有行为，只是简单的固定值。                       | 可以有字段、方法和构造函数，支持附加功能和行为。            |
| 适用场景 | 存储简单的固定值，如配置参数、错误码等。                      | 表示一组相关常量，需要附加功能或逻辑的场景，如状态、类别等。  |
| 创建和初始化 | 常量在类加载时被初始化，使用 `static final` 关键字定义。      | 枚举常量在类加载时由编译器创建和初始化，枚举类自身是 `final` 的。|
| 内存和性能 | 常量的内存使用较小，通常是基本数据类型或简单对象。            | 枚举类在内存中占用较多空间，因为每个枚举常量都是一个对象，并且可以有附加字段和方法。 |
| 代码可维护性 | 常量在值变化时需要手动更新，易出现错误。                      | 枚举提供了更清晰的结构，代码更易于维护和扩展，特别是在处理相关常量时。 |

## 枚举集合类
和其他类一样，枚举的实例也可以和标准Java集合库一起使用。然而，某些集合类型针对枚举做了优化，并且在大多数情况下推荐使用这些优化过后的集合代替通用的集合。
`EnumSet`和`EnumMap`是Java中针对枚举类型进行优化的集合类。它们提供了针对枚举的高效操作方式，分别用于处理枚举集合和枚举键值对。

`EnumSet` 是一个专门用于存储枚举类型的集合实现。它使用**位掩码**来存储枚举常量，因此在处理枚举集时提供了高效的操作。
>位掩码实现：`EnumSet` 使用一个长整型（long）的位掩码来表示集合中的元素。每个位代表一个枚举常量的存在与否。这种方式使得检查、添加和删除元素的操作非常快速，因为它们只涉及对位操作（如与、或、非操作），这些操作的时间复杂度为常数级别 O(1)。
- 高效性：`EnumSet`使用位向量来存储枚举值，提供快速的操作和内存效率。
- 只能存储枚举：`EnumSet`只能存储枚举类型的数据，不能存储其他类型。
- 排序：`EnumSet`按照枚举常量的声明顺序进行排序。
- 不支持`null`：`EnumSet`不允许包含 `null` 元素。
```java
public class EnumSetExample {
    public enum Day {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }

    public static void main(String[] args) {
        EnumSet<Day> weekend = EnumSet.of(Day.SATURDAY, Day.SUNDAY);
        System.out.println("Weekend days: " + weekend);
        
        // 添加更多枚举常量
        weekend.add(Day.FRIDAY);
        System.out.println("Extended weekend days: " + weekend);
    }
}
```
`EnumMap`是一个专门用于存储枚举键的映射实现。它提供了基于枚举的键的高效映射操作。
`EnumMap`使用一个数组来存储键值对，其中数组的索引与枚举常量的序数直接相关。由于枚举常量的序数是固定的，因此可以直接用作数组索引。这种方式使得`EnumMap`的查找和插入操作都能在常数时间内完成，时间复杂度为`O(1)`。
- 高效性：`EnumMap` 使用内部数组来存储键值对，提供快速的查找和更新操作。
- 只能使用枚举作为键：`EnumMap`只能使用枚举类型作为键。
- 排序：`EnumMap` 中的条目按枚举常量的声明顺序进行排序。
- 不支持`null`：`EnumMap`的键和值都不能为`null`。
```java
public class EnumMapExample {
    public enum Day {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }

    public static void main(String[] args) {
        EnumMap<Day, String> dayDescriptions = new EnumMap<>(Day.class);
        dayDescriptions.put(Day.MONDAY, "Start of the work week");
        dayDescriptions.put(Day.FRIDAY, "End of the work week");
        
        // 访问枚举键对应的值
        for (Map.Entry<Day, String> entry : dayDescriptions.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}
```

## 枚举与泛型
在Java中枚举不能使用泛型，因为枚举定义了一组固定的常量，这些常量在编译时确定，而泛型通常用于在运行时处理不同类型的数据。枚举类型的设计初衷是定义有限且固定的常量集，所以不适合与泛型结合。
再者枚举类继承自`java.lang.Enum`，并且`Enum`类的设计不支持泛型参数。Java的泛型系统主要用于类和接口的参数化，而枚举类型本身没有类似的扩展能力。

举个例子，你有一个盒子（枚举），里面只能放特定的玩具（固定的常量）。你在盒子里只能放这些预先定义好的玩具，这个盒子在制造时就已经决定了里面能放哪些玩具，不能在以后改变。
而泛型就像是一个可以放各种不同玩具的魔法箱。你可以在这个箱子里放任何类型的玩具，比如小汽车、积木、布娃娃等等。这个箱子是允许在运行时根据需要决定放什么类型的玩具的。
因为盒子（枚举）已经固定了要放的玩具，而魔法箱（泛型）是为了处理不同类型的玩具，所以它们不能直接结合使用。

尽管枚举本身不能使用泛型，但可以通过其他方式间接利用泛型来处理枚举类型。可以创建一个泛型类，其中泛型类型参数是一个枚举类型。
```java
// 定义一个泛型类，其中 T 是一个枚举类型
public class EnumProcessor<T extends Enum<T>> {
    private final Class<T> enumType;

    public EnumProcessor(Class<T> enumType) {
        this.enumType = enumType;
    }

    public void printAllValues() {
        for (T constant : enumType.getEnumConstants()) {
            System.out.println(constant);
        }
    }
}

// 使用示例
public enum Day {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
}

public class Main {
    public static void main(String[] args) {
        EnumProcessor<Day> dayProcessor = new EnumProcessor<>(Day.class);
        dayProcessor.printAllValues();
    }
}
```
也可以定义一个泛型方法，其中泛型类型参数是枚举类型。这样可以在方法中使用泛型来处理不同的枚举类型。
```java
public class EnumUtils {

    // 泛型方法，处理不同枚举类型
    public static <E extends Enum<E>> void printEnumValues(Class<E> enumClass) {
        for (E enumConstant : enumClass.getEnumConstants()) {
            System.out.println(enumConstant);
        }
    }
}

// 使用示例
public enum Color {
    RED, GREEN, BLUE;
}

public class Main {
    public static void main(String[] args) {
        // 打印 Color 枚举的所有常量
        EnumUtils.printEnumValues(Color.class);
    }
}
```

## 枚举与反射
反射不能用于创建枚举类型的对象。因为枚举类型是单例的，每个枚举常量在Java虚拟机中只有一个实例。通过反射创建新的枚举实例会破坏枚举类型的单例性质。
Java语言规范明确规定了枚举类型的创建和管理方式，禁止反射机制创建新的枚举实例，来确保枚举类型的安全性和一致性。
```java
enum Day {
    SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY;
}

public class EnumReflectionExample {
    public static void main(String[] args) {
        try {
            // 获取枚举类型的构造方法
            Constructor<Day> constructor = Day.class.getDeclaredConstructor(String.class, int.class);

            // 尝试通过反射调用构造方法
            constructor.setAccessible(true);
            Day newDay = constructor.newInstance("NEW_DAY", 7);

            System.out.println("New Day: " + newDay);
        } catch (Exception e) {
            // 捕获并打印异常信息
            e.printStackTrace();
        }
    }
}
```
```text
java.lang.NoSuchMethodException: Day.<init>(java.lang.String, int)
    at java.lang.Class.getDeclaredConstructor0(Native Method)
    at java.lang.Class.getDeclaredConstructor(Class.java:2178)
    at EnumReflectionExample.main(EnumReflectionExample.java:11)
```
具体的原因是在`Constructor`类中的`newInstance`方法，枚举类无法通过反射来创建对象，原因是`newInstance`方法加了判断如果是枚举类就抛出异常。
```java
@CallerSensitive
public T newInstance(Object ... initargs)
    throws InstantiationException, IllegalAccessException,
           IllegalArgumentException, InvocationTargetException{
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
除了不能创建枚举类的对象外，反射还是能够调用枚举类的方法的。
```java
enum Day {
    SUNDAY, MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY;

    public void printMessage() {
        System.out.println("Today is " + this.name());
    }
}

public class EnumReflectionExample {
    public static void main(String[] args) {
        try {
            // 获取枚举常量
            Day day = Day.SUNDAY;

            // 获取枚举类的 Class 对象
            Class<?> clazz = day.getClass();

            // 获取并调用枚举类的方法
            Method method = clazz.getMethod("printMessage");
            method.invoke(day);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```
