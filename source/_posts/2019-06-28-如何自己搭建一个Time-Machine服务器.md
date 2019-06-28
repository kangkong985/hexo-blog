---
title: 如何自己搭建一个Time Machine服务器
tags:
  - 教程
  - macOS
categories:
  - 教程
abbrlink: 14680
date: 2019-06-28 10:52:05
---
如何在Ubuntu上搭建一个简洁的Time Machine服务器呢？网上找到的教程说的都比较杂，这里整理一个刚刚经过实践检验的方法来供大家参考。目标系统是`Ubuntu 16.04 LTS`。
<!--more-->

### 1. 安装需要的工具
```shell
sudo apt-get install netatalk avahi-daemon
```
### 2. 创建一个用于专门用来运行Time Machine进程的用户
```shell
useradd -c "Time machine" -m -s /bin/bash tm
```
我这里命名为`tm`，你可以替换为任何你定的名字，但是最好不要使用`root`用户。
接下来给新用户设定密码
```shell
sudo passwd tm
```
### 3. 准备文件夹
```shell
mkdir -R /home/tm/TimeMachineFolder
sudo chown -R tm /home/tm/TimeMachineFolder
```
### 4. 设置`netatalk`
首先我们将原有的配置文件备份
```shell
sudo mv /etc/netatalk/AppleVolumes.default /etc/netatalk/AppleVolumes.default.old
```
然后创建一个新的配置文件
```shell
sudo touch /etc/netatalk/AppleVolumes.default
```
使用你偏好的编辑器（vim，nano之类）向这个配置文件中加入如下内容
```shell
:DEFAULT: options:upriv,usedots
/home/tm/TimeMachineFolder "My Time Machine" options:tm volsizelimit:500000 allow:tm
```
注意将第二行的文件夹路径设定为你再第三步中创建的文件夹的路径。另外，第二行中的`volsizelimit`设定了Time Machine将会使用的最大硬盘空间，单位是MB。

### 5. 重启`netatalk`服务来应用更改

```shell
sudo service netatalk restart
```

### 6. 在Mac上连接到Time Machine
首先直接尝试在Time Machine中选择这个服务器（会显示在可用磁盘下面，名字显示为第四步中你`netatalk`设置文件中指定的名字）。
如果你无法找到，那么打开Finder并按下⌘+K，在弹出来的窗口中，于服务器地址一栏输入`afp://IP.of.your.server/`，然后点连接。如果提示需要输入用户名和密码来登录，那就输入第二步中你设定的用户名密码即可。

![示意图](https://imgs.codewoody.com/uploads/big/408d6956cd13b4c671b4519c1115d97c.png)


ref：[Concisest guide to setting up Time Machine server on Ubuntu Server 12.04, 14.04 & Debian | Dae’s blog](http://dae.me/blog/1660/concisest-guide-to-setting-up-time-machine-server-on-ubuntu-server-12-04/)