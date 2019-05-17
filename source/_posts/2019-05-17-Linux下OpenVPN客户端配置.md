---
title: Linux下OpenVPN客户端配置
tags:
  - 教程
  - vpn
  - linux
categories:
  - 教程
abbrlink: 38823
date: 2019-05-17 10:46:41
---

![OpenVPN](https://imgs.codewoody.com/uploads/big/cb54becbed976afbcd2d21733fcf85c6.png)
<!--more--->

## 环境配置

安装OpenVPN的方法很简单：

```shell
sudo apt-get update
sudo apt-get install openvpn
```

## 使用方法

首先你需要从OpenVPN服务提供商那里得到`*.ovpn`配置文件，然后在服务器上运行

```shell
sudo openvpn --config your.ovpn
```

不过这个命令会在前台运行，当我们退出SSH之后就会终止。为了让OpenVPN能够在后台运行，且能够自动开机启动，我们需要借助于Systemctl的帮助。首先我们将ovpn文件复制到`/etc/openvpn/client/`下，**将后缀直接修改为`.conf`**。如果配置文件需要我们手动输入密码，我们需要将密码以配置文件的形式固定下来，不然自动启动会失败。在`/etc/openvpn/client/`新建一个`account.txt`文件，在其中输入：

```text
username
password
```

> 有些OpenVPN服务端工具只会生成密码（例如Pritunl），在这里username可以随意输入一个，然后在下面一行添加密码。

然后进入配置文件，找到`auth-user-pass`。默认情况下这个配置条目后面是空的，我们将其修改为：

```text
auth-user-pass /etc/openvpn/client/account.txt
```

假设前面我们复制过来的配置文件的名字为`default.conf`。输入下面的命令以启用这个vpn：

```shell
sudo systemctl enable openvpn-client@default
```

要启动这个vpn，使用下面的命令：

```shell
systemctl start openvpn-client@default
```
