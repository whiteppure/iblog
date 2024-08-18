---
title: "transient关键字详解"
date: 2024-08-18
draft: false
tags: ["Java", "关键字","详解"]
slug: "java-keyword-transient"
---

## transient
transient关键字在Java中用于声明一个类的成员变量，它表示该变量不应被序列化。当对象序列化时，该字段不会被持久化到目标字节流中。也就是说，使用transient修饰的字段在序列化过程中将被忽略，反序列化时这些字段会被初始化为默认值，基本数据类型为0，引用类型为null。

这对于敏感信息或不需要持久化的数据非常有用。比如说用户的一些敏感信息，如密码、银行卡号等，为了安全起见，不希望在网络操作中传输或者持久化到磁盘文件中，那这些字段就可以加上transient关键字。
通过避免不必要的数据序列化尤其是一些内存较大的字段，可以减少序列化和反序列化的时间、内存和存储空间消耗，提升性能。

### 使用示例
一旦字段被transient修饰，成员变量将不再是对象持久化的一部分，该变量的值在序列化后无法访问。
transient只能用于类的成员变量，不能用于方法、局部变量或类，这使得它的应用范围相对有限。
```java
public class User implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String username;
    private transient String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    @Override
    public String toString() {
        return "User{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}


public class Main {
    public static void main(String[] args) {
        User user = new User("JohnDoe", "password123");

        // 序列化
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("user.ser"))) {
            oos.writeObject(user);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 反序列化
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("user.ser"))) {
            User deserializedUser = (User) ois.readObject();
            // User{username='JohnDoe', password='null'}
            System.out.println(deserializedUser);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```
被transient关键字修饰的字段不能被序列化，但是一个静态变量不管是否被transient修饰，均不能被序列化。
这是因为static字段属于类而不是某个具体的对象，序列化是对象级别的操作，它保存的是对象的实例状态，而static字段是类级别的状态，不属于任何具体对象，因此在序列化过程中被忽略。
```java
class Example implements Serializable {
    private static final long serialVersionUID = 1L;

    private int instanceVar;
    private static int staticVar = 100; // static字段

    public Example(int instanceVar) {
        this.instanceVar = instanceVar;
    }

    @Override
    public String toString() {
        return "Example{" +
                "instanceVar=" + instanceVar +
                ", staticVar=" + staticVar +
                '}';
    }
}

public class Main {
    public static void main(String[] args) {
        Example example = new Example(42);

        // 序列化
        try (ObjectOutputStream oos = new ObjectOutputStream(new FileOutputStream("example.ser"))) {
            oos.writeObject(example);
        } catch (IOException e) {
            e.printStackTrace();
        }

        // 修改 static 字段的值
        Example.staticVar = 200;

        // 反序列化
        try (ObjectInputStream ois = new ObjectInputStream(new FileInputStream("example.ser"))) {
            Example deserializedExample = (Example) ois.readObject();
            System.out.println(deserializedExample);
        } catch (IOException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}
```

### transient与序列化
在Java中，对象的序列化可以通过实现两种接口来实现，如果实现的是`Serializable`接口，则所有的序列化将会自动进行。
如果实现的是`Externalizable`接口，则需要在`writeExternal`方法中指定要序列化的字段，与transient关键字修饰无关。
```java
class Employee implements Externalizable {
    private String name;
    private transient int age; // `transient` 在 `Externalizable` 中不起作用

    public Employee() {} // 无参构造函数必须存在

    public Employee(String name, int age) {
        this.name = name;
        this.age = age;
    }

    @Override
    public void writeExternal(ObjectOutput out) throws IOException {
        out.writeObject(name);
        out.writeInt(age); // 手动指定要序列化的字段
    }

    @Override
    public void readExternal(ObjectInput in) throws IOException, ClassNotFoundException {
        name = (String) in.readObject();
        age = in.readInt(); // 手动指定如何反序列化
    }
}
```
`Serializable`是Java标准库提供的接口，而`Externalizable`是`Serializable`的子接口。
使用`Externalizable`接口需要实现`readExternal`和`writeExternal`方法，需要手动完成序列化和反序列化的过程。
因为需要手动完成，所以`Externalizable`接口提供了更高的序列化控制能力，可以在序列化和反序列化过程中对对象进行自定义的处理，如对一些敏感信息进行加密和解密。

### transient底层原理
transient译为“临时的”，它可以阻止字段被序列化到文件中，在被反序列化后，transient字段的值被设为初始值，比如int型的初始值为0，对象型的初始值为null。
static和transient修饰的字段是不会被序列化的，在序列化底层代码中可以看到相关源代码`ObjectStreamClass`方法：
```java
private static ObjectStreamField[] getDefaultSerialFields(Class<?> cl) {
    // 获取该类中声明的所有字段
    Field[] clFields = cl.getDeclaredFields();
    ArrayList<ObjectStreamField> list = new ArrayList<>();
    int mask = Modifier.STATIC | Modifier.TRANSIENT;

    // 遍历所有字段，将非 static 和 transient 的字段添加到 list 中
    for (int i = 0; i < clFields.length; i++) {
        Field field = clFields[i];
        int mods = field.getModifiers();
        if ((mods & mask) == 0) {
            // 根据字段名、字段类型和字段是否可序列化创建一个 ObjectStreamField 对象
            ObjectStreamField osf = new ObjectStreamField(field.getName(), field.getType(), !Serializable.class.isAssignableFrom(cl));
            list.add(osf);
        }
    }

    int size = list.size();
    // 如果 list 为空，则返回一个空的 ObjectStreamField 数组，否则将 list 转换为 ObjectStreamField 数组并返回
    return (size == 0) ? NO_FIELDS :
        list.toArray(new ObjectStreamField[size]);
}
```
当一个类中的字段被标记为 transient，Java的序列化机制在序列化对象时，会忽略这些transient字段。具体来说，序列化过程中会跳过这些字段，不将其写入到对象的字节流中。
```java
int mask = Modifier.STATIC | Modifier.TRANSIENT;
```
这段代码表明，这两个修饰符标记的字段就没有被放入到序列化的字段中。
