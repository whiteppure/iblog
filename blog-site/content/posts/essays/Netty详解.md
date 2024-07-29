---
title: "Netty详解"
date: 2021-04-09
draft: false
tags: ["Netty","详解"]
slug: "java-netty"
---


## 概述
`Netty`是一个高性能、异步的网络应用框架，用于开发高效的网络通信程序。它是Java `NIO`的一个抽象，简化了网络编程的复杂性，并提供了一系列高级功能，使网络编程变得更简单。

`Netty`是一个高效的网络框架，专注于处理大量并发连接。它通过异步IO处理来避免阻塞，这让它在处理高并发时表现出色。
`Netty`还利用了优化的内存管理和零拷贝技术，降低了性能开销。框架的灵活性也很高，开发者可以通过管道机制自定义数据处理流程，API和文档丰富，帮助简化网络编程。

不过，`Netty`的学习曲线可能较陡，对于不熟悉网络编程的开发者来说，理解和使用它可能需要一些时间。虽然框架提供了很多抽象，底层控制和调试可能会有一定的复杂性。
为了实现最佳性能，可能还需要对`Netty`的工作原理有深入了解。总的来说，`Netty`适合需要高性能和高并发的应用场景，如高性能`HTTP`服务器、实时消息系统、游戏服务器、代理服务器以及数据传输处理。

## 线程模型的演变
网络编程采用传统的阻塞IO模型。在这种模型中，每个IO操作会阻塞线程，直到操作完成。为了处理多个连接，通常需要为每个连接创建一个线程。
这个方式虽然简单，但在处理大量并发连接时效率低，因为线程的创建和销毁开销大，而且线程会在等待IO操作完成期间无法执行其他任务，导致资源利用不充分，系统扩展性差。

`Reactor`模型的出现是为了改进传统IO模型中的问题。通过引入事件驱动机制和非阻塞 IO，`Reactor`模型提高了处理并发IO操作的效率。
事件循环机制允许单个线程同时处理多个IO操作，而非阻塞IO避免了线程在等待数据时的阻塞状态。这种设计改进了资源利用率和系统响应速度，适应了高并发环境的需求。

`Netty`在`Reactor`模型的基础上进行了进一步的优化和扩展。它通过异步编程技术和管道机制提升了性能和开发效率。
`Netty`的事件循环机制经过优化，减少了线程和上下文切换的开销。管道机制将数据处理分解为多个阶段，使得网络应用的开发更加灵活和高效。

### 传统IO模型
![传统IO模型](/iblog/posts/annex/images/essays/传统IO模型.png)

在阻塞IO模型中，线程在执行IO操作时会被阻塞，直到操作完成。例如，当一个线程发起读操作时，它会一直等待数据到达，无法处理其他任务。
这种模型简单易理解，但在高并发环境下，可能会导致大量的线程阻塞和上下文切换，从而降低系统的性能。

传统IO模型通常使用阻塞方式处理IO操作，其中每个IO请求都会分配一个线程，该线程在等待数据传输时会被阻塞。
这种方式简单易理解，但在高并发环境下，线程的创建、销毁和上下文切换开销较大，导致性能问题。每个线程的阻塞状态使得系统资源利用效率低，处理大量并发连接时表现不佳。

相比之下，`Reactor` IO模型采用非阻塞方式，通过事件循环和回调机制来处理IO操作。在这个模型中，单个或少量线程通过事件循环机制监听和分发IO事件，避免了线程的阻塞。
这样线程可以在等待IO操作的同时处理其他任务，大幅提高了系统的性能和资源利用效率。`Reactor`模型利用事件多路复用技术，能够在高并发环境下高效地管理大量连接和IO操作，适用于需要处理大量并发请求的应用场景。

### Reactor模型
`Reactor`模型是一种高效处理并发IO操作的设计模式，主要依赖事件驱动机制和非阻塞IO。
它基于IO复用模型，多个连接共用一个阻塞对象，应用程序只需要在一个阻塞对象等待，无需阻塞等待所有连接。 当某个连接有新的数据可以处理时，操作系统通知应用程序，线程从阻塞状态返回，开始进行业务处理。
`Netty`主要基于主从`Reactor`多线程模型做了一定的改进。

