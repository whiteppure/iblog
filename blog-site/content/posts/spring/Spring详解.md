---
title: "Spring详解"
date: 2021-05-13
draft: false
tags: ["Java", "spring", "详解"]
slug: "java-spring"
---

## 概览
Spring是一个轻量级的Java开源框架，为了解决企业应用开发的复杂性而创建的。Spring的核心是控制反转（IOC）和面向切面（AOP）。

简单来说，Spring是一个分层的JavaSE/EE 一站式轻量级开源框架。在每一层都提供支持。
- 表示层：spring mvc
- 业务层：spring
- 持久层：jdbctemplate、spring data

![Spring详解-001](/iblog/posts/annex/images/spring/Spring详解-001.png)

## 对Spring的理解
Spring是一个轻量级的框架，简化我们的开发，里面重点包含两个模块分别是IOC和AOP。

- IOC叫控制反转，在没用IOC之前都要手动new创建对象，使用IOC之后由容器进行对象的创建，并且由容器来管理对象，减去了开发上的成本，提高了工作效率。
- AOP叫面向切面编程，在实际项目开发中需要嵌入一些与业务不想关的代码的时候就可以使用AOP。比如，权限日志的增加。

Spring虽然把它当成框架来使用，但其本质是一个容器，即IOC容器，里面最核心是如何[创建对象和管理对象](#Bean的创建流程),里面包含了Bean的生命周期和Spring的一些扩展点，包含对AOP的应用。
除此之外，Spring真正的强大之处在于其生态，它包含了Spring Framework、Spring Boot、Spring Cloud等一些列框架，极大提高了开发效率。

## Spring启动流程
![Spring详解-004](/iblog/posts/annex/images/spring/Spring详解-004.png)


核心方法`AbstractApplicationContext#refresh()`
```
public void refresh() throws BeansException, IllegalStateException {
  synchronized (this.startupShutdownMonitor) {
      // Prepare this context for refreshing.
      prepareRefresh();

      // Tell the subclass to refresh the internal bean factory.
      ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

      // Prepare the bean factory for use in this context.
      prepareBeanFactory(beanFactory);

      try {
          // Allows post-processing of the bean factory in context subclasses.
          postProcessBeanFactory(beanFactory);

          // Invoke factory processors registered as beans in the context.
          invokeBeanFactoryPostProcessors(beanFactory);

          // Register bean processors that intercept bean creation.
          registerBeanPostProcessors(beanFactory);

          // Initialize message source for this context.
          initMessageSource();

          // Initialize event multicaster for this context.
          initApplicationEventMulticaster();

          // Initialize other special beans in specific context subclasses.
          onRefresh();

          // Check for listener beans and register them.
          registerListeners();

          // Instantiate all remaining (non-lazy-init) singletons.
          finishBeanFactoryInitialization(beanFactory);

          // Last step: publish corresponding event.
          finishRefresh();
      }

      catch (BeansException ex) {
         // ... 
      }

      finally {
         // ...
      }
  }
}
```
1. prepareRefresh 准备刷新容器，此方法做一些刷新容器的准备工作：
   - 设置开启时间和对应标志位
   - 获取环境对象
   - 设置监听器和一些时间的集合对象
2. obtainFreshBeanFactory 创建容器对象：DefaultListableBeanFactory；加载xml配置文件属性值到工厂中，最重要的是BeanDefinition
3. prepareBeanFactory 完成bean工厂的某些初始化操作
   - 设置BeanDefinition的类加载器
   - 设置spring容器默认的类型转换器
   - 设置spring解析el表达式的解析器
   - 添加一个Bean的后置处理器ApplicationContextAwareProcessor
   - 将bean工厂的一些类，比如ApplicationContext直接注册到单例池中
   - 去除一些在byType或者byName的时候需要过滤掉的一些bean（spring在依赖注入的时候会先在这些默认注册的bean中进行byType找，如果找到了，就加入到列表中，简单来说就是比如你在bean中依赖注入了ApplicationContext context,那么spring会把默认注册的这些bean中找到然后进行注册）
   - 将系统的环境信息、spring容器的启动环境信息、操作系统的环境信息直接注册成一个单例的bean
4. postProcessBeanFactory 这里是一个空壳方法，spring目前还没有对他进行实现;这个方法是留给子类进行实现的，后续可以添加一些用户自定义的或者默认的一些特殊的后置处理器工程到beanFactory中去
5. invokeBeanFactoryPostProcessors 调用后置处理器；将系统中所有符合条件的普通类都扫描成了一个BeanDefinition 并且放入到了beanDefinitionMap中，包括业务的bean，ban的后置处理器、bean工厂的后置处理器等等
   - 将标记为容器单例类扫描成BeanDefinition放入BeanDefinition Map
   - 处理@Import注解
   - 如果我们的配置类是@Configuration的，那么会生成这个配置类的CGLIB代理类，如果没有加@Configuration，则就是一个普通Bean
6. registerBeanPostProcessors 从beanDefinitionMap中取出bean的后置处理器然后放入到后置处理器的缓存列表中
7. initMessageSource 初始化国际化资源信息
8. initApplicationEventMulticaster 事件注册器初始化
9. onRefresh 空壳方法，留给子类实现
10. registerListeners 将容器中和BeanDefinitionMap中的监听器添加到事件监听器中
11. finishBeanFactoryInitialization 创建单例池，将容器中非懒加载的Bean，单例bean创建对象放入单例池中，包括容器的依赖注入
12. finishRefresh 容器启动过后，发布事件


## Spring循环依赖与三级缓存
![Spring详解-003](/iblog/posts/annex/images/spring/Spring详解-003.png)

Spring循环依赖调用流程：

在BeanA中注入BeanB，BeanB中注入BeanA，在BeanA创建的过程中，会先判断容器中A是否存在，如果不存在会先初始化BeanA，然后给BeanA赋值，此时会给BeanA里的BeanB属性赋值，在赋值之前会将创建BeanA的流程放到三级缓存中（三级缓存为Map结构，key为String，value为函数式接口）； 由于BeanA里面包含BeanB,所以接下来给BeanB执行创建流程，判断容器中是否存在BeanB，给属性B赋值,此时会给BeanB里的BeanA属性赋值。

在判断容器中是否存在该Bean时，查找顺序为：一级缓存->二级缓存->三级缓存，经历过上面的步骤后，此时三级缓存中A和B都有值（为BeanA、B的创建流程），不需要再进行初始化操作，然后将会执行BeanA的创建流程并将其放入二级缓存中并删除三级缓存中的值，但是此时BeanA中的BeanB还未赋值进行完全的初始化，
BeanA已经创建，此时会将BeanA赋值给BeanB中的A属性，至此BeanB已经完全赋值，然后将完全赋值的BeanB放入一级缓存中并删除三级缓存中的值，由于BeanB已经完全赋值，此时将其赋值给BeanA，将BeanA放入一级缓存并删除二级缓存，至此循环依赖问题解决。

Spring循环依赖大致调用思路：
- 第一次：A,容器是否存在？（一级缓存->二级缓存->三级缓存）初始化A，-> 将A的创建流程加入三级缓存 -> 给A赋值
- 第二次：B，容器中是否存在？（一级缓存->二级缓存->三级缓存）初始化B -> 将B的创建流程加入三级缓存 -> 给B赋值
- 第三次：A的三级缓存中有值，不需要进行初始化操作，执行创建A的流程,将其放入二级缓存，返回值给到创建B，此时B已经创建完全，将其加入一级缓存，然后将该返回值给到A，将A加入一级缓存，至此循环依赖问题解决。

## SpringBoot
> `SpringBoot`是由`Pivotal`团队提供的全新框架，其设计目的是用来简化新`Spring`应用的初始搭建以及开发过程。
该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。`SpringBoot` 提供了一种新的编程范式，可以更加快速便捷地开发 `Spring` 项目，在开发过程当中可以专注于应用程序本身的功能开发，而无需在 `Spring` 配置上花太大的工夫。

`SpringBoot` 基于 `Sring4` 进行设计，继承了原有 `Spring` 框架的优秀基因。`SpringBoot` 准确的说并不是一个框架，而是一些类库的集合。`maven` 或者 `gradle` 项目导入相应依赖即可使用 `SpringBoot`，而无需自行管理这些类库的版本。

特点：
- 独立运行的 `Spring` 项目：
`SpringBoot` 可以以 jar 包的形式独立运行，运行一个 `SpringBoot` 项目只需通过 `java–jar xx.jar` 来运行。
- 内嵌 `Servlet` 容器：
`SpringBoot` 可选择内嵌 `Tomcat`、`Jetty` 或者 `Undertow`，这样我们无须以 `war` 包形式部署项目。
- 提供 `starter` 简化 `Maven` 配置：
`Spring` 提供了一系列的 `starter` pom 来简化 `Maven` 的依赖加载，例如，当你使用了`spring-boot-starter-web` 时，会自动加入依赖包。
- 自动配置 `Spring`：
`SpringBoot` 会根据在类路径中的 jar 包、类，为 jar 包里的类自动配置 Bean，这样会极大地减少我们要使用的配置。当然，`SpringBoot` 只是考虑了大多数的开发场景，并不是所有的场景，若在实际开发中我们需要自动配置 `Bean`，而 `SpringBoot` 没有提供支持，则可以自定义自动配置。
- 准生产的应用监控：
`SpringBoot` 提供基于 `http、ssh、telnet` 对运行时的项目进行监控。
- 无代码生成和 xml 配置：
`SpringBoot` 的神奇的不是借助于代码生成来实现的，而是通过条件注解来实现的，这是 `Spring 4.x` 提供的新特性。`Spring 4.x` 提倡使用 Java 配置和注解配置组合，而 `SpringBoot` 不需要任何 xml 配置即可实现 `Spring` 的所有配置。

### @SpringBootApplication
`@SpringBootApplication`这个注解通常标注在启动类上：
```
@SpringBootApplication
public class SpringBootExampleApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootExampleApplication.class, args);
    }
}
```
`@SpringBootApplication`是一个复合注解，即由其他注解构成。核心注解是`@SpringBootConfiguration`和`@EnableAutoConfiguration`
```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(
    excludeFilters = {@Filter(
    type = FilterType.CUSTOM,
    classes = {TypeExcludeFilter.class}
), @Filter(
    type = FilterType.CUSTOM,
    classes = {AutoConfigurationExcludeFilter.class}
)}
)
public @interface SpringBootApplication{
}
```
### @SpringBootConfiguration
`@SpringBootConfiguration`核心注解是`@Configuration`代表自己是一个`Spring`的配置类
```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {
}
```
`@Configuration`底层实现就是一个`Component`
> 指示带注释的类是一个“组件”。
  在使用基于注释的配置和类路径扫描时，这些类被视为自动检测的候选类。
```
/**
 * Indicates that an annotated class is a "component".
 * Such classes are considered as candidates for auto-detection
 * when using annotation-based configuration and classpath scanning.
 *
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Indexed
public @interface Component 
```

### @EnableAutoConfiguration
核心注解是`@AutoConfigurationPackage`和`@Import({AutoConfigurationImportSelector.class})`
```
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
public @interface EnableAutoConfiguration {
}
```
`@AutoConfigurationPackage`注解核心是引入了一个`@Import(AutoConfigurationPackages.Registrar.class)`配置类,该类实现了`ImportBeanDefinitionRegistrar`接口
```
	/**
	 * {@link ImportBeanDefinitionRegistrar} to store the base package from the importing
	 * configuration.
	 */
	static class Registrar implements ImportBeanDefinitionRegistrar, DeterminableImports {
		@Override
		public void registerBeanDefinitions(AnnotationMetadata metadata, BeanDefinitionRegistry registry) {
			register(registry, new PackageImports(metadata).getPackageNames().toArray(new String[0]));
		}
		@Override
		public Set<Object> determineImports(AnnotationMetadata metadata) {
			return Collections.singleton(new PackageImports(metadata));
		}

	}
```

这里可以打断点自己看一下

`@AutoConfigurationPackage` 这个注解本身的含义就是将主配置类（`@SpringBootApplication`标注的类）所在的包下面所有的组件都扫描到 `spring` 容器中。

`AutoConfigurationImportSelector`核心代码如下
```
	/**
	 * Return the auto-configuration class names that should be considered. By default
	 * this method will load candidates using {@link SpringFactoriesLoader} with
	 * {@link #getSpringFactoriesLoaderFactoryClass()}.
	 * @param metadata the source metadata
	 * @param attributes the {@link #getAttributes(AnnotationMetadata) annotation
	 * attributes}
	 * @return a list of candidate configurations
	 */
	protected List<String> getCandidateConfigurations(AnnotationMetadata metadata, AnnotationAttributes attributes) {
		List<String> configurations = SpringFactoriesLoader.loadFactoryNames(getSpringFactoriesLoaderFactoryClass(),
				getBeanClassLoader());
		Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you "
				+ "are using a custom packaging, make sure that file is correct.");
		return configurations;
	}

	/**
	 * Return the class used by {@link SpringFactoriesLoader} to load configuration
	 * candidates.
	 * @return the factory class
	 */
	protected Class<?> getSpringFactoriesLoaderFactoryClass() {
		return EnableAutoConfiguration.class;
	}
	protected ClassLoader getBeanClassLoader() {
		return this.beanClassLoader;
	}
```
`getSpringFactoriesLoaderFactoryClass`方法返回`EnableAutoConfiguration.class`目的就是为了将启动类所需的所有资源导入。

在`getCandidateConfigurations`中有如下代码
```
Assert.notEmpty(configurations, "No auto configuration classes found in META-INF/spring.factories. If you are using a custom packaging, make sure that file is correct.");
```

大意：在`META-INF/spring.factories`中没有发现自动配置类。如果您使用的是自定义打包，请确保该文件是正确的。
![找到spring.factories](/iblog/posts/annex/images/essays/找到spring.factories.png)

`spring.factories`包含了很多类，但不是全部都加载的，在某些类里面，是有一个条件`@ConditionalOnXXX`注解，只有当这个注解上的条件满足才会加载。

例如：`SpringApplicationAdminJmxAutoConfiguration`
```
@Configuration(proxyBeanMethods = false)
@AutoConfigureAfter(JmxAutoConfiguration.class)
@ConditionalOnProperty(prefix = "spring.application.admin", value = "enabled", havingValue = "true",
		matchIfMissing = false)
public class SpringApplicationAdminJmxAutoConfiguration 
```

### 总结
![@SpringbootApplication原理](/iblog/posts/annex/images/essays/@SpringbootApplication原理.png)

当 `Springboot` 启动的时候，会执行`AutoConfigurationImportSelector`这个类中的`getCandidateConfigurations`方法，这个方法会帮我们加载`META-INF/spring.factories`文件里面的当`@ConditionXXX`注解条件满足的类。

## Bean的自动装配
提到Bean的自动装配就不得不说一下Spring的核心IOC，IOC全称为Inversion of Control，中文译为控制反转，是面向对象编程中的一种设计原则，可以用来减低计算机代码之间的耦合度。

IOC的一个重点是在系统运行中，动态的向某个对象提供它所需要的其他对象。这一点是通过DI（Dependency Injection，依赖注入）来实现的。

所谓IOC，对于spring框架来说，就是由spring来负责控制对象的生命周期和对象间的关系。IOC负责创建对象，把它们连接在一起，配置它们，并管理他们的整个生命周期从创建到销毁，所以可将IOC理解为一个大容器。IOC使用依赖注入（DI）来管理组成一个应用程序的组件。这些对象被称为 Spring Beans。

一般在代码里面由这些注解体现：
```
@Component
@Service
@Repository
@Controller
@Autowired
@Resource
@Inject
```

`Spring`利用依赖注入（DI），完成对IOC容器中各个组件的依赖关系赋值。

`Spring`提供三种装配方式：
- 基于注解的自动装配
- 基于 XML 配置的显式装配
- 基于 Java 配置的显式装配

此处详细介绍基于注解的自动装配
| 自动装配   | 来源                          | 支持@Primary | springboot支持属性 |
| ---------- | ----------------------------- | ------------ | ------------------ |
| @Autowired | Springboot原生                | 支持         | boolean required   |
| @Resource  | JSR-250，JDK自带              | 不支持       | String name         |
| @Inject    | JSR-330，需要导入javax.inject | 支持         | 无其他属性         |

### @Autowired
可以放在构造器、参数、方法、属性上

源码如下：
```
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
#### 加在属性上
使用`@Autowired`注解通常将其加载属性上或者构造器上，让其自动注入；默认是按照类型去容器中寻找对应的组件，例如：
```

public class SpringBootExampleApplication {


    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(TestConfig.class);

        TestService testService = annotationConfigApplicationContext.getBean(TestService.class);
        // TestService 实例=====>TestService(testDao=TestDao(name=default))
        System.out.println("TestService 实例=====>" +testService);

    }

}


