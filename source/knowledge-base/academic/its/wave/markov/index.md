---
title: 马尔科夫链在WAVE链路层网络性能分析中的应用
date: 2019-05-20 16:01:31
mathjax: true
---

本文整理自[@nguyen2018survey]。这篇文章关注的是多信道MAC，即IEEE802.11p + IEEE1609.4。具体而言，主要研究下面几个方面:

1. 饱和以及非饱和情况下数据传输性能；
2. 多维马尔科夫链（最多三维）在MAC协议中的使用；
3. 马尔科夫链模型和真是的应用需求对比，以改善现存的分析模型和协议设计。

## 现有通信机制/标准简述

为了构建车联网通信系统，每辆车都装备了On-Board Units (OBUs)，路边设置有Road Side Units (RSUs)作为基础设施支持。因此车联网通信可以划分为Vehicle-to-Vehicle(V2V)，Vehicle-to-Infrastructure(V2I)两个类别。

WAVE协议中，总共75MHz的带宽被划分为7个信道（1个控制信道CCH和6个服务信道SCH），每个信道10MHz带宽，外加5MHz的保护间隔。同时WAVE还在时间维度上将信道访问过程划分为CCH Interval和SCH Interval，每个50ms。

车联网中典型业务的网络性能要求如下图。

![DSRC data traffic requirement [@abdelgader2014physical]](https://imgs.codewoody.com/uploads/big/a909166d66cc8de75b0ab831737b78ca.png)

## 学界现有的多信道MAC方案

IEEE 1609.4规范中给出的多信道方案的问题在于，固定的CCHI，SCHI长度无法适应多变的交通流场景。例如在低密度场景下，CCHI上空闲资源比较多，而高密度场景下，CCHI的长度不够发完所有的安全广播。有很多多信道MAC机制着眼于解决这一问题，见下图：

![Comparison of adaptive multi-channel MAC protocols](https://imgs.codewoody.com/uploads/big/c8207416974cddd4162920f3c3a23031.png)

通过利用适当的理论模型（主要是马尔科夫链），MAC协议可以计算CCH上完成SCH调度需要的时间，进而动态的调整CCHI的长度，从而将原本空闲的CCHI资源让渡给SCH使用。类似的机制的主要过程如下：

1. 安全信息拥有最高的优先级，照常发送
2. 计算完成所有WSA包发送需要的时间
3. 动态调整CCHI和SCHI的长度
4. 该使用Markov模型的动态MAC机制不仅仅可以确保安全消息的延时，同时可以优化非安全消息的QoS
5. MAC协议必须动态地调整其自定义系统参数来适应多变的网络环境。

大多数运用马尔科夫模型MAC协议都有如下的架设

1. 理想信道（no hidden terminal and capture）
2. 网络中的节点数量固定，为$n$
3. 包的碰撞概率为常数，且对于每辆车而言都是相同的
4. 非饱和条件下，包到达的过程为泊松过程

基于上述假设，离散时间马尔科夫链就可以用于802.11 DCF的性能分析，并用于计算CCHI的最佳长度。

另外，我们还总结了多信道MAC协议的一些研究趋势：

1. *IEEE802.11p EDCA的马尔科夫链分析*：所有现存的自适应多信道MAC方法都使用了马尔科夫链来分析DCF性能。不过，EDCA部分的马尔科夫链模型表达方面研究还不多。EDCA和DCF的主要区别阿在于EDCA对于每一种不同的Access Category (AC)规定了不同的竞争窗口大小和仲裁间隔(Arbitration Inter-frame Space)。
2. *自适应多信道MAC协议的精确马尔科夫模型*：如同上面提到的，使用马尔科夫链进行性能分析的MAC协议大多假设了理想的信道条件。这一假设在真实的车联网场景下是不成立的。一些近期的工作，如FCM-MAC考虑了隐藏终端的问题[@yao2017flexible]。
3. *自适应多信道MAC协议中的灵活控制器方案(Flexible Controllers)*：已经计算出了最佳的CCHI之后，这一信息需要被RSU或者簇头车辆广播出去。CAMAC提出了使用编队结构来实现改信息广播的功能。
4. *簇头选择问题*：在一个网络分簇中，簇头是由“寿命”制约的，当簇头车辆离开了分簇时，如何选择新的簇头是需要解决的问题。
5. *ACK Interval*: 这一研究趋势是指将ACK包放到独立的ACK Interval中发送。

## 马尔科夫链模型与动态CCHI

[@bianchi2000performance]这篇文章应该是最早提供了一整套完整的使用马尔科夫链来进行DCF性能分析的方法论。这篇文章讨论的是满载场景（即每个车辆总是有一个包等待发送）下饱和吞吐率(saturated)与竞争窗口，以及其他要素之间的关系。~~但是在实际场景中，一般不会进入满载的情况。因此有很多文章通过增加一个额外的状态随机变量来扩展了[@bianchi2000performance]中的马尔科夫模型。这使得马尔科夫链模型从二维变成三维。~~

这里我们讨论两种典型的业务：安全信息与WSA包。

安全信息的特点在于延时敏感，以及缺少ACK。

WSA的情况要复杂一些，我们这里梳理一下WSA的工作过程。WSA的作用是SCH服务提供者声明其所能提供的服务的广播报。WSA在CCHI上传输，其中包含了广播者提供的服务的所有信息以及使用这一服务（即加入此BSS）必要的网络参数，例如BSS的ID，Provider Service ID，使用的SCH信道，时隙信息，EDCA参数等等。WSA要求对此服务感兴趣的节点发送ACK（在有一些研究中，所有的ACK都集中到专门的ACK Interval中发送）

### 一维马尔科夫链

由于安全消息天然是广播的，没有重传过程，因此可以用一维马尔科夫链来建模。竞争窗口记为$W_e$，始终是固定的。马尔科夫链的状态变量为$\left\{k:k \in [0, W_e - 1]\right\}$。令$\lambda_e$表示安全信息到达速度。马尔科夫链的平稳分布为$b_{0,\emptyset}$(信道空闲的概率)，$b_{e, k}$(处于退避状态$k$的概率)。令$P_{i|j}$为转移概率$\{\operatorname{Pr}\{b(t+1)=i | b(t)=j\}$

![一维马尔科夫链。图中的Idle状态是在非饱和状态下才有的，如果在饱和状态下，即$\lambda_e \to \infty$，则不存在Idle状态 ](https://imgs.codewoody.com/uploads/big/a4e7b85649818f46469ffdf0fccd0b47.png)

### 二维马尔科夫链

令$s(t)$和$b(t)$分别为代表WSA包在时隙$t$的退避阶段以及退避计数器的值的随机变量。令状态$I_{s, \emptyset}$代表WSA队列为空。最大重传次数为$m$，竞争窗口在第$i$个阶段为$W_{s, i}, (i \in [0, m])$。在第一次传输尝试时，退避窗口被设置为最小值$W_{s, 0}$。当检测到碰撞时，竞争窗口加倍，并且开始重传。**一个重要的假定是$s(t)$，即退避的阶段，与是否发生碰撞是独立的**。二维过程$\{s(t), b(t)\}$可以建模成二维马尔科夫链。根据在达到最大退避窗口时的不同行为，我们可以划分两个不同的类别：

1. *remaining maximal backoff stage*: 即达到最大的竞争窗口后，直到发送成功前，始终保持最大竞争窗口；
2. *reset backoff stage*: 即达到最大的竞争窗口后，立即重置竞争阶段$s(t)$。

![二维马尔科夫过程](https://imgs.codewoody.com/uploads/big/398544df56e2adab791c91ef42a93942.png)

记转移概率为$P_{i, k | j, l} = \{\operatorname{Pr}\{s(t+1)=i, b(t+1)=k | s(t)=j, b(t)=l\}$。平稳分布为

\begin{equation}
b_{s, i, k}=\lim _{t \rightarrow \infty}\{s(t)=i, b(t)=k\}, 0 \leq i \leq m, 0 \leq k \leq W_{s, i} - 1
\end{equation}

### 三维马尔科夫链

将CCHI上传输的包的类型分为三类：安全消息，WSA消息，控制消息。其中安全消息使用一维马尔科夫链，对于后两者，控制消息拥有更高的优先级，使用EDCA中的AC1，WSA使用AC2。

在三维马尔科夫链中，类似二维的情况，我们用$s(i, t)$和$b(i, t)$来分别表示退避阶段和退避计数器的值。这里的$i$表示EDCA类别，即$i \in AC1, AC2$。用$v(i, t)$表示退避过程的冻结状态(Freezing state)。综上，三维随机变量$\{s(i, t), b(i, t), v(i, t)\}$可以表示成三维马尔科夫变量。由于控制消息拥有更高的优先级，那么控制帧就不会处于Freezing状态，即$v(i, t) = -1$。此时AC1的马尔科夫链的结构和上一个部分我们提到的二维马尔科夫链的形态非常类似，如下图：

![Markov chain used for packet transmission analysis using AC1.](https://imgs.codewoody.com/uploads/big/8f5fb17d2327166974e26e69f353fd14.png)

考虑$v(i, t)$状态。如果包遇到一个空闲的时隙，那么$v(i, t)$会从0变成-1。否则，如果遇到了一个繁忙的时隙，$v(i, t)$则会维持0不变。因此，AC2的马尔科夫链可以表示为：

![Markov chain used for packet transmission analysis using AC2.](https://imgs.codewoody.com/uploads/big/adf77d621dedafe5738532d46089374c.png)

## Reference
