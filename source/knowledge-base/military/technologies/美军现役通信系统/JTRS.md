---
title: "JTRS: 联合战术无线电系统"
date: 2019-10-18 12:13:34
footnote: true
---

## 概述

目前，美军正在逐步对现役通信系统进行数字化项目改造，以适应未来数字化战场的需要，[联合战术无线电系统（JTRS）](https://en.wikipedia.org/wiki/Joint_Tactical_Radio_System)就是其中的一个重要项目。它是美军唯一一种可适用于所有军兵种要求的通用新型系列（数字）战术电台，其作用主要用于逐步取代美军各军兵种现役的20多个系列约125种以上型号的75万部电台。

联合战术无线电系统（JTRS）工作频率范围（2MHz–3GHz）极宽，基本覆盖了高频/甚高频/特高频波段，型号有手持式、背负式、车载式、机载式、舰载式和固定式等，其主要特点为多频段多模式多信道、可网络互联，这使得JTRS各种型号的电台在复杂的战场环境下不仅能做到相互之间兼容互通，而且还可通过其跨频段跨时空的横向和纵向网络为分布在广阔战区内不同地域的美国陆、海、空和海军陆战队提供远程超视距且安全可靠的语音、数据、图像和视频通信，因而联合战术无线电系统（JTRS）未来有望成为美军在数字化战场中的主要通信手段。

---

<img src="https://imgs.codewoody.com/uploads/big/573589a98dc1b513e12f6d86961233db.JPG" alt="" style="width: 50%; border: none;">

[JTRS](https://en.wikipedia.org/wiki/Joint_Tactical_Radio_System)旨在使用一套可编程的软件定义无线电(SDN)系统来取代现存的多种独立频段的的无线电台。只需要通过软件配置就可以让设备工作与普通的频段与不同的模式（波形）之下，而不需要同时安装多种不同的无线电物理终端，从而实现融合各种基于独立硬件的无线电功能。因此JTRS具有广阔的工作频段范围（2MHz ~ 2GHz）。

美国陆军【~2012年7月五角大楼关闭了JTRS项目办公室，并将采购职权交给陆军([source](http://news.ifeng.com/mil/3/detail_2012_08/02/16502782_0.shtml))】在**2015年六月**宣布全面生产HMS项目（2015-2016年评估，2017年全速生产）。早在1997年8月，JTRS计划获得美军TROC【~联合需求审查委员会】批准，以美国国防部的联合战术结构(JTA)标准为基础。预计美军各军种的大量战术通信计划都将被JTRS取代。这样把大量军用无线电研究活动合并成单一计划，可加速计划的完成，节省研究、开发、采购、训练等费用。美国防部拟用JTRS取代美军现用的25～30个系列共75万部电台。目前，除了海军的数字模块电台计划、空军的集成终端计划和陆军的未来数字电台计划继续进行外，美已删减了大量的研究计划，而且早期型号的JTRS系统将由上述三种电台发展而来。

## 工程规划

综上描述，JTRS是一个野心勃勃的庞大计划，美军计划使用JTRS提供的一揽子通信方案，取代过去的数量众多的单一信道通信设备。

2005年，JTRS项目重组，改由JPEO(Joint Program Executive Officer)领导。JPEO将JTRS项目拆分成如下五个ACAT 1D子项：

- JTRS Network Enterprise Domain (NED)
- JTRS Ground Mobile Radios (GMR)
- JTRS Handheld, Manpack, & Small Form Fit (HMS)
- JTRS Multifunctional Information Distribution System (MIDS)
- JTRS Maritime Fixed/Station (AMF)

以及一个ACAT III项目 Handheld JTRS Enchanced Multi-Band Intra-Team Radio (JEM).

### NED

简而言之，NED项目负责开发，维护和增强JTRS对于Legacy网络和协议兼容与互操作。NED产品线包括：

- 15 Legacy Waveforms
    - Bowman VHF
    - Collection Of Broadcasts From Remote Assets (COBRA)
    - Enhanced Position Location Reporting System (EPLRS)
    - Have Quick II
    - High Frequency Single sideband / Automatic link establishment (HF SSB/ALE)
    - NATO Standardization Agreement 5066 (HF 5066)
    - Link 16
    - Single Channel Ground and Airborne Radio System (SINCGARS)
    - Ultra High Frequency Demand Assigned Multiple Access Satellite communications (UHF DAMA SATCOM) 181/182/183/184
    - Ultra High Frequency Line-of-Sight Communications System (UHF LOS)
    - Very High Frequency Line-of-Sight Communications System (VHF LOS)
- 3 Mobile Ad Hoc Networking Waveforms
    - [**Wideband Networking Waveform (WNW)**](Wideband Networking Waveform)
    - Soldier Radio Waveform (SRW)
    - Mobile User Objective System (MUOS)–Red Side Processing
- Network Enterprise Services (NES) including
    - JTRS WNW Network Manager (JWNM)
    - Soldier Radio Waveform Network Manager (SRWNM)
    - JTRS Enterprise Network Manager (JENM)
    - Enterprise Network Services (ENS)

> 注意上面Wideband Networking Waveform即为 _Traffic Predictions for Tactical Wideband Communication_ 这篇论文面向的方向，只是JTRS的很小的一部分。

### GMR

GMR则是面向DoD（国防部）和陆军改革的核心项目，提供了联合作战的关键通信能力。GMR项目由波音公司承包。

GMR可以使用1至4个信道，支持多个安全等级，可以高效地使用2MHz ~ 2GHz的频段。此无线电兼容SCA (Software Communication Architecture)，提高了其带宽，并可以和现存的多个军用电台系统互操作。GMR支持如下Waveform【~waveform可以理解为软件定义无线电中的「软件」】

- WNW
- SRW
- SINCGARS
- EPLRS
- UHF SATCOM【~SATCOM表示卫星通信】
- HF SATCOM

<img src="https://imgs.codewoody.com/uploads/big/094b1ebc36bf0fc720b1b42fb39f137c.jpg" style="width: 50%; border: none" alt="">

上述所有的波形中，GMR的核心是WNW。WNW支持在非LOS(non-line-of-sight)场景下的重新路由和重传(re-route and re-transmit)，从而确保在地面战场维持环境感知。GMR WNW采用ad hoc的组网方式，可以使得玩过

目前GMR合同已经完成，陆军计划将GMR中获得的知识应用于未来的[Mid-Tier Networking Vehicular Radio](https://asc.army.mil/web/portfolio-item/c3t-mid-tier-networking-vehicular-radios-mnvr/) solicitation【~可以翻译为中间层网络车载电台系统，起作用是在更高层次的战术通信网络，如旅和营级别，和低层次的战术通信网络，如连排级别，起到中间层的作用，solicatitation的意思是募款】中。

不过由于JTRS GMR项目严重超预算，美国国防部将援引纳恩-麦克柯迪法案，大幅度削减GMR的购买数量。([source-2011](http://www.dsti.net/Information/News/69765))

### HMS

JTRS HMS (Handheld, Manpack & Small Form-Fit)，即手持，背负式即便携式的JTRS电台设备由Thales【~法国🇫🇷公司】和General Dynamic Mission Systems【~美国🇺🇸公司】联合开发。JTRS HMS用来取代[CSCHR](https://acronyms.thefreedictionary.com/CSCHR)【~Consolidated Single-Channel Handheld Radio，单信道手持设备】(PRC-148, PRC-152【~均为猎鹰系列产品】)等。JTRS HMS项目是为了满足Office of the Assistant Secretary of Defense for Network and Information Integration/DoD Chief Information Office的需求，要求就兼容SCA的软硬件。

![](https://imgs.codewoody.com/uploads/big/53861d97a3411c3775c97d40a9f9e90c.png)

### MIDS JTRS

MIDS 为安全，可扩展，模块化，无线，抗阻塞的数字信息系统。目前为空军，地面部队以及两栖部队提供Tactical Air Navigation (TAN), Link-16, J-Voice等通信手段。

### AMF

AMF主要是面向海空军载具和固定平台提供四信道、全双工、软件定义的无线电台。

## JENM (Joint Enterprise Network Manager)

### 简介

[JENM](https://peoc3t.army.mil/tn/jenm.php) 为一个统一的网络规划、管理和安全相关的管理软件，应用于中间层或者底层的无线电和相关waveform的管理。JENM在JTRS中负责管理WNW(Wideband Networking Waveform)。不过JENM并未耦合到JTRS的电台设备中，作为独立软件的JENM可以部署于普通的商用电脑([source](https://www.dote.osd.mil/pub/reports/FY2012/pdf/dod/2012jtrsned.pdf))。在上面介绍[JTRS NED](http://localhost:4000/knowledge-base/military/technologies/%E7%BE%8E%E5%86%9B%E7%8E%B0%E5%BD%B9%E9%80%9A%E4%BF%A1%E7%B3%BB%E7%BB%9F/JTRS.html#ned)项目时我们提到过三个Network Manger，分别是

- JTRS WNW Network Manager (JWNM)
- Soldier Radio Waveform Network Manager (SRWNM)
- JTRS Enterprise Network Manager (JENM)

三者的关系是JENM包含JWNM和SRWNM。

![上图的出处是：[Joint Tactical Radio System (JTRS) Network Enterprise Domain (NED) Network Managers](https://www.dote.osd.mil/pub/reports/FY2012/pdf/dod/2012jtrsned.pdf)。提供此PDF文件的网站[https://www.dote.osd.mil/](https://www.dote.osd.mil/)的title是The Office of the Director, Operation Test and Evaluation，为美国国防部[下属部门](https://www.dote.osd.mil/about/title-10-us-code.html)](https://imgs.codewoody.com/uploads/big/cc5c68df66dc471857f09bcf133e16a9.png)

JENM 可以被用来配置异质网络和waveform构成的整体网络，确保跨不同单元的网络互操作能力。其空中管理系统(eOTAM)的可以减少重新配置，管理和控制战术无线电网络需要的人工成本。

JENM 还有助于将网络上下不同层级整合到统一的NetOps工具中。

Joint Tactical Network Environment Network Operations Toolkit(J-TNT)将多个网络管理工具整合到一台笔记本电脑上，方便信号兵管理战术网络。J-TNT将搭载三种软件应用，包括：

- JENM
- CJSMPT (Coalition Joint Spectrum Management Planning Tool)
- SPEED (Systems Planning Engineering and Evaluation Device)

JENM 的工作能力如下：

- Operates within the Integrated Tactical Networking Environment and handles the planning, configuration, monitoring, management, and analysis functions for all signal components and systems within the Joint tactical radio environment.
- Reduces manpower hours to reconfigure, manage, and control a tactical radio network, by performing the tasks rapidly over-the-air.
- Paves the way for the convergence of NetOps tools and management for both the Upper Tactical Internet and the Mid and Lower Tactical Internet (radio networks).

### 讨论

[Operationally realistic testing of network centric tactical applications in a lab environment](https://ieeexplore.ieee.org/abstract/document/6415883) 这篇文章的Section III尝试测试了JENM的性能。文章中提到：

JENM负责生成RMDS(Radio Mission Data Set)配置文件，改配置文件用于配置WNW waveform。同时在waveform启动后JENM负责监控WNW网络的状态。在每个WNW电台设备上，会有网管程序的agent收集数据，并通过WNW传递给JENM（JENM需要连接到网络中的一个电台）。由于JENM本身需要依赖于战术网络来传递管理消息，因此控制管理开销增长，提高信息传输的可靠性就至关重要。

上面的论文测试的尝试的是15个WNW节点组成的WNW子网。该子网是一个更大网络的一部分。

<figure>
<img src="https://imgs.codewoody.com/uploads/big/9cf2101c04d6fd82477bcfc980e75133.png" alt="" style="width: 70%" />
<figcaption>仿真场景</figcaption>
</figure>

测试结果：

<figure>
<img src="https://imgs.codewoody.com/uploads/big/999856c040c8ffea5949b7ba7cac973a.png" alt="" style="width: 70%" />
<img src="https://imgs.codewoody.com/uploads/big/c2eab91cd341814594781ae08fb69319.png" alt="" style="width: 70%" />
<figcaption>测试结果</figcaption>
</figure>

## 更多阅读

- [五角大楼关闭联合战术无线电系统项目办公室](http://news.ifeng.com/mil/3/detail_2012_08/02/16502782_0.shtml)
- [美海军升级数据链终端，实现军事通信组网](https://www.secrss.com/articles/12991)
- [2005年·联合战术无线电系统发展分析](http://www.defence.org.cn/article-13-31499.html)
- [美国军用通信装备抗干扰技术发展调研报告](http://www.chinaequip.com.cn/bg/2706.html): 付费报告，1.5万。
- [Joint Tactical Radio System (JRTS) Ground Mobile Radios (GMR)](https://defensesystems.com/microsites/2010-jtrs/gmr.aspx?m=1)