// 扫描的包名称
@ComponentScan({"com.example.springboot.example.task"})
@Configuration
class TestConfig{

}


@ToString
@Service
class TestService {

    @Autowired
    TestDao testDao;

}

@ToString
@Repository
class TestDao{

    @Getter
    @Setter
    private String name = "default";

}
```
如果容器中有多个组件的名称相同,可以通过`@Qualifier`来进行选择注入；
```
public class SpringBootExampleApplication {


    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(TestConfig.class);

        TestService testService = annotationConfigApplicationContext.getBean(TestService.class);
        // TestService 实例=====>TestService(testDao=TestDao(name=我是默认的TestDao))
        System.out.println("TestService 实例=====>" +testService);

    }

}


@ComponentScan({"com.example.springboot.example.task"})
@Configuration
class TestConfig{

    @Bean(name = "testDao2")
     public TestDao testDao(){
        TestDao testDao = new TestDao();
        testDao.setName("我是testDao2");
        return testDao;
    }
}

@ToString
@Service
class TestService {

    @Autowired
    @Qualifier("testDao")
    TestDao testDao;

}

@ToString
@Repository
class TestDao{

    @Getter
    @Setter
    private String name = "我是默认的TestDao";

}
```
除了使用`@Qualifier`来进行选择注入外，也可以使用`@Primary`来设置 bean 的优先级，默认情况下指定让哪个 bean 优先注入；

`@Primary`注解是在没有明确指定的情况下，默认使用的 bean，如果你明确用`@Qualifier`指定，则会使用`@Qualifier`指定的bean；
确保测试结果准确，在使用`@Primary`时，将`@Qualifier`去掉。
```
public class SpringBootExampleTaskApplication {


    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(TestConfig.class);

