---
title: '旧文迁移|Django部署:Nginx+Gunicorn+virtualenv+supervisor+PostgreSQL'
abbrlink: 34441
date: 2019-08-30 11:06:37
tags:
  - Django
  - python
  - 教程
categories:
  - 教程
---
Django是最受欢迎的基于Python的web框架之一，也非常适合新手入门。虽然Django为我们提供了一个用于测试的轻量级server，但这个server不能用于实际生产环境的部署。最早的Django的部署方法推荐的是Apache+mod_wsgi。演化到现在，django的部署方法也变得越来越弹性、有效，也更加的复杂了。在下面的教程中我们需要使用下面的这些工具：

- Nginx
- Gunicorn
- virtualenv
- supervisor
- PostgreSQL

<!--more-->

#### 前期准备

你需要一个你拥有root权限的server。下面的教程是基于Debian 7，所有相同的步骤对于Ubuntu和其他的基于Debian的发行版都是适用的。

#### 更新系统

首先确保系统处于最新的状态

```bash
$ sudo aptitude update
$ sudo aptitude upgrade
```

#### PostgreSQL

为基于Debian的系统安装PostgreSQL，你只需要运行下面这个命令：

```bash
$ sudo aptitude install postgresql postgresql-contrib
```

完成安装以后为我们的django应用创建一个用户和一个数据库

```bash
$ sudo su - postgres 
postgres@django:~$ createuser --interactive -P 
Enter name of role to add: hello_django 
Enter password for new role: 
Enter it again: Shall the new role be a superuser? (y/n) n 
Shall the new role be allowed to create databases? (y/n) n 
Shall the new role be allowed to create more new roles? (y/n) n postgres@django:~$ 

postgres@django:~$ createdb --owner hello_django hello 
postgres@django:~$ logout $
```

#### 创建一个运行账户

为了避免万一web应用被攻击以后带来不受控制的后果，我们一般会单独为web应用创建一个权限受限的用户来运行这个web应用。例如我们这里为我们的django应用创建一个名为`hello`的用户，并将其归入`webapps`这个组。

```python
$ sudo groupadd --system webapps
$ sudo useradd --system --gid webapps --shell /bin/bash --home /webapps/hello_django hello
```

#### virtualenv

Virtualenv是一个Python虚拟环境管理的工具，所谓虚拟环境就是讲你Web应用所需要的python环境从系统的python环境中独立出来，这使得你可以在不同的应用中使用不同版本的第三方库。

用下面的命令来在Debian上安装Virtualenv

```bash
$ sudo aptitude install python-virtualenv
```

##### 为你的Django应用创建一个python环境

这里我将django应用放在了`/webapps`这个路径下面，如果你偏好`/var/www`, `srv`或者其他的路径也可以。首先在这个目录下面创建`/webapps/hello_django/`文件夹来存储应用，并将这个文件夹的owner设置为上面我们创建的运行账户`hello`

```bash
$ sudo mkdir -p /webapps/hello_django/
$ sudo chown hello /webapps/hello_django/
```

切换到`hello`用户并创建虚拟环境

```bash
$ sudo su - hello
hello@django:~$ cd /webapps/hello_django/
hello@django:~$ virtualenv .

New python executable in hello_django/bin/python
Installing distribute..............done.
Installing pip.....................done. 
hello@django:~$ source bin/activate 
(hello_django)hello@django:~$
 
```

现在虚拟环境就被激活了，我们可以将django安装到这个虚拟环境里面

```bash
Downloading/unpacking django 
(...) 
Installing collected packages: django 
(...)
Successfully installed django 
Cleaning up...
```

完成django的安装以后我们来创建一个空的django项目

```bash
(hello_django)hello@django:~$ django-admin.py startproject hello
```

你可以通过启动测试服务器来测试是否一切正常

```bash
(hello_django)hello@django:~$ cd hello 
(hello_django)hello@django:~$ python manage.py runserver example.com:8000 
Validating models... 

0 errors found 
June 09, 2013 - 06:12:00 Django version 1.5.1, using settings 'hello.settings' 
Development server is running at http://example.com:8000/ 
Quit the server with CONTROL-C.
```

