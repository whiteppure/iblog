---
title: "SpringBoot整合nacos"
date: 2023-09-04
draft: false
tags: ["springboot", "nacos"]
slug: "springboot-nacos"
---

## nacos

### nacos下载
[下载地址](https://github.com/alibaba/nacos/releases) 

一键傻瓜试安装即可,官网写的很清楚这里不在赘述 [http://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html](http://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html)

### nacos启动
将模式改为单机模式
![SpringBoot整合nacos](/iblog/posts/annex/images/spring/SpringBoot整合nacos-001.png)

启动成功
![SpringBoot整合nacos](/iblog/posts/annex/images/spring/SpringBoot整合nacos-002.png)

### nacos相关配置
![SpringBoot整合nacos](/iblog/posts/annex/images/spring/SpringBoot整合nacos-004.png)

#### demo-dev.yaml
```yaml
server:
  port: 8001

config:
  info: "config info for dev from nacos config center"
```
#### demo-test.yaml
```yaml
server:
  port: 3333

config:
  info: "config info for test from nacos config center"
```
#### user.yaml
```yaml
user:
  name: zs1112222
  age: 10
  address: 测试地址
```

![SpringBoot整合nacos](/iblog/posts/annex/images/spring/SpringBoot整合nacos-003.png)


## 代码
整合nacos配置中心,注册中心,完整项目地址 [gitee地址](https://gitee.com/gitee_pikaqiu/springboot-naocos-demo)

### pom.xml
```xml
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.2.2.RELEASE</version>
</parent>

<dependencies>
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-config</artifactId>
        <version>2.2.2.RELEASE</version>
    </dependency>
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
        <version>2.2.2.RELEASE</version>
    </dependency>
</dependencies>
```
### UserConfig
```java
@Data
@Configuration
@ConfigurationProperties(prefix = "user")
public class UserConfig {

    private String name;

    private Integer age;

    private String address;

}
```
### BeanAutoRefreshConfigExample
```java
@RestController
public class BeanAutoRefreshConfigExample {

    @Autowired
    private UserConfig userConfig;

    @GetMapping("/user/hello")
    public String hello(){
        return userConfig.getName() + userConfig.getAge() + userConfig.getAddress();
    }

}
```

### ValueAnnotationExample
```java
@RestController
@RefreshScope
public class ValueAnnotationExample {

    @Value("${config.info}")
    private String configInfo;

    @GetMapping("/config/info")
    public String getConfigInfo() {
        return configInfo;
    }

}
```

### DemoApplication
```java
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

}
```

### bootstrap.yml
```yaml
spring:
  profiles:
    # 指定环境 切换环境
    active: dev
  application:
    name: demo
  cloud:
    # nacos server dataId
    # ${spring.application.name)}-${spring.profiles.active}.${spring.cloud.nacos.config.file-extension}
    nacos:
      # Nacos服务注册中心
      discovery:
        serverAddr: @serverAddr@
        group: DEMO_GROUP
        namespace: 25af15f3-ae79-41c3-847d-960adb953185
        username: @username@
        password: @password@
      # Nacos作为配置中心
      config:
        server-addr: @serverAddr@
        file-extension: yaml
        group: DEMO_GROUP
        namespace: 25af15f3-ae79-41c3-847d-960adb953185
        username: @username@
        password: @password@
        # 加载多配置
        extension-configs:
          - data-id: user.yaml
            group: DEMO_GROUP
            refresh: true

```

### 测试结果
![SpringBoot整合nacos](/iblog/posts/annex/images/spring/SpringBoot整合nacos-005.png)

![SpringBoot整合nacos](/iblog/posts/annex/images/spring/SpringBoot整合nacos-006.png)


### 补充.刷新静态配置
有时候一些老项目或者一些写法会遇到静态的配置,这时候可以利用Java的反射特性来刷新静态变量.

大致原理为: 监听nacos配置改动,通过nacos改动确定改动的配置,进而缩小更新范围,通过反射更新变量.

```xml
<!-- https://mvnrepository.com/artifact/com.purgeteam/dynamic-config-spring-boot-starter -->
<dependency>
    <groupId>com.purgeteam</groupId>
    <artifactId>dynamic-config-spring-boot-starter</artifactId>
    <version>0.1.1.RELEASE</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

@NacosRefreshStaticField
```java
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface NacosRefreshStaticField {

    String configPrefix() default "";

}
```

NacosListener
```java
@Slf4j
@Component
@EnableDynamicConfigEvent
public class NacosListener implements ApplicationListener<ActionConfigEvent> {

    @Autowired
    private ApplicationContext applicationContext;

    @SneakyThrows
    @Override
    public void onApplicationEvent(ActionConfigEvent environment) {
        Map<String, HashMap> map = environment.getPropertyMap();
        for (Map.Entry<String, HashMap> entry : map.entrySet()) {
            String key = entry.getKey();
            Map changeMap = entry.getValue();
            String before = String.valueOf(changeMap.get("before"));
            String after = String.valueOf(changeMap.get("after"));
            log.info("配置[key:{}]被改变，改变前before：{}，改变后after：{}",key,before,after);

            String[] configNameArr = key.split("\\.");
            String configPrefix = configNameArr[0];
            String configRealVal = configNameArr[configNameArr.length-1];

            AtomicReference<Class<?>> curClazz = new AtomicReference<>();
            Map<String, Object> refreshStaticFieldBeanMap = applicationContext.getBeansWithAnnotation(NacosRefreshStaticField.class);
            for (Map.Entry<String, Object> mapEntry : refreshStaticFieldBeanMap.entrySet()) {
                String beanName = mapEntry.getKey();
                if (ObjectUtil.isEmpty(beanName)) {
                    continue;
                }

                String fullClassName = refreshStaticFieldBeanMap.get(beanName).toString().split("@")[0];
                Class<?> refreshStaticFieldClass;
                try {
                    refreshStaticFieldClass = Class.forName(fullClassName);
                } catch (ClassNotFoundException e) {
                    throw new ClassNotFoundException("监听nacos刷新当前静态类属性,未找到当前类",e);
                }
                NacosRefreshStaticField refreshStaticConfig = refreshStaticFieldClass.getAnnotation(NacosRefreshStaticField.class);
                if (Objects.nonNull(refreshStaticConfig) && refreshStaticConfig.configPrefix().equalsIgnoreCase(configPrefix)) {
                    curClazz.set(refreshStaticFieldClass);
                }
            }
            Class<?> aClass = curClazz.get();
            if (Objects.isNull(aClass)) {
                return;
            }

            // 利用反射动态更新 静态变量
            Field[] declaredFields = aClass.getDeclaredFields();
            for (Field declaredField : declaredFields) {
                if (declaredField.getName().equalsIgnoreCase(configRealVal)) {
                    log.info("刷新当前配置 更新当前类[{}] 静态属性 [{}]",aClass.getSimpleName(),declaredField.getName());
                    declaredField.setAccessible(true);
                    declaredField.set(null,after);
                }
            }

        }

    }
}
```

CommonWebConfig
```java
@Data
@Component
@ConfigurationProperties(prefix = "common")
@RefreshScope
public class CommonWebConfig {

    private String apiUrl;

}
```

使用
```java
@Component
@NacosRefreshStaticField(configPrefix="common")
public class ExampleComponent {
    public static String apiUrl = SpringUtil.getBean(CommonWebConfig.class).getApiUrl();
}
```

