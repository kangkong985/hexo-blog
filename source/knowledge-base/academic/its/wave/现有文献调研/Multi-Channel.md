---
title: 多信道机制调研
date: 2019-09-05 15:58:22
mathjax: true
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

#### CCH 访问过程

如前面所述，CCH 的访问过程被划分为广播段和协商段。

![CCH 广播段发送的消息的格式](https://imgs.codewoody.com/uploads/big/247ab9750c35026fd72bd9ae93763f1f.png)


## Reference