        TestService testService = annotationConfigApplicationContext.getBean(TestService.class);
//        TestService 实例=====>TestService(testDao=TestDao(name=我是testDao2))
        System.out.println("TestService 实例=====>" +testService);

    }

}


@ComponentScan({"com.example.springboot.example.task"})
@Configuration
class TestConfig{

    @Primary
    @Bean(name = "testDao2")
     public TestDao testDao(){
        TestDao testDao = new TestDao();
        testDao.setName("我是testDao2");
        return testDao;
    }
}

@ToString
@Service
class TestService {

    @Autowired
    TestDao testDao;

}

@ToString
@Repository
class TestDao{

    @Getter
    @Setter
    private String name = "我是默认的TestDao";

}
```

如果使用`@Autowired`在容器中没有对应的组件名称，默认情况下会报错。
```
nested exception is org.springframework.beans.factory.NoSuchBeanDefinitionException
```
如果没有找到对应的 bean 不报错，可以通过`@Autowired(required = false)`来进行设置
```
@ToString
@Service
class TestService {
    
    // TestService 实例=====>TestService(testDao=null)

    @Autowired(required = false)
    TestDao testDao;

}
```
#### 加在方法、参数上
`@Autowired`注解不仅可以标注在属性上，也可以标注在方法上，当标注在方法上时，Spring容器创建当前对象，就会调用该方法完成赋值，方法使用的参数从IOC容器中获取。

通过测试打印对象的地址可以看到，方法中的参数确实是从IOC容器中获取的。
```
public class SpringBootExampleTaskApplication {


    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(TestConfig.class);

        TestService testService = annotationConfigApplicationContext.getBean(TestService.class);
        System.out.println("TestService 中的实例=====>" +testService);

        TestDao testDao = annotationConfigApplicationContext.getBean(TestDao.class);
        System.out.println("TestDao 中的实例=====>" +testDao);
        
        // TestService 中的实例=====>TestService(testDao=com.example.springboot.example.task.TestDao@5fe94a96)
        //TestDao 中的实例=====>com.example.springboot.example.task.TestDao@5fe94a96


    }

}


@ComponentScan({"com.example.springboot.example.task"})
@Configuration
class TestConfig{
}

@ToString
@Service
class TestService {


    TestDao testDao;

    @Autowired
    public void setTestDao(TestDao testDao) {
        this.testDao = testDao;
    }
}


@Repository
class TestDao{

    private String name = "我是默认的TestDao";

}
```
也可以加在参数上，与加在方法上类似也是从IOC容器中获取该对象。
```
@ToString
@Service
class TestService {


    TestDao testDao;

