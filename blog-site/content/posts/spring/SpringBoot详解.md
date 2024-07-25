---
title: "SpringBoot详解"
date: 2024-07-25
draft: false
tags: ["Spring","SpringBoot", "详解"]
slug: "java-springboot"
---


## 概览
SpringBoot是由`Pivotal`团队提供的全新框架，其设计目的是用来简化Spring应用的初始搭建以及开发过程。该框架使用了特定的方式来进行配置，从而使开发人员不再需要定义样板化的配置。SpringBoot提供了一种新的编程范式，可以更加快速便捷地开发Spring项目，在开发过程当中可以专注于应用程序本身的功能开发，而无需在Spring配置上花太大的工夫。

SpringBoot基于`Sring4`进行设计，继承了原有Spring框架的优秀基因。SpringBoot准确的说并不是一个框架，而是一些类库的集合。
`maven`或者`gradle`项目导入相应依赖即可使用 SpringBoot，而无需自行管理这些类库的版本。

特点：
- 自动配置：SpringBoot提供自动配置功能，根据项目的依赖和环境自动设置 Spring应用程序，减少了手动配置的复杂度。
- 启动器：SpringBoot提供“启动器”依赖集合，如 `spring-boot-starter-web`，简化了项目的依赖管理。
- 嵌入式服务器：SpringBoot支持嵌入式服务器，如`Tomcat`、`Jetty`和`Undertow`，使得应用程序可以独立运行，无需外部Web服务器。
- 生产级别的特性：SpringBoot具备生产级别的功能，包括健康检查、应用监控、日志管理等。Actuator 模块可以轻松监控和管理应用程序。
- 无配置的约定：SpringBoot遵循“无配置”的原则，使用合理的默认值和约定，减少需要编写的配置代码。
- 快速开发：SpringBoot的项目结构和默认配置帮助开发者快速启动新项目。内置工具和插件支持开发、测试和部署。

## 与Spring的区别
Spring和SpringBoot的最主要区别在于配置和启动的复杂性。

Spring和SpringBoot的主要区别在于配置和启动的复杂性。Spring框架需要大量的手动配置，包括XML配置文件或Java配置类，配置过程较为繁琐且易出错。
此外，Spring应用程序通常需要部署到外部的Web服务器，并需要额外的步骤来启动和运行。

相比之下，SpringBoot提供了自动配置功能，可以根据项目的依赖自动设置应用程序，极大地简化了配置工作。
它还支持嵌入式服务器，使得应用程序能够独立运行，无需外部 Web 服务器，且可以通过`java -jar`命令直接启动。这些特点使得SpringBoot更加适合快速开发和部署应用程序。

## 创建SpringBoot项目
在IDEA中使用`Spring Initializr`快速创建一个SpringBoot项目。

![SpringBoot详解](/iblog/posts/annex/images/spring/SpringBoot详解-001.png)

选择所需的依赖

![SpringBoot详解](/iblog/posts/annex/images/spring/SpringBoot详解-002.png)

SpringBoot项目通常包括以下几个主要部分：

![SpringBoot详解](/iblog/posts/annex/images/spring/SpringBoot详解-003.png)

在`src/main/resources`目录下创建`application.properties`或`application.yml`文件来配置应用程序。示例配置如下：

![SpringBoot详解](/iblog/posts/annex/images/spring/SpringBoot详解-004.png)

主应用类通常位于项目的根包，并使用`@SpringBootApplication`注解。

![SpringBoot详解](/iblog/posts/annex/images/spring/SpringBoot详解-005.png)

创建一个`Controller`处理`HTTP`请求并返回响应。使用`@RestController`注解定义控制器，使用`@RequestMapping`或`@GetMapping`处理请求。

![SpringBoot详解](/iblog/posts/annex/images/spring/SpringBoot详解-006.png)

在IDE中运行，右击主应用类并选择“Run”。

![SpringBoot详解](/iblog/posts/annex/images/spring/SpringBoot详解-007.png)

![SpringBoot详解](/iblog/posts/annex/images/spring/SpringBoot详解-008.png)

通过浏览器输入`http://localhost:8081/api/hello` 测试。

