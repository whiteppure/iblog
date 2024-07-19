---
title: "Java运算"
date: 2021-01-30
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-operation"
---

## 运算符与表达式

### 运算符
运算符指明对操作数的运算方式。组成表达式的Java操作符有很多种。
运算符按照其要求的操作数数目来分，可以有单目运算符、双目运算符和三目运算符，它们分别对应于1个、2个、3个操作数。
按其功能来分，可以有算术运算符、赋值运算符、比较(关系)运算符、逻辑运算符、位运算符和其他运算符。

#### 算术运算符
| 运算符 | 名称   | 用法描述              | 备注               | 示例                  |
|--------|-------|----------------------|--------------------|-----------------------|
| +      | 加法   | 相加运算符两侧的值    |                    | `int sum = 5 + 3;`     |
| -      | 减法   | 左操作数减去右操作数  |                    | `int difference = 5 - 3;` |
| *      | 乘法   | 相乘操作符两侧的值    |                    | `int product = 5 * 3;` |
| /      | 除法   | 左操作数除以右操作数  | 右操作数不能为0    | `int quotient = 10 / 2;` |
| %      | 取余   | 左操作数除以右操作数的余数 |                  | `int remainder = 10 % 3;` |
| ++     | 自增   | 操作数的值增加1       |                    | `int a = 5; a++;`      |
| --     | 自减   | 操作数的值减少1       |                    | `int a = 5; a--;`      |

关于取余，如果被取余的数小于取余的数，那取余的结果就是被除数，例如，`4%5=4`、`3%5=3`；
如果被取余的数等于取余的数，结果是0，例如，`5%5=0`；
如果取余数是1，结果是0，例如，`9%1=0`。

当使用随机数生成器产生的结果时，取余运算可将结果限制在上限为操作数最大值减1的范围。
例如：n是随机数，那么`n%10`就是`0~9`中的一个数。无论n是多大的数，`n%10`只能是`0~9`之间的一个数，利用这一特性，可以应用在数据库分库、分表等。

对于自增和自减，需要特别留意的是`++`和`--`运算符可以前置、后置，都是合法的语句，如`a++`和`++a`都是合法的，上面这两种写法其最终的结果都是是变量a的值加1了，但是它们之间也是有区别的。
其区别是：表达是`++a`会先将a的值自增1，然后在使用变量a，而表达式`a++`是先使用了a的值，然后再让a的值自增1。也就是说在一些表达式，使用`a++`和使用`++a`得到的结果时不一样的，例如：
```java
public static void main(String[] args) {
    int i = 1;
    System.out.println(i++);// 1
    System.out.println(++i);// 3
}
```
`++`和`--`两个运算符只能作用于变量，而不能作用于表达式，例如：
```java
public static void main(String[] args) {
    int j = 0, i = 1;
    // 编译报错
    System.out.println((j+i)++);
}
```

#### 赋值运算符
| 运算符 | 名称 | 用法描述 | 示例 |
|-------|---|---|---|
| =     | 赋值 | 将右操作数的值赋给左侧操作数 | `int a = 5;` |
| +=    | 加等于 | 把左操作数和右操作数相加赋值给左操作数 | `int b = 3; b += 2;` |
| -=    | 减等于 | 把左操作数和右操作数相减赋值给左操作数 | `int c = 7; c -= 4;` |
| *=    | 乘等于 | 把左操作数和右操作数相乘赋值给左操作数 | `int d = 2; d *= 3;` |
| /=    | 除等于 | 把左操作数和右操作数相除赋值给左操作数 | `int e = 10; e /= 2;` |
| %=    | 模等于 | 把左操作数和右操作数取模后赋值给左操作数 | `int f = 10; f %= 3;` |
| <<=   | 左位移等于 | 把左操作数和右操作数进行左移运算后赋值给左操作数 | `int g = 8; g <<= 2;` |
| >>=   | 右位移等于 | 把左操作数和右操作数进行右移运算后赋值给左操作数 | `int h = 16; h >>= 2;` |
| &=    | 按位与等于 | 把左操作数和右操作数进行按位与运算后赋值给左操作数 | `int i = 5; i &= 3;` |
| &#124;= | 按位或等于 | 把左操作数和右操作数进行按位或运算后赋值给左操作数 | `int j = 5; j &#124;= 3;` |
| ^=    | 异或等于 | 把左操作数和右操作数进行按位异或运算后赋值给左操作数 | `int k = 5; k ^= 3;` |

在进行复合赋值运算时，Java会自动进行类型转换。
例如，如果左操作数是一个较小的数据类型，而右操作数是一个较大的数据类型，则右操作数会被自动转换为左操作数的类型，然后进行运算。
```java
byte a = 10;
a += 5; // 合法，等同于 a = (byte)(a + 5);
```
复合赋值运算符是原子操作，即它们是一个完整的、不可分割的操作，不会被中断或其他线程干扰。
对于数值型数据，特别是整数类型，需要注意复合赋值运算符可能导致的溢出问题。
```java
byte b = 127;
b += 1; // b 现在是 -128，发生了溢出
```

#### 比较运算符
比较运算符也称为关系运算符，用于展示两个操作数之间的关系。
使用比较运算符表达式的最终结果为`boolean`型，也就是其结果只有两个`true`和`false`。

| 运算符 | 名称   | 用法描述                           | 示例                        |
|--------|-------|-----------------------------------|-----------------------------|
| ==     | 双等号 | 检查两个操作数的值是否相等         | `boolean isEqual = (5 == 5);` |
| !=     | 不等号 | 检查两个操作数的值是否不相等       | `boolean notEqual = (5 != 3);` |
| >      | 大于   | 检查左操作数的值是否大于右操作数   | `boolean greaterThan = (5 > 3);` |
| <      | 小于   | 检查左操作数的值是否小于右操作数   | `boolean lessThan = (5 < 3);` |
| >=     | 大于等于 | 检查左操作数的值是否大于或等于右操作数 | `boolean greaterOrEqual = (5 >= 5);` |
| <=     | 小于等于 | 检查左操作数的值是否小于或等于右操作数 | `boolean lessOrEqual = (5 <= 5);` |


#### 逻辑运算符
| 运算符 | 名称   | 用法描述                        | 示例                                  |
|--------|-------|--------------------------------|---------------------------------------|
| &&     | 逻辑与 | 当且仅当两个操作数都为真时，条件为真 | `boolean result = (true && false);`    |
| \|\|   | 逻辑或 | 如果两个操作数任何一个为真时，条件为真 | `boolean result = (true \|\| false);`  |
| !      | 逻辑非 | 用来反转操作数的逻辑状态，条件取反 | `boolean result = !true;`              |

`&&`运算符，运算顺序是从左到右计算，运算规则是如果两个操作数都是真，则返回`true`，否则返回`false`。
但是当判定到第一个操作数为`false`时，其结果必定为`false`，这时候就不再会判定第二个操作数了。
这种特性可以在复杂条件语句中提高效率，并可以避免不必要的计算。
```java
public static void main(String[] args) {
    int i = 1, j = 2;
    boolean flag = (i++ == 2) && (++j == 3);
    // flag的值: false,i的值:2,j的值:2
    System.out.printf("flag的值: %s,i的值:%s,j的值:%s", flag, i, j);
}
```
在使用逻辑运算符时，特别是在复杂的条件逻辑中，尽量保证逻辑表达式的意图清晰，建议使用括号明确运算顺序。

