---
title: Wireless Access in Vehicular Environments (WAVE)
date: 2019-04-29 11:28:41
mathjax: true
---

WAVE的全称是Wireless Access in Vehicular Environment，是目前车联网通信的标准。

# WAVE与其他车联网通信中的技术/标准之间关联

在车联网研究中常见的其他技术关键词还包括:

- DSRC
- IEEE802.11p
- IEEE1609.x

# 物理层特点

WAVE在物理层使用IEEE802.11p的标准。其物理层的一些关键信息如下。

## 信道划分 Slot Allocation

WAVE使用的频段为5.85GHz至5.925GHz。这一频段被进一步划分为7个信道，包括1个控制信道CCH (Control CHannel), 和6个服务信道SCH(Service CHannel)，具体的信道划分如下所示:

![FCC规定的WAVE信道划分](https://imgs.codewoody.com/uploads/big/3e60597c7c597cfedf8c5fe4dba44e90.png)

- 5.850GHz - 5.855GHz 部分为保留部分(reserved)
- 信道178为CCH控制信道，带宽为10MHz
- 信道172, 174, 176, 180, 182, 184为SCH服务信道，带宽都为10MHz
- 信道174和176，信道180和182可以合并为20MHz带宽的信道
- 信道172和184，即最外侧的两个信道用于传输与生命财产关联的安全信息。特别的，根据FCC 06-110，信道172用于V2V的安全信息传输，信道184则是高发射功率，长距离通信，用于公共安全信息的传输，例如避免路口碰撞事故。

{% note info %}
WAVE协议规定了SCH和CCH的划分，但是对于在不同SCH的不同业务规则的要求不是强制的。
{% endnote %}

## 信道类型

### CCH-控制信道

CCH信道只有一个，位于整个WAVE频谱的居中位置，带宽为10MHz。

CCH信道上禁止发送IP消息，主要用来发送一些至关重要要的信息（常常是安全相关的），以及服务广告(Service advertising)消息WSA(WAVE Service Advertisement).

### SCH-服务信道

SCH信道共六个，主要用来发送与基于IPv6(或者WSMP)的非安全信息。SCH信道调度使用机制的研究参见[WAVE中的SCH调度机制研究状况](./sch.html)

### 关于信道的业务类型

WAVE协议并未对于各个信道上运行的业务的具体类型做出具体的强制要求。目前来看除了禁止在CCH上发送IP协议包以外，并未有其他更多的强制要求。例如，WAVE标准并未划分专门的安全信道。前文提到CCH上会发送安全相关的信息，SCH主要用来发送非安全信息，但是在实际使用中SCH上仍然可以用啦发送安全信息。在美国172信道甚至被视为安全信息的专用通道。管理信息同样也可以在SCH上传输。

## 信道协调(Channel coordination)与时间同步(Time Synchronization)

WAVE中的多信道访问以IEEE1609.4为标准。

### 信道协调

在使用WAVE进行通信时，时域和频域资源都进行了划分。WAVE设备可以在不同的信道上切换(Alternative radio channel access)。这使得单设备节点可以在SCH信道上交换信息的同时，可以监听CCH信道。

多信道访问通过共同点时间基准来进行协调。具体而言，WAVE规定由一个CCH间隔(CCHI)，跟着一个SCH间隔(SCHI)组成一个同步间隔SI。在CCHI，所有节点在CCH上通信；在SCHI，节点在指定的SCH上进行通信。在CCHI和SCHI开头设置了一段保护间隔(GI)。在保护间隔内，设备在进行信道切换，被认为无法接收数据包。

根据IEEE 1609.4-2010标准，CCHI和SCHI的长度均为50ms，保护间隔为4ms，如下图所示

![Channel Interval Structure](https://imgs.codewoody.com/uploads/big/3e60597c7c597cfedf8c5fe4dba44e90.png)

标准允许将信道间隔（CI）设置为可变的长度，但是并没有给出对应的实现机制。

上述的接入方式被称为Alternating channel access，除此之外，还包含了continuous channel access, immediate access, extended access。其中，immediate access允许设备在WSA消息中识别出一个应用请求时，立刻切换到SCH信道。extended access则允许设备延长访问SCH的时间。

![More Channel Accessing Schemes](https://imgs.codewoody.com/uploads/big/12010bd0f5e8197a68ff732bff9cdf87.png)

{% note info %}
装备有多个通信设备的节点可以并行地访问CCH和SCH
{% endnote %}

### 时钟同步

各个节点的时钟同步到UTC时间的标准秒（这点在上图得到了反映）。UTC时间可以由GPS给出。

IEEE802.11-2012标准中的Timing Advertisement frame可以用于节点间的时钟同步。

注意，严格的时钟同步对于通信来说并非是必须的。信道协调只需要精确到1s的边界就可以了。不过严格的时钟同步可能对于安全目的来说是必须的。

# MAC层特点

WAVE的MAC层的核心DCF(Distributed Coordination Function)技术，DCF是基于指数退避算法的CSMA/CA机制，这一机制的内容可以从以下几方面来讨论:

## 指数退避机制

需要发送包的节点监听信息，如果信道空闲的时间超过了DIFS (Distributed Interframe Space)，那么节点开始发送，否则如果信道繁忙，则继续保持监听信道。

当节点得以占用信道准备发送时，节点会在发送前进行一个随机的退避（Collision Avoidance），来减少和其他节点冲突的概率。另一方面，为了避免信道长时间被特定的节点占用（信道被长时间占用的现象被称为Channel Capture），一个节点在两次发包之间也要有一个随机的退避。

出于性能原因，CSMA采用了离散的退避时间。紧跟在DIFS之后的时间被划分为多个时隙，每个节点只能在每个时隙的开始的阶段发送数据包。时隙的大小$\sigma$，等于每个节点探测到另一个节点发送的包需要的延时。这一参数取决于物理层，包含传输延时，TX/RX切换时间，以及通知MAC层信道状态需要的时间。

在每个包传输时，退避时间在$(0, \omega-1)$中随机选出，其中$\omega$被称为竞争窗口(Contetion Window)。竞争窗口的大小与传输失败的次数有关。初始时$\omega=CW_{min}$。每经过一次传输失败，竞争窗口的大小加倍，直到达到最大值$CW_{max}$。

退避的状态由一个退避计数器(backoff counter)来控制。在开始退避时，为退避计数器随机分配一个退避窗口范围内的整型值。之后每一个时隙，如果信道空闲退避计数器就递减。当检测到信道繁忙时，退避计数器的递减过程会停止。当信道再次变得空闲时，退避计数器需要检测信道空闲超过DIFS之后才会再次开始递减。当计数器递减至0时，节点会尝试发送。如果失败，竞争窗口会加倍。并重复前述过程。

## ACK

CSMA中并不依赖对于自己的传输的监听来检测碰撞。因此引入了ACK机制来通知包发送成功（显然只有D2D方式的通信才会有ACK，在广播包不会产生ACK）。这种机制被称为是Basic Access。接收端在收到包之后经过一段SIFS（Short Inter-Frame Space）立即发送ACK。SIFS比DIFS要短，因此在ACK发送前不会有节点能够占用信道。如果在一定事件后发送节点仍然没有收到ACK，则判断此包丢失。

## RTS/CTS

RTS/CTS的全称是Request To Send / Clear To Send。这套机制的作用是两方面的：

1. 减少在传输较大体积的包过程中的冲突
2. 解决[隐藏终端问题](https://en.wikipedia.org/wiki/Hidden_node_problem)

RTS/CTS的工作过程如下。节点在发送数据包之前，先向目标节点发送一个RTS请求，目标街点收到RTS之后判断当前是否能够进行RTS中请求的包传输，如果可以，目标节点会响应一个CTS。发送者在收到CTS之后才获准发送数据包。RTS和CTS中包含了待传输的包的长度信息，这些信息可以被周围的节点截图，从而更新其[Network Allocation Vector](https://en.wikipedia.org/wiki/Network_allocation_vector) (NAV)。

## MAC层性能的理论推导

针对MAC的层的性能推导，基本源自于下面这篇文章（接近一万次引用）

{% note info %}
[Performance analysis of the IEEE 802.11 distributed coordination function](https://ieeexplore.ieee.org/abstract/document/840210)
{% endnote %}

上面这篇文章给出了在一定的驾驶条件下DCF机制的饱和吞吐率

### 饱和吞吐率

一般而言，随机接入协议的一个共同问题是，随着业务量的上升，系统的整体throughput会逐渐上升至`maximum throughput`，之后继续提高业务量，系统整体的吞吐率并不会继续上升，反而会下降。因此，在实际场景中，系统不可能长时间的保持在最大吞吐率的水平。最大吞吐率也不太适合用作评估接入机制性能的指标。

随着业务量的进一步上升，吞吐率会进入一个比较稳定的水平。这个水平被称为饱和吞吐率（Saturation Throughput）

![饱和吞吐率](https://imgs.codewoody.com/uploads/big/94b4e7b15533430bfdf7a6b38a4ed8c1.png)

### 假设条件

- 完美的信道条件
    - 不考虑隐藏终端问题
    - 不考虑Channel capture
- 节点数量固定，且达到满载，即，在一个包发出去之后，总有另一个包等待发送

### 包传输概率

节点数量为$n$，在饱和的情况下，每个节点在每次传输成功以后都可以立即生成一个数据包以供发送。每个包在开始发送前都需要经历一个随机的退避。我们定义$b(t)$为节点的退避计数器状态，$t$和$t+1$表示连续的两个时隙的起始。这里的“时隙”与前面的定义不同，在前文中我们提到过，在信道状态为busy时，退避计数器的递减过程是停止的。我们在这里不将这些部分的时间纳入时隙中，时隙被定为退避计数器相邻两次递减的时间差，这意味着，slot times和系统的时钟是不同步。两个连续的时隙的起始时刻相差，并不总是​$​\sigma$，而且可能包含一个完整的发送过程。

由于退避计数器与传输历史有关，那么随机过程$b(t)$显然是非马尔科夫的。记

$$
W=CW_{min} \\
CW_{max} = 2^mW
$$

然后记：

$$
W_i=2^iW
$$

$i\in(0,m)$被称为退避阶段(backoff stage)。我们记$b(t)$为表述退避阶段在$t$时刻取值的随机变量。我们的一个核心的近似是一个核心的近似是，假设在对于每一次传输尝试，无论重传次数如何，每个包的碰撞概率都是 constant and independent 的，此概率值为​$p$​。直观的来看，这个假设在​$W$和$n$增加时会更加精确。这一概率值又可以被称为条件碰撞概率（conditional collision probability），即此概率为待发送包观察到的碰撞概率。

一旦独立性得到满足，且​$p$​是一个常数值，我们可以把一个二元随机过程​$\{s(t),b(t)\}$建模成离散时间的马尔科夫链。其状态转移图为

![马尔科夫链状态转移图](https://imgs.codewoody.com/uploads/big/c784bdc5ebdb96faec4be3b63cb96df5.png)

概率转移矩阵中的非零元素为：

$$
\left\{
\begin{array}{ll}
P\{i, k | i, k + 1\} = 1 & k\in(0, W_i - 2), i\in(0, m) \\
P\{0, k | i, 0\} = (1 - p) / W_0 & k\in(0, W_0 - 1), i\in(0, m) \\
P\{i, k|i-1, 0\} = p / W_i & k\in(0, W_i - 1), i\in(1, m) \\
P\{m, k | m, 0| = p/W_m & k\in(0,W_m -1)
\end{array}
\right.
$$

1. 第一个等式代表在每个slot time的开头要递减backoff counter.
2. 第二个等式代表在一次成功的传输以后，紧随一个新的packet
3. 第三个等式代表退避完成之后信道仍然无法占用增加backoff stage。
4. 第四个等式也是代表退避完成之后信道仍然无法占用，不过backoff stage已经最大

记$b_{i,k}=\lim_{t\to\infty}P\{s(t)=i, b(t)=k\}, i\in(0, m), k\in(0, W_i-1)$代表了马尔科夫链的稳态分布，下面给出该马尔科夫链的闭式解：

首先:

$$
b_{i-1}\cdot p=b_{i,0} \to b_{i_0}=p^ib_{0,0},\ \ 0<i<m \\
b_{m-1,0}=（1-p)b_{m,0}\to b_{m,0}=\frac{p^m}{1-p}b_{0,0}
$$

马尔科夫链的规律，对于每个$k\in(1,W_i-1)$

$$
b_{i,k}=\frac{W_i-k}{W_i}\cdot \left\{ \begin{array}{ll}
(1-p)\sum_{j=0}^{m}b_{j,0} & i=0 \\
p \cdot b_{i-1,0} & 0 < i < m \\
p \cdot (b_{m-1, 0} + b_{m,0}) & i=m
\end{array}
\right.
$$

在平稳情况下，考虑$\sum_{i=0}^{m}b_{i,0}=b_{0,0}/(1-p)$，则有

$$
b_{i,k}=\frac{W_i-k}{W_i}b_{i,0},i\in(0,m),k\in(0,W_i-1)
$$

经过上面的推导，我们可以把$b_{i,k}$表达为$b_{0,0}$的函数，同时通过概率的正则化条件可以求解$b_{0,0}$：

$$
1=\sum_{i=0}^{m}\sum_{k=0}^{W_i-1}b_{i,k}=\sum_{i=0}^{m}b_{i,0}\sum_{k=0}^{W_i-1}\frac{W_i-k}{W_i}=\sum_{i=0}^{m}b_{i,0}\frac{W_i+1}{2}\\
=\frac{b_{0,0}}{2}\left[W\left(\sum_{i=0}^{m-1}(2p)^i+\frac{(2p)^m}{1-p}\right) + \frac{1}{1-p}\right]
$$

故

$$
b_{0,0}=\frac{2(1-2p)(1-p)}{(1-2p)(W+1)+pW(1-(2p)^m)}
$$

然后我们可以得到一个节点在任意时刻尝试发送的概率

$$
\tau=\sum_{i=0}^{m}b_{i,0}=\frac{b_{0,0}}{1-p}=\frac{2(1-2p)}{(1-2p)(W+1)+pW(1-(2p)^m)}
$$

{% note info %}
注意$m=0$是0时，即即退避的窗口是固定的时候，
$$
\tau=\frac{2}{W-1}
$$
{% endnote %}

注意到$p$的含义其实是，在一个时隙中一个节点正在发送时，剩下的$n-1$个节点至少有一个在发送，则

$$
p=1-(1-\tau)^{n-1}
$$

这里的$\tau$和$p$构成了一种非线性方程组，可以用数值方法求解。

### 吞吐率计算

记$S$为归一化的系统吞吐率，定义为信道中用于传输数据的时间的比例。在一个随机选取的时隙上，记$P_{tr}$为至少有一个节点尝试发送的概率，则

$$
P_{tr}=1-(1-\tau)^n
$$

$P_s$表示传输成功的概率，则

$$
P_s=\frac{n\tau(1-\tau)^{n-1}}{P_{tr}}=\frac{n\tau(1-\tau)^{n-1}}{1-(1-\tau)^n}
$$

我们可以把$S$表示成

$$
S=\frac{E[\text{payload information transmitted in a slot time}]}{E[\text{length of a slot time}]}
$$

记包的平均传输时间是$E[P]$，俺么在一个slot time里面用于传输的平均时间长度是$P_{tr}P_{s}E[P]$。slot time的平均大小是

$$
(1-P_{tr})\sigma+P_{tr}P_sT_s+P_{tr}(1-P_s)T_c
$$

其中，$T_s$是信道检测为繁忙后的平均slot time长度（其内部包含了一整个包传输的时间），$T_c$为信道发生碰撞以后被识别为繁忙的时间。那么

$$
S=\frac{P_sP_{tr}E[P]}{(1-P_{tr})\sigma+P_{tr}P_sT_s+P_{tr}(1-P_s)T_c}
$$

注意上面的推导过程中我们其实并未指定特定的接入机制。对于特定的接入机制，我们只需要确定与之相关的$T_s$和$T_c$。

### $T_s$和$T_c$的确定

只考虑存在ACK机制下，

$$
\left\{\begin{array}{l}
T_{s}^{bas}=H+E[P]+SIFS+\delta+ACK+DIFS+\delta\\
T_c^{bas}=H+E[P^*] + DIFS +\delta
\end{array}\right.
$$

其中$H=PHY_{hdr}+MAC_{hdr}$为物理层和MAC层的帧头传输时间。$\delta$是传输延时，$E[P^*]$是the average length of the longest packet payload involved in a collision. 如果所有的包的大小都是一样的，那么$E[P^*]=P$。在更一般的情况下所有包的大小可以被认为是独立同分布的。记这个分布为$F(\cdot)$，则

$$
\begin{aligned}
E[P^*] &=E[E[\max(P_1,\dots,P_k|k]]\\
&=\frac{\sum_{k=2}^{n}\left(\begin{array}{c}n\\k\end{array}\right)\tau^{k}(1-\tau)^{n-k}\int_{0}^{P_{max}}(1-F(x))^kdx}{1-(1-\tau)^n-n\tau(1-\tau)^{n-1}}
\end{aligned}
$$

如果忽略三个或者更多包碰撞的情况，那么上面的式子可以简化为：

$$
E[P^*]=\int_0^{P_{max}}(1-F(x)^2)dx.
$$

$T_c$是由未参与到碰撞中的节点感知到的信道繁忙时间，我们忽略了两个或者更多个的碰撞节点在感知信道前需要等待ACK超时这个因素，所以实际中的$T_c$要不这里给出的计算结果要大。

再考虑在RTS/CTS机制下：

$$
\left\{
\begin{array}{l}
T_s^{rts}=RTS+SIFS+\delta+CTS + SIFS + \delta + H + E[P] + SIFS + \delta+ACK+ DIFS + \delta \\
T_c^{rts} = RTS + DIFS + \delta
\end{array}
\right.
$$

### 结果分析

![饱和吞吐率与节点数量的关系](https://gitlab.vlionthu.com/mixed-autonomy/advanced-tdma-ns3-simulation/uploads/419e1e0df6b65ff0cebbc7b3f7f1b9a1/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7_2019-04-30_22.59.10.png)

从上图中我们可以发现，对于Basic Access方式，饱和吞吐率和节点数量呈负相关，也即和节点密度呈负相关。这意味着节点数量越少，饱和吞吐率越高。相反，对于RTS/CTS机制而言，在节点密度达到一定的程度以后，饱和吞吐率就和节点数量无关了。