---
title: CANES
date: 2019-10-23 11:59:34
footnote: true
---

> 调研完成后发现，CANES项目更加注重的是舰内网络的整合，而不是舰队级的跨舰网络。

## 概况

<figure>
<iframe width="560" height="315" src="https://www.youtube.com/embed/5__cMXvnkrs" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<figcaption>
Northrop Grumman 官方账户的介绍视频
</figcaption>
</figure>

CANES (Consolidated Afloat Networks and Enterprise Services，统一海上网络与集团服务): 是美军下一代的海上战术网络<sup>3</sup>，其是采用开放式体系结构的战术网络基础设施，旨在建立统一的公共网络替代、整合现有分散式 C4I 网络系统，达到节省安装空间、精简网络种类、减少人员配置、进而提高系统互操作性<sup>8</sup>。CANES将原有的多种舰载网络程序统一起来【~包括：综合舰载网络系统(ISNS) 、潜艇局域网( SUBLAN) 、海上联合军种地区信息交换系统(CENTRIXS－M) 、绝密信息局域网(SCI LAN) 以及视频信息交换系统(VIXS) 和舰载视频分配系统(SVDS)】，提供通用的计算环境，为了多达40种的Command, Control, Intelligence and Logistic应用提供服务。

> 目前,美海军的300 多艘舰船上一共装备了数千套传统网络系统,其中,仅ISNS系统就有297 套,CENTRIXS有151 套,SCI有144 套,SUBLAN有50套,它们都是主要的海上网络。以特定舰船为例,航母( CVN) 或两栖舰( 如LPD、LHA) 等作战舰船上有50 多个独立的网络,“洛杉矶”级攻击型核潜艇和 “俄亥俄”级弹道导弹核潜艇上用于支持关键任务的网络系统不少于10 个。每个特定网络都有自己专用的机柜和服务器,彼此之间不能共享服务和存储资源,每个特定应用也都有自己专用的网络和硬件,不仅在安装、培训和后续保障服务上带来成本预算急剧上升和人员增加的问题,更重要的是,每个网络被设计成支持单一的作战功能,这就造成了大量烟囱式海上网络的存在,它们之间的信息共享和互操作能力很差,无法满足海军 “网络中心战”的需求。<sup>9</sup>