![SpringBoot详解](/iblog/posts/annex/images/spring/SpringBoot详解-009.png)

## SpringBoot常用注解
[//]: # (写到了这里)

## SpringBoot自动配置

## SpringBoot配置管理


## @SpringBootApplication原理
`@SpringBootApplication`这个注解通常标注在启动类上：
```java
@SpringBootApplication
public class SpringBootExampleApplication {
    public static void main(String[] args) {
        SpringApplication.run(SpringBootExampleApplication.class, args);
    }
}
```
`@SpringBootApplication`是一个复合注解，即由其他注解构成。核心注解是`@SpringBootConfiguration`和`@EnableAutoConfiguration`。
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@SpringBootConfiguration
@EnableAutoConfiguration
@ComponentScan(excludeFilters = {
        @Filter(type = FilterType.CUSTOM, classes = TypeExcludeFilter.class),
        @Filter(type = FilterType.CUSTOM, classes = AutoConfigurationExcludeFilter.class) })
public @interface SpringBootApplication {}
```

### @SpringBootConfiguration
`@SpringBootConfiguration`核心注解是`@Configuration`的作用是将类标记为配置类，可以定义`@Bean`方法来创建和配置 Spring容器中的Bean。
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Configuration
public @interface SpringBootConfiguration {}
```
`@Configuration`底层实现就是一个`Component`。
```java
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
public @interface Component{}
```

### @EnableAutoConfiguration
`@EnableAutoConfiguration`作用是启用SpringBoot的自动配置机制。它的核心是`@AutoConfigurationPackage`和`@Import({AutoConfigurationImportSelector.class})`
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
@AutoConfigurationPackage
@Import({AutoConfigurationImportSelector.class})
public @interface EnableAutoConfiguration {}
```
`@AutoConfigurationPackage`的核心是引入了一个`@Import(AutoConfigurationPackages.Registrar.class)`配置类，该类实现了`ImportBeanDefinitionRegistrar`接口。
这个注解本身的含义就是将主配置类（`@SpringBootApplication`标注的类）所在的包下面所有的组件都扫描到Spring容器中。
```java
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
`AutoConfigurationImportSelector`类的作用是通过扫描`spring.factories`文件，加载所有自动配置类。
```java
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
```
![找到spring.factories](/iblog/posts/annex/images/essays/找到spring.factories.png)

但是`spring.factories`包含了很多类，并不是全部都加载的，在某些类里面，是有一个条件`@ConditionalOnXXX`注解，只有当这个注解上的条件满足才会加载。如`SpringApplicationAdminJmxAutoConfiguration`。
```java
@Configuration(proxyBeanMethods = false)
@AutoConfigureAfter(JmxAutoConfiguration.class)
@ConditionalOnProperty(prefix = "spring.application.admin", value = "enabled", havingValue = "true",matchIfMissing = false)
public class SpringApplicationAdminJmxAutoConfiguration {}
```

当一个类使用 `@SpringBootApplication` 注解时，SpringBoot会自动进行一系列配置，让应用快速启动并运行。这个注解包含了 `@SpringBootConfiguration`，相当于告诉 Spring这是一个配置类，就像使用了 `@Configuration` 一样。
`@Configuration` 的作用是将类标记为配置类，这个配置类可以定义 `@Bean` 方法来创建和配置 Spring容器中的 `Bean`。同时，`@EnableAutoConfiguration` 启用了SpringBoot的自动配置功能，SpringBoot会根据项目中的依赖，自动配置很多常用的 Spring组件，这样就不需要手动配置它们。
这个自动配置的过程是通过扫描 `spring.factories` 文件中的自动配置类来实现的。另外，`@ComponentScan` 让 Spring自动扫描当前包及其子包下的所有组件，比如标注了 `@Component`、`@Service`、`@Repository` 和 `@Controller` 的类，并把它们注册到 Spring容器中。
因此，把应用的主类放在根包中，SpringBoot就会自动扫描并加载所有需要的组件和配置，让你可以专注于编写业务代码，而不用担心复杂的配置细节。SpringBoot通过这一系列自动化的配置和扫描机制，简化了开发和配置的工作量，让应用能够快速启动并运行。

## SpringBoot嵌入式服务器

