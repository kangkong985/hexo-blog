---
title: 开源对象存储服务(OSS) Minio 及其在Hexo中的使用
tags:
  - 教程
  - Hexo
  - Minio
  - OSS
categories:
  - 教程
abbrlink: 5440
date: 2018-11-16 17:33:40
---

研究对象存储服务(OSS)是因为考虑到将来可能会有在博客上放出一些可供分享的文件下载的服务需求，直接使用[现有图床](/posts/65048/)，容易混杂乱。因此我考虑重新建立一个独立OSS存储服务。直接Google搜到了[Minio](https://github.com/minio/minio)这个框架，10k+的Star，就决定选择这个了。Minio框架有如下几个优势：

- 可以Docker部署，非常省事
- 文档完善
- 全面的平台支持
- 多种客户端语言支持（有完善的JS SDK）
<!--more-->
## 1. Minio部署

使用Docker部署可以说是非常方便省事了。我的部署命令如下：

``` bash
docker create -p 9000:9000 \
-e "MINIO_ACCESS_KEY=your-access-key" \
-e "MINIO_SECRET_KEY=your-secret-key" \
--name=minio \
-v /path/to/minio/data:/data \
-v /path/to/minio/config:/root/.minio \
minio/minio server /data
```

其中的访问秘钥对需要替换成你自己设置的值。这一对值稍后会用于网页端的登录。然后用

``` bash
docker container start minio
```

来启动镜像。完成后就可以在[http://domain.com:9000](http://domain.com:9000)中访问到了，输入docker命令中的秘钥对来登录。

![登录界面](https://imgs.codewoody.com/uploads/big/fa25ef81a937d5b26195632cf8aff37a.png)

而后你可以按照[Lychee图床教程](/posts/65048/)中的做法，添加Nginx反向代理和HTTPS支持。

## 2. Hexo中使用

部署完成后我才发现一个问题，那就是Minio生成的外链是强制有过期时间的，而且长度最多只七天。那我就不能像直接复制粘贴外链来使用了，同时，手动来每七天更新一次链接也是不可接受的。因此用Hexo脚本来自动实现了利用Minio的API接口来更新下载链接。脚本内容如下：

``` javascript
'use strict';

const Minio = require('minio');

var hexo = hexo || {};
var fs = fs || require('fs');
var yaml = yaml || require('js-yaml');
var minio_client  = minio_client || 
    new Minio.Client(yaml.safeLoad(fs.readFileSync(__dirname + "/minio_key.yml", 'utf8')));

hexo.extend.tag.register('minio', async (args, content) => {
    var 
        bucket = 'default',
        resource_name = '';
    if (args.length == 1) {
        resource_name = args[0];
    } else {
        resource_name = args[1];
        bucket = args[0];
    }
    var file_url = await minio_client.presignedGetObject(bucket, resource_name);
    return `<a target="_blank" href="${file_url}">${content}</a>`;
}, {async: true, ends:true});
```

在博客工程的根目录下创建一个文件夹`scripts`,在其中创建一个js文件，如`index.js`，然后将上述脚本内容粘贴进去。然后在这个目录下创建设置文件，`minio_key.yml`，文件中需要包含如下信息：

```yaml
endPoint: 'minio.domain.com'
accessKey: 'your-access-key'
secretKey: 'your-secret-key'
useSSL: true    # 是否使用https
```

然后还需要安装依赖

``` bash
npm install --save minio
```

至此我们完成了脚本的安装。脚本为我们提供了一个[标签插件](https://hexo.io/zh-cn/docs/tag-plugins.html)，其使用范例如下：

``` markdown
{% minio 'bucket_name' 'resource_name' %}
下载链接
{% endminio %}
```

在使用Hexo进行静态页面渲染时，这部分内容会被自动渲染成下载链接：

```
<a target="_blank" href="download_url">下载链接</a>
```

不过这种方法还是有一个显而易见的缺点：你需要是一个非常勤奋的作者，每周都来发布一次文章，不然旧文章的链接还是会失效。
