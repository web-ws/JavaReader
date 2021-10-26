

# 1. Java基础

## 1.1 基本数据类型与包装数据类型



基本数据类型与包装数据类型区别

== 与equals的区别（hashCode）





### String 类型

> new String("") 与 String = "1231"区别

> String Builder 与 String Buffer区别

- String 中的对象是不可变的，也就可以理解为常量，线程安全。
- String Buffer 对⽅法加了同步锁或者对调⽤的⽅法加了同步锁，所以是线程安全的。
- String Builder 并没有对⽅法进⾏加同步锁，所以是⾮线程安全的。





## 1.2 类/抽象类/接口

## 1.3 集合Collection/map

### 1.3.1 Collection



#### Set（无序）

Set接口有两个子类：HashSet和TreeSet 。 

HashSet 

特点：不重复、无序。（通过hashMap的Key值保证）

要求：需要为类重写`hashCode()` 和 `equals()`方法。 

TreeSet

特点：不重复，有序。

要求：需要为类实现 `Comparable`接口，并重写`compareTo()`方法。 重写 `compareTo()` 可以同时完成两份工作：排序和消除重复。

##### HashSet

HashSet借用HashMap的key存储添加的元素，实现元素的`不重复性、无序`。

```java
	private static final Object PRESENT = new Object();
	// HashSet构造方法
    public HashSet() {
        map = new HashMap<>();
    }
	//添加元素
    public boolean add(E e) {
        return map.put(e, PRESENT)==null;
    }
```

#### SortSet（有序）

####  List

List 接口直接继承 Collection 接口，它定义为可以存储重复元素的集合，并且元素按照插入顺序有序排列，且可以通过索引访问指定位置的元素。常见的实现有：ArrayList、LinkedList、Vector 和 Stack。

##### LinkedList

`非线程安全`，采用以下方法变成线程安全：

```java
List list = Collections.synchronizedList(new LinkedList(...));
```

- linkedList为双链表，通过size，两个指针：first和last指针，每个节点有item自身、前驱prev和后驱next两个节点来维护双链表的关系。

- 添加元素 `add(E e) -> linkLast(Node<E> e)`，首先创建新的节点，然后通过尾节点判断它是新链表（first指向它）还是有数据链表（last.next 指向它）

- 删除元素`remove(int index) -> unlink(Node<E> e)`，获取节点元素本身，前驱节点，后驱节点；判断前驱节点是否为空，后驱节点是否为空，分别置空。最后把删除节点的本身置空null，尺寸size--， modCount--；



查找某个位置节点的值，二分查找法

```java

    /**
     * Returns the (non-null) Node at the specified element index.
     */
	// 返回指定index位置的节点
    Node<E> node(int index) {
        // assert isElementIndex(index);
		// 首先去比较index和size >> 1（也就是size的一半），如果比中间数小则从链表头找，否则从尾找
        if (index < (size >> 1)) {
            Node<E> x = first;
            for (int i = 0; i < index; i++)
                x = x.next;
            return x;
        } else {
            Node<E> x = last;
            for (int i = size - 1; i > index; i--)
                x = x.prev;
            return x;
        }
    }
```

##### ArrayList原理和扩容机制

> 添加大量数据前，提前扩容

- list.ensureCapacity(initCapacity)

> 获取长度的方式

- length属性是针对数组
- length()方法是针对字符串
- size()方法是针对泛型集合

> 扩容grow()：

- 当添加第1个元素时，数组容量0->10，添加第11个元素时，数组容量15，每次扩容后，当前容量变为原来容量的1.5倍，最大值为Integer.MAX_VALUE - 8

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

##### 什么场景下更适宜使用LinkedList，而不用ArrayList

我前面已经提到，很多场景下ArrayList更受欢迎，但是还有些情况下LinkedList更为合适。譬如：

- 你的应用不会随机访问数据。因为如果你需要LinkedList中的第n个元素的时候，你需要从第一个元素顺序数到第n个数据，然后读取数据。

- 你的应用更多的插入和删除元素，更少的读取数据。因为插入和删除元素不涉及重排数据，所以它要比ArrayList要快。

以上就是关于ArrayList和LinkedList的差别。你需要一个不同步的基于索引的数据访问时，请尽量使用ArrayList。ArrayList很快，也很容易使用。但是要记得要给定一个合适的初始大小，尽可能的减少更改数组的大小。

综合来说，在需要频繁读取集合中的元素时，更推荐使用 ArrayList，而在插入和删除操作较多时，更推荐使用 LinkedList。

### 1.3.2 Map

#### HashMap工作原理和扩容机制

> 核心思想（必看HashMap+ConcurrentHashMap+线程安全）

`数据结构` ：结合 `数组快速查找`+ `链表/红黑树快速增删` 的特性设计成桶数组的数据结构。

`两次扰动获得数组元素的位置`：通过 key 的hash 后，再把hash值 `高低位异或`，再 与 数组容量长度-1 做`与运算`。

`首次扩容和超阈扩容`：`tableSizefor` 容量大小都是2的幂次方（17-》32，20-》32），便于做与运算，减少碰撞；新容量和阈值都扩容为原来的2倍。

`扩容后元素位置的变化`：要么停留在原始位置，要么移动到 `原始位置+旧容量` 这个位置上。

`解决key值重复，如何存储数组` ：数组元素位置相同，hash值相同，key值相同直接 `覆盖`，不相同，遍历链表，以 `尾插法`的形式添加新节点。

`链表和红黑树的转换`：链表长度大于 `8`，并且数组长度大于 `64`，转换为红黑树，红黑树节点数小于 `6`，转换成链表。

`红黑树`：红黑树是解决二叉查找树的顶端优势的解决方案，根据三个原则：`这个树由红色和黑色组成，树的根元素是黑色，不允许相邻节点颜色为红色` ，产生了 `重新着色recolor` 和 `旋转rotation` 策略。

`线程安全问题`：`链表头节点存储元素` 统计存放元素`++size`，ABA，原来的A已经不是原来的A，通过concurrentHashMap解决线程安全的问题。

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

#### ConcurrentHashMap

`线程安全ConcurrentHashMap`：通过 `Synchronized` 与 `Unsafe的CAS方法` 共同完成线程安全操作。`设置节点`，`复制节点`到扩张后的table时采用Synchronized同步机制。`获得阈值SizeCtl` 或 `某个节点`时采用Unsafe的CAS方法；扩容方法 `tryPresize`；添加元素时，检测到某个元素的hash为MOVED，帮助数组扩容 `helpTransfer`；



ConcurrentHashMap 选择了与 HashMap 相同的Node数组+链表+红黑树结构；在锁的实现上，抛弃了原有的 Segment 分段锁，采用CAS + synchronized实现更加细粒度的锁。

将锁的级别控制在了更细粒度的哈希桶数组元素级别，也就是说只需要锁住这个链表头节点（红黑树的根节点），就不会影响其他的哈希桶数组元素的读写，大大提高了并发度。

存取的过程：

1. 根据 key 计算出 hash 值；

2. 判断是否需要进行初始化；

3. 定位到 Node，拿到首节点 f，判断首节点 f：

   1. 如果为 null ，则通过 Unsafe.CAS 的方式尝试添加；

   2. 如果为 f.hash = MOVED = -1 ，说明其他线程在扩容，参与一起扩容HelpTransfer；

   3. 如果都不满足 ，synchronized 锁住 f 节点，判断是链表还是红黑树，遍历插入；

4. 当在链表长度达到 8 ，数组容量小于64的时候，数组扩容；数组容量大于64的时候，将链表转换为红黑树。

get的过程：

