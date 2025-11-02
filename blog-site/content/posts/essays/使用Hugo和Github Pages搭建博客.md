---
title: "使用Hugo和Github Pages搭建博客"
date: 2024-04-15
draft: false
tags: ["随笔","GitHub"]
slug: "github-build-blog"
---


# Hugo概述
`Hugo`是一个使用`Go`语言编写的快速、简单和灵活的静态网站生成器。
它使用起来非常简单，相对于`Jekyll`复杂的安装设置来说，`Hugo`仅需要一个二进制文件(`hugo.exe`)即可轻松用于本地调试和生成静态页面。
`Hugo`可以将你写好的`MarkDown`格式的文章自动转换为静态的网页。

除此之外，`Hugo`内置`web`服务器，可以在修改`MarkDown`文章之后切换到浏览器，页面会检测到更新并且自动刷新，呈现出最终效果，能极大的提高博客书写效率。

# 安装Hugo
要开始使用`Hugo`，你需要先安装它。可以访问[Hugo的官方网站](https://gohugo.io/getting-started/quick-start/)下载对应操作系统的版本，并按照指南进行安装。安装完成后，你就可以创建你的第一个博客了。

`Hugo`的安装方式有两种，一种是直接下载编译好的`Hugo`二进制文件。另一种方式是获取`Hugo`的源码，自己编译。
如果只是使用`Hugo`推荐第一种方式[下载地址](https://github.com/gohugoio/hugo/releases)。

根据你的操作系统下载对应的版本：
- Windows: `hugo_X.XX.X_Windows-64bit.zip`
- macOS: `hugo_X.XX.X_macOS-64bit.tar.gz`
- Linux: `hugo_X.XX.X_Linux-64bit.tar.gz`

解压下载的文件，将 hugo 可执行文件放置到系统PATH中：
- Windows: 可以放在`C:\Windows\System32\`或创建专用目录并添加到环境变量
- macOS/Linux: 可以放在`/usr/local/bin/`或`~/bin/`目录

安装完成后，在终端/命令提示符中运行以下命令验证，如果显示版本号，说明安装成功。
```bash
hugo version
```

如果[Hugo官网](https://gohugo.io)，英文阅读起来有困难，可以参考：
- `Hugo`中文帮助文档: https://hugo.aiaide.com
- `Hugo`中文文档: https://www.gohugo.org

# 创建目录
打开终端/命令提示符，进入你想要创建网站的目录。运行以下命令创建新站点，这会在当前目录创建名为 my-blog 的文件夹，包含 Hugo 站点的基础结构。
```bash
hugo new site my-blog
```
进入站点目录：
```bash
cd my-blog

my-blog/
├── archetypes/     # 内容模板
├── content/        # 网站内容
├── data/           # 数据文件
├── layouts/        # 布局文件
├── static/         # 静态资源
├── themes/         # 主题文件
└── config.toml     # 配置文件
```

# 安装主题
安装好`Hugo`之后，就可以根据自己的喜好选择一个主题，可以访问[Hugo Themes](https://www.gohugo.org/theme/)浏览各种主题。
每个主题下都有详细说明和示例，帮助你快速上手，这里以我的博客所选择的主题[zozo](https://github.com/varkai/hugo-theme-zozo)为例。

进入`hugo`的站点目录运行下面的命令，在站点目录下初始化 Git 仓库：
```git
git init 
```

将主题添加为 Git 子模块：
```git
git submodule add https://github.com/varkai/hugo-theme-zozo.git themes/zozo
```
或者直接克隆主题：
```git
git clone https://github.com/varkai/hugo-theme-zozo.git themes/zozo
```

主题通常会提供示例配置文件[config.toml](https://github.com/varkai/hugo-theme-zozo/blob/master/exampleSite/config.toml)。复制 zozo 主题的示例配置。
配置文件中对大部分配置都有详细的注释说明，复制该文件到站点目录下，根据自己的情况修改即可。

# 创作内容并访问
向网站添加一个新页面：
```bash
hugo new content/posts/my-first-post.md
```

Hugo 会在 content/posts 目录中创建该文件。使用编辑器打开该文件。
```md
---
title: "我的第一篇文章"
date: 2023-10-27T14:20:00+08:00
draft: true
tags: ["Hugo", "博客", "教程"]
categories: ["技术"]
---

# 欢迎阅读我的第一篇文章！

这是我的第一篇用 Hugo 搭建的博客文章。
```

在当前目录下，启动命令行窗口，执行以下命令启动Hugo本地服务器：
```bash
# -D 参数表示包含草稿（draft 状态的文章）
hugo server -D
```
在浏览器中打开`http://localhost:1313`查看你的网站。在开发过程中，Hugo 会自动检测文件变化并实时刷新浏览器，方便调试。

# 使用Github Pages部署博客
最初希望能将自己学习的知识记录下来，梳理自己的思想，于是开始搭建博客。
发布过一些其他博客网站，但是都用着不太舒服，最后选择了自己搭建，开始是自己买服务器，用[halo](https://gitee.com/halo-dev/halo)搭建，随着时间的推移，当时囊中羞涩没有再续费，最后找到一个解决办法使用[GitHub Page](https://docs.github.com/zh/pages/getting-started-with-github-pages)搭建。
直接把网站托管到`GitHub Page`上，这样一个免费、无限流量的博客系统就搭建完成了。同时通过`GitHub`你可以方便对博客文章进行管理和追踪。

如果在本地已经构建起来博客，就可以向`GitHub`推送，推送完成之后就可以通过`username.github.io`就可以访问得到你的博客了，这就完成了博客的部署。

需要注意的是，`Github Pages`需要在跟路径下创建一个`docs`文件夹，这个文件夹就是你的网站页面，我的是这样，`docs`里面保证根目录有一个`index.html`文件即可。
一般我都是在本地通过`hugo -d .\docs\`命令生成静态页面到`docs`文件夹下，然后将`docs`文件夹推送到`GitHub`。

{{<img src="/posts/annex/images/essays/搭建自己的博客-01.png" alt="搭建自己的博客">}}

一些博客其他功能参考链接：
- `Hugo`给文章添加目录: https://www.ariesme.com/posts/2019/add_toc_for_hugo
- 使用`Hugo`搭建个人博客站点: https://blog.coderzh.com/2015/08/29/hugo
- 不蒜子计数统计: https://busuanzi.ibruce.info
- 暗黑主题: https://darkmodejs.learn.uno
- 添加搜索功能: https://www.beizigen.com/post/hugo-implements-simple-on-site-search
