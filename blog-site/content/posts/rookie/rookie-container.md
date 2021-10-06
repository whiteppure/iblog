---
title: "Java中的集合"
date: 2021-10-04
draft: false
tags: ["Java", "容器"]
slug: "rookie-java-container"
---

## 概述
Java中的集合主要包括 `Collection` 和 `Map` 两种，`Collection` 存储着对象的集合，而 `Map` 存储着键值对（两个对象）的映射表。

![Java中的集合-01](/iblog/posts/images/essays/Java中的集合-01.jpg)

如果你看过ArrayList类源码，就知道ArrayList底层是通过数组来存储元素的，所以如果严格来说，数组也算集合的一种。

## 数组
Java中提供的数组是用来存储固定大小的同类型元素，所以Java数组就是同类数据元素的集合。

数组是引用数据类型，如果使用了没有开辟空间的数组，则一定会出现`NullPointerException`异常信息。所以数组本质上也是Java对象，能够向下或者向上转型,能使用`instanceof`关键字。
```
// 数组的父类也是Object,可以将a向上转型到Object  
int[] a = new int[8];  
Object obj = a ; 

// 可以进行向下转型 
int[] b = (int[])obj;  

// 可以用instanceof关键字进行类型判定 
if(obj instanceof int[]){ 
}
```

### 优缺点
数组优点:
- 数组元素的内存地址是连续分配的，所以通过下标访问元素的效率很高，可以快速找到指定下标为n的元素的地址；

数组缺点:
- 数组一旦初始化之后长度是固定的不能变的；
- 数组进行元素的删除和插入操作的时候，效率比较低,需要移动大量的元素，这里是相对链表来说；
- 数组元素的类型只能是一种；
- 数组元素的内存地址是连续分配的,对内存要求高一些;相对于链表结构比较,链表的内存是连续不连续都可以；
数组的优点是效率高，但为此，所付出的代价就是数组对象的大小被固定。这也使得在工作中，数组并不实用。所以我们应该优选容器，而不是数组。只有在已证明性能成为问题的时候，并且确定切换到数组对性能提高有帮助时，才应该将项目重构为使用数组。

### 操作数组
由于数组没有提供任何的封装，所有对元素的操作，都是通过自定义的方法实现的，对数组元素的操作比较麻烦，好在Java自带了一些API供开发者调用。

#### 定义数组
```
 int[] array1 = { 1,2,3,4,5 }; 
 int[] array2 = new int[10];
 int[] array3 = new int[]{ 1,2,3,4,5 };
```
需要注意的是[],写在数组名称的前后都可以,但是推荐第一种写法：
```
  int[] array1 = { 1,2,3,4,5 };
  int array2[] = { 1,2,3,4,5 };
```

#### 遍历数组
````
 for (int i = 0; i < array1.length; i++) {
       System.out.println(array1[i]);
}
````

#### 数组去重
````
// 最简单方法，利用 hashSet 集合去重
Set<Integer> set2 = new HashSet<Integer>();
for (int i = 0; i < arr11.length; i++) {
    set2.add(arr11[i]);
}
````

#### 数组与集合转换
```
// 数组转成set集合
Set<String> set = new HashSet<String>(Arrays.asList(array2));

// 数组转list 
List<String > list2 = Arrays.asList(array);
```

#### 数组排序
```
 // 原生方法 或 8种排序算法
 Arrays.sort(arr);
```

#### 复制数组
```
// 待复制的数组
int[] arr = {1, 2, 3, 4};

// 指定新数组的长度
int[] arr2 = Arrays.copyOf(arr, 10);

// 只复制从索引[1]到索引[3]之间的元素（不包括索引[3]的元素）
int[] arr3 = Arrays.copyOfRange(arr, 1, 3);
```

## Collection


### List
### Set
### Queue

## Map
### HashMap

## 集合与数组的比较