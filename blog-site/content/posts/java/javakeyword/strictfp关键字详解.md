---
title: "strictfp关键字详解"
date: 2024-08-15
draft: false
tags: ["Java", "关键字","详解"]
slug: "java-keyword-strictfp"
---

## strictfp
strictfp可能是最没有存在感的关键字了，很多人写了多年Java甚至都不知道它的存在。

默认情况下，Java中的浮点计算与平台相关。因此，浮点结果的精度取决于所使用的硬件。
strictfp是Java语言中的一个关键字，是用于确保浮点运算的计算结果在不同平台上具有一致性。
浮点数在不同的硬件和操作系统上可能会有不同的表示方式和精度，strictfp关键字则通过强制执行严格的浮点运算规则来解决这个问题。

使用strictfp可以实现浮点运算结果的一致性，适合跨平台兼容的应用，如科学计算和金融系统。它提供了标准化的浮点运算行为，帮助减少由于不同硬件实现差异引起的问题。
但可能会降低程序性能，因为它禁用了某些硬件优化，并可能限制编译器的优化能力，从而影响计算速度。对于许多现代应用，浮点运算已经足够一致，使得strictfp的使用场景相对有限。

较适用场景包括需要高精度和一致性浮点计算的应用，如科学研究、金融计算和跨平台应用程序。

在实际开发中，strictfp关键字使用较少，主要是因为它限制了处理器和编译器对浮点运算的性能优化。在性能要求高的情况下，大家往往更愿意牺牲一点一致性来获得更快的速度。
而且大多数应用程序的浮点计算已经足够一致，满足了实际需求，因此不需要额外的strictfp关键字来保证浮点运算的一致性，strictfp了解即可。

### 使用示例
strictfp只对float和double类型的计算有效，且会限制某些优化，从而可能影响性能。
一旦使用了strictfp来声明一个 类、接口或者方法时，那么所声明的范围内Java的编译器以及运行环境会完全依照浮点规范IEEE-754来执行，能保证这些部分的浮点计算不受平台差异的影响。

> IEEE-754是浮点数运算的标准，定义了浮点数的表示、运算方式和异常处理。它包括单精度32位和双精度64位浮点数格式，涉及符号位、指数位和尾数位的定义，以及特殊值如零、无穷大和非数。
该标准还规定了几种舍入模式，如最近偶数舍入，以保证浮点运算的精度。

1. 当在类上使用strictfp时，类中的所有方法的浮点运算都将严格遵循IEEE-754规范。
    ```java
    public strictfp class StrictFPClassExample {
    
        public static void main(String[] args) {
            double result = computeDifference();
            // 输出结果: 3.141592653589793
            System.out.println("With strictfp (class level): " + result);
        }
    
        public static double computeDifference() {
            double large = 1e40;
            double pi = 3.141592653589793;
            return large + pi - large;
        }
    }
    
    public class WithoutStrictFPClassExample {
    
        public static void main(String[] args) {
            double result = computeDifference();
            // 输出结果: 0.0
            System.out.println("Without strictfp (class level): " + result);
        }
    
        public static double computeDifference() {
            double large = 1e40;
            double pi = 3.141592653589793;
            return large + pi - large;
        }
    }
    ```
2. 在方法级别使用strictfp，仅影响该方法的浮点运算。
    ```java
    public class StrictFPMethodExample {
    
        public static void main(String[] args) {
            double strictFPResult = computeWithStrictFP();
            double nonStrictFPResult = computeWithoutStrictFP();
    
            // With strictfp: 3.141592653589793
            System.out.println("With strictfp (method level): " + strictFPResult);
    
            // Without strictfp: 0.0
            System.out.println("Without strictfp (method level): " + nonStrictFPResult);
        }
    
        public strictfp static double computeWithStrictFP() {
            double large = 1e40;
            double pi = 3.141592653589793;
            return large + pi - large;
        }
    
        public static double computeWithoutStrictFP() {
            double large = 1e40;
            double pi = 3.141592653589793;
            return large + pi - large;
        }
    }
    ```
