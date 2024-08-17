---
title: "Java异常"
date: 2021-01-13
draft: false
tags: ["Java", "Java基础"]
slug: "rookie-exception"
---

## 异常类型
![Java异常分类](/iblog/posts/annex/images/essays/Java异常分类.png)

`Throwable`可以用来表示任何可以作为异常抛出的类，分为两种：`Error` 和 `Exception`。
其中`Error`用来表示Java程序无法处理的错误，这类错误一般与硬件有关，与程序本身无关，通常由系统进行处理，程序本身无法捕获和处理，是不可控制的。

`Exception`分为两种：运行时异常和检查型异常。
- 受检异常：需要用`try...catch... `语句捕获并进行处理，并且可以从异常中恢复；
  ```java
  public void test() throws MyException{}
  ```
  Java编译器对检查性异常会要求我们进行`catch`，必须得进行捕获，否则编译不过去。Java认为检查性异常都可以被处理，所以必须显示的处理`checked`异常。
  常见的检查性异常有`IOException`、`SqlException`。当我们希望我们的⽅法调⽤者，明确的处理⼀些特殊情况的时候，就应该使⽤受检异常。
- 非受检异常：是程序运行时错误。例如：除0会引发 `ArithmeticException`，此时程序崩溃并且无法恢复。
    ```java
    public void test() {
        int a = 1;
        int b = a/0;
    }
    ```
    这种异常⼀般可以理解为是代码原因导致的。⽐如发⽣空指针、数组越界等。所以，只要代码写的没问题，这些异常都是可以避免的。也就不需要我们显⽰的进⾏处理。

`Exception`表⽰程序需要捕捉、需要处理的常，是由与程序设计的不完善⽽出现的问题，程序必须处理的问题。
异常和错误的区别是，异常能被程序本身可以处理，错误是无法处理。

## 自定义异常
在Java中，自定义异常类可以帮助你创建特定于你的应用程序的异常类型，这些异常类型可以提供更清晰的错误描述，并使错误处理更加灵活和精确。
在Java中自定义异常，但所有自定义异常都必须是`Throwable`的子类。
如果希望写一个检查性异常类，则需要继承`Exception`类。如果你想写一个运行时异常类，那么需要继承`RuntimeException`类。

自定义受检查异常：
```java
// 创建一个自定义的受检查异常类
public class MyCheckedException extends Exception {
    public MyCheckedException(String message) {
        super(message);
    }
    
    public MyCheckedException(String message, Throwable cause) {
        super(message, cause);
    }
}

// 使用自定义异常
public class Test {
    public void myMethod() throws MyCheckedException {
        // 条件判断或业务逻辑
        if (true) {
            throw new MyCheckedException("This is a custom checked exception.");
        }
    }
}
```

自定义运行时异常：
```java
// 创建一个自定义的非受检查异常类
public class MyUncheckedException extends RuntimeException {
    public MyUncheckedException(String message) {
        super(message);
    }
    
    public MyUncheckedException(String message, Throwable cause) {
        super(message, cause);
    }
}

// 使用自定义异常
public class Test {
    public void myMethod() {
        // 条件判断或业务逻辑
        if (true) {
            throw new MyUncheckedException("This is a custom unchecked exception.");
        }
    }
}
```

## 异常的传播
在Java中，异常传播指的是当一个方法内部抛出异常时，异常如何在调用栈中向上传播的过程。
理解异常传播是异常处理机制中的重要部分，对于编写健壮的代码和良好的异常处理策略至关重要。

当一个方法内部抛出异常时，异常会沿着调用链向上传播给调用者。这个过程描述了异常如何从方法内部向外部传递，并最终在调用栈中找到合适的异常处理器来处理异常。
```java
public class ExceptionPropagationExample {

    public static void main(String[] args) {
        try {
            method1();
        } catch (Exception e) {
            System.out.println("Exception caught in main method: " + e.getMessage());
        }
    }

    public static void method1() throws Exception {
        try {
            method2();
        } catch (RuntimeException e) {
            System.out.println("RuntimeException caught in method1: " + e.getMessage());
        }
    }

    public static void method2() {
        method3();
    }

    public static void method3() {
        // 人为地抛出一个异常
        throw new RuntimeException("Exception occurred in method3");
    }
}
```

