---
title: "IDEA常用插件及使用技巧"
date: 2022-12-16
draft: false
tags: ["随笔"]
slug: "dev-idea"
---


## 下载
工欲善其事必先利其器，一个好的开发工具，能极大提高开发效率。IDEA新UI很漂亮，IDEA 官方下载地址： https://www.jetbrains.com/zh-cn/idea/download/other.html 。
下载完之后激活，激活工具百度云下载，链接： https://pan.baidu.com/s/1bmktlKMWC6nIqgJNSUYx_A?pwd=8888 。DIEA版本为2023.3.4。

![idea常用配置](/posts/annex/images/essays/idea常用配置-01.jpg)

## 常用插件
开发中一些实用的插件，能提高开发速度。

### JRebel and XRebel
代码调试热部署插件，付费插件，[破解教程供参考](https://blog.csdn.net/lamedunk/article/details/124780925)。
当需要改动代码时，不用再重启项目，编译(快捷键，ctrl+b)一下即可完成热部署，非常方便。

![idea常用配置](/posts/annex/images/essays/idea常用配置-02.jpg)

### Chinese Language Pack
中文语言包，对英文不太好的人很友好，根据使用习惯自行添加。

![idea常用配置](/posts/annex/images/essays/idea常用配置-03.jpg)

### Mybatis X
现在几乎用`MybatisPlus`取代了`Mybatis`，所以该插件根据需要安装吧，插件功能：
1. `XML`和`Mapper`跳转；
2. `Mapper`和`XML`代码生成；
3. `Mapper`单表条件查询生成`XML`类似`JPA`；

![idea常用配置](/posts/annex/images/essays/idea常用配置-04.jpg)

### EasyCode
该插件可替代`mybatis generator`，根据模板生成代码，且支持导入导出模板。由于集成到IDEA中所以使用更加方便，配置好模板(Velocity模板引擎)即可生成。参考[使用文档](https://gitee.com/makejava/EasyCode/wikis/pages)。

![idea常用配置](/posts/annex/images/essays/idea常用配置-05.jpg)

![idea常用配置](/posts/annex/images/essays/idea常用配置-06.jpg)

### Translation
一款比较好用的翻译插件，可以使用快捷键`Ctrl+Shift+X`替换单词，从此妈妈再也不用担心变量方法命名的问题了。

![idea常用配置](/posts/annex/images/essays/idea常用配置-07.jpg)

### Auto filling Java call arguments
自动填充调用参数，一些方法的参数非常多，可以用这个插件提高效率，根据需要下载。

![idea常用配置](/posts/annex/images/essays/idea常用配置-08.jpg)

### Codota AI Autocomplete for Java and JavaScript
该插件适用于Java和JavaScript的AI更好地完成代码,与之相关的国产有一个`AiXcoder Code Completer`都挺不错的。

![idea常用配置](/posts/annex/images/essays/idea常用配置-09.jpg)

### Alibaba Java Coding Guidelines
该插件是阿里的一套规范，可以使你写的代码不至于太烂。

对于Java代码规范，业界有统一的标准，不少公司对此都有一定的要求。但是即便如此，庞大的Java使用者由于经验很水平的限制，未必有规范编码的意识，而且即便经验丰富的老Java程序员也无法做到时刻将规范牢记于心。
所以对于代码规范扫描工具，一经问世就广受青睐，阿里巴巴出品的Alibaba Java Coding Guidelines（阿里巴巴Java代码规约扫描，以下简称为AJCG）插件便是其中之。

![idea常用配置](/posts/annex/images/essays/idea常用配置-10.jpg)

### EasyYapi
公司用`Yapi`作为前后端项目文档，那么使用该插件可以快速导入到`Yapi`中，操作详情参考[官方文档](https://easyyapi.com/documents/index.html)。

![idea常用配置](/posts/annex/images/essays/idea常用配置-11.jpg)

### GenerateAllSetter
一键生成一个对象的所有`set` `get`方法，可赋默认值，支持链式调用。

![idea常用配置](/posts/annex/images/essays/idea常用配置-12.jpg)

### Git Commit Template
该插件的作用就是规范`Git`提交信息，方便统一管理生成`release note`，当然也可以在项目根目录建立模板文件(`git config commit.template`)这种方式来进行规范，请根据具体使用场景来。

![idea常用配置](/posts/annex/images/essays/idea常用配置-13.jpg)

### GitToolBox
`GitToolBox`是的`Git`增强工具，能够帮你开始查看当前代码的提交记录。比如什么时间、谁提交的，对于快速查看代码提交记录是一款不错的工具。
可以当前编辑行的后面显示`Git`记录，不想看可以取消，当然如果你觉得碍眼，可以不下载。根据使用习惯来进行下载。

![idea常用配置](/posts/annex/images/essays/idea常用配置-14.jpg)

### SQL Params Setter
鼠标选中日志中打印的`Mybatis` `SQL`日志，右键选择`Sql Params Setter`自动将参数拼接到`SQL`语句里，并复制到剪切板上，对于调试程序来说简直不要太方便。

![idea常用配置](/posts/annex/images/essays/idea常用配置-15.jpg)

### Key Promoter X
当你在IDEA里面使用鼠标的时候，如果这个鼠标操作是能够用快捷键替代的，那么`Key Promoter X`会弹出一个提示框，告知你这个鼠标操作可以用什么快捷键替代。
对于想完全使用快捷键在IDEA的，这个插件就很有用。

![idea常用配置](/posts/annex/images/essays/idea常用配置-16.jpg)

### Maven Helper
Maven是个很好用的依赖管理工具，但是再好的东西也不是完美的，Maven的依赖机制会导致`jar`包的冲突。
举个例子，现在你的项目中，使用了两个`jar`包，分别是A和B。现在A需要依赖另一个`jar`包C，B也需要依赖C。但是A依赖的C的版本是1.0，B依赖的C的版本是2.0。
这时候，Maven会将这1.0的C和2.0的C都下载到你的项目中，这样你的项目中就存在了不同版本的C，这时Maven会依据依赖路径最短优先原则，来决定使用哪个版本的`jar`包，而另一个无用的`jar`包则未被使用，这就是所谓的依赖冲突。

在大多数时候，依赖冲突可能并不会对系统造成什么异常，因为Maven始终选择了一个`jar`包来使用。但是不排除在某些特定条件下，会出现类似找不到类的异常，所以只要存在依赖冲突，在我看来最好还是解决掉，不要给程序留下隐患。
解决依赖冲突的方法，就是使用Maven提供的`<exclusion>`标签，`<exclusion>`标签需要放在`<exclusions>`标签内部使用。

`Maven Helper`插件可以帮助我们分析依赖关系，从而解决依赖冲突。

![idea常用配置](/posts/annex/images/essays/idea常用配置-17.jpg)

### Rainbow Brackets
不同括号不同颜色，能增加代码可读性，挺方便的。

![idea常用配置](/posts/annex/images/essays/idea常用配置-18.jpg)

### GsonFormatPlus
能将`JSON`数据转Java对象，按住`alt+s`然后进行配置转换。

![idea常用配置](/posts/annex/images/essays/idea常用配置-19.jpg)

## 配置及技巧

### 自定义模板
配置一些常用代码字母缩写，在输入简写时可以出现你预定义的固定模式的代码，使得开发效率大大提高，同时也可以增加个性化。例如，输入`sout`会出现`System.out.println();`。

![idea常用配置](/posts/annex/images/essays/idea常用配置-20.jpg)

### IDEA快捷键及设置
> 本人IDEA设置(windows版)供参考 [下载](/posts/annex/zip/idea-settings.zip)

IDEA Windows版本常用快捷键如下：

| 快捷键            | 介绍             |
|----------------|----------------|
| Ctrl+Shift+V   | 粘贴板列表          |
| Ctrl+G         | 转到行&列          |
| Ctrl+F         | 在当前文件进行文本查找    |
| Ctrl+Y         | 删除光标所在行或删除选中的行 |
| Shift+Shift    | 随处搜索,常用查找接口    |
| Ctrl+Shift+F   | 按照文本的内容查找,行内搜索 |
| Ctrl+D         | 复制当前行          |
| Alt+Enter      | 代码提示补全         |
| Ctrl+Tab       | 切换文件           |
| Alt+Insert     | 代码自动生成         |
| Ctrl+Shift+L   | 格式化代码          |
| Ctrl+Shift+R   | 全局重命名          |
| Alt+鼠标左键选中     | 修改多行           |
| Ctrl+鼠标左键点击    | 快速找到成员变量的出处    |
| Ctrl+B         | 编译(配合热部署插件使用)  |
| Ctrl+Shift+F10 | 运行快捷键          |

除此之外，根据自己的使用习惯，还可以用`Key Promoter X`插件来配置你自己的快捷键。

在这个地方可以自己设置快捷键，如果你之前用的是Eclipse，那么可以使用Eclipse映射的快捷键，大大降低了学习成本。
![idea常用配置](/posts/annex/images/essays/idea常用配置-21.jpg)

### 快速请求接口
一般写完接口，我们会使用`Postman`等其他测试接口工具来发起请求，看符不符合自己的预期。这里不是在介绍`Postman`，而是介绍IDEA中的一个插件，它也能做到`Postman`的功能，而且由于集成到了IDEA中使开发效率大大增加。

`HTTP Client`是IDEA自带的一款简洁轻量级的接口调用插件，通过它我们能在IDEA上开发、调试、测试`Restful Web`服务，有了它`Postman`可以扔掉了。

![idea常用配置](/posts/annex/images/essays/idea常用配置-23.jpg)
![idea常用配置](/posts/annex/images/essays/idea常用配置-22.jpg)
![idea常用配置](/posts/annex/images/essays/idea常用配置-24.jpg)

### Maven骨架
配置Maven项目骨架，能帮助我们快速开发。自定义项目模板，参考[教程](https://blog.csdn.net/qq_42986107/article/details/83421811)，Maven骨架[下载地址](https://repository.apache.org/content/repositories/releases/archetype-catalog.xml)。
> Maven骨架简单的来说就是一种模型 (结构)，Maven根据我们的不同的项目和需求，提供了不同的模型，这样就不需要我们自己建模型了。举个简单的例子：就比如我们要做一套普通的楼房，我们使用Maven就不需要我们自己打地基，直接把使用Maven打好的地基就可以了。同时种类的楼房(写字楼，商场，套房，别墅) 就有不同的地基，因此，Maven就有很多种模型。

简单来说，Maven骨架就是生成一个基础的项目，不用每次开发时都要在其他项目中进行复制代码，使用Maven骨架可以直接生成项目，然后基于这个项目进行开发，从而加速开发。
配置`Maven`骨架。

![idea常用配置](/posts/annex/images/essays/idea常用配置-26.jpg)

设置自动导入包，清除无用的包，使代码更加整洁。

![idea常用配置](/posts/annex/images/essays/idea常用配置-25.jpg)
