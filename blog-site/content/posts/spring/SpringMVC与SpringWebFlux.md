---
title: "SpringMVC与SpringWebFlux"
date: 2023-04-14
draft: false
tags: ["Java","Spring"]
slug: "java-spring-mvc-webflux"
---

## Spring MVC
Spring Web MVC是建立在Servlet API上的原始Web框架，从一开始就包含在Spring框架中。正式名称 "Spring Web MVC "来自其源模块的名称（spring-webmvc），但它更常被称为 "Spring MVC"。

SpringMVC是基于Spring的，是Spring中的一个模块，专门用来做web开发使用的。
- Model 封装了数据与进行数据进行处理的代码，是实际经行数据处理的地方，也是与数据库交互的地方
- View 负责将应用显示给用户和显示模型的状态，一般来说，它生成客户端浏览器可以解释的 HTML 输出;
- Controller 负责视图和模型之间的交互，并将其传递给视图进行渲染;

SpringMVC也是一个容器，使用IoC核心技术，管理界面层中的控制器对象。SpringMVC的底层就是servlet，以servlet为核心，接收请求、处理请求，显示处理结果给用户。在此之前这个功能是由Servlet来实现的，现在使用SpringMVC来代替Servlet行驶控制器的角色和功能。 其核心Servlet是：DispatcherServlet。

更多详情查看[官方资料](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc)这里不在赘述。

### MVC架构
![MVC架构图](/iblog/posts/annex/images/essays/SpringMVC与SpringWebFlux-02.jpg)

MVC模式是一种将应用程序分为三个主要部分的架构模式，分别是模型（Model）、视图（View）和控制器（Controller）。模型负责处理数据，视图负责展示数据，控制器负责协调模型和视图之间的交互。

在没有使用SpringMVC之前都是使用Servlet在做Web开发。但是使用Servlet开发在接收请求参数，数据共享，页面跳转等操作相对比较复杂。servlet是java进行web开发的标准，既然springMVC是对servlet的封装，那么很显然SpringMVC底层就是Servlet，SpringMVC就是对Servlet进行深层次的封装。

SpringMVC 是一种基于 Spring 框架的 MVC 设计模型，它是 Spring 框架的一个子项目。SpringMVC 的核心思想是将 MVC 设计模式应用于 Spring 框架，实现了请求-响应模式，将业务逻辑、数据、显示分离，提高了部分代码的复用性，降低了各个模块间的耦合性。

### 请求处理流程
![SpringMVC原理图](/iblog/posts/annex/images/essays/SpringMVC与SpringWebFlux-01.jpg)

流程描述:
- 用户发送请求至前端控制器 `DispatcherServlet`;
- `DispatcherServlet` 收到请求调用 `HandlerMapping` 处理器映射器;
- 处理器映射器找到具体的处理器(可以根据xml配置、注解进行查找)，生成处理器对象及处理器拦截器(如果有则生成)一并返回给 `DispatcherServlet`;
- `DispatcherServlet` 调用 `HandlerAdapter` 处理器适配器;
- `HandlerAdapter` 经过适配调用具体的处理器(`Controller`，也叫后端控制器);
- `Controller` 执行完成返回 `ModelAndView`;
- `HandlerAdapter` 将 `controller执行结果` `ModelAndView` 返回给 `DispatcherServlet`;
- `DispatcherServlet` 将 `ModelAndView` 传给 `ViewReslover` 视图解析器;
- `ViewReslover` 解析后返回具体 `View`;
- `DispatcherServlet` 根据 View 进行渲染视图（即将模型数据填充至视图中）;
- `DispatcherServlet` 响应用户;

### 语法代码示例
```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
```

```java
@Controller
@RequestMapping("/hello")
public class HelloController{
 
   @RequestMapping(method = RequestMethod.GET)
   public String printHello(ModelMap model) {
      model.addAttribute("message", "Hello Spring MVC Framework!");
      return "hello";
   }

}
```

## Spring WebFlux
与Spring Web MVC并行，Spring Framework 5.0引入了一个响应式Web框架，其名称为 "Spring WebFlux"。与Spring MVC不同，它不需要Servlet API，完全异步和非阻塞，又被叫做响应式WebClient。

Spring WebFlux 模块将默认的 web 服务器改为 Netty，所以具有Netty的特点，是完全非阻塞式的。通过少量的容器线程就可以支撑大量的并发访问，有一种池化思想在里面，所以 Spring WebFlux 可以有效提升系统的吞吐量和伸缩性但是并不能使接口的响应时间缩短。

