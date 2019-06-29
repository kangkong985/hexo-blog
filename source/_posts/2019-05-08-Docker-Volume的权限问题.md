---
title: Docker Volume的权限问题
tags:
  - docker
  - Debug
categories:
  - 教程
abbrlink: 25188
date: 2019-05-08 14:38:09
---

这里我们要解决的是使用Docker过程中常见的Volume权限问题。具体而言，当我们用`-v`将宿主机的路径绑定到Docker镜像的内部路径时，有时候会导致Docker镜像缺少对这个目录的访问权限，从而导致进程出错。

<!--more-->

## Why

当我们绑定宿主目录到镜像时，如果该目录不存在，Docker也会自动创建该目录。这种方式创建出来的目录的拥有者是root用户。如果该目录已经存在，那么其拥有者就取决于宿主配置的情况了。

由于Docker内部的用户空间和宿主的用户空间是独立的，如果镜像内运行进程的用户和宿主目录的拥有者不符合，就会出现权限问题。

## How to solve it

由于镜像内和宿主的用户名空间是不同的，所以通过用户名的方式来变更宿主目录的所有权会失效。然而，事实上用户系统是通过uid来标识不同的用户的，我们只需要将宿主的路径的拥护者改为镜像内用户相通的uid即可。镜像内用户的uid可以通过如下方式查看，例如：

```shell
jovyan@8fed6b266a3c:~$ id
uid=1000(jovyan) gid=100(users) groups=100(users)
```

继而再修改宿主机上对应目录的拥有者：

```shell
sudo chown -R 1000 /path/to/volume
```

## Further Research

上面的方法可以解决Volume访问权限的问题，不过会产生潜在的漏洞。从镜像内获得的uid在宿主上可能表示的是不同的用户，在宿主机上修改目录的拥有者会导致数据被同一服务器上的其他用户访问，带来安全性上的问题。

另一方面，如果有多个镜像需要共享一个Volume，而他们内部的运行用户的uid不同的话，就需要在宿主上进行更加复杂的用户以及组的配置。

更优雅的执行方法有下面两种：

### Use Named Volume

Named Volumes

### 由容器自行配置权限问题

## Reference

1. [谈谈 Docker Volume 之权限管理（一）](https://yq.aliyun.com/articles/53990)
2. [What is the (best) way to manage permissions for Docker shared volumes?](https://stackoverflow.com/questions/23544282/what-is-the-best-way-to-manage-permissions-for-docker-shared-volumes?spm=a2c4e.11153940.blogcont53990.8.3421149142aS92)
3. [Why Docker Data Containers (Volumes!) are Good](https://medium.com/@ramangupta/why-docker-data-containers-are-good-589b3c6c749e)
4. [Use volumes](https://docs.docker.com/storage/volumes/)
5. [Different Types of Volumes](https://success.docker.com/article/different-types-of-volumes)