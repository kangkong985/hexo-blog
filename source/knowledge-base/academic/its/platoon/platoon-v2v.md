---
title: 基于Platoon的车间通信(V2V)机制设计
date: 2019-05-10 13:46:01
mathjax: true
---

## 编队内通信机制

为了维持编队结构，编队内部的成员需要周期性的交换其运动参数，即*Beacon message dissemination*。目前车联网通信的标准是[WAVE](/knowledge-base/academic/its/wave/wave.html)。这里我们简要叙述一下WAVE的核心特点。

我们需要关注的WAVE的最为核心的两个标准是IEEE802.11p和IEEE1609.4。其中，前者规定了MAC层和物理层的标准，后者提供了多信道仿真的规范。WAVE在物理层上拥有7个信道，包括一个控制信道CCH和六个服务信道SCH。CCH上不能用于发送IP包。一般而言，控制帧和安全相关的重要信息在CCH上传输，而SCH用于传输非安全信息。依照IEEE1609.4的规定，信道访问时间被切分为100ms长的同步间隔SI，SI内部又分为50ms的CCH访问时间和50ms的SCH访问时间。

由于通信资源有限，当车流密度增大时，信道会出现拥堵，导致通信的可靠性(广播效率，丢包率)下降，进而威胁到行程安全。由于CCH信道只有一个且用于传输重要的控制和安全信息，所以研究者一般关注CCH上的通信性能可靠性。

另一方面，当车流密度很低时，CCH信道的资源会限制，不利用充分的信道利用。

以下是解决这些问题的常见策略：

1. 引入非竞争协议（如TDMA）来保证Beacon性能
2. 调节网络参数来优化性能（如调整Beacon间隔，竞争窗口大小等）

### 引入竞争协议

引入非竞争协议后，汽车一般会被分簇，在簇内由簇头来进行同步和通信资源分配，从而确保消息在发送时，发送者对于信道的独占，这样可以最大程度地保证消息发送的可靠性。不过，这种机制的缺陷还是很明显的：

1. 协同和资源分配的机制一般比较复杂
2. 引入了额外的Overhead开销
3. 在大规模网络环境下难以使用，例如涉及到多跳问题时，TDMA的同步和资源分配机制的实现复杂度会远远高于单跳场景。很多文章都是假定簇的大小不会超过单跳范围来规避这个问题。
4. 在大规模网络环境下，另一个问题是时隙资源不够划分之后采用如何策略来保持性能和网络公平性

### 动态调节网络参数

这类方法通常不需要对WAVE原有的协议作出大的修改，也不需要同步和协同，可以进行本地决策。不过其缺点在于为了得到网络环境与待调节的网络参数的关系，需要使用非常复杂的数学模型工具。

### 基于具体业务形态的设计

很多研究都是着眼于提升网络的整体性能，而非聚焦到具体的业务场景。例如在编队场景中，为了改善网络的性能，可以考虑编队的拓扑结构。这一方面的研究还比价少，不过这类研究也比较困难，因为车联网中的具体业务还很少，如何构合理地构建业务场景其实是缺乏一个坚定的共识的。

## 编队间通信机制

车里编队间的通信问题是一个更加宏观的问题。在编队内部我们可以拥有一个非常稳定的拓扑结构，因而可是实现一些需要很高的协同性支持的机制。而在编队间通信问题上，我们就需要处理一些传统车联网场景关注的问题，如VANET connectivity以及链路质量。同时，数据分发过程中的路由问题也需要考虑。

### VANET connectivity

