---
title: 'C++中将结构体放置在std::vector容器内的操作风险'
tags:
  - C++
  - Debug
  - ns3
categories:
  - 编程研究
abbrlink: 35148
date: 2019-06-28 16:39:21
---

有一组长度不固定的参数需要传输，且参数形式为结构体，那么一个比较简单的方法是将这些参数作为一个`std::vector`。例如

```cpp
void f(std::vector<struct ExampleStruct> data);
```

由于C++是采用值传递的方式，每次对`std::vector`进行元素的存取操作时，都会对涉及的结构体进行复制。如果结构体的数量比较多，或者结构体的体积比加大，那么这种方式对于计算和内存资源的浪费就比较大了。

<!--more-->

那么，折中的办法是在`std::vector`中存放指针。例如

```cpp
void f(std::vector<struct ExampleStruct *> data);
```

不过，这就给指针的生命周期管理带来了很大的挑战，而且可能会引入非常多耦合性很强的代码。如果函数是state-less，即只对输入参数进行计算，而不更改其他的状态变量，问题倒不是很严重。反之，就会存在很多比较大的漏洞。

由于局部变量存在作用范围的限制

```cpp
{
  struct ExampleStruct a;
  // ...
  data.push_back (&a);
  // ...
  f (data);
}
```

当离开调用`f`的函数的作用域时，`a`就会被释放，后续在其他地方访问`data`时，对应的指针指向的内存区域已经被释放掉了，对其进行访问会导致错误。使用`new`来讲结构体创建在堆内存上可以解决这个问题，但是这意味着后续这一数据已经利用完之后，要确保此处申请的内存被恰当地释放掉。随着业务逻辑的复杂化，要准确做到这一点会非常困难，强行实现也会带来很多强耦合的代码，扩大引入bug的风险。

我们剩下的选择，就是使用智能指针`std::shared_ptr`自动管理堆内存的声明周期。就是形式有点复杂了：

```cpp
void f(std::vector<std::share_ptr<struct ExampleStruct>> data);
```