![Reactor模式](/iblog/posts/annex/images/essays/Reactor模式.png)

为了避免浪费创建了一个线程池，当客户端发起请求时，通过`DispatcherHandler`进行分发请求处理到线程池，线程池中在使用具体的线程进行事件处理。
服务器端程序处理传入的多个请求，并将它们同步分派到相应的处理线程，因此`Reactor`模式也叫`Dispatcher`模式。
`Reactor`模式使用IO复用监听事件，收到事件后，分发给某个线程，这点就是网络服务器高并发处理关键。

#### 单Reactor单线程
![单Reactor单线程](/iblog/posts/annex/images/essays/单Reactor单线程.png)

工作原理：
- `Reactor`对象通过`Select`监控客户端请求事件，收到事件后通过`Dispatch`进行分发；
- 如果是建立连接请求事件，则由`Acceptor`通过`Accept`处理连接请求，然后创建一个`Handler`对象处理连接完成后的后续业务处理；
- 如果不是建立连接事件，则`Reactor`会分发调用连接对应的`Handler`来响应；
- `Handler`会完成 `Read` → 业务处理 → `Send` 的完整业务流程；

单`Reactor`单线程模型的优点在于其简单性和高效的资源利用。由于只有一个线程负责处理所有的IO事件，这种模型避免了多线程管理的复杂性，减少了上下文切换和线程开销，使得系统资源消耗较少。
在低并发环境下，这种模型可以有效地处理IO操作，降低了系统的复杂性和开发难度。

这个模型的局限性包括处理能力的限制。在高并发场景中，单线程可能成为性能瓶颈，无法处理大量的并发请求。此外，如果某个IO操作发生阻塞，可能会影响到其他事件的处理，导致整体系统性能下降。

单`Reactor`单线程模型适用于连接数目较少、负载不高的应用场景，例如小型网络服务或低并发的应用。在处理高并发、大流量的应用时，可能需要使用多 Reactor 或多线程模型，以更好地满足性能需求。

