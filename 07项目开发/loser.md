

# 1. Java基础

## 1.1 基本数据类型

## 1.2 类/抽象类/接口

## 1.3 集合

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

> 核心思想（必看HashMap+ConcurrentHashMap+线程安全）

`数据结构` ：结合 `数组快速查找`+ `链表/红黑树快速增删` 的特性设计成桶数组的数据结构。

`两次扰动获得数组元素的位置`：通过 key 的hash 后，再把hash值 `高低位异或`，再 与 数组容量长度-1 做`与运算`。

`首次扩容和超阈扩容`：`tableSizefor` 容量大小都是2的幂次方，便于做与运算，减少碰撞；新容量和阈值都扩容为原来的2倍。

`扩容后元素位置的变化`：要么停留在原始位置，要么移动到 `原始位置+旧容量` 这个位置上。

`解决key值重复，如何存储数组` ：数组元素位置相同，hash值相同，key值相同直接 `覆盖`，不相同，遍历链表，以 `尾插法`的形式添加新节点。

`链表和红黑树的转换`：链表长度大于 `8`，并且数组长度大于 `64`，转换为红黑树，红黑树节点数小于 `6`，转换成链表。

`红黑树`：红黑树是解决二叉查找树的顶端优势的解决方案，根据三个原则：`这个树由红色和黑色组成，树的根元素是黑色，不允许相邻节点颜色为红色` ，产生了 `重新着色recolor` 和 `旋转rotation` 策略。

`线程安全问题`：`链表头节点存储元素` 统计存放元素`++size`，ABA，原来的A已经不是原来的A，通过concurrentHashMap解决线程安全的问题。

`线程安全ConcurrentHashMap`：通过 `Synchronized` 与 `Unsafe的CAS方法` 共同完成线程安全操作。`设置节点`，`复制节点`到扩张后的table时采用Synchronized同步机制。`获得阈值SizeCtl` 或 `某个节点`时采用Unsafe的CAS方法；扩容方法 `tryPresize`；添加元素时，检测到某个元素的hash为MOVED，帮助数组扩容 `helpTransfer`；

​       ![0](https://i.loli.net/2021/10/12/Rygi1XrvnaodOKI.png)



（图中有个错误的地方，链表长度是否>=8，否，链表插入，key存在，则覆盖；不存在，则从头遍历到链表尾节点，插入链表尾部节点)

> 数据结构

- hashMap结合数组快速查找+链表/红黑树快速增删的特性设计成桶数组的数据结构，
- 链表解决hash冲突，当具有相同的hash值时，通过equals遍历查找对应的key
- 得到键的哈希码，然后高低位异或运算获得键的hash值，再把键的hash值与数组的长度-1做与运算获得桶数组的下标。 (table.length()-1) & hash
- Node[] table
- 装载因子0.75/阈值/容量

> 扩容机制

- 为指定容量，`首次扩容` 的容量为16，阈值为12；`往后扩容` 的新容量/新阈值都扩充为原值的2倍（左移）（新容量小于最大容量并且老容量大于最小初始化容量）
- 调用有参/无参构造函数创建map 以及 map已经存在元素的情况下，对 新容量和新阈值 赋值操作。
- 链表和红黑树的转换：
- 链表长度大于8并且数组长度大于64的时候，链表转换成红黑树，红黑树的low/high 的TreeNode的长度小于的6的时候，转换成链表

- 数组的容量总是为2的N次方数，tableSizeFor()
- 扩容后，低位链表元素的放在原来位置，高位元素位置=原位置+原数组容量。

#### 红黑树

红黑树是解决二叉查找树的顶端优势的解决方案，根据三个原则：`这个树由红色和黑色组成，树的根元素是黑色，不允许相邻节点颜色为红色` ，产生了 `重新着色recolor` 和 `旋转rotation` 策略。



<img src="https://i.loli.net/2021/10/11/hYkMz8Hy3plfA6u.jpg" style="zoom: 33%;" />

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

3. `没有两个相邻的红色节点`（红色节点不能有红色父节点或红色子节点，`并没有说不能出现连续的黑色节点`）

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

      - 3.1.1 将 parent 和 uncle 标记为黑色

      - 3.1.2 将 grand parent (祖父) 标记为红色

      - 3.1.3 让 X 节点的颜色与 X 祖父的颜色相同，然后重复步骤 2、3

      3.2 如果 X 的 uncle (叔叔) 是黑色，我们要分四种情况处理

      - 3.2.1 左左 (P 是 G 的左孩子，并且 X 是 P 的左孩子)  -》 拉起P，交换 P 和 P的父节点颜色

      - 3.2.2 左右 (P 是 G 的左孩子，并且 X 是 P 的右孩子)  -》 左旋 再按照左左规则

      - 3.2.3 右右 (和 3.2.1 镜像过来，恰好相反)  -》 拉起P，交换 P 和 P的父节点颜色

      - 3.2.4 右左 (和 3.2.2 镜像过来，恰好相反)  -》 右旋 再按照右右规则

### LinkedList（待补充）



## String 类型

> new String("") 与 String = "1231"区别

> String Builder 与 String Buffer区别

- String 中的对象是不可变的，也就可以理解为常量，线程安全。
- String Buffer 对⽅法加了同步锁或者对调⽤的⽅法加了同步锁，所以是线程安全的。
- String Builder 并没有对⽅法进⾏加同步锁，所以是⾮线程安全的。

## 未提问内容

### 单例写法

[参考饿汉和懒汉模式](/04架构设计/设计模式)

编写原则：`私有构造方法+向外提供创建实例的方法`

> 懒汉模式单例：双检查锁机制（线程安全）

```java
public class Singleton {

    private volatile static Singleton instance;
    
    private Singleton() {}
    
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

> 饿汉单例（线程安全）

```java
public class HungrySingleton {    
    private static final HungrySingleton instance = new HungrySingleton();    
    
    private HungrySingleton() {}    
    
