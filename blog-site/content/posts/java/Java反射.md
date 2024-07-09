---
title: "Java反射"
date: 2021-10-02
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-reflect"
---

## 概述
在Java程序运行状态中，对于任意一个实体类，都能够知道这个类的所有属性和方法，对于任意一个对象，都能够调用它的任意方法和属性。这种动态获取信息以及动态调用对象方法的功能，称为Java语言的反射机制。

反射是Java语言的一个特性，它允许程序在运行时来进行自我检查并且对内部的成员进行操作。通过反射，我们可以在运行时获得程序或程序集中每一个类型的成员和成员的信息。
程序中一般的对象的类型都是在编译期就确定下来的，而Java反射机制可以动态地创建对象并调用其属性，这样的对象的类型在编译期是未知的。

反射的核心是JVM在运行时动态加载类或调用方法、访问属性，它不需要事先知道运行对象是谁。

## 反射入口
在操作反射前我们要先了解一些Class类。Java的`Class`类是java反射机制的基础，通过`Class`类我们可以获得关于一个类的相关信息。
虚拟机为每种类型管理一个独一无二的`Class`对象，也就是说每个类都有一个`Class`对象。运行程序时，Java虚拟机首先检查是否所要加载的类对应的`Class`对象是否已经加载。
如果没有加载，JVM就会根据类名查找`.class`文件，并将其`Class`对象载入。
```java
private  Class(ClassLoader loader) { 
    classLoader = loader; 
}
```
`Class`类的构造器是私有的，只有JVM可以创建`Class`的对象。因此不可以像普通类一样`new`一个`Class`对象，但是却可以通过已有的类得到一个`Class`对象。
在运行时获取`Class`的对象，共有三种方式：
1. 通过`Class.forName()`方法。这种方式使用类的全限定名（包名+类名）来获取`Class`对象，常用于动态加载类。
    ```text
    try {
        Class<?> clazz = Class.forName("com.example.MyClass");
    } catch (ClassNotFoundException e) {
        e.printStackTrace();
    }
    ```
2. 通过类的`.class`属性。这种方式在编译时就已经知道类的类型，适用于静态加载类。
    ```java
    Class<?> clazz = MyClass.class;
    ```
3. 通过对象的`getClass()`方法。这种方式通过已知对象来获取它的`Class`对象。
    ```java
    MyClass obj = new MyClass();
    Class<?> clazz = obj.getClass();
    ```

## 操作反射
在Java中，只要给定类的名字，就可以通过反射机制来获得类的所有信息、调用方法、访问和修改属性等操作。
反射使得程序可以在运行时检查类的结构和行为，而不需要在编译时知道类的具体信息。
使用反射会有异常出现，注意处理异常。Java中`Class`类和`java.lang.reflect`一起对反射提供了支持。

- 反射可以获取类的完整信息，包括类名、包名、父类、接口、构造函数、字段和方法等。
    ```text
    Class<?> clazz = Class.forName("java.util.ArrayList");
    
    // 获取类名
    System.out.println("Class Name: " + clazz.getName());
    
    // 获取包名
    Package pkg = clazz.getPackage();
    System.out.println("Package Name: " + pkg.getName());
    
    // 获取所有构造函数
    Constructor<?>[] constructors = clazz.getConstructors();
    for (Constructor<?> constructor : constructors) {
        System.out.println("Constructor: " + constructor);
    }
    
    // 获取所有方法
    Method[] methods = clazz.getMethods();
    for (Method method : methods) {
        System.out.println("Method: " + method.getName());
    }
    
    // 获取所有字段
    Field[] fields = clazz.getDeclaredFields();
    for (Field field : fields) {
        System.out.println("Field: " + field.getName());
    }
    ```
- 反射可以在运行时创建类的实例，而不需要在编译时知道类的名字。
    ```text
    Class<?> clazz = Class.forName("java.util.ArrayList");
    Constructor<?> constructor = clazz.getConstructor();
    Object instance = constructor.newInstance();
    System.out.println("Instance: " + instance);
    ```
- 反射允许在运行时访问和修改对象的字段，即使字段是私有的。
    ```text
    Class<?> clazz = Class.forName("com.example.Person");
    Object person = clazz.getConstructor().newInstance();
    
    // 获取私有字段
    Field nameField = clazz.getDeclaredField("name");
    nameField.setAccessible(true);  // 允许访问私有字段
    nameField.set(person, "John Doe");
    
    // 获取字段值
    String name = (String) nameField.get(person);
    System.out.println("Name: " + name);
    ```