#### 单Reactor多线程
[//]: # (写到了这里)
![单Reactor多线程](/iblog/posts/annex/images/essays/单Reactor多线程.png)

步骤：
- Reactor 对象通过对 select 监听请求事件，收到请求事件后交给 dispath 进行转发
- 如果是建立连接请求，则通过 accept 处理连接请求，然后创建一个handler对象处理完成连接后的事件
- 如果不是建立连接请求，则直接交给 handler 对象
- handler 只负责响应事件，不做具体的业务处理，通过 read 读取完后，分发给下面的 worker线程池中某个线程处理
- worker 线程负责处理具体业务，处理完成后会将具体的结果返回给 handler
- handler 线程通过send方法返回给客户端

缺点：
- 多线程访问比较复杂，需要处理线程之间的竞争，资源共享
- Reactor 对象在处理所有事件的监听和响应都是单线程的，在高并发场景容易出现性能瓶颈

优点：
- 可以充分利用CPU资源

#### 主从Reactor多线程
![主从Reactor线程](/iblog/posts/annex/images/essays/主从Reactor线程.png)

Reactor 主线程可以对应多个 Reactor 子线程，即 MainRecator 可以关联多个 SubReactor，从而解决了Reactor 在单线程中运行，高并发场景下容易成为性能瓶颈。
步骤：
- Reactor 主线程 MainReactor 对象通过 select 监听连接事件，收到事件后，通过 Acceptor 处理连接事件
- 当 Acceptor 处理连接事件后，MainReactor 将连接分配给 SubReactor
- SubReactor 将连接加入到连接队列进行监听，并创建 handler 进行各种事件处理
- 当有新事件发生时，SubReactor 就会调用对应的 handler 处理
- handler 只负责响应事件，不做具体的业务处理，通过 read 读取完后，分发给下面的 worker线程池中某个线程处理
- worker 线程负责处理具体业务，处理完成后会将具体的结果返回给 handler
- handler 线程通过send方法返回给客户端

优点：
- 父线程与子线程的数据交互简单，Reactor 主线程只需要把新连接传给子线程，子线程无需返回数据
- 父线程与子线程的数据交互简单职责明确，父线程只需要接收新连接，子线程完成后续的业务处理

缺点：
- 编程复杂度较高

这种模型在许多项目中广泛使用，包括 Nginx 主从 Reactor 多进程模型，Memcached 主从多线程，Netty 主从多线程模型的支持。


### Netty 模型
![Netty模型](/iblog/posts/annex/images/essays/Netty模型.png)

![netty结构](/iblog/posts/annex/images/essays/netty结构.png)

- Netty 抽象出两组线程池 `BossGroup` 专门负责接收客户端的连接，`WorkerGroup` 专门负责网络的读写；`BossGroup` 和 `WorkerGroup` 类型都是 `NioEventLoopGroup`
- `NioEventLoopGroup` 相当于一个事件循环组，这个组中含有多个事件循环，每一个事件循环是 `NioEventLoop`，每个 `NioEventLoop` 都有一个 `Selector`，用于监听绑定在其上的 `socket` 的网络通讯
- `NioEventLoopGroup` 可指定多个 `NioEventLoop`
- 每个 `BossNioEventLoop` 循环执行的步骤
    - 轮询 accept 事件
    - 处理 `accept` 事件，与 client 建立连接，生成 `NioSocketChannel`，并将其注册到某个 `workerNioEventLoop` 上的 `Selector`
    - 处理任务队列的任务，即 `runAllTasks`
- 每个 `WorkerNioEventLoop` 循环执行的步骤
    - 轮询 `read，write` 事件
    - 处理IO事件，即 `read，write` 事件，在对应 `NioSocketChannel` 处理
    - 处理任务队列的任务，即 `runAllTasks`
- 每个 `WorkerNioEventLoop` 处理业务时，会使用 `pipeline`（管道），`pipeline` 中包含了 `channel`(通道)，即通过 `pipeline` 可以获取到对应通道，管道中维护了很多的处理器


## 使用Netty
1.[导入依赖](https://netty.io/downloads.html)
```
<dependency>
    <groupId>io.netty</groupId>
    <artifactId>netty-all</artifactId>
    <version>4.1.36.Final</version>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

2.服务器端代码演示
```
/**
 * netty 服务端测试
 */
public class MainTestServer {
    public static void main(String[] args) {
        // 启动器， 负责组装netty组件 启动服务器
        new ServerBootstrap()
                // BossEventLoop WorkEventLoop 每个 EventLoop 就是 一个选择器 + 一个线程
                .group(new NioEventLoopGroup())
                // 选择服务器 ServerSocketChannel 具体实现
                .channel(NioServerSocketChannel.class)
                // 决定了 workEventLoop 能做那些操作
                .childHandler(
                        // 建立连接后会被调用； 作用： 初始化 + 添加其他的 handler
                        new ChannelInitializer<NioSocketChannel>() {
                    // 当客户端请求发过来时 才会调用
                    @Override 
                    protected void initChannel(NioSocketChannel channel) throws Exception {
                        channel.pipeline().addLast(new StringDecoder());
                        // 自定义handler 
                        channel.pipeline().addLast(new ChannelInboundHandlerAdapter() {
                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                System.out.println("服务器端接收数据：" + msg);
                            }
                        });
                    }
                })
                // 绑定监听端口
                .bind(8090);
    }
}
```

3.客户端代码演示
```
/**
 * netty 客户端测试
 */
public class MainTestClient {
    public static void main(String[] args) throws InterruptedException {
        new Bootstrap()
                .group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<NioSocketChannel>() {
                    // 初始化 在与服务器建立链接的时候 调用
                    @Override
                    protected void initChannel(NioSocketChannel channel) throws Exception {
                        // 添加编码器 只有当向服务端发送请求数据时 才会执行
                        channel.pipeline().addLast(new StringEncoder());
                    }
                })
                .connect(new InetSocketAddress("127.0.0.1", 8090))
                //阻塞方法，直到与服务器端连接建立
                .sync()
                .channel()
                // 向服务器端发送数据
                .writeAndFlush("hello word");
    }
}
```
### 任务队列
- 用户程序自定义的普通任务
- 用户自定义定时任务
- 非当前 Reactor 线程调用 Channel 的各种方法 例如在推送系统的业务线程里面，根据用户的标识，找到对应的 Channel 引用，然后调用 Write 类方法向该用户推送消息，就会进入到这种场景。
  最终的 Write 会提交到任务队列中后被异步消费

客户端
```
/**
 * netty 客户端测试
 */
