---
title: Matplotlib in Virtualenv
tags:
  - 教程
  - debug
  - python
categories:
  - 教程
abbrlink: 30912
date: 2019-05-16 13:56:36
---

我使用的是macOS系统。当在虚拟环境中尝试使用matplotlib时，会出现如下的报错：

```text
ImportError: Python is not installed as a framework. The Mac OS X backend will not be able to function correctly if Python is not installed as a framework. See the Python documentation for more information on installing Python as a framework on Mac OS X. Please either reinstall Python as a framework, or try one of the other backends. If you are using (Ana)Conda please install python.app and replace the use of 'python' with 'pythonw'. See 'Working with Matplotlib on OSX' in the Matplotlib FAQ for more informatio
```

<!--more-->

根据错误信息，要么我们使用Python as Framework，要么我们更换使用的后端（backend）。Matplot专门就matplotlib的后端问题有一个网页：[Working with Matplotlib in Virtual environments](https://matplotlib.org/faq/virtualenv_faq.html)。文章中提到，`Tk`这个框架（即`TkAgg`后端）一般来说总是可用的，不需要额外的外部依赖。（不过在特定的Linux发行版本中可能需要安装`python-tk`）。要使用`Tk`需要做如下配置过程：

```python
import matplotlib
matplotlib.use("TkAgg")
import matplotlib.pylab as plt
```

每次这么配置比较麻烦，我们可以通过`~/.matplotlib/matplitlibrc`文件来固化配置（如果这个文件不存在可以手动创建），文件中添加如下内容：

```text
backend: TkAgg
```

不过我在使用过程中发现使用`TkAgg`时会出现系统级的错误，抛出了`Terminating app due to uncaught exception`的错误。因此我尝试替换成其他后端。我主要选择包括：

![Matplotlib可用后端类型](https://imgs.codewoody.com/uploads/big/bdd0f72aede5a20bf5378bc373287e55.png)

而又因为`PySide`只支持比较早的python版本，因此我选择了Qt5作为后端。在这之前，我们需要安装下面的依赖

```shell
brew install qt
pip install PySide2
```

安装完成后配置过程和`TkAgg`的类似，后端的名字为`QT5Agg`。
