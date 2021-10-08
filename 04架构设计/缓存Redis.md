

​    ![0](https://i.loli.net/2021/10/06/djBGgmXQUZsNfYD.png)

# 1. 概述

## 1.1 什么是Redis

Redis(Remote Dictionary Server) 是一个使用 C 语言编写的，开源的（BSD许可）高性能非关系型（NoSQL）的`键值对数据库`。

Redis 可以存储键和五种不同类型的值之间的映射。键的类型只能为字符串，值支持五种数据类型：字符串、列表、集合、散列表、有序集合。

与传统数据库不同的是 Redis 的数据是存在内存中的，所以读写速度非常快，因此 redis 被广泛应用于缓存方向，每秒可以处理超过 10万次读写操作，是已知性能最快的Key-Value DB。另外，Redis 也经常用来做分布式锁。除此之外，Redis 支持事务 、持久化、LUA脚本、LRU驱动事件、多种集群方案。

## 1.2 Redis有哪些优缺点

> 优点

- 读写性能优异， Redis能读的速度是110000次/s，写的速度是81000次/s。
- 支持数据持久化，支持AOF和RDB两种持久化方式。
- 支持事务，Redis的所有操作都是原子性的，同时Redis还支持对几个操作合并后的原子性执行。
- 数据结构丰富，除了支持string类型的value外，还支持hash、set、zset、list等数据结构。
- 支持主从复制，主机会自动将数据同步到从机，可以进行读写分离。

> 缺点

- 数据库容量受到物理内存的限制，不能用作海量数据的高性能读写，因此Redis适合的场景主要局限在较小数据量的高性能操作和运算上。
- Redis 不具备自动容错和恢复功能，主机从机的宕机都会导致前端部分读写请求失败，需要等待机器重启或者手动切换前端的IP才能恢复。
- 主机宕机，宕机前有部分数据未能及时同步到从机，切换IP后还会引入数据不一致的问题，降低了系统的可用性。
- Redis 较难支持在线扩容，在集群容量达到上限时在线扩容会变得很复杂。为避免这一问题，运维人员在系统上线时必须确保有足够的空间，这对资源造成了很大的浪费。

## 1.3 为什么要用 Redis /为什么要用缓存

主要从“高性能”和“高并发”这两点来看待这个问题。

> 高性能：

假如用户第一次访问数据库中的某些数据。这个过程会比较慢，因为是从硬盘上读取的。将该用户访问的数据存在数缓存中，这样下一次再访问这些数据的时候就可以直接从缓存中获取了。操作缓存就是直接操作内存，所以速度相当快。如果数据库中的对应数据改变的之后，同步改变缓存中相应的数据即可！

​    ![0](https://i.loli.net/2021/10/06/nXJ4H9fCM6kivg3.png)

> 高并发：

直接操作缓存能够承受的请求是远远大于直接访问数据库的，所以我们可以考虑把数据库中的部分数据转移到缓存中去，这样用户的一部分请求会直接到缓存这里而不用经过数据库。

​    ![0](https://i.loli.net/2021/10/06/ofdXO6n9zqIbwhY.png)

## 1.3 为什么要用 Redis 而不用 map/guava 做缓存?

缓存分为本地缓存和分布式缓存。

以 Java 为例，`使用自带的 map 或者 guava 实现的是本地缓存`，最主要的特点是轻量以及快速，生命周期随着 jvm 的销毁而结束，并且在多实例的情况下，`每个实例都需要各自保存一份缓存，缓存不具有一致性`。

`使用 redis 或 memcached 之类的称为分布式缓存`，在多实例的情况下，`各实例共用一份缓存数据，缓存具有一致性`。缺点是需要保持 redis 或 memcached服务的高可用，整个程序架构上较为复杂。

## 1.4 Redis为什么这么快

第一， 纯内存访问， Redis将所有数据放在内存中， 内存的响应时长大约为100纳秒， 这是Redis达到每秒万级别访问的重要基础。

第二， 非阻塞I/O， Redis使用epoll作为I/O多路复用技术的实现， 再加上Redis自身的事件处理模型将epoll中的连接、 读写、 关闭都转换为事件， 不在网络I/O上浪费过多的时间， 如图2-6所示。

​    ![0](https://i.loli.net/2021/10/07/TS8O7pHeUEIqhNx.png)

第三， 单线程避免了线程上下文切换和线程重新调度的开销。

单线程能带来几个好处：

第一， 单线程可以简化数据结构和算法的实现。 如果对高级编程语言熟悉的读者应该了解并发数据结构实现不但困难而且开发测试比较麻烦。

第二， 单线程避免了线程切换和竞态产生的消耗，对于服务端开发来说， 锁和线程切换通常是性能杀手。但是单线程会有一个问题： 对于每个命令的执行时间是有要求的。 如果某个命令执行过长， 会造成其他命令的阻塞， 对于Redis这种高性能的服务来说是致命的， 所以Redis是面向快速执行场景的数据库

## 1.5 全局命令

`设置成功，返回 1 。 设置失败，返回 0。`


- 查看所有的键： keys *

keys命令会遍历所有键， 所以它的时间复杂度是O(n)，当Redis保存了大量键时， 线上环境禁止使用。

- 查看当前数据库中键总数：dbsize 

dbsize命令在计算键总数时不会遍历所有键， 而是直接获取Redis内置的键总数变量， 所以dbsize命令的时间复杂度是O(1)。

- 检查键是否存在：exists key  

如果键存在则返回1， 不存在则返回0

- 删除键：del key [key ...]

无论值是什么数据结构类型， del命令都可以将其删除。返回结果为成功删除键的个数， 假设删除一个不存在的键， 就会返回0

- 键过期：expire key seconds

Redis支持对键添加过期时间， 当超过过期时间后， 会自动删除键

- 返回所剩过期时间：ttl key

ttl命令会返回键的剩余过期时间， 它有3种返回值：

大于等于0的整数： 键剩余的过期时间。

-1：键没设置过期时间。

-2：键不存在

- 键的数据结构类型：type key

例如键hello是字符串类型， 返回结果为string。 键mylist是列表类型， 返回结果为list；如果键不存在， 则返回none

## 1.6 数据结构和内部编码

查询内部编码：object encoding key

​    ![0](https://i.loli.net/2021/10/07/xNb9lUKAjT4asE5.png)

# 2. 数据类型

> Redis有哪些数据类型

Redis主要有5种数据类型，包括String，List，Set，Zset，Hash，满足大部分的使用要求

- String：可以是字符串、整数、浮点数。
- List(列表)：一个链表，链表上的每个节点都包含一个字符串。
- Set(无序集合)：包含字符串的无序收集器，并且被包含的每个字符串都是独一无二的，各不相同。
- Hash(散列)：包含键值对的无序散列表。
- ZSet(有序集合)：字符串成员与浮点数分值之间的有序映射，元素的排列顺序有分值大小决定。

(一)String

这个其实没啥好说的，最常规的set/get操作，value可以是String也可以是数字。一般做`复杂的计数功能的缓存`。

(二)hash

这里value存放的是结构化的对象，比较方便的就是操作其中的某个字段。

博主在做`单点登录`的时候，就是用这种数据结构存储用户信息，以cookieId作为key，设置30分钟为缓存过期时间，能很好的模拟出类似session的效果。

(三)list

使用List的数据结构，可以做简单的`消息队列`的功能。另外还有一个就是，可以利用lrange命令，做基于redis的分页功能，性能极佳，用户体验好。

本人还用一个场景，很合适---取行情信息。就也是个生产者和消费者的场景。LIST可以很好的完成排队，先进先出的原则。

(四)set

因为set堆放的是一堆不重复值的集合。所以可以`做全局去重的功能`。

为什么不用JVM自带的Set进行去重？

因为我们的系统一般都是集群部署，使用JVM自带的Set，比较麻烦，难道为了一个做一个全局去重，再起一个公共服务，太麻烦了。

另外，就是利用交集、并集、差集等操作，可以`计算共同喜好，全部的喜好，自己独有的喜好`等功能。

(五)sorted set

sorted set多了一个权重参数score,集合中的元素能够按score进行排列。可以做`排行榜应用，取TOP N操作。`

## 2.1 Redis中的String类型

### 2.1.1 简单介绍

1. 介绍 ：string 数据结构是简单的 key-value 类型。虽然 Redis 是用 C 语言写的，但是 Redis 并没有使用 C 的字符串表示，而是自己构建了一种 简单动态字符串（simple dynamic string，SDS）。相比于 C 的原生字符串，Redis 的 SDS 不光可以保存文本数据还可以保存二进制数据，并且获取字符串长度复杂度为 O(1)（C 字符串为 O(N)）,除此之外,Redis 的 SDS API 是安全的，不会造成缓冲区溢出。
2. 常用命令: set,get,strlen,exists,decr,incr,setex 等等。
3. 应用场景 ：一般常用在需要计数的场景，比如用户的访问次数、热点文章的点赞转发数量等等。

### 2.1.2 具体应用

`1）基本操作：`（redis命令后不加括号，直接以空格在识别方法key或value）

​    set key-name value 设置存储在给定键中的值

​    get key-name value 获取存储在给定键中的值

​    del key-name value 删除存储在给定键中的值 

​    incr key-name  将键存储的值加上1

​    decr key-name 将键存储的值减去1

​    incrby key-name amount 将键存储的值加上整数amount

​    decrby key-name amount 将键存储的值减去整数amount

​    strlen key 返回 key 所储存的字符串值的长度。

​    setnx key value 只有在 key 不存在时设置 key 的值。

`2）批量设置`

```shell
127.0.0.1:6379> mset key1 value1 key2 value2 # 批量设置 key-value 类型的值 
OK 
127.0.0.1:6379> mget key1 key2 # 批量获取多个 key 对应的 value 
1) "value1" 
2) "value2"
```
`3）过期`
```shell
127.0.0.1:6379> expire key  60 # 数据在 60s 后过期 
(integer) 1 
127.0.0.1:6379> setex key 60 value # 数据在 60s 后过期 (setex:[set] + [ex]pire) 
OK
127.0.0.1:6379> ttl key # 查看数据还有多久过期
(integer) 56
```
4）其他

​    incrbyfloat key-name amount 将键存储的值加上浮点数amount,(只在redis2.6及以上版本可用)

​    append key-name value 将值value追加到给定键key-name当前存储的值的末尾

​    getrange key-name start end 获取一个有偏移量start至偏移量end范围内所有字符组成的子串，包括start和end在内

​    setrange key-name offset value 将从start偏移量开始的子串设置为给定值（从offset开始，包括offset，将原子串替换成value）

​    getbit key-name offset 将字符串看作是二进制位串，并返回位串中偏移量为offset的二进制位的值

​    setbit key-name offset value 将字符串看作是二进制位串，并将位串中偏移量为offset的二进制位的值设置为value

​    bitcount key-name [start end] 统计二进制位串中值为1的二进制位的数量，如果给定了可选的start、end偏移量，则只统计指定范围内的二进制位数量

​    bitop operation dest-key key-name [key-name...] 对一个或多个二进制位串执行包括and（并）\or（或）\xor（异或）\not（非）在内的任意一种按位运算操作，

并将计算结果保存在**dest-key键`里面

2）.在Redis中，字符串可以存储以下3种数据类型：字节串（byte string）、整数、浮点数。

3）.可以通过给定任意数值，对存储着整数或浮点数的字符串执行自增（increment）或自减（decrement）。 

4）.redis还会将整数转换成浮点数，    整数的取值范围和系统的长整数（long integer）取值范围一致，    浮点数的取值范围和精度则与IEEE754标准的双精度浮点数（double）相同。 

5）.将一个值存储到redis字符串里面的时候，如果这个值可以被interpret成整数或浮点数，那么redis会允许对字符串进行incr和decr操作。 

6）.如果对一个不存在的键或者保存了一个空串的键执行自增或自减，redis会将这个键的值当成0来处理。 

7）.如果对无法被解释成整数或者浮点数的值进行自增或者自减操作，redis会返回一个错误。 

8）.在使用setrange和setbit对字符串进行写入的时候，如果字符串的长度不足，redis会自动使用空字串将字符串扩展至所需的长度，然后执行写入或者更新操作 

9）.在使用getrange时超出字符串末尾的数据会被视为空串，在使用getbit时超出字符串末尾的二进制位会被视为0                   

## 2.2 Redis中的列表List

### 2.2.1 简单介绍

1. 介绍 ：list 即是 链表。链表是一种非常常见的数据结构，特点是易于数据元素的插入和删除并且且可以灵活调整链表长度，但是链表的随机访问困难。许多高级编程语言都内置了链表的实现比如 Java 中的 LinkedList，但是 C 语言并没有实现链表，所以 Redis 实现了自己的链表数据结构。Redis 的 list 的实现为一个 `双向链表，即可以支持反向查找和遍历`，更方便操作，不过带来了部分额外的内存开销。
2. 常用命令: rpush,lpop,lpush,rpop,lrange、llen 等。
3. 应用场景: 发布与订阅或者消息队列、慢查询。

### 2.2.2 具体的应用

通过 rpush/rpop 实现栈：
```shell
127.0.0.1:6379> rpush myList2 value1 value2 value3 
(integer) 3 
127.0.0.1:6379> rpop myList2 # 将 list的头部(最右边)元素取出 
"value3"    
```

我专门花了一个图方便小伙伴们来理解：

​    ![0](https://i.loli.net/2021/10/07/qLzRwlUYbQgapdC.png)

通过 lrange 查看对应下标范围的列表元素：


```shell
127.0.0.1:6379> rpush myList value1 value2 value3
(integer) 3
127.0.0.1:6379> lrange myList 0 1 # 查看对应下标的list列表， 0 为 start,1为 end
1) "value1"
2) "value2"
127.0.0.1:6379> lrange myList 0 -1 # 查看列表中的所有元素，-1表示倒数第一
1) "value1"
2) "value2"
3) "value3"              
```

`通过` **lrange** `命令，你可以基于 list 实现分页查询，性能非常高！`

通过 llen 查看链表长度：

```shell
127.0.0.1:6379> llen myList 
(integer) 3              
```

1）.方法

​    lpush key-name value1 value2 ....valueN 将一个或多个元素推入列表的左端

​    rpush key-name value1 value2 ....valueN 将一个或多个元素推入列表的右端

   lpop key-name 移除并返回列表的左端元素

   rpop key-name 移除并返回列表的右端元素

  lindex key-name offset 返回列表中偏移量为offset的元素

  lrange key-name start end 返回列表从start（包括start）偏移量到end（包括end）偏移量范围内的所有元素

​        从左到右依次是 0 1 2 ... n-1

​        从右到左依次是 -1 -2 -3 ... -n

  ltrim key-name start end 对列表进行修剪，只保留从start（包括start）偏移量到end（包括end）偏移量范围内的元素

​    

`以下几个命令是关于将元素从一个列表移动到另一个列表，或者阻塞（block）执行命令的客户端直到有其他的客户端给列表添加元素为止`

  blpop key-name [key-name...] timeout 从第一个非空列表中弹出位于最左端的元素，或者在timeout秒之内阻塞并等待可弹出的元素出现

  brpop key-name [key-name...] timeout 从第一个非空列表中弹出位于最右端的元素，或者在timeout秒之内阻塞并等待可弹出的元素出现

  rpoplpush source-key dest-key 从source-key列表弹出位于最右端的元素，然后将元素推入dest-key列表的最左端，并向用户返回这个元素

  brpoplpush source-key dest-key timeout 从source-key列表弹出位于最右端的元素，然后将元素推入dest-key列表的最左端，并向用户返回这个元素，

​      如果source-key为空，那么在timeout秒之内阻塞并等待可淡出元素的出现

2）.在redis中多个命令原子的执行指的是，在这些命令正在读取或者修改数据的时候，其他客户端不等读取或修改相同的数据

3）.列表里面的元素可以重复。

4）.列表的优点在于他可以包含多个字符串值，这使的用户可以将数据集中的放在一个地方

## 2.3 Redis的散列hashSet（类似于HashMap）

### 2.3.1 简单介绍

1. 介绍 ：hash 类似于 JDK1.8 前的 HashMap，内部实现也差不多(数组 + 链表)。不过，Redis 的 hash 做了更多优化。另外，hash 是一个 string 类型的 field 和 value 的映射表，特别适合用于存储对象，后续操作的时候，你可以直接仅仅修改这个对象中的某个字段的值。 比如我们可以 hash 数据结构来存储用户信息，商品信息等等。
2. 常用命令： hset,hmset,hexists,hget,hgetall,hkeys,hvals 等。
3. 应用场景: 系统中对象数据的存储。

### 2.3.2 具体应用


```shell
127.0.0.1:6379> hmset userInfoKey name "guide" description "dev" age "24" 
OK 
127.0.0.1:6379> hexists userInfoKey name # 查看 key 对应的 value中指定的字段是否存在。 (integer) 1 
127.0.0.1:6379> hget userInfoKey name # 获取存储在哈希表中指定字段的值。 
"guide" 
127.0.0.1:6379> hget userInfoKey age 
"24" 
127.0.0.1:6379> hgetall userInfoKey # 获取在哈希表中指定 key 的所有字段和值 
1) "name" 
2) "guide" 
3) "description" 
4) "dev" 
5) "age" 
6) "24" 
127.0.0.1:6379> hkeys userInfoKey # 获取 key 列表 
1) "name" 
2) "description" 
3) "age" 
127.0.0.1:6379> hvals userInfoKey # 获取 value 列表 
1) "guide" 
2) "dev" 
3) "24" 
127.0.0.1:6379> hset userInfoKey name "GuideGeGe" # 修改某个字段对应的值 
127.0.0.1:6379> hget userInfoKey name 
"GuideGeGe"  
```

1）.方法

​     hset key-name key value 在散列中关联起给定的键值对

​     hget key-name key 获取指定散列键的值

​     hgetall key-name 获取散列包含的所有的键值对

​     hdel key-name 如果给定键存在于散列里面，那么移除这个键



​     hmget key-name key [key...] 从散列里面获取一个或多个键的值

​     hmset key-name key value [key value...] 为散列里面的一个或多个键设置值

​    

​    hdel key-name key [key...] 删除散列里面一个或多个键值对，返回成功找到并删除的键值对的数量

​    

​    hlen key-name 返回散列包含的键值对的数量

​    hexists key-name key 检查给定键是否存在与散列中

​    

​    hkeys key-name 获取散列包含的所有键

​    hvals key-name 获取散列包含的所有值

​    hgetall key-name 获取散列中包含的所有键值对

​    

​    hincby key-name key increment 将键key保存的值加上整数increment

​    hincrbyfloat key-name key increment 将键key保存的值上加上浮点数increment

​    

2）.redis的散列可以让用户将多个键值对存储到redis键里面

3）.像hmget和hset这种批量处理多个键值对的命令既可以为用户带来方便，并且可以通过减少命令的调用次数以及客户端与redis之间的通信次数来提升redis的性能

4）.如果散列包含的值非常大，用户可以使用hkeys去除所有的键，然后使用hget一个一个的取出对应的值，从而避免因一次取出多个大体积的值导致服务器阻塞

## 2.4 Redis中的无序集合Set

### 2.4.1 简单介绍

1. 介绍 ： set 类似于 Java 中的 HashSet 。Redis 中的 set 类型是一种无序集合，集合中的元素没有先后顺序。当你需要存储一个列表数据，又不希望出现重复数据时，set 是一个很好的选择，并且 set 提供了判断某个成员是否在一个 set 集合内的重要接口，这个也是 list 所不能提供的。可以基于 set 轻易实现交集、并集、差集的操作。比如：你可以将一个用户所有的关注人存在一个集合中，将其所有粉丝存在一个集合。**Redis 可以非常方便的实现如共同关注、共同粉丝、共同喜好等功能`。这个过程也就是求交集的过程。
2. 常用命令： sadd,spop,smembers,sismember,scard,sinterstore,sunion 等。
3. 应用场景: 需要存放的数据不能重复以及需要获取多个数据源交集和并集等场景