public class MainTestClient {
    public static void main(String[] args) throws InterruptedException {
        new Bootstrap()
                .group(new NioEventLoopGroup())
                .channel(NioSocketChannel.class)
                .handler(new ChannelInitializer<NioSocketChannel>() {

                    // 初始化 在与服务器建立链接的时候 调用
                    @Override
                    protected void initChannel(NioSocketChannel channel) throws Exception {
                        // 添加编码器 只有当向服务端发送请求数据时 才会执行
                        channel.pipeline().addLast("decoder", new StringDecoder());
                        channel.pipeline().addLast("encoder", new StringEncoder());
                        channel.pipeline().addLast(new ChannelInboundHandlerAdapter(){
                            @Override
                            public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                System.out.println("服务端响应数据：" + msg);
                            }

                            @Override
                            public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                System.out.println("客户端Active .....");
                            }

                            /**
                             * 客户端异常时触发
                             */
                            @Override
                            public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
                                cause.printStackTrace();
                                ctx.close();
                            }

                        });
                    }

                })
                .connect(new InetSocketAddress("127.0.0.1", 8090))
                //阻塞方法，直到与服务器端连接建立
                .sync()
                .channel()
                // 向服务器端发送数据
                .writeAndFlush("hello word");
    }
}
```
服务端
```
/**
 * netty 服务端测试
 */