    public void setTestDao(@Autowired TestDao testDao) {
        this.testDao = testDao;
    }
}
```
在`Spring`创建对象的时候会默认调用组件的无参构造方法，如果只有一个有参构造，如果想要创建对象，则必须调用该有参构造；
所以当一个组件只有一个有参构造时，则可以不用写`@Autowired`注解。
```
@ToString
@Service
class TestService {


    TestDao testDao;
    
     // @Autowired
    public TestService(TestDao testDao) {
        this.testDao = testDao;
    }

}
```

除了通过构造方法的方式实例化组件，也可以通过用bean标注的形式，来实例化容器中的组件。
```
public class SpringBootExampleTaskApplication {


    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(TestConfig.class);

        TestService testService = annotationConfigApplicationContext.getBean(TestService.class);
        System.out.println("TestService 中的实例=====>" +testService);

        TestDao testDao = annotationConfigApplicationContext.getBean(TestDao.class);
        System.out.println("TestDao 中的实例=====>" +testDao);

        TestDao1 testDao1 = annotationConfigApplicationContext.getBean(TestDao1.class);
        System.out.println("TestDao1 中的实例=====>" +testDao);
        
        // TestService 中的实例=====>TestService(testDao=com.example.springboot.example.task.TestDao@639c2c1d)
        //TestDao 中的实例=====>com.example.springboot.example.task.TestDao@639c2c1d
        //TestDao1 中的实例=====>com.example.springboot.example.task.TestDao@639c2c1d

    }

}


@ComponentScan({"com.example.springboot.example.task"})
@Configuration
class TestConfig{

    @Bean
    public TestDao1 testDao1(TestDao testDao){
        TestDao1 testDao1 = new TestDao1();
        testDao1.setTestDao(testDao);
        return testDao1;
    }
}

@ToString
@Service
class TestService {


    TestDao testDao;

    @Autowired
    public TestService(TestDao testDao) {
        this.testDao = testDao;
    }

}


@Component
class TestDao{
}

class TestDao1{
    @Setter
    TestDao testDao;
}
```


#### 原理
```
/
 * @see AutowiredAnnotationBeanPostProcessor
 */
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD, ElementType.PARAMETER, ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired{}
```
在`@Autowired`注解文档注释上面，可以看到与之息息相关的一个类`AutowiredAnnotationBeanPostProcessor`，即`@Autowired`后置处理器；
可以看到该类实现了`MergedBeanDefinitionPostProcessor`接口，在`postProcessMergedBeanDefinition`方法上打一个断点，就可以看到`@Autowired`的调用栈。

`@Autowired`注解调用栈：
```
AbstractApplicationContext.refresh(容器初始化)
---> registerBeanPostProcessors (注册AutowiredAnnotationBeanPostProcessor) 
---> finishBeanFactoryInitialization
---> AbstractAutowireCapableBeanFactory.doCreateBean
---> AbstractAutowireCapableBeanFactory.applyMergedBeanDefinitionPostProcessors
---> MergedBeanDefinitionPostProcessor.postProcessMergedBeanDefinition
---> AutowiredAnnotationBeanPostProcessor.findAutowiringMetadata
```

核心调用：
```
postProcessMergedBeanDefinition`->`findAutowiringMetadata`->`buildAutowiringMetadata
```
相关源码：
```
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
 
            /*通过反射获取该类所有的字段，并遍历每一个字段，并通过方法findAutowiredAnnotation遍历每一个字段的所用注解，并如果用autowired修饰了，则返回auotowired相关属性*/  
 
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
            //和上面一样的逻辑，但是是通过反射处理类的method
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
    //用@Autowired修饰的注解可能不止一个，因此都加在currElements这个容器里面，一起处理		
			elements.addAll(0, currElements);
			targetClass = targetClass.getSuperclass();
		}
		while (targetClass != null && targetClass != Object.class);
 
		return new InjectionMetadata(clazz, elements);
	}
```
当`Spring` 容器启动时，`AutowiredAnnotationBeanPostProcessor` 组件会被注册到容器中，然后扫描代码，如果带有 `@Autowired` 注解，则将依赖注入信息封装到 `InjectionMetadata` 中。

最后创建 `bean`，即实例化对象和调用初始化方法，会调用各种 `XXXBeanPostProcessor` 对 `bean` 初始化，其中包括`AutowiredAnnotationBeanPostProcessor`，它负责将相关的依赖注入到容器中。

### @Resource、@Inject
Spring 自动装配除了`@Autowired`注解外，也支持JSR-250中的`@Resource`和JSR-330中的`@Inject`注解，来进行自动装配；

```
public class SpringBootExampleTaskApplication {


    public static void main(String[] args) {
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(TestConfig.class);

        TestService testService = annotationConfigApplicationContext.getBean(TestService.class);
//        TestService 实例=====>TestService(testDao=TestDao(name=我是默认的TestDao))
        System.out.println("TestService 实例=====>" +testService);

    }

}


@ComponentScan({"com.example.springboot.example.task"})
@Configuration
class TestConfig{

    @Bean(name = "testDao2")
     public TestDao testDao(){
        TestDao testDao = new TestDao();
        testDao.setName("我是testDao2");
        return testDao;
    }
}

@ToString
@Service
class TestService {


    @Resource
    TestDao testDao;

}


@ToString
@Repository
class TestDao{

    @Getter
    @Setter
    private String name = "我是默认的TestDao";

}
```

使用`@Inject`注解需要导入:
```
<dependency>
    <groupId>javax.inject</groupId>
    <artifactId>javax.inject</artifactId>
    <version>1</version>
</dependency>
```
```
@ToString
@Service
class TestService {

    // TestService 实例=====>TestService(testDao=TestDao(name=我是默认的TestDao))
    @Inject
    TestDao testDao;

}
```

 
### 使用Spring底层组件
通过实现`Aware`接口的子接口，来使用Spring的底层的组件。`Aware`接口类似于回调方法的形式在 Spring 加载的时候将我们自定以的组件加载。
```
/**
 * A marker superinterface indicating that a bean is eligible to be notified by the
 * Spring container of a particular framework object through a callback-style method.
 * The actual method signature is determined by individual subinterfaces but should
 * typically consist of just one void-returning method that accepts a single argument.
 */
public interface Aware {

}
```
![Aware子接口](/iblog/posts/annex/images/essays/Aware子接口.png)

使用测试
```
@Component
class TestService implements ApplicationContextAware, EmbeddedValueResolverAware, BeanFactoryAware {

    public TestService() {
    }