#### 位运算符
位运算符在追求代码效率和编写底层应用时，使用的比较多，在企业Java开发一般用到的较少。

| 运算符 | 名称   | 用法描述                           | 示例                               |
|--------|-------|-----------------------------------|------------------------------------|
| &      | 按位与 | 如果相对应位都是1，则结果为1，否则为0 | `int result = 5 & 3;`               |
| \|     | 按位或 | 如果相对应位都是0，则结果为0，否则为1 | `int result = 5 \| 3;`              |
| ^      | 按位异或 | 如果相对应位值相同，则结果为0，否则为1 | `int result = 5 ^ 3;`              |
| ~      | 按位取反 | 翻转操作数的每一位，即0变成1，1变成0 | `int result = ~5;`                 |
| <<     | 左移   | 左操作数按位左移右操作数指定的位数    | `int result = 5 << 2;`             |
| >>     | 右移   | 左操作数按位右移右操作数指定的位数    | `int result = 5 >> 2;`             |
| >>>    | 无符号右移 | 左操作数的值按右操作数指定的位数右移，移动得到的空位以零填充 | `int result = 5 >>> 2;`           |

一些小技巧：
- `>>`：右移几位就是相当于除以2的几次幂；
- `<<`：左移几位就是相当于乘以2的几次幂；
- `%`：当b为2的n次方时，有如下替换公式：`a % b = a & (b-1)`；

位运算符只能对整数型(`int`、`long`、`short`、`byte`)和字符型数据(`char`)进行操作。
因为位运算符是以`bit`运算单位的，所以想要弄明白位运算符，就要先弄明白二进制的表示方法。

以下示例用十进制的1和2进行运算，1用二进制表示为`0000 0001`，2用二进制表示为`0000 0010`，为了更好的理解位运算，下面我会详细解析：
- `&`：如果相对应位都是1，则结果为1，否则为0；
  ```
  0000 0001
  0000 0010
  ——————————
  0000 0000
  ```
- `|`：如果相对应位都是 0，则结果为 0，否则为 1；
  ```
  0000 0001
  0000 0010
  ——————————
  0000 0011
  ```
- `^`：如果相对应位值相同，则结果为0，否则为1；
  ```
  0000 0001
  0000 0010
  ——————————
  0000 0011
  ```
- `~`：翻转操作数的每一位，即0变成1，1变成0；
  ```
  0000 0011
  ——————————
  1111 1100
  ```
- `<<`：左操作数按位左移右操作数指定的位数，如1左移两位：
  ```
  0000 0001
  ——————————
  0000 0100
  ```
- `>>`：左操作数按位右移右操作数指定的位数；（正数右移高位补0，负数右移高位补1）
  1右移两位：
  ```
  0000 0001
  ——————————
  0000 0000
  ```
  负一右移两位：
  ```
  1111 1111
  ——————————
  1111 1111
  ```
- `>>>`：左操作数的值按右操作数指定的位数右移，移动得到的空位以零填充；（无符号右移，无论是正数还是负数，高位通通补0）
  1无符号右移两位：
  ```
  0000 0001
  ——————————
  0000 0000
  ```
  负一无符号右移两位：
  ```
  1111 1111
  ——————————
  0011 1111
  ```

#### 三目运算符
该运算符有3个操作数，其功能是对表达式条件进行判断，根据判断结果是`true`或者`false`两种情况赋予赋予不同的返回值。

该运算符的主要是决定哪个值应该赋值给变量。在某些情况下，可以发现三目运算符和`if...else`作用是相同的，可以完全替代`if...else`。
三目运算符可以使代码更加简洁和可读，特别是在简单的条件赋值或返回语句中，但应该尽量避免过多的嵌套三目运算符，以免降低代码的可读性。
```java
    public static void main(String[] args) {
        int var1 = 1;
        int var2 = 0;
        var1 = var2 > 1 ?  1: 2;
        
        // 等价于if...else以下代码
        if (var2 > 1) {
            var1 = 1;
        }else {
            var1 = 2;
        }
    }
```

那么三目运算符与`if...else`到底哪有啥不同？要探究这个原因，需要看JVM是对三目运算符怎么处理的。
用`javap -verbose`命令，分别把`if...else`和三目运算符相关代码进行反编译：
```java
public static void main(String[] args) {
    int var1 = 1;
    int var2 = 0;
    // 如果var2大于1 则var1等于1 否则等于2
    var1 = var2 > 1 ?  1: 2;
}
```
```
  // ...
{
 // ...
  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=3, args_size=1
         0: iconst_1 // 向栈里添加int类型 1
         1: istore_1 // 将int 1 存储到局部变量
         2: iconst_0 // 向栈里添加int类型 0
         3: istore_2 // 将int 2 存储到局部变量
         4: iload_2  // 从局部变量加载int 2
         5: iconst_1
         6: if_icmple     13  // 将1,3步骤栈中的变量弹出 进行比较
         9: iconst_1 // 比较成功 存储该值到栈中
        10: goto          14 // 改变地址
        13: iconst_2
        14: istore_1
        15: return
      LineNumberTable:
        line 6: 0
        line 7: 2
        line 8: 4
        line 9: 15
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      16     0  args   [Ljava/lang/String;
            2      14     1  var1   I
            4      12     2  var2   I
      StackMapTable: number_of_entries = 2
        frame_type = 253 /* append */
          offset_delta = 13
          locals = [ int, int ]
        frame_type = 64 /* same_locals_1_stack_item */
          stack = [ int ]
}
// ...
```
```java
  public static void main(String[] args) {
      int var1 = 1;
      int var2 = 0;
      if (var2 > 1){
          var1 = 1;
      } else {
          var1 = 2;
      }
  }
```
```class
  // ...
  public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC
    Code:
      stack=2, locals=3, args_size=1
         0: iconst_1
         1: istore_1
         2: iconst_0
         3: istore_2
         4: iload_2
         5: iconst_1
         6: if_icmple     14
         9: iconst_1
        10: istore_1
        11: goto          16
        14: iconst_2
        15: istore_1
        16: return
      LineNumberTable:
        line 6: 0
        line 7: 2
        line 8: 4
        line 9: 9
        line 11: 14
        line 13: 16
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      17     0  args   [Ljava/lang/String;
            2      15     1  var1   I
            4      13     2  var2   I
      StackMapTable: number_of_entries = 2
        frame_type = 253 /* append */
          offset_delta = 14
          locals = [ int, int ]
        frame_type = 1 /* same */
}
// ...
```

通过查阅[《Java虚拟机指令集》](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html)，在参照上面反编译的字节码反编译的内容，可以看到JVM对上边的代码进行了什么处理。
通过比较两次反编译后的代码可以得出一个结论，即三目运算符与`if..else`执行的命令几乎没有差异。
但是对于实际开发来说三目运算符的可读性相对不如`if...else`代码，所以在常见的编码中，三目运算符更倾向于简单的`if...else`语句的替代。