Spring WebFlux 是一个异步非阻塞式的 Web 框架，所以，它特别适合应用在 IO 密集型的服务中，比如微服务网关这样的应用中。
- 比如一个日志监控系统，我们的前端页面将不再需要通过“命令式”的轮询的方式不断向服务器请求数据然后进行更新，而是在建立好通道之后，数据流从系统源源不断流向页面，从而展现实时的指标变化曲线；
- 再比如一个社交平台，朋友的动态、点赞和留言不是手动刷出来的，而是当后台数据变化的时候自动体现到界面上的。

更多信息请查看[官方资料](https://docs.spring.io/spring-framework/docs/current/reference/html/web-reactive.html)这里不在赘述。

### 请求处理流程
Spring WebFlux 底层实现依赖 reactor 和 netty。Spring 做的就是通过抽象和封装，把 reactor 的能力通过 Controller 来使用。

![SpringMVC原理图](/iblog/posts/annex/images/essays/SpringMVC与SpringWebFlux-03.jpg)

请求执行的流程大致和SpringMVC差不多，SpringMVC核心控制器是DispatcherServlet，SpringWebFlux核心处理器是DispatcherHandler：
- 先是通过RequestMapping，拿到HandlerMethod处理器；
- 在通过HandlerMethod寻找合适的HandlerAdapter；
- 拿到合适的适配器对象之后，根据不同规则的Handler执行不同的Handler，这里就包含Controller
- Handler的执行结果返回HandlerResult对象，触发handlerResult方法，针对不同的返回类找到不同的HandlerResultHandler如视图渲染ViewResolutionResultHandler、ServerResponseResultHandler、ResponseBodyResultHandler、ResponseEntityResultHandler不同容器有不同的实现，如Reactor，Jetty，Tomcat等；

### 语法代码示例
```xml
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
```

```java
@RestController
@RequestMapping("/webflux")
public class HelloController {

    @GetMapping("/hello")
    public Mono<String> hello() {
        return Mono.just("Hello Spring Webflux");
    }

    @GetMapping("/posts")
    public Flux<Post> posts() {
        WebClient webClient = WebClient.create();
        Flux<Post> postFlux = webClient.get().uri("http://jsonplaceholder.typicode.com/posts").retrieve().bodyToFlux(Post.class);
        return postFlux;
    }
    
}
```
在 WebFlux 中 Mono 和 Flux 均能充当响应式编程中发布者的角色:
- Mono：返回 0 或 1 个元素，即单个对象;
- Flux：返回 N 个元素，即 List 列表对象;

## 两者使用对比及建议
![SpringMVC原理图](/iblog/posts/annex/images/essays/SpringMVC与SpringWebFlux-04.jpg)

Spring WebFlux 并不是 Spring MVC 的替代方案，两者可以混合使用。都可以使用 Spring MVC 注解，如 @Controller、@RequestMapping等。均可以使用 Tomcat, Jetty, Undertow Servlet 容器。

Spring WebFlux相比较Spring MVC最大的优势在于它是异步非堵塞的框架，可以让我们在不扩充硬件资源的前提下，提升系统的吞吐量和伸缩性；但是由于是异步非堵塞的框架，对于开发人员来说调试起来不太友好。
而 Spring MVC 是同步阻塞的，如果你目前在 Spring MVC 框架中大量使用异步方案，那么，WebFlux 才是你想要的，否则，使用 Spring MVC 才是你的首选。

官方建议：
- 如果已经有了一个运行良好的 SpringMVC 应用程序，则无需更改。命令式编程是编写、理解和调试代码的最简单方法，我们可以选择最多的库，因为从历史上看，大多数都是阻塞的。
- 如果是个新应用且决定使用 非阻塞 Web 技术栈，那么 WebFlux 是个不错的选择。
- 对于使用 Java8 Lambda 或者 Kotlin 且 要求不那么复杂的小型应用程序或微服务来说，WebFlux 也是一个不错的选择
- 在微服务架构中，可以混合使用 SpringMVC 和 Spring WebFlux，两个都支持基于注解的编程模型
- 评估应用程序的一种简单方法是检查其依赖关系。如果要使用阻塞持久性 API（JPA、JDBC）或网络 API，那么 Spring MVC 至少是常见架构的最佳选择
- 如果有一个调用远程服务的 Spring MVC 应用程序，请尝试响应式WebClient
- 对于一个大型团队，向非阻塞、函数式和声明式编程转变的学习曲线是陡峭的。在没有全局开关的情况下，想启动 WebFlux，可以先使用 reactive WebClient。此外，从小处着手并衡量收益。我们预计，对于广泛的应用，这种转变是不必要的。

当我们引入一门新技术到原有的项目中，我们需要评估究竟为我们带来多少益处，同时还要评估为了这些益处所要付出的学习和改造成本，然后衡量收益，如果收益大值得则值得尝试。不能为了装逼而装逼，为了技术而技术。

