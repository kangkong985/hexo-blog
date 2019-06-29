---
title: SimpleOpenNI在Processing导出应用中的库引用问题
abbrlink: 65501
date: 2019-02-22 16:15:14
tags:
  - processing
  - Debug
  - java
categories:
  - processing
---
在Processing中使用SimpleOpenNI时，如果尝试将本来能够正常运行的pde文件导出成应用，那么在运行时会出现`java.lang.UnsatisfiedLinkError`这个错误。详细信息如下：

```text
Can't load SimpleOpenNI library (libSimpleOpenNI.jnilib) : java.lang.UnsatisfiedLinkError: Can't load library: /SimpleOpenNI/library/libSimpleOpenNI.jnilib
Verify if you installed SimpleOpenNI correctly.
http://code.google.com/p/simple-openni/wiki/Installation

java.lang.UnsatisfiedLinkError: SimpleOpenNI.SimpleOpenNIJNI.swig_module_init()V
	at SimpleOpenNI.SimpleOpenNIJNI.swig_module_init(Native Method)
	at SimpleOpenNI.SimpleOpenNIJNI.<clinit>(SimpleOpenNIJNI.java:290)
	at SimpleOpenNI.ContextWrapper.<init>(ContextWrapper.java:54)
	at SimpleOpenNI.SimpleOpenNI.<init>(SimpleOpenNI.java:253)
	at Sketch.settings(Sketch.java:28)
	at processing.core.PApplet.handleSettings(PApplet.java:954)
	at processing.core.PApplet.runSketch(PApplet.java:10786)
	at processing.core.PApplet.main(PApplet.java:10511)
	at Main.main(Main.java:7)
```

