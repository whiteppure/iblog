---
title: "如何快速打开Github"
date: 2024-03-21
draft: false
tags: ["随笔"]
slug: "accelerate-access-github"
---


为什么打开`Github`速度很慢、很卡？甚至访问不了，原因是中间有个域名通过DNS解析的过程，将域名解析为对应的IP地址，卡的原因主要是时间都花在了DNS解析上。

我们在浏览器输入`GitHub`的网址时，会向DNS服务器发送一个请求，获取到`GitHub`网站所在的服务器IP地址，从而进行访问。
如果DNS告诉了你错误的地址、或者请求被拦截、再或者DNS挂了，都会导致你无法访问网站。

所以懂得了这个原理，可以通过修改`hosts`文件，解决`GitHub`访问速度慢的问题，推荐[GitHub520](https://github.com/521xueweihan/GitHub520)。
- Windows 系统中的文件路径：`C:\WINDOWS\system32\drivers\etc`；
- Linux 系统中的文件路径：`/etc/hosts`；

`GitHub520`，让你“爱”上`GitHub`，它能解决访问时图裂、加载慢的问题。主要是通过配置`hosts`文件，将`GitHub`的域名解析到指定的IP地址上，从而解决访问速度慢的问题。
`Github520`，截至这篇文章发布之前，`host`文件内容：
```text
# GitHub520 Host Start
140.82.112.25                 alive.github.com
140.82.112.5                  api.github.com
185.199.111.153               assets-cdn.github.com
185.199.111.133               avatars.githubusercontent.com
185.199.111.133               avatars0.githubusercontent.com
185.199.111.133               avatars1.githubusercontent.com
185.199.111.133               avatars2.githubusercontent.com
185.199.111.133               avatars3.githubusercontent.com
185.199.111.133               avatars4.githubusercontent.com
185.199.111.133               avatars5.githubusercontent.com
185.199.111.133               camo.githubusercontent.com
140.82.113.22                 central.github.com
185.199.111.133               cloud.githubusercontent.com
140.82.113.10                 codeload.github.com
140.82.113.21                 collector.github.com
185.199.111.133               desktop.githubusercontent.com
185.199.111.133               favicons.githubusercontent.com
140.82.113.4                  gist.github.com
52.217.64.44                  github-cloud.s3.amazonaws.com
52.217.196.73                 github-com.s3.amazonaws.com
16.182.69.25                  github-production-release-asset-2e65be.s3.amazonaws.com
16.182.66.193                 github-production-repository-file-5c1aeb.s3.amazonaws.com
52.216.38.233                 github-production-user-asset-6210df.s3.amazonaws.com
192.0.66.2                    github.blog
140.82.114.3                  github.com
140.82.114.17                 github.community
185.199.109.154               github.githubassets.com
151.101.1.194                 github.global.ssl.fastly.net
185.199.111.153               github.io
185.199.111.133               github.map.fastly.net
185.199.111.153               githubstatus.com
140.82.112.26                 live.github.com
185.199.111.133               media.githubusercontent.com
185.199.111.133               objects.githubusercontent.com
13.107.42.16                  pipelines.actions.githubusercontent.com
185.199.111.133               raw.githubusercontent.com
185.199.111.133               user-images.githubusercontent.com
13.107.253.40                 vscode.dev
140.82.113.21                 education.github.com
```
有时候尝试过手动修改`host`文件来解决网站的访问的问题不好用，这里推荐一个备用方案[FastGithub](https://github.com/WangGithubUser/FastGitHub)。
它是`GitHub`加速神器，解决`GitHub`打不开、用户头像无法加载等问题，我现在正在用，挺不错的。在每次访问`GitHub`之前记得要先保证`FastGithub`在运行的状态，`FastGitHub`会自动更改你的DNS。

如果上述方法还是都不行，我们可以换一种思路，使用镜像访问`Github`，推荐几个网站：
- [https://gitclone.com](https://gitclone.com)
- [https://help.kkgithub.com](https://help.kkgithub.com)

最后如果还是不能访问`GitHub`，这个一定能解决，我们可以尝试使用VPN，下面是一些推荐的网站：
- [https://sdkdns.github.io](https://sdkdns.github.io)
- [https://www.naiun.top/#/login](https://www.naiun.top/#/login)
