---
title: 'Struct in Vector: 进一步讨论'
tags:
  - C++
categories:
  - 编程研究
abbrlink: 62430
date: 2019-07-02 10:04:44
---

之前我们讨论了[C++中将结构体放置在std::vector容器内的操作风险](C++中将结构体放置在std::vector容器内的操作风险)。这里我们来进一步讨论如何处理在容器中存储的结构体数据。

<!--more-->

前文中提到，如果我们尝试获取容器中的结构体时，我们直接拿到的是该结构体的拷贝，如果要对结构体成员修改，我们需要整体进行两次复制：

```cpp
std::vector<struct A> data;
// ...

struct A val = data.at (0);
val.b = c;
data[0] = val;
``

这种操作显然是不经济。一种『粗暴』的方法是使用`std::vector::data`函数获取底层数据的指针，然后操作这个指针。但是这种方法不太优雅，也不安全。合适的做法是使用引用

```cpp
std::vector<struct A> data;
// ...

struct A & val = data[0];
val.b = c;
```

放在遍历的场景中，可以使用如下的形式：

```cpp
std::vector<struct A> data;
// ...

for (auto& val : data) {...}
```
