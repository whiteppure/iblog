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
Java泛型也是一种语法糖，在编译阶段完成类型的转换的工作，避免在运行时强制类型转换而出现`ClassCastException`，类型转化异常。举个例子，最常见的就是使用泛型集合：
```text
List<String> names = new ArrayList<>();
names.add("Alice");
names.add("Bob");
// 不需要强制转换为 String
String first = names.get(0);
```
需要注意的是，泛型在Java中是通过类型擦除来实现的，这意味着泛型信息只在编译时存在，而在运行时会被擦除。
由于类型擦除，运行时不会保留泛型类型的具体信息。所以对于泛型类的实例，无法在运行时获取其具体的类型参数信息。

## 泛型特点
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

泛型在提高代码的类型安全性和重用性方面有很多优点，但也存在一些缺点和限制。
例如，Java泛型是通过类型擦除实现的，这意味着在编译时会将泛型类型信息擦除掉，便于与旧版Java兼容。这导致在运行时无法获取泛型类型的具体信息。
```text
List<Integer> intList = new ArrayList<>();
List<String> strList = new ArrayList<>();
System.out.println(intList.getClass() == strList.getClass());  // Output: true
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

## 泛型与反射
Java中的泛型是通过类型擦除来实现的，这意味着泛型信息只在编译期间存在，而在运行时则被擦除。所以反射在运行时无法直接获取具体的泛型类型信息。

类型擦除是Java泛型的一种实现机制，目的是保持与旧版本的兼容性。在编译过程中，泛型类型被替换为其非泛型上限，通常是`Object`类，并在需要时插入类型转换。
这样Java编译器在编译期间进行类型检查，而在运行时不保留泛型类型信息。

通过反射可以绕过Java泛型的类型检查，这利用了Java泛型的类型擦除机制。在编译时，泛型类型被擦除，实际操作的对象是原始类型`Object`。
这使得在运行时可以向泛型集合中插入不同类型的元素。但这种做法会导致类型安全性问题，所以在实际开发中应谨慎使用。
```java
public static void main(String[] args) throws Exception {
        ArrayList<Integer> list = new ArrayList<Integer>();
        list.add(1);  //这样调用 add 方法只能存储整形，因为泛型类型的实例为 Integer
        list.getClass().getMethod("add", Object.class).invoke(list, "string");
        for (int i = 0; i < list.size(); i++)
            System.out.println(list.get(i));// 1 string
}
```

## 泛型与枚举
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

## 泛型类
在类上使用泛型，从而使类能够处理多种数据类型，而无需为每种数据类型编写单独的类。泛型类在定义时指定了一个或多个类型参数，这些类型参数在类的实例化时被具体的类型所替换。
定义泛型类时，类型参数放在类名后面的尖括号内。例如，T是一个常用的类型参数名称，但你可以使用任何有效的标识符。
```java
public class NumberBox<T extends Number> {
    private T number;

    public NumberBox(T number) {
        this.number = number;
    }
}
```
需要注意的是，静态成员不能使用泛型类型参数，因为静态成员在类加载时已经存在，而类型参数在实例化时才确定。
```java
public class GenericClass<T> {
    // 静态成员不能使用泛型类的类型参数
    // private static T staticValue; // 编译错误

    // 静态方法不能直接使用泛型类的类型参数
    // public static void staticMethod(T value) { // 编译错误
    //     // ...
    // }

    // 可以使用泛型方法来解决这个问题
    public static <U> void staticMethod(U value) {
        System.out.println(value);
    }
}
```
泛型类不只接受一个类型参数，它还可以接受多个类型参数。
```java
public class Pair<K, V> {
    private K key;
    private V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() {
        return key;
    }

    public V getValue() {
        return value;
    }
}
```

除此之外，泛型类可以直接继承自另一个泛型类。当泛型类继承另一个泛型类时，可以选择保留父类的泛型类型参数，也可以重新定义自己的泛型类型参数。
```java
// 父类是一个泛型类
public class Box<T> {
    private T value;

    public Box(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}

// 子类继承自泛型父类并保留类型参数
public class ChildBox<T> extends Box<T> {
    public ChildBox(T value) {
        super(value);
    }
}
```
子类也可以重新定义自己的泛型类型参数，与父类的类型参数可以不同。
```java
// 父类是一个泛型类
public class Box<T> {
    private T value;