目前对于车联网中车间通信的网络连接性的问题还是主要围绕着自由车辆（即非编队车辆）进行[@yousefi2008analytical]，一般的结论是随着车流量的增加VANET的连通性能够得到改善。[@jia2014network]中讨论了基于编队系统的车联网连通性问题。作者从[VCPS](/knowledge-base/academic/its/platoon/#platoon-as-vcps)的角度来讨论这个场景下的问题，这意味着对于运动和网络性能的联合分析。这也是分析网络连通性的通常做法。

![双向道路上的多编队系统示意图](https://imgs.codewoody.com/uploads/big/6b45350aea124c2d6e3842d015018f5c.png)

#### Platoon Dynamics

在[@seiler2004disturbance]中发现，在采用*predeccessor-following*的控制策略，即每辆车只知道前方车辆的运动参数的情况下，越接近编队尾部的车辆的运动扰动就会越大。因此，编队内的车辆除了需要知道前方车辆的运动参数以外，还需要了解编队Leader的状态l，即*predeccessor-leader*策略[@rajamani1998design]，方能维持一个比较稳定的车间距。Leader的状态可以通过VANET通信来获取。这一思路延续下来的产物是CACC[@fernandes2012platooning]。

#### Architecture

这里介绍的是[@jia2014network]中提出的架构。

基于platoon-based VCPS的角度，我们可以将问题拆解成下面两个过程：

1. networking/communication process;
2. the platoon mobility process.

这里要讨论的架构的主要作用，就是描述这两个过程的运作，及两者的相互作用。这里提到的**相互作用**可以通过下面两个例子来说明：

1. 考虑碰撞预警应用，其中每辆车周期性的发送自己的运动信息，提醒周围的车辆避免碰撞。当编队规模小，编队间距大的时候，通信过程中的冲突和碰撞少，因此延时和丢包率性能好。反之，如果编队规模大，编队间距小，则通信情况会恶化。
2. 考虑CACC系统，CACC依赖VANET来交换周围车辆的运动信息。这里CACC可以建模成网络控制的控制系统。当丢包率提升时，控制系统的可靠性也会下降[@lei2011impact]。

![Architecture for platoon-based VCPSs](https://imgs.codewoody.com/uploads/big/ae3a361d691fbb9238c779deb00ae9c3.gif)

#### Mobility Specification

##### 自由车辆

我们考虑双向一车道的场景，即不存在超车的场景。编队系统由自由随机运动的交通流(*Individual Random Trafic Flow*)构建而来。为了建模这个自由随机运动的场景，我们选择Time Headway这个统计量来作为描述车流分布的基础统计量。

Time Headway定义为同向行驶的两辆相邻的车通过同一个观察点的时间差。一般认为Time Headway是独立同分布的随机变量。对于Time Headway的研究非常早了，也有非常多的模型可以使用。其中比较经典的是指数分布模型，正则分布模型，Gama分布，Log-normal分布。[@ha2012time]中提出，在车流量大约在700到1700 (vph)之间时，Log-normal模型的比较适用。并且，在[NGSIM Trajectory Data](https://catalog.data.gov/dataset/next-generation-simulation-ngsim-vehicle-trajectories)数据集中，Time Headway也是服从Log-normal分布的。因此在这里我们采用Log-normal分布来描述Time Headway:

\begin{equation}
f\left(t_{h} ; \mu, \sigma, \tau\right)=\frac{1}{\sqrt{2 \pi} \sigma\left(t_{h}-\tau\right)} \exp \left(-\frac{\left(\log \left(t_{h}-\tau\right)-\mu\right)^{2}}{2 \sigma^{2}}\right), \quad t_{h}>\tau
\end{equation}

其中，$t_h$是Time Headway，$\tau$为Time Headway的最小值，$\mu$为规模参数(Scale Parameter)，$\sigma$为形状参数(Shape Parameter)。根据这个分布可以得到均值和方差：

\begin{equation}
\mu\left(T_{h}\right)=\tau+e^{\mu+\frac{1}{2} \sigma^{2}}
\end{equation}

\begin{equation}
\sigma^{2}\left(T_{h}\right)=e^{2 \mu+\sigma^{2}}\left(e^{\sigma^{2}}-1\right)
\end{equation}

在交通流的稳定状态下，假设车辆速度大致相等且为常数$V_{stb}$，那么可以得到Distance Headway:

\begin{equation}
s_{h} \approx v_{s t b} t_{h}
\end{equation}

显然，$s_{h}$也是服从Log-normal分布的。另外，我们假设结成编队以后，在一个编队内部的车辆的速度是相同的，为$v_{stb}$。

##### 编队内运动

上面考虑的是自由车辆模型，考虑车辆组合成编队的情况。首先作如下的符号定义：

![符号定义](https://imgs.codewoody.com/uploads/big/fe2bb3e3290e17cf239a96cda68b1e02.jpg)

其中：

- $P^i$表示第i个编队
- $C_j^i$表示在第i个编队中第j辆车。
- $s_j^i$为编队内的车辆$C_{j-1}^{i}$和$C_{j}^{i}$的间距
- $S_i$为编队$P^{i-1}$和$P_i$之间的距离。

为了简便，在后面的讨论中只涉及单编队时我们隐去$i$上标。完整的符号表如下：

![变量查询表](https://imgs.codewoody.com/uploads/big/40079670a4895ff90a892de719e29c50.png)

编队内部的运动模型最常用的是*car-following model*，可以有效地描述ACC-equipped编队运动[@kesting2010enhanced]。在这里我们认为除了Leader之外所有的车辆都遵从*car-following model*。具体的，我们选择*Intelligent Driver model(IDM)*[@treiber2000congested]:

\begin{equation}
\label{5}
s_{j}^{*}(t)=s_{0}+v_{j}(t) T_{0}+\frac{v_{j}(t) \Delta v_{j}(t)}{2 \sqrt{a b}}
\end{equation}

\begin{equation}
\label{6}
a_{j}(t)=a\left[1-\left(\frac{v_{j}(t)}{v_{0}}\right)^{4}-\left(\frac{s_{j}^{*}(t)}{s_{j}(t)}\right)^{2}\right]
\end{equation}

其中$s^*_j(t)$为与前车的目标间距。根据$\eqref{5}\eqref{6}$，可以推导出稳定状态（即$a_j(t)$为0）的车间距:

\begin{equation}
s_{s t b}=\frac{s_{s t b}^{*}}{\sqrt{1-\left(\frac{v_{s t b}}{v_{0}}\right)^{4}}}=\frac{s_{0}+v_{s t b} T_{0}}{\sqrt{1-\left(\frac{v_{s t b}}{v_{0}}\right)^{4}}}
\end{equation}

对于编队的Leader，我们则假定他们的行驶速度处于稳定状态，即速度为恒定为$v_{std}$。

#### Networking specification

假设所有车辆的通信距离相通，为$R$。在网络连通性问题上，只考虑通信距离这一最主要因素。只要辆车间距小于$R$，两者之间的通信就被认为是是可靠的。

在[@jia2014network]中，作者还进一步修改了MAC层的行为：

1. 对于单播包(Unicast)，当发送尝试访问信道时，若信道繁忙，将发送过程推迟一段时间，这段时间由竞争窗口决定（即一轮backoff）。如果没有收到ACK，那么将竞争窗口加倍；
2. 对于广播报，不进行重传，只进行一轮backoff。

**网络拓扑方面做出如下假设**：编队内的车辆可以直接进行通信，Leader负责管理编队，同时扮演网关的功能（接收前方编队的消息并转发给编队成员）。编队的Leader可能被选为Message Carrier来转发来自对向行驶的车辆信息。编队尾部的车负责和后方的编队通信。

![拓扑结构](https://imgs.codewoody.com/uploads/big/8db4c581ed033b4e7fdd5a0039e96798.jpg)

基于上述拓扑，设定对应的车辆通信行为规则：

1. 编队内：所有消息可以直达
2. 编队间：如果编队之间可以进行通信（即前一个编队的尾部车辆可以和后一个编队的头部车辆通信），那么直接由尾部车辆向后方广播消息即可。如果编队之间不能直接通信，那么尾部车辆会先从对向车道中选择距离后方编队最近的车辆来转发信息。如果这样的转发者也无法直接和目的节点通信，那么他会继续向其前方边度转发消息。直到无法继续转发或者被最终目的节点收到为止。这个过程如下图所示：

![编队间信息传递过程示意图](https://imgs.codewoody.com/uploads/big/591cf32adb37163950de0f450dfd99ed.jpg)

#### Connectivity Analysis

连通性分析的核心在于得到编队间距离的分布。

##### 编队间距离分布

为了简化分析，假设所有编队的组成都是一样的。即拥有相同的编队大小和IDM参数（此时我们可以再次略去编队上标号）。基于“符号定义”那张图，编队间距可以表示为：

\begin{equation}
S=S_{L}-L
\end{equation}

进而有如下引理：

> **Lemma1:** Assume all platoons are formed uniformly and controlled by IDM, inter-platoon spacing is lognormal distributed in the traffic steady state with all platoon leaders driving at the same velocity $v_{stb}$.
>
> (证明过程略)

基于这个定理即证明过程的推导可以得到下面的关系：

\begin{equation}
f_{S_{L}}(x)=\frac{1}{\sqrt{2 \pi} \sigma_{D}(x-L)} \exp \left(-\frac{\left(\log (x-L)-\mu_{D}\right)^{2}}{2 \sigma_{D}^{2}}\right), \quad x>L
\end{equation}

\begin{equation}
f_{S}(x)=\frac{1}{\sqrt{2 \pi} \sigma_{D} x} \exp \left(-\frac{\left(\log (x)-\mu_{D}\right)^{2}}{2 \sigma_{D}^{2}}\right), \quad x>0
\end{equation}

##### 编队间通信延时

<暂略>

### 相邻编队的时隙重叠问题

若编队内采用了TDMA的方式进行通信，那么相邻的编队之间的时隙可能发生重叠。在[@liu2017joint]中，作者提出了一种解决这一问题的方法，流程如下：

![相邻编队的时隙分配机制设计](https://imgs.codewoody.com/uploads/big/387cd26c88bb25ea6c931f80bbf9a6a4.png)

在[@liu2017joint]中，作者考虑了编队和自由车辆同时出现的场景，其中编队内发送Beacon时采用TDMA的方式，编队时隙位于CCHI的头部，自由车辆在这一段时间内不允许发送。如果相邻的编队的距离靠的太近（如上图(a)所示)，那么就可能发生时隙碰撞。在这个场景下，如上图(b)中显示，编队A和编队B的时隙分配发生了重叠。重叠时隙内的汽车发送时，会由于CSMA的退避机制导致延时增长以及碰撞。

另一个潜在的问题是隐藏终端问题。即便两辆车彼此之间不会感知到对方，但是在两者通信范围的重叠区域，两者的包会发生冲突，从而无法被重叠区域内的车辆收到。如同上图(c)中的情形，尽管A0和B0两两者互相无法感知对方，如果两者同时发包，中间重叠区域的A1 ~ A4都无法收到。

为了解决这两个问题，作者提出了一种Self-Configuring的时隙分配方式。编队的Leader需要首先确定是否在相邻的编队间出现了时隙重叠，这个确认过程如下：在每个CCHI，编队的Leader会广播一个包含了时隙分配信息的包。如果编队成员正确地收到了此包，那么他们遵循Leader的安排在对应的时隙发包。此时，在正常情况下，Leader应该受到所有成员发送的Beacon。反之，如果Leader在连续若干个CCHI（至少两个）内都发生了Beacon丢包，Leader就会推定这种丢包现象是由于时隙重叠导致的。

在Leader确认发生了时隙重叠以后，Leader会自适应地重新安排TDMA时隙，暂时选择重叠的时隙的下一个时隙。当没有重叠的时隙安排时，Leader会重置到最初的时隙安排。

> 上一段话中描述的重新安排重叠时隙的方式翻译自原文，不过我觉得这里有点问题：
>
> 1. 时隙重叠是对称的，即A编队和B编队的时隙分配发生重叠时，双方的Leader都能检测到冲突，双方同时开始调整，反而使得原来的重叠时隙空出来。
> 2. “选择重叠的时隙的下一个时隙”这个做法也含糊。按照情况分析，应该是将时隙序列整体往后移动一个时隙的长度，但是发生重叠的时隙可能不止一个，而且重叠的时隙并不一定连续，那如何处理呢？
>
> 我对这里的这个机制持怀疑态度，作者在文章中也并未从理论和仿真的角度验证这个机制的有效性。出于严谨，读者最好参阅原文中的Section V-C

我们还需要考虑下面的两个问题：

当两个编队A和B同向行驶且距离较近时，前方的编队A保持其时隙结构不变，后面的编队B将其时隙延迟到A的时隙之后（如上图(e))来避免碰撞和隐藏中断问题。**这是因为在前车数据的重要性要比后车的重要性高**。另一个原因是后方编队的Leader检测时隙重叠的速度更快（例如前方编队的Leader不会受到隐藏终端问题的影响）。

当编队A和B是反向行驶交会时，当两个Leader的间距小于通信距离，Leader发送的包会发生冲突。根据文章中的机制设计，在CCH信道上编队的TDMA时隙结束后的CSMA通信过程中，Leader还有一个机会发送Beacon包。此时，哪方先收到了对方的Beacon，哪方延后其时隙安排。

### 用混合协议解决编队间通信

这里的混合协议是指TDMA和CSMA的混合协议。

## Reference
