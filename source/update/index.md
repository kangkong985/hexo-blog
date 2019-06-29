---
title: 博客更新
date: 2019-05-07 15:26:31
---

## 2019.06.29

在标题前方添加Emoji

## 2019.06.28

1. 修改了内容宽度

具体方法为修改文件`themes/next/source/css/_variables/Pisces.styl`

```javascript
// $content-desktop-large        = 1160px
$content-desktop-large        = 960px
// $content-desktop-largest      = 73%
$content-desktop-largest        = 960px
```
2. 启用了Han Support
3. 在menu中添加update项目
4. 字体修改为思源宋体：[关于如何在网页中引入思源字体：漫谈Typekit](https://imjad.cn/archives/lab/how-to-introduce-source-han-fonts-into-web-pages-through-typekit)

![思源宋体](https://img.imjad.cn/images/2018/06/29/sp180629_130227.png)

## 2019.05.20

困扰很久的VS Code引入莫名其妙添加的不可见\x08和\x05等控制字符的问题，最后可以通过[“Remove backspace control character”](https://marketplace.visualstudio.com/items?itemName=satokaz.vscode-bs-ctrlchar-remover)这个插件解决。在VS Code的设置中将`editor.formatOnSave`设置为true来自动处理文件。

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