    ApplicationContext applicationContext;


    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        System.out.println("获取实例名称===>" + beanFactory.getBean("TestService"));
    }

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.applicationContext = applicationContext;
        System.out.println("获取容器对象===> "+ applicationContext);
    }

    @Override
    public void setEmbeddedValueResolver(StringValueResolver resolver) {
        System.out.println(resolver.resolveStringValue("我是${os.name}，今年${10*2.1}岁"));
    }
}
```

关于这些`Aware`都是使用`AwareProcessor`进行处理的,比如:`ApplicationContextAwareProcessor`就是处理`ApplicationContextAware`接口的。


## Bean的创建流程
![Spring详解-002](/iblog/posts/annex/images/spring/Spring详解-002.png)

1. 在xml或注解上标注定义Bean；
2. 使用IO流读取文件并使用dom4j或其他技术来解析xml，将其转换为document对象，并设置到BeanDefinition对象（注解则需要读取哪些类标注了该注解最终转换为BeanDefinition对象）；
3. 判断是否需要扩展，执行多个BeanFactoryProcessor方法，其目的在于获取一个完整的BeanDefinition对象。例如在xml中定义`{jdbc.username}`此处就可以进行替换操作；
4. bean的实例化，执行createBeanInstance方法，通过反射来创建对象；
5. bean的初始化：
   1. 设置对象属性包括设置自定义属性和通过调用Aware接口给容器中的属性赋值；
   2. 判断是否需要扩展，如需要可执行前置处理方法；
   3. 调用初始化方法执行invokeInitMethods方法，判断当前是否实现了InitialzingBean接口，如果实现该接口则调用afterPropertiesSet方法；
   4. 判断是否需要扩展，如需要可执行后置处理方法；
   5. 最终将对象交给容器来管理；
6. 使用对象
7. 销毁对象


## Bean的生命周期
`Bean`的生命周期，即`Bean`的 `实例化->初始化->使用->销毁` 的过程。

### 注入Bean
我们可以使用 xml 配置的方式来指定，`bean` 在初始化、销毁的时候调用对应的方法：
```xml
<bean id="getDemoEntity" class="com.my.demo" init-method="init" destroy-method="destroy" />
```
也可以使用注解的方式，来调用bean在初始化、销毁的时候调用对应的方法：
```
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
class DemoConfiguration {
    @Bean(initMethod = "init", destroyMethod = "destroy")
    public DemoEntity getDemoEntity() {
        return new DemoEntity();
    }
}

class DemoEntity {
    public DemoEntity(){
        System.out.println("调用了构造器...");
    }

    public void init(){
        System.out.println("调用了初始化方法...");
    }

    public void destroy(){
        System.out.println("调用了销毁方法...");
    }
}
```

单实例 `bean`：
- 在容器启动的时候创建对象；
- 在容器关闭的时候销毁；

多实例 `bean`：
- 在每次获取bean的时候创建对象；
- 容器不会自动帮你处理，需要手动销毁 `bean`；

多实例注解代码：
```
@Scope("prototype")
@Bean(initMethod="init",destroyMethod="destroy")
public Test test(){}
```

### InitializingBean、DisposableBean
通过让`Bean`实现 `InitializingBean`(定义初始化逻辑)和实现`DisposableBean`(销毁逻辑)实现初始化`bean`和销毁`bean`:

```
public class MainTest {
    public static void main(String[] args) {
        // 获取Spring IOC容器
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(DemoEntity.class);
        System.out.println("容器初始化完成...");

        annotationConfigApplicationContext.close();
        System.out.println("容器销毁了...");
    }
}

@Component
class DemoEntity implements InitializingBean, DisposableBean {
    public DemoEntity(){
        System.out.println("调用了构造器...");
    }

    @Override
    public void destroy(){
        System.out.println("调用了销毁方法...");
    }

    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("调用了初始化方法...");
    }
}
```
### @PostConstruct、@PreDestroy
Java提供了对应的注解，也可以调用`Bean`的初始化方法和销毁方法：
- `@PostConstruct` 标注该注解的方法，在`bean`创建完成并且属性赋值完成 来执行初始化方法;
- `@PreDestroy` 在容器销毁`bean`之前通知我们进行`bean`的清理工作;

这两个注解不是`spring`的注解是`JSR250`JDK带的注解。
```
public class MainTest {
    public static void main(String[] args) {
        // 获取Spring IOC容器
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(DemoEntity.class);
        System.out.println("容器初始化完成...");

        annotationConfigApplicationContext.close();
        System.out.println("容器销毁了...");
    }
}

@Component
class DemoEntity  {
    public DemoEntity(){
        System.out.println("调用了构造器...");
    }

    // 销毁之前调用
    @PreDestroy
    public void destroy(){
        System.out.println("调用了销毁方法...");
    }

    // 对象创建并赋值之后调用
    @PostConstruct
    public void init() {
        System.out.println("调用了初始化方法...");
    }
}
```

### BeanPostProcessor
除了上面的几种方法，也可以使用`BeanPostProcessor`，`Bean`的后置处理器，在初始化前后进行处理工作。
- `postProcessBeforeInitialization`：会在初始化完成之前调用
- `postProcessAfterInitialization`：会在初始化完成之后调用

调用顺序： 创建对象 --> postProcessBeforeInitialization --> 初始化 --> postProcessAfterInitialization --> 销毁
```
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

通过打断点可以看到，在创建`bean`的时候会调用`AbstractAutowireCapableBeanFactory`类的`doCreateBean`方法，这也是创建`bean`的核心方法。
```
    try {
        populateBean(beanName, mbd, instanceWrapper);
        exposedObject = initializeBean(beanName, exposedObject, mbd);
    }

    // ======= initializeBean  =======
    if (mbd == null || !mbd.isSynthetic()) {
        wrappedBean = applyBeanPostProcessorsBeforeInitialization(wrappedBean, beanName);
    }

    try {
        invokeInitMethods(beanName, wrappedBean, mbd);
    }
    catch (Throwable ex) {
        throw new BeanCreationException(
                (mbd != null ? mbd.getResourceDescription() : null),
                beanName, "Invocation of init method failed", ex);
    }
    if (mbd == null || !mbd.isSynthetic()) {
        wrappedBean = applyBeanPostProcessorsAfterInitialization(wrappedBean, beanName);
    }
```

调用栈大致如下：
```
populateBean()
{
    applyBeanPostProcessorsBeforeInitialization() -> invokeInitMethods() -> applyBeanPostProcessorsAfterInitialization()
}
```
在初始化之前调用`populateBean()`方法,给`bean`进行属性赋值,之后在调用`applyBeanPostProcessorsBeforeInitialization`方法；

