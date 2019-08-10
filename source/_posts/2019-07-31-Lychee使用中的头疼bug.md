---
title: Lychee使用中的头疼bug
abbrlink: 3710
date: 2019-07-31 13:52:28
tags:
  - Debug
  - linux
  - docker
categories:
  - Debug
---

之前我使用了[Lychee](http://localhost:4000/posts/65048/)来搭建我博客的图床。使用Lychee中可能会出现一些头疼的问题。

## 无法上传图片

一般出现这种问题时，查看Nginx的`error.log`目录可以发现类似下面形式的错误：

```text
2019/07/31 05:47:44 [crit] 306#306: *149 open() "/var/tmp/nginx/client_body/0000000002" failed (13: Permission denied), client: 172.18.0.1, server: _, request: "POST /php/index.php HTTP/1.0", host: "imgs.codewoody.com", referrer: "https://imgs.codewoody.com/"
```

显示权限错误。导致做个错误的原因是对于`/var/tmp/nginx/client_body`这一目录，nginx缺乏写入的权限。解决方法如下：

首先进入容器内部：

```shell
docker exec -it lychee_lychee_1 bash
cd /var/tmp/nginx/client_body
```

这一目录的所有者是`abc`用户，所在的group也是是`abc`。我们可以将`nginx`用户添加到这个组，并且为目录`/var/tmp/nginx/client_body`赋予组写入权限：

```shell
adduser nginx abc
chmod g+w .
```

问题解决。

- [/var/lib/nginx/client_body/0000000011 failed (13: Permission denied) with node.js](https://serverfault.com/questions/727908/var-lib-nginx-client-body-0000000011-failed-13-permission-denied-with-node-j)
- [Fixing nginx client body temp permission denied errors](https://wincent.com/wiki/Fixing_nginx_client_body_temp_permission_denied_errors)
