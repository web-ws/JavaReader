

**使用指南：**https://juejin.cn/post/6844903826063884296#heading-98

## 一、VSCode 快捷键

### 1. 工### 1. 工作区快捷键
- 显示命令面板：ctrl+shirt+p
- 显示/隐藏侧边栏：ctrl+B
- 创建多个编辑器：ctrl+\(切换英文模式)
- 聚焦哪个编辑器：ctrl+1/2/3/4/。。。
- 显示/隐藏控制台：ctrl+J
- 重新打开一个软件的窗口：ctrl+shirt+N
- 关闭软件的当前窗口：ctrl+shirt+W
- 新建文件：ctrl+N
- 关闭当前文件：ctrl+W

### 2. 跳转操作
- 多个工作区之间切换：cmd+·（windows没有）
- 多个文件之间切换：ctrl+Pagedown/Pageup 【mac：cmd+alt+左右方向键】
- 跳转到指定行：ctrl+G

### 3. 移动光标
- 方向键
- 定位到文章的第一行：ctrl+home 【mac：cmd+上方向键】
- 定位到文章的最后一行：ctrl+End 【mac：cmd+下方向键】
- 定位到当前行开头：Fn+左方向键或Win+左方向键【mac：cmd+左方向键】
- 定位到当前行结尾：Fn+右方向键或Win+右方向键【mac：cmd+右方向键】

### 4. 编辑操作
- 复制、剪切、粘贴
- 跳转至新的下一行：ctrl+enter
- 跳转至新的上一行：ctrl+shirt+enter
- 将代码向上下移动：alt+上下方向键
- 将代码向上下复制一行：alt+shirt+上下方向键


### 5. 多光标编辑
- 列模式：ctrl+alt+上下键
- 任意位置：alt+鼠标点击任意位置
- 行末尾：选中文本，按住alt+shirt+i键

### 6. 删除操作
- 删除整行：ctrl+shirt+K
- 删除光标之前的一个单词：ctrl+Backspace 【mac：option+Backspace】
- 删除光标之后的一个单词：ctrl+delete【mac：option+delete】
- 删除光标之前的整行内容：windows无【mac：cmd+Backspace】
- 删除光标之后的整行内容：windows无【mac：cmd+Delete】

### 7. 编程语言相关
- 单行注释： ctrl+/
- 代码格式化：alt+shirt+F
- 将多行代码合并一行：windows+右键命令控制面板+输入合并行【mac：ctrl+j】

### 8. 搜索相关
- 全局搜索代码：ctrl+shirt+F
- 全局搜索文件名：ctrl+p
- 当前文件搜素代码：ctrl+F

### 9. 自定义快捷键
> ctrl+shirt+P -》 快捷键
> code-》首选项-》键盘快捷方式

## 二、私人定制：VS Code的常见配置
### 1. 修改颜色主题

左下角设置-》颜色主题-》选择喜欢的颜色主题
### 2. 面包屑（Breadcrumb） 当前文件的层级结构

code-》用户设置-》工作台-》导航路径
### 3. 是否显示代码行号
设置搜索：editor.lineNumbers -》 yes
### 4. 将当前行代码高亮显示（更改光标所在行的背景色）
当我们把光标放在某一行时，这一行的背景色并没有发生变化。如果想高亮显示当前行的代码，需要设置两步：

（1）在设置项里搜索editor.renderLineHighlight，将选项值设置为all或者line。

（2）在设置项里增加如下内容：

```json
"workbench.colorCustomizations": {
    "editor.lineHighlightBackground": "#00000090",
    "editor.lineHighlightBorder": "#ffffff30"
}
```

上方代码，第一行代码的意思是：修改光标所在行的背景色（背景色设置为全黑，不透明度 90%）；第二行代码的意思是：修改光标所在行的边框色。

### 5. 文件自动保存
设置搜索：files.autoSave 修改为 onFocusChange ，光标离开文件自动保存
文件-》自动保存
### 6. 保存代码后，是否立即格式化代码
设置搜索：editor.formatOnSave -》 勾选 或者 默认
### 7. 空格和制表符
- editor.detectIndentation：自动检测（默认开启）。
- editor.insertSpaces：按 Tab 键时插入空格（默认）。
- editor.tabSize：一个制表符默认等于四个空格。

### 8. 新建文件默认文件类型
设置搜索：files.defaultLanguage ：html/javascript/markdown/java/sql/txt
### 9. 删除文件，是否弹出确认框
设置搜索：xplorer.confirmDelete
10. 文件比对
    安装插件：compareit 比对

    

11. 创建新的文件夹 aa/bb/cc

## 三、三头六臂：VS Code插件推荐

### 1. GitLens
GitLens 在 Git 管理上有很多强大的功能，比如：
### 2. Git History
有些同学习惯使用编辑器中的 Git 管理工具，而不太喜欢要打开另外一个 Git UI 工具的同学，这一款插件满足你查询所有 Git 记录的需求。
### 3. Chinese (Simplified) Language Pack for Visual Studio Code
简体中文语言
### 4. 突出显示成对括号
Bracket Pair Colorizer 2、Bracket Pair Colorizer 2插件：以不同颜色显示成对的括号，并用连线标注括号范围。简称彩虹括号。
### 5. sftp 上传文件到服务器
### 6. highlight-icemode：选中相同的代码时，让高亮显示更加明显【荐】
VSCode 自带的高亮显示，实在是不够显眼。用插件支持一下吧。
所用了这个插件之后，VS Code 自带的高亮就可以关掉了：
在用户设置里添加"editor.selectionHighlight": false即可。

### 7. 颜色主题插件
### 8. 文件图标主题插件
### 9. TODO Highlight
//TODO:这里有个bug，我一会儿再收拾你
打开命令面板：Todohighlist
### 10. Local History 【荐】
维护文件的本地历史记录，强烈建议安装。代码意外丢失时，有时可以救命。
### 11.RemoteHub
插件的作用是：可以在本地查看 GitHub 网站上的代码，而不需要将代码下载到本地。

## 四、无缝切换：VS Code 配置云同步

使用 VS Code 自带的同步功能
1、配置同步：
（1）在菜单栏选择「 Code --> 首选项 --> 打开设置同步」：

（2）选择需要同步的配置：

（3）通过Microsoft或者GitHub账号登录。 上图中，点击“登录并打开”，然后弹出如下界面：

上图中，使用  微软账号或者 GitHub账号登录：

（4）同步完成后，菜单栏会显示“首先项同步已打开”，最左侧也会多出一个同步图标，如下图所示：

2、管理同步：

（1）点击菜单栏「Code --> 首选项 --> 设置同步已打开」，会弹出如下界面，进行相应的同步管理即可：

（2）换另外一个电脑时，登录相同的账号，即可完成同步。



## 五、常见主题插件

- Dracula Theme
- Material Theme
- Nebula Theme
- One Dark Pro
- One Monokai Theme
- Monokai Pro
- Ayu
- Snazzy Plus
- Dainty
- SynthWave '84
- GitHub Plus Theme：白色主题
- Horizon Theme：红色主题

## 六、常用正则表达式

去除空白行：^\s*(?=\r?$)\n