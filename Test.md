# 段落1
注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调


## 段落2
注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调


### 段落3
注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调


#### 段落4
注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调


##### 段落5
注意这里需要修改强调`注意这里需要修改强调`注意这里需要修改强调



正文

## 测试

- [Docsify构建说明文档](https://notebook.js.org/#/Project/Docsify/docsifyNotes)
- [NoteBook](https://github.com/wugenqiang/NoteBook)
- [Docsify官方文档](https://docsify.js.org/#/zh-cn/)

# 笔记榜样
- [CS-Notes](http://www.cyc2018.xyz/)
- [JavaGuide](https://snailclimb.gitee.io/javaguide/#/)

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



