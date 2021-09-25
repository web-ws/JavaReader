# 1. 准备工作

## 1.1 创建远程仓库

在github上按照如下图操作，创建远程仓库

点击+号，选择“New respository“，输入仓库的名称”JavaReader“，输入有关仓库的描述“✍记录Java相关的知识“素养””，点击“Create Respository”

![image-20210925132038287](https://i.loli.net/2021/09/25/mYpLePK4EQOGUx6.png)

![image-20210925132408232](https://i.loli.net/2021/09/25/kCp2ODcVmibdJ73.png)

## 1.2 创建本地仓库

在本地某个目录下创建与远程仓库相同名字的仓库，并作初始化

```shell
echo "# JavaReader" >> README.md
git init
git config --global init.defaultBranch master # 配置初始化默认分支的名称为master
git add README.md  # 预提交指定的文件
git commit -m "first commit" # 正式提交文件，并且做备注
git remote add origin git@github.com:web-ws/JavaReader.git # 建立本地仓库与远程仓库的关系
git push -u origin master # 提交修改后的内容到远程仓库
```

![image-20210925133205566](https://i.loli.net/2021/09/25/AVtUqlKJhIyQvo3.png)

## 1.2 下载docsify

# 2. docsify入门

## 2.1 安装docsify工具

推荐全局安装 `docsify-cli` 工具，可以方便地创建及在本地预览生成的文档。

```bash
npm i docsify-cli -g
```

## 2.2 初始化项目

如果想在项目的 `./docs` 目录里写文档，直接通过 `init` 初始化项目。

```bash
docsify init ./docs
```

## 2.3 编写文档

初始化成功后，可以看到 `./docs` 目录下创建的几个文件

- `index.html` 作为入口文件
- `README.md` 作为主页内容渲染
- $\color{red}{.nojekyll 用于阻止 GitHub Pages 会忽略掉下划线开头的文件}$

![image-20210925134330136](https://i.loli.net/2021/09/25/Xzhtq3FQbjCagSf.png)

## 2.4 本地预览网站

通过运行 `docsify serve` 启动一个本地服务器，可以方便地实时预览效果。默认访问地址 [http://localhost:3000](http://localhost:3000/) 。

```bash
docsify serve docs
```

![image-20210925134631671](https://i.loli.net/2021/09/25/2DGyFKeSintWqjE.png)

## 2.5 GitPages

默认的/root目录作为服务启动的目录

所以需要把上述三个文件一并迁移至项目的根目录下，才能作为根目录启动，正常显示。

![image-20210925211449060](https://i.loli.net/2021/09/25/kZP5Msdp6gr4RvX.png)

# 3. 页面的内容编辑

参考：https://notebook.js.org/#/Project/Docsify/docsifyNotes

## 3.1 笔记标题链接

## 3.2 右上角的GitHub图标

## 3.3 导航栏

## 3.4 全文搜索框

## 3.5 回到顶部

## 3.6 代码块的圆角边框

## 3.7 文章标题的大小h1-h6

## 3.8 文章字体颜色和强调方式

## 3.9 组件整理（css-js...）

## 3.10 文章字数和阅读估计时间



