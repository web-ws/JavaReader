原文链接：https://cloud.tencent.com/developer/article/1612348

# 1. 基础知识

## 1.1 为什么要用 Dubbo？

随着服务化的进一步发展，服务越来越多，服务之间的调用和依赖关系也越来越复杂，诞生了面向服务的架构体系(SOA)，也因此衍生出了一系列相应的技术，如对服务提供、服务调用、连接处理、通信协议、序列化方式、服务发现、服务路由、日志输出等行为进行封装的服务框架。就这样为分布式系统的服务治理框架就出现了，Dubbo 也就这样产生了。

## 1.2 Dubbox 是什么？

Dubbo 是一款高性能、轻量级的开源 RPC 框架，提供服务自动注册、自动发现等高效服务治理方案， 可以和 Spring 框架无缝集成。

`Dubbox是一个分布式服务框架`，前身是阿里旗下的开源项目Dubbo，后来阿里停止维护，当当网在Dubbo的基础上进行优化，并继续维护，为了与原来的Dubbo区分故将其改名为Dubbox，当当网在其原有的基础上实现了一些新功能REST（Representational State Transfer）风格，REST调用也是的Dubbox可以对当今特别流行的"微服务"架构提供支持。

`什么是REST风格`：资源表述性状态转移，简单来说，就是统一请求响应的规范，在我们进行CRUD（增删改查）操作的时候，使用对应的HTTP请求（GET、PUT、DELETE）一般博主常用这三种GET对应查，PUT对应增和改，DELETE顾名思义删。且统一json响应格式（规范），一般来说响应格式可以大概分为元数据和返回值，元数据表示操作是否成功，操作返回值消息等，而返回值则是执行方法放回的数据。ps:可根据业务的不同规范不同的响应格式。只需要保证各个"微服务"模块之间的请求和响应遵循这个规范就是REST风格编程

`Dubbox是一个远程服务调用的分布式框架，致力于提供高性能和透明化的RPC远程服务调用方案，一级SOA的服务治理`

## 1.3 Dubbo 的使用场景有哪些？

- 透明化的远程方法调用：就像调用本地方法一样调用远程方法，只需简单配置，没有任何API侵入。
- 软负载均衡及容错机制：可在内网替代 F5 等硬件负载均衡器，降低成本，减少单点。
- 服务自动注册与发现：不再需要写死服务提供方地址，注册中心基于接口名查询服务提供者的IP地址，并且能够平滑添加或删除服务提供者。

## 1.4 Dubbo 核心功能有哪些？

- Remoting：网络通信框架，提供对多种NIO框架抽象封装，包括“同步转异步”和“请求-响应”模式的信息交换方式。
- Cluster：服务框架，提供基于接口方法的透明远程过程调用，包括多协议支持，以及软负载均衡，失败容错，地址路由，动态配置等集群支持。
- Registry：服务注册，基于注册中心目录服务，使服务消费方能动态的查找服务提供方，使地址透明，使服务提供方可以平滑增加或减少机器。

# 2. 架构设计

## 2.1 Dubbo 核心组件有哪些？

<img src="https://i.loli.net/2021/09/29/CPkuJjL1UyFelwN.png" alt="image2"  />



- Provider：暴露服务的服务提供方
- Consumer：调用远程服务消费方
- Registry：服务注册与发现注册中心
- Monitor：监控中心和访问调用统计
- Container：服务运行容器

## 2.2 Dubbo 服务器注册与发现的流程？

`服务容器Container`负责启动，加载，运行服务提供者。

`服务提供者Provider`在启动时，向注册中心注册自己提供的服务。

`服务消费者Consumer`在启动时，向注册中心订阅自己所需的服务。

`注册中心Registry`返回服务提供者地址列表给消费者，如果有变更，注册中心将基于长连接推送变更数据给消费者。

`服务消费者Consumer`，从提供者地址列表中，基于软负载均衡算法，选一台提供者进行调用，如果调用失败，再选另一台调用。

`服务消费者Consumer和提供者Provider`，在内存中累计调用次数和调用时间，定时每分钟发送一次统计数据到监控中心Monitor。

`Dubbox默认请求时间是1000ms，请求三次，如果在业务加载时间较长时可以设置请求超时时间`

## 2.3 Dubbo 的整体架构设计有哪些分层?

