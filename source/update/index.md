---
title: 博客更新
date: 2019-05-07 15:26:31
---

## 20190507

### 1
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

### 2

通过上标提供短的参考信息的方法：

```html
<sup title="Hover Text">?</sup>
```
