---
title: OLSR 路由算法原理
footnote: true
abbrlink: 17082
date: 2019-11-26 15:12:10
categories:
  - 科研
tags:
  - 科研
  - 教程
  - 路由
---

OLSR的全称为Optimized Link State Routing。既然是Optimized，那么说明其实还存在一个名为Link State Routing的路由算法。我们先来介绍一下Link State Routing的设计思路，然后着眼于Link State Routing存在的问题，介绍一下OLSR的优化方向。

<!--less-->

## LSR

LSR为基于链路状态的路由算法。如何判断链路状态呢？在无线通信的环境下，只需要节点能够收到另一节点的包，就说明链路有效。另一方面，为了建立端到端的路径，路由算法需要发现并检查一跳由多个单跳链接组成的多条链路的可用性，这就需要不断的洪泛广播(flooding)来进行。这种洪泛的方式是非常浪费的。参加下面的例子：

<figure>
<img alt="" src="https://imgs.codewoody.com/uploads/big/37a383e0cf5a9d404d4ddffa149f0f7a.jpg" style="width: 60%"/>
<figcaption>LSR 示意图</figcaption>
</figure>

为了在网络中同步节点状态，需要各个节点进行洪泛广播，产生大量其实是存在冗余的通信。在能源受限的移动网络中是非常不经济的。OLSR通过有选择的洪泛转发(MPR: Multi-Point Relay)来解决这个问题。

## OLSR

OLSR 将 LSR 中简单的路由建立与同步过程切分成两部分：将邻居信息发现与维护同路由发现独立开来。

### 邻居发现

OLSR通过周期性地广播Hello消息来发现邻居，建立邻居表。邻居表表中记录一跳及二跳邻居节点的信息，节点间的连接也会被记录为单向还是双向。

Hello消息中包含**发送节点的所有邻居即相关的连接状态(单向还是双向)**。当节点收到的Hello消息中，对方已经将自己加入到邻居列表中时，说明二者之间的连接为双向。

通过Hello广播过程可以让网络中所有的节点都能知晓距离自己两跳及以内的邻居的信息。

基于邻居信息，节点可以选择出邻居MPR节点集合。一个节点选定的MPR是负责转发此节点的广播消息的节点。通过控制MPR集合的大小可以减少洪泛的开销。MPR选择分为两步：

1. 首先选择能够覆盖「孤立二跳邻居节点」的一跳邻居节点。这里孤立二跳邻居节点是指仅通过一个邻居节点同目标节点相连的二跳邻居节点；
2. 在余下的一跳邻居节点中，按照覆盖二跳邻居节点的数量从高到低依次选择，直到覆盖所有的二跳邻居节点。

![MPR 选择算法](https://imgs.codewoody.com/uploads/big/718503c86c626add0ab0f177d6dbb25f.png)

如上例所示。首先我们找出覆盖「孤立二跳邻居节点」1和5的A和E，将其加入MPR列表。此时1，2，3，5都被覆盖。在剩下的一跳邻居中，覆盖二跳邻居最多的B（3个）被加入MPR，然后是E，然后是G。当G被加入MPR后，所有的二跳邻居节点都被MPR覆盖。此时的MPR即为我们要选择的MPR全集。

MPR表会通过Hello信息同步给一跳邻居节点。这样每个节点能够建立本地的MPR Selector表，此表表明节点自己应该转发来自哪些节点的广播消息。

### 路由发现

邻居发现过程使用了Hello消息，路由发现则使用另一种格式的消息：Topology Control消息。TC消息的作用是为节点建立起全局的路由信息。只有MPR节点才会转发TC消息【~需要注明的一点是：到底是MPR节点在收到TC消息以后是原样转发还是与本地的拓扑表合并以后发送本地拓扑表还存疑】。

TC消息中包含了发送者的MPR Selector【~注意MPR Selector不是指一个节点的MPR节点集合，而是一个节点作为MPR应该转发来自哪些节点的消息】信息以及一个Sequence Number。

基于TC消息的交换，各个节点可以维护一个Topology Table（拓扑表），基于拓扑表节点可以计算出路由表（通过Dijkstra算法）。拓扑表的结构如下：

| Destination address | Destination's MPR | MPR Selector<br />Sequence Number | Holding Time |
|  ----  | ----  |  ----  | ----  |

> [Markdown中表格的语法](https://www.runoob.com/markdown/md-table.html)

上述四项分别为：

1. 目标地址
2. 目标地址的MPR节点
3. Sequence Number
4. 该条目的保持时间

上面提到TC消息中包含的是发送节点的MPR Selector列表。那么当另一节点收到TC消息时，将TC条目中的MPR Selector作为目标地址，则发送节点即为其MPR节点，然后填入TC消息中的Sequence Number，已经预定义的Holding Time。

我们考虑下面这个例子：

这个例子中，A，B，C三个节点均将M选择为自己的MPR节点，那么M会建立如下的MPR Selector列表：

| TC Originator | MPR Selector | MPR Selector Sequence |
|  ----  | ----  |  ----  |
| M | A | 1 |
| M | B | 1 |
| M | C | 1 |

作为MPR，M会将其MPR Selector列表通过TC消息广播出去。当Y收到M发出的TC消息时，将TC消息中包含的MPR Selector信息转化成拓扑表 (Holding Time省略)：

| Destination address | Destination's MPR | MPR Selector<br />Sequence Number |
|  ----  | ----  |  ----  |
| A | M | 1 |
| B | M | 1 |
| C | M | 1 |
| ... | ... | ... |

> 注意对于一个收到TC消息的节点X而言，消息流的顺序是MPR Selector -> MPR -> X，那么反过来如果X需要向这个MPR Selector发送消息，则链条中的MPR节点就是到达目标前的上一跳节点。所以拓扑表中的第二列也会被称为Last-hop Address。故拓扑表中的每一行其实表明了网路中的一条链路。

网络中周期性的通过TC消息保持拓扑表更新，通过拓扑表使用Dijkstra算法即可获得路由表。

## Further Reading

- [OLSR路由协议工作原理](https://blog.csdn.net/chixi123/article/details/85068740)
- [Optimized Link State Routing (OLSR) Mobile Adhoc Network Proactive Routing Protocol](https://www.youtube.com/watch?v=3V19nPxpMp8&t=881s): 这是一个Youtube的介绍视频，有点印度口音，通过英文字幕倒是可以听懂。讲的还不错。
