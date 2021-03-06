---
title: "规范编写Java代码心得"
date: 2021-11-25
draft: false
tags: ["Java","规范"]
slug: "java-code-rule"
---

## 编码规范
我们为什么要遵守规范来编码？

是因为通常在编码过程中我们不只自己进行开发，通常需要一个团队来进行，开发好之后还需要维护，所以编码规范就显的尤为重要。

代码维护时间比较长，那么保证代码可读性就显得很重要。作为一个程序员，咱们得有点追求和信仰。推荐[《阿里巴巴Java开发手册》](https://www.w3cschool.cn/alibaba_java/)。

## 内存泄露问题
内存泄漏是指不使用的对象持续占有内存使得内存得不到释放，从而造成内存空间的浪费。

[内存泄露](/iblog/posts/jvm/jvm-about/#内存泄漏)导致问题：
- 最明显问题频繁GC，从而[STW](/iblog/posts/jvm/jvm-about/#stw)次数增加,导致用户体验变差；
- 如果内存泄露问题严重，会导致OOM，直接导致程序不能正常运行；

内存泄露是很严重的问题，在出现内存泄露的情况下，想要解决是肯定要修改代码的，所以在编写代码的时候要避免出现内存泄露。

### 内存泄露原因
大多数内存泄露的原因是，长生命周期的对象引用了短生命周期的对象。例如，A对象引用B对象，A对象的生命周期（t1-t4）比B对象的生命周期（t2-t3）长的多。当B对象没有被应用程序使用之后，A对象仍然在引用着B对象。这样，垃圾回收器就没办法将B对象从内存中移除，从而导致内存泄露问题。

#### 变量作用域不合理导致内存泄露
一个变量的定义的作用范围大于其使用范围，很有可能会造成内存泄漏
```
public class UsingRandom {
    private String msg;
    public void receiveMsg(){
        readFromNet();//从网络中接受数据保存到msg中
        saveDB();//把msg保存到数据库中
    }
}
```

解决办法，将msg定义在receiveMsg方法中或将msg重置为null。
```
public class UsingRandom {
    private String msg;
    public void receiveMsg(){
        readFromNet();//从网络中接受数据保存到msg中
        saveDB();//把msg保存到数据库中
        msg = null;
    }
}
```

#### 向静态集合添加数据导致内存泄露
HashMap、LinkedList 等集合类，如果这些集合是静态的并且向集合中添加了对象，这些对象就算不再使用，也不会被GC主动回收的，它们的生命周期与JVM程序一致，容器中的对象在程序结束之前将不能被释放，从而造成内存泄漏。
```
public class MyTest {
    static Map<String, User> map = new HashMap<>();
    public static void main(String[] args) throws InterruptedException {
        User user = new User();
        map.put("01",user);
    }
}
```

解决办法是将使用完后的集合和对象重置为null，或将集合替换成弱引用集合（只要垃圾回收机制一运行，不管 JVM 的内存空间是否足够，总会回收该对象占用的内存）。
```
    static Map<String, User> map = new HashMap<>();
    public static void main(String[] args) throws InterruptedException {

        User user = new User();
        map.put("01",user);

        user = null;
        map = null;

        System.gc();
        Thread.sleep(1000);
    }
```
```
    static Map<String, User> map = new WeakHashMap<>();
    public static void main(String[] args) throws InterruptedException {
        User user = new User();
        map.put("01",user);
    }
```

#### 内部类持有外部类引用导致内存泄露
非静态内部类，自动生成的构造方法，默认的参数是外部类的类型，因此使用非内部内部类的时候会保留一个外部类的引用。如果换成静态内部类则不会生成默认的构造方法。
```
public class MyClass {


    public static void main(String[] args) throws Throwable {

    }

    public class A{
        public void methed1(){

        }
    }

    public static  class B{
        public void methed1(){

        }
    }
}
```

如果一个外部类的实例对象的方法返回了一个内部类的实例对象。这个内部类对象被长期引用了，即使那个外部类实例对象不再被使用，但由于内部类持有外部类的实例对象，这个外部类对象将不会被垃圾回收，这也会造成内存泄漏。

#### 数据结构中移除元素导致内存泄露
- 链表中移除元素，没有将移除的元素置为null导致的内存泄露问题

Java容器LinkedList移除元素方法核心源码:
```

//删除指定节点并返回被删除的元素值
E unlink(Node<E> x) {
    //获取当前值和前后节点
    final E element = x.item;
    final Node<E> next = x.next;
    final Node<E> prev = x.prev;
    if (prev == null) {
        first = next; //如果前一个节点为空(如当前节点为首节点)，后一个节点成为新的首节点
    } else {
        prev.next = next;//如果前一个节点不为空，那么他先后指向当前的下一个节点
        x.prev = null;
    }
    if (next == null) {
        last = prev; //如果后一个节点为空(如当前节点为尾节点)，当前节点前一个成为新的尾节点
    } else {
        next.prev = prev;//如果后一个节点不为空，后一个节点向前指向当前的前一个节点
        x.next = null;
    }
    x.item = null; // help gc
    size--;
    modCount++;
    return element;
}
```
除了修改节点间的关联关系，我们还要做的就是赋值为null的操作，不管GC何时会开始清理，我们都应及时的将无用的对象标记为可被清理的对象。

---

- 在栈中将该元素出栈，没有将出栈的元素置为null导致的内存泄露问题
```
public E pop(){
    if(size == 0)
        return null;
    else{
        E e = (E) elementData[--size];
        elementData[size] = null; // help gc
        return e;
    }
}
```

---

- 改变hash表中对象的属性值，再将该元素移除导致的内存泄露问题

因为改变了对象属性的值相当于改变了改对象的hash值，删除的时候是根据对象的hash值来删除的，删除对象的时候找不到对应的hash值，所以不能删除，最终导致内存泄露。

```
public class ChangeHashCode {
    public static void main(String[] args) {
        HashSet set = new HashSet();
        Person p1 = new Person(1001, "AA");
        Person p2 = new Person(1002, "BB");
 
        set.add(p1);
        set.add(p2);
 
        p1.name = "CC"; // 导致了内存的泄漏
        set.remove(p1);  // 对象哈希值发生变化，检索不到，导致删除失败
 
        System.out.println(set);
 
        set.add(new Person(1001, "CC"));
        System.out.println(set);
 
        set.add(new Person(1001, "AA"));
        System.out.println(set);
    }
}
 
class Person {
    int id;
    String name;
 
    public Person(int id, String name) {
        this.id = id;
        this.name = name;
    }
 
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Person)) return false;
 
        Person person = (Person) o;
 
        if (id != person.id) return false;
        return name != null ? name.equals(person.name) : person.name == null;
    }
 
    @Override
    public int hashCode() {
        int result = id;
        result = 31 * result + (name != null ? name.hashCode() : 0);
        return result;
    }
 
    @Override
    public String toString() {
        return "Person{" +
                "id=" + id +
                ", name='" + name + '\'' +
                '}';
    }
}
```


#### 连接未释放
如数据库连接、网络连接和IO连接等。当不再使用时，需要调用close方法来释放连接。只有连接被关闭后，垃圾回收器才会回收对应的对象。否则，如果在连接过程中，对一些对象不显性地关闭，将会造成大量的对象无法被回收，从而引起内存泄漏。
```
public static void main(String[] args) {
    try{
        Connection conn =null;
        Class.forName("com.mysql.jdbc.Driver");
        conn =DriverManager.getConnection("url","","");
        Statement stmt =conn.createStatement();
        ResultSet rs =stmt.executeQuery("....");
    } catch（Exception e）{
    } finally {
        // 1．关闭结果集 Statement
        // 2．关闭声明的对象 ResultSet
        // 3．关闭连接 Connection
    }
}
```

## 代码结构
编写代码最终要的原则就是要具有扩展性，如果没有扩展性那么代码维护起来会非常麻烦。

### 优雅判空

#### 使用Spring提供的工具类Assert判空
```
public class MyTest {
    public static void main(String[] args) {
        Object obj = new Object();
        Assert.notNull(obj,"对象不能为空");
        Assert.isTrue(obj != null,"对象不能为空");
        ArrayList<Object> list = new ArrayList<>();
        Assert.notEmpty(list,"list不能为空");
    }
}
```

#### 使用Java8链式调用特性判空
```
public class MyTest {
    public static void main(String[] args) {
        Object obj = new Object();
        System.out.println("是否不为空：" + Optional.of(obj).isPresent());

        User user = new User();
        user.setId(1);
        user.setName("ls");
        Optional<User> zs = Optional.of(user).filter(u -> u.getName().equals("zs"));
        System.out.println(zs.get());
        zs.ifPresent(item ->{
             System.out.println("对象不等于空，做的一系列操作");
         });
        User user1 = Optional.of(zs.orElse(new User())).get();
        System.out.println(user1);
    }


    static class User {
        private int id;
        private String name;

        public String getName() {
            return name;
        }
        public int getId() {
            return id;
        }
        public void setName(String name) {
            this.name = name;
        }
        public void setId(int id) {
            this.id = id;
        }

        @Override
        public String toString() {
            return "User{" +
                    "id=" + id +
                    ", name='" + name + '\'' +
                    '}';
        }
    }
}
```

自定义链式调用，对Optional扩展：
- https://www.hollischuang.com/archives/5605
```
@Data
public class User {

    private String name;

    private String gender;

    private School school;

    @Data
    public static class School {

        private String scName;

        private String adress;
    }
}
```

```
/**
* @author Axin
* @since 2020-09-10
* @summary 链式调用 bean 中 value 的方法
*/
public final class OptionalBean<T> {

    private static final OptionalBean<?> EMPTY = new OptionalBean<>();

    private final T value;

    private OptionalBean() {
        this.value = null;
    }

    /**
     * 空值会抛出空指针
     * @param value
     */
    private OptionalBean(T value) {
        this.value = Objects.requireNonNull(value);
    }

    /**
     * 包装一个不能为空的 bean
     * @param value
     * @param <T>
     * @return
     */
    public static <T> OptionalBean<T> of(T value) {
        return new OptionalBean<>(value);
    }

    /**
     * 包装一个可能为空的 bean
     * @param value
     * @param <T>
     * @return
     */
    public static <T> OptionalBean<T> ofNullable(T value) {
        return value == null ? empty() : of(value);
    }

    /**
     * 取出具体的值
     * @param fn
     * @param <R>
     * @return
     */
    public T get() {
        return Objects.isNull(value) ? null : value;
    }

    /**
     * 取出一个可能为空的对象
     * @param fn
     * @param <R>
     * @return
     */
    public <R> OptionalBean<R> getBean(Function<? super T, ? extends R> fn) {
        return Objects.isNull(value) ? OptionalBean.empty() : OptionalBean.ofNullable(fn.apply(value));
    }

    /**
     * 如果目标值为空 获取一个默认值
     * @param other
     * @return
     */
    public T orElse(T other) {
        return value != null ? value : other;
    }

    /**
     * 如果目标值为空 通过lambda表达式获取一个值
     * @param other
     * @return
     */
    public T orElseGet(Supplier<? extends T> other) {
        return value != null ? value : other.get();
    }

    /**
     * 如果目标值为空 抛出一个异常
     * @param exceptionSupplier
     * @param <X>
     * @return
     * @throws X
     */
    public <X extends Throwable> T orElseThrow(Supplier<? extends X> exceptionSupplier) throws X {
        if (value != null) {
            return value;
        } else {
            throw exceptionSupplier.get();
        }
    }

    public boolean isPresent() {
        return value != null;
    }

    public void ifPresent(Consumer<? super T> consumer) {
        if (value != null)
            consumer.accept(value);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(value);
    }

    /**
     * 空值常量
     * @param <T>
     * @return
     */
    public static<T> OptionalBean<T> empty() {
        @SuppressWarnings("unchecked")
        OptionalBean<T> none = (OptionalBean<T>) EMPTY;
        return none;
    }

}
```
```
public static void main(String[] args) {

    User axin = new User();
    User.School school = new User.School();
    axin.setName("hello");

    // 1. 基本调用
    String value1 = OptionalBean.ofNullable(axin)
            .getBean(User::getSchool)
            .getBean(User.School::getAdress).get();
    System.out.println(value1);

    // 2. 扩展的 isPresent方法 用法与 Optional 一样
    boolean present = OptionalBean.ofNullable(axin)
            .getBean(User::getSchool)
            .getBean(User.School::getAdress).isPresent();
    System.out.println(present);


    // 3. 扩展的 ifPresent 方法
    OptionalBean.ofNullable(axin)
            .getBean(User::getSchool)
            .getBean(User.School::getAdress)
            .ifPresent(adress -> System.out.println(String.format("地址存在:%s", adress)));

    // 4. 扩展的 orElse
    String value2 = OptionalBean.ofNullable(axin)
            .getBean(User::getSchool)
            .getBean(User.School::getAdress).orElse("家里蹲");

    System.out.println(value2);

    // 5. 扩展的 orElseThrow
    try {
        String value3 = OptionalBean.ofNullable(axin)
                .getBean(User::getSchool)
                .getBean(User.School::getAdress).orElseThrow(() -> new RuntimeException("空指针了"));
    } catch (Exception e) {
        System.out.println(e.getMessage());
    }
}
```

#### 使用BeanValidator注解判空
思路：定义一个注解，将需要校验的参数对象都标注该注解，利用SpringAOP，拦截该注解，将其中标注的参数取出，最后通过BeanValidator进行校验。

所需依赖：
```
<dependency>
    <groupId>org.hibernate</groupId>
    <artifactId>hibernate-validator</artifactId>
</dependency>
```

```
/**
 * facade接口注解， 用于统一对facade进行参数校验及异常捕获
 * @author whitepure
 */
@Target({ElementType.METHOD,ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface Facade {

}
```

```
@Slf4j
@Aspect
@Component
public class FacadeAspect {


    @Around("@annotation(com.spring.example.annotation.Facade)")
    public Object facade(ProceedingJoinPoint pjp) throws Exception {

        // 获取，执行目标方法
        Method method = ((MethodSignature) pjp.getSignature()).getMethod();

        Object[] args = pjp.getArgs();

        log.info("获取@Facede注解参数列表,参数: {}", args);

        // 参数类型
        Class<?> returnType = ((MethodSignature) pjp.getSignature()).getMethod().getReturnType();

        //循环遍历所有参数，进行参数校验
        for (Object parameter : args) {
            try {
                BeanValidator.validateObject(parameter);
            } catch (ValidationException e) {
                return getFailedResponse(returnType, e);
            }
        }

        try {
            // 目标方法执行
            return pjp.proceed();
        } catch (Throwable throwable) {
            // 返回通用失败响应
            return getFailedResponse(returnType, throwable);
        }
    }

    /**
     * 定义并返回一个通用的失败响应
     */
    private Object getFailedResponse(Class<?> returnType, Throwable throwable)
            throws NoSuchMethodException, IllegalAccessException, InvocationTargetException, InstantiationException {

        //如果返回值的类型为BaseResponse 的子类，则创建一个通用的失败响应
        if (returnType.getDeclaredConstructor().newInstance() instanceof ApiResponse) {
            ApiResponse response = (ApiResponse) returnType.getDeclaredConstructor().newInstance();
            String message = throwable.getMessage();
            log.error("校验bean异常：", throwable);
            response.setMessage(message);
            response.setCode(Status.ERROR.getCode());
            return response;
        }
        log.error("failed to getFailedResponse , returnType ({}) is not instanceof BaseResponse", returnType);
        return null;
    }

}
```
```
public class BeanValidator {


    private static final Validator validator = Validation
            .byProvider(HibernateValidator.class)
            .configure().failFast(true)
            .buildValidatorFactory().getValidator();

    /**
     * 校验对象
     *
     * @param object object
     * @param groups groups
     */
    public static void validateObject(Object object, Class<?>... groups) throws ValidationException {
        Set<ConstraintViolation<Object>> constraintViolations = validator.validate(object, groups);
        if (constraintViolations.stream().findFirst().isPresent()) {
            throw new ValidationException(constraintViolations.stream().findFirst().get().getMessage());
        }
    }


    /**
     * 校验对象bean
     *
     * @param t      bean
     * @param groups 校验组
     * @return ValidResult
     */
    public static <T> ValidResult validateBean(T t, Class<?>... groups) {
        ValidResult result = new ValidResult();
        Set<ConstraintViolation<T>> violationSet = validator.validate(t, groups);
        boolean hasError = violationSet != null && violationSet.size() > 0;
        result.setHasErrors(hasError);
        if (hasError) {
            for (ConstraintViolation<T> violation : violationSet) {
                result.addError(violation.getPropertyPath().toString(), violation.getMessage());
            }
        }
        return result;
    }

    /**
     * 校验bean的某一个属性
     *
     * @param obj          bean
     * @param propertyName 属性名称
     * @return ValidResult
     */
    public static <T> ValidResult validateProperty(T obj, String propertyName) {
        ValidResult result = new ValidResult();
        Set<ConstraintViolation<T>> violationSet = validator.validateProperty(obj, propertyName);
        boolean hasError = violationSet != null && violationSet.size() > 0;
        result.setHasErrors(hasError);
        if (hasError) {
            for (ConstraintViolation<T> violation : violationSet) {
                result.addError(propertyName, violation.getMessage());
            }
        }
        return result;
    }

    /**
     * 校验结果类
     */
    @Data
    public static class ValidResult {

        /**
         * 是否有错误
         */
        private boolean hasErrors;

        /**
         * 错误信息
         */
        private List<ErrorMessage> errors;

        public ValidResult() {
            this.errors = new ArrayList<>();
        }

        public boolean hasErrors() {
            return hasErrors;
        }

        public void setHasErrors(boolean hasErrors) {
            this.hasErrors = hasErrors;
        }

        /**
         * 获取所有验证信息
         *
         * @return 集合形式
         */
        public List<ErrorMessage> getAllErrors() {
            return errors;
        }

        /**
         * 获取所有验证信息
         *
         * @return 字符串形式
         */
        public String getErrors() {
            StringBuilder sb = new StringBuilder();
            for (ErrorMessage error : errors) {
                sb.append(error.getPropertyPath()).append(":").append(error.getMessage()).append(" ");
            }
            return sb.toString();
        }

        public void addError(String propertyName, String message) {
            this.errors.add(new ErrorMessage(propertyName, message));
        }
    }

    @Data
    public static class ErrorMessage {

        private String propertyPath;

        private String message;

        public ErrorMessage() {
        }

        public ErrorMessage(String propertyPath, String message) {
            this.propertyPath = propertyPath;
            this.message = message;
        }
    }

}
```

### 过多if..else
替换if..else并不会降低代码的复杂度，相反比较少见的写法可能会增加认知负荷，从而进一步增加了复杂度。之所以要替换过多的if..else是为了对代码进行解耦合，方便扩展代码，最终方便对代码的维护。

以下有几种常见的方法来替换过多的if..else。

#### 使用枚举代替if..else
```
public class MyTest {
    public static void main(String[] args) {
        String val = "FOUR";
        condition(val);
        System.out.println("--------------");
        newCondition(val);
    }

    public static void condition(String val) {
        if ("ONE".equals(val)) {
            System.out.println("val:" + 1111111);
        } else if ("TWO".equals(val)) {
            System.out.println("val:" + 2222222);
        } else if ("THREE".equals(val)) {
            System.out.println("val:" + 3333333);
        } else {
            System.out.println("val:" + val);
        }
    }

    public static void newCondition(String val) {
        ConditionEnum conditionEnum;
        try {
            conditionEnum = ConditionEnum.valueOf(val);
        } catch (IllegalArgumentException e) {
            System.out.println("val:" + val);
            return;
        }
        exec(conditionEnum);
    }

    public static void exec(ConditionEnum conditionEnum) {
        conditionEnum.context();
    }

    enum ConditionEnum {
        ONE {
            @Override
            public void context() {
                System.out.println("val:" + 1111111);
            }
        },
        TWO {
            @Override
            public void context() {
                System.out.println("val:" + 2222222);
            }
        },
        THREE {
            @Override
            public void context() {
                System.out.println("val:" + 3333333);
            }
        };

        public abstract void context();
    }

}
```

也可用枚举替换成这样：
```
    public static void newCondition(String val) {
        ConditionEnum condition = ConditionEnum.getCondition(val);
        System.out.println("val:" + (condition == null ? val : condition.value));
    }

    enum ConditionEnum {
        ONE("ONE",1111111),
        TWO("TWO",2222222),
        THREE("THREE",3333333)

        ;

        private String key;
        private Integer value;

        ConditionEnum(String key,Integer value){
            this.key = key;
            this.value = value;
        }

        public  static ConditionEnum getCondition(String key){
            return Arrays.stream(ConditionEnum.values()).filter(x -> Objects.equals(x.key, key)).findFirst().orElse(null);
        }
    }
```

#### 放入数据结构中进行判断从而减少if..else
```
public class MyTest {
    public static void main(String[] args) {
        String val = "1";
        condition(val);
        System.out.println("--------------");
        newCondition(val);
    }
    public static void condition(String val) {
        if ("1".equals(val)){
            System.out.println("val:" + 1111111);
        }else if ("2".equals(val)){
            System.out.println("val:" + 2222222);
        }else if ("3".equals(val)){
            System.out.println("val:" + 3333333);
        }else {
            System.out.println("val:" + val);
        }
    }
    public static void newCondition(String val){
        Map<String, Function<?,?>> map = new HashMap<>();
        map.put("1",(action) -> 1111111);
        map.put("2",(action) -> 2222222);
        map.put("3",(action) -> 3333333);
        System.out.println("val:" + (map.get(val) != null ? map.get(val).apply(null) : val));
    }

}
```

#### 使用switch..case代替if..else
```
public class MyTest {
    public static void main(String[] args) {
        String val = "FOUR";
        condition(val);
        System.out.println("--------------");
        newCondition(val);
    }

    public static void condition(String val) {
        if ("ONE".equals(val)) {
            System.out.println("val:" + 1111111);
        } else if ("TWO".equals(val)) {
            System.out.println("val:" + 2222222);
        } else if ("THREE".equals(val)) {
            System.out.println("val:" + 3333333);
        } else {
            System.out.println("val:" + val);
        }
    }

    public static void newCondition(String val) {
        switch (val) {
            case "ONE":
                System.out.println("val:" + 1111111);
                break;
            case "TWO":
                System.out.println("val:" + 2222222);
                break;
            case "THREE":
                System.out.println("val:" + 3333333);
                break;
            default:
                System.out.println("val:" + val);
        }
    }
}
```

#### 尽早结束if使代码结构更清晰
```
public class MyTest {
    public static void main(String[] args) {
        String val = "222";
        condition(val);
        System.out.println("--------------");
        newCondition(val);
    }

    public static void condition(String val) {
        if ("ONE".equals(val)) {
            System.out.println("val:" + 1111111);
        } else if ("TWO".equals(val)) {
            System.out.println("val:" + 2222222);
        } else if ("THREE".equals(val)) {
            System.out.println("val:" + 3333333);
        } else {
            System.out.println("val:" + val);
        }
    }

    public static void newCondition(String val) {
        if ("ONE".equals(val)) {
            System.out.println("val:" + 1111111);
            return;
        }
        if ("TWO".equals(val)) {
            System.out.println("val:" + 2222222);
            return;
        }
        if ("THREE".equals(val)) {
            System.out.println("val:" + 3333333);
            return;
        }
        System.out.println("val:" + val);
    }
}
```

#### 使用职责链模式代替if..else
```
public class MyTest {
    public static void main(String[] args) {
        String val = "1";
        condition(val);
        System.out.println("--------------");
        newCondition(val);
    }

    public static void condition(String val) {
        if ("ONE".equals(val)) {
            System.out.println("val:" + 1111111);
        } else if ("TWO".equals(val)) {
            System.out.println("val:" + 2222222);
        } else if ("THREE".equals(val)) {
            System.out.println("val:" + 3333333);
        } else {
            System.out.println("val:" + val);
        }
    }

    public static void newCondition(String val) {
        One one = new One();
        Two two = new Two();
        Three three = new Three();

        // 设置调用链,可设置成死循环
        one.setAbstractHandler(two);
        two.setAbstractHandler(three);

        // 执行
        one.exec(val);
    }
}

abstract class AbstractHandler {

    protected AbstractHandler abstractHandler;

    protected void setAbstractHandler(AbstractHandler abstractHandler) {
        this.abstractHandler = abstractHandler;
    }

    protected abstract void exec(String val);

}

class One extends AbstractHandler {

    @Override
    protected void exec(String val) {
        if (!val.equals("ONE")){
            abstractHandler.exec(val);
            return;
        }
        System.out.println("val:" + 1111111);
    }
}

class Two extends AbstractHandler {

    @Override
    protected void exec(String val) {
        if (!val.equals("TWO")){
            abstractHandler.exec(val);
            return;
        }
        System.out.println("val:" + 2222222);
    }
}

class Three extends AbstractHandler {

    @Override
    protected void exec(String val) {
        System.out.println(val.equals("THREE") ? "val:" + 3333333 : "val:" + val);
    }
}
```

#### 使用模板方法模式代替if..else
```
public class MyTest {
    public static void main(String[] args) {
        String val = "ONE";
        condition(val);
        System.out.println("--------------");
        newCondition(val);
    }

    public static void condition(String val) {
        if ("ONE".equals(val)) {
            System.out.println("val:" + 1111111);
        } else if ("TWO".equals(val)) {
            System.out.println("val:" + 2222222);
        } else if ("THREE".equals(val)) {
            System.out.println("val:" + 3333333);
        } else {
            System.out.println("val:" + val);
        }
    }

    public static void newCondition(String val) {
        if (!Objects.equals(val, "ONE") && !Objects.equals(val, "TWO") && !Objects.equals(val, "THREE")) {
            System.out.println("val:" + val);
            return;
        }
        List<ConditionTemplate> list = new ArrayList<>(Arrays.asList(new One(), new Two(), new Three()));
        for (ConditionTemplate item : list) {
            item.template(val);
        }
    }

}

abstract class ConditionTemplate {

    public void template(String val){
        if (supportIns(val)){
            support();
        }
    }

    public abstract void support();

    public abstract boolean supportIns(String val);

}

class One extends ConditionTemplate {
    @Override
    public void support() {
        System.out.println("val:" + 1111111);
    }
    @Override
    public boolean supportIns(String val) {
        return "ONE".equals(val);
    }
}

class Two extends ConditionTemplate {
    @Override
    public void support() {
        System.out.println("val:" + 2222222);
    }
    @Override
    public boolean supportIns(String val) {
        return "TWO".equals(val);
    }
}

class Three extends ConditionTemplate {
    @Override
    public void support() {
        System.out.println("val:" + 3333333);
    }
    @Override
    public boolean supportIns(String val) {
        return "THREE".equals(val);
    }
}
```

#### 使用工厂方法模式代替if..else
```
public class MyTest {
    public static void main(String[] args) {
        String val = "ONE";
        condition(val);
        System.out.println("--------------");
        newCondition(val);
    }

    public static void condition(String val) {
        if ("ONE".equals(val)) {
            System.out.println("val:" + 1111111);
        } else if ("TWO".equals(val)) {
            System.out.println("val:" + 2222222);
        } else if ("THREE".equals(val)) {
            System.out.println("val:" + 3333333);
        } else {
            System.out.println("val:" + val);
        }
    }

    public static void newCondition(String val) {
         Map<String, ConditionFactory> operationMap = new HashMap<>();
        operationMap.put("ONE",new One());
        operationMap.put("TWO",new Two());
        operationMap.put("THREE",new Three());
        if (operationMap.get(val) == null) {
            System.out.println("val:" + val);
        }else {
            operationMap.get(val).printCondition();
        }
    }

}

interface ConditionFactory{
    void printCondition();
}

class One implements ConditionFactory {
    @Override
    public void printCondition() {
        System.out.println("val:" + 1111111);
    }
}

class Two implements ConditionFactory {
    @Override
    public void printCondition() {
        System.out.println("val:" + 2222222);
    }
}

class Three implements ConditionFactory {
    @Override
    public void printCondition() {
        System.out.println("val:" + 3333333);
    }
}
```

#### 使用注解代替if..else
- https://www.zhihu.com/question/318511891/answer/1730548947

```
@Retention(RetentionPolicy.RUNTIME)  
@Target(ElementType.TYPE)  
public @interface PayCode {  

     String value();    
     String name();  
}
```

```
@PayCode(value = "alia", name = "支付宝支付")  
@Service
public class AliaPay implements IPay {  

     @Override
     public void pay() {  
         System.out.println("===发起支付宝支付===");  
     }  
}  


@PayCode(value = "weixin", name = "微信支付")  
@Service
public class WeixinPay implements IPay {  

     @Override
     public void pay() {  
         System.out.println("===发起微信支付===");  
     }  
} 


@PayCode(value = "jingdong", name = "京东支付")  
@Service
public class JingDongPay implements IPay {  

     @Override
     public void pay() {  
        System.out.println("===发起京东支付===");  
     }  
}
```

```
@Service
public class PayService2 implements ApplicationListener<ContextRefreshedEvent> {  

     private static Map<String, IPay> payMap = null;  

     @Override
     public void onApplicationEvent(ContextRefreshedEvent contextRefreshedEvent) {  
         ApplicationContext applicationContext = contextRefreshedEvent.getApplicationContext();  
         Map<String, Object> beansWithAnnotation = applicationContext.getBeansWithAnnotation(PayCode.class);  

         if (beansWithAnnotation != null) {  
             payMap = new HashMap<>();  
             beansWithAnnotation.forEach((key, value) ->{  
                 String bizType = value.getClass().getAnnotation(PayCode.class).value();  
                 payMap.put(bizType, (IPay) value);  
             });  
         }  
     }  

     public void pay(String code) {  
        payMap.get(code).pay();  
     }  
}
```





