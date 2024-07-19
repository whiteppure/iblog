---
title: "Spring详解"
date: 2021-05-13
draft: false
tags: ["Java", "spring", "详解"]
slug: "java-spring"
---



## 概览
Spring是一个轻量级的Java开源框架，是为了解决企业应用开发的复杂性而创建的。Spring的核心是控制反转（IOC）和面向切面（AOP）。
- IOC叫控制反转，在没用IOC之前都要手动`new`创建对象，使用IOC之后由容器进行对象的创建，并且由容器来管理对象，减去了开发上的成本，提高了工作效率。
- AOP叫面向切面编程，在实际项目开发中需要嵌入一些与业务不想关的代码的时候就可以使用AOP。比如，权限日志的增加。

![Spring详解-001](/iblog/posts/annex/images/spring/Spring详解-001.png)

Spring虽然把它当成框架来使用，但其本质是一个容器，即IOC容器。里面最核心是如何创建对象和管理对象，包含了Bean的生命周期和Spring的一些扩展点，也包含对AOP的应用。
除此之外，Spring真正的强大之处在于其生态，它包含了`Spring Framework`、`SpringBoot`、`SpringCloud`等一些列框架，极大提高了开发效率。

`Spring Framework`、`SpringBoot`和`SpringCloud`是Java生态系统中常见的三个框架：
- `Spring Framework`：是整个系列的基础。它提供了核心的IOC容器功能，负责对象的创建和管理，同时支持AOP的应用。`Spring Framework`的模块化设计使得它可以用于各种应用场景，从传统的Web应用到大规模的企业系统都能够灵活应对。
- `SpringBoot`构建在`SpringFramework`之上，是为了简化Spring应用的开发和部署。通过自动配置和起步依赖，`SpringBoot`大大减少了开发者的配置工作，使得快速搭建生产就绪的应用成为可能。`SpringBoot`提供了集成容器和简化的部署方式，使得开发者可以更专注于业务逻辑的开发，而不是繁琐的环境配置。
- `SpringCloud`则进一步扩展了`SpringBoot`，专注于解决分布式系统开发中的复杂性。它提供了诸如服务发现、配置中心、负载均衡、断路器、网关等微服务模式的实现。`SpringCloud`的出现使得开发者能够更轻松地构建和管理分布式系统，提高了系统的弹性和可伸缩性。

## Spring启动流程
![Spring详解-004](/iblog/posts/annex/images/spring/Spring详解-004.png)

Spring启动流程的主要步骤及对应的代码如下：
1. 启动入口，从main方法调用`SpringApplication.run`。
    ```java
    public class MyApplication {
        public static void main(String[] args) {
            SpringApplication.run(MyApplication.class, args);
        }
    }
    ```
2. 初始化，创建`SpringApplication`实例，并设置初始化器和监听器。
    ```java
    public static ConfigurableApplicationContext run(Class<?> primarySource, String... args) {
        return new SpringApplication(primarySource).run(args);
    }
    
    public SpringApplication(Object... sources) {
        initialize(sources);
    }
    
    private void initialize(Object[] sources) {
        this.sources = new LinkedHashSet<>(Arrays.asList(sources));
        this.initializers = getSpringFactoriesInstances(ApplicationContextInitializer.class);
        this.listeners = getSpringFactoriesInstances(ApplicationListener.class);
    }
    ```
3. 配置环境，准备Spring环境，如读取配置文件、系统属性等。
    ```java
    public ConfigurableEnvironment prepareEnvironment(SpringApplicationRunListeners listeners, ApplicationArguments applicationArguments) {
        // 创建并配置环境
        ConfigurableEnvironment environment = getOrCreateEnvironment();
        configureEnvironment(environment, applicationArguments.getSourceArgs());
        listeners.environmentPrepared(environment);
        return environment;
    }
    ```
4. 创建上下文，根据应用类型创建合适的应用上下文。
    ```java
    protected ConfigurableApplicationContext createApplicationContext() {
        Class<?> contextClass = this.applicationContextClass;
        if (contextClass == null) {
            try {
                contextClass = Class.forName(this.webApplicationType.getApplicationContextClassName());
            }
            catch (ClassNotFoundException ex) {
                throw new IllegalStateException(
                        "Unable to create a default ApplicationContext, "
                                + "please specify an ApplicationContextClass",
                        ex);
            }
        }
        return (ConfigurableApplicationContext) BeanUtils.instantiateClass(contextClass);
    }
    ```
4. 刷新上下文，初始化所有单例Bean，启动Spring生命周期。
    ```java
    public void refresh() throws BeansException, IllegalStateException {
        synchronized (this.startupShutdownMonitor) {
            prepareRefresh();
            ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();
            prepareBeanFactory(beanFactory);
            postProcessBeanFactory(beanFactory);
            invokeBeanFactoryPostProcessors(beanFactory);
            registerBeanPostProcessors(beanFactory);
            initMessageSource();
            initApplicationEventMulticaster();
            onRefresh();
            registerListeners();
            finishBeanFactoryInitialization(beanFactory);
            finishRefresh();
        }
    }
    ```
5. 通知监听器启动完成，执行`ApplicationRunner`和`CommandLineRunner`。
    ```java
    private void callRunners(ApplicationContext context, ApplicationArguments args) {
        List<Object> runners = new ArrayList<>();
        runners.addAll(context.getBeansOfType(ApplicationRunner.class).values());
        runners.addAll(context.getBeansOfType(CommandLineRunner.class).values());
        AnnotationAwareOrderComparator.sort(runners);
        for (Object runner : new LinkedHashSet<>(runners)) {
            if (runner instanceof ApplicationRunner) {
                callRunner((ApplicationRunner) runner, args);
            }
            if (runner instanceof CommandLineRunner) {
                callRunner((CommandLineRunner) runner, args);
            }
        }
    }
    ```

其中核心方法为`refresh()`刷新上下文方法。
```java
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        // 1. 准备刷新上下文
        prepareRefresh();

        // 2. 获取BeanFactory并进行初始化
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

        // 3. 为BeanFactory配置上下文相关信息
        prepareBeanFactory(beanFactory);

        try {
            // 4. 子类覆盖方法，做进一步的BeanFactory初始化
            postProcessBeanFactory(beanFactory);

            // 5. 调用BeanFactoryPostProcessors
            invokeBeanFactoryPostProcessors(beanFactory);

            // 6. 注册BeanPostProcessors
            registerBeanPostProcessors(beanFactory);

            // 7. 初始化消息源（用于国际化）
            initMessageSource();

            // 8. 初始化事件广播器
            initApplicationEventMulticaster();

            // 9. 子类覆盖方法，在上下文刷新的时候进行进一步的处理
            onRefresh();

            // 10. 注册监听器以便监听事件
            registerListeners();

            // 11. 初始化所有单例Bean
            finishBeanFactoryInitialization(beanFactory);

            // 12. 完成刷新过程，通知生命周期处理器
            finishRefresh();
        }
        catch (BeansException ex) {
            // 如果在刷新过程中出现异常，则销毁已创建的单例Beans以避免资源泄漏
            destroyBeans();
            cancelRefresh(ex);
            throw ex;
        }
        finally {
            // 重置标志位
            resetCommonCaches();
        }
    }
}
```
1. `prepareRefresh`准备刷新容器，此方法做一些刷新容器的准备工作：
   - 设置开启时间和对应标志位。
   - 获取环境对象。
   - 设置监听器和一些时间的集合对象。
2. `obtainFreshBeanFactory`创建容器对象：`DefaultListableBeanFactory`；加载xml配置文件属性值到工厂中，最重要的是`BeanDefinition`。
3. `prepareBeanFactory`完成Bean工厂的某些初始化操作：
   - 设置`BeanDefinition`的类加载器。
   - 设置Spring容器默认的类型转换器。
   - 设置Spring解析EL表达式的解析器。
   - 添加一个Bean的后置处理器`ApplicationContextAwareProcessor`。
   - 将Bean工厂的一些类，比如`ApplicationContext`直接注册到单例池中。
   - 去除一些在`byType`或者`byName`的时候需要过滤掉的一些Bean（Spring在依赖注入的时候会先在这些默认注册的Bean中进行byType找，如果找到了，就加入到列表中，简单来说就是比如你在Bean中依赖注入了`ApplicationContext`，那么Spring会把默认注册的这些Bean中找到然后进行注册）。
   - 将系统的环境信息、Spring容器的启动环境信息、操作系统的环境信息直接注册成一个单例的Bean。
4. `postProcessBeanFactory`这里是一个空壳方法，Spring目前还没有对他进行实现;这个方法是留给子类进行实现的，后续可以添加一些用户自定义的或者默认的一些特殊的后置处理器工程到`beanFactory`中去。
5. `invokeBeanFactoryPostProcessors` 调用后置处理器；将系统中所有符合条件的普通类都扫描成了一个`BeanDefinition`并且放入到了`beanDefinitionMap`中，包括业务的Bean，Bean的后置处理器、Bean工厂的后置处理器等。
   - 将标记为容器单例类扫描成`BeanDefinition`放入`BeanDefinitionMap`。
   - 处理`@Import`注解。
   - 如果我们的配置类是`@Configuration`的，那么会生成这个配置类的CGLIB代理类，如果没有加`@Configuration`，则就是一个普通Bean。
6. `registerBeanPostProcessors`从`beanDefinitionMap`中取出Bean的后置处理器然后放入到后置处理器的缓存列表中。
7. `initMessageSource`初始化国际化资源信息。
8. `initApplicationEventMulticaster`事件注册器初始化。
9. `onRefresh`空壳方法，留给子类实现。
10. `registerListeners`将容器中和`BeanDefinitionMap`中的监听器添加到事件监听器中。
11. `finishBeanFactoryInitialization`创建单例池，将容器中非懒加载的Bean，单例Bean创建对象放入单例池中，包括容器的依赖注入。
12. `finishRefresh`容器启动过后，发布事件。

## Spring循环依赖与三级缓存
Spring循环依赖是指两个或多个Bean相互依赖，导致Spring无法在不部分实例化这些Bean的情况下完成它们的创建。
在Spring框架中，为了解决循环依赖问题，Spring使用了三级缓存机制。

![Spring详解-003](/iblog/posts/annex/images/spring/Spring详解-003.png)

假设BeanA依赖BeanB，BeanB依赖BeanA，Spring循环依赖调用流程如下：
1. 初始化BeanA：
   - 检查一级缓存（`singletonObjects`），发现没有BeanA。
   - 检查二级缓存（`earlySingletonObjects`），发现没有BeanA。
   - 检查三级缓存（`singletonFactories`），发现没有BeanA。
   - 开始创建BeanA的实例。
2. 创建BeanA过程中发现需要BeanB：
   - 将BeanA的创建流程放入三级缓存（`singletonFactories`）。
3. 初始化BeanB：
   - 检查一级缓存（`singletonObjects`），发现没有BeanB。
   - 检查二级缓存（`earlySingletonObjects`），发现没有BeanB。
   - 检查三级缓存（`singletonFactories`），发现没有BeanB。
   - 开始创建BeanB的实例。
4. 创建BeanB过程中发现需要BeanA：
   - 检查一级缓存（`singletonObjects`），发现没有BeanA。
   - 检查二级缓存（`earlySingletonObjects`），发现没有BeanA。
   - 检查三级缓存（`singletonFactories`），发现有BeanA。
   - 从三级缓存中获取BeanA的创建流程，将BeanA提前暴露到二级缓存（`earlySingletonObjects`）。
5. 继续初始化BeanB：
   - 继续BeanB的初始化，完成依赖注入。
   - 将完全初始化好的BeanB放入一级缓存（`singletonObjects`），并从三级缓存中移除BeanB的工厂对象。
6. 完成初始化BeanA：
   - 从二级缓存中获取提前暴露的BeanA，并完成依赖注入。
   - 将完全初始化好的BeanA放入一级缓存（`singletonObjects`），并从二级缓存中移除BeanA的部分实例。

