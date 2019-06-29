---
title: Python下的音频处理库librosa打开文件是显示NoBackendError的解决
abbrlink: 40199
date: 2019-06-26 12:56:10
tags:
  - Debug
  - python
categories:
  - Debug
---
近日在django项目中采用了librosa来分析用户上传的音频，主要是对其做一定间隔的采样用于绘制波形图。在本地(MacOS)上工作正常，部署到Ubuntu服务器后，自己手动用python方式运行django的server时，工作都是正常的，然而当我用superviosr挂起之后就一直报NoBackendError的错误，反复检查了FFmpeg的安装，应该是没有问题的。网上搜了一下没有看到比较合适的解决办法，故不得不自己读源码来调试了。
<!--more-->

由于我的程序中只采用了`librosa.load`这个命令，通过源代码可以发现librosa实际上是用`audioread`这个库的`audioread.audio_open`来读取音频文件的。这个函数的源代码如下：

```python
def audio_open(path):
    """Open an audio file using a library that is available on this
    system.
    """
    # Standard-library WAV and AIFF readers.
    from . import rawread
    try:
        return rawread.RawAudioFile(path)
    except DecodeError:
        pass

    # Core Audio.
    if _ca_available():
        from . import macca
        try:
            return macca.ExtAudioFile(path)
        except DecodeError:
            pass

    # GStreamer.
    if _gst_available():
        from . import gstdec
        try:
            return gstdec.GstAudioFile(path)
        except DecodeError:
            pass

    # MAD.
    if _mad_available():
        from . import maddec
        try:
            return maddec.MadAudioFile(path)
        except DecodeError:
            pass

    # FFmpeg.
    from . import ffdec
    try:
        return ffdec.FFmpegAudioFile(path)
    except DecodeError:
        pass

    # All backends failed!
    raise NoBackendError()
```

可见之前我们遇到的NoBackendError就是这里的最后一行抛出的了，由于我安装的FFmpeg，进一步进入ffdec.py这个文件中。不难发现实际打开文件的是下面这个函数：

```python
def popen_multiple(commands, command_args, *args, **kwargs):
    """Like `subprocess.Popen`, but can try multiple commands in case
    some are not available.

    `commands` is an iterable of command names and `command_args` are
    the rest of the arguments that, when appended to the command name,
    make up the full first argument to `subprocess.Popen`. The
    other positional and keyword arguments are passed through.
    """
    for i, command in enumerate(commands):
        cmd = [command] + command_args
        try:
            return subprocess.Popen(cmd, *args, **kwargs)
        except OSError:
            if i == len(commands) - 1:
                # No more commands to try.
                raise
```

这里的`commands`是直接传入的第33行的`COMMANDS`变量

```python
COMMANDS = ('ffmpeg', 'avconv')
```
我这里倒腾了好几下，最终发现实际是错误的原因是没有找到ffmpeg这个命令。我们在这里将ffmpeg替换成ffmpeg的绝对路径。你可以通过下面这行命令找到。

```bash
which ffmpeg
```

最终我改成了

```python
COMMANDS = ('/usr/bin/ffmpeg', 'avconv')
```

Boom！一切就工作正常了。这么想起来应该是安装ffmpeg的时候的环境变量有问题，导致在command line方式下调用ffmpeg命令出错吧。
