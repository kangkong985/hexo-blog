---
title: 延时分析
date: 2019-05-17 14:29:21
mathjax: true
---

在这篇文章中，我们利用之前提到过的二维马尔可夫模型针对传输延时进行分析。这篇文章主要参考了[@liu2017joint]这篇文章。该文章内的马尔科夫链中的变量定义和[@bianchi2000performance]中的有点不同。我们先梳理一下[@liu2017joint]中马尔科夫链。

## 二维马尔科夫过程

对于使用IEEE802.11 DCF机制的节点的退避过程，可以用如下图所示的二维马尔科夫链表示：

![二维马尔科夫链表示](https://imgs.codewoody.com/uploads/big/84f08989447e4bc20711e7b76c0bb65a.png)

其中状态变量定义为$\{s(t), b(t)\}$，$s(t)\in \{0, 1\}$代表车辆是否有包**等待**发送。$b(t)\in \{0, 1,2, \dots, W_e-1\}$代表了退避计数器的值。进而马尔科夫链的转移概率为：

\begin{equation}
\left\{\begin{array}{l}{P\{0, k | 0, k+1\}=1-p, k \in\left[0, W_{s}-2\right]} \\ {P\{0, k | 0, k\}=p} \\ {P\{0, k | 0,0\}=p\left(1-G_{t}\right) / W_{s}} \\ {P\{1, k | 0,0\}=p G_{t} / W_{s}} \\ {P\{0, k | 1, k\}=G_{s}} \\ {P\{1, k | 1, k\}=1-G_{s}}\end{array}\right.
\end{equation}

上面的公式中除了第一行，其他情况下$k\in \{0, 1, 2,\dots,W_s - 1\}$。$G_t$和$G_s$为恒定，且独立的值。
**$p$为信道被感知为繁忙的概率**（probability when a busy channel is sensed）。
$G_t$为安全消息在非竞争段产生的概率（在此区间内改包没法马上发送），$G_s$为安全消息可以进行发送的概率（即在竞争段产生的概率）。由于安全消息的生成速度是均匀的，则

\begin{equation}
G_{t}=\frac{T_{t}+T_{\mathrm{SCH}}}{T_{\mathrm{CCH}} + T_{\mathrm{SCH}}} \\
\end{equation}

\begin{equation}
G_{s}=\frac{T_{c}}{T_{\mathrm{C} \mathrm{CH}}+T_{\mathrm{SCH}}}
\end{equation}

我们进一步解释一下转移概率的各行的含义：

1. 退避计数器减一，对应感知到信道空闲
2. 退避计数器不变，对应感知到信道繁忙
3. 退避计数器从0到k，s(t)的值不变为0，从概率计算的形式来看，是感知到信道为繁忙，且包生成的时间在竞争段。
4. 退避计数器从0变成k，s(t)的值从0变成1， 从概率计算的形式来看，是感知到信道繁忙，且包生成在非竞争段（这时没法立刻发送），这个包进入等待队列。
5. s(t)变成0，意味着原先缓存的包现在可以参与发送了。
6. s(t)不变，对应当前时隙仍然不允许发送。

记平稳分布为：$b_{i, k}=\lim_{t \rightarrow \infty} P\{s(t)=i, b(t)=k\}$, $T'_{ss}$ 为平均服务时间（排队论里的概念），那么任意车辆在任意时隙里面发送的概率是

\begin{equation}
P_{\mathrm{uns}}^{\prime}=b(0,0)\left(1-e^{-\lambda_{s} T_{\mathrm{ss}}^{\prime}}\right)
\end{equation}

## 发送延时

发送延时 有如下几个部分构成：

1. 退避延时：$T_{\mathrm{sf}}$
2. 传输延时(Transmission Delay)：$T_{st}=L / R_{d}+T_{\mathrm{DIFS}}+\delta$，其中$\delta$为信道传输延时(Propagation Delay)
3. 队列等待延时：$T_{sq}$

总的延时为：$T_{\mathrm{sd}}=T_{\mathrm{sq}}+T_{\mathrm{sf}}+T_{\mathrm{st}}$。根据上面的马尔科夫过程，我们可以得到退避延时为：

\begin{equation}
\begin{aligned} E\left[T_{\mathrm{sf}}\right] &=\sum_{i=0}^{W_{s}} \frac{\left(1-G_{t}\right) p}{W_{s}} \sum_{i=0}^{W_{s}}\left(p T_{t}\right)+\sum_{i=0}^{W_{s}} \frac{G_{t} p}{W_{s}} \sum_{i=0}^{W_{s}}\left[\left(1-G_{s}\right) T_{t}\right] \\ &=\frac{p T_{t}\left(1-G_{t}\right)\left(W_{s}-1\right)\left(G_{t}+p\right)}{2} \end{aligned}
\end{equation}

对于队列等待延时部分，为了保证系统的稳定性，需要有$\lambda_{s} T_{\mathrm{serv}}<1$，其中$\lambda_s$为消息生成的速率，$T_{\mathrm{serv}}=E\left[T_{\mathrm{sf}}\right]+T_{\mathrm{st}}$。根据Pollaczek-Khintchine定理：

\begin{equation}
T_{\mathrm{sq}}=\frac{\lambda_{s} E\left[T_{\mathrm{serv}}^{2}\right]}{2\left(1-\lambda_{s} T_{\mathrm{serv}}\right)}
\end{equation}

## Reference