### 2.4.2 具体应用

```shell
127.0.0.1:6379> sadd mySet value1 value2 # 添加元素进去
(integer) 2
127.0.0.1:6379> sadd mySet value1 # 不允许有重复元素
(integer) 0
127.0.0.1:6379> smembers mySet # 查看 set 中所有的元素
1) "value1"
2) "value2"
127.0.0.1:6379> scard mySet # 查看 set 的长度
(integer) 2
127.0.0.1:6379> sismember mySet value1 # 检查某个元素是否存在set 中，只能接收单个元素
(integer) 1
127.0.0.1:6379> sadd mySet2 value2 value3
(integer) 2
127.0.0.1:6379> sinterstore mySet3 mySet mySet2 # 获取 mySet 和 mySet2 的交集并存放在 mySet3 中
(integer) 1
127.0.0.1:6379> smembers mySet3
1) "value2"
```

1）.方法

​    sadd key-name item1 item2 item3 ... itemN 将一个或多个元素添加到集合里面，并返回被添加元素的当中原本并不存在于集合里的元素的数量

​        集合中已经存在要添加的元素，则返回0；不存在，根据实际添加的元素个数，返回对应元素的数量。

  srem key-name item [item...] 从集合里面移除一个或多个元素，并返回被移除元素的数量

  sismember key-name item 检查除元素item是否存在于集合key-name里,若存在，则返回1；若不存在，则返回0。

​    scard key-name 返回集合包含的元素数量

  smembers key-name 返回集合包含的所有元素

  srandmember key-name [count] 从集合里随机的返回一个或多个元素，

​        当count为正数时，命令返回的随机元素不会重复;

​        当count为负数时，命令返回的随机元素可能会出现重复.

  spop key-name 随机的移除集合中的一个元素，并返回被移除的元素 

  smove source-key dest-key item 

​        如果集合source-key包含元素item，那么从集合source-key里面移除元素item，并将元素item添加到集合dest-key中，

​        若item成功移除则返回1，否则返回0 

下面是组合和关联多个集合的命令

  sdiff key-name [key-name] 返回那些存在与第一个集合而不存在于其他集合的元素（差集运算）

  sdiffstore dest-key key-name [key-name...] 将那些存在于第一个key-name集合，而不存在于其他集合的元素存储到dest-key键里面

  sinter key-name [key-name] 返回那些同时存在于所有集合中的元素（交集运算）

  sinterstore dest-name key-name [key-name...] 将那些同时存在于所有集合中的元素，存储到dest-key键里面

  sunion key-name1 key-name2 key-name3 ... key-nameN 返回那些至少存在于一个集合中的元素（并集运算）

   sunionstore dest-name key-name [key-name...] 将那些至少存在于一个集合中的元素存储到dest-key键里面

2）.集合通过散列表来保证每个元素都是唯一的，可以以无序的方式来存储多个各不相同的元素

3）.redis的集合可以被多个客户端远程进行访问

## 2.5 Redis的有序集合ZSet

### 2.5.1 简单介绍

1. 介绍： 和 set 相比，sorted set 增加了一个权重参数 score，使得集合中的元素能够按 score 进行有序排列，还可以通过 score 的范围来获取元素的列表。有点像是 Java 中 HashMap 和 TreeSet 的结合体。
2. 常用命令： zadd,zcard,zscore,zrange,zrevrange,zrem 等。
3. 应用场景： 需要对数据根据某个权重进行排序的场景。`比如在直播系统中，实时排行信息包含直播间在线用户列表，各种礼物排行榜，弹幕消息`（可以理解为按消息维度的消息排行榜）等信息。

### 2.5.2 具体应用

```shell
127.0.0.1:6379> zadd myZset 3.0 value1 # 添加元素到 sorted set 中 3.0 为权重 
(integer) 1 
127.0.0.1:6379> zadd myZset 2.0 value2 1.0 value3 # 一次添加多个元素
(integer) 2 
127.0.0.1:6379> zcard myZset # 查看 sorted set 中的元素数量
(integer) 3 
127.0.0.1:6379> zscore myZset value1 # 查看某个 value 的权重 
"3" 
127.0.0.1:6379> zrange  myZset 0 -1 # 顺序输出某个范围区间的元素，0 -1 表示输出所有元素 
1) "value3" 
2) "value2" 
3) "value1" 
127.0.0.1:6379> zrange  myZset 0 1 # 顺序输出某个范围区间的元素，0 为 start  1 为 stop 
1) "value3" 
2) "value2" 
127.0.0.1:6379> zrevrange  myZset 0 1 # 逆序输出某个范围区间的元素，0 为 start  1 为 stop 
1) "value1" 
2) "value2"               
```
1）有序集合与散列一样，都用于存储键值对；有序集合的键被称为成员（member）每个成员都是唯一的；

有序集合的值则被称为分值（score）,分值必须是浮点数；

有序集合是Redis里面唯一一个既可以根据成员访问元素，又可以根据分值以及分值的排列顺序来访问元素的结构

2）方法

zadd key-name score member [score member...] 将带有给定分值的成员添加到有序集合里面

zrange key-name start stop [withscores] 返回有序集合中排名介于start和stop之间的成员，如果给定了可选的withscores（just withscores本身）选项，那么命令会将成员的分值也一并返回

注意：这里的start stop是排名的次序，而不是分数范围

zrangebyscore key-name min max [withscores] [limit offset count] 返回有序集合中排名介于min和max之间的所有成员，

注意：这里是min max 是分数的最小最大值，分数范围

zrem key-name member [member...] 从有序集合里面移除给定的成员，并返回被移除成员的数量

zcard key-name 返回有序集合包含的成员数量

zincrby key-name increment member 将成员的分值上加上incremen

zcount key-name min max 返回分值介于min和max之间的成员数量 

zrank key-name member 返回成员member在有序集合中的排

zscore key-name member 返回成员member的分值

  

zrevrank key-name member 返回有序集合成员member所处的位置，成员按照分值从大到小排列

zrevrange key-name start stop [withscores] 返回有序集合给定的排名范围内的成员，成员按照分值从大到小排列

zrevrangebyscore key-name max min [withscores] [limit offset count] 获取有序集合中分值介于min和max之间的所有成员，并按照分值从大到小的顺序返回他们

  

zremrangebyrank key-name start stop 移除有序集合中排名介于start和stop之间的所有成员

zremrangebyscore key-name min max 移除有序集合中分值介于start和stop之间的所有成员


zinterstore dest-key key-count key [key...] [weights weight [weight...]] [aggregate sum|min|max] 对给定的有序集合执行类似于集合的交集运算（sum|min|max 三种聚合函数）

zunionstore dest-key key-count key [key...] [weights weight [weight...]] [aggregate sum|min|max] 对给定的有序集合执行类似于集合的并集运算（sum|min|max 三种聚合函数）

## 2.6 Redis的应用场景总结

- 计数器

String 进行自增自减运算，从而实现计数器功能。Redis 这种内存型数据库的读写性能非常高，很适合存储频繁读写的计数量。

- 缓存

将热点数据放到内存中，设置内存的最大使用量以及淘汰策略来保证缓存的命中率。

- 会话缓存

可以使用 Redis 来统一存储多台应用服务器的会话信息。当应用服务器不再存储用户的会话信息，也就不再具有状态，一个用户可以请求任意一个应用服务器，从而更容易实现高可用性以及可伸缩性。

- 全页缓存（FPC）

除基本的会话token之外，Redis还提供很简便的FPC平台。以Magento为例，Magento提供一个插件来使用Redis作为全页缓存后端。此外，对WordPress的用户来说，Pantheon有一个非常好的插件 wp-redis，这个插件能帮助你以最快速度加载你曾浏览过的页面。

- 查找表

例如 DNS 记录就很适合使用 Redis 进行存储。查找表和缓存类似，也是利用了 Redis 快速的查找特性。但是查找表的内容不能失效，而缓存的内容可以失效，因为缓存不作为可靠的数据来源。

- 消息队列(发布/订阅功能)

List 是一个双向链表，可以通过 lpush 和 rpop 写入和读取消息。不过最好使用 Kafka、RabbitMQ 等消息中间件。

- 分布式锁实现

在分布式场景下，无法使用单机环境下的锁来对多个节点上的进程进行同步。可以使用 Redis 自带的 SETNX 命令实现分布式锁，除此之外，还可以使用官方提供的 RedLock 分布式锁实现。

- 其它

Set 可以实现交集、并集等操作，从而实现共同好友等功能。ZSet 可以实现有序性操作，从而实现排行榜等功能。

