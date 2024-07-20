---
title: "Java程序的故障排查"
date: 2021-09-08
draft: false
tags: ["编程指南","Java"]
slug: "java-problem-command-tools"
---


## Linux命令
由于大多数Java程序部署到Linux服务器上，故障排查和性能调优通常需要结合使用Linux命令。
Linux命令，可以实时查看系统的CPU、内存、磁盘和网络使用情况，帮助识别和解决系统级别的问题。
常见的命令包括`top`用于显示实时的CPU和内存使用情况，`df`查看磁盘使用情况，`netstat`显示网络连接和监听端口，`ping`测试网络延迟，`systemctl`管理系统服务等。

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

## JDK命令
JDK命令用于诊断和优化Java应用程序的性能，分析JVM行为。通过这些命令，可以生成和分析堆转储，查看线程状态，获取JVM配置信息等。
常用命令包括`jmap`用于生成堆转储，`jstack`打印线程堆栈跟踪，`jstat`查看垃圾回收统计信息，`jinfo`获取JVM系统属性和配置信息，`javap`反编译类文件。

### jps
`jps`是JDK提供的一个命令行工具，用于列出正在运行的JVM实例。它显示所有Java进程的进程ID和主类名。

| 命令      | 描述                                      |
|-----------|-------------------------------------------|
| `jps -l`  | 显示完整的主类名或 JAR 文件名              |
| `jps -v`  | 显示 JVM 启动时的参数                     |
| `jps -m`  | 显示传递给 main 方法的参数                |
| `jps -q`  | 只显示进程 ID，不显示主类名或其他信息     |
| `jps -J`  | 将参数传递给 `jps` 命令的 JVM             |


### jstat
`jstat`命令是JDK提供的一个工具，用于监视JVM的性能和运行时统计信息。它提供了多种选项来获取JVM内存、垃圾回收、编译和类加载的详细统计数据。
通过`jstat`，可以实时获取JVM内部的各种状态信息，有助于性能监控和故障排查。

| 命令                       | 描述                                        |
|----------------------------|---------------------------------------------|
| `jstat -gc <pid>`           | 显示垃圾回收相关的统计信息                  |
| `jstat -gccapacity <pid>`   | 显示 GC 内存区容量的统计信息                |
| `jstat -gcnew <pid>`        | 显示新生代的垃圾回收统计信息                |
| `jstat -gcold <pid>`        | 显示老年代的垃圾回收统计信息                |
| `jstat -gcutil <pid>`       | 显示各个内存区域的使用情况                  |
| `jstat -printcompilation <pid>` | 显示正在编译的 Java 类的相关信息        |
| `jstat -compiler <pid>`     | 显示编译器相关的统计信息                    |
| `jstat -class <pid>`        | 显示类加载相关的统计信息                    |
| `jstat -classload <pid>`    | 显示类加载的统计信息                        |
| `jstat -heap <pid>`         | 显示 JVM 堆的使用情况                        |
| `jstat -stack <pid>`        | 显示线程栈的统计信息                        |


### jinfo
`jinfo`命令是JDK提供的一个工具，用于显示JVM的配置信息和系统属性。`jinfo`查看虚拟机参数信息，也可用于调整虚拟机配置参数。

| 命令                             | 描述                                                |
|----------------------------------|-----------------------------------------------------|
| `jinfo -flags <pid>`              | 显示 JVM 启动时使用的所有标志和标志信息               |
| `jinfo -sysprops <pid>`           | 显示 JVM 启动时设置的系统属性                        |
| `jinfo -heap <pid>`               | 显示 JVM 的堆内存设置，包括堆的初始大小和最大大小      |
| `jinfo -l <pid>`                  | 显示进程的锁信息，例如线程持有的锁和锁的竞争情况        |
| `jinfo -version <pid>`            | 显示 JVM 的版本信息                                |
| `jinfo -x <pid>`                  | 显示 JVM 的详细运行时信息，包括垃圾回收信息和类加载信息 |
| `jinfo -jdwp <pid>`               | 显示 JDWP (Java Debug Wire Protocol) 相关信息         |
| `jinfo -stack <pid>`              | 显示进程的线程栈信息                                |
| `jinfo -set <option=value> <pid>` | 动态设置 JVM 参数，例如调整垃圾回收器的行为          |

