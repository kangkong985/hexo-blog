---
title: Pandoc渲染引擎导致Hexo Tag渲染失败的临时解决办法
tags:
  - 教程
  - hexo
categories:
  - 教程
abbrlink: 62502
date: 2019-04-25 14:06:21
---

在[Hexo+Next: 使用Latex公式](https://www.codewoody.com/posts/20215/)这篇文章中我发现在使用`Pandoc`作为Hexo的渲染引擎时，Hexo的标签功能会有问题，具体表现为Hexo的标签内部的内容会输出markdown源码，而非渲染后的html。
<!--more-->

## 问题研究

经过我的研究，这是因为`hexo-render-pandoc`在注册自己的`renderer`时，只注册了异步渲染的renderer，而没有注册同步渲染的renderer，而Hexo的标签中主要是用同步renderer。以当时我使用的NexT的note标签为例。其实现代码为：

```js
'use strict';

function postNote(args, content) {
  return `<div class="note ${args.join(' ')}">
            ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
          </div>`;
}

hexo.extend.tag.register('note', postNote, {ends: true, async: true});
hexo.extend.tag.register('subnote', postNote, {ends: true, async: true});
```
由于没有注册同步渲染器，这里的`hexo.render.renderSync`渲染会失败，从而返回的是`content`中的原本内容，也即Markdown形式的源码。

## 解决办法

彻底的解决办法，自然是在`hexo-render-pandoc`中同时注册同步渲染器。不过我自己尝试之后发现作为同步渲染器，`pandoc`和Hexo使用模板引擎貌似有冲突。更细致深入的修改最好还是由原作者来进行（我已经提交了[Issue](https://github.com/wzpan/hexo-renderer-pandoc/issues/33)）。

这里我给出一个临时的解决办法：既然`hexo-render-pandoc`只注册了异步渲染代码，那么我们在Tag的实现代码中调用异步渲染的接口就可以了。仍然以NexT主题的note标签为例，可以将代码修改成：

```js
'use strict';

function postNote(args, content) {
  return hexo.render.render({text: content, engine: 'markdown'})
    .then(function (res) {
      return `<div class="note ${args.join(' ')}">
            ${res.split('\n').join('')}
          </div>`
    })
  // return `<div class="note ${args.join(' ')}">
  //           ${hexo.render.renderSync({text: content, engine: 'markdown'}).split('\n').join('')}
  //         </div>`;
}

hexo.extend.tag.register('note', postNote, {ends: true, async: true});
hexo.extend.tag.register('subnote', postNote, {ends: true, async: true});
```

经过这样修改就可以了。不过这种方法仍然只是权宜之计，要是去修改每个Tag的实现，就太繁琐了。