- 反射可以在运行时调用对象的方法，包括私有方法。
    ```text
    Class<?> clazz = Class.forName("com.example.Person");
    Object person = clazz.getConstructor().newInstance();
    
    // 获取方法
    Method setNameMethod = clazz.getMethod("setName", String.class);
    Method getNameMethod = clazz.getMethod("getName");
    
    // 调用方法
    setNameMethod.invoke(person, "Jane Doe");
    String name = (String) getNameMethod.invoke(person);
    System.out.println("Name: " + name);
    ```

## 反射特点
通过反射机制我们可以获得类的各种内容，进行反编译。对于Java这种先编译再运行的语言来说，反射机制可以使代码更加灵活，更加容易实现面向对象。
- 反射允许在运行时动态加载类、创建对象、调用方法和访问属性，这使得程序具有更高的灵活性和动态性，可以根据运行时的需求来适应不同的情况。
- 反射使得编写通用代码和框架变得更加容易。例如，许多框架和库（如Spring和Hibernate）利用反射来实现依赖注入、持久化等功能，从而提高了代码的复用性和可维护性。
- 反射可以帮助解耦合，减少类之间的依赖关系。通过反射，可以在不知道具体类名的情况下操作对象，从而简化了系统的结构和设计。

反射功能虽然强大，但不应任意使用。如果一个功能可以不用反射完成，那么最好就不用。
- 性能开销 ：反射操作通常比直接调用要慢。因为反射调用涉及到动态查找方法、字段和进行安全检查，这些步骤在运行时会带来额外的性能开销。在性能敏感的场景下，频繁使用反射可能会导致程序性能下降。
- 安全限制 ：反射打破了Java语言的封装性和安全性，可以访问和修改私有成员，甚至可以执行敏感操作。因此在使用反射时需要格外注意安全性问题，避免不必要的暴露和风险。
- 内部暴露 ：使用反射可以使代码更加复杂和难以理解。反射操作的代码通常比直接调用的代码更加复杂，可读性较差，可能增加代码维护的困难。


## 反射性能
Java反射机制提供了一种在运行时动态操作类、方法和属性的强大能力。
这使得反射成为许多框架和库的基础，如`Spring`和`Hibernate`。然而反射的灵活性是有代价的，反射操作通常比直接调用要慢得多。
以下是一个比较直接方法调用和反射调用性能的示例：
```java
public class ReflectionPerformanceTest {
    public static void main(String[] args) throws Exception {
        MyClass myClass = new MyClass();
        Method method = MyClass.class.getMethod("myMethod");

        int iterations = 1000000;

        // 直接调用
        long startTime = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            myClass.myMethod();
        }
        long endTime = System.nanoTime();
        long directCallDuration = endTime - startTime;
        System.out.println("Direct call duration: " + directCallDuration + " ns");

        // 反射调用
        startTime = System.nanoTime();
        for (int i = 0; i < iterations; i++) {
            method.invoke(myClass);
        }
        endTime = System.nanoTime();
        long reflectionCallDuration = endTime - startTime;
        System.out.println("Reflection call duration: " + reflectionCallDuration + " ns");
    }
}

class MyClass {
    public void myMethod() {
        // Some operation
    }
}
```
反射慢的主要原因是在于它绕过了编译时的优化，并且在运行时需要动态查找类信息和进行安全性检查，导致额外的性能开销。
1. 绕过编译时优化： Java编译器可以在编译时对代码进行优化，如方法内联、常量折叠等，以提高执行效率。
而反射调用是在运行时动态解析的，编译器无法对其进行类似的优化，导致执行速度相对较慢。
2. 动态查找和安全检查： 反射允许代码在运行时动态获取类的信息、调用方法和访问字段，甚至能够绕过访问控制。
因此每次反射调用都需要在运行时进行类信息的查找和安全性检查，这些额外的步骤增加了方法调用的开销，使得反射相比直接调用更为缓慢。