    public Box(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}

// 子类继承自泛型父类，并重新定义类型参数
public class ChildBox<U> extends Box<U> {
    public ChildBox(U value) {
        super(value);
    }
}
```
关于泛型类需要注意的是，一个泛型类可以继承自一个普通类，不需要在继承语法上做特别的修改。
```java
// 父类是一个普通类
public class Parent {
    // 省略部分代码
}

// 子类是一个泛型类
public class Child<T> extends Parent {
    // 省略部分代码
}
```
但是普通类不能继承泛型类的类型参数，因为类型参数在实例化时才被确定，而普通类在编译时就被确定了。

在Java中，使用泛型创建对象时，必须指定类型参数T的具体数据类型，即在尖括号<>中传入具体的类型。
```text
Box<Integer> intBox = new Box<>(); // 使用 Integer 类型
intBox.setValue(123);
Integer intValue = intBox.getValue();

Box<String> strBox = new Box<>(); // 使用 String 类型
strBox.setValue("Hello");
String strValue = strBox.getValue();
```
如果`<>`中什么都不传入，则编译器会发出警告，提示使用原始类型，这是不推荐的做法。使用原始类型的主要问题是类型安全性降低，容易引发`ClassCastException`等运行时错误。
```text
Box rawBox = new Box(); // 使用原始类型（不推荐）
rawBox.setValue("Hello");
String strValue = (String) rawBox.getValue(); // 需要强制转换

// 编译时会发出警告：Box is a raw type. References to generic type Box<T> should be parameterized
```

## 泛型接口
泛型除了可以定义在类上，还可以定义在接口上。泛型接口允许你定义一个接口，其中的方法支持使用泛型类型参数。这样可以使得接口在实现时能够处理多种类型的数据，提高了灵活性和代码的复用性。
```java
public interface SomeInterface<T> {
    void doSomething(T item);
}
```
实现泛型接口时可以指定具体的类型参数，也可以保留接口定义的类型参数，甚至可以不指定类型参数。
```java
public class SomeClass implements SomeInterface<String> {
    @Override
    public void doSomething(String item) {
        System.out.println("Doing something with: " + item);
    }
}
```
```java
public class AnotherClass<T> implements SomeInterface<T> {
    @Override
    public void doSomething(T item) {
        System.out.println("Doing something with: " + item);
    }
}
```
实现泛型接口时没有确定类型参数，则默认为`Object`。
```java
public class AnotherClass implements SomeInterface {
    @Override
    public void doSomething(Object item) {
        System.out.println("Doing something with: " + item);
    }
}
```


泛型接口可以拥有静态成员，但是这些静态成员不受类型参数的影响，属于接口本身的静态成员。
```java
// 定义一个泛型接口
public interface Generator<T> {
    T generate();

    // 静态方法尝试使用类型参数 T，会导致编译错误
    static void printInfo(T item) {
        System.out.println("Info: " + item);
    }
}

// 实现泛型接口
public class StringGenerator implements Generator<String> {
    @Override
    public String generate() {
        return "Generated String";
    }
}
```

## 泛型方法
泛型方法是Java中一种特殊的方法，它在声明时可以使用泛型类型参数，使得方法在调用时可以接受不同类型的参数，并且能够保证类型安全。
泛型方法是在方法声明中使用了泛型类型参数的方法。通常情况下，泛型方法的类型参数在方法返回类型之前声明。
```java
public class GenericMethodExample {

    // 泛型方法示例
    public <T> T genericMethod(T data) {
        System.out.println("Received: " + data);
        return data;
    }
}
```
在Java中，静态方法可以使用泛型，其声明方式与普通方法类似。
```java
public class GenericMethodExample {

    // 泛型方法示例：交换数组中的两个元素
    public static <T> void swap(T[] arr, int i, int j) {
        T temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
}
```
在静态成员中不能使用泛型类定义的类型参数，但我们可以将静态成员方法定义为一个泛型方法。
```java
public class Test2<T> {

    // 静态泛型方法示例：使用泛型类型参数 E
    // 型类定义的类型参数 T 不能在静态方法中使用
    public static <E> E show(E one) {
        return null;
    }
}
```
当一个方法需要处理多个泛型类型参数时，可以在方法签名中声明多个类型参数，并在方法体内使用。
```java
public class MultiGenericMethodExample {

