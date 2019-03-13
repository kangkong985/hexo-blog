---
title: 'JS:图像截取部分(Image Cropping)'
tags:
  - js
  - 教程
categories:
  - 教程
abbrlink: 2543
date: 2019-03-13 13:29:19
---
![Cover](https://imgs.codewoody.com/uploads/big/8cd3e0e5fe6f9051e2c67646cc1e7dbc.jpg)

这里我们讨论的图像截取部分是指从一个完整的大图中截取一小部分出来。当然，使用js实现。
<!--more-->

> 这边文章基本整理自[Cropping images with Javascript](https://yellowpencil.com/blog/cropping-images-with-javascript/)，
> 添加了一些我的评论

例如，我们要从这样的大图中：

![大图](https://imgs.codewoody.com/uploads/big/f6551d523ea8c642cd663a1b9b3e024d.jpeg)

截取出

![小图](https://imgs.codewoody.com/uploads/big/2208ad7dfbd59e73fa2ba244fcb41487.jpeg)

使用H5中的canvas可以简单地解决这个问题。

## 1. 载入原图像

```js
var loadTimer;
var imgObject = new Image();
imgObject.src = 'images/fozzie.jpg';
imgObject.onLoad = onImgLoaded();
function onImgLoaded() {
  if (loadTimer != null) clearTimeout(loadTimer);
  if (!imgObject.complete) {
    loadTimer = setTimeout(function() {
      onImgLoaded();
    }, 3);
  } else {
    onPreloadComplete();
  }
}
```

> 注意这里我们为了演示是读取的图片文件内容，实际上除了图像文件，这里的“图像”还可以是其他形式，例如video元素，别的canvas等。

## 2. 当图片完成载入以后，重新绘制你要截取的那一部分

```js
function onPreloadComplete(){
  //call the methods that will create a 64-bit version of thumbnail here.
  var newImg = getImagePortion(imgObject, 120, 150, 150, 80, 2);
  //place image in appropriate div
  document.getElementById("images").innerHTML = "<img alt="" src=""+newImg+"" />";
}
```

这个`onPreloadComplete`函数会在图像载入完成以后调用。在这个函数中我们会调用实际完成图片截取的函数`getImagePortion`

## 3. 图像截取

```js
getImagePortion(imgObj, newWidth, newHeight, startX, startY, ratio){
 /* the parameters: - the image element - the new width - the new height - the x point we start taking pixels - the y point we start taking pixels - the ratio */
 //set up canvas for thumbnail
 var tnCanvas = document.createElement('canvas');
 var tnCanvasContext = canvas.getContext('2d');
 tnCanvas.width = newWidth; tnCanvas.height = newHeight;
 
 /* use the sourceCanvas to duplicate the entire image. This step was crucial for iOS4 and under devices. Follow the link at the end of this post to see what happens when you don’t do this */
 var bufferCanvas = document.createElement('canvas');
 var bufferContext = bufferCanvas.getContext('2d');
 bufferCanvas.width = imgObj.width;
 bufferCanvas.height = imgObj.height;
 bufferContext.drawImage(imgObj, 0, 0);
 
 /* now we use the drawImage method to take the pixels from our bufferCanvas and draw them into our thumbnail canvas */
 tnCanvasContext.drawImage(bufferCanvas, startX,startY,newWidth * ratio, newHeight * ratio,0,0,newWidth,newHeight);
 return tnCanvas.toDataURL();
}
```

> 上面的函数时原作者给出的方法，他先将图像完整地画到一个canvas(`bufferCanvas`)上，再将这个canvas对应的目标区域画到`tnCanvas`上，根据注释来看，似乎是出于性能或者适配方面的考虑。不过就我在开发桌面端网页时，可以直接将`imgObj`画到`tnCanvas`上。