反射适合于那些需要在运行时动态加载类、调用未知类的方法或访问私有成员的情况。在性能要求严格的地方，尽量避免使用反射。
如果需要多次反射调用，尽量将反射操作放在静态方法或静态初始化块中，来减少实例化对象的开销，避免重复的反射查找。
```java
class MyClass {
    private static Method myMethod;

    static {
        try {
            myMethod = MyClass.class.getDeclaredMethod("methodName");
            myMethod.setAccessible(true); // 如果是私有方法，需要设置访问权限
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
        }
    }

    public void invokeMyMethod() throws InvocationTargetException, IllegalAccessException {
        myMethod.invoke(this);
    }
}
```

## 反射应用场景
反射在Java编程中有广泛的应用场景。它主要用于动态加载类、运行时获取和操作类的信息，以及实现灵活的编程逻辑。
通过反射，可以实现诸如依赖注入框架，如`Spring`、ORM框架，如`Hibernate`、动态代理、自定义注解处理器、插件化系统等功能。
这些特性使得Java程序能够在运行时动态适应不同的需求和环境，提高了代码的灵活性和可维护性。

### 反射与注解
反射可以在运行时动态地获取和解析类、方法、字段上的注解信息。利用这个特性我们可以根据注解的内容来实现不同的逻辑，例如自定义的业务规则、权限控制等。

反射在自定义注解处理器中特别有用，可以通过反射获取类、方法的信息，并根据注解信息生成代码或者进行其他处理。
这种方式被广泛应用于框架和工具的开发中，例如`Spring`框架中的各种注解处理器。自定义一个注解体会一下。
```java
// 定义一个注解
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
@interface MyAnnotation {
    String value();
}

// 使用注解的类
class MyClass {
    @MyAnnotation("Hello Annotation")
    public void myMethod() {
        System.out.println("Method with annotation");
    }
}

public class ReflectionAndAnnotationExample {
    public static void main(String[] args) throws Exception {
        MyClass obj = new MyClass();
        Class<?> clazz = obj.getClass();

        // 获取方法上的注解信息
        Method method = clazz.getDeclaredMethod("myMethod");
        MyAnnotation annotation = method.getAnnotation(MyAnnotation.class);
        if (annotation != null) {
            System.out.println("Annotation value: " + annotation.value());
        }

        // 使用反射调用带有注解的方法
        method.invoke(obj);
    }
}
```

### 反射与枚举
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

### 反射与泛型
Java中的泛型是通过类型擦除来实现的，这意味着泛型信息只在编译期间存在，而在运行时则被擦除。所以反射在运行时无法直接获取具体的泛型类型信息。

类型擦除是Java泛型的一种实现机制，目的是保持与旧版本的兼容性。在编译过程中，泛型类型被替换为其非泛型上限，通常是Object类，并在需要时插入类型转换。
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

