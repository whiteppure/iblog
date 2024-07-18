---
title: "SpringBoot详解"
date: 2024-07-20
draft: false
tags: ["Java", "spring", "详解"]
slug: "java-springboot"
---



## 概览
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
`@SpringBootConfiguration`核心注解是`@Configuration`的作用是将类标记为配置类，可以定义`@Bean`方法来创建和配置 Spring 容器中的Bean。
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
`@EnableAutoConfiguration`作用是启用`SpringBoot`的自动配置机制。它的核心是`@AutoConfigurationPackage`和`@Import({AutoConfigurationImportSelector.class})`
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

当一个类使用 `@SpringBootApplication` 注解时，`SpringBoot`会自动进行一系列配置，让应用快速启动并运行。这个注解包含了 `@SpringBootConfiguration`，相当于告诉 Spring 这是一个配置类，就像使用了 `@Configuration` 一样。
`@Configuration` 的作用是将类标记为配置类，这个配置类可以定义 `@Bean` 方法来创建和配置 Spring 容器中的 Bean。同时，`@EnableAutoConfiguration` 启用了`SpringBoot`的自动配置功能，`SpringBoot`会根据项目中的依赖，自动配置很多常用的 Spring 组件，这样就不需要手动配置它们。
这个自动配置的过程是通过扫描 `spring.factories` 文件中的自动配置类来实现的。另外，`@ComponentScan` 让 Spring 自动扫描当前包及其子包下的所有组件，比如标注了 `@Component`、`@Service`、`@Repository` 和 `@Controller` 的类，并把它们注册到 Spring 容器中。
因此，把应用的主类放在根包中，`SpringBoot`就会自动扫描并加载所有需要的组件和配置，让你可以专注于编写业务代码，而不用担心复杂的配置细节。`SpringBoot`通过这一系列自动化的配置和扫描机制，简化了开发和配置的工作量，让应用能够快速启动并运行。

