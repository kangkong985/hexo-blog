---
title: Shadowsocks：多用户账号独立，并限制用户连接数
tags:
  - 教程
  - Shadowsocks
categories:
  - 教程
abbrlink: 7835
date: 2018-11-13 16:50:23
---
自己搭建了一个SS服务器以后，自然而然的会同身边的朋友共享。自然，身边的朋友一起用，大部分服务器配置都可以毫无压力的支撑。但倘若一传十十传百，最后成百上千的人一起用一个服务器，那就撑不住了。
当然你可以隔一段时间换一次密码，但是后面的麻烦事也不少（要同步更新不同设备上的设置，身边的朋友来问你新设置）。
几天我研究了一下，为ss服务器增加了多用户即为每个用户设置独立的连接数限制的方法，这样能够比较完美的解决同朋友共享服务器的问题了。
<!--more-->

这里默认你已经知道怎么按照通常的方法安装和配置SS了。如果你不了解的话，网络上的文章很多的。

## 多用户的实现
多用户的实现比较简单，Python和Go实现的服务器自带多用户支持。通常的配置我们一般是这么写
``` JSON
{
  "server": "::",
  "server_port": "8888",
  "password": "yourpassword"
  // Other configs
}
```
只需要将配置文件按照下面的方式进行修改就可以实现多用户了。
``` JSON
{
  "server": "::",
  "port_password": {
    "8881": "password1",
    "8882": "password2",
    "8883": "password3"
  }
  // other configs
}
```
就可以了。之后不同的用户可以通过不同的端口访问，而每个端口都有独立的密码。

> Further Reading: [Reference](https://github.com/shadowsocks/shadowsocks/wiki/Configure-Multiple-Users)

## 限制用户连接

我在网上调查了一下实现限制用户连接的方法，很多都提到了通过`iptables`来进行设置。但是这种方法太过复杂，很容易出问题。后来我找到一个ss的补丁，可以比较好的解决这个问题。补丁地址是[falssen/PySocket](https://github.com/falseen/PySocket)。
这个工程提供了一些其他的功能，但是我们这里只关注`Limit_Clients`文件夹下的`socket.py`这个文件。这个文件的原理是利用Python包导入的机制，用自定义的`socket.py`来替换默认的`socket`包，并在`socket`接口中植入一些新的功能。
~~按照`READMe.md`的提示安装好`socket.py`文件~~
> 有很多朋友不知道这里要怎么处理socket.py文件。其实并不复杂。用`which`命令查看一下ss脚本安装的位置，一般情况下是`/usr/local/bin/`，那么你只需要把`socket.py`文件放到`/usr/local/bin`下面就行。这一操作的原理是，python在导入包时总是先检查当前目录。注意，如果修改了`socket.py`文件，需要重启进程才能生效。

然后修改文件中`white_list`和`black_list`两个变量。例如我自己使用的`1017`端口，我不希望添加限制，则将`white_list`设置为
``` python
white_list = [1017]
```
我给朋友们用的是[1018]端口，我希望这个端口的连接数不要超过40个，则将`black_list`设置为
``` python
black_list = {1018:40}
```

## 注意

注意方法的实质是限制接入的客户端IP数量，因此，处在同一路由器下面的多台设备也会被识别为一台。

## 更多阅读

- [Shadowsocks中继：从IPv4到IPv6](posts/6289/): 目前防火墙越加越高，遇到重大事件的时候，很多梯子都会挂掉。不过，有个好消息是，因为IPv6网络在国内的普及率还不高，因此IPv6还没有被特别针对。如果你有IPv6资源（一般教育网支持IPv6），可以将Shadowsocks通信从IPv4转化成IPv6再出去，会更加安全可靠一些。
- [Shadowsocks性能优化](posts/35429/)
