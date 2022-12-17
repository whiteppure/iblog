---
title: "IDEA常用配置"
date: 2022-12-16
draft: false
tags: ["Java"]
slug: "dev-idea"
---
## 下载
工欲善其事必先利其器,一个好的开发工具,能极大提高开发效率.

- 新UI很漂亮。IDEA 2022.2.3 官方下载地址: https://www.jetbrains.com/zh-cn/idea/download/other.html
- 激活工具 百度云下载. 链接：https://pan.baidu.com/s/19sCUTCBXvwXgEQc8vX-SYQ?pwd=gwup 提取码：gwup

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-01.jpg)

## 插件
一些实用的插件,能

### JRebel and XRebel
代码调试热部署插件,使用需要花钱; [破解教程供参考](https://blog.csdn.net/qq_38721537/article/details/117103460).

启动完成需要改动代码调试,编译(快捷键: ctrl+b)一下即完成热部署,非常方便.

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-02.jpg)

### Chinese Language Pack
中文语言包,对英文不太好的人很友好,根据使用习惯自行添加.

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-03.jpg)

### Mybatis X
现在几乎用[mybatis-plus](https://gitee.com/mhb0409/mybatis-plus) / [mybatis-plus-join](https://gitee.com/mhb0409/mybatis-plus-join) 取代了mybatis,所以该插件根据需要安装吧

功能:
1. XML和Mapper跳转
2. Mapper和XML代码生成
3. Mapper单表条件查询生成XML类似JPA

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-04.jpg)

### EasyCode
该插件可替代mybatis-generator生成代码,且支持支持导入导出模板,由于集成到IDEA中使用更加方便,配置好模板(Velocity模板引擎)即可生成. 使用文档: https://gitee.com/makejava/EasyCode/wikis/pages

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-05.jpg)

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-06.jpg)

### Translation
一款比较好用的翻译插件,可以使用快捷键 Ctrl+Shift+X 替换单词,从此妈妈再也不用担心变量方法命名的问题了.

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-07.jpg)

### Auto filling Java call arguments
自动填充调用参数,一些方法的参数非常多,可以用这个插件提高效率,根据需要下载

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-08.jpg)

### Codota AI Autocomplete for Java and JavaScript
该插件适用于 Java 和 JavaScript 的 AI 更好地完成代码,与之相关的国产有一个AiXcoder Code Completer 都挺不错的.

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-09.jpg)

### Alibaba Java Coding Guidelines
可以使你写的代码不至于太烂

> 对于Java代码规范，业界有统一的标准，不少公司对此都有一定的要求。但是即便如此，庞大的Java使用者由于经验很水平的限制，未必有规范编码的意识，而且即便经验丰富的老Java程序员也无法做到时刻将规范牢记于心。所以对于代码规范扫描工具，一经问世就广受青睐，阿里巴巴出品的Alibaba Java Coding Guidelines（阿里巴巴Java代码规约扫描，以下简称为AJCG）插件便是其中之一.

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-10.jpg)

### EasyYapi
公司用Yapi作为前后端项目文档,那么使用该插件可以快速导入到yapi中,操作详情查看文档: https://easyyapi.com/documents/index.html

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-11.jpg)

### GenerateAllSetter
一键生成一个对象的所有set,get方法,可赋默认值,支持链式调用

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-12.jpg)

### Git Commit Template
该插件最主要作用就算规范git提交信息,方便统一管理生成release note,当然也可以在项目根目录建立模板文件(`git config commit.template`)这种方式来进行规范,请根据具体使用场景来

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-13.jpg)

### GitToolBox
GitToolBox是的git增强工具,能够帮你开始查看当前代码的提交记录。比如什么时间、谁提交的。对于快速查看代码提交记录是一款不错的工具

可以当前编辑行的后面显示git记录，不想看可以取消,当然如果你觉得碍眼,可以不下载.请根据使用习惯来进行下载

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-14.jpg)

### SQL Params Setter
鼠标选中日志中打印的mybatis日志,右键选择 Sql Params Setter 自动将参数拼接到sql语句里,并复制到剪切板上.

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-15.jpg)

### Key Promoter X
当你在IDEA里面使用鼠标的时候，如果这个鼠标操作是能够用快捷键替代的，那么Key Promoter X会弹出一个提示框，告知你这个鼠标操作可以用什么快捷键替代。对于想完全使用快捷键在IDEA的，这个插件就很有用。

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-16.jpg)

### Maven Helper
Maven是个很好用的依赖管理工具，但是再好的东西也不是完美的。Maven的依赖机制会导致Jar包的冲突。举个例子，现在你的项目中，使用了两个Jar包，分别是A和B。现在A需要依赖另一个Jar包C，B也需要依赖C。但是A依赖的C的版本是1.0，B依赖的C的版本是2.0。这时候，Maven会将这1.0的C和2.0的C都下载到你的项目中，这样你的项目中就存在了不同版本的C，这时Maven会依据依赖路径最短优先原则，来决定使用哪个版本的Jar包，而另一个无用的Jar包则未被使用，这就是所谓的依赖冲突。

在大多数时候，依赖冲突可能并不会对系统造成什么异常，因为Maven始终选择了一个Jar包来使用。但是，不排除在某些特定条件下，会出现类似找不到类的异常，所以，只要存在依赖冲突，在我看来，最好还是解决掉，不要给系统留下隐患。

解决依赖冲突的方法，就是使用Maven提供的<exclusion>标签，<exclusion>标签需要放在<exclusions>标签内部。

Maven Helper插件可以帮助我们分析依赖关系，从而解决依赖冲突。

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-17.jpg)

### Rainbow Brackets
不同括号不同颜色,能增加代码可读性

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-18.jpg)

### GsonFormatPlus
能将json转java对象,按住alt + s然后进行配置转换

![idea常用配置](/iblog/posts/annex/images/essays/idea常用配置-19.jpg)