`applyBeanPostProcessorsBeforeInitialization`源码：
```
	public Object applyBeanPostProcessorsBeforeInitialization(Object existingBean, String beanName)
			throws BeansException {

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

该方法作用，遍历容器中所有的`BeanPostProcessor`挨个执行`postProcessBeforeInitialization`方法，一旦返回`null`，将不会执行后面`bean`的`postProcessBeforeInitialization`方法。
之后在调用`invokeInitMethods`方法，进行`bean`的初始化，最后在执行`applyBeanPostProcessorsAfterInitialization`方法，执行一些初始化之后的工作。

## AOP
AOP全称：`Aspect-Oriented Programming`，译为面向切面编程 。AOP可以说是对OOP的补充和完善。在程序原有的纵向执行流程中,针对某一个或某些方法添加通知(方法),形成横切面的过程就叫做面向切面编程。

实现AOP的技术，主要分为两大类： 一是采用动态代理技术，利用截取消息的方式，对该消息进行装饰，以取代原有对象行为的执行；二是采用静态织入的方式，引入特定的语法创建“切面”，从而使得编译器可以在编译期间织入有关“切面”的代码，属于静态代理。

作用：
- 将复杂的需求分解出不同的方面，将公共功能集中解决。例如：处理日志。
- 采用代理机制组装起来运行，在不改变原程序的基础上对代码段进行增强处理，增加新的功能。

### 动态代理
动态代理，可以说是AOP的核心了。在`Spring`中主要使用了两种[动态代理](/iblog/posts/rookie/rookie-object-oriented/#动态代理)：
- JDK 动态代理技术
- CGLib 动态代理技术

JDK的动态代理时基于Java 的反射机制来实现的，是Java 原生的一种代理方式。他的实现原理就是让代理类和被代理类实现同一接口，代理类持有目标对象来达到方法拦截的作用。
通过接口的方式有两个弊端一个就是必须保证被代理类有接口，另一个就是如果相对被代理类的方法进行代理拦截，那么就要保证这些方法都要在接口中声明。接口继承的是`java.lang.reflect.InvocationHandler`。

CGLib 动态代理使用的 ASM 这个非常强大的 Java 字节码生成框架来生成`class` ，基于继承的实现动态代理，可以直接通过 super 关键字来调用被代理类的方法.子类可以调用父类的方法,不要求有接口。

### 使用
使用AOP大致可以分为三步：
1. 将业务逻辑组件和切面类都加入到容器中，并用`@Aspect`注解标注切面类。
2. 在切面类的通知方法上，要注意切面表达式的写法，标注通知注解，告诉`Spring`何时何地的运行：
    - `@Before`:前置通知，在目标方法运行之前执行；
    - `@After`: 后置通知，在目标方法运行之后执行，无论方法是否出现异常都会执行；
    - `@Around`: 环绕通知，通过`joinPoint.proceed()`方法手动控制目标方法的执行；
    - `@AfterThrowing`: 异常通知，在目标方法出现异常之后执行；
    - `@AfterReturning`: 返回通知，在目标方法返回之后执行；
3. 使用`@EnableAspectJAutoProxy`开启基于注解的AOP模式。
 

```
public class MainTest {
    public static void main(String[] args) {
        // 获取Spring IOC容器
        AnnotationConfigApplicationContext annotationConfigApplicationContext = new AnnotationConfigApplicationContext(DemoConfiguration.class);

        DemoEntity demoEntity = annotationConfigApplicationContext.getBean(DemoEntity.class);
        demoEntity.myAspectTest("123");

        annotationConfigApplicationContext.close();
    }
}

@EnableAspectJAutoProxy
@Configuration
class DemoConfiguration{

    @Bean
    public DemoEntity getDemoEntity(){
        return new DemoEntity();
    }

    @Bean
    public DemoAspect gerDemoAspect(){
        return new DemoAspect();
    }

}

@Aspect
class DemoAspect {

    @Pointcut("execution(* com.lilian.ticket.image.exchange.DemoEntity.myAspectTest(..))")
    public void pointer() {}

    @Before("pointer()")
    public void beforeTest(JoinPoint joinPoint) {
        System.out.println("调用了AOP，前置通知");
        Object[] args = joinPoint.getArgs();
        System.out.println("前置通知:目标方法参数：[" + args[0] + "]");
    }

    @After("pointer()")
    public void afterTest(JoinPoint joinPoint){
        System.out.println("调用了AOP，后置通知");
        Object[] args = joinPoint.getArgs();
        System.out.println("后置通知:目标方法参数：[" + args[0] + "]");
    }

    @Around("pointer()")
    public Object aroundTest(ProceedingJoinPoint joinPoint) {
        System.out.println("===调用了AOP，环绕通知===");
        System.out.println("环绕通知目标方法执行前");
        Object[] args = joinPoint.getArgs();
        System.out.println("环绕通知:目标方法参数：[" + args[0] + "]");
        Object proceed = null;
        try {
             proceed = joinPoint.proceed();
        } catch (Throwable throwable) {
            throwable.printStackTrace();
        }
        System.out.println("环绕通知目标方法执行后\n");
        return proceed;
    }

    @AfterThrowing(pointcut="pointer()", throwing="ex")
    public void afterThrowingTest(JoinPoint joinPoint, Exception ex) {
        System.out.println("异常通知==>["+ex.getMessage()+"]\n");
    }

    @AfterReturning("pointer()")
    public void afterReturnTest(JoinPoint joinPoint){
        Object[] args = joinPoint.getArgs();
        System.out.println("有返回值的后置通知:目标方法参数：[" + args[0] + "]");
    }

}

class DemoEntity {

    public String myAspectTest(String name) {
        System.out.println("调用了 myAspectTest 方法;\t name=[" + name + "]");
        // 当name传入null时，模拟异常
        name.split("123");
        return name;
    }
}
```
### @EnableAspectJAutoProxy
要想AOP起作用，就要加`@EnableAspectJAutoProxy`注解，所以AOP的原理可以从`@EnableAspectJAutoProxy`入手研究。

它是一个复合注解，启动的时候，给容器中导入了一个`AspectJAutoProxyRegistrar`组件：
```
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(AspectJAutoProxyRegistrar.class)
public @interface EnableAspectJAutoProxy {}
```

发现该类实现了`ImportBeanDefinitionRegistrar`接口，而该接口的作用是给容器中注册`bean`的；所以`AspectJAutoProxyRegistrar`作用是，添加自定义组件给容器中注册`bean`。
```
class AspectJAutoProxyRegistrar implements ImportBeanDefinitionRegistrar {

