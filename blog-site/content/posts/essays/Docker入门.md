---
title: "Docker入门"
date: 2020-04-07
draft: false
tags: ["使用介绍", "Docker"]
slug: "docker-start"
---

## 概述
`Docker`属于`Linux`容器的一种封装，提供简单易用的容器使用接口。它是目前流行的`Linux`容器解决方案。`Docker`将应用程序与该程序的依赖，打包在一个文件里面。运行这个文件，就会生成一个虚拟容器。
程序在这个虚拟容器里运行，就好像在真实的物理机上运行一样。有了 `Docker`，就不用担心环境问题。总体来说`Docker` 的接口相当简单，用户可以方便地创建和使用容器，把自己的应用放入容器。
容器还可以进行版本管理、复制、分享、修改，就像管理普通的代码一样。

`Docker`可以提供一次性的环境。比如，本地测试他人的软件、持续集成的时候提供单元测试和构建的环境。
还可以提供弹性的云服务，因为`Docker`容器可以随开随关，很适合动态扩容和缩容。
`Docker`最常见的就是通过多个容器，组建微服务架构，一台机器可以跑多个服务，因此在本机就可以模拟出微服务架构。

## Linux上安装
2017年的3月1号之后，`Docker`的版本命名开始发生变化，同时将CE版本和EE版本进行分开。
- Docker社区版（CE）：为了开发人员或小团队创建基于容器的应用,与团队成员分享和自动化的开发管道。`docker-ce`提供了简单的安装和快速的安装，以便可以立即开始开发。`docker-ce`集成和优化，基础设施。（免费）
- Docker企业版（EE）：专为企业的发展和IT团队建立谁。`docker-ee`为企业提供最安全的容器平台，以应用为中心的平台。（付费）

以下是`CentOS`或`RHEL`上使用`yum`来安装`Docker`示例。
1. `Docker`依赖于系统的一些必要的工具，所以先安装依赖。
    ```shell
    yum install -y yum-utils device-mapper-persistent-data lvm2
    ```
2. 通过使用`yum-config-manager`来设置`Docker`的稳定仓库。(在阿里云镜像站上面可以找到`docker-ce`的软件源，使用国内的源速度比较快)。
    ```shell
    yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
    ```
3. 安装`docker-ce`，社区版，免费。
    ```shell
    yum clean allyum makecache fastyum -y install docker-ce
    ```
4. 启动服务。
    ```shell
     #service 命令的用法
    $ sudo service docker start
    
    #systemctl 命令的用法
    $ sudo systemctl start docker
    ```
5. 查看安装版。
    ```shell
    docker version
    ```
7. `Docker`需要用户具有`sudo`权限，为了避免每次命令都输入`sudo`，可以把用户加入`Docker`用户组。
    ```shell
    sudo usermod -aG docker $USER
    ```

## 工作原理
![docker架构](/iblog/posts/annex/images/application/docker架构.png)

`Docker`架构分为三部分，客户端、宿主机、注册中心。
1. `Docker`客户端是用户与`Docker`交互的接口。用户通过客户端输入命令（如 `docker run`），这些命令会发送到`Docker`守护进程来执行。
2. 宿主机运行`Docker`守护进程，管理容器的生命周期。宿主机负责从注册中心拉取镜像、创建和管理容器，以及处理与容器相关的所有任务。
3. `Docker`注册中心用于存储和分发`Docker`镜像。常见的公共注册中心是`Docker Hub`，但用户也可以设置私有的注册中心。注册中心存储镜像，供宿主机下载。

例如，当输入`docker run mysql:5.6`命令，告诉`Docker`要运行一个MySQL 5.6版本的容器。
`Docker`客户端将用户的命令发送给宿主机上的`Docker`守护进程。`Docker`守护进程首先会在本地检查是否存在`mysql:5.6`镜像。
如果本地没有找到`mysql:5.6`镜像，守护进程会向注册中心请求下载这个镜像。如果本地已经有这个镜像，则跳过下载步骤。
如果需要从注册中心下载镜像，守护进程会连接到`Docker`注册中心，并拉取`mysql:5.6`镜像。
下载完成后，`Docker`守护进程会根据`mysql:5.6`镜像创建一个新的容器。最后`Docker`守护进程为容器分配资源，并启动容器。MySQL服务会在这个容器内运行起来。

## 常用命令
- 查看当前运行的镜像。
```shell
docker ps
```
- 查看所有镜像。
```shell
docker ps -a
```
- 停止容器。
```shell
docker stop 容器名称
```
- 删除镜像。
```shell
docker rmi 镜像名称
```
- 下载镜像，若不指定版本为最新版本。
```shell
docker pull 镜像:版本
```
- 查看当前本地仓库的镜像。
```shell
docker images
```
- 查看远程仓库镜像。
```shell
docker search 镜像名
```

以安装运行`nginx`为例。
```shell
// docker run 包括下载镜像(pull),创建容器(create),运行容器(start) 可用dock -h查看帮助
// --rm 表明这是一个临时的容器,关闭的话会自动删除
// --name 容器名称
// -p 外部服务器端口映射docker容器端口
docker run --rm --name myNginx -p 80:80 nginx:版本

// 查看容器日志
docker logs myNginx

// 进入容器
docker exec -it myNginx bash
```