#### instanceof
`instanceof`是一个双目运算符，该关键字的作用是判断左边的对象是不是右边类的实例，并返回一个`boolean`值。
`instanceof`可以用来检查对象的类型，包括检查对象是否是其直接类的实例或者其父类的实例，或实现了某个接口。
在实际开发中经常用于在运行时动态确定对象的类型，从而决定如何处理对象或执行特定的逻辑。
```java
class Animal { }
class Dog extends Animal { }

public class Main {
    public static void main(String[] args) {
        Animal animal = new Dog();

        // 判断 animal 是否是 Animal 类的实例
        boolean isAnimal = animal instanceof Animal;
        System.out.println("Is animal an instance of Animal? " + isAnimal); // 输出：true

        // 判断 animal 是否是 Dog 类的实例
        boolean isDog = animal instanceof Dog;
        System.out.println("Is animal an instance of Dog? " + isDog); // 输出：true

        // 判断 animal 是否是 Object 类的实例
        boolean isObject = animal instanceof Object;
        System.out.println("Is animal an instance of Object? " + isObject); // 输出：true
    }
}
```

#### 运算顺序
Java语言中运算符的优先级共分为14级，其中1级最高，14级最低，在同一个表达式中运算符优先级高的先执行。
Java中大部分运算符也是从左向右结合的，只有单目运算符、赋值运算符、三目运算符例外，是从右向左运算的。

| 优先级 | 运算符                                           |  结合性  |
| :----: | ------------------------------------------------ | :------: |
|   1    | ()、[]                                     | 从左向右 |
|   2    | !、+、-、~、++、--                               | 从右向左 |
|   3    | *、/、%                                          | 从左向右 |
|   4    | +、-                                             | 从左向右 |
|   5    | «、»、>>>                                       |  从左向  |
|   6    | <、<=、>、>=、instanceof                         | 从左向右 |
|   7    | ==、!=                                           | 从左向右 |
|   8    | &                                                | 从左向右 |
|   10   | \|                                               | 从左向右 |
|   11   | &&                                               | 从左向右 |
|   12   | \|\|                                             | 从左向右 |
|   13   | ?:                                               | 从右向左 |
|   14   | =、+=、-=、*=、/=、&=、\|=、^=、~=、<<=、>>=、>>>= | 从右向左 |

在实际开发中，不要把一个表达式写得过于复杂。如果一个表达式过于复杂，则会影响代码可读性，建议把它分成几步来完成。
不要过多地依赖运算符的优先级来控制表达式的执行顺序，这样可读性太差，尽量使用小括号来控制表达式的执行顺序，这样能提高代码的可读性和减少歧义。

### 表达式
在Java中表达式通常是以分号结尾的一段代码。
```java
int sum = a + b * c;
int length = str.length();
boolean result = (x > 0) && (y < 10);
int x = 10;
int max = (a > b) ? a : b;
```
表达式是由运算符和运算对象组成的，表达式可以定义为一组变量、常量、运算符等符号的组合，其结构形成一个计算值的过程，换句话说，表达式是用来计算值的一种编程结构。
变量的赋值与计算都离不开表达式，表达式的运算依赖于变量、常量和运算符。

#### 正则表达式
正则表达式，又称规则表达式，英语：`Regular Expression`，在代码中常简写为`regex`、`regexp`或`RE`。
正则表达式通常被用来检索、替换那些符合某个模式(规则)的文本，在众多语言中都可以支持正则表达式，如`Perl`、`PHP`、`Java`、`Python`、`Ruby`等。

正则表达式并不仅限于某一种语言，但是在每种语言中有细微的差别。
例如：在其他语言中，`\\` 表示，在正则表达式中插入一个普通的（字面上的）反斜杠。在Java中，`\\` 表示，插入一个正则表达式的反斜线，所以其后的字符具有特殊的意义。
所以，在其他的语言中，一个反斜杠`\`就足以具有转义的作用，而在Java中正则表达式中则需要有两个反斜杠才能被解析为其他语言中的转义作用。
也可以简单的理解在Java的正则表达式中，两个 `\\` 代表其他语言中的一个`\`，这也就是为什么表示一位数字的正则表达式是 `\\d`，而表示一个普通的反斜杠是 `\\\\`。

正则表达式是由普通字符（如英文字母）以及特殊字符（也称为元字符）组成的文字模式，例如：`String str = "abc^123/?[1,2]";`。
在Java中主要是使用正则表达式处理字符串，Java从jdk1.4开始提供了一个包`java.util.regex`来处理正则表达式。
主要使用`java.util.regex`包中`Pattern`类，`Matcher`类来处理字符串，使用正则表达式示例：
```java
public static void main(String[] args) {
    // 表示匹配以字母a为开头的单词
    String regx = "\\ba\\w*\\b";
    // 将给定的正则表达式编译到具有给定标志的模式中
    Pattern pattern = Pattern.compile(regx);
    // 创建匹配给定输入与此模式的匹配器
    Matcher matcher = pattern.matcher("abcdab cccabcd aaacd");
    int index = 0;
    // 循环 查找与上边正则匹配的字符序列
    while (matcher.find()) {
        // 返回 由以前匹配操作 所匹配的 输入子序列
        String res = matcher.group();
        System.out.println(index + ":" + res);
        index++;
    }
}
```
总的来说，正则表达式是对字符串操作的一种逻辑公式，用事先定义好的一些特定字符、及这些特定字符的组合，组成一个"规则字符串"，这个"规则字符串"用来表达对字符串的一种过滤逻辑。
正则表达式的灵活性、逻辑性和功能性非常的强，可以迅速地用极简单的方式达到字符串的复杂控制，但是对于刚接触的人来说比较晦涩难懂。以下是常用正则表达式：

| 描述                     | 正则表达式                                                                                    |
|--------------------------|-----------------------------------------------------------------------------------------------|
| 是否为数字               | `^[0-9]*$`                                                                                    |
| 是否为n位数数字          | `^\d{n}$`                                                                                     |
| 是否为m-n位的数字        | `^\d{m,n}$`                                                                                   |
| 是否输入至少n位的数字    | `^\d{n,}$`                                                                                    |
| 是否为整数               | `^-?\d+$`                                                                                     |
| 是否为负整数             | `^-[0-9]*[1-9][0-9]*$`                                                                        |
| 是否为正整数             | `^[0-9]*[1-9][0-9]*$`                                                                         |
| 是否为汉字               | `^[\u4e00-\u9fa5]{0,}$`                                                                       |
| 是否为邮箱               | `^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$`                                                 |
| 是否为域名               | `[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?`                            |
| 是否为URL                | `^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$`                                                   |
| 是否为手机号码           | `^(13[0-9]|14[5|7]|15[0-3|5-9]|16[6]|17[0-8]|18[0-9]|19[1|8|9])\d{8}$`                           |
| 是否为固话号码           | `^($$\d{3,4}-)|\d{3.4}-)?\d{7,8}$`                                                              |
| 是否为身份证号码         | `^(\d{15}|\d{18}|\d{17}(X|x))$`                                                                 |
| 是否为日期（YYYY-MM-DD） | `^\d{4}-\d{2}-\d{2}$`                                                                         |
| 是否为时间（HH:MM:SS）    | `^\d{2}:\d{2}:\d{2}$`                                                                         |
| 是否为十六进制颜色码      | `^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$`                                                           |
| 是否包含HTML标签         | `<("[^"]*"|'[^']*'|[^'">])*>`                                                                  |
| 是否为金额（带小数点的数字） | `^\d+(\.\d{1,2})?$`                                                                           |
| 是否为UUID               | `^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$`               |

#### Lambda表达式
`Lambda`表达式是Java 8引入的一项重要功能，用于简化实现接口中单个抽象方法的类的写法，使代码更加简洁和易读。
`Lambda`表达式可以看作是匿名函数，可以在没有声明其所属类的情况下创建函数对象。

`Lambda`表达式的基本语法如下：
```java
Consumer<String> consumer = (s) -> System.out.println(s);
```
- 参数列表：`(s)`为参数，类似于方法的参数；
- 箭头符号：`->`，用于分隔参数和方法体；
- 方法体：`System.out.println(s)`为方法体，方法体可以是一个表达式或一个代码块；

`Lambda`表达式通常用于替代匿名类：
```java
// 使用匿名类
Comparator<String> comparator = new Comparator<String>() {
  @Override
  public int compare(String s1, String s2) {
    return s1.compareTo(s2);
  }
};

