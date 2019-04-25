---
title: 'Hexo+Next: 使用Latex公式'
tags:
  - 教程
  - hexo
categories:
  - 教程
mathjax: true
abbrlink: 20215
date: 2019-04-24 12:55:54
---

这次更换主题的很大一个动因就是因为在NexT这个主题上，开启Latex的支持很方便。网上关于这方面的文章其实不少，但是大部分都不全面，照本宣科下来，很可能不能用。这些教程一般就给了`_config.yml`文件的配置以及`pandoc`依赖安装，但是一些关键细节缺失了。这篇文章里我梳理了一下整个流程。
<!--more-->

## 0. Reference

英语好的话，其实可以尝试直接阅读[官方文档](https://theme-next.org/docs/third-party-services/math-equations)。

## 1. Install Dependencies

Next支持`mathjax`和`katex`两种渲染方式，其中`katex`的速度更快，但是对于Latex的支持有一定的限制。所以除非你的博客数量实在是过于庞大，不然就可以直接使用`mathjax`。

`mathjax`可以选用下面两种渲染引擎的中的任一一种

- `hexo-renderer-kramed`
- `hexo-render-pandoc`

{% note info %}
使用`hexo-render-pandoc`还需要安装pandoc渲染引擎。其安装方法可以参考
[pandoc官网](http://pandoc.org/installing.html)。如果在macOS上可以使用
[Homebrew](https://brew.sh/)安装.
{% endnote %}

这里以`pandoc`为例：

```shell
# 需要先卸载默认的渲染引擎
npm un hexo-renderer-marked --save
npm i hexo-renderer-pandoc --save
```

{% note danger %}
替换渲染器之后会导致NexT note功能出现问题，note内的元素内容无法渲染，会输出markdown源代码。
这个问题我在`hexo-render-pandoc`上提了一个[Issue](https://github.com/wzpan/hexo-renderer-pandoc/issues/33)，看原作者什么时候能够更新解决吧。
{% endnote %}

## 2. Configuration

配置NexT主题的`_config.yml`文件

```yaml
math:
  enable: true
  ...
  engine: mathjax
  #engine: katex
```


很多文章都漏掉了在配置中一个重要的信息：在主题配置`math`下有一个名为`per_page`的选项，其值为`true`或者`false`。这个选项用来控制是否对每个篇文章都渲染数学公式。默认情况下是`true`，这意味只对Front Matter中含有`mathjax: true`的文章进行公式渲染。将`per_page`设置为`false`，则会对每一篇文章都尝试进行公式渲染。

由于公式渲染时一个很费时的操作，因此还是保持默认配置，通过Front Matter进行渲染控制.

## 3. How to use

### 3.1 行内嵌套公式

如：质能方程$e=mc^2$

```latex
如：质能方程$e=mc^2$
```

### 3.2 独占一行的公式

如：
$$
1=\sum_{i=0}^{m}\sum_{k=0}^{W_i-1}b_{i,k}=\sum_{i=0}^{m}b_{i,0}\sum_{k=0}^{W_i-1}\frac{W_i-k}{W_i}=\sum_{i=0}^{m}b_{i,0}\frac{W_i+1}{2}\\
=\frac{b_{0,0}}{2}\left[W\left(\sum_{i=0}^{m-1}(2p)^i+\frac{(2p)^m}{1-p}\right) + \frac{1}{1-p}\right]
$$

```latex
如：
$$
1=\sum_{i=0}^{m}\sum_{k=0}^{W_i-1}b_{i,k}=\sum_{i=0}^{m}b_{i,0}\sum_{k=0}^{W_i-1}\frac{W_i-k}{W_i}=\sum_{i=0}^{m}b_{i,0}\frac{W_i+1}{2}\\
=\frac{b_{0,0}}{2}\left[W\left(\sum_{i=0}^{m-1}(2p)^i+\frac{(2p)^m}{1-p}\right) + \frac{1}{1-p}\right]
$$
```

{% note info %}
更多latex的使用方法，请参考官方文档
{% endnote %}