    public static HungrySingleton getInstance() {        
    	return instance;
    }
}
```



# 2. Java高级

## 2.1 多线程

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

![](https://i.loli.net/2021/10/13/mJKChgdQ875HMX9.png)

​    ![0](https://i.loli.net/2021/10/13/qEOhTQMb97r1dzR.jpg)

```java
public ThreadPoolExecutor(int corePoolSize,
                          int maximumPoolSize,
                          long keepAliveTime,
                          TimeUnit unit,
                          BlockingQueue<Runnable> workQueue,
                          ThreadFactory threadFactory,
                          RejectedExecutionHandler handler) {
    if (corePoolSize < 0 ||
        maximumPoolSize <= 0 ||
        maximumPoolSize < corePoolSize ||
        keepAliveTime < 0)
        throw new IllegalArgumentException();
    if (workQueue == null || threadFactory == null || handler == null)
        throw new NullPointerException();
    this.acc = System.getSecurityManager() == null ?
        null :
    AccessController.getContext();
    this.corePoolSize = corePoolSize;
    this.maximumPoolSize = maximumPoolSize;
    this.workQueue = workQueue;
    this.keepAliveTime = unit.toNanos(keepAliveTime);
    this.threadFactory = threadFactory;
    this.handler = handler;
}
```

#### 参数、工作流程、线程池状态

> 七大参数

- 核心线程数
- 最大线程数
- 非核心线程超时回收时间
- 时间单位
- 线程工厂
- 阻塞队列
- 拒绝策略

> 拒绝策略

![image-20211013141755537](https://i.loli.net/2021/10/13/MjxrzJZ1pUD3GO5.png)

拒绝策略就是当队列满并且线程池的所有线程（ `核心线程+非核心线程` ）都不空闲时，线程如何去处理新来的任务。

| 拒绝策略类型                      | 说明                                                         | 应用场景                                                     |
| --------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| CallerRunsPolicy() 调用者运行策略 | 只要线程池没有关闭，就由提交任务的 `当前线程处理`。          | 一般在不允许失败、对性能要求不高、并发量较小的场景下使用。   |
| `AbortPolicy() 终止策略`          | 当触发拒绝策略时，直接抛出拒绝执行的 `异常`                  | `默认策略`                                                   |
| DiscardPolicy() 丢弃策略          | 直接 `丢弃`这个任务，不触发任何动作                          | 提交的任务无关紧要，一般用的少。                             |
| DiscardOldestPolicy() 弃老策略    | 弹出队列头部的元素，然后尝试执行，相当于排队的时候把第一个人打死，然后自己代替 | 发布消息、修改消息类似场景。当老消息还未执行，此时新的消息又来了，这时未执行的消息的版本比现在提交的消息版本要低就可以被丢弃了。 |

> 工作流程

- 检查线程池的状态RUNNING  rs（线程池状态） | wc（工作线程数）
- 线程池的线程个数小于核心线程数，则会调用核心线程执行该任务，
- 线程池的线程个数大于核心线程数，则会把任务放入到阻塞队列中，
- 线程池的线程个数大于核心线程数并且阻塞队列已满，调用非核心线程执行从阻塞队列中获取 `poll`任务并执行。
- 线程池的线程个数大于最大线程数，阻塞队列已满，则会调用阻塞策略（默认终止策略，丢弃任务并抛出RejectExecutionException异常）

> 线程池的状态

​    ![0](https://i.loli.net/2021/10/13/k8EUN2wAgFBij5Y.jpg)

- RUNNING 是运行状态，指可以接受任务执行队列里的任务
- SHUTDOWN 指调用了 shutdown() 方法，不再接受新任务了，但是队列里的任务得执行完毕。
- STOP 指调用了 shutdownNow() 方法，不再接受新任务，同时抛弃阻塞队列里的所有任务并中断所有正在执行任务。
- TIDYING（收拾，使整齐） 所有任务都执行完毕，在调用 shutdown()/shutdownNow() 中都会尝试更新为这个状态。
- TERMINATED 终止状态，当执行 terminated() 后会更新为这个状态。

#### 任务管理与线程管理

> 任务管理

- 线程如何从阻塞队列中拿去任务呢？ -》阻塞队列就是生产者存放元素的容器，而消费者也只从容器里拿元素。
- run() -> runWorker(Worker worker) -> getTask()
- 如果线程已经处于空闲状态（没有独占锁），则采用中断的方式释放锁。
- await()纳秒级别的超时等待，循环等待条件是否满足（防止虚假唤醒）/signal signalAll interrupted 超时等待

> 任务管理与线程管理的配合

- 从阻塞队列中获取任务进行调度执行。
- 非核心线程：`workQueue.poll(keepAliveTime, TimeUnit.NANOSECONDS)` 
- 核心线程：`workQueue.take()`;

> 线程空闲后如何回收

（核心线程 `allowcorethreadtimeout 为true` + `非核心线程超时KeepAliveTime`）

- 调用方法：processWorkerExit()方法 + interruptIdleWorkers(false) 方法
- 可重入锁的方式实现 统计已完成任务总数，移除 `HashSet` 存储的该工作线程的 `引用`。
- 循环遍历HashSet中的工作线程，如果该工作线程没有被中断以及处于空闲状态（没有处于 `AQS独占状态`1），则中断该空闲线程

#### 动态化线程池

> 合理配置线程

- IO 密集型任务：尽可能的多配置线程
- CPU 密集型任务：应当分配较少的线程（大量复杂的运算）

根据系统的环境动态设置核心线程数目与最大线程数，配置人工调参，外加系统资源使用监控，负载监控和告警，动态调参

> 线程池的创建方式

- `FixedThreadPool` 和 `SingleThreadPool`： 允许的请求队列长度为 Integer.MAX_VALUE，可能会堆积大量的请求，从而导致 `OOM`
- `CachedThreadPool`： 允许的创建线程数量为 Integer.MAX_VALUE，可能会创建大量的线程，从而导致 OOM
- 使用ThreadPoolExecutor自定义创建

```java
// 自定义线程池
ExecutorService threadPool = new ThreadPoolExecutor(
      2,
      Runtime.getRuntime().availableProcessors(), //CPU的核心数，适合CPU密集型任务
      3,
      TimeUnit.SECONDS,
      new LinkedBlockingDeque<>(3),
      Executors.defaultThreadFactory(),
      new ThreadPoolExecutor.DiscardOldestPolicy()
);
```



### 锁的种类和原理

- 乐观锁与悲观锁

- 独占锁与共享锁

- 公平锁与非公平锁


> 公平锁与非公平锁的应用

- 阻塞队列 `ArrayBlockingQueue`

如果为true则插入或删除时阻塞的线程的队列访问按 FIFO 顺序处理； 如果为false ，则未指定访问顺序。
```java
    public ArrayBlockingQueue(int capacity, boolean fair) {
        if (capacity <= 0)
            throw new IllegalArgumentException();
        this.items = new Object[capacity];
        lock = new ReentrantLock(fair);
        notEmpty = lock.newCondition();
        notFull =  lock.newCondition();
    }
