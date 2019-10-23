---
title: WIN-T
date: 2019-10-22 13:07:34
footnote: true
---

WIN-T【~中文可以称为：作战人员信息网】是陆军从战区到营级所采用的一个移动、高速、大容量的宽频主干网战术通信网络，可支持陆军全频谱作战, 将最终取代MSE（移动用户设备）和TRI-TAC（三军联合战术通信系统）。作为美军[全球信息栅格 (GIG) ](./GIG.html)的战术组成部分, WIN-T将促进装备部队很好地利用GIG服务以及能力 (包括数据库、收集人员、以及国建机构) , 增加信息赋能行动的次数。

~~WIN-T是未来美国陆军一种移动、高速、大容量的宽频主干网通信网络，可支持陆军全频谱作战，其地域覆盖范围上至战区级单位下至连级单位，将地面作战人员与指挥官和全球信息栅格（GIG）联系在一起。该网络也是以节点（包括机载通信节点）为中心的系统，主要节点有广域网络节点（WN）和用户节点（SN），其中广域网络节点之间的连接是依靠地面宽带无线电中继系统或卫星通信或对流层散射通信或无人机通信或光纤电缆等方式实现的，这些相互连接的广域网节点就形成了WIN-T网络的主干；而用户节点则为战术用户接入该网络提供了入口。~~

