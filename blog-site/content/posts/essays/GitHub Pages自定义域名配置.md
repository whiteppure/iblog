---
title: "GitHub Pages自定义域名配置"
date: 2025-02-13
draft: false
tags: ["随笔","GitHub"]
slug: "github-domain"
---


### 域名注册
**国内**申请需要**进行实名认证和备案**。国内常见域名服务商：[阿里](https://wanwang.aliyun.com/)、[华为](https://www.huaweicloud.com/product/domain.html)、[腾讯](https://cloud.tencent.com/act/pro/domain-sales)。国际平台（免备案）：Namecheap、GoDaddy。这里以阿里为例，购买域名，如下图：
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-01.png)

**此处需要进行实名认证，域名备案，提交备案材料**。
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-02.png)

备案通过之后，在[域名控制台](https://dc.console.aliyun.com/next/index)可查看刚刚申请的域名，如下图：
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-03.png)

### 域名解析
在刚注册的域名列表后点击**解析**。
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-04.png)

点击"添加记录"，在此处选择"CNAME"，配置刚申请的域名和GitHub Pages提供的域名，将其做映射。
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-05.png)

配置完成之后如下图：（配置一条记录即可，此处我配置两条记录是有其他用途）。
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-06.png)

### GitHub 仓库配置
在自己GitHub主界面点击"Settings"。
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-07.png)

找到"Pages"，点击"Pages"。
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-08.png)

在此处填入之前注册备案过的域名，并勾选"Enforce HTTPS "。
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-09.png)

**配置域名后会自动在Pages的根路径生成一个“CNAME”文件，有这个文件便能访问。**
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-10.png)

等待片刻就能访问备案过的[域名](https://blog.lijizhi.website/)了。
![在这里插入图片描述](/posts/annex/images/essays/GitHubPages自定义域名配置-11.png)
