---
title: 一维马尔科夫过程的使用
date: 2019-04-29 11:28:41
mathjax: true
---

## 前言

一维马尔科夫链主要应用于广播消息的性能分析。在广播通信中，不存在ACK机制，因此发送者无法判断发送是否，因此也就无法增加退避窗口并且发起重传，传统的[二维马尔科夫链](../wave.html)中的二元状态变量中的backoff stage失去意义，因此只需要用backoff counter这一个变量即可表征广播接入信道的过程。

这里整理的一维马尔科夫过程的研究主要来自于[@wang2009characterising]，同时包含饱和以及不饱和场景的性能分析。

## 一维马尔科夫链

网络结构为的单跳Adhoc网络，节点总数为$n$。传输环境为：a two-ray propagation model with no hidden terminal or capture effects，即所有的包丢失都是由于碰撞(Collision)导致的。假设每个节点每次只能缓存一个数据包，且包的到达过程为到达率为$\lambda$的Poisson过程，

![非饱和状态下的一维马尔科夫链状态转移图](https://imgs.codewoody.com/uploads/big/bcb65007d6aa7bc769fb3e51530d1ead.png)

如上图所示，退避窗口为$W$，意味着退避状态一共有$W$个，以及一个额外的Idle状态（记为$I$）。同时记包的到达概率为$q$，信道繁忙的概率为$q_b$，则有下面的概率转移矩阵：

\begin{equation}
\left\{\begin{array}{l}{P\{I | I\}=1-q} \\ {P\{k | I\}=q / W} \\ {P\{k | I+1\}=1-p_{b}} \\ {P\{k | k\}=p_{b}} \\ {P\{I | 0\}=1}\end{array}\right.
\end{equation}

下面求解稳态分布$b_k (k \in [0, W - 1])$（Idle状态的稳态概率为$b_I$），我们通过转移概率可以得到如下的方程：

\begin{equation}
b_I = \frac{1}{q}b_0
\end{equation}

\begin{equation}
b_{k}=\frac{(W-k) q}{W\left(1-P_{b}\right)} b_{I}=\frac{(W-k)}{W\left(1-P_{b}\right)} b_{0} \quad k \in[1, W-1]
\end{equation}

\begin{equation}
b_{I}+b_{0}+\sum_{k=1}^{W-1} b_{k}=1
\end{equation}

当backoff counter为0时节点开发发送，则$b_0$为传输概率(transmission probability) $\tau$。通过上面的三个公式组成的方程，我们可以得到：

\begin{equation}
\label{tau}
\tau=b_{0}=\left(\frac{1}{q}+1+\frac{(W-1)}{2\left(1-P_{b}\right)}\right)^{-1}
\end{equation}

在得到传输概率以后，通过经典文章[@bianchi2000performance]我们可以计算吞吐率性能。不过我们在这里的模型中增加了Idle状态，因此分析会有一点不同。

记$P_b$为信道繁忙的概率，$P_s$为传输成功的概率，则：

\begin{equation}
\label{Pb}
\begin{aligned} P_{b} &=1-(1-\tau)^{n-1} \\ P_{s} &=n \tau(1-\tau)^{n-1} \end{aligned}
\end{equation}

按照[@bianchi2000performance]的方法，将两次backoff状态之间的间隔定义为一个slot（virtual slot），则virtual slot可能包含一个空的slot，一次冲突，或者一次成功的发送。那么有：

\begin{equation}
\text {SlotTime}=(1-\tau)^{n} \sigma+\left(1-(1-\tau)^{n}\right) T
\end{equation}

由于在广播中，没有RTS/CTS，也没有ACK，那么一次冲突和一次成功发送占用信道的时间是一样的：

\begin{equation}
T=\frac{H+E[P]}{R}+D I F S+\delta
\end{equation}

这里$H$为物理层帧头和MAC层帧头的大小，$R$为发送速率。由于我们假定包的生成过程是Poisson过程，则

\begin{equation}
\label{q}
q=1-e^{-\lambda S l o t T i m e}
\end{equation}

通过联立求解$\eqref{tau}, \eqref{Pb}, \eqref{q}$非线性方程组，我们可以得到归一化吞吐率性能

\begin{equation}
S=\frac{P_{s} E[P]}{S l o t T i m e}
\end{equation}

> 上面描述的是非饱和状态下的性能计算过程，但是当$\lambda$趋近于无穷大，即$q$趋向于1时，即可以得到饱和场景下的通信性能。

## Reference
