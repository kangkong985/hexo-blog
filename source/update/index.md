---
title: 博客更新
date: 2019-05-07 15:26:31
---

## 2019.12.01

在根目录下面创建了一个shell脚本文件`link_posts.sh`，用于创建从pages发布到posts的链接。测试发现Hexo不能识别软链接，所以这里创建的都是硬链接。
按照原理来说git应该不能管理硬链接。所以这里我们创建一个shell脚本，用于将来出现问题之后批量恢复这些链接。

## 2019.09.19

将展示的代码的字体从14pt降低到13pt。

## 2019.09.17

添加了一种增加脚注的方法，表现形式为：

<img src="https://imgs.codewoody.com/uploads/big/568ddaf99f047d48af770aae35b15b77.png" style="width: 80%">

脚注字体较小，为红色。通过自定义脚本（根目录下`scripts`文件夹下`utils.js`文件）实现：

```js
hexo.extend.filter.register('before_post_render', function (data) {
  var config = this.config;
  if (data.footnote !== true)
    {
      return data;
    }
  data.content = data.content.replace(/【~([^】]+)】/g, '<span class="foot-note-span">【$1】</span>')
  return data;
})
```

## 2019.08.02

Reference部分文字渲染时不使用标准汉字标准格式的`em`渲染样式。方法为在`_layout.swig`中运行

```js
document.getElementById("refs")
    .setAttribute("lang", "en_US");
```

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