简单来说，首先检查一级、二级和三级缓存中是否有BeanA，如果没有，开始创建BeanA。因为BeanA依赖BeanB，在创建BeanA时将其创建流程放入三级缓存。
检查一级、二级和三级缓存中是否有BeanB，如果没有，开始创建BeanB。又因为BeanB依赖BeanA，此时三级缓存中有BeanA，从三级缓存中获取BeanA，然后将BeanA提前暴露到二级缓存。
继续初始化BeanB，完成后将BeanB放入一级缓存，并从三级缓存中移除。接着从二级缓存中获取提前暴露的BeanA，完成依赖注入。将完全初始化好的BeanA放入一级缓存，并从二级缓存中移除。

在Spring Boot 2.6.0之前，Spring可以通过其三级缓存机制自动解决循环依赖的问题。但从2.6.0开始，如果存在循环依赖问题，Spring会抛出异常。
在Spring Boot 2.6.0及之后的版本中，默认情况下，Spring不再自动解决循环依赖。如果在应用中遇到循环依赖问题，可以通过以下方法解决：
- 重新设计Bean的依赖关系：这是最推荐的方式。通过重新设计Bean的依赖关系，消除循环依赖，从根本上解决问题。
- 使用`@Lazy`注解：将其中一个Bean的依赖注入设置为懒加载，延迟依赖注入，从而打破循环依赖。
- 设置`allow-circular-references`属性：如果确实需要循环依赖，可以在配置文件中设置`allow-circular-references`属性为`true`，允许Spring处理循环依赖。

## IOC
Spring的核心之一是IOC，IOC全称为`Inversion of Control`，中文译为控制反转，是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。
IOC的一个重点是在系统运行中，动态的向某个对象提供它所需要的其他对象。这一点是通过DI（`Dependency Injection`，依赖注入）来实现的。

所谓IOC，对于Spring框架来说，就是由Spring来负责**对象的创建、配置和管理**，所以可将IOC理解为一个大容器。IOC通过将对象创建和管理的控制权从应用代码转移到Spring容器中，实现了松耦合设计。
IOC使用依赖注入（DI）来管理组成一个应用程序的组件，这些对象被称为Spring Beans。

管理Bean的创建、配置和生命周期，Spring提供了两个主要的IOC容器：`BeanFactory`和`ApplicationContext`。
IOC容器管理的对象，通常使用注解，如`@Component`、`@Service`、`@Autowired`，或XML配置声明Bean。
IOC容器的工作流程：
1. 读取配置，通过XML文件、注解或Java配置类读取Bean定义和依赖关系。
2. 创建和配置Bean，容器根据配置实例化Bean，并注入它们的依赖。
3. 管理Bean生命周期，容器负责调用Bean的初始化和销毁方法，管理其整个生命周期。

通过Spring的IOC容器，开发者可以更加专注于业务逻辑，而无需关心对象的创建和管理，从而提高了代码的可维护性和可扩展性。

###  IOC工作原理
IOC容器是Spring框架的核心，它负责管理应用程序中对象的生命周期和依赖关系。
1. 想要管理Bean，首先需要将Bean加载进来。IOC容器首先需要加载应用程序的配置元数据，这些配置可以通过XML文件、Java注解或者Java配置类等方式定义。
加载完配置之后，容器会使用相应的解析器（如Dom4j解析XML配置文件），将配置信息转换为容器可以理解的数据结构，通常是`BeanDefinition`对象。`BeanDefinition`包含了类的名称、依赖关系、初始化方法、销毁方法等元数据信息。
    ```text
    <!-- applicationContext.xml -->
    <bean id="userRepository" class="com.example.UserRepository">
        <!-- 定义UserRepository的依赖或配置 -->
    </bean>
    
    <bean id="userService" class="com.example.UserService">
        <property name="userRepository" ref="userRepository" />
    </bean>
    
    // 加载和解析XML配置
    ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");
    ```
3. 一旦容器解析了Bean的配置信息，它会根据这些信息使用Java的反射机制来创建Bean的实例。通常情况下，Spring会调用Bean的默认构造方法来实例化对象。
    ```java
    // 获取UserService Bean
    UserService userService = (UserService) context.getBean("userService");
    ```
3. 对象实例化完成，容器会根据配置文件或者注解中定义的依赖关系，将其他Bean的实例或者值注入到当前Bean中。依赖注入可以通过构造函数注入、Setter方法注入或者字段注入来完成。
    ```java
    public class UserService {
        private UserRepository userRepository;
    
        // Setter方法注入
        public void setUserRepository(UserRepository userRepository) {
            this.userRepository = userRepository;
        }
    
        // 其他方法
    }
    ```
4. 在依赖注入完成后，如果配置了初始化方法，例如使用`init-method`指定的方法、实现`InitializingBean`接口的方法或者使用`@PostConstruct`注解标记的方法），容器会调用这些方法来执行一些初始化的操作，例如加载资源、建立连接等。
    ```text
    <!-- applicationContext.xml -->
    <bean id="userRepository" class="com.example.UserRepository" init-method="init" destroy-method="destroy">
        <!-- 定义UserRepository的依赖或配置 -->
    </bean>
    
    
    // UserRepository.java
    public class UserRepository {
        // 初始化方法
        public void init() {
        System.out.println("UserRepository 初始化方法被调用");
        }
    
        // 销毁方法
        public void destroy() {
            System.out.println("UserRepository 销毁方法被调用");
        }
    }
    ```

### Bean的生命周期
Spring中的Bean是指由Spring容器管理的对象实例。
在Spring框架中，Bean是应用程序的核心组件，它们由Spring容器创建、组装和管理，以帮助开发者实现松耦合、可测试和可维护的代码。

Spring Bean的生命周期包含从创建到销毁的一系列过程。即Bean的 `实例化->初始化->使用->销毁`的过程。
Spring中的Bean可以根据其作用域的不同可分为，单例Bean、原型Bean，不同作用域的Bean生命周期也不同。

| 特征               | 单例Bean                                                         | 原型Bean                                                         |
|--------------------|------------------------------------------------------------------|------------------------------------------------------------------|
| 创建               | 容器启动时创建一次。                                              | 每次请求时创建新实例。                                            |
| 作用域管理         | 由Spring容器管理。                                                | 每次请求时由Spring容器管理新实例。                                |
| 线程安全性         | 单例Bean在多线程环境下共享。                                       | 原型Bean本身不具备线程安全性。                                    |
| 适用性             | 适用于无状态Bean、缓存对象、共享资源等。<br>Spring中的默认作用域。 | 适用于有状态Bean、需要频繁重新初始化的对象等。<br>在每次请求时需要新实例。 |
| 销毁管理           | 由Spring容器自动管理。<br>- @PreDestroy 方法（如果存在）。<br>- DisposableBean.destroy() 方法（如果实现）。<br>- 自定义销毁方法（如果在Bean定义中指定）。 | 没有自动的Spring管理销毁过程。<br>- 需要由客户端手动管理销毁。<br>- 可以通过实现DisposableBean接口或自定义方法手动释放资源。 |

单实例Bean生命周期：
1. 实例化：在容器启动时创建该Bean的唯一实例。
2. 初始化：
    - 初始化前置处理：调用所有注册的`BeanPostProcessor`的`postProcessBeforeInitialization`方法，可以在初始化之前对Bean进行修改。
    - 初始化：按照顺序执行以下方法，如果Bean实现了`InitializingBean`接口，则调用其`afterPropertiesSet`方法；如果在Bean定义中指定了`init-method`，则调用这个方法；如果Bean中有用`@PostConstruct`注解标记的方法，则调用该方法。
    - 初始化后处理：调用所有注册的`BeanPostProcessor`的`postProcessAfterInitialization`方法，可以在初始化之后对Bean进行修改。
3. 使用：当Bean初始化之后，Bean处于就绪状态，可以被应用程序中的其他组件使用。
4. 销毁：
    - 销毁前处理：在销毁之前，Spring容器会依次调用注册的所有`BeanPostProcessor`的`postProcessBeforeDestruction`方法。如果Bean类中有用`@PreDestroy`注解标记的方法，Spring容器会在销毁之前调用该方法。
    - 销毁：如果在Bean的定义中通过配置`destroy-method`属性指定了销毁方法，Spring容器会调用这个方法来执行特定的清理操作。

单例Bean和多实例Bean的生命周期主要区别在于实例化和销毁的管理方式，单例Bean在容器启动时创建一个实例，并由容器负责管理其生命周期的完整过程。
而多实例Bean在每次请求时创建新的实例，并且销毁过程需要开发者手动管理。
```java
@Configuration
public class AppConfig {

    @Bean(initMethod = "init", destroyMethod = "destroy")
    @Scope("singleton")
    public SingletonBean singletonBean() {
        return new SingletonBean();
    }

    @Bean(initMethod = "init", destroyMethod = "destroy")
    @Scope("prototype")
    public PrototypeBean prototypeBean() {
        return new PrototypeBean();
    }

    public static class SingletonBean implements InitializingBean, DisposableBean {
        public SingletonBean() {
            System.out.println("SingletonBean 实例化");
        }

        @PostConstruct
        public void postConstruct() {
            System.out.println("SingletonBean @PostConstruct 方法调用");
        }

        @Override
        public void afterPropertiesSet() {
            System.out.println("SingletonBean afterPropertiesSet 方法调用");
        }

        public void init() {
            System.out.println("SingletonBean 自定义初始化方法调用");
        }

        @PreDestroy
        public void preDestroy() {
            System.out.println("SingletonBean @PreDestroy 方法调用");
        }

        @Override
        public void destroy() {
            System.out.println("SingletonBean destroy 方法调用");
        }

        public void customDestroy() {
            System.out.println("SingletonBean 自定义销毁方法调用");
        }
    }

    public static class PrototypeBean implements InitializingBean, DisposableBean {
        public PrototypeBean() {
            System.out.println("PrototypeBean 实例化");
        }

        @PostConstruct
        public void postConstruct() {
            System.out.println("PrototypeBean @PostConstruct 方法调用");
        }

        @Override
        public void afterPropertiesSet() {
            System.out.println("PrototypeBean afterPropertiesSet 方法调用");
        }

        public void init() {
            System.out.println("PrototypeBean 自定义初始化方法调用");
        }

        @PreDestroy
        public void preDestroy() {
            System.out.println("PrototypeBean @PreDestroy 方法调用");
        }

        @Override
        public void destroy() {
            System.out.println("PrototypeBean destroy 方法调用");
        }

        public void customDestroy() {
            System.out.println("PrototypeBean 自定义销毁方法调用");
        }
    }

    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        SingletonBean singletonBean1 = context.getBean(SingletonBean.class);
        SingletonBean singletonBean2 = context.getBean(SingletonBean.class);

        System.out.println("singletonBean1 == singletonBean2 : " + (singletonBean1 == singletonBean2));

        PrototypeBean prototypeBean1 = context.getBean(PrototypeBean.class);
        PrototypeBean prototypeBean2 = context.getBean(PrototypeBean.class);

        System.out.println("prototypeBean1 == prototypeBean2 : " + (prototypeBean1 == prototypeBean2));

        context.close();

        // 手动销毁 Prototype Bean
        prototypeBean1.destroy();
        prototypeBean2.destroy();
    }
}
```