![THE BACKBONE OF THE U.S. ARMY'S TACTICAL NETWORK](https://imgs.codewoody.com/uploads/big/5a02c936d7d12f61833c7a064c8129d7.jpg)

未来战术级作战人员信息网（WIN-T）将广泛使用[联合战术无线电系统（JTRS）](./JTRS.html)和机载通信节点（ACN），以解决互通、带宽、速度、入口等问题，最终实现美军各军兵种部队对战场实时态势的全面感知。WIN-T项目分为4个增项【~Increment】实施。

## Increments

### Increment 1: Communications AT-THE-HALT

最初被称为Joint Network Node Network (JNN-N)项目【~JNN项目是2003年伊拉克战争期间总结MSE的问题以后紧急开发的，2004年部署到伊拉克，2007年JNN被合并到充足后的WIN-T项目中<sup>6</sup>】。WIN-T Increment 1 (Inc.1) 最早在2004年的Operation Enduring Freedom和Operation Iraqi Freedom行动中开始列装【~列装：Fielding】。Inc.1 第一次赋予了营【~battalion】级别的高速语音交换服务和数据通信网络。

Inc.1 的列装工作在2012年6月完成<sup>2</sup>，目前为止由美国陆军、国民警卫队和预备役部队使用。为了增强网络安全系数，在2012年以后发展了Inc.1b升级版。

![](https://imgs.codewoody.com/uploads/big/e4966d4e20ba475fda7946ae465e5d70.png)

### Increment 2: Communication ON-THE-MOVE

2013年7月，美国陆军第十山地师于阿富汗战场最早开始列装Inc.2 <sup>2</sup>。Inc.2 使得士兵可以在脱离基础设施支持的情况下进行通信。

Inc.2扩大了网络吞吐量，提供了**自动化的网络管理功能**【~2016年，PdM WIN-T Increment 3被改组为PdM Tactical Cyber and Network Operations (TCNO)项目，这一项目负责实现网络管理功能。参见[NetOps](http://localhost:4000/knowledge-base/military/technologies/%E7%BE%8E%E5%86%9B%E7%8E%B0%E5%BD%B9%E9%80%9A%E4%BF%A1%E7%B3%BB%E7%BB%9F/NetOps.html#netops-win-t)中的介绍】和**移动组网能力**。Inc.2 将移动卫星通信扩展到机动旅战斗队网络中的连一级，使用高敏网络电台。Inc.2中的视距网络为指挥所提供30Mb/s<sup>6</sup>的总吞吐量。具备自组织的能力和自愈能力，提高了网络的可靠性。

其中，Inc.2 中的Tactical Communication Nodes【~战术通信节点】技术提供了战场移动基础设施服务。可移动的Point of Presence系统，该系统包含部署于营级及以上的战术单位的作战车辆的【~营级单位包含4个连，每个连最多两百名士兵10到30个载具】，以及vehicle wireless packages, Soldier Network Extension等连级的系统。

Inc.2 使得作战命令从旅到师到连队等通信可以通过完全ad-hoc的自组网方式进行。指挥官和通信兵可以战场的任意地方操作和维护网络，而不需要专门停下来建设通信设备【~ON-THE-MOVE的含义】。

Inc.2 于2015年6月进行投产，至少于2018年末，陆军尚未完成Inc.2的列装。

![](https://imgs.codewoody.com/uploads/big/dde810b0e49ad9cc8064c456401ff44c.png)

> 上图中NCW为Network-Centric Waveform，是WIN-T专用的一种波形。<i>NCW supports a heterogeneous network of terminals with varying antenna, power, and overall transceiver characteristics, ranging from large-aperture strategic terminals to small-aperture tactical/mobile terminals employing satellite communications on the move (S-COTM), and, by employing an advanced network scheduler, maximizes network data throughput and terminal population by making near optimal use of satellite and terminal resources. ([source](https://ieeexplore.ieee.org/document/4454797))</i>
>
> HNW为 High-Band Waveform

### Increment 3

这个项目还未开始猎装。Inc.3 预计会提供完全的移动，灵活，动态的战术网络能力，能够为较为孤立地区的稀疏部队部署提供通信支持。Inc.3 中将会引入空中平台支持【~2014年，陆军对Inc.3项目进行重组，将空中层删除，推迟到未来开发<sup>6</sup>】。从而实现一种三层架构的通信体系，包括：

1. 传统的Line-Of-Sight通信；
2. 空中平台：包括使用UAV和其他空中平台；
3. beyond-line-of-sight，如卫星

**2017年WIN-T Inc3项目被美国国会叫停**。2018和2019年都有发生从WIN-T Inc.3项目中挪用经费到其他项目的事情。

## WIN-T 中存在的问题<sup>6</sup>

WIN-T 项目耗资巨大，但是经过多次演习测试，并未实现预期的效果，动中通【~Communication ON-THE-MOVE】的能力仍然有限，无法有效应对同样在军事上具有较强势力的对手。WIN-T在部署和使用过程中暴露出以下问题：

1. 操作复杂
2. 压缩了作战人员的使用空间
3. 动中通能力有限
4. 装备过重
5. 过度依赖中继设备: 在<sup>6</sup>的文章中提到，「虽然经过了系统升级战术通信节点、网络运营和安全中心可以越过中继设备在20min的时间里完成通信的重新建立，较之前的几个小时已经有了很大的进步，但是仍然不能满足战场需求」。这篇文章本身并未给出20min这一数据的出处。
6. 网络安全方面存在大量漏洞

> 上面的六点我目前只关注第五点，所以其他的细节并未列出，详情参见「美国陆军战术级作战人员信息网络相关问题分析及启示」论文。

对于20min这个数据的考证信息整理如下：

在[Army to introduce new command post wireless capability](https://www.army.mil/article/149704/army_to_introduce_new_command_post_wireless_capability)这篇报道中提到：

> <i>By going wireless, command posts not only shed cumbersome cabling, but network set up and tear down times are cut from hours to minutes, making those jumps easier and faster.</i>

## Reference

1. [Army Warfighter Network - Tactical (WIN-T) Theory of Operation](https://ieeexplore.ieee.org/abstract/document/6735828): WIN-T是美国陆军（Army）的第一个全面集成的战区级的数据网络系统，可以从战区级往下覆盖至连级别【~连排级应该是[JTRS](./JTRS.html)的天下】。WIN-T项目分为4个增项【~Increment】实施。
2. [Warfighter Information Network - Tactical (WIN-T)](https://gdmissionsystems.com/en/communications/warfighter-information-network-tactical)，这个网页里面提供了WIN-T的Commander's Handbook以及Program Update两个文件的下载。
3. Wiki: [PM WIN-T](https://en.wikipedia.org/wiki/PM_WIN-T#WIN-T_Increment_2)
4. [Army enhances NetOps, the eys and ears of the network](https://www.army.mil/article/167785/army_enhances_netops_the_eyes_and_ears_of_the_network): 陆军已经在测试WIN-T Inc.3引入的新的NetOps软件升级。NetOps
5. [Using hte SEI Architecture Tradeoff Analysis Method to Evaluate WIN-T: A Case Study](https://kilthub.cmu.edu/articles/Using_the_SEI_Architecture_Tradeoff_Analysis_Method_to_Evaluate_WIN-T_A_Case_Study/6585821/1)
6. [美国陆军战术级作战人员信息网络相关问题分析及启示](http://www.jc2.org.cn/CN/article/downloadArticleFile.do?attachType=PDF&id=272)
7. [美军下一代高级战术互联网体系结构发展研究](https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFQ&dbname=CJFD2010&filename=QBZH201006036&uid=WEEvREdxOWJmbC9oM1NjYkZCbDdrNXcxd0FMS2g4T3ZVdjdJSVBTaktqVEE=$R1yZ0H6jyaa0en3RxVUd8df-oHi7XMMDo7mtKT6mSmEvTuk11l2gFA!!&v=MTUyOTZVTDNOTkMvUlpyRzRIOUhNcVk5R1lvUjhlWDFMdXhZUzdEaDFUM3FUcldNMUZyQ1VSTE9lWitSdUZ5L2c=)
8. Inc.2 测试报告: [Warfighter Information Network-Tactical Increment 2 (WIN-T Inc 2)](https://apps.dtic.mil/dtic/tr/fulltext/u2/a621709.pdf)
9. NCW介绍论文：[The WIN-T MF-TDMA Mesh Network Centric Waveform](https://ieeexplore.ieee.org/document/4454797)
10. globalsecurity.com: [Warfighter Information Network-Tactical (WIN-T)](https://www.globalsecurity.org/military/systems/ground/win-t.htm)
11. [PM WIN-T Information & Support Exchange](https://win-t.army.mil/wint/menu.cfm)
12. 一篇西电硕士论文：[WIN-T侦察干扰策略研究](https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CMFD&dbname=CMFD2009&filename=2009055867.nh&uid=WEEvREcwSlJHSldRa1FhcTdWa2FjR1dTV1UwTzFDR0IyM1h1VWdVUHh4Zz0=$9A4hF_YAuvQ5obgVAqNKPCYcEjKensW4IQMovwHtwkF4VYPoHbKxJw!!&v=MjkwMTRxVHJXTTFGckNVUkxPZVorUnRGeXpsVTdySlYxMjdGN085RzluS3FKRWJQSVI4ZVgxTHV4WVM3RGgxVDM=)
13. 网络管理模块相关的论文：[Hierarchical and federated network management for tactical environments](https://ieeexplore.ieee.org/abstract/document/1605974)
