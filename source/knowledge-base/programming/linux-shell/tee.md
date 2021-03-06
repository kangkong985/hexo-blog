---
title: TEE
date: 2019-06-11 10:39:11
---

## 简介

tee命令用于将数据重定向到文件，另一方面还可以提供一份重定向数据的副本作为后续命令的stdin。简单的说就是把数据重定向到给定文件和屏幕上。

![](https://imgs.codewoody.com/uploads/big/2e6e075cd57ca3a47a0a4155d873063e.gif)

存在缓存机制，每1024个字节将输出一次。若从管道接收输入数据，应该是缓冲区满，才将数据转存到指定的文件中。若文件内容不到1024个字节，则接收完从标准输入设备读入的数据后，将刷新一次缓冲区，并转存数据到指定文件。

## 使用

```shell
tee [options] params
```

其中options包括：

1. `-a`: 向目标文件写入时采用追加模式
2. `-i`: 忽略中断信号

params为输出文件
