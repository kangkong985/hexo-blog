---
title: 三维马尔科夫链的详细调研
date: 2019-05-21 16:48:31
mathjax: true
---

## 参考文章及其系统模型

在[马尔科夫链在WAVE链路层网络性能分析中的应用](./)中我们提到了三维马尔科夫链的使用。相比于经典的[@bianchi2000performance]中提出的二维马尔科夫链，三维马尔科夫链新增的一维主要是为了解决EDCA机制下不同优先级的队列并存的问题。

### Contribution

下面的内容以[@shao2015connectivity]为基干进行讨论。这篇文章的主要贡献是讨论网络连通性与饱和吞吐率性能之间的关系。具体贡献是如下三个方面：

1. 作者提出了一种Connectivity-aware MAC protocol，支持多信道标准（1609.4），为编队场景设计；
2. 使用了多优先级的马尔科夫模型来研究网络连通概率与饱和吞吐率之间的关系；
3. 提出一种多信道的资源调度策略，可以动态的调整CCHI和SCHI的长度来改善系统吞吐性能。

### System Model

文章使用的System Model是比较简单和经典的场景：无干扰情况下的单向高速公路交通流，单车道，从而避免超车这种复杂行为。

![System Model](https://imgs.codewoody.com/uploads/big/fcd207caecc95e09093822f17db0486c.png)

道路上车辆总数为$N$，在高速公路上随机分布。道路总长为2000m。假设存在$K$辆普通车辆，$M$个编队。每个编队被视为一个单独的车辆。在编队内部，编队成员直接连接，所有的成员可以直接同编队的Leader通信。编队成员将自己的安全和非安全消息发送给编队Leader，然后Leader代表整个编队去竞争CCH的使用。记$p$为网络中编队的比例，即任何一个通信单位是一个编队的概率为：

\begin{equation}
p=M / N=M /(K+M)
\label{1}
\end{equation}

即$R_1$和$R_2$分别为普通车辆与编队Leader的通信范围，且$R_1 < R_2$。假设$R_2$足够大到可以覆盖整个编队，且编队的长度小于$R_2 - R_1$。这一假设其实就是阻止了编队内部成员和外部普通车辆的直接通信。

车辆在高速公路上的分布服从泊松分布，所有车辆都在RSU的通信范围内。记$\rho$为交通密度，那么在$x$米长度的道路上出现的车辆的数目为$k$的概率为：

\begin{equation}
f(k, x)=\frac{(\rho x)^{k} e^{-\rho x}}{k !}, k \geq 0
\end{equation}

令$X$为表示车间距的随机变量。则其分布可以表示成：

\begin{equation}
\operatorname{Pr}\{X \leq x\}=h(x)=1-e^{-\rho x}
\end{equation}

### 连通概率分析

记$X_{i} \quad(i=1,2, \ldots, N-1)$代表相邻两辆车的车间距分布。当车间距不超过通信范围时，即$X_i \le R$时，认为两辆车连通。记$P_c$为VANET的整体连通概率，即：

\begin{equation}
P_{c}=\operatorname{Pr}\left\{X_{1} \leq R, X_{2} \leq R, \ldots, X_{N-1} \leq R\right\}
\end{equation}

这里$X_i$是独立同分布的。所以

\begin{equation}
\begin{aligned} P_{c} &=\prod_{i=1}^{N-1} P_{r}\left\{X_{i} \leq R\right\} \\ &=\prod_{i=1}^{N-1}\left[(1-p) * P_{r}\left\{X_{i} \leq R_{1}\right\}+p * P_{r}\left\{X_{i} \leq R_{2}\right\}\right] \end{aligned}
\end{equation}

代入System Model中的泊松分布模型，有

\begin{equation}
P_{c}=\left[(1-p)\left(1-e^{-\rho R_{1}}\right)+p\left(1-e^{-\rho R_{2}}\right)\right]^{N-1}
\label{6}
\end{equation}

根据$\eqref{6}$，

\begin{equation}
p=\frac{1-e^{-\rho R_{1}}-P_{c}^{\frac{1}{N-1}}}{e^{-\rho R_{2}}-e^{-\rho R_{1}}}
\end{equation}

### MAC Protocol

在作者提出的MAC协议中，CCHI被进一步划分成SAFety Interval (SAFI), WSA Interval (WSAI)和ACK Interval (ACKI)。如下图：

![The framework of the connectivity-aware MAC protocol](https://imgs.codewoody.com/uploads/big/a4021aaa90913f45c2fd208880177763.png)

首先，在CCHI的开头，所有车辆在SAFI广播优先级最高的安全信息。在WSAI阶段，所有提供服务的车辆竞争式地访问信道以广播WSA包。WSAI被划分为若干时隙，在每个时隙的开头，如果信道是空闲的，则服务提供者尝试发送WSA包。在ACKI阶段，收到了安全消息的车辆，以及对WSA中包含的服务感兴趣的车辆，会发送ACK。为了避免重复发送，当之前已经有节点响应了对特定安全消息或WSA服务的ACK的话，后续的车辆不会再次进行响应。为了维护网络公平性，在每个ACKI内节点发送ACK的顺序会随机分配。

WSA与对应的ACK，构成了一套SCH资源预留机制。在CCHI结束时，已经成功预留了SCH资源的车辆切换到对应的SCH信道，进行无冲突的信息传输。

前面我们提到，对于编队系统，编队的Leader需要代表整个编队进行CCH竞争。因此，考虑到网络公平性，来自编队的WSA消息（WSAP）相比于普通车辆的WSA消息（WSAO）应当拥有更高的优先级。

在上图描绘的MAC协议中，SAFI的长度和ACKI的长度与车辆数量成正比。而WSAI的长度，需要通过对应的多优先级马尔科夫模型来计算。

### 马尔科夫模型分析

在上一个部分我们提到，处于网络公平性的考虑，来自编队的WSA消息要拥有更高的优先级。这里的优先级控制通过EDCA机制来完成。在EDCA中，不同的优先级体现在不同长度的Aribitration Inter-Frame Space (AIFS)上。这里我们认为WSAP的AIFSN为2, WSAO的AIFSN为3。

此处的马尔科夫链采用了典型的假设：

1. 理想信道条件（no hidden terminal and capture);
2. 节点满载，即任何时候都有包等待发送
3. 包的传输概率和碰撞概率是独立的

#### 状态变量与状态转移

马尔科夫链的状态变量被定为：

1. $s(i, t)$：backoff stage
2. $b(i, t)$: value of backoff timer
3. $v(i, t)$: active stat of the backoff procedure

这里$i$表示包的类别。1表示WSAP，2表示WSAO。令$L_i$为类别$i$的最大退避阶段，$W_{i, m}$为类别$i$在第$m$个退避阶段的竞争窗口(CW)大小。那么有$s(i, t) = m, (0 \le m \le L_i), b(i, t) \in (0, W_{i, m})$。当$v(i, t) = 0$时，退避过程被冻结，即$b(i, t)$的值保持不变。反之，当$v(i, t) = -1$时，退避过程正常进行。在定义了上述状态变量之后$\{s(i, t), b(i, t), v(i, t)\}$，我们可以画出状态转移图。

![The Markov chain model of the WSAP transmission](https://imgs.codewoody.com/uploads/big/6a2fc6a29dcb5b5098e986bdf9548936.png)

上图为WSAP的状态转移图。在这个优先级设置下，在每个时隙退避计数器都会减1，即$v(i, t) = -1$。即$p_1$为碰撞概率。则转移概率为：

\begin{equation}
\left\{
  \begin{array}{ll}
  \operatorname{Pr}\{(j+1, k,-1) |(j,-1,-1)\}=p_{1} / W_{1, j+1}+1, & 0 \leq j \leq L_{1}-1,0 \leq k \leq W_{1, j+1} \\
  \operatorname{Pr}\{(j, k-1,-1) |(j, k,-1)\} =1, & 0 \leq j \leq L_{1}, 0 \leq k \leq W_{1, j} \\
  \operatorname{Pr}\{(0, k,-1) |(j,-1,-1)\} =\left(1-p_{1}\right) /\left(W_{1,0}+1\right), & 0 \leq j \leq L_{1}-1,0 \leq k \leq W_{1,0} \\
  \operatorname{Pr}\left\{(0, k,-1) |\left(L_{1},-1,-1\right)\right\} =1 /\left(W_{1,0}+1\right), & 0 \leq j \leq L_{1}, 0 \leq k \leq W_{1,0}
  \end{array}
\right.
\label{8}
\end{equation}

> 从这个状态转移图和转移概率计算来看，这里的退避发送行为和我们在[WAVE](../wave.html)里面提到的退避过程不太一样。这里在达到最大退避窗口后，会重置退避窗口大小，即为[Reset backoff stage](./#二维马尔科夫链)

![The Markov chain model of the WSAO transmission](https://imgs.codewoody.com/uploads/big/8be389a5bb7856e06ab230120b5d81e4.png)

上图是WSAO的状态转移图。当$v(i, t) = 0$时，退避计数器会停止递减。令$p_2, p_{2, \text{idle}}$和$p_{2, 0}$分别为WSAO传输失败，WSAO发送遇到空闲信道，遇到繁忙信道的概率。转移概率为：

\begin{equation}
\left\{
\begin{array}{ll}
  \operatorname{Pr}\{(j+1, k, 0) |(j, -1,-1 ) \}=p_{2} /\left(W_{2, j+1}+1\right), & 0 \leq j \leq L_{2}-1,0 \leq k \leq W_{2, j+1} \\

  \operatorname{Pr}\{(j, k-1,-1) |(j, k,-1)\} =p_{2, \text {idle}}, & 0 \leq j \leq L_{2}, 0 \leq k \leq W_{2, j-1} \\

  \operatorname{Pr}\{(j, k, 0) |(j, k,-1)\} =1-p_{2, \text {idle}}, & 0 \leq j \leq L_{2}, 0 \leq k \leq W_{2, j-1} \\

  \operatorname{Pr}\{(j, k, 0) |(j, k, 0)\} =p_{2,0}, & 0 < j \leq L_{2}, 0 \leq k \leq W_{2, j-1} \\

  \operatorname{Pr}\{(j, k-1,-1) |(j, k, 0)\} =1-p_{2,0}, & 0 \leq j \leq L_{2}, 0 \leq k \leq W_{2, j-1} \\

  \operatorname{Pr}\{(0, k, 0) |(j,-1,-1 ) \}=\left(1-p_{2}\right) /\left(W_{2,0}+1\right), & 0 \leq j \leq L_{2}-1,0 \leq k \leq W_{2,0} \\

  \operatorname{Pr}\left\{(0, k,-1) |\left(L_{2},-1,-1\right)\right\} =1 /\left(W_{2,0}+1\right), & 0 \leq j \leq L_{2}, 0 \leq k \leq W_{2,0}
\end{array}
\right.
\label{9}
\end{equation}

#### 稳态分布

求解$\eqref{8}$和$\eqref{9}$，可以求得稳态分布。WSAP的传输概率$p_i$和WSAO的传输概率$p_j$为：

\begin{equation}
\left\{
  \begin{array}{l}
  {
    p_{i}=\frac{1-p_{1}^{L_{1}+1}}{\sum_{j=0}^{L_{1}} w_{1, j} \  / 2 * p_{1}^{j}\left(1-p_{1}\right)+2\left(1-p_{1}^{L_{1}+1}\right)}
  } \\
  {
    p_{j}=\frac{1-p_{1}^{L_2+1}}{\sum_{j=0}^{L_{2}} w_{2, j} \  / 2 * p_{2}^{j}\left(1-p_{2}\right)+1-p_{2}^{L_{2}+1}}
  }
  \end{array}
\right.
\label{10}
\end{equation}

根据[@mao2010performance]的结论，最大吞吐率可以在信道的空闲状态的平均持续时间和繁忙状态的平均持续时间相等时达到，即

\begin{equation}
\label{11}
E[i d l e]=E[c o l l] \Rightarrow p_{i d l e} * T_{i d l e}=p_{c o l l} * T_{c o l l}
\end{equation}

其中:

1. $p_{i d l e}$为信道为信道空闲的概率；
2. $p_{c o l l}$为信道发生碰撞的概率；
3. $T_{i d l e}$为空闲时隙的长度
4. $T_{c o l l}$为CCH上发生碰撞时持续的时间。

进一步，记信道繁忙概率为$p_{busy}$，包成功发生的概率为$p_{succ}$，则$p_{coll} = p_{busy} - p_{succ}$，然后我们有下面的方程组：

\begin{equation}
\left\{\begin{aligned} p_{1} &=1-\left(1-p_{i}\right)^{M-1} *\left(1-p_{j}\right)^{K} \\ p_{2} &=1-\left(1-p_{i}\right)^{M} *\left(1-p_{j}\right)^{K-1} \\ p_{i d l e} &=\left(1-p_{i}\right)^{M-1} *\left(1-p_{j}\right)^{K-1} \\ p_{b u s y} &=1-p_{i d l e}=1-\left(1-p_{i}\right)^{M-1} *\left(1-p_{j}\right)^{K-1} \\ p_{s u c c} &=M * p_{i} *\left(1-p_{i}\right)^{M-1} *\left(1-p_{j}\right)^{K} \\ &+K * p_{j} *\left(1-p_{i}\right)^{M} *\left(1-p_{j}\right)^{K-1} \end{aligned}\right.
\label{12}
\end{equation}

记$T_{SAF\_pkt}, T_{WSA\_pkt}, T_{ACK\_pkt}, T_{SIFS}$分别为发送安全消息，WSA消息，ACK消息的时间以及SIFS的长度。为了简化分析，我们令$T_{coll}$为最大碰撞时间，即上一个WSA包的最后一个比特和下一个WSA包的第一个比特发生了碰撞。那么有：

\begin{equation}
\left\{\begin{aligned} T_{i d l e} &=a S l o t T i m e \\ T_{c o l l} &=2 * T_{W S A \_p k t}+T_{S I F S} \\ T_{s u c c} &=T_{W S A_{-} p k t}+T_{S I F S} \end{aligned}\right.
\label{13}
\end{equation}

根据公式$\eqref{10}-\eqref{13}$，可以求解出$p_i$和$p_j$。

## Reference
