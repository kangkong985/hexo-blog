---
title: 动态控制发包频率
date: 2019-05-17 15:00:21
mathjax: true
---

在[基于Platoon的车间通信(V2V)机制设计:动态调节网络参数](http://localhost:4000/knowledge-base/academic/its/platoon/platoon-v2v.html#%E5%8A%A8%E6%80%81%E8%B0%83%E8%8A%82%E7%BD%91%E7%BB%9C%E5%8F%82%E6%95%B0)我们也提到了这种控制理念：即根据网络的情况，动态的调整网络参数。对于Beacon包传输来说，在高负载的情况下，与其所有人仍然按照原来的发送速度，进而导致严重的冲突拖慢整体性能，不如整体所有人适当调低发送速度。

这篇文章研读总结自[@park2012application]。这篇文章主要是依据车流密度情况动态调整BSM(Basic Safety Message)的发送速率，算法被称为**frequency adjustment with random epochs (FARE)**。

## BSM的发送

WAVE的标准中并未明确规定BSM消息的频率。不过在文献研究中，典型的BSM发送频率范围包含了1Hz [@tonguz2007broadcasting]到10Hz [@dsrc2009dedicated]。

BSM信息一般放在CCH上发送。考虑到在没有进行额外的跨层优化设计时，BSM应用层无法感知底层信道状态，因此一些BSM包可能在SCHI上产生。此时MAC层会将这些包压入队列，等到CCHI时发送。如果在CCHI结束时仍然未能发送出去，这个BSM消息会被丢弃。

## FARE

在FARE机制中，应用会维护一整套名为的epochs的抽象时间结构，代表了BSM传输的时间线。每个epoch对应一个BSM传输。每个epoch的长度取决于BSM的传输时间（一个250Bytes的BSM包，在3Mb/s的带宽上，需要大约1ms来传输）。在确定epoch的长度以后，每个车辆选择一个epoch来传输BSM包。这里我们选择1ms作为epoch的长度，那么一个SI（同步间隔）内的，大约有92个epoch（去掉Guard Interval）。

尽管应用层并不知晓信道状态，但是因为按照WAVE规范，SI需要对齐到UTC的秒时刻，因此应用层可以通过GPS等外源时钟来将epochs和SI的起始时刻对齐。

Epochs建立起了一套应用层的时间尺度，相比于物理层和MAC层的实际时间尺度，二者观察到的现象会有一定的区别，如下图：

![Example of the application-layer view of the BSM transmission
activities on the MAC layer](https://imgs.codewoody.com/uploads/big/81a2f775053cb02c3fbd961122653dea.png)

应用层和MAC层视角的主要差别在于，应用层无法区分“信道空闲”和“信道冲突”两种现象。

## 从应用层感知CCHI

之前我们说到了由于缺乏跨层信道，应用层无法感知到CCHI，不知道其开始和结束。对于CCHI的开始时刻，我们可以通过利用SI与UTC秒对齐的特性来发现，而CCHI的结束时刻还需要特别的机制来发现。

> 在WAVE标准中确定了多种CCH和SCH访问的方式，二者长度并非总是50ms

记$\hat{E}_{\max }$为现在已经收到的时间轴上一个SI内最右侧的BSM的Epoch，那么设定如下的BSM发送时刻决定策略：

\begin{equation}
\label{1}
e \leftarrow \mathcal{R}\left[0 \ldots \hat{E}_{\max }+1\right]
\end{equation}

其中$\mathcal{R}$为随机数发生器。如果节点目前还没有任何关于CCHI的信息（无法确定$\hat{E}_{\max }$），那么节点干脆随机选择。这种随机散布策略有助于快速找到CCHI的右侧边缘。下面的图演示了收敛速度：

![BSM transmitting times fast converging to the CCHI](https://imgs.codewoody.com/uploads/big/c2dc02b1b250bdf88a9e65a5f984ab08.png)

实际的收敛速度还取决于负载情况：负载越高，收敛越快。

## 估计车流密度

核心设计思路是，在$\eqref{1}$的随机选择Epoch方式场景下，我们可以根据下面的两个观测特征来确定指定车辆通信范围内的车辆数量：

1. 车辆成功将BSM广播给周围车辆的概率$P_1$，即PDR(Packet Delivery Ratio)；
2. 车辆在连续两个CCHI内成功发送BSM的概率$P_2$。

从应用层的Epochs角度，即在一个SI内，收到的BSM的数量是$E \cdot P_1$，其中$E \equiv \widehat{E}_{\mathrm{max}}$为CCHI内的Epochs总数。由于从应用层无法分辨信道空闲和碰撞，光有$P_1$还不够。接下来考虑$P_2$，有$P_2 = P_1^2$。

假设观测车辆的通信范围内有$V$辆车，所有车辆的BSM发送频率为$f = 1 / SI$。在CCHI内竞争获胜，即成功发出去的包的数量是$L_1 = P_1 \cdot V$。那么连续两个CCHI内斗发送成功的包的数量是$L_{2}=P_{2} \cdot V=P_{1}^{2} \cdot V$。 那么车辆数量$V$可以通过如下方法进行估计：

\begin{equation}
\widehat{V}=L_{1}^{2} / L_{2}
\end{equation}

由于车辆可以连续的观测多个CCHI，使用最近观测到的$d$个CCHI数据来进行观测可以得到，在第$j$个CCHI

\begin{equation}
L_{x}=\sum_{i=j-d+1}^{j} L_{x}[i] / d, x = 1, 2
\end{equation}

这里我们选择$d = 5$。

> 注意上面的估计方法在满载情况下会有问题

## 决定最佳BSM广播频率

记$f_{\max}$为BSM的最大允许发送速率。当车流密度比较稀疏的时候，$f_{\max}$为限制BSM发送速度的唯一限制。此时Epochs大部分都是空闲的。当车流密度上升时，会有多辆车在同一个Epoch进行发送，这导致冲突，BSM发送失败。为了降低冲突的概率，车辆需要降低广播的频率。

记最佳的广播频率为$f_{\mathrm{opt}}$，在这个发送频率下的$L_1$能够达到最大值。为了决定$f_{\mathrm{opt}}$，我们需要开率MAC特点，Epoch选择以及发送频率调控。

我们假设Epoch的的总是是$E$，车辆数量为$V$，每辆车每个周期还惨胜一个BSM包。$V \ge E$。如果每辆车选择Epoch是完全随机的，那么$k \ge 0$辆车选择了同一个Epoch的概率是$A_{k}=e^{-\alpha} \alpha^{k} / k !$, 其中$\alpha = V / E$为其平均值。我们希望$k=1$时对应的概率尽可能的大。即最大化$E_{1}=A_{1} \cdot E=V e^{-V / E}$。对其微分并令其等于0得到

\begin{equation}
E_{1}^{\prime}=e^{-V / E}(1-V / E)=0 \Rightarrow V= E.
\end{equation}

> 代入$V=E$的情况我们可以得到$A_1 = e^-1 \approx 36.8%$，即只有大约三分之一的包能够无冲突地发送。$A_0 = A_1$，三分之一的Epoch空闲，剩余的不到三分之一产生了冲突。
>
> 不过这里的分析没有考虑竞争过程，即产生冲突的Epoch也可能发送成功的。

因此容易得到发送速率应该为$f_{\mathrm{target}} = E / V$。因此我们可以得到一个可以由车辆本地执行的决定$f_{\mathrm{opt}}$的算法，这一算法过程如下($\mathcal{U}_{T}$为被观测到的在CCHI T中发送BSM数据的车辆的集合):

1. $L_{1} \leftarrow \sum_{i=0}^{d-1}\left|\mathcal{U}_{T-i}\right| / d$
2. $L_{2} \leftarrow \sum_{i=0}^{d-1}\left|\mathcal{U}_{T-i-1} \cap \mathcal{U}_{T-i}\right| / d$
3. $\widehat{V} \leftarrow L_{1}^{2} / L_{2}$
4. $f_{\text { target }} \leftarrow E / \widehat{V}$

## Reference
