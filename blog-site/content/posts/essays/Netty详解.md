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
[单Reactor多线程](/iblog/posts/annex/images/essays/单Reactor多线程.png)

工作原理：
- `Reactor`对象通过对`select`监听请求事件，收到请求事件后交给`Dispatch`进行转发；
- 如果是建立连接请求，则通过`accept`处理连接请求，然后创建一个`handler`对象处理完成连接后的事件；
- 如果不是建立连接请求，则直接交给`handler`对象；
- `handler`只负责响应事件，不做具体的业务处理，通过`read`读取完后，分发给下面的 worker线程池中某个线程处理；
- `worker` 线程负责处理具体业务，处理完成后会将具体的结果返回给`handler`；
- `handler`线程通过`send`方法返回给客户端；

单`Reactor`多线程模型通过引入多个工作线程来处理IO操作，能够更好地利用多核CPU的资源，提升了系统的并发处理能力和整体性能。
但是`Reactor`对象在处理所有事件的监听和响应都是单线程的，在高并发场景容易出现性能瓶颈。

#### 主从Reactor多线程
`Reactor`主线程可以对应多个`Reactor`子线程，即`MainRecator`可以关联多个`SubReactor`，从而解决了`Reactor` 在单线程中运行，高并发场景下容易成为性能瓶颈。

![主从Reactor线程](/iblog/posts/annex/images/essays/主从Reactor线程.png)

工作原理：
- `Reactor`主线程`MainReactor`对象通过`select`监听连接事件，收到事件后，通过`Acceptor`处理连接事件；
- 当`Acceptor`处理连接事件后，`MainReactor` 将连接分配给`SubReactor`；
- `SubReactor`将连接加入到连接队列进行监听，并创建`handler`进行各种事件处理；
- 当有新事件发生时，`SubReactor`就会调用对应的`handler`处理；
- `handler`只负责响应事件，不做具体的业务处理，通过`read`读取完后，分发给下面的`worker`线程池中某个线程处理；
- `worker`线程负责处理具体业务，处理完成后会将具体的结果返回给`handler`；
- `handler`线程通过`send`方法返回给客户端；

主从`Reactor`多线程模型在`Reactor`架构中进一步优化了性能和扩展性。在这种模型中，主`Reactor`线程负责监听和接收所有IO事件，而从`Reactor`线程池则处理具体的事件和业务逻辑。
通过将事件的监听和处理分离，主`Reactor`线程可以专注于高效地接受新的连接和事件，而从`Reactor`线程池则可以并行处理实际的IO操作。这种设计充分利用了多核CPU的资源，显著提升了系统的并发处理能力和响应速度。

这种模型在许多项目中广泛使用，包括 `Nginx`主从`Reactor` 多进程模型，`Memcached`主从多线程，`Netty`主从多线程模型的支持。
尽管该模型的实现复杂度增加，但它在处理大量并发请求时提供了卓越的性能和扩展性。

### Netty模型
`Netty`的线程模型设计旨在高效处理大量并发连接，并最大限度地利用CPU资源。其核心思想是将IO操作和业务逻辑处理分开，通过线程池和事件循环机制实现异步处理。

![Netty模型](/iblog/posts/annex/images/essays/Netty模型.png)

Netty的线程模型设计高效地支持大规模并发网络通信。核心包括两个主要类型的线程：
- 主事件循环线程（`Boss Thread`）：主要负责监听和接受新的网络连接。`Netty`中的`ServerBootstrap`配置了一个或多个主事件循环线程，这些线程负责绑定网络端口并接收客户端的连接请求。当新的连接到达时，主线程会将这些连接注册到工作事件循环线程上进行进一步处理。
- 工作事件循环线程（`Worker Thread`）：负责处理已经建立连接的IO操作，包括读取和写入数据。每个连接的IO操作由工作线程负责处理，这些线程通常以线程池的形式存在，可以并行处理多个连接的IO事件。`Netty`允许为工作线程配置多个线程组，从而能够高效地处理大量并发请求。

![netty结构](/iblog/posts/annex/images/essays/netty结构.png)

工作原理：
- `Netty`抽象出两组线程池 `BossGroup`专门负责接收客户端的连接，`WorkerGroup`专门负责网络的读写；`BossGroup`和`WorkerGroup`类型都是`NioEventLoopGroup`；
- `NioEventLoopGroup`相当于一个事件循环组，这个组中含有多个事件循环，每一个事件循环是`NioEventLoop`，每个`NioEventLoop`都有一个`Selector`，用于监听绑定在其上的`socket`的网络通讯；
- `NioEventLoopGroup`可指定多个`NioEventLoop`；
- 每个`BossNioEventLoop`循环执行的步骤：
  1. 轮询`accept`事件；
  2. 处理`accept`事件，与`client`建立连接，生成`NioSocketChannel`，并将其注册到某个`workerNioEventLoop`上的`Selector`；
  3. 处理任务队列的任务，即`runAllTasks`；
