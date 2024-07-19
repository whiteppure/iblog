---
title: "Java程序常见故障排查命令及工具"
date: 2021-09-08
draft: false
tags: ["编程指南","Java"]
slug: "java-eye-beam"
---


## 故障排查命令
收录Linux常用命令，以下命令来自[https://www.bilibili.com/video/BV14A411378a](https://www.bilibili.com/video/BV14A411378a)

### 关机/重启/注销

| 常用命令          | 作用                     |
| ----------------- | ------------------------ |
| shutdown -h now   | 即刻关机                 |
| shutdown -h 10    | 10分钟后关机             |
| shutdown -h 11:00 | 11：00关机               |
| shutdown -h +10   | 预定时间关机（10分钟后） |
| shutdown -c       | 取消指定时间关机         |
| shutdown -r now   | 重启                     |
| shutdown -r 10    | 10分钟之后重启           |
| shutdown -r 11:00 | 定时重启                 |
| reboot            | 重启                     |
| init 6            | 重启                     |
| init 0            | ⽴刻关机                 |
| telinit 0         | 关机                     |
| poweroff          | ⽴刻关机                 |
| halt              | 关机                     |
| sync              | buff数据同步到磁盘       |
| logout            | 退出登录Shell            |

### 系统信息和性能查看

| 常用命令                    | 作用                               |
| --------------------------- | ---------------------------------- |
| uname -a                    | 查看内核/OS/CPU信息                |
| uname -r                    | 查看内核版本                       |
| uname -m                    | 查看处理器架构                     |
| arch                        | 查看处理器架构                     |
| hostname                    | 查看计算机名                       |
| who                         | 显示当前登录系统的⽤户             |
| who am i                    | 显示登录时的⽤户名                 |
| whoami                      | 显示当前⽤户名                     |
| cat /proc/version           | 查看linux版本信息                  |
| cat /proc/cpuinfo           | 查看CPU信息                        |
| cat /proc/interrupts        | 查看中断                           |
| cat /proc/loadavg           | 查看系统负载                       |
| uptime                      | 查看系统运⾏时间、⽤户数、负载     |
| env                         | 查看系统的环境变量                 |
| lsusb -tv                   | 查看系统USB设备信息                |
| lspci -tv                   | 查看系统PCI设备信息                |
| lsmod                       | 查看已加载的系统模块               |
| grep MemTotal /proc/meminfo | 查看内存总量                       |
| grep MemFree /proc/meminfo  | 查看空闲内存量                     |
| free -m                     | 查看内存⽤量和交换区⽤量           |
| date                        | 显示系统⽇期时间                   |
| cal 2021                    | 显示2021⽇历表                     |
| top                         | 动态显示cpu/内存/进程等情况        |
| vmstat 1 20                 | 每1秒采⼀次系统状态，采20次        |
| iostat                      | 查看io读写/cpu使⽤情况             |
| 查看io读写/cpu使⽤情况      | 查询cpu使⽤情况（1秒⼀次，共10次） |
| sar -d 1 10                 | 查询磁盘性能                       |

### 磁盘和分区

| 常用命令                            | 作用                           |
| ----------------------------------- | ------------------------------ |
| fdisk -l                            | 查看所有磁盘分区               |
| swapon -s                           | 查看所有交换分区               |
| df -h                               | 查看磁盘使⽤情况及挂载点       |
| df -hl                              | 同上                           |
| du -sh /dir                         | 查看指定某个⽬录的⼤⼩         |
| du -sk * \| sort -rn                | 从⾼到低依次显示⽂件和⽬录⼤⼩ |
| mount /dev/hda2 /mnt/hda2           | 挂载hda2盘                     |
| mount -t ntfs /dev/sdc1 /mnt/usbhd1 | 指定⽂件系统类型挂载（如ntfs） |
| mount -o loop xxx.iso /mnt/cdrom    | 挂 载 iso ⽂ 件                |
| umount -v /dev/sda1                 | 通过设备名卸载                 |
| umount -v /mnt/mymnt                | 通过挂载点卸载                 |
| fuser -km /mnt/hda1                 | 强制卸载(慎⽤)                 |

### ⽤户和⽤户组

| 常用命令                                              | 作用                                           |
| ----------------------------------------------------- | ---------------------------------------------- |
| useradd codesheep                                     | 创建⽤户                                       |
| userdel -r codesheep                                  | 删除⽤户                                       |
| usermod -g group_name user_name                       | 修改⽤户的组                                   |
| usermod -aG group_name user_name                      | 将⽤户添加到组                                 |
| usermod -s /bin/ksh -d /home/codepig –g dev codesheep | 修改⽤户codesheep的登录Shell、主⽬录以及⽤户组 |
| groups test                                           | 查看test⽤户所在的组                           |
| groupadd group_name                                   | 创建⽤户组                                     |
| groupdel group_name                                   | 删除⽤户组                                     |
| groupmod -n new_name old_name                         | 重命名⽤户组                                   |
| su - user_name                                        | su - user_name                                 |
| passwd                                                | 修改⼝令                                       |
| passwd codesheep                                      | 修改某⽤户的⼝令                               |
| w                                                     | 查看活动⽤户                                   |
| id codesheep                                          | 查看指定⽤户codesheep信息                      |
| last                                                  | 查看⽤户登录⽇志                               |
| crontab -l                                            | 查看当前⽤户的计划任务                         |
| cut -d: -f1 /etc/passwd                               | 查看系统所有⽤户                               |
| cut -d: -f1 /etc/group                                | 查看系统所有组                                 |

### ⽹络和进程管理

| 常用命令                                                     | 作用                                 |
| ------------------------------------------------------------ | ------------------------------------ |
| ifconfig                                                     | 查看⽹络接⼝属性                     |
| ifconfig eth0                                                | 查看某⽹卡的配置                     |
| route -n                                                     | 查看路由表                           |
| netstat -lntp                                                | 查看所有监听端⼝                     |
| netstat -antp                                                | 查看已经建⽴的TCP连接                |
| netstat -lutp                                                | 查看TCP/UDP的状态信息                |
| ifup eth0                                                    | 启⽤eth0⽹络设备                     |
| ifdown eth0                                                  | 禁⽤eth0⽹络设备                     |
| iptables -L                                                  | 查看iptables规则                     |
| ifconfig eth0 192.168.1.1 netmask 255.255.255.0              | 配置ip地址                           |
| dhclient eth0                                                | 以dhcp模式启⽤eth0                   |
| route add -net 0/0 gw Gateway_IP                             | 配置默认⽹关                         |
| route add -net 192.168.0.0 netmask 255.255.0.0 gw 192.168.1.1 | 配置静态路由到达⽹络'192.168.0.0/16' |
| route del 0/0 gw Gateway_IP                                  | 删除静态路由                         |
| hostname                                                     | 查看主机名                           |
| host [www.baidu.com](http://www.baidu.com)                   | 解析主机名                           |
| nslookup [www.baidu.com](http://www.baidu.com)               | 查询DNS记录，查看域名解析是否正常    |
| ps -ef                                                       | 查看所有进程                         |
| ps -ef \| grep codesheep                                     | 过滤出你需要的进程                   |
| kill -s name                                                 | kill指定名称的进程                   |
| kill -s pid                                                  | kill指定pid的进程                    |
| top                                                          | 实时显示进程状态                     |
| vmstat 1 20                                                  | 每1秒采⼀次系统状态，采20次          |
| iostat                                                       | iostat                               |
| sar -u 1 10                                                  | 查询cpu使⽤情况（1秒⼀次，共10次）   |
| sar -d 1 10                                                  | 查询磁盘性能                         |

### 常⻅系统服务命令

| 常用命令                   | 作用         |
| -------------------------- | ------------ |
| chkconfig --list           | 列出系统服务 |
| service <服务名> status    | 查看某个服务 |
| service <服务名> start     | 启动某个服务 |
| service <服务名> stop      | 终⽌某个服务 |
| service <服务名> restart   | 重启某个服务 |
| systemctl status <服务名>  | 查看某个服务 |
| systemctl start <服务名>   | 启动某个服务 |
| systemctl stop <服务名>    | 终⽌某个服务 |
| systemctl restart <服务名> | 重启某个服务 |
| systemctl enable <服务名>  | 关闭⾃启动   |
| systemctl disable <服务名> | 关闭⾃启动   |

### ⽂件和⽬录操作

| 常用命令                 | 作用                                                         |
| ------------------------ | ------------------------------------------------------------ |
| cd <⽬录名>              | 进⼊某个⽬录                                                 |
| cd ..                    | 回上级⽬录                                                   |
| cd ../..                 | 回上两级⽬录                                                 |
| cd                       | 进个⼈主⽬录                                                 |
| cd -                     | 回上⼀步所在⽬录                                             |
| pwd                      | 显示当前路径                                                 |
| ls                       | 查看⽂件⽬录列表                                             |
| ls -F                    | 查看⽬录中内容（显示是⽂件还是⽬录）                         |
| ls -l                    | 查看⽂件和⽬录的详情列表                                     |
| ls -a                    | 查看隐藏⽂件                                                 |
| ls -lh                   | 查看⽂件和⽬录的详情列表（增强⽂件⼤⼩易读性）               |
| ls -lSr                  | 查看⽂件和⽬录列表（以⽂件⼤⼩升序查看）                     |
| tree                     | 查看⽂件和⽬录的树形结构                                     |
| mkdir <⽬录名>           | 创建⽬录                                                     |
| mkdir dir1 dir2          | 同时创建两个⽬录                                             |
| mkdir -p /tmp/dir1/dir2  | 创建⽬录树                                                   |
| rm -f file1              | 删除'file1'⽂件                                              |
| rmdir dir1               | 删除'dir1'⽬录                                               |
| rm -rf dir1              | 删除'dir1'⽬录和其内容                                       |
| rm -rf dir1 dir2         | 同时删除两个⽬录及其内容                                     |
| mv old_dir new_dir       | 重命名/移动⽬录                                              |
| cp file1 file2           | 复制⽂件                                                     |
| cp dir/* .               | 复制某⽬录下的所有⽂件⾄当前⽬录                             |
| cp -a dir1 dir2          | 复制⽬录                                                     |
| cp -a /tmp/dir1 .        | 复制⼀个⽬录⾄当前⽬录                                       |
| ln -s file1 link1        | 创建指向⽂件/⽬录的软链接                                    |
| ln file1 lnk1            | 创建指向⽂件/⽬录的物理链接                                  |
| find / -name file1       | 从跟⽬录开始搜索⽂件/⽬录                                    |
| find / -user user1       | 搜索⽤户user1的⽂件/⽬录                                     |
| find /dir -name *.bin    | 在⽬录/dir中搜带有.bin后缀的⽂件                             |
| locate <关键词>          | 快速定位⽂件                                                 |
| locate *.mp4             | 寻找.mp4结尾的⽂件                                           |
| whereis <关键词>         | 显示某⼆进制⽂件/可执⾏⽂件的路径                            |
| which <关键词>           | 查找系统⽬录下某的⼆进制⽂件                                 |
| chmod ugo+rwx dir1       | 设置⽬录所有者(u)、群组(g)及其他⼈(o)的读（r）写(w)执⾏(x)权限 |
| chmod go-rwx dir1        | 移除群组(g)与其他⼈(o)对⽬录的读写执⾏权限                   |
| chown user1 file1        | 改变⽂件的所有者属性                                         |
| chown -R user1 dir1      | 改变⽬录的所有者属性                                         |
| chgrp group1 file1       | 改变⽂件群组                                                 |
| chown user1:group1 file1 | 改变⽂件的所有⼈和群组                                       |

### ⽂件查看和处理

| 常用命令                      | 作用                                    |
| ----------------------------- | --------------------------------------- |
| cat file1                     | 查看⽂件内容                            |
| cat -n file1                  | 查看内容并标示⾏数                      |
| tac file1                     | 从最后⼀⾏开始反看⽂件内容              |
| more file1                    | more file1                              |
| less file1                    | 类似more命令，但允许反向操作            |
| head -2 file1                 | 查看⽂件前两⾏                          |
| tail -2 file1                 | 查看⽂件后两⾏                          |
| tail -f /log/msg              | 实时查看添加到⽂件中的内容              |
| grep codesheep hello.txt      | 在⽂件hello.txt中查找关键词codesheep    |
| grep ^sheep hello.txt         | 在⽂件hello.txt中查找以sheep开头的内容  |
| grep [0-9] hello.txt          | 选择hello.txt⽂件中所有包含数字的⾏     |
| sed 's/s1/s2/g' hello.txt     | 将hello.txt⽂件中的s1替换成s2           |
| sed '/^$/d' hello.txt         | 从hello.txt⽂件中删除所有空⽩⾏         |
| sed '/ *#/d; /^$/d' hello.txt | 从hello.txt⽂件中删除所有注释和空⽩⾏   |
| sed -e '1d' hello.txt         | 从⽂件hello.txt 中排除第⼀⾏            |
| sed -n '/s1/p' hello.txt      | 查看只包含关键词"s1"的⾏                |
| sed -e 's/ *$//' hello.txt    | 删除每⼀⾏最后的空⽩字符                |
| sed -e 's/s1//g' hello.txt    | 从⽂档中只删除词汇s1并保留剩余全部      |
| sed -n '1,5p;5q' hello.txt    | 查看从第⼀⾏到第5⾏内容                 |
| sed -n '5p;5q' hello.txt      | 查看第5⾏                               |
| paste file1 file2             | 合并两个⽂件或两栏的内容                |
| paste -d '+' file1 file2      | 合并两个⽂件或两栏的内容，中间⽤"+"区分 |
| sort file1 file2              | 排序两个⽂件的内容                      |
| comm -1 file1 file2           | ⽐较两个⽂件的内容(去除'file1'所含内容) |
| comm -2 file1 file2           | ⽐较两个⽂件的内容(去除'file2'所含内容  |
| comm -3 file1 file2           | ⽐较两个⽂件的内容(去除两⽂件共有部分)  |

### 打包和解压

| 常用命令                          | 作用                     |
| --------------------------------- | ------------------------ |
| zip xxx.zip file                  | 压缩⾄zip包              |
| zip -r xxx.zip file1 file2 dir1   | 将多个⽂件+⽬录压成zip包 |
| unzip xxx.zip                     | 解压zip包                |
| tar -cvf xxx.tar file             | 创建⾮压缩tar包          |
| tar -cvf xxx.tar file1 file2 dir1 | 将多个⽂件+⽬录打tar包   |
| tar -tf xxx.tar                   | 查看tar包的内容          |
| tar -xvf xxx.tar                  | 解压tar包                |
| tar -xvf xxx.tar -C /dir          | 将tar包解压⾄指定⽬录    |
| tar -cvfj xxx.tar.bz2 dir         | 创建bz2压缩包            |
| tar -jxvf xxx.tar.bz2             | 解压bz2压缩包            |
| tar -cvfz xxx.tar.gz dir          | 创建gzip压缩包           |
| tar -zxvf xxx.tar.gz              | 解压gzip压缩包           |
| bunzip2 xxx.bz2                   | 解压bz2压缩包            |
| bzip2 filename                    | 压缩⽂件                 |
| gunzip xxx.gz                     | 解压gzip压缩包           |
| gzip filename                     | 压缩⽂件                 |
| gzip -9 filename                  | 最⼤程度压缩             |

### RPM包管理命令

| 常用命令                  | 作用                          |
| ------------------------- | ----------------------------- |
| rpm -qa                   | 查看已安装的rpm包             |
| rpm -q pkg_name           | 查询某个rpm包                 |
| rpm -q --whatprovides xxx | 显示xxx功能是由哪个包提供的   |
| rpm -q --whatrequires xxx | 显示xxx功能被哪个程序包依赖的 |
| rpm -q --changelog xxx    | 显示xxx包的更改记录           |
| rpm -qi pkg_name          | 查看⼀个包的详细信息          |
| rpm -qd pkg_name          | 查询⼀个包所提供的⽂档        |
| rpm -qc pkg_name          | 查看已安装rpm包提供的配置⽂件 |
| rpm -ql pkg_name          | 查看⼀个包安装了哪些⽂件      |
| rpm -qf filename          | 查看某个⽂件属于哪个包        |
| rpm -qR pkg_name          | 查询包的依赖关系              |
| rpm -ivh xxx.rpm          | 安装rpm包                     |
| rpm -ivh --test xxx.rpm   | 测试安装rpm包                 |
| rpm -ivh --nodeps xxx.rpm | 安装rpm包时忽略依赖关系       |
| rpm -e xxx                | 卸载程序包                    |
| rpm -Fvh pkg_name         | 升级确定已安装的rpm包         |
| rpm -Uvh pkg_name         | 升级rpm包(若未安装则会安装)   |
| rpm -V pkg_name           | RPM包详细信息校验             |

### YUM包管理命令

| 常用命令                            | 作用                 |
| ----------------------------------- | -------------------- |
| yum repolist enabled                | 显示可⽤的源仓库     |
| yum search pkg_name                 | 搜索软件包           |
| yum install pkg_name                | 下载并安装软件包     |
| yum install --downloadonly pkg_name | 只下载不安装    |
| yum list                            | 显示所有程序包       |
| yum list installed                  | 查看当前系统已安装包 |
| yum list updates                    | 查看可以更新的包列表 |
| yum check-update                    | 查看可升级的软件包   |
| yum update                          | 更新所有软件包       |
| yum update pkg_name                 | 升级指定软件包       |
| yum deplist pkg_name                | 列出软件包依赖关系   |
| yum remove pkg_name                 | 删除软件包           |
| yum clean all                       | 清除缓存             |
| yum clean packages                  | 清除缓存的软件包     |
| yum clean headers                   | 清除缓存的header     |

### DPKG包管理命令

| 常用命令             | 作用                  |
| -------------------- | --------------------- |
| dpkg -c xxx.deb      | 列出deb包的内容       |
| dpkg -i xxx.deb      | 安装/更新deb包        |
| dpkg -r pkg_name     | 移除deb包             |
| dpkg -P pkg_name     | 移除deb包(不保留配置) |
| dpkg -l              | 查看系统中已安装deb包 |
| dpkg -l pkg_name     | 显示包的⼤致信息      |
| dpkg -L pkg_name     | 查看deb包安装的⽂件   |
| dpkg -s pkg_name     | 查看包的详细信息      |
| dpkg –unpack xxx.deb | 解开deb包的内容       |

### APT软件⼯具

| 常用命令                  | 作用                   |
| ------------------------- | ---------------------- |
| apt-cache search pkg_name | 搜索程序包             |
| apt-cache show pkg_name   | 获取包的概览信息       |
| apt-get install pkg_name  | 安装/升级软件包        |
| apt-get purge pkg_name    | 卸载软件（包括配置）   |
| apt-get remove pkg_name   | 卸载软件（不包括配置） |
| apt-get update            | 更新包索引信息         |
| apt-get upgrade           | 更新已安装软件包       |
| apt-get clean             | 清理缓存               |

## 故障排查分析工具
### JDK自带分析工具
参考文章：
- [https://segmentfault.com/a/1190000038209665](https://segmentfault.com/a/1190000038209665)
- [https://www.cnblogs.com/kongzhongqijing/articles/5534624.html](https://www.cnblogs.com/kongzhongqijing/articles/5534624.html)

#### jps
jps查询系统内所有HotSpot进程，它位于java的bin目录下。

| 命令   | 含义                           |
| ------ | ------------------------------ |
| jps    | 输出当前运行主类名称，进程ID   |
| jps -q | 只列出进程ID                   |
| jps -l | 输出当前运行主类的全称，进程ID |
| jps -v | 输出虚拟机进程启动时`JVM`参数  |


#### jstat
jstat是JDK自带的一个轻量级小工具。全称“Java Virtual Machine statistics monitoring tool”，和jps一样，都在bin目录下。

| 命令                       | 含义                                                         |
| -------------------------- | ------------------------------------------------------------ |
| jstat -gc vmid 1000 10   | 查看进程`pid`的`GC`信息，每1000毫秒 输出一次，输出10次 |
| jstat -gccause vmid 1000 10 | 查看进程`pid`的`GC`发生的原因,每一秒（1000毫秒）输出一次，输出10次 |
| jstat -class vmid     | 查看`pid`的加载类信息 |
| jstat -gcutil vmid | 对`java`垃圾回收信息的统计 |
| jstat -gcnew vmid | 显示新生代`GC`的情况 |
| jstat -gcold vmid | 显示老年代`GC`的情况 |

#### jinfo
jinfo查看虚拟机参数信息，也可用于调整虚拟机配置参数。我们通过`jinfo --help`能看到相应的参数。

| 命令                     | 含义                                 |
| ------------------------ | ------------------------------------ |
| jinfo pid                | 输出关于`pid`的一堆相关信息          |
| jinfo -flags pid         | 查看当前进程曾经赋过值的一些参数              |
| jinfo -flag name pid     | 查看指定进程的`JVM`参数名称的参数的值       |
| jinfo -flag [+-]name pid | 开启或者关闭指定进程对应名称的`JVM`参数      |
| jinfo -sysprops pid      | 来输出当前 `JVM`进行的全部的系统属性 |

当使用jinfo进行修改对应进程JVM参数时，有一定的局限性。并不是所有的参数都支持修改，只有参数被标记为manageable的参数才可以被实时修改。

可以使用命令查看被标记为manageable的参数：`java -XX:+PrintFlagsFinal -version | grep manageable`

#### jmap
jmap全称：Java Memory Map，主要用于打印指定Java进程(或核心文件、远程调试服务器)的共享对象内存映射或堆内存细节。jmap以生成 java程序的dump文件， 也可以查看堆内对象示例的统计信息、查看ClassLoader 的信息以及 finalizer 队列。

jmap命令可以获得运行中的JVM的堆的快照，从而可以离线分析堆，以检查内存泄漏，检查一些严重影响性能的大对象的创建，检查系统中什么对象最多，各种对象所占内存的大小等等。可以使用jmap生成Heap Dump。

| 命令                    | 含义                                                         |
| ----------------------- | ------------------------------------------------------------ |
| jmap -heap pid       | 输出整个堆详细信息，包括GC的使用、堆的配置信息，以及内存的使用信息            |
| jmap -histo:live pid | 输出堆中对象的相关统计信息；第一列是序号，第二列是对象个数，第三列是对象大小`byte`，第四列是`class name` |
| jmap -finalizerinfo pid | 输出等待终结的对象信息                                       |
| jmap -clstats pid    | 输出类加载器信息                                             |
| jmap -dump:[live],format=b,file=filename.hprof pid | 把进程堆内存使用情况生成到堆转储`dump`文件中,`live`子选项是可选的，假如指定`live`选项,那么只输出活的对象到文件。`dump`文件主要作用，如果发生溢出可以使用`dump`文件分析是哪些数据导致的 |

> Heap Dump又叫堆转储文件，指一个java进程在某一个时间点的内存快照文件。Heap Dump在触发内存快照的时候会保存以下信息：
>- 所有的对象
>- 所有的class
>- GC Roots
>- 本地方法栈和本地变量
>
> 通常在写Dump文件前会触发一次Full GC，所以Heap Dump文件里保存的对象都是Full GC后保留的对象信息。
> 由于生成dump文件比较耗时，所以请耐心等待，尤其是大内存镜像生成的dump文件，则需要更长的时间来完成。

可以通过参数配置当发生OOM时自动生成dump文件：`-XX:+HeapDumpOnOutOfMemeryError -XX:+HeapDumpPath=<filename.hprof>`,当然此种方式获取dump文件较大，如果想要获取dump文件较小可以手动获取dump文件并指定只获取存活的对象。


#### jhat
JVM Heap Analysis Tool命令是与jmap搭配使用，用来分析jmap生成的dump文件，jhat内置了一个微型的HTTP/HTML服务器，生成dump的分析结果后，可以在浏览器中查看。在此要注意，一般不会直接在服务器上进行分析，因为jhat是一个耗时并且耗费硬件资源的过程，一般把服务器生成的dump文件复制到本地或其他机器上进行分析。

注意，jhat在jdk9中已经移除，官方对贱使用visualvm来配置jmap进行分析。

| 命令                                   | 含义                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| jhat -port 9998 /tmp/dump.dat          | 配合`jmap`命令使用，查看导出的`/tmp/dump.dat`文件，端口为9998；注意如果`dump`文件太大，可能需要加上`-J-Xmx512m`这种参数指定最大堆内存，即`jhat -J-Xmx512m -port 9998 /tmp/dump.dat` |
| jhat -baseline dump2.phrof dump1.phrof | 对比`dump2.phrof `与`dump1.phrof`文件                        |
| jhat heapDump                          | 分析`dump`文件,默认端口为7000     |


#### jstack
jstack，全称JVM Stack Trace栈空间追踪，用于生成虚拟机指定进程当前线程快照；主要分析堆栈空间，也就是分析线程的情况，可以分析出死锁问题，以及cpu100%的问题。jstack可以定位到线程堆栈，根据堆栈信息我们可以定位到具体代码，所以它在JVM性能调优中使用得非常多。

> jstack主要用于生成java虚拟机当前时刻的线程快照。线程快照是当前java虚拟机内每一条线程正在执行的方法堆栈的集合，生成线程快照的主要目的是定位线程出现长时间停顿的原因，
  如线程间死锁、死循环、请求外部资源导致的长时间等待等。

| 命令                | 含义                                                    |
| ------------------- | ------------------------------------------------------- |
| jstack pid          | 打印出所有的线程，包括用户自己启动的线程和`JVM`后台线程 |
| jstack 13324 >1.txt | 将13324进程中线程信息写入到`1.txt`文件中                |
| jstack 21711｜grep 54ee | 在进程21711中查找线程ID为54ee(16进制)的信息 |
| jstack -l pid | 除了堆栈信息外`-l`参数会显示线程锁的附加信息 |

除了可以使用jstack打印栈的信息，在java层面也可以使用`Thread.getAllStackTraces()`方法获取堆栈信息。

#### jcmd
在JDK1.7之后，新增了一个命令行工具jcmd。

它是一个多功能的工具，可以实现前面除了jstat之外的所有功能。例如，导出dump文件、查看线程信息、导出线程信息、执行GC，JVM运行时间等。

jcmd拥有jmap的大部分功能，并且在官方网站上也推荐使用jcmd代替jmap。

| 命令                | 含义                                                    |
| ------------------- | ------------------------------------------------------- |
| jcmd -l | 列出所有`JVM`的进程 |
| jcmd pid help       | 针对指定进程罗列出可执行的命令 |
| jcmd pid <具体命令> | 显示指定进程的指令命令的数据   |

### GUI分析工具
#### jconsole
JConsole 是一个内置 Java 性能分析器，可以从命令行（直接输入jconsole）或在 GUI shell （jdk\bin下打开）中运行。

它用于对JVM中内存，线程和类等的监控。这款工具的好处在于，占用系统资源少，而且结合Jstat，可以有效监控到java内存的变动情况，以及引起变动的原因。在项目追踪内存泄露问题时，很实用。

![常见故障排查及程序配置-002](/iblog/posts/annex/images/essays/常见故障排查及程序配置-002.png)

![常见故障排查及程序配置-001](/iblog/posts/annex/images/essays/常见故障排查及程序配置-001.png)

![常见故障排查及程序配置-003](/iblog/posts/annex/images/essays/常见故障排查及程序配置-003.png)

#### visual vm
visual vm 是一个功能强大的多合一故障诊断和性能监控的可视化工具。它集成了多个JDK命令行工具，使用visual vm可用于显示虚拟机进程及进程的配置和环境信息，监视应用程序的CPU、GC、堆、方法区及线程的信息等，甚至代替jconsole。

在JDK7，visual vm便作为JDK的一部分发布，在JDK的bin目录下，即：它完全免费。此外，visual vm也可以作为独立软件进行安装。

主要功能：
- 生成读取dump文件
- 查看JVM参数和系统属性
- 查看运行中虚拟机进程
- 生成读取线程快照
- 程序资源的实时监控

visual vm 支持插件扩展，可以在visual vm上安装插件，也可以将visual vm安装在idea上：

![常见故障排查及程序配置-006](/iblog/posts/annex/images/essays/常见故障排查及程序配置-006.png)

![常见故障排查及程序配置-007](/iblog/posts/annex/images/essays/常见故障排查及程序配置-007.png)

visual vm可以生成dump文件，生成的dump文件是临时的，如果想要保留该文件需要右键另存为即可：

![常见故障排查及程序配置-004](/iblog/posts/annex/images/essays/常见故障排查及程序配置-004.png)

![常见故障排查及程序配置-005](/iblog/posts/annex/images/essays/常见故障排查及程序配置-005.png)

如果堆文件数据较大，排查起来很困难，可以使用OQL语句进行筛选。
> OQL:全称，Object Query Language 类似于SQL查询的一种语言，OQL使用SQL语法，可以在堆中进行对象的筛选。
>
> 基本语法：
> ```
> select <JavaScript expression to select> 
> [ from (instanceof) <class name> <identifier>
> ( where <JavaScript boolean expression to filter> ) ]
> ```
> 1.class name是java类的完全限定名
> 2.instanceof表示也查询某一个类的子类
> 3.from和where子句都是可选的 
> 4.可以使用obj.field_name语法访问Java字段
> 
> 例如
>```
>-- 查询长度大于等于100的字符串
>select s from java.lang.String s where s.value.length >= 100
>
>-- 显示所有File对象的文件路径 
>select file.path.value.toString() from java.io.File file
>
>-- 显示由给定id字符串标识的Class的实例
>select o from instanceof 0x741012748 o
>```

visual vm也可以将两个dump文件进行比较：

![常见故障排查及程序配置-008](/iblog/posts/annex/images/essays/常见故障排查及程序配置-008.png)

visual vm不但可以生成堆的dump文件，也可以对线程dump：

![常见故障排查及程序配置-009](/iblog/posts/annex/images/essays/常见故障排查及程序配置-009.png)

#### eclipse MAT
MAT全称，Memory Analyzer Tool 是一款功能强大的Java堆内存分析器。可以用于查找内存泄漏以及查看内存消耗情况。

MAT是eclipse开发的，不仅可以单独使用，还可以作为插件嵌入在eclipse中使用。是一款免费的性能分析工具，使用起来很方便。

MAT的主要功能就是分析dump文件。分析dump最终目的是为了找出内存泄漏的疑点，防止内存泄漏。

JVM内存包含信息：
- 所有对象信息，包括对象实例、成员变量、存储于栈中的基本数据类型和存储于堆中的其他对象的引用值；
- 所有的类信息，包括classloader、类名称、父类的信息、静态变量等；
- GCRoot到所有的这些对象的引用路径;
- 线程信息，包括线程的调用栈及线程的局部变量;

常见获取dump文件方式：
- 通过jmap或jcmd命令行方式获取；
- 通过配置JVM参数"-XX:+HeapDumpOnOutOfMemoryError"或"-XX:+HeapDumpBeforeFullGC"
- 使用第三方工具生成dump文件，如：visual vm

---
**MAT介绍**

导入dump文件：

在生成可疑泄漏报告后，会在对应的堆转储文件目录下生成一个zip文件。

![常见故障排查及程序配置-010](/iblog/posts/annex/images/essays/常见故障排查及程序配置-010.png)

![常见故障排查及程序配置-011](/iblog/posts/annex/images/essays/常见故障排查及程序配置-011.png)

![常见故障排查及程序配置-012](/iblog/posts/annex/images/essays/常见故障排查及程序配置-012.png)

![常见故障排查及程序配置-013](/iblog/posts/annex/images/essays/常见故障排查及程序配置-013.png)

![常见故障排查及程序配置-016](/iblog/posts/annex/images/essays/常见故障排查及程序配置-016.png)

MAT最主要的功能是分析dump文件，其中比较重要的功能就是histogram(直方图)和dominator tree(支配树)

---
**直方图**

![常见故障排查及程序配置-015](/iblog/posts/annex/images/essays/常见故障排查及程序配置-015.png)

- 浅堆：一个对象结构所占用的大小，即对象头+实例数据+对齐填充，不包括内部引用对象大小；
- 深堆：一个对象被 GC 回收后，可以真实释放的内存大小；
- 对象的实际大小：一个对象所能触及的所有对象的浅堆大小之和；

![常见故障排查及程序配置-017](/iblog/posts/annex/images/essays/常见故障排查及程序配置-017.png)

如上图所示：（浅堆<= 深堆 <= 实际大小）
- Object2浅堆大小：为Object2本身；
- Object2深堆大小：Object2本身加上Object6；
- Object2实际大小：Object2本身加上Object6加上Object5；

![常见故障排查及程序配置-014](/iblog/posts/annex/images/essays/常见故障排查及程序配置-014.png)

---
**支配树对象图**

![常见故障排查及程序配置-018](/iblog/posts/annex/images/essays/常见故障排查及程序配置-018.png)

支配树概念源自图论。它体现了对象实例之间的支配关系。在对象的引用图中，所有指向对象B的路径都要经过对象A，则认为对象A支配对象B。如果对象A是离对象B最近的一个支配对象，则认为对象A为对象B的直接支配者。

支配树是基于对象间的引用图建立的，它有以下性质：
- 对象A的子树，即所有被对象A支配的对象集合，表示对象A的保留集，即深堆；
- 如果对象A支配对象B，那么对象A直接支配者也支配对象B；
- 支配树的边与对象引用图的边不相对应；

分配树能直观的体现对象能否被回收的情况，如图所示，左为对象的引用图，右为对象的支配图。
- C与E的关系为，C支配E，C是E的直接支配者，G和E为C的保留集；
- C与H不是支配关系，因为H被F引用；

![常见故障排查及程序配置-019](/iblog/posts/annex/images/essays/常见故障排查及程序配置-019.png)