// 使用Lambda表达式
Comparator<String> comparatorLambda = (s1, s2) -> s1.compareTo(s2);
```

`Lambda`在开发中最常用的就是集合中`Stream`流，举例：
```java
List<String> list = Arrays.asList("a", "b", "c");

// 使用forEach方法
list.forEach(item -> System.out.println(item));

// 使用stream API进行过滤和排序
List<String> filteredList = list.stream()
                                .filter(s -> s.startsWith("a"))
                                .sorted((s1, s2) -> s1.compareTo(s2))
                                .collect(Collectors.toList());
```

Java 8引入了许多函数式接口，这些接口在`java.util.function`包中定义，常用的函数式接口包括：
- `Consumer<T>`：`Consumer`接口表示接受一个输入参数并且不返回结果的操作，它通常用于对单个参数执行某种操作；
  ```java
  void accept(T t);
  ```
  ```java
  public class ConsumerExample {
      public static void main(String[] args) {
          Consumer<String> printer = s -> System.out.println(s);
          printer.accept("Hello, World!");  // 输出：Hello, World!
      }
  }
  ```
- `Supplier<T>`：`Supplier`接口表示提供一个结果的供应商，无输入参数，它通常用于提供或生成某种值；
  ```java
  T get();
  ```
  ```java
  public class SupplierExample {
      public static void main(String[] args) {
          Supplier<String> supplier = () -> "Hello, Supplier!";
          System.out.println(supplier.get());  // 输出：Hello, Supplier!
      }
  }
  ```
- `Function<T, R>`：`Function`接口表示接受一个输入参数并返回一个结果的函数，它通常用于将输入转换为输出；
  ```java
  R apply(T t);
  ```
  ```java
  public class FunctionExample {
      public static void main(String[] args) {
          Function<String, Integer> lengthFunction = s -> s.length();
          System.out.println(lengthFunction.apply("Hello"));  // 输出：5
      }
  }
  ```
- `Predicate<T>`：`Predicate`接口表示一个接受单个参数并返回布尔值的断言，它通常用于条件判断；
  ```java
  boolean test(T t);
  ```
  ```java
  public class PredicateExample {
      public static void main(String[] args) {
          Predicate<String> isEmpty = s -> s.isEmpty();
          System.out.println(isEmpty.test(""));  // 输出：true
          System.out.println(isEmpty.test("Hello"));  // 输出：false
      }
  }
  ```
在`Lambda`表达式中，方法的引用也发生了变化，使用`::`操作符，主要有四种类型：
- 引用静态方法；
  ```java
  Consumer<List<Integer>> sort = Collections::sort;
  ```
- 引用实例方法；
  ```java
  String str = "Hello";
  Predicate<String> equals = str::equals;
  ```
- 引用对象的实例方法；
  ```java
  Function<String, Integer> length = String::length;
  ```
- 引用构造函数；
  ```java
  Supplier<List<String>> listSupplier = ArrayList::new;
  ```

## 控制流语句

### if-else语句
`if`语句是最基本的控制语句，它只有在`if(exception)`为`true`的时候才会执行特定的代码。
```java
public static void main(String[] args) {
    boolean var1 = true;
    if (var1){
        System.out.println("hello world ...");
    }
}
```

`if`语句后面可以跟`else`语句，当`if(exception)`为`false`时，`else`语句体将被执行。
```java
public static void main(String[] args) {
    boolean var1 = false;
    if (var1){
        System.out.println("if ...");
    }else{
        System.out.println("else ...");
    }
}
```

`if`语句后面可以跟`else-if-else`语句：
```java
public class HelloWorld {
    public static void main(String[] args) {
        String var = "123";
        if ("123".equals(var)){
            System.out.println("123 ...");
        }else if("234".equals(var)){
            System.out.println("234 ...");
        }else if ("345".equals(var)){
            System.out.println("345 ...");
        }else{
            System.out.println("...");
        }
    }
}
```

### switch语句
`switch`语句在项目开发中比较常用，可以和`if-else`实现相同的功能，但使用`switch`语句可以提高代码的可读性。

`switch-case`语句用于判断一个变量是否等于一系列值中的某个值，每个值称为一个分支。
`switch`语句还可以包含一个`default`分支，当没有任何`case`分支的值与变量值相等时，`default`分支的代码将被执行。
```java
public static void main(String[] args) {
    String s = "123";
    switch (s) {
        case "123":
            System.out.println("123");
            break;
        case "456":
            System.out.println("456");
            break;
         default :
            System.out.println("over ...");
    }
}   
```

当变量的值与`case`语句的值相等时，那么`case`语句之后的语句开始执行，直到`break`语句出现，才会跳出`switch`语句。
如果没有`break`语句出现，程序会继续执行下一条`case`语句，直到出现`break`语句，需要注意的是，`default`分支不需要`break`语句。
```java
public static void main(String[] args) {
      int i = 100;
      switch (i){
          case 100:
              System.out.println("first case ...");
          case 200:
              System.out.println("second case ...");
              break;
      }
}
```

`switch`语句中的变量类型可以是，`byte`、`short`、`int`、`char`或者`enum`，从Java7开始，可以在`switch`条件判断语句中使用`String`对象。
`switch`不支持`long`，是因为`switch`的设计初衷是对那些只有少数的几个值进行等值判断，如果值过于复杂，那么还是用`if`比较合适。


### for语句
for语句提供了一种紧凑的方法来遍历一系列值。因为它反复循环直到满足特定条件，程序员经常将其称为“for循环”。
for循环执行的次数是在执行前就确定的，for语句的一般形式可以表示为：
```java
public static void main(String[] args) {
    for (int i = 0; i < 100; i++) {
        System.out.println(i);
    }
}
```

for循环的三个表达式是可选的，例如可以这样创建一个无限循环：
```
for(;;){
    // to do ...
}
```

`foreach`语句是Java5的新特征之一，在遍历数组、集合方面，为开发人员提供了极大的方便。
```java
public static void main(String[] args) {
    String[] arr = {"1", "2", "3"};
    ArrayList<String> list = new ArrayList<>(Arrays.asList(arr));
    for (String s : list) {
        System.out.println(s);
    }
    for (String s : arr) {
        System.out.println(s);
    }
}
```

在for循环中，`可以使用continue`语句用来结束当前循环，并进入下一次循环。
注意仅仅这一次循环结束了，不是所有循环结束了，后边的循环依旧进行。
```java
public static void main(String[] args) {
    String[] arr = {"1", "2", "3"};
    for (String s : arr) {
        // 如果s等于1,则结束本次循环 执行下次循环
        if ("1".equals(s)) {
            continue;
        }
        System.out.println("...");
    }
}
```

`break`语句作用是跳出循环，`break`主要用在循环语句或者`switch`语句中。
```java
public class HelloWorld {
    public static void main(String[] args) {
        String[] arr = {"1", "2", "3"};
        for (String s : arr) {
            // s等于2,结束for循环
            if ("2".equals(s)) {
                break;
            }
            System.out.println("...");
        }
    }

}
```
如果存在多层循环，要注意`break`只能跳出一层循环，而不能结束多层循环。
```java
public static void main(String[] args) {
    String[] arr = {"1", "2", "3"};
    for (int i = 0; i < 10; i++) {
        for (String s : arr) {
            if ("2".equals(s)) {
                break;
            }
            System.out.println("...");
        }
        System.out.println("外层 for ...");
    }
}
```

如果想要跳出多层循环，可以用以下方式，当然也可以用`break`跳两次循环。
```java
public static void main(String[] args) {
    String[] arr = {"1", "2", "3"};
    
    test:
    for (int i = 0; i < 10; i++) {
        for (String s : arr) {
            if ("2".equals(s)) {
                break test;
            }
            System.out.println("...");
        }
        System.out.println("外层 for ...");
    }
}
```
`continue`也可以用上面的这种方式。
```java
public static void main(String[] args) {
    String[] arr = {"1", "2", "3"};

    test:
    for (int i = 0; i < 10; i++) {
        for (String s : arr) {
            if ("1".equals(s)) {
                continue test;
            }
        }
        System.out.println("外层 for ...");
    }
}
```

`return`语句表示从当前方法退出，控制流返回到调用方法的地方。
```java
public static void main(String[] args) {
    String[] arr = {"1", "2", "3"};

    for (int i = 0; i < 10; i++) {
        for (String s : arr) {
            if ("1".equals(s)) {
                return;
            }
        }
        System.out.println("外层 for ...");
    }
}
```
`return`语句有两种形式，一种返回值，另一种不返回值。
要返回一个值，只需将值(或计算该值的表达式)放在`return`关键字之后即可，像这样`return ++count;`。

### do-while和while语句
`while`语句对表达式进行计算，表达式必须返回一个布尔值。如果表达式的计算结果为`true`,`while`语句将执行`while`块中的语句。
`while`语句继续测试表达式并执行其块，直到表达式的计算结果为`false`。
```java
public static void main(String[] args) {
    int i = 0;
   while(++i >= 1){
       i--;
    }
}
```

`do-while`循环和`while`循环相似。对于`while`循环如果条件一开始不满足，循环体可能一次也不会执行，而`do-while`循环它会先执行一次循环体，然后再检查条件。
```java
public static void main(String[] args) {
    int i = 0;
    do{
        i++;
        System.out.println(" ... ");
    }while (--i == 1);
}
```

`while`循环、`do-while`循环和for循环是Java中的三种常见循环结构。在大多数情况下，性能差异可以忽略不计，代码的清晰和易读性才是关键。
- `while`循环：用于在满足条件前可能不执行循环体的情况；
- `do-while`循环：用于至少需要执行一次循环体的情况；
- for循环：用于已知循环次数或需要固定迭代次数的情况；


## 参数传递
对于基本数据类型（如int、char、float等），值传递意味着传递的是变量的副本，是值传递。
如果是对象，那就是引用传递，这个理解是错误的。

形式参数与实际参数：
- 形式参数：是在定义函数名和函数体的时候使用的参数，目的是用来接收调用该函数时传入的参数；
- 实际参数：在调用有参函数时，主调函数和被调函数之间有数据传递关系。在主调函数中调用一个函数时，函数名后面括号中的参数称为“实际参数”；

举个例子：
```java
public class HelloWorld {
    public static void main(String[] args) {
        // 实参 
        test("world");
    }
    
