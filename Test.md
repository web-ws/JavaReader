# 标题1

注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调


## 标题2
注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调

### 标题3

注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调

#### 标题4

注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调


##### 标题5
注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调

段落1：@RabbitListener底层使用AOP进行拦截，如果程序没有抛出异常，自动提交事务。 如果Aop使用异常通知 拦截获取异常信息的话 ， 自动实现补偿机制，该消息会一直缓存在Rabbitmq服务器端进行重放，一直重试到不抛出异常为准。

段落2：@RabbitListener底层使用AOP进行拦截，如果程序没有抛出异常，自动提交事务。 如果Aop使用异常通知 拦截获取异常信息的话 ， 自动实现补偿机制，该消息会一直缓存在Rabbitmq服务器端进行重放，一直重试到不抛出异常为准。

段落3：@RabbitListener底层使用AOP进行拦截，如果程序没有抛出异常，自动提交事务。 如果Aop使用异常通知 拦截获取异常信息的话 ， 自动实现补偿机制，该消息会一直缓存在Rabbitmq服务器端进行重放，一直重试到不抛出异常为准。

*斜体*  
**粗体**  
***粗体+斜体***
在一行的末尾添加两个或多个空格，然后按回车键,即可创建一个换行(`<br>`)。  


> 引用内容1
> 
> 引用内容2
> 
>> 引用嵌套内容
> - 引用其他标签内容1
> - 引用其他标签内容2




## 链接

[带标题的 Title Markdown语法](https://markdown.com.cn "markdown最好的编辑器")。

<https://markdown.com.cn>

[跳转链接标题5](/Test?id=段落5)

[引用链接][1]

[1]: https://markdown.com.cn "markdown最好的编辑器"



## 测试

- [Docsify构建说明文档](https://notebook.js.org/#/Project/Docsify/docsifyNotes)
- [NoteBook](https://github.com/wugenqiang/NoteBook)
- [Docsify官方文档](https://docsify.js.org/#/zh-cn/)

# 笔记榜样

- [CS-Notes](http://www.cyc2018.xyz/)
- [JavaGuide](https://snailclimb.gitee.io/javaguide/#/)
- [mall](http://www.macrozheng.com/#/)

# Markdown
- [Markdown说明手册](https://markdown.com.cn/basic-syntax/)
- [CDN-jsdelivr](https://www.jsdelivr.com/)

# 图床网址
- [SM.MS](https://sm.ms/home/)

# 样式
## 字体颜色

<font color="red">红色</font>
<font color="Darkorange">Darkorange橙色</font>
<font color="Green">绿色</font>
<font color="ForestGreen">绿色</font>
<br/>

[markdown字体颜色](https://blog.csdn.net/liuhw4598/article/details/78279737)



## 强调
注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调

# 代码块
```java
package com.cn.pojo;

import java.util.Arrays;
import java.util.HashMap;

/**
 * Created by zws on 2021/9/17
 */
public class RandomizedSet {
    private Integer num;
    private Integer[] nums;
    private HashMap<Integer, Integer> numMap;

    public RandomizedSet() {

    }

    public RandomizedSet(int num) {
        this.num = num;
        numMap.put(num, 0);
    }

    /** 如果 val 不存在集合中，则插入并返回 true，否则直接返回 false */
    public boolean insert(int val) {
        if (numMap.containsKey(val)) {
            return false;
        }
        int len = nums.length;
        numMap.put(val, len);

        return true;
    }

    /** 如果 val 在集合中，则删除并返回 true，否则直接返回 false */
    public boolean remove(int val) {
        if (!numMap.containsKey(val)) {
            return false;
        }
        Integer index = numMap.get(val);
        int last = nums.length - 1;
        // 交换元素
        swap(nums, numMap, index, last);

        // 移除元素
        Arrays.copyOf(nums, last - 1);
        numMap.remove(val);

        return true;
    }

    private static void swap(Integer[] nums,HashMap numMap, int src, int tar) {
        // 数组
        int temp = nums[src];
        nums[src] = nums[tar];
        nums[tar] = temp;
        // 哈希映射
        numMap.put(temp, tar); // 源值
        numMap.put(nums[src], tar); //目标值
    }

    /** 从集合中等概率地随机获得一个元素 */
    public Integer getRandom() {
        return nums[(int) Math.random()];
    }
}

```