举个例子，来更好的理解Bean的生命周期：
1. 首先，在Spring的配置文件（如XML配置）或者使用注解方式，我们定义`UserService`类作为一个Bean，并配置它的初始化方法、销毁方法以及其他属性。
    ```java
    // UserService.java
    public class UserService implements InitializingBean, DisposableBean, BeanNameAware {
        private String message;
    
        // 初始化方法
        public void init() {
            System.out.println("UserService 初始化方法被调用");
        }
    
        // 销毁方法
        public void destroy() {
            System.out.println("UserService 销毁方法被调用");
        }
    
        // Setter 方法
        public void setMessage(String message) {
            this.message = message;
        }
    
        // Getter 方法
        public String getMessage() {
            return message;
        }
    
        // 实现 InitializingBean 接口的方法
        @Override
        public void afterPropertiesSet() throws Exception {
            System.out.println("UserService InitializingBean 的 afterPropertiesSet 方法被调用");
        }
    
        // 实现 DisposableBean 接口的方法
        @Override
        public void destroy() throws Exception {
            System.out.println("UserService DisposableBean 的 destroy 方法被调用");
        }
    
        // 实现 BeanNameAware 接口的方法
        @Override
        public void setBeanName(String name) {
            System.out.println("UserService BeanNameAware 的 setBeanName 方法被调用，Bean的名称为：" + name);
        }
    }
    ```
2. 在Spring的配置文件中，我们将UserService类定义为一个Bean，并配置初始化方法、销毁方法以及其他属性。
    ```xml
    <!-- applicationContext.xml -->
    <bean id="userService" class="com.example.UserService" init-method="init" destroy-method="destroy">
        <property name="message" value="Hello, Spring!" />
    </bean>
    ```
3. 当应用程序启动并且Spring容器加载配置时，将会执行以下步骤来管理`UserService`Bean的生命周期：
    - 实例化：Spring容器根据配置文件或者注解，实例化 `UserService` 类的一个对象实例。
    - 依赖注入：将配置的属性（如`message`）注入到`UserService`实例中。
    - 初始化：调用`init-method`指定的初始化方法或者`InitializingBean`接口的`afterPropertiesSet()`方法，例如执行`init()`方法。在初始化过程中，还可以调用`BeanNameAware`接口的方法，获取和设置Bean的名称。
    - 使用：`UserService`Bean可以被应用程序的其他组件使用，执行其业务逻辑，如打印消息。
    - 销毁：当应用程序关闭时，Spring容器会调用`destroy-method`指定的销毁方法或者`DisposableBean`接口的`destroy()`方法，例如执行`destroy()`方法。

### Bean的自动装配
Bean的自动装配是Spring框架提供的一种便捷的方式，用于自动解析和设置Bean之间的依赖关系，而无需显式配置每一个依赖关系的方式。Spring支持以下几种自动装配的方式：
1. 根据类型自动装配：Spring会自动将一个属性与同一上下文中具有兼容类型的Bean进行匹配。如果容器中存在多个符合类型的Bean，则会抛出异常。
    ```java
    public interface UserRepository {
        // 接口定义
    }
    
    @Component
    public class UserRepositoryImpl1 implements UserRepository {
        // 实现1
    }
    
    @Component
    public class UserRepositoryImpl2 implements UserRepository {
        // 实现2
    }
    
    // 示例：根据类型自动装配
    @Autowired
    private UserRepository userRepository;
    ```
2. 根据名称自动装配：Spring会自动将一个属性与容器中相同名称的Bean进行匹配，要求Bean的名称必须与属性名称完全一致。
    ```java
    public interface UserRepository {
        // 接口定义
    }
   
    @Component("userRepository1")
    public class UserRepositoryImpl1 implements UserRepository {
        // 实现1
    }
    
    @Component("userRepository2")
    public class UserRepositoryImpl2 implements UserRepository {
        // 实现2
    }
    
    // 示例：根据名称自动装配
    @Autowired
    private UserRepository userRepository;
    ```
3. 构造函数自动装配：Spring会自动通过构造函数来注入依赖，从而避免了使用`@Autowired`注解的繁琐。Spring会查找与构造函数参数类型相匹配的Bean，并自动进行注入。
    ```java
    // 示例：构造函数自动装配
    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    ```
4. 自动装配标识符：可以使用`@Autowired`注解结合`@Qualifier`注解来指定具体的Bean名称，来解决多个相同类型Bean的自动装配歧义问题。
    ```java
    // 示例：结合@Qualifier注解指定Bean名称
    @Autowired
    @Qualifier("userRepository")
    private UserRepository userRepository;
    ```
5. 自动装配和主候选Bean：可以使用`@Primary`注解来标识一个主要的Bean候选者，当存在多个匹配的Bean时，Spring会优先选择标有`@Primary`注解的Bean进行注入。
    ```java
    // 示例：使用@Primary注解标识主候选Bean
    @Component
    @Primary
    public class PrimaryUserRepository implements UserRepository {
        // 实现代码
    }
    ```

在Spring中用于实现自动装配的注解有三个，它们都能自动注入依赖，但在一些细节上有所区别。

| 自动装配       | 来源                             | 装配方式               | 支持 @Primary   | 支持的属性         |
| -------------- | -------------------------------- |--------------------| --------------- | ------------------------------ |
| `@Autowired`   | Spring 框架原生                   | 根据类型装配             | 是              | `required` (boolean)，指定是否必须注入，默认为`true`。 |
| `@Resource`    | JSR-250 (Java EE 标准)            | 根据名称装配，按名称找不到时根据类型 | 否              | `name` (String)，指定要装配的 Bean 名称，默认为属性名称。 |
| `@Inject`      | JSR-330 (Java EE 标准)            | 根据类型装配             | 是              | 无                            |

在日常开发中，都是使用SpringBoot进行开发，一般使用`@Autowired`注解就够了，适合大多数Spring应用场景。

#### @Autowired
`@Autowired`是Spring框架中用于自动装配Bean的主要方式之一。它可以根据类型来自动注入依赖关系。
```java
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired {

	/**
	 * Declares whether the annotated dependency is required.
	 * <p>Defaults to {@code true}.
	 */
	boolean required() default true;

}
```
在使用`@Autowired`时，Spring会尝试将一个属性与容器中具有兼容类型的Bean进行匹配。
```java
@Component
public class UserService {
    
    private UserRepository userRepository;
    
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```
如果存在多个同类型的Bean，可以结合`@Primary`注解，指定优先级最高的Bean进行注入。
```java
@Component
public class UserRepositoryImpl1 implements UserRepository {
    // implementation
}

@Component
@Primary
public class UserRepositoryImpl2 implements UserRepository {
    // implementation
}

@Component
public class UserService {
    
    private UserRepository userRepository;
    
    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```
除了使用`@Primary`还可以使用`@Qualifier`注解来指定具体的Bean名称，来解决多个相同类型Bean的自动装配歧义问题。
```java
@Component("userRepository1")
public class UserRepositoryImpl1 implements UserRepository {
    // 实现1
}

@Component("userRepository2")
public class UserRepositoryImpl2 implements UserRepository {
    // 实现2
}

// 示例：结合@Qualifier注解指定Bean名称
@Autowired
@Qualifier("userRepository2")
private UserRepository userRepository;
```
`@Autowired`可以使用`required`属性控制是否要求依赖关系存在，默认为`true`，表示必须存在兼容的Bean，设为`false`可以允许`null`值注入。
```java
@Component
public class UserService {
    
    private UserRepository userRepository;
    
    @Autowired(required = false)
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
```

`@Autowired`可以放在构造器、参数、方法、属性上。
1. 构造器注入：可以在构造器上使用`@Autowired`来完成构造器注入，Spring会自动根据类型进行注入。
    ```java
    @Component
    public class UserService {
    
        private final UserRepository userRepository;
    
        @Autowired
        public UserService(UserRepository userRepository) {
            this.userRepository = userRepository;
        }
    }
    ```
2. 属性注入：可以直接在属性上使用`@Autowired`注解来进行依赖注入。
    ```java
    @Component
    public class UserService {
    
        @Autowired
        private UserRepository userRepository;
    }
    ```
3. 方法注入：可以在方法上使用`@Autowired`注解，Spring会在初始化Bean时调用这些方法完成依赖注入。
    ```java
    @Component
    public class UserService {
    
        private UserRepository userRepository;
    
        @Autowired
        public void setUserRepository(UserRepository userRepository) {
            this.userRepository = userRepository;
        }
    }
    ```
4. 参数注入：可以在方法参数上使用`@Autowired`注解，Spring会根据参数类型自动注入对应的Bean。
    ```java
    @Component
    public class UserService {
    
        private UserRepository userRepository;
    
        @Autowired
        public void setUserRepository(UserRepository userRepository) {
            this.userRepository = userRepository;
        }
    
        public void processUserData(@Autowired User user) {
        }
    }
    ```


`@Autowired`的实现原理，是通过`@Autowired`后置处理器实现的。
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
```text
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

#### @Resource
`@Resource`注解来自`JSR-250`，JDK自带，主要用于通过名称注入依赖。它的行为类似于`@Autowired`，但它更倾向于按名称进行注入。
默认情况下，`@Resource`注解按名称进行注入。如果找不到同名的Bean，再按类型进行匹配。它不支持`@Primary`，如果存在多个同类型的Bean且未指定`name`属性，会抛出异常。
```java
@Component
public class UserService {
    
    @Resource(name = "userRepositoryImpl1")
    private UserRepository userRepository;
}
```
假设我们有一个旧项目，其中大量使用了JDK标准的`@Resource`注解进行依赖注入，而我们现在想要将项目迁移到Spring，同时保持现有的依赖注入逻辑不变。
在这种情况下，我们可以继续使用`@Resource`注解进行依赖注入。

#### @Inject
`@Inject`注解来自`JSR-330`，需要导入`javax.inject`包。它的行为与`@Autowired`类似，但没有任何属性。
```xml
<dependency>
    <groupId>javax.inject</groupId>
    <artifactId>javax.inject</artifactId>
    <version>1</version>
</dependency>
```
`@Inject`注解按类型进行注入，可以结合`@Primary`注解，指定优先级最高的Bean进行注入。
```java
@Component
public class UserService {

    @Inject
    @Named("userRepositoryImpl1")
    private UserRepository userRepository;
}

// Define multiple implementations
@Component
@Named("userRepositoryImpl1")
public class UserRepositoryImpl1 implements UserRepository {
    // implementation details
}

@Component
@Named("userRepositoryImpl2")
public class UserRepositoryImpl2 implements UserRepository {
    // implementation details
}
```
也可以结合`@Named`注解，显式指定要注入的Bean名称，解决多个同类型Bean的注入问题。
```java
@Component("userRepository1")
public class UserRepositoryImpl1 implements UserRepository {
    // 实现1
}

@Primary
@Component("userRepository2")
public class UserRepositoryImpl2 implements UserRepository {
    // 实现2
}

@Component
public class UserService {

    @Inject
    @Named("userRepository1")
    private UserRepository userRepository;
}
```
假设我们有一个项目，需要在不同的环境中运行。在本地开发时，我们使用Spring，但在生产环境中，我们使用 Java EE 容器，这些容器使用 CDI（Contexts and Dependency Injection）作为依赖注入框架。
为了在不同的环境中都能够使用相同的代码进行依赖注入，我们可以使用`JSR-330`标准的`@Inject`注解。这种方式使得代码能够在Spring和Java EE环境中都能正常运行。
> CDI（Contexts and Dependency Injection，上下文与依赖注入）是 Java EE 标准的一部分，定义了一种类型安全的依赖注入机制，主要用于管理 Java EE 应用程序中的生命周期和依赖关系。CDI 提供了一种统一的、标准的依赖注入方式，使得开发者可以更容易地管理对象的创建、销毁以及对象之间的依赖关系。

### 使用Spring底层组件
为了在Spring框架的基础上实现更加细粒度的控制或定制化需求，可以使用Spring底层组件。

`Aware`接口是一组特定于Spring容器的接口，允许beans感知和与Spring容器进行交互。
通过实现`Aware`接口的子接口，来使用Spring的底层的组件。`Aware`接口类似于回调方法的形式在Spring加载的时候将我们自定以的组件加载。
```java
/**
 * A marker superinterface indicating that a bean is eligible to be notified by the
 * Spring container of a particular framework object through a callback-style method.
 * The actual method signature is determined by individual subinterfaces but should
 * typically consist of just one void-returning method that accepts a single argument.
 */