当使用`jinfo`进行修改对应进程JVM参数时，有一定的局限性。并不是所有的参数都支持修改，只有参数被标记为`manageable`的参数才可以被实时修改。
可以使用命令查看被标记为`manageable`的参数，`java -XX:+PrintFlagsFinal -version | grep manageable`。

### jmap
`jmap`命令用于生成JVM的内存映像，可以帮助开发人员分析内存使用情况，进行内存泄漏检测和性能优化。它能够生成堆转储、查看堆的摘要信息、以及查看堆的使用情况等。
`jmap`命令可以获得运行中的JVM的堆的快照，从而可以离线分析堆，来检查内存泄漏、检查一些严重影响性能的大对象的创建、检查系统中什么对象最多，各种对象所占内存的大小等等。
可以使用`jmap`生成**Heap Dump**文件。

| 命令                             | 描述                                                                                 |
|----------------------------------|--------------------------------------------------------------------------------------|
| `jmap -dump:format=b,file=<file> <pid>` | 生成堆转储文件，格式为 `b` 表示二进制格式，`file` 是输出的文件名                       |
| `jmap -heap <pid>`                | 显示堆内存的详细信息，包括堆的初始大小、最大大小和各个内存区域的使用情况               |
| `jmap -histo <pid>`               | 显示堆中对象的类和它们的实例数量，帮助分析内存中存储的对象                           |
| `jmap -finalizerinfo <pid>`       | 显示所有对象的 finalizer 信息，帮助识别未及时清理的对象                               |
| `jmap -stack <pid>`               | 显示堆栈的内容，包括线程堆栈信息，主要用于线程分析                                  |
| `jmap -F <pid>`                   | 强制执行操作，适用于当进程在特定状态下时，确保 `jmap` 命令能够成功执行                |

> `Heap Dump`又叫堆转储文件，指一个Java进程在某一个时间点的内存快照文件。`Heap Dump`在触发内存快照的时候会保存以下信息：
>- 所有的对象
>- 所有的class
>- GC Roots
>- 本地方法栈和本地变量
>
> 通常在写`dump`文件前会触发一次Full GC，所以`Heap Dump`文件里保存的对象都是`Full GC`后保留的对象信息。
> 由于生成`dump`文件比较耗时，所以请耐心等待，尤其是大内存镜像生成的`dump`文件，则需要更长的时间来完成。

可以通过参数配置当发生`OOM`时自动生成`Heap dump`文件：
```shell
-XX:+HeapDumpOnOutOfMemeryError -XX:+HeapDumpPath=<filename.hprof>
```
当然此种方式获取`dump`文件较大，如果想要获取`dump`文件较小可以手动获取`dump`文件并指定只获取存活的对象。

### jhat
`jhat`是一个用于分析Java堆转储的工具。它可以提供一个网页界面，用于查看堆转储文件中的对象信息、对象引用和内存使用情况等。
`jhat`内置了一个微型的HTTP/HTML服务器，生成`dump`的分析结果后，可以在浏览器中查看。但是一般不会直接在服务器上进行分析，因为`jhat`是一个耗时并且耗费硬件资源的过程，一般把服务器生成的`dump`文件复制到本地或其他机器上进行分析。
所以`jhat`在JDK9中已经移除，官方推荐使用`visualvm`来分析`dump`文件。

| 命令                        | 描述                                                                                 |
|-----------------------------|--------------------------------------------------------------------------------------|
| `jhat <file>`               | 启动 `jhat` 工具并加载指定的堆转储文件 `<file>`，默认在本地服务器上提供一个网页界面   |
| `jhat -d <seconds> <file>`  | 启动 `jhat` 工具并将堆转储文件 `<file>` 加载到内存中，`-d` 选项指定分析超时时间      |
| `jhat -heap <file>`         | 显示堆内存的摘要信息和分析结果，包括堆的各个区域的内存使用情况                      |

### jstack
`jstack`是一个Java工具，用于用于生成虚拟机指定进程当前线程快照。它能帮助开发人员诊断线程死锁、线程阻塞等问题。
`jstack`可以定位到线程堆栈，根据堆栈信息我们可以定位到具体代码，所以它在JVM性能调优中使用得非常多。

| 命令                  | 描述                                                        |
|-----------------------|-------------------------------------------------------------|
| `jstack <pid>`        | 打印指定进程 ID `<pid>` 的线程堆栈跟踪                        |
| `jstack -l <pid>`     | 打印指定进程 ID `<pid>` 的线程堆栈跟踪，包括锁信息            |
| `jstack -F <pid>`     | 强制打印指定进程 ID `<pid>` 的线程堆栈跟踪，即使进程可能不响应 |
| `jstack -m <pid>`     | 打印指定进程 ID `<pid>` 的线程堆栈跟踪，包括本地方法的堆栈信息  |