public class MainTestServer {
    public static void main(String[] args) {
        //new 一个主线程组
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        //new 一个工作线程组
        EventLoopGroup workGroup = new NioEventLoopGroup(200);
        // 启动器， 负责组装netty组件 启动服务器
        try {
            ServerBootstrap serverBootstrap = new ServerBootstrap()
                    // BossEventLoop WorkEventLoop 每个 EventLoop 就是 一个选择器 + 一个线程
                    .group(bossGroup, workGroup)
                    // 选择服务器 ServerSocketChannel 具体实现
                    .channel(NioServerSocketChannel.class)
                    //设置队列大小
                    .option(ChannelOption.SO_BACKLOG, 1024)
                    // 两小时内没有数据的通信时,TCP会自动发送一个活动探测数据报文
                    .childOption(ChannelOption.SO_KEEPALIVE, true)
                    // 决定了 workEventLoop 能做那些操作
                    .childHandler(
                            // 建立连接后会被调用； 作用： 初始化 + 添加其他的 handler
                            new ChannelInitializer<NioSocketChannel>() {
                                // 当客户端请求发过来时 才会调用
                                @Override
                                protected void initChannel(NioSocketChannel channel) throws Exception {
                                    channel.pipeline().addLast("decoder", new StringDecoder(CharsetUtil.UTF_8));
                                    channel.pipeline().addLast("encoder", new StringEncoder(CharsetUtil.UTF_8));
                                    // 自定义handler
                                    channel.pipeline().addLast(new ChannelInboundHandlerAdapter() {

                                        /**
                                         * 客户端连接会触发
                                         */
                                        @Override
                                        public void channelActive(ChannelHandlerContext ctx) throws Exception {
                                            System.out.println("服务端 Active......");
                                        }

                                        /**
                                         * 客户端发消息会触发
                                         */
                                        @Override
                                        public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
                                            System.out.println("服务器收到消息: " + msg.toString());
                                            // 比如这里我们有一个非常耗时长的业务-> 应该一步执行 -> 提交该对应的channel
                                            // 将任务放在 taskQueue 中
                                            ctx.channel().eventLoop().execute(() -> {
                                                try {
                                                    Thread.sleep(10 * 1000);
                                                    ctx.writeAndFlush("业务1处理完成");
                                                } catch (InterruptedException e) {
                                                    e.printStackTrace();
                                                }
                                            });
                                            // 放在TaskQueue 中的任务是由一个线程来进行处理的 所以执行完上一个任务才会执行下一个任务 时间是累加的
                                            ctx.channel().eventLoop().execute(() -> {
                                                try {
                                                    Thread.sleep(20 * 1000);
                                                    ctx.writeAndFlush("业务2处理完成");
                                                } catch (InterruptedException e) {
                                                    e.printStackTrace();
                                                }
                                            });
                                             // 用户自定义定时任务 -》 该任务是提交到 scheduleTaskQueue中
                                        
                                            ctx.channel().eventLoop().schedule(new Runnable() {
                                                @Override
                                                public void run() {
                                    
                                                    try {
                                                        Thread.sleep(5 * 1000);
                                                        ctx.writeAndFlush(Unpooled.copiedBuffer("hello, 客户端~(>^ω^<)喵4", CharsetUtil.UTF_8));
                                                        System.out.println("channel code=" + ctx.channel().hashCode());
                                                    } catch (Exception ex) {
                                                        System.out.println("发生异常" + ex.getMessage());
                                                    }
                                                }
                                            }, 5, TimeUnit.SECONDS);
                                        }

                                        /**
                                         * 给客户端发送消息
                                         */
                                        @Override
                                        public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
                                            ctx.writeAndFlush("over");
                                        }

                                        /**
                                         * 发生异常触发
                                         */
                                        @Override
                                        public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
                                            cause.printStackTrace();
                                            ctx.close();
                                        }


                                    });
                                }
                            });
                    // 绑定监听端口
            ChannelFuture future = serverBootstrap.bind(8090).sync();
            // 对关闭通道进行监听
            future.channel().closeFuture().sync();
        } catch (InterruptedException e) {

        } finally {
            //关闭主线程组
            bossGroup.shutdownGracefully();
            //关闭工作线程组
            workGroup.shutdownGracefully();
        }
    }
}
```
### 异步模型
异步的概念和同步相对。当一个异步过程调用发出后，调用者不能立刻得到结果。实际处理这个调用的组件在完成后，通过状态、通知和回调来通知调用者。

`Netty` 中的IO操作是异步的，包括 `Bind、Write、Connect` 等操作会简单的返回一个 `ChannelFuture`。 调用者并不能立刻获得结果，而是通过 `Future-Listener` 机制，用户可以方便的主动获取或者通过通知机制获得IO操作结果。

当 `Future` 对象刚刚创建时，处于非完成状态，调用者可以通过返回的 `ChannelFuture` 来获取操作执行的状态，注册监听函数来执行完成后的操作。

常见有如下操作：
- 通过 `isDone` 方法来判断当前操作是否完成；
- 通过 `isSuccess` 方法来判断已完成的当前操作是否成功；
- 通过 `getCause` 方法来获取已完成的当前操作失败的原因；
- 通过 `isCancelled` 方法来判断已完成的当前操作是否被取消；
- 通过 `addListener` 方法来注册监听器，当操作已完成（isDone方法返回完成），将会通知指定的监听器；如果 `Future` 对象已完成，则通知指定的监听器

```
//绑定一个端口并且同步,生成了一个ChannelFuture对象
//启动服务器(并绑定端口)
ChannelFuture cf = bootstrap.bind(6668).sync();
//给cf注册监听器，监控我们关心的事件
cf.addListener(new ChannelFutureListener() {
   @Override
   public void operationComplete (ChannelFuture future) throws Exception {
      if (cf.isSuccess()) {
         System.out.println("监听端口6668成功");
      } else {
         System.out.println("监听端口6668失败");
      }
   }
});

