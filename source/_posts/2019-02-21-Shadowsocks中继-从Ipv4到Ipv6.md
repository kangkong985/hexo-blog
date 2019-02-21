---
title: 'Shadowsocks中继:从IPv4到IPv6'
tags:
  - 教程
  - Shadowsocks
categories:
  - 教程
abbrlink: 6289
date: 2019-02-21 17:00:17
---
最近墙又双叒叕加高了。在春节前就发现自己的VPS无法连接，后来发现还好只是端口被封禁，换成其他的端口就能使用了。不过这才撑了半个月新的端口访问又不太稳定了。如果再换端口，或许也可以。但是不是长久之计。不过我的VPS是支持IPv6的，一般来说，墙对于IPv6流量的拦截比较弱。或许可以想办法先把自己的流量转换成IPv6然后再出去。
![Hello GFW, Goodbye GFW](https://imgs.codewoody.com/uploads/big/7a59f2881bd41ba1fabc7e1cbce460a4.png)
<!--more-->

> 我也设想过要不要给代理添加混淆的功能，处于以下几方面的考虑，还是选择了流量转换的方案：
> 1. 手机端部分ss应用不支持混淆；
> 2. 未来混淆还是可能被针对性的拦截。但是IPv6则不会。GFW拦截还是拦截大鱼不拦截小鱼的。国内目前IPv6的使用范围仍然非常小，而且基本只限于教育网。因此IPv6在未来的很长一段时间内不会成为GFW的针对目标

我们这里使用HAProxiy来完成这一功能。

## 安装HAProxy

```bash
wget http://www.haproxy.org/download/1.7/src/haproxy-1.7.2.tar.gz
tar -xzf haproxy-1.7.2.tar.gz
make TARGET=linux2826 USE_GETADDRINFO=1
sudo make install
```

注意，在倒数第二行的make命令中，TARGET需要根据你的内核版本来选择。`USE_GETADDRINFO`的作用是使得HAProxy可以对域名采用DNS查询来获取IP。使用包管理器安装的HAProxy是不带这个功能的。

## 设置

```
global
        ulimit-n  51200
        daemon  # run as daemon

defaults
        log    global
        mode    tcp
        option    dontlognull
        timeout connect 1000
        timeout client 150000
        timeout server 150000

frontend ss-in
        bind *:port # 跳板机监听端口
        default_backend ss-out

backend ss-out
        server server1 vps_host:vps_ss_port maxconn 20480
```

设置文件位于`/etc/haproxy/haproxy.cfg`。在完成设置后，使用`sudo haproxy -f /etc/haproxy/haproxy.cfg`来运行。