public interface Aware {}
```
![Aware子接口](/iblog/posts/annex/images/essays/Aware子接口.png)

常用的`Aware`接口：
- `ApplicationContextAware`，允许Bean访问`ApplicationContext`，从而可以访问容器中的其他Bean或执行更高级的容器操作。
    ```java
    @Component
    public class MyBean implements ApplicationContextAware {
    
        private ApplicationContext applicationContext;
    
        @Override
        public void setApplicationContext(ApplicationContext applicationContext) {
            this.applicationContext = applicationContext;
        }
    
        public void someMethod() {
            // 使用 ApplicationContext 获取其他 Bean
            AnotherBean anotherBean = applicationContext.getBean(AnotherBean.class);
            // 执行更高级的容器操作，如发布事件等
            applicationContext.publishEvent(new CustomEvent(this, "Some message"));
        }
    }
    ```
- `BeanFactoryAware`允许Bean访问配置它的Bean工厂。
    ```java
    @Component
    public class MyBean implements BeanFactoryAware {
    
        private BeanFactory beanFactory;
    
        @Override
        public void setBeanFactory(BeanFactory beanFactory) {
            this.beanFactory = beanFactory;
        }
    
        public void someMethod() {
            // 使用 BeanFactory 获取其他 Bean
            AnotherBean anotherBean = beanFactory.getBean(AnotherBean.class);
            // 可以进一步操作 BeanFactory，如获取 Bean 的定义信息等
            String[] beanDefinitionNames = beanFactory.getBeanDefinitionNames();
        }
    }
    ```

`BeanPostProcessor`也是常用的底层组件。它是`Bean`的后置处理器，在初始化前后进行处理工作。
需要在Bean实例化后和初始化前后执行自定义的处理逻辑，如AOP切面的实现、自定义注解处理等。调用顺序为：
```text
创建对象 --> postProcessBeforeInitialization --> 初始化 --> postProcessAfterInitialization --> 销毁
```
```java
public class MainTest {
    public static void main(String[] args) {
        // 获取Spring IOC容器
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(DemoConfiguration.class);
        System.out.println("容器初始化完成...");

        annotationConfigApplicationContext.close();
        System.out.println("容器销毁了...");
    }
}

@Configuration
class DemoConfiguration implements BeanPostProcessor {

    @Bean(initMethod = "init", destroyMethod = "destroy")
    public DemoEntity getDemoEntity(){
       return new DemoEntity();
    }

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("调用了 postProcessBeforeInitialization");
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        System.out.println("调用了 postProcessAfterInitialization");
        return bean;
    }
}

@Component
class DemoEntity  {
    public DemoEntity(){
        System.out.println("调用了构造器...");
    }

    public void destroy(){
        System.out.println("调用了销毁方法...");
    }

    public void init() {
        System.out.println("调用了初始化方法...");
    }
}
```
通过打断点可以看到，在创建Bean的时候会调用`AbstractAutowireCapableBeanFactory`类的`doCreateBean`方法，这也是创建Bean的核心方法。
```java
protected Object doCreateBean(String beanName, RootBeanDefinition mbd, Object[] args) throws BeanCreationException {
    // 创建 Bean 实例
    Object beanInstance = createBeanInstance(mbd, beanName, args);
    
    // 提前暴露已经创建的 Bean 实例，用于解决循环依赖问题
    Object exposedObject = beanInstance;
    
    try {
        // 给 Bean 实例应用属性填充，包括依赖注入
        populateBean(beanName, mbd, instanceWrapper);
        
        // 初始化 Bean，执行各种初始化方法
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }catch (Exception ex) {
        throw new BeanCreationException(beanName, "Initialization of bean failed", ex);
    }
    
    // 注册销毁回调，用于在 Bean 销毁时执行清理操作
    registerDisposableBeanIfNecessary(beanName, exposedObject, mbd);
    
    return exposedObject;
}
```
`doCreateBean`方法中核心方法为`populateBean`方法，其调用栈大致如下：
```text
populateBean(){
    applyBeanPostProcessorsBeforeInitialization() 
        --> invokeInitMethods()
        --> applyBeanPostProcessorsAfterInitialization()
}
```
在初始化之前调用`populateBean()`方法给Bean进行属性赋值，之后再调用`applyBeanPostProcessorsBeforeInitialization`方法。
```java
public Object applyBeanPostProcessorsBeforeInitialization(Object existingBean, String beanName)throws BeansException {
    Object result = existingBean;
    for (BeanPostProcessor processor : getBeanPostProcessors()) {
        Object current = processor.postProcessBeforeInitialization(result, beanName);
        if (current == null) {
            return result;
        }
        result = current;
    }
    return result;
}
```
该方法作用是，遍历容器中所有的`BeanPostProcessor`挨个执行`postProcessBeforeInitialization`方法，一旦返回`null`，将不会执行后面Bean的`postProcessBeforeInitialization`方法。
之后在调用`invokeInitMethods`方法，进行Bean的初始化，最后在执行`applyBeanPostProcessorsAfterInitialization`方法，执行一些初始化之后的工作。

## AOP
Spring的另一个核心是AOP，AOP全称`Aspect-Oriented Programming`译为面向切面编程。AOP可以说是对OOP（面向对象编程）的补充和完善，在程序原有的纵向执行流程中，针对某一个或某些方法添加通知，形成横切面的过程就叫做面向切面编程。
简单来说，用于通过在方法执行前、执行后或抛出异常时动态地添加额外的功能就是面向切面编程。AOP 可以帮助解耦应用程序的横切关注点，如日志记录、事务管理、性能监控等，从而提高代码的模块性和复用性。

实现AOP的技术，主要分为两类，一是采用动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行；
二是采用静态织入的方式，引入特定的语法创建“切面”，从而使得编译器可以在编译期间织入有关“切面”的代码，属于静态代理。
AOP的工作原理主要基于对程序执行过程中特定点的拦截和增强。动态代理刚好就可以实现这个功能，AOP用的就是动态代理。

### 使用AOP
使用AOP大致可以分为三步：
1. 将业务逻辑组件和切面类都加入到容器中，并用`Component`、`@Aspect`注解标注切面类。
   ```java
   @Aspect
   @Component
   public class LoggingAspect {}
   ```
2. 在切面类的通知方法上，要注意切面表达式的写法，标注通知注解，告诉`Spring`何时何地的运行：
   - `@Before`：前置通知，在目标方法运行之前执行；
   - `@After`：后置通知，在目标方法运行之后执行，无论方法是否出现异常都会执行；
   - `@Around`：环绕通知，通过`joinPoint.proceed()`方法手动控制目标方法的执行；
   - `@AfterThrowing`：异常通知，在目标方法出现异常之后执行；
   - `@AfterReturning`：返回通知，在目标方法返回之后执行；
   ```java
   @Aspect
   @Component
   public class LoggingAspect {
   
       @Before("execution(* com.example.service.*.*(..))")
       public void logBefore() {
           System.out.println("Executing method in service layer...");
       }
   
       @After("execution(* com.example.service.*.*(..))")
       public void logAfter() {
           System.out.println("Method execution completed.");
       }
   
       @Around("execution(* com.example.service.*.*(..))")
       public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {
           System.out.println("Before method execution.");
           Object result = joinPoint.proceed();
           System.out.println("After method execution.");
           return result;
       }
   
       @AfterThrowing(pointcut = "execution(* com.example.service.*.*(..))", throwing = "error")
       public void logAfterThrowing(Throwable error) {
           System.out.println("Exception occurred: " + error);
       }
   
       @AfterReturning(pointcut = "execution(* com.example.service.*.*(..))", returning = "result")
       public void logAfterReturning(Object result) {
           System.out.println("Method returned value: " + result);
       }
   }
   ```
3. 使用`@EnableAspectJAutoProxy`开启基于注解的AOP模式。
   ```java
   @SpringBootApplication
   @EnableAspectJAutoProxy
   public class SpringAopApplication {
      public static void main(String[] args) {
         SpringApplication.run(SpringAopApplication.class, args);
      }
   }
   ```

#### execution表达式
`execution`表达式用于定义切入点，作用是什么时候触发切面。`execution`表达式语法：
```text
execution(modifiers-pattern ret-type-pattern declaring-type-pattern name-pattern(param-pattern) throws-pattern)
```
- `modifiers-pattern`（可选）：方法修饰符模式，如`public`、`protected`。
- `ret-type-pattern`：返回类型模式，可以是具体类型，如`String`，也可以是通配符（`*`表示任意返回类型）。
- `declaring-type-pattern`（可选）：声明类型模式，即方法所属的类或接口，可以是具体类名，如`com.example.MyClass`或通配符，如`com.example.*`。
- `name-pattern`：方法名模式，可以是具体方法名（如`myMethod`），也可以是通配符（如`*`表示任意方法名）。
- `param-pattern`：参数模式，可以是具体参数类型，如`(String, int)`，也可以是通配符，如`(..)`表示任意参数类型和数量。
- `throws-pattern`（可选）：异常模式，可以是具体异常类型，如`throws IOException`。

`execution`表达式举例：
- 匹配任意方法。
   ```java
   @Before("execution(* *(..))")
   public void logBeforeAllMethods() {
       System.out.println("Executing any method...");
   }
   ```
- 匹配特定类的所有方法。
   ```java
   @Before("execution(* com.example.MyClass.*(..))")
   public void logBeforeMyClassMethods() {
       System.out.println("Executing method in MyClass...");
   }
   ```
- 匹配特定包中的所有方法。
   ```java
   @Before("execution(* com.example..*.*(..))")
   public void logBeforePackageMethods() {
       System.out.println("Executing method in com.example package...");
   }
   ```
- 匹配特定返回类型的方法。
   ```java
   @Before("execution(String *(..))")
   public void logBeforeStringMethods() {
       System.out.println("Executing method with String return type...");
   }
   ```
- 匹配特定方法名。
   ```java
   @Before("execution(* myMethod(..))")
   public void logBeforeMyMethod() {
       System.out.println("Executing myMethod...");
   }
   ```
- 匹配特定参数类型的方法。
   ```java
   @Before("execution(* *(String, int))")
   public void logBeforeStringIntMethods() {
       System.out.println("Executing method with String and int parameters...");
   }
   ```
- 匹配没有参数的方法。
   ```java
   @Before("execution(* *())")
   public void logBeforeNoArgMethods() {
       System.out.println("Executing no-arg method...");
   }
   ```
- 匹配带有特定修饰符的方法。
   ```java
   @Before("execution(public * *(..))")
   public void logBeforePublicMethods() {
       System.out.println("Executing public method...");
   }
   ```

#### 切面执行顺序
在Spring AOP中，注意切面执行顺序非常重要，因为不同切面可能会对同一个方法执行不同的逻辑，这些逻辑的执行顺序可能会影响应用程序的行为和结果。

举一个例子，一个简单的银行转账操作，其中涉及日志记录、事务管理和安全检查三个切面。如果不考虑AOP的顺序，就是按照Spring加载顺序来，可能会导致事务管理在安全检查、日志记录的前面，这样可能会造成一些不安全的操作会被执行。
但是我们期望的是先执行安全检查，再执行事务管理，最后再执行日志记录。
```java
@Order(1)  // 优先级最高
public class SecurityAspect {
   @Before("execution(* com.example.service.BankService.transfer(..))")
   public void checkSecurity() {
      System.out.println("Security: Performing security check...");
   }
}

@Order(2)  // 优先级中等
public class TransactionAspect {
   @Before("execution(* com.example.service.BankService.transfer(..))")
   public void startTransaction() {
      System.out.println("Transaction: Starting transaction...");
   }
}

