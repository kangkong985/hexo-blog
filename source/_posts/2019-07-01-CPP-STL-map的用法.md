---
title: 'CPP: STL map的用法'
abbrlink: 3626
date: 2019-07-01 17:23:13
tags:
  - 教程
  - C++
categories:
  - 教程
---

抛开具体的编程语言场景，map是一类非常基本的数据组织形式，其作用是将一个可Hash的值，映射到另一个值，而且一般来讲是一对一的（存在一对多的情况）。map内部使用了红黑树，这棵树具有对数据自动排序的功能，使得对map的检索意义达到非常高的效率。基于键值的查找的复杂度是Log(N)。

这里讲讲C++标准库里面map的用法。

<!--more-->

## 使用map

头文件：

```cpp
#include <map>
```

声明时需要指明键与值的类型：

```cpp
std::map<int, string> persons;
```

## 数据插入

数据插入有三种方法：

1. 使用`insert`函数插入`pair`数据，例如：

```cpp
std::map<int, string> students;

students.insert (std::pair<int, string> (1, "Student A"));
```

2. 用insert函数插入`value_type`的数据，例如：

```cpp
std::map<int, string> students;

students.insert (std::map<int, string>::value_type (1, "Student A"));
```

3. 用Subscript方式插入数据，例如：

```cpp
std::map<int, string> students;

students[1] = "Student A"
```

上面三种插入方式的区别在于，第三种默认会覆盖已经存在的映射，而前两个不会。前两个插入方式等价，在插入的键已经存在于映射中时，当前的插入语句会被忽略。那么如何知道插入是否成功呢？可以通过`insert`函数的返回值来判断。

```cpp
std::map<int, string> students;

// res为pair<map<int, string>::iterator, bool>乐行
auto res = students.insert (pair<int, string> (1, "Student A"));
if (res.second == true)
  {
    std::cout << "Insert successfully" << std::endl;
  }
else
  {
    std::cout << "Insert fail" << std::endl;
  }

```

## 数据的遍历

使用迭代器：

```cpp
for (auto iter = students.begin (); iter != students.end (); iter ++ )
  {
    // first为key，second为value
    cout<<iter->first<<' '<<iter->second<<endl;  
  }
```

## 查找并获取map中的元素

查找是map的核心功能。我们可以使用`find`函数来进行查找。当找到目标时，返回一个迭代器，否则返回`end`。

```cpp
std::map<int, string> students;
// ...

auto iter = students.find (1);
if (iter == students.end ())
  {
    std::cout << "not found " << std::endl;
  }
else
  {
    string studentName = iter.second;
  }
```

## 删除元素

```cpp
std::map<int, string> students;
// ...
auto iter = students.find (1);
student.erase (iter);

student.erase (1);

// 这会清空整个map
student.erase (students.begin (), students.end ());
```

## Further Reading

- [C++中的STL中map用法详解](https://www.cnblogs.com/fnlingnzb-learner/p/5833051.html)
- [std::map::map](http://www.cplusplus.com/reference/map/map/map/)
