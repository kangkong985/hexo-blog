---
title: 多信道机制调研
date: 2019-09-05 15:58:22
mathjax: true
footnote: true
---

## Lin-2019-Distributed

[Distributed Multi-Channel MAC Protocol for VANET: An Adaptive Frame Structure Scheme](https://ieeexplore.ieee.org/abstract/document/8611438)

IEEE Access, 2019

### System Model

这篇文章采用了基于TDMA的接入机制来确保信息传输的可靠性(Reliability)。 同时还是用了基于竞争的协商机制来保证访问服务信道资源的公平性。文章做如下假设：

1. 每辆车装备有半双工设备，只能同时工作在一个信道上；
2. GPS提供了同步时钟源。

#### 信道帧结构

![Frame structure of MAC layer.](https://imgs.codewoody.com/uploads/big/e0fcd3ee03f35fe7190aaaaba8fadf93.png)

上图展示了在一个同步间隔内的信道帧结构。CCH frame被划分成广播段(broadcasting period)和协商段(negoriation period)。广播段由长度相等的时隙组成（TDMA），时隙的数量可以根据车流密度动态地调整。协商段则采用基于退避(backoff)机制的竞争方式来进行通信。

文章提出了一种「三次握手」机制用于协商段的通信。每次当一轮协商完成后，协商发起者即可以获得一个服务信道。因此，SCH的长度就会根据协商的结果动态地变化。由于协商完成后可以立刻切换到对应的SCH信道，因此可以提高信道的使用效率。

#### CCH 访问过程 (CCH资源分配问题)

如前面所述，CCH 的访问过程被划分为广播段和协商段。我们首先讨论广播段。

我们首先来介绍一下广播段期间车辆发送的消息的结构。如下图所示：

![CCH 广播段发送的消息的格式](https://imgs.codewoody.com/uploads/big/247ab9750c35026fd72bd9ae93763f1f.png)

消息由三部分组成。首先是Header部分，Header部分包含了发送者的基础信息，包括车辆的ID，车辆占据的基础时隙$N_{basic}$。$N_{ts}$表示时隙的总数以及可用时隙的数量。Header中$\text{ID} + N_{rcmd}$的作用是，当$N_{ava}$相对来说很大的时候，车辆会尝试减少时隙总数来提高信道的利用效率。这里的$\text{ID} + N_{rcmd}$表示建议目标节点调换到$N_{rcmd}$这个时隙，进而方便时隙调整。第二部分是邻接表信息(Neighbor information)，记录了两跳范围内的时隙占用情况。其中$S_{slot}$为0表示时隙被一跳邻居节点占用，1表示被两跳邻居节点占用。最后一个部分是安全消息的内容。

由于相距两跳以上的节点之间可以复用时隙。所以这里只考虑两跳以内的时隙分配问题。当一个没有被分配时隙的新节点进入网络时，该节点首先要监听信道一个同步间隔(Synchronization Interval)的时间。通过从邻居节点中解析相关信息，该车辆可以获知两跳内的时隙占用情况。然后此新节点随机选择一个空闲时隙作为basic time slot - 基础时隙。然后到下一个同步间隔时，该节点广播自己的状态消息。

一个同步间隔内的时隙总数可以按照交通密度进行调整。将广播段的时隙总数记为$N_{ts} \in [N_{\min}, N_{\max}]$。网络中车辆数目为$K$, 那么可用时隙数量为$N_{ava} = N_{ts} - K$。直观上来看，$N_{ava}$越大，新节点获取时隙的速度越快。如果我们规定网络中可用时隙的数目不能小于一个阈值$N_{thre}$，那么当$N_{ava} < N_{thre}$时，车辆会尝试增加广播段时隙的总数。反过来，如果车辆减少，$N_{ava}$超过$N_{thre}$，车辆会尝试降低时隙总数【~并不是立即降低】，具体算法的伪代码见下图：

<img src="https://imgs.codewoody.com/uploads/big/bb04ddedee00dadee9635854b99919f1.png" style="width: 70%">

#### SCH 接入过程

SCH的资源分配于CCH的协商段完成。由于SCH的通常是点对点通信，故完成协商的节点可以不等CCHI结束，立即切换到SCH进行通信。

协商段的协商过程示意图如下：

<img src="https://imgs.codewoody.com/uploads/big/aee16e55815aa0fa73ddcdffb2029e7e.png" style="width: 70%">

以上图为例，当车辆A需要服务时，其广播一个请求信息(REQ)。假设车辆C和D能够提供该服务，那么他们会回复一个ACK信息给A。然后车辆A会决定采用哪个车辆的服务。若A决定使用D提供的服务，则A向D发送一个响应消息(RES)。注意协商段是在广播段结束后进行，故此时所有节点已经交换过时隙信息和安全信息了。因此，当A和D完成上述协商过程时，可以切换到一个可用的SCH信道开始通信。

另外一个比较重要的点是，由于协商段发送的消息体积非常小，DCF机制中，与信道繁忙状态下冻结退避计数器的机制没有使用。

SCHI 也被分割成多个时隙。一对车辆之间的传输可能无法使用整个SCHI，因此这部分资源可以复用。复用通过RES消息来调度

<img src="https://imgs.codewoody.com/uploads/big/832b58b9739355368e8dcebdefa291c4.png" style="width:50%">

如上图的，RES中包含了的源节点车辆ID $ID_{sour_veh}$，为需要服务的车辆；目标节点车辆ID $ID_{dest_veh}$，为提供服务的车辆；SCH信道编号$N_{sch}$，以及SCH的长度$T_{sch}$；以及需要使用的时隙集合$O_{set_ts}$。网络中其他车辆在收到RES消息时，会相应地更新SCH占用信息。

在选择SCH信道时，优先选择已经被占用的信道。如果SCH中剩余的时隙资源无法满足需要，那么采用"try the best to transmit"的策略，选择最长的时隙分配。

## Reference