@Order(3)  // 优先级最低 
public class LoggingAspect {
   @Before("execution(* com.example.service.BankService.transfer(..))")
   public void logBefore() {
      System.out.println("Logging: Starting method execution...");
   }
}
```

### AOP工作原理
要想AOP起作用，就要加`@EnableAspectJAutoProxy`注解，所以AOP的原理可以从该注解入手研究。
它是一个复合注解，启动的时候，给容器中导入了一个`AspectJAutoProxyRegistrar`组件。
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(AspectJAutoProxyRegistrar.class)
public @interface EnableAspectJAutoProxy {}
```
`AspectJAutoProxyRegistrar`该类实现了`ImportBeanDefinitionRegistrar`接口，而该接口的作用是给容器中注册Bean。
所以`AspectJAutoProxyRegistrar`作用是添加自定义组件给容器中注册Bean。
```java
class AspectJAutoProxyRegistrar implements ImportBeanDefinitionRegistrar {

	@Override
	public void registerBeanDefinitions(
			AnnotationMetadata importingClassMetadata, BeanDefinitionRegistry registry) {

        // 注册了 AnnotationAwareAspectJAutoProxyCreator 组件
		AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(registry);

		AnnotationAttributes enableAspectJAutoProxy =
				AnnotationConfigUtils.attributesFor(importingClassMetadata, EnableAspectJAutoProxy.class);
        // 获取 @EnableAspectJAutoProxy 中的属性，做一些工作
		if (enableAspectJAutoProxy != null) {
			if (enableAspectJAutoProxy.getBoolean("proxyTargetClass")) {
				AopConfigUtils.forceAutoProxyCreatorToUseClassProxying(registry);
			}
			if (enableAspectJAutoProxy.getBoolean("exposeProxy")) {
				AopConfigUtils.forceAutoProxyCreatorToExposeProxy(registry);
			}
		}
	}
}
```
那`AspectJAutoProxyRegistrar`组件何时注册？关键代码如下：
```text
AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(registry);
```
该方法是给容器中注册了一个`AnnotationAwareAspectJAutoProxyCreator`组件。
```java
public static void registerAspectJAnnotationAutoProxyCreatorIfNecessary(
            ParserContext parserContext, Element sourceElement) {
        //注册或者升级AutoProxyCreator定义beanName为
        // org.Springframework.aop.config.internalAutoProxyCreator的BeanDefinition
        BeanDefinition beanDefinition = AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(
                parserContext.getRegistry(), parserContext.extractSource(sourceElement));
        //对于proxy-target-class以及expose-proxy属性的处理
        useClassProxyingIfNecessary(parserContext.getRegistry(), sourceElement);
        //注册组件并通知，便于监听器进一步处理，其中BeanDefinition的className
        // 为AnnotationAwareAspectJAutoProxyCreator
        registerComponentIfNecessary(beanDefinition, parserContext);
}
```

![AOP核心组件1](/iblog/posts/annex/images/essays/AOP核心组件.png)

`@EnableAspectJAutoProxy`注解最主要的作用实际上就是通过`@Import`注解把`AnnotationAwareAspectJAutoProxyCreator`这个对象注入到Spring容器中。
现在只要把`AnnotationAwareAspectJAutoProxyCreator`组件何时注册搞懂，`AspectJAutoProxyRegistrar`组件何时注册也就明白了。
`AnnotationAwareAspectJAutoProxyCreator`继承关系：
```text
AnnotationAwareAspectJAutoProxyCreator
    extends AspectJAwareAdvisorAutoProxyCreator
        extends AbstractAdvisorAutoProxyCreator
            extends AbstractAutoProxyCreator
                extends ProxyProcessorSupport implements SmartInstantiationAwareBeanPostProcessor,BeanFactoryAware
                    extends ProxyConfig implements Ordered, BeanClassLoaderAware, AopInfrastructureBean 
```
其中的一个父类为`AbstractAutoProxyCreator`这个父类实现了`SmartInstantiationAwareBeanPostProcessor`接口，该接口是一个后置处理器接口，同样实现了`BeanFactoryAware`接口，这意味着，该类可以通过接口中的方法进行自动装配`BeanFactory`。
`SmartInstantiationAwareBeanPostProcessor`、`BeanFactoryAware`这两个接口在AOP体系中具体的实现方法：

1. `AbstractAutoProxyCreator`
   - 重写`BeanFactoryAware`接口中的`setBeanFactory`方法；
   - 重写`SmartInstantiationAwareBeanPostProcessor`接口中的`postProcessBeforeInstantiation`和`postProcessAfterInitialization`方法；
2. `AbstractAdvisorAutoProxyCreator`
   - 重写`BeanFactoryAware`接口中的`setBeanFactory`方法；
3. `AnnotationAwareAspectJAutoProxyCreator`
   - 重写`BeanFactoryAware`接口中的`initBeanFactory`方法；

在重写`BeanFactoryAware`接口中的`initBeanFactory`方法，打断点即可看到类似下面的方法调用栈：
```text
AnnotationConfigApplicationContext.AnnotationConfigApplicationContext()
    -->AbstractApplicationContext.refresh() //刷新容器，给容器初始化bean
        -->AbstractApplicationContext.finishBeanFactoryInitialization()
            -->DefaultListableBeanFactory.preInstantiateSingletons()
                -->AbstractBeanFactory.getBean()
                    -->AbstractBeanFactory.doGetBean()
                        -->DefaultSingletonBeanRegistry.getSingleton()
                            -->AbstractBeanFactory.createBean()
                                -->AbstractAutowireCapableBeanFactory.resolveBeforeInstantiation()
                                    -->AbstractAutowireCapableBeanFactory.applyBeanPostProcessorsBeforeInstantiation()
                                        -->AbstractAutowireCapableBeanFactory.applyBeanPostProcessorsBeforeInstantiation()
                                            -->调用AOP相关的后置处理器
```
其中`AbstractApplicationContext.refresh()`方法，调用了`registerBeanPostProcessors`方法，它是用来注册后置处理，也是在这个方法中完成了对`AnnotationAwareAspectJAutoProxyCreator`的注册。
注册完`BeanPostProcessor`后，还调用了`finishBeanFactoryInitialization`方法，完成`BeanFactory`初始化工作，并创建剩下的单实例Bean。
```java
@Override
public void refresh() throws BeansException, IllegalStateException {
    // .....

    // Register bean processors that intercept bean creation.
    registerBeanPostProcessors(beanFactory);

    // .....

    // Instantiate all remaining (non-lazy-init) singletons.
    finishBeanFactoryInitialization(beanFactory);

    // .....
}
```
下面详细的说明`registerBeanPostProcessors`、`finishBeanFactoryInitialization`这两个方法。

#### registerBeanPostProcessors
`registerBeanPostProcessors`方法中注册了所有的`BeanPostProcessor`，注册顺序为：
1. 注册实现了`PriorityOrdered`接口的`BeanPostProcessor`。
2. 注册实现了`Ordered`接口的`BeanPostProcessor`。
3. 注册常规的`BeanPostProcessor`，也就是没有实现优先级接口的`BeanPostProcessor`。
4. 最后才注册`Spring`内部`BeanPostProcessor`。

由于`AnnotationAwareAspectJAutoProxyCreator`类间接实现了`Ordered`接口，所以它是在注册实现`Ordered`接口的`BeanPostProcessor`中完成注册。
在注册时会调用`AbstractBeanFactory.getBean()` -> `AbstractBeanFactory.doGetBean()`方法创建Bean。
`doGetBean()`方法作用为，创建Bean、给Bean中的属性赋值、初始化Bean。
```java
protected Object doCreateBean(String beanName, RootBeanDefinition mbd, Object[] args) throws BeanCreationException {
    // 创建 Bean 实例
    Object beanInstance = createBeanInstance(mbd, beanName, args);
    // 提前暴露已经创建的 Bean 实例，用于解决循环依赖问题
    Object exposedObject = beanInstance;
    try {
        // 给 Bean 实例应用属性填充，包括依赖注入
        populateBean(beanName, mbd, instanceWrapper);
        // 初始化 Bean，执行各种初始化方法
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }catch (Exception ex) {
        throw new BeanCreationException(beanName, "Initialization of bean failed", ex);
    }
    // 注册销毁回调，用于在 Bean 销毁时执行清理操作
    registerDisposableBeanIfNecessary(beanName, exposedObject, mbd);
    return exposedObject;
}
```
当初始化Bean时，`initializeBean`方法会调用`BeanPostProcessor`和`BeanFactory`以及`Aware`接口的相关方法，这也是`BeanPostProcessor`初始化Bean的原理。
```java
protected Object initializeBean(final String beanName, final Object bean, RootBeanDefinition mbd) {
    // ...
    invokeAwareMethods(beanName, bean);   //处理Aware接口的方法回调

    Object wrappedBean = bean;
    if (mbd == null || !mbd.isSynthetic()) {
        // 执行后置处理器的postProcessBeforeInitialization方法
        wrappedBean = applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
    }
    try {
        // 执行自定义的初始化方法，也就是在这执行 setBeanFactory方法
        invokeInitMethods(beanName, wrappedBean, mbd);  
    }catch (Throwable ex){
        throw new BeanCreationException(beanName, "Invocation of init method failed", ex);
    }
    // ...
    if (mbd == null || !mbd.isSynthetic()) {
        // 执行后置处理器的postProcessAfterInitialization方法
        wrappedBean = applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);
    }
    return wrappedBean;
}

// ...invokeAwareMethods方法简要 ...
private void invokeAwareMethods(String beanName, Object bean) {
    if (bean instanceof Aware) {
        if (bean instanceof BeanFactoryAware) {
            ((BeanFactoryAware) bean).setBeanFactory(AbstractAutowireCapableBeanFactory.this);
        }
    }
}
```
`initializeBean`方法的作用为，`invokeAwareMethods`方法处理`Aware`接口的方法回调、执行后置处理器的`postProcessBeforeInitialization`方法、执行自定义的初始化方法`invokeInitMethods`、执行后置处理器的`postProcessAfterInitialization`方法。
`initializeBean`方法执行成功，`AnnotationAwareAspectJAutoProxyCreator`组件才会注册和初始化成功。

