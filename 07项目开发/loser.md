

# 1. Java基础

## 集合

### ArrayList原理和扩容机制

> 添加大量数据前，提前扩容

- list.ensureCapacity(initCapacity)

> 获取长度的方式

- length属性是针对数组
- length()方法是针对字符串
- size()方法是针对泛型集合

> 扩容grow()：

- 当添加第1个元素时，数组容量0->10,添加第11个元素时，数组容量15，每次扩容后，当前容量变为原来容量的1.5倍，最大值为Integer.MAX_VALUE - 8

> 实现有序排列接口Comparator和Comparable的区别

1、比较者大于被比较者（也就是compareTo方法里面的对象），那么返回正整数

2、比较者等于被比较者，那么返回0

3、比较者小于被比较者，那么返回负整数

实现Comparable接口的compareTo()方法，实现ComparaTo接口的compare方法

| 参数     | Comparable                                           | Comparator                         |
| -------- | ---------------------------------------------------- | ---------------------------------- |
| 排序逻辑 | 排序逻辑必须在待排序对象的类中，故称之为`自然排序` | 排序逻辑在另一个类中实现           |
| 实现     | 实现Comparable接口                                   | 实现Comparator接口                 |
| 排序方法 | int compareTo(Object o1)                             | int compare(Object o1,Object o2)   |
| 触发排序 | Collections.sort(List)                               | Collections.sort(List, Comparator) |

### HashMap工作原理和扩容机制