	/**
	 * Register, escalate, and configure the AspectJ auto proxy creator based on the value
	 * of the @{@link EnableAspectJAutoProxy#proxyTargetClass()} attribute on the importing
	 * {@code @Configuration} class.
	 */
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
**`AspectJAutoProxyRegistrar`组件何时注册？**

通过对下面代码打断点
```
AopConfigUtils.registerAspectJAnnotationAutoProxyCreatorIfNecessary(registry);
```
可以看到该方法是给容器中注册了一个`AnnotationAwareAspectJAutoProxyCreator`组件，实际上是注册`AnnotationAwareAspectJAutoProxyCreator`组件。

![AOP核心组件1](/iblog/posts/annex/images/essays/AOP核心组件.png)

可以看出`@EnableAspectJAutoProxy`注解最主要的作用实际上就是通过`@Import`注解把`AnnotationAwareAspectJAutoProxyCreator`这个对象注入到`spring`容器中。

现在只要把`AnnotationAwareAspectJAutoProxyCreator`组件何时注册搞懂，`AspectJAutoProxyRegistrar`组件何时注册也就明白了。

`AnnotationAwareAspectJAutoProxyCreator`继承关系：
```
AnnotationAwareAspectJAutoProxyCreator
    extends AspectJAwareAdvisorAutoProxyCreator
        extends AbstractAdvisorAutoProxyCreator
            extends AbstractAutoProxyCreator
                extends ProxyProcessorSupport implements SmartInstantiationAwareBeanPostProcessor,BeanFactoryAware
                    extends ProxyConfig implements Ordered, BeanClassLoaderAware, AopInfrastructureBean 
```
可以看到其中的一个父类`AbstractAutoProxyCreator`这个父类实现了`SmartInstantiationAwareBeanPostProcessor`接口，该接口是一个后置处理器接口；同样实现了`BeanFactoryAware`接口，这意味着，该类可以通过接口中的方法进行自动装配`BeanFactory`。

这两个接口的在AOP体系中具体的实现方法：
```
1.AbstractAutoProxyCreator
BeanFactoryAware重写：
- AbstractAutoProxyCreator.setBeanFactory

SmartInstantiationAwareBeanPostProcessor重写:
- AbstractAutoProxyCreator.postProcessBeforeInstantiation
- AbstractAutoProxyCreator.postProcessAfterInitialization

2.AbstractAdvisorAutoProxyCreator
BeanFactoryAware重写：
- AbstractAdvisorAutoProxyCreator.setBeanFactory -> initBeanFactory

3. AnnotationAwareAspectJAutoProxyCreator
BeanFactoryAware重写：
- AnnotationAwareAspectJAutoProxyCreator.initBeanFactory
```

在上面的任何方法搭上断点即可看到类似下面的方法调用栈：
```
AnnotationConfigApplicationContext.AnnotationConfigApplicationContext()
    ->AbstractApplicationContext.refresh() //刷新容器，给容器初始化bean
        ->AbstractApplicationContext.finishBeanFactoryInitialization()
            ->DefaultListableBeanFactory.preInstantiateSingletons()
                ->AbstractBeanFactory.getBean()
                    ->AbstractBeanFactory.doGetBean()
                        ->DefaultSingletonBeanRegistry.getSingleton()
                            ->AbstractBeanFactory.createBean()
                                ->AbstractAutowireCapableBeanFactory.resolveBeforeInstantiation()
                                    ->AbstractAutowireCapableBeanFactory.applyBeanPostProcessorsBeforeInstantiation()
                                        ->AbstractAutowireCapableBeanFactory.applyBeanPostProcessorsBeforeInstantiation()
                                            ->调用AOP相关的后置处理器
```

其中 `AbstractApplicationContext.refresh()` 方法，调用了 `registerBeanPostProcessors()`方法 ，它是用来注册后置处理器，以拦截 `bean` 的创建。也是在这个方法中完成了对 `AnnotationAwareAspectJAutoProxyCreator` 的注册。
在下面详细的展开。

注册完 `BeanPostProcessor` 后，还调用了方法 `finishBeanFactoryInitialization()` ，完成 `BeanFactory` 初始化工作，并创建剩下的单实例 `bean`。
```
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
#### registerBeanPostProcessors

`registerBeanPostProcessors`方法中注册了所有的`BeanPostProcessor`;注册顺序是：
1. 注册实现了`PriorityOrdered`接口的`BeanPostProcessor`;
2. 注册实现了 `Ordered` 接口的 `BeanPostProcessor`;
3. 注册常规的 `BeanPostProcessor` ,也就是没有实现优先级接口的 `BeanPostProcessor`;
4. 注册 `Spring` 内部 `BeanPostProcessor`;

由于`AnnotationAwareAspectJAutoProxyCreator`类间接实现了`Ordered`接口。所以它是在注册实现`Ordered`接口的`BeanPostProcessor`中完成注册。

注册时会调用`AbstractBeanFactory.getBean() -> AbstractBeanFactory.doGetBean()`创建`bean`。

`doGetBean()`方法作用：
- 创建`bean`：`createBeanInstance()`;
- 给`bean`中的属性赋值：`populateBean()`;
- 初始化`bean`：`initializeBean()`;

初始化`bean`时，`initializeBean`方法会调用`BeanPostProcessor`和`BeanFactory`以及`Aware`接口的相关方法。这也是`BeanPostProcessor`发挥初始化`bean`的原理。
```
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
`initializeBean`作用：
- 处理 `Aware` 接口的方法回调：`invokeAwareMethods()`;
- 执行后置处理器的`postProcessBeforeInitialization()`方法；
- 执行自定义的初始化方法：`invokeInitMethods()`;
- 执行后置处理器的`postProcessAfterInitialization()`方法;

`initializeBean`方法执行成功，`AnnotationAwareAspectJAutoProxyCreator`组件才会注册和初始化成功。

#### finishBeanFactoryInitialization
除了弄懂`AnnotationAwareAspectJAutoProxyCreator`组件何时注册，也需要知道它什么时候被调用，这就涉及到`finishBeanFactoryInitialization`方法。

继续看方法的调用：
```
AnnotationConfigApplicationContext.AnnotationConfigApplicationContext()
    ->AbstractApplicationContext.refresh() // 刷新容器，给容器初始化bean
        ->AbstractApplicationContext.finishBeanFactoryInitialization() // 从这继续
            ->DefaultListableBeanFactory.preInstantiateSingletons()
                ->AbstractBeanFactory.getBean()
                    ->AbstractBeanFactory.doGetBean()
                        ->DefaultSingletonBeanRegistry.getSingleton()
                            ->AbstractBeanFactory.createBean()
                                ->AbstractAutowireCapableBeanFactory.resolveBeforeInstantiation()
                                    ->AbstractAutowireCapableBeanFactory.applyBeanPostProcessorsBeforeInstantiation()
                                        ->AbstractAutowireCapableBeanFactory.applyBeanPostProcessorsBeforeInstantiation()
                                            ->调用AOP相关的后置处理器
```

`finishBeanFactoryInitialization`源码简要：
```
protected void finishBeanFactoryInitialization(ConfigurableListableBeanFactory beanFactory) {

    // ...
    
    // 注释大意： 实例化所有剩余的(非lazy-init)单例。
    // Instantiate all remaining (non-lazy-init) singletons.
    beanFactory.preInstantiateSingletons(); // 断点停在这里
}
```

`finishBeanFactoryInitialization` 方法也需要注册`Bean`。它会调用 `preInstantiateSingletons()` 方法遍历获取容器中所有的 `Bean`，实例化所有剩余的非懒加载初始化单例 `Bean`。

`preInstantiateSingletons()`方法源码简要：
```
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
`preInstantiateSingletons()` 调用 `getBean()` 方法，获取`Bean`实例，执行过程`getBean()->doGetBean()->getSingleton()->createBean()`，又回到了上面注册`Bean`的步骤。

这里要注意`createBean()`方法中的`resolveBeforeInstantiation()`方法，这里可以理解为缓存`Bean`,如果被创建了就拿来直接用，如果没有则创建`Bean`。
```
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
    }

    // ...

    try {
        Object beanInstance = doCreateBean(beanName, mbdToUse, args);
        if (logger.isTraceEnabled()) {
            logger.trace("Finished creating instance of bean '" + beanName + "'");
        }
        return beanInstance;
    }

    // ...
}
```

`resolveBeforeInstantiation()`、`applyBeanPostProcessorsBeforeInstantiation()`方法源码：
````
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
````
到了这里在回过头来看一下`AnnotationAwareAspectJAutoProxyCreator`组件实现的`SmartInstantiationAwareBeanPostProcessor`接口，继承关系：
```
SmartInstantiationAwareBeanPostProcessor 
    ->extends InstantiationAwareBeanPostProcessor
        ->extends BeanPostProcessor