异常传播的基本过程：
1. 当方法内部抛出一个异常（使用`throw`关键字），异常对象被创建并包含了当前异常的堆栈信息，包括方法调用路径。
2. 异常从抛出它的方法开始，沿着方法调用链向上传播。每当方法内部抛出异常时，JVM将控制权传递给调用该方法的上级方法。
3. 异常会继续沿着调用链向上移动，直到找到合适的异常处理器来处理异常。处理器可以是`try-catch`块、异常处理方法或者不处理异常而继续向上传播。
4. 如果找到了与抛出的异常匹配的`catch`块或者方法签名中声明的`throws`子句，异常被捕获并在这里进行处理。处理可以包括记录日志、恢复操作或者向上抛出另一个异常。
5. 如果异常没有在当前方法中被捕获处理，它将继续向上传播，控制权交给调用当前方法的方法。这个过程继续直到异常被捕获或者传播到了调用栈的顶部。
6. 如果异常传播到了调用栈的顶部仍然没有被处理，通常情况下会导致程序终止，并打印异常的堆栈跟踪信息，这有助于开发人员定位和解决问题。

## 处理异常
异常的处理⽅式有两种，⾃⼰处理，向上抛出交给调⽤者处理。

需要注意的是，一般情况下不要丢弃异常，捕获异常后需要进行相关处理。
如果用户觉得不能很好地处理该异常，就让它继续传播，传到别的地方去处理，或者把一个低级的异常转换成应用级的异常，重新抛出。
千万不能捕获了之后什么也不做，或者只是使⽤`e.printStacktrace`。如果是练习这样写也就算了，但是在正式的环境上千万不能这样做。实际开发中应该使用日志记录。

写完代码后请一定要检查下，代码中千万不要有`printStackTrace`。
不能直接使用`printStackTrace`打印异常的原因在于它可能泄露敏感信息、未将异常信息记录到日志系统中、使得错误难以追踪和管理、影响系统性能，并且通常缺乏必要的上下文信息。
因此，在正式开发中，应使用日志框架记录异常信息，以便更好地监控和调试应用程序。
```java
public class ExceptionHandlingExample {
    private static final Logger logger = LoggerFactory.getLogger(ExceptionHandlingExample.class);

    public static void main(String[] args) {
        try {
            int result = divide(10, 0);
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            // 使用日志记录异常信息
            logger.error("Division by zero error", e);
            // 或者根据业务逻辑重新抛出应用级异常
            throw new CustomApplicationException("Failed to divide numbers", e);
        }
    }

    public static int divide(int a, int b) {
        return a / b;
    }
}

// 自定义应用级异常
public class CustomApplicationException extends RuntimeException {
    public CustomApplicationException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

### try-catch
自己处理异常指在当前方法内部通过`try-catch`语句捕获并处理异常，而不是将异常传播给调用者处理。
这种方式适合于可以预见并且能够恢复的异常情况。处理异常的目的是在发生异常时执行某些逻辑，例如提供默认值、记录日志、给用户友好的错误提示等。
```java
public class ExceptionHandlingExample {
    public static void main(String[] args) {
        try {
            int result = divide(10, 0);
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Error: Division by zero is not allowed. Defaulting result to 0.");
            // 给出一个默认值
            int result = 0;
            System.out.println("Result: " + result);
        }
    }

