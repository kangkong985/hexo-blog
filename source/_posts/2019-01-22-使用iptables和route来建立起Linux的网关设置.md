---
title: 使用iptables和route来建立起Linux的网关设置
tags:
  - 教程
  - linux
  - iptables
categories:
  - 教程
abbrlink: 32824
date: 2019-01-22 16:00:49
---
网络资源的分享是非常重要的，而建立起一个网关来进行网络分享是一个比较好的解决方案。在Linux系统中创建和设置网关非常简单，成本低廉，而且性能可靠。

![网络拓扑图](https://imgs.codewoody.com/uploads/big/6f341c57eb221eab557015034a7c4c0e.png)
<!--less-->
本文翻译自：[Setting Up Gateway Using iptables and route on Linux](https://www.systutorials.com/1372/setting-up-gateway-using-iptables-and-route-on-linux/)。
网络资源的分享是非常重要的，而建立起一个网关来进行网络分享是一个比较好的解决方案。在Linux系统中创建和设置网关非常简单，成本低廉，而且性能可靠。

# 1 Linux网络设置

假定我们要处理的Linux有如下的配置：

- NIC1: eth0, ip: 192.168.0.1，连接到局域网(LAN)
- NIC2: eth1, ip: 1.2.3.4, 连接到公网

![网络拓扑图](https://imgs.codewoody.com/uploads/big/6f341c57eb221eab557015034a7c4c0e.png)

现在我们希望将分享这台机器的网络连接给LAN网络上的其他电脑(ip: 192.168.0.0/16)

# 2 设置网关

下面提到的所有操作都需要root权限来执行。

## 2.1 操作IP路由表

```bash
ip route add 192.168.0.0/16 dev eth0

# or
# route add -net 192.168.0.0/16 dev eth0
```

## 2.2 启用Linux IP 转发(IP Forwarding)

```bash
sysctl -w net.ipv4.ip.forward=1

# or
# echo 1 > /proc/sys/net/ipv4/ip_forward
```

你也可以直接编辑`/etc/sysctl.conf`来持久化这一设置：

```bash
net.ipv4.ip_forward = 1
```

## 2.3 通过iptables设置源地址映射(SNAT)

将（其他电脑发送的）包的源地址修改为网关的源地址。iptables会自动将响应包的目的地址替换成正确的IP地址。

```bash
iptables -t nat -A POSTROUTING ! -d 192.168.0.0/16 -o eth1 -j SNAT --to-source 1.2.3.4
```

除了使用SNAT，也可以使用MASQUERADE:

```bash
iptables -t nat -A POSTROUTING ! -d 192.168.0.0/16 -o eth1 -j MASQUERADE
```

注意，对于静态IP而言，SNAT的方式要更好一些。根据iptables man page:

> This target is only valid in the nat table, in the POSTROUTING chain. It should only be used with dynamically assigned IP (dialup) connections: if you have a static IP address, you should use the SNAT target. Masquerading is equivalent to specifying a mapping to the IP address of the interface the packet is going out, but also has the effect that connections are forgotten when the interface goes down. This is the correct behavior when the next dialup is unlikely to have the same interface address (and hence any established connections are lost anyway).

你还需要确保其他iptables不会阻拦对应的连接。如果你有这方面的问题，可以尝试：

```bash
iptables -F
iptables -t nat -F
iptables -t nat -A POSTROUTING ! -d 192.168.0.0/16 -o eth1 -j SNAT --to-source 1.2.3.4
```

上面的代码可以允许所有的接入连接。不过这会存在一些安全性问题。

# 3 客户端配置

客户端配置主要是把网关设置成192.168.0.1。例如如下命令

```bash
ip route add default via 192.168.0.1 dev eth0

# or
# route add default gw 192.168.0.1 eth0
```