    // 形参
    public static void test(String param){
        System.out.println("hello " + param);
    }
}
```

值传递与引用传递：
- 值传递: 是指在调用函数时将实际参数复制一份传递到函数中，这样在函数中如果对参数进行修改，将不会影响到实际参数；
- 引用传递: 是指在调用函数时将实际参数的地址直接传递到函数中，那么在函数中对参数所进行的修改，将影响到实际参数；

| | 值传递 | 引用传递|
|-----|---|---|
| 区别  | 传参时会创建副本 | 传参数不创建副本|
| 描述  | 方法中无法修改原始对象 | 方法中可以修改原始对象|


举个例子，如果在方法中改变对象的字段值会改变原对象该字段值，因为改变的是同一个地址指向的内容。
```java
class PassByValueExample {
    public static void main(String[] args) {
        Dog dog = new Dog("A");
        func(dog);
        System.out.println(dog.getName());          // B
    }

    private static void func(Dog dog) {
        dog.setName("B");//dog.name="B";
    }
}
```
然后有人就说Java传递对象类型参数是引用传递，其实这一点在官方[《Java™教程》](https://docs.oracle.com/javase/tutorial/java/javaOO/arguments.html)中有相关的描述。
> Passing Reference Data Type Arguments.
Reference data type parameters, such as objects, are also passed into methods by value. This means that when the method returns, the passed-in reference still references the same object as before. However, the values of the object's fields can be changed in the method, if they have the proper access level.<br>

文档大意：
传递引用数据类型参数，引用数据类型参数(如对象)也按值传递给方法。
这意味着当方法返回时，传入的引用仍然引用与之前相同的对象，但是如果对象的字段具有适当的访问级别，则可以在方法中更改它们的值。

所以在Java中的参数传递确实是值传递，但在处理对象引用时，表现出的行为可能让人误以为是引用传递。
举个例子来更好的理解：
```java
class MyObject {
  int value;
}

public class PassByValueExample {
  public static void main(String[] args) {
    MyObject obj = new MyObject();
    obj.value = 10;
    modifyObject(obj);
    System.out.println("After method call: " + obj.value);  // 输出: 20

    resetObject(obj);
    System.out.println("After resetObject call: " + obj.value);  // 输出: 20
  }

  public static void modifyObject(MyObject obj) {
    obj.value = 20;  // 修改对象的属性，会影响原对象
  }