![0](https://i.loli.net/2021/10/06/EPsxW5lIMJFpGbZ.png)

如上所述，虽然Redis不像关系数据库那么复杂的数据结构，但是，也能适合很多场景，比一般的缓存数据结构要多。了解每种数据结构适合的业务场景，不仅有利于提升开发效率，也能有效利用Redis的性能。

# 3. redis的过期键删除策略以及内存淘汰策略

> Redis key的过期时间和永久有效分别怎么设置？

EXPIRE和PERSIST命令。

## 3.1 Redis的过期键删除策略

### 3.1.1 过期策略
过期策略通常有以下三种

- 定时删除：每个设置过期时间的key都需要创建一个定时器，到过期时间就会立即清除。该策略可以立即清除过期的数据，对内存很友好；但是会占用大量的CPU资源去处理过期的数据，从而影响缓存的响应时间和吞吐量。
- 惰性删除：只有当访问一个key时，才会判断该key是否已过期，过期则清除。该策略可以最大化地节省CPU资源，却对内存非常不友好。极端情况可能出现大量的过期key没有再次被访问，从而不会被清除，占用大量内存。
- 定期删除：每隔一定的时间，会扫描一定数量的数据库的**expires字典`中一定数量的key，并清除其中已过期的key。该策略是前两者的一个折中方案。通过调整定时扫描的时间间隔和每次扫描的限定耗时，可以在不同情况下使得CPU和内存资源达到最优的平衡效果。

(expires字典会保存所有设置了过期时间的key的过期时间数据，其中，key是指向键空间中的某个键的指针，value是该键的毫秒精度的UNIX时间戳表示的过期时间。键空间是指该Redis集群中保存的所有键。)

Redis中同时使用了惰性删除和定期删除两种过期策略。

### 3.1.2 Redis的惰性删除和定期删除策略

> 常见问题

- 往 Redis 写入的数据怎么没了？

对键设置过期时间。

- 数据明明过期了，怎么还占用着内存？

由过期策略决定。

> Redis 过期策略是：定期删除+惰性删除。

所谓定期删除，指的是 Redis 默认是每隔 100ms 就随机抽取一些设置了过期时间的 key，检查其是否过期，如果过期就删除。

假设 Redis 里放了 10w 个 key，都设置了过期时间，你每隔几百毫秒，就检查 10w 个 key，那 Redis 基本上就死了，cpu 负载会很高的，消耗在你的检查过期 key 上了。注意，这里可不是每隔 100ms 就遍历所有的设置过期时间的 key，那样就是一场性能上的灾难。实际上 Redis 是每隔 100ms 随机抽取一些 key 来检查和删除的。

但是问题是，定期删除可能会导致很多过期 key 到了时间并没有被删除掉，那咋整呢？所以就是惰性删除了。这就是说，在你获取某个 key 的时候，Redis 会检查一下 ，这个 key 如果设置了过期时间那么是否过期了？如果过期了此时就会删除，不会给你返回任何东西。

获取 key 的时候，如果此时 key 已经过期，就删除，不会返回任何东西。

但是实际上这还是有问题的，如果定期删除漏掉了很多过期 key，然后你也没及时去查，也就没走惰性删除，此时会怎么样？如果大量过期 key 堆积在内存里，导致 Redis 内存块耗尽了，咋整？

答案是：走内存淘汰策略。

> 为什么不用定时删除策略?

定时删除,用一个定时器来负责监视key,过期则自动删除。虽然内存及时释放，但是十分消耗CPU资源。在大并发请求下，CPU要将时间应用在处理请求，而不是删除key，因此没有采用这一策略.

> 定期删除+惰性删除是如何工作的呢?

所谓定期删除，指的是， Redis 默认是每隔 100ms 就随机抽取一些设置了过期时间的 key，检查其是否过期，如果过期就删除。
所谓惰性删除，指的是，获取 key 的时候，如果此时 key 已经过期，就删除，不会返回任何东西。

定期删除，redis默认每隔100ms检查，是否有过期的key,有过期key则删除。需要说明的是，redis不是每个100ms将所有的key检查一次，而是`随机抽取`进行检查(如果每隔100ms,全部key进行检查，redis岂不是卡死)。因此，如果只采用定期删除策略，`会导致很多key到时间没有删除`。

于是，惰性删除派上用场。也就是说在你获取某个key的时候，redis会检查一下，这个key如果设置了过期时间那么是否过期了？如果过期了此时就会删除。


> 采用定期删除+惰性删除就没其他问题了么?

定期删除和惰性删除都没把key删除成功，redis的内存会越来越高。那么就应该采用内存淘汰机制。

## 3.2 内存淘汰策略

### 3.2.1 配置内存大小

> 我们应该为 Redis 设置多大的内存容量呢？

根据“八二原理“，即 80% 的请求访问了 20% 的数据，因此如果按照这个原理来配置，将 Redis 内存大小设置为数据总量的 20%，就有可能拦截到 80% 的请求。一般建议把缓存容量设置为总数据量的 15% 到 30%，兼顾访问性能和内存空间开销。

（以 5GB 为例，`如果不带单位则默认单位是字节`）：

- 命令行设置

 config set maxmemory 5gb              

- 配置文件redis.conf设置

​    ![0](https://i.loli.net/2021/10/07/orxHQSgj1bi3VLc.png)

- 查看 maxmemory 命令

config get maxmemory              

### 3.2.2 内存淘汰策略详解

在 Redis 4.0 版本之前有 6 种策略，4.0版本增加了 2种，主要新增了 LFU 算法。

下图为 Redis 6.2.0 版本的配置文件：

![img](https://i.loli.net/2021/10/07/1o9vTm4WEV8bZzu.png)

maxmemory-policy 达到最大内存后，设置空间清理策略。可选项如下：

1. volatile-lru：在有 expire 属性的 key 范围内按照 lru 原则清理
2. allkeys-lru：在所有 key 范围内按照 lru 原则清理
3. volatile-lfu：在有 expire 属性的 key 范围内按照 lfu 原则清理
4. allkeys-lfu：在所有 key 范围内按照 lfu 原则清理
5. volatile-random：在有 expire 属性的 key 范围内随机清理
6. allkeys-random：在所有 key 范围内随机清理
7. volatile-ttl：在有 expire 属性的 key 范围内清理即将到期的 key
8. noeviction：不清理，默认

我们可以对 8 种淘汰策略可以分为两大类：

#### 3.2.2.1 不进行淘汰的策略

noevition，此策略不会对缓存的数据进行淘汰，当内存不够了就会报错， 因此，如果真实数据集大小大于缓存容量，就不要使用此策略了。              

​    ![0](https://i.loli.net/2021/10/07/dcZstHpSh8N9KGq.png)

#### 3.2.2.2 会进行淘汰的策略

##### 3.2.2.2.1 在设置了过期时间的数据中筛选

volatile-random：随机删除

volatile-ttl：根据过期时间先后进行删除，越早过期的越先被删除

volatile-lru：使用 LRU 算法进行筛选删除

volatile-lfu：使用 LFU 算法进行筛选删除

##### 3.2.2.2.2 在所有数据中筛选

allkeys-random：随机删除

allkeys-lru：使用 LRU 算法进行筛选删除

allkeys-lfu：使用 LFU 算法进行筛选删除



#### 3.2.2.3 小结（优先）

`以 volatile 开头的策略：只针对设置了过期时间的数据，即使缓存没有被写满，如果数据过期也会被删除。`

`以 allkeys 开头的策略：针对所有数据的，如果数据被选中了，即使过期时间没到，也会被删除。当然，如果它的过期时间到了但未被策略选中，同样会被删除。`



#### 3.2.2.4 配置方式（优先）

- 命令行设置
```shell
config set maxmemory-policy allkeys-lru
```


- 配置文件redis.conf中设置

```shell
maxmemory-policy volatile-lru
```

可以有如下参数选择：
当内存不足以容纳新写入数据时，
1）noeviction：新写入操作会报错。（应该没人用吧，不推荐）。
`2）allkeys-lru：在键空间中，移除最近最少使用的key。（推荐）`
3）allkeys-random：在键空间中，随机移除某个key。（应该也没人用吧，你不删最少使用Key，去随机删）
4）volatile-lru：在设置了过期时间的键空间中，移除最近最少使用的key。（这种情况一般是把redis既当缓存，又做持久化存储的时候才用。不推荐）
5）volatile-random：在设置了过期时间的键空间中，随机移除某个key。（不推荐）
6）volatile-ttl：在设置了过期时间的键空间中，有更早过期时间的key优先移除。（不推荐）

`⚠️注意：如果key没有设置 expire , 不满足先决条件(prerequisites)，那么 volatile-lru, volatile-random 和 volatile-ttl 策略的行为, 和 noeviction(不删除) 基本上一致。`

### 3.2.3 内存淘汰策略核心算法

#### 3.2.3.1 LRU 算法

LRU 全称是 Least Recently Used，即最近最少使用，会将最不常用的数据筛选出来，保留最近频繁使用的数据。

LRU 会把所有数据组成一个链表，`链表头部称为 MRU（Most Recently Used），代表最近最常使用的数据；尾部称为 LRU代表最近最不常使用的数据；`

`下图是一个简单的例子：`

​    ![0](https://i.loli.net/2021/10/07/lc61YTVgNz3yCIu.png)

`但是，如果直接在 Redis 中使用 LRU 算法也会有一些问题：`

LRU 算法在实现过程中使用链表管理所有缓存的数据，这会给 Redis 带来额外的开销，而且，当有数据访问时就会有链表移动操作，进而降低 Redis 的性能。

于是，Redis 对 LRU 的实现进行优化：

- 记录每个 key 最近一次被访问的时间戳（由键值对数据结构 Redis Object 中的 LRU 字段记录）
- 在第一次淘汰数据时，会先随机选择 N 个数据作为一个`候选集合`，然后淘汰 LRU 值最小的。（N 可以通过 config set maxmemory-samples 100 命令来配置）
- 后续再淘汰数据时，会挑选数据进入候选集合，进入集合的条件是：它的 lru 小于候选集合中最小的 lru。
- 如果候选集合中数据个数达到了 maxmemory-samples，Redis 就会将 lru 值小的数据淘汰出去。

#### 3.2.3.2 LFU 算法

LFU 全称 Least Frequently Used，即最不经常使用策略，它是基于数据访问次数来淘汰数据的，在 **Redis 4.0 时`添加进来。它在 LRU 策略基础上，为每个数据增加了一个计数器，来统计这个数据的访问次数。

前面说到，LRU 使用了 RedisObject 中的 lru 字段记录时间戳，lru 是 24bit 的，LFU 将 lru 拆分为两部分：

- ldt 值：lru 字段的前 16bit，`表示数据的访问时间戳`
- counter 值：lru 字段的后 8bit，`表示数据的访问次数`

`使用 LFU 策略淘汰缓存时，会把访问次数最低的数据淘汰，如果访问次数相同，再根据访问的时间，将访问时间戳最小的淘汰。`

#### 3.2.3.3 FIFO算法

FIFO 全程 First In First Out，先进先出。判断被存储的时间，离目前最远的数据优先被淘汰。

#### 3.2.3.3.4 为什么 Redis 有了 LRU 还需要 LFU 呢？

在一些场景下，有些数据被访问的次数非常少，甚至只会被访问一次。当这些数据服务完访问请求后，如果还继续留存在缓存中的话，就只会白白占用缓存空间。

由于 LRU 是基于访问时间的，如果系统对大量数据进行单次查询，这些数据的 lru 值就很大，使用 LFU 算法就不容易被淘汰。

### 3.2.4 写一个LRU算法（优先）

```java
public class LRULinkedMap<K, V> extends LinkedHashMap<K, V> {
    private int capacity;

    /`
     * 传递进来最多能缓存多少数据
     *
     * @param capacity 缓存大小
     */
    public LRULinkedMap(int capacity) {
        super(capacity, 0.75f, true);
        this.capacity = capacity;
    }

    /`
     * 如果map中的数据量大于设定的最大容量，返回true，再新加入对象时删除最老的数据
     *
     * @param eldest 最老的数据项
     * @return true 则移除最老的数据
     */
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        // 当 map中的数据量大于指定的缓存个数的时候，自动移除最老的数据
        return size() > capacity;
    }
    
}
```

LinkedHashMap的afterNodeInsertion方法中使用到了removeEldestEntry()

```java
void afterNodeInsertion(boolean evict) { // possibly remove eldest
    LinkedHashMap.Entry<K,V> first;
    if (evict && (first = head) != null && removeEldestEntry(first)) {
        K key = first.key;
        removeNode(hash(key), key, null, false, true);
    }
}
```

HashMap的computer()方法添加元素后调用afterNodeInsertion方法

## 3.4 内存相关问题

### 3.4.1 MySQL里有2000w数据，redis中只存20w的数据，如何保证redis中的数据都是热点数据

redis内存数据集大小上升到一定大小的时候，就会施行数据淘汰策略。

### 3.4.2 Redis主要消耗什么物理资源？

内存。

### 3.4.3 Redis的内存用完了会发生什么？

如果达到设置的上限，Redis的写命令会返回错误信息（但是读命令还可以正常返回。）或者你可以配置内存淘汰机制，当Redis达到内存上限时会冲刷掉旧的内容。

### 3.4.4 Redis如何做内存优化？

可以好好利用Hash,list,sorted set,set等集合类型数据，因为通常情况下很多小的Key-Value可以用更紧凑的方式存放到一起。尽可能使用散列表（hashes），散列表（是说散列表里面存储的数少）使用的内存非常小，所以你应该尽可能的将你的数据模型抽象到一个散列表里面。比如你的web系统中有一个用户对象，不要为这个用户的名称，姓氏，邮箱，密码设置单独的key，而是应该把这个用户的所有信息存储到一张散列表里面

# 4. 持久化

参考详情：https://note.youdao.com/ynoteshare/index.html?id=cb2c46526aaefd4dc6a6b8ea305843b0&type=note&_time=1633607034503

RDB持久化是指`在指定的时间间隔内将内存中的数据集快照写入磁盘`，实际操作过程是**fork一个子进程`，先将数据集写入临时文件，写入成功后，再替换之前的文件，用`二进制`压缩存储。

![img](https://i.loli.net/2021/10/07/9MdWngmxX36kQve.png)

 

AOF持久化`以文本形式记录服务器所处理的每一个写、删除操作，查询操作不会记录`，可以打开文件看到详细的操作记录。

![img](https://i.loli.net/2021/10/07/e2bOK5mQ7yG1uMz.png)

 

> 什么是Redis持久化？

持久化就是把内存的数据写到磁盘中去，防止服务宕机了内存数据丢失。

## 4.1 RDB（时间点快照）（默认方式）二进制文件

RDB是Redis默认的持久化方式。按照一定的时间将内存的数据以快照的形式保存到硬盘中，对应产生的数据文件为dump.rdb。通过配置文件中的bgsave参数来定义快照的周期。

​     

![0](https://i.loli.net/2021/10/06/7M9YHPSi1OrKpaL.png)



> 手动触发分别对应save和bgsave命令：

- **save命令（已废弃）`： 阻塞当前Redis服务器， 直到RDB过程完成为止， 对于内存比较大的实例会造成长时间阻塞， 线上环境不建议使用。 运行save命令对应的Redis日志如下：

  * DB saved on disk

- **bgsave命令：` Redis进程执行fork操作创建子进程， RDB持久化过程由子进程负责， 完成后自动结束。 阻塞只发生在fork阶段， 一般时间很短。 运行bgsave命令对应的Redis日志如下：

  \* Background saving started by pid 3151

  \* DB saved on disk

  \* RDB: 0 MB of memory used by copy-on-write

  \* Background saving terminated with success

 ![0](https://i.loli.net/2021/10/07/lo6bSmRkEctuB59.png)

 

1） 执行bgsave命令， Redis父进程判断当前是否存在正在执行的子进程， 如RDB/AOF子进程， 如果存在bgsave命令直接返回。

2） `父进程执行fork操作创建子进程， fork操作过程中父进程会阻塞，` 通过info stats命令查看latest_fork_usec选项， 可以获取最近一个fork操作的耗时， 单位为微秒。

3） 父进程fork完成后， bgsave命令返回“Background saving started”信息并不再阻塞父进程， 可以继续响应其他命令。

4） 子进程创建RDB文件， 根据父进程内存生成临时快照文件， 完成后对原有文件进行原子替换。 执行lastsave命令可以获取最后一次生成RDB的时间， 对应info统计的rdb_last_save_time选项。

5） 进程发送信号给父进程表示完成， 父进程更新统计信息， 具体见info Persistence下的rdb_*相关选项。



使用Redis提供的redis-check-dump工具检测RDB文件并获取对应的错误报告。 



> 优点：

- RDB是一个紧凑压缩的二进制文件， `代表Redis在某个时间点上的数据快照。 非常适用于备份， 全量复制等场景`。 比如每6小时执行bgsave备份，并把RDB文件拷贝到远程机器或者文件系统中（如hdfs） ， `用于灾难恢复。`
- Redis加载RDB恢复数据远远快于AOF的方式。

> 缺点：

- 数据安全性低。RDB 是间隔一段时间进行持久化，如果持久化之间 redis 发生故障，会发生数据丢失。所以这种方式更适合数据要求不严谨的时候
- RDB方式数据没办法做到实时持久化/秒级持久化。 因为**bgsave每次运行都要执行fork操作创建子进程， 属于重量级操作， 频繁执行成本过高`。

## 4.2 AOF（实时）（默认不开启，需配置）命令记录

**AOF（ append only file） 持久化： 以独立日志的方式记录每次写命令，重启时再重新执行AOF文件中的命令达到恢复数据的目的。` AOF的主要作用是解决了数据持久化的实时性， 目前已经是Redis持久化的主流方式。

同时配置两种持久化方式，需要数据恢复的时候，优先选择AOF恢复。

​    ![0](https://i.loli.net/2021/10/06/aQ1ESIeJT9VUrXG.png)

- `开启AOF功能需要设置配置： appendonly yes， 默认不开启。` 
- AOF文件名通过appendfilename配置设置， 默认文件名是appendonly.aof。 



优点：

- 1、数据安全，aof 持久化可以配置 appendfsync 属性，有 always，每进行一次 命令操作就记录到 aof 文件中一次。
- 2、通过 append 模式写文件，即使中途服务器宕机，可以通过 redis-check-aof 工具解决数据一致性问题。
- 3、AOF 机制的 rewrite 模式。AOF 文件没被 rewrite 之前（文件过大时会对命令 进行合并重写），可以删除其中的某些命令（比如误操作的 flushall）)

缺点：

- 1、AOF 文件比 RDB 文件大，且恢复速度慢。
- 2、数据集大的时候，比 rdb 启动效率低。



开启 AOF 持久化后每执⾏⼀条会更改 Redis 中的数据的命令，Redis 就会将该命令写⼊硬盘中的 AOF ⽂件。AOF ⽂件的保存位置和 RDB ⽂件的位置相同，都是通过 dir 参数设置的，默认的⽂件名是 appendonly.aof。在 Redis 的配置⽂件中存在三种不同的 AOF 持久化⽅式，它们分别是：

- appendfsync always #每次有数据修改发⽣时,都会写⼊AOF⽂件,这样会严重降低Redis的速度
- appendfsync everysec #每秒钟同步⼀次，显示地将多个写命令同步到硬盘
- appendfsync no #让操作系统决定何时进⾏同步



> AOF重写

在执⾏ `BGREWRITEAOF` 命令时，Redis 服务器会维护⼀个 `AOF 重写缓冲区`，在⼦进程创建新 AOF ⽂件期间，该缓冲区会`记录服务器执⾏的所有写命令`。当⼦进程完成创建新 AOF ⽂件的⼯作之后，服务器会将重写缓冲区中的所有内容`追加`到新 AOF ⽂件的末尾，使得新旧两个 AOF ⽂件所保存的数据库状态⼀致。最后，服务器⽤新的 AOF ⽂件替换旧的 AOF ⽂件，以此来完成AOF ⽂件重写操作。



> RDB-AOF混合持久化



Redis 4.0 开始⽀持 RDB 和 AOF 的混合持久化（默认关闭，可以通过配置项 aof-use-rdbpreamble 开启）。

如果把混合持久化打开，AOF 重写的时候就直接把 RDB 的内容写到 AOF ⽂件开头。

好处：结合 RDB 和 AOF 的优点, 快速加载同时避免丢失过多的数据。

缺点：AOF ⾥⾯的 RDB 部分是压缩格式不再是 AOF 格式，可读性较差。



> 优缺点是什么？

- AOF文件比RDB更新频率高，优先使用AOF还原数据。
- AOF比RDB更安全也更大
- RDB性能比AOF好
- 如果两个都配了优先加载AOF

## 4.3 如何选择合适的持久化方式

- 一般来说， 如果想达到足以媲美PostgreSQL的数据安全性，你应该同时使用两种持久化功能。在这种情况下，当 Redis 重启的时候会优先载入AOF文件来恢复原始的数据，因为在通常情况下AOF文件保存的数据集要比RDB文件保存的数据集要完整。
- 如果你非常关心你的数据， 但仍然可以承受数分钟以内的数据丢失，那么你可以只使用RDB持久化。
- 有很多用户都只使用AOF持久化，但并不推荐这种方式，因为定时生成RDB快照（snapshot）非常便于进行数据库备份， 并且 RDB 恢复数据集的速度也要比AOF恢复的速度要快，除此之外，使用RDB还可以避免AOF程序的bug。
- 如果你只希望你的数据在服务器运行的时候存在，你也可以不使用任何持久化方式。

## 4.4 Redis持久化数据和缓存怎么做扩容？

- 如果Redis被当做缓存使用，使用一致性哈希实现动态扩容/缩容。
- 如果Redis被当做一个持久化存储使用，必须使用固定的keys-to-nodes映射关系，节点的数量一旦确定不能变化。否则的话(即Redis节点需要动态变化的情况），必须使用可以在运行时进行数据再平衡的一套系统，而当前只有Redis集群可以做到这样。

# 5. 线程模型

`文件事件处理器（Redis单线程处理模型）：多个套接字、IO多路复用程序、文件事件分派器、事件处理器（连接应答处理器、命令请求处理器、命令回复处理器）`

![0](https://i.loli.net/2021/10/07/dLMhtOEgxsDbF3W.png)

## 5.1 Redis线程模型

Redis基于Reactor模式开发了网络事件处理器，这个处理器被称为文件事件处理器（file event handler）。

它的组成结构为4部分：`多个套接字、IO多路复用程序、文件事件分派器、事件处理器（连接应答处理器、命令请求处理器、命令回复处理器）`。

因为文件事件分派器队列的消费是单线程的，所以Redis才叫单线程模型。

- 文件事件处理器使用 I/O 多路复用（multiplexing）程序来同时监听多个套接字， 并根据套接字目前执行的任务来为套接字关联不同的事件处理器。
- 当被监听的套接字准备好执行连接应答（accept）、读取（read）、写入（write）、关闭（close）等操作时， 与操作相对应的文件事件就会产生， 这时文件事件处理器就会调用套接字之前关联好的事件处理器来处理这些事件。

`虽然文件事件处理器以单线程方式运行， 但通过使用 I/O 多路复用程序来监听多个套接字`， 文件事件处理器既实现了高性能的网络通信模型， 又可以很好地与 redis 服务器中其他同样以单线程方式运行的模块进行对接， 这保持了 Redis 内部单线程设计的简单性。

> 来看客户端与 Redis 的一次通信过程：

![image-20211007135451134](https://i.loli.net/2021/10/07/NtjuVIHdSe6mkCw.png)

要明白，通信是通过 socket 来完成的，不懂的同学可以先去看一看 socket 网络编程。

首先，Redis 服务端进程初始化的时候，会将 server socket 的 `AE_READABLE` 事件与连接应答处理器关联。

客户端 socket01 向 Redis 进程的 server socket 请求建立连接，此时 server socket 会产生一个 `AE_READABLE` 事件，IO 多路复用程序监听到 server socket 产生的事件后，将该 socket 压入队列中。文件事件分派器从队列中获取 socket，交给`连接应答处理器`。连接应答处理器会创建一个能与客户端通信的 socket01，并将该 socket01 的 `AE_READABLE` 事件与命令请求处理器关联。

假设此时客户端发送了一个 `set key value` 请求，此时 Redis 中的 socket01 会产生 `AE_READABLE` 事件，IO 多路复用程序将 socket01 压入队列，此时事件分派器从队列中获取到 socket01 产生的 `AE_READABLE` 事件，由于前面 socket01 的 `AE_READABLE` 事件已经与命令请求处理器关联，因此事件分派器将事件交给命令请求处理器来处理。命令请求处理器读取 socket01 的 `key value` 并在自己内存中完成 `key value` 的设置。操作完成后，它会将 socket01 的 `AE_WRITABLE` 事件与命令回复处理器关联。

如果此时客户端准备好接收返回结果了，那么 Redis 中的 socket01 会产生一个 `AE_WRITABLE` 事件，同样压入队列中，事件分派器找到相关联的命令回复处理器，由命令回复处理器对 socket01 输入本次操作的一个结果，比如 `ok` ，之后解除 socket01 的 `AE_WRITABLE` 事件与命令回复处理器的关联。

## 5.2  I/O多路复用机制

原文解析：https://cloud.tencent.com/developer/article/1680732

参考解析：https://blog.csdn.net/Seky_fei/article/details/106677043

### 5.2.1 IO多路复用原理解析

为什么Redis中要使用 I/O 多路复用这种技术呢？因为Redis 是跑在单线程中的，所有的操作都是按照顺序线性执行的，但是`由于 读写操作 和 等待用户输入或输出 都是阻塞的，所以某一文件的 I/O 阻塞在一般情况下往往不能直接返回，导致整个进程无法对其它客户提供服务`。而 I/O 多路复用就是为了解决这个问题而出现的。为了`让单线程(进程)的服务端应用同时处理多个客户端的事件，Redis采用了IO多路复用机制`。

这里`“多路”指的是多个网络连接客户端，“复用”指的是复用同一个线程(单进程)`。I/O 多路复用其实是使用一个线程来检查多个Socket的就绪状态，在单个线程中通过记录跟踪每一个socket（I/O流）的状态来管理处理多个I/O流。如下图是Redis的I/O多路复用模型：

​    ![0](https://i.loli.net/2021/10/07/dLMhtOEgxsDbF3W.png)

`文件描述符FD(file descriptor)：`

​    Linux 系统中，把一切都看做是文件，当进程打开现有文件或创建新文件时，内核向进程返回一个`文件描述符（file descriptor），简称fd`。

如上图对Redis的I/O多路复用模型进行一下描述说明：

(1)一个socket客户端与服务端连接时，会生成对应一个`套接字描述符(套接字描述符是文件描述符的一种)，每一个socket网络连接其实都对应一个文件描述符fd**。

(2)多个客户端与服务端连接时，Redis使用 I/O多路复用程序 将客户端socket对应的fd注册到监听列表(一个队列)中。当客服端执行read、write等操作命令时，I/O多路复用程序会`将命令封装成一个事件，并绑定到对应的fd上`。

(3)文件事件处理器使用 I/O 多路复用模块同时`监控`多个文件描述符（fd）的读写情况，当 accept、read、write 和 close 文件事件产生时，文件事件处理器就会 `回调 fd 绑定的事件处理器` 进行处理相关命令操作。

例如：以Redis的I/O多路复用程序 epoll函数为例

​    多个客户端连接服务端时，Redis会将客户端socket对应的fd注册进epoll，然后epoll同时监听多个文件描述符(FD)是否有数据到来，如果有数据来了就通知事件处理器赶紧处理，这样就不会存在服务端一直等待某个客户端给数据的情形。

（I/O多路复用程序函数有select、poll、epoll、kqueue）

> 小结：生成文件描述符fd，封装命令绑定到文件描述符fd，监听文件描述符的命令，文件事件处理器处理命令。

(4)整个文件事件处理器是在单线程上运行的，但是通过 I/O 多路复用模块的引入，实现了同时对多个 FD 读写的监控，当其中一个client端达到写或读的状态，文件事件处理器就马上执行，从而就不会出现I/O堵塞的问题，提高了网络通信的性能。

(5)如上图，Redis的I/O多路复用模式使用的是 Reactor设置模式的方式来实现。

### 5.2.2 如何快速理解IO多路复用？

那得从IO并发性能提升来考虑：

- 多进程
- 多线程
- 基于单进程的IO多路复用（select/poll/epoll）

`多进程`

对于并发情况，假如一个进程不行，那搞多个进程不就可以同时处理多个客户端连接了么？

多进程这种方式的确可以解决了服务器在同一时间能处理多个客户端连接请求的问题，但是仍存在一些缺点：

- fork()等系统调用会使得`进程上下文进行切换`，效率较低
- 进程创建的数量随着连接请求的增加而增加。比如10w个请求，就要fork 10w个进程，开销太大
- 进程与进程之间的地址空间是私有、独立的，使得进程之间的数据共享变得困难

`多线程`

线程是运行在进程上下文的逻辑流，一个进程可以包含多个线程，多个线程运行在同一进程上下文中，因此可共享这个进程地址空间的所有内容，解决了进程与进程之间通信难的问题。

同时，由于一个线程的上下文要比一个进程的上下文小得多，所以`线程上下文切换`要比`进程上下文切换`效率高得多。

**IO多路复用`

简单理解就是：一个服务端进程可以同时处理多个套接字描述符。

- `多路`：多个客户端连接（连接就是套接字描述符）
- `复用`：使用单进程就能够实现同时处理多个客户端的连接

以上是通过增加进程和线程的数量来并发处理多个套接字，免不了上下文切换的开销，而IO多路复用只需要一个进程就能够处理多个套接字，从而解决了上下文切换的问题。

其发展可以分**select->poll→epoll**三个阶段来描述。

### 5.2.3 如何简单理解select/poll/epoll呢？

按照以往惯例，还是联系一下我们日常中的现实场景，这样更助于大家理解。

`举栗说明：`

领导分配员工开发任务，有些员工还没完成。如果领导要每个员工的工作都要验收check，那在未完成的员工那里，只能阻塞等待，等待他完成之后，再去check下一位员工的任务，造成性能问题。

`那如何解决这个问题呢？`

> 1）select

`举栗说明：`

领导找个Team Leader（后文简称TL），负责代自己check每位员工的开发任务。

TL 的做法是：遍历问各个员工“完成了么？”，完成的待CR check无误后合并到Git分支，对于其他未完成的，休息一会儿后再去遍历....

这样存在什么问题呢？

- 这个TL存在能力短板问题，最多只能管理1024个员工
- 很多员工的任务没有完成，而且短时间内也完不成的话，TL还是会不停的去遍历问询，影响效率。

select函数：


```shell
int select(int maxfdp1,fd_set *readset,fd_set *writeset,fd_set *exceptset,const struct timeval *timeout);
```

**select 函数监视的文件描述符分3类，分别是writefds、readfds、和exceptfds。`调用后select函数会阻塞，直到有描述符就绪（有数据可读、可写、或者有except），或者超时（timeout指定等待时间，如果立即返回设为null即可），函数返回。当select函数返回后，可以通过遍历fdset，来找到就绪的描述符。

**select具有良好的跨平台支持，其缺点在于单个进程能够监视的文件描述符的数量存在最大限制，在Linux上一般为1024。`

> 2）poll

`举栗说明：`

换一个能力更强的New Team Leader（后文简称NTL），可以管理更多的员工，这个NTL可以理解为poll。

poll函数：

```shell
int poll(struct pollfd *fds, nfds_t nfds, int timeout);

typedef struct pollfd{ 

    int fd; // 需要被检测或选择的文件描述符 

    short events; // 对文件描述符fd上感兴趣的事件 

    short revents; // 文件描述符fd上当前实际发生的事件

} pollfd_t;
```

**poll改变了文件描述符集合的描述方式，使用了pollfd结构而不是select的fd_set结构，使得poll支持的文件描述符集合限制远大于select的1024。`

> 3）epoll

`举栗说明：`

在上一步poll方式的NTL基础上，改进一下NTL的办事方法：遍历一次所有员工，如果任务没有完成，告诉员工待完成之后，其应该做xx操作（制定一些列的流程规范）。这样NTL只需要定期check指定的关键节点就好了。这就是epoll。

Linux中提供的epoll相关函数如下：

```shell
int epoll_create(int size);

int epoll_ctl(int epfd,int op,int fd,struct epoll_event *event);

int epoll_wait(int epfd,struct epoll_event * events,int maxevents,int timeout);
```

**epoll_create()`：建立一个 epoll对象（在 Epoll 文件系统中，为这个句柄对象分配资源）；

**epoll_ctl()`：向 epoll 对象中添加100万个连接的套接字；

**epoll_wait()`：收集发生的事件的连接；

**epoll是Linux内核为处理大批量文件描述符而作了改进的poll，是Linux下IO多路复用接口select/poll的增强版本，它能显著提高 程序在大量并发连接中 只有少量活跃的情况下的系统CPU利用率。`

> 小结

- **select**就是轮询，在Linux上限制个数一般为1024个
- **poll**解决了select的个数限制，但是依然是轮询
- **epoll**解决了个数的限制，同时解决了轮询的方式

### 5.2.4 IO多路复用在Redis中的应用

Redis 服务器是一个事件驱动程序， 服务器处理的事件分为时间事件和文件事件两类。

- `文件事件`：Redis主进程中，主要处理客户端的连接请求与响应。
- `时间事件`：fork出的子进程中，处理如AOF持久化任务等。

由于Redis的文件事件是单进程，单线程模型，但是确保持着优秀的吞吐量，IO多路复用起到了主要作用。

文件事件是对套接字操作的抽象，每当一个套接字准备好执行连接应答、写入、读取、关闭等操作时，就会产生一个文件事件。因为一个服务器通常会连接多个套接字，所以多个文件事件有可能会并发地出现。

**IO多路复用程序负责监听多个套接字并向文件事件分派器传送那些产生了事件的套接字。文件事件分派器接收IO多路复用程序传来的套接字，并根据套接字产生的事件的类型，调用相应的事件处理器。示例如图所示：`

文件处理器    ![0](https://i.loli.net/2021/10/07/yu2aqdcnhKbE96o.png)

Redis的IO多路复用程序的所有功能都是通过包装常见的select、poll、evport和kqueue这些IO多路复用函数库来实现的，每个IO多路复用函数库在Redis源码中都有对应的一个单独的文件。

Redis为每个IO多路复用函数库都实现了相同的API，所以IO多路复用程序的底层实现是可以互换的。如图：

​    ![0](https://i.loli.net/2021/10/07/zvKWpl9RafwyUhk.png)

## 5.3 Redis 6.0 多线程连环13问

### 5.3.1 Redis6.0之前的版本真的是单线程吗？

Redis在处理客户端的请求时，包括获取 (socket 读)、解析、执行、内容返回 (socket 写) 等都由一个顺序串行的主线程处理，这就是所谓的“单线程”。但如果严格来讲从Redis4.0之后并不是单线程，除了主线程外，它也有后台线程在处理一些较为缓慢的操作，例如清理脏数据、无用连接的释放、大 key 的删除等等。

### 5.3.2 Redis6.0之前为什么一直不使用多线程？

官方曾做过类似问题的回复：使用Redis时，几乎不存在CPU成为瓶颈的情况， Redis主要受限于内存和网络。例如在一个普通的Linux系统上，Redis通过使用pipelining每秒可以处理100万个请求，所以如果应用程序主要使用O(N)或O(log(N))的命令，它几乎不会占用太多CPU。

使用了单线程后，可维护性高。多线程模型虽然在某些方面表现优异，但是它却引入了程序执行顺序的不确定性，带来了并发读写的一系列问题，增加了系统复杂度、同时可能存在线程切换、甚至加锁解锁、死锁造成的性能损耗。Redis通过AE事件模型以及IO多路复用等技术，处理性能非常高，因此没有必要使用多线程。单线程机制使得 Redis 内部实现的复杂度大大降低，Hash 的惰性 Rehash、Lpush 等等 “线程不安全” 的命令都可以无锁进行。

### 5.3.3 Redis6.0为什么要引入多线程呢？(重点)

**Redis 的多线程部分只是用来处理网络数据的读写和协议解析，执行命令仍然是单线程。`

**Redis6.0 引入多线程主要是为了提高网络 IO 读写性能与利用多线程充分使用CPU资源。`

Redis将所有数据放在内存中，内存的响应时长大约为100纳秒，对于小数据包，Redis服务器可以处理80,000到100,000 QPS，这也是Redis处理的极限了，对于80%的公司来说，单线程的Redis已经足够使用了。

但随着越来越复杂的业务场景，有些公司动不动就上亿的交易量，因此需要更大的QPS。常见的解决方案是在分布式架构中对数据进行分区并采用多个服务器，但该方案有非常大的缺点，例如要管理的Redis服务器太多，维护代价大；某些适用于单个Redis服务器的命令不适用于数据分区；数据分区无法解决热点读/写问题；数据偏斜，重新分配和放大/缩小变得更加复杂等等。

从Redis自身角度来说，因为读写网络的read/write系统调用占用了Redis执行期间大部分CPU时间，瓶颈主要在于网络的 IO 消耗, `优化主要有两个方向:**

- 提高网络 IO 性能，典型的实现比如使用 DPDK 来替代内核网络栈的方式
- 使用多线程充分利用多核，典型的实现比如 Memcached。

协议栈优化的这种方式跟 Redis 关系不大，支持多线程是一种最有效最便捷的操作方式。所以总结起来，**redis支持多线程主要就是两个原因：`

- 可以充分利用服务器 CPU 资源，目前主线程只能利用一个核
- 多线程任务可以分摊 Redis 同步 IO 读写负荷

### 5.3.4 Redis6.0默认是否开启了多线程？

Redis6.0的多线程默认是禁用的，只使用主线程。如需开启需要修改redis.conf配置文件：io-threads-do-reads yes

​    ![0](https://i.loli.net/2021/10/07/MZAXfmds5CQRHUG.png)

### 5.3.5 Redis6.0多线程开启时，线程数如何设置？

开启多线程后，还需要设置线程数，否则是不生效的。同样修改redis.conf配置文件

​    ![0](https://i.loli.net/2021/10/07/Gt2iYjI6LBRgCJr.png)

关于线程数的设置，官方有一个建议：4核的机器建议设置为2或3个线程，8核的建议设置为6个线程，`线程数一定要小于机器核数`。还需要注意的是，线程数并不是越大越好，官方认为超过了8个基本就没什么意义了。

### 5.3.6 Redis6.0采用多线程后，性能的提升效果如何？

Redis 作者 antirez 在 RedisConf 2019分享时曾提到：Redis 6 引入的多线程 IO 特性对性能提升至少是一倍以上。国内也有大牛曾使用unstable版本在阿里云esc进行过测试，GET/SET 命令在4线程 IO时性能相比单线程是几乎是翻倍了。

`测试环境`：

Redis Server: 阿里云 Ubuntu 18.04，8 CPU 2.5 GHZ, 8G 内存，主机型号 ecs.ic5.2xlarge

Redis Benchmark Client: 阿里云 Ubuntu 18.04，8 2.5 GHZ CPU, 8G 内存，主机型号 ecs.ic5.2xlarge

`测试结果`：

​    ![0](https://i.loli.net/2021/10/07/IPDMvoHBTlnjmuy.png)

详见：https://zhuanlan.zhihu.com/p/76788470

说明1：这些性能验证的测试并没有针对严谨的延时控制和不同并发的场景进行压测。数据仅供验证参考而不能作为线上指标。

说明2：如果开启多线程，至少要4核的机器，且Redis实例已经占用相当大的CPU耗时的时候才建议采用，否则使用多线程没有意义。`所以估计80%的公司开发人员看看就好。`

### 5.3.7 Redis6.0多线程的实现机制？

​    ![0](https://i.loli.net/2021/10/07/TaVDShm9tXQzEiL.png)

`流程简述如下`：

1、主线程负责接收建立连接请求，获取 socket 放入全局等待读处理队列

2、主线程处理完读事件之后，通过 RR(Round Robin) 将这些连接分配给这些 IO 线程

3、主线程阻塞等待 IO 线程读取 socket 完毕

4、主线程通过单线程的方式执行请求命令，请求数据读取并解析完成，但并不执行

5、主线程阻塞等待 IO 线程将数据回写 socket 完毕

6、解除绑定，清空等待队列

​    ![0](https://i.loli.net/2021/10/07/yrltk3nKR9N1XMT.png)

（图片来源：https://ruby-china.org/topics/38957）

该设计有如下特点：

1、IO 线程要么同时在读 socket，要么同时在写，不会同时读或写

2、IO 线程只负责读写 socket 解析命令，不负责命令处理

### 5.3.8 开启多线程后，是否会存在线程并发安全问题？

从上面的实现机制可以看出，Redis的多线程部分只是用来处理网络数据的读写和协议解析，执行命令仍然是单线程顺序执行。所以我们不需要去考虑控制 key、lua、事务，LPUSH/LPOP 等等的并发及线程安全问题。

### 5.3.9 Linux环境上如何安装Redis6.0.1（6.0的正式版是6.0.1）？

这个和安装其他版本的redis没有任何区别，整个流程跑下来也没有任何的坑，所以这里就不做描述了。唯一要注意的就是配置多线程数一定要小于cpu的核心数，查看核心数量命令：

[root@centos7.5 ~]# lscpu Architecture: x86_64 CPU op-mode(s): 32-bit, 64-bit Byte Order: Little Endian CPU(s): 4 On-line CPU(s) list: 0-3

### 5.3.10 Redis6.0的多线程和Memcached多线程模型进行对比

前些年memcached 是各大互联网公司常用的缓存方案，因此redis 和 memcached 的区别基本成了面试官缓存方面必问的面试题，最近几年memcached用的少了，基本都是 redis。不过随着Redis6.0加入了多线程特性，类似的问题可能还会出现，接下来我们只针对多线程模型来简单比较一下。

​    ![0](https://i.loli.net/2021/10/07/z7yXkIiqsLZvtdU.png)

如上图所示：Memcached 服务器采用 master-woker 模式进行工作，服务端采用 socket 与客户端通讯。主线程、工作线程 采用 pipe管道进行通讯。主线程采用 libevent 监听 listen、accept 的读事件，事件响应后将连接信息的数据结构封装起来，根据算法选择合适的工作线程，将连接任务携带连接信息分发出去，相应的线程利用连接描述符建立与客户端的socket连接 并进行后续的存取数据操作。

Redis6.0与Memcached多线程模型对比：

相同点：都采用了 master线程-worker 线程的模型

不同点：Memcached 执行主逻辑也是在 worker 线程里，模型更加简单，实现了真正的线程隔离，符合我们对线程隔离的常规理解。而 Redis 把处理逻辑交还给 master 线程，虽然一定程度上增加了模型复杂度，但也解决了线程并发安全等问题。

### 5.3.11 Redis作者是如何点评 “多线程”这个新特性的？

关于多线程这个特性，在6.0 RC1时，Antirez曾做过说明：

Redis支持多线程有2种可行的方式：第一种就是像“memcached”那样，一个Redis实例开启多个线程，从而提升GET/SET等简单命令中每秒可以执行的操作。这涉及到I/O、命令解析等多线程处理，因此，我们将其称之为“I/O threading”。另一种就是允许在不同的线程中执行较耗时较慢的命令，以确保其它客户端不被阻塞，我们将这种线程模型称为“Slow commands threading”。

经过深思熟虑，Redis不会采用“I/O threading”，redis在运行时主要受制于网络和内存，所以提升redis性能主要是通过在多个redis实例，特别是redis集群。接下来我们主要会考虑改进两个方面：

1.Redis集群的多个实例通过编排能够合理地使用本地实例的磁盘，避免同时重写AOF。

2.提供一个Redis集群代理，便于用户在没有较好的集群协议客户端时抽象出一个集群。

补充说明一下，Redis和memcached一样是一个内存系统，但不同于Memcached。多线程是复杂的，必须考虑使用简单的数据模型，执行LPUSH的线程需要服务其他执行LPOP的线程。

我真正期望的实际是“slow operations threading”，在redis6或redis7中，将提供“key-level locking”，使得线程可以完全获得对键的控制以处理缓慢的操作。

详见：http://antirez.com/news/126

### 5.3.12 Redis线程中经常提到IO多路复用，如何理解？

这是IO模型的一种，即经典的Reactor设计模式，有时也称为异步阻塞IO。

​    ![0](https://i.loli.net/2021/10/07/cGOrotRYqlTjHSk.png)

多路指的是多个socket连接，复用指的是复用一个线程。多路复用主要有三种技术：select，poll，epoll。epoll是最新的也是目前最好的多路复用技术。采用多路 I/O 复用技术可以让单个线程高效的处理多个连接请求（尽量减少网络IO的时间消耗），且Redis在内存中操作数据的速度非常快（内存内的操作不会成为这里的性能瓶颈），主要以上两点造就了**Redis具有很高的吞吐量`。

### 5.3.13 你知道Redis的彩蛋LOLWUT吗？

这个其实从Redis5.0就开始有了，但是原谅我刚刚知道。作者是这么描述这个功能的《LOLWUT: a piece of art inside a database command》，“数据库命令中的一件艺术品”。你可以把它称之为情怀，也可以称之为彩蛋，具体是什么，我就不透露了。和我一样不清楚是什么的小伙伴可以参见：http://antirez.com/news/123，每次运行都会随机生成的噢。

​    ![0](https://i.loli.net/2021/10/07/ZeBs97WnzgQtOfd.png)



# 6. 事务

## 6.1 什么是事务？

事务是一个单独的隔离操作：事务中的所有命令都会序列化、按顺序地执行。事务在执行的过程中，不会被其他客户端发送来的命令请求所打断。

事务是一个原子操作：事务中的命令要么全部被执行，要么全部都不执行。

## 6.2 Redis事务的概念

Redis 事务的本质是通过MULTI、EXEC、WATCH等一组命令的集合。事务支持一次执行多个命令，一个事务中所有命令都会被序列化。在事务执行过程，会按照顺序串行化执行队列中的命令，其他客户端提交的命令请求不会插入到事务执行命令序列中。

总结说：redis事务就是一次性、顺序性、排他性的执行一个队列中的一系列命令。

搜索公众号 Java面试题精选，回复“面试资料”，送你一份Java面试宝典.pdf

## 6.3 Redis事务的三个阶段

1. 事务开始 MULTI
2. 命令入队
3. 事务执行 EXEC

事务执行过程中，如果服务端收到有EXEC、DISCARD、WATCH、MULTI之外的请求，将会把请求放入队列中排

## 6.4 事务管理（ACID）概述

- 原子性（Atomicity）

原子性是指事务是一个不可分割的工作单位，事务中的操作要么都发生，要么都不发生。

- 一致性（Consistency）

事务前后数据的完整性必须保持一致。

- 隔离性（Isolation）

多个事务并发执行时，一个事务的执行不应影响其他事务的执行

- 持久性（Durability）

持久性是指一个事务一旦被提交，它对数据库中数据的改变就是永久性的，接下来即使数据库发生故障也不应该对其有任何影响

Redis的事务总是具有ACID中的一致性和隔离性，其他特性是不支持的。当服务器运行在_AOF_持久化模式下，并且appendfsync选项的值为always时，事务也具有耐久性。

## 6.5 Redis事务支持隔离性吗

Redis 是单进程程序，并且它保证在执行事务时，不会对事务进行中断，事务可以运行直到执行完所有事务队列中的命令为止。因此，Redis 的事务是总是带有隔离性的。

## 6.6 Redis事务保证原子性吗，支持回滚吗

Redis中，单条命令是原子性执行的，但事务不保证原子性，且没有回滚。事务中任意命令执行失败，其余的命令仍会被执行。

## 6.7 Redis事务其他实现

- 基于Lua脚本，Redis可以保证脚本内的命令一次性、按顺序地执行，

其同时也不提供事务运行错误的回滚，执行过程中如果部分命令运行错误，剩下的命令还是会继续运行完

- 基于中间标记变量，通过另外的标记变量来标识事务是否执行完成，读取数据时先读取该标记变量判断是否事务执行完成。但这样会需要额外写代码实现，比较繁琐

# 7. 集群方案

## 7.1 哨兵模式（优先）

 参考链接：https://doocs.gitee.io/advanced-java/#/docs/high-concurrency/redis-sentinel   ![0](https://i.loli.net/2021/10/06/9Q24agdlEORLYw5.png)

### 7.1.1 哨兵的介绍

sentinel，中文名是哨兵。哨兵是 redis 集群机构中非常重要的一个组件，主要有以下功能：

- 集群监控：负责监控 redis master 和 slave 进程是否正常工作。
- 消息通知：如果某个 redis 实例有故障，那么哨兵负责发送消息作为报警通知给管理员。
- 故障转移：如果 master node 挂掉了，会自动转移到 slave node 上。
- 配置中心：如果故障转移发生了，通知 client 客户端新的 master 地址。

哨兵用于实现 redis 集群的高可用，本身也是分布式的，作为一个哨兵集群去运行，互相协同工作。

- 故障转移时，判断一个 master node 是否宕机了，需要大部分的哨兵都同意才行，涉及到了分布式选举的问题。
- 即使部分哨兵节点挂掉了，哨兵集群还是能正常工作的，因为如果一个作为高可用机制重要组成部分的故障转移系统本身是单点的，那就很坑爹了。

### 7.1.2 哨兵的核心知识

- 哨兵至少需要 3 个实例，来保证自己的健壮性。
- 哨兵 + redis 主从的部署架构，是不保证数据零丢失的，只能保证 redis 集群的高可用性。
- 对于哨兵 + redis 主从这种复杂的部署架构，尽量在测试环境和生产环境，都进行充足的测试和演练。

## 7.2 Redis Cluster 方案

​    ![0](https://i.loli.net/2021/10/06/HmulK85WCTt2R6G.png)

redis 集群模式的工作原理能说一下么？在集群模式下，redis 的 key 是如何寻址的？分布式寻址都有哪些算法？了解一致性 hash 算法吗？

### 7.2.1 简单介绍

> 简介

Redis Cluster是一种服务端Sharding技术，3.0版本开始正式提供。Redis Cluster并没有使用一致性hash，而是采用slot(槽)的概念，一共分成16384个槽。将请求发送到任意节点，接收到请求的节点会将查询请求发送到正确的节点上执行

> 方案说明

1. 通过哈希的方式，将数据分片，每个节点均分存储一定哈希槽(哈希值)区间的数据，默认分配了16384 个槽位
2. 每份数据分片会存储在多个互为主从的多节点上
3. 数据写入先写主节点，再同步到从节点(支持配置为阻塞同步)
4. 同一分片多个节点间的数据不保持一致性
5. 读取数据时，当客户端操作的key没有分配在该节点上时，redis会返回转向指令，指向正确的节点
6. 扩容时时需要需要把旧节点的数据迁移一部分到新节点



两个端口：提供服务的端口 和 节点间通信的端口(提供服务的端口+10000)

比如一个是 6379，另外一个就是 加1w 的端口号，比如 16379。

16379 端口号是用来进行节点间通信的，也就是 cluster bus 的东西，cluster bus 的通信，用来进行故障检测、配置更新、故障转移授权。cluster bus 用了另外一种二进制的协议，gossip 协议，用于节点间进行高效的数据交换，占用更少的网络带宽和处理时间。



### 7.2.2 节点间的内部通信机制

基本通信原理

集群元数据的维护有两种方式：集中式、Gossip 协议。redis cluster 节点间采用 gossip 协议进行通信。



### 7.2.3 分布式寻址算法

- hash 算法（大量缓存重建）
- 一致性 hash 算法（自动缓存迁移）+ 虚拟节点（自动负载均衡）[分布式系统中的一致性哈希算法](https://www.cnblogs.com/jajian/p/10896624.html)
- redis cluster 的 hash slot 算法

#### 7.2.3.1 hash算法

来了一个 key，首先计算 hash 值，然后对节点数取模。然后打在不同的 master 节点上。一旦某一个 master 节点宕机，所有请求过来，都会基于最新的剩余 master 节点数去取模，尝试去取数据。这会导致`大部分的请求过来，全部无法拿到有效的缓存`，导致大量的流量涌入数据库。

![hash](https://doocs.gitee.io/advanced-java/docs/high-concurrency/images/hash.png)

#### 7.2.3.2 一致性 hash 算法

一致性 hash 算法将整个 hash 值空间组织成一个虚拟的圆环，整个空间按顺时针方向组织，下一步将各个 master 节点（使用服务器的 ip 或主机名）进行 hash。这样就能确定每个节点在其哈希环上的位置。

来了一个 key，首先计算 hash 值，并确定此数据在环上的位置，从此位置沿环`顺时针“行走”`，遇到的第一个 master 节点就是 key 所在位置。

在一致性哈希算法中，如果一个节点挂了，受影响的数据仅仅是此节点到环空间前一个节点（沿着逆时针方向行走遇到的第一个节点）之间的数据，其它不受影响。增加一个节点也同理。

燃鹅，一致性哈希算法在节点太少时，容易因为节点分布不均匀而造成`缓存热点`的问题。为了解决这种热点问题，一致性 hash 算法引入了虚拟节点机制，即对每一个节点计算多个 hash，每个计算结果位置都放置一个虚拟节点。这样就实现了数据的均匀分布，负载均衡。

![consistent-hashing-algorithm](https://doocs.gitee.io/advanced-java/docs/high-concurrency/images/consistent-hashing-algorithm.png)

#### 7.2.3.3 Redis cluster 的 hash slot 算法

Redis cluster 有固定的 `16384` 个 hash slot，对每个 `key` 计算 `CRC16` 值，然后对 `16384` 取模，可以获取 key 对应的 hash slot。

Redis cluster 中每个 master 都会持有部分 slot，比如有 3 个 master，那么可能每个 master 持有 5000 多个 hash slot。hash slot 让 node 的增加和移除很简单，增加一个 master，就将其他 master 的 hash slot 移动部分过去，减少一个 master，就将它的 hash slot 移动到其他 master 上去。移动 hash slot 的成本是非常低的。客户端的 api，可以对指定的数据，让他们走同一个 hash slot，通过 `hash tag` 来实现。

任何一台机器宕机，另外两个节点，不影响的。因为 key 找的是 hash slot，不是机器。

![hash-slot](https://doocs.gitee.io/advanced-java/docs/high-concurrency/images/hash-slot.png)

### 7.2.4 Redis cluster 的高可用与主备切换原理

Redis cluster 的高可用的原理，几乎跟哨兵是类似的。

#### 7.2.4.1 判断节点宕机

如果一个节点认为另外一个节点宕机，那么就是 `pfail` ，`主观宕机`。如果多个节点都认为另外一个节点宕机了，那么就是 `fail` ，`客观宕机`，跟哨兵的原理几乎一样，sdown，odown。

在 `cluster-node-timeout` 内，某个节点一直没有返回 `pong` ，那么就被认为 `pfail` 。

如果一个节点认为某个节点 `pfail` 了，那么会在 `gossip ping` 消息中， `ping` 给其他节点，如果`超过半数`的节点都认为 `pfail` 了，那么就会变成 `fail` 。

#### 7.2.4.2 从节点过滤

对宕机的 master node，从其所有的 slave node 中，选择一个切换成 master node。

检查每个 slave node 与 master node 断开连接的时间，如果超过了 `cluster-node-timeout * cluster-slave-validity-factor` ，那么就`没有资格`切换成 `master` 。

#### 7.2.4.3 从节点选举

每个从节点，都根据自己对 master 复制数据的 offset，来设置一个选举时间，offset 越大（复制数据越多）的从节点，选举时间越靠前，优先进行选举。

所有的 master node 开始 slave 选举投票，给要进行选举的 slave 进行投票，如果大部分 master node `（N/2 + 1）` 都投票给了某个从节点，那么选举通过，那个从节点可以切换成 master。

从节点执行主备切换，从节点切换为主节点。

#### 7.2.4.4 与哨兵比较

整个流程跟哨兵相比，非常类似，所以说，Redis cluster 功能强大，直接集成了 replication 和 sentinel 的功能。



优点

- 无中心架构，支持动态扩容，对业务透明
- 具备Sentinel的监控和自动Failover(故障转移)能力
- 客户端不需要连接集群所有节点，连接集群中任何一个可用节点即可
- 高性能，客户端直连redis服务，免去了proxy代理的损耗

缺点

- 运维也很复杂，数据迁移需要人工干预
- 只能使用0号数据库
- 不支持批量操作(pipeline管道操作)
- 分布式逻辑和存储模块耦合等

## 7.3 基于客户端分配

​    ![0](https://i.loli.net/2021/10/06/e7YM1Dp84TqFnOU.jpg)

简介

Redis Sharding是Redis Cluster出来之前，业界普遍使用的多Redis实例集群方法。其主要思想是采用哈希算法将Redis数据的key进行散列，通过hash函数，特定的key会映射到特定的Redis节点上。Java redis客户端驱动jedis，支持Redis Sharding功能，即ShardedJedis以及结合缓存池的ShardedJedisPool

优点

- 优势在于非常简单，服务端的Redis实例彼此独立，相互无关联，每个Redis实例像单服务器一样运行，非常容易线性扩展，系统的灵活性很强

缺点

- 由于sharding处理放到客户端，规模进一步扩大时给运维带来挑战。
- 客户端sharding不支持动态增删节点。服务端Redis实例群拓扑结构有变化时，每个客户端都需要更新调整。连接不能共享，当应用规模增大时，资源浪费制约优化

## 7.4 基于代理服务器分片

​    ![0](https://i.loli.net/2021/10/06/NJtQPgZCRFK9ehj.jpg)

`简介`

客户端发送请求到一个代理组件，代理解析客户端的数据，并将请求转发至正确的节点，最后将结果回复给客户端

`特征`

- 透明接入，业务程序不用关心后端Redis实例，切换成本低
- Proxy 的逻辑和存储的逻辑是隔离的
- 代理层多了一次转发，性能有所损耗

`业界开源方案`

- Twtter开源的Twemproxy
- 豌豆荚开源的Codis

## 7.5 Redis 主从架构(优先)

单机的 redis，能够承载的 QPS 大概就在上万到几万不等。对于缓存来说，一般都是用来支撑读高并发的。因此架构做成主从(master-slave)架构，一主多从，主负责写，并且将数据复制到其它的 slave 节点，从节点负责读。所有的读请求全部走从节点。这样也可以很轻松实现水平扩容，支撑读高并发。

​    ![0](https://i.loli.net/2021/10/06/kHrRbeMIEpj3OVh.png)

redis-master-slave

redis replication -> 主从架构 -> 读写分离 -> 水平扩容支撑读高并发

redis replication 的核心机制

- redis 采用异步方式复制数据到 slave 节点，不过 redis2.8 开始，slave node 会周期性地确认自己每次复制的数据量；
- 一个 master node 是可以配置多个 slave node 的；
- slave node 也可以连接其他的 slave node；
- slave node 做复制的时候，不会 block master node 的正常工作；
- slave node 在做复制的时候，也不会 block 对自己的查询操作，它会用旧的数据集来提供服务；但是复制完成的时候，需要删除旧数据集，加载新数据集，这个时候就会暂停对外服务了；
- slave node 主要用来进行横向扩容，做读写分离，扩容的 slave node 可以提高读的吞吐量。

注意，如果采用了主从架构，那么建议必须`开启 master node 的持久化`，不建议用 slave node 作为 master node 的数据热备，因为那样的话，如果你关掉 master 的持久化，可能在 master 宕机重启的时候数据是空的，然后可能一经过复制， slave node 的数据也丢了。

另外，master 的各种备份方案，也需要做。万一本地的所有文件丢失了，从备份中挑选一份 rdb 去恢复 master，这样才能确保启动的时候，是有数据的，即使采用了后续讲解的高可用机制，slave node 可以自动接管 master node，但也可能 sentinel 还没检测到 master failure，master node 就自动重启了，还是可能导致上面所有的 slave node 数据被清空。

### 7.5.1 redis 主从复制的核心原理

当启动一个 slave node 的时候，它会发送一个 PSYNC 命令给 master node。

如果这是 slave node 初次连接到 master node，那么会触发一次 full resynchronization 全量复制。此时 master 会启动一个后台线程，开始生成一份 RDB 快照文件，

同时还会将从客户端 client 新收到的所有写命令缓存在内存中。RDB 文件生成完毕后， master 会将这个 RDB 发送给 slave，slave 会先写入本地磁盘，然后再从本地磁盘加载到内存中，

接着 master 会将内存中缓存的写命令发送到 slave，slave 也会同步这些数据。

slave node 如果跟 master node 有网络故障，断开了连接，会自动重连，连接之后 master node 仅会复制给 slave 部分缺少的数据。

​    ![0](https://i.loli.net/2021/10/06/jHnh1zX9ci2TLwY.png)

redis-master-slave-replication

过程原理

1. 当从库和主库建立MS关系后，会向主数据库发送SYNC命令
2. 主库接收到SYNC命令后会开始在后台保存快照(RDB持久化过程)，并将期间接收到的写命令缓存起来
3. 当快照完成后，主Redis会将快照文件和所有缓存的写命令发送给从Redis
4. 从Redis接收到后，会载入快照文件并且执行收到的缓存的命令
5. 之后，主Redis每当接收到写命令时就会将命令发送从Redis，从而保证数据的一致

缺点

- 所有的slave节点数据的复制和同步都由master节点来处理，会照成master节点压力太大，使用主从从结构来解决

#### 7.5.1.1 主从复制的断点续传

从 Redis2.8 开始，就支持主从复制的断点续传，如果主从复制过程中，网络连接断掉了，那么可以接着上次复制的地方，继续复制下去，而不是从头开始复制一份。

master node 会在内存中维护一个 backlog，master 和 slave 都会保存一个 replica offset 还有一个 master run id，offset 就是保存在 backlog 中的。如果 master 和 slave 网络连接断掉了，slave 会让 master 从上次 replica offset 开始继续复制，如果没有找到对应的 offset，那么就会执行一次 `resynchronization` 。

> 如果根据 host+ip 定位 master node，是不靠谱的，如果 master node 重启或者数据出现了变化，那么 slave node 应该根据不同的 run id 区分。

#### 7.5.1.2 无磁盘化复制

master 在内存中直接创建 `RDB` ，然后发送给 slave，不会在自己本地落地磁盘了。只需要在配置文件中开启 `repl-diskless-sync yes` 即可。

```bash
repl-diskless-sync yes

# 等待 5s 后再开始复制，因为要等更多 slave 重新连接过来
repl-diskless-sync-delay 5
```

#### 7.5.1.3 过期 key 处理

slave 不会过期 key，只会等待 master 过期 key。如果 master 过期了一个 key，或者通过 LRU 淘汰了一个 key，那么会模拟一条 del 命令发送给 slave。

### 7.5.2 复制的完整流程

slave node 启动时，会在自己本地保存 master node 的信息，包括 master node 的 `host` 和 `ip` ，但是复制流程没开始。

slave node 内部有个定时任务，每秒检查是否有新的 master node 要连接和复制，如果发现，就跟 master node 建立 socket 网络连接。然后 slave node 发送 `ping` 命令给 master node。如果 master 设置了 requirepass，那么 slave node 必须发送 masterauth 的口令过去进行认证。master node `第一次执行全量复制`，将所有数据发给 slave node。而在后续，master node 持续将写命令，异步复制给 slave node。

![image-20211007180436574](https://i.loli.net/2021/10/07/jWJcwzIELGVsfKe.png)

#### 7.5.2.1 全量复制

- master 执行 bgsave ，在本地生成一份 rdb 快照文件。
- master node 将 rdb 快照文件发送给 slave node，如果 rdb 复制时间超过 60 秒（repl-timeout），那么 slave node 就会认为复制失败，可以适当调大这个参数(对于千兆网卡的机器，一般每秒传输 100MB，6G 文件，很可能超过 60s)
- master node 在生成 rdb 时，会将所有新的写命令缓存在内存中，在 slave node 保存了 rdb 之后，再将新的写命令复制给 slave node。
- 如果在复制期间，内存缓冲区持续消耗超过 64MB，或者一次性超过 256MB，那么停止复制，复制失败。

```bash
client-output-buffer-limit slave 256MB 64MB 60
```

- slave node 接收到 rdb 之后，清空自己的旧数据，然后重新加载 rdb 到自己的内存中，同时`基于旧的数据版本`对外提供服务。
- 如果 slave node 开启了 AOF，那么会立即执行 BGREWRITEAOF，重写 AOF。

#### 7.5.2.2 增量复制

- 如果全量复制过程中，master-slave 网络连接断掉，那么 slave 重新连接 master 时，会触发增量复制。
- master 直接从自己的 backlog 中获取部分丢失的数据，发送给 slave node，默认 backlog 就是 1MB。
- master 就是根据 slave 发送的 psync 中的 offset 来从 backlog 中获取数据的。

#### 7.5.2.3 异步复制

master 每次接收到写命令之后，先在内部写入数据，然后异步发送给 slave node。

#### 7.5.2.4 heartbeat

主从节点互相都会发送 heartbeat 信息。

master 默认每隔 10 秒发送一次 heartbeat，slave node 每隔 1 秒发送一个 heartbeat。

## 7.6 生产环境中的 redis 是怎么部署的？

redis cluster，10 台机器，分别用5 台机器部署了 redis 主从实例，每个主实例挂了一个从实例，5 个节点对外提供读写服务，每个节点的读写高峰qps可能可以达到每秒 5 万，5 台机器最多是 25 万读写请求/s。

机器是什么配置？32G 内存+ 8 核 CPU + 1T 磁盘，但是分配给 redis 进程的是10g内存，一般线上生产环境，redis 的内存尽量不要超过 10g，超过 10g 可能会有问题。

5 台机器对外提供读写，一共有 50g 内存。

因为每个主实例都挂了一个从实例，所以是高可用的，任何一个主实例宕机，都会自动故障迁移，redis 从实例会自动变成主实例继续提供读写服务。

你往内存里写的是什么数据？每条数据的大小是多少？商品数据，每条数据是 10kb。100 条数据是 1mb，10 万条数据是 1g。常驻内存的是 200 万条商品数据，占用内存是 20g，仅仅不到总内存的 50%。目前高峰期每秒就是 3500 左右的请求量。

其实大型的公司，会有基础架构的 team 负责缓存集群的运维。

## 7.7 其他问题

### 7.7.1 说说Redis哈希槽的概念？

Redis集群没有使用一致性hash,而是引入了哈希槽的概念，**Redis集群有16384个哈希槽，每个key通过CRC16校验后对16384取模来决定放置哪个槽，集群的每个节点负责一部分hash槽`。

### 7.7.2 Redis集群会有写操作丢失吗？为什么？

Redis并不能保证数据的强一致性，这意味这在实际中集群在特定的条件下可能会丢失写操作。

### 7.7.3 Redis集群之间是如何复制的？

异步复制

### 7.7.4 Redis集群最大节点个数是多少？

16384个

### 7.7.5 Redis集群如何选择数据库？

Redis集群目前无法做数据库选择，默认在0数据库。

# 8. 分区

## 8.1 Redis是单线程的，如何提高多核CPU的利用率？

可以在同一个服务器部署多个Redis的实例，并把他们当作不同的服务器来使用，在某些时候，无论如何一个服务器是不够的， 所以，如果你想使用多个CPU，你可以考虑一下分片（shard）。

## 8.2 为什么要做Redis分区？

分区可以让Redis管理更大的内存，Redis将可以使用所有机器的内存。如果没有分区，你最多只能使用一台机器的内存。分区使Redis的计算能力通过简单地增加计算机得到成倍提升，Redis的网络带宽也会随着计算机和网卡的增加而成倍增长。

## 8.3 你知道有哪些Redis分区实现方案？

- 客户端分区就是在客户端就已经决定数据会被存储到哪个redis节点或者从哪个redis节点读取。大多数客户端已经实现了客户端分区。
- 代理分区 意味着客户端将请求发送给代理，然后代理决定去哪个节点写数据或者读数据。代理根据分区规则决定请求哪些Redis实例，然后根据Redis的响应结果返回给客户端。redis和memcached的一种代理实现就是Twemproxy
- 查询路由(Query routing) 的意思是客户端随机地请求任意一个redis实例，然后由Redis将请求转发给正确的Redis节点。Redis Cluster实现了一种混合形式的查询路由，但并不是直接将请求从一个redis节点转发到另一个redis节点，而是在客户端的帮助下直接redirected到正确的redis节点。

## 8.4 Redis分区有什么缺点？

- 涉及多个key的操作通常不会被支持。例如你不能对两个集合求交集，因为他们可能被存储到不同的Redis实例（实际上这种情况也有办法，但是不能直接使用交集指令）。
- 同时操作多个key,则不能使用Redis事务.
- 分区使用的粒度是key，不能使用一个非常长的排序key存储一个数据集（The partitioning granularity is the key, so it is not possible to shard a dataset with a single huge key like a very big sorted set）
- 当使用分区的时候，数据处理会非常复杂，例如为了备份你必须从不同的Redis实例和主机同时收集RDB / AOF文件。
- 分区时动态扩容或缩容可能非常复杂。Redis集群在运行时增加或者删除Redis节点，能做到最大程度对用户透明地数据再平衡，但其他一些客户端分区或者代理分区方法则不支持这种特性。然而，有一种预分片的技术也可以较好的解决这个问题。

# 9. 分布式问题

## 9.1 Redis实现分布式锁

Redis为单进程单线程模式，采用队列模式将并发访问变成串行访问，且多客户端对Redis的连接并不存在竞争关系Redis中可以使用SETNX命令实现分布式锁。

当且仅当 key 不存在，将 key 的值设为 value。若给定的 key 已经存在，则 SETNX 不做任何动作

SETNX 是『SET if Not eXists』(如果不存在，则 SET)的简写。

返回值：设置成功，返回 1 。设置失败，返回 0 。

​    ![0](https://i.loli.net/2021/10/06/RD1pZ5eUaYdfmOC.png)

img

使用SETNX完成同步锁的流程及事项如下：

使用SETNX命令获取锁，若返回0（key已存在，锁已存在）则获取失败，反之获取成功

为了防止获取锁后程序出现异常，导致其他线程/进程调用SETNX命令总是返回0而进入死锁状态，需要为该key设置一个“合理”的过期时间

释放锁，使用DEL命令将锁数据删除

## 9.2 如何解决 Redis 的并发竞争 Key 问题

所谓 Redis 的并发竞争 Key 的问题也就是多个系统同时对一个 key 进行操作，但是最后执行的顺序和我们期望的顺序不同，这样也就导致了结果的不同！

### 9.2.1 非顺序性

如果对这个key操作，不要求顺序，这种情况下，准备一个分布式锁，大家去抢锁，抢到锁就做set操作即可，比较简单。

推荐一种方案：分布式锁（zookeeper 和 redis 都可以实现分布式锁）。（如果不存在 Redis 的并发竞争 Key 问题，不要使用分布式锁，这样会影响性能）

基于zookeeper临时有序节点可以实现的分布式锁。大致思想为：每个客户端对某个方法加锁时，在zookeeper上的与该方法对应的指定节点的目录下，生成一个唯一的瞬时有序节点。判断是否获取锁的方式很简单，只需要判断有序节点中序号最小的一个。当释放锁的时候，只需将这个瞬时节点删除即可。同时，其可以避免服务宕机导致的锁无法释放，而产生的死锁问题。完成业务流程后，删除对应的子节点释放锁。

在实践中，当然是从以可靠性为主。所以首推Zookeeper。

### 9.2.2 顺序性

如果对这个key操作，要求顺序

​    假设有一个key1,系统A需要将key1设置为valueA,系统B需要将key1设置为valueB,系统C需要将key1设置为valueC.    

​    期望按照key1的value值按照 valueA–>valueB–>valueC的顺序变化。这种时候我们在数据写入数据库的时候，需要保存一个时间戳。假设时间戳如下

​        系统A key 1 {valueA 3:00}

​        系统B key 1 {valueB 3:05}

​        系统C key 1 {valueC 3:10} 

   那么，假设这会系统B先抢到锁，将key1设置为{valueB 3:05}。接下来系统A抢到锁，发现自己的valueA的时间戳早于缓存中的时间戳，那就不做set操作了。以此类推。

(3) 其他方法，比如利用队列，将set方法变成串行访问也可以。

## 9.3 分布式Redis是前期做还是后期规模上来了再做好？为什么？

既然Redis是如此的轻量（单实例只使用1M内存），为防止以后的扩容，最好的办法就是一开始就启动较多实例。即便你只有一台服务器，你也可以一开始就让Redis以分布式的方式运行，使用分区，在同一台服务器上启动多个实例。

一开始就多设置几个Redis实例，例如32或者64个实例，对大多数用户来说这操作起来可能比较麻烦，但是从长久来看做这点牺牲是值得的。

这样的话，当你的数据不断增长，需要更多的Redis服务器时，你需要做的就是仅仅将Redis实例从一台服务迁移到另外一台服务器而已（而不用考虑重新分区的问题）。一旦你添加了另一台服务器，你需要将你一半的Redis实例从第一台机器迁移到第二台机器。

## 9.4 什么是 RedLock

Redis 官方站提出了一种权威的基于 Redis 实现分布式锁的方式名叫 *Redlock*，此种方式比原先的单节点的方法更安全。它可以保证以下特性：

1. 安全特性：互斥访问，即永远只有一个 client 能拿到锁
2. 避免死锁：最终 client 都可能拿到锁，不会出现死锁的情况，即使原本锁住某资源的 client crash 了或者出现了网络分区
3. 容错性：只要大部分 Redis 节点存活就可以正常提供服务

往期面试题汇总：[001期~150期汇总](http://mp.weixin.qq.com/s?__biz=MzIyNDU2ODA4OQ==&mid=2247485351&idx=2&sn=214225ab4345f4d9c562900cb42a52ba&chksm=e80db1d1df7a38c741137246bf020a5f8970f74cd03530ccc4cb2258c1ced68e66e600e9e059&scene=21#wechat_redirect)

# 10. 缓存异常

## 10.1 缓存雪崩（优先）

缓存雪崩是指缓存同一时间大面积的失效，所以，后面的请求都会落到数据库上，造成数据库短时间内承受大量请求而崩掉。

解决方案

1. 缓存数据的过期时间设置随机，防止同一时间大量数据过期现象发生。

2. 一般并发量不是特别多的时候，使用最多的解决方案是加锁排队。

3. 给每一个缓存数据增加相应的缓存标记，记录缓存的是否失效，如果缓存标记失效，则更新数据缓存。



缓存雪崩的事前事中事后的解决方案如下：

- 事前：Redis 高可用，主从+哨兵，Redis cluster，避免全盘崩溃。
- 事中：本地 ehcache 缓存 + hystrix 限流&降级，避免 MySQL 被打死。
- 事后：Redis 持久化，一旦重启，自动从磁盘上加载数据，快速恢复缓存数据。

![redis-caching-avalanche-solution](https://doocs.gitee.io/advanced-java/docs/high-concurrency/images/redis-caching-avalanche-solution.png)

用户发送一个请求，系统 A 收到请求后，先查本地 ehcache 缓存，如果没查到再查 Redis。如果 ehcache 和 Redis 都没有，再查数据库，将数据库中的结果，写入 ehcache 和 Redis 中。

限流组件，可以设置每秒的请求，有多少能通过组件，剩余的未通过的请求，怎么办？`走降级`！可以返回一些默认的值，或者友情提示，或者空值。

好处：

- 数据库绝对不会死，限流组件确保了每秒只有多少个请求能通过。
- 只要数据库不死，就是说，对用户来说，2/5 的请求都是可以被处理的。
- 只要有 2/5 的请求可以被处理，就意味着你的系统没死，对用户来说，可能就是点击几次刷不出来页面，但是多点几次，就可以刷出来了。

## 10.2 缓存穿透（优先）

缓存穿透是指缓存和数据库中都没有的数据，导致所有的请求都落到数据库上，造成数据库短时间内承受大量请求而崩掉。

解决方案

1. 接口层增加校验，如用户鉴权校验，id做基础校验，id<=0的直接拦截；
2. 从缓存取不到的数据，在数据库中也没有取到，这时也可以将key-value对写为key-null，缓存有效时间可以设置短点，如30秒（设置太长会导致正常情况也没法使用）。这样可以防止攻击用户反复用同一个id暴力攻击
3. 采用布隆过滤器，将所有可能存在的数据哈希到一个足够大的 bitmap 中，一个一定不存在的数据会被这个 bitmap 拦截掉，从而避免了对底层存储系统的查询压力

`附加`

对于空间的利用到达了一种极致，那就是Bitmap和布隆过滤器(Bloom Filter)。

Bitmap：典型的就是哈希表

缺点是，Bitmap对于每个元素只能记录1bit信息，如果还想完成额外的功能，恐怕只能靠牺牲更多的空间、时间来完成了。

`布隆过滤器（推荐）`

就是引入了k(k>1)k(k>1)个相互独立的哈希函数，保证在给定的空间、误判率下，完成元素判重的过程。

它的优点是空间效率和查询时间都远远超过一般的算法，缺点是有一定的误识别率和删除困难。

Bloom-Filter算法的核心思想就是利用多个不同的Hash函数来解决“冲突”。

Hash存在一个冲突（碰撞）的问题，用同一个Hash得到的两个URL的值有可能相同。为了减少冲突，我们可以多引入几个Hash，如果通过其中的一个Hash值我们得出某元素不在集合中，那么该元素肯定不在集合中。只有在所有的Hash函数告诉我们该元素在集合中时，才能确定该元素存在于集合中。这便是Bloom-Filter的基本思想。

Bloom-Filter一般用于在大数据量的集合中判定某元素是否存在。

![redis-caching-avoid-penetration](https://doocs.gitee.io/advanced-java/docs/high-concurrency/images/redis-caching-avoid-penetration.png)

## 10.3 缓存击穿（优先）

缓存击穿，就是说某个 key 非常热点，访问非常频繁，处于集中式高并发访问的情况，当这个 key 在失效的瞬间，大量的请求就击穿了缓存，直接请求数据库。和缓存雪崩不同的是，缓存击穿指并发查同一条数据，缓存雪崩是不同数据都过期了，很多数据都查不到从而查数据库。

不同场景下的解决方式可如下：

- 若缓存的数据是基本不会发生更新的，则可尝试将该热点数据设置为永不过期。
- 若缓存的数据更新不频繁，且缓存刷新的整个流程耗时较少的情况下，则可以采用基于 Redis、zookeeper 等分布式中间件的分布式互斥锁，或者本地互斥锁以保证仅少量的请求能请求数据库并重新构建缓存，其余线程则在锁释放后能访问到新缓存。
- 若缓存的数据更新频繁或者在缓存刷新的流程耗时较长的情况下，可以利用定时线程在缓存过期前主动地重新构建缓存或者延后缓存的过期时间，以保证所有的请求能一直访问到对应的缓存。

## 10.4 缓存预热

缓存预热就是系统上线后，将相关的缓存数据直接加载到缓存系统。这样就可以避免在用户请求的时候，先查询数据库，然后再将数据缓存的问题！用户直接查询事先被预热的缓存数据！

解决方案

1. 直接写个缓存刷新页面，上线时手工操作一下；
2. 数据量不大，可以在项目启动的时候自动进行加载；
3. 定时刷新缓存；

## 10.5 缓存降级

当访问量剧增、服务出现问题（如响应时间慢或不响应）或非核心服务影响到核心流程的性能时，仍然需要保证服务还是可用的，即使是有损服务。系统可以根据一些关键数据进行自动降级，也可以配置开关实现人工降级。

缓存降级的最终目的是保证核心服务可用，即使是有损的。而且有些服务是无法降级的（如加入购物车、结算）。

在进行降级之前要对系统进行梳理，看看系统是不是可以丢卒保帅；从而梳理出哪些必须誓死保护，哪些可降级；比如可以参考日志级别设置预案：

1. 一般：比如有些服务偶尔因为网络抖动或者服务正在上线而超时，可以自动降级；
2. 警告：有些服务在一段时间内成功率有波动（如在95~100%之间），可以自动降级或人工降级，并发送告警；
3. 错误：比如可用率低于90%，或者数据库连接池被打爆了，或者访问量突然猛增到系统能承受的最大阀值，此时可以根据情况自动降级或者人工降级；
4. 严重错误：比如因为特殊原因数据错误了，此时需要紧急人工降级。

服务降级的目的，是为了防止Redis服务故障，导致数据库跟着一起发生雪崩问题。因此，对于不重要的缓存数据，可以采取服务降级策略，例如一个比较常见的做法就是，Redis出现问题，不去数据库查询，而是直接返回默认值给用户。

## 10.6 热点数据和冷数据

热点数据，缓存才有价值

对于冷数据而言，大部分数据可能还没有再次访问到就已经被挤出内存，不仅占用内存，而且价值不大。频繁修改的数据，看情况考虑使用缓存

对于热点数据，比如我们的某IM产品，生日祝福模块，当天的寿星列表，缓存以后可能读取数十万次。再举个例子，某导航产品，我们将导航信息，缓存以后可能读取数百万次。

数据更新前至少读取两次，缓存才有意义。这个是最基本的策略，如果缓存还没有起作用就失效了，那就没有太大价值了。

那存不存在，修改频率很高，但是又不得不考虑缓存的场景呢？有！比如，这个读取接口对数据库的压力很大，但是又是热点数据，这个时候就需要考虑通过缓存手段，减少数据库的压力，比如我们的某助手产品的，点赞数，收藏数，分享数等是非常典型的热点数据，但是又不断变化，此时就需要将数据同步保存到Redis缓存，减少数据库压力。

## 10.7 缓存热点key

缓存中的一个Key(比如一个促销商品)，在某个时间点过期的时候，恰好在这个时间点对这个Key有大量的并发请求过来，这些请求发现缓存过期一般都会从后端DB加载数据并回设到缓存，这个时候大并发的请求可能会瞬间把后端DB压垮。

`解决方案`

对缓存查询加锁，如果KEY不存在，就加锁，然后查DB入缓存，然后解锁；其他进程如果发现有锁就等待，然后等解锁后返回数据或者进入DB查询

# 11. 常用工具

## 11.1 Redis支持的Java客户端都有哪些？官方推荐用哪个？

Redisson、Jedis、lettuce等等，官方推荐使用Redisson。

## 11.2 Redis和Redisson有什么关系？

Redisson是一个高级的分布式协调Redis客服端，能帮助用户在分布式环境中轻松实现一些Java的对象 (Bloom filter, BitSet, Set, SetMultimap, ScoredSortedSet, SortedSet, Map, ConcurrentMap, List, ListMultimap, Queue, BlockingQueue, Deque, BlockingDeque, Semaphore, Lock, ReadWriteLock, AtomicLong, CountDownLatch, Publish / Subscribe, HyperLogLog)。

## 11.3 Jedis与Redisson对比有什么优缺点？

Jedis是Redis的Java实现的客户端，其API提供了比较全面的Redis命令的支持；Redisson实现了分布式和可扩展的Java数据结构，和Jedis相比，功能较为简单，不支持字符串操作，不支持排序、事务、管道、分区等Redis特性。Redisson的宗旨是促进使用者对Redis的关注分离，从而让使用者能够将精力更集中地放在处理业务逻辑上。

往期面试题汇总：[001期~150期汇总](http://mp.weixin.qq.com/s?__biz=MzIyNDU2ODA4OQ==&mid=2247485351&idx=2&sn=214225ab4345f4d9c562900cb42a52ba&chksm=e80db1d1df7a38c741137246bf020a5f8970f74cd03530ccc4cb2258c1ced68e66e600e9e059&scene=21#wechat_redirect)

# 12. 其他问题

## 12.1 Redis与Memcached的区别

两者都是非关系型内存键值数据库，现在公司一般都是用 Redis 来实现缓存，而且 Redis 自身也越来越强大了！Redis 与 Memcached 主要有以下不同：

​    ![0](https://i.loli.net/2021/10/06/pR5m6KdjezqZuXf.png)

(1) memcached所有的值均是简单的字符串，redis作为其替代者，支持更为丰富的数据类型

(2) redis的速度比memcached快很多

(3) redis可以持久化其数据

## 12.2 如何保证缓存与数据库双写时的数据一致性？（优先）

分析:一致性问题是分布式常见问题，还可以再分为最终一致性和强一致性。数据库和缓存双写，就必然会存在不一致的问题。

答这个问题，先明白一个前提。

就是如果对数据有强一致性要求，不能放缓存。我们所做的一切，只能保证最终一致性。另外，`我们所做的方案其实从根本上来说，只能说降低不一致发生的概率，无法完全避免`。因此，有强一致性要求的数据，不能放缓存。

首先，采取正确更新策略，先更新数据库，再删缓存。

其次，因为可能存在删除缓存失败的问题，提供一个补偿措施即可，例如利用消息队列。

> 补充

你只要用缓存，就可能会涉及到缓存与数据库双存储双写，你只要是双写，就一定会有数据一致性的问题，那么你如何解决一致性问题？

`强一致性：读请求和写请求串行化，串到一个内存队列里去。`

一般来说，如果允许缓存可以稍微的跟数据库偶尔有不一致的情况，也就是说如果你的系统`不是严格要求` “缓存+数据库” 必须保持一致性的话，最好不要做这个方案，即`读请求和写请求串行化`，串到一个`内存队列`里去。

`串行化可以保证一定不会出现不一致的情况`，但是它也会导致系统的吞吐量大幅度降低，用比正常情况下多几倍的机器去支撑线上的一个请求。

串行化之后，就会导致系统的吞吐量会大幅度的降低，用比正常情况下多几倍的机器去支撑线上的一个请求。

还有一种方式就是可能会暂时产生不一致的情况，但是发生的几率特别小，就是`先更新数据库，然后再删除缓存。`



#### Cache Aside Pattern

最经典的缓存+数据库读写的模式，就是 Cache Aside Pattern。

- 读的时候，先读缓存，缓存没有的话，就读数据库，然后取出数据后放入缓存，同时返回响应。

- 更新的时候，`先更新数据库，然后再删除缓存`。

> 为什么是删除缓存，而不是更新缓存？

类似于懒加载的思想，需要用的时候才取。


### 12.2.1 延时双删策略

在写库前后都进行redis.del(key)操作，并且设定合理的超时时间。具体步骤是：

1）先删除缓存

2）再写数据库

3）休眠500毫秒（根据具体的业务时间来定）

4）再次删除缓存。

伪代码：
```java
public void write(String key,Object data){
    redis.delKey(key);
    db.updateData(data);
    Thread.sleep(1000);
    redis.delKey(key);
}
```

`那么，这个500毫秒怎么确定的，具体该休眠多久呢？`

需要评估自己的项目的读数据业务逻辑的耗时。这么做的目的，就是确保读请求结束，写请求可以删除读请求造成的缓存脏数据。

当然，这种策略还要考虑 redis 和数据库主从同步的耗时。最后的写数据的休眠时间：则在读数据业务逻辑的耗时的基础上，加上几百ms即可。比如：休眠1秒。

### 12.2.2 设置缓存的过期时间

从理论上来说，给缓存设置过期时间，是保证最终一致性的解决方案。所有的写操作以数据库为准，只要到达缓存过期时间，则后面的读请求自然会从数据库中读取新值然后回填缓存

结合双删策略+缓存超时设置，这样最差的情况就是`在超时时间内数据存在不一致，而且又增加了写请求的耗时`。

### 12.2.3 如何写完数据库后，再次删除缓存成功？

上述的方案有一个缺点，那就是操作完数据库后，由于种种原因删除缓存失败，这时，可能就会出现数据不一致的情况。这里，我们需要提供一个保障重试的方案。

#### 12.2.3.1 方案一：删除重试机制

![删除重试机制](https://i.loli.net/2021/10/08/eL9453PUAdunYfi.png)

（1）更新数据库数据；

（2）缓存因为种种问题删除失败；

（3）将需要删除的key发送至消息队列；

（4）自己消费消息，获得需要删除的key；

（5）继续重试删除操作，直到成功。

然而，该方案有一个缺点，`对业务线代码造成大量的侵入`。于是有了方案二，在方案二中，启动一个订阅程序去订阅数据库的binlog，获得需要操作的数据。在应用程序中，另起一段程序，获得这个订阅程序传来的信息，进行删除缓存操作。

#### 12.2.3.2 方案二：读取binlog异步删除缓存

![读取biglog异步删除缓存](https://i.loli.net/2021/10/08/sQdoVXNyq61OTZm.jpg)

（1）更新数据库数据；

（2）数据库会将操作信息写入binlog日志当中；

（3）订阅程序提取出所需要的数据以及key；

（4）另起一段非业务代码，获得该信息；

（5）尝试删除缓存操作，发现删除失败；

（6）将这些信息发送至消息队列；

（7）重新从消息队列中获得该数据，重试操作。

备注说明：上述的订阅binlog程序在mysql中有现成的中间件叫canal，可以完成订阅binlog日志的功能。



以上方案都是在业务中经常会碰到的场景，可以依据业务场景的复杂性和对数据一致性的要求来选择具体的方案：最终一致性

### 12.2.4 最终一致性方案（待完善）

[详细解答](https://doocs.gitee.io/advanced-java/#/./docs/high-concurrency/redis-consistence?id=%e6%af%94%e8%be%83%e5%a4%8d%e6%9d%82%e7%9a%84%e6%95%b0%e6%8d%ae%e4%b8%8d%e4%b8%80%e8%87%b4%e9%97%ae%e9%a2%98%e5%88%86%e6%9e%90)

根据数据的唯一标识路由到指定的机器，在JVM的内部队列中串行化执行更新数据库和更新缓存的操作：

1）删除缓存+更新数据库

2）读取数据+更新缓存

对于存在多个更新缓存操作的请求串行，等待队列中的缓存执行完更新操作即可






## 12.3 Redis常见性能问题和解决方案？

1. Master最好不要做任何持久化工作，包括内存快照和AOF日志文件，特别是不要启用内存快照做持久化。
2. 如果数据比较关键，某个Slave开启AOF备份数据，策略为每秒同步一次。
3. 为了主从复制的速度和连接的稳定性，Slave和Master最好在同一个局域网内。
4. 尽量避免在压力较大的主库上增加从库
5. Master调用BGREWRITEAOF重写AOF文件，AOF在重写的时候会占大量的CPU和内存资源，导致服务load过高，出现短暂服务暂停现象。
6. 为了Master的稳定性，主从复制不要用图状结构，用单向链表结构更稳定，即主从关系为：Master<–Slave1<–Slave2<–Slave3…，这样的结构也方便解决单点故障问题，实现Slave对Master的替换，也即，如果Master挂了，可以立马启用Slave1做Master，其他不变。

## 12.4 Redis官方为什么不提供Windows版本？

因为目前Linux版本已经相当稳定，而且用户量很大，无需开发windows版本，反而会带来兼容性等问题。

## 12.5 一个字符串类型的值能存储最大容量是多少？

512M

## 12.6 Redis如何做大量数据插入？

Redis2.6开始redis-cli支持一种新的被称之为pipe mode的新模式用于执行大量数据插入工作。

## 12.7 假如Redis里面有1亿个key，其中有10w个key是以某个固定的已知的前缀开头的，如果将它们全部找出来？

使用keys指令可以扫出指定模式的key列表。

对方接着追问：如果这个redis正在给线上的业务提供服务，那使用keys指令会有什么问题？

这个时候你要回答redis关键的一个特性：redis的单线程的。keys指令会导致线程阻塞一段时间，线上服务会停顿，直到指令执行完毕，服务才能恢复。这个时候可以使用scan指令，scan指令可以无阻塞的提取出指定模式的key列表，但是会有一定的重复概率，在客户端做一次去重就可以了，但是整体所花费的时间会比直接用keys指令长。

## 12.8 使用Redis做过异步队列吗，是如何实现的

使用list类型保存数据信息，rpush生产消息，lpop消费消息，当lpop没有消息时，可以sleep一段时间，然后再检查有没有信息，如果不想sleep的话，可以使用blpop, 在没有信息的时候，会一直阻塞，直到信息的到来。redis可以通过pub/sub主题订阅模式实现一个生产者，多个消费者，当然也存在一定的缺点，当消费者下线时，生产的消息会丢失。

## 12.9 Redis如何实现延时队列

使用sortedset，使用时间戳做score, 消息内容作为key,调用zadd来生产消息，消费者使用zrangbyscore获取n秒之前的数据做轮询处理。

## 12.10 Redis回收进程如何工作的？

1. 一个客户端运行了新的命令，添加了新的数据。
2. Redis检查内存使用情况，如果大于maxmemory的限制， 则根据设定好的策略进行回收。
3. 一个新的命令被执行，等等。
4. 所以我们不断地穿越内存限制的边界，通过不断达到边界然后不断地回收回到边界以下。

如果一个命令的结果导致大量内存被使用（例如很大的集合的交集保存到一个新的键），不用多久内存限制就会被这个内存使用量超越。

## 12.11 Redis回收使用的是什么算法？

LRU算法

