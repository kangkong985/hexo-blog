---
title: ns3中的wave模块
date: 2019-05-14 16:59:21
mathjax: true
---

## 前言

> ns-3 is a discrete-event network simulator for Internet systems, targeted primarily for research and educational use. ns-3 is free software, licensed under the GNU GPLv2 license, and is publicly available for research, development, and use.

简而言之，[ns3](https://www.nsnam.org/)是一款基于C++的离散事件网络模拟器，其内部实现了很多常见的网络协议。因此学术界通常使用ns3来作为论文仿真分析的框架。我们在这篇文章里梳理一下ns3中关于WAVE部分的内容。

## WAVE的初始化

下面的代码给出了一种WAVE机制的初始化方法：

```cpp
/*
 * lossModelName: 信道损失模型，默认值是
 * ns3::LogDistancePropagationLossModel
 */
auto lossModelName = m_config->Get ("lossModel");
double freq = 5e9;
YansWifiChannelHelper waveChannel;
waveChannel.SetPropagationDelay ("ns3::ConstantSpeedPropagationDelayModel");

if (lossModelName == "ns3::TwoRayGroundPropagationLossModel") {
  waveChannel.AddPropagationLoss (lossModelName, "Frequency", DoubleValue (freq), "HeightAboveZ", DoubleValue (1.5));
} else if (lossModelName == "ns3::LogDistancePropagationLossModel") {
  waveChannel.AddPropagationLoss (lossModelName);
} else {
  waveChannel.AddPropagationLoss (lossModelName, "Frequency", DoubleValue (freq));
}
/**
 * propagationLossModel: 默认是None
 */
auto propagationLossModel = m_config->Get ("propagationLossModel");
if (propagationLossModel != "None") {
  waveChannel.AddPropagationLoss (propagationLossModel);
}

// Create the channel using settings above
auto wavePhy = YansWavePhyHelper::Default ();
wavePhy.SetChannel (waveChannel.Create ());
wavePhy.SetPcapDataLinkType (WifiPhyHelper::DLT_IEEE802_11);
/**
  * 发射功率，单位为dbm
  */
auto txp = m_config->Get<double> ("txp");
wavePhy.Set ("TxPowerStart",DoubleValue (txp));
wavePhy.Set ("TxPowerEnd", DoubleValue (txp));

QosWaveMacHelper waveMac = QosWaveMacHelper::Default ();
WaveHelper waveHelper = WaveHelper::Default ();
auto phyMode = m_config->Get ("phyMode");
waveHelper.SetRemoteStationManager ("ns3::ConstantRateWifiManager",
                                    "DataMode",StringValue (phyMode),
                                    "ControlMode",StringValue (phyMode));
m_devices = waveHelper.Install (wavePhy, waveMac, m_nodes);
```

这段代码中我们逐一创建了信道模型，物理层，链路层，最后通过`waveHelper`将各个部分组装在一起，并且安装到节点上：

```cpp
m_devices = waveHelper.Install (wavePhy, waveMac, m_nodes);
```

### waveHelper

`waveHelper->Install`的核心代码如下：

```cpp
Ptr<Node> node = *i;
Ptr<WaveNetDevice> device = CreateObject<WaveNetDevice> ();

device->SetChannelManager (CreateObject<ChannelManager> ());
device->SetChannelCoordinator (CreateObject<ChannelCoordinator> ());
device->SetVsaManager (CreateObject<VsaManager> ());
device->SetChannelScheduler (m_channelScheduler.Create<ChannelScheduler> ());

for (uint32_t j = 0; j != m_physNumber; ++j)
  {
    Ptr<WifiPhy> phy = phyHelper.Create (node, device);
    phy->ConfigureStandard (WIFI_PHY_STANDARD_80211_10MHZ);
    phy->SetChannelNumber (ChannelManager::GetCch ());
    device->AddPhy (phy);
  }

for (std::vector<uint32_t>::const_iterator k = m_macsForChannelNumber.begin ();
      k != m_macsForChannelNumber.end (); ++k)
  {
    Ptr<WifiMac> wifiMac = macHelper.Create ();
    Ptr<OcbWifiMac> ocbMac = DynamicCast<OcbWifiMac> (wifiMac);
    // we use WaveMacLow to replace original MacLow
    ocbMac->EnableForWave (device);
    ocbMac->SetWifiRemoteStationManager ( m_stationManager.Create<WifiRemoteStationManager> ());
    ocbMac->ConfigureStandard (WIFI_PHY_STANDARD_80211_10MHZ);
    device->AddMac (*k, ocbMac);
  }

device->SetAddress (Mac48Address::Allocate ());

node->AddDevice (device);
devices.Add (device);
```

首先创建WAVE设备，并且设置`ChannelCoordinator`, `VsaManager`, `ChannelScheduler`，逐一最后一个是通过是通过工厂对象创建的。工厂对象默认创建的`ChannelScheduler`是`ns3::DefaultChannelScheduler`(事实上ns3内部只有这一个具体的`ChannelCoordinator`实现).

在接下来的循环中，`waveHelper`利用参数中传入的物理层`Helper`来创建物理层对象。这里的`m_physNumber`默认为1。对于物理层，这里进一步设置了信道带宽标准（10MHz），将信道号设置为CCH信道号。

在第二个循环中，`waveHelpher`创建WAVE的七个信道，这里的`m_macsForChannelNumber`默认来自`ChannelManager::GetWaveChannels ()`。在循环体内，对于每一个WAVE信道，`wave`进行如下操作：

1. 启用WAVE支持(这一部分详细阅读以下面的`waveMac`章节)
2. 设置RemoteStationManager
3. 设置标准为`WIFI_PHY_STANDARD_80211_10MHZ`

最后为设备分配MAC地址。

### wavePhy

`YansWavePhyHelper`继承了`YansWifiPhyHelper`。相比于父类，`wavePhy`其实主要修改了自带的日志输出范式，对于功能主干影响不大。我们来看关键的`YansWifiPhyHelper::Create`函数。

```cpp
Ptr<WifiPhy>
YansWifiPhyHelper::Create (Ptr<Node> node, Ptr<NetDevice> device) const
{
  Ptr<YansWifiPhy> phy = m_phy.Create<YansWifiPhy> ();
  Ptr<ErrorRateModel> error = m_errorRateModel.Create<ErrorRateModel> ();
  phy->SetErrorRateModel (error);
  phy->SetChannel (m_channel);
  phy->SetDevice (device);
  return phy;
}
```

这个函数只是按部就班地设置对应的属性，没有特别的处理。

### waveMac

`waveMac`直接使用了`QosWaveMacHelper`的默认设置。这个部分Helper配置的部分极少。可以认为是直接从构造函数创建`OcbWifiMac`。

> OCB，即Outside Context of BSS，即脱离BSS的组织形式，让节点直接直接进行通信的范式。 `OcbWifiMac`
> 的注释可以提供进一步的说明：
>
> In OCB mac mode,synchronization, association, dis-association
> and authentication of normal wifi are not used for wireless access in
> vehicular environments.
>
> Although Timing Advertisement frame is a specific management frame defined
> in 802.11p. It is mainly used by IEEE Std 1609.4 for channel switch synchronization.
> However in simulation nodes are supposed to have GPS synchronization ability,
> so we will not implement this feature.

关于`OcbWifiMac::EnableForWave`的说明：

在`waveHelper`的处理中，对创建的`OcbWifiMac`对象调用了`EnableForMac`函数。这个函数的主要作用是，将`OcbWifiMac`的`m)low`底层MAC实现，从`MacLow`替换为`WaveMacLow`。

## WAVE中的Tx

### 通过WaveNetDevice直接发包方式下的路径

这里我们使用直接从`WaveNetDevice`的发送接口进行发包的方法。例如：

```cpp
auto sender = DynamicCast<WaveNetDevice> (m_devices.Get (0));
auto receiver = DynamicCast<WaveNetDevice> (m_devices.Get (1));
const Address dest = receiver->GetAddress ();
SeqTsHeader seqTs;
seqTs.SetSeq (1);
packet->AddHeader (seqTs);
// 0x0800是IP协议号
sender->Send (packet, dest, 0x0800);
```

> 这里的协议号是`0x0800`，即发送的是IP包，IP包只能在CCH上发送

注意在执行上面的发送前还需要对WAVE进行信道配置，否则无法发送。信道配置不需要在每次发送前配置，只需要在设置发生变更的时候修改设置即可。配置的示例代码如下：

```cpp
auto schInfo = SchInfo (SCH1, immediateAccess, EXTENDED_ALTERNATING);
auto txProfile = TxProfile (SCH1);
auto sender = DynamicCast<WaveNetDevice> (m_devices.Get (0));
auto receiver = DynamicCast<WaveNetDevice> (m_devices.Get (1));
Simulator::Schedule (
  Seconds (0), &WaveNetDevice::RegisterTxProfile, sender, txProfile);
Simulator::Schedule (
  Seconds (0), &WaveNetDevice::RegisterTxProfile, receiver, txProfile);
Simulator::Schedule (
  Seconds (0), &WaveNetDevice::StartSch, sender, schInfo);
Simulator::Schedule (
  Seconds (0), &WaveNetDevice::StartSch, receiver, schInfo);
```

#### WaveNetDevice::Send

这里的调用入口是`WaveNetDevice::Send(ns3::Ptr<...> packet, const ns3::Address &dest, uint16_t protocol)`. 这个函数中做了如下处理:

1. 检查`m_txProfile`，在WAVE中的，要发送数据必须要先注册一个`TxProfile`，这个结构提供了上层对于物理底层参数的控制能力。
2. 检查还是否可以访问`m_txProfile`中指定的信道。
3. 检查`m_txProfile`中的其他参数，并生成一个`HigherLayerTxVectorTag`的PacketTag添加到包中。
4. 添加`LlcSnapHeader`，此Header中包含了协议类型（如是IP包，协议为`0x0800`）。
5. 根据`m_txProfile`中制定的信道编号，获取对应的`WifiMac`(实质是`OcbWifiMac`)，将包压入其队列。这一级调用见下一个子部分。

#### OcbWifiMac::Enqueue

这个函数里的处理主要分为两个部分：一是`m_stationManager`的相关处理，二是QoS相关的处理。同时，MAC帧头`WifiMacHeader`也在这里生成。

注意，在WAVE中，QoS功能是启用的，即`GetQosSupported`返回`true`。那么发送队列的选择会由[EDCA](https://en.wikipedia.org/wiki/IEEE_802.11e-2005#Enhanced_distributed_channel_access_.28EDCA.29)机制来控制:

```cpp
m_edca[QosUtilsMapTidToAc (tid)]->Queue (packet, hdr);
```

其中`m_edca`的类型为`EdcaQeueus`（`typedef std::map<AcIndex, Ptr<QosTxop> > EdcaQueues;`），本质从EDCA的Access Category index映射到对应对应队列的字典。

#### QosTxop::Queue

`QosTxOp`继承自`Txop`。`Queue`这个函数没有改动。在`Txop::Queue`内，传入的包被纳入`m_queue`这个内部队列，然后`StartAccessIfNeeded`被调用来尝试访问信道。

> `m_queue`是`WifiMacQueue`类型。这个队列实现了802.11协议中的超时功能。在包被取出时，队列检查其时间戳，如果超时会丢弃这个包。

#### ChannelAccessManager::StartAccessIfNeeded

`StartAccessIfNeeded`是开始信道访问尝试的入口，这个过程涉及众多函数，我们在这里统一梳理。

在`StartAccessIfNeeded`函数中，若

1. `m_currentPacket`为空，即当前没有正在发送的包。
2. `m_queue`不是空，即还有包等待发送
3. `IsAccessRequested()`为`false`，为了避免请求信道重复
4. `m_low->IsCfPeriod`为`false`，底层mac是否处于可供发送的状态 (CF: Contention-Free)

以上条件全部得到满足，那么`Txop`会通过`m_channelAccessManager->RequestAccess`来请求访问信道。

> 这里的`m_channelAccessManager`是从`RegularWifiMac::m_channelAccessManager`赋值而来，不同的同一个mac层的不同`Txop`共享。

`ChannelAccessManager`会处理和退避相关的事宜：

1. 如果信道可以访问，调用`ChannelAccessManager::DoGrantAccess`
2. 不管在任何情况下，调用`ChannelAccessManager::DoRestartAccessTimeoutIfNeeded`，这一步是为了调度一下次对信道的访问尝试（例如如果本次访问信道失败，则重新更新退避信息后，在一定间隔后再次访问信道）。

在`DoGrantAccess`中，最终成功访问到信道的`Txop`的`NotifyAccessGranted`函数会被调用。

信道的访问规则使我们关注的重点，尤其是CCH和SCH的信道访问控制。经过测试发现，在CCHI时请求SCH信道时，不会调用`DoGrantAccess`。在CCHI发起SCH请求时，`m_sleeping`为true，因此会在`RequestAccess`函数开头即返回，这里也不会通过`DoRestartAccessTimeoutIfNeeded`来调度下一次信道访问（毕竟信道睡眠中）。可见WAVE的Aternative Accessing在MAC层是通过让`OcbWaveMac`周期性地睡眠实现的。这一功能主要实现于`DefaultChannelScheduler`中。

#### `QosTxop::NotifyAccessGranted`

`QosTxop`覆盖了`NotifyAccessGranted`的实现。在这函数里面，`WifiMacHeader`中的一些参数进行了重新设置。主要包括：

1. SeqNo
2. 禁止分段（即将大包拆解成小包传输）
3. NoRetry

注意，对于QoS数据包，ACK在这里被禁用：

```cpp
if (m_currentHdr.IsQosData () && m_currentHdr.IsQosBlockAck ())
{
  m_currentParams.DisableAck ();
}
else
{
  m_currentParams.EnableAck ();
}
```

在涉及参数配置以及`AMSDU`等方面的设置完成后调用`m_low->StartTransmission`。前面我们提到过，这里的`m_low`为`WaveMacLow`类型。

#### `WaveMacLow::StartTransmission`

#### 发送过程中地址的处理

`WaveNetDevice::Send`接口发送数据时，我们发现发送的目标地址并不是设置到packet里面，而是独立传递进了接口。这里简要梳理一下在发送过程中地址的处理。

在`WaveNetDevice::Send`函数中，`Address`类型的目标地址被转换成`Mac48Address`类型，再传递给`OcbWifiMac::Enqueue`函数。在这个函数里面，这个地址被复制给802.11的帧头的`addr1`字段。帧头的类型为`WifiMacHeader`

### RTS/CTS

RTS/CTS部分是由`MacLow`负责的，我们从`MacLow::StartTransmission`开始梳理。

#### NeedRTS

首先要讨论的是，系统如何决定一个包是否需要进行RTS

```cpp
bool
MacLow::NeedRts (void) const
{
  WifiTxVector dataTxVector = GetDataTxVector (m_currentPacket, &m_currentHdr);
  return m_stationManager->NeedRts (m_currentHdr.GetAddr1 (), &m_currentHdr, m_currentPacket, dataTxVector);
}
```

这里的取出来的`dataTxVector`的作用并不关键，其主要作用的是两个因素：

1. 地址是否是group: `address.IsGroup ()`
2. 包的大小是否超过了`WifiRemoteStationManager::m_rtsCtsThreshold`。不过这个包被默认设置为65535，这个条件几乎无法满足.

### WSA包的发送

发送WSA包时，配置方法与发送IP包的是一致的，具体到发送上，餐卡`wave-simple-device.cc`里面的示例:

```cpp
Ptr<Packet> wsaPacket = Create<Packet> (100);
Mac48Address dest = Mac48Address::GetBroadcast ();
const VsaInfo vsaInfo = VsaInfo (dest, OrganizationIdentifier (), 0, wsaPacket, SCH1, 100, VSA_TRANSMIT_IN_BOTHI);
Simulator::Schedule (Seconds (1.0), &WaveNetDevice::StartVsa, sender, vsaInfo);
Simulator::Schedule (Seconds (3.0), &WaveNetDevice::StopVsa, sender, SCH1);
```

#### VsaInfo

`VsaInfo`的定义如下：

```
struct VsaInfo
{
  Mac48Address peer; ///< peer
  OrganizationIdentifier oi; ///< OI
  uint8_t managementId; ///< management ID
  Ptr<Packet> vsc; ///< VSC
  uint32_t channelNumber; ///< channel number
  uint8_t repeatRate; ///< repeat rate
  enum VsaTransmitInterval sendInterval; ///< send interval
}
```

其中：

1. `peer`: 为发送目标地址，一般是广播地址
2. `oi`: 服务提供者的组织ID
3. `managementId`: manage id
4. `vsc`: 需要发送的包内容
5. `channelNumber`: 目标信道，这里指需要指定的SCH信道
6. `repeatRate`: 发送速度，即每秒多少个
7. `sendInterval`: 这是一个枚举类型，指定了包应该在哪些时隙上发送。其取值包括：
    1. VSA_TRANSMIT_IN_CCHI
    2. VSA_TRANSMIT_IN_SCHI
    3. VSA_TRANSMIT_IN_BOTHI

#### WaveNetDevice::StartVsa

传入参数`vsaInfo`中规定了发送WSA包的必要信息。在`WaveNetDevice::StartVsa`函数中，设备检查了`vsaInfo`的数据的完整性，然后交给`m_vsaManager->SendVsa`来进行发送。在`VsaManager`中，CCHI和SCHI的访问控制，以及`txVector`的控制信息都在这里实现，同时，此包被赋予了EDCA最高优先级(AC_V0)。然后交给`OcbWifiMac->SendVsc`来执行发送。通过这个接口发送的包会被标记为管理包。

### WAVE中的信道管理

`ChannelCoordinator`负责控制信道切换的时机，让所有的节点的信道切换同步，而`ChannelScheduler`负责执行具体的信道切换。在`DefaultChannelScheduler::SetWaveNetDevice`中，`ChannelCoordinator`和`ChannelScheduler`得以联系起来：

```cpp
m_coordinationListener = Create<CoordinationListener> (this);
m_coordinator->RegisterListener (m_coordinationListener);
```

`ChannelCoordinator`在调用其`DoInitialize`函数内部完成初始化之后即通过`StartChannelCoordination`函数开启往复调用的信道协调同步过程。这个过程首先进入的是Guard Interval(`NotifyGuardSlot`)。

```cpp
void
ChannelCoordinator::NotifyGuardSlot (void)
{
  NS_LOG_FUNCTION (this);
  Time guardSlot = GetGuardInterval ();
  bool inCchi = ((m_guardCount % 2) == 0);
  if (inCchi)
    {
      m_coordination = Simulator::Schedule (guardSlot, &ChannelCoordinator::NotifyCchSlot, this);
    }
  else
    {
      m_coordination = Simulator::Schedule (guardSlot, &ChannelCoordinator::NotifySchSlot, this);
    }
  for (ListenersI i = m_listeners.begin (); i != m_listeners.end (); ++i)
    {
      (*i)->NotifyGuardSlotStart (guardSlot, inCchi);
    }
  m_guardCount++;
}
```

在这个函数里面根据`inCchi`来决定调度`NotifyCchSlot`还是`NotifiySchSlot`。在函数最末，通告所有的Listener，Guard Interval开始了。后续的`NotifyCchSlot`和`NotifiySchSlot`的做法也是类似的。

在`DefaultChannelScheduler::NotifyGuardSlotStart`中，开头的Guard Interval长度被设置为繁忙`mac->MakeVirtualBusy (duration);`。实际的信道切换过程也在这个函数中通过调用`DefaultChannelScheduler::SwitchToNextChannel`来进行。由于Guard Interval区间内被设置为繁忙，所以当设备结束睡眠时，检测信道繁忙，故而会开始执行退避。

> 这里有一个疑问：`ChannelCoordinator`内部的Schedule调度完全是独立进行的，如果采用了Extended Access，即CCHI会提前结束，那么原定的Guard Interval还是会被设置么？

### 退避过程(Backoff)

退避过程主要实现在`ChannelAccessManager`内。在`Txop::Queue`函数收到一个包之后，会调用`Txop::StartAccessIfNeeded`这个函数来尝试访问信道。

```cpp
void
Txop::StartAccessIfNeeded (void)
{
  NS_LOG_FUNCTION (this);
  if (m_currentPacket == 0
      && !m_queue->IsEmpty ()
      && !IsAccessRequested ()
      && !m_low->IsCfPeriod ())
    {
      m_channelAccessManager->RequestAccess (this);
    }
}
```

实质调用的`ChannelAccessManager::RequestAccess`这个函数。这个函数我们挑选其中重要的代码列在下面：

```cpp
void
ChannelAccessManager::RequestAccess (Ptr<Txop> state, bool isCfPeriod)
{
  // ...
  UpdateBackoff ();
  NS_ASSERT (!state->IsAccessRequested ());
  state->NotifyAccessRequested ();
  Time lastTxEnd = m_lastTxStart + m_lastTxDuration;
  if (lastTxEnd > Simulator::Now ())
    {
      NS_LOG_DEBUG ("Internal collision (currently transmitting)");
      state->NotifyInternalCollision ();
      DoRestartAccessTimeoutIfNeeded ();
      return;
    }
  if (state->GetBackoffSlots () == 0)
    {
      if (IsBusy ())
        {
          NS_LOG_DEBUG ("medium is busy: collision");
          // someone else has accessed the medium; generate a backoff.
          state->NotifyCollision ();
          DoRestartAccessTimeoutIfNeeded ();
          return;
        }
      else if (IsWithinAifs (state))
        {
          NS_LOG_DEBUG ("busy within AIFS");
          state->NotifyCollision ();
          DoRestartAccessTimeoutIfNeeded ();
          return;
        }
    }
  DoGrantAccess ();
  DoRestartAccessTimeoutIfNeeded ();
}
```

这个函数内部主要步骤为：

1. 检查是否有内部冲突，即当前是否正在发送一个数据包。如果发生了内部冲突，会调用`Txop::NotifyInternalCollision`回调，并通过`DoRestartAccessTimeoutIfNeeded`这个函数在一段时间后重新访问信道。
2. 检查退避计数器的状态：如果计数器到0了，若信道繁忙，则认为产生了一次碰撞，若仍然在Aifs状态，那么也认为是一次碰撞（事实上这里的两个分支是一样的）
3. 如果退避计数器不是0，即上一次退避未完成时，通过`DoRestartAccessTimeoutIfNeeded`这个函数延后访问信道（这里的`DoGrantAccess`函数不会允许访问信道）。

下面我们分解讲一下主要函数的作用。

#### `UpdateBackoff`

在实际的WAVE系统中，其退避过程为了性能考虑采用是离散的方法，即定一个退避计数器，每经过一个时隙（slot），这个退避计数器减一，直到变成0。有意思的是，在仿真系统中，NS3反而是使用了“连续”的方法来实现（当然本质是离散的，但是API调用形式上使用`Simulator::Schedule`直接调度backoff相关事件，显得是连续的）。此时，我们如果要访问退避计数器的值，如调用（`state->GetBackoffSlots ()`），就需要先调用`UpdateBackoff`这个函数来进行离散和连续的转化。

#### `DoRestartAccessTimeoutIfNeeded`

在`ChannelAccessManager`的实现中，`ChannelAccessManager`和`Txop`是一对多的关系，即多个`Txop`可以由同一个`ChannelAccessManager`来管理。不过在实际代码中，至少我们关注的`RegularWifiMac`及其子类，`ChannelAccessManager`和`Txop`都是一对一。

```cpp
RegularWifiMac::RegularWifiMac ()
{
  // ...
  m_channelAccessManager = CreateObject<ChannelAccessManager> ();
  m_channelAccessManager->SetupLow (m_low);

  m_txop = CreateObject<Txop> ();
  m_txop->SetMacLow (m_low);
  m_txop->SetChannelAccessManager (m_channelAccessManager);
  m_txop->SetTxMiddle (m_txMiddle);
  m_txop->SetTxOkCallback (MakeCallback (&RegularWifiMac::TxOk, this));
  m_txop->SetTxFailedCallback (MakeCallback (&RegularWifiMac::TxFailed, this));
  m_txop->SetTxDroppedCallback (MakeCallback (&RegularWifiMac::NotifyTxDrop, this));
  // ...
}
```

我们这里还是假定以存在多个`txop`的情况来讨论。在`DoRestartAccessTimeoutIfNeeded`中，函数首先根据当前的状态，选择出最近一个结束一轮退避过程`Txop`的退避结束时间`expectedBackoffEnd`。如果当前已经安排的`m_accessTimeout`时间在这个退避结束时间后面，那么以新的时间重新调调度一个`m_accessTimeout`事件。这一事件的回调函数是`ChannelAccessManager::AccessTimeout`

#### `AccessTimeout`

这个函数内部非常简单：

```cpp
void
ChannelAccessManager::AccessTimeout (void)
{
  NS_LOG_FUNCTION (this);
  UpdateBackoff ();
  DoGrantAccess ();
  DoRestartAccessTimeoutIfNeeded ();
}
```

#### `DoGrantAccess`

这个函数内部进行真正的信道权限赋予的操作。不过函数仍然会检查每个`Txop`的退避状态，只有完成了退避的`Txop`才有可能被赋予信道访问权限。另外，对于 其他正在尝试访问信道的`Txop`，会出发一次Internal Collision.

被赋予信道访问权限的`Txop`的`NotifyAccessGranted`函数会被调用.

### EDCA优先级控制

#### 发送过程优先级设置

EDCA优先级控制通过过程如下：

在`WaveNetDevice::SendX`函数的参数`TxInfo`中，包含一个`priority`的属性，这个属性被设置到`SocketPriorityTag`中，并被添加到包中。在`OcbWifiMac::Enqueue`函数中通过`QosUtilsMapTidToAc`函数转化成EDCA index，具体转化规则为：

1. 0, 3 -> VC_BE  (Best Effort)
2. 1, 2 -> AC_BK  (Background)
3. 4, 5 -> VC_VI  (Video)
4. 6, 7 -> VC_VO  (Audio)

这里的Priority的默认值是7

#### 优先级的退避参数设置

WAVE使用的是`OcbWifiMac`，对EDCA队列的配置通过函数`OcbWifiMac::ConfigureEdca`来进行。这个函数的调用树如下：

`WaveHelper::Install` -> `WifiMac::ConfigureStandard` -> `OcbWifiMac::FinishConfigureStandard` -> `OcbWifiMac::ConfigureEdca`.

`OcbWifiMac::ConfigureEdca`中的具体设置过程如下：

```cpp
void
OcbWifiMac::ConfigureEdca (uint32_t cwmin, uint32_t cwmax, uint32_t aifsn, enum AcIndex ac)
{
  NS_LOG_FUNCTION (this << cwmin << cwmax << aifsn << ac);
  Ptr<Txop> dcf;
  switch (ac)
    {
    case AC_VO:
      dcf = RegularWifiMac::GetVOQueue ();
      dcf->SetMinCw ((cwmin + 1) / 4 - 1);
      dcf->SetMaxCw ((cwmin + 1) / 2 - 1);
      dcf->SetAifsn (aifsn);
      break;
    case AC_VI:
      dcf = RegularWifiMac::GetVIQueue ();
      dcf->SetMinCw ((cwmin + 1) / 2 - 1);
      dcf->SetMaxCw (cwmin);
      dcf->SetAifsn (aifsn);
      break;
    case AC_BE:
      dcf = RegularWifiMac::GetBEQueue ();
      dcf->SetMinCw (cwmin);
      dcf->SetMaxCw (cwmax);
      dcf->SetAifsn (aifsn);
      break;
    case AC_BK:
      dcf = RegularWifiMac::GetBKQueue ();
      dcf->SetMinCw (cwmin);
      dcf->SetMaxCw (cwmax);
      dcf->SetAifsn (aifsn);
      break;
    case AC_BE_NQOS:
      dcf = RegularWifiMac::GetTxop ();
      dcf->SetMinCw (cwmin);
      dcf->SetMaxCw (cwmax);
      dcf->SetAifsn (aifsn);
      break;
    case AC_UNDEF:
      NS_FATAL_ERROR ("I don't know what to do with this");
      break;
    }
}
```

这里AIFSN的取值为：

- AC_BE_NQOS: 2
- AC_VO: 2
- AC_VI: 3
- AC_BE: 6
- AC_BK: 9
