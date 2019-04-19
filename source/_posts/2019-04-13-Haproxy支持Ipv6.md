---
title: Haproxy支持Ipv6
abbrlink: 12489
date: 2019-04-13 16:47:20
tags:
  - 教程
  - ss
categories:
  - 教程
---

## Haproxy

[Haproxy is a reliable, high performance TCP/HTTP Load Balancer](http://www.haproxy.org/)

这是官网对于Haproxy的介绍，其作用的类似于Nginx，是一个均衡负载的服务器。其相比于Nginx的好处是其代理TCP流量的功能配置起来非常的简单。我这里主要拿Haproxy来配置Shadowsocks的跳板机。

前一段时间，GFW的墙好像又加高了，很多时候在教育网外连接服务器不是很可靠。所以我考虑干脆在教育网环境下做一个跳板服务器，这样在外面可以先跳到教育网，然后再从教育网过墙。

教育网的另一个好处是有IPv6。貌似IPv6上面的拦截比较弱，而且，绝大多数的高校对于IPv6都是免流量费的。因此，我们可以从IPv4公口进，然后走IPv6出。

## How to

不过，问题是通过apt安装的haproxy是[不支持IPv6的](https://github.com/Entware/Entware-ng/issues/426)！

我们只能自己动手从源码编译了：

```shell
wget http://www.haproxy.org/download/1.7/src/haproxy-1.7.2.tar.gz
tar -xzf haproxy-1.7.2.tar.gz
cd haproxy-1.7.2
make TARGET=linux2626 USE_GETADDRINFO=1
sudo make install
```