    // 泛型方法示例：打印任意类型的数组元素
    public static <T, U> void printArray(T[] arr1, U[] arr2) {
        System.out.print("Array 1 elements: ");
        for (T elem : arr1) {
            System.out.print(elem + " ");
        }
        System.out.println();

        System.out.print("Array 2 elements: ");
        for (U elem : arr2) {
            System.out.print(elem + " ");
        }
        System.out.println();
    }
}
```
需要格外注意的是，Java泛型类中定义的类型参数与泛型方法中定义的类型参数是相互独立的，它们没有直接的关系。
```java
public class Example<T> {

    // 泛型类中的类型参数 T
    private T field;

    // 泛型方法中的类型参数 U（与泛型类中的 T 无关）
    public <U> void method(U param) {
        System.out.println(param.toString());
    }
}
```
它们的命名可以不同，甚至可以具有相同的名称，但它们并不会直接相互影响或约束。为了避免混淆，如果在一个泛型类中存在泛型方法，那么两者的类型参数最好不要同名。

## 泛型通配符
Java的泛型是类型安全的，即使两个类型具有继承关系，比如`Integer`是`Number`的子类，但`ArrayList<Integer>`并不是`ArrayList<Number>`的子类。
这导致在处理不同泛型类型时，不能直接赋值或进行操作。
```text
ArrayList<Integer> intList = new ArrayList<>();
ArrayList<Number> numList = intList; // 编译错误，ArrayList<Integer> 不是 ArrayList<Number> 的子类型
```
使用泛型通配符可以解决这个问题，泛型通配符是用于解决泛型之间引用传递问题的特殊语法。
泛型通配符通过引入`?`、`? extends T`和`? super T`这些语法，解决了泛型类型之间没有继承关系、不能直接赋值和操作以及无法处理不确定具体泛型类型等问题。

泛型通配符用来表示未知类型，允许在泛型类、方法或接口中使用不确定的类型。
它们主要有三种形式：`?`、`? extends ...`、`? super ...`，每种形式适用于不同的场景。
- `?`通配符：表示任意类型，称为未限定通配符。`?`代表了任何一种数据类型，能代表任何一种数据类型的只有`null`。`Object`本身也算是一种数据类型，但却不能代表任何一种数据类型，所以`ArrayList<Object>`和`ArrayList<?>`的含义是不同的，前者类型是`Object`，也就是继承树的最高父类，而后者的类型完全是未知的，注意不要混淆。
在使用时，可以用作泛型类型的参数，但不能实例化具体的泛型对象。
   ```text
   List<?> list = new ArrayList<>();
   // 可以添加 null，因为 null 是任意引用类型的成员
   list.add(null);
   // 不能添加具体的对象，因为无法确定 list 的元素类型
   // list.add("example"); // 编译错误
   ```
- `? extends ...`通配符：`? extends T`表示某种具体类型的子类型（包括T自身），称为上界通配符。用于限制泛型类型的范围，可以用在方法参数、集合中的泛型类型等地方。
   ```text
   List<? extends Number> numbers = new ArrayList<>();
   // 可以添加 null 或任何 Number 及其子类的对象
   numbers.add(null);
   numbers.add(new Integer(10));
   numbers.add(new Double(3.14));
   // 不能添加其他类型的对象，例如 String
   // numbers.add("example"); // 编译错误
   ```
- `? super ...`通配符：`? super T`表示某种具体类型的超类型（包括T自身），称为下界通配符。用于限制泛型类型为某个类的父类或者父类的父类等。
   ```text
   List<? super Integer> integers = new ArrayList<>();
   // 可以添加 Integer 或其子类的对象
   integers.add(new Integer(10));
   integers.add(new Long(20L)); // Long 是 Integer 的父类
   // 不能添加 Object 类型的对象
   // integers.add(new Object()); // 编译错误
   ```

有一个有趣的问题，可能比较不好理解。使用了`ArrayList<? extends Number>`这样的通配符声明时，编译器会将此列表视为一个可以存放`Number`及其子类，如`Integer`、`Float`等对象的集合。然而这种声明方式也限制了你向这个集合中添加元素的能力。
具体来说，你无法向使用了上界通配符`<? extends Number>`的列表中添加任何类型的对象。
```java
public class GenericType {
    public static void main(String[] args) {  
		ArrayList<? extends Number> list = new ArrayList<>();
		
		list.add(new Integer(1));// 编译错误
		list.add(new Float(1.0));// 编译错误
    }  
}
```
`ArrayList<? extends Number>`表示这个列表中的元素的确是`Number`或其子类，但具体是哪一种子类是不确定的。
在编译时，Java无法确定你尝试添加的是哪一种具体的子类`Integer`还是`Float`，因此会阻止这种可能会导致类型不匹配的操作。
泛型的目的之一是在编译时提供类型安全性检查。使用了`<? extends Number>`的通配符后，编译器不能确保添加的具体子类型是安全的，因此禁止了这种操作。
如果你需要向列表中添加元素，应该使用没有通配符的具体类型来声明列表。上界统配符最大的作用就是为了拓展方法形参中类型参数的范围。
```java
public class GenericType {
    public static void main(String[] args) {  
        ArrayList<Number> list = new ArrayList<>();
        
        list.add(new Integer(1)); // 正确，因为Integer是Number的子类
        list.add(new Float(1.0)); // 正确，因为Float是Number的子类
    }  
}
```
有意思的来了，使用`ArrayList<? super Number>`，添加`Object`类型的对象编译报错。
```java
public class GenericType {
    public static void main(String[] args) {  
        ArrayList<? super Number> list = new ArrayList<>();
        
        list.add(new Integer(1)); // 编译正确，Integer 是 Number 的子类
        list.add(new Float(1.0)); // 编译正确，Float 是 Number 的子类
        list.add(new Object()); // 编译错误，Object 不是 Number 或其子类
    }  
}
```
其原因是，`ArrayList<? super Number>`的下界是`ArrayList<Number>`。因此，我们可以确定`Number`类及其子类的对象自然可以加入`ArrayList<? super Number>`集合中。
而`Number`类的父类对象就不能加入`ArrayList<? super Number>`集合中了，因为不能确定`ArrayList<? super Number>`集合的数据类型。

使用`extends`通配符,允许获取集合中的元素，因为可以确定元素至少是指定类型的子类。禁止向集合中添加任何元素，因为编译器无法确定具体的子类型，不能确保类型安全性。
```java
public class ExtendsWildcardExample {
    public static void main(String[] args) {
        List<? extends Number> list = new ArrayList<>();
        
        // 编译错误：无法添加任何元素，因为编译器无法确定具体的子类型
        // list.add(new Integer(1));
        // list.add(new Float(1.0));

        // 可以安全地获取元素
        Number num = list.get(0); // 可以确定是 Number 类型或其子类的对象
        System.out.println("First element: " + num);
    }
}
```
使用`super`通配符，允许向集合中添加元素，因为可以确定元素至少是指定类型的父类。禁止安全地从集合中读取元素，因为编译器无法确定具体的父类型，不能确保类型安全性。
```java
public class SuperWildcardExample {
    public static void main(String[] args) {
        List<? super Integer> list = new ArrayList<>();
        
        // 允许添加 Integer 及其子类的对象
        list.add(new Integer(1));
        list.add(new Integer(2));
        
        // 编译错误：无法安全地从列表中获取元素，因为编译器无法确定具体的父类型
        // Integer num = list.get(0);
        
        // 编译错误：只能存放 Integer 及其子类的对象，Object 不是 Integer 的子类
        // list.add(new Object());
    }
}
```

PECS原则（Producer Extends, Consumer Super）是理解和使用Java泛型通配符的一个重要原则。这个原则帮助我们决定在使用泛型时，应该使用`extends`还是`super`通配符。
如果我们从集合中读取元素并返回它们，即集合是生产者，我们应该使用`<? extends T>`。
```java
public class ProducerExtendsExample {
    public static void main(String[] args) {
        List<Integer> integerList = new ArrayList<>();
        integerList.add(1);
        integerList.add(2);

        List<? extends Number> numberList = integerList;
        Number number = getFirst(numberList);
        System.out.println("First number: " + number);
    }

    public static Number getFirst(List<? extends Number> list) {
        if (list.isEmpty()) {
            return null;
        }
        return list.get(0); // 安全地读取元素
    }
}
```
如果我们向集合中写入元素，即集合是消费者，我们应该使用`<? super T>`。
```java
public class ConsumerSuperExample {
    public static void main(String[] args) {
        List<Number> numberList = new ArrayList<>();
        
        List<? super Integer> integerList = numberList;
        addNumbers(integerList);
        System.out.println("Number list: " + numberList);
    }

    public static void addNumbers(List<? super Integer> list) {
        list.add(new Integer(3)); // 安全地写入元素
        list.add(new Integer(4)); // 安全地写入元素
    }
}
```
