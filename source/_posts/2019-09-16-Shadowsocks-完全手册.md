---
title: Shadowsocks 完全手册
tags:
  - 教程
  - Shadowsocks
categories:
  - 教程
abbrlink: 36409
date: 2019-09-16 13:07:02
---

目前我的博客里面还是Shadowsocks相关的文章看的人最多，所以我这里干脆汇总整理一下。

## 什么是Shadowsocks

Shadowsocks 据传早期是由一名知乎员工(clowwwindy)开发，从一开始就是不属于任何公司的开源软件。不过在Shadowsocks广为流行之后，这名员工被有关部门请去喝茶，其本人Github名下的Shadowsocks代码仓库也被清空，只留下内容为「Removed due to regulations」。不过 Shadowsocks 的代码被很多人Fork，所以Shadowsocks的活力并未受到影响。

后来Shadowsocks又被开发者（breakwa11）发展成ShadowsocksR，加了很多加密、流量混淆插件，比原版更安全、更稳定、更快速。不过这名作者随后被人肉，代码被迫删除。

Shadowsocks 为一种**代理**软件。对于软件工程不熟悉的人，通常会混淆**代理**与**VPN**二者的概念，网络上有很多文章来讲解这二者的区别。按照「[What’s the Difference Between a VPN and a Proxy?](https://www.howtogeek.com/247190/whats-the-difference-between-a-vpn-and-a-proxy/)」这篇文章的说法，代理的作用为隐藏你的真实IP，让你以服务器的IP的身份来访问站点。不过代理的链接并不一定保证加密。另外，代理的实现层级比较高，一般的应用程序需要主动连接代理才会进行访问。而VPN的核心特点链接加密。且VPN的实现层级比较低，可以全局起效果。

## Shadowsocks部署

### 海外服务器

任何翻墙技术的本质都是将网络流量发送给一台位于中国大陆防火墙之外的服务器，由服务器访问目标网站再把响应数据发送给客户端。因此，一台海外服务器是必须的。目前云计算技术成熟，租赁一台海外的虚拟服务器的唯一困难，基本就是你需要一张VISA信用卡来支付美元。没有VISA，PayPal应该也是可以的，PayPal可以绑定借记卡。

有非常多的厂商提供虚拟服务器租赁服务，这个可以按照价格和服务器的地理位置，根据自己的需要选择。我自己选择的是DigitalOcean位于洛杉矶的机房。Ping的延时大概在200ms以内。另外还需要补充的是，对于校园网用户，国内的校园网大多支持Ipv6且Ipv6部分的流量是不计费的。因此在租赁服务器时选择支持Ipv6的机器就非常重要了。

Shadowsocks服务对于服务器的性能要求不高，因此一般选择最便宜的一档就可以了，例如DigitalOcean最便宜的一档是1GB内存，单核CPU，25GB SSD磁盘，1 TB流量，价格5美元/月，并且支持Ipv6。

### Shadowsocks服务端安装

Shadowsocks 发展到今日已经是相当成熟的大众产品了，有众多安装方法可供选择。这里我选择了[teddysun](https://teddysun.com/)开发的一键安装脚本系列。

> teddysun 的脚本在广为流行之后，也开始面临了当局的压力，放弃了更新，并且删除了教程文章。Shadowsocks发展到今天，真是有很多人付出心血的结果。

teddysun本人的Github项目仓库的代码在master分支上还有保留，故方便使用。

一般情况下，我们使用`shadowsocks-all.sh`脚本就可以了。