    public static int divide(int a, int b) {
        return a / b;
    }
}
```

在Java中，一个`try`语句可以对应多个`catch`块来进行多重捕获。
如果在`try`语句块中发生异常，异常会被依次传递给每个`catch`块，直到找到匹配的`catch`块进行处理。如果没有匹配的`catch`块，异常会继续向上抛出。
```java
public class MultiCatchExample {
    public static void main(String[] args) {
        try {
            int[] numbers = {1, 2, 3};
            System.out.println(numbers[5]); // ArrayIndexOutOfBoundsException
            int result = 10 / 0; // ArithmeticException
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Array index is out of bounds: " + e.getMessage());
        } catch (ArithmeticException e) {
            System.out.println("Arithmetic error occurred: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("An unexpected error occurred: " + e.getMessage());
        }
    }
}
```
从JDK7开始，Java引入了多个异常类型的合并处理，这使得可以将多个不同类型的异常在一个`catch`块中捕获和处理。
这种特性可以减少重复的代码，并提高异常处理的简洁性和可读性。
```java
public class MultiCatchExample {
    public static void main(String[] args) {
        try {
            int[] numbers = {1, 2, 3};
            System.out.println(numbers[5]); // ArrayIndexOutOfBoundsException
            int result = 10 / 0; // ArithmeticException
        } catch (ArrayIndexOutOfBoundsException | ArithmeticException e) {
            System.out.println("An error occurred: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("An unexpected error occurred: " + e.getMessage());
        }
    }
}
```

### try-catch-finally
`try` 语句块不止可以与 `catch` 连用，也可以与`finally`连用，但是 `catch` 不能与 `finally` 连用。
`try-catch-finally`结构与异常密切相关，它是Java中用于处理异常的基本结构之一，用于确保资源的正确关闭和异常的正确处理。
```java
public class TryCatchFinallyExample {
    public static void main(String[] args) {
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader("file.txt"));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
        } finally {
            try {
                if (reader != null) {
                    reader.close(); // 确保关闭资源
                }
            } catch (IOException e) {
                System.out.println("Error closing reader: " + e.getMessage());
            }
        }
    }
}
```
根据JVM规范，如果`try`语句块里边有返回值则返回`try`语句块里边的；
如果`try`语句块和`finally`语句块都有`return`，则忽略`try`语句块里边的使用`finally`语句块里边的`return`；
`finally`语句块是在`try`语句块或者`catch`语句块中的`return`语句之前执行的，无论是否发生异常，`finally`代码块中的代码总会被执行。
一般情况下如果方法有返回值，切忌不要在`finally`中写`return`，这样会使得程序结构变得混乱。
> `finally`语句块什么时候不执行？
如果当一个线程在执行`try`语句块或者`catch`语句块时被打断（interrupted）或者被终止（killed）或退出虚拟机(`System.exit(0)`)，与其相对应的`finally`语句块可能不会执行。
还有更极端的情况，就是在线程运行`try`语句块或者`catch`语句块时，突然死机或者断电，`finally`语句块肯定不会执行了。

无论是否发生异常，`finally`代码块中的代码总会被执行。根据这个特性，`finally`块确保在代码执行过程中发生异常时，资源得到正确释放，所以经常用来关闭资源。
自从JDK7之后，支持`try-with-resources`的写法，这种写法对比之前更清晰、明了：
```java
public class MainTest {
    public static void main(String[] args) {
        try (InputStream in = new FileInputStream("awsl")) {
            in.read();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```

JVM先会把`try`或者`catch`代码块中的返回值保留，再来执行`finally`代码块中的语句，等到`finally`代码块执行完毕之后，在把之前保留的返回值给返回出去。
这条规则只适用于`return`和`throw`语句，不适用于`break`和`continue`语句，因为它们根本就没有返回值。
```java
public class MyTest {
 
	public static void main(String[] args) {
        // main 代码块中的执行结果为：1
		System.out.println("main 代码块中的执行结果为：" + myMethod());
	}
 
	public static int myMethod() {
		int i = 1;
		try {
			System.out.println("try 代码块被执行！");
			return i;
		} finally {
			++i;
			System.out.println("finally 代码块被执行！");
			System.out.println("finally 代码块中的i = " + i);
		}
 
	}
 
}
```

### throws、throw
向上抛出交给调用者处理，这种方式通过在方法签名中使用`throws`关键字将异常向上抛出，交由调用该方法的代码处理。适用于方法本身无法或者不适合处理异常的情况。
```java
public class ExceptionHandlingExample {
    public static void main(String[] args) {
        try {
            process();
        } catch (Exception e) {
            System.out.println("Error: " + e.getMessage());
        }
    }

    public static void process() throws Exception {
        try {
            int result = divide(10, 0);
            System.out.println("Result: " + result);
        } catch (ArithmeticException e) {
            System.out.println("Caught ArithmeticException: " + e.getMessage());
            // 处理部分异常逻辑
        }

        // 可能抛出其他类型的异常
        if (true) {
            throw new Exception("A different kind of exception occurred.");
        }
    }

    public static int divide(int a, int b) throws ArithmeticException {
        return a / b;
    }
}
```

`throws`用在方法上声明异常，子类继承的时候要继承该异常或者该异常的子类，不处理异常，谁调用该方法谁处理异常。
`throws`抛出异常时，它的调用者也要申明抛出异常或者捕获，不然编译报错。
```java
    public static int divide(int a, int b) throws ArithmeticException {
    return a / b;
}
```
`throw`用于方法内部，抛出的是异常对象。调用者可以不申明或不捕获但编译器不会报错。
```java
public static void main(String[] args) {
    try {
        process();
    } catch (Exception e) {
        System.out.println("Error: " + e.getMessage());
    }
}
```
`throws`表示出现异常的一种可能性，告诉调用者这个方法是危险的，并不一定会发生这些异常。`throw`则是抛出了异常，执行`throw`则一定抛出了某种异常对象。
两者都是消极处理异常的方式（这里的消极并不是说这种方式不好），只是抛出或者可能抛出异常，但是不会由方法去处理异常，真正的处理异常由此方法的上层调用处理。

### 异常链
异常链则是一种特定的异常处理技术，通过在捕获异常时将原始异常作为参数传递给新的异常，这样来保留原始异常的详细信息。
如果因为一个异常你决定抛出⼀个新的异常，⼀定要包含原有的异常，这样处理程序才可以通过`getCause`方法和`initCause`⽅法来访问异常最终的根源。
这样做有助于调试和了解错误的根本原因。
```java
// 定义一个自定义异常
public class MyCustomException extends Exception {
    public MyCustomException(String message) {
        super(message);
    }
    
    public MyCustomException(String message, Throwable cause) {
        super(message, cause);
    }
}

// 一个可能抛出异常的方法
public class SomeService {
    public void doSomething() throws IOException {
        // 模拟抛出一个IOException
        throw new IOException("IO error occurred");
    }
}

// 使用异常链来包装原始异常
public class Main {
    public static void main(String[] args) {
        SomeService service = new SomeService();
        
        try {
            service.doSomething();
        } catch (IOException e) {
            // 包装原始异常并抛出新的自定义异常
            throw new MyCustomException("Failed to do something due to IO error", e);
        }
    }
}
```

## 经验总结
处理异常是软件开发中至关重要的一部分，有效的异常处理可以提高系统的健壮性、可靠性和用户体验。以下是处理异常的一些经验总结。

### 不要滥用异常
要谨慎地使用异常，异常捕获的代价非常高昂，异常使用过多会严重影响程序的性能。
如果在程序中能够用`if`语句和`boolean`变量来进行逻辑判断，那么尽量减少异常的使用，从而避免不必要的异常捕获和处理。

### 空catch
千万不要使用空的`catch`块：
```
try{
 // ...
}catch(IOException e){
  // ...
}
```
在捕获了异常之后什么都不做，相当于忽略了这个异常。空的`catch`块意味着你在程序中隐藏了错误和异常，并且很可能导致程序出现不可控的执行结果。
如果你非常肯定捕获到的异常不会以任何方式对程序造成影响，最好用日志将该异常进行记录，以便日后方便更新和维护。

### 吞掉异常
请不要在`catch`块中吞掉异常：
```
catch (NoSuchMethodException e) {
   return null;
}
```
不要不处理异常，而返回`null`，这样异常就会被吞掉，无法获取到任何失败信息，会给日后的问题排查带来巨大困难。

### 精确处理异常
```
public void foo() throws Exception { //错误做法
}
```
一定要尽量避免上面的代码，因为他的调用者完全不知道错误的原因到底是什么。
在方法声明中，可以由方法抛出一些特定受检异常。如果有多个，那就分别抛出多个，这样这个方法的使用者才会分别针对每个异常做特定的处理，从而避免发生故障。
```
public void foo() throws SpecificException1, SpecificException2 { 
//正确做法
}
```

同样的在捕获异常时，也要注意，尽量捕获特定的子类，而不是直接捕获`Exception`类。
```
try {
    someMethod();
} 
catch (Exception e) {
    log.error("method has failed", e);
}
```
上面代码，最大的问题就是，如果`someMethod()`的开发者在里面新增了一个特定的异常，并且预期是调用方能够特殊的对他进行处理。
但是调用者直接`catch了Exception`类，就会导致永远无法知道`someMethod`的具体变化细节。这久可能导致在运行的过程中在某一个时间点程序崩溃。
更不要去捕获`Throwable`类，因为Java中的`Error`也可以是`Throwable`的子类。但是`Error`是Java虚拟机本身无法控制的。Java虚拟机甚至可能不会在出现任何错误时请求用户的`catch`子句。
```
try {
    someMethod();
} 
catch (Throwable e) {
    log.error("method has failed", e);
}
```
`OutOfMemoryError`和`StackOverflowError`便是典型的例子，它们都是由于一些超出应用处理范围的情况导致的。

### 抛出异常
通常情况下，在捕获异常的时候抛出异常，需要注意的是，要始终在自定义异常中，覆盖原有的异常，从而构成一条异常链，这样堆栈跟踪就不会丢失：
```
catch (NoSuchMethodException e) {
    throw new MyServiceException("Some information: " + e.getMessage());  //错误做法
}
```
上面的命令可能会丢失掉主异常的堆栈跟踪。正确的方法是：
```
catch (NoSuchMethodException e) {
     throw new MyServiceException("Some information: " , e);  //正确做法
}
```
需要注意的是，可以记录异常或抛出异常，但不要同时做：
```
catch (NoSuchMethodException e) {
   log.error("Some information", e);
   throw e;
}
```
抛出和日志记录可能会在日志文件中产生多个日志消息,这就会导致同一个问题，却在日志中有很多不同的错误信息，使得开发人员陷入混乱。


### 选择异常
一旦你决定抛出异常，你就要决定抛出抛出检查异常还是非检查异常。

检查异常导致了太多的`try…catch`代码，可能有很多检查异常对开发人员来说是无法合理地进行处理的，比如：`SQLException`，而开发人员却不得不去进行`try…catch`，这样就会导致经常出现这样一种情况：逻辑代码只有很少的几行，而进行异常捕获和处理的代码却有很多行。
这样不仅导致逻辑代码阅读起来晦涩难懂，而且降低了程序的性能。

建议尽量避免检查异常的使用，如果确实该异常情况出现很的普遍，需要提醒调用者注意处理的话，就使用检查异常；否则使用非检查异常。
因此，在一般情况下，尽量将检查异常转变为非检查异常交给上层处理。

### 不要在finally中抛异常
```
try {
  someMethod();  //抛出 exceptionOne
}finally{
  cleanUp();    //如果在这里再抛出一个异常，那么try中的exception将会丢失
}
```
在上面的例子中，如果`someMethod()`抛出一个异常，并且在`finally`块中，`cleanUp()`也抛出一个异常，那么初始的`exception`将永远丢失。
但是如果你不想处理`someMethod()`中的异常，但是仍然需要做一些清理工作，那么在`finally`块中进行清理。不要使用`catch`块。

## 参考文章
- https://www.hollischuang.com/archives/5528
- https://stackify.com/best-practices-exceptions-java
