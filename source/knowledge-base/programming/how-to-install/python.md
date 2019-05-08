---
title: 如何安装Python
date: 2019-05-08 16:16:41
---

## 在Ubuntu下安装Python 3.7

### 安装Python

#### python3.7

以下安装脚本在Ubuntu 16.04上测试通过，引用自[How to Install Python 3.7 on Ubuntu 18.04](https://linuxize.com/post/how-to-install-python-3-7-on-ubuntu-18-04/)

```shell
sudo apt update
sudo apt install software-properties-common

sudo add-apt-repository ppa:deadsnakes/ppa
# When prompted press Enter to continue:

sudo apt install python3.7

python3.7 -v

# 这里安装后只有python3.7的命令可以用，为了使用python命令，使用如下命令
sudo ln -s $(which python3.7) /usr/bin/python
```

> 注意，可以在安装pip的同时一并安装python3。详情见下面。

### 安装pip

#### pip for python3.6

为Python3安装pip的方法如下：

```shell
$ sudo apt update
$ sudo apt install python3-pip
$ pip3 --version

pip 9.0.1 from /usr/lib/python3/dist-packages (python 3.6)
```

注意，按照这种方法会连通python3一起安装。如果你用上面的方法安装了python3.7，那么在运行上面的脚本以后会同时存在3.7和3.6两个版本的python.

#### pip for python3.7

经过实验，比较保险可靠的是如下的方法：

1. 首先按照前面的方法安装好Python3.7
2. 执行下面的命令：

```shell
curl -s -L https://bootstrap.pypa.io/get-pip.py | sudo python3.7
```

#### pip for python2

为python2安装pip的方法如下：

```shell
sudo apt update
sudo apt install python-pip
pip --version
```

同样，上面的脚本也会自动安装python2及其他必要的依赖。

## Reference

- [How to Install pip for python 3.7 on Ubuntu 18?](https://stackoverflow.com/questions/54633657/how-to-install-pip-for-python-3-7-on-ubuntu-18)
- [get-pip.py](https://bootstrap.pypa.io/get-pip.py)