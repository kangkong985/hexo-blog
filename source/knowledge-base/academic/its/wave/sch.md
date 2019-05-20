---
title: WAVE中的SCH调度机制研究状况
date: 2019-04-29 16:15:22
mathjax: true
---

[WAVE协议](./)中指定了CCH和SCH两种信道。在这个页面我们梳理一下现有的学术界对于如何调度使用SCH信道的机制研究。

## 在SCH上进行调度（W-HDF）

以下部分整理自[@marica2012enhancing]，这篇文章提出了一个名为W-HCF(WAVE-based Hybrid Coordination Function)的信道访问机制。该机制优化的目标是非安全类应用。

[WAVE DCF](./wave.html)机制的主要问题在于无法保证带宽和延时性能。这对于特定的应用是难以忍受的（如多媒体串流）。W-HCF机制的核心在于针对非安全类应用，区分QoS敏感和QoS不敏感的业务类型，并且针对这两种业务采取不同的SCH访问控制策略。

对于QoS不敏感的业务，W-HCF保留了WAVE标准中的特点：

1. 简化的WBSS结构，不需要认证(Authentication)和关联(Association)过程；
2. EDCA on SCHI

而对于QoS敏感的业务，需要一些额外的机制来保证带宽和延时性能。W-HCF提出的这些机制和WAVE完全兼容的。

对于QoS敏感的服务的提供者，其必须要知道对其提供的服务感兴趣的用户，并且有能力为这些资源预留资源。这些欲求意味着：

1. 对服务感兴趣的用户需要显式地(explicitly)发送消息来加入WBSS；
2. 服务的提供者需要显式地预留资源来确保相关用户访问服务时能够有无竞争的资源访问；
3. 要有机制确保只有目标用户还在服务提供者的覆盖范围内时才进行Polling (Polling的含义见下面的过程描述第五点)
4. 在竞争性的服务提供者之间建立协作机制，以避免无干扰的WBSS（通过使用不同的SCH信道或者是利用TDMA）

W-HDF的主要过程如下：

1. *Q-WBSS初始化*。在CCHI，Q-pr广播QoS-Enhanced WAVE Service Advertisements (Q-WSA) 来创建Q-WBSS。Q-WSA是对于原始WSA信息的扩展；
2. *A Gossip-based distributed CAP reservation scheme*: 减少临近的Q-pr之间的干扰和冲突。这里的CAP是指*controlled access period*
3. *User registration and TXOP negotiation*: 在SCH上，Q-users向Q-pr请求分配CAP资源；
4. *Controlled data transfer*: 在SCH上，CAP阶段和竞争阶段交替。CAP的起始时间和持续时间由Q-pr控制。
5. *基于位置的Polling*：这里的Polling指由Q-pr主动，向多个用户拉取数据的过程。Q-pr会根据车辆的位置和速度来决定是否进行Polling，从而避免资源浪费（例如不要从已经不在Q-pr覆盖范围内的用户上拉取数据）

上面步骤中的缩写含义为：Q-pr: QoS Provider，Q-user: QoS User。

### Q-WBSS初始化

Q-WBSS是围绕着Q-pr建立的，因此Q-WBSS的初始化实质就是Q-pr初始化的过程。Q-pr在CCH上通过EDCA的规则来尝试通过广播Q-WSA信息来占用信道。Q-WSA在原始WSA包的基础上新增了两个字段：CAP频段和4个字节的`Own_SCH_Allocation`字段。这一四字节字段包含两个两字节的子字段：`CAP_start`, `CAP_duration`。前者是预留的Contention-Free的CAP阶段的开始时间，后者是为了满足用户通信需求的CAP持续时间。在初始化阶段，Q-pr并不知道潜在的用户数量，因此最初的广播只包含了Q-pr自身的通信需求（主要是Beacon）。

> 作为广播，Q-pr在广播后不会收到任何反馈，作者在这里说可以通过多次广播来提高可靠性

### Gossip-based distributed CAP reservation



## Reference