#### finishBeanFactoryInitialization
除了弄懂`AnnotationAwareAspectJAutoProxyCreator`组件何时注册，也需要知道它什么时候被调用，这就涉及到`finishBeanFactoryInitialization`方法。
```text
AnnotationConfigApplicationContext.AnnotationConfigApplicationContext()
    -->AbstractApplicationContext.refresh() // 刷新容器，给容器初始化bean
        -->AbstractApplicationContext.finishBeanFactoryInitialization() // 调用
            -->DefaultListableBeanFactory.preInstantiateSingletons()
                -->AbstractBeanFactory.getBean()
                    -->AbstractBeanFactory.doGetBean()
                        -->DefaultSingletonBeanRegistry.getSingleton()
                            -->AbstractBeanFactory.createBean()
                                -->AbstractAutowireCapableBeanFactory.resolveBeforeInstantiation()
                                    -->AbstractAutowireCapableBeanFactory.applyBeanPostProcessorsBeforeInstantiation()
                                        -->AbstractAutowireCapableBeanFactory.applyBeanPostProcessorsBeforeInstantiation()
                                            -->调用AOP相关的后置处理器
```
```java
protected void finishBeanFactoryInitialization(ConfigurableListableBeanFactory beanFactory) {
    // ...
    
    // 注释大意： 实例化所有剩余的(非lazy-init)单例。
    // Instantiate all remaining (non-lazy-init) singletons.
    beanFactory.preInstantiateSingletons(); // 断点停在这里
}
```
`finishBeanFactoryInitialization`方法也需要注册Bean，它会调用`preInstantiateSingletons`方法遍历获取容器中所有的Bean，实例化所有剩余的、非懒加载初始化的单例Bean。
```java
@Override
public void preInstantiateSingletons() throws BeansException {

  // Iterate over a copy to allow for init methods which in turn register new bean definitions.
  // While this may not be part of the regular factory bootstrap, it does otherwise work fine.
  List<String> beanNames = new ArrayList<>(this.beanDefinitionNames);

  // Trigger initialization of all non-lazy singleton beans...
  for (String beanName : beanNames) {
      RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);
      // 获取，非抽象、单例、非懒加载Bean
      if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {
          // 是否 是FactoryBean类型
          if (isFactoryBean(beanName)) {
              // ...
          }
          else {
              getBean(beanName); // 断点停在这
          }
      }
  }

  // ...
}
```
`preInstantiateSingletons()`方法通过调用`getBean()`方法获取Bean实例，执行过程为：
```text
getBean()
    -->doGetBean()
    -->getSingleton()
    -->createBean()
```
又回到了上面`registerBeanPostProcessors`中注册Bean的步骤。
这里要注意`createBean`方法中的`resolveBeforeInstantiation`方法，这里可以理解为缓存Bean，如果被创建了就拿来直接用，如果没有则创建Bean。
```java
protected Object createBean(String beanName, RootBeanDefinition mbd, @Nullable Object[] args)
        throws BeanCreationException {
    // ...
    try {
        // 注释大意：给 BeanPostProcessors 一个返回代理而不是目标bean实例的机会。
        // Give BeanPostProcessors a chance to return a proxy instead of the target bean instance.
        Object bean = resolveBeforeInstantiation(beanName, mbdToUse); // 断点停在这里
        if (bean != null) {
            return bean;
        }
    }catch (Throwable ex){
       // ...
    }
    // ...

    try {
        Object beanInstance = doCreateBean(beanName, mbdToUse, args);
        if (logger.isTraceEnabled()) {
            logger.trace("Finished creating instance of bean '" + beanName + "'");
        }
        return beanInstance;
    }catch (Throwable ex){
       // ...
    }
    // ...
    return null;
}
```
详细解析`resolveBeforeInstantiation`方法，其中关键是调用`applyBeanPostProcessorsBeforeInstantiation`方法。
```java
protected Object resolveBeforeInstantiation(String beanName, RootBeanDefinition mbd) {
    Object bean = null;
    if (!Boolean.FALSE.equals(mbd.beforeInstantiationResolved)) {
        // Make sure bean class is actually resolved at this point.
        if (!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
            Class<?> targetType = determineTargetType(beanName, mbd);
            if (targetType != null) {
                // 调用 applyBeanPostProcessorsBeforeInstantiation 方法
                bean = applyBeanPostProcessorsBeforeInstantiation(targetType, beanName); // 断点停在这
                if (bean != null) {
                    bean = applyBeanPostProcessorsAfterInitialization(bean, beanName);
                }
            }
        }
        mbd.beforeInstantiationResolved = (bean != null);
    }
    return bean;
}

// ... 上面代码调用的方法 ...

protected Object applyBeanPostProcessorsBeforeInstantiation(Class<?> beanClass, String beanName) {
    // 遍历所有的 BeanPostProcessor
    for (BeanPostProcessor bp : getBeanPostProcessors()) {

        // //如果是 InstantiationAwareBeanPostProcessor 类型
        if (bp instanceof InstantiationAwareBeanPostProcessor) {
            InstantiationAwareBeanPostProcessor ibp = (InstantiationAwareBeanPostProcessor) bp;

            // 调用 postProcessBeforeInstantiation 方法
            Object result = ibp.postProcessBeforeInstantiation(beanClass, beanName); // 断点停在这
            if (result != null) {
                return result;
            }
        }
    }
    return null;
}
```
关键代码为`ibp.postProcessBeforeInstantiation(beanClass, beanName)`，这里就是调用`AnnotationAwareAspectJAutoProxyCreator`组件的`postProcessBeforeInstantiation`方法。
`AnnotationAwareAspectJAutoProxyCreator`组件实现了`SmartInstantiationAwareBeanPostProcessor`接口，所以`bp instanceof InstantiationAwareBeanPostProcessor`这行代码为`true`。
```text
AnnotationAwareAspectJAutoProxyCreator
    extends AspectJAwareAdvisorAutoProxyCreator
        extends AbstractAdvisorAutoProxyCreator
            extends AbstractAutoProxyCreator
                extends ProxyProcessorSupport implements SmartInstantiationAwareBeanPostProcessor,BeanFactoryAware
                    extends ProxyConfig implements Ordered, BeanClassLoaderAware, AopInfrastructureBean 
```
```text
SmartInstantiationAwareBeanPostProcessor 
    extends InstantiationAwareBeanPostProcessor
        extends BeanPostProcessor
```

#### postProcessAfterInitialization
AOP相关的后置处理器就是在`postProcessBeforeInstantiation`方法被调用的。上面的`resolveBeforeInstantiation`方法是`createBean`方法的调用栈，所以从层次结构上来看`AnnotationAwareAspectJAutoProxyCreator`组件的调用是在创建Bean实例之前，尝试用后置处理器返回对象的。
一直往父类寻找，在其父类`AbstractAutoProxyCreator`实现了该方法。
```java
@Override
    public Object postProcessAfterInitialization(@Nullable Object bean, String beanName) {
        if (bean != null) {
            //根据给定的bean的class和name构建出key，格式：beanClassName_beanName
            Object cacheKey = getCacheKey(bean.getClass(), beanName);
            if (this.earlyProxyReferences.remove(cacheKey) != bean) {
                //一个非常核心的方法：wrapIfNecessary(),如果它适合被代理，则需要封装指定的bean。
                return wrapIfNecessary(bean, beanName, cacheKey);
            }
        }
        return bean;
}
```
其有一个非常核心的方法`wrapIfNecessary()`，这个方法就是代理创建的雏形。创建代理主要包含了两个步骤：获取增强方法或者增强器、根据获取的增强进行代理。
```java
/**
* Wrap the given bean if necessary, i.e. if it is eligible for being proxied.
* @param bean the raw bean instance
* @param beanName the name of the bean
* @param cacheKey the cache key for metadata access
* @return a proxy wrapping the bean, or the raw bean instance as-is
*/
protected Object wrapIfNecessary(Object bean, String beanName, Object cacheKey) {
  //如果已经处理过
  if (StringUtils.hasLength(beanName) && this.targetSourcedBeans.contains(beanName)) {
      return bean;
  }
  //这个bean无需增强
  if (Boolean.FALSE.equals(this.advisedBeans.get(cacheKey))) {
      return bean;
  }
  //判断给定的bean是否是一个基础设施类，基础设施类不应代理，或者配置了指定bean不需要代理。
  //所谓InfrastructureClass就是指Advice/PointCut/Advisor等接口的实现类。
  if (isInfrastructureClass(bean.getClass()) || shouldSkip(bean.getClass(), beanName)) {
      this.advisedBeans.put(cacheKey, Boolean.FALSE);
      return bean;
  }

  // 如果存在增强方法则创建代理
  //获取这个bean的advice
  Object[] specificInterceptors = getAdvicesAndAdvisorsForBean(bean.getClass(), beanName, null);
  //如果获取到了增强则需要针对增强创建代理
  if (specificInterceptors != DO_NOT_PROXY) {
      this.advisedBeans.put(cacheKey, Boolean.TRUE);
      //创建代理
      Object proxy = createProxy(
              bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));
      this.proxyTypes.put(cacheKey, proxy.getClass());
      return proxy;
  }

  this.advisedBeans.put(cacheKey, Boolean.FALSE);
  return bean;
}
```
`wrapIfNecessary`方法中调用了`getAdvicesAndAdvisorsForBean`方法，该方法作用为获取增强方法或者增强器。调用栈为：
```text
AbstractAdvisorAutoProxyCreator.getAdvicesAndAdvisorsForBean
   -->AbstractAdvisorAutoProxyCreator.findEligibleAdvisors
   -->AbstractAdvisorAutoProxyCreator.findCandidateAdvisors
   -->BeanFactoryAdvisorRetrievalHelper.findAdvisorBeans
```
`BeanFactoryAdvisorRetrievalHelper`这个类是一个Spring AOP内部工具类，用来从Bean容器中获取所有Spring的Advisor Bean。
该工具内部使用了缓存机制，虽然公开的查找方法可能会被调用多次，但并不是每次都会真正查找，而是会利用缓存。
```java
public List<Advisor> findAdvisorBeans() {
     //cachedAdvisorBeanNames是advisor名称的缓存
     String[] advisorNames = this.cachedAdvisorBeanNames;
     //如果cachedAdvisorBeanNames为空，则到容器中查找，并设置缓存，后续直接使用缓存即可
     if (advisorNames == null) {
         // Do not initialize FactoryBeans here: We need to leave all regular beans
         // uninitialized to let the auto-proxy creator apply to them!
         //从容器中查找Advisor类型的bean的名称
         advisorNames = BeanFactoryUtils.beanNamesForTypeIncludingAncestors(
                 this.beanFactory, Advisor.class, true, false);
         this.cachedAdvisorBeanNames = advisorNames;
     }
     if (advisorNames.length == 0) {
         return new ArrayList<>();
     }
   
     List<Advisor> advisors = new ArrayList<>();
     //遍历advisorNames
     for (String name : advisorNames) {
         if (isEligibleBean(name)) {
             //忽略郑州创建中的advisor bean
             if (this.beanFactory.isCurrentlyInCreation(name)) {
                 if (logger.isTraceEnabled()) {
                     logger.trace("Skipping currently created advisor '" + name + "'");
                 }
             }
             else {
                 try {
                     //调用getBean方法从容器中获取名称为name的bean，并将bean添加到advisors中
                     advisors.add(this.beanFactory.getBean(name, Advisor.class));
                 }
                 catch (BeanCreationException ex) {
                     Throwable rootCause = ex.getMostSpecificCause();
                     if (rootCause instanceof BeanCurrentlyInCreationException) {
                         BeanCreationException bce = (BeanCreationException) rootCause;
                         String bceBeanName = bce.getBeanName();
                         if (bceBeanName != null && this.beanFactory.isCurrentlyInCreation(bceBeanName)) {
                             if (logger.isTraceEnabled()) {
                                 logger.trace("Skipping advisor '" + name +
                                         "' with dependency on currently created bean: " + ex.getMessage());
                             }
                             // Ignore: indicates a reference back to the bean we're trying to advise.
                             // We want to find advisors other than the currently created bean itself.
                             continue;
                         }
                     }
                     throw ex;
                 }
             }
         }
     }
     return advisors;
}
```
`wrapIfNecessary`方法中第二行关键的代码就是创建代理，调用了下面这行代码。
```text
Object proxy = createProxy(bean.getClass(), beanName, specificInterceptors, new SingletonTargetSource(bean));
```
```java
protected Object createProxy(Class<?> beanClass, @Nullable String beanName,
         @Nullable Object[] specificInterceptors, TargetSource targetSource) {

     if (this.beanFactory instanceof ConfigurableListableBeanFactory) {
         AutoProxyUtils.exposeTargetClass((ConfigurableListableBeanFactory) this.beanFactory, beanName, beanClass);
     }

     ProxyFactory proxyFactory = new ProxyFactory();
     //步骤1：获取当前类的属性。
     proxyFactory.copyFrom(this);

     //步骤2：添加代理接口。
     if (!proxyFactory.isProxyTargetClass()) {
         if (shouldProxyTargetClass(beanClass, beanName)) {
             proxyFactory.setProxyTargetClass(true);
         }
         else {
             evaluateProxyInterfaces(beanClass, proxyFactory);
         }
     }

     //步骤3：拦截器封装转化为增强器
     Advisor[] advisors = buildAdvisors(beanName, specificInterceptors);
     //步骤4：将Advisor加入到ProxyFactory中。
     proxyFactory.addAdvisors(advisors);
     //步骤5：设置要代理的类。
     proxyFactory.setTargetSource(targetSource);
     //步骤6：为子类提供了定制函数customizeProxyFactory
     customizeProxyFactory(proxyFactory);

     //步骤7：设置是否需要冻结代理对象。用来控制代理工厂被配置后，是否还允许修改通知。缺省值为false
     proxyFactory.setFrozen(this.freezeProxy);
     if (advisorsPreFiltered()) {
         proxyFactory.setPreFiltered(true);
     }

     //步骤8：进行代理操作。
     return proxyFactory.getProxy(getProxyClassLoader());
}
```
其中的关键代码是`proxyFactory.getProxy(getProxyClassLoader())`，作用是代理类的创建和处理。
```java
public Object getProxy() {
    // 调用了ProxyCreatorSupport的createAopProxy()方法创建一个AopProxy对象
   // 然后调用AopProxy对象的getProxy方法
   return createAopProxy().getProxy();
}
```
```java
protected final synchronized AopProxy createAopProxy() {
  if (!this.active) {
      activate();
  }
  // 实际就是使用DefaultAopProxyFactory来创建一个代理对象
  // 可以看到在调用createAopProxy方法时，传入的参数是this
  // 这是因为ProxyCreatorSupport本身就保存了创建整个代理对象所需要的配置信息
  return getAopProxyFactory().createAopProxy(this);
}
```
`createAopProxy`通过AOP相关的配置信息来决定到底是使用CGLib代理还是JDK代理。
```java
public AopProxy createAopProxy(AdvisedSupport config) throws AopConfigException {
  // 如果开启了优化，或者ProxyTargetClass设置为true
  // 或者没有提供代理类需要实现的接口，那么使用cglib代理
  // 在前面分析参数的时候已经说过了
  // 默认情况下Optimize都为false,也不建议设置为true,因为会进行一些侵入性的优化
  // 除非你对cglib的优化非常了解，否则不建议开启
  if (config.isOptimize() || config.isProxyTargetClass() || hasNoUserSuppliedProxyInterfaces(config)) {
      Class<?> targetClass = config.getTargetClass();
      if (targetClass == null) {
          throw new AopConfigException("TargetSource cannot determine target class: " +
                  "Either an interface or a target is required for proxy creation.");
      }
      // 需要注意的是，如果需要代理的类本身就是一个接口
      // 或者需要被代理的类本身就是一个通过jdk动态代理生成的类
      // 那么不管如何设置都会使用jdk动态代理
      if (targetClass.isInterface() || Proxy.isProxyClass(targetClass)) {
          return new JdkDynamicAopProxy(config);
      }
      return new ObjenesisCglibAopProxy(config);
  }
  // 否则都是jdk代理
  else {
      return new JdkDynamicAopProxy(config);
  }
}
```
AOP原理用的就是动态代理，而且在`Spring`中主要使用了两种动态代理：
- JDK动态代理技术：JDK的动态代理时基于Java的反射机制来实现的，是Java 原生的一种代理方式。他的实现原理就是让代理类和被代理类实现同一接口，代理类持有目标对象来达到方法拦截的作用。
通过接口的方式有两个弊端一个就是必须保证被代理类有接口，另一个就是如果相对被代理类的方法进行代理拦截，那么就要保证这些方法都要在接口中声明。接口继承的是`java.lang.reflect.InvocationHandler`。
- CGLib动态代理技术：CGLib动态代理使用的ASM这个非常强大的Java字节码生成框架来生成`class`，基于继承的实现动态代理，可以直接通过`super`关键字来调用被代理类的方法，子类可以调用父类的方法，不要求有接口。