根据错误信息，是在读取`libSimpleOpenNI.jnilib`这个库文件时失败导致的。奇怪的是，程序尝试读取的路径是：`/SimpleOpenNI/library/libSimpleOpenNI.jnilib`。这是一个很奇怪的绝对路径。也[有人](https://forum.processing.org/two/discussion/1253/has-anyone-successfully-exported-a-processing-app-using-simple-openni-on-mac-os-x)尝试直接将库文件复制到这个全局路径的位置，可以让程序运行起来。可是这种方法也太不优雅了。

## 为什么会出现这种现象？

通过IntelliJ可以打开`SimpleOpenNI.jar`查看代码细节。可以看到`SimpleOpenNI.class`中确定载入库文件路径的方式如下：

```java
static {
        String var0 = System.getProperty("os.name").toLowerCase();
        String var1 = "SimpleOpenNI";
        String var2 = System.getProperty("os.arch").toLowerCase();
        if (var0.indexOf("win") >= 0) {
            // ...
        } else if (var0.indexOf("nix") < 0 && var0.indexOf("linux") < 0) {
            if (var0.indexOf("mac") >= 0) {
                var1 = "lib" + var1 + ".jnilib";
                nativLibPath = getLibraryPathLinux() + "/SimpleOpenNI/library/";
                nativDepLibPath = nativLibPath + "osx/";
            }
        } else {
            nativLibPath = "/SimpleOpenNI/library/linux";
            if (var2.indexOf("86") >= 0) {
                var1 = var1 + "32";
            } else if (var2.indexOf("64") >= 0) {
                var1 = "lib" + var1 + "64.so";
                nativLibPath = getLibraryPathLinux() + "/SimpleOpenNI/library/";
                nativDepLibPath = nativLibPath + "linux64/";
            }
        }

        try {
            System.load(nativLibPath + var1);
        } catch (UnsatisfiedLinkError var5) {
            System.out.println("Can't load SimpleOpenNI library (" + var1 + ") : " + var5);
            System.out.println("Verify if you installed SimpleOpenNI correctly.\nhttp://code.google.com/p/simple-openni/wiki/Installation");
        }

        _initFlag = false;
    }
```

注意到在生成库文件路径时，`/SimpleOpenNI/library/libSimpleOpenNI.jnilib`，前面应该会添加`getLibraryPathLinux()`的结果。

```java
public static String getLibraryPathLinux() {
        URL var0 = SimpleOpenNI.class.getResource("SimpleOpenNI.class");
        if (var0 != null) {
            String var1 = var0.toString().replace("%20", " ");
            int var2 = var1.indexOf(47);
            boolean var3 = true;
            int var4 = var1.indexOf("/SimpleOpenNI/library");
            return -1 < var2 && -1 < var4 ? var1.substring(var2, var4) : "";
        } else {
            return "";
        }
    }
```

我尝试了在不同环境下,`SimpleOpenNI.class.getResource("SimpleOpenNI.class")`下运行的结果。发现：

1. 在pde运行时，获取到的是独立的`SimpleOpenNI.jar`下的路径，例如：`/Users/lena/Documents/Processing/libraries/SimpleOpenNI/library/SimpleOpenNI.jar!/SimpleOpenNI/SimpleOpenNI.class`
2. 在导出应用中运行时，获取到的是打包后应用内的，例如`.../MySketch/application.macosx/MySketch.app/Contents/Java/SimpleOpenNI.jar!/SimpleOpenNI/SimpleOpenNI.class`

在函数`getLibraryPathLinux`中，程序会定位`/SimpleOpenNI/library`这个字符串，然后取出这个子字符串前的内容构成的路径。上述第二种情形内，SimpleOpenNI.jar被打包到应用内后，不在处于`/SimpleOpenNI/library`这个前缀目录下，所以导致定位失败。

## 如何解决这个问题。

在无法直接修改SimpleOpenNI的源代码的情况下，要修复这个问题，就要想办法把`SimpleOpenNI.jar`放到`SimpleOpenNI/library`目录下。我使用的macOS系统，下面的方法都是在Mac下测试。不过基本思路可以迁移到Windows上。

在生成的App上右键选择显示包内容。可以查看其内部结构：

```text
.
├── Info.plist
├── Java
│   ├── Sketch.jar
│   ├── NiTE2
│   ├── SimpleOpenNI.jar
│   ├── SimpleOpenNI32.dll
│   ├── SimpleOpenNI64.dll
│   ├── core.jar
│   ├── data
│   ├── gluegen-rt-natives-macosx-universal.jar
│   ├── gluegen-rt.jar
│   ├── javamp3-1.0.3.jar
│   ├── jogl-all-natives-macosx-universal.jar
│   ├── jogl-all.jar
│   ├── jsyn-20171016.jar
│   ├── libSimpleOpenNI.jnilib
│   ├── libSimpleOpenNI64.so
│   ├── osx
│   ├── sound.jar
│   ├── win32
│   └── win64
├── MacOS
│   └── Sketch
├── PkgInfo
├── PlugIns
│   └── jdk1.8.0_181.jdk
└── Resources
    ├── en.lproj
    └── sketch.icns
```

可以看到`SimpleOpenNI.jar`位于`Java`目录下。我尝试过直接在此处创建目录`SimpleOpenNI/library`并把`SimpleOpenNI.jar`放进去。但是运行提示无法找到`SimpleOpenNI.jar`。这需要在APP运行时进一步指定`CLASSPATH`。有一种方法是直接在Info.plist文件里面添加`-Djava.class.path`运行属性，或者添加`ClASSPATH`环境变量，但是这种方法会要求你手动填写所有需要使用的jar依赖，甚至是包括processing的jar文件。这对于后续维护和修改很不利。所以这里我采取了另一种取巧的办法。

进入`Contents/MacOS`目录，删除原来的`Sketch`文件(你看到的应该是和你的Processing程序同名的文件，我这里用Sketch来代替)。新建一个同名的空白的文本文件，然后在文件中添加如下内容：

```bash
#!/bin/bash
cd "$(dirname ${BASH_SOURCE})"
cd ../..
APP_ROOT=$(pwd)
cd Contents/Java

JAR_LIBS=$(ls *.jar | tr "\n" ":")
# 添加SimpleOpenNI.jar
JAR_LIBS=${JAR_LIBS}./SimpleOpenNI/library/SimpleOpenNI.jar

APP_NAME=$(basename "${BASH_SOURCE}")

# 注意：如果你内嵌的jdk的版本不同，要把jdk1.8.0_181.jdk替换成对应的版本
# 如果你没有在app内部内嵌jdk，这里修改成JAVA_BIN=java，使用系统全局的java即可
JAVA_BIN=${APP_ROOT}/Contents/PlugIns/jdk1.8.0_181.jdk/Contents/Home/jre/bin/java

${JAVA_BIN} \
-Djna.nosys=true \
-Djava.ext.dirs=$APP_ROOT/Contents/PlugIns/jdk1.8.0_181.jdk/Contents/Home/jre/lib/ext \
-Xdock:icon=$APP_ROOT/Contents/Resources/sketch.icns \
-Djava.library.path=$APP_ROOT/Contents/Java \
-Dapple.laf.useScreenMenuBar=true \
-Dcom.apple.macos.use-file-dialog-packages=true \
-Dcom.apple.macos.useScreenMenuBar=true \
-Dcom.apple.mrj.application.apple.menu.about.name=${APP_NAME} \
-classpath ${JAR_LIBS} ${APP_NAME}
```

为这个文件添加可执行权限

```bash
chmod +x ./Sketch
```

将`~/Documents/Processing/libraries/SimpleOpenNI`整个文件夹拷贝进导出APP的`Contents/Java目录下`。然后就可以运行了。