  public static void resetObject(MyObject obj) {
    obj = new MyObject();  // 修改的是引用的副本，不影响原引用
    obj.value = 30;
  }
}
```
值传递和引用传递最大的区别是，传递的过程中有没有复制出一个副本来，如果是传递副本，那就是值传递，否则就是引用传递。
在Java中，其实是通过值传递实现的参数传递，只不过对于Java对象的传递，传递的内容是对象的引用的副本。
所以Java的参数是以值传递的形式传入方法中，而不是引用传递。
Java对象的传递，是通过复制的方式把引用关系传递了。如果我们没有改引用关系，而是找到引用的地址，把里面的内容改了，是会对调用方有影响的，因为大家指向的是同一个共享地址。

## 浮点类精度问题
在Java中，使用浮点类型进行计算会造成精度丢失。例如：
```java
public static void main(String[] args) {
    // 0.20000005
    System.out.println(1.2f - 1);
    // 0.19999999999999996
    System.out.println(1.2d - 1);
}
```
那么为什么浮点类型会存在精度精度丢失问题呢？
因为Java的浮点类型在计算机中是用二进制来存储的，也就是小数在转二进制的时候出现了精度丢失。

小数如何转二进制？
将待转的数字乘以2，取出整数部分作为二进制表示的第1位，然后再将小数部分乘以2，将得到的整数部分作为二进制表示的第2位，以此类推，直到小数部分为0。
特殊情况，如果小数部分出现循环，无法停止，则用有限的二进制位无法准确表示一个小数，这也是在编程语言中表示小数会出现误差的原因。
例如，0.1转二进制：
```
0.1 x 2 = 0.2  取整数位 0
0.2 x 2 = 0.4  取整数位 0
0.4 x 2 = 0.8  取整数位 0
0.8 x 2 = 1.6  取整数位 1
0.6 x 2 = 1.2  取整数位 1
0.2 x 2 = 0.4  取整数位 0
0.4 x 2 = 0.8  取整数位 0
0.8 x 2 = 1.6  取整数位 1
0.6 x 2 = 1.2  取整数位 1
........无限循环
```
因为计算机中存储一个浮点类型所用的位数是有限的，所以遇到无限循环的小数，只能选择在某个精度进行保存。
由于计算机中保存的小数其实是十进制的小数的近似值，并不是准确值，所以，千万不要在代码中使用浮点数来表示金额等重要的指标。

那怎么解决浮点精度丢失问题？
Java中的`BigDecimal`类提供了精确的十进制数学运算，避免了浮点数精度丢失的问题。
`BigDecimal`能够保证精度主要因为它基于十进制表示和算术运算，避免了二进制浮点数在表示和计算小数时可能出现的舍入误差和精度问题。

## BigDecimal
Java在`java.math`包中提供的API类`BigDecimal`，用来对超过16位有效位的数进行精确的运算。
双精度浮点型变量`double`可以处理16位有效数，在实际应用中，需要对更大或者更小的数进行运算和处理，所以需要用到`BigDecimal`。

Java中提供了大数字(超过16位有效位)的操作类，即`java.math.BinInteger`类和`java.math.BigDecimal`类，用于高精度计算。
其中`BigInteger`类是针对大整数的处理类，而`BigDecimal`类则是针对大小数的处理类。`BigDecimal`类的实现用到了`BigIntege`类，不同的是`BigDecimal`加入了小数的概念。

### 基本用法
`BigDecimal`一共有两种方法可以进行初始化赋值，构造器初始化赋值，`valueOf`方法初始化赋值。
在使用`BigDecimal`中参数为`double`类型的构造器时，发现存储结果并不准确。
```java
public static void main(String[] args) {
    // 打印结果: 0.200000000000000011102230246251565404236316680908203125
    System.out.println(new BigDecimal(0.2));
}
```
找到Java API中的相关描述：
> The results of this constructor can be somewhat unpredictable.
One might assume that writing {@code new BigDecimal(0.1)} in Java creates a {@code BigDecimal} which is exactly equal to 0.1 (an unscaled value of 1, with a scale of 1), but it is actually equal to 0.1000000000000000055511151231257827021181583404541015625.
This is because 0.1 cannot be represented exactly as a {@code double} (or, for that matter, as a binary fraction of any finite length).  
Thus, the value that is being passed<i>in</i> to the constructor is not exactly equal to 0.1, appearances notwithstanding.<br>
The {@code String} constructor, on the other hand, is perfectly predictable: writing {@code new BigDecimal("0.1")} creates a {@code BigDecimal} which is <i>exactly</i> equal to 0.1, as one would expect.  Therefore, it is generally recommended that the {@linkplain #BigDecimal(String)<tt>String</tt> constructor} be used in preference to this one.

大概意思是说，用`double`作为参数的构造函数，无法精确构造一个`BigDecimal`对象，需要自己指定一个上下文的环境，也就是指定精确位。
而利用`String`对象作为参数传入的构造函数能精确的构造出一个`BigDecimal`对象。
```java
public static void main(String[] args) {
    // 0.2
    System.out.println(new BigDecimal("0.2"));
}
```
所以要想获得精确的结果，要使用`BigDecimal`的字符串构造函数，不要使用`double`参数的构造函数。

`BigDecimal`所创建的是对象，我们不能使用传统的`+、-、*、/`等算术运算符直接对其对象进行数学运算，而必须调用其相对应的方法。
方法中的参数也必须是`BigDecimal`的对象，构造器是类的特殊方法，专门用来创建对象，特别是带有参数的对象。
```java
public static void main(String[] args) {
    BigDecimal num1 = new BigDecimal("2");
    BigDecimal num2 = new BigDecimal("1");
    BigDecimal num3;

    num3 = num1.add(num2);
    System.out.printf("num1 + num2 = %s\n",num3);

    num3 = num1.subtract(num2);
    System.out.printf("num1 - num2 = %s\n",num3);

    num3 = num1.multiply(num2);
    System.out.printf("num1 * num2 = %s\n",num3);

    num3 = num1.divide(num2);
    System.out.printf("num1 / num2 = %s\n",num3);
    
    // 绝对值
    System.out.printf("|num1 / num2| = %s\n",num3.abs());
}
```

另外说一下`BigDecimal`如何转换其他类型。
`BigDecimal`类提供了`intValue`,`byteValue`,`shortValue`等将`BigDecimal`对象转换成对应类型的方法：
```java
public static void main(String[] args) {
    BigDecimal bigDecimal = new BigDecimal("1.2");
    System.out.println(bigDecimal.byteValue());
    System.out.println(bigDecimal.shortValue());
    System.out.println(bigDecimal.intValue());
    System.out.println(bigDecimal.floatValue());
    System.out.println(bigDecimal.doubleValue());
    System.out.println(bigDecimal.longValue());
}
```

### 舍入规则
在使用除法的时候如果两个数字，除不尽而又没有设置精确小数位和舍入模式，就会报错：
```java
public static void main(String[] args) {
    BigDecimal num1 = new BigDecimal("1");
    BigDecimal num2 = new BigDecimal("3");
    BigDecimal num3;

    num3 = num1.divide(num2);
    System.out.printf("num1 / num2 = %s\n",num3);
}
```
```text
Exception in thread "main" java.lang.ArithmeticException: Non-terminating decimal expansion; no exact representable decimal result.
```
为了防止报错，我们可以这样写：
```java
public static void main(String[] args) {
    BigDecimal num1 = new BigDecimal("1");
    BigDecimal num2 = new BigDecimal("3");
    BigDecimal num3;

    num3 = num1.divide(num2,3, BigDecimal.ROUND_UP);
    // 打印结果: num1 / num2 = 0.334
    System.out.printf("num1 / num2 = %s\n",num3);
}
```

在`BigDecimal`类`divide`方法中`roundingMode`参数为舍入规则，如果不指定默认采用则四舍五入方式。
```java
// divisor: 除数; scale: 精确小数位; roundingMode: 舍入规则
public BigDecimal divide(BigDecimal divisor, int scale, int roundingMode);
```

`BigDecimal`类在进行数值运算时，可以通过指定不同的舍入规则来控制计算结果的精确度和舍入方式。
舍入规则由`RoundingMode`枚举类定义，Java 提供了几种常见的舍入模式，每种模式都适用于不同的应用场景和需求，我们在使用`BigDecimal`除法的时候，最好要指定精确小数位和舍入模式。
- `RoundingMode.UP`：向正无穷方向舍入，即始终向远离零的方向舍入。例如，对 `3.14` 使用 `UP` 模式舍入结果为 `4`。
- `RoundingMode.DOWN`：向零方向舍入，即截断小数部分。例如，对 `3.14` 使用 `DOWN` 模式舍入结果为 `3`。
- `RoundingMode.CEILING`：向正无穷方向舍入，如果是正数则表现和 `UP` 一样，如果是负数则表现和 `DOWN` 一样。例如，对 `-3.14` 使用 `CEILING` 模式舍入结果为 `-3`；对 `3.14` 使用 `CEILING` 模式舍入结果为 `4`。
- `RoundingMode.FLOOR`：向负无穷方向舍入，如果是正数则表现和 `DOWN` 一样，如果是负数则表现和 `UP` 一样。例如，对 `-3.14` 使用 `FLOOR` 模式舍入结果为 `-4`；对 `3.14` 使用 `FLOOR` 模式舍入结果为 `3`。
- `RoundingMode.HALF_UP`：四舍五入，当舍弃部分 >= 0.5 时，舍入行为同 `UP`；否则，舍入行为同 `DOWN`。例如，对 `3.5` 使用 `HALF_UP` 模式舍入结果为 `4`；对 `3.4` 使用 `HALF_UP` 模式舍入结果为 `3`。
- `RoundingMode.HALF_DOWN`：四舍五入，当舍弃部分 > 0.5 时，舍入行为同 `UP`；否则，舍入行为同 `DOWN`。例如，对 `3.5` 使用 `HALF_DOWN` 模式舍入结果为 `3`；对 `3.4` 使用 `HALF_DOWN` 模式舍入结果为 `3`。
- `RoundingMode.HALF_EVEN`：银行家舍入法，当舍弃部分等于 0.5 时，舍入行为同 `HALF_UP`；否则，舍入行为同 `HALF_DOWN`。例如，对 `2.5` 使用 `HALF_EVEN` 模式舍入结果为 `2`；对 `3.5` 使用 `HALF_EVEN` 模式舍入结果为 `4`。
- `RoundingMode.UNNECESSARY`：不需要舍入，如果计算结果需要舍入，则抛出 `ArithmeticException` 异常。

### scale属性
`BigDecimal`对象中`scale`字段属性，指的是小数点后面的位数，比如，对于`BigDecimal`值 123.45，`scale`是 2。

`setScale`可以增加或减少`BigDecimal`的小数位数。
当增加小数位数时，新增加的位数会被填充为零。当减少小数位数时，多余的位数会被舍去，并根据指定的舍入模式进行舍入。
```java
public class BigDecimalSetScaleExample {
  public static void main(String[] args) {
    BigDecimal num = new BigDecimal("123.4567");

    // 增加 scale
    BigDecimal increasedScale = num.setScale(6, RoundingMode.UNNECESSARY);
    System.out.println("Increased scale: " + increasedScale); // 123.456700

    // 减少 scale，并使用四舍五入模式
    BigDecimal decreasedScale = num.setScale(2, RoundingMode.HALF_UP);
    System.out.println("Decreased scale: " + decreasedScale); // 123.46

    // 减少 scale，并使用向下舍入模式
    BigDecimal decreasedScaleDown = num.setScale(2, RoundingMode.DOWN);
    System.out.println("Decreased scale (down): " + decreasedScaleDown); // 123.45
  }
}
```
`setScale`方法用于设置`BigDecimal`对象的`scale`，并且可以指定舍入模式。
在设置新的`scale`时，如果不指定舍入模式且新的`scale`小于当前`scale`，则会抛出`ArithmeticException`异常。
```java
public static void main(String[] args) {
    BigDecimal num1 = new BigDecimal("1.12345");
    num1.setScale(4);
    System.out.println(num1);
}
```
```
java.lang.ArithmeticException: Rounding necessary
```

### 比较大小
使用`BigDecimal`进行比较操作需要特别注意，因为`BigDecimal`是用于精确计算的数据类型，不能像基本数据类型一样直接使用比较操作符，如 `<, >, ==`来比较。
可以用`BigDecimal`的`equals`方法来进行比较。这里要注意，`equals`方法会比较数值和精度是否完全相同，即使两个对象表示的是相同的数值但精度不同，也会返回`false`。
```java
public static void main(String[] args) {
    BigDecimal num1 = new BigDecimal("1.10");
    BigDecimal num2 = new BigDecimal("1.1");
    BigDecimal num3 = new BigDecimal("1.1");
    // false
    System.out.println(num1.equals(num2));
    // true
    System.out.println(num2.equals(num3));
}
```
可以看到`1.10`和`1.1`数值是相等的，而`equals`方法返回的却是`false`。看一下`BigDecimal`中重写的`equals`的源码：
```java
/**
 * Compares this {@code BigDecimal} with the specified
 * {@code Object} for equality.  Unlike {@link
 * #compareTo(BigDecimal) compareTo}, this method considers two
 * {@code BigDecimal} objects equal only if they are equal in
 * value and scale (thus 2.0 is not equal to 2.00 when compared by
 * this method).
 *
 * @param  x {@code Object} to which this {@code BigDecimal} is
 *         to be compared.
 * @return {@code true} if and only if the specified {@code Object} is a
 *         {@code BigDecimal} whose value and scale are equal to this
 *         {@code BigDecimal}'s.
 * @see    #compareTo(java.math.BigDecimal)
 * @see    #hashCode
 */
