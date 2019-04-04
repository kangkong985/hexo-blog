---
title: OC和Swift混编Frameowork优雅指南
tags:
  - ios
  - swift
  - 教程
categories:
  - 教程
abbrlink: 56606
date: 2019-04-04 14:09:04
---

![cover](https://imgs.codewoody.com/uploads/big/b5d15c27a9f2a989d35696f515aec8d6.jpeg)
[本文主要参考了优雅地开发Swift和Object C混编的Framework](https://github.com/LeoMobileDeveloper/Blogs/blob/master/Swift/%20%E4%BC%98%E9%9B%85%E7%9A%84%E5%BC%80%E5%8F%91Swift%E5%92%8CObjective%20C%E6%B7%B7%E7%BC%96%E7%9A%84Framework.md)。不过实际发现，完全按照文章里面”优雅的解决方案“里面的说法操作，还是没法成功。我这里根据实际情况作出了调整。
<!--more-->

1. 参考的文章中在“优雅的解决方案”这个section之前的内容都是好用的，你可以用用来创建一个兼容OC和Swift的Cooca Touch Framework。
2. 这里说的“优雅”，指的是控制OC部分接口保留的问题（详情可以参考原文部分）

原文里面只说了具体的操作步骤，没有高屋建瓴地说出这种方法的实际思路：事实上，采用`module.modulemap`的方法是将OC部分打包成一个可以使用Swfit语句进行导入(import)的模块。以这个视角，我们再来梳理一下操作步骤：

#### 新建一个`module.modulemap`文件

文件里的内容如下：

```
module OCSource [system] {
    //由于module.modulemap和OCSource.h是在同一个文件夹的，如果不是同一个，路径要写全
    header "OCSource.h"
    export *
}
```

> 有一个容易犯错的问题是将这里的模块名字, OCSource命名为了Cocoa Touch Framework的名字。这样会导致编译出错，错误信息会提示你Module名字重复定义。这里的名字要区别的Framework的名字，具体是什么可以自己自由选择。不过推荐和头文件的名字一致

后一步操作是把`module.modulemap`的路径添加到Build Settings的`Import Paths`中，这是为了让我们在Swift里面`import`这个module的时候能够找到目标.

![Import Paths in Build Settings](https://imgs.codewoody.com/uploads/big/f9b81bd3d7c4bff9b05b4548ed039922.png)

那么，这里的`$(SRCROOT)/MixFramework`其实就是指的`module.modulemap`的路径。

#### 将`OCSouce.h`文件的权限改为project

![Header Visibility Settings](https://imgs.codewoody.com/uploads/big/7d7b91d9291919efb1de5b5c3543655d.png)

这可以让`OCSource.h`不再对外可见。
然后，删除MixFramework.h(umbrella header)中#import 的OC header。

---

原文的内容到此结束，但是其实还是不够的。这时候如果编译，会发现你在Framework内部的Swift使用OCSource的地方都会报错说OCSource不存在。因为将`OCSource.h`从umbrella header中删除之后Swift就无法看到这个文件了。然而，通过`module.modulemap`文件我们将`OCSource.h`及相关的OC文件打包成了了一个Swift模块，因此我们可以在Swift代码中import进来：

```Swift
import OCSource
```

在报错的Swift文件中添加这个导入，就可以解决这个问题了.