​       ![0](https://i.loli.net/2021/10/12/Rygi1XrvnaodOKI.png)（图中有个错误的地方，链表长度是否>=8，否，链表插入，key存在，则退出，不存在，则把当前值赋值给遍历节点)



> 数据结构

- hashMap结合数组快速查找+链表/红黑树快速增删的特性设计成桶数组的数据结构，
- 链表解决hash冲突，当具有相同的hash值时，通过equals遍历查找对应的key
- 得到键的哈希码，然后高低位异或运算获得键的hash值，再把键的hash值与数组的长度-1做与运算获得桶数组的下标。 (table.length()-1) & hash
- Node[] table
- 装载因子/阈值/容量

> 扩容机制

- 新容量/新阈值都扩充为原值的2倍（左移）（新容量小于最大容量并且老容量大于最小初始化容量）
- 调用有参/无参构造函数创建map 以及 map已经存在元素的情况下，对 新容量和新阈值 赋值操作。
- 链表和红黑树的转换：
- 链表长度大于8并且数组长度大于64的时候，链表转换成红黑树，红黑树的low/high 的TreeNode的长度小于的6的时候，转换成链表

- 数组的容量总是为2的N次方数，tableSizeFor()
- 扩容后，低位链表元素的放在原来位置，高位元素位置=原位置+原数组容量。



> 红黑树

![](https://i.loli.net/2021/10/11/hYkMz8Hy3plfA6u.jpg)

> 简述

红黑树其实就是去除 `二叉查找树顶端优势` 的解决方案，从而达到树的平衡

根据 `根节点为黑色，相邻节点不可能为红色` 原则，处理 当前节点 X 与 父节点 `Parent`、兄弟节点 `Uncle`、祖父节点 `Grand Parent` 的变化关系。



如果 兄弟节点 `Uncle` 为红色，

则 父亲节点 `Parent` 与 兄弟节点 `Uncle` 变为 黑色；

把祖父节点 变为 与 当前节点相同的颜色 红色，

如果祖父节点 或 当前节点为 根节点 ，则变为 黑色。



如果 兄弟节点 `Uncle` 为黑色，会出现以下四种情况

左左：拉起P，交换 P 和 P的父节点颜色

左右：左旋 变成 左左 后，再 按照左左规则。

右右：拉起P，交换 P 和 P的父节点颜色

右左：右旋 变成 右右，再 按照右右规则



> 详细赘述

1. 每个节点都有红色或黑色

2. 树的根始终是黑色的 (黑土地孕育黑树根， )

3. `没有两个相邻的红色节点`（红色节点不能有红色父节点或红色子节点，**并没有说不能出现连续的黑色节点**）

4. 从节点（包括根）到其任何后代NULL节点(叶子结点下方挂的两个空节点，并且认为他们是黑色的)的每条路径都具有相同数量的黑色节点



红黑树两大动作：

- recolor (重新标记黑色或红色)

- rotation (旋转，这是树达到平衡的关键) 左旋/右旋/拉起



红黑树增加节点详细讲解：https://zhuanlan.zhihu.com/p/79980618

动态效果图：https://rbtree.phpisfuture.com/
    

![image-20211011190610079](https://i.loli.net/2021/10/11/Otju9hPmqDRoICG.png)

假设我们插入的新节点为 X

   1. 将新插入的节点标记为红色

   2. 如果 X 是根结点(root)，则标记为黑色

   3. 如果 X 的 parent 是红色，同时 X 也不是 root:
      3.1 如果 X 的 uncle (叔叔) 是红色
         3.1.1 将 parent 和 uncle 标记为黑色
         3.1.2 将 grand parent (祖父) 标记为红色
         3.1.3 让 X 节点的颜色与 X 祖父的颜色相同，然后重复步骤 2、3
      3.2 如果 X 的 uncle (叔叔) 是黑色，我们要分四种情况处理
         3.2.1 左左 (P 是 G 的左孩子，并且 X 是 P 的左孩子)  -》 拉起P，交换 P 和 P的父节点颜色
         3.2.2 左右 (P 是 G 的左孩子，并且 X 是 P 的右孩子)  -》 左旋 再按照左左规则
         3.2.3 右右 (和 3.2.1 镜像过来，恰好相反)  -》 拉起P，交换 P 和 P的父节点颜色
         3.2.4 右左 (和 3.2.2 镜像过来，恰好相反)  -》 右旋 再按照右右规则



## String 类型

> new String("") 与 String = "1231"区别

> String Builder 与 String Buffer区别

- String 中的对象是不可变的，也就可以理解为常量，线程安全。
- String Buffer 对⽅法加了同步锁或者对调⽤的⽅法加了同步锁，所以是线程安全的。
- String Builder 并没有对⽅法进⾏加同步锁，所以是⾮线程安全的。

## 未提问内容

### 单例

```java
public class Singleton {

    private volatile static Singleton instance;
    public static Singleton getInstance() {
        if (instance == null) {
            synchronized (Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
    public static void main(String[] args) {
        Singleton.getInstance();
    }
}
```

# 2. Java高级

## 多线程

### 线程安全的问题（工作内存+主内存的转换）put()方法

- 线程A和线程B具有相同的桶数组下标，当线程A获得桶数组的链表头节点，此时线程A的时间片已经用完了，线程B完成后续的插入工作后，线程A再次被调度运行，完成数值的插入工作，当前下标的存储的数值已经不是之前的数值。
- 统计桶数组的大小的++size操作，

### 如何解决线程安全的问题

- 通过synchronize与手动加锁和解锁的方式 volatile

### 创建多线程方式

- 继承Thread类
- 实现Callable和Runnable接口
- Callable接口通过异步的方式获取返回值和异常（FutureTask.get()）

### 线程池的问题

> 七大参数

- 核心线程数
- 最大线程数
- 非核心线程超时回收时间
- 时间单位
- 线程工厂
- 阻塞队列
- 拒绝策略

> 工作流程

- 检查线程池的状态RUNNING  rs（线程池状态） | wc（工作线程数）
- 线程池的线程个数小于核心线程数，则会调用核心线程执行该任务，
- 线程池的线程个数大于核心线程数，则会把任务放入到阻塞队列中，
- 线程池的线程个数大于核心线程数并且阻塞队列已满，调用非核心线程执行从阻塞队列中获取任务并执行。
- 线程池的线程个数大于最大线程数，阻塞队列已满，则会调用阻塞策略（默认终止策略，丢弃任务并抛出RejectExecutionException异常）

> 任务管理与线程管理的配合

- 从阻塞队列中获取任务进行调度执行。
- 非核心线程：workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS) :
- 核心线程：workQueue.take();

> 线程空闲后如何回收

- 调用方法：processWorkerExit()方法 + interruptIdleWorkers(false) 方法
- 可重入锁的方式实现 统计已完成任务总数，去除HashSet存储的该工作线程的引用。
- 循环遍历HashSet中的工作线程，如果该工作线程没有被中断以及处于空闲状态（没有处于AQS独占状态1），则中断该空闲线程

> 线程池的状态

> 任务管理

- 线程如何从阻塞队列中拿去任务呢？ -》阻塞队列就是生产者存放元素的容器，而消费者也只从容器里拿元素。
- run() -> runWorker(Worker worker) -> getTask()
- 如果线程已经处于空闲状态（没有独占锁），则采用中断的方式释放锁。
- await()纳秒级别的超时等待，循环等待条件是否满足（防止虚假唤醒）/signal signalAll interrupted 超时等待

### 锁的种类和原理

- 乐观锁与悲观锁
- 独占锁与共享锁
- 公平锁与非公平锁

> 什么是可重入锁

锁的内部维护一个该锁被哪个线程占用的标识，0 -》 1 -》2  持有锁+1，释放锁-1，当计数器变为0后，线程标识被置为null

> 自旋锁

不会发现线程状态切换，一直处于用户态，不会是线程进入阻塞状态，减少不必要的上下文切换 -XX:PreBlockSpinsh

> synchronized

导致线程上下文的切换和重新调度开销。

### AQS（AbstractQueuedSynchronizer） 队列同步器

抽象同步器，它是全部锁的基础
所谓锁就是`state`值啊，state大于0就是锁已被持有，记录currentThread。
获取锁就是cas修改state为1，可重入就继续加1，释放锁-1，为0就释放了锁。
双向队列保存申请锁的线程，公平锁就看下一个来cas改state的是不是表头。结合lock的lock和unlock看。

- AQS 是一个 FIFO 的双向队列，有队首head和队尾tail元素，队列元素的类型为 Node 。
- 实现锁或其他同步器的基础框架
- 独占模式 EXCLUSIVE：如果一个线程获取到共享资源，修改状态state为1，表示该线程拥有该资源，其他线程尝试获取失败后被阻塞 。例如：`ReentrantLock`
- 共享模式 SHARED：当多个线程去请求资源时，通过 CAS 方式竞争获取资源。当一个线程获取到了资源后另外一个线程再次去获取时，如果当前资源还能满足它的需要，则当前线程只需要使用 CAS 方式进行获取即可。

1. CountDownLatch：主线程开启多个子线程执行任务，等待所有子线程执行完成。（与join()区别，使用await()和countDown(）方法灵活操作
2. CyclicBarrier：当所有线程都到达屏障点时才能一块继续向下执行（适用于分步骤执行总任务）
3. Semaphore：内部计数器递增（M原有值+N新增线程）（release() 信号量+1；acquire(2) 线程一直阻塞，直到信号量达到指定数值）

### CAS（CompareandSwap）比较和替换

> 简介：

- volatile 只能保证共享变量的可见性，不能解决 读-改-写 等的原子性问题，可以通过CAS解决原子性问题。
- 非阻塞原子操作，通过硬件保证比较更新操作的原子性
- 对象内存地址、对象的变量的偏移量、变量预期值和新的值。

> 存在问题

- ABA的问题，通过对变量添加版本号解决（AtomicStampedReference时间戳）
- 多个线程争夺同一个资源时，如果CAS自旋一直不成功，将会一直占用CPU。
- CAS只能保证一个共享变量的原子操作

> 应用

- 原子操作（通过获取字段的内存偏移地址更新数值）：java.util.concurrent.atomic
- AQS（抽象的队列式的同步器）


### 阻塞队列

- 加锁解锁（不满不空的条件对象唤醒signal）
- 阻塞队列（BlockingQueue）是一个支持两个附加操作的队列。这两个附加的操作是：

当队列空时，获取元素的线程会等待队列变为非空。

当队列满时，存储元素的线程会等待队列可用。

- 阻塞队列常用于生产者和消费者的场景，生产者是往队列里添加元素的线程，消费者是从队列里拿元素的线程。阻塞队列就是生产者存放元素的容器，而消费者也只从容器里拿元素

```java
 public boolean offer(E e) {
     if (e == null) throw new NullPointerException();
     final AtomicInteger count = this.count;
     if (count.get() == capacity)
         return false;
     int c = -1;
     Node<E> node = new Node<E>(e);
     final ReentrantLock putLock = this.putLock;
     putLock.lock();
     try {
         if (count.get() < capacity) {
             enqueue(node);
             c = count.getAndIncrement();
             if (c + 1 < capacity)
   // 不满线程被唤醒（生产线程）
   notFull.signal();
         }
     } finally {
         putLock.unlock();
     }
     if (c == 0)
         // 不空线程被唤醒（生产线程）
         signalNotEmpty();
     return c >= 0;
 }
 public E take() throws InterruptedException {
     E x;
     int c = -1;
     final AtomicInteger count = this.count;
     final ReentrantLock takeLock = this.takeLock;
     takeLock.lockInterruptibly();
     try {
         while (count.get() == 0) {
             notEmpty.await(); // 消费线程
         }
         x = dequeue();
         c = count.getAndDecrement();
         if (c > 1)
             notEmpty.signal(); // 消费线程
     } finally {
         takeLock.unlock();
     }
     if (c == capacity)
         signalNotFull(); // 消费线程
     return x;
 }
```

### 线程状态以及演变过程

​    ![0](https://i.loli.net/2021/10/11/pZAs9zn5FVldKG4.jpg)

### 锁有哪些 以及 它们的原理

### 线程安全的理解

### 未提问内容

- 线程同步
- 线程间通信
- 线程死锁
- 线程控制：挂起/停止/恢复
- 线程间同步：Countdownlatch（join）、回环屏障CyclicBarries、信号量Semaphore（递增） 

##  未提问内容

# 3. JVM

## Java内存模型（类比于硬件缓存模型）

- Java内存模型的主要目标是定义程序中各个变量的访问规则
- 工作内存（从主内存拷贝）、主内存（从工作内存同步）：一个变量如何从主内存拷贝到工作内存、如何从工作内存同步到主内存之间
- 线程对变量的所有操作（读取、赋值）都必须在工作内存中进行，而不能直接读写主内存中的变量
- 乱序执行
- 执行重排序

## Java内存结构

- 堆Heap/元空间/栈（Java栈/本地栈/程序计数器）
- GC的过程（OOM)

​    ![0](https://i.loli.net/2021/10/11/TlXW5Fu4CcD6eOk.jpg)

晋升失败如何处理？？

## JVM调优

> 简化步骤说明

- 首先查看系统CPU负载情况，再看jdk进程号，可以直接导出hprof文件

- 其次查看大对象情况以及查看GC情况

> 详细步骤说明

- 内存异常的时候，自动dump文件，参数配置：JAVA_OPTS="-XX:HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=\\\"，

- 查看系统CPU负载情况： `uptime`；实时查看系统各个进程占用CPU的情况： `top`
- 通过jps获取虚拟机进程号：` jps -l`
- 导出内存使用情况到文件： `jmap -dump:format=b,file=D:\dump\dumpName.hprof [pid]`
- 运行时观察gc情况： `jstat -gc [pid] 间隔秒 循环次数`
- 查看大对象情况： `jmap -histo [pid] |sort -k 2 -g -r | less`
- 分析Dump文件：通过jdk自身的 `visualVm` 或者 `eclipse MAT` 工具分析（疑点-查看线程栈，retainedHeap最大等等）

​    ![0](https://i.loli.net/2021/10/11/uY1BDpzOPSMjWUH.png)

## 类加载机制



## 垃圾回收算法

- 新生代：复制

- 老年代：标记清理/标记压缩



## 垃圾收集器



## 未提问内容

# 4. 数据库

## 4.1 Oracle

### SQL优化原理：

索引/分区/分库 -》 大部分数据走索引，少部分数据物理读

### SQL基础 左右连接 等

### 事务隔离级别

### 未提问内容

## 4.2 Redis

[详情查看](/04架构设计/缓存Redis)

### 数据类型

> Redis 常见的数据类型以及它们的应用

string list hast set zset

### 过期策略和内存淘汰策略

> Redis 过期数据删除策略

expire


> 内存回收策略

删除过期键对象：惰性删除（使用key时检查，不用不检查，会有内存泄漏的问题）和定时任务删除（过期键比例/快慢模式）

如何判断数据是过期的：过期字典是保存数据过期的时间，过期字典的键指向key，值是long long的整形，毫秒精度的 UNIX 时间戳

> 内存淘汰机制8种


noeviction (不回收)

volatile（过期属性）、allkeys

lfu lru random

Redis 8种内存淘汰机制

lru lfu random

volatile（带有过期属性） allkeys（所有key） noeviction（不清理）

volatile-lru：在有 expire 属性的 key 范围内按照 lru 原则清理

allkeys-lru：在所有 key 范围内按照 lru 原则清理

volatile-lfu：在有 expire 属性的 key 范围内按照 lfu 原则清理 （访问时间+访问次数）

allkeys-lfu：在所有 key 范围内按照 lfu 原则清理

volatile-random：在有 expire 属性的 key 范围内随机清理

allkeys-random：在所有 key 范围内随机清理

volatile-ttl：在有 expire 属性的 key 范围内清理即将到期的 key

noeviction：不回收，默认


### 线程模型

> Redis 单线程的优势，Redis为什么这么快 为啥Redis6.0引入多线程

没有多线程上下文切换和重新调度开销

纯内存访问

`I/O多路复用程序 文件事件处理分发器`（当被监听的套接字准备好执⾏ 连接应答（accept）、读取（read）、写⼊（write）、关 闭（close）等操作时，与操作相对应的⽂件事件就会产⽣，这时⽂件事件处理器就会调⽤套接字之前关联好的事件处理器来处理这些事件。）

epoll解决内核态轮询问题以及大批量的内核态拷贝，解决最大个数限制1024，大于2048



### 高可用架构设计

> Redis高可用架构设计 哨兵和集群

主从复制是高可用Redis的基础，哨兵和集群都是在主从复制基础上实现高可用的。主从复制主要实现了数据的多机备份，以及对于读操作的负载均衡和简单的故障恢复。

Redis-Sentinel模式

Redis-Cluster模式


> Redis服务不可用

依赖隔离组件为后端限流并降级 Hystrix

> 缓存失效

设定缓存随机过期时间

双缓存：缓存A设置过期时间，缓存B永久有效。

> Redis 分布式锁

保证同一时刻多个请求只有一个可以操作业务，使用setnx+expire+getset

> 秒杀系统如何设计

### 分布式

### 缓存异常

[具体参考缓存Redis](/04架构设计/缓存Redis)
> Redis 缓存穿透 缓存雪崩

（无效key）缓存穿透：缓存层找不到，存储层也没有，避免去后端存储层找数据

缓存空对象：设置过期时间，存在缓存层和存储层时间窗口内，不一致的问题。（频繁变化实时性高）

布隆过滤器拦截：新增和判断逻辑。隆过滤器说某个元素存在，小概率会误判。布隆过滤器说某个元素不在，那么这个元素一定不在。直接返回。（固定实时性低）

（失效key）缓存雪崩：同一时刻，缓存数据大面积失效，导致所有的请求都到了存储层，短时间接收大量的请求，有可能导致后端服务宕掉。

### 持久化

> Redis 持久化机制 原理过程 配置方式 数据同步

阻塞：fork操作过程中父进程会阻塞、AOF追加阻塞主线程（比较上一次同步时间，大于2s，阻塞）

> 只追加文件AOF（append-only file）持久化:

配置参数 appendonly yes

bgwriteaof 体积过大，重写机制

文本协议格式 持久化的实时性

触发方式：appendfsync everysec

同步参数：

always 每个redis写命令都要同步写入硬盘，这样会严重降低redis的速度

everysec 每秒执行一次同步，显式的将多个写命令同步到硬盘

no 让操作系统来决定应该何时进行同步

执行命令 -》 aof_buf -》写入文件 -》 重写rewrite（文件过大的时候） -》 重启加载load

文件重写rewrite：子进程创建新的aof文件期间，会把所有的命令写入到缓冲区，等新的aof文件创建完成之后，再把缓冲区内的内容追加到aof文件。

手动触发：bgrewriteaof

自动触发（触发时机）：重写时文件的最小体积、当前aof文件空间/上一次文件空间比值

文件重载加载load：

> 快照（snapshotting）持久化（RDB）:

二进制文件 适用于备份，全量复制 灾难恢复

bgsave

手动触发bgsave/自动触发

同步：save ms 个数

父进程执行fork操作，创建一个子进程（生成RDB文件，响应其他命令）



### Redis 如何保证缓存和数据库双写的一致性

先更新数据库后删除缓存

缓存延时双删

删除缓存重试机制

读取mysql的binlog日志异步删除缓存



## 未提问内容

### Redis 分布式锁的实现

setnx

## 常规提问方式

9.既然生成快照的中途依然可以执行Redis，那么从节点获取到快照是不完整的，如何同步？（主从同步，先建立连接，然后命令传播，两个结点中的buffer队列里存储一个offset，差值就是需要同步的值）

10.设计题，设计一个扫码登陆（不会）那换成设计微信红包功能（MySQL的字段，Redis缓存一致性，发红包如何add字段，抢红包如何修改字段，通过一个唯一的版本号去保证CAS的ABA得到解决。但说了很久，面试官依然认为思路混乱）

接着的Redis持久化，也追问得很厉害，从持久化问到主从同步。中间追问的时候描述得也比较“模糊”，后来在提示下才知道是问主从同步了，然后把整个过程都说了一下。。

redis 内存满了会怎么办

redis 突然set很多key，单线程会不会长时间阻塞

8、redis 持久化有哪几种方式，怎么选

9、redis 主从同步是怎样的过程

10、redis 的 zset 怎么实现的


# 5. Spring系列

## 5.1 Spring

### Spring IOC理解

### Spring Aop实现原理和应用

- JDK代理 实现接口的目标类生成代理
- CGLIB代理 生成目标类的子类

### Spring 循环引用

### Spring 作用域

### Spring 设计模式

> 工厂模式

> 单例模式

> 模版方法

> 代理模式（Spring Aop）

> 适配器模式（Spring MVC的适配器）

> 观察者模式（监听）

> 装饰着模式（扩展属性和行为）

### Spring 注解

将一个类声明为Spring的Bean有注解有： 
@Component @Controller @Service @Respository @Autowired @Qualifier @Resource

@Autowired 与 @Resource 区别

### 事务传播行为

```java
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import com.mengma.dao.AccountDao;

public class AccountServiceImpl  {
    private AccountDao accountDao;
    public void setAccountDao(AccountDao accountDao) {
        this.accountDao = accountDao;
    }
    @Transactional(
            propagation = Propagation.REQUIRED,
            isolation = Isolation.DEFAULT,
            readOnly = false,
            rollbackfor = Exception.class
    )
    public void transfer(String outUser, String inUser, int money) {
        this.accountDao.out(outUser, money);
        // 模拟断电
        int i = 1 / 0;
        this.accountDao.in(inUser, money);
    }
}
```

REQUIRED：如果当前存在事务，则加入当前事务；不存在，创建新事务

REQUIRES_NEW：重新创建新的事务

NESTED：

MANDATORY/NEVER：必须需要事务/必须不要事务，没有就抛出异常

SUPPORTS：如果当前有事务，则加入当前事务；如果没有事务，则以非事务方式执行。

NOT_SUPPORTED：如果当前存在事务，则挂起当前事务；如果没有事务，则以非事务方式执行。

同一类中自调用方法，没有事务注解的方法调用有事务注解的方法，会使有事务注解的方法失效。

### Spring 单例Bean的线程安全问题

存在安全问题，当多个线程修改成员属性中含有写操作的对象时，会有线程安全的问题。

通过定义 成员属性 threadLocal 变量

修改Bean的作用域 prototype

### Spring 生命周期

根据配置信息调用构造方法或者工厂方法实例化Bean

依赖注入属性

实现接口的话，设置相应的值

BeanPostProcessor `postProcessBeforeInitialization()` 预初始化方法

InitializingBean的 `afterPropertiesSet()` 方法

自定义的初始化方法

BeanPostProcessor `postProcessAfterInitialization()` 后初始化方法

Singleton直接交给SpringIOC容器管理Bean的生命周期/propotype由调用者决定。

销毁Bean ，实现了DisposableBean接口则调用 `destroy()` 销毁方法， Bean配置中含有 `destroy-method` 属性，调用指定销毁方法。

### 未提问内容



## 5.2 SpringMVC

### 工作原理是怎么样的？

前端控制器/处理器映射器/视图解析器

### 过滤器和拦截器的区别

过滤器：依赖于servlet容器，在web.xml中配置，在Javaweb的应用是对请求request的数据提前做处理，比如说修改字符集编码格式，然后再传入到servlet或者controller进行后续的业务处理。

拦截器：依赖于Spring MVC 框架，在springMVC配置文件。

`preHandle`：调用Controller的处理方法之前，用户登录验证。

`postHandle`：视图解析之前，可对视图解析进行修改。

`afterCompletion`：渲染视图结束之后。资源清理，记录日志信息。

执行顺序：

多个Filter，放行前按配置顺序执行，放行后按配置倒序执行。`队列`

多个Interceptor，preHandle/postHandle按配置顺序执行，afterCompletion按配置倒序执行。`栈`

总结：前端控制器会根据处理器映射器传过来的Controller与已经注册好的处理器适配器一一匹配。如果找到处理器适配器与Controller匹配，则调用处理器适配器的handler方法，通过反射机制执行Controller的具体的方法来获得模型视图。通过视图解析器解析视图，然后把模型数据填充到视图中，即渲染视图，响应用户请求。 

### 数据转换方式配置

json转换

### 未提问内容

x 正数的值越小，该servlet的优先级越高，应用启动时就越先加载。当值相同时，容器就会自己选择顺序来加载。

获取请求参数以及参数绑定

通过Controller控制器处理方法的形参获取

通过注解获取参数

常用注解

## 5.3 Spring Boot

### Spring Boot的自动配置原理

### Spring Boot 配置加载顺序



## 5.4 Spring Cloud

## 5.5 Spring Security

### 工作原理

​    认证和授权

​    配置登录form-login/登出logout 请求地址关系，成功返回页面，失败返回页面等信息

​    配置不受登录规则约束的地址。

​    认证管理器-》认证提供者-》自定义实现认证模块（对密码进行解密配置）

```xml
<!-- 配置认证管理器 -->
<authentication-manager>
    <!-- 认证的提供者 -->
    <authentication-provider user-service-ref="userDetailsService">
        <!-- 配置密码加密方式 -->
        <password-encoder ref="passwordEncoder"/>
    </authentication-provider>
</authentication-manager>

<!-- 配置自定义的认证类 -->
<beans:bean id="userDetailsService" 
            class="com.pinyougou.service.UserDetailsServiceImpl">
    <beans:property name="sellerService" ref="sellerService"/>
</beans:bean>
<!-- 配置密码解密方式 -->
<beans:bean id="passwordEncoder" 
            class="org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder"/>
```

实现PasswordEncoder接口的两个方法：encode() matchs()

属性注入方式  添加setXXX方法以及配置Bean属性

BCrypt加密算法

​	配置到认证管理器的提供者中加密方式

## Spring Cloud Alibaba



## Spring Cloud Netflix





## 未提问内容

# 6. 中间件

## 6.1 Mybatis

### {}和${}的区别

#{}：POJO的属性或者变量，预编译，防止SQL注入的； 

${}：POJO属性或者变量，拼接字符串

### mybatis递归查找

### 未提问内容

selectKey

​	order: mysql:after;oracle:before.



## 6.2 消息队列

### RabbitMQ

> 消息持久化，confirm机制，ACK事务机制。

​    ![0](https://i.loli.net/2021/10/11/N7GL4DFgijqABP2.jpg)

#### 未提问内容

> 测试RabbitMQ的步骤

a.定义rabbitmq的连接串，虚拟主机

b.定义消息队列

c.把消息队列绑定到哪种交换机上。

d.注入rabbitMqTemplate 调用converAndSend方法，传入 交换机和队列，以及发送的消息内容。

> 生产者 交换机 队列 消费者

Direct Exchange 点对点

Fanout Exchange 发布与订阅

Topic Exchange 通匹配符

Headers Exchange 头部路由

> 可靠性传输

生产者（中间件已经持久化后） 中间件（持久化） 消费者（消费完毕/重复消费）

是否投递到交换机-ConfirmCallback 交换机是否路由到队列-ReturnCallback

### RocketMQ



### 未提问内容



## 6.3 Dubbo

### 未提问内容



## 6.4 Zookeeper

### zookeeper选举机制

### 未提问内容

## 未提问内容

# 7. 计算机网络

## TCP三次握手和四次挥手

标识：

头部信息：源端口 目的端口 序列号 确认号 标志位 校验和 紧急指针

标志位：SYN FIN ACK

序列号 确认号

TIME_WAIT（确认服务端已经收到最后发出的确认信息） LAST_WAIT（确认客户端发过来的内容）

整个过程的头部信息的变化

## HTTP与HTTPS的区别

安全性和资源消耗SSL（加密算法对称和非对称）/TLS 端口

## 浏览器输入url后台经过什么步骤，最终把内容显示到浏览器

## 未提问内容

线程通信

进程通信

# 10. 算法

# 98. 前端知识

AngularJs

​    ng-app 应用程序根元素

​    ng-init 初始化的方法

​    loginService.js 请求后台的服务

​    indexController.js 响应后台数据

​    {{}} 变量

# 99. 自我介绍+项目拆解

## 自我介绍

 毕业后，经历几家公司，分别做了什么事情，做了什么项目，涉及到的技术是什么？简要概述。



## 项目拆解：优点和难点

### 信用卡资产证券化

#### 项目介绍

整合资产证券化业务流程，构建全流程电子信息化的资产证券化管理系统，涵盖：资产预选、资产备选、资产入库、资产交割、资产回购、资产财务处理、资产报表、服务商报告等功能。



我主要完成部分流程的功能设计、CRUD工作以及全权负责批处理框架搭建以及存储包数据处理开发。

`功能设计` ：模块切分，流程细分；按系统间

`模型设计 `：业务表设计，字典表设计，字段状态，主键，索引，分区。

`批处理框架设计` ：支持失败重跑、并发调度、按日/按月调度、循环等待处理、不可重复操作等机制。

`数据处理设计` ：总-分，模块化 BEGIN EXCEPTION END;

`调度作业配置管理` ：实现作业精细化、模块化、图形化和告警通知的管理。





大数据平台 / 外系统（推数据过来） -》 资产证券系统（流转） -》 外系统（推文件/调用接口）



涉及幂等性操作/重复操作：主键/状态标识

程序逻辑：总分总的结构逻辑

打通Shell调Oracle、jar 包、python程序



#### 技术难点/解决什么问题

### 调度平台调整

#### 项目介绍

为更好的灵活配置、管理和监控作业，调度方式由Linux系统自带的调度方式切换至Control-M工具，最后切换至新一代调度平台，从而实现作业的 `精细化、模块化、图形化和告警通知 `的管理。

完成作业分类归纳整理：通过对作业重要程度和系统资源使用的切分，从而使得系统资源得到充分使用，保证系统的健康运行；通过对功能模块的设计让作业支持 `失败重跑、并发调度` 等机制，从而增强作业的 `健壮性、实用性和灵活性`。



`灵活配置和管理` 关键作业与非关键作业系统资源的划分，作业告警（运行告警，执行失败告警），失败重试，监控作业完成情况（未开始，运行中，成功/失败），并发调度。



#### 技术难点/解决什么问题

##### 调度平台自身

拆分原则： `高内聚，低耦合，闭环开发` 设计是宏观的，拆分内容是微观的。

> 作业配置如何合理定义作业流/作业名称？方便后期维护和迭代新增，开始与结束时间？作业流是否并行跑？是否支持重跑？是否需要告警，通过短信/邮箱等等通知方式？如何拆分关键与非关键作业，充分使用系统资源，互不影响？作业是否需要并发调度？



> 依赖关系

作业流、作业之间的依赖如何配置？长依赖作业如何拆分？执行时间长的作业如何拆分？拆分后不影响被依赖作业的执行？

> 资源使用

如何定义系统资源，让作业调度充分使用系统资源，并且不影响其他程序正常运行？是否多个环境运行？

> 从作业配置，依赖关系，资源使用这几点，拓展开来就是 模块功能如何设计？如何拆分、细化？如何支持重跑？幂等性？补偿机制？实现最终一致性或强一致性。



##### 工具类的设计

工具类流程设计： `读取-》检查-》转换-》写入-》导出`



域-组件-作业流-作业

`模型数据`：读excel对象，组成读取类，每个sheet对象是一个list属性；写excel对象，组成写入类，每个sheet对象是一个list属性

`动作类`：配置类（读文件/写文件/规则文件）、读取类、规则校验类、转换类、写入类

`工具类`：Guaua辅助校验：字符串/空值

`启动类`：BootBstc



`读取` 输入到内存：FileInputStream()、XSSWorkbook

```java
public ExcelOutBo read() throws IOException {
    FileInputStream fs = new FileInputStream(cfgExcel);
    workbook = new XSSFWorkbook(fs);

    ExcelOutBo excelOutBo = new ExcelOutBo();
    excelOutBo.setFlow(readFlows());
    excelOutBo.setFlowPub(readFlowPub());
    excelOutBo.setJob(readJobs());
    excelOutBo.setJobPub(readJobPub());
    excelOutBo.setBranch(readBranch());
    excelOutBo.setResource(readResource());
    excelOutBo.setNode(readNode());

    fs.close();
    return excelOutBo;
}
```

`导出`

```java
public void export() {
   //
   FileInputStream fi =null;
   FileOutputStream fo = null;

   try {
      //拷贝一份模板文件
      File tpl = new File(checkNotNull(tplExcel));
      //打开文件
      fi = new FileInputStream(tpl);
      workbook = new XSSFWorkbook(fi);
      //
      System.out.println("[信息] 开始导出");

      exportFlowControl(data);
      exportFlowSchedule(data);
      exportFlowDenpend(data);
      exportJobControl(data);
      exportJobSchedule(data);
      exportJobDenpend(data);
      exportResource(data);
      exportNode(data);

      //
      System.out.println("[信息] 写入数据--Writing file");
      fo = new FileOutputStream(this.outExcel);
      this.workbook.write(fo);
      fo.flush();

      System.out.println("[信息] 导出完毕");
   } catch (Exception e) {
      System.out.println("[信息] 导出失败--" + e.getMessage());
      e.printStackTrace();
   } finally {
      try {
         if(null != fo) {
            fo.close();
         }

         if(null != this.workbook) {
            this.workbook.close();
         }
         if (null != fi) {
            fi.close();
         }
      } catch (IOException e) {
         e.printStackTrace();
      }
   }
}
```

### 电商商城

![image-20211009162920534](https://i.loli.net/2021/10/11/YSjzJXpvcs9ieTE.png)

#### 项目介绍

基于微服务架构搭建电商商城，系统分成应用层服务和业务层服务，应用层服务暴露前端调用接口，业务层服务供应用层服务或者服务与服务之间调用，暴露Dubbo服务（存在超时调用，默认1000ms，失败重试机制，默认重试2次，总共执行3次）。应用层服务分成后台管理服务，首页服务，商品详情服务；业务层服务分成首页广告服务，商品服务，页面服务。

后台管理服务做商品数据/首页广告数据的CRUD。



#### 技术难点/解决什么问题

##### 项目架构设计理解

> 接口规范：Swagger 

[详情参考Swagger](/03框架/Swagger)


> 跨域调用的过滤器：CorsFilter

分成两个请求，发送`options预请求`，看看服务端是否允许发送包含 源信息 `Origin` /请求头部 `Headers` /请求方法 `Method`  的请求，`预响应`返回允许请求源，请求方法，请求头部，是否允许cookies；通过后才发送`正式请求`，返回`正式响应`。

在启动类中加入 `corsFilter` 方法

```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableZuulProxy
public class GatewayBootstrap {

    public static void main(String[] args) {
        SpringApplication.run(GatewayBootstrap.class, args);
    }
  
	// cors 跨域解决方案
    @Bean
    public FilterRegistrationBean corsFilter() {
        final UrlBasedCorsConfigurationSource source = new 
            UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        //允许跨越发送cookie
        config.setAllowCredentials(true);
        //允许所有域名进行跨域调用
        config.addAllowedOrigin("*");
        //放行全部原始头信息
        config.addAllowedHeader("*");
        //允许所有请求方法跨域调用
        config.addAllowedMethod("*");
        config.setMaxAge(18000L);

        source.registerCorsConfiguration("/**", config);
        CorsFilter corsFilter = new CorsFilter(source);
        FilterRegistrationBean filterRegistrationBean = new 
            FilterRegistrationBean(corsFilter);
        filterRegistrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return filterRegistrationBean;
    }
}
```



> 如何解决验证码服务给我们暴露的http请求接口

`模拟http客户端`调用http服务端发请求，验证码服务接口获取验证码

`RestTemplate`是Spring提供的用于访问RESTful服务的客户端，RestTemplate提供了多种便捷访问远程Http服务的方法

RestTemplate默认依赖JDK提供http连接的能力（HttpURLConnection）

使用`OKhttp客户端`请求RESTFUL的服务端

服务层与服务层调用

```
import org.springframework.web.client.RestTemplate;
String forObject = restTemplate.getForObject("http://localhost:9013/communication/hello", String.class);
```

##### 微服务Spring Boot

单体 -》 SOA -》 微服务Spring Boot /Spring Clound Dubbo
微服务使用spring boot搭建。

@SpringBootApplication 

> Spring Boot 配置文件加载顺序



> Spring Boot 配置的规则





> yaml文件格式 支持 对象（键值对的集合，映射，字典）/数组/纯量





##### Spring Cloud alibaba/Netflix

> 注册中心和服务发现

![image-20211011154356018](https://i.loli.net/2021/10/11/bhEO3RuQsJk24FS.png)

上报服务地址-》服务注册列表 -》获取服务地址（多个服务地址采用`客户端负载均衡Ribbon`的方式获取其中一个）

```yaml
nacos‐restful‐provider:
ribbon:
NFLoadBalancerRuleClassName: com.netflix.loadbalancer.RandomRule
```

配置服务发现中心的地址，集群名称，命名空间，

多租户隔离：集群名称 cluster-name

租户内隔离：命名空间 namespace （开发/测试/生产环境）

租户相当系统，拥有自己所属集群，

> 配置中心nacos

@EnableDiscoveryClient :都是能够让注册中心能够发现，扫描到该服务。

修改配置文件 -》 获取配置通知 -》 获取最新配置

配置文件名称=服务名称+扩展名 spring-boot-http.yaml

重要参数
        ext-config：
        namespace（开发/测试/生产环境）
        group（子项目：公共服务/支付服务/商品服务/订单服务/支付服务/邮件服务）
        dataid（工程）

```yaml
server:
  port: 57010 #启动端口 命令行注入
  max-http-header-size: 100KB

nacos:
  server:
    addr: 127.0.0.1:8848

spring:
  application:
    name: merchant-application
  main:
    allow-bean-definition-overriding: true # Spring Boot 2.1 需要设定
  cloud:
    nacos:
      discovery:    # 服务注册与发现
        server-addr: ${nacos.server.addr}
        namespace: 611b745b-50b4-492b-8888-536d0b1cc7f7
        cluster-name: DEFAULT
      config:      # 配置管理
        server-addr: ${nacos.server.addr} # 配置中心地址
        # 和上面的服务名称组合成 merchant-application.yaml 作为nacos配置管理的配置项
        file-extension: yaml 
        namespace: 611b745b-50b4-492b-8888-536d0b1cc7f7 # 命令行注入
        group: SHANJUPAY_GROUP # 聚合支付业务组
        ext-config:
        -
          refresh: true
          data-id: spring-boot-http.yaml # spring boot http配置
          group: COMMON_GROUP # 通用配置组
  #SpringMVC上传文件配置
  servlet:
    multipart:
      #默认支持文件上传.
      enabled: true
      #支持文件写入磁盘.
      file-size-threshold: 0
      # 上传文件的临时目录
      location:
      # 最大支持文件大小
      max-file-size: 1MB
      # 最大支持请求大小
      max-request-size: 30MB

dubbo:
  scan:
    # dubbo 服务扫描基准包
    base-packages: com.shanjupay
  protocol:
    # dubbo 协议
    name: dubbo
    port: 20891
  registry:
    address: nacos://127.0.0.1:8848
  application:
    qos:
      port: 22310 # dubbo qos端口配置  命令行注入
  consumer:
    check: false
    timeout: 3000
    retries: -1

logging:
  config: classpath:log4j2.xml
```



> 分布式服务框架Dubbo

服务与服务之间调用采用Dubbo， `@Service` 注册服务， `@Reference` 引用服务。

Dubbo设置调用 `超时timeout`  和是否 `重试retries` ，-1不重试。默认重试2次，请求3次



> 网关：nginx和zuul/gateway

前端访问微服务需要通过网关，网关采用的是 `nginx` 和 `zuul/gateway` 实现。nginx主要做负载均衡的操作，zuul过滤用户请求和判断用户身份，结合spring security来过滤链做实现登录/退出工作。

a. 加入依赖

```xml
 <dependency>
     <groupId>org.springframework.cloud</groupId>
     <artifactId>spring-cloud-starter-netflix-zuul</artifactId>
</dependency>
```



b. 继承ZuulFilter类，重写抽象方法，ZuulFilter实现`Comparable<T>接口的CompareTo()`方法

- filtertype：pre(前) routing（执行服务时） post（后） error（错误）

- shouldFilter：true，采用zuul过滤方式

- filterOrder：数值越小优先级越高
- run()：具体的业务逻辑

c. 启动类添加`@EnableZuulProxy`注解启用Zuul的API网关功能，并且添加自定义的Zuul实现

```java
@SpringBootApplication
@EnableDiscoveryClient
@EnableZuulProxy
public class GatewayBootstrap {

    public static void main(String[] args) {
        SpringApplication.run(GatewayBootstrap.class, args);
    }
    // zuul的实例
    @Bean
    public AuthFilter preFileter() {
        return new AuthFilter();
    }
}
```



##### 缓存Redis
> 数据库和缓存双写的一致性问题

首页服务读取存储于缓存中的广告数据，数据库和缓存双写一致性，采用的`先更新数据库，再删除缓存`，缓存删除失败，采用`消息队列失败重试机制删除`，保证缓存最终是删除成功的，`实现最终一致性`，更新缓存的先删除缓存再更新，保证是最新的。如果说要强一致性，对同个数据的不同操作放到`JVM队列`当中有序执行，对后续重复更新缓存的操作给予过滤，避免重复操作。

- 设置缓存的两种方式

redisTemplate.boundXXXOps(XXX).set(value)

redisTemplate.opsForXXX().set(key, value, timeout)

详情参考：https://blog.csdn.net/lydms/article/details/105224210


- key：服务名称-商品分类-商品id，value：list对象转换成JSON对象

存入：JSON.*toJSON*(payChannelParamDTOS).toString()

获取：JSON.*parseArray*(PayChannelParamDTO_String, PayChannelParamDTO.class);

​    ![0](https://i.loli.net/2021/10/11/Y6Wk2hsOij1HNZF.png)

##### 消息队列 RocketMQ

商品审核通过后，商品服务使用消息队列RocketMQ通知商品详情页服务实现商品页面静态化，以此减少访问数据、服务器压力



> 本项目选用RocketMQ的一个主要原因如下 

1、支持事务消息

2、支持延迟消息

3、天然支持集群、负载均衡

4、支持指定次数和时间间隔的失败消息重发