1. 根据 key 计算出 hash 值，判断数组是否为空；
2. 如果是首节点，就直接返回；
3. 如果是[红黑树](https://blog.csdn.net/jump/super-jump/word?word=红黑树)结构，就从[红黑树](https://blog.csdn.net/jump/super-jump/word?word=红黑树)里面查询；
4. 如果是[链表](https://blog.csdn.net/jump/super-jump/word?word=链表)结构，循环遍历判断。

> ConcurrentHashMap 的 get 方法是否要加锁，为什么？★★★

get 方法不需要加锁。因为 Node 的元素 value 和指针 next 是用 volatile 修饰的，在多线程环境下线程A修改节点的 value 或者新增节点的时候是对线程B可见的。

```java
volatile V val;
volatile Node<K,V> next;
```

> get 方法不需要加锁与 volatile 修饰的哈希桶数组有关吗？★★★

没有关系。哈希桶数组table用 volatile 修饰主要是保证在数组扩容的时候保证可见性。

```java
transient volatile Node<K,V>[] table;
```



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



## 异常

![image-20211025223153423](https://i.loli.net/2021/10/25/nYx7FIZSdEvmaRh.png)



### 何为异常

程序运行时，发生的不被期望的事件，它阻止了程序按照程序员的预期正常执行，这就是`异常`。

### 异常关键字

- **try：**用于监听try代码是否抛出异常。
- **catch：**用于捕获try语句快发生的异常。
- **finally：**finally语句块总是会被执行。它主要用于回收在try块里打开的物力资源(如数据库连接、网络连接和磁盘文件)。
- **throw：**用于抛出异常。
- **throws ：**用在方法签名中声明该方法可能抛出的异常，异常交给调用者处理。

### 异常类型

- Error:  Java虚拟机无法解决的严重问题。如：JVM系统内部错误、资源耗尽等严重情况。一般不编写针对性的代码进行处理。

- Exception: 其它因编程错误或偶然的外在因素导致的一般性问题，可以使用针对性的代码进行处理。例如：空指针访问、试图读取不存在的文件、网络连接中断
  - 运行时异常 UnCheckException：是指编译器不要求强制处置的异常。一般是指编程时的逻辑错误，是程序员应该积极避免其出现的异常。如：继承RuntimeException的异常、IndexOutOfBoundsException、IllegalArgument、NullpointerException、ClassCastException
  - 编译时异常 CheckException：是指编译器要求必须处置的异常。即程序在运行时由于外界因素造成的一般性异常。编译器要求java程序必须捕获或声明所有编译时异常。如：SQLException、IOException、ClassNotfoundException

### 异常处理机制

```java
try{   
......    // 可能产生异常的代码
}catch( ExceptionName1 e ){
   ......    // 当产生ExceptionName1型异常时的处置措施
}catch( ExceptionName2 e ){
    ......     // 当产生ExceptionName2型异常时的处置措施
} 
[ finally{
......     //无论是否发生异常，都无条件执行的语句      
 }  ]
```

### 创建自定义异常类

继承RuntimeException类，表明这个类是运行时异常，不受编译器检查。

```java
public class BusinessException extends RuntimeException {

    private ErrorCode errorCode;

    public BusinessException(ErrorCode errorCode) {
        super();
        this.errorCode = errorCode;
    }
    public BusinessException() {
        super();
    }

    public void setErrorCode(ErrorCode errorCode) {
        this.errorCode = errorCode;
    }

    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
```



异常说明枚举类

```java
public enum CommonErrorCode implements ErrorCode {

   ////////////////////////////////////公用异常编码 //////////////////////////
   E_100101(100101,"传入参数与接口不匹配"),
   E_100102(100102,"验证码错误"),

   E_NO_AUTHORITY(999997,"没有访问权限"),
   CUSTOM(999998,"自定义异常"),
   /**
    * 未知错误
    */
   UNKNOWN(999999,"未知错误");

   private int code;
   private String desc;

   @Override
   public int getCode() {
      return code;
   }

   @Override
   public String getDesc() {
      return desc;
   }

   private CommonErrorCode(int code, String desc) {
      this.code = code;
      this.desc = desc;
   }

   public static CommonErrorCode setErrorCode(int code) {
       for (CommonErrorCode errorCode : CommonErrorCode.values()) {
           if (errorCode.getCode() == code) {
               return errorCode;
           }
       }
          return null;
   }
}
```





## Java事件处理机制

java中的事件机制的参与者有3种角色：

- event object：事件状态对象，用于listener的相应的方法之中，作为参数，一般存在与listerner的方法之中
- event source：具体的事件源，比如说，你点击一个button，那么button就是event source，要想使button对某些事件进行响应，你就需要注册特定的listener。
- event listener：对每个明确的事件的发生，都相应地定义一个明确的Java方法。这些方法都集中定义在事件监听者（EventListener）接口中，这个接口要继承 java.util.EventListener。 实现了事件监听者接口中一些或全部方法的类就是事件监听者。

![image-20211024093227362](https://i.loli.net/2021/10/24/jnOmIiwo3FMv8cH.png)

调度框架：输入事件/输出事件/时间事件

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

- 通过Synchronize与手动加锁和解锁的方式 volatile



> Synchronized与lock的区别？







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

- Excutors工具类提供newXXXThreadPool方式创建：

1）`newFixedThreadPool` 和`newSingleThreadPool`允许请求队列长度最大：

允许的请求队列长度为 Integer.MAX_VALUE，队列可能会堆积大量的任务，从而导致 OOM。

2）`newCachedThreadPool` 和 `ScheduledThreadPool`允许的创建线程最大：

允许的创建线程数量为 Integer.MAX_VALUE，可能会创建大量的线程，从而导致 OOM。



- 使用ThreadPoolExecutor自定义参数创建

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

### ThreadLocal工作原理

> 简单介绍

- Thread类中有两个变量 threadLocals 和 inheritableThreadLocals ，二者都是ThreadLocal内部类，ThreadLocalMap类似于一个HashMap。

- 每个线程通过访问自己线程内部的 ThreadLocalMap 对象内的 value，避免多线程间的资源共享问题，从而实现线程安全。由于ThreadLocalMap的 Entry 类的 key为 ThreadLocal 的弱引用，而 value 为 强引用，所以当 ThreadLocal 没有被外部强引用的时候，在垃圾回收时，它的key会被清理掉，value保留，造成内存泄漏风险，ThreadcalMap提供了 set()、 getEntry() 、remove() 等方法供 ThreadLocal 调用，ThreadLocal通过调用remove()方法清理掉 key 为 null 的记录。

- ThreadLocal不支持继承性，父线程设置值之后，子线程无法访问。父线程创建子线程的时候，ThreadLocalMap中的构造函数会将 父线程的 inheritableThreadLocals中的变量复制一份到子线程的 inheritableThreadLocals 变量中。



![image-20211025233915639](https://i.loli.net/2021/10/25/A6EeY1UIrJV7jCu.png)



[详情查看](https://www.cnblogs.com/fsmly/p/11020641.html)

> 什么是局部变量

线程局部变量是局限于线程内部的变量，属于线程自身所有，不在多个线程间共享。Java提供ThreadLocal类来支持线程局部变量，是一种实现线程安全的方式。但是在管理环境下（如 web 服务器）使用线程局部变量的时候要特别小心，在这种情况下，工作线程的生命周期比任何应用变量的生命周期都要长。任何线程局部变量一旦在工作完成后没有释放，Java 应用就存在内存泄露的风险。

> 使用场景

经典的使用场景是为每个线程分配一个 JDBC 连接 Connection。这样就可以保证每个线程的都在各自的 Connection 上进行数据库的操作，不会出现 A 线程关了 B线程正在使用的 Connection； 还有 Session 管理 等问题。

> ThreadLocal造成内存泄漏的原因?

ThreadLocalMap 中使用的 `key 为 ThreadLocal 的弱引用,而 value 是强引用`。所以，如果 ThreadLocal 没有被外部强引用的情况下，在垃圾回收的时候，key 会被清理掉，而 value 不会被清理掉。这样一来，ThreadLocalMap 中就会出现key为null的Entry。假如我们不做任何措施的话，value 永远无法被GC 回收，这个时候就可能会产生内存泄露。ThreadLocalMap实现中已经考虑了这种情况，在调用 set()、get()、remove() 方法的时候，会清理掉 key 为 null 的记录。使用完 ThreadLocal方法后 最好手动调用remove()方法



> ThreadLocal内存泄漏解决方案？

- 每次使用完ThreadLocal，都调用它的remove()方法，清除数据。

- 在使用线程池的情况下，没有及时清理ThreadLocal，不仅是内存泄漏的问题，更严重的是可能导致业务逻辑出现问题。所以，使用ThreadLocal就跟加锁完要解锁一样，用完就清理。
  

> ThreadLocal 不支持继承性

同一个ThreadLocal变量在父线程中被设置值后，在子线程中是获取不到的。（threadLocals中为当前调用线程对应的本地变量，所以二者自然是不能共享的）

InheritableThreadLocal类能提供子线程访问父线程的本地变量的



### 未提问内容

- 线程同步

- 线程死锁
- 线程控制：挂起/停止/恢复
- 未提问内容

## 2.2 输入/输出I/O

### IO、NIO、AIO

[参考详情](/01编程语言/Java/JavaIO)

- IO流（同步、阻塞）

- NIO（同步、非阻塞）

NIO之所以是同步，是因为它的accept/read/write方法的内核I/O操作都会阻塞当前线程

Channel（通道）、Buffer（缓冲区）、Selector（选择器）



- NIO2（异步、非阻塞）AIO



IO 都是同步阻塞模式，所以需要多线程以实现多任务处理。而 NIO 则是利用了单线程轮询事件的机制，通过高效地定位就绪的 Channel，来决定做什么，仅仅 select 阶段是阻塞的，可以有效避免大量客户端连接时，频繁线程切换带来的问题，应用的扩展能力有了非常大的提高

## 2.3 JVM

### 2.3.1 Java内存模型

- Java内存模型的主要目标是定义程序中各个变量的访问规则
- 工作内存（从主内存拷贝）、主内存（从工作内存同步）：一个变量如何从主内存拷贝到工作内存、如何从工作内存同步到主内存之间
- 线程对变量的所有操作（读取、赋值）都必须在工作内存中进行，而不能直接读写主内存中的变量
- 乱序执行
- 执行重排序

#### 原子性、可见性与有序性

> 原子性(Atomicity)

- 内存模型保证原子性变量的操作：lock [ `主内存-》工作内存`：read、load、assign、use] [ `工作内存-》主内存`：store、write ] unlock

- Synchronize 同步块保证原子性操作：通过节码指令 [ `同步块`: monitorenter 和 monitorexit] [ `方法`：ACC_SYNCHRONIZED ]完成隐式操作。

> 可见性(Visibility)

是指当一个线程修改了共享变量的值，其他线程也能够立即得知这个通知。主要操作细节就是修改值后将值同步至主内存(volatile 值使用前都会从主内存刷新)，除了 `volatile 还有 synchronize 和 final 可以保证可见性`。同步块的可见性是由 `对一个变量执行 unlock 操作之前，必须先把此变量同步会主内存中( store、write 操作)` 这条规则获得。而 final 可见性是指：被 final 修饰的字段在构造器中一旦完成，并且构造器没有把 “this” 的引用传递出去( this 引用逃逸是一件很危险的事情，其他线程有可能通过这个引用访问到“初始化了一半”的对象)，那在其他线程中就能看见 final 字段的值。

> 有序性(Ordering)

`Java 语言通过 volatile 和 synchronize 两个关键字来保证线程之间操作的有序性`。volatile 自身就`禁止指令重排`，而 synchronize 则持有同一个锁的两个同步块只能串行的进入。

> synchronized与volatile的区别？

通过原子性、可见行、有序性阐述它们的区别？



### 2.3.2 Java内存结构

#### 堆Heap/元空间MetaSpace/栈Stack（Java栈/本地栈/程序计数器）

![0](https://i.loli.net/2021/10/13/iVO9sYSQHp2u4J1.png)

 `从线程共享的角度来看，堆和元空间是所有线程共享的，而虚拟机栈、本地方法栈、程序计数器是线程内部私有的`

- 堆内存：字符串常量、对象
- 元空间：类元信息、成员变量、静态属性、方法、常量等类的相关信息。
- JVM栈：方法的执行内存区域，包括局部变量表、操作栈、动态链接、方法返回地址。
- Native栈：本地方法服务
- 程序计数器：用于线程存放执行指令的偏移量和行号指示器等，线程执行或恢复都要依赖程序计数器。



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



![0](https://i.loli.net/2021/10/11/TlXW5Fu4CcD6eOk.jpg)



`java.lang.OutOfMemoryError：Java heap space`: 如果 Survivor 区无法放下，或者超大对象的阈值超过上限，则尝试在老年代中进行分配 ； 如果老年代也无法放下，则会触发 Full Garbage Collection ， 即 `FGC`。如果依然无法放下， 则抛出 `OOM`。

出错时的堆内信息对解决问题非常有帮助 ， 所以给 JVM 设置运行参数 `－XX:+HeapDumpOnOutOfMemoryError`，让JVM遇到 OOM 异常时能输出堆内信息，特别是对相隔数月才出现的 OOM 异常尤为重要。

`StackOverflowError`:表示请求的栈溢出 ， 导致内存耗尽 ， 通常出现在`递归方法中`。



> 触发Major GC/Full GC

- 老年代空间不足

   如果创建一个大对象，Eden区域当中放不下这个大对象，会直接保存在老年代当中，如果老年代空间也不足，就会触发Full GC。为了避免这种情况，最好就是不要创建太大的对象。

- 持久代空间不足

   如果有持久代空间的话，系统当中需要加载的类，调用的方法很多，同时持久代当中没有足够的空间，就出触发一次Full GC

- YGC出现promotion failure（晋升失败）

  promotion failure发生在Young GC， 如果Survivor区当中存活对象的年龄达到了设定值，会就将Survivor区当中的对象拷贝到老年代，如果老年代的空间不足，就会发生promotion failure，接下去就会发生Full GC.

   在发生YGC是会判断，是否安全，这里的安全指的是，当前老年代空间可以容纳YGC晋升的对象的平均大小，如果不安全，就不会执行YGC，转而执行Full GC。

- 显示调用System.gc().可以设置DisableExplicitGC来禁止调用System.gc引发Full GC



> 什么时候新生代的存活对象会到老年代中?

上面的复制算法虽然好，但是总会产生存活对象满了的情况，这个时候大对象想要放入新生代放不下区，该怎么办?

第一种的情况就是经过 `15次MinorGC的对象 `移动到老年代.(默认15岁，配置参数`-XX:MaxTenuringThreshold`)

第二种就是 `动态年龄对象判断`，相同年龄所有对象的大小总和大于Survivor空间的一半，那么年龄大于等于该年龄的对象就会被移动到老年代，而不用等到15岁(默认)，如Survivor区是100m，里面的对象之和大于50m.就将这些2次GC还存活的对象移入到老年代中去.

第三种就是 `大对象` ，还没有进入到新生代的时候就被移动到老年代，这里有个参数，为`-XX:PretenureSizeThreshold`，可以设置值，比如1m，那么再进入堆内存的时候，就会检查这个实例对象的大小，如果大于这个阈值，就直接进入到老年代。

第四种就是SurvivorTo区放不下，进行MinorGC的时候，发现ToSpace区放不下，那么把存活的对象放到老年代。

> Minor GC后存活的对象晋升到老年代时发生Promotion failure（晋升失败），有两种情况会触发Full GC

- 历次晋升对象的平均大小 > 老年代连续空间
- 新生代对象总大小 > 老年代连续空间

这两种情况都是因为老年代会为新生代对象的晋升提供担保，而每次晋升的对象的大小是无法预测的，所以只能基于统计，一个是基于历史平均水平，一个是基于下一次可能要晋升的最大水平。



### 2.3.3 JVM调优

#### 调优步骤

> 简化步骤说明

- 首先查看系统CPU负载情况： `uptime`  `top`，再看jdk进程号 `jps -l`，直接导出hprof文件，再通过 `eclipse MAT`工具分析

- 其次查看存活大对象情况 `jmap -histo:live` 以及 查看GC情况 `jstat -gc`

> 详细步骤说明

- 内存异常的时候，自动dump文件，参数配置：JAVA_OPTS="-XX:HeapDumpOnOutOfMemoryError -XX:HeapDumpPath=\\\"，
- 查看系统CPU负载情况： `uptime`；实时查看系统各个进程占用CPU的情况： `top`
- 通过jps获取虚拟机进程号：` jps -l`
- 导出内存使用情况到文件： `jmap -dump:format=b,file=D:\dump\dumpName.hprof [pid]`
- 查看存活大对象情况： `jmap -histo:live [pid] | sort -k 2 -g -r | less`
- 运行时观察gc情况： `jstat -gc [pid] 间隔秒 循环次数`
- 分析Dump文件：通过jdk自身的 `visualVm` 或者 `eclipse MAT` 工具分析（疑点-查看线程栈，retainedHeap最大等等）

​    ![0](https://i.loli.net/2021/10/11/uY1BDpzOPSMjWUH.png)

#### 常见问题排查

参考文章

- [一文学会Java死锁和CPU 100% 问题的排查技巧](https://www.cnblogs.com/aflyun/p/11141369.html)

- [记一次生产环境JAVA服务SYNCHRONIZED死锁的处理过程](https://www.freesion.com/article/65451353038/)
  - 通过阿里开源的 `arthas` 工具分析线程：查找进程的阻塞线程有哪些以及它被哪个线程阻塞。定义web容器的最大线程数，连接超时时间，socket超时时间等

##### Java死锁如何排查和解决？

jps -l

jstack -l pid

查看到有死锁发生

![image-20211026081403677](https://i.loli.net/2021/10/26/mOoyDh1MNJERA7q.png)

通过jvisualVm查看

![Java Visual VM](https://i.loli.net/2021/10/26/13MsF9QABz6YNZt.png)

切换到线程栏，检查死锁发生情况

![死锁检测](https://i.loli.net/2021/10/26/NZB5stJxH3z6m7w.png)



##### 服务器CPU占用率高达到100%排查和解决？

总体目标：获取进程中的CPU占用率最大的线程

使用top命令查看cpu使用情况

再使用jps -l找出与cpu占用量最大相同的pid

找出cpu占用较高的线程TID（转换成16进制），pidstat -p < PID > 1 3 -u -t

查看进程具有的线程jstack pid（查看它的运行状态NEW -》 RUNNABLE -》BLOCKED -》WAITING -》TIMED-WAITING -》 TERMINATED ）

注意⚠️：使用工具快速查看线程使用情况：show-busy-java-threads、阿里-arthas



#### JVM参数设置

> JVM的参数设置：

​    -Xms1G -Xmx2G -Xmn500M -XX:MaxPermSize=64M -XX:+UseConcMarkSweepGC -XX:SurvivorRatio=3

​    Xms 最小内存

​    Xmx 最大内存

​    Xmn 新生代内存

​    Xss 栈大小。线程创建后，分配给每一个线程的大小。

​    -XX:NewRatio=n 设置年轻代与年老代的比值。 如：3 ；年老代:年轻代=3 ，年轻代=1/4；

​    -XX:SurvivorRatio=n 设置年轻代中Eden区与两个Survivor区的比值。如：3 ；Eden:Survivor=3:2，则一个Survivor占了1/5

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



> 简化过程：

工作原理：从下往上问：是否加载过？从上往下问：是否可以加载？classNotFound

作用：保证JVM核心类不被随意篡改，不重复加载相同的class



两个关键问题：`是否加载过` 与 `是否可以加载`。自底向上问加载器，是否加载过？还没有？直到顶部的启动类加载器，顶部启动类加载器没有加载过这个类的话，从从上到下问加载器，是否能加载这个类？知道底部的自定义加载器，它都没有加载过，那只好报classNotFound



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

#### 对象存活判定

- 引用计数：引用为0时可以回收。
- 可达性分析：一个对象到GC Roots没有任何引用链时，证明对象不可达，不可用。

`GC Roots`包括：虚拟机栈中引用对象、本地方法栈中JNI引用对象、方法区中类静态属性实体引用对象、常量引用对象。

#### 垃圾回收算法

- 标记-复制算法：`新生代`
- 标记-清理算法：`老年代`
- 标记-压缩算法：`老年代`

> 安全点

`安全点`是以“是否具有 `让程序长时间执行`的特征”为原则进行选定的，所以 `方法调用、 循环跳转、 异常跳转`这些位置都可能会被设置成安全点。为避免设置的安全点过多，对于 `循环次数较少`(int类型或者更小数据范围的类型) 的不会被放置在安全点，`可数循环`；对于 `循环次数较大`（long或者更大数据范围的类型）会被放置在安全点，`不可数循环`

### 2.3.6 垃圾收集器

> 简化版本

jdk1.7 默认垃圾收集器Parallel Scavenge（新生代【标记-复制算法】）+ Parallel Old（老年代【标记整理算法】）

jdk1.8 默认垃圾收集器Parallel Scavenge（新生代）+Parallel Old（老年代）

jdk1.9 默认垃圾收集器G1【从局部(两个Region之间)来看是基于"标记—复制"算法实现，从整体来看是基于"标记-整理"算法实现】

高并发的场景采用：ParNew（新生代）+ CMS（老年代）

用户线程和GC线程的串行与并行

着重看 CMS + ParNew + ParOld



> 详情版本



```shell
# 查看默认参数
java -XX:+PrintCommandLineFlags -version
# 查看GC的具体情况
java -XX:+PrintGCDetails -version
```

#### 0. 垃圾收集器组合

![img](https://i.loli.net/2021/10/24/XLckGmzaY2jCiUV.png)



1. `-XX:+UseParallelGC`和`-XX:+UseParallelOldGC`结果一样，都是用的`Parallel Old`（在 JDK 7U4 之前确实 `UserParallelGC` 用的就是 `Serial`，在这个版本之后 `Parallel` 已经很成熟了，所以直接替换了旧的收集器，所以 JDK 7u4 以后的 7 和 JDK 8 老年代默认使用的都是 `Parallel` 收集器）
2. `PS MarkSweep`只是回收器的别名，他可以指代`Serial Old`和`Parallel Old`。

#### 1. Serial 收集器

![img](https://i.loli.net/2021/10/24/bByP7uUCeK8G5cF.jpg)



Serial 翻译为串行，也就是说它以串行的方式执行。

它是单线程的收集器，只会使用一个线程进行垃圾收集工作。

它的优点是简单高效，在单个 CPU 环境下，由于没有线程交互的开销，因此拥有最高的单线程收集效率。

它是 Client 场景下的默认新生代收集器，因为在该场景下内存一般来说不会很大。它收集一两百兆垃圾的停顿时间可以控制在一百多毫秒以内，只要不是太频繁，这点停顿时间是可以接受的。

#### 2. ParNew 收集器

![img](https://i.loli.net/2021/10/24/4O6GklUcs5bwVBC.jpg)



它是 Serial 收集器的多线程版本。

它是 Server 场景下默认的新生代收集器，除了性能原因外，主要是因为除了 Serial 收集器，只有它能与 CMS 收集器配合使用。

#### 3. Parallel Scavenge 收集器（推荐）

与 ParNew 一样是多线程收集器。

其它收集器目标是尽可能缩短垃圾收集时用户线程的停顿时间，而它的目标是达到一个可控制的吞吐量，因此它被称为“吞吐量优先”收集器。这里的吞吐量指 CPU 用于运行用户程序的时间占总时间的比值。

停顿时间越短就越适合需要与用户交互的程序，良好的响应速度能提升用户体验。而高吞吐量则可以高效率地利用 CPU 时间，尽快完成程序的运算任务，适合在后台运算而不需要太多交互的任务。

缩短停顿时间是以牺牲吞吐量和新生代空间来换取的：新生代空间变小，垃圾回收变得频繁，导致吞吐量下降。

可以通过一个开关参数打开 `GC 自适应的调节策略（GC Ergonomics）`，就不需要手工指定新生代的大小（-Xmn）、Eden 和 Survivor 区的比例、晋升老年代对象年龄等细节参数了。虚拟机会根据当前系统的运行情况收集性能监控信息，`动态调整`这些参数以提供最合适的停顿时间或者最大的吞吐量。

#### 4. Serial Old 收集器

![img](https://i.loli.net/2021/10/24/o5v2t3riBlcDMAj.jpg)



是 Serial 收集器的老年代版本，也是给 Client 场景下的虚拟机使用。如果用在 Server 场景下，它有两大用途：

- 在 JDK 1.5 以及之前版本（Parallel Old 诞生以前）中与 Parallel Scavenge 收集器搭配使用。
- 作为 CMS 收集器的后备预案，在并发收集发生 Concurrent Mode Failure 时使用。

#### 5. Parallel Old 收集器（推荐）

![img](https://i.loli.net/2021/10/24/Mb6H4YzwLOWv9Iq.jpg)



是 Parallel Scavenge 收集器的老年代版本。

在注重吞吐量以及 CPU 资源敏感的场合，都可以优先考虑 Parallel Scavenge 加 Parallel Old 收集器。

#### 6. CMS 收集器（推荐）

（UseConcMarkSweepGC）并发标记清理收集器

CMS（Concurrent Mark Sweep）收集器是一种以 `获取最短回收停顿时间为目标的收集器`。目前很大一部分的Java应用都集中在互联网站或B/S系统的服务端上，这类应用尤其重视服务的响应速度，希望系统停顿时间最短，以给用户带来较好的体验。

从名字（包含“Mark Sweep”）上就可以看出CMS收集器是基于“标记-清除”算法实现的，它的运行过程包括以下四个步骤： 


1. 初始标记（CMS initial mark）
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

![0](https://i.loli.net/2021/10/13/ODBeyGEQIZrWujx.png)






## 2.4 反射

  

## 未提问内容

# 4. 数据库

## 4.1 Oracle

### SQL执行

系统全局内存区域（system global area，SGA）/进程共享内存区域（process global area，PGA）

重点讲解：共享池中的库高速缓存和数据库高速缓存

![0](https://i.loli.net/2021/10/23/X9kxlTISvmVNaqM.png)

 **SGA-共享池**

- 在库高速缓存中存储解析过的SQL语句，同样的SQL语句只会被解析一次。

​    ![0](https://i.loli.net/2021/10/23/I6RqBplUoAfOkGW.png)

- 共享池的内存区域对已经加载过的SQL语句执行淘汰算法：LRU/FIFO（基本思想是保留最频繁的以及最近使用的语句）/LFU
- 高效利用共享池，SQL语句尽量共享。

​    ![0](https://i.loli.net/2021/10/23/TthPFoWcKXlBqbY.png)

**2.3 库高速缓存（保存已经解析过的语句的区域）**

- 解析包括：语法/检验提及的对象/确认该对象的用户权限；
- 解析通过后，验证该语句之前是否执行过。
- 软解析：已经存在，取回现有解析信息并重用
- 硬解析：不存在，完成所有的解析工作，并存于缓存中以便将来重用

​    ![0](https://i.loli.net/2021/10/23/mxY8FTOoGB2VIzt.png)

- 软解析比硬解析花费更少的时间

​    ![0](https://i.loli.net/2021/10/23/SJsMNX3Y5xOfGCw.png)





- 主要步骤：解析，（读取绑定变量值），执行，提取

​    ![0](https://i.loli.net/2021/10/23/rzEqVlvsaWKgiOD.png)

   

 

![0](https://i.loli.net/2021/10/23/XJPlwK9rGLCWgbq.png)











### SQL基础 左右连接



### SQL优化

#### 优化原理

- 索引/分区/分库/分表 -》 大部分数据走索引，少部分数据物理读。

- 更新统计信息

- 复合索引满足：最左匹配原则

#### 如何查询出执行慢的SQL语句

设置定时任务，每天早上获取是否有需要优化的SQL语句，有的话进行`告警`提示。

> Oracle通过dba权限账号查询获取

- 查询执行最慢的sql

```sql
select *
 from (select sa.SQL_TEXT,
    sa.SQL_FULLTEXT,
    sa.EXECUTIONS "执行次数",
    round(sa.ELAPSED_TIME / 1000000, 2) "总执行时间",
    round(sa.ELAPSED_TIME / 1000000 / sa.EXECUTIONS, 2) "平均执行时间",
    sa.COMMAND_TYPE,
    sa.PARSING_USER_ID "用户ID",
    u.username "用户名",
    sa.HASH_VALUE
   		from v$sqlarea sa
   		left join all_users u
   		on sa.PARSING_USER_ID = u.user_id
   		where sa.EXECUTIONS > 0 where u.username='填写同户名'
   		order by (sa.ELAPSED_TIME / sa.EXECUTIONS) desc)
 where rownum <= 50;#查询的数据数目
```



- 查询次数最多的sql

```sql
select *
 from (select s.SQL_TEXT,
   s.EXECUTIONS "执行次数",
   s.PARSING_USER_ID "用户名",
   rank() over(order by EXECUTIONS desc) EXEC_RANK
   from v$sql s
   left join all_users u
   on u.USER_ID = s.PARSING_USER_ID) t
 where exec_rank <= 100;
```



> Mysql 通过配置方式获取

```shell
mysql> set global slow_query_log=1;
# 定义时间SQL查询的超时时间
mysql> set global long_query_time = 0.005;
# 查看慢查询日志的保存路径
mysql> show global variables like ‘slow_query_log_file’;
# 查看慢查询
cat /var/log/mysql/slow.log
```



### 分库分表







### 事务隔离级别

### 未提问内容

## 4.2 Redis

[详情查看](/04架构设计/缓存Redis)

### 数据类型

> string

1. 常用命令: set、get、strlen、exists、decr、incr、setex 等等。
2. 应用场景 ：一般常用在计数的场景，比如用户的访问次数、热点文章的点赞转发数量等。

> list：双向链表

1. 常用命令: rpush、lpop、lpush、rpop、lrange、llen 等。
2. 应用场景: 发布与订阅或者消息队列、慢查询。

> hash

1. 常用命令： hset、hmset、hexists、hget、hgetall、hkeys、hvals 等。

2. 应用场景: 系统中对象数据的存储。

3. 底层存储结构，ziplist（压缩列表）与 hashtable（哈希表）。当hash对象可以同时满足一下两个条件时，哈希对象使用ziplist编码。

   - 哈希对象保存的所有键值对的键和值的字符串长度都小于64字节

   - 哈希对象保存的键值对数量小于512个

   当不满足上述要求时，则使用 hashtable 结构。

4. 

> 无序集合set：

1. 常用命令：sadd、spop、smembers、sismember、scard、sinterstore、sunion 等。

2. 应用场景：需要存放的数据不能重复以及需要获取多个数据源交集和并集等场景：全局去重，计算共同喜好，全部喜好，独有喜好。

3. 底层存储结构，分别是 intset（整型数组）与 hashtable（哈希表）。当 set 存储的数据满足以下要求时，使用 intset 结构：

   - 集合内保存的所有成员都是整数值；
   - 集合内保存的成员数量小于 512 个。

   当不满足上述要求时，则使用 hashtable 结构。

> 有序集合zset：TopN操作。

1. 常用命令： zadd、zcard、zscore、zrange、zrevrange、zrem 等。
2. 应用场景： 需要对数据根据某个权重进行排序的场景。`比如在直播系统中，实时排行信息包含直播间在线用户列表，各种礼物排行榜，弹幕消息`（可以理解为按消息维度的消息排行榜）等信息。
3. 存储结构，分别是 zipList（压缩列表）和 skipList（跳跃列表），当 zset 满足以下条件时使用压缩列表：
   - 集合内保存的成员的数量小于128 个；
   - 每个 member （成员）的字符串长度都小于 64 个字节。

### 过期策略和内存淘汰策略

核心思想：`Redis过期键删除策略：定期删除（每隔XXXs随机取数，检查是否key过期）+惰性删除（获取Key检查是否过期）+内存达到最大值后，内存淘汰策略（调用内存allkeys-lru）`

- 命令行设置

```shell
config set maxmemory-policy allkeys-lru
config set maxmemory 5gb
```


- 配置文件redis.conf中设置

```shell
maxmemory-policy volatile-lru
maxmemory 5gb
```



> Redis 过期数据删除策略

expire


> 内存回收策略

删除过期键对象：惰性删除 + 定期删除

如何判断数据是过期的：过期字典是保存数据过期的时间，过期字典的键指向key，值是long long的整形，毫秒精度的 UNIX 时间戳

> 内存淘汰机制8种

allkeys、volatile 与 lru、lfu、random组合 + volatile-ttl  /noevition（不回收）

Redis `8` 种内存淘汰机制

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

`文件事件处理器（Redis单线程处理模型）`：多个套接字、IO多路复用程序、文件事件分派器、事件处理器（连接应答处理器、命令请求处理器、命令回复处理器）。

![0](https://i.loli.net/2021/10/07/dLMhtOEgxsDbF3W.png)

`整个过程：客户端与服务连接时，生成文件描述符fd，并把连接应答/读写/关闭命令绑定到文件描述符fd，然后监听文件描述符fd的命令。当命令产生时，交由文件事件处理器处理命令。`



> Redis 单线程的优势，Redis为什么这么快 为啥Redis6.0引入多线程

单线程没有多线程上下文切换和重新调度开销

纯内存访问

`文件事件处理器`(看小结)

`epoll`解决内核态轮询以及内核态大批量拷贝的问题，解决最大个数限制1024，大于2048

`Redis6.0` 的多线程部分只是用来处理网络数据的读写和协议解析，执行命令仍然是单线程。

### 高可用架构设计

#### Redis主从架构

主从节点建立`第一次建立连接`后，主节点全量复制生成RDB文件，新的命令缓存在内存中。

RDB文件生成完毕后，把文件发送给从节点，从节点写入本地磁盘后，加载到内存中，接着又把内存中缓存命令发送给从节点，从节点同步数据。

如果 master 和 slave 网络连接断掉了，从节点slave 会让 主节点master 从上次 `副本偏移量 replica offset` 开始继续复制，如果没有找到对应的 offset，那么就会执行一次 `resynchronization` 。

![0](https://i.loli.net/2021/10/06/jHnh1zX9ci2TLwY.png)

> key过期

slave 不会过期 key，只会等待 master 过期 key。如果 master 过期了一个 key，或者通过 LRU 淘汰了一个 key，那么会模拟一条 del 命令发送给 slave。

#### Redis高可用架构设计 哨兵和集群

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

### 分布式锁

#### 并发竞争key的问题

各个系统去抢分布式锁，基于zookeeper`临时有序节点`可以实现的分布式锁。大致思想为：每个客户端对某个方法获取分布式锁时，在方法对应的lock目录下面`创建临时顺序节点`，查找lock目录下的所有节点排序后`获取最小的节点`，如果是自己，则表示获取到锁，如果不是则`注册监听事件Watcher监听最小的节点`；监听到关注的节点被删除后，重新判断自己是否是所有节点排序后最小的节点，如果是获取锁，如果不是则重复以上步骤。同时，临时有序节点可以避免`服务宕机导致锁无法释放而产生死锁`的问题。完成业务流程后，删除对应的字节点`释放锁`。

`临时节点/临时有序节点/持久节点/持久有序节点`

#### 分布式锁Zookeeper与Redis比较

| 分布式锁  | 优点                                                         | 缺点                                                         |
| --------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Zookeeper | 1.有封装好的框架，容易实现<br/>2.有等待锁的队列，大大提升抢锁效率。 | 添加和删除节点性能较低                                       |
| Redis     | Set和Del指令性能较高                                         | 1.实现复杂，需要考虑`超时，原子性，误删`等情形。<br/>2.没有等待锁的队列，只能在客户端自旋来等待，效率低下。 |



### 缓存异常

[具体参考缓存Redis](/04架构设计/缓存Redis?id=_10-缓存异常)



- 缓存雪崩（同一时间缓存大面积失效）
- 缓存穿透（缓存没有数据）
- 缓存击穿（热点数据失效）



> Redis 缓存穿透 缓存雪崩





（无效key）缓存穿透：缓存层找不到，存储层也没有，避免去后端存储层找数据

缓存空对象：设置过期时间，存在缓存层和存储层时间窗口内，不一致的问题。（频繁变化实时性高）

布隆过滤器拦截：新增和判断逻辑。隆过滤器说某个元素存在，`小概率会误判`。布隆过滤器说某个元素不在，那么这个元素一定不在。直接返回。（固定实时性低）

（失效key）缓存雪崩：同一时刻，缓存数据大面积失效，导致所有的请求都到了存储层，短时间接收大量的请求，有可能导致后端服务宕掉。



### 持久化

> Redis 持久化机制 原理过程 配置方式 数据同步

阻塞：fork操作过程中父进程会阻塞、AOF追加阻塞主线程（比较上一次同步时间，大于2s，阻塞）

#### 只追加文件AOF（append-only file）持久化:

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

#### 快照（snapshotting）持久化（RDB）:

二进制文件 适用于备份，全量复制 灾难恢复

bgsave

手动触发bgsave/自动触发

同步：save ms 个数

父进程执行fork操作，创建一个子进程（生成RDB文件，响应其他命令）

### 缓存和数据库双写的一致性

最终一致性（异步化）和强一致性（串行化）



先更新数据库后删除缓存（防止缓存击穿问题）

缓存延时双删（确保一定把缓存删除成功）

删除缓存重试机制（消息队列RocketMQ）

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

`DI(Dependecy Inject，依赖注入)`是实现控制反转的一种设计模式，依赖注入就是将实例变量传入到一个对象中去。



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
                public Object invoke(Object proxy, Method method,Object[] args) 
                    throws Throwable {
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

解释：执行到核心业务方法或者类时，会先执行AOP。在aop的逻辑内，先走 `@Around` 注解的方法。然后是 `@Before`注解的方法，然后这两个都通过了，走核心代码，核心代码走完，无论核心有没有返回值，都会走 `@After`方法。然后如果程序无异常，正常返回就走 `@AfterReturn`，有异常就走 `@AfterThrowing`



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

#### 事务的基本原理

Spring事务 的本质其实就是数据库对事务的支持，没有数据库的事务支持，spring是无法提供事务功能的。对于纯JDBC操作数据库，想要用到事务，可以按照以下步骤进行：

- 获取连接 Connection con = DriverManager.getConnection()

- 开启事务con.setAutoCommit(true/false);

- 执行CRUD

- 提交事务/回滚事务 con.commit() / con.rollback();

- 关闭连接 conn.close();

使用Spring的事务管理功能后，在相关的类和方法上通过注解@Transactional标识，spring 在启动的时候会去解析生成相关的bean，这时候会查看拥有相关注解的类和方法，并且为这些类和方法生成代理，并根据@Transaction的相关参数进行相关配置注入，这样就在代理中为我们把相关的事务处理掉了（开启正常提交事务，异常回滚事务），于是可以不再写步骤 2 和 4 的代码，

真正的数据库层的事务提交和回滚是通过bin log或者redo log实现的。

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

核心思想：`方法是否回滚取决是否在同一个事务中`。



REQUIRED：如果当前存在事务，则加入当前事务；不存在，创建新事务

REQUIRES_NEW：重新创建新的事务

NESTED：如果一个活动的事务存在，则运行在一个嵌套的事务中【外部事务有问题，嵌套的子事务也会回滚（`类比于REQUIRED`）。内部方法的事务有问题不影响外部方法的事务（`类比于REQUIRES_NEW`）】。如果没有活动事务，则按REQUIRED属性执行。

MANDATORY/NEVER：必须需要事务/必须不要事务，没有就抛出异常

SUPPORTS：如果当前有事务，则加入当前事务（`支持事务`）；如果没有事务，则以非事务方式执行。

NOT_SUPPORTED：如果当前存在事务，则挂起当前事务（`不支持事务`）；如果没有事务，则以非事务方式执行。

同一类中自调用方法，没有事务注解的方法调用有事务注解的方法，会使有事务注解的方法失效。



#### 事务隔离级别

未提交（脏读） -》 已提交（不可重复读Update） -》 重复读（幻读Insert Delete） -》 串行化（不支持高并发）



| 隔离级别         | 隔离级别的值 | 导致的问题                                                   |
| ---------------- | ------------ | ------------------------------------------------------------ |
| Read-Uncommitted | 0            | 导致脏读                                                     |
| Read-Committed   | 1            | 避免脏读，允许不可重复读和幻读                               |
| Repeatable-Read  | 2            | 避免脏读、不可重复读，允许幻读                               |
| Serializable     | 3            | 串行化读，事务只能一个一个执行，<br/>避免了脏读、不可重复读、幻读。执行效率慢，使用时慎重 |



- 读取未提交（Read Uncommitted）：事务可以读取未提交的数据，也称作`脏读（Dirty Read）`。一般很少使用。
- 读取已提交（Read Committed）：是 DBMS （如：Oracle， SQLServer）默认事务隔离。执行两次相同的查询却有不同的结果，也叫`不可重复读`。
- 可重复读（Repeatable Read）：是 MySQL 默认事务隔离级别。能确保同一事务多次读取同一数据的结果是一致的。可以解决脏读的问题，但理论上无法解决`幻读（Phantom Read）`的问题。
- 可串行化（Serializable）：是最高的隔离级别。强制事务串行执行，会在读取的每一行数据上加锁，这样虽然能避免幻读的问题，但也可能导致大量的超时和锁争用的问题。很少会应用到这种级别，只有在非常需要确保数据的一致性且可以接受没有并发的应用场景下才会考虑。脏读/不可重复读/幻读

> 脏读、不可重复读、幻读

- 脏读：读取其他事务还没提交的数据

- 不可重复读：同一查询条件，两次查询结果不一致，其他事务对它进行`UPDATE`操作。

- 幻读：同一查询条件，两次查询结果不一致，其他事务对这笔数据进行 `INSERT` 或 `DELETE` 操作。

### Spring 单例Bean的线程安全问题

存在安全问题，当多个线程修改成员属性中含有写操作的对象时，会有线程安全的问题。

通过定义 成员属性 threadLocal 变量

修改Bean的作用域 prototype

### 注解

#### 常用注解

通过xml方式实现Bean注入，实例名称：id 实例类型：class

```xml
<bean id="person2" class="com.mengma.assembly.Person"> 
```

1）@Component -》@Component("")：全局注解

可以使用此注解描述 Spring 中的 Bean，但它是一个泛化的概念，仅仅表示一个组件（Bean），并且可以作用在任何层次；使用时只需将该注解标注在相应类上即可。

2）@Repository -》 @Repository("")：对DAO实现类进行注解

用于将数据访问层（DAO层）的类标识为 Spring 中的 Bean，其功能与 @Component 相同。

3）@Service -》 @Service("")：对service实现类进行注解

通常作用在业务层（Service 层），用于将业务层的类标识为 Spring 中的 Bean，其功能与 @Component 相同。

4）@Controller -》 @Controller("")：对web层Controller实现类进行注解

通常作用在控制层（如 [Struts2](http://c.biancheng.net/struts2/) 的 Action），用于将控制层的类标识为 Spring 中的 Bean，其功能与 @Component 相同。

5）@Autowired -》  @Autowired：默认按照实例类型装配；

用于对 Bean 的属性变量、属性的 Set 方法及构造函数进行标注，配合对应的注解处理器完成 Bean 的自动配置工作。默认按照 Bean 的类型进行装配。

6）@Qualifier -》 @Qualifier（name="xxx"）：默认按照实例名称装配；

与 @Autowired 注解配合使用，会将默认的按 Bean 类型装配修改为按 Bean 的实例名称装配，Bean 的实例名称由 @Qualifier 注解的参数指定。

#### @Autowired 与 @Resource(重点理解)

@Autowired 默认 `按照类型名称byType方式` 装配；当同一个类出现多个实例Bean，会出现异常。通过 `@Qualifier`解决

@Resource 默认 `按照实例名称byName方式` 装配。`@Resource(name="xxx",type="xxx") = @Autowired + @Qualifier("")`



@Resource 中有两个重要属性：name 和 type。

- 如果指定 name 属性，则按Bean 实例名称进行装配；如果指定 type 属性，则按 Bean 类型进行装配。
- 默认按照实例名称装配，如果不能匹配，则再按照 Bean 实例类型进行装配；如果都无法匹配，则抛出 `NoSuchBeanDefinitionException` 异常。



`问题`：@Autowired默认按类型匹配的方式，在容器中查找匹配的Bean，当有且只有一个匹配的Bean时，Spring将其注入到@Autowired注解的变量中。但是如果容器中有超过一个以上的匹配Bean时，例如有两个UserService类型的Bean，这时就不知道将哪个Bean注入到变量中，就会出现异常

为了解决这个问题，Spring可以通过 `@Qualifier`注解来注入指定Bean的 名称。

```java
public class UserAction {
     @Autowired 
     //指定指定Bean的名称
     @Qualifier("userservice")
     private UserService userservice;
 }
```

还有一种更为便捷的注解方式注入属性@Resource，相当于@Autowired 和@Qualifier一起使用

```java
@Resource(name="userservice")
private UserService userservice;
```



#### 间歇注解：  

`@Scope("prototype")`：定义Bean的作用范围 

` @Value("")`：定义属性值  

`@PostConstruct`  和 `@PreDestroy` 两个注解相当于bean的init-method和destory-method属性的功能



#### 属性注入

1）一般属性注入@Value

方法一：Spring为我们提供了注解 @value，用于对一般属性注入，可以不用提供set方法，它是通过反射的Field赋值，破坏了封装性

```java
@Value("Tom") 
private String nmae;

@Value("22")
private int age;
```

方法二：提供set方法的也可以这样注入，推荐使用

```java
@Value("Tom") 
Public void setName(String name){   
    this.name = name; 
}
```

然而在实际开发者中，尽管实际是破坏了对象的封装性，但开发者还是喜欢用第一种方式注入属性

2）引用类型注入

```java
//会根据类型自动注入
@Autowired
private UserService userservice;

//@Autowired可以对类成员变量的set方进行注解。
//对set方法使用注解，UserDao的实例就会被注入进来
@Autowired
public void  setUserdao(UserDao userdao){
     this.userdao=userdao;
}
```



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



## 5.2 Spring MVC

### 工作原理

- `前端控制器DispatcherServlet`：Spring MVC所有请求都要经过前端控制器 `DispatcherServlet` 借助处理器映射器 `HandlerMapping`映射到对应 `Controller` 。
- `处理器映射器HandlerMapping`：HandlerMapping 接口负责完成客户请求映射到 对应 Controller 。
- `处理器适配器HandlerAdapter`：调用具体的方法对用户发来的请求来进行处理。
- `处理器Handler（Controller）`：Controller 接口将处理用户请求，将返回 ModelAndView 对象给 DispatcherServlet 前端控制器，ModelAndView 中包含了模型（Model）和视图（View）。
  - 从宏观角度考虑，DispatcherServlet 是整个 Web 应用的控制器；从微观考虑，Controller 是单个 Http 请求处理过程中的控制器，而 ModelAndView 是 Http 请求过程中返回的模型（Model）和视图（View）。
- `视图解析器ViewResolver`：ViewResolver 接口（视图解析器）在 Web 应用中负责查找 View 对象，从而将相应结果渲染给客户。

​    ![0](https://i.loli.net/2021/10/14/H97isnqQkz6xoSc.png)

图 1 Spring MVC 工作原理图

从图 1 可总结出 Spring MVC 的工作流程如下：

1. 客户端（浏览器）发送请求，直接请求到 前端控制器 `DispatcherServlet`。
2. 前端控制器 `DispatcherServlet` 根据请求信息调用 处理器映射器 `HandlerMapping`，解析请求对应的 Controller。
3. 解析到对应的 Controller 后，开始由 处理器适配器 `HandlerAdapter` 处理。
4. 处理器适配器 `HandlerAdapter` 会根据 Handler 来调用真正的处理器来处理请求，并处理相应的业务逻辑。
5. 处理器处理完业务后，会返回一个 ModelAndView 对象，Model 是返回的数据对象，View 是个逻辑上的 View。
6. ViewResolver 会根据逻辑 View 查找实际的 View。
7. DispaterServlet 把返回的 Model 传给 View（视图渲染）。
8. 把 View 返回给请求者（浏览器）

`总结：所有的请求都经过前端控制器，而它借助处理器映射器找到与请求对应的Controller。如果找到匹配项，则调用处理器适配器的handler方法，通过反射机制执行Controller的具体的方法获得模型视图。再通过视图解析器解析视图，然后通过视图渲染把模型数据填充到视图中，最后把视图响应给用户。`

### 过滤器和拦截器

![image-20211015142835907](https://i.loli.net/2021/10/15/UGpJjKd2Nblgv3S.png)

> 两者的区别

`拦截器（Interceptor）是基于Java的反射机制，而过滤器（Filter）是基于函数回调`。从灵活性上说拦截器功能更强大些，Filter能做的事情，拦截器都能做，而且可以在请求前，请求后执行，比较灵活。Filter主要是针对URL地址做一个编码的事情、过滤掉没用的参数、安全校验，太细的话，还是建议用interceptor。不过还是根据不同情况选择合适的。



过滤器：依赖于servlet容器，在web.xml中配置，在Javaweb的应用是对请求request的数据提前做处理，比如说修改字符集编码格式，然后再传入到servlet或者controller进行后续的业务处理。

拦截器：依赖于Spring MVC 框架，在Spring MVC配置文件。

`preHandle`：调用Controller的处理方法之前，用户登录验证。

`postHandle`：视图解析之前，可对视图解析进行修改。

`afterCompletion`：渲染视图结束之后。资源清理，记录日志信息。

> 执行顺序

多个Filter，放行前按配置顺序执行，放行后按配置倒序执行。`栈`

![image-20211015114310475](https://i.loli.net/2021/10/15/Is68DKgQRLJGEPz.png)

多个Interceptor，preHandle/postHandle按配置顺序执行 `栈`，afterCompletion按配置倒序执行。`队列`

![image-20211015114225453](https://i.loli.net/2021/10/15/lzgB1hSfjR8iYHC.png)



### 数据转换方式配置

- `MultipartResolver` 用于处理文件上传，当收到请求时 DispatcherServlet 的 checkMultipart() 方法会调用 MultipartResolver 的 isMultipart() 方法判断请求中是否包含文件。如果请求数据中包含文件，则调用 MultipartResolver 的 resolveMultipart() 方法对请求的数据进行解析，然后将文件数据解析成 MultipartFile 并封装在 MultipartHttpServletRequest (继承了 HttpServletRequest) 对象中，最后传递给 Controller
- `MappingJacksonHttpMessageConverter` 用于把Java对象转换成Json对象或者XML文档，同时也可以把Json对象转换成Java对象。

```xml
<bean class="org.springframework.web
             .servlet.mvc.annotation.AnnotationMethodHandlerAdapter">
    <property name="messageConverters">
        <list>
            <bean class="org.springframework.http
                         .converter.json.MappingJacksonHttpMessageConverter">
                <property name="supportedMediaTypes">
                    <list> <!--返回字符串格式json-->
                        <value>application/json;charset=UTF-8</value>
                    </list>
                </property>
            </bean>
        </list>
    </property>
</bean>
<bean id="multipartResolver" 
      class="org.springframework.web.multipart.commons.CommonsMultipartResolver">
    <property name="maxUploadSize" value="102400000"></property>
</bean>
```



### 常用注解

> @RequestMapping @GetMapping() @PostMapping



> @PathVariable与@RequestParam

`@PathVariable` 用于将请求URL中的模板变量映射到 功能处理方法的参数上。

如请求的URL为“ /users/123/roles/456”，则自动将URL中模板变量{userId}和{roleId}绑定到通过@PathVariable注解的同名参数上，即入参后userId=123、roleId=456。

```java
@Controller  
public class TestController {  
     @RequestMapping(value="/user/{userId}/roles/{roleId}",method = RequestMethod.GET)  
     public String getLogin(@PathVariable("userId") String userId,  
         @PathVariable("roleId") String roleId){  
         System.out.println("User Id : " + userId);  
         System.out.println("Role Id : " + roleId);  
         return "hello";  
     }  
     @RequestMapping(value="/product/{productId}",method = RequestMethod.GET)  
     public String getProduct(@PathVariable("productId") String productId){  
           System.out.println("Product Id : " + productId);  
           return "hello";  
     }  
     @RequestMapping(value="/javabeat/{regexp1:[a-z-]+}", method = RequestMethod.GET)  
     public String getRegExp(@PathVariable("regexp1") String regexp1){  
           System.out.println("URI Part 1 : " + regexp1);  
           return "hello";  
     }  
}
```



`@RequestParam`用于将请求参数映射到 功能处理方法的参数上。

```java 
请求中包含username参数（如/requestparam1?username=zhang），则自动传入。
public String requestparam1(@RequestParam String username);
```

@RequestParam有以下三个参数：

- value：参数名字，即入参的请求参数名字，如username表示请求参数中名字为username的参数值将传入；

- required：是否必须，默认是true，表示请求中一定要有相应的参数，否则将抛出异常；

- defaultValue：默认值，表示如果请求中没有同名参数时的默认值；`默认required为false，表示为null`

  - 原子类型：必须有值，否则抛出异常，如果允许空值请使用包装类代替。

  - Boolean包装类型：默认Boolean.FALSE，其他引用类型默认为null。



如果请求参数中包含多个同名参数，应该如何接收呢？如给用户授权时，可能授予多个权限。

假如请求参数类似于url?role=admin&rule=user，则实际roleList参数入参的数据为“admin，user”，即多个数据之间使用“，”分割；我们应该使用如下方式来接收多个请求参数：

```java
public String requestparam7(@RequestParam(value="role") String[] roleList)
或者
public String requestparam8(@RequestParam(value="list") List<String> list)  
```



> @ResponseBody与@RequestBody

消息转换器配置：`Jackson -》 MappingJacksonHttpMessageConverter`

使用地方：都是用于Controller类方法上。

数据格式：Content-Type: application/json， application/xml，不是application/x-www-form-urlencoded编码的内容

@RequestBody 将HTTP请求正文转换为适合的HttpMessageConverter对象。

@ResponseBody 将内容或对象作为 HTTP 响应正文返回，并调用适合HttpMessageConverter的Adapter转换对象，写入输出流

> @Controller与@RestController

@RestController注解 等价于 @ResponseBody ＋ @Controller



### 未提问内容

x 正数的值越小，该servlet的优先级越高，应用启动时就越先加载。当值相同时，容器就会自己选择顺序来加载。

## Spring Security

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



## 5.3 Spring Boot

### 5.3.1 配置

#### BootStrap.yaml

```yaml
server:
  port: 56050 #启动端口 命令行注入
  max-http-header-size: 100KB

nacos:
  server:
    addr: 127.0.0.1:8848

spring:
  application:
    name: transaction-service
  main:
    allow-bean-definition-overriding: true # Spring Boot 2.1 需要设定
  cloud:
    nacos:
      discovery:
        server-addr: ${nacos.server.addr}
        namespace: 611b745b-50b4-492b-8888-536d0b1cc7f7
        cluster-name: DEFAULT
      config:
        server-addr: ${nacos.server.addr} # 配置中心地址
        file-extension: yaml
        namespace: 611b745b-50b4-492b-8888-536d0b1cc7f7 # 默认开发环境郑州区 命令行注入
        group: SHANJUPAY_GROUP # 聚合支付业务组
        ext-config:
          -
            refresh: true
            data-id: spring-boot-http.yaml # spring boot http配置
            group: COMMON_GROUP # 通用配置组
          -
            refresh: true
            data-id: spring-boot-starter-druid.yaml # spring boot starter druid配置
            group: COMMON_GROUP # 通用配置组
          -
            refresh: true
            data-id: spring-boot-mybatis-plus.yaml # spring boot mybatisplus配置
            group: COMMON_GROUP # 通用配置组
          -
            refresh: true
            data-id: spring-boot-redis.yaml # redis配置
            group: COMMON_GROUP # 通用配置组
          -
            refresh: true
            data-id: spring-boot-freemarker.yaml # spring boot freemarker配置
            group: COMMON_GROUP # 通用配置组
          -
            refresh: true
            data-id: spring-boot-starter-rocketmq.yaml # rocketmq配置
            group: COMMON_GROUP # 通用配置组
dubbo:
  scan:
    # dubbo 服务扫描基准包
    base-packages: com.shanjupay
  protocol:
    # dubbo 协议
    name: dubbo
    port: 20893
  registry:
    address: nacos://127.0.0.1:8848
  application:
    qos:
      port: 22250 # dubbo qos端口配置  命令行注入
  consumer:
    check: false
    timeout: 3000
    retries: -1

logging:
  config: classpath:log4j2.xml
```





#### 自动配置原理

> 详细理解

注解：@SpringBootApplication  -》 @EnableAutoConfiguration -》@Import -》 @ConditionalOnClass-》@Configuration -》@EnableConfigurationProperties 



@SpringBootApplication -》 @EnableAutoConfiguration，SpringApplication.run(...)的内部就会执行selectImports()方法，找到META-INF/spring.factories文件中所有 JavaConfig自动配置类的全限定名对应的class

@EnableAutoConfiguration -》xxxxAutoConfiguration

然后通过@ConditionalOnClass在指定类中生效。

再结合XXXProperties.java 读取配置文件进行属性装配。



自动生效

- @ConditionalOnBean：当容器里有指定的bean的条件下。
- @ConditionalOnMissingBean：当容器里不存在指定bean的条件下。
- `@ConditionalOnClass：当类路径下有指定类的条件下`。
- @ConditionalOnMissingClass：当类路径下不存在指定类的条件下。
- @ConditionalOnProperty：指定的属性是否有指定的值，比如@ConditionalOnProperties(prefix=”xxx.xxx”, value=”enable”， matchIfMissing=true)，代表当xxx.xxx为enable时条件的布尔值为true，如果没有设置的情况下也为true。

@EnableConfigurationProperties -》 XXXProperties



> 简单理解

注解 @EnableAutoConfiguration， @Configuration， @ConditionalOnClass 就是自动配置的核心，

@EnableAutoConfiguration 给容器导入META-INF/spring.factories 里定义的自动配置类。

筛选有效的自动配置类。

每一个自动配置类结合对应的 xxxProperties.java 读取配置文件进行自动配置功能


#### 配置加载顺序

总体上而言，高优先级覆盖低优先级内容，形成互补配置，优先级从高到低加载顺序为：`命令行参数 > 包外配置文件 > 包内配置文件;再看文件名和扩展名的加载顺序【文件名：application.* > application-default.*】【扩展名：properties > xml > yml > yaml】`

 

##### 配置文件的加载顺序

`配置文件`默认为application.\*和application-default.\*，`扩展名`有四个：*.properties > *.xml > *.yml > *.yaml；

`执行顺序`就如上出现的顺序一样；如：application.\* 优先于 application-default.\*。



Springboot启动会扫描一下位置的application.properties或者application.yml作为默认的配置文件

工程根目录：./config/

工程根目录：./

类路径目录classpath：/config/

类路径目录classpath：./

加载的优先级顺序是 `从上向下加载`，并且所有的文件都会被加载，高优先级的内容会 `覆盖底优先级`的内容，形成互补配置

注意⚠️： 工程根路径下或者根路径的 `config 下面的配置文件`，在工程打包时候不会被打包进去

也可以通过指定配置spring.config.location来改变默认配置，一般在项目已经打包后，通过 `命令行指令` 来加载外部的配置

```shell
java -jar xxxx.jar --spring.config.location=D:/kawa/application.yml 
```

##### 外部配置的加载顺序

springboot外部配置加载顺序如下，优先级从高到底，并且高优先级的配置覆盖底优先级的配置形成互补配置

> 命令行参数

比如：java -jar xxxx.jar --server.port=8087 --server.context-path=/show 多个配置中间用空格分开

`由jar包外向jar包内进行加载`，比如和工程平级目录下面的配置文件优先级高于jar包内部的配置文件

![image-20211017103655264](https://i.loli.net/2021/10/17/p5oYZmQwaSAji8J.png)

> 优先加载带profile

- jar包外部的application-{profile}.propertie或application.yml(带spring.profile)配置文件 

- jar包内部的application-{profile}.propertie或application.yml(带spring.profile)配置文件

> 再来加载不带profile

- jar包外部的application.propertie或application.yml(不带spring.profile)配置文件
- jar包内部的application.propertie或application.yml(不带spring.profile)配置文件



#### YAML 配置

结构化，分层配置数据

> 与properties文件，yaml文件的优势在哪里

- 配置有序

- 支持数组，数组中的元素是基本类型或对象

不支持 `@PropertySource` 注解导入自定义的 YAML 配置。

#### 核心配置文件

> Bootstrap.properties 和 application.properties

- bootstrap (. yml 或者 . properties)：bootstrap 由父 ApplicationContext 加载的，比 applicaton 优先加载，配置在应用程序上下文的引导阶段生效。一般来说我们 在 `Spring Cloud Config` 或者 `Nacos` 中会用到它。且 boostrap 里面的属性不能被覆盖(`属性不可重写`)；
- application (. yml 或者 . properties)： 由ApplicatonContext 加载，用于 `Spring Boot` 项目的自动化配置。

> 如何在自定义端口上运行 Spring Boot 应用程序？

为了在自定义端口上运行 Spring Boot 应用程序，在application.properties 中指定端口。server.port = 8090



### 5.3.2 安全问题

#### 比较一下 Spring Security 和 Shiro 各自的优缺点 ?
由于 Spring Boot 官方提供了大量的非常方便的开箱即用的 Starter ，包括 Spring Security 的 Starter ，使得在 Spring Boot 中使用 Spring Security 变得更加容易，甚至只需要添加一个依赖就可以保护所有的接口，所以，如果是 Spring Boot 项目，一般选择 Spring Security 。当然这只是一个建议的组合，单纯从技术上来说，无论怎么组合，都是没有问题的。Shiro 和 Spring Security 相比，主要有如下一些特点：

- Spring Security 是一个重量级的安全管理框架；Shiro 则是一个轻量级的安全管理框架

- Spring Security 概念复杂，配置繁琐；Shiro 概念简单、配置简单

- Spring Security 功能强大；Shiro 功能简单
  

#### Spring Boot 中如何解决跨域问题 ?

跨域可以在前端通过  `JSONP` 来解决，但是  JSONP 只可以发送 `GET` 请求，无法发送其他类型的请求，在 RESTful 风格的应用中，就显得非常鸡肋，因此我们推荐在 `后端通过 （CORS，Cross-origin resource sharing） 来解决跨域问题`。这种解决方案并非 Spring Boot 特有的，在传统的 SSM 框架中，就可以通过 CORS 来解决跨域问题，只不过之前我们是在 XML 文件中配置 CORS ，现在可以通过实现 `WebMvcConfigurer`接口，然后重写`addCorsMappings` 方法解决跨域问题。

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowCredentials(true)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .maxAge(3600);
    }
}

```



项目中前后端分离部署，所以需要解决跨域的问题。

我们使用cookie存放用户登录的信息，在spring拦截器进行权限控制，当权限不符合时，直接返回给用户固定的json结果。

当用户登录以后，正常使用；当用户退出登录状态时或者token过期时，由于拦截器和跨域的顺序有问题，出现了跨域的现象。

我们知道一个http请求，`先走filter，到达servlet后才进行拦截器的处理`，如果我们 `把cors放在filter里`，就可以优先于权限拦截器执行。

```java
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("*");
        corsConfiguration.addAllowedHeader("*");
        corsConfiguration.addAllowedMethod("*");
        corsConfiguration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = 
            new UrlBasedCorsConfigurationSource();
        urlBasedCorsConfigurationSource.
            registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }
}
```

#### 什么是 CSRF 攻击？

CSRF 代表跨站请求伪造。这是一种攻击，迫使最终用户在当前通过身份验证的Web 应用程序上执行不需要的操作。CSRF 攻击专门针对状态改变请求，而不是数据窃取，因为攻击者无法查看对伪造请求的响应。



### 5.3.3 整合第三方项目

#### 前后端分离第三方工具Swagger

[详情参考Swagger](/03框架/Swagger)

Swagger 广泛用于可视化 API，使用 Swagger UI 为前端开发人员提供在线沙箱。Swagger 是用于 `生成 RESTful Web 服务的可视化表示的工具，规范和完整框架实现`。它使文档能够以与服务器相同的速度更新。当通过 Swagger 正确定义时，消费者可以使用最少量的实现逻辑来理解远程服务并与其进行交互。因此，Swagger消除了调用服务时的猜测。


### 5.3.4 其他

#### 如何使用 Spring Boot 实现异常处理？

ControllerAdvice和ExceptionHandler注解实现全局异常处理

[详情参考](/07项目开发/微服务开发框架?id=系统的异常是怎么处理的)

#### Spring Boot 配置返回结果为xml

- 实体类以及其子类添加`@XmlRootElement`注解
- 请求注解添加  @RequestMapping(value = "/sitemap.xml", produces = {"application/xml;charset=UTF-8"}, method = RequestMethod.GET)

#### Spring Boot 添加缓存的方式

redisTemplate 与注解 @EnableCaching



## 5.4 Spring Cloud

[Spring Cloud讲解](https://www.cnblogs.com/qdhxhz/category/1558221.html)



### 5.4.2 Spring Cloud Gateway

Spring Cloud Gateway是Spring Cloud官方推出的第二代网关框架，取代Zuul网关。网关作为流量的，在微服务系统中有着非常作用，网关常见的功能有路由转发、权限校验、限流控制等作用。

### 5.4.3 Spring Cloud OpenFeign

基于Ribbon和Hystrix的声明式服务调用组件，可以动态创建基于Spring MVC注解的接口实现用于服务调用，在Spring Cloud 2.0中已经取代Feign成为了一等公民。



### Spring Cloud和SpringBoot版本对应关系

| Spring Cloud Version | SpringBoot Version |
| -------------------- | ------------------ |
| Hoxton               | 2.2.x              |
| Greenwich            | 2.1.x              |
| Finchley             | 2.0.x              |
| Edgware              | 1.5.x              |
| Dalston              | 1.5.x              |



## 5.5 Spring Cloud Alibaba

参考学习栏目：

- [雨点的名字-分布式Spring Cloud Alibaba](https://www.cnblogs.com/qdhxhz/category/1952067.html)



![img](https://i.loli.net/2021/10/17/sfLeJu4yK9PA2TS.jpg)



![img](https://i.loli.net/2021/10/17/Xgc46o3KtUOpRxG.jpg)



### 服务注册与发现和配置中心(Nacos)

[详见项目解析]()

### 分布式服务框架(Dubbo)



### 消息队列(RocketMQ)

分布式消息系统，基于高可用分布式集群技术，提供低延时的、高可靠的消息发布与订阅服务。

### 分布式解决方案(Seata)



### 哨兵(Sentinel)

> 核心思想

流量控制：限流，削峰填谷

熔断控制：XXX服务不可以时，采用降级方式让其通过，不影响整个提交订单业务

系统保护：当系统负载比较高的时候，在集群环境下，会把本应这台机器承载的流量转发到其它的机器上去。如果这个时候其它的机器也处在一个边缘状态的时候，Sentinel 提供了对应的保护机制，

> 重要概念：资源和规则

`资源`是 Sentinel 的关键概念。它可以是 Java 应用程序中的任何内容，例如，由应用程序提供的服务，或由应用程序调用的其它应用提供的服务，甚至可以是一段代码。在接下来的文档中，我们都会用资源来描述代码块。 只要通过 Sentinel API 定义的代码，就是资源，能够被 Sentinel 保护起来。大部分情况下，可以使用方法签名，URL，甚至服务名称作为资源名来标示资源。

围绕资源的实时状态设定的`规则`，可以包括流量控制规则、熔断降级规则以及系统保护规则。所有规则可以动态实时调整。



通过Sentinel控制台对资源进行管理和控制。

![img](https://i.loli.net/2021/10/19/2nckHpWyZzJaXYr.jpg)



![img](https://i.loli.net/2021/10/19/noSbcYwCsX9MWp6.jpg)



[参考详情](https://www.cnblogs.com/qdhxhz/p/14718138.html)》

`Sentinel`：面向分布式服务架构的轻量级流量控制产品，主要以流量为切入点，从`流量控制、熔断降级、系统负载保护`等多个维度来帮助您保护服务的稳定性。

![img](https://i.loli.net/2021/10/19/oyIqScxVbmuAMPO.jpg)

从图中可以看出Sentinel相比于Hystrix功能更强大。

Hystrix 的关注点在于以隔离和熔断为主的容错机制，超时或被熔断的调用将会快速失败，并可以提供 fallback 机制。

而 Sentinel 的侧重更多 包括：多样化的流量控制、熔断降级、系统负载保护、实时监控和控制台。而对于熔断本身而言 Hystrix只支持基于失败比例熔断，而Sentinel除了支持基于失败比例熔断，还支持超时熔断。





## 5.6 Spring Cloud Netflix

### 服务注册发现(Eureka)

### 断路器(Hystrix)

### Api网关(Zuul)

### 服务调用(Feign)

`简化说明`：服务与服务之间的调用方式采用Feign，融合了Ribbon的负载均衡Ribbon和Rest调用。让服务与服务之间的调用更加简便。引入openfeign依赖 -> 启动类@EnableFeignClient -> 调用接口@FeignClient/@GetMapping 



参考文章:

- [Spring Cloud Alibaba(8)---Feign服务调用](https://www.cnblogs.com/qdhxhz/p/14659744.html)



> 什么是Feign

Feign是由Netflix开发出来的另外一种实现负载均衡的开源框架，它封装了Ribbon和RestTemplate，实现了WebService的 `面向接口编程`，进一步的减低了项目的耦合度，因为它封装了Riboon和RestTemplate，所以它具有这两种框架的功能，可以 `实现负载均衡和Rest调用`。

> 为什么需要Feign

feign解决两个服务请求之前需要配置请求head、body，然后才能发起请求。feign正是为了解决这个而产生的，简化RestTemplate调用流程，真正感觉到是在同一个项目中调用另一个类的方法的欢快感。



订单服务调用商品服务，

引入的依赖包是openfeigin

开启Feign支持@EnableFeignClients

> 接口编程实现RestTemplate调用

在接口中编写调用的服务名称 @FeignClient(value = "mall-goods") ，以及和指定映射请求。

> 负载均衡策略

随机策略、轮询策略、重试策略、最小并发策略、可用过滤策略、响应时间加权重策略、区域权重策略

![img](https://i.loli.net/2021/10/19/inTsoOIcUWkSCBV.jpg)





```java
/**
 * mall-good s就是商品微服务的 spring.application.name
 */
@FeignClient(value = "mall-goods")
public interface GoodsService {
   
    /**
     * /api/v1/goods/findByGoodsId就是商品服务提供的接口，参数也是
     */
    @GetMapping("/api/v1/goods/findByGoodsId")
    Goods findById(@RequestParam("goodsId") int goodsId);
}
```





引入依赖

```xml
<!--引入feign-->
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-openfeign</artifactId>
</dependency>
```





> Feign优点

 1、Feign旨在使编程java Http客户端变得更容易。

 2、服务调用的时候融合了 Ribbon 技术，所以也支持负载均衡作用。

 3、服务调用的时候融合了 Hystrix 技术，所以也支持熔断机制作用。



## Spring Cloud GateWay

[参考详情](https://www.cnblogs.com/qdhxhz/p/14766527.html)



![img](https://i.loli.net/2021/10/19/5gZdSy8ui7PpE4J.jpg)









## 未提问内容

# 6. 中间件

## 6.1 持久化框架

### 6.1.1 Mybatis

#### 工作原理



​    ![0](https://i.loli.net/2021/10/19/iyn3YSbBcjK4mtz.png)

图 2 MyBatis 框架的执行流程图

> 简化过程

读取全局配置文件，加载Mapper映射文件，构造会话工厂，创建会话，调用执行器操作数据库，映射输入参数和输出参数。

> 详细过程

下面对图 2 中的每步流程进行说明：

1）`读取全局配置文件mybatis-config.xml`：此文件配置了 MyBatis 的运行环境等信息，例如数据库连接信息。

2）`加载Mapper映射文件`。该文件中配置了操作数据库的 SQL 语句，需要在 MyBatis 配置文件 mybatis-config.xml 中加载。配置文件可以加载多个映射文件，每个文件对应数据库中的一张表。

3）`构造SqlSessionFactory会话工厂`：通过 MyBatis 的环境等配置信息构建会话工厂 SqlSessionFactory。

4）`创建SqlSession 会话对象：`由会话工厂创建 SqlSession 对象，该对象中包含了执行 SQL 语句的所有方法。

5）`Executor 执行器：`MyBatis 底层定义了一个 Executor 接口来操作数据库，它将根据 SqlSession 传递的参数动态地生成需要执行的 SQL 语句，同时负责查询缓存的维护。

6）`MappedStatement 对象：`在 Executor 接口的执行方法中有一个 MappedStatement 类型的参数，该参数是对映射信息的封装，用于存储要映射的 SQL 语句的 id、参数等信息。

7）`输入参数映射：`输入参数类型： Map、List 等集合类型，引用数据类型和 POJO 类型。输入参数映射过程类似于 JDBC 对 preparedStatement 对象设置参数的过程。

8）`输出结果映射：`输出结果类型： Map、 List 等集合类型，引用数据类型和 POJO 类型。输出结果映射过程类似于 JDBC 对结果集的解析过程。

#### 核心组件

MyBatis 的核心组件分为 4 个部分。 

1）SqlSessionFactoryBuilder（构造器）：它会根据配置或者代码来生成 SqlSessionFactory，采用的是分步构建的 Builder 模式。

2）SqlSessionFactory（工厂接口）：依靠它来生成 SqlSession，使用的是工厂模式。

3）SqlSession（会话）：一个既可以发送 SQL 执行返回结果，也可以获取 Mapper 的接口。

4）SQL Mapper 接口（映射器）：MyBatis 新设计存在的组件，它由一个 Java 接口和 XML 文件（或注解）构成，需要给出对应的 SQL 和映射规则。它负责发送 SQL 去执行，并返回结果。



#### {}和${}的区别

#{}：POJO的属性或者变量，预编译，防止SQL注入的； 

${}：POJO属性或者变量，拼接字符串

#### 标签

1. 定义SQL语句

  1.1 select 标签的使用

  1.2 insert 标签的使用

  1.3 delete 标签的使用

  1.4 update 标签的使用

2. 配置对象属性与查询结果集

  2.1 resultMap 标签的使用

3. 动态拼接SQL

  3.1 if 标签的使用

  3.2 foreach 标签的使用

  3.3 choose 标签的使用

4. 格式化输出

  4.1 where

  4.2 set

  4.3 trim

5. 配置关联关系

  5.1 association一对一

  ​	5.1.1 初步了解

  ​	5.1.2 补充内容：

  ​		方法一：使用resultType

  ​	    方法二：使用	resultMap

  5.2 collection 一对多

  ​	5.2.1 一对多的关系

  ​	5.2.3 多级菜单数据查询

  ​	5.2.3 多级菜单实现（通过Java递归调用）`递归查询`

6. 定义和引用常量



### 未提问内容

selectKey

​	order: mysql:after;oracle:before.



## 6.2 消息队列

![0](https://i.loli.net/2021/10/18/2BufmzJs7SW3ZXc.png)

Dledger架构模型

生产者群/消费者群/名称服务器NameServer（存储每个Broker的主题，消息队列）/消息服务器Broker

生产者群从名称服务器中获取主题的路由信息

消费服务器与名称服务器保持心跳连接（10s一次，断开2分钟，认为你以死亡）



### 常见问题

#### 如何保证消息队列的高可用？

基于RocketMQ实现高可用：

基础组成：生产者群 消费者群 名称服务器NameServer 消息服务器Broker Server组成

首先明白`名称服务器NameServer`独立运行，每台名称服务器都保存着完整的路由信息（Broker节点，Topic信息），保证只有有一台名称服务器可用保证RocketMQ就能正常运行。

其次`消息服务器Broker集群部署架构`，过度过程：多master模式，多master多slaver模式（异步复制，同步双写），`Dledger模式`（单master多slaver组合成一个Group，横向扩容，可以有多个Group，主备自动切换的[选举机制](07项目开发/loser?id=master-salver选举机制)）。

#### 如何保证消息不被重复消费？

结合具体的业务场景来回答消息不被重复消费。

`正常消费`：消费者消费完消息后发送确认消息给消息队列，消息队列知道消息已经被消费，就将该消息从消息队列中删除。（RocketMQ返回一个`CONSUME_SUCCESS`标志表示消息被成功消费）

`异常消费`（网络中断，导致再次消费）：从业务逻辑中确保多次消费的幂等性：数据库唯一主键以及Redis的Set数据结构。从已消费角度考量，存储已经消费过的消息内容到Redis中。

#### 如何保证消息的可靠性？

[详情参考](https://baijiahao.baidu.com/s?id=1690555364749980380&wfr=spider&for=pc)

本文从消息流转的整个过程分析了RocketMQ如何保证消息的可靠性，消息发送通过`不同的重试策略`保证了消息的可靠发送，消息存储通过`不同的刷盘机制以及多副本`来保证消息的可靠存储，消息消费通过`至少消费成功一次以及消费重试机制`来保证消息的可靠消费，RocketMQ在保证消息的可靠性上做到了`全链路闭环`，最大限度的保证了消息不丢失。



#### 如何保证消息的顺序性？（难，后期整）

[详情参考](https://www.cnblogs.com/hzmark/p/orderly_message.html)

有点难，建议后期再整整。。。

> 如何保证顺序

在MQ的模型中，顺序需要由3个阶段去保障：

1. 消息被发送时保持顺序
2. 消息被存储时保持和发送的顺序一致
3. 消息被消费时保持和存储的顺序一致



#### 如何解决消息队列消息积压的问题？

- `提高消息并行度`：提高单个 Consumer 的消费并行线程，通过修改参数 consumeThreadMin、consumeThreadMax 实现。

- `批量消费方式`：设置 consumer 的 consumeMessageBatchMaxSize 返个参数，默认是 1，即一次只消费一条消息，例如设置为 N，那么每次消费的消息数小于等于 N。

#### 分布式事务

使用RocketMQ事务机制实现分布式事务

[理论分析+实践](https://mp.weixin.qq.com/s?__biz=MzI1MDU1MjkxOQ==&mid=2247486295&idx=1&sn=46496656bf0fd772fb0dcd46efec68b3&chksm=e9813c6fdef6b579518bad8ad593a8f5fca21cc2b6a5a07c9747aa113556c76ca3753548c588&scene=21#wechat_redirect)



![image-20211018200639892](https://i.loli.net/2021/10/18/u3A18EX5qPlOzCR.png)

创建订单 -》 支付 -》更改订单状态 -》发货

创建半消息成功后，然后创建订单本地事务提交成功，再去commit/rollback，



事务的状态：提交/回滚/未知。

未知事务状态采用消息回查，定时遍历commitlog预备消息去回查本地事务状态。

超过回查次数，默认回滚。





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

RocketMQ 集群需要如下特性：

- 高可用
- 高并发
- 可伸缩
- 海量消息

#### 命名服务（NameServer）

首先第一步要让 NameServer 高可用，前期规划了三台机器部署 NamseServer 这样可以充分保证可用性，即使两台机器挂掉也能保证集群的正常使用，只要有一个 NamseServer 还在运行，就能保证 RocketMQ 系统的稳定性。

![img](https://i.loli.net/2021/10/18/7l2sc9JizvtIrYH.png)

NameServer 的设计是相互的独立的，任何一台 NameServer 都可以的独立运行，`跟其他机器没有任何通信`。
每台 NameServer 都会有完整的集群路由信息，包括所有的 Broker 节点的信息，我们的数据信息等等。所以只要任何一台 NamseServer 存活下来，就可以保存 RocketMQ 信息的正常运行，不会出现故障。

#### Broker 集群部署架构

开始部署 RocketMQ 之前，我们也做过一些功课，对现在 RocketMQ 支持的集群方案做了一些整理，目前 RocketMQ 支持的集群部署方案有以下4种：

- `多Master模式`：一个集群无Slave，全是Master，例如2个Master或者3个Master
- `多Master多Slave模式-异步复制`：每个Master配置一个Slave，有多对Master-Slave，HA采用异步复制方式，主备有短暂消息延迟（毫秒级）
- `多Master多Slave模式-同步双写`：每个Master配置一个Slave，有多对Master-Slave，HA采用同步双写方式，即只有主备都写成功，才向应用返回成功
- `Dledger部署`：每个Master配置二个 Slave 组成 Dledger Group，可以有多个 Dledger Group，由 Dledger 实现 Master 选举

##### 多 Master 模式

一个 RocketMQ 集群中所有的节点都是 Master 节点，每个 Master 节点没有 Slave 节点。

![img](https://i.loli.net/2021/10/18/anHeoM6zJXq2pPC.png)

这种模式的优缺点如下：

- 优点：配置简单，单个Master宕机或重启维护对应用无影响，在磁盘配置为RAID10时，即使机器宕机不可恢复情况下，由于RAID10磁盘非常可靠，消息也不会丢（异步刷盘丢失少量消息，同步刷盘一条不丢），性能最高；
- 缺点：单台机器宕机期间，这台机器上未被消费的消息在机器恢复之前不可订阅，消息实时性会受到影响。

##### 多 Master 多 Salve - 异步复制 模式

每个Master配置一个Slave，有多对Master-Slave，HA采用异步复制方式，主备有短暂消息延迟（毫秒级）

![img](https://i.loli.net/2021/10/18/Jv4cYQ5MBDxwkSh.png)

这种模式的优缺点如下：

- 优点：即使磁盘损坏，消息丢失的非常少，且消息实时性不会受影响，同时Master宕机后，消费者仍然可以从Slave消费，而且此过程对应用透明，不需要人工干预，性能同多Master模式几乎一样；
- 缺点：Master宕机，磁盘损坏情况下会丢失少量消息。

##### 多 Master 多 Salve - 同步双写 模式

每个Master配置一个Slave，有多对Master-Slave，HA采用同步双写方式，即只有主备都写成功，才向应用返回成功

![img](https://i.loli.net/2021/10/18/iDJwCEZvr5j2MYK.png)

这种模式的优缺点如下：

- 优点：数据与服务都无单点故障，Master宕机情况下，消息无延迟，服务可用性与数据可用性都非常高；
- 缺点：性能比异步复制模式略低（大约低10%左右），发送单个消息的RT会略高，且目前版本在主节点宕机后，备机不能自动切换为主机。

##### Dledger 模式

RocketMQ 4.5 以前的版本大多都是采用 Master-Slave 架构来部署，能在一定程度上保证数据的不丢失，也能保证一定的可用性。

但是那种方式 的缺陷很明显，`最大的问题就是当 Master Broker 挂了之后 ，没办法让 Slave Broker 自动 切换为新的 Master Broker`，需要手动更改配置将 Slave Broker 设置为 Master Broker，以及重启机器，这个非常麻烦。

在手式运维的期间，可能会导致系统的不可用。

使用 Dledger 技术要求至少由三个 Broker 组成 ，一个 Master 和两个 Slave，这样三个 Broker 就可以组成一个 Group ，也就是三个 Broker 可以分组来运行。一但 Master 宕机，Dledger 就可以从剩下的两个 Broker 中选举一个 Master 继续对外提供服务。

![img](https://i.loli.net/2021/10/18/4M3hC7UmleQDiNp.png)

###### Master-salver选举机制

[详情参考](https://blog.51cto.com/u_15281317/3008330)

> 基本概念

Raft协议

机器状态：Candidate（候选节点）Master（主节点） salver（从节点）

每台机器附带编号和投票数（seriNo，votesNum）；

> 具体过程

`如果三台机器先后启动`，则最先启动的机器成为主节点。

`如果三台机器同时启动`，此时状态为候选节点Candidate，默认给自己投票，一开始大家都有一票。为快速选举出leader，设定随机等待超时时间后重新选举，先结束等待超时时间的机器A，投给自己，此时为2票，其他机器相应起来后，投把票数投给机器A，此时结束选举，机器A成为master，其余机器状态为从节点，主从节点保持心跳连接。

`主节点断开连接后`，主从节点心跳连接不成功，从节点状态变为候选节点Candidate，开始选举机制。



集群选举

![img](https://i.loli.net/2021/10/18/VfACGxU7K3vdT5b.png)



心跳机制

![img](https://i.loli.net/2021/10/18/iaM8ZGkfbXH7vWP.png)



#### 整体架构：高可用、高并发、可伸缩 、海量消息

经过上面4种集群方案的比较，最终确定使用 Dledger 方式最终的逻辑部署图如下：

![img](https://i.loli.net/2021/10/18/2BufmzJs7SW3ZXc.png)

上图的虚线框表示一个 Dledger Group。

> 高可用

三个 NameServer 极端情况下，确保集群的可用性，任何两个 NameServer 挂掉也不会影响信息的整体使用。

在上图中每个 Master Broker 都有两个 Slave Broker，这样可以保证可用性，如在同一个 Dledger Group 中 Master Broker 宕机后，Dledger 会去行投票将剩下的节点晋升为 Master Broker。

> 高并发

假设某个Topic的每秒十万消息的写入， 可以增加 Master Broker 然后十万消息的写入会分别分配到不同的 Master Broker ，如有5台 Master Broker 那每个 Broker 就会承载2万的消息写入。

> 可伸缩

如果消息数量增大，需要存储更多的数量和最高的并发，完全可以增加 Broker ，这样可以线性扩展集群。

> 海量消息

数据都是分布式存储的，每个Topic的数据都会分布在不同的 Broker 中，如果需要存储更多的数据，只需要增加 Master Broker 就可以了。

### 未提问内容



## 6.3 分布式服务框架Dubbo

### 失败重试与超时重试机制

### 未提问内容



## 6.4 注册中心

### 6.4.1 Zookeeper

#### Zookeeper选举机制

### 未提问内容

## 6.5 Web容器

### Tomcat

- `maxThreads（最大线程数）`：每一次HTTP请求到达Web服务，tomcat都会创建一个线程来处理该请求，那么最大线程数决定了Web服务可以同时处理多少个请求，`默认200`。

- `accepCount（最大等待数）`：当调用Web服务的HTTP请求数达到tomcat的最大线程数时，还有新的HTTP请求到来，这时tomcat会将该请求放在等待队列中，这个acceptCount就是指能够接受的最大等待数，`默认100`。如果等待队列也被放满了，这个时候再来新的请求就会被tomcat拒绝（connection refused）。

- `maxConnections（最大连接数）`：这个参数是指在同一时间，tomcat能够接受的最大连接数。一般这个值要大于`maxThreads+acceptCount`。

>  在配置文件中添加如下内容

```xml
# tomcat最大线程数，默认为200
server.tomcat.max-threads=200
# tomcat最大连接数，默认为10000（网上的说法）
server.tomcat.max-connections=300
```

[实践案例](https://www.jianshu.com/p/35878d4ec130)

并发请求数 <= tomcat最大线程数200，可以看到200个请求,响应结果正常

并发数(201) >tomcat最大线程数200。可以看到，因为tomcat最大的线程数为200,201的并发请求量，超出了并发处理的数量200，多出来的1个请求，需要等待某个处理中的请求处理完成

请求数超过最大连接数300，可以看到有大量的没有正常响应的http请求，原因很简单，因为超过了tomcat设置的最大连接数，服务器拒绝了该次请求的连接

线程数的经验值为：1核2G内存， 线程数经验值为200；4核8G内存，线程数经验值为800



## 未提问内容

# 7. 计算机网络

## 7.1 计算机网络体系结构：OSI/TCP/IP

核心思想：OSI体系结构（应用层/（表示层/会话层）/运输层/网络层/数据链路层/物理层）

​    ![0](https://i.loli.net/2021/10/19/1nYuFKCg2MEoGXL.png)

- 应⽤层(application-layer）的任务是通过应⽤进程间的交互来完成特定⽹络应⽤。支持的协议：域名系统`DNS`，⽀持万维⽹应⽤的`HTTP`协议，⽀持电⼦邮件的 `SMTP`协议

- 运输层(transport layer)的主要任务就是负责向两台主机进程之间的通信提供通⽤的数据传输服务。支持协议：传输控制协议 `TCP`（Transmission Control Protocol） 提供⾯向连接的， 可靠的数据传输服务。⽤户数据协议 `UDP`（User Datagram Protocol） ，提供⽆连接的，尽最⼤努⼒的数据传输服务（不保证数据传输的可靠性）。

- 网络层：在计算机⽹络中进⾏通信的两个计算机之间可能会经过很多个数据链路，也可能还要经过很多通信⼦⽹。⽹络层的任务就是选择合适的⽹间路由和交换结点， 确保数据及时传送。 在发送数据时，⽹络层把运输层产⽣的报⽂段或⽤户数据报封装成分组和包进⾏传送。`IP协议`

- 数据链路层：两台主机之间的数据传输，总是在⼀段⼀段的链路上传送的，这就需要使⽤专⻔的链路层的协议。在两个相邻节点之间传送数据时， 数据链路层将⽹络层交下来的 IP 数据报组装成帧，在两个相邻节点间的链路上传送帧。每⼀帧包括数据和必要的控制信息（如同步信息，地址信息，差错控制等）。

- 物理层：在物理层上所传送的数据单位是⽐特。物理层(physical layer)的作⽤是实现相邻计算机节点之间⽐特流的透明传送，尽可能屏蔽掉具体传输介质和物理设备的差异。



## 7.2 TCP三次握手和四次挥手

[详情参考](https://note.youdao.com/ynoteshare/index.html?id=cdc893b9ee903125e5149a4975e14ecc&type=note&_time=1634624532774)

### TCP头部信息

​    ![0](https://i.loli.net/2021/10/19/6kIK2jacCeJRHQZ.png)

TCP头部信息：源端口 目的端口 序列号seq 确认号ack 标志位（SYN发起/FIN释放/ACK确认/URG-紧急指针/PSH/RST-重置连接） 校验和 紧急指针

`通过 列号seq 确认号ack 标志位（SYN发起/FIN释放/ACK确认/URG-紧急指针/PSH/RST-重置连接）的数值变更表示三次握手和四次挥手的过程。`

### TCP三次握手

​    ![0](https://note.youdao.com/yws/public/resource/cdc893b9ee903125e5149a4975e14ecc/xmlnote/33E7849E24A943BE93C98FA1C31745CC/30663)

客户端：CLOSED -> SYN-SENT -> ESTABLISHED

服务端：CLOSED -> LISTEN -> SY-RCVD -> ESTABLISHED

`参数变化看上图`

简单理解：发起连接，双方互相确认链路互通性，如果没问题，再建立连接。

技术实现（TCP报文）：标志位 [ SYN/ACK ]，确认号Ack，序号Seq

​    ![0](https://i.loli.net/2021/10/19/4w2Wr19MkUAJIGo.gif)



### TCP四次挥手

​    ![0](https://i.loli.net/2021/10/19/LqziV5nTIU9CrMB.png)

客户端：ESTABLISHED -> FIN-WAIT-1 -> FIN-WAIT-2 -> TIME-WAIT -> CLOSED

服务端：ESTABLISHED -> CLOSE-WAIT -> LAST-ACK -> CLOSED

`参数变化看上图`

简单理解：释放连接，双方互相确认释放连接的准确性，如果没问题，彼此同意释放连接。

技术实现（TCP报文）：

`前"两次挥手"`既让服务器端知道了客户端想要释放连接，也让客户端知道服务器端明白自己想要释放连接的请求。由此确认`关闭客户端到服务器端方向的连接`

`后“两次挥手”`既让客户端知道了服务器端准备好释放连接了，也让服务器端知道客户端明白自己准备好释放连接了。由此确认`关闭服务器端到客户端方向的连接`。

由此完成“四次挥手”。

​    ![0](https://note.youdao.com/yws/public/resource/cdc893b9ee903125e5149a4975e14ecc/xmlnote/D1E8819AD6FE4D5D8656317E7E9A026D/30669)



TIME_WAIT：为的是确认服务器端是否收到客户端发出的ACK确认报文，如果服务端在2MSL计时，没有收到ACK确认报文，则会重新发送FIN报文，客户端重新开始2MSL计时。

LAST_WAIT：确认客户端发过来的内容

## 7.3 HTTP与HTTPS

### HTTP协议组成

#### http请求包括:请求行、请求头、请求体

​    ![0](https://i.loli.net/2021/10/19/oHA5krZIR19pKSU.jpg)

> 请求行

结合RESTFUL的架构设计，着重理解：GET/POST/PUT/DELETE请求。

> 请求头

`Referer：`表示这个请求是从哪个url跳过来的,通过百度来搜索淘宝网，那么在进入淘宝网的请求报文中，Referer的值就是:www.baidu.com。如果是直接访问就不会有这个头。

常用于:防盗链。

Referrer Policy: no-referrer-when-downgrade

`Content-Type：`请求的与实体对应的MIME信息。Content-Type: application/x-www-form-urlencoded

`Content-Length：`请求体的长度。

`Host：`请求的服务器主机名。 Host: sczpkj.f3322.net:3000

`Connection：`表示客户端与服务连接类型；Keep-Alive表示持久连接，close已关闭  Connection: keep-alive

`User-Agent：`浏览器通知服务器，客户端浏览器与操作系统相关信息

User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36

`Cookie：`客户端的Cookie就是通过这个报文头属性传给服务端的哦！Cookie: JSESSIONID=15982C27F7507C7FDAF0F97161F634B5

> 请求体

当请求方式是post的时，请求体会有请求的参数  username=zhangsan&password=123

#### http响应包括:响应行、响应头、响应体

​    ![0](https://i.loli.net/2021/10/19/lo3vCdL9OTDkZ2W.jpg)

> 响应行

`①报文协议及版本；`

例如：HTTP/1.1 200 OK

`②状态码及状态描述；`

状态码：由3位数字组成，第一个数字定义了响应的类别

`1xx：指示信息，表示请求已接收，继续处理`

`2xx：成功，表示请求已被成功接受，处理。`

200 OK：客户端请求成功

204 No Content：无内容。服务器成功处理，但未返回内容。一般用在只是客户端向服务器发送信息，而服务器不用向客户端返回什么信息的情况。不会刷新页面。

206 Partial Content：服务器已经完成了部分GET请求（客户端进行了范围请求）。响应报文中包含Content-Range指定范围的实体内容

`3xx：重定向`

301 Moved Permanently：永久重定向，表示请求的资源已经永久的搬到了其他位置。

302 Found：临时重定向，表示请求的资源临时搬到了其他位置

303 See Other：临时重定向，应使用GET定向获取请求资源。303功能与302一样，区别只是303明确客户端应该使用GET访问

307 Temporary Redirect：临时重定向，和302有着相同含义。POST不会变成GET

304 Not Modified：表示客户端发送附带条件的请求（GET方法请求报文中的IF…）时，条件不满足。返回304时，不包含任何响应主体。虽然304被划分在3XX，但和重定向一毛钱关系都没有

`4xx：客户端错误`

400 Bad Request：客户端请求有语法错误，服务器无法理解。

401 Unauthorized：请求未经授权，这个状态代码必须和WWW-Authenticate报头域一起使用。

403 Forbidden：服务器收到请求，但是拒绝提供服务

404 Not Found：请求资源不存在。比如，输入了错误的url

415 Unsupported media type：不支持的媒体类型

`5xx：服务器端错误，服务器未能实现合法的请求。`

500 Internal Server Error：服务器发生不可预期的错误。

503 Server Unavailable：服务器当前不能处理客户端的请求，一段时间后可能恢复正常，

> 响应头

Server: Apache-Coyote/1.1 

Set-Cookie: JSESSIONID=E1352C5CCEAD7EA9A6F8DA253395781C; Path=/vk 

Content-Type: application/json;charset=UTF-8 

Transfer-Encoding: chunked 

Date: Wed, 26 Sep 2018 03:24:59 GMT              



> 响应体

现阶段原生form表单提交方式：application/x-www-form-urlencoded /multipart/form-data

新的数据提交方式：application/json 、text/xml



### HTTP请求和TCP连接

HTTP请求和TCP连接不是一个概念。

HTTP请求通过TCP连接发送到服务器端

HTTP是客户端发起的请求

TCP连接是客户端与服务器端之间通信的桥梁



### HTTP中的GET和POST请求的区别？

​    ![0](https://i.loli.net/2021/10/19/fcB71gmtDvedkOy.png)

> 精简版

- GET 请求不安全（url暴露信息，只能传输ASCII码），POST请求相对安全（传输信息放在请求体中，urlencode编码）

- GET传输数据量较小（URL限制），POST传输数据量大。

- GET请求市获取数据，POST请求市提交数据，都是TCP连接。

> 复杂版

1. 一般来说GET是获取数据，POST是提交数据的，都是TCP连接。

2. `GET请求不安全，POST请求相对安全`

GET传输数据的时候是在URL地址中的、对所有人都是是可见的、是不安全的、是有浏览器缓存记录的。

GET只能传输`ASCLL字符`，不能进行编码。

POST传输的时候是放在HTTP的请求体之中的，并且是经过`urlencode编码`的所以是相对安全的。

POST是没有对数据类型的限制的，二进制数据也是可以的。

3. HTTP协议并没有对GET和POST的长度做限制，其实是浏览器限制了他们传输大小。

URL地址是有长度限制的，浏览器不同长度限制的具体数值也是不一样的。比如IE是2083字节。需要注意的是这些仅仅是URL地址栏的长度限制。

理论上来说POST的长度是没有限制的，但是受服务器的配置限制或者内存大小的限制，造成了实际开发中POST也是有数据长度的限制的。

4. 为什么说GET比POST更快？

POST和GET请求的过程是不一样的

POST请求的过程：先TCP3次握手，然后服务器返回100continue响应，浏览器再次发送数据，服务器返回200成功响应。

GET请求的过程：先TCP3次握手，浏览器发送数据，然后服务器返回成功响应。

也就是说`POST是要比GET多进行一次数据传输的`，所以GET请求就比POST请求更快。

但是在现在服务器配置较高和网速较快的情况下，这多出来的一次数据传输在实际中并没有什么影响。

5. 是否幂等性

GET是获取数据，所以GET请求是安全且幂等的，是无害的。这个安全指得是对数据不会造成影响。幂等简单的来说就是无论获取多少次数据得到的资源都是一样的。

POST是向服务器传输数据，数据会被重新提交，所以就会有对原有的数据造成伤害。

Form 中的 get 和 post 方法，在数据传输过程中分别对应了 HTTP 协议中的 GET 和 POST 方法。二者主要区别如下：

-  1、Get 是用来从服务器上获得数据，而 Post 是用来向服务器上传递数据。
-  2、Get 将表单中数据的按照 variable=value 的形式，添加到 action 所指向的 URL 后面，并且两者使用“?”连接，而各个变量之间使用“&”连接；Post 是将表单中的数据放在 form 的数据体中，按照变量和值相对应的方式，传递到 action 所指向 URL。
-  3、Get 是不安全的，因为在传输过程，数据被放在请求的 URL 中，而如今现有的很多服务器、代理服务器或者用户代理都会将请求URL记录到日志文件中，然后放在某个地方，这样就可能会有一些隐私的信息被第三方看到。另外，用户也可以在浏览器上直接看到提交的数据，一些系统内部消息将会一同显示在用户面前。Post 的所有操作对用户来说都是不可见的。
-  4、Get 传输的数据量小，这主要是因为受 URL 长度限制；而 Post 可以传输大量的数据，所以在上传文件只能使用 Post（当然还有一个原因，将在后面的提到）。
-  5、Get 限制 Form 表单的数据集的值必须为 ASCII 字符；而 Post 支持整个 ISO10646 字符集

使用 Post 传输的数据，可以通过设置编码的方式正确转化中文；而 Get 传输的数据却没有变化。

### HTTP与HTTPS的区别？

（1）HTTPS是密文传输，HTTP是明文传输；

（2）默认连接的端口号是不同的，HTTPS是443端口，而HTTP是80端口；

（3）HTTPS请求的过程需要CA证书要验证身份以保证客户端请求到服务器端之后，传回的响应是来自于服务器端，而HTTP则不需要CA证书；

（4）HTTPS=HTTP+加密+认证+完整性保护。

​    ![0](https://i.loli.net/2021/10/19/IYvt75SCurdeqcN.jpg)

#### 加密算法

- 对称加密：加密和解密都是使用的同一个密钥。

例如：数据加密标准（DES）、国际数据加密算法（IDEA）、3DES、Blowfish、RC4、RC5、RC6 和 AES 等

- 非对称加密：加密使用的密钥和解密使用的密钥是不相同的，分别称为：公钥、私钥，公钥和算法都是公开的，私钥是保密的。

例如：RSA、DSA（数字签名用）、ECDSA、 DH、ECDHE

- 哈希Hash算法：将任意长度的信息转换为较短的固定长度的值，通常其长度要比信息小得多，且`算法不可逆`。

例如：MD5、SHA-1、SHA-2、SHA-256、SHA-512等

- 数字签名：签名就是在信息的后面再加上一段内容（信息经过hash后的值），可以证明信息没有被修改过。hash值一般都会加密后（也就是签名）再和信息一起发送，以保证这个hash值不被修改。



### HTTPS访问过程

HTTPS作为一种安全的应用层协议，它使用了以上三种加密手段：`证书，对称加密和非对称加密`

证公钥的安全性，而是验证正确的交互方。可以使用下图进行说明：

​    ![0](https://i.loli.net/2021/10/19/67PUBezJbiv5rt3.jpg)

> 简化过程

发起请求 -》 回传带公钥的证书 -》 验证证书的有效性 -》 获取公钥 -》 生成客户端私钥 -》 用公钥加密传回服务器 -》 使用会话密钥进行对称加密。



> 详细过程

上述过程就是两次HTTP请求，其详细过程如下：

1.客户端想服务器发起HTTPS的请求，连接到服务器的443端口；

2.服务器将非对称加密的公钥传递给客户端，以证书的形式回传到客户端

3.服务器接受到该公钥进行验证，就是验证证书，如果有问题，则HTTPS请求无法继续；如果没有问题，则上述公钥是合格的。（第一次HTTP请求）客户端这个时候随机生成一个私钥，成为client key，会话密钥，用于对称加密数据的。使用前面的公钥对client key进行非对称加密；

4.进行二次HTTP请求，将加密之后的client key传递给服务器；

5.服务器使用私钥进行解密，得到client key，使用client key对数据进行对称加密

6.将对称加密的数据传递给客户端，客户端使用非对称解密，得到服务器发送的数据，完成第二次HTTP请求。

服务器发送了一个SSL证书给客户端，SSL 证书中包含的具体内容有：

（1）证书的发布机构CA

（2）证书的有效期

（3）公钥

（4）证书所有者

（5）签名

………

客户端在接受到服务端发来的SSL证书时，会对证书的真伪进行校验，以浏览器为例说明如下：

（1）首先浏览器读取证书中的证书所有者、有效期等信息进行一一校验

（2）浏览器开始查找操作系统中已内置的受信任的证书发布机构CA，与服务器发来的证书中的颁发者CA比对，用于校验证书是否为合法机构颁发 

（3）如果找不到，浏览器就会报错，说明服务器发来的证书是不可信任的。

`（4）如果找到，那么浏览器就会从操作系统中取出  颁发者CA  的公钥，然后对服务器发来的证书里面的签名进行解密`

（5）浏览器使用相同的hash算法计算出服务器发来的证书的hash值，将这个计算的hash值与证书中签名做对比

（6）对比结果一致，则证明服务器发来的证书合法，没有被冒充

（7）此时浏览器就可以读取证书中的公钥，用于后续加密了







### REST风格

​    动词和名词结合
​    状态码
​    URL中不能有动词，动词由HTTP的 get、post、put、delete 四种方法来表示。
​        GET: 获取资源
​        POST： 新建资源
​        PUT：在服务器更新资源（向客户端提供改变后的所有资源）
​        PATCH: 在服务器更新资源（向客户端提供改变的属性），都用PUT
​        DELETE：删除资源
​    URL结尾不应该包含斜杠“/”



### 其他问题



## 7.4 浏览器中输入URL

[查看详情，请参考](https://note.youdao.com/ynoteshare/index.html?id=92fb6a7d5d2542fb0296f4b8817f0462&type=note&_time=1634634007187)

> 简化过程

`整个过程`：DNS域名解析 （DNS递归查询与迭代查询）-》TCP三次握手建立连接 -》 发起HTTP请求-》 HTTP响应 -》 断开TCP连接 -》 浏览器解析HTML -》 浏览器布局和渲染

`整个过程涉用到的协议`：DNS协议（域名系统） -》 UDP协议（用户数据报协议） -》 HTTP协议（超文本传输协议） -》 TCP协议（传输控制协议） -》 IP协议（互联网协议） -》 ARP协议（地址解析协议）



客户端与本地域名服务器通信（递归查询），本地域名服务器与外部的域名服务器通信（迭代查询）。

所有网址真正的解析过程为: .（ .（根服务器） -> com.（顶级域名服务器） -> google.com.（主域名服务器） -> www.google.com.





浏览器要将URL解析为IP地址，解析域名就要用到`DNS协议`，首先主机会查询DNS的缓存，如果没有就给本地DNS发送查询请求。DNS查询分为两种方式，一种是递归查询，一种是迭代查询。如果是迭代查询，本地的DNS服务器，向根域名服务器发送查询请求，根域名服务器告知该域名的一级域名服务器，然后本地服务器给该一级域名服务器发送查询请求，然后依次类推直到查询到该域名的IP地址。DNS服务器是基于UDP的，因此会用到`UDP协议`。

得到IP地址后，浏览器就要与服务器建立一个http连接，要用到`http协议`。http生成一个get请求报文，将该报文传给TCP层处理，会用到`TCP协议`。如果采用https还会使用https协议先对http数据进行加密。TCP层如果有需要先将HTTP数据包分片，分片依据路径MTU和MSS。TCP的数据包然后会发送给IP层，用到`IP协议`。IP层通过路由选址，发送到目的地址。当然在一个网段内的寻址是通过以太网协议实现(也可以是其他物理层协议，比如PPP，SLIP)，以太网协议需要直到目的IP地址的物理地址，有需要`ARP协议`。

1、DNS协议，http协议，https协议属于应用层

应用层是体系结构中的最高层。应用层确定进程之间通信的性质以满足用户的需要。这里的进程就是指正在运行的程序。应用层不仅要提供应用进程所需要的信息交换和远地操作，而且还要作为互相作用的应用进程的用户代理，来完成一些为进行语义上有意义的信息交换所必须的功能。应用层直接为用户的应用进程提供服务。

2、TCP/UDP属于传输层

传输层的任务就是负责主机中两个进程之间的通信。因特网的传输层可使用两种不同协议：即面向连接的传输控制协议TCP，和无连接的用户数据报协议UDP。面向连接的服务能够提供可靠的交付，但无连接服务则不保证提供可靠的交付，它只是“尽最大努力交付”。这两种服务方式都很有用，备有其优缺点。在分组交换网内的各个交换结点机都没有传输层。

3、IP协议，ARP协议属于网络层

网络层负责为分组交换网上的不同主机提供通信。在发送数据时，网络层将运输层产生的报文段或用户数据报封装成分组或包进行传送。在TCP/IP体系中，分组也叫作IP数据报，或简称为数据报。网络层的另一个任务就是要选择合适的路由，使源主机运输层所传下来的分组能够交付到目的主机。

4、数据链路层

当发送数据时，数据链路层的任务是将在网络层交下来的IP数据报组装成帧，在两个相邻结点间的链路上传送以帧为单位的数据。每一帧包括数据和必要的控制信息（如同步信息、地址信息、差错控制、以及流量控制信息等）。控制信息使接收端能够知道—个帧从哪个比特开始和到哪个比特结束。控制信息还使接收端能够检测到所收到的帧中有无差错。

5、物理层

物理层的任务就是透明地传送比特流。在物理层上所传数据的单位是比特。传递信息所利用的一些物理媒体，如双绞线、同轴电缆、光缆等，并不在物理层之内而是在物理层的下面。因此也有人把物理媒体当做第0层





## 7.5 TCP与UDP协议

- 传输控制协议 TCP（Transmission Control Protocol） 提供⾯向连接的， 保证数据传输的可靠性

- ⽤户数据协议 UDP（User Datagram Protocol） -提供⽆连接的，尽最⼤努⼒的数据传输服务（不保证数据传输的可靠性）。

![image-20211019170718380](https://i.loli.net/2021/10/19/F3dm9v74cfnVTU1.png)



- UDP 在传送数据之前不需要先建⽴连接，远地主机在收到 UDP 报⽂后，不需要给出任何确认。虽然 UDP 不提供可靠交付，但在某些情况下 UDP 确是⼀种最有效的⼯作⽅式（⼀般⽤于即时通信），⽐如： QQ 语⾳、 QQ 视频 、直播等等TCP 提供⾯向连接的服务。在传送数据之前必须先建⽴连接，数据传送结束后要释放连接。

- TCP 不提供⼴播或多播服务。由于 TCP 要提供可靠的，⾯向连接的传输服务（TCP的可靠体现在TCP在传递数据之前，会有三次握⼿来建⽴连接，⽽且在数据传递时，有确认、窗⼝、重传、拥塞控制机制，在数据传完后，还会断开连接⽤来节约系统资源），这⼀难以避免增加了许多开销，如确认，流量控制，计时器以及连接管理等。这不仅使协议数据单元的⾸部增⼤很多，还要占⽤许多处理机资源。 TCP ⼀般⽤于⽂件传输、发送和接收邮件、远程登录等场景。

## 7.6 线程和进程各自有什么区别和优劣呢？
1.进程是资源分配的最小单位，线程是程序执行的最小单位。

2.进程有自己的独立地址空间，每启动一个进程，系统就会为它分配地址空间，建立数据表来维护代码段、堆栈段和数据段，这种操作非常昂贵。而线程是共享进程中的数据的，使用相同的地址空间，因此CPU切换一个线程的花费远比进程要小很多，同时创建一个线程的开销也比进程要小很多。

3.线程之间的通信更方便，同一进程下的线程共享全局变量、静态变量等数据，而进程之间的通信需要以通信的方式（IPC)进行。不过如何处理好同步与互斥是编写多线程程序的难点。

4.但是多进程程序更健壮，多线程程序只要有一个线程死掉，整个进程也死掉了，而一个进程死掉并不会对另外一个进程造成影响，因为进程有自己独立的地址空间。

## 未提问内容

## 线程通信

## 进程通信

# 9. 架构设计

## 常规问题

### 网站慢如何做优化？

问题场景：网站访问速度很慢，分析原因，如何解决问题？

一、服务端原因

（1）可能原因一：服务器出口带宽不够用+跨运营商网络导致带宽缩减。

（2）可能原因二：服务器负载过重，CPU占用大。

（3）可能原因三：后端开发没做SQL优化导致数据库读写性能差。

（4）可能原因四：数据库达到瓶颈，数据量庞大，导致读写性能差。

二、针对原因，检测问题，提出解决方案：

（1）确认网站是否是真的慢，通过浏览器的开发者模式的network选项，查看网页各个资源加载时间。对常规不变的资源采用CDN（content-delivery-network：内容分发网络）方式加载。

（2）监控服务器是否超过负载。

（4）查找数据库中查询慢的SQL语句，

（5）分库分表，mysql主从复制（主写/复读）；缓存机制

（6）系统拆分，做成多个微服务，web服务器集群部署，增加负载均衡和api网关。



第一步：登录后台服务器/监控平台，查看系统资源是否达到上限，例如：CPU、内存、磁盘、I/O、网络带宽等，如果是这些问题，先将这些问题逐一解决：

如果是CPU的问题，则需要查看一下CPU占比比较高的进程，然后使用jstack命令生成进程的堆栈信息，看是否发生频繁Full GC，如果是的话，还需要看一下内存快照，分析一下内存情况（可以使用java自带的或第三方工具）；如果是磁盘空间满了，及时清理磁盘；如果是带宽满了，联系网络工程师解决。如果以上这些问题都没有，则进行第二步。

第二步：检查应用服务器（Jboss/Tomcat）的线程池配置是否合理，看一下请求的排队现象是否严重，如果严重则需要重新设置合理的线程池。同样，检查一下数据库的连接池设置是否合理，增大连接池设置，同时检查一下是否有慢sql，如果有慢sql，则进行优化（优化方案是查看执行计划，设置合理的索引等）。

第三步：查看访问慢的服务的调用链，查看一下调用链中的每一步响应时间是否合理，如果不合理，则联系相关系统的负责人进行排查和解决。

第四步：检查web服务器的请求日志，看一下是否存在Doss攻击，如果有Doss攻击，则将攻击者的IP添加到防火墙的黑名单里。





### 分布式事务

### 分布式锁







# [10. 数据结构和算法](/05数据结构和算法/数据结构和算法)



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

### 资产证券化

#### 项目介绍

整合资产证券化业务流程，构建全流程电子信息化的资产证券化管理系统，涵盖：资产预选、资产备选、资产入库、资产交割、资产回购、资产财务处理、资产报表、服务商报告等功能。

系统间的交互：大数据平台 -》 证券化系统 -》外部系统



我主要完成部分流程的功能设计、后台逻辑的编写以及全权负责批处理框架搭建以及存储包数据处理开发。

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

##### 微服务Spring Boot-2.1.4.RELEASE

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



##### 缓存Redis-2.1.3

> 数据库和缓存双写的一致性问题

首页服务读取存储于缓存中的广告数据，数据库和缓存双写一致性，采用的`先更新数据库，再删除缓存`，缓存删除失败，采用`消息队列失败重试机制删除`，保证缓存最终是删除成功的，`实现最终一致性`，更新缓存的先删除缓存再更新，保证是最新的。如果说要强一致性，对同个数据的不同操作放到`JVM队列`当中有序执行，对后续重复更新缓存的操作给予过滤，避免重复操作。

> RedisTemplate模版方法

- RedisTemplate设置缓存的两种方式:

redisTemplate.boundXXXOps(XXX).set(value)

redisTemplate.opsForXXX().set(key, value, timeout)

详情参考：https://blog.csdn.net/lydms/article/details/105224210


- key：服务名称-商品分类-商品id，value：list对象转换成JSON对象

存入：JSON.*toJSON*(payChannelParamDTOS).toString()

获取：JSON.*parseArray*(PayChannelParamDTO_String, PayChannelParamDTO.class);

​    ![0](https://i.loli.net/2021/10/11/Y6Wk2hsOij1HNZF.png)



> 注解的方式开发

@EnableCaching：启动类开启缓存注解

@Cachable：根据方法的请求参数对其结果进行缓存

@CacheEvict：根据条件对缓存进行清空

@CachePut：根据方法的请求参数对其结果进行缓存

[实践操作](https://blog.csdn.net/Chen_0218/article/details/118369629)



##### 消息队列 RocketMQ-2.0.2

商品审核通过后，商品服务使用消息队列RocketMQ通知商品详情页服务实现商品页面静态化，以此减少访问数据、服务器压力



> 本项目选用RocketMQ的一个主要原因如下 

1、支持事务消息

2、支持延迟消息

3、天然支持集群、负载均衡

4、支持指定次数和时间间隔的失败消息重发

