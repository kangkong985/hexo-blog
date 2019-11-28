---
title: '读论文:一种面向无线网络的Group Centric Networking路由算法'
abbrlink: 53819
date: 2019-10-28 10:59:29
tags:
  - 无人机
  - 科研
  - 读论文
  - 路由
categories:
  - 读论文
mathjax: true
footnote: true
---

这次我们要读的文章是<i>Group centric networking: A new approach for wireless multi-hop networking</i>[@greg2018group]，文章的作者来自MIT的[林肯实验室](https://zh.wikipedia.org/zh-hans/%E6%9E%97%E8%82%AF%E5%AF%A6%E9%A9%97%E5%AE%A4)。这篇文章主要提出了一种针对大规模的物联网系统无线网络的网络架构方案，方案的名称为Group Centric Networking (GCN)。协议仿真由NS3仿真来实现，同时还在一个由90部Android手机组成的测试平台上进行了测试，并且作者将相关的源代码进行了开源。在通信网络相关的文章中，能够进行如此详尽的实现和测试的文章不多的。因此这篇文章有比较多的研究价值。

<!--more-->

> 评论：看完这篇文之后再回到这里写评论。这篇文章提出的思想还是有意思的。现有的无线组网算法基本是对有线场景的路由算法的照搬，尤其是那些基于链路的路由算法。但是无线通信天然就是广播的，充分挖掘这一特点可以提高无线路由的可靠性。不过，作者选取的场景比较「诡异」，虽然提出了分组的概念，但是组内成员在空间上没有聚集性，而且和众多非组内成员杂处。这一场景可能在某些IOT场景有其合理性，但是对于移动组网场景而言，这个组的分布特点，是不太符合实际情况的。一般移动场景，需要进行通信的分组都是有一定的空间聚集性，且不同的组之间往往会有一定的距离，且不会杂处。例如无人机集群，同一组的无人机一般是执行某个任务，集中于某个区域，而不同组队无人机执行不同的任务，一般不在一块。所以这篇文章对于解决我们的问题，作用非常有限。

多跳无线自组网问题由来已久，但是我们还并未真正实现最初的设想 -- 即提供一种能够几乎不依赖于基础设施泛在的连接网络。目前广泛使用的无线网络方案，如Wifi和移动蜂窝网络，仍然依靠有限网络作为backbone，其无线部分只是解决了最后一跳的问题。不过随着物联网的大规模应用趋势逐渐到来，这种星型拓扑的结构可能无法支撑爆炸性增长的节点数量。因此发展自组网能力就非常重要。物联网的节点，是不大可能全部采用有线连接的方式的。用有线方式部署成本比较高，维护困难。事实上5G网络已经引入了[D2D](https://en.wikipedia.org/wiki/Device-to-device)部分。

多跳无线自组网问题的核心挑战包括：

1. 网络的可扩展性
2. 通信的可靠性
3. 高动态特性（不稳定拓扑）

其中，对于物联网应用来说一般节点位置比较固定，故第三点问题不太显著。

下面我们来详细讨论一下[@greg2018group]中的内容。

## 未来网络特点分析

传统的网络架构往往强调一个「地址」的概念。通常一个用户是client，另一个用户是server，这两个用户在网络中的任意位置，通过路由算法进行连接。在未来的网络中，这种点对点(P2P)的架构可能就不合时宜了。在物联网场景中，更多的是海量的设备位于一个局域网络中，服务于一个人类终端用户，或是在工厂中协作改进生产效率。传统的长距离的P2P通信将不是网络通信的主要内容。作者将这种「局域化」通信的网络特性称之为Group-Centric，即局部通信成为网络流量的主要模式。

总结来看，Group-Centric网络有如下特点：

- <i>Devices will be grouped by an inherent set of "interests" that are dependent on the tasks they are performing, and these group members will wish to communicate reliably between one another. Devices are not limited to a single group, and can belong to multiple groups.</i>
- <i>The majority of message exchanges will be within some local area, and long-distance traffic will only be a small fraction of overall communications.</i>
- <i>Any device can be a source or a sink, and traffic patterns between them may be one-to-one, one-to-many, many-to-one, or many-to-many.</i>
- <i>Future wireless environments will have a mix of mobile and stationary devices, where mobility will be typically be limited to some local area.</i>

> 文章中提到一个数据很有意思：<i>a recent study shows that 95% of traffic in military networks travels at most three hops, with only 5% of traffic being long-range</i>[@ramanathan2010scalability]

**当前多跳无线网络的路由机制，本质上是照搬有线网络中的解决思路**。这些路由机制都是基于链接(Link)的，即将远程端到端通信分解为多个首尾相接的链路。但是相比于有线网络，无线网络有天然的广播特性(干扰，多径，噪声等问题)，因此执着于Link的方式是不合适的。<i>The idea of a link is itself borrowed from wired networks: in a wireless network, there is no one-to-one connection between two radios; transmissions are sent over-the-air and are typically overheard by multiple devices</i>。

本文[@greg2018group]提出的GCN方法，就摒弃了基于Link的路由概念，而使用了「智能洪泛」(smart-flood)的方法。GCN的核心特点如下：

- <i>No link state or neighbor information is utilized or maintained, and minimal control information is exchanged.</i>
- <i>Data is efficiently disseminated only across the region where group members exist. To support this, we develop a novel Group Discovery algorithm that dynamically discovers the region of interest and efficiently selects the minimal amount of relay nodes required to “cover” this region</i>
- <i>More reliable communications is achieved in an error-prone and mobile environment by using **tunable resiliency**, where the number of redundant data relays is configurable and is able to self-adjust in response to real-time channel conditions.</i>
- <i>Devices communicate in a many-to-many traffic pattern. Efficient one-to-one, one-to-many, and many-to-one are subsets.</i>

文章证明了，CGN相比于传统无线网络路由算法，使用的网络资源少一个数量级，且提供了可靠的通信连接。

## GCN机制内容

GCN 设计的目的是服务于设备分组聚集的网络，其中大部分的通信内容都在组内部进行。 网络中的节点资源受限，环境中存在干扰导致通信并不总是可靠。因通信需要：i) 能够抗干扰；ii) 高效实用带宽和能量。