#### 动态代理
代理是一种常见的设计模式，通过为其他对象提供一种代理以控制对这个对象的访问。代理对象在客户端和目标对象之间起到中介的作用，可以在不修改目标对象的情况下，扩展其功能。
代理模式包含三个主要角色：代理接口、目标对象、代理对象。代理模式分为静态代理和动态代理两种类型。
静态代理在编译时由程序员手动创建或通过工具生成代理类，增加了代码量。动态代理在运行时动态生成代理类，包括JDK动态代理和CGLIB动态代理。

Spring默认采取的动态代理机制实现AOP，简单来说就是在程序运行期间动态的将某段代码切入到指定方法指定位置进行运行的编程方式。
JDK动态代理使用`java.lang.reflect.Proxy`类和`java.lang.reflect.InvocationHandler`接口来实现，它只能代理实现了接口的类。
```java
public interface Service {
    void perform();
}

public class RealService implements Service {
   @Override
   public void perform() {
      System.out.println("Executing perform method in RealService");
   }
}
```
```java
public class ServiceInvocationHandler implements InvocationHandler {
    private final Object target;

    public ServiceInvocationHandler(Object target) {
        this.target = target;
    }

    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        System.out.println("Before method call");
        Object result = method.invoke(target, args);
        System.out.println("After method call");
        return result;
    }
}
```
```java
public class Main {
    public static void main(String[] args) {
        Service realService = new RealService();
        ServiceInvocationHandler handler = new ServiceInvocationHandler(realService);

        Service proxyService = (Service) Proxy.newProxyInstance(
                realService.getClass().getClassLoader(),
                realService.getClass().getInterfaces(),
                handler
        );
        proxyService.perform();
    }
}
```
CGLIB动态代理使用字节码生成技术，可以代理没有实现接口的类。它通过继承的方式创建代理类，因此不能代理`final`类。
```xml
<!--在pom.xml中添加以下依赖-->
<dependency>
    <groupId>cglib</groupId>
    <artifactId>cglib</artifactId>
    <version>3.3.0</version>
</dependency>
```
```java
public class RealService {
    public void perform() {
        System.out.println("Executing perform method in RealService");
    }
}

public class ServiceMethodInterceptor implements MethodInterceptor {
   @Override
   public Object intercept(Object obj, Method method, Object[] args, MethodProxy proxy) throws Throwable {
      System.out.println("Before method call");
      Object result = proxy.invokeSuper(obj, args);
      System.out.println("After method call");
      return result;
   }
}
```
```java
public class Main {
    public static void main(String[] args) {
        Enhancer enhancer = new Enhancer();
        enhancer.setSuperclass(RealService.class);
        enhancer.setCallback(new ServiceMethodInterceptor());

        RealService proxyService = (RealService) enhancer.create();
        proxyService.perform();
    }
}
```

## Spring事务
事务是一组操作，被视为一个不可分割的工作单元，要么全部完成，要么全部失败回滚，来确保数据的一致性和完整性。
Spring事务管理允许我们在应用程序中声明式地或编程式地管理事务，它提供了一个事务管理抽象层，使得事务的使用和配置更加简单和灵活。
Spring事务管理不直接管理数据库事务，而是通过委托给底层的数据库事务管理器，如`JDBC`或`Hibernate`的事务管理器，来实现对数据库事务的控制。

### Spring事务的使用
Spring事务管理分为编码式和声明式的两种方式。编程式事务指的是通过编码方式实现事务，声明式事务基于AOP，即使用`@Transactional`注解，将具体业务逻辑与事务处理解耦。
声明式事务管理使业务代码逻辑不受污染，因此在实际使用中声明式事务用的比较多。

通过简单的配置或注解，Spring允许开发者将事务管理从业务代码中分离出来，提高了代码的可读性和可维护性。
使用`@Transactional`注解，简单配置即可管理事务。例如在`Service`层的方法上标注`@Transactional`注解，Spring将自动处理事务边界。
```java
@Service
public class UserService {

    @Transactional
    public void createUser(User user) {
        // 业务逻辑代码
    }
}

@Configuration
@EnableTransactionManagement
public class AppConfig {
   // 其他配置
}
```
使用`TransactionTemplate`或`PlatformTransactionManager`手动管理事务，虽然不常用，但在某些情况下，可以用于需要更细粒度控制的场景。
```java
@Service
public class UserService {

    private final TransactionTemplate transactionTemplate;

    @Autowired
    public UserService(PlatformTransactionManager transactionManager) {
        this.transactionTemplate = new TransactionTemplate(transactionManager);
    }

    public void createUser(User user) {
        transactionTemplate.execute(status -> {
            // 业务逻辑代码
            return null;
        });
    }
}
```
```java
@Service
public class UserService {

    private final PlatformTransactionManager transactionManager;

    @Autowired
    public UserService(PlatformTransactionManager transactionManager) {
        this.transactionManager = transactionManager;
    }

    public void createUser(User user) {
        DefaultTransactionDefinition def = new DefaultTransactionDefinition();
        def.setIsolationLevel(TransactionDefinition.ISOLATION_DEFAULT);
        def.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRED);

        TransactionStatus status = transactionManager.getTransaction(def);
        try {
            // 业务逻辑代码
            transactionManager.commit(status);
        } catch (Exception e) {
            transactionManager.rollback(status);
            throw e;
        }
    }
}
```

值得注意的是，Spring利用AOP和事务拦截器来拦截被`@Transactional`注解的方法，在方法调用前开启事务，在方法调用后根据方法执行结果决定提交或回滚事务。
所以`@Transactional`注解会有失效情况：
1. 如果某个方法是非`public`的，那么`@Transactional`就会失效。因为事务的底层是利用`cglib`代理实现，`cglib`是基于父子类来实现的，子类是不能重载父类的`private`方法，所以无法很好利用代理，这种情况下会导致`@Transactional`失效；
2. 使用的数据库引擎不支持事务。因为Spring的事务调用的也是数据库事务的API，如果数据库都不支持事务，那么`@Transactional`注解也就失效了；
3. 添加了`@Transactional`注解的方法不能在同一个类中调用，否则会使事务失效。这是因为Spring AOP通过代理来管理事务，自调用不会经过代理；
4. `@Transactional`注解属性`propagation`设置错误，若是错误的配置以下三种 `propagation`，事务将不会发生回滚：
   - `TransactionDefinition.PROPAGATION_SUPPORTS`：如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。
   - `TransactionDefinition.PROPAGATION_NOT_SUPPORTED`：以非事务方式运行，如果当前存在事务，则把当前事务挂起。
   - `TransactionDefinition.PROPAGATION_NEVER`：以非事务方式运行，如果当前存在事务，则抛出异常。
5. `@Transactional`注解属性`rollbackFor`设置错误，`rollbackFor`可以指定能够触发事务回滚的异常类型。默认情况下，Spring仅在抛出未检查异常（继承自`RuntimeException`）时回滚事务。对于受检异常（继承自 `Exception`），事务不会回滚，除非明确配置了`rollbackFor`属性；
6. 异常被捕获了，导致`@Transactional`失效。当事务方法中抛出一个异常后，应该是需要表示当前事务需要`rollback`，如果在事务方法中手动捕获了该异常，那么事务方法则会认为当前事务应该正常提交，此时就会出现事务方法中明明有报错信息表示当前事务需要回滚，但是事务方法认为是正常，出现了前后不一致，也是因为这样就会抛出`UnexpectedRollbackException`异常；

### Spring事务的隔离级别
事务隔离级别，即数据库中事务隔离级别，指的是一个事务对数据的修改与另一个并行的事务的隔离程度。当多个事务同时访问相同数据时，如果没有采取必要的隔离机制，就可能发生以下问题：

|问题     | 描述                                                                                                                                         |
|-----|--------------------------------------------------------------------------------------------------------------------------------------------|
|脏读     | 一个事务读到另一个事务未提交的更新数据。比如银行取钱，事务A开启事务，此时切换到事务B，事务B开启事务–>取走100元，此时切换回事务A，事务A读取的肯定是数据库里面的原始数据，因为事务B取走了100块钱，并没有提交，数据库里面的账务余额肯定还是原始余额，这就是脏读。     |
|幻读     | 是指当事务不是独立执行时发生的一种现象。如第一个事务对一个表中的数据进行了修改，这种修改涉及到表中的全部数据行。 同时，第二个事务也修改这个表中的数据，这种修改是向表中插入一行新数据。那么，以后就会发生操作第一个事务的用户发现表中还有没有修改的数据行，就好象 发生了幻觉一样。 |
|不可重复读     | 在一个事务里面的操作中发现了未被操作的数据。 比方说在同一个事务中先后执行两条一模一样的select语句，期间在此次事务中没有执行过任何DDL语句，但先后得到的结果不一致，这就是不可重复读。                                            |

