---
title: NetOps
date: 2019-10-21 14:55:34
footnote: true
---

## 简介

最近我一直在致力于调研美军所使用的战术，或者战略通信系统的网络管理系统。不过，并未发现美军会单独将网络管理系统软件立项，一般都是伴随这某个整体解决方案一起做了。不过，在不同的解决方案的网络管理系统中，都提到了NetOps这个概念。[NetOps](https://en.wikipedia.org/wiki/NetOps)的概念应该类似于[DevOps](https://zh.wikipedia.org/wiki/DevOps)，它并不是某个具体的技术实现后者技术方案，而是一种行业习惯的体现。

例如Wiki上说，DevOps（Development和Operations的组合词）是一种重视“软件开发人员（Dev）”和“IT运维技术人员（Ops）”之间沟通合作的文化、运动或惯例。透过自动化“软件交付”和“架构变更”的流程，来使得构建、测试、发布软件能够更加地快捷、频繁和可靠。类似的，NetOps就是对于网络而言，网络硬件体系建设和网络维护管理之间的合作，或者联合开发的惯例。

![<i style="text-align: left; width: 80%;">Newly enhanced and simplified Network Operations tools will make it easier for communications officers to see the "big picture" as they plan, manage and defend the vast tactical mission command network, increasing its security and strength. This Warfighter Information Network-Tactical equipped vehicle (center right) traverses the battlefield during Network Integration Evaluation 16.1 in September 2015 (U.S. Army photo by Amy Walker, PEO C3T Public Affairs) (Photo Credit: Amy Walker, PEO C3T Public Affairs) VIEW ORIGINAL</i>](https://imgs.codewoody.com/uploads/big/3d2fa4549b640141e341466112b91d8a.jpg)

2008年12月19日，美国国防部发布第8410.02号指令【~Instruction 8410.02】，正式将NetOps纳入到全球信息栅格(GIG)的体系中来：

![DoD Instruction 8410.02. [DOWNLOAD!](https://fas.org/irp/doddir/dod/i8410_02.pdf)](https://imgs.codewoody.com/uploads/big/6423fe7a59690c14827807e70c24dc48.png)

文件中将NetOps定位为DoD，即国防部层面统一的GIG网络操作，组织和方位技术支持。具体而言，NetOps包含的关键任务(Essential Tasks)，但不限于集团管理(GIG Enterprise Management, GEM)，网络保障(GIG Net Assurance, GNA)，内容管理(GIG Content Management, GCM)以及网络防御(GIG Net Defense, GND)。这里的操作，更多程度上是指「人」或者「部门」的协作。按照[Wiki](https://en.wikipedia.org/wiki/NetOps)中的说法：

> <i>NetOps provides assured NetCentric services to the DoD in support of full spectrum of warfighting operations, intelligence, and business missions throughout the GIG enterprises, seamlessly, end-to-end. An objective of NetCentric services is to quickly get information to decision makers, with adequate context, to make better decisions affecting the mission and to project their decisions forward to their forces for action.
<br/>
If the decision maker is not getting the needed net-centric services, the **GIG NetOps community** must collaboratively determine who must take action and how information flow can be optimized. This requires NetOps personnel to have a shared SA as well as the technologies, procedures, and collaborative organizational structures to rapidly assess and respond to system and network degradations, outages, or changes in operational priorities. All functions required to most effectively support GIG operations will be holistically managed.</i>

即NetOps制定了这样的一套工作流程：当决策制定者需要获取某种网络中心服务，而这种获取管道还不存在是，需要由NetOps Community来协商出由哪个部门来负责采取必要的行动来实现以及优化信息流管道。

## NetOps & WIN-T

如上所述，NetOps是GIG体系下的一种整体的工作规范，那么具体到GIG下的通信系统，NetOps会有各自的实现。

在WIN-T中，2016年，美国陆军将WIN-T中的网络管理系统项目Product Manager (PdM) WIN-T Increment 3更名为[PdM Tractical Cyber and Network Operations (TCNO)](https://peoc3t.army.mil/tn/tcno.php)。

> <i>We are no longer focused on just supporting WIN-T systems; we now support the full gambit of devices and services on the mission command network, from handheld radios up to SATCOM on-the-move systems. We take a One Network approach and now our name reflects that broader scope. -- Col. Ward Roberts, outgoing PdM for WIN-T's TCNO office<sup>4</sup>.</i>

新的PdM TCNO将会负责以下项目：

- Tactical Network Operations Management (TNOM)
- an integrated and standardized Network Operations (NetOps) toolset
- Joint Enterprise Network Manager (JENM)
- the Defense Cyber Operations (DCO) Tactical

Col. Ward Roberts在2014年负责了重构WIN-T Increment 3项目，专注于增强和简化WIN-T NetOps。陆军于2016年5月在Network Integration Evaluation 16.2中进行了WIN-T Increment 3 Limited User Test (LUT)。此项测试验证了新的改进的有效性。

> <i>Successful evaluation results will support the software technical insertion of the new enhancements into both the at-the-halt and on-the-move increments of the network, which is currently projected for fiscal year 2017. Feedback gained from the evaluation will also support future network improvements.<sup>4</sup></i>

## UNO

[UNO (Unified Network Operations)](https://peoc3t.army.mil/tn/uno.php) 为陆军方面为了整合现有战略级及战术级网络管理工具而提出的NetOps框架。其功能如下：

1. Delivers advancements in the monitoring, control and planning tools to simplify management of emerging voice, data and internet transport networks
2. Modeling and simulation capability to analyze the best possible network configuration with dynamically changing network due to global complex variants
3. Provides improved information assurance and Network Centric Enterprise Services
4. Inherent software modernization through recurring technical refresh within the PM Tactical Network family of programs
5. Provides NetOps users with the capability to “operationalize” the planning, configuration, monitoring and management of the network through a single consistent tailorable user interface
6. COE compliant, portable, and interactive common GUI with a user definable presentation workspace/dashboard
7. Integrates network planning with mission planning, enabling the S6 to optimize capability to move data around the virtual battlefield in support of the Commander’s scheme of maneuver
8. Integrates Upper Tactical Internet and Lower Tactical Internet network management tools and services
9. Provides near-term “bridging” of NetOps capabilities for tactical radios and tactical network transmission systems operating within the tactical environment
10. Sets the foundation for further integration of tactical and strategic networks for both network management services and cyberspace operations

## Reference

1. [Army enhances NetOps, the eyes and ears of the network](https://www.army.mil/article/167785/army_enhances_netops_the_eyes_and_ears_of_the_network)
2. [Instruction 8410.02](https://fas.org/irp/doddir/dod/i8410_02.pdf) - 2008
3. [Department of Defense Global Information Grid Architectural Vision](http://www.acqnotes.com/Attachments/DoD%20GIG%20Architectural%20Vision,%20June%2007.pdf) - 2007
4. [WIN-T's NetOps and Cyber Security program reflagged with change of command](https://www.army.mil/article/170304/win_ts_netops_and_cyber_security_program_reflagged_with_change_of_command)
5. [Army Warfighter Network - Tactical (WIN-T) Theory of Operation](https://ieeexplore.ieee.org/abstract/document/6735828)
6. [美国陆军战术级作战人员信息网络相关问题分析及启示](http://www.jc2.org.cn/CN/article/downloadArticleFile.do?attachType=PDF&id=272)
