---
title: "Java对象复制：深拷贝 vs 浅拷贝"
date: 2025-02-16
draft: false
tags: ["Java小课堂","Java","随笔"]
slug: "java-object-replication"
---


# 如何复制对象
在实际开发过程中，对象的复制与转换是非常常见且重要的操作。这类操作通常出现在不同层之间的数据传递或转换中，例如将数据传输对象（DTO）转换为持久化对象（PO），或是将持久化对象（PO）转化为视图对象（VO）。数据转换有助于隔离各层之间的业务逻辑，避免不同层之间的紧耦合，同时优化代码的可维护性和可扩展性，提升模块或系统之间的数据兼容性。

## 方案选型
要想复制一个对象，需要实现`Cloneable`接口，然后重写`clone()`方法。至于你想要怎么克隆，是深克隆还是浅克隆，关键是你这个`clone()`方法怎么写。虽然`Cloneable`和`clone()`方法在Java中是标准的浅拷贝方式，但它们在实际开发中不太常用。主要是因为使用`clone()`方法来拷贝一个对象即复杂又有风险，它会抛出异常，并且还需要类型转换。

实际开发中，对象转换通常依赖于第三方类库（如`BeanUtils`），不过这种方式大多是浅拷贝，适用于简单的属性复制。对于更复杂的需求，常见的转换方式包括手动映射、工具类辅助转换，或使用框架（如`MapStruct`、`ModelMapper`）来实现自动化处理。手动映射虽然能够提供更细粒度的控制，但在字段较多或逻辑复杂时，可能导致代码冗长且不易维护。自动化框架则能简化转换过程，尤其是在涉及复杂的类型转换、字段过滤或自定义映射规则时，能够有效提升数据转换的准确性与一致性。

| 方案               | 拷贝类型        | 核心特点                              | 优点                          | 缺点                          | 适用场景                  |
|--------------------|----------------|-------------------------------------|-------------------------------|-------------------------------|--------------------------|
| **Cloneable接口**  | 浅拷贝/可扩展深拷贝 | 原生支持，需手动实现递归逻辑          | ✅ 零依赖<br>✅ 完全控制复制过程 | ❌ 侵入性强<br>❌ 需处理嵌套对象 | 简单POJO对象的自定义复制  |
| **BeanUtils工具**  | 纯浅拷贝        | 基于反射的字段复制                    | ⚡ 快速实现字段映射<br>📦 Spring生态集成 | 🚫 仅支持浅拷贝<br>🐌 反射性能损耗 | DTO/VO的快速字段对齐      |
| **MapStruct框架**  | 可配置深浅拷贝  | 编译期生成映射代码                    | 🚀 接近手写代码的性能<br>🎛️ 支持自定义转换规则 | 📚 需要学习注解配置<br>🔄 需重新编译生效 | 复杂对象的结构化转换      |
| **序列化方案**     | 强制深拷贝      | 通过序列化机制实现完全隔离            | 🔒 绝对数据安全<br>🔗 自动处理循环引用 | ⏳ 性能开销大<br>❗ 必须实现Serializable | 缓存隔离/线程安全数据传递 |

![Java对象复制](/posts/annex/images/essays/Java对象复制.png)

## 浅拷贝
- **特点**：复制对象及基本类型字段，引用类型字段共享内存地址
- **结果**：修改原对象或副本的引用字段会互相影响
- **适用场景**：简单对象DTO转换、缓存复制对象、性能敏感场景

浅拷贝创建一个新对象，这个新对象的字段内容与原对象相同，当字段是基本数据类型时，值被直接复制；但如果字段是引用类型（如数组或其他对象），则只复制引用地址，而不会复制实际的引用对象。
- 对于基本数据类型字段，浅拷贝会将值从原对象复制到新对象。
- 对于引用类型字段，浅拷贝只复制引用地址，因此原对象和新对象的引用类型字段会指向同一个内存地址，修改其中一个对象的引用类型字段内容会影响另一个对象。

