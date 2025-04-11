---
title: "新手必看！Keil5实战STM32从安装到运行"
date: 2025-04-11
draft: false
tags: ["嵌入式","入门"]
slug: "keil-stm32-strategy"
---



## 环境搭建
百度网盘下载地址，[Keil5破解.zip](https://pan.baidu.com/s/16chMaBUI2UnYyXKaYWmQyA?pwd=8888)。包含Keil5安装包、破解工具、STM32F4芯片库。

![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-001.png)

### 安装mdk
1. 下载安装包，解压到指定目录，双击安装包，跟随提示依次进行。<br>
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-002.png)
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-003.png)
2. 填写用户名与邮箱，可以随意填写。等待其安装完即可。<br>
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-004.png)

### 激活mdk
1. 找到桌面Keil软件鼠标右键以管理员身份运行（**一定要以管理员身份运行**）。<br>
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-005.png)
2. 关闭“Pack Installer”。<br>
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-006.png)
3. 选择File，点击License Management，复制CID。<br>
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-007.png)
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-008.png)
4. 关闭windows放火墙。<br>
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-012.png)
5. 双击“keygen.exe”文件，粘贴复制过的CID码，选择Target为ARM，点击Generate，生成激活码进行复制。<br>
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-009.png)
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-010.png)
6. 回到Keil软件页面，把复制的激活码，粘贴在New License ID Code处，点击Add LIC，就可以显示mdk的使用期限，关闭即可。<br>
    ![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-011.png)

### 安装STM32芯片包
点击Pack Installer，选择File，点击Import，导入压缩包中的`Keil.STM32F4xx_DFP.2.15.0.pck`。这里以STM32F4芯片库举例，如果需要其他可从[官网](https://www.keil.arm.com/packs/)下载离线安装。<br>
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-013.png)

![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-014.png)

![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-015.png)
   
或选择项目中需要的芯片库，点击Install，等待安装完成（下载网速较慢）。<br>
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-016.png)

### 导入项目
打开Keil，选择Project，点击Open Project。<br>
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-017.png)

选择后缀为`.uvprojx`项目文件，点击Open。<br>
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-018.png)

![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-019.png)


## 程序编译
点击魔术棒图标，选择Output，勾选Create HEX File。<br>
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-020.png)

![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-021.png)

在 Keil5.37 及以上版本中，在默认编译器中不再默认安装compiler version5。如果你的项目需要compiler version5，在编译时，需先[下载](https://pan.baidu.com/s/17OPf4e3_MvR4pDld3uf3eg?pwd=8888)然后选择version5编译版本。
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-022.png)

之后点击全局编译，等待编译完成。
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-023.png)

## 程序烧录
**程序烧录前提：程序编译完成；烧录器连接到电路板，且电路板供电。**

烧录器硬件，应与软件驱动一致，这里以ULINK2为例。<br>
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-024.png)

![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-025.png)

烧录前可进行配置，推荐选择烧录时擦除。<br>
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-026.png)

点击烧录，等待烧录完成即可。<br>
![keil5stm32入门](/posts/annex/images/essays/keil5stm32入门-027.png)

## 运行调试
点击运行按钮。

全速运行。


## 其他资料
- STM32入门资料：[https://jiangxiekeji.com](https://jiangxiekeji.com/)

