---
title: WAVE标准中的Beacon性能简化分析
date: 2019-05-07 13:35:41
mathjax: true
---
在很多使用WAVE作为车联网通信标准的文献研究中[@zhang2014scalable] [@hafeez2013performance]，在遇到Beacon时通常会简化其退避过程。由于Beacon的生命周期有限，无法接受无止限的退避，因此，可以令其简化为只进行一轮退避，从而略过退避窗口指数增长的过程。此时Beacon的发送过程简化为一维马尔科夫过程。

## 非马尔科夫链方法

不使用马尔科夫链的方式整理自[see @zhang2014scalable]. 这篇文章主要的贡献是设计了长度可变的CCHI。

### System Model

在节点访问信道前，需要侦听信道处于空闲的时间超过DIFS。如果DIFS之后信道仍然空闲，那么节点可以立即开始发送。否则，节点需要进行一段退避(_Backoff Counter_)，Backoff Counter从$[0, W-1]$中随机取出。$W$被称为退避窗口(_CW_)。Backoff Counter在每一段空闲的时隙结束后减一。当Backoff Counter递减至0时，节点开始访问信道。

考虑到：

1. Backoff Counter的初始值不会为0；
2. Guard Interval内信道被判定为繁忙。

因此在CCHI开始所有车辆都需要进行退避。

除了上面的描述之外，这篇文章的推导还包含如下前提假设：

1. 完美的信道条件
2. 通信链路对称
3. 每个车辆的通信范围固定且相通
4. 载波侦听范围和通信范围一致

### CCH完全传输时间

假设各车退避过程独立，网络内任意节点之间的的距离不超过两跳<sup title="Assume there are N vehicles within the two-hop transmission range of each other so that messages are irretrievably corrupted if their transmissions overlap in time">?</sup>。
考虑概率$P(l, n, w, k)$表示$n$个车辆在CCHI开头产生了Beacon包，竞争窗口大小为$w$，第一次发送尝试为$l-1$，$k$辆车在第$l$个时隙尝试传输（$k\leq n$），此概率值为：

\begin{equation}
\begin{aligned}
P(l, n, w, k)&=\left(1-\frac{l-1}{w}\right)^{n} \cdot \left( \begin{array}{c}{n} \\ {k}\end{array}\right)\left(\frac{1}{w-l+1}\right)^{k}\left(1-\frac{1}{w-l+1}\right)^{n-k} \\
&= \left( \begin{array}{c}{n} \\ {k}\end{array}\right) \cdot \frac{(w-l)^{n-k}}{w^n} \\
&= \left( \begin{array}{c}{n} \\ {k}\end{array}\right) \cdot \left(1 - \frac{l}{w}\right)^{n-k} \cdot \frac{1}{w^{k}}.
\end{aligned}
\label{P}
\end{equation}

考虑到Backoff Counter的最大值是$w$，完成所有Beacon包传输需要的平均时间为

\begin{equation}
\label{T}
T(w, n)=\sum_{l=1}^{w} \left\{\begin{array}{l}{P(l, n, w, 1)\left[T_{s}+T(w-l, n-1)\right]} \\ {+\sum_{k=2}^{n} P(l, n, w, k)\left[T_{c}+T(w-l, n-k)\right]}\end{array}\right\}
\end{equation}

其中$T_{s}=L / R_{d}+D I F S+\delta$的代表了一次成功的传输持续的时间。其中$L$表示平均包大小，$R_d$表示系统的传输速率，$\delta$表示传输延时<sup title="这里没有考虑ACK或者RTS/CTS等机制">?</sup>。$T_{c}=L / R_{d}+E I F S+\delta$表示发生碰撞后的持续时间。

{% note info %}
这里$T_c$的计算和我们在[WAVE](./)中提到的推导里的$T_c$的有点不同，这里可以认为是所有包的大小一致的特殊情形。
{% endnote%}

在$\eqref{T}$中，求和的第一项表示的是只有一个节点选择了最早的发送时刻，此时能够成功发送。后一项表示的是超过一个节点选择在最早的发送时刻传输，导致冲突。

记节点的总数是$N$，退避窗口的大小是$W$，则$T(W,N)$可以通过迭代求出。

{% note danger %}
当$W$和$N$比较小时，$T(W,N)$会小于50ms，那么多余的CCHI被浪费了。反之，当$W$和$N$比较大时，$T(W,N)$会大于50ms，那么会有包无法发送而丢失掉。
{% endnote %}

### CCH丢包率

我们定义$L(W,N)$为在一个CCHI内发生碰撞的包的数量。则

\begin{equation}
\label{L}
L(w, n)=\sum_{l=1}^{w} \left\{\begin{array}{l}{P(l, n, w, 1) \cdot L(w-l, n-1)} \\ {+\sum_{k=2}^{n} P(l, n, w, k)[k+L(w-l, n-k)]}\end{array}\right\}
\end{equation}

根据$\eqref{P}$和$\eqref{L}$，通过迭代计算可以给出丢包率：

\begin{equation}
\label{packet-loss-rate}
P(W, N)=\frac{L(W, N)}{N}
\end{equation}

数值计算$P(W, N)$的值发现，丢包率即便在通常的的$W$和$N$取值内也非常高。通过提升竞争窗口可以改善这个丢包率，但是考虑到事实上CCHI的长度是有限的，而提高竞争窗口会推高$\eqref{T}$的值。如果将总传输时间$T(W,N)$值推高到50ms以上，那么50ms后续的包都会丢掉。综上可见，丢包率的改善是有上限的，且这个上限可能并不会达到100%.

## 马尔科夫链方法

马尔科夫链主要参考是的是[@hafeez2013performance].



## Reference