3. 在接口上使用strictfp，所有实现该接口的类中的方法都将严格遵循IEEE-754规范。
    ```java
    public strictfp interface StrictFPInterface {
        double computeDifference(double large, double pi);
    }
    
    public class StrictFPInterfaceImplementation implements StrictFPInterface {
    
        @Override
        public double computeDifference(double large, double pi) {
            return large + pi - large;
        }
    
        public static void main(String[] args) {
            StrictFPInterfaceImplementation impl = new StrictFPInterfaceImplementation();
            double result = impl.computeDifference(1e40, 3.141592653589793);
            // 输出结果: 3.141592653589793
            System.out.println("With strictfp (interface level): " + result);
        }
    }
    
    public interface NonStrictFPInterface {
        double computeDifference(double large, double pi);
    }
    
    public class NonStrictFPInterfaceImplementation implements NonStrictFPInterface {
    
        @Override
        public double computeDifference(double large, double pi) {
            return large + pi - large;
        }
    
        public static void main(String[] args) {
            NonStrictFPInterfaceImplementation impl = new NonStrictFPInterfaceImplementation();
            double result = impl.computeDifference(1e40, 3.141592653589793);
            // 输出结果: 0.0
            System.out.println("Without strictfp (interface level): " + result);
        }
    }
    ```
需要注意的是strictfp关键字不允许在变量、构造函数或抽象方法上使用。除此之外，当有一个用它标记的超类时，它不会让子类继承。

### strictfp与BigDecimal
strictfp和BigDecimal都涉及到浮点数计算的精度和一致性问题，但各自解决的侧重点不同，怕很多人搞混这里特地强调一下。
strictfp主要关注浮点运算的一致性而非绝对精度，更适合需要性能的场合。而BigDecimal则提供了极高的计算精度，但牺牲了运算性能，适用于需要精确结果的领域。
二者并非相互替代的关系，而是根据不同需求在不同场景下分别使用。

BigDecimal的运算逻辑完全在Java的标准库中实现，并不依赖于任何特定平台的硬件或操作系统的浮点运算单元，所以在任何平台上使用BigDecimal进行相同的计算时，结果都是一致的，但并不是它在所有场景下都是最合适的选择。
BigDecimal的计算性能较低，尤其是在处理大量数据或需要高频率运算的场合，可能会成为瓶颈。
在一些实时性要求较高或者需要快速处理大量浮点运算的应用中，float和double依然是首选，尤其是在对计算精度要求不高的情况下。
如果需要保证跨平台的运算结果一致性，但又不愿意牺牲浮点数的性能优势，strictfp是一个适合的工具。BigDecimal适用于那些需要绝对精确计算的场景，而strictfp则适用于需要跨平台一致性和高性能的场合。

### strictfp与IEEE-754
在计算机内部，浮点数被表示为二进制数，例如16.625可以被表示为10000.101。当我们进行加、减、乘、除等运算时，就要对这些二进制数进行相应的操作。
但不同的硬件实现所使用的浮点处理单元可能存在差异，因此在不同平台之间进行浮点计算时，可能会出现误差。

一旦使用了strictfp来声明一个类、接口或者方法时，那么所声明的范围内Java的编译器以及运行环境会完全依照浮点规范IEEE-754来执行。
IEEE754是一个针对CPU或者FPU(浮点运算器)制定的标准，Java的浮点数是在其基础上，规定了某些参数值，确定了float和double类型。
即使CPU/FPU都符合了IEEE_754，但浮点数超出了float或double的范围，运算就可能不一致。

需要注意的是strictfp关键字的使用与IEEE-754没有直接因果关系。IEEE-754，是IEEE制定的，而不是J2EE的标准。

strictfp关键字并不直接定义IEEE-754标准，而是保证在使用它声明的类、接口或方法中的所有浮点运算严格遵循IEEE-754标准。
因此，在使用strictfp时，Java编译器和运行时环境将遵循IEEE-754标准来执行浮点运算，从而避免不同平台可能导致的浮点数计算不一致问题。
在没有使用strictfp时，Java虚拟机可能利用硬件浮点运算的特性来优化计算，这就可能导致在不同平台上，浮点运算的结果不完全一致。
