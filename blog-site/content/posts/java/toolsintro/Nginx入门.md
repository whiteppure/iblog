---
title: "Nginx入门"
date: 2021-03-04
draft: false
tags: ["入门" ,"Nginx"]
slug: "nginx-start"
---


## 概述
`Nginx`是一个高性能的Web服务器和反向代理服务器，特点是占有内存少，并发能力强，`Nginx`的并发能力确实在同类型的网页服务器中表现较好。
`Nginx`专为性能优化而开发，性能是其最重要的考量，实现上非常注重效率，能经受高负载的考验，有报告表明能支持高达50000个并发连接数。
常用于处理大量的并发连接。它也可以用作负载均衡器和HTTP缓存。它因其高效的性能、灵活的配置和低资源消耗而受到广泛欢迎。

`Nginx`能够作为Web服务器，高效地提供静态文件，如 `HTML`、`CSS`、`JavaScript`和图片，适用于静态网站和内容托管。
还能反向代理，即接收客户端请求并将其转发到内部的应用服务器，隐藏后端服务器的信息，提高安全性。
`Nginx`还能将请求分发到多个后端服务器上，以实现负载均衡，提升应用的性能和可用性。

### 动静分离
动静分离是一种优化网站性能和提高用户体验的技术，它将动态内容和静态内容分开处理。这样做的目的是通过将静态资源从动态资源中分离出来，减少服务器负载，提高网页加载速度。
静态内容由`Nginx`提供，动态内容转发到应用服务器，优化性能。

![nginx动静分离](/posts/annex/images/application/nginx动静分离.jpg)

`Nginx`实现动静分离是将静态资源，如图片、`CSS`和`JavaScript`，与动态内容，如数据库查询结果和用户请求，分开处理，用来优化性能和减轻服务器负担。
`Nginx`直接处理静态资源请求，指向专门的目录或`CDN`，从而减少应用服务器的负担。同时，动态请求通过反向代理转发到后端应用服务器，比如`Tomcat`或`Node.js`，动态内容由应用服务器处理。
静态资源可以缓存到客户端或`CDN`上，提高加载速度并减少服务器负担。通过这种方式，`Nginx`高效处理静态资源，并将动态请求转发给后端服务器，实现动静分离，从而优化整体系统性能。

假设一个电商网站的首页包含大量商品图片、`CSS`样式、`JavaScript`脚本，以及用户推荐、购物车信息、个性化广告（动态内容）。因为静态内容和动态内容的处理需求不同，且如果服务器同时处理这两种内容，会导致性能瓶颈和负载过重，所以实现了动静分离。
通过将静态内容存储在`CDN`或专门的静态文件服务器上，静态资源可以快速加载，减轻了主服务器的负担。动态内容则由应用服务器处理，用户的个性化数据和实时更新的信息通过反向代理服务器转发给后端应用服务器处理。这样一来，网站能够更高效地处理请求，提高整体性能和用户体验，同时避免因服务器负载过重而导致的性能瓶颈。

### 反向代理
![nginx反向代理](/posts/annex/images/application/nginx反向代理.jpg)

- 正向代理：正向代理服务器位于客户端和目标服务器之间，充当客户端的代表向目标服务器发出请求。客户端知道目标服务器的地址，但目标服务器不知晓客户端的真实身份。
- 反向代理：反向代理服务器位于目标服务器和客户端之间，充当目标服务器的代表接受客户端的请求。客户端并不知道目标服务器的真实存在，只与代理服务器交互。

正向代理就像是一个“代购”，你（客户端）想买某个商品（访问某个网站），但是由于某些原因（比如地理限制），你自己买不到。于是，你找到一个代购（正向代理服务器），告诉它你想买什么商品（访问哪个网站）。
代购会替你去买商品（访问网站），然后把商品（返回网站内容）送到你手里。对方商家（目标服务器）并不知道真正买东西的是你，它只知道有一个代购来购买了东西。

反向代理则像是一个“门卫”，你（客户端）想去一个公司（访问网站）找某个员工（目标服务器）。但是，这个公司有一个门卫（反向代理服务器），所有来访者必须先经过门卫。
你跟门卫说明你想找谁，门卫会去通知公司里的那个员工，然后再把员工的回复带给你。你始终只和门卫打交道，根本看不到公司里的员工（真实服务器）。这样，员工的信息对你是隐藏的，你只知道门卫在为你服务。

反向代理相比正向代理有许多显著的优点。它可以隐藏后端服务器的真实地址，使客户端只与代理服务器交互，这样有效保护了后端服务器的安全，避免了直接攻击和泄露内部架构的风险。
在负载均衡方面，反向代理能够将客户端请求分配到多个后端服务器，优化资源利用率和系统性能，避免了单点故障带来的问题。反向代理还具备缓存功能，能够缓存常见的请求响应，减少对后端服务器的压力，提升了访问速度和系统响应时间。
虽然正向代理也有隐私保护和绕过访问限制的作用，但它通常不提供负载均衡、缓存等额外功能。因此，在性能提升、安全增强和高可用性方面，反向代理显得尤为重要。

`Nginx`实现反向代理的方式是通过接收客户端的请求，然后将这些请求转发到后端的服务器上，最后将后端服务器的响应返回给客户端。在这个过程中，客户端只与`Nginx`进行交互，不直接接触后端服务器。
这种方式使得客户端不需要知道后端服务器的实际存在，同时可以在`Nginx`层进行负载均衡、缓存和安全控制等操作。

