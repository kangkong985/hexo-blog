---
title: WATCH
date: 2019-09-17 14:04:11
---

`watch` 命令以周期性的方式执行给定的指令，指令输出以全屏方式显示。`watch` 是一个非常实用的命令，基本所有的Linux发行版都带有这个小工具，如同名字一样，`watch` 可以帮你监测一个命令的运行结果，省得你一遍遍的手动运行。

> 过去我经常手动写 `while true; do some command; sleep 1; done`来做这个事情，有点傻了。

`watch`命令的形式非常简单

```text
Usage:
 watch [options] command

Options:
  -b, --beep             beep if command has a non-zero exit
  -c, --color            interpret ANSI color and style sequences
  -d, --differences[=<permanent>]
                         highlight changes between updates
  -e, --errexit          exit if command has a non-zero exit
  -g, --chgexit          exit when output from command changes
  -n, --interval <secs>  seconds to wait between updates
  -p, --precise          attempt run command in precise intervals
  -t, --no-title         turn off header
  -x, --exec             pass command to exec instead of "sh -c"

 -h, --help     display this help and exit
 -v, --version  output version information and exit
```

其中最常用的是：

1. `-n`：确定调用命令的间隔，单位是秒
2. `-d`: 高亮显示输出信息的不同之处
3. `-t`: 不现实标题

注意，FreeBSD和Linux下watch命令的不同，在Linux下，watch是周期性的执行下个程序，并全屏显示执行结果，如：watch -n 1 -d netstat -ant，而在FreeBSD下的watch命令是查看其它用户的正在运行的操作，watch允许你偷看其它terminal正在做什么，该命令只能让超级用户使用。