浅拷贝举例：
```java
class MyObject implements Cloneable {
    int value;
    int[] array;

    MyObject(int value, int[] array) {
        this.value = value;
        this.array = array;
    }

    @Override
    protected Object clone() throws CloneNotSupportedException {
        return super.clone(); // 浅拷贝
    }

    public static void main(String[] args) {
        try {
            int[] arr = {1, 2, 3};
            MyObject original = new MyObject(42, arr);
            MyObject copy = (MyObject) original.clone();
            original.array[0] = 99;
            System.out.println(copy.array[0]); // 输出 99
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }
}
```

## 深拷贝
- **特点**：完全独立的新对象，递归复制所有引用对象
- **结果**：修改任意对象不会影响其他副本
- **适用场景**：需要完全隔离的场景（如缓存、多线程）

深拷贝是创建一个新对象，该新对象与原对象完全独立。它不仅复制原对象的基本数据类型字段，还递归地复制所有引用类型字段所指向的实际对象，而不是仅复制引用地址。这意味着，深拷贝后的对象和原对象在内存中完全隔离，修改其中一个对象的字段不会影响另一个对象。
- 复制基本类型字段：和浅拷贝一样，深拷贝会复制原对象中所有的基本数据类型字段（如 int、char 等）的值。
- 递归复制引用类型字段：对于引用类型字段（如对象、数组、集合等），深拷贝会递归地创建新的对象，而不仅仅是复制引用地址。这样两个对象的引用类型字段指向不同的内存地址，它们的数据完全独立。
- 完全独立的副本：经过深拷贝后，原对象和新对象在内存中完全独立，修改其中一个对象的内容不会影响另一个对象，避免了引用类型字段的共享问题。

深拷贝举例：
```java
class MyObject implements Cloneable {
    int value;
    int[] array;

    MyObject(int value, int[] array) {
        this.value = value;
        this.array = array;
    }

    @Override
    protected MyObject clone() throws CloneNotSupportedException {
        int[] arrayCopy = array.clone(); // 复制数组
        return new MyObject(value, arrayCopy);
    }

    public static void main(String[] args) {
        try {
            int[] arr = {1, 2, 3};
            MyObject original = new MyObject(42, arr);
            MyObject copy = original.clone();
            original.array[0] = 99;
            System.out.println(copy.array[0]); // 输出 1
        } catch (CloneNotSupportedException e) {
            e.printStackTrace();
        }
    }
}
```

## 使用建议
在开发中**优先考虑浅拷贝**（使用Cloneable接口、BeanUtils工具等），适用于简单对象转换且允许共享引用的场景（如DTO字段映射）。当涉及**多线程共享数据、缓存隔离或嵌套复杂对象**时（如包含集合、自定义对象等），**必须采用深拷贝**（推荐序列化方案或递归克隆），避免数据篡改风险。注意：深拷贝性能开销较大，应避免滥用；对于高频复制的核心对象，建议结合对象池或防御性拷贝策略。

**记住：理解业务需求是选择拷贝方案的第一准则！** 关键原则是：**能浅不深、按需拷贝**——在保证数据安全的前提下选择最高效的实现方式。

**没有完美的拷贝方案，只有最适合场景的选择**，拷贝方式使用场景：
| 典型场景                | 推荐方案                      | 理由说明                  |
|-------------------------|------------------------------|-------------------------|
| DTO/VO转换              | BeanUtils.copyProperties     | 快速简单，字段对齐度高    |
| 简单值对象复制          | Cloneable浅拷贝              | 原生支持，零依赖         |
| 复杂嵌套对象（3层以上） | 序列化深拷贝                  | 避免递归实现的复杂性      |
| 高频复制（>1000次/秒）  | 手动实现Converter接口         | 避免反射性能损耗         |
| 跨线程数据传输          | 完全深拷贝                    | 确保线程安全             |
