---
title: 部署Pritunl来使用OpenVPN
tags:
  - 教程
  - vpn
categories:
  - 教程
abbrlink: 23676
date: 2019-06-13 14:16:27
---

![Pritunl](https://imgs.codewoody.com/uploads/big/0f3a766a78effb06b6770d8a61ad2e55.png)
<!--less-->

## Why VPN

为什么要使用VPN？尤其是，为什么个人用户需要使用VPN呢？其实如果你只有一台电脑，其实一般用不上VPN（当然，用VPN来翻墙另说），如果你有多个电脑，甚至是服务器，这些服务器的网络情况还比较复杂，而你希望随时随地方便地访问这些机器，那么建立VPN虚拟网络将这些机器连接起来就能极大的方便访问过程。例如，如果一台服务器是在路由器后面，没有公网IP，与其在路由器上配置复杂的端口映射表，不如通过VPN网络自由地访问各个端口。又例如在一些特定的场景下，一些服务器的低位（1024以下）端口的访问会收到限制，这个也可以同VPN来解决。

当然，还有可能，你处于校园网中，而你通过种种途径有了一个无限流量服务器，通过VPN，可以让你在校园网场景下能够随时通过这台服务器上网，从而免去流量费用。另外，将这一宝贵资源分享给同学使用，用VPN也非常方便。

## Why Pritunl

我试过很多VPN方案，例如PPTP，OpenVPN，IPSec等等。其实使用VPN过程中的一个痛点在于用户管理要尽可能方便，虽然我也比较多的在用命令行工具，但是使用命令行工具去管理用户体验还是非常差。Pritunl提供了OpenVPN的网页GUI管理界面。这也是我为什么推荐使用Priunl的原因。而且，Pritunl中免费用户就可以使用无数量限制的账户和设备，这对于个人用户来说足够了。

另一方面，Pritunl的客户端支持也非常全面

## How to deploy

### Installation

官方文档在这里: [Installation](https://docs.pritunl.com/docs/installation)。事实上按照官方文档的推荐，Pritunl最好部署在企业级的Linux OS上，如Red Hat, Oracle Linux, CentOS等。不过对于个人用户，对于性能，稳定性和安全性要求没有那么严格的情况下，用Debian系的系统也未尝不可。我的Pritunl服务器就是部署在Ubuntu上的，几个月使用下来，性能和稳定性都非常好。

对于不同版本的系统，安装脚本不同。例如，Ubuntu 16.04，安装脚本如下：

```shell
sudo tee /etc/apt/sources.list.d/mongodb-org-4.0.list << EOF
deb https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/4.0 multiverse
EOF

sudo tee /etc/apt/sources.list.d/pritunl.list << EOF
deb http://repo.pritunl.com/stable/apt xenial main
EOF

sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com --recv 9DA31620334BD75D9DCB49F368818C72E52529D4
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com --recv 7568D9BB55FF9E5287D586017AE645C0CF8E292A
sudo apt-get update
sudo apt-get --assume-yes install pritunl mongodb-org
sudo systemctl start pritunl mongod
sudo systemctl enable pritunl mongod
```

### Configuration

在安装完Pritunl之后，访问服务器的443端口，即可以看到配置引导界面。

![配置界面](https://imgs.codewoody.com/uploads/big/04288b446ec0e7ad27b790dd4890d71b.png)

其中需要输入的主要是第一项Setup Key。数据库部分，如果你是使用上面的脚本安装的话，那么Pritunl服务本机上就已经安装运行了MongoDB，这里第二个配置MongoDB URI就不需要变动。要获取Setup Key，ssh进入部署服务器，运行`pritunl setup-key`即可.

完成这一步设置以后就来到管理员登录界面：

![管理员登录界面](https://imgs.codewoody.com/uploads/big/5310344dc5cd485d83835f900fdf38df.png)

初始时用户名和密码都是`pritunl`，在完成第一次登录之后会被要求修改管理员的用户名和密码：

![修改密码](https://imgs.codewoody.com/uploads/big/88164d6b435cfb64cc84a35bd6188235.png)

## Further Reading

Pritunl的使用方法非常直观，文档可以参见[Connecting](https://docs.pritunl.com/docs/connecting).
