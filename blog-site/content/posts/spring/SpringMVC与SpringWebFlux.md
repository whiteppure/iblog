---
title: "SpringMVC与SpringWebFlux"
date: 2023-04-14
draft: false
tags: ["Java","springboot"]
slug: "java-spring-mvc-webflux"
---


## SpringMVC
SpringWebMVC是建立在Servlet API上的原始Web框架，从一开始就包含在Spring框架中。正式名称 "Spring Web MVC "来自其源模块的名称（spring-webmvc），但它更常被称为 "Spring MVC"。

SpringMVC是基于Spring的，是Spring中的一个模块，专门用来做Web开发使用的。
- `Model`：封装了数据与进行数据进行处理的代码，是实际经行数据处理的地方，也是与数据库交互的地方；
- `View`：负责将应用显示给用户和显示模型的状态，一般来说，它生成客户端浏览器可以解释的HTML输出；
- `Controller`：负责视图和模型之间的交互，并将其传递给视图进行渲染；

在没有使用SpringMVC之前都是使用`Servlet`在做Web开发，但是使用`Servlet`开发在接收请求参数，数据共享，页面跳转等操作相对比较复杂。
`Servlet`是Java进行web开发的标准，既然SpringMVC是对Servlet的封装，那么很显然SpringMVC底层就是`Servlet`，SpringMVC就是对`Servlet`进行深层次的封装。其核心`Servlet`是`DispatcherServlet`。