Spring事务管理框架支持标准的数据库事务隔离级别，这些隔离级别与底层数据库系统所支持的隔离级别一致。

|隔离级别     | 描述                                                                                          |
|-----|---------------------------------------------------------------------------------------------|
|`DEFAULT`     | 使用数据库本身使用的隔离级别。ORACLE（读已提交） MySQL（可重复读）                                                     |
|`READ_UNCOMITTED`     | 读未提交（脏读）最低的隔离级别，一切皆有可能。                                                                     |
|`READ_COMMITED`     | 读已提交，ORACLE默认隔离级别，有幻读以及不可重复读风险。                                                             |
|`REPEATABLE_READ`     | 可重复读，解决不可重复读的隔离级别，但还是有幻读风险。                                                                 |
|`SERLALIZABLE`     | 串行化，所有事务请求串行执行，最高的事务隔离级别，不管多少事务，挨个运行完一个事务的所有子事务之后才可以执行另外一个事务里面的所有子事务，这样就解决了脏读、不可重复读和幻读的问题了。 |

不是事务隔离级别设置得越高越好，事务隔离级别设置得越高，意味着势必要花手段去加锁来保证事务的正确性，那么效率就要降低。
因此实际开发中往往要在效率和并发正确性之间做一个取舍，一般情况下会设置为`READ_COMMITED`，此时避免了脏读，并发性也还不错，之后再通过一些别的手段去解决不可重复读和幻读的问题就好了。

Spring中通过`@Transactional(isolation = Isolation.REPEATABLE_READ)`可以指定事务的隔离级别。
Spring建议的是使用`DEFAULT`，即数据库本身的隔离级别，配置好数据库本身的隔离级别，无论在哪个框架中读写数据都不用操心了。

### Spring事务的传播
事务传播行为指，当一个事务方法被另一个事务方法调用时，这个事务方法应该如何进行，是应该加入现有事务，还是应该启动一个新事务。

Spring定义了七种传播行为：
- `@Transactional(propagation=Propagation.REQUIRED)`：如果当前有事务，那么加入事务, 没有的话新建一个，用于确保所有操作都在同一个事务中进行，这也是Spring提供的默认传播行为；
   ```java
   @Transactional(propagation = Propagation.REQUIRED)
   public void methodB() {
   // 1. 如果调用方 methodA 有事务，methodB 将加入该事务。
   // 2. 如果调用方没有事务，methodB 将创建一个新的事务。
   }
   ```
- `@Transactional(propagation=Propagation.REQUIRES_NEW)`：不管是否存在事务，都创建一个新的事务，如果当前已经存在一个事务，则将当前事务挂起，新的执行完毕，继续执行老的事务；
   ```java
   @Transactional(propagation = Propagation.REQUIRES_NEW)
   public void methodB() {
       // 1. 如果调用方 methodA 有事务，methodB 将挂起该事务并创建一个新的事务。
       // 2. 如果调用方没有事务，methodB 将创建一个新的事务。
   }
   ```
- `@Transactional(propagation=Propagation.MANDATORY)`：必须在一个已有的事务中执行，否则抛出异常。如果当前方法已经存在一个事务，那么加入这个事务，如果当前没有事务，则抛出异常；适用于必须在现有事务中执行的操作；
   ```java
   @Transactional(propagation = Propagation.MANDATORY)
   public void methodB() {
       // 1. 如果调用方 methodA 有事务，methodB 将加入该事务。
       // 2. 如果调用方没有事务，methodB 将抛出异常。
   }
   ```
- `@Transactional(propagation=Propagation.NEVER)`：必须在一个没有的事务中执行，否则抛出异常(与Propagation.MANDATORY相反)；适用于某些操作强制不允许在事务内执行；
   ```java
   @Transactional(propagation = Propagation.NEVER)
   public void methodB() {
       // 1. 如果调用方 methodA 有事务，methodB 将抛出异常。
       // 2. 如果调用方没有事务，methodB 将以非事务方式执行。
   }
   ```
- `@Transactional(propagation=Propagation.SUPPORTS)`：如果当前存在事务，则加入该事务，如果当前没有事务，则以非事务方式执行；适用于某些不强制需要事务控制的情况；
   ```java
   @Transactional(propagation = Propagation.SUPPORTS)
   public void methodB() {
       // 1. 如果调用方 methodA 有事务，methodB 将加入该事务。
       // 2. 如果调用方没有事务，methodB 将以非事务方式执行。
   }
   ```
- `@Transactional(propagation=Propagation.NOT_SUPPORTED)`：Spring不为这个方法开启事务，即总是以非事务方式执行。如果当前已经存在一个事务，则将当前事务挂起；适用于不希望在事务中执行的操作，比如复杂的查询操作，不需要事务控制；
   ```java
   @Transactional(propagation = Propagation.NOT_SUPPORTED)
   public void methodB() {
       // 1. 如果调用方 methodA 有事务，methodB 将挂起该事务并以非事务方式执行。
       // 2. 如果调用方没有事务，methodB 将以非事务方式执行。
   }
   ```
- `@Transactional(propagation=Propagation.NESTED)`：如果当前方法已经存在一个事务，则创建一个嵌套事务。如果当前没有事务，则创建一个新事务；适用于需要嵌套事务支持的场景，例如部分操作需要回滚，但不影响主事务；
   ```java
   @Transactional(propagation = Propagation.NESTED)
   public void methodB() {
       // 1. 如果调用方 methodA 有事务，methodB 将创建一个嵌套事务。
       // 2. 如果调用方没有事务，methodB 将创建一个新的事务。
   }
   ```

在大多数情况下，如果想要确保所有操作都在同一个事务中进行，`REQUIRED`这个默认传播行为已经足够。
但是随着事务越来越大，执行时间也会变长，就需要将这个大事务拆分成多个事务，如果确保这个事务能够拆分成多个事务，就需要指定Spring的事务传播行为。
比如，在用户注册时候，需要记录注册日志，这时候可以将记录日志的操作单独划分为一个事务，而注册是另一个单独的事务，可以将保存日志的方法指定`Propagation.REQUIRES_NEW`从而实现。

### Spring事务工作原理
在Spring框架中，事务管理的实现是通过集成数据库事务API来实现的。具体来说，Spring事务管理的核心在于使用各种`PlatformTransactionManager`接口的实现类，这些实现类会调用底层数据库事务API来管理事务。
```java
public interface PlatformTransactionManager extends TransactionManager {

    /**
     * 打开事务
     */
	TransactionStatus getTransaction(@Nullable TransactionDefinition definition)
			throws TransactionException;

	/**
	 * 提交事务
	 */
	void commit(TransactionStatus status) throws TransactionException;

	/**
	 * 回滚事务
	 */
	void rollback(TransactionStatus status) throws TransactionException;
}
```

以`@Transactional`注解为例，`@Transactional`主要是利用Spring AOP实现的。 
`@EnableTransactionManagement`是开启注解式事务，这个注解就是探究Spring事务的入口。它通过`@Import`引入了另一个配置`TransactionManagentConfigurationSelector`。
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(TransactionManagementConfigurationSelector.class)
public @interface EnableTransactionManagement {
    AdviceMode mode() default AdviceMode.PROXY;
}
```
`TransactionManagementConfigurationSelector`的作用是根据`EnableTransactionManagementmode.mode`的属性值，选择`AbstractTransactionManagementConfiguration`的哪个实现，默认为`PROXY`模式。
```java
protected String[] selectImports(AdviceMode adviceMode) {
    switch (adviceMode) {
        case PROXY:
            return new String[] {AutoProxyRegistrar.class.getName(),
                    ProxyTransactionManagementConfiguration.class.getName()};
        case ASPECTJ:
            return new String[] {determineTransactionAspectClass()};
        default:
            return null;
    }
}
```
`selectImports`方法对`Proxy`模式而言，注入的有两个Bean，一个负责注册，一份负责执行：
- `AutoProxyRegistrar`：`负责在Spring容器中注册和启用自动代理功能。
- `ProxyTransactionManagementConfiguration`：负责在使用代理模式时，事务管理器能够正确地与应用程序的业务逻辑集成，并通过AOP拦截器织入事务管理逻辑。

在`ProxyTransactionManagementConfiguration`类中，最关键的是有一个`TransactionInterceptor`类型的Bean，这个Bean在Spring中负责管理和执行事务的核心逻辑。
```java
@Bean
@Role(BeanDefinition.ROLE_INFRASTRUCTURE)
public TransactionInterceptor transactionInterceptor(
        TransactionAttributeSource transactionAttributeSource) {
    TransactionInterceptor interceptor = new TransactionInterceptor();
    interceptor.setTransactionAttributeSource(transactionAttributeSource);
    if (this.txManager != null) {
        interceptor.setTransactionManager(this.txManager);
    }
    return interceptor;
}
```
其中`TransactionInterceptor`类中`invoke`方法就是实现`@Transactional`注解代理的关键。
```java
public Object invoke(MethodInvocation invocation) throws Throwable {
    // Work out the target class: may be {@code null}.
    // The TransactionAttributeSource should be passed the target class
    // as well as the method, which may be from an interface.
    Class<?> targetClass = (invocation.getThis() != null ? AopUtils.getTargetClass(invocation.getThis()) : null);

    // Adapt to TransactionAspectSupport's invokeWithinTransaction...
    return invokeWithinTransaction(invocation.getMethod(), targetClass, invocation::proceed);
}
```
```java
@Nullable
protected Object invokeWithinTransaction(Method method, @Nullable Class<?> targetClass,
        final InvocationCallback invocation) throws Throwable {


    TransactionAttributeSource tas = getTransactionAttributeSource();
    final TransactionAttribute txAttr = (tas != null ? tas.getTransactionAttribute(method, targetClass) : null);
    final TransactionManager tm = determineTransactionManager(txAttr);

    //省略部分代码

    //获取事物管理器
    PlatformTransactionManager ptm = asPlatformTransactionManager(tm);
    final String joinpointIdentification = methodIdentification(method, targetClass, txAttr);

    if (txAttr == null || !(ptm instanceof CallbackPreferringPlatformTransactionManager)) {
        // 打开事务(内部就是getTransactionStatus的过程)
        TransactionInfo txInfo = createTransactionIfNecessary(ptm, txAttr, joinpointIdentification);

        Object retVal;
        try {
            // 执行业务逻辑 invocation.proceedWithInvocation();
        } catch (Throwable ex) {
            // 异常回滚
            completeTransactionAfterThrowing(txInfo, ex);
            throw ex;
        } finally {
            cleanupTransactionInfo(txInfo);
        }

        //省略部分代码

        //提交事物
        commitTransactionAfterReturning(txInfo);
        return retVal;
    }
}
```
`invokeWithinTransaction`方法是`TransactionInterceptor`类中的核心方法，它负责在执行目标方法时管理事务的生命周期。首先该方法通过`getTransactionAttributeSource()`获取事务属性源，进而确定当前方法是否需要事务支持。
接着根据获取的事务属性，选择合适的事务管理器，并生成一个方法标识以记录当前事务的上下文信息。在方法执行前，会检查是否需要开启新的事务，并在事务环境中执行目标方法的逻辑。
如果方法执行过程中出现异常，事务管理器会回滚事务以保证数据一致性，否则在方法执行成功后，事务管理器将提交事务。最后无论方法执行结果如何，都会清理事务相关的信息，释放资源并恢复状态，来保证事务管理的完整性和有效性。

简而言之，当一个方法使用了`@Transactional`注解，在程序运行时，JVM为该Bean创建一个代理对象，并且在调用目标方法的时候进行使用`TransactionInterceptor`拦截，代理对象负责在调用目标方法之前开启事务，然后执行方法的逻辑。
方法执行成功，则提交事务，如果执行方法中出现异常，则回滚事务。同时Spring利用`ThreadLocal`会将事务资源（如数据库连接）与当前线程绑定，以确保在同一事务中共享资源，这些资源在事务提交或回滚时会被清理。
