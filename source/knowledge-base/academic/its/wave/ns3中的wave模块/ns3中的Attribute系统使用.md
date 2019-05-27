---
title: ns3中的Attribute系统的使用
date: 2019-05-27 15:40:21
---

ns3中的Attribute及相关系统的设计非常有意思，其意义在于为仿真中的极其复杂的模块架构中，提供了一种非常方便的**解耦**的属性访问（读写）方法。例如，在一个复杂的设计WAVE的性能仿真中，若要修改某个节点的CSMA竞争窗口大小。没有Attriubute系统的情况下，想要通过层层指针获取底层对象再进行修改，会对代码的模块化设计和代码的复杂度带来灾难性的硬性。相反，在Attribute系统下，我们只需要提供CSMA竞争窗口的**路径**(path)就可以直接修改对应的属性。

```cpp
Config::Set ("/NodeList/0/$ns3::Node/DeviceList/0/$ns3::WaveNetDevice/MacEntities/172/$ns3::OcbWifiMac/BE_Txop/$ns3::QosTxop/MinCw", UintegerValue (15));
```

下面我们来梳理一下Attribute使用中的一些要点。

## Attribute的创建

Attribute的创建是在TypeId中进行的。Attribute系统的实现有赖于Object系统，这意味着你如果要在你的类中自定义Attribute，需要让你的类继承自Object基类。我们通过`TypeId::AddAttribte`这个函数来定义属性。例如上面提到的`MinCW`，其创建过程如下：

```cpp
static TypeId tid = TypeId ("ns3::Txop")
    .SetParent<ns3::Object> ()
    .SetGroupName ("Wifi")
    .AddConstructor<Txop> ()
    .AddAttribute ("MinCw", "The minimum value of the contention window.",
                   UintegerValue (15),
                   MakeUintegerAccessor (&Txop::SetMinCw,
                                         &Txop::GetMinCw),
                   MakeUintegerChecker<uint32_t> ())
    // ...
    ;
```

这个函数有五个参数，分别是：

1. 属性的名称，这个名称是我们后续构建Attribute Path时使用的名称；
2. 属性的描述；
3. 属性的默认值。注意这里不能传入Primitive Value，而是需要使用特定的类进行打包。如`uint_t`需要通过`UintegerValue`类来打包；
4. 属性的访问器，这里决定了的具体的属性值如何存储和访问。可以使用Getter，Setter函数范式，也可以直接使用类的成员变量。
5. 属性的格式检查器，我们可以通过这个类来规定属性的格式

## Attribute的结构（路径组成）

Attribte使用中最大的一个困难在于，我们如何确定Attribute的路径呢？

Attribute的路径，是各个模块内部的层级关系（hierarchy）的反映。我们以开头的例子中使用的路径为例：

```text
/NodeList/0/$ns3::Node/DeviceList/0/$ns3::WaveNetDevice/MacEntities/172/$ns3::OcbWifiMac/BE_Txop/$ns3::QosTxop/MinCw
```

每一个斜杠`/`代表了一个层级，或者是一个操作。这里，一个层级，对应的是对象与对象成员的关系。例如这里面的DeviceList，是Node的成员变量。

```cpp
TypeId
Node::GetTypeId (void)
{
  static TypeId tid = TypeId ("ns3::Node")
    .SetParent<Object> ()
    .SetGroupName("Network")
    .AddConstructor<Node> ()
    .AddAttribute ("DeviceList", "The list of devices associated to this Node.",
                   ObjectVectorValue (),
                   MakeObjectVectorAccessor (&Node::m_devices),
                   MakeObjectVectorChecker<NetDevice> ())
    // ...
    ;
    // ...
}
```

这个很好理解。操作一般就要复杂一些。这里的操作可以大致分为两类：

1. 索引(indexing/mapping)
2. 类型转换(casting)

### indexing/mapping

在定义Attribute时，可以将Attribute定义为Vector或者Map类型。例如Node的DeviceList这个Attribute就是一个Vector。在构建Attribute Path时，紧跟在Node后面我们需要添加一个索引项来表明我们要访问的具体是哪个成员。利用通配符`*`指定选中所有的成员。这里的例子包括上面路径的`/NodeList/0`还有`DeviceList/0`等等部分。

### casting

一般来说，定义Attribute时，我们指定的类型可能是特定的基类，例如上面Node的Attribute定义中，其`DeviceList`中的成员就是`NetDevice`这个基类。再具体的子类中，其Attribute定义可能各不相通。为了访问特定的子类的Attribute，我们要将其转化成对应的子类。以开头的例子为例，casting操作的标识是`$`。`DeviceList/0/$ns3::WaveNetDevice/MacEntities`中，我们取出每个Node的第0个Device，并将其转化成`ns3::WaveNetDevice`类型，然后访问`MacEntities`这个Attribute。

### 查询方法

尽管知道了Attribute Path的构建方法，但是实际书写起来还是非常复杂，我们可以用一个简单的工具`ConfigStore`来查询仿真中具体有哪些`Attribute`。

参考下面的样例修改你的代码：

```cpp
int main (...)
{
  CommandLine cmd;
  cmd.Parse (...);

  ConfigStore config;
  config.ConfigureDefaults ();

  ... topology creation

  config.ConfigureAttributes ();

  Simulator::Run ();
}
```

然后按照下面的样子运行你的仿真

```shell
./waf --run "scratch/myprogram --ns3::ConfigStore::Mode=Save --ns3::ConfigStore::Filename=config.txt"
```

然后在`config.txt`文件中我们可以查看仿真中所有涉及的`Attribute`的路径及具体取值。

> 注意只有在程序中使用过（读/写）才会在此处输出。

## Further Reading

- [HOWTO determine the path of an attribute or trace source](https://www.nsnam.org/wiki/HOWTO_determine_the_path_of_an_attribute_or_trace_source)
- [HOWTO use the ConfigStore](https://www.nsnam.org/wiki/HOWTO_use_the_ConfigStore)
- [Configuration and Attributes](https://www.nsnam.org/docs/manual/html/attributes.html)
