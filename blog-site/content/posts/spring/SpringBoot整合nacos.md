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

一键傻瓜试安装即可

官网写的很清楚这里不在赘述 [http://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html](http://nacos.io/zh-cn/docs/v2/quickstart/quick-start.html)

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
整合nacos配置中心，注册中心

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

### 完整项目
[gitee地址](https://gitee.com/gitee_pikaqiu/springboot-naocos-demo)