`jstack`主要用于生成JVM当前时刻的线程快照。线程快照是当前JVM内每一条线程正在执行的方法堆栈的集合，生成线程快照的主要目的是定位线程出现长时间停顿的原因，如线程间死锁、死循环、请求外部资源导致的长时间等待等。
除了可以使用`jstack`打印栈的信息，在代码层面也可以使用`Thread.getAllStackTraces()`方法获取堆栈信息。

### jcmd
`jcmd`是一个功能强大的Java命令行工具，用于诊断和管理Java进程。它可以执行多种诊断命令、控制JVM的行为，并生成诊断报告。
`jcmd`是JDK7及更高版本中引入的工具，能够替代许多其他诊断工具如`jps`、`jstat`、`jstack`等，提供更加一致和全面的功能。

| 命令                     | 描述                                                        |
|--------------------------|-------------------------------------------------------------|
| `jcmd <pid> VM.version`  | 显示指定进程 ID `<pid>` 的 JVM 版本信息                     |
| `jcmd <pid> VM.flags`    | 显示指定进程 ID `<pid>` 的 JVM 启动参数                      |
| `jcmd <pid> Thread.print`| 打印指定进程 ID `<pid>` 的线程堆栈跟踪                       |
| `jcmd <pid> GC.run`      | 执行垃圾回收并生成 GC 日志                                  |
| `jcmd <pid> GC.class_histogram` | 打印指定进程 ID `<pid>` 的类实例直方图                |
| `jcmd <pid> JFR.start`   | 启动 Java Flight Recorder（JFR）数据采集                    |
| `jcmd <pid> JFR.stop`    | 停止 JFR 数据采集并生成报告                                |
| `jcmd <pid> JFR.dump`    | 导出 JFR 采集的数据                                        |
| `jcmd <pid> VM.system_properties` | 显示指定进程 ID `<pid>` 的系统属性                   |
| `jcmd <pid> VM.uptime`   | 显示指定进程 ID `<pid>` 的 JVM 启动时间                     |


### jconsole
`jconsole`是一个图形化的管理工具，提供了对Java进程的监控和管理功能。它是JDK附带的工具，基于Java Management Extensions实现。
通过`jconsole`，用户可以实时监控JVM的性能、内存使用情况、线程状态等，并对应用程序进行管理和配置。
这款工具的好处在于，占用系统资源少，而且结合`jstat`可以有效监控Java内存的变动情况，以及引起变动的原因。在项目追踪内存泄露问题时，很实用。

![常见故障排查及程序配置-002](/iblog/posts/annex/images/essays/常见故障排查及程序配置-002.png)

![常见故障排查及程序配置-001](/iblog/posts/annex/images/essays/常见故障排查及程序配置-001.png)

![常见故障排查及程序配置-003](/iblog/posts/annex/images/essays/常见故障排查及程序配置-003.png)

## 分析工具

### VisualVM
`VisualVM`是一个强大的Java应用程序性能分析工具，它提供了对JVM实例的监控、分析和管理功能。它包括内存分析、线程分析、垃圾回收监控、CPU使用情况分析以及堆转储分析等功能。
它集成了多个JDK命令行工具，使用`VisualVM`可用于显示虚拟机进程及进程的配置和环境信息，监视应用程序的CPU、GC、堆、方法区及线程的信息等，甚至代替`jconsole`。

常用功能：
- 内存分析：查看堆内存使用情况，分析对象的分布和大小。
- 线程分析：监控线程的活动和状态，捕捉线程堆栈快照。
- CPU使用分析：分析应用程序的 CPU 使用情况，识别热点方法。
- 堆转储分析：分析堆转储文件，帮助识别内存泄漏。
- 垃圾回收监控：查看垃圾回收的统计数据和日志，帮助优化垃圾回收策略。

`VisualVM`支持插件扩展，可以在`VisualVM`上安装插件，也可以将`VisualVM`安装在IDEA上。

![常见故障排查及程序配置-006](/iblog/posts/annex/images/essays/常见故障排查及程序配置-006.png)

![常见故障排查及程序配置-007](/iblog/posts/annex/images/essays/常见故障排查及程序配置-007.png)

