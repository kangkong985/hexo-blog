---
title: 如何安装node.js
date: 2020-01-15 16:00:12
---

## Ubuntu 16.04

```shell
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm

# 以下是安装yarn的方法
# 如果没有安装 curl 使用 sudo apt-get install curl 安装
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt update
sudo apt install yarn
```

### yarn使用出错的问题

安装 yarn 后可能会出现 Unexpected token 问题，如下图：

![](https://imgs.codewoody.com/uploads/big/e52a61dc48dadc1ed5c8d33c9dccde1c.png)

这是因为默认情况下安装的 nodejs 版本比较老 (我这里显示是v4.2.6)。要升级到10.x版本，可以采用下面的办法：

```shell
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -

apt-get install -y nodejs
```

### yarn global 安装的工具命令不可用的问题

这是因为yarn global安装的路径不在环境变量 PATH 里面。将下面的内容添加到shell配置里面就可以了。
```shell
export PATH="$PATH:$(yarn global bin)"
```