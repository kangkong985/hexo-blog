---
title: 二维马尔科夫链的使用
date: 2019-07-30 21:41:12
mathjax: true
mathjaxext:
  - "AMSmath.js"
  - "AMSsymbols.js"
---

## 前言

二维马尔科夫链是在涉及包含退避过程的DCF机制的最常用模型。这部分理论工作的文章大部分可以追溯到Bianchi在2000年的经典论文[@bianchi2000performance]。这篇论文在过去近20年里获得了将近一万条引用。这篇文章我们在介绍[WAVE协议](/knowledge-base/academic/its/wave/wave.html)时详细提到过。

## Bianchi的经典论文

## 引入信道繁忙条件

这部分的内容主要来自[@eustathia2002csma]。

### System Model

沿用了Bianchi的假设条件，包括有限数量的通信节点($n$个)以及理想信道条件。这篇文章中研究的是饱和条件下的稳态性能。饱和条件意味着对于每个节点，当其完成一次传输时，立刻就有一个新的包等待传输。

文章采用的DCF机制是经典的DCF机制，核心特点包括指数增长的退避窗口，在退避期间信道繁忙时，退避计数器的值冻结。退避窗口到达最大以后，停止增长。若发送失败，则窗口保持最大值。反之，如果发送成功，则重置退避窗口。

随机变量的定义则如下：$b(t)$定义为在t时隙上的退避计数器取值。每个节点退避窗口的定义为
\begin{equation}
\begin{array}{l}
W_{\min} = W \\
W_{\max} = 2^{m} W
\end{array}
\end{equation}
即共有$m+1$个退避阶段(backoff stage)。$s(t)$为用来表示退避阶段的随机变量。那么二元随机过程$\{s(t), b(t)\}$构成二维离散马尔科夫链。记条件碰撞概率为$p$，信道繁忙概率为$p_b$。假定$p$与$p_b$与退避过程无关。当$W$和$n$比较大时此假设更加准确。

二元随机过程$\{s(t), b(t)\}$的状态值记为$\{i, k\}$。其中$0 \leq i \leq m, 0 \leq k \leq W_i - 1$, 其中$W_i = 2^i W$。模型中还存在另一个状态$\{-1, 0\}$。这个状态代表当退避计数器为0，且经过DIFS时间后信道空闲时，节点会在当前时隙立即发送数据。$\{-1, 0\}$这个状态刻画了此行为。这个状态未在Bianchi的模型中引入。

概率转移图如下：