![image1](https://i.loli.net/2021/09/29/xrWPj6LsuQHKeyo.png)

原理图如下：dubbox底层采用Netty进行网络通信

![截图](https://i.loli.net/2021/09/29/5HEnhOVCRr27Xxz.jpg)

Dubbox底层分为10层，每层作用如下

`接口服务层（Service）`：该层与业务逻辑相关，根据 provider 和 consumer 的业务设计对应的接口和实现

`配置层（Config）`：对外配置接口，以 ServiceConfig 和 ReferenceConfig 为中心

`服务代理层（Proxy）`：服务接口透明代理，生成服务的客户端 Stub 和 服务端的 Skeleton，以 ServiceProxy 为中心，扩展接口为 ProxyFactory

`服务注册层（Registry）`：封装服务地址的注册和发现，以服务 URL 为中心，扩展接口为 RegistryFactory、Registry、RegistryService

`路由层（Cluster）`：封装多个提供者的路由和负载均衡，并桥接注册中心，以Invoker 为中心，扩展接口为 Cluster、Directory、Router 和 LoadBlancce

`监控层（Monitor）`：RPC 调用次数和调用时间监控，以 Statistics 为中心，扩展接口为 MonitorFactory、Monitor 和 MonitorService

`远程调用层（Protocal）`：封装 RPC 调用，以 Invocation 和 Result 为中心，扩展接口为 Protocal、Invoker 和 Exporter

`信息交换层（Exchange）`：封装请求响应模式，同步转异步。以 Request 和Response 为中心，扩展接口为 Exchanger、ExchangeChannel、ExchangeClient 和 ExchangeServer

`网络传输层（Transport）`：抽象 mina 和 netty 为统一接口，以 Message 为中心，扩展接口为 Channel、Transporter、Client、Server 和 Codec

`数据序列化层（Serialize）`：可复用的一些工具，扩展接口为 Serialization、ObjectInput、ObjectOutput 和 ThreadPool

## 2.4 Dubbo Monitor 实现原理？

Consumer 端在发起调用之前会先走 filter 链；provider 端在接收到请求时也是先走 filter 链，然后才进行真正的业务逻辑处理。默认情况下，在 consumer 和 provider 的 filter 链中都会有 Monitorfilter。

1、MonitorFilter 向 DubboMonitor 发送数据

2、DubboMonitor 将数据进行聚合后（默认聚合 1min 的统计数据）暂存到ConcurrentMap<Statistics, AtomicReference> statisticsMap，然后使用一个含有 3 个线程（线程名字：DubboMonitorSendTimer）的线程池每隔 1min ，调用 SimpleMonitorService 遍历发送 statisticsMap 中的统计数据，每发送完毕一个，就重置当前的 Statistics 的 AtomicReference

3、SimpleMonitorService 将这些聚合数据塞入 BlockingQueue queue 中（队列大小为 100000）

4、SimpleMonitorService 使用一个后台线程（线程名为：DubboMonitorAsyncWriteLogThread）将 queue 中的数据写入文件（该线程以死循环的形式来写）

5、SimpleMonitorService 还会使用一个含有 1 个线程（线程名字：DubboMonitorTimer）的线程池每隔 5min ，将文件中的统计数据画成图表

# 3. 分布式框架

## 3.1 Dubbo 类似的分布式框架还有哪些？

比较著名的就是 Spring Cloud。

## 3.2 Dubbo 和 Spring Cloud 有什么关系？

Dubbo 是 SOA 时代的产物，它的关注点主要在于服务的调用，流量分发、流量监控和熔断。而 Spring Cloud 诞生于微服务架构时代，考虑的是微服务治理的方方面面，另外由于依托了 Spring、Spring Boot 的优势之上，两个框架在开始目标就不一致，Dubbo 定位服务治理、Spring Cloud 是打造一个生态。

## 3.3 Dubbo 和 Spring Cloud 有什么哪些区别？

Dubbo 底层是使用 Netty 这样的 NIO 框架，是基于 TCP 协议传输的，配合以 Hession 序列化完成 RPC 通信。

Spring Cloud 是基于 Http 协议 Rest 接口调用远程过程的通信，相对来说 Http 请求会有更大的报文，占的带宽也会更多。但是 REST 相比 RPC 更为灵活，服务提供方和调用方的依赖只依靠一纸契约，不存在代码级别的强依赖，这在强调快速演化的微服务环境下，显得更为合适，至于注重通信速度还是方便灵活性，具体情况具体考虑。

## 3.4 Dubbo 和 Dubbox 之间的区别？

Dubbox 是继 Dubbo 停止维护后，当当网基于 Dubbo 做的一个扩展项目，如加了服务可 Restful 调用，更新了开源组件等。

# 4. 注册中心

`Dubbo 有哪些注册中心？`

- Multicast 注册中心：Multicast 注册中心不需要任何中心节点，只要广播地址，就能进行服务注册和发现,基于网络中组播传输实现。
- Zookeeper 注册中心：基于分布式协调系统 Zookeeper 实现，采用 Zookeeper 的 watch 机制实现数据变更。
- Redis 注册中心：基于 Redis 实现，采用 key/map 存储，key 存储服务名和类型，map 中 key 存储服务 url，value 服务过期时间。基于 Redis 的发布/订阅模式通知数据变更。
- Simple 注册中心。

`推荐使用 Zookeeper 作为注册中心`

## 4.1 Dubbo 的注册中心集群挂掉，发布者和订阅者之间还能通信么？

可以通讯。启动 Dubbo 时，消费者会从 Zookeeper 拉取注册的生产者的地址，接口等数据，缓存在本地。每次调用时，按照本地存储的地址进行调用。

### 4.2 Dubbo如何保证服务的安全

通过令牌验证在注册中心控制权限，可以在配置文件中决定要不要下发令牌给消费者，可以防止消费者绕过注册中心访问提供者，另外注册中心可以灵活改变授权方式，而不需修改或升级提供者。

# 5. 集群

## 5.1 Dubbo集群负载均衡策略

- Random LoadBalance：随机选取提供者策略，有利于动态调整提供者权重。按照权重来负载均衡，权重越大分配流量越高。
- RoundRobin LoadBalance：轮循选取提供者策略，平均分布，但是性能较差的服务提供者存在请求累积的问题。
- LeastActive LoadBalance：最少活跃调用策略，解决让性能较差的服务提供者接收更少的请求。
- ConstantHash LoadBalance：一致性 Hash 策略，使相同参数请求总是发到同一提供者，一台机器宕机，可以基于虚拟节点，分摊至其他提供者，避免引起提供者的剧烈变动。

`默认为 Random 随机调用。`

## 5.2 Dubbo的集群容错机制

- Failover Cluster：失败自动切换，当出现失败，重试其它服务器。`通常用于读操作，但重试会带来更长延迟。`
- Failfast Cluster：快速失败，只发起一次调用，失败立即报错。`通常用于非幂等性的写操作，比如新增记录。`
- Failsafe Cluster：失败安全，出现异常时，直接忽略。`通常用于写入审计日志等操作。`
- Failback Cluster：失败自动恢复，后台记录失败请求，定时重发。`通常用于消息通知操作。`
- Forking Cluster：并行调用多个服务器，只要一个成功即返回。`通常用于实时性要求较高的读操作，但需要浪费更多服务资源。`可通过 forks=”2″ 来设置最大并行数。
- Broadcast Cluster：广播调用所有提供者，逐个调用，任意一台报错则报错 。`通常用于通知所有提供者更新缓存或日志等本地资源信息。`

`默认的容错方案是 Failover Cluster。`

```xml
<dubbo:reference cluster="failsafe" />
```

## 5.3 Dubbo的动态代理策略

默认使用javassist动态字节码生成，创建代理类但是可以通过spi扩展机制配置自己的动态代理策略

## 5.4 Dubbo的服务治理、降级、重试

### 5.4.1 服务治理

#### 5.4.1.1 调用链路自动生成

一个大型的分布式系统，或者说是用现在流行的微服务架构来说吧，`分布式系统由大量的服务组成`。那么这些服务之间互相是如何调用的？调用链路是啥？说实话，几乎到后面没人搞的清楚了，因为服务实在太多了，可能几百个甚至几千个服务。

那就需要基于 dubbo 做的分布式系统中，对各个服务之间的调用自动记录下来，然后自动将`各个服务之间的依赖关系和调用链路生成出来`，做成一张图，显示出来，大家才可以看到对吧。

![dubbo-service-invoke-road](https://doocs.gitee.io/advanced-java/docs/distributed-system/images/dubbo-service-invoke-road.png)

#### 5.4.1.2 服务访问压力以及时长统计

需要自动统计`各个接口和服务之间的调用次数以及访问延时`，而且要分成两个级别。

- 一个级别是接口粒度，就是每个服务的每个接口每天被调用多少次，TP50/TP90/TP99，三个档次的请求延时分别是多少；
- 第二个级别是从源头入口开始，一个完整的请求链路经过几十个服务之后，完成一次请求，每天全链路走多少次，全链路请求延时的 TP50/TP90/TP99，分别是多少。

这些东西都搞定了之后，后面才可以来看当前系统的压力主要在哪里，如何来扩容和优化啊。

#### 5.4.1.3 其它

- 服务分层（避免循环依赖）
- 调用链路失败监控和报警
- 服务鉴权
- 每个服务的可用性的监控（接口调用成功率？几个 9？99.99%，99.9%，99%）

### 5.4.1 服务降级

比如服务A调用服务B，结果服务B挂掉了，服务A重试几次调用服务B，还是不行，直接降级，走一个备用逻辑，给用户响应

```
public interface HelloService {
	  void sayHello();
}

public class HelloServiceImpl implements HelloService {

    public void sayHello() {
        System.out.println("hello world......");
    }
	
}

/*在provider中配置
	<dubbo:reference id="fooService" 	interface="com.test.service.FooService"  timeout="10000" check="false" 	mock="true">
	将mock修改为true，然后在跟接口同一个路径下实现一个Mock类，命名规则是接口名称加Mock后缀。然后在Mock类里实现自己的降级逻辑。
*/

public class HelloServiceMock implements HelloService {

    public void sayHello() {
      // 降级逻辑
    }

}
```

### 5.4.2 失败重试和超时重试

```xml
<dubbo:reference id="xxxx" interface="xx" check="true" async="false" retries="3" timeout="2000"/>
```

所谓失败重试就是consumer调用provider（消费方调用服务）失败了，比如抛出异常，此时是可以重试的，或者调用超时了也可以重试。Dubbox默认请求时间是1000ms，请求三次，可以`通过timeout设置超时时间，以及设置retries重试次数`



### 超时与服务降级

web api 请求产品明细时调用product service，为了查询产品评论product service调用comment service。如果此时由于comment service异常，响应时间增大到10S（远大于上游服务设置的超时时间），会发生超时异常，进而导致整个获取产品明细的接口异常，这也就是平常说的强依赖。这类强依赖是超时不能解决的，解决方案一般是两种：

- 调用comment service时做异常捕获，返回空值或者返回具体的错误码，消费端根据不同的错误码做不同的处理。
- 调用coment service做服务降级，比如发生异常时返回一个mock的数据,dubbo默认支持mock。

只有通过做异常捕获或者服务降级才能确保某些不重要的依赖出问题时不影响主服务的稳定性。



# 6. 配置

## 6.1 Dubbo 配置文件是如何加载到 Spring 中的？

Spring 容器在启动的时候，会读取到 Spring 默认的一些 schema 以及 Dubbo 自定义的 schema，每个 schema 都会对应一个自己的 NamespaceHandler，NamespaceHandler 里面通过 BeanDefinitionParser 来解析配置信息并转化为需要加载的 bean 对象！

## 6.2 说说核心的配置有哪些？

| 标签                 | 用途         | 解释                                                         |
| -------------------- | ------------ | ------------------------------------------------------------ |
| <dubbo:service/>     | 服务配置     | 用于暴露一个服务，定义服务的元信息，一个服务可以用多个协议暴露，一个服务也可以注册到多个注册中心 |
| <dubbo:reference/>   | 引用配置     | 用于创建一个远程服务代理，一个引用可以指向多个注册中心       |
| <dubbo:protocol/>    | 协议配置     | 用于配置提供服务的协议信息，协议由提供方指定，消费方被动接受 |
| <dubbo:application/> | 应用配置     | 用于配置当前应用信息，不管该应用是提供者还是消费者           |
| <dubbo:module/>      | 模块配置     | 用于配置当前模块信息，可选                                   |
| <dubbo:registry/>    | 注册中心配置 | 用于配置连接注册中心相关信息                                 |
| <dubbo:monitor/>     | 监控中心配置 | 用于配置连接监控中心相关信息，可选                           |
| <dubbo:provider/>    | 提供方配置   | 当 ProtocolConfig 和 ServiceConfig 某属性没有配置时，采用此缺省值，可选 |
| <dubbo:consumer/>    | 消费方配置   | 当 ReferenceConfig 某属性没有配置时，采用此缺省值，可选      |
| <dubbo:method/>      | 方法配置     | 用于 ServiceConfig 和 ReferenceConfig 指定方法级的配置信息   |
| <dubbo:argument/>    | 参数配置     | 用于指定方法参数配置                                         |

## 6.3 Dubbo 超时设置有哪些方式？

可以在消费端和服务端的 `全局、接口、方法 `中设置Dubbo超时时间

> 消费端consumer

- 全局控制

```xml
<dubbo:consumer timeout="1000"></dubbo:consumer>
```

- 接口控制
- 方法控制

> 服务端provider

- 全局控制

```xml
<dubbo:provider timeout="1000"></dubbo:provider>
```

- 接口控制
- 方法控制

可以看到dubbo针对超时做了比较精细化的支持，无论是消费端还是服务端，无论是接口级别还是方法级别都有支持。



> 超时设置优先级？

客户端方法级>服务端方法级>客户端接口级>服务端接口级>客户端全局>服务端全局



## 6.4 服务调用超时会怎么样？

dubbo 在调用服务不成功时，默认是会重试两次。

## 6.5 超时原理

dubbo默认采用了 `netty`做为网络组件，它属于一种`NIO的模式`。消费端发起远程请求后，线程不会阻塞等待服务端的返回，而是马上得到一个 `ResponseFuture`，消费端通过不断的`轮询机制`判断结果是否有返回。因为是通过轮询，轮询有个需要特别注要的就是 `避免死循环`，所以为了解决这个问题就引入了超时机制，只在一定时间范围内做轮询，如果超时时间就返回超时异常。



# 7. 通信协议与序列化协议

## 7.1 Dubbo 使用的是什么通信框架?

默认使用 Netty 作为通讯框架。

## 7.2 Dubbo 支持哪些通信协议，它们的优缺点有哪些？

> 简化版本：

- dubbo协议：`dubbo://`，  dubbo默认的协议，`单一长连接`，NIO异步通信，基于Hessian2作为序列化协议，`适用于并发高，传输数据量小。`

为了要支持高并发场景，一般是服务提供者就几台机器，但服务消费者有上百台，可能每天调用量就达到上亿次！此时使用长连接最合适就是跟每个服务消费者维持一个长连接，然后后面直接基于长连接NIO异步通信，可以支撑高并发请求

- rmi协议：`rmi://` ，`java二进制序列化，多个短链接`，适合消费者和提供者差不多的情况下，适合用于文件传输，一般较少使用
- hessian协议：`hessian序列化协议，多个短链接`，适用于提供者数量比消费者数量还多，适用与文件传输，一般较少使用
- http协议：`json序列化`，基于 HTTP 表单的远程调用协议，采用 Spring 的 HttpInvoker 实现。走表单序列化。
- webservice协议：`soap文本序列化`

基于 WebService 的远程调用协议，基于 Apache CXF 的 frontend-simple 和 transports-http 实现。走 SOAP 文本序列化。

- memcached 协议 `memcached://`

基于 memcached 实现的 RPC 协议。

- redis 协议 `redis://`

基于 Redis 实现的 RPC 协议。

- rest 协议 `rest://`

基于标准的 Java REST API——JAX-RS 2.0（Java API for RESTful Web Services 的简写）实现的 REST 调用支持。

- gPRC 协议 `grpc://`

Dubbo 自 2.7.5 版本开始支持 gRPC 协议，对于计划使用 HTTP/2 通信，或者想利用 gRPC 带来的 Stream、反压、Reactive 编程等能力的开发者来说， 都可以考虑启用 gRPC 协议。


> 复杂版本

- Dubbo： 单一长连接和 NIO 异步通讯，`适合高并发数据量小的服务调用`，以及消费者远大于提供者。传输协议 TCP，异步 Hessian 序列化。`Dubbo推荐使用dubbo协议`。
- RMI： 采用 JDK 标准的 RMI 协议实现，传输参数和返回参数对象需要实现 Serializable 接口，使用 Java 标准序列化机制，使用阻塞式短连接，传输数据包大小混合，消费者和提供者个数差不多，可传文件，传输协议 TCP。 多个短连接 TCP 协议传输，同步传输，适用常规的远程服务调用和 RMI 互操作。在依赖低版本的 Common-Collections 包，Java 序列化存在安全漏洞。
- WebService：基于 WebService 的远程调用协议，集成 CXF 实现，提供和原生 WebService 的互操作。多个短连接，基于 HTTP 传输，同步传输，适用系统集成和跨语言调用。
- HTTP： 基于 Http 表单提交的远程调用协议，使用 Spring 的 HttpInvoke 实现。多个短连接，传输协议 HTTP，传入参数大小混合，提供者个数多于消费者，需要给应用程序和浏览器 JS 调用。
- Hessian：集成 Hessian 服务，基于 HTTP 通讯，采用 Servlet 暴露服务，Dubbo 内嵌 Jetty 作为服务器时默认实现，提供与 Hession 服务互操作。多个短连接，同步 HTTP 传输，Hessian 序列化，传入参数较大，提供者大于消费者，提供者压力较大，可传文件。
- Memcache：基于 Memcache实现的 RPC 协议。
- Redis：基于 Redis 实现的RPC协议。


> 补充长连接和短连接

`长连接：一个连接上可以连续发送多个数据包`，在连接保持期间，如果没有数据包发送，需要双方发链路检测包。

`短连接：`短连接（short connnection）是相对于长连接而言的概念，指的是在数据传送过程中，只在需要发送数据时，才去建立一个连接，数据发送完成后，则断开此连接，`即每次连接只完成一项业务的发送。`

## 7.3 Dubbo 支持哪些序列化协议

dubbo实际基于不同的通讯协议，支持hessian、java二进制序列化、json、SOAP文本序列化协议。hessian是其默认的序列化协议

## 7.4 Hessian的数据结构
Hessian 的对象序列化机制有 9 种 基本类型：boolean、32-bit int、64-bit long、64-bit double、64-bit date、UTF8-encoded string、UTF8-encoded xml、raw binary data、remote objects

原始二进制数据
boolean
64-bit date （64位毫秒值的日期）
64-bit double
32-bit int
64-bit long
null
UTF-8 编码的 string
另外还包括 2 个组合结构：

list for lists and arrays
map for maps and dictionaries
object for objects
还有一种特殊的类型：

ref：用来表示对共享对象的引用
null for null values

## 7.5 为什么PB的效率是最高的

可能一些同学比较习惯于 JSON 或 XML 数据存储格式，对于 Protocol Buffer 还比较陌生。Protocol Buffer 其实是 Google 出品的一种轻量并且高效的`结构化数据存储格式，性能比 JSON，XML要高很多。`

其实PB之所以性能如此好，主要得益于两个原因：
1、它使用 Proto 编译器，`自动进行序列化和反序列化`，速度非常快，应该比 XML 和JSON 快上了 20-100倍。
2、它的`数据压缩效果好`，就是说它序列化后的数据量体积小。因为体积小，传输起来带宽和速度上会有优化。

# 8. Dubbo 用到哪些设计模式？

Dubbo 框架在初始化和通信过程中使用了多种设计模式，可灵活控制类加载、权限控制等功能。

## 8.1 工厂模式

Provider 在 export 服务时，会调用 ServiceConfig 的 export 方法。ServiceConfig中有个字段：

private static final Protocol protocol = ExtensionLoader.getExtensionLoader(Protocol.class).getAdaptiveExtension();

Dubbo 里有很多这种代码。这也是一种工厂模式，只是实现类的获取采用了 JDKSPI 的机制。这么实现的优点是可扩展性强，想要扩展实现，只需要在 classpath下增加个文件就可以了，代码零侵入。另外，像上面的 Adaptive 实现，可以做到调用时动态决定调用哪个实现，但是由于这种实现采用了动态代理，会造成代码调试比较麻烦，需要分析出实际调用的实现类。

## 8.2 装饰器模式

Dubbo 在启动和调用阶段都大量使用了装饰器模式。以 Provider 提供的调用链为例，具体的调用链代码是在 ProtocolFilterWrapper 的 buildInvokerChain 完成的，具体是将注解中含有 group=provider 的 Filter 实现，按照 order 排序，最后的调用顺序是：

EchoFilter -> ClassLoaderFilter -> GenericFilter -> ContextFilter -> ExecuteLimitFilter -> TraceFilter -> TimeoutFilter -> MonitorFilter -> ExceptionFilter

更确切地说，这里是装饰器和责任链模式的混合使用。例如，EchoFilter 的作用是判断是否是回声测试请求，是的话直接返回内容，这是一种责任链的体现。而像ClassLoaderFilter 则只是在主功能上添加了功能，更改当前线程的 ClassLoader，这是典型的装饰器模式。

## 8.3 观察者模式

Dubbo 的 Provider 启动时，需要与注册中心交互，先注册自己的服务，再订阅自己的服务，订阅时，采用了观察者模式，开启一个 listener。注册中心会每 5 秒定时检查是否有服务更新，如果有更新，向该服务的提供者发送一个 notify 消息，provider 接受到 notify 消息后，运行 NotifyListener 的 notify 方法，执行监听器方法。

## 8.4 动态代理模式

Dubbo 扩展 JDK SPI 的类 ExtensionLoader 的 Adaptive 实现是典型的动态代理实现。Dubbo 需要灵活地控制实现类，即在调用阶段动态地根据参数决定调用哪个实现类，所以采用先生成代理类的方法，能够做到灵活的调用。生成代理类的代码是 ExtensionLoader 的 createAdaptiveExtensionClassCode 方法。代理类主要逻辑是，获取 URL 参数中指定参数的值作为获取实现类的 key。

# 9. 运维管理

## 9.1 服务上线怎么兼容旧版本？

可以用版本号（version）过渡，多个不同版本的服务注册到注册中心，版本号不同的服务相互间不引用。这个和服务分组的概念有一点类似。

## 9.2 Dubbo telnet 命令能做什么？

dubbo 服务发布之后，我们可以利用 telnet 命令进行调试、管理。Dubbo2.0.5 以上版本服务提供端口支持 telnet 命令

## 9.3 Dubbo 支持服务降级吗？

以通过 dubbo:reference 中设置 mock=“return null”。mock 的值也可以修改为 true，然后再跟接口同一个路径下实现一个 Mock 类，命名规则是 “接口名称+Mock” 后缀。然后在 Mock 类里实现自己的降级逻辑

## 9.4 Dubbo 如何优雅停机？

Dubbo 是通过 JDK 的 ShutdownHook 来完成优雅停机的，所以如果使用kill -9 PID 等强制关闭指令，是不会执行优雅停机的，只有通过 `kill PID` 时，才会执行。

# 10. SPI（Service Provider Interface服务提供机制）

## 10.1 Dubbo SPI 和 Java SPI 区别？

请产看详情：https://blog.csdn.net/qq_35190492/article/details/108256452

### 10.1.1 JDK SPI

JDK 标准的 SPI 会`一次性加载所有的扩展实现`，如果有的扩展很耗时，但也没用上，很浪费资源。所以只希望加载某个的实现，就不现实了

`实现了面向功能进行拆分的对扩展开放的架构`。

![aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy8xNjAzNDI3OS03N2RiNDJkNjU0M2EwMzgzLnBuZw](https://i.loli.net/2021/09/29/NyM94d3aYCvoz1q.png)

### 10.1.2 DUBBO SPI：（按需加载）

`Dubbo SPI 除了可以按需加载实现类之外，增加了 IOC 和 AOP 的特性，还有个自适应扩展机制。`

1、对 Dubbo 进行扩展，不需要改动 Dubbo 的源码

2、`延迟加载`，可以一次只加载自己想要加载的扩展实现。

3、增加了对扩展点 IOC 和 AOP 的支持，一个扩展点可以直接 setter 注入其它扩展点。

4、Dubbo 的扩展机制能很好的支持第三方 IOC 容器，默认支持 Spring Bean。

![aHR0cHM6Ly91cGxvYWQtaW1hZ2VzLmppYW5zaHUuaW8vdXBsb2FkX2ltYWdlcy8xNjAzNDI3OS01ZGZlMmMzNmJmM2NlOGYyLnBuZw](https://i.loli.net/2021/09/29/uCLihtXSN4GbR6k.png)

Dubbo 分为了三类目录：

- META-INF/services/ 目录：该目录下的 SPI 配置文件是为了用来兼容 Java SPI 。

- META-INF/dubbo/ 目录：该目录存放用户自定义的 SPI 配置文件，接口全限定命名的文件。

- META-INF/dubbo/internal/ 目录：该目录存放 Dubbo 内部使用的 SPI 配置文件。

![image-20210929172231062](https://i.loli.net/2021/09/29/1MT6vaOfPJNmDgu.png)

文件内部的内容：

![image-20210929172841468](https://i.loli.net/2021/09/29/VPCXoNGfLbcRzB4.png)

在META-INF/services/目录创建以接口的全限定名命名的文件



# 11. 其他

## 11.1 Dubbo 支持分布式事务吗？

目前暂时不支持，可与通过 tcc-transaction 框架实现

介绍：tcc-transaction 是开源的 TCC 补偿性分布式事务框架

TCC-Transaction 通过 Dubbo 隐式传参的功能，避免自己对业务代码的入侵。

## 11.2 Dubbo 可以对结果进行缓存吗？

为了提高数据访问的速度。Dubbo 提供了声明式缓存，以减少用户加缓存的工作量<dubbo:reference cache=“true” />

其实比普通的配置文件就多了一个标签 cache=“true”

## 11.3 Dubbo 必须依赖的包有哪些？

Dubbo 必须依赖 JDK，其他为可选。

## 11.4 Dubbo 支持哪些序列化方式？

默认使用 Hessian 序列化，Java 二机制序列化，Json序列化，还有 Duddo、FastJson、Java 自带序列化。

## 11.5 Dubbo 在安全方面有哪些措施？

- Dubbo 通过 Token 令牌防止用户绕过注册中心直连，然后在注册中心上管理授权。
- Dubbo 还提供服务黑白名单，来控制服务所允许的调用方。

## 11.6 服务调用是阻塞的吗？

`默认是阻塞的`，可以`异步调用`，没有返回值的可以这么做。Dubbo 是基于 NIO 的非阻塞实现并行调用，客户端不需要启动多线程即可完成并行调用多个远程服务，相对多线程开销较小，异步调用会返回一个 Future 对象。

## 11.7 服务提供者能实现失效踢出是什么原理？

服务失效踢出基于 zookeeper 的临时节点原理。心跳机制

## 11.8 同一个服务多个注册的情况下可以直连某一个服务吗？

可以点对点直连，修改配置即可，也可以通过 telnet 直接某个服务。

## 11.9 Dubbo 服务降级，失败重试怎么做？

可以通过 dubbo:reference 中设置 mock=“return null”。mock 的值也可以修改为 true，然后再跟接口同一个路径下实现一个 Mock 类，命名规则是 “接口名称+Mock” 后缀。然后在 Mock 类里实现自己的降级逻辑

## 11.10 Dubbo 使用过程中都遇到了些什么问题？

在注册中心找不到对应的服务,检查 service 实现类是否添加了@service 注解无法连接到注册中心,检查配置文件中的对应的测试 ip 是否正确

# 12. RPC

## 12.1 为什么要有RPC

http接口是在接口不多、系统与系统交互较少的情况下，解决信息孤岛初期常使用的一种通信手段；优点就是简单、直接、开发方便。利用现成的http协议进行传输。但是如果是一个大型的网站，内部子系统较多、接口非常多的情况下，RPC框架的好处就显示出来了，`首先就是长链接`，不必每次通信都要像http一样去3次握手什么的，减少了网络开销；其次就是RPC框架一般都有注册中心，有丰富的`监控管理`；发布、下线接口、动态扩展等，对调用方来说是无感知、统一化的操作。第三个来说就是`安全性`。最后就是最近流行的服务化架构、服务化治理，RPC框架是一个强力的支撑。

socket只是一个简单的网络通信方式，只是创建通信双方的通信通道，而要实现rpc的功能，还需要对其进行封装，以实现更多的功能。

RPC一般配合netty框架、spring自定义注解来编写轻量级框架，其实netty内部是封装了socket的，较新的jdk的IO一般是NIO，即非阻塞IO，在高并发网站中，RPC的优势会很明显

## 12.2 什么是RPC

RPC（Remote Procedure Call Protocol）远程过程调用协议，它是一种通过网络从远程计算机程序上请求服务，而不需要了解底层网络技术的协议。简言之，RPC使得程序能够像访问本地系统资源一样，去访问远端系统资源。比较关键的一些方面包括：`通讯协议、序列化、资源（接口）描述、服务框架、性能、语言支持`等。

![截图3](https://i.loli.net/2021/09/29/zlqE9pDIricGv8R.jpg)

简单的说，RPC就是从一台机器(客户端)上通过参数传递的方式调用另一台机器(服务器)上的一个函数或方法(可以统称为服务)并得到返回的结果。

## 12.3 PRC架构组件

一个基本的RPC架构里面应该至少包含以下4个组件：

1、`客户端`（Client）:服务调用方（服务消费者）

2、`客户端存根`（Client Stub）:存放服务端地址信息，将客户端的请求参数数据信息打包成网络消息，再通过网络传输发送给服务端

3、`服务端存根`（Server Stub）:接收客户端发送过来的请求消息并进行解包，然后再调用本地服务进行处理

4、`服务端`（Server）:服务的真正提供者

![截图4](https://i.loli.net/2021/09/29/vM5DFonWQwGy67s.jpg)

`具体调用过程`：

1、服务消费者（client客户端）通过调用本地服务的方式调用需要消费的服务；

2、客户端存根（client stub）接收到调用请求后负责将方法、入参等信息序列化（组装）成能够进行网络传输的消息体；

3、客户端存根（client stub）找到远程的服务地址，并且将消息通过网络发送给服务端；

4、服务端存根（server stub）收到消息后进行解码（反序列化操作）；

5、服务端存根（server stub）根据解码结果调用本地的服务进行相关处理；

6、本地服务执行具体业务逻辑并将处理结果返回给服务端存根（server stub）；

7、服务端存根（server stub）将返回结果重新打包成消息（序列化）并通过网络发送至消费方；

8、客户端存根（client stub）接收到消息，并进行解码（反序列化）；

9、服务消费方得到最终结果；

而RPC框架的实现目标则是将上面的第2-10步完好地封装起来，也就是把`调用、编码/解码的过程给封装`起来，让用户感觉上像调用本地服务一样的调用远程服务。

## 12.4 RPC和SOA、SOAP、REST的区别

`1、REST`

可以看着是HTTP协议的一种直接应用，默认基于JSON作为传输格式,使用简单,学习成本低效率高,但是安全性较低。

`2、SOAP`

SOAP是一种数据交换协议规范,是一种轻量的、简单的、基于XML的协议的规范。而SOAP可以看着是一个重量级的协议，基于XML、SOAP在安全方面是通过使用XML-Security和XML-Signature两个规范组成了WS-Security来实现安全控制的,当前已经得到了各个厂商的支持 。

它有什么优点？简单总结为：易用、灵活、跨语言、跨平台。

`3、SOA`

面向服务架构，它可以根据需求通过网络对松散耦合的粗粒度应用组件进行分布式部署、组合和使用。服务层是SOA的基础，可以直接被应用调用，从而有效控制系统中与软件代理交互的人为依赖性。

SOA是一种粗粒度、松耦合服务架构，服务之间通过简单、精确定义接口进行通讯，不涉及底层编程接口和通讯模型。SOA可以看作是B/S模型、XML（标准通用标记语言的子集）/Web Service技术之后的自然延伸。

`4、REST 和 SOAP、RPC 有何区别呢?`

没什么太大区别，他们的本质都是提供可支持分布式的基础服务，最大的区别在于他们各自的的特点所带来的不同应用场景 。

## 12.5 RPC框架需要解决的问题？

1、如何确定客户端和服务端之间的通信协议？

2、如何更高效地进行网络通信？

3、服务端提供的服务如何暴露给客户端？

4、客户端如何发现这些暴露的服务？

5、如何更高效地对请求对象和响应结果进行序列化和反序列化操作？

## 12.6 RPC的实现基础？

1、需要有非常高效的网络通信，比如一般选择Netty作为网络通信框架；

2、需要有比较高效的序列化框架，比如谷歌的Protobuf序列化框架；

3、可靠的寻址方式（主要是提供服务的发现），比如可以使用Zookeeper来注册服务等等；

4、如果是带会话（状态）的RPC调用，还需要有会话和状态保持的功能；

## 12.7 RPC使用了哪些关键技术？

`1、动态代理`

生成Client Stub（客户端存根）和Server Stub（服务端存根）的时候需要用到Java动态代理技术，可以使用JDK提供的原生的动态代理机制，也可以使用开源的：CGLib代理，Javassist字节码生成技术。

`2、序列化和反序列化`

在网络中，所有的数据都将会被转化为字节进行传送，所以为了能够使参数对象在网络中进行传输，需要对这些参数进行序列化和反序列化操作。

- 序列化：把对象转换为字节序列的过程称为对象的序列化，也就是编码的过程。
- 反序列化：把字节序列恢复为对象的过程称为对象的反序列化，也就是解码的过程。

目前比较高效的开源序列化框架：如Kryo、FastJson和Protobuf等。

`3、NIO通信`

出于并发性能的考虑，传统的阻塞式 IO 显然不太合适，因此我们需要异步的 IO，即 NIO。Java 提供了 NIO 的解决方案，Java 7 也提供了更优秀的 NIO.2 支持。可以选择Netty或者MINA来解决NIO数据传输的问题。

`4、服务注册中心`

可选：Redis、Zookeeper、Consul 、Etcd。一般使用ZooKeeper提供服务注册与发现功能，解决单点故障以及分布式部署的问题(注册中心)。

## 12.8 主流RPC框架有哪些

### 12.8.1 RMI

利用java.rmi包实现，基于Java远程方法协议(Java Remote Method Protocol) 和java的原生序列化。

### 12.8.2、Hessian

是一个轻量级的remoting onhttp工具，使用简单的方法提供了RMI的功能。 基于HTTP协议，采用二进制编解码。

### 12.8.3、protobuf-rpc-pro

是一个Java类库，提供了基于 Google 的 Protocol Buffers 协议的远程方法调用的框架。基于 Netty 底层的 NIO 技术。支持 TCP 重用/ keep-alive、SSL加密、RPC 调用取消操作、嵌入式日志等功能。

### 12.8.4、Thrift

是一种可伸缩的跨语言服务的软件框架。它拥有功能强大的代码生成引擎，无缝地支持C + +，C#，Java，Python和PHP和Ruby。thrift允许你定义一个描述文件，描述数据类型和服务接口。依据该文件，编译器方便地生成RPC客户端和服务器通信代码。

最初由facebook开发用做系统内个语言之间的RPC通信，2007年由facebook贡献到apache基金 ，现在是apache下的opensource之一 。支持多种语言之间的RPC方式的通信：php语言client可以构造一个对象，调用相应的服务方法来调用java语言的服务，跨越语言的C/S RPC调用。底层通讯基于SOCKET。

### 12.8.5、Avro

出自Hadoop之父Doug Cutting, 在Thrift已经相当流行的情况下推出Avro的目标不仅是提供一套类似Thrift的通讯中间件,更是要建立一个新的，标准性的云计算的数据交换和存储的Protocol。支持HTTP，TCP两种协议。

### 12.8.6、Dubbo

Dubbo是 阿里巴巴公司开源的一个高性能优秀的服务框架，使得应用可通过高性能的 RPC 实现服务的输出和输入功能，可以和 Spring框架无缝集成。

## 12.9 RPC的实现原理架构图

![截图5](https://i.loli.net/2021/09/29/3AS7OWD9PaiUtKr.jpg)

![截图6](https://i.loli.net/2021/09/29/MtUNv1Ly8C9Eo6p.jpg)

PS：这张图非常重点，是PRC的基本原理，请大家一定记住！

也就是说两台服务器A，B，一个应用部署在A服务器上，想要调用B服务器上应用提供的函数/方法，由于不在一个内存空间，不能直接调用，需要通过网络来表达调用的语义和传达调用的数据。

比如说，A服务器想调用B服务器上的一个方法：

User getUserByName(String userName)

### 12.9.1 建立通信

首先要解决通讯的问题：即A机器想要调用B机器，首先得建立起通信连接。

主要是通过在客户端和服务器之间建立TCP连接，远程过程调用的所有交换的数据都在这个连接里传输。连接可以是按需连接，调用结束后就断掉，也可以是长连接，多个远程过程调用共享同一个连接。

### 12.9.2 服务寻址

要解决寻址的问题，也就是说，A服务器上的应用怎么告诉底层的RPC框架，如何连接到B服务器（如主机或IP地址）以及特定的端口，方名称是什么。

通常情况下我们需要提供B机器（主机名或IP地址）以及特定的端口，然后指定调用的方法或者函数的名称以及入参出参等信息，这样才能完成服务的一个调用。

可靠的寻址方式（主要是提供服务的发现）是RPC的实现基石，比如可以采用Redis或者Zookeeper来注册服务等等。

![截图7](https://i.loli.net/2021/09/29/f1SnkZINwLTuxEH.jpg)

#### 12.9.2.1 从服务提供者的角度看

当服务提供者启动的时候，需要将自己提供的服务注册到指定的注册中心，以便服务消费者能够通过服务注册中心进行查找；

当服务提供者由于各种原因致使提供的服务停止时，需要向注册中心注销停止的服务；

服务的提供者需要定期向服务注册中心`发送心跳检测`，服务注册中心如果一段时间未收到来自服务提供者的心跳后，认为该服务提供者已经停止服务，则将该服务从注册中心上去掉。

#### 12.9.2.2 从调用者的角度看

服务的调用者启动的时候根据自己订阅的服务向服务注册中心查找服务提供者的地址等信息；

当服务调用者消费的服务上线或者下线的时候，注册中心会告知该服务的调用者；

服务调用者下线的时候，则取消订阅。

### 12.9.3 网络传输

#### 12.9.3.1 序列化

当A机器上的应用发起一个RPC调用时，调用方法和其入参等信息需要通过底层的网络协议如TCP传输到B机器，由于网络协议是基于二进制的，所有我们传输的参数数据都需要先进行`序列化`（Serialize）或者编组（marshal）成`二进制`的形式才能在网络中进行传输。然后通过寻址操作和网络传输将序列化或者编组之后的二进制数据发送给B机器。

#### 12.9.3.2 反序列化

当B机器接收到A机器的应用发来的请求之后，又需要对接收到的参数等信息进行反序列化操作（序列化的逆操作），即将二进制信息恢复为内存中的表达方式，然后再找到对应的方法（寻址的一部分）进行本地调用（一般是通过生成代理Proxy去调用, 通常会有JDK动态代理、CGLIB动态代理、Javassist生成字节码技术等），之后得到调用的返回值。

### 12.9.4 服务调用

B机器进行本地调用（通过代理Proxy和反射调用）之后得到了返回值，此时还需要再把返回值发送回A机器，同样也需要经过序列化操作，然后再经过网络传输将二进制数据发送回A机器，而当A机器接收到这些返回值之后，则再次进行反序列化操作，恢复为内存中的表达方式，最后再交给A机器上的应用进行相关处理（一般是业务逻辑处理操作）。

通常，经过以上四个步骤之后，一次完整的RPC调用算是完成了，另外可能因为网络抖动等原因需要重试等。

# 13. 分布式服务接口的幂等性如何设计?

> 幂等性

所谓幂等性，就是说一个接口，多次发起同一个请求，你这个接口得保证结果是准确的，比如不能多扣款，不能多插入一条数据，不能将统计值多加了1。这就是幂等性。

> 如何保证幂等性

唯一性+状态

①对于每个请求必须有一个唯一的标志，比如订单支付请求，必须要包含订单的id，一个id只能支付一次。

②每次处理完请求之后，必须要有一个记录标识这个请求已经处理过了，比如最常见的是在mysql中记录一个状态，比如支付前先插入一条这个订单的支付流水，而且支付流水采用唯一约束，只有插入成功才进行支付。

③每次接受到请求之后需要先判断之前是否已经处理过，比如一条订单已经支付了，那么就一定会有支付流水，如果存在就表示已经支付过了。

在实际操作中，可以结合自己的业务，比如说用redis用orderId作为唯一键。只有成功插入这个支付流水，才可以执行实际的支付扣款。你就可以写一个标识到redis里面去，set order_id payed，下一次重复请求过来了，先查redis的order_id对应的value，如果是payed就说明已经支付过了，你就别重复支付了。

# 14. 分布式服务接口请求的顺序性如何保证？

> 调用顺序

其实分布式系统接口的调用顺序，也是个问题，一般来说是不用保证顺序的。但是有的时候可能确实是需要严格的顺序保证。给大家举个例子，你服务A调用服务B，先插入再删除。好，结果俩请求过去了，落在不同机器上，可能插入请求因为某些原因执行慢了一些，导致删除请求先执行了，此时因为没数据所以啥效果也没有；结果这个时候插入请求过来了，好，数据插入进去了，那就尴尬了。

本来应该是先插入 -> 再删除，这条数据应该没了，结果现在先删除 -> 再插入，数据还存在，最后你死都想不明白是怎么回事。

> 怎么保证

①首先，一般来说，从业务逻辑上最好设计系统不需要这种顺序的保证，因为一旦引入顺序性保障，会导致系统复杂度的上升，效率会降低，对于热点数据会压力过大等问题。

②操作串行化。
首先使用一致性hash负载均衡策略，将同一个id的请求都分发到同一个机器上面去处理，比如订单可以根据订单id。如果处理的机器上面是多线程处理的，可以引入内存队列去处理，将相同id的请求通过hash到同一个队列当中，一个队列只对应一个处理线程。

③最好能将多个操作合并成一个操作。