现在你可以通过[http://example.com:8000](http://example.com:8000)来访问了。

#### 为Django配置PostgreSQL

Django默认的新工程使用的是SQLite3作为数据库的，这个数据库的性能不足以支持生产环境下的数据库应用。我们这里采用PostgreSQL来做为我们的Django项目的数据库。为了让Django能够使用PostgreSQL，我们需要将`psycopg2`安装到虚拟环境。首先安装这个包的依赖项

```bash
 libpq-dev
```

然后通过pip来安装的`psycopg2`

```bash
(hello_django)hello@django:~$ pip install psycopg2
```

现在可以将Django的数据库设置修改为：

```python
DATABASES = { 
    'default': { 
        'ENGINE': 'django.db.backends.postgresql_psycopg2', 
        'NAME': 'hello', 
        'USER': 'hello_django', 
        'PASSWORD': 'Your password', 
        'HOST': 'localhost', 
        'PORT': '', # Set to empty string for default. 
    } 
}
```

然后向向Postgres应用你的Django设置

```bash
(hello_django)hello@django:~$ python manage.py migrate
```

#### Gunicorn

在实际生产环境中我们不会使用Django的单线程开发服务器。这里我们使用[Gunicorn](http://gunicorn.org/).

通过pip来安装Gunicorn

```bash
(hello_django)hello@django:~$ pip install gunicorn 
```

安装好以后你可以尝试用Gunicorn来运行Django了

```bash
(hello_django)hello@django:~$ gunicorn hello.wsgi:application --bind example.com:8001
```

上面的命令是一个简单的测试，为了真正在生产环境下使用Gunicorn，我们还需要增加一些配置。我们把这些配置文件写成一个bash脚本，保存为bin/gunicorn_start

```bash
#!/bin/bash
 
NAME="hello_app" # Name of the application
DJANGODIR=/webapps/hello_django/hello # Django project directory
SOCKFILE=/webapps/hello_django/run/gunicorn.sock # we will communicte using this unix socket
USER=hello # the user to run as
GROUP=webapps # the group to run as
NUM_WORKERS=3 # how many worker processes should Gunicorn spawn
DJANGO_SETTINGS_MODULE=hello.settings # which settings file should Django use
DJANGO_WSGI_MODULE=hello.wsgi # WSGI module name
 
echo "Starting $NAME as `whoami`"
 
# Activate the virtual environment
cd $DJANGODIR
source ../bin/activate
export DJANGO_SETTINGS_MODULE=$DJANGO_SETTINGS_MODULE
export PYTHONPATH=$DJANGODIR:$PYTHONPATH
 
# Create the run directory if it doesn't exist
RUNDIR=$(dirname $SOCKFILE)
test -d $RUNDIR || mkdir -p $RUNDIR
 
# Start your Django Unicorn
# Programs meant to be run under supervisor should not daemonize themselves (do not use --daemon)
exec ../bin/gunicorn ${DJANGO_WSGI_MODULE}:application \
--name $NAME \
--workers $NUM_WORKERS \
--user=$USER --group=$GROUP \
--bind=unix:$SOCKFILE \
--log-level=debug \
--log-file=-
```

将这个文件改成可执行模式

```bash
$ sudo chmod u+x bin/gunicorn_start
```

下面你可以尝试运行这个脚本了

```bash
$ sudo su - hello hello@django:~$ bin/gunicorn_start Starting hello_app as hello 2013-06-09 14:21:45 [10724] [INFO] Starting gunicorn 18.0 2013-06-09 14:21:45 [10724] [DEBUG] Arbiter booted 2013-06-09 14:21:45 [10724] [INFO] Listening at: unix:/webapps/hello_django/run/gunicorn.sock (10724) 2013-06-09 14:21:45 [10724] [INFO] Using worker: sync 2013-06-09 14:21:45 [10735] [INFO] Booting worker with pid: 10735 2013-06-09 14:21:45 [10736] [INFO] Booting worker with pid: 10736 2013-06-09 14:21:45 [10737] [INFO] Booting worker with pid: 10737 ^C (CONTROL-C to kill Gunicorn) 2013-06-09 14:21:48 [10736] [INFO] Worker exiting (pid: 10736) 2013-06-09 14:21:48 [10735] [INFO] Worker exiting (pid: 10735) 2013-06-09 14:21:48 [10724] [INFO] Handling signal: int 2013-06-09 14:21:48 [10737] [INFO] Worker exiting (pid: 10737) 2013-06-09 14:21:48 [10724] [INFO] Shutting down: Master $ exit
```

注意，如果你在上面的过程中设置了自定义的参数的话，需要将`gunicorn_start`脚本中对应的参数改过来。其中，worker的数量推荐设置为2 * CPUs + 1，这样的话，在任何时候都有一半的worker在做IO。

#### Supervisor

Superviosr是一个进程监管的工具。简而言之，Superviosr可以保证你的程序在服务器开机时自动启动以及程序意外终止时重新启动。通过下面的命令即可安装:

```bash
sudo aptitude install supervisor
```

Superviosr通过配置文件来设置被监管的程序。一般配置文件都放置在`/etc/supervisor/conf.d`路径下面。此处我们创建一个名为`hello.conf`的配置文件，内容如下：

```bash





[program:hello]
command = /webapps/hello_django/bin/gunicorn_start ; Command to start app
user = hello ; User to run as
stdout_logfile = /webapps/hello_django/logs/gunicorn_supervisor.log ; Where to write log messages
redirect_stderr = true ; Save stderr in the same log
environment=LANG=en_US.UTF-8,LC_ALL=en_US.UTF-8 ; Set UTF-8 as default encoding
```

你可以参考[其他设置](http://supervisord.org/configuration.html#program-x-section-settings)，不过上面的设置一般情况下应该足够了。

日志文件需要我们手动创建一下：

```bash
hello@django:~$ mkdir -p /webapps/hello_django/logs/ hello@django:~$ touch /webapps/hello_django/logs/gunicorn_supervisor.log
```

设置好上面的文件以后，我们可以通过`supervisorctl`工具来启用这些设置了：

```bash
$ sudo supervisorctl reread 
hello: available 
$ sudo supervisorctl update 
hello: added process group
```

现在你可以start，stop或者restart你的进程了

```bash
$ sudo supervisorctl status hello hello RUNNING pid 18020, uptime 0:00:50 
$ sudo supervisorctl stop hello 
hello: stopped 
$ sudo supervisorctl start hello 
hello: started 
$ sudo supervisorctl restart hello 
hello: stopped 
hello: started
```

#### Nginx

安装Nginx同样非常简单：

```bash
$ sudo aptitude install nginx 
$ sudo service nginx start
```

此时你访问server([http://example.com](http://example.com))就应该可以看见Nginx的欢迎页面了("Welcome to nginx")

##### 为Django创建一个虚拟server配置

每个Nginx的虚拟server都由`/etc/nginx/sites-available`路径下的一个配置文件来表示。而将其链接到的`/etc/nginx/sites-enabled`路径下则可以启用对应的站点。

为我们的Django应用创建一个配置文件`/etc/nginx/sites-available/hello`. 文件内容如下：

```bash
upstream hello_app_server {
# fail_timeout=0 means we always retry an upstream even if it failed
# to return a good HTTP response (in case the Unicorn master nukes a
# single worker for timing out).
 
server unix:/webapps/hello_django/run/gunicorn.sock fail_timeout=0;
}
 
server {
 
listen 80;
server_name example.com;
 
client_max_body_size 4G;
 
access_log /webapps/hello_django/logs/nginx-access.log;
error_log /webapps/hello_django/logs/nginx-error.log;

location /static/ {
alias /webapps/hello_django/static/;
}

location /media/ {
alias /webapps/hello_django/media/;
}
 
location / {
# an HTTP header important enough to have its own Wikipedia entry:
# http://en.wikipedia.org/wiki/X-Forwarded-For
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
 
# enable this if and only if you use HTTPS, this helps Rack
# set the proper protocol for doing redirects:
# proxy_set_header X-Forwarded-Proto https;
 
# pass the Host: header from the client right along so redirects
# can be set properly within the Rack application
proxy_set_header Host $http_host;
 
# we don't want nginx trying to do something clever with
# redirects, we set the Host: header above already.
proxy_redirect off;
 
# set "proxy_buffering off" *only* for Rainbows! when doing
# Comet/long-poll stuff. It's also safe to set if you're
# using only serving fast clients with Unicorn + nginx.
# Otherwise you _want_ nginx to buffer responses to slow
# clients, really.
# proxy_buffering off;
 
# Try to serve static files from nginx, no point in making an
# *application* server like Unicorn/Rainbows! serve static files.
if (!-f $request_filename) {
proxy_pass http://hello_app_server;
break;
}
}
 
# Error pages
error_page 500 502 503 504 /500.html;
location = /500.html {
root /webapps/hello_django/static/;
}
}
```

将这个文件链接到`site-enabled`文件夹下：

```bash
$ sudo ln -s /etc/nginx/sites-available/hello /etc/nginx/sites-enabled/hello
```

然后重启nginx

```bash
$ sudo service nginx restart
```

现在你再访问[http://example.com](http://example.com)看到的就应该不是nginx的欢迎页面，而是Django的欢迎页面了。

至此配置就全部完成了，最终项目的整个结构应该如下所示：

```bash
/webapps/hello_django/ 
├── bin <= Directory created by virtualenv 
│ ├── activate <= Environment activation script
│ ├── django-admin.py 
│ ├── gunicorn 
│ ├── gunicorn_django 
│ ├── gunicorn_start <= Script to start application with Gunicorn 
│ └── python 
├── hello <= Django project directory, add this to PYTHONPATH 
│ ├── manage.py 
│ ├── project_application_1 
│ ├── project_application_2 
│ └── hello <= Project settings directory 
│ ├── __init__.py 
│ ├── settings.py <= hello.settings - settings module Gunicorn will use 
│ ├── urls.py 
│ └── wsgi.py <= hello.wsgi - WSGI module Gunicorn will use 
├── include 
│ └── python2.7 -> /usr/include/python2.7 
├── lib 
│ └── python2.7 
├── lib64 -> /webapps/hello_django/lib 
├── logs <= Application logs directory 
│ ├── gunicorn_supervisor.log 
│ ├── nginx-access.log 
│ └── nginx-error.log 
├── media <= User uploaded files folder 
├── run 
│ └── gunicorn.sock 
└── static <= Collect and serve static files from here
```