```

- `可重入锁对象` 默认是非公平锁
```java
public ReentrantLock() {
	sync = new NonfairSync();
}
```


> 什么是可重入锁

锁的内部维护一个该锁被哪个线程占用的标识，0 -》 1 -》2  持有锁+1，释放锁-1，当计数器变为0后，线程标识被置为null

> 自旋锁

不会发现线程状态切换，一直处于用户态，不会是线程进入阻塞状态，减少不必要的上下文切换 -XX:PreBlockSpinsh

> synchronized

导致线程上下文的切换和重新调度开销。

### AQS 队列同步器

AQS（AbstractQueuedSynchronizer）抽象同步器，它是全部锁的基础

所谓锁就是`state`值啊，state大于0就是锁已被持有，记录currentThread。
获取锁就是cas修改state为1，可重入就继续加1，释放锁-1，为0就释放了锁。
双向队列保存申请锁的线程，公平锁就看下一个来cas改state的是不是表头。结合lock的lock和unlock看。

- AQS 是一个 FIFO 的双向队列，有队首head和队尾tail元素，队列元素的类型为 Node 。
- 实现锁或其他同步器的基础框架
- 独占模式 EXCLUSIVE：如果一个线程获取到共享资源，修改状态state为1，表示该线程拥有该资源，其他线程尝试获取失败后被阻塞 。例如：`ReentrantLock`
- 共享模式 SHARED：当多个线程去请求资源时，通过 CAS 方式竞争获取资源。当一个线程获取到了资源后另外一个线程再次去获取时，如果当前资源还能满足它的需要，则当前线程只需要使用 CAS 方式进行获取即可。

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

| 队列                  | 有界性             | 锁   | 数据结构   |
| --------------------- | ------------------ | ---- | ---------- |
| ArrayBlockingQueue    | bounded(有界)      | 加锁 | arrayList  |
| LinkedBlockingQueue   | optionally-bounded | 加锁 | linkedList |
| PriorityBlockingQueue | unbounded          | 加锁 | heap       |
| DelayQueue            | unbounded          | 加锁 | heap       |
| SynchronousQueue      | bounded            | 加锁 | 无         |
| LinkedTransferQueue   | unbounded          | 加锁 | heap       |
| LinkedBlockingDeque   | unbounded          | 无锁 | heap       |

```java
//初始化ReentrantLock重入锁，出队入队拥有这同一个锁 
lock = new ReentrantLock(fair);
//初始化非空等待队列
notEmpty = lock.newCondition();
//初始化非满等待队列 
notFull =  lock.newCondition();
```



- 加锁解锁（不满不空的条件对象唤醒signal）
- 阻塞队列（BlockingQueue）是一个支持两个附加操作的队列。这两个附加的操作是：

当队列空时，获取元素的线程会等待队列变为非空。

当队列满时，存储元素的线程会等待队列可用。

- 阻塞队列常用于生产者和消费者的场景，生产者是往队列里添加元素的线程，消费者是从队列里拿元素的线程。阻塞队列就是生产者存放元素的容器，而消费者也只从容器里拿元素



- 阻塞方法：

	- put(E e) 放元素

	- `take()` 拿元素

	- offer(E e,long timeout, TimeUnit unit) 放元素

	- `poll(long timeout, TimeUnit unit)` 拿元素

- 非阻塞方法

	- `offer(E e)`：放元素，将元素e插入到队列末尾，如果插入成功，则返回true；如果插入失败（即队列已满），则返回false；

	- `poll()`：拿元素，移除并获取队首元素，若成功，则返回队首元素；否则返回null；

	- peek()：拿元素，获取队首元素，若成功，则返回队首元素；否则返回null



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



#### wait()/await()/sleep/yield比较

|                      | wait                                  | await                                 | sleep            | yield          |
| -------------------- | ------------------------------------- | ------------------------------------- | ---------------- | -------------- |
| `是否释放持有的锁` | 释放                                  | 释放                                  | 阻塞线程，不释放 | 释放           |
| `调用后何时恢复`   | 唤醒后进入就绪态 notify()/notifyAll() | 唤醒后进入就绪态 signal()/signalAll() | 指定时间后       | 立刻进入就绪态 |
| `谁的方法`         | Object                                | AQS内部类 ConditionObject             | Thread           | Thread         |
| `执行环境`         | synchronized块                        | lock块                                | 任意位置         | 任意位置       |

wait()挂起期间，线程会`释放锁`。假若线程没有释放锁，那么其他线程就无法进入对象的同步方法或同步控制块中，也就无法执行notify() 和 notifyAll()方法来唤醒挂起的线程，从而造成死锁。

> notify() 与 signal() 的区别

notify使用来唤醒使用wait的线程；而signal是用来唤醒await线程

> wait() 和 sleep() 的区别

wait()：当前线程阻塞挂起线程并释放监视器锁；通过notify()/notifyAll()/中断/达到指定时间被唤醒；被中断会抛出InterruptedException；使用在同步代码块中，是Object超类的方法。

sleep()：当前线程让出指定时间的执行权，不参与CPU调度，不会释放锁；休眠时间一到会被唤醒；被中断会抛出InterruptedException；使用在任何地方，是Thread类的方法。

> sleep() 与 yield() 的区别

线程调用 sleep 方法时，调用线程会被阻塞挂起指定的时间，在这期间线程调度器不会去调度该线程 。 

线程调用 yield 方法时，线程只是让出自己剩余的时间片，并没有被阻塞挂起，而是处于就绪状态，线程调度器下一次调度时就有可能调度到当前线程执行 。

#### 条件变量ConditionObject

> 条件变量ConditionObject类

公平或者不公平的可重入锁 ：lock = new ReentrantLock(fair);

不空条件对象：notEmpty = lock.newCondition();

不满条件对象：notFull = lock.newCondition();

> 为什么需要使用condition呢？

简单一句话，lock更灵活。以前的方式只能有一个等待队列，在实际应用时可能需要多个，比如读和写。为了这个灵活性，lock将 `同步互斥控制` 和 `等待队列`分离开来，互斥保证在某个时刻只有一个线程访问临界区（lock自己完成），等待队列负责保存被阻塞的线程（condition完成）。

> synchronized 同时只能与一个共享变量的 notify 或 wait 方法实现同步 ，而 AQS 的一个锁可以对应多个条件变量。

在每个条件变量 内部都维护了 一个条件队列，用来存放调用条件变量的 await()方法时被阻塞的线程 。注意这个条件队列和 AQS 队列不是一 回事。



#### 线程间同步/通信

1. CountDownLatch：主线程开启多个子线程执行任务，等待所有子线程执行完成。（与join()区别，使用await()和countDown(）方法灵活操作）
2. 回环屏障 CyclicBarrier：当所有线程都到达屏障点时才能一块继续向下执行（适用于分步骤执行总任务）
3. 信号量 Semaphore：内部计数器递增  acqurire(M原有值+N新增线程)（release() 信号量+1；acquire(2) 线程一直阻塞，直到信号量达到指定数值）


// 如果构造 Semaphore 对象时，传递的参数为 N，并在 M 个线程中调用了该信号量的 release 方法，那么在调用 acquire 使 M 个线程同步时，传递的参数应该是 M+N。


```java
private static Semaphore semaphore = new Semaphore(0) ;// 创建一个Semaphore 实例
semaphore.release(); // 让信号量递增+1
semaphore.acquire(2);  //传参为 2 说明调用 acquire 方法的线程会一直阻塞，直到信号量的计数变为 2 才会返回 。
```



### 未提问内容

- 线程同步

- 线程死锁
- 线程控制：挂起/停止/恢复
- 未提问内容

## 2.2 输入/输出

  

## 2.3 JVM

### 2.3.1 Java内存模型

- Java内存模型的主要目标是定义程序中各个变量的访问规则
- 工作内存（从主内存拷贝）、主内存（从工作内存同步）：一个变量如何从主内存拷贝到工作内存、如何从工作内存同步到主内存之间
- 线程对变量的所有操作（读取、赋值）都必须在工作内存中进行，而不能直接读写主内存中的变量
- 乱序执行
- 执行重排序

#### 原子性、可见性与有序性

> 原子性(Atomicity)

- 内存模型保证原子性变量的操作：lock [ `主内存-》工作内存`：read、load、assign、use] [ `工作内存-》主内存`：store、write] unlock

- Synchronize 同步块保证原子性变量操作：通过节码指令 [ `同步块`: monitorenter 和 monitorexit] [ `方法`：ACC_SYNCHRONIZED ]完成隐式操作。

> 可见性(Visibility)

是指当一个线程修改了共享变量的值，其他线程也能够立即得知这个通知。主要操作细节就是修改值后将值同步至主内存(volatile 值使用前都会从主内存刷新)，除了 `volatile 还有 synchronize 和 final 可以保证可见性`。同步块的可见性是由“对一个变量执行 unlock 操作之前，必须先把此变量同步会主内存中( store、write 操作)”这条规则获得。而 final 可见性是指：被 final 修饰的字段在构造器中一旦完成，并且构造器没有把 “this” 的引用传递出去( this 引用逃逸是一件很危险的事情，其他线程有可能通过这个引用访问到“初始化了一半”的对象)，那在其他线程中就能看见 final 字段的值。

> 有序性(Ordering)

`Java 语言通过 volatile 和 synchronize 两个关键字来保证线程之间操作的有序性`。volatile 自身就禁止指令重排，而 synchronize 则持有同一个锁的两个同步块只能串行的进入。

### 2.3.2 Java内存结构

#### 堆Heap/元空间MetaSpace/栈Stack（Java栈/本地栈/程序计数器）

​    ![0](https://i.loli.net/2021/10/13/iVO9sYSQHp2u4J1.png)

 `从线程共享的角度来看，堆和元空间是所有线程共享的，而虚拟机栈、本地方法栈、程序计数器是线程内部私有的`

​    ![0](https://i.loli.net/2021/10/13/FVEGpR6eK3iZBrC.png)

1） 如果线程请求的栈深度大于虚拟机所允许的最大深度， 将抛出 `StackOverflowError`异常。

2） 如果虚拟机的栈内存允许动态扩展， 当扩展栈容量无法申请到足够的内存时， 将抛出

`OutOfMemoryError` 异常。



#### GC的过程（OOM)

> Minor GC和Major GC/Full GC

- `Minor GC` 是新生代GC，指的是发生在新生代的垃圾收集动作。由于java对象大都是朝生夕死的，所以Minor GC非常频繁，一般回收速度也比较快。

- `Major GC/Full GC` 是老年代GC，指的是发生在老年代的GC，发生Major GC一般经常会伴有Minor GC，Major GC的速度比Minor GC慢的多。 

- `Major GC`：清理永久代，但是由于很多MajorGC 是由MinorGC 触发的，所以有时候很难将Major GC 和Minor GC区分开。

- `FullGC`：是清理整个堆空间—包括年轻代和永久代。FullGC 一般消耗的时间比较长，远远大于Minor GC，因此，我们必须降低Full GC发生的频率。





​    ![0](https://i.loli.net/2021/10/11/TlXW5Fu4CcD6eOk.jpg)



`java.lang.OutOfMemoryError：Java heap space`: 如果 Survivor 区无法放下，或者超大对象的阈值超过上限，则尝试在老年代中进行分配 ； 如果老年代也无法放下，则会触发 Full Garbage Collection ， 即 `FGC`。如果依然无法放下， 则抛出 `OOM`。

出错时的堆内信息对解决问题非常有帮助 ， 所以给 JVM 设置运行参数 `－XX:+HeapDumpOnOutOfMemoryError`，让JVM遇到 OOM 异常时能输出堆内信息，特别是对相隔数月才出现的 OOM 异常尤为重要。

`StackOverflowError`:表示请求的栈溢出 ， 导致内存耗尽 ， 通常出现在`递归方法中`。



> 触发Major GC/Full GC

- 老年代空间不足

   如果创建一个大对象，Eden区域当中放不下这个大对象，会直接保存在老年代当中，如果老年代空间也不足，就会触发Full GC。为了避免这种情况，最好就是不要创建太大的对象。

- 持久代空间不足

   如果有持久代空间的话，系统当中需要加载的类，调用的方法很多，同时持久代当中没有足够的空间，就出触发一次Full GC

- YGC出现promotion failure（晋升失败）

  promotion failure发生在Young GC, 如果Survivor区当中存活对象的年龄达到了设定值，会就将Survivor区当中的对象拷贝到老年代，如果老年代的空间不足，就会发生promotion failure，接下去就会发生Full GC.

   在发生YGC是会判断，是否安全，这里的安全指的是，当前老年代空间可以容纳YGC晋升的对象的平均大小，如果不安全，就不会执行YGC,转而执行Full GC。

- 显示调用System.gc().可以设置DisableExplicitGC来禁止调用System.gc引发Full GC



> 什么时候新生代的存活对象会到老年代中?

上面的复制算法虽然好,但是总会产生存活对象满了的情况,这个时候大对象想要放入新生代放不下区,该怎么办?

第一种的情况就是将躲过 `15次MinorGC的对象 `移动到老年代.

第二种就是 `动态年龄对象判断`，既Survivor区的经历过两次GC的对象大小大于Survivor区容量的一半的时候,如Survivor区是100m,里面的对象之和大于50m.就将这些2次GC还存活的对象移入到老年代中去.

第三种就是 `大对象` ,还没有进入到新生代的时候就被移动到老年代,这里有个参数,为-XX:PretenureSizeThreshold,可以设置值,比如1m,那么再进入堆内存的时候,就会检查这个实例对象的大小,如果大于这个阈值,就直接进入到老年代。

> Minor GC后存活的对象晋升到老年代时发生Promotion failure，有两种情况会触发Full GC

- 之前每次晋升的对象的平均大小 > 老年代剩余空间
- Minor GC后存活的对象超过了老年代剩余空间

这两种情况都是因为老年代会为新生代对象的晋升提供担保，而每次晋升的对象的大小是无法预测的，所以只能基于统计，一个是基于历史平均水平，一个是基于下一次可能要晋升的最大水平。



### 2.3.3 JVM调优

#### 调优步骤

> 简化步骤说明

- 首先查看系统CPU负载情况： `uptime`  `top`，再看jdk进程号 `jps -l`，直接导出hprof文件，再通过 `eclipse MAT`工具分析

- 其次查看大对象情况 `jmap -histo` 以及 查看GC情况 `jstat -gc`

> 详细步骤说明

- 内存异常的时候，自动dump文件，参数配置：JAVA_OPTS="-XX:HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=\\\"，
- 查看系统CPU负载情况： `uptime`；实时查看系统各个进程占用CPU的情况： `top`
- 通过jps获取虚拟机进程号：` jps -l`
- 导出内存使用情况到文件： `jmap -dump:format=b,file=D:\dump\dumpName.hprof [pid]`
- 查看大对象情况： `jmap -histo [pid] |sort -k 2 -g -r | less`
- 运行时观察gc情况： `jstat -gc [pid] 间隔秒 循环次数`
- 分析Dump文件：通过jdk自身的 `visualVm` 或者 `eclipse MAT` 工具分析（疑点-查看线程栈，retainedHeap最大等等）

​    ![0](https://i.loli.net/2021/10/11/uY1BDpzOPSMjWUH.png)

#### JVM参数设置

> JVM的参数设置：

​    -Xms1G -Xmx2G -Xmn500M -XX:MaxPermSize=64M -XX:+UseConcMarkSweepGC -XX:SurvivorRatio=3

​    Xms 最小内存

​    Xmx 最大内存

​    Xmn 新生代内存

​    Xss 栈大小。线程创建后，分配给每一个线程的大小。

​    -XX:NewRatio=n 设置年轻代与年老代的比值。 如：3 ；年老代:年轻代=3 ,年轻代=1/4；

​    -XX:SurvivorRatio=n 设置年轻代中Eden区与两个Survivor区的比值。如：3 ；Eden:Survivor=3:2,则一个Survivor占了1/5

​    -XX:MaxPermSize = n 设置持久代大小

> 垃圾回收统计信息：

​    -XX:+PrintGC 

​    -XX:+PrintGCDetails

​    -XX:+PrintGCTimesStamps

​    -Xloggc:filename

​    -XX :PreBlockSpinsh=10 多线程获取锁的方式自旋锁，在不释放CPU资源的情况下，设置最大的尝试次数

​    -XX:MaxTenuringThreshold：对象晋升老年代的年龄阈值(在年轻代存活时间)

### 2.3.4 类加载机制

#### 双亲委派模型



​    ![0](https://i.loli.net/2021/10/13/FRIV89xUMLciDtd.png)

两个关键问题：`是否加载过` 与 `是否可以加载`

> 类加载器种类

`1) 启动类加载器(Bootstrap ClassLoader)：`

负责加载存放在 `$JAVA_HOME\jre\lib`下，或被-Xbootclasspath参数指定的路径中的，并且能被虚拟机识别的类库（如rt.jar，所有的 `java.*`开头的类均被Bootstrap ClassLoader加载）。启动类加载器是无法被Java程序直接引用的。

`2) 扩展类加载器(ExtensionClassLoader):`

Java语言编写的，该加载器由 `sun.misc.Launcher$ExtClassLoader` 实现，它负责加载 `$JAVA_HOME\jre\lib\ext`目录中，或者由 `java.ext.dirs`系统变量指定的路径中的所有类库（如javax.*开头的类），开发者可以直接使用扩展类加载器。

`3) 应用程序类加载器(Application ClassLoader)`

Java语言编写，该类加载器由 `sun.misc.Launcher$AppClassLoader` 来实现，它负责加载用户类路径 `ClassPath`所指定的类，开发者可以直接使用该类加载器，如果应用程序中没有自定义过自己的类加载器，一般情况下这个就是程序中默认的类加载器。

`4) 用户自定义类加载器(CustomClassLoader)`

Java语言编写的，用户自定义类加载器，可以加载指定路径的class文件

自定义类加载器的核心在于对字节码文件的获取，如果是加密的字节码则需要在该类中对文件进行解密。

> 双亲委派模型的好处

`1）保证了JVM提供的核心类不被篡改，保证class执行安全`

比如上文的string类，无论哪个加载器要加载这个类的话，由于双亲委派机制，最终都会交由最顶层的启动类加载器来加载，这样保证了string类在各种类加载器环境中，都是同一个类。试想下，没有双亲委派机制的话，各个加载器自己加载string类，有可能不同类加载器加载的string方法不一样，那样的话，我们的程序是不是就会一片混乱了。

`2）防止重复加载同一个class`

从双亲委派机制流程图中，我们可以看出，委托向上问一问，如果加载过，就不用再加载了。

#### 类的生命周期

![image-20211013222546976](https://i.loli.net/2021/10/13/4cloHIUaPkwgf8p.png)

其中类加载的过程包括了 `加载、验证、准备、解析、初始化` 五个阶段。在这五个阶段中，加载、验证、准备和初始化这四个阶段发生的顺序是确定的，而解析阶段则不一定，它在某些情况下可以在初始化阶段之后开始，这是为了支持Java语言的运行时绑定（也成为动态绑定或晚期绑定）。另外注意这里的几个阶段是按顺序开始，而不是按顺序进行或完成，因为这些阶段通常都是互相交叉地混合进行的，通常在一个阶段执行的过程中调用或激活另一个阶段

### 2.3.5 垃圾回收算法

> 对象存活判定

- 引用计数：引用为0时可以回收。
- 可达性分析：一个对象到GC Roots没有任何引用链时，证明对象不可达，不可用。

`GC Roots`包括：虚拟机栈中引用对象、本地方法栈中JNI引用对象、方法区中类静态属性实体引用对象、常量引用对象。

> 垃圾回收算法

- 复制算法：`新生代`
- 标记-清理算法：`老年代`
- 标记-压缩算法：`老年代`

> 安全点

`安全点`是以“是否具有 `让程序长时间执行`的特征”为原则进行选定的，所以 `方法调用、 循环跳转、 异常跳转`这些位置都可能会被设置成安全点。为避免设置的安全点过多，对于 `循环次数较少`(int类型或者更小数据范围的类型) 的不会被放置在安全点，`可数循环`；对于 `循环次数较大`（long或者更大数据范围的类型）会被放置在安全点，`不可数循环`

### 2.3.6 垃圾收集器

#### CMS收集器（UseConcMarkSweepGC）并发标记清理收集器

CMS（Concurrent Mark Sweep）收集器是一种以 `获取最短回收停顿时间为目标的收集器`。目前很大一部分的Java应用都集中在互联网站或B/S系统的服务端上，这类应用尤其重视服务的响应速度，希望系统停顿时间最短，以给用户带来较好的体验。

从名字（包含“Mark Sweep”）上就可以看出CMS收集器是基于“标记-清除”算法实现的，它的运行过程包括以下四个步骤： 

- 1. 初始标记（CMS initial mark）
  2. 并发标记（CMS concurrent mark）
  3. 重新标记（CMS remark）
  4. 并发清除（CMS concurrent sweep）

`第 a、b步的初始标记和重新标记阶段依然会引发 STW ，而第c、d 步的并发标记和并发清除两个阶段可以和应用程序并发执行，也是比较耗时的操作，但并不影响应用程序的正常执行。`

`具体过程：`初始标记仅仅只是标记一下GC Roots能直接关联到的对象，速度很快，并发标记阶段就是进行GC Roots Tracing的过程，而重新标记阶段则是为了修正并发标记期间，因用户程序继续运作而导致标记产生变动的那一部分对象的标记记录，这个阶段的停顿时间一般会比初始标记阶段稍长一些，但远比并发标记的时间短。由于整个过程中耗时最长的并发标记和并发清除过程中，收集器线程都可以与用户线程一起工作，所以总体上来说，CMS收集器的内存回收过程是与用户线程一起并发地执行。

> 优缺点

`优点`：并发收集`、`低停顿

`缺点`：产生大量空间碎片、并发阶段会降低吞吐量

> 参数控制：

`-XX:+UseConcMarkSweepGC` 使用CMS收集器

`-XX:+UseCMSCompactAtFullCollection` Full GC后，进行一次碎片整理；整理过程是独占的，会引起停顿时间变长

`-XX:+CMSFullGCsBeforeCompaction` 设置进行几次Full GC后，进行一次碎片整理

-`XX:ParallelCMSThreads` 设定CMS的线程数量（一般情况约等于可用CPU数量）

> 由于 CMS 采用的是 “标记-清除算法” ，因此产生大量的空间碎片。

为了解决这个问题， CMS 可以通过配置`-XX:+UseCMSCompactAtFullCollection` 参数，强制 JVM 在 FGC 完成后对老年代进行压缩 ， 执行一次空间碎片整理 ，但是空间碎片整理阶段也会引发  `STW`。为了减少 STW 次数， CMS 还可以通过配置`-XX :+CMSFullGCsBeforeCompaction=n` 参数， `在执行了 n 次 FGC 后， JVM 再在老年代执行空间碎片整理。`

​    ![0](https://i.loli.net/2021/10/13/ODBeyGEQIZrWujx.png)

## 2.4 反射

  

## 未提问内容

# 4. 数据库

## 4.1 Oracle

### SQL优化原理：

索引/分区/分库/分表 -》 大部分数据走索引，少部分数据物理读

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

一般我们创建对象都是new关键的方式，有了Spring了之后，可以使用注解创建Bean对象，@Compoment @Service @Respository @Mapper @Autowired @Resource

`DI(Dependecy Inject,依赖注入)`是实现控制反转的一种设计模式，依赖注入就是将实例变量传入到一个对象中去。



### Spring Aop实现原理和应用

#### 意义和作用

作用：在不修改源代码的情况下，可以实现功能的增强。

传统的纵向体系代码复用：

​    ![0](https://i.loli.net/2021/10/14/3pIYRsB6qzGVcPf.png)

横向抽取机制（AOP思想）：

​    ![0](https://i.loli.net/2021/10/14/hWdAuvtnswcjTDJ.png)

AOP 思想： 基于代理思想，对原来目标对象，创建代理对象，`在不修改原对象代码情况下，通过代理对象，调用增强功能的代码，从而对原有业务方法进行增强 ！`

#### 应用场景

场景一： `记录日志`

场景二： `监控方法运行时间 （监控性能）`

场景三： 权限控制

场景四： 缓存优化 （第一次调用查询数据库，将查询结果放入内存对象， 第二次调用， 直接从内存对象返回，不需要查询数据库 ）

场景五：  `事务管理 `（调用方法前开启事务， 调用方法后提交关闭事务 ）

#### 实现原理：JDK动态代理和CGLIB代理

`把公共部分抽离出来封装，对目标类的方法进行增强操作。`

- JDK代理 生成代理类是 `实现接口的目标类`

return Proxy.newProxyInstance(类加载器， 字节码对象， InvocationHandler对象的invoke方法)

```java
import java.lang.reflect.InvocationHandler;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import com.mengma.dao.CustomerDao;
import com.mengma.dao.CustomerDaoImpl;
public class MyBeanFactory {
    public static CustomerDao getBean() {
        // 准备目标类
        final CustomerDao customerDao = new CustomerDaoImpl();
        // 创建切面类实例
        final MyAspect myAspect = new MyAspect();
        // 使用代理类，进行增强
        return (CustomerDao) Proxy.newProxyInstance(
            MyBeanFactory.class.getClassLoader(), 
            new Class[] {CustomerDao.class}, 
            new InvocationHandler() {
                public Object invoke(Object proxy, Method method, 
                                     Object[] args) throws Throwable {
                    myAspect.myBefore(); // 前增强
                    Object obj = method.invoke(customerDao, args);
                    myAspect.myAfter(); // 后增强
                    return obj;
            }
        });
    }
}
```



![image-20211014093659713](https://i.loli.net/2021/10/14/IjEtXD7oOpP8kAV.png)



MapperProxy代理

```java
protected T newInstance(MapperProxy<T> mapperProxy) {
    // 利用JDK的动态代理生成mapper的代理实例
    return (T) Proxy.newProxyInstance(mapperInterface.getClassLoader(), 
                                      new Class[] { mapperInterface }, mapperProxy);
}
```



- CGLIB代理 生成代理类是 `目标类的子类`

`CGLIB（Code Generation Library）`是一个高性能开源的 `代码生成包`，它被许多 AOP 框架所使用，其底层是通过使用一个小而快的`字节码处理框架 ASM`（Java字节码操控框架）转换字节码并生成新的类

`CGLIB 的核心类 Enhancer`

`intercept()` 方法相当于 JDK 动态代理方式中的 `invoke()` 方法，该方法会在目标方法执行的前后，对切面类中的方法进行增强；

```java
import java.lang.reflect.Method;
import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;
import com.mengma.dao.GoodsDao;
import com.mengma.jdk.MyAspect;
public class MyBeanFactory {
    public static GoodsDao getBean() {
        // 准备目标类
        final GoodsDao goodsDao = new GoodsDao();
        // 创建切面类实例
        final MyAspect myAspect = new MyAspect();
        // 生成代理类，CGLIB在运行时，生成指定对象的子类，增强
        Enhancer enhancer = new Enhancer();
        // 设置增强的类
        enhancer.setSuperclass(goodsDao.getClass());
        // 设置回调函数
        enhancer.setCallback(new MethodInterceptor() {
            // intercept 相当于 jdk invoke，前三个参数与 jdk invoke—致
            @Override
            public Object intercept(Object proxy, Method method, Object[] args, 
                                    MethodProxy methodProxy) throws Throwable {
                myAspect.myBefore(); // 前增强
                Object obj = method.invoke(goodsDao, args); // 目标方法执行
                myAspect.myAfter(); // 后增强
                return obj;
            }
        });
        // 创建代理类
        GoodsDao goodsDaoProxy = (GoodsDao) enhancer.create();
        return goodsDaoProxy;
    }
}
```

#### AspectJ基于注解开发

| 名称            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| @Aspect         | 用于定义一个切面。                                           |
| @Before         | 用于定义前置通知，相当于 BeforeAdvice。                      |
| @After          | 用于定义后置通知，不管是否异常，该通知都会执行。             |
| @Around         | 用于定义环绕通知，相当于MethodInterceptor。                  |
| @AfterThrowing  | 用于定义异常通知，相当于ThrowAdvice。（抛异常执行）          |
| @AfterReturning | 用于定义返回通知，相当于 AfterReturningAdvice。（无异常返回） |

> 正常情况

​    ![0](https://i.loli.net/2021/10/14/pbrgshMKOm7C6vN.png)

> 异常情况

 ![0](https://i.loli.net/2021/10/14/VFeikm9qLQoPUJy.png)

解释：执行到核心业务方法或者类时，会先执行AOP。在aop的逻辑内，先走 `@Around` 注解的方法。然后是 `@Before`注解的方法，然后这两个都通过了，走核心代码，核心代码走完，无论核心有没有返回值，都会走 `@After`方法。然后如果程序无异常，正常返回就走 `@AfterReturn`,有异常就走 `@AfterThrowing`



> 创建切面类

```java
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.AfterThrowing;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;
//切面类
@Aspect
@Component
public class MyAspect {
    // 用于取代：<aop:pointcut expression="execution(*com.mengma.dao..*.*(..))" id="myPointCut"/>
    // 要求：方法必须是private，没有值，名称自定义，没有参数
    @Pointcut("execution(*com.mengma.dao..*.*(..))")
    private void myPointCut() {
    }
    // 前置通知
    @Before("myPointCut()")
    public void myBefore(JoinPoint joinPoint) {
        System.out.print("前置通知，目标：");
        System.out.print(joinPoint.getTarget() + "方法名称:");
        System.out.println(joinPoint.getSignature().getName());
    }
    // 返回通知
    @AfterReturning(value = "myPointCut()")
    public void myAfterReturning(JoinPoint joinPoint) {
        System.out.print("返回通知，方法名称：" + joinPoint.getSignature().getName());
    }
    // 环绕通知
    @Around("myPointCut()")
    public Object myAround(ProceedingJoinPoint proceedingJoinPoint)throws Throwable {
        System.out.println("环绕开始"); // 开始
        Object obj = proceedingJoinPoint.proceed(); // 执行当前目标方法
        System.out.println("环绕结束"); // 结束
        return obj;
    }
    // 异常通知
    @AfterThrowing(value = "myPointCut()", throwing = "e")
    public void myAfterThrowing(JoinPoint joinPoint, Throwable e) {
        System.out.println("异常通知" + "出错了" + e.getMessage());
    }
    // 后置通知
    @After("myPointCut()")
    public void myAfter() {
        System.out.println("后置通知");
    }
}
```

> spring配置文件增加

```xml
    <!-- 扫描含com.mengma包下的所有注解 -->
    <context:component-scan base-package="com.mengma"/>
    <!-- 开启切面自动代理 -->
    <aop:aspectj-autoproxy></aop:aspectj-autoproxy>
