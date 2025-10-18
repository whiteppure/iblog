---
title: "Hugo和Github Pages搭建博客"
date: 2024-04-15
draft: false
tags: ["随笔","GitHub"]
slug: "github-build-blog"
---

## 搭建博客框架及对比
在众多的博客框架中，`Hugo`、`Jekyll`和`Hexo`因其出色的性能和易用性而备受推崇。

| 特点       | Hugo                                     | Jekyll                                          | Hexo                                         |
|------------|------------------------------------------|-------------------------------------------------|----------------------------------------------|
| **速度**   | 极高，适合频繁更新内容的用户               | 中等，适合定期更新内容的用户                     | 较高，满足大部分用户需求                     |
| **易用性** | 高，简洁界面与 Markdown 支持，学习成本低  | 中等，需一定的 Ruby 语言基础，有一定学习曲线     | 高，适合熟悉 JavaScript 的用户               |
| **社区**   | 中等规模，足以应对常见问题                 | 庞大社区，丰富的插件生态                        | 活跃社区，插件和主题持续更新                 |
| **语言**   | Go                                       | Ruby                                             | Node.js                                      |
| **部署**   | 简单，支持多种平台                       | 简单，与 GitHub Pages 深度集成                   | 简单，适合 Node.js 环境                     |
| **插件/主题** | 丰富，满足基本需求                     | 非常丰富，生态成熟                              | 丰富，适合个性化需求                         |
| **适用场景** | 内容频繁更新、追求极速生成的场景         | 与 GitHub Pages 搭配、依赖成熟插件生态的场景     | 熟悉 JavaScript、需要灵活定制的场景          |

## 使用Hugo搭建博客
这里选择了`Hugo`作为我的博客框架。它的极速和简约风格符合我的需求，让我能够专注于内容的创作。虽然`Jekyll`和`Hexo`也有各自的优点，但`Hugo`更符合我的个人喜好。

`Hugo`是一个使用`Go`语言编写的快速、简单和灵活的静态网站生成器。
它使用起来非常简单，相对于`Jekyll`复杂的安装设置来说，`Hugo`仅需要一个二进制文件(`hugo.exe`)即可轻松用于本地调试和生成静态页面。
`Hugo`可以将你写好的`MarkDown`格式的文章自动转换为静态的网页。
除此之外，`Hugo`内置`web`服务器，可以在修改`MarkDown`文章之后切换到浏览器，页面会检测到更新并且自动刷新，呈现出最终效果，能极大的提高博客书写效率。

要开始使用`Hugo`，你需要先安装它。可以访问[Hugo的官方网站](https://gohugo.io/getting-started/quick-start/)下载对应操作系统的版本，并按照指南进行安装。安装完成后，你就可以创建你的第一个博客了。

`Hugo`的安装方式有两种，一种是直接下载编译好的`Hugo`二进制文件。另一种方式是获取`Hugo`的源码，自己编译。如果只是使用`Hugo`推荐第一种方式[下载地址](https://github.com/gohugoio/hugo/releases)。

如果[Hugo官网](https://gohugo.io)，英文阅读起来有困难，可以参考：
- `Hugo`中文帮助文档: https://hugo.aiaide.com
- `Hugo`中文文档: https://www.gohugo.org

安装好`Hugo`之后，就可以根据自己的喜好选择一个主题。可以访问[Hugo Themes](https://www.gohugo.org/theme/)浏览各种主题。
每个主题下都有详细说明和示例，帮助你快速上手，这里以我的博客所选择的主题[zozo](https://github.com/varkai/hugo-theme-zozo)为例。
1. 进入`hugo`的站点目录运行下面的命令
    ```git
    git clone https://github.com/varkai/hugo-theme-zozo themes/zozo
    ```
2. 进行博客配置，`config.toml`是网站的配置文件，主题提供了一个示例配置文件[config.toml](https://github.com/varkai/hugo-theme-zozo/blob/master/exampleSite/config.toml)。配置文件中对大部分配置都有详细的注释说明，复制该文件到站点目录下，根据自己的情况修改即可；
3. 在命令行窗口，使用命令`hugo server`运行博客，在浏览器地址栏输入`localhost:1313`来访问站点；

## 使用Github Pages部署博客
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