### 业务模式

组件用户的通信是多对多模式(many-to-many)。一个用户可能希望想另一个组中的全部或者部分用户发送数据，或者是从另一个组内收集数据。注意One-to-one, one-to-many, 和many-to-one通信模式其实都是many-to-many的子集。

GCN 的一个网络布局的例子如下图：

![An example of a group centric network](https://imgs.codewoody.com/uploads/big/ca59b0e35fba4e7241838a21b2625246.png)

在上图中，通过定义一系列的中继节点，我们让组内的成员可以互相连接起来。使用one-to-many的通信方式，即便存在一条链路传输失败，其他节点可以继续中继数据。上图中只显示了一个Group，但是节点事实上可以同时从属于多个group。

GCN的核心机制如下：

- <i>Group Discovery</i>: Efficient discovery of the local region where group members reside via a group discovery algorithm that is able to connect group members without the use of global control information
- <i>Tunable resiliency</i>: Relay nodes are activated such that the local region is sufficiently "covered" in data by having a tunable number of **redundant data relays**. This allows for resiliency towards both packet loss and mobility without the need for the constant exchange of control information. The number of activated relay nodes self-adjusts in response to real-time channel conditions
- <i>Targeted flooding</i>: Data can be efficiently and resiliently sent between sets of group members through an approach we call "targeted flooding"

### Group Discovery

Group Discovery 的作用是在**没有先验信息的情况下**于局部发现彼此相连的组成员（不局限于一跳，但是最大跳跃数不会太高）。且这一过程不需要进行低效率的全局广播过程。Naive的做法是使用TTL机制来做洪泛广播，不过这种方式非常低效，浪费通信资源。

本文提出了一种更叫高效的方法，我们称之为<i>discovery regeneration</i>。其基本思想是，预期发送一个TTL比较大的包，不如多次重新生成一个TTL比较小的包。具体的过程如下：

1. 某个组成员通过发送一个discovery message来发起group discovery操作。相应的discovery message的TTL值，会根据group想要扩展的范围来进行设置。将最初发起者设置的TTL成为<i>source TTL</i>。
2. 如果某个组成员监听到了一个discovery message，该节点会使用source TTL来重新生成一个消息。
3. 如果一个非组成员监听到一个discovery message，如果其TTL大于0，那么将TTL减一后再次广播，反之如果TTL为0，则什么都不做。

中继节点(Data relays)通过Group Nodes发送的ACK消息来确定。当一个Group Member收到一个discovery消息时，会向中继此discovery消息的Group Node发送ACK消息。加载在Group Nodes之间的非组成员节点在收到对应的ACK时，会成为 Data Relays. 当Group Nodes收到多个discovery消息时，只会对第一个discovery消息发送ACK。去重机制会确保discovery消息只被广播发送一次。还有一点要注意的是，ACK消息只会发送给重新生成discovery消息的Group Node，而非一路转发回到最初的原始节点。

在GCN中，当一个节点成为Data Relay的时候，这个节点就作为整个Group的网络的中继节点而存在，而非只服务于当初发送ACK的那个Group Node。同时，中继节点也不需要保留发送ACK的这个组节点的信息。反过来，任何Group Node也会监听来自Relay Node的信息。

上面这一套发现流程完成之后，GCN中的**任何节点都不需要保留链路信息或者是邻居信息**。借助于Relay Node的作用，现在所有组成员都被连接了起来，通过现有网络架构，可以实现One-to-all模式的通信，进而也可以实现many-to-many的通信模式。这个组发现流程可以周期性地执行，从而允许网络结构调整，包括新节点加入等。

下图是上述发现流程的一个例子：

![图中生成discovery时初始TTL为2，发出去的时候减去1。非组成员并不重新生成新的discovery包，而是将TTL减去1转发，因此限制了扩散范围。](https://imgs.codewoody.com/uploads/big/b6466094228a828aeaa0f7fde8c5edca.png)

> 从上面的描述来看，这里的组发现过程，并不只是发现组的成员，还要发现转发需要的Relay Node。

那么，剩下的问题是如何选择合适的初始TTL值呢？如果TTL选的太小，那么不足以发现所有的组成员。如果TTL太大，则会产生太多的冗余通信内容。文章的作者从理论和仿真的角度论证了即便是比较低的TTL值也足以发现比较稀疏的网络中的所有组成员。

设$N$个用户分布在面积为$A$的二维区域中，那么用户密度为$\lambda = N / A$。任意一个用户是组成员的概率是$P_g$，每个成员的通信传输距离都是$X$。在如上假设下，我们可以得到被发现的组成员的比例，同TTL初始值$T$的关系为$1 - e^{P_g \lambda \pi ((X - \frac{1}{2\lambda})\cdot T)^2}$。下图是仿真和理论结果的拟合情况。

![仿真场景为100个节点均匀分布在半径为100米的圆形区域内，每个用户的传输距离是40m。上图中不同的曲线使用了不同的$P_g$值。所有节点都是静止的](https://imgs.codewoody.com/uploads/big/d7cf157e7c8d68d80f097d64ac7e3daa.png)

为了比较GCN机制的优越性，作者提供了整体传输效率的比较。这里的传输效率是指为了将一个消息发送给的网络中所有的组成员，需要实际发送的数据量的大小。这里我们不详细介绍这个环节了，对比图如下。

![传输效率对比图](https://imgs.codewoody.com/uploads/big/02f619ef796b116c7cf1575cd03db232.png)

### Tunable Resiliency

前面的组发现流程为网络中分散分布的组成员创建了一系列中继节点组成的集合，该集合的中继可以实现组成员之间的one-to-many的通信。不过这一组合是「最小组合」，其可靠性还缺乏保障。如果某一中继环节传输失败可能导致后续的传输中断。节点的运动会使得这种情况愈发严重。

为了提升GCN机制的可靠性，作者在上述组发现机制之余在增加了一个新的机制 -- Tunable Resiliency。这一新机制可以激活额外的中继节点以改善GCN广播转发过程的可靠性。额外激活的中继节点的数量可以根据信道条件自适应地调整。Tunable Resiliency机制对于组发现的过程的修改如下：

1. 在ACK【~ACK为组成员回复给潜在的中继节点的】机发送前增加一小段延时。
2. 每个用户都记录其周围的可见邻居节点的数量，以方便确定其周围存在的可能的中继节点的数量。
3. 以随机性的方法选择一组用户【~用户依照一定的概率自行决策】成为中继节点。

在ACK前增加一小段的延时是为了让组发现消息(discovery message)充分传输到特定用户的周围，以方便用户统计周围邻居节点的数量【~下面马上会讨论这个】。这一延时的大小的确定取决于用户的链路层。

在邻居节点数量统计过程中，一个用户会计算周围发送discovery messages的节点的户数量。除非一个节点是非组成员节点，而且TTL为0，不然收到discovery messages的节点会立刻转发此消息。因此延后ACK一小段时间，节点【~目标区域内的节点，包括组成员和非组成员都可以通过这个过程获知邻居数量信息】在发送前可以通过收到的discovery messages的数量来统计周围邻居的数量。

对于可以潜在的中继节点候选者，其可以根据周围邻居的数量来调整自己转变成中继节点的概率。这样可以保证最终生成的中继节点的数量符合预期的密度。

![Tunable Resiliency 效果示例](https://imgs.codewoody.com/uploads/big/20f62faf19e544624d7ed29aee029f3b.png)

### Targeted flooding

上面的两个部分我们讨论的组发现和Tunable Resiliency过程构造的中继节点集合，主要面向的还是一对多的通信模式。为了能够有效地实现多对一或者一对一的通信，作者提出了Targeted Flooding机制。

为了实现这种通信模式，GCN需要通过控制消息传输来获取距离信息（跳跃数，而非空间距离），从而构建一个组成员的梯度场。在每次包（数据包以及控制包）传输时，包会包含如下额外信息：发送者的ID和已经经过的跳跃数(hop count)。每当一个用户监听到一个包时，都会记录自己距离包的最初发送者的距离（跳跃数）。

#### one-to-one traffic

对于某用户$i$，将其到另一用户$j$的距离记为$\Delta_j^i$。从一个用户向另一个用户发出的消息将会在其Header中包含目标地址以及最大传输距离（Maximum Retransmt Distance, MRD）【~MRD在每次转发后都会更新减一】。中继节点在收到要转发的包时，检查其自身到目标的距离是否不超过MRD的限制。若是，则转发，否则放弃转发。

![Traget Flooding for One-To-One的例子，图中圈内的数字为该节点到$j$的距离](https://imgs.codewoody.com/uploads/big/8145678d535d8bf3f933c70771ce62be.png)

上面的例子给出了Target Flooding的过程。在(a)中，经过one-to-group过程，组内节点都可以知道自己到$j$的跳跃数。图中圈内的数字为该节点到$j$的距离。(b)展示了直观的通过链路状态的路由方式，但是这种方式需要维持路由表，开销巨大而且在动态场景下不太稳定。(c)演示了将MRD设置为2时从$i$到$j$消息的传播路径。可见Flooding的范围是受控的。(d)则
演示了将MDR设置为3的情形，这时冗余传输增加了，但是可以提供更多的鲁棒性。

#### one-to-many traffic

这里说的one-to-many指发送给组的一个子集，而非发送给整个组。这种通信模式是对one-to-one的直接扩展。节点在发送时直接指定多个目标地址/MRD对就可以了，其他处理过程和one-to-one通信过程是一样的。

![One-to-many的例子](https://imgs.codewoody.com/uploads/big/5fe8f7a2133675fb2166526d7ae62417.png)

#### many-to-many traffic

many-to-many过程中，各个发送节点独立发送one-to-many模式的消息即可。

> 以上是协议涉及的所有内容，至于仿真部分这里就不分析了

## Reference