```



### Spring 生命周期

`对于普通的 Java 对象来说，它们的生命周期就是`

- 实例化
- 该对象不再被使用时通过垃圾回收机制进行回收

`对于 Spring Bean 的生命周期来说`

- 实例化 Instantiation
- 属性赋值 Populate
- 初始化 Initialization
- 销毁 Destruction

`实例化 -> 属性赋值 -> 初始化 -> 销毁`

​    ![0](https://i.loli.net/2021/10/14/fQsBklbyEZz75LV.jpg)

图 1 Bean 的生命周期

Bean 生命周期的整个执行过程描述如下。

1）根据配置情况 `调用 Bean 构造方法 或 工厂方法 实例化 Bean`。

2）利用 `依赖注入`完成 Bean 中所有属性值的配置注入。

3）如果 Bean 实现了 BeanNameAware 接口，则 Spring 调用 Bean 的 `setBeanName() `方法传入当前 Bean 的 id 值。

4）如果 Bean 实现了 BeanFactoryAware 接口，则 Spring 调用 `setBeanFactory()` 方法传入当前工厂实例的引用。

5）如果 Bean 实现了 ApplicationContextAware 接口，则 Spring 调用 `setApplicationContext()` 方法传入当前 ApplicationContext 实例的引用。

6）如果 BeanPostProcessor 和 Bean 关联，则 Spring 将调用BeanPostProcessor接口的 `预初始化方法 postProcessBeforeInitialzation() `对 Bean 进行加工操作，此处非常重要，Spring 的 AOP 就是利用它实现的。

7）如果 Bean 实现了 InitializingBean 接口，则 Spring 将调用 `afterPropertiesSet() `方法。

8）如果在配置文件中通过 `init-method` 属性指定了初始化方法，则调用该初始化方法。

9）如果 BeanPostProcessor 和 Bean 关联，则 Spring 将调用BeanPostProcessor接口的`后初始化方法 postProcessAfterInitialization()`。此时，Bean 已经可以被应用系统使用了。

10）根据作用范围决定不同的处理方法

如果在 中指定了该 Bean 的作用范围为 `scope="singleton"`，则将该 Bean 放入 `Spring IOC 的缓存池`中，将触发 Spring 对该 Bean 的生命周期管理；

如果在 中指定了该 Bean 的作用范围为 `scope="prototype"`，则将该 Bean 交给 `调用者`，调用者管理该 Bean 的生命周期，Spring 不再管理该 Bean。

11）如果 Bean 实现了 DisposableBean 接口，则 Spring 会调用 `destory()`方法将 Spring 中的 Bean 销毁；如果在配置文件中通过 `destory-method` 属性指定了 Bean 的销毁方法，则 Spring 将调用该方法对 Bean 进行销毁。

总结：Spring 为 Bean 提供了细致全面的生命周期过程，通过实现特定的接口或属性设置，都可以对 Bean 的生命周期过程产生影响。虽然可以随意配置属性，但是建议不要过多地使用 Bean 实现接口，因为这样会导致代码和 Spring 的聚合过于紧密。

### Spring 循环依赖

结合Spring的生命周期：实例化Bean，设置属性，初始化等环节思考，也就是Spring的创建到消亡过程去思考的它的循环依赖问题。避免使用`构造函数`设置循环依赖的属性，可通过 `setter/field属性`设置循环依赖属性

Spring内部有三级缓存：

- singletonObjects 一级缓存，用于保存实例化、注入、初始化完成的bean实例
- earlySingletonObjects 二级缓存，用于保存实例化完成的bean实例
- singletonFactories 三级缓存，用于保存bean创建工厂，以便于后面扩展有机会创建代理对象。

`对象出现的顺序：SingletonFactories -> earlySingletonObjects -> singletonObjects`

下面用一张图告诉你，spring是如何解决循环依赖的：

![image-20211014105840540](https://i.loli.net/2021/10/14/t4ymsErSdHgMYf9.png)



> 循环依赖注入过程

让我们来分析一下“A的某个field或者setter依赖了B的实例对象，同时B的某个field或者setter依赖了A的实例对象”这种循环依赖的情况。A首先完成了初始化的第一步，并且将自己提前曝光到singletonFactories中，此时进行初始化的第二步，发现自己依赖对象B，此时就尝试去get(B)，发现B还没有被create，所以走create流程，B在初始化第一步的时候发现自己依赖了对象A，于是尝试get(A)，尝试一级缓存singletonObjects(肯定没有，因为A还没初始化完全)，尝试二级缓存earlySingletonObjects（也没有），尝试三级缓存singletonFactories，由于 `A通过ObjectFactory将自己提前曝光`了，所以B能够通过 `ObjectFactory.getObject`拿到A对象(虽然A还没有初始化完全，但是总比没有好呀)，B拿到A对象后顺利完成了初始化阶段1、2、3，完全初始化之后将自己放入到一级缓存singletonObjects中。此时返回A中，A此时能拿到B的对象顺利完成自己的初始化阶段2、3，最终A也完成了初始化，进去了一级缓存singletonObjects中，而且更加幸运的是，由于B拿到了A的对象引用，所以B现在hold住的A对象完成了初始化。



使用三级缓存实现提前曝光的过程，Bean的查找过程，先从一级缓存SingletonObject中查找有无对象B，再去二级缓存earlySingletonObject中查找，再去三级缓存singletonFactories查找，在三级缓存中找对象A（未完成创建），对象B拿到对象A的引用，完成populateBean，最终把对象B存到SingletonObjects中。再去操作对象A的实例化。





### Spring 作用域

- singleton : 唯一 bean 实例，Spring 中的 bean 默认都是单例的。
- prototype : 每次请求都会创建一个新的 bean 实例。
- request : 每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP request 内有效。
- session : 每一次 HTTP 请求都会产生一个新的 bean，该 bean 仅在当前 HTTP session 内有效。
- global-session： 全局 session 作用域，仅仅在基于 Portlet 的 web 应用中才有意义，Spring5 已经没有了。Portlet 是能够生成语义代码（例如：HTML）片段的小型 Java Web 插件。它们基于 portlet 容器，可以像 servlet 一样处理 HTTP 请求。但是，与 servlet 不同，每个 portlet 都有不同的会话。

### Spring 注解

将一个类声明为Spring的Bean有注解有： 
@Component @Controller @Service @Respository @Autowired @Qualifier @Resource

@Autowired 与 @Resource 区别

### Spring事务

#### 事务传播行为

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

#### 事务隔离级别

- 读取未提交（Read Uncommitted）：事务可以读取未提交的数据，也称作脏读（Dirty Read）。一般很少使用。
- 读取已提交（Read Committed）：是大都是 DBMS （如：Oracle, SQLServer）默认事务隔离。执行两次同意的查询却有不同的结果，也叫不可重复读。
- 可重复读（Repeatable Read）：是 MySQL 默认事务隔离级别。能确保同一事务多次读取同一数据的结果是一致的。可以解决脏读的问题，但理论上无法解决幻读（Phantom Read）的问题。
- 可串行化（Serializable）：是最高的隔离级别。强制事务串行执行，会在读取的每一行数据上加锁，这样虽然能避免幻读的问题，但也可能导致大量的超时和锁争用的问题。很少会应用到这种级别，只有在非常需要确保数据的一致性且可以接受没有并发的应用场景下才会考虑。

| solation Level   | 脏读可能性（Dirty Read） | 不可重复读可能性（Non Repeatable Read） | 幻读可能性（Phantom Read） |
| ---------------- | ------------------------ | --------------------------------------- | -------------------------- |
| read Uncommitted | Yes                      | Yes                                     | Yes                        |
| read Committed   | -                        | Yes                                     | Yes                        |
| repeatable Read  | -                        | -                                       | Yes                        |
| serializable     | -                        | -                                       | -                          |

> 脏读/不可重复读/幻读

- 脏读：读取其他事务还没提交的数据。
- 不可重复读：同一条数据两次查询有不同的结果，因为其它事务可能在UPDATE操作。
- 幻读：事务 B 根据条件查询到了 N 条数据，但这时事务 A， INSERT或 DELETE了 M 条符合事务 B 查询条件的数据。事务 B 再次查询结果就和上一次不一致了，得到了 N+M 条数据。

### Spring 单例Bean的线程安全问题

存在安全问题，当多个线程修改成员属性中含有写操作的对象时，会有线程安全的问题。

通过定义 成员属性 threadLocal 变量

修改Bean的作用域 prototype

### Spring 设计模式

[详情参考](https://note.youdao.com/s/WgCbrBRb)

> 工厂模式

> 单例模式

> 模版方法

> 代理模式（Spring Aop）

> 适配器模式（Spring MVC的适配器）

> 观察者模式（监听）

> 装饰着模式（扩展属性和行为）

### 未提问内容



## 5.2 SpringMVC

### 工作原理

- `前端控制器DispatcherServlet`：Spring MVC 所有的请求都经过 DispatcherServlet 来统一分发，在 DispatcherServlet 将请求分发给 Controller 之前需要借助 Spring MVC 提供的 HandlerMapping 定位到具体的 Controller。

- `处理器映射器HandlerMapping`：HandlerMapping 接口负责完成客户请求到 Controller 映射。

- `处理器适配器HandlerAdapter：`调用具体的方法对用户发来的请求来进行处理。

- `处理器Handler（Controller）`：Controller 接口将处理用户请求，这和 [Java](http://c.biancheng.net/java/) Servlet 扮演的角色是一致的。一旦 Controller 处理完用户请求，将返回 ModelAndView 对象给 DispatcherServlet 前端控制器，ModelAndView 中包含了模型（Model）和视图（View）。
  - 从宏观角度考虑，DispatcherServlet 是整个 Web 应用的控制器；从微观考虑，Controller 是单个 Http 请求处理过程中的控制器，而 ModelAndView 是 Http 请求过程中返回的模型（Model）和视图（View）。

- `视图解析器ViewResolver`：ViewResolver 接口（视图解析器）在 Web 应用中负责查找 View 对象，从而将相应结果渲染给客户。

​    ![0](https://i.loli.net/2021/10/14/H97isnqQkz6xoSc.png)

图 1 Spring MVC 工作原理图

从图 1 可总结出 Spring MVC 的工作流程如下：

1. 客户端（浏览器）发送请求，直接请求到 DispatcherServlet。
2. DispatcherServlet 根据请求信息调用 HandlerMapping，解析请求对应的 Handler。
3. 解析到对应的 Handler（也就是我们平常说的 Controller 控制器）后，开始由 HandlerAdapter 适配器处理。
4. HandlerAdapter 会根据 Handler 来调用真正的处理器来处理请求，并处理相应的业务逻辑。
5. 处理器处理完业务后，会返回一个 ModelAndView 对象，Model 是返回的数据对象，View 是个逻辑上的 View。
6. ViewResolver 会根据逻辑 View 查找实际的 View。
7. DispaterServlet 把返回的 Model 传给 View（视图渲染）。
8. 把 View 返回给请求者（浏览器）

`总结：前端控制器会根据处理器映射器传过来的Controller与已经注册好的处理器适配器一一匹配。如果找到处理器适配器与Controller匹配，则调用处理器适配器的handler方法，通过反射机制执行Controller的具体的方法来获得模型试图。通过视图解析器解析视图，然后把模型数据填充到视图中，即渲染视图，响应用户请求。`

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

### 常用注解

> @RequestMapping @GetMapping() @PostMapping



> @PathVariable与@RequestParam



> @ResponseBody与@RequestBody



> @Controller与@RestController



> @Resource、@Qualifier与@Autowired





### 未提问内容

x 正数的值越小，该servlet的优先级越高，应用启动时就越先加载。当值相同时，容器就会自己选择顺序来加载。

获取请求参数以及参数绑定

通过Controller控制器处理方法的形参获取

通过注解获取参数

## 5.3 Spring Boot

### 自动配置原理

@SpringBootApplication -》 @EnableAutoConfiguration，SpringApplication.run(...)的内部就会执行selectImports()方法，找到所有 JavaConfig自动配置类的全限定名对应的class

META-INF/spring.factories

@EnableAutoConfiguration -》xxxxAutoConfiguration



自动生效

- @ConditionalOnBean：当容器里有指定的bean的条件下。
- @ConditionalOnMissingBean：当容器里不存在指定bean的条件下。
- @ConditionalOnClass：当类路径下有指定类的条件下。
- @ConditionalOnMissingClass：当类路径下不存在指定类的条件下。
- @ConditionalOnProperty：指定的属性是否有指定的值，比如@ConditionalOnProperties(prefix=”xxx.xxx”, value=”enable”, matchIfMissing=true)，代表当xxx.xxx为enable时条件的布尔值为true，如果没有设置的情况下也为true。



@EnableConfigurationProperties -》 XXXProperties



### 配置加载顺序

- 命令行参数。所有的配置都可以在命令行上进行指定；
- 来自java:comp/env的JNDI属性；
- Java系统属性（System.getProperties()）；
- 操作系统环境变量 ；
- jar包外部的application-{profile}.properties或application.yml(带spring.profile)配置文件
- jar包内部的application-{profile}.properties或application.yml(带spring.profile)配置文件 再来加载不带profile
- jar包外部的application.properties或application.yml(不带spring.profile)配置文件
- jar包内部的application.properties或application.yml(不带spring.profile)配置文件
- @Configuration注解类上的@PropertySource

根据第7条，我们只要在jar包同目录外放置一个application.properties配置文件，就会起作用，同时这个配置文件的优先级还比jar内的高，这个配置很有作用！！

### YAML 配置



### 核心配置文件

> Bootstrap.properties 和 application.properties



### 安全问题

> Spring Security 和 Shiro



> 跨域CSRF



### 前后端分离第三方工具Swagger



## 5.4 Spring Cloud

### 5.4.1 Spring Security

#### 工作原理

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

## 5.5 Spring Cloud Alibaba

### 注册中心和配置中心(Nacos)

### 分布式服务框架(Dubbo)

### 消息队列(RocketMQ)

### 分布式解决方案(Seata)

### 断路器(Sentinel)



## 5.6 Spring Cloud Netflix

### 服务发现(Eureka)

### 断路器(Hystrix)

### 智能路由(Zuul)

### 客户端负载均衡(Ribbon-Feign)

### 服务之间的调用（RESTFUL）



## 未提问内容

# 6. 中间件

## 6.1 持久化框架

### 6.1.1 Mybatis

#### 工作原理



#### 核心组件



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



## 6.3 分布式服务框架Dubbo

### 失败重试与超时重试机制

### 未提问内容



## 6.4 注册中心

### 6.4.1 Zookeeper

#### Zookeeper选举机制

### 未提问内容

## 未提问内容

# 7. 计算机网络

## 7.1 计算机网络体系结构：OSI/TCP/IP



## 7.2 TCP三次握手和四次挥手

### TCP三次握手

### TCP四次挥手

标识：

头部信息：源端口 目的端口 序列号 确认号 标志位 校验和 紧急指针

标志位：SYN FIN ACK

序列号 确认号

TIME_WAIT（确认服务端已经收到最后发出的确认信息） LAST_WAIT（确认客户端发过来的内容）

整个过程的头部信息的变化

## 7.3 HTTP与HTTPS的区别

安全性和资源消耗SSL（加密算法对称和非对称）/TLS 端口

## 7.4 浏览器输入url后的处理

## 7.5 TCP与UDP协议





## 未提问内容

## 线程通信

## 进程通信

# 10. 算法

## 10.1 数据结构

### 10.1.1 数组（Array）

（静态数组、动态数组）


### 10.1.2 栈（Stack）

### 10.1.3 链表（Linked List）

（单向链表、双向链表、循环链表）

### 10.1.4 队列（Queue）

### 10.1.5 树（Tree）

（二叉树、查找树、平衡树（AVL树/红黑树）、B树、B+树）


### 10.1.6 散列表（Hash）

### 10.1.7 堆（Heap）


### 10.1.8 图（Graph）



## 10.2 常规算法

### 排序算法



### 查找算法



### 回溯算法



### 动态规划算法



### 双指针算法



### 滑动窗口算法



### 递归算法（二叉树）



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

