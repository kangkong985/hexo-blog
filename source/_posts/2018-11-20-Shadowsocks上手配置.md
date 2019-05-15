---
title: Shadowsocks上手配置
tags:
  - 教程
  - Shadowsocks
categories:
  - 教程
abbrlink: 37347
date: 2018-11-20 16:00:57
---

Shadowsocks配置的一个非常便利之处在于，Shadowsocks支持将配置信息导出成二维码再在其他机器上导入。这节约了很多沟通成本。所以在开始这篇教程之前，你需要有一个Shadowsocks的配置信息。可以是具体参数，或者是一个配置二维码。<!--more-->

## 1. 客户端准备

Shadowsocks提供了绝大多数平台的客户端支持，甚至包括智能路由器。我们这里介绍最为常见桌面端的平台上的配置。 这里我提供了mac和win这两个主要平台截止到目前为止最新版的客户端下载：

1. macOS客户端[下载](https://query.codewoody.com/query?bucket=default&resname=ShadowsocksX-NG.app.1.8.2.zip);

2. win客户端[下载](https://query.codewoody.com/query?bucket=default&resname=Shadowsocks-4.1.2.zip).

其中，mac文件下载下来解压缩后，直接拖拽进入`Application`文件夹（应用文件夹），然后双击打开使用就可以了。win端的文件解压缩后是一个可以直接运行的绿色版（不需要安装）。将解压缩文件移动到一个稳妥的位置，然后双击打开`Shadowsocks.exe`文件就可以了（此时右下角会出现一个小飞机图标）

> 更加丰富的客户端下载：[https://shadowsocks.org/en/download/clients.html](https://shadowsocks.org/en/download/clients.html)

## 2. 导入配置

写这篇文章的时候我使用的是mac，因此后面的配置方法过程都以mac为例。mac和win上客户端的使用都是相通的。不同的是小飞机图标在mac中位于顶部，而在win中位于底部。

![ShadowsocksX-NG右键菜单截图](https://imgs.codewoody.com/uploads/big/4a786c9b2480fd09923f5a591e5ce51a.png)

右键点击小飞机图标可以看到如上图所示的菜单。其中

1. 第一个section中，负责控制Shadowsock的开启和关闭，我这里显示的是已经开启了Shadowsocks，如果你的客户端代理还没有启动，点击一下"打开 Shadowsocks"

2. 第二个section中，可以设置Shadowsocks的代理模式。其中PAC模式是最为常用模式。在这种模式下，Shadowsocks会根据一张预先订好的表，来判断你当前访问的网址是否被墙了。如果是就会通过代理访问这个网站，否则照常直接连接网站就可以了。与之相对的，全局模式是让所有的网站都通过代理进行访问。

3. 第三个section中，可以进行服务器的配置。

    1. 如果你是使用二维码进行配置，那么，将二维码用预览打开，确保这个预览窗口位于最上层可见，然后点击菜单中的“扫描屏幕上的二维码”就可以导入服务器配置了。

    2. 如果你是使用详细配置信息进行配置，那么需要进入服务器 -> 服务器设置，手动填写各个参数进行添加。

4. 第四个section是用来配置本地代理和PAC的，对于这部分的详细讨论超出了这篇文章的范畴，我们会在后续的文章中进行讨论。

## 3. 手机端配置

由于政策原因，手机端APP，尤其是iOS的手机端APP的审查情况非常严重，基本上很少有APP能够长期屹立不倒。因此手机端APP的选择要实时来看。我自己使用的SuperWingy这个应用已经下架了（不过从已购里面还是可以下载的）。因此，大家发现还有什么可以用的手机端应用，就更新在评论里把。
