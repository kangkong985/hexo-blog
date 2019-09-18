---
title: 编译问题
date: 2019-09-18 17:18:25
---

## Flags

### `-fPIC`

[参考](https://www.cnblogs.com/cswuyg/p/3830703.html)

PIC的含义是Position Independent Code。这个选项的设置与「共享对象」有关。共享对象可能会被不同的进程加载到不同的位置上，如果共享对象中的指令使用了绝对地址、外部模块地址，那么在共享对象被加载时就必须根据相关模块的加载位置对这个地址做调整，也就是修改这些地址，让它在对应进程中能正确访问，而被修改到的段就不能实现多进程共享一份物理内存，它们在每个进程中都必须有一份物理内存的拷贝。fPIC指令就是为了让使用到同一个共享对象的多个进程能尽可能多的共享物理内存，它背后把那些涉及到绝对地址、外部模块地址访问的地方都抽离出来，保证代码段的内容可以多进程相同，实现共享。

这里的「共享对象」，常见就是一些动态库文件。

### `-pipe`

[参考](https://stackoverflow.com/questions/1512933/when-should-i-use-gccs-pipe-option)

作用在编译过程中使用pipe管道，而非临时文件。

> Use pipes rather than temporary files for communication between the various stages of compilation. This fails to work on some systems where the assembler is unable to read from a pipe; but the GNU assembler has no trouble.

### `-Wall`

[参考](https://stackoverflow.com/questions/2408038/what-does-wall-in-g-wall-test-cpp-o-test-do)

意思是"warn all"。让编译器抛出所有的警告

### `-W`

[参考](https://stackoverflow.com/questions/29254877/meaning-of-g-flags-wall-w-werror)

启用额外的警告信息。一般更加推荐用`-Wextra`

### `-Werror`

将warning处理视为错误。

### `-Wl`

[参考](https://blog.csdn.net/gohome520/article/details/7259450)

这个Flag是一个前缀，表示后面的Flag传递给链接器。