```
到这就跟前边对上了，AOP相关的后置处理器也就是在这被调用的。

回头在看上面的`createBean()`方法，刚才看到的是`resolveBeforeInstantiation()`方法的调用栈，所以从层次结构上看`AnnotationAwareAspectJAutoProxyCreator`组件的调用是在创建 `Bean`实例之前先尝试用后置处理器返回对象的。

![AOP@EnableAspectJAutoProxy原理](/iblog/posts/annex/images/essays/AOP@EnableAspectJAutoProxy原理.png)

## Spring事务
Spring 为事务管理提供了丰富的功能支持，Spring 事务管理分为编码式和声明式的两种方式。
编程式事务指的是通过编码方式实现事务；声明式事务基于 AOP，即使用`@Transactional`注解，将具体业务逻辑与事务处理解耦。声明式事务管理使业务代码逻辑不受污染, 因此在实际使用中声明式事务用的比较多。

### Spring事务的隔离级别
事务隔离级别，即数据库中事务隔离级别，指的是一个事务对数据的修改与另一个并行的事务的隔离程度，当多个事务同时访问相同数据时，如果没有采取必要的隔离机制，就可能发生以下问题：

|问题     | 描述                                                                                                                                         |
|-----|--------------------------------------------------------------------------------------------------------------------------------------------|
|脏读     | 一个事务读到另一个事务未提交的更新数据。比如银行取钱，事务A开启事务，此时切换到事务B，事务B开启事务–>取走100元，此时切换回事务A，事务A读取的肯定是数据库里面的原始数据，因为事务B取走了100块钱，并没有提交，数据库里面的账务余额肯定还是原始余额，这就是脏读。     |
|幻读     | 是指当事务不是独立执行时发生的一种现象。如第一个事务对一个表中的数据进行了修改，这种修改涉及到表中的全部数据行。 同时，第二个事务也修改这个表中的数据，这种修改是向表中插入一行新数据。那么，以后就会发生操作第一个事务的用户发现表中还有没有修改的数据行，就好象 发生了幻觉一样。 |
|不可重复读     | 在一个事务里面的操作中发现了未被操作的数据。 比方说在同一个事务中先后执行两条一模一样的select语句，期间在此次事务中没有执行过任何DDL语句，但先后得到的结果不一致，这就是不可重复读。                                            |

<br>
Spring支持的隔离级别：

|隔离级别     | 描述                                                                                          |
|-----|---------------------------------------------------------------------------------------------|
|DEFAULT     | 使用数据库本身使用的隔离级别。ORACLE（读已提交） MySQL（可重复读）                                                     |
|READ_UNCOMITTED     | 读未提交（脏读）最低的隔离级别，一切皆有可能。                                                                     |
|READ_COMMITED     | 读已提交，ORACLE默认隔离级别，有幻读以及不可重复读风险。                                                             |
|REPEATABLE_READ     | 可重复读，解决不可重复读的隔离级别，但还是有幻读风险。                                                                 |
|SERLALIZABLE     | 串行化，所有事务请求串行执行，最高的事务隔离级别，不管多少事务，挨个运行完一个事务的所有子事务之后才可以执行另外一个事务里面的所有子事务，这样就解决了脏读、不可重复读和幻读的问题了。 |

<br>
不是事务隔离级别设置得越高越好，事务隔离级别设置得越高，意味着势必要花手段去加锁用以保证事务的正确性，那么效率就要降低，因此实际开发中往往要在效率和并发正确性之间做一个取舍，一般情况下会设置为READ_COMMITED，此时避免了脏读，并发性也还不错，之后再通过一些别的手段去解决不可重复读和幻读的问题就好了。

Spring中通过`@Transactional(isolation = Isolation.REPEATABLE_READ)`可以指定事务的隔离级别。
Spring建议的是使用`DEFAULT`，即数据库本身的隔离级别，配置好数据库本身的隔离级别，无论在哪个框架中读写数据都不用操心了。

### Spring事务的传播及场景
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

### Spring事务的原理
在Spring框架中，事务管理的实现是通过集成数据库事务API来实现的。具体来说，Spring事务管理的核心在于使用各种 `PlatformTransactionManager` 接口的实现类，这些实现类会调用底层数据库事务API来管理事务。

`@Transactional`主要是利用Spring Aop实现的。 
当一个方法使用了`@Transactional`注解，在运行时，JVM为该Bean创建一个代理对象，并且在调用目标方法的时候进行使用`TransactionInterceptor`拦截，代理对象负责在调用目标方法之前开启事务，然后执行方法的逻辑。
方法执行成功，则提交事务，如果执行方法中出现异常，则回滚事务。
同时Spring利用`ThreadLocal`会将事务资源（如数据库连接）与当前线程绑定，以确保在同一事务中共享资源，这些资源在事务提交或回滚时会被清理。

使用`@Transactional`注解会触发以下步骤：
1. 创建事务代理对象；
2. 调用目标方法时，事务代理拦截调用；
3. 事务拦截器决定开启事务，并调用底层数据库事务API；
4. 执行目标方法方法中的业务逻辑；
5. 方法执行完毕后，事务拦截器决定提交或回滚事务，调用底层数据库事务API；

`@Transactional`注解失效情况：
1. 如果某个方法是非public的，那么`@Transactional`就会失效。因为事务的底层是利用`cglib`代理实现，`cglib`是基于父子类来实现的，子类是不能重载父类的private方法，所以无法很好利用代理，这种情况下会导致@Transactional失效；
2. 使用的数据库引擎不支持事务。因为Spring的事务调用的也是数据库事务的API，如果数据库都不支持事务，那么`@Transactional`注解也就失效了；
3. 添加了`@Transactional`注解的方法不能在同一个类中调用，否则会使事务失效。这是因为Spring AOP通过代理来管理事务，自调用不会经过代理；
4. `@Transactional` 注解属性 `propagation` 设置错误，若是错误的配置以下三种 `propagation`，事务将不会发生回滚：
   - `TransactionDefinition.PROPAGATION_SUPPORTS`：如果当前存在事务，则加入该事务；如果当前没有事务，则以非事务的方式继续运行。
   - `TransactionDefinition.PROPAGATION_NOT_SUPPORTED`：以非事务方式运行，如果当前存在事务，则把当前事务挂起。
   - `TransactionDefinition.PROPAGATION_NEVER`：以非事务方式运行，如果当前存在事务，则抛出异常。
5. `@Transactional`注解属性`rollbackFor`设置错误，`rollbackFor`可以指定能够触发事务回滚的异常类型。默认情况下，Spring仅在抛出未检查异常（继承自`RuntimeException`）时回滚事务。对于受检异常（继承自 `Exception`），事务不会回滚，除非明确配置了`rollbackFor`属性；
6. 异常被捕获了，导致`@Transactional`失效。当事务方法中抛出一个异常后，应该是需要表示当前事务需要`rollback`，如果在事务方法中手动捕获了该异常，那么事务方法则会认为当前事务应该正常提交，此时就会出现事务方法中明明有报错信息表示当前事务需要回滚，但是事务方法认为是正常，出现了前后不一致，也是因为这样就会抛出`UnexpectedRollbackException`异常；

## 参考文章
- https://blog.csdn.net/scjava/article/details/109587619
- https://spring.io/projects/spring-boot