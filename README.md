## 主题介绍

为纸小墨写的一款主题,该主题移植自[Yumoe](https://yumoe.com)
<!--和[Artifact.](https://artifact.me/)-->

### Demo
[ink-theme-story](https://ink-theme-story.pancakeapps.com)

### 主题的一些食用说明

#### 菜单

标题旁边有一个 · 字符，点击后便可显示菜单。**1**,**2**,**3** 分别代表 **独立页面菜单**、**导航树**(仅在文章界面有用)以及**搜索框**。

具体介绍可见[https://yumoe.com/archives/story.html](https://yumoe.com/archives/story.html)

### 一些功能

- 评论点击加载, 可以应对一些墙导致无法加载的场景
- 图片懒加载
- 支持来必力和Disqus评论系统, 默认为Disqus
- ...

## 主题截图
![Screenshot_20180820_143859.png](https://i.loli.net/2018/08/20/5b7a62b4ce584.png)

## 使用方法

### 基础设置

进入到纸小墨程序的目录下, 也就是ink主程序的目录, 然后进入该目录下的blog目录

然后执行
```bash
git clone https://github.com/akkuman/ink-theme-story.git
```
或者下载git压缩包后解压到blog文件夹

现在你可以看到blog目录下的ink-theme-story目录

然后修改站点配置文件`blog/config.yml`

站点配置文件一般如下: 

```yml
site:
    title: "Akkuman"
    subtitle: "Akkuman的技术博客"
    limit: 8
    theme: ink-theme-story
    lang: zh
    url: "ink-theme-story.pancakeapps.com"
    comment: Akkuman
    logo: "-/images/avatar.png"
    # link: "{category}/{year}/{month}/{day}/{title}.html"
    link: "{year}/{month}/{day}/{title}.html"
    # root: "/blog"

authors:
    me:
        name: "Akkuman"
        intro: "编程小白|技术菜鸟"
        avatar: "-/images/avatar.png"

build:
    # output: "public"
    port: 8000
    # Copied files to public folder when build
    copy:
        - "source/images"
    # Excuted command when use 'ink publish'
    publish: |
        git add . -A
        git commit -m "update"
        git push origin
```

我们需要**修改**的地方有:
```yml
title   #title字段是截图中的左上角Akkuman字段, 比如我设置为Akkuman那么就是和我截图中一样
subtitle    #网站子标题, 在标签页和归档能看到
limit: 8    #每页可显示的文章数目, 为了美观建议设置为8
theme: ink-theme-story    #网站主题目录, 设置为该主题ink-theme-story
```

其他地方根据自己需求更改, 纸小墨说明文档见[简洁的静态博客构建工具 —— 纸小墨（InkPaper）](http://www.chole.io/blog/ink-blog-tool.html)

### 关于页面

在纸小墨中,每篇文章是有作者的,我现在按上面我给出的例子配置为例进行说明

纸小墨中每一篇文章的头配置大致如下: 

```yml
title: "简洁的静态博客构建工具 —— 纸小墨（InkPaper）"
date: 2015-03-01 18:00:00 +0800
update: 2016-07-11 17:00:00 +0800
author: me
cover: "-/images/example.png"
tags:
    - 设计
    - 写作
preview: 纸小墨（InkPaper）是一个GO语言编写的开源静态博客构建工具，可以快速搭建博客网站。它无依赖跨平台，配置简单构建快速，注重简洁易用与更优雅的排版。
```

其中的`preview`是文章预览，也可在正文中使用`<!--more-->`分割, 是一个可选字段,我们不必管

对我们有影响的字段配置除了基础的`title`等等之外, 需要关注一下`author`这个字段

纸小墨每一篇文章的作者的关于页面是`about.{{.Author.Id}}.html`, 比如我上面的站点配置文件中`authors`有一个值是`me`, 那么这个作者的关于页面就是`about.me.html`, 也就是我们需要建立一个page, 纸小墨主程序打包中有一个文件`about.me.md`, 可以参见这个文件的格式, 我在这里给出来: 

```
type: page
title: "关于作者"
author: me

---

## 纸小墨

构建只为纯粹书写的博客。

[http://www.chole.io/](http://www.chole.io/)
```

那么这个文件生成后就会在站点根目录下生成`about.me.html`文件.

**重点来了**

上面我说的关于页面是单个作者的关于页面, 在这个主题中, 我有定义一个站点的关于页面

```html
<a href="{{.Site.Root}}/about.html"><li>{{i18n "about"}}</li></a>
```

我们只需要按照上面`about.me.md`的格式新建一个`about.md`即可, 我在这里给出一个`about.md`例子: 

```
type: page
title: "关于本站"

---

我是一个站点关于页面例子 
```

`author`字段可省略,看自己的喜好

### 评论系统切换

本主题的评论采用点击再动态加载的方式, 所以不用担心因为Disqus被墙的原因导致页面打不开, 只有当你点击`show comments`时才会开始加载评论

本主题支持Disqus和来必力评论系统

切换的话只需要修改站点配置文件`blog/config.yml`, 把`comment`字段的值修改成来必力的`data-uid`(*可在来必力后台代码管理中看到*), 然后打开`blog/ink-theme-story/_comment.html`文件, 把来必力评论的注释去掉, 然后把Disqus评论加上注释即可