@Override
public boolean equals(Object x) {
    if (!(x instanceof BigDecimal))
        return false;
    BigDecimal xDec = (BigDecimal) x;
    if (x == this)
        return true;
    if (scale != xDec.scale)
        return false;
    long s = this.intCompact;
    long xs = xDec.intCompact;
    if (s != INFLATED) {
        if (xs == INFLATED)
            xs = compactValFor(xDec.intVal);
        return xs == s;
    } else if (xs != INFLATED)
        return xs == compactValFor(this.intVal);

    return this.inflated().equals(xDec.inflated());
}
```
文档中有这么一段描述：
> objects equal only if they are equal in value and scale. thus 2.0 is not equal to 2.00 when compared by this method

大意：对象只有在`value`和`scale`相等时才相等。因此，用本方法比较时，2.0不等于2.00。

所以不要用`equals`方法来比较`BigDecimal`对象，因为它的`equals`方法会比较`scale`，如果`scale`不一样，它会返回`false`。
如果需要比较数值相等，不考虑精度，可以使用`compareTo`方法进行比较，并判断返回的结果是否为0。
```java
public static void main(String[] args) {
    BigDecimal a = new BigDecimal("1.10");
    BigDecimal b = new BigDecimal("1.1");

    if(a.compareTo(b) == -1){
        System.out.println("a小于b");
    }

    if(a.compareTo(b) == 0){
        System.out.println("a等于b");
    }

    if(a.compareTo(b) == 1){
        System.out.println("a大于b");
    }

    if(a.compareTo(b) > -1){
        System.out.println("a大于等于b");
    }

    if(a.compareTo(b) < 1){
        System.out.println("a小于等于b");
    }
}
```

## Math
`java.lang.Math`，该类和Java中的运算息息相关。`Math`类是一个工具类，被`final`修饰，构造方法是私有的，大部分方法都被`public static`修饰。

基本用法：
```java
public static void main(String[] args) {
  // 计算平方根
  System.out.printf("4的平方根: %s\n",Math.sqrt(4));

  //计算立方根
  System.out.printf("8的立方根: %s\n",Math.cbrt(8));

  // 计算n的m次方
  System.out.printf("2的3次方: %s\n",Math.pow(2,3));

  // 计算最大值
  System.out.printf("1和2中最大值: %s\n",Math.max(1,2));

  // 计算最小值
  System.out.printf("1和2中最小值: %s\n",Math.min(1,2));

  // 求绝对值
  System.out.printf("-1的绝对值: %s\n",Math.abs(-1));

  // 向上取整
  System.out.printf("1.2向上取整: %s\n",Math.ceil(1.2));

  // 向下取整
  System.out.printf("1.2向下取整: %s\n",Math.floor(1.2));

  // [0,1)区间的随机数
  System.out.printf("[0,1)区间的随机数: %s\n",Math.random());

  // 返回与参数值最接近的 double值
  double rint = Math.rint(1.5);
  System.out.printf("rint方法: %s\n",rint);

  // 四舍五入 float时返回int值，double时返回long值
  long round = Math.round(1.5);
  int round1 = Math.round(1.5f);
  System.out.printf("round方法: 1.5四舍五入: %s\n",round);
}
```

### ceil和floor
`ceil`方法的功能是向上取整。`ceil`译为“天花板”，顾名思义就是对操作数取顶，`Math.ceil(a)`就是取大于a的最小整数。
需要注意的是它的返回值不是`int`类型，而是`double`类型。
```java
// 向上取整
System.out.printf("1.2向上取整: %s\n",Math.ceil(1.2));
```

`floor`方法的功能是向下取整。`floor`译为“地板”，顾名思义是对操作数取底。
`Math.floor(a)`，就会取小于a的最大整数。它的返回值类型与`ceil`一致，也是`double`类型。
```java
// 向下取整
System.out.printf("1.2向下取整: %s\n",Math.floor(1.2));
```

一般情况下，`Math.ceil(x)`的值正好是`-Math.floor(-x)`的值。
```text
Math.ceil(1.2) = 2.0
-Math.floor(-1.2) = 2.0
```
特殊情况：
- 如果参数值已经等于一个数学整数，则结果与参数相同。
  ```java
  double result1 = Math.ceil(2.0);
  System.out.printf("Math.ceil(2.0): %s\n", result1); // 输出 2.0
  ```
- 如果参数是NaN或无穷大或正零或负零，则结果与参数相同。
  ```java
  double result2 = Math.ceil(Double.NaN);
  System.out.printf("Math.ceil(Double.NaN): %s\n", result2); // 输出 NaN
  double result5 = Math.ceil(0.0);
  System.out.printf("Math.ceil(0.0): %s\n", result5); // 输出 0.0
  double result6 = Math.ceil(-0.0);
  System.out.printf("Math.ceil(-0.0): %s\n", result6); // 输出 -0.0
  ```
- 如果实参值小于零但大于-1.0，则结果为负零。
  ```java
  double result7 = Math.ceil(-0.5);
  System.out.printf("Math.ceil(-0.5): %s\n", result7); // 输出 -0.0
  ```

### random
`random`方法是 Java 中用于生成伪随机数的基本方法之一。它返回一个`double`类型的随机数，范围在`[0.0, 1.0)`，包括0.0但不包括1.0。
```java
public class RandomExample {
  public static void main(String[] args) {
    // 生成一个 0.0 到 1.0 之间的随机数（不包括 1.0）
    double randomValue = Math.random();
    System.out.printf("随机数: %s\n", randomValue);
  }
}
```

由于`random`方法生成的是`[0.0, 1.0)`之间的随机数，可以通过数学运算将其转换为不同范围的随机数。
```java
public class RandomExample {
    public static void main(String[] args) {
        int min = 5;
        int max = 15;
        int randomInt = min + (int) (Math.random() * ((max - min) + 1));
        System.out.printf("%d 到 %d 之间的随机整数: %d\n", min, max, randomInt);
    }
}
```

通过源码可以看到，`Math.random`底层是调用了`Random`类中`nextDouble`方法。
```java
public static double random() {
    return RandomNumberGeneratorHolder.randomNumberGenerator.nextDouble();
}
// Random.nextDouble
public double nextDouble() {
    return (((long)(next(26)) << 27) + next(27)) * DOUBLE_UNIT;
}
```
也就是说以下代码执行的逻辑是相同的：
```java
// [0,1)区间的随机数
System.out.printf("[0,1)区间的随机数: %s\n",Math.random());
System.out.printf("[0,1)区间的随机数: %s\n",new Random().nextDouble());
```

`Random`类位于`java.util`包下，此类的实例用于生成伪随机数流。
之所以称之为伪随机，是因为真正意义上的随机数（或者称为随机事件）在某次产生过程中是按照实验过程表现的分布概率随机产生的，其结果是不可预测，不可见的。
而计算机中的随机函数是按照一定的算法模拟产生的，其结果是确定的，可见的。我们认为这样产生的数据不是真正意义上的随机数，因而称之为伪随机。

该类提供了两种构造方法，无参构造底层调用的也是有参构造。
将`System.nanoTime()`作为参数传递。如果使用无参构造，默认的`seed`值为`System.nanoTime()`。
```java
// 无参构造
public Random() {
  this(seedUniquifier() ^ System.nanoTime());
}