### 反射与框架
反射在许多Java框架中起着至关重要的作用，它使得框架能够在运行时动态地操作对象、调用方法和访问字段。
例如，Spring的核心功能之一是依赖注入，就是利用反射动态地创建和注入对象。Spring使用反射来调用构造函数、设置字段和调用方法。
```java
public class MyService {
    @Autowired
    private MyRepository myRepository;
}
```
在`@Autowired`注解文档注释上面，可以看到与之息息相关的一个类`AutowiredAnnotationBeanPostProcessor`，即`@Autowired`后置处理器。
看到该类实现了`MergedBeanDefinitionPostProcessor`接口，在`postProcessMergedBeanDefinition`方法上打一个断点，就可以看到`@Autowired`的调用栈。
```java
/*
 * @see AutowiredAnnotationBeanPostProcessor
 */
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired{}
```
`@Autowired`注解调用栈：
```text
AbstractApplicationContext.refresh(容器初始化)
---> registerBeanPostProcessors (注册AutowiredAnnotationBeanPostProcessor) 
---> finishBeanFactoryInitialization
---> AbstractAutowireCapableBeanFactory.doCreateBean
---> AbstractAutowireCapableBeanFactory.applyMergedBeanDefinitionPostProcessors
---> MergedBeanDefinitionPostProcessor.postProcessMergedBeanDefinition
---> AutowiredAnnotationBeanPostProcessor.findAutowiringMetadata
```
核心调用：
```
postProcessMergedBeanDefinition
--->findAutowiringMetadata
--->buildAutowiringMetadata
```
```java
@Override
public void postProcessMergedBeanDefinition(RootBeanDefinition beanDefinition, Class<?> beanType, String beanName) {
    // 调用 findAutowiringMetadata
    InjectionMetadata metadata = findAutowiringMetadata(beanName, beanType, null);
    metadata.checkConfigMembers(beanDefinition);
}

private InjectionMetadata findAutowiringMetadata(String beanName, Class<?> clazz, @Nullable PropertyValues pvs) {
    // Fall back to class name as cache key, for backwards compatibility with custom callers.
    String cacheKey = (StringUtils.hasLength(beanName) ? beanName : clazz.getName());
    // Quick check on the concurrent map first, with minimal locking.
    InjectionMetadata metadata = this.injectionMetadataCache.get(cacheKey);
    if (InjectionMetadata.needsRefresh(metadata, clazz)) {
        synchronized (this.injectionMetadataCache) {
            metadata = this.injectionMetadataCache.get(cacheKey);
            if (InjectionMetadata.needsRefresh(metadata, clazz)) {
                if (metadata != null) {
                    metadata.clear(pvs);
                }
                // 调用buildAutowiringMetadata
                metadata = buildAutowiringMetadata(clazz);
                this.injectionMetadataCache.put(cacheKey, metadata);
            }
        }
    }
    return metadata;
}


private InjectionMetadata buildAutowiringMetadata(final Class<?> clazz) {
    LinkedList<InjectionMetadata.InjectedElement> elements = new LinkedList<>();
    Class<?> targetClass = clazz;//需要处理的目标类
   
    do {
        final LinkedList<InjectionMetadata.InjectedElement> currElements = new LinkedList<>();

        // 通过反射获取该类所有的字段，并遍历每一个字段，并通过方法findAutowiredAnnotation遍历每一个字段的所用注解，
        // 如果用autowired修饰了，则返回auotowired相关属性
        ReflectionUtils.doWithLocalFields(targetClass, field -> {
            AnnotationAttributes ann = findAutowiredAnnotation(field);
            if (ann != null) {//校验autowired注解是否用在了static方法上
                if (Modifier.isStatic(field.getModifiers())) {
                    if (logger.isWarnEnabled()) {
                        logger.warn("Autowired annotation is not supported on static fields: " + field);
                    }
                    return;
                }//判断是否指定了required
                boolean required = determineRequiredStatus(ann);
                currElements.add(new AutowiredFieldElement(field, required));
            }
        });
        // 和上面一样的逻辑，但是是通过反射处理类的method
        ReflectionUtils.doWithLocalMethods(targetClass, method -> {
            Method bridgedMethod = BridgeMethodResolver.findBridgedMethod(method);
            if (!BridgeMethodResolver.isVisibilityBridgeMethodPair(method, bridgedMethod)) {
                return;
            }
            AnnotationAttributes ann = findAutowiredAnnotation(bridgedMethod);
            if (ann != null && method.equals(ClassUtils.getMostSpecificMethod(method, clazz))) {
                if (Modifier.isStatic(method.getModifiers())) {
                    if (logger.isWarnEnabled()) {
                        logger.warn("Autowired annotation is not supported on static methods: " + method);
                    }
                    return;
                }
                if (method.getParameterCount() == 0) {
                    if (logger.isWarnEnabled()) {
                        logger.warn("Autowired annotation should only be used on methods with parameters: " +
                                method);
                    }
                }
                boolean required = determineRequiredStatus(ann);
                PropertyDescriptor pd = BeanUtils.findPropertyForMethod(bridgedMethod, clazz);
                currElements.add(new AutowiredMethodElement(method, required, pd));
            }
        });
        // 用@Autowired修饰的注解可能不止一个，因此都加在currElements这个容器里面，一起处理		
        elements.addAll(0, currElements);
        targetClass = targetClass.getSuperclass();
    }
    while (targetClass != null && targetClass != Object.class);

    return new InjectionMetadata(clazz, elements);
}
```
通过上面的源码，可以看到Spring在运行时通过反射查找`@Autowired`注解，并自动注入相关字段。
Spring框架利用反射遍历目标类及其超类的所有字段和方法，查找并收集所有使用了`@Autowired`注解的元素。对于每个字段和方法，首先通过反射获取注解信息，如果字段或方法被`@Autowired`注解修饰且符合条件（如非静态），则将其封装成对应的注入元素（`AutowiredFieldElement`或`AutowiredMethodElement`）并添加到当前元素列表中。
最后，这些注入元素会被封装到`InjectionMetadata`对象中，并用于实际的依赖注入过程，从而实现Spring的自动注入功能。