```
### Netty搭建Http服务
服务端
```
public class MainTestServer {
    public static void main(String[] args) {
        //new 一个主线程组
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        //new 一个工作线程组
        EventLoopGroup workGroup = new NioEventLoopGroup(200);
        // 启动器， 负责组装netty组件 启动服务器
        try {
            ServerBootstrap serverBootstrap = new ServerBootstrap()
                    // BossEventLoop WorkEventLoop 每个 EventLoop 就是 一个选择器 + 一个线程
                    .group(bossGroup, workGroup)
                    // 选择服务器 ServerSocketChannel 具体实现
                    .channel(NioServerSocketChannel.class)
                    //设置队列大小
                    .option(ChannelOption.SO_BACKLOG, 1024)
                    // 两小时内没有数据的通信时,TCP会自动发送一个活动探测数据报文
                    .childOption(ChannelOption.SO_KEEPALIVE, true)
                    // 决定了 workEventLoop 能做那些操作
                    .childHandler(
                            // 建立连接后会被调用； 作用： 初始化 + 添加其他的 handler
                            new ChannelInitializer<NioSocketChannel>() {
                                // 当客户端请求发过来时 才会调用
                                @Override
                                protected void initChannel(NioSocketChannel channel) throws Exception {
                                    channel.pipeline().addLast("MyHttpServerCodec", new HttpServerCodec());
                                    // 自定义handler
                                    channel.pipeline().addLast(new SimpleChannelInboundHandler<HttpObject>() {
                                        @Override
                                        protected void channelRead0(ChannelHandlerContext ctx, HttpObject msg) throws Exception {
                                            System.out.println("对应的channel=" + ctx.channel() + " pipeline=" + ctx.pipeline() + " 通过pipeline获取channel" + ctx.pipeline().channel());

                                            System.out.println("当前ctx的handler=" + ctx.handler());

                                            //判断 msg 是不是 httprequest请求
                                            if (msg instanceof HttpRequest) {

                                                System.out.println("ctx 类型=" + ctx.getClass());

                                                System.out.println("pipeline hashcode" + ctx.pipeline().hashCode() + " TestHttpServerHandler hash=" + this.hashCode());

                                                System.out.println("msg 类型=" + msg.getClass());
                                                System.out.println("客户端地址" + ctx.channel().remoteAddress());

                                                //获取到
                                                HttpRequest httpRequest = (HttpRequest) msg;
                                                //获取uri, 过滤指定的资源
                                                URI uri = new URI(httpRequest.uri());
                                                if ("/favicon.ico".equals(uri.getPath())) {
                                                    System.out.println("请求了 favicon.ico, 不做响应");
                                                    return;
                                                }
                                                //回复信息给浏览器 [http协议]

                                                ByteBuf content = Unpooled.copiedBuffer("hello, 我是服务器", CharsetUtil.UTF_8);

                                                //构造一个http的相应，即 httpresponse
                                                FullHttpResponse response = new DefaultFullHttpResponse(HttpVersion.HTTP_1_1, HttpResponseStatus.OK, content);

                                                response.headers().set(HttpHeaderNames.CONTENT_TYPE, "text/plain");
                                                response.headers().set(HttpHeaderNames.CONTENT_LENGTH, content.readableBytes());

                                                //将构建好 response返回
                                                ctx.writeAndFlush(response);
                                            }
                                        }
                                    });
                                }
                            });
                    // 绑定监听端口
            ChannelFuture future = serverBootstrap.bind(8090).sync();
            future.addListener( future1 -> {
                if (future.isSuccess()) {
                    System.out.println("监听端口8090成功");
                }else{
                    System.out.println("监听端口8090失败");
                }
            });
            // 对关闭通道进行监听
            future.channel().closeFuture().sync();
        } catch (InterruptedException e) {

        } finally {
            //关闭主线程组
            bossGroup.shutdownGracefully();
            //关闭工作线程组
            workGroup.shutdownGracefully();
        }
    }
}
```
### TCP粘包、拆包及解决方案
TCP 是面向连接的，面向流的，提供高可靠性服务。收发两端（客户端和服务器端）都要有一一成对的 socket，因此，发送端为了将多个发给接收端的包，更有效的发给对方，使用了优化方法（Nagle 算法），将多次间隔较小且数据量小的数据，合并成一个大的数据块，然后进行封包。这样做虽然提高了效率，但是接收端就难于分辨出完整的数据包了，由于 TCP 无消息保护边界,需要在接收端处理消息边界问题，也就是我们所说的粘包、拆包问题。

拆包和粘包是在socket编程中经常出现的情况，在socket通讯过程中，如果通讯的一端一次性连续发送多条数据包，tcp协议会将多个数据包打包成一个tcp报文发送出去，这就是所谓的粘包。而如果通讯的一端发送的数据包超过一次tcp报文所能传输的最大值时，就会将一个数据包拆成多个最大tcp长度的tcp报文分开传输，这就叫做拆包。

对于粘包的情况，要对粘在一起的包进行拆包。对于拆包的情况，要对被拆开的包进行粘包，即将一个被拆开的完整应用包再组合成一个完整包。比较通用的做法就是每次发送一个应用数据包前在前面加上四个字节的包长度值，指明这个应用包的真实长度。

使用netty解决拆包、粘包问题代码示例：

客户端代码
````
@SpringBootApplication
public class NettyClientApplication {

    public static void main(String[] args) {
        SpringApplication.run(NettyClientApplication.class, args);
    }
}

@Slf4j
@Component
public class StartNetty implements CommandLineRunner {

    private final NettyClient nettyClient;

    public StartNetty(NettyClient nettyClient) {
        this.nettyClient = nettyClient;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("启动netty客户端 ...");
        nettyClient.start();
    }
}

@Slf4j
@Component
public class NettyClient {
    /**
     * Netty客户端启动
     */
    public void start() {
        EventLoopGroup group = new NioEventLoopGroup();
        Bootstrap bootstrap = new Bootstrap()
                .group(group)
                //该参数的作用就是禁止使用Nagle算法，使用于小数据即时传输
                .option(ChannelOption.TCP_NODELAY, true)
                .channel(NioSocketChannel.class)
                .handler(new NettyClientInitializer());
        try {
            ChannelFuture future = bootstrap.connect("127.0.0.1", 9000).sync();
            log.info("客户端成功....");
            //发送消息
            future.channel().writeAndFlush("客户端请求数据");
            // 等待连接被关闭
            future.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            group.shutdownGracefully();
        }
    }
}



public class NettyClientInitializer extends ChannelInitializer<SocketChannel> {
    @Override
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        socketChannel.pipeline().addLast("decoder", new MyMessageDecoder());
        socketChannel.pipeline().addLast("encoder", new MyMessageEncoder());
        socketChannel.pipeline().addLast(new NettyClientHandler());
    }
}


@Slf4j
public class NettyClientHandler extends ChannelInboundHandlerAdapter {
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        log.info("客户端Active .....");
        // 模拟tcp粘包
        for (int i = 0; i < 5; i++) {
            String mes = "今天天气冷，吃火锅";
            byte[] content = mes.getBytes(Charset.forName("utf-8"));
            int length = mes.getBytes(Charset.forName("utf-8")).length;

            //  解决tcp粘包问题
            MessageProtocol messageProtocol = new MessageProtocol();
            messageProtocol.setLen(length);
            messageProtocol.setContent(content);
            ctx.writeAndFlush(messageProtocol);
        }
    }

    /**
     * 收到服务端的消息
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        log.info("客户端收到消息: {}", msg.toString());
        MessageProtocol mp = (MessageProtocol)msg;
        int len = mp.getLen();
        byte[] content = mp.getContent();

        System.out.println("客户端接收到消息如下");
        System.out.println("长度=" + len);
        System.out.println("内容=" + new String(content, StandardCharsets.UTF_8));


    }

    /**
     * 客户端异常时触发
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
}
````

服务端代码
````
@SpringBootApplication
public class NettyServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(NettyServerApplication.class, args);
    }
}

@Slf4j
@Component
public class StartNetty implements CommandLineRunner {

    private final NettyServer nettyServer;

    public StartNetty(NettyServer nettyServer) {
        this.nettyServer = nettyServer;
    }

    /**
     * 启动netty 让netty随着项目一起启动
     */
    @Override
    public void run(String... args) throws Exception {
        log.info("netty 服务端启动 ...");
        nettyServer.start(new InetSocketAddress("127.0.0.1", 9000));
    }
}

@Slf4j
@Component
public class NettyServer  {

    /**
     * Netty服务启动
     */
    public void start(InetSocketAddress socketAddress) {
        //new 一个主线程组
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        //new 一个工作线程组
        EventLoopGroup workGroup = new NioEventLoopGroup(200);

        ServerBootstrap bootstrap = new ServerBootstrap()
                .group(bossGroup, workGroup)
                .channel(NioServerSocketChannel.class)
                .childHandler(new ServerChannelInitializer())
                .localAddress(socketAddress)
                //设置队列大小
                .option(ChannelOption.SO_BACKLOG, 1024)
                // 两小时内没有数据的通信时,TCP会自动发送一个活动探测数据报文
                .childOption(ChannelOption.SO_KEEPALIVE, true);
        //绑定端口,开始接收进来的连接
        try {
            // 绑定端口 生成一个ChannelFuture 对象 启动服务器
            ChannelFuture future = bootstrap.bind(socketAddress).sync();
            log.info("服务器启动开始监听端口: {}", socketAddress.getPort());
            // 对关闭通道进行监听
            future.channel().closeFuture().sync();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            //关闭主线程组
            bossGroup.shutdownGracefully();
            //关闭工作线程组
            workGroup.shutdownGracefully();
        }
    }
}

public class ServerChannelInitializer extends ChannelInitializer<SocketChannel> {

    @Override
    protected void initChannel(SocketChannel socketChannel) throws Exception {
        socketChannel.pipeline().addLast("decoder", new MyMessageDecoder());
        socketChannel.pipeline().addLast("encoder", new MyMessageEncoder());
        socketChannel.pipeline().addLast(new NettyServerHandler());
    }
}

@Slf4j
public class NettyServerHandler extends ChannelInboundHandlerAdapter {
    /**
     * 客户端连接会触发
     */
    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        log.info("服务端 Active......");
    }

    /**
     * 客户端发消息会触发
     */
    @Override
    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        log.info("服务器收到消息: {}", msg.toString());
        MessageProtocol mp = (MessageProtocol)msg;
        int len = mp.getLen();
        byte[] content = mp.getContent();

        System.out.println();
        System.out.println();
        System.out.println();
        System.out.println("服务器接收到信息如下");
        System.out.println("长度=" + len);
        System.out.println("内容=" + new String(content, Charset.forName("utf-8")));

        //回复消息
        String responseContent = UUID.randomUUID().toString();
        int responseLen = responseContent.getBytes("utf-8").length;
        byte[] responseContent2 = responseContent.getBytes("utf-8");
        //构建一个协议包
        MessageProtocol messageProtocol = new MessageProtocol();
        messageProtocol.setLen(responseLen);
        messageProtocol.setContent(responseContent2);

        ctx.writeAndFlush(messageProtocol);
    }

    /**
     * 给客户端发送消息
     */
    @Override
    public void channelReadComplete(ChannelHandlerContext ctx) throws Exception {
        ctx.writeAndFlush("hello client");
    }

    /**
     * 发生异常触发
     */
    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) throws Exception {
        cause.printStackTrace();
        ctx.close();
    }
}
````

公共代码部分
````
public class MessageProtocol {

    private int len;

    private byte[] content;

    public int getLen() {
        return len;
    }

    public void setLen(int len) {
        this.len = len;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }

    @Override
    public String toString() {
        return "MessageProtocol{" +
                "len=" + len +
                ", content=" + new String(content) +
                '}';
    }
}

public class MyMessageDecoder extends ReplayingDecoder<Void> {

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        //需要将得到二进制字节码-> MessageProtocol 数据包(对象)
        int length = in.readInt();
        byte[] content = new byte[length];
        in.readBytes(content);

        //封装成 MessageProtocol 对象，放入 out， 传递下一个handler业务处理
        MessageProtocol messageProtocol = new MessageProtocol();
        messageProtocol.setLen(length);
        messageProtocol.setContent(content);
        out.add(messageProtocol);
    }
}

public class MyMessageEncoder extends MessageToByteEncoder<MessageProtocol> {

    @Override
    protected void encode(ChannelHandlerContext ctx, MessageProtocol msg, ByteBuf out) throws Exception {
        System.out.println("MyMessageEncoder encode 方法被调用");
        out.writeInt(msg.getLen());
        out.writeBytes(msg.getContent());
    }
}
````

## Netty零拷贝

## mpsc无锁编程

## Netty对象池

## Netty长连接、心跳机制

## 参考文章
- https://dongzl.github.io/netty-handbook/#/