// 有参构造
public Random(long seed) {
    if (getClass() == Random.class)
        this.seed = new AtomicLong(initialScramble(seed));
    else {
        // subclass might have overriden setSeed
        this.seed = new AtomicLong();
        setSeed(seed);
    }
}
```
要注意的是用有参构造创建`Random`对象，如果随机种子相同，不管执行多少次，最后结果都是相同的。
```java
public static void main(String[] args) {
    Random random = new Random(1);
    // 第一次执行程序打印结果: 随机数: -1155869325
    // 第二次执行程序打印结果: 随机数: -1155869325
    System.out.printf("随机数: %s\n",random.nextInt());
}
```

### round
`round`方法用于对浮点数进行四舍五入，并返回最接近的整数。
```java
// 四舍五入 float时返回int值，double时返回long值
long round = Math.round(1.5);
int round1 = Math.round(1.5f);
System.out.printf("round方法: 1.5四舍五入: %s\n",round);
```

一般情况，`round`方法用于对浮点数进行四舍五入，并返回最接近的整数。特殊情况:
- 如果参数是NaN，结果是0；NaN表示非数值，例如：0.0/0结果为NAN，负数的平方根结果也为NAN；
- 如果参数是负无穷大或小于或等于`Integer.MIN_VALUE`，结果为`Integer.MIN_VALUE`；
- 如果参数是正无穷大或大于或等于`Integer.MAX_VALUE`，结果为`Integer.MAX_VALUE`；
```java
public static void main(String[] args) {
    // 四舍五入 float时返回int值，double时返回long值
    int round1 = Math.round(0);
    long round2 = Math.round(Double.NaN);
    int round3 = Math.round(2147483648123L);
    int round4 = Math.round(-2147483647123L);
    System.out.printf("0四舍五入: %s\n", round1);
    System.out.printf("Double.NaN=[%s],四舍五入: %s\n", Double.NaN, round2);
    System.out.printf("Integer.MAX_VALUE=[%s] + 1 四舍五入: %s\n", Integer.MAX_VALUE, round3);
    System.out.printf("Integer.MIN_VALUE=[%s] - 1 四舍五入: %s\n", Integer.MIN_VALUE, round4);
}
```

`Math.round()`和`BigDecimal`类的四舍五入方法在实现和使用上有一些显著的区别。
`Math.round()`适用于对普通的浮点数进行简单的整数舍入，例如将浮点数转换为最接近的整数值。
`BigDecimal.setScale()`适用于需要精确控制数值精度和舍入方式的场景，特别是在金融计算、税务计算等要求高精度和可预测舍入行为的应用中。