- 每个`WorkerNioEventLoop`循环执行的步骤：
  1. 轮询`read`，`write`事件；
  2. 处理IO事件，即`read`，`write`事件，在对应`NioSocketChannel`处理；
  3. 处理任务队列的任务，即`runAllTasks`；
- 每个`WorkerNioEventLoop`处理业务时，会使用`pipeline`，`pipeline`中包含了`channel`，即通过`pipeline`可以获取到对应通道，管道中维护了很多的处理器；

## 使用Netty
`Netty`是一个高性能的网络通信框架，广泛应用于需要高并发和高吞吐量的场景。它适用于构建各种类型的网络服务，包括但不限于高性能的`TCP`服务器、实时的`WebSocket`应用、轻量级的`UDP`服务和高效的HTTP/HTTPS 服务。
`Netty`的异步非阻塞IO模型使其特别适合处理大量并发连接和高负载情况，广泛用于金融系统、在线游戏、实时聊天、流媒体传输、分布式系统和微服务架构等领域。凭借其灵活的架构和高效的性能，`Netty`能够满足对延迟敏感的应用需求，并且支持复杂的协议和自定义业务逻辑。

### 搭建TCP服务
1. 在项目的构建工具中添加`Netty`依赖。
    ```xml
    <dependency>
        <groupId>io.netty</groupId>
        <artifactId>netty-all</artifactId>
        <version>4.1.36.Final</version>
    </dependency>
    ```
2. 使用`ServerBootstrap`类来引导服务器端。配置主要包括设置主事件循环线程和工作事件循环线程的线程池，以及处理各种连接和IO事件的处理器。
    ```java
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
3. 使用`Bootstrap`类来引导客户端，配置包括事件循环线程池、处理器等。
    ```java
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
4. 启动服务器端应用和客户端应用，进行网络通信测试。

### 搭建HTTP服务
1. 在项目的构建工具中添加`Netty`依赖。
    ```xml
    <dependency>
        <groupId>io.netty</groupId>
        <artifactId>netty-all</artifactId>
        <version>4.1.36.Final</version>
    </dependency>
    ```
2. 创建一个主类用于启动`Netty`服务器。在此类中，配置`ServerBootstrap`来设置服务器的基本属性，并绑定端口以开始监听请求。
    ```java
    public class NettyHttpServer {
        private final int port;
    
        public NettyHttpServer(int port) {
            this.port = port;
        }
    
        public void start() throws Exception {
            // Event loop groups for handling I/O operations
            final NioEventLoopGroup bossGroup = new NioEventLoopGroup();
            final NioEventLoopGroup workerGroup = new NioEventLoopGroup();
            try {
                ServerBootstrap bootstrap = new ServerBootstrap();
                bootstrap.group(bossGroup, workerGroup)
                         .channel(NioServerSocketChannel.class)
                         .childHandler(new ChannelInitializer<SocketChannel>() {
                             @Override
                             protected void initChannel(SocketChannel ch) throws Exception {
                                 ch.pipeline().addLast(new HttpServerCodec());
                                 ch.pipeline().addLast(new HttpObjectAggregator(65536));
                                 ch.pipeline().addLast(new HttpContentCompressor());
                                 ch.pipeline().addLast(new HttpContentDecompressor());
                                 ch.pipeline().addLast(new SimpleHttpHandler());
                             }
                         })
                         .option(ChannelOption.SO_BACKLOG, 128)
                         .childOption(ChannelOption.SO_KEEPALIVE, true);
    
                // Bind and start to accept incoming connections
                ChannelFuture f = bootstrap.bind(port).sync();
                f.channel().closeFuture().sync();
            } finally {
                // Shut down all event loops to terminate all threads
                bossGroup.shutdownGracefully();
                workerGroup.shutdownGracefully();
            }
        }
    
        public static void main(String[] args) throws Exception {
            new NettyHttpServer(8080).start();
        }
    }
    ```
3. 实现一个`SimpleHttpHandler`处理 HTTP 请求和响应。这个处理器将负责处理客户端的请求并生成响应。
    ```java
    public class SimpleHttpHandler extends SimpleChannelInboundHandler<FullHttpRequest> {
        @Override
        protected void channelRead0(ChannelHandlerContext ctx, FullHttpRequest req) throws Exception {
            // Create a simple HTTP response
            String content = "Hello, Netty!";
            FullHttpResponse response = new DefaultFullHttpResponse(
                    HttpVersion.HTTP_1_1, HttpResponseStatus.OK,
                    Unpooled.copiedBuffer(content, CharsetUtil.UTF_8));
            response.headers().set(HttpHeaders.Names.CONTENT_TYPE, "text/plain; charset=UTF-8");
            response.headers().set(HttpHeaders.Names.CONTENT_LENGTH, response.content().readableBytes());
    
            // Write the response and close the connection
            ctx.writeAndFlush(response).addListener(ChannelFutureListener.CLOSE);
        }
    }
    ```