更多详情查看[官方资料](https://docs.spring.io/spring-framework/docs/current/reference/html/web.html#mvc)这里不在赘述。

### MVC架构
![MVC架构图](/iblog/posts/annex/images/essays/SpringMVC与SpringWebFlux-02.jpg)

MVC模式是一种将应用程序分为三个主要部分的架构模式，主要用于分离应用程序的内部表示和用户交互。它由以下三个部分组成：
- `Model`（模型）：处理与应用程序的数据和业务逻辑相关的部分。
- `View`（视图）：处理数据展示的部分，通常是用户界面。
- `Controller`（控制器）：处理用户输入并更新模型和视图的部分。

SpringMVC是一种基于Spring框架的MVC设计模型，它是Spring框架的一个子项目。
SpringMVC的核心思想是将MVC设计模式应用于Spring框架，实现了请求-响应模式，将业务逻辑、数据、显示分离，提高了部分代码的复用性，降低了各个模块间的耦合性。

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

Model模型代表应用程序的核心数据和业务逻辑。它直接管理数据、逻辑和规则，通常与数据库交互。
```java
public class User {
    private Long id;
    private String name;

    // 构造函数、getter 和 setter 方法
    public User(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```
视图是用户界面的部分，用于展示模型的数据。它从模型中获取数据，并将其渲染给用户。在`SpringBoot`中，视图通常是HTML页面或模板。
```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">
<head>
<title>User List</title>
</head>
<body>
<h1>Users</h1>
<table>
    <tr>
        <th>ID</th>
        <th>Name</th>
    </tr>
    <tr th:each="user : ${users}">
        <td th:text="${user.id}"></td>
        <td th:text="${user.name}"></td>
    </tr>
</table>
</body>
</html>
```
控制器处理用户输入，并与模型和视图交互。它负责接收请求、调用模型以获取数据，并将数据传递给视图进行渲染。
```java
@Controller
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public String getAllUsers(Model model) {
        List<User> users = userService.getAllUsers();
        model.addAttribute("users", users);
        return "user-list";  // 返回视图名称
    }

    @GetMapping("/user/{id}")
    public String getUserById(@PathVariable Long id, Model model) {
        User user = userService.getUserById(id);
        model.addAttribute("user", user);
        return "user-detail";  // 返回视图名称
    }

    @PostMapping("/user")
    public String createUser(@RequestParam String name, Model model) {
        User user = userService.createUser(name);
        model.addAttribute("user", user);
        return "redirect:/users";  // 重定向到用户列表
    }
}
```
```java
@Service
public class UserService {

    private List<User> users = new ArrayList<>();
    private AtomicLong counter = new AtomicLong();

    public List<User> getAllUsers() {
        return users;
    }

    public User getUserById(Long id) {
        return users.stream().filter(user -> user.getId().equals(id)).findFirst().orElse(null);
    }

    public User createUser(String name) {
        User user = new User(counter.incrementAndGet(), name);
        users.add(user);
        return user;
    }
}
```

## SpringWebFlux
Spring Framework 5.0引入了一个响应式Web框架，其名称为 "SpringWebFlux"。与Spring MVC不同，它不需要Servlet API，完全异步和非阻塞，又被叫做响应式WebClient。

SpringWebFlux模块将默认的Web服务器改为Netty，所以具有Netty的特点，是完全非阻塞式的。
通过少量的容器线程就可以支撑大量的并发访问，有一种池化思想在里面，所以SpringWebFlux可以有效提升系统的吞吐量和伸缩性但是并不能使接口的响应时间缩短。

SpringWebFlux是一个异步非阻塞式的 Web 框架，所以它特别适合应用在IO密集型的服务中，比如微服务网关这样的应用中。
比如一个日志监控系统，我们的前端页面将不再需要通过“命令式”的轮询的方式不断向服务器请求数据然后进行更新，而是在建立好通道之后，数据流从系统源源不断流向页面，从而展现实时的指标变化曲线。
再比如一个社交平台，朋友的动态、点赞和留言不是手动刷出来的，而是当后台数据变化的时候自动体现到界面上的。

更多信息请查看[官方资料](https://docs.spring.io/spring-framework/reference/web/webflux.html)这里不在赘述。

### 请求处理流程
SpringWebFlux因为将默认的Web服务器改为Netty，所以底层实现依赖Reactor模式。Spring做的就是通过抽象和封装，把Reactor的能力通过Controller来使用。

![SpringMVC与SpringWebFlux](/iblog/posts/annex/images/essays/SpringMVC与SpringWebFlux-03.jpg)

请求执行的流程大致和SpringMVC差不多，SpringMVC核心控制器是`DispatcherServlet`，SpringWebFlux核心处理器是`DispatcherHandler`：
- 先是通过`RequestMapping`，拿到`HandlerMethod`处理器；
- 在通过`HandlerMethod`寻找合适的`HandlerAdapter`；
- 拿到合适的适配器对象之后，根据不同规则的`Handler`执行不同的`Handler`，这里就包含`Controller`；
- `Handler`的执行结果返回`HandlerResult`对象，触发`handlerResult`方法，针对不同的返回类找到不同的`HandlerResultHandler`，如视图渲染`ViewResolutionResultHandler`、`ServerResponseResultHandler`、`ResponseBodyResultHandler`、`ResponseEntityResultHandler`不同容器有不同的实现，如Reactor，Jetty，Tomcat等；

### 语法代码示例
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-webflux</artifactId>
</dependency>
```
```java
public class User {
    private String id;
    private String name;

    // 构造函数、getter 和 setter 方法
    public User(String id, String name) {
        this.id = id;
        this.name = name;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

在WebFlux中`Mono`和`Flux`均能充当响应式编程中发布者的角色：
- `Mono`：表示单个结果的发布者，返回0或1个元素，即单个对象。
- `Flux`：表示多个结果的发布者，返回N个元素，即List列表对象。
```java
@RestController
public class UserController {

    @GetMapping("/users/{id}")
    public Mono<User> getUserById(@PathVariable String id) {
        return Mono.just(new User(id, "User" + id));
    }

    @GetMapping("/users")
    public Flux<User> getAllUsers() {
        return Flux.just(
                new User("1", "User1"),
                new User("2", "User2"),
                new User("3", "User3")
        );
    }
}
```

除了传统的基于注解的控制器，SpringWebFlux还支持基于函数式编程的路由配置。
```java
@Configuration
public class RouterConfig {

    @Bean
    public RouterFunction<ServerResponse> route(UserHandler handler) {
        return route(GET("/users/{id}"), handler::getUserById)
                .andRoute(GET("/users"), handler::getAllUsers);
    }
}
```
```java
@Component
public class UserHandler {

    public Mono<ServerResponse> getUserById(ServerRequest request) {
        String id = request.pathVariable("id");
        return ok().body(Mono.just(new User(id, "User" + id)), User.class);
    }

    public Mono<ServerResponse> getAllUsers(ServerRequest request) {
        return ok().body(Flux.just(
                new User("1", "User1"),
                new User("2", "User2"),
                new User("3", "User3")
        ), User.class);
    }
}
```

## 两者使用对比及建议
![SpringMVC与SpringWebFlux](/iblog/posts/annex/images/essays/SpringMVC与SpringWebFlux-04.jpg)

SpringWebFlux并不是SpringMVC的替代方案，两者可以混合使用，都可以使用SpringMVC注解，如`@Controller`、`@RequestMapping`等。均可以使用Tomcat、Jetty、Undertow Servlet 容器。

SpringWebFlux相比较SpringMVC最大的优势在于它是异步非堵塞的框架，可以让我们在不扩充硬件资源的前提下，提升系统的吞吐量和伸缩性。但是由于是异步非堵塞的框架，对于开发人员来说调试起来不太友好。
而SpringMVC是同步阻塞的，如果你目前在SpringMVC框架中大量使用异步方案，那么WebFlux可能才是你想要的，否则使用SpringMVC才是你的首选。

| 特性         | Spring MVC                                 | Spring WebFlux                             |
|--------------|--------------------------------------------|--------------------------------------------|
| 处理模型     | 基于 Servlet API，阻塞式处理模型             | 基于 Reactor，非阻塞式处理模型              |
| 线程模型     | 每个请求占用一个线程，阻塞等待 I/O 操作       | 非阻塞式，少量线程处理大量并发请求           |
| 适用场景     | 传统的 Web 应用开发，I/O 操作不频繁          | 高并发和高性能需求，I/O 操作频繁            |
| 异步处理     | 支持异步处理，但是仍然是阻塞式               | 原生支持异步和非阻塞处理                    |
| 性能         | 相对于 WebFlux 略低，特别是在高并发场景下   | 高并发场景下性能优秀，更好的资源利用         |
| 调试和开发   | 易于调试和开发，传统的开发模式              | 需要熟悉反应式编程模型，对异步处理有一定了解 |
| 学习曲线     | 较低，广泛的文档和社区支持                  | 较高，需要理解反应式编程概念和 Reactor 框架 |
| 生态系统     | 成熟，大量第三方库和插件支持                | 日渐发展，部分功能和库的支持可能较少         |

[官方建议](https://docs.spring.io/spring-framework/reference/web/webflux/new-framework.html#webflux-framework-choice)：
- 如果已经有了一个运行良好的SpringMVC 应用程序，则无需更改。命令式编程是编写、理解和调试代码的最简单方法，我们可以选择最多的库，因为从历史上看，大多数都是阻塞的。
- 如果是个新应用且决定使用 非阻塞 Web 技术栈，那么 WebFlux 是个不错的选择。
- 对于使用 Java8 Lambda 或者 Kotlin 且 要求不那么复杂的小型应用程序或微服务来说，WebFlux 也是一个不错的选择。
- 在微服务架构中，可以混合使用 SpringMVC 和 Spring WebFlux，两个都支持基于注解的编程模型。
- 评估应用程序的一种简单方法是检查其依赖关系。如果要使用阻塞持久性 API（JPA、JDBC）或网络 API，那么 Spring MVC 至少是常见架构的最佳选择。
- 如果有一个调用远程服务的 Spring MVC 应用程序，请尝试响应式WebClient。
- 对于一个大型团队，向非阻塞、函数式和声明式编程转变的学习曲线是陡峭的。在没有全局开关的情况下，想启动 WebFlux，可以先使用 reactive WebClient。

当我们引入一门新技术到原有的项目中，我们需要评估究竟为我们带来多少益处，同时还要评估为了这些益处所要付出的学习和改造成本，然后衡量收益，如果收益大值得则值得尝试。不能为了装逼而装逼，为了技术而技术。

