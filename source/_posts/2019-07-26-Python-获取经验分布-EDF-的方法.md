---
title: 'Python: 获取经验分布(EDF)的方法'
tags:
  - python
  - 数学
  - 科研
  - 教程
categories:
  - 科研
mathjax: true
abbrlink: 42351
date: 2019-07-26 13:36:50
---

## 什么是经验分布EDF

[经验分布函数](https://zh.wikipedia.org/wiki/%E7%BB%8F%E9%AA%8C%E5%88%86%E5%B8%83%E5%87%BD%E6%95%B0)（Empirical Distribution Function）是统计学中一个与样本的经验测度有关的分布函数。该累积分布函数是在所有$n$个数据点上都跳跃$1/n$的阶跃函数。对于被测随机变量的某个可能取值而言，EDF在这个取值处的值为所有观测样本中小于或者等于该取值的比例。

经验分布函数是对用于生成样本的累积分布函数的估计。根据Glivenko-Cantelli定理可以证明，经验分布函数以概率1收敛至这一累积分布函数。

令$(x_1, \dots, x_n)$为独立同分布的的实随机变量，它们共同的累积分布函数为$F(t)$。于是，经验分布函数可以定义为

\begin{equation}
\hat{F}_{n}(t)=\frac{\text { number of elements in the sample } \leq t}{n}=\frac{1}{n} \sum_{i=1}^{n} \mathbf{1}_{x_{i} \leq t}
\end{equation}

其中$\mathbf{1}_{A}$ 为事件 $A$ 的指示函数。 $\mathbf{1}_{x_i \leq t}$为$p=F(t)$是伯努利随机变量。因而$n \hat{F}_n(t)$则是期望为$nF(t)$，方差为$nF(t)(1 - F(t))$的二项随机变量。这意味着$\hat{F}_n(t)$是$F_(t)$的无偏估计。

![蓝线为经验分布函数，黑色长条表示相应的样本，灰线则是用于生成样本的累积分布函数。](https://imgs.codewoody.com/uploads/big/9bb7d75a59e3cc5467cd6461b3732198.png)

## Python实现

从上面的定义来看，其实自己实现一个EDF函数也并不困难。这里有一个例子：[Calculate ECDF in Python](https://www.codementor.io/kripanshubharga/calculate-ecdf-in-python-gycltzxi3)。`statsmodels`这个库里面提供了现成的[`ECDF`函数](https://www.statsmodels.org/devel/generated/statsmodels.distributions.empirical_distribution.ECDF.html)。

> 这里函数名字是ECDF，其中C表示累积分布。

```python
>>> import numpy as np
>>> from statsmodels.distributions.empirical_distribution import ECDF
>>>
>>> ecdf = ECDF([3, 3, 1, 4])
>>>
>>> ecdf([3, 55, 0.5, 1.5])
array([ 0.75,  1.  ,  0.  ,  0.25])
```