![CANES网络基础设施迁移策略](https://imgs.codewoody.com/uploads/big/0bc002cfe1c06ceb5ccbc17e7dfb6eea.jpg)

C4I项目执行办公室( PEO C4I) 是美国管理CANES项目的最高机构,它行政上直接隶属于空间与海战系统司令部(SPAWAR) 。当前,CANES项目发展与美国其他主要装备的采办一样,也是采用项目管理的组织形式。PEO C4I下设5 个负责产品开发和维持的项目办公室,其中战术网络项目办公室( PMW160) 具体负责CANES项目管理。CANES项目的主要合同商为<sup>6</sup>：

- Northrop Grumman - Herndon, Virginia
- BAE Systems - Rockville, Maryland
- Serco - Reston, Virginia
- DRS Laurel Technologies - Johnstown, Pennsylvania

<!-- ![](https://imgs.codewoody.com/uploads/big/5045be3de174ef1908d4c5aad62f5717.jpg) -->

<figure>
<img src="https://imgs.codewoody.com/uploads/big/5045be3de174ef1908d4c5aad62f5717.jpg" alt="" style="width: 80%">
<figcaption>
图片来源：[Navy's CANES installation ahead of schedule](https://defensesystems.com/articles/2016/05/11/navy-canes-installation-ahead-of-schedule.aspx)
</figcaption>
</figure>

> <i>The Navy's newly deployed afloat information technology system called CANES is a cyber-secure solution that consolidates key legacy C4I networks by employing flexible open architecture to generate long-term savings and bring operational agility to the warfighter.</i>

CANES 网络提供了单一的，统一的物理网络，同时兼顾不同的密级的处理，包括Unclassified, Secret, Secret Releasable, and Top Secret security等四个Domain。同时提供了跨密级通信的解决方案。

CANES 针对不同的部署平台提供了三种不同的变种方案，包括：

- unit level for smaller ships such as destroyers and cruisers
- force level for large deck ships such as aircraft carriers and large deck amphibious ships
- submarine variant.

## CANES的构成

在CANES项目中,有2 点是反复强调的: 1)CANES采用**智能技术和现有的商用成熟技术**进行集成,项目中的所有技术均已验证; 2) 更多的网络管理功能以减少人员和维护要求为目标,舰队首席信息官( Fleet CIO) 对海上网络具有 “可见性”( Visibility) 。CANES特别强调网络监视、健康评估、设备管理以及计算机网络防御等功能。

CANES是采用开放式体系结构的战术网络基础设施,主要由3 个核心部件构成

### 通用计算环境(CCE)

通用计算环境( Common Computing Environment,CCE) 能有效地利用 “虚拟化”技术将舰载网络硬件( 交换机和路由器) 、机架、服务器和通信媒介等整合到公共网络核心中,以取代相似的硬件、独立的操作,从而实现硬件基础设施的虚拟化管理。目前,一台服务器上仅能同时运行一种操作系统,但是借助于采用SOA架构的虚拟化技术后,不同种类的操作系统( 如Linux,Solaris,Windows等) 以及它们各自所支持的所有应用程序都可以在同样的硬件和服务器设施上同时运行,即1 台 “虚拟化服务器”将允许表面上不兼容的系统和多个独立运行的应用程序同时运行在1 台单独的服务器上,最终实现将多种计算功能整合到一个公共网络和服务器组中的目标,这将有效扩展计算机能力,并能够使硬件设施投资和资源得到最大化利用。

需要注意的是,CCE主要侧重于硬件和硬件的虚拟化管理,而不涉及到应用和服务对象,舰队所使用的应用和服务都将 “托管”在CCE的硬件基础设施上,在1台服务器上可以调用任意一种操作系统所支持的全部应用。

虚拟化是一种软硬件策略,允许大量的虚拟机( 操作系统、应用程序或网络) 在一套通用物理硬件上独立且同时运行,可显著提高信息系统的可靠性和效率,减少实际硬件的安装数量和空间,降低维修需求。

在实现硬件基础设施的虚拟化管理后,所有舰载网络的硬件和操作软件都将由记录程序(POR)进行集中式管理,而不是像目前这样只是基础设施的简单复制。同时,CCE也使信息安全传输问题实现标准化,允许进行全舰队范围的硬件和软件升级,以确保舰载网络保持先进水平。

### 基于SOA的海上核心服务(ACS)

CANES的SOA架构旨在为服务使用者提供一种结构平台,在此平台上可以利用开源和COTS软件对各种基本能力和核心服务等进行混搭和匹配,快速地创建、调用、执行和管理各种基于服务的新应用以及以网络为中心的核心企业服务等,从而满足不断变化的作战需求。

![](https://imgs.codewoody.com/uploads/big/cef560b31174837ada12bbf232a70e7a.png)

基于SOA的海上核心服务( Afloat Core Services,ACS) 创建一种可升级的服务交互分层模型(见上图),将现有烟囱式系统的传统应用分解、转换为面向用户、数据的可复用式公共服务和应用,这些公共服务和应用能够利用现有的基本信息服务、架构服务、ACS和特定的服务。其中,基本信息服务可以提供普遍的信息共享能力; 架构服务对应用软件、数据、战略服务等提供托管和传送交付功能。通过采用标准化的接口,系统可以调用这些公共服务,有益于减少成本,统一系统的维护工作。

ACS利用SOA方式将硬件从专属软件中分离出来,允许软件开发人员使用现有的插入式方法提供或者转换数据,从而避免必须重写某些重复功能。例如,如果一个程序员实现将舰艇传感器搜集的信息显示到地图上的功能,他不必写下每个部分的详细代码———因为地图显示功能和传感器信息采集功能已经作为服务存在了,因此程序员只需通过网络载入并使用这些标准服务,致力于如何提高性能而不是重写已经存在的代码。通过开发ACS,可将GIG的核心企业服务应用到作战人员,以支持海军作战人员在中断、时断时续和有限制通信的场景中实现C4ISR应用。

### 跨域解决方案(CDS)

跨域解决方案(Cross - Domain Solutions,CDS)能实现多个不同安全保密级别( MLS) 的系统运行在同一个客户端工作站,其当前技术成熟度为3 级。CDS也允许用户设置数据访问的许可级别,以便在不同的安全级别内均可访问同样的数据,同时阻止信息流在不同安全域中的传输。即允许不同安全等级( 绝密、秘密、解密、非密) 的数据在公共网络设施CCE上传输。

在CDS设计和跨安全域的架构整合过程中,为了降低风险,专门开发了一个CDS原型样机加以演示和验证。

## 部署情况

![The USS McCampbell (DDG 85) was the first Navy ship to become operational with CANES.](https://imgs.codewoody.com/uploads/big/f7e6a97a7863ca99f9e5761e9e34c17f.png)

[USD(AT&L)](https://www.acq.osd.mil/)【~The undersecretary of defense for acquisition, technology and logistics】于2015年10月13日批准了CANES的全面部署<sup>6</sup>，目前，海军正在为8艘驱逐舰、2艘航母和1艘两栖攻击舰安装该网络。到2021年，该软件将被部署在190余艘水面舰艇、潜艇等<sup>7</sup>。因此CANES应当是现役的最先进的美国海军的一揽子通信解决方案。

## Reference

> 在Scholar以CANES+Navy可以搜到不少文章

1. [Consolidated Afloat Networks and Enterprise Services (CANES)](https://www.northropgrumman.com/Capabilities/CANES/Pages/default.aspx): 这个网页里面附了很多PDF资料的下载。
2. [Navy Afloat Network Undergoes First Upgrade on Forward-Deployed Ship](https://www.navy.mil/submit/display.asp?story_id=107035)
3. [Consolidated Afloat Networks and Enterprise Services (CANES) Fact Sheet](https://www.secnav.navy.mil/rda/Documents/canes+overview+for+asn+rda+11-2-11-s.pdf)
4. [CANES: An Open Systems C4I Networks Design](https://www.northropgrumman.com/Capabilities/CANES/Documents/Canes_Supplement_Defense_Daily.pdf)，【~提供该文件的网站是northropgrumman.com，即诺斯洛普·格鲁门公司，简称诺格，是世界第四大生产厂商，世界上最大的雷达制造商和最大的海军船只制造商】
5. [What Are the Effects of Consolidated Afloat Networks and Enterprise Services (CANES) on Navy Manpower, Personnel, and Training?](https://www.rand.org/pubs/research_briefs/RB9511/index1.html)。注意这一个网页底部提供了[Full Report](https://www.rand.org/pubs/monographs/MG896.html)下载【~关于这个网站：The RAND Corporation is a nonprofit research organization providing objective analysis and effective solutions that address the challenges facing the public and private sectors around the world.】
6. dote.osd.mil: [FY16 NAVY PROGRAMS: Consolidated Afloat Networks and Enterprise Services (CANES)](https://www.dote.osd.mil/pub/reports/FY2016/pdf/navy/2016canes.pdf)
7. [美国海军舰艇安装下一代舰载战术网络CANES](http://navy.81.cn/content/2013-11/28/content_5668527_2.htm)
8. [美国海军新一代水面舰艇作战系统体系架构](http://www.cnki.com.cn/Article/CJFDTotal-QBZH201801028.htm)
9. [美海军“综合海上网络和企业服务”项目研究](https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFQ&dbname=CJFD2014&filename=JCKX201402034&uid=WEEvREdxOWJmbC9oM1NjYkZCbDdrNXcxd21mQTRJWW8wWlJSS1BpdnZrNmk=$R1yZ0H6jyaa0en3RxVUd8df-oHi7XMMDo7mtKT6mSmEvTuk11l2gFA!!&v=MDc5NDIxTHV4WVM3RGgxVDNxVHJXTTFGckNVUkxPZVorUnNGeXptVkwvTEx5N0Fkckc0SDlYTXJZOUdZSVI4ZVg=)