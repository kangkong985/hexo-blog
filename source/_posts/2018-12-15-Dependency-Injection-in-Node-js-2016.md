---
title: Dependency Injection in Node.js | 2016
tags:
  - 翻译
  - nodejs
categories:
  - 形而上
abbrlink: 30333
date: 2018-12-15 17:41:10
---
在[上一篇文章](/posts/61013/)中我们初步讨论的Dependency Injection的一些理念。在这篇文章中，我翻译了awilix模块的作者Jeff Hansen的文章：[Dependency Injection in Node.js - 2016 edition](https://medium.com/@Jeffijoe/dependency-injection-in-node-js-2016-edition-f2a88efdd427)。原文包含三个部分，我在这里直接整理成为一篇完整的文章。

<!--more-->

> 在翻译中我以传到核心思想为主，故不会太拘泥于一些细节问题。对于一些插科打诨的话，如果不是特别有意思的话，也许不会翻译。

![作者Jeff Hansen](https://imgs.codewoody.com/uploads/big/a3409d0fa20c30e7116c01c4d7ac4f1e.jpeg)

---

# Part I

在2015年，RisingStack写了[一篇关于Dependency Injection(缩写为DI)的文章](https://blog.risingstack.com/dependency-injection-in-node-js/)，解释了什么是DI，以及如何手动实现。如果你还没有阅读这篇文章，我强烈建议你先阅读以下那篇文章。这样你对于本文的一些概念会有更加清晰的理解。

> 这里提到的RisingStack的文章的中文版可以在我的博客里找到: [Node.js | Dependency Injection](/posts/61013/)。

在这一系列文章中，我会扩展一下手动实现的DI，为什么这种做法是糟糕的，以及我们如何最终能够让DI的现实变得优雅 -- 甚至比require/imports方式要更好。我将要证明Node中使用DI可以不像之前的做法那样沉闷。这都要归功于在ES6中引入的新特性：Proxies（直译就是代理）。

我100%肯定作为一个Node的开发者，你会见过某种形式的DI。借鉴一下RisingStack文章中的例子:

```js
var express = require('express')
var app = express()
var session = require('express-session')

app.use(session({
    store: require('connect-session-knex')
}))
```

session needs a store! - 这种存储的具体实现方式是多样的 ：redis，MySQL。Express本身并不关心背后的实现。我们来看下面的这个例子 -- 非DI实现：

```js
import db from '../mydatabase'

export default {
    getToDos: () => {
        return db.query('select * from todos')
    }
}
```

在这个例子中我们直接导入了db模块，因此这个文件就依赖于db模块在磁盘上的具体存储位置，以及依赖于特定的是方式。在大多数场景下这并不算一个大问题。不过这种方式让测试变得更加困难 -- 不至于无法进行测试，但是无论如何都变得更加地困难了。另外，这个模块还假定db模块已经准备好了（例如：数据库连接已经建立起来了）。

如果我们进一步将上面的代码转化成为对于测试友好的DI实现方式：

```js
export default function makeTodosService ({ db }) {
    return {
        getTodos: () => {
            return db.query('select * from todos')
        }
    }
}
```

那么上面两个例子有什么区别呢？在下面的DI实现的例子中我们不是export出一个对象，而是export出一个生成这种对象的函数。这个函数同时阐明了为了创建此种对象所需要的依赖。

如果你熟悉在其他语言中的DI实现，如Java, C#，还有PHP。下面这个使用ES6的类实现的例子可能更受你喜欢一些：

```js
export default class TodosService {
    constructor({ db }) {
        this.db = db
    }
    getTodos() {
        return this.db.query('select * from todos')
    }
}
```

不过从个人角度我还是更喜欢函数的方法：不用担心this的上下文的问题。

测试上面这个基于DI的例子非常简单 -- 你不再需要担心对require进行修修补补来替代数据库模块从而连接到测试数据库。

```js
describe('Todo Service', function () {
    beforeEach(() {
        subject = makeTodosService({
            db: testDatabaseSomehow
        })
    })

    it('work', async function() {
        const todos = await subject.getTodos(
            expect(todos.length).to.equal(3)
        )
    })
})
```

# Part II

在这个部分我们来构思一个Todo APP。

在我们开始折腾API框架和其他乱七八糟的部分之前，我们来大致搭建一下项目的骨架 -- the service and data access。为了可读性的考虑我在这里使用了ES7的async-await机制。

然我们来开始我们的Todos Service - 这个模块来负责处理所有的业务逻辑。

我会在下面的代码片段那种使用不同的风格（函数式或者是面向对象的）来证明，这些具体的代码风格并不本质，你可以使用任何你喜欢的方式。

```js
// todosService.js
import assert from 'assert'

// Using object destructring to make it look good
export function makeTodosService ({
    // "repository" is a fancy term to describe an object
    // that is used to retrieve data from a datasource - the actual
    // data source does not matter. Could be a database, a REST API,
    // or some IoT things like sensors or what ever
    todosRepository,
    // We also want info about the user that is using the service,
    // so we can restrict access to only their own todos.
    currentUser
}) {
    assert(todosRepositry, 'opts.todosRepository is required.')
    assert(currentUser, 'opts.currentUser is required.')
    return {
        // Gets todos for the current user
        getTodos: async(query) => {
            const todos = await todosRepository.find({
                // can be ALL, INCOMPLETED, COMPLETED
                filter: query.filter,
                userId: currentUser.id
            })
            return todos
        },
        createTodo: async (data) => {
            const newTodo = await todosRepository.create({
                text: data.text,
                userId: currentUser.id,
                completed: false
            })
            return newTodo
        },

        updateTodo: async (todoId, data) => {
            const todo = await todosRepository.get(todoId)

            // verify that we are allowed to modify this todo
            if (todo.userId !== currentUser.id) {
                throw new Error('Forbidden')
            }

            const updatedTodo = await todosRepository.update(todoId, {
                text: data.text,
                completed: data.completed
            })

            return updatedTodo
        },

        deleteTodo: async (todoId) => {
            const todo = await (todoId)
            const todo = await todosRepository.get(todoId);
            if (todo.userId !== currentUser.id) {
                throw new Error('Forbidden')
            }

            await todoRepository.delete(todoId)
        }
    }
}
```

代码有点长，但是并没有什么太fancy的东西。我们并没有依赖于外部库（除了自带的assert模块用于输入检验）。不过，我们导出的函数其实有两个依赖：

- `todosRepository` -- 给予todos数据库访问的对象（我们并不关心具体的实现细节）。
- `currentUser` -- 正在使用这个服务的用户。注意我们并不知道这个对象从何处生成，也不关心这些细节。

我们继续往下走，给出todos repository的一个不错的实现方式：

```js
// todosRepository.js

// Let's do an in-memory implementation for now.
const _todos = []

export default class TodosRepository {
    // Making all methods async makes them return promises!
    async find(query) {
        const filtered = _todos.filter((todo) => {
            // Check the user id
            if (todo.userId !== query.userId) {
                return false;
            }
            // check the filter
            if (query.filter === "COMPLETED") {
                return todo.completed === true
            }
            if (query.filter === "INCOMPLETED") {
                return todo.completed === false
            }
            return true
        })

        return filtered
    }

    async get(id) {
        const todo = _todos.find(x => x.id === id)
        return todo
    }

    async create(data) {
        const newTodo = {
            id: Date.now(),
            text: data.text,
            userId: data.userId,
            completed: data.completed
        }
        _todos.push(newTodo)
        return newTodo
    }

    async update(id, data) {
        const todo = await this.get(id)
        Object.assign(todo, data)
        return todo
    }

    async delete(id) {
        const todo = await this.get(id)
        _todos.splice(todo, 1)
    }
}
```

上面的代码只是todos repository的一个in-memory实现。任何时候我们准备好的时候，可以替换成MySQL，Rethink，MongoDB等存储后端，只要具有同形式的API就可以了。Typescript和Flow在这里可以发挥很大的作用。

## 把系统粘合起来

在我们进入到RESTful API之前，让我们先把上门两个模块在测试中整合起来。下面的方法被称为“穷人式的DI”，不过别担心，在后面我们会展示更加fancy的做法。

```js
import makeTodosService from './todosService'
import TodosRepository from './todosRepository'

describe('Todos System', function () {
    it('works', async function() {
        // This is how DI is done manually
        const todosService = makeTodosService({
            todosRepository: new TodosRepository(),
            // Let's fake it til we make it!
            currentUser: {
                id: 123,
                name: 'Jeff'
            }
        })

        // Todos Service already knows who's creating it!
        const created = await todosService.create({
            text: 'Write Medium article'
        })
        expect(created.userId).to.equal(123, 'user id should match currentUser')

        const todos = await todosService.getTodos({
            filter: 'ALL'
        })
        expect(todos.length).to.equal(1)

        await todosService.update(todo.id, {
            completed: true
        })

        const incompleteTodos = await todosService.getTodos({
            filter: 'INCOMPETED'
        })
        expect(incompleteTodos.length).to.equal(0)

        const completedTodos = await todosService.getTodos{
            filter: 'COMPLETED'
        }
        expect(completedTodos.length).to.equal(1)
    })
})
```

看到上面的代码你可能会想：“这里的代码不是已经知道了两个模块了么？”。没错，在一个真实的APP中（下文中我们会提及），还是需要有一个知道所有使用的模块的单一置信源（source of truth）。在我们倒腾DI黑科技的时候，我们把这个部分的代码称为：组合根（The Composition Root，译者按：这个名字放在中文下太绕口了）。这是在应用中将所有的模块胶合在一起的地方。Composition Root可能长这个样子：

```js
cosnt currentUser = {
    id: 123,
    name: 'Jeff'
}

const todoRepository = new TodosRepository()

const todosService = makeTodosService({
    todosRepository,
    currentUser
})

export default {
    todosService,
    todosRepository
}
```

看到这个代码，我知道你一定在想：“我现在还不知道这个currentUser具体是指哪个用户呢！我要构建的是一个Web应用，这种方法根本没用！”。你说的对。有两种方法来手动解决这个问题：

- 为所有需要currentUser的方法手动传递这个参数 -- 这也太坑了。
- 将实例化过程推迟到你拥有了所有的数据之后（译者按：即在已知了currentUser之后再调用工厂函数初始化todosService）-- 这种方法也不好，你需要在很多的地方重复地进行实例化。

为了进一步解释以下第二点，下面给出一个例子。例子中使用到了Koa Router

```js
const router = new KoaRouter()

router.get("/todos", async (ctx) => {
    const todosService = makeTodosService({
        todosRepository: new TodosRepository(),
        currentUser: ctx.state.user
    })

    ctx.body = await todosService.getTodos(ctdx.request.query)
    ctx.status = 200
})

router.post("/todos". async (ctx) => {
    const todosService = makeTodosService({
        todosRepository: new TodosRepository(),
        currentUser: ctx.state.user
    })
    // ...
})

// and so on
```

这还只是涉及到两个模块。想象一下要是需要处理10个模块（这还只是对于小型的应用）。没错，第二种方法也是很糟糕的。

# Part III

Angular曾经是在JavaScript世界中第一个引入了DI的大型框架。他们的做法是使用函数的字符串表达来提取使用的模块名称。在当时这是唯一的做法。

有一些人尝试将DI功能从Angular中独立出来做成一个独立模块。但是问题是，大多数DI模块要求你的所有代码都要围绕着特定的DI系统来开发，这位违背了DI设计理念的初衷。

> DI的作用是减少程序模块之间的耦合程度，提高代码的可维护性。在这种目标下，DI系统的设计应当尽可能减少对于其它业务代码的影响。如果为了使用DI要对业务代码结构进行大范围的改动的话就得不偿失了。

我们希望能够在不改动我们的service和repository模块的情况下使用DI机制。

## 关于Awilix - The DI container you deservce

如果你不知道DI容器是什么，下面是一个简短的解释。DI容器的功能是将系统中的模块整合起来，从而让开发者不再需要太关注这些DI的实现细节问题。在前面两个Part中我们给出的示例代码：实例化services和repositories，确保service获取repository对象。这些工作都将由DI容器来完成。

Awilix就是这样的一个容器，其实现是基于ES6 Proxies，这一意味着不再需要对函数的参数进行字符串解析。

现在让我们回到开头的todo应用。让我们使用Awilix来将各个模块整合起来。我们将会使用Koa 2来实现Web API。先让我们来安装这些依赖：

```bash
npm install -S koa@next koa-router@next awilix awilix-koa
```

这里的awilix-koa模块让Awlix和Koa的搭配更加易用。现在让我们从composition root开始

```js
// configureContainer.js
import { createContainer, asClass, asFunction } from 'awilix'
import makeTodosService from './todosService'
import TodosRepository from './todosRepository'

export default function configureContainer () {
    const container = createContainer()

    // Ordering does not matter
    container.register({
        // Notice the scoped() at the end - this signals
        // Awilix that we gonna want a new instance per "scope"
        todosService: asFunction(makeTodosService).scoped(),
        // We only want a single instance of this for the apps
        // lifetime (it does not deal with user context)
        // so we can reuse it!
        todosRepository: asClass(TodosRepository).singliton()
    })

    return container
}
```

这看起来已经非常不错了。不过如果你有超过100个服务需要注册，Awilix提供了[自动化的工具](https://github.com/jeffijoe/awilix#auto-loading-modules)。

现在让我们来配置Koa应用

```js
// server.js
import Koa from 'koa'
import KoaRouter from 'koa-router'
import { asValue } from 'awilix'
import { scopePerRequest, makeInvoker } from 'awilix-koa'
import configureContainer from './configureContainer'

const app = new Koa()
const router = new KoaRouter()
const container = configureContainer()

// This installs a scoped container into our
// context - we will use this to register our current user
app.use(scopePerRequest(container))
// Let's do that now!
app.use((ctx, next) => {
    ctx.state.container.register(Value)({
        // Imagine some auth middleware somewhere...
        // This makes currentUser available to all services
        currentUser: ctx.state.user
    })
    return next()
})

// Now our handlers will be able to resolve a todos service
// using DI!
// P.S: be a good dev and use multiple files. ;)
const todosAPI = ({ todosService } => {
    return {
        getTodos: async (ctx) => {
            const todos = await todosService.getTodos(ctx.request.query)
            ctx.body = todos
            ctx.status = 200
        },
        createTodos: async (ctx) => {
            const todo = await todosService.createTodo(ctx.request.body)
            ctx.body = todo
            ctx.status = 201
        },
        updateTodo: async (ctx) => {
            const updated = await todosService.updateTodo(
                ctx.params.id,
                ctx.request.body
            )
            ctx.body = updated,
            ctx.status = 200
        },
        deleteTodo: async (ctx) => {
            await todosService.deleteTodo(
                ctx.params.id,
                ctx.request.body
            )
        }
    }
})

// Awilix magic will run the above function
// every time a request comes in, so we have
// a set of scoped services per request
const api = makeInvoker(todosAPI)
router.get('/todos', api('getTodos'))
router.post('/todos', api('createTodos'))
router.patch('/todos/:id', api('updateTodo'))
router.patch('/todos/:id', api('deleteTodo'))

app.use(router.routes())
app.listen(1337)
```

上面的代码还只是一个简单的雏形，不过你现在已经有了构建大规模项目的基础。

## 结论

DI是一个很有用的东西，不过手动去实现DI是一件糟心的事情。这也是Awilix这种DI容器扮演作用的地方。
