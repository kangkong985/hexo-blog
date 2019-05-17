---
title: 博客更新
date: 2019-05-07 15:26:31
---

## 2019.05.15

1. 修复了搜索和Feed的问题：文章中存在不可见字符，导致`atom.xml`和`search.xml`的格式出错
2. 替换了字体服务器的CDN，从`//fonts.googleapis.com`修改为`//fonts.css.network`

## 20190507

### 2
修改了Reference的样式。方法是在`themes/next/source/css/_custom/custom.styl`文件中添加如下内容：

```styl
div#refs {
  font-size: 13px;
  line-height: 1.1;
}

div#refs p {
  margin: 0;
}
```

### 1

通过上标提供短的参考信息的方法：

```html
<sup title="Hover Text">?</sup>
```