### 负载均衡
由于访问量的增加，单个服务器承受不了并发。我们增加服务器的数量，然后将请求分发到各个服务器上，将原先请求集中到单个服务器上的情况改为将请求分发到多个服务器上，将负载分发到不同的服务器，也就是我们所说的负载均衡。
负载均衡是一种分配网络流量和服务器请求的技术，其目的是优化资源使用、提高系统可靠性和增强应用性能。负载均衡可以在多个服务器之间分配客户端请求，以防止单个服务器过载，提高系统的可用性和响应速度。
![nginx负载均衡](/posts/annex/images/application/nginx负载均衡.png)

常见的负载均衡算法：
- 轮询: 按顺序将请求分配到每台服务器。
- 最少连接: 将请求分配到当前连接数最少的服务器。
- 加权轮询: 根据服务器的权重值来分配请求，权重可以反映服务器的处理能力。

`Nginx`默认使用轮询算法进行负载均衡。轮询算法会将每个客户端请求依次分配到配置的每台服务器上，按照设置的顺序循环进行。
这种方法简单有效，适用于大多数负载均衡场景，尤其是在所有服务器的处理能力相近时。

当负载均衡器收到请求时，它会将请求按照顺序分配给下一台服务器。第一次请求会被分配给第一个服务器，第二次请求会分配给第二个服务器，以此类推。
当请求分配到最后一台服务器后，下一次请求会从第一台服务器开始重新分配。

## Docker安装Nginx
1. 通过`Docker Hub`拉取最新的`Nginx`镜像。
    ```shell
    docker pull nginx
    ```
2. 使用以下命令启动`Nginx`容器。
    ```shell
    docker run --name mynginx -p 80:80 -d nginx
    ```
3. 在浏览器中访问`http://localhost`，你应该能看到`Nginx`的默认欢迎页面。
4. 如果需要自定义`Nginx`配置，可以创建一个本地配置文件，并将其挂载到容器中。
    ```shell
    docker run --name mynginx -p 80:80 -v /path/to/your/nginx.conf:/etc/nginx/nginx.conf:ro -d nginx
    ```

## 配置Nginx
`Nginx`的配置文件通常位于`/etc/nginx/nginx.conf`，`nginx.conf`文件包含全局设置、HTTP服务器设置和其他配置。基本的配置文件示例：
```text
user  www-data;
worker_processes  auto;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;
    error_log   /var/log/nginx/error.log;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    gzip  on;

    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

### 动静分离配置
```text
server {
    listen 80;
    server_name example.com;

    # 处理静态资源请求
    location /static/ {
        alias /usr/share/nginx/html/static/;  # 静态文件存放目录
    }

    # 处理动态请求
    location /api/ {
        proxy_pass http://backend_server;  # 转发到后端应用服务器
        proxy_set_header Host $host;  # 保持原始请求头信息
        proxy_set_header X-Real-IP $remote_addr;  # 传递客户端真实IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 传递客户端IP链
        proxy_set_header X-Forwarded-Proto $scheme;  # 传递请求协议
    }
}
```
- `location /static/`：处理所有以`/static/`开头的静态资源请求。`alias`指令指定了静态文件所在的实际路径`/usr/share/nginx/html/static/`。
如访问`http://example.com/static/images/logo.png` 将访问对应的`/usr/share/nginx/html/static/images/logo.png`文件。
- `location /api/`：处理以`/api/`开头的动态请求，将请求转发到后端应用服务器`http://backend_server`。`proxy_pass`指令完成转发，`proxy_set_header`指令用于传递客户端请求的信息给后端服务器。

### 反向代理配置
```text
server {
    listen 80;
    server_name example.com;

    location /api/ {
        proxy_pass http://backend_server;  # 转发到后端应用服务器
        proxy_set_header Host $host;  # 保持原始请求头信息
        proxy_set_header X-Real-IP $remote_addr;  # 传递客户端真实IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 传递客户端IP链
        proxy_set_header X-Forwarded-Proto $scheme;  # 传递请求协议
    }
}
```
`location /api/`代表处理所有以`/api/`开头的请求，并将其转发到`http://backend_server`。`proxy_pass`指令指定了目标后端服务器，`proxy_set_header`指令传递了客户端的原始请求信息，如IP地址和请求协议，保证后端服务器能够接收到准确的信息。

### 负载均衡配置
```text
http {
    upstream backend_servers {
        server backend1.example.com;  # 后端服务器1
        server backend2.example.com;  # 后端服务器2
    }

    server {
        listen 80;
        server_name example.com;

        location /api/ {
            proxy_pass http://backend_servers;  # 转发到负载均衡的后端服务器组
            proxy_set_header Host $host;  # 保持原始请求头信息
            proxy_set_header X-Real-IP $remote_addr;  # 传递客户端真实IP
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  # 传递客户端IP链
            proxy_set_header X-Forwarded-Proto $scheme;  # 传递请求协议
        }
    }
}
```
- `upstream backend_servers`：定义了一个名为`backend_servers`的后端服务器组，包含两个服务器`backend1.example.com`和`backend2.example.com`。
`Nginx`将使用默认的轮询算法将请求均匀地分配到这些服务器上。
- `location /api/`：处理所有以`/api/`开头的请求，将其转发到名为`backend_servers`的后端服务器组。`proxy_pass`指令将请求转发到负载均衡的服务器组，`proxy_set_header`指令传递客户端请求的信息。