4. 启动服务器。服务器会监听在指定的端口，并可以处理到达该端口的HTTP请求。
    ```java
    public static void main(String[] args) throws Exception {
        new NettyHttpServer(8080).start();
    }
    ```
5. 启动服务器后，可以使用浏览器或工具访问`http://localhost:8080`来测试服务是否正常工作。如果一切正常，应该会看到 “Hello, Netty!” 的响应。
    ```text
    curl http://localhost:8080
    ```

### TCP粘包拆包
TCP是面向连接的，面向流的，提供高可靠性服务。客户端和服务器端都要有成对的`Socket`，因此发送端为了将多个发给接收端的包，更有效的发给对方，使用了优化算法，将多次间隔较小且数据量小的数据，合并成一个大的数据块，然后进行封包。
这样做虽然提高了效率，但是接收端就难于分辨出完整的数据包了，由于`TCP`无消息保护边界，需要在接收端处理消息边界问题，也就是我们所说的粘包、拆包问题。

粘包就是多个数据包被合并成一个包进行发送。在接收端，数据包无法区分它们的边界，导致接收到的数据流是混合的。
拆包是一个数据包被拆分成多个包进行发送。在接收端，可能会将多个数据包的内容错误地合并为一个包。

对于粘包的情况，要对粘在一起的包进行拆包。对于拆包的情况，要对被拆开的包进行粘包，即将一个被拆开的完整应用包再组合成一个完整包。
比较通用的做法就是每次发送一个应用数据包前在前面加上四个字节的包长度值，指明这个应用包的真实长度。

在每个数据包的开头添加一个固定长度的字段，用于指明整个包的长度。这样，接收端可以根据这个长度信息正确地拆分和组装数据包，从而解决粘包和拆包问题。数据包格式：
```text
| Length (4 bytes) | Data Body |
```

服务端代码
```java
public class TcpServer {
    public static void main(String[] args) {
        try {
            ServerSocketChannel serverSocketChannel = ServerSocketChannel.open();
            serverSocketChannel.bind(new java.net.InetSocketAddress(8080));
            System.out.println("服务器启动，监听端口8080");

            while (true) {
                SocketChannel clientChannel = serverSocketChannel.accept();
                System.out.println("客户端已连接");

                // 使用线程处理客户端请求
                new Thread(() -> handleClient(clientChannel)).start();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void handleClient(SocketChannel channel) {
        try {
            while (true) {
                byte[] data = receiveMessage(channel);
                if (data == null) break;  // 连接关闭
                
                String message = new String(data);
                System.out.println("收到消息: " + message);
                
                // 回显消息给客户端
                sendMessage(channel, data);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void sendMessage(SocketChannel channel, byte[] data) throws IOException {
        ByteBuffer lengthBuffer = ByteBuffer.allocate(4);
        lengthBuffer.putInt(data.length + 4);  // 包含长度字段的总长度
        lengthBuffer.flip();
        
        ByteBuffer dataBuffer = ByteBuffer.wrap(data);
        channel.write(lengthBuffer);
        channel.write(dataBuffer);
    }

    private static byte[] receiveMessage(SocketChannel channel) throws IOException {
        ByteBuffer lengthBuffer = ByteBuffer.allocate(4);
        int bytesRead = channel.read(lengthBuffer);
        if (bytesRead == -1) return null;  // 读取结束
        
        lengthBuffer.flip();
        int length = lengthBuffer.getInt();
        
        ByteBuffer dataBuffer = ByteBuffer.allocate(length - 4);
        channel.read(dataBuffer);
        dataBuffer.flip();
        
        byte[] data = new byte[dataBuffer.remaining()];
        dataBuffer.get(data);
        return data;
    }
}
```