![](https://imgs.codewoody.com/uploads/big/b9caa185947e66233862ca27916c7921.png)

转移概率为：

\begin{equation}
\left\{
  \begin{array}{ll}
  P\{-1, 0 | -1, 0\} = (1 - p) (1 - p_b) \\
  P\{0, k | -1, 0\} = \frac{(1 - p)p_b + p}{W_0}, & 0 \leq k \leq W_0 - 1 \\
  P\{i, k | i, k\} = p_b, & 1 \leq k \leq W_i - 1 \quad 0 \leq i \leq m \\
  P\{i, k | i, k + 1\} = 1 - p_b, & 1 \leq k \leq W_i - 2 \quad 0 \leq i \leq m \\
  P\{0, k | i, 0\} = \frac{(1 - p)p_b}{W_0}, & 0 \leq k \leq W_i - 1 \quad 0 \leq i \leq m \\
  P\{-1, 0 | i, 0\} = (1 - p)(1 - p_b), & 0 \leq i \leq m \\
  P\{i, k |  i - 1, 0\} = \frac{p}{W_i}, & 1 \leq k \leq W_i - 1 \quad 0 \leq i \leq m \\
  P\{m, k | m, 0\} = \frac{p}{W_m}, & 0 \leq k \leq W_m = 1
  \end{array}
\right.
\end{equation}

其中：

1. 第一项指经过前一个成功的发送之后又观察到信道空闲并立刻发送当前数据包；
2. 第二项指经过前一个成功的发送之后发送当前数据包时发现信道繁忙或者发送产生了碰撞，从而进入退避状态；
3. 第三项表示在退避计数器递减过程中发现信道繁忙，故冻结计数器值；
4. 第四项表示退避计数器在空闲信道下递减；
5. 第五项表示退避计数器到0之后，当前包发送成功，但是发现发送下一个数据包时信道繁忙；
6. 第六项表示退避计数器到0之后，当前包发送成功且被成功接收，且检测到信道空闲。
7. 第七项表示退避计数器到0之后传输失败，增加退避窗口；
8. 第八项表示达到了最大退避窗口后，传输失败，但是退避窗口不再增加。

接下来我们需要计算稳态概率分布。记平稳分布为$b_{i, k} = \lim_{t\rightarrow \infty} P\{s(t) = i, b(t) = k\}$。对于平稳分布我们有如下的关系：
\begin{equation}
b_{i, 0}=p^{i} b_{0,0} 0 \leq i \leq m-1
\end{equation}
\begin{equation}
b_{m, 0}=\frac{p^{m}}{1-p} b_{0,0}
\end{equation}
\begin{equation}
b_{i, k}=\frac{W_{i}-k}{W_{i}} \frac{1}{1-p_{b}} b_{i, 0} \quad 0 \leq i \leq m 1 \leq k \leq W_{i}-1
\end{equation}
\begin{equation}
b_{0,0}=\frac{p_{b}+p\left(1-p_{b}\right)}{1-p_{b}} b_{-1,0}
\end{equation}

然后使用正则化条件

\begin{equation}
b_{-1,0}+\sum_{i=0}^{m} \sum_{k=0}^{W_{i}-1} b_{i, k}=1
\end{equation}

经过推导可以得到

\begin{equation}
b_{-1,0}=\frac{2\left(1-p_{b}\right)^{2}(1-2 p)(1-p)}{2\left(1-p_{b}\right)^{2}(1-2 p)(1-p)+\left(p_{b}+p\left(1-p_{b}\right)\right)(1-2 p)(W+1)+p W\left(p_{b}+p\left(1-p_{b}\right)\right)\left(1-(2 p)^{m}\right)}
\end{equation}

已知平稳分布以后，我们可以计算对于某个节点任意时隙的传输概率

\begin{equation}
\tau=\sum_{i=-1}^{m} b_{i, 0}=b_{-1,0}+\sum_{i=0}^{m-1} b_{i, 0}+b_{m, 0}
\end{equation}

> 当退避计数器到0时，节点即会尝试发送数据包。

这个公式全部展开也非常长，不过也是简单的多项式计算

\begin{equation}
\label{eq:transmission_prob}
\tau=\frac{2\left(1-p_{b}\right)(1-2 p)}{2\left(1-p_{b}\right)^{2}(1-2 p)(1-p)+\left(p_{b}+p\left(1-p_{b}\right)(1-2 p)(W+1)+p W\left(p_{b}+p\left(1-p_{b}\right)\right)\left(1-(2 p)^{m}\right)\right.}
\end{equation}

进而得到碰撞概率为
\begin{equation}
\label{eq:collision_prob}
p=1-(1-\tau)^{n-1}
\end{equation}

信道繁忙的概率为

\begin{equation}
\label{eq:medium_busy_prob}
p_{b}=1-(1-\tau)^{n}
\end{equation}

将$\eqref{eq:collision_prob}$及$\eqref{eq:medium_busy_prob}$代入$\eqref{eq:transmission_prob}$可以得到关于$\tau$的非线性方程。此方程可以通过数值方法求解。

### 性能分析

类似Bianchi的做法，这里认为对于每一次传输，无论成功与非，都视为一个**更新过程**。因此，可以计算相邻两次传输之间的CSMA/CA协议的吞吐率。此时吞吐率$S$可以表达为:

\begin{equation}
\begin{aligned}
S &=\frac{E[\text { time used for successful transmission in an interval }]}{E[\text { length between two consecutive transmissions }]} \\
&=\frac{P_{s} E[P]}{E[\Psi]+P_{s} T_{s}+\left(1-P_{s}\right) T_{c}} 
\end{aligned}
\label{eq:throughput}
\end{equation}

其中，$E[P]$为Payload的平均大小。$T_s$为成功传输的平均时间，$T_c$为冲突的平均持续时间。$P_s$为传输成功的概率。而$E[\Psi]$则表示在传输发生之前由于退避引入的空余时隙的长度。一般我们假定包的大小都是相同的，即$E[P] = P$。$T_s$和$T_c$的值取决于具体的DCF机制：

\begin{equation}
\begin{array}{l}{T_{\mathrm{s}}^{\mathrm{ack}}=H+P+\delta+\mathrm{SIFS}+\mathrm{ACK}+\delta+\mathrm{DIFS}} \\ {T_{\mathrm{c}}^{\mathrm{ack}}=H+P+\delta+\mathrm{DIFS}}\end{array} \} ACK CSMA/CA
\end{equation}
\begin{equation}
\begin{array}{l}{T_{\mathrm{s}}^{\mathrm{rets}}=\mathrm{RTS}+\delta+\mathrm{SIFS}+\mathrm{CTS}+\delta+\mathrm{SIFS}+H+P+\delta+\mathrm{SIFS}+\mathrm{ACK}+\delta+\mathrm{DIFS}} \\ {T_{\mathrm{c}}^{\mathrm{rets}}=\mathrm{RTS}+\delta+\mathrm{D} \mathrm{IFS}}\end{array} \} RTS/CTS CSMA/CA
\end{equation}

其中$H=\mathrm{PHY}_{\mathrm{hdr}}+\mathrm{MAC}_{\mathrm{hdr}}$为帧头，$\delta$为传输延时。传输成功要要求有且仅有一个节点参与传输，故

\begin{equation}
P_{\mathrm{s}}=\frac{n \tau(1-\tau)^{n-1}}{1-(1-\tau)^{n}}
\end{equation}

最后：

\begin{equation}
E[\Psi]=\frac{1}{p_{b}}-1
\end{equation}

注意这里的所有时间变量都是表示的时隙数量。通过上面的式子我们可以计算出吞吐率$\eqref{eq:throughput}$。

> *更新过程*:
> 相比泊松过程，更新过程约束更少，算是对泊松过程的一个推广。我们知道下面的几个定义是可以推出泊松过程的：
>
> 1. 随机变量$X_i$独立同分布（i.i.d），服从的是参数为$\lambda$指数分布；对应到达时间间隔
> 2. 随机变量$S_n = \sum_{i = 1}^{n}X_i$；对应到达时间
> 3. 随机过程$N(t) = \sup (n | S_n \leq t) P(\lambda t)$。对应发生次数。
>
> 类比过程，可以得到更新过程的定义，仅仅把1中的随机变量服从的指数分布去掉，不指定具体的分布，后续的2，3保持不变，这样的过程就是更新过程。而泊松过程是更新过程的一个特例吧！
> [来源](https://blog.csdn.net/LG1259156776/article/details/49593659)

### 延时分析

令随机变量$D$代表延时，其均值为$E[D]$。平均延时可以通过如下公式进行计算：

\begin{equation}
E[D]=E\left[N_{\mathrm{c}}\right]\left(E[B D]+T_{\mathrm{c}}+T_{\mathrm{O}}\right)+\left(E[B D]+T_{\mathrm{s}}\right)
\end{equation}

其中$E[N_c]$为一个数据包在最终被接收前经过的冲突的次数。$E[BD]$为在繁忙的信道条件下，一个节点在访问信道前经过的退避延时的平均值（包含在空闲条件下需要等待的时隙以及在繁忙条件下需要冻结退避计数器的时长）。$T_O$为在发生碰撞时，再次访问信道前需要等待的时间。而$T_c$和$T_s$的定义与上一部分吞吐率分析中定义的一致。平均碰撞次数可以用简单一维马尔科夫链的方法计算得到：

\begin{equation}
E\left[N_{\mathrm{c}}\right]=\frac{1}{P_{\mathrm{s}}}-1
\end{equation}

平均退避掩饰则取决于退避计数器的值及冻结时长。假设退避状态为$b_{i, k}$，则需要等带$k$个空时隙才能发送。那么平均退避延时可以按照如下方式计算：

\begin{equation}
E[X]=\sum_{i=0}^{m} \sum_{k=1}^{W_{i}-1} k b_{i, k}
\end{equation}

根据System Model中得到的平稳分布我们可以得到

\begin{equation}
\label{eq:backoff_decrement_slots}
E[X]=\frac{b_{0,0}}{6\left(1-p_{b}\right)} \frac{W^{2}\left(1-p-3 p(4 p)^{m}\right)+4 p-1}{(1-4 p)(1-p)}
\end{equation}

另外我们还需要计算冻结退避计数器的时间。这一时间的平均值为$E[F]$。为了计算这一均值，我们需要先计算$E[N_{Fr}]$，即退避计数器到0前会检测到的传输次数。注意到$E[X]$为退避计数器退避到0的平均时间（时隙数），而$E[\Psi]$为一次传输前需要经过的空闲时隙的数量，则我们可以计算

\begin{equation}
E\left[N_{\mathrm{Fr}}\right]=\frac{E[X]}{\max (E[\Psi], 1)}-1
\end{equation}

则

\begin{equation}
\label{eq:freeze_slots}
E[F]=E\left[N_{\mathrm{Fr}}\right]\left(P_{\mathrm{s}} T_{\mathrm{s}}+\left(1-P_{\mathrm{s}}\right) T_{\mathrm{c}}\right)
\end{equation}

结合$\eqref{eq:backoff_decrement_slots}$和$\eqref{eq:freeze_slots}$，可以得到

\begin{equation}
E[B D]=E[X]+E\left[N_{\mathrm{Fr}}\right]\left(P_{\mathrm{s}} T_{\mathrm{s}}+\left(1-P_{\mathrm{s}}\right) T_{\mathrm{c}}\right)
\end{equation}

最后，$T_O$的取值规则如下：

\begin{equation}
T_{\mathrm{O}}=\left\{\begin{array}{l}{\mathrm{SIFS}+\mathrm{ACK}_{-} \text { timeout }} \\ {\mathrm{SIFS}+\mathrm{CTS}_{-} \text { timeout }}\end{array}\right.
\end{equation}

至此我们计算得到了延时需要的所有参数。

## 非饱和条件

这部分的内容主要参考[@malone2007modeling]。之前的理论分析中大多假设了饱和的条件，即每个节点都时钟有包等待发送。这并不能很好地反应大多数实际场景。因此这篇文章在模型中引入了非饱和条件。同时，这篇文章也考虑了异构网络的问题，这里也会一并提及。

### 模型

本文的大多数假设依然沿用了Bianchi的经典假设。每个节点的状态变量为$(i, k)$，其中前者表示退避阶段(backoff stage)，后者为退避计数器的取值(backoff counter)。$k$的取值为$[0, W_i - 1]$，其中$W_i = 2^i W$为退避窗口。在信道空闲时，$k$递减。当$k=0$时，节点尝试发送。

在这里作者引入了新状态$(0,k)_e, k \in [0, W_0 - 1]$。该状态代表完成一次传输之后，没有包等待发送。这个状态被称为post-backoff。引入了新的状态的状态转移图如下：

![这张图里面我们只画了最早的两个退避阶段的状态转移，更高阶段部分的图和上面的状态转移图是一样的。](https://imgs.codewoody.com/uploads/big/f01151f6d7bcba58edda6353bfae5dc8.png)

在前两层中，$i$都是等于0的。当i > 0时，必然发生过碰撞，那么我们肯定有一个包等待发送。

假设对于每个节点都有一个固定的概率$1 - q$，在每次退避计数器递减时节点的缓冲区中没有包等待发送。反之，$q$代表了在每个虚拟时隙（Bianchi文章中的概念，相邻两次退避计数器递减的间隔为一个虚拟时隙）存在至少一个可供发送的数据包的概率。

在上面的假设下，我们可以得到转移概率，for $0 < k < W_i$:

\begin{equation}
\begin{aligned}
0<i \leq m, \quad  P[(i, k-1) |(i, k)]              & = 1 \\
             P\left[(0, k-1)_{e} |(0, k)_{e}\right] & = 1-q \\
             P\left[(0, k-1) |(0, k)_{e}\right]     & = q
\end{aligned}
\end{equation}

当计数器递减到0，且队列中有（至少一个）包时，我们开始传输。我们假设一个和节点状态有关的概率$p$为存在其他节点同时传输的概率，即为条件碰撞概率。当发生碰撞时，需要提升退避窗口。当传输成功时，退避阶段缩减为0。若不存在最大重传次数限制，我们就不需要引入额外参数了。对于$0 \leq i \leq m$和$k \geq 0$，我们有：

\begin{equation}
\begin{aligned} P\left[(0, k)_{e} |(i, 0)\right] &=\frac{(1-p)(1-q)}{W_{0}} \\ P[(0, k) |(i, 0)] &=\frac{(1-p) q}{W_{0}} \\ P[(\min (i+1, m), k) |(i, 0)] &=\frac{p}{W_{\min (i+1, m)}} \end{aligned}
\end{equation}

最后我们要回过头来讨论$(0, 0)_e$这个状态了。这个状态代表post-backoff阶段完成时，队列里面仍然为空。此时保持在这一状态下。如果有包到达，有三种可能：成功传输，碰撞，信道繁忙（此时开始0-stage退避）。我们记$P_{idle}$为信道空闲的概率。进而可以得到如下从$(0, 0)_e$出发的转移概率：

\begin{equation}
\begin{aligned}
P[(0, 0)_e | (0, 0)_e] & = 1 - q + \frac{q P_{\text{idle}} (1 - p)}{W_0} \\
k>0, \quad P\left[(0, k)_{e} |(0,0)_{e}\right] & = \frac{q P_{\text { ide }}(1-p)}{W_{0}} \\
k \geq 0, \quad P\left[(1, k) |(0,0)_{e}\right] & = \frac{q P_{\text { idle }} p}{W_{1}} \\
k \geq 0, \quad P\left[(0, k) |(0,0)_{e}\right] &= \frac{q\left(1-P_{\text { idle }}\right)}{W_{0}}
\end{aligned}
\end{equation}

> 其中重点关注一下第二项，右侧的概率可以解析为：1) 有包等待发送，2) 信道空闲，3) 没有发生碰撞，4）选择k作为退避计数器的起始值。

上面梳理了所有的转移概率，然我们可以计算平稳分布$b(i, k)$，$b(0, k)_e$。使用正则化条件：

\begin{equation}
\sum_{i = 0}^{m}\sum_{k = 0}^{W_i - 1}b(i, k) + \sum_{k = 0}^{W_0 - 1} b(0, k)_e = 1.
\end{equation}

最后得到的结果如下：

\begin{equation}
\begin{aligned}
1 / b_{(0, 0)_e} = & (1 - q) + \frac{q^2 W_0(W_0 + 1)}{2 (1 - (1 - q)^{W_0})} \\
& + \frac{q(W_0 + 1)}{2 (1 - q)} \cdot \left(\frac{q^2 W_0}{1 - (1 - q)^{W_0}} + (1 - P_{\text{idle}})(1 - q) - q P_{\text{idle}}(1 - p)\right) \\
& + \frac{pq^2}{2 (1 - q)(1 - p)} \cdot \left(\frac{W_0}{1 - (1 - q)^{W_0}} - (1 - p)P_{\text{idle}}\right)
\\
& \cdot \left(2 W_0 \frac{1 - p - p (2p)^{m - 1}}{1 - 2p} + 1\right).
\end{aligned}
\end{equation}

推导过程参加原文。然后我们可以计算传输概率$\tau = q(P_{\text{idle}})b(0, 0)_e + \sum_{i \geq 0}b(i, 0) \Rightarrow$

\begin{equation}
\tau=b(0,0)_{e}\left(\frac{q^{2} W_{0}}{(1-p)(1-q)\left(1-(1-q)^{W_{0}}\right)}-\frac{q^{2} P_{\text { idle }}}{1-q}\right)
\end{equation}

上面的式子中参数包括：$p, P_{\text{idle}}, q, W_0, m$。当$q \rightarrow 1$时，这个模型退化为Bianchi的模型。

### 异构网络模型

假设一共有$n$辆车，标记为$l = 1, \dots, n$。我们把$\tau$，$p$这些参数打上节点的下标，变成节点参数$\tau_j$和$p_l$，则有

\begin{equation}
1 - p_l = \prod_{j \neq l}(1 - \tau_j), \quad \text{for} \quad l = 1, \dots, n
\end{equation}

**待续**

## 非理性信道条件

之前的理论分析都假设了理想信道条件，这里我们讨论一下更加现实的场景[@daneshgaran2008unsaturated]。

> In this paper, we provide a throughput analysis of the IEEE 802.11 protocol at the data link layer in non- saturated traffic conditions taking into account the impact of both transmission channel and capture effects in Rayleigh fading environment.

### 系统模型

假设条件如下：

1. 节点数量有限，记为$n$
2. 信道是不完美信道，可能传输出错
3. capture in Rayleigh fading transmission scenario can occur
4. 包传输基于双路握手方式进行(2-way handshaking access mechanism)，这里的两路握手指的是ACK机制。

随机的过程定义和前面的是一致的。二元随机过程$(s(t), b(t))$中的前者表示退避阶段，后者表示退避计数器的值。这里要计算的核心变量是传输概率$\tau$和碰撞概率$P_{col}$，需要假设这两个概率是固定的。同时，为了刻画不完美的信道条件，我们需要引入一个新的概率$P_e$用来表示信道传输错误的概率。我们假设碰撞概率和传输错误概率是独立的。综合这两个量，一个包传输成功的概率为$(1 - P_e)(1 - P_{col})$。因此我们定义一个等价的传输失败概率$P_{eq} = P_e + P_{col} - P_e P_{col}$。

不完美信道条件还有一个问题是信道占用(channel capture)，代表由于距离因素或其他信道条件，导致某些节点的传输功率比其他同时传输的节点的功率要高。这时，即便发生了碰撞，但是包仍然能够得到传输。从这个意义上来说，信道占用效应可以减少等价的实质的碰撞概率。

对于信道传输错误方面的数据建模，我们做了必要的简化：

1. 帧头部分的错误概率忽略；
2. 比特错误率独立
3. Frame error rate (FER)与包大小指数相关。

为了刻画不饱和的状态，引入了一个新的状态$I$，来表示下面两种情形：

- 在一次成功的传输之后，但是没有包等待发送。
- 节点处于空闲状态，且队列中没有包等待发送。

引入了新状态的的马尔科夫链的状态转移图如下所示：

![](https://imgs.codewoody.com/uploads/big/64a9413662f187b1c9e62ab0fd9ef1d6.png)

注意这里没有包含802.11的post-backoff特性。不过， 这部分对于理论性能的影响比较小。

> post-backoff特性在上面的「非饱和条件」章节中的文章里进行了讨论和建模。
> 更多的阅读内容参考：
>
> - [802.11 backoff precedure](https://www.cwnp.com/forums/posts?postNum=305006)
> - [Post-Backoff - StudFiles](https://studfiles.net/preview/2807735/page:8/)

图中的关键要素和Bianchi提出的模型基本类似。需要注意的是，作者在这里将Channel capture建模成为碰撞的一个子事件。当Channel capture发生时，只允许在AP处有最高接收功率的节点占用信道。在出现Channel capture时，节点进入一个中间状态$(i, 0)$。如果信道占用成功，则节点进入$(0, k)$（队列中还有其他包）或者$I$（队列为空）的状态。若发送失败，则等同于遭受碰撞，进入状态$(i + 1, k)$。

上图的状态转移图的概率转移矩阵为：

\begin{equation}
\begin{aligned}
& P_{i, k | i, k + 1} & = & 1,                               & & k \in [0, W_i - 2], i \in [0, m] \\
& P_{0, k | i, 0}     & = & q\left(1-P_{e q}\right) / W_{0}, & & k \in\left[0, W_{0}-1\right], i \in[0, m] \\
& P_{i, k | i - 1, 0} & = & P_{eq}/W_i,                      & & k \in\left[0, W_{i}-1\right], i \in[1, m] \\
& P_{m, k | m, 0}     & = & P_{eq} / W_m,                    & & k \in \left[0, W_m - 1\right] \\
& P_{I | i, 0}        & = & (1-q)\left(1-P_{e q}\right),     & & i \in[0, m] \\
& P_{0, k | I}        & = & (1 - q)(1 - P_{eq}),             & & k \in [0, W_0 - 1]\\
& P_{I | I}           & = & 1 - q                            & &
\end{aligned}
\end{equation}

接下来可以计算平稳分布

\begin{equation}
b_{i, k}=\lim _{t \rightarrow \infty} P[s(t)=i, b(t)=k], \forall k \in\left[0, W_{i}-1\right], \forall i \in[0, m]
\end{equation}

首先我们注意到

\begin{equation}
\begin{aligned}
& {b_{i, 0}} & {=} & {P_{e q} \cdot b_{i-1,0}=P_{e q}^{i} \cdot b_{0,0},} & & {\forall i \in[1, m-1]} \\
& {b_{m, 0}} & {=} & {\frac{P_{e q}^{m}}{1-P_{e q}} \cdot b_{0,0},} & & {i=m}
\end{aligned}
\end{equation}

上面👆的状态转移图中状态$b_I$考虑了一次成功传输以后队列为空的情况，以及连续的空闲状态，因此有

\begin{equation}
\begin{aligned} b_{I} &=(1-q)\left(1-P_{e q}\right) \cdot \sum_{i=0}^{m} b_{i, 0}+(1-q) \cdot b_{I} \\ &=\frac{(1-q)\left(1-P_{e q}\right)}{q} \cdot \sum_{i=0}^{m} b_{i, 0} \end{aligned}
\end{equation}

对于其他状态的稳态分布($k\in [1, W_i - 1]$)，有

\begin{equation}
b_{i, k}=\frac{W_{i}-k}{W_{i}}\left\{\begin{array}{ll}{q\left(1-P_{e q}\right) \cdot \sum_{i=0}^{m} b_{i, 0}+q \cdot b_{I},} & {i=0} \\ {P_{e q} \cdot b_{i-1,0},} & {i \in[1, m-1]} \\ {P_{e q}\left(b_{m-1,0}+b_{m, 0}\right),} & {i=m}\end{array}\right.
\end{equation}

将$b_I$代入到上式，有

\begin{equation}
\begin{array}{l}{q\left(1-P_{e q}\right) \cdot \sum_{i=0}^{m} b_{i, 0}+q \cdot b_{I}=} \\ {=q\left(1-P_{e q}\right) \cdot \sum_{i=0}^{m} b_{i, 0}+q \cdot \frac{(1-q)\left(1-P_{e q}\right)}{q} \cdot \sum_{i=0}^{m} b_{i, 0}} \\ {=\left(1-P_{e q}\right)[q+(1-q)] \cdot \sum_{i=0}^{m} b_{i, 0}} \\ {=\left(1-P_{e q}\right) \cdot \sum_{i=0}^{m} b_{i, 0}}\end{array}
\end{equation}

应用正则化条件，有

\begin{equation}
\begin{aligned}
1 & = \sum_{i = 0}^{m}\sum_{k = 0}^{W_i - 1}b_{i, k} + b_I \\
  & = \begin{array}{l}{\frac{b_{0,0}}{2}\left[W\left(\sum_{i=0}^{m-1}\left(2 P_{e q}\right)^{i}+\frac{\left(2 P_{e q}\right)^{m}}{1-P_{e q}}\right)+\frac{1}{1-P_{e q}}\right]+} \\ {+\frac{(1-q)\left(1-P_{e q}\right)}{q} \cdot \sum_{i=0}^{m} b_{i, 0}}\end{array} \\
  & = \begin{array}{l}{\frac{b_{0,0}}{2}\left[W\left(\sum_{i=0}^{m-1}\left(2 P_{e q}\right)^{i}+\frac{\left(2 P_{e q}\right)^{m}}{1-P_{e q}}\right)+\frac{1}{1-P_{e q}}\right]+} \\ {+\frac{(1-q)\left(1-P_{e q}\right)}{q} \cdot \frac{b_{0,0}}{1-P_{e q}}}\end{array} \\
  & = \frac{b_{0,0}}{2}\left[W\left(\sum_{i=0}^{m-1}\left(2 P_{e q}\right)^{i}+\frac{\left(2 P_{e q}\right)^{m}}{1-P_{e q}}\right)+\frac{1}{1-P_{e q}}+\frac{2(1-q)}{q}\right]
\end{aligned}
\end{equation}

解出来得到如下结果（这不人道！）

\begin{equation}
\begin{aligned}
& b_{0, 0} = \frac{2}{\frac{W\left[\left(1-P_{e q}\right) \sum_{i=0}^{m-1}\left(2 P_{e q}\right)^{i}+\left(2 P_{e q}\right)^{m}\right]+1+2 \frac{1-q}{q}\left(1-P_{e q}\right)}{1-P e q}} \\
& = \frac{2\left(1-P_{e q}\right)}{\left(W-P_{e q} W\right) \frac{1-\left(2 P_{e q}\right)^{m}}{\left(1-2 P_{e q}\right)}+W\left(2 P_{e q}\right)^{m}+1+2 \frac{(1-q)\left(1-P_{e q}\right)}{q}} \\
& =\frac{2\left(1-P_{e q}\right)\left(1-2 P_{e q}\right) q}{q\left[(W+1)\left(1-2 P_{e q}\right)+W P_{e q}\left(1-\left(2 P_{e q}\right)^{m}\right)\right]+2(1-q)\left(1-P_{e q}\right)\left(1-2 P_{e q}\right)} \\
\end{aligned}
\end{equation}

当$q \rightarrow \infty$时，即得到了饱和情形下的稳态分布。再如果添加理想信道条件，则$P_e = 0$，则我们可以将上式简化为

\begin{equation}
\lim _{q \rightarrow 1} b_{0,0} \rightarrow \frac{2\left(1-P_{c o l}\right)\left(1-2 P_{c o l}\right)}{(W+1)\left(1-2 P_{c o l}\right)+W P_{c o l}\left(1-\left(2 P_{c o l}\right)^{m}\right)}
\end{equation}

这个公式和Bianchi中得到的平稳分布式一致的。基于稳态分布我们可以计算传输概率$\tau$

\begin{equation}
\begin{aligned} \tau &=\sum_{i=0}^{m} b_{i, 0}=\frac{b_{0,0}}{1-P_{e q}}=\\=& \frac{2 (1 - 2P_{eq})q}{q\left[(W+1)\left(1-2 P_{e q}\right)+W P_{e q}\left(1-\left(2 P_{e q}\right)^{m}\right)\right]+2(1-q)\left(1-P_{e q}\right)\left(1-2 P_{e q}\right)} \end{aligned}
\end{equation}

继而得到碰撞概率

\begin{equation}
P_{c o l}=1-(1-\tau)^{N-1}-P_{c a p}
\end{equation}

其中$P_{cap}$为Channel capture的概率。$P_{cap}$为如下形式，具体推导参考原文:

\begin{equation}
P_{c a p}=\sum_{i=1}^{N-1}\left(\begin{array}{c}{N} \\ {i+1}\end{array}\right) \tau^{i+1}(1-\tau)^{N-i-1} P_{c p}\left(\gamma>z_{o} g\left(S_{f}\right) | i\right)
\end{equation}

继而我们需要求解一个四元非线性方程组，可以通过数值方法求解：

\begin{equation}
\left\{\begin{array}{l}{\tau=\frac{2\left(1-2 P_{e q}\right) q}{q\left[(W+1)\left(1-2 P_{e q}\right)+W P_{e q}\left(1-\left(2 P_{e q}\right)^{m}\right)\right]+2(1-q)\left(1-P_{e q}\right)\left(1-2 P_{e q}\right)}} \\ {P_{e q}=1-(1-\tau)^{N-1}-P_{c a p}} \\ {P_{e q}=P_{c o l}+P_{e}-P_{e} \cdot P_{c o l}} \\ {P_{c a p}=\sum_{i=1}^{N-1}\left(\begin{array}{c}{N} \\ {i+1}\end{array}\right) \tau^{i+1}(1-\tau)^{N-i-1} \frac{1}{\left(1+z_{0} g\left(S_{f}\right)\right)^{i}}}\end{array}\right.
\end{equation}

最后可以计算归一化吞吐率：

\begin{equation}
S=\frac{P_{t} \cdot P_{s} \cdot\left(1-P_{e}\right) E[P L]}{\left(1-P_{t}\right) \sigma+P_{t}\left(1-P_{s}\right) T_{c}+P_{t} P_{s}\left(1-P_{e}\right) T_{s}+P_{t} P_{s} P_{e} T_{e}}
\end{equation}

其中

\begin{equation}
\begin{aligned}
& P_t & = & 1 - (1 - \tau)^N \\
& P_s & = & \frac{N\tau (1 - \tau)^{N - 1} + P_{cap}}{P_t} \\
& T_c & = & H + P L + ACK_{timeout} \\
& T_s & = & H + P L + S I F S + \tau_p + A C K + D I F S + \tau_p
\end{aligned}
\end{equation}

$E[PL]$为Payload的平均大小，$\sigma$为空闲时隙的大小。

### 包达到过程以及$q$的估算

包的到达过程建模成参数为$\lambda$的Poisson过程。参数$\lambda$代表了单位时间内到达的包的个数。相应的，包到达的间隔为$\frac{1}{\lambda}$。因此

\begin{equation}
q=1-e^{-\lambda E\left[S_{t s}\right]}
\end{equation}

其中$E[S_{ts}]$为每个虚拟时隙的大小。

\begin{equation}
\begin{aligned} E\left[S_{t s}\right]=&\left(1-P_{t}\right) \cdot \sigma+P_{t}\left(1-P_{s}\right) \cdot T_{c}+\\ &+P_{t} P_{s} P_{e} \cdot T_{e}+P_{t} P_{s}\left(1-P_{e}\right) \cdot T_{s} \end{aligned}
\end{equation}

> 讨论：事实上，从我的分析来看，这里的这个处理方法是存在问题的。问题包含两个方面：1) 如此处理需要假设节点的队列容量只有1，不然我们就需要引入更加复杂的排队论理论来进行分析。当然，引入排队论也是可以分析的；2）利用Poisson过程讨论的时间不应该只限于一个虚拟时隙。而是应该考虑发送延时。即发送完一个包需要的时间内可能生成新的包的概率。而不是只盯着一个时隙。这一延时的计算方法可以参考上面的3.3章节

## Reference
