---
title: Node.js | Dependency Injection
tags:
  - nodejs
  - 翻译
categories:
  - 形而上
abbrlink: 61013
date: 2018-12-12 23:40:11
---
Dependency Injection这个概念是我之前在实习的时候做Java开发的时候接触的。Dependency Injection可以大大降低模块之间的耦合度，提高系统的可扩展性和鲁棒性，不过这个概念对于新人来说理解起来还是存在比较大的障碍。由于当时实习的时间比较短，对于这个概念我并没有吃透。这次学习Node.js的时候，又在awilix这个库里面遇到了这个概念。以此为契机就来好好学习一些Dependency Injection和其后的设计逻辑与方法。

下面的内容翻译自：[Dependency Injection in Node.js](https://blog.risingstack.com/dependency-injection-in-node-js/)。这篇文章浅显地介绍了Dependency Injection的基本理念。选择这篇文章是因为我在阅读awilix模块作者关于Dependency Injection的系列文章中时，作者在开篇提议阅读此文。

不过这篇文章毕竟是2015年的文章，在js的一些语法和模块细节上和今时今日的有些不同，但是并不妨碍我们对于其核心理念的理解。<!--more-->

# 使用Dependency Injection的理由

## 解耦 (Decoupling)

Dependency Injection使你的模块耦合度降低，从而提升代码的可维护性。

## 更简单的单元测试

比起需要硬编码的依赖关系，你可以将依赖关系传输进入你要用的模块。在大多数场合下使用这种范式你不必要使用proxyquire这样的模块。

> 这一段作者写的比较含糊。其实意思是在使用Dependency Injection场景下，我们在独立测试一些单元功能的时候，对于其他模块可以通过注入Mock对象，从而将待测试的模块独立出来进行测试。

## 更快速的开发

在使用了Dependency Injection的场景下，在接口定义好了以后，开发会更加容易，Merge conflict会更少。

# 如何在Node.js中使用Dependency Injection

下面我们来看看如何在不适用Dependency Injection的前提下开发应用，然后看看如何进行转化。

## 不使用Dependency Injection的例子

下面是一段简单的没有使用Dependency Injection的代码：

```js
// team.js
var User = require('./user');

function getTeam(teamId) {
    return User.find({teamId: teamId});
}

module.exports.getTeam = getTeam;
```

对应的测试可能是：

```js
// team.spec.js
var Team = require('./team');
var User = require('/user');

describe('Team', function() {
    it('#getTeam', function* () {
        var users = [{id: 1, id: 2}];

        this.sandbox.stub(User, find, function() {
            return Promise.resolve(users);
        })

        var team = yield team.getTeam();

        expect(team).to.eql(users);
    })
})
```

在上面的代码中我们做的是创建了一个名为`team.js`的模块，该模块可以返回属于一个team的用户列表。为了实现这一功能，我们导入`User`模块，然后我们再调用其`find`方法返回用户列表。

看起来不错，是吗？但是当我们需要进行测试时，我们必须要使用[sinon](https://sinonjs.org/)的test stubs.

在测试文件中，我们需要引入User模块，为其stub一个`find`方法。注意，我们在这里要使用sandbox功能，这样我们不需在测试完成后回复`find`的原函数。

> 注意：如果原始对象使用了`Object.freeze`，那么stubs将不会起作用。

## 使用Dependency Injection的例子

```js
// team.js
function Team(options) {
    this.options = options;
}

Team.prototype.getTeam = function(teamId) {
    return this.options.User.find({teamId: teamId});
}

function create(options) {
    return new Team(options);
}
```

你可以使用下面的这个文件来进行测试

```js
// team.spec.js
var Team =- require('./team');

describe('Team', function() {
    it('#getTeam', function* () {
        var users = [{id: 1, id: 2}];

        var fakeUser = {
            find: function() {
                return Promise.resolve(users);
            }
        }

        var team = Team.create({
            User: fakeUser
        })

        var team = yield team.getTeam();

        expect(team).to.eql(users);
    });
});
```

那么，使用了Dependency Injection的版本同之前的版本有什么区别呢？首先你可能注意到的是这里使用了[工厂模式](https://blog.risingstack.com/fundamental-node-js-design-patterns/)：我们使用这种设计模式来将options/dependencies inject到新创建的对象中 - 这里是我们注入`User`模块的方法。

在测试文件中我们还需要创建一个fake model来代表`User`模块，然后将这个伪造的模块传递给工厂函数。很简单，不是吗？

# Dependency Injection in Real Projects

你可以在非常多的开源项目中发现Dependency Injection的例子。例如，你在日常工作中常常用到的Express/Koa的大部分中间件都使用了这种技术。

## Express Middlewares

```js
var express = require('express');
var app = express();
var session = require('express-session');

app.use(session({
    store: require('connect-session-knex');
}))
```

上面的代码片段使用了基于工厂模式的Dependency Injection：对应session中间件我们传递了一个`connect-session-knex`模块。这个模块需要实现`session`模块调用需要的借口。

在这个例子中，`connect-session-knex`模块需要实现下面的方法：

- `store.destroy(sid, callback)`
- `store.get(sid, callback)`
- `store.set(sid, session, callback)`

## Hapi plugins

Dependency Injection的概念还可以在Hapi中找到。下面的例子中，`handlebars`模块被作为view engine注入给Hapi使用:

```js
server.views({
    engines: {
        html: require('handlebars`)
    },
    relativeTo: __dirname,
    path: 'templates'
})
```