客户端代码
```java
public class TcpClient {
    public static void main(String[] args) {
        try {
            SocketChannel socketChannel = SocketChannel.open(new java.net.InetSocketAddress("localhost", 8080));
            System.out.println("连接到服务器");

            // 发送消息到服务器
            String message = "Hello, Server!";
            sendMessage(socketChannel, message.getBytes());

            // 接收服务器的响应
            byte[] response = receiveMessage(socketChannel);
            System.out.println("收到来自服务器的消息: " + new String(response));

            socketChannel.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private static void sendMessage(SocketChannel channel, byte[] data) throws IOException {
        ByteBuffer lengthBuffer = ByteBuffer.allocate(4);
        lengthBuffer.putInt(data.length + 4);  // 包含长度字段的总长度
        lengthBuffer.flip();
        
        ByteBuffer dataBuffer = ByteBuffer.wrap(data);
        channel.write(lengthBuffer);
        channel.write(dataBuffer);
    }

    private static byte[] receiveMessage(SocketChannel channel) throws IOException {
        ByteBuffer lengthBuffer = ByteBuffer.allocate(4);
        channel.read(lengthBuffer);
        lengthBuffer.flip();
        int length = lengthBuffer.getInt();
        
        ByteBuffer dataBuffer = ByteBuffer.allocate(length - 4);
        channel.read(dataBuffer);
        dataBuffer.flip();
        
        byte[] data = new byte[dataBuffer.remaining()];
        dataBuffer.get(data);
        return data;
    }
}
```

## Netty零拷贝
零拷贝是计算机的一种技术，目的是减少数据在内存和存储设备之间的拷贝操作。这种技术优化了数据的传输过程，通过减少数据拷贝的次数来提高性能并降低资源消耗。

假设我们有一个大文件，需要将其内容发送到客户端。传统的文件传输流程如下：
1. 将文件内容从磁盘读取到内存中的缓冲区。这一步需要将文件的数据从磁盘拷贝到操作系统的内核空间，再拷贝到用户空间。
2. 将内存中的数据通过网络发送到客户端。这需要将数据从用户空间再次拷贝到内核空间，并通过网络传输。

在这个过程中，文件内容被拷贝了两次，这会消耗CPU和内存资源，特别是对于大文件和高频率传输的情况。

在零拷贝的优化下，减少了内存拷贝操作。以下是使用`Netty`的零拷贝进行文件传输的流程：
1. 创建直接内存缓冲区：`Netty`使用`DirectByteBuf`创建直接内存缓冲区，该缓冲区不在Java堆内存中，而是在操作系统的内存中。允许`Netty`直接操作内核空间的缓冲区。
2. 使用`FileRegion`直接传输文件内容：`Netty`提供了`FileRegion`接口和`DefaultFileRegion`实现，可以直接将文件内容从磁盘传输到网络通道。 
`FileRegion`可以通过`FileChannel`的`transferTo`方法实现数据的零拷贝传输，不需要将文件内容加载到内存中。

数据从直接内存缓冲区通过网络传输到客户端，避免了额外的内存拷贝操作。
```java
public class FileServerHandler extends SimpleChannelInboundHandler<String> {

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, String fileName) throws Exception {
        // 打开文件
        RandomAccessFile file = new RandomAccessFile(fileName, "r");
        FileChannel fileChannel = file.getChannel();
        
        // 创建 FileRegion，用于零拷贝文件传输
        FileRegion fileRegion = new DefaultFileRegion(fileChannel, 0, fileChannel.size());
        
        // 将文件内容写入到客户端
        ctx.writeAndFlush(fileRegion).addListener(ChannelFutureListener.CLOSE);
    }
}
```

`Netty`的零拷贝实现可以从两个方面来说：
1. `Netty`的零拷贝实现依赖于底层操作系统对零拷贝的支持。例如，在`UNIX`和`Linux`系统中，`Netty`使用`sendfile()`系统调用，将数据直接从内核缓冲区传输到套接字缓冲区，而不经过用户空间的拷贝。
2. 通过直接内存缓冲区`Netty`可以减少内存拷贝，提升数据传输效率。`FileRegion`和`DirectByteBuf`等类使得数据可以高效地在网络通道和文件系统之间传输。

`Netty`的零拷贝实现首先依赖于底层操作系统对零拷贝的支持。在`UNIX`和`Linux`系统中，这种支持主要体现在`sendfile()`方法的调用上。
当`Netty`调用`sendfile()`时，数据从文件系统的内核缓冲区直接被传输到网络接口的内核缓冲区。这个过程完全在内核空间完成，不涉及用户空间，从而减少了内存拷贝和 CPU 的使用。

`Netty`使用`DirectByteBuf`类来创建直接内存缓冲区。这些缓冲区分配在操作系统的直接内存中，而不是Java堆内存中。
数据在网络通道和直接内存缓冲区之间传输，避免了数据在堆内存和直接内存之间的拷贝。
```text
ByteBuf buffer = Unpooled.directBuffer(1024); // 创建一个直接内存缓冲区
buffer.writeBytes(data); // 直接写入数据到内存
```

## mpsc无锁编程
[//]: # (写到了这里)


## Netty对象池

## Netty长连接、心跳机制

## 参考文章
- https://dongzl.github.io/netty-handbook/#/
