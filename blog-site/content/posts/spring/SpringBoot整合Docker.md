---
title: "SpringBoot整合Docker"
date: 2020-08-30
draft: false
tags: ["springboot", "docker","spring"]
slug: "springboot-docker"
---


## 创建测试
```java
/**
 * <p>
 * Hello Controller
 * </p>
 */
@RestController
@RequestMapping
public class HelloController {
    @GetMapping
    public String hello() {
        return "Hello,From Docker";
    }
}
```
`application.yml`文件。
```yaml
server:
  port: 8080
  servlet:
    context-path: /demo

```

## Dockerfile
首先创建一个名字叫`Dockerfile`的文件，路径任意。
![DockerFile](/iblog/posts/annex/images/application/dockerFile.jpg)
```text
# 基础镜像
FROM openjdk:8-jdk-alpine

# 作者信息
MAINTAINER "whitepure"

# 添加一个存储空间 其效果是在主机 /var/lib/docker 目录下创建了一个临时文件，并链接到容器的/tmp
VOLUME /tmp

# 暴露8080端口
EXPOSE 8080

# 添加变量，获取target下的jar包； 如果使用dockerfile-maven-plugin，则会自动替换这里的变量内容
ARG JAR_FILE=target/demo-docker.jar

# 往容器中添加jar包
ADD ${JAR_FILE} app.jar

# 启动镜像自动运行程序
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/urandom","-jar","/app.jar"]
```

## pom文件
在`pom`文件加入`Docker`插件。
```pom
<properties>
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <project.reporting.outputEncoding>UTF-8</project.reporting.outputEncoding>
    <java.version>1.8</java.version>
    <dockerfile-version>1.4.9</dockerfile-version>
</properties>

<build>
    <finalName>demo-docker</finalName>
    <plugins>
        <plugin>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-maven-plugin</artifactId>
        </plugin>
        <plugin>
            <groupId>com.spotify</groupId>
            <artifactId>dockerfile-maven-plugin</artifactId>
            <version>${dockerfile-version}</version>
            <configuration>
                <repository>${project.build.finalName}</repository>
                <tag>${project.version}</tag>
                <buildArgs>
                    <JAR_FILE>target/${project.build.finalName}.jar</JAR_FILE>
                </buildArgs>
            </configuration>
        </plugin>
    </plugins>
</build>
```
使用`maven`打包
![docker打包](/iblog/posts/annex/images/application/docker打包.jpg)

## Docker镜像测试
1. 前往 `Dockerfile` 目录，打开并命令行执行。
>执行`docker build`命令，`docker`就会根据`Dockerfile`里你定义好的命令进行构建新的镜像。
`-t`代表要构建的镜像的 `tag` ，`.`代表当前目录，也就是 `Dockerfile`所在的目录。
    ```shell
    docker build -t demo-docker .
    ```
2. 查看`Docker`镜像列表。
    ```shell
    docker images
    ```
3. 运行该镜像。使用镜像`demo-docker`，将容器的`8080`端口映射到主机的`9090`端口。
    ```shell
    docker run -d -p 9090:8080 demo-docker
    ```
4. 打开浏览器访问地址`http://localhost:9090/demo` 。
    ![hellodocker](/iblog/posts/annex/images/application/hellodocker.jpg)

如果要停止`Docker`镜像，首先获取镜像`id`，然后在用`stop`命令停止运行镜像。
> docker ps -a: 显示所有的容器，包括未运行的
```text
whitepure@MacBook-Pro demo-docker % docker ps -a
CONTAINER ID   IMAGE      ...    NAMES
421fcff1be87   demo-docker   ...  affectionate_nightingale
whitepure@MacBook-Pro demo-docker % docker stop 421fcff1be87
421fcff1be87
```
如果要删除镜像，也需要先获取镜像`id`，再用`rm`命令进行删除。
```text
whitepure@MacBook-Pro demo-docker % docker ps -a
CONTAINER ID   IMAGE         ...    NAMES
421fcff1be87   demo-docker    ...     affectionate_nightingale
whitepure@MacBook-Pro demo-docker % docker rm 421fcff1be87
421fcff1be87
```