`VisualVM`可以生成`dump`文件，生成的`dump`文件是临时的，如果想要保留该文件需要右键另存为即可。

![常见故障排查及程序配置-004](/iblog/posts/annex/images/essays/常见故障排查及程序配置-004.png)

![常见故障排查及程序配置-005](/iblog/posts/annex/images/essays/常见故障排查及程序配置-005.png)

如果堆文件数据较大，排查起来很困难，可以使用`OQL`语句进行筛选。
> OQL全称，Object Query Language类似于SQL查询的一种语言，OQL使用SQL语法，可以在堆中进行对象的筛选。
> 基本语法：
> ```
> select <JavaScript expression to select> 
> [ from (instanceof) <class name> <identifier>
> ( where <JavaScript boolean expression to filter> ) ]
> ```
> 1.`class name`是java类的完全限定名；
> 2.`instanceof`表示也查询某一个类的子类；
> 3.`from`和`where`子句都是可选的；
> 4.可以使用`obj.field_name`语法访问Java字段；
> 
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

`VisualVM`也可以将两个`dump`文件进行比较。

![常见故障排查及程序配置-008](/iblog/posts/annex/images/essays/常见故障排查及程序配置-008.png)

`VisualVM`不但可以生成堆的`dump`文件，也可以对线程`dump`。

![常见故障排查及程序配置-009](/iblog/posts/annex/images/essays/常见故障排查及程序配置-009.png)

### Eclipse MAT
全称Eclipse Memory Analyzer Tool，是一个强大的Java内存分析工具，用于分析Java 堆转储文件。它帮助开发人员和运维人员识别和解决内存泄漏、内存占用过高等问题。MAT提供了多种分析功能，包括对象分布分析、泄漏查询、内存占用分析等。
MAT是Eclipse开发的，不仅可以单独使用，还可以作为插件嵌入在Eclipse中使用。是一款免费的性能分析工具，使用起来很方便。

常用功能：
- 内存泄漏检测：通过分析堆转储文件，识别可能的内存泄漏源。
- 对象占用分析：查看特定对象或类的内存占用情况。
- 引用链分析：分析对象之间的引用关系，帮助理解为什么对象无法被垃圾回收。
- 查询功能：通过`OQL`（对象查询语言）执行自定义查询，分析堆数据。
- 报告生成：生成详细的内存分析报告，提供对内存使用的深入洞察。

使用MAT分析`dump`文件，生成可疑泄漏报告。在生成可疑泄漏报告后，会在对应的堆转储文件目录下生成一个zip文件。

![常见故障排查及程序配置-010](/iblog/posts/annex/images/essays/常见故障排查及程序配置-010.png)

![常见故障排查及程序配置-011](/iblog/posts/annex/images/essays/常见故障排查及程序配置-011.png)

![常见故障排查及程序配置-012](/iblog/posts/annex/images/essays/常见故障排查及程序配置-012.png)

![常见故障排查及程序配置-013](/iblog/posts/annex/images/essays/常见故障排查及程序配置-013.png)

![常见故障排查及程序配置-016](/iblog/posts/annex/images/essays/常见故障排查及程序配置-016.png)


MAT最主要的功能是分析`dump`文件，其中比较重要的功能就是直方图对象图。

![常见故障排查及程序配置-015](/iblog/posts/annex/images/essays/常见故障排查及程序配置-015.png)

- 浅堆：一个对象结构所占用的大小，即对象头+实例数据+对齐填充，不包括内部引用对象大小；
- 深堆：一个对象被 GC 回收后，可以真实释放的内存大小；
- 对象的实际大小：一个对象所能触及的所有对象的浅堆大小之和；

举个例子

![常见故障排查及程序配置-017](/iblog/posts/annex/images/essays/常见故障排查及程序配置-017.png)

- `Object2`浅堆大小：为`Object2`本身；
- `Object2`深堆大小：`Object2`本身加上`Object6`，因为`Object5`被`Object1`引用；
- `Object2`实际大小：`Object2`本身加上`Object6`加上`Object5`；

在MAT中，可以选择直方图视图来查看每个堆转储文件中的对象分布。
通过对比不同时间点的堆转储，识别持续增长的对象数量，从而帮助发现内存泄漏。

![常见故障排查及程序配置-014](/iblog/posts/annex/images/essays/常见故障排查及程序配置-014.png)
