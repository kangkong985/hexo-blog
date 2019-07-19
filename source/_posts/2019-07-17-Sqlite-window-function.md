---
title: 'Sqlite: window function'
tags:
  - 教程
  - 翻译
  - 转载
  - sqlite
categories:
  - 教程
abbrlink: 35361
date: 2019-07-17 15:18:01
---
![](https://imgs.codewoody.com/uploads/big/34274a932d5bced7fbe1fed335fb4567.png)
<!--less-->

[https://www.sqlite.org/windowfunctions.html](Sqlite Window Function)

## 简介

之前我们接触的SQL命令的结果，一般都是逐行的。即SQL命令返回的结果，都是来自原表的同一行。Window Function则赋予了我们在SQL
结果中，获得来自一组行的数据的能力。这样的组被称为「Window」。

Window Function最鲜明的特征是`OVER`关键字。如果 以一个函数有`OVER`子句，则此函数为Window Function。反之，如果这个函数不带`OVER`子句，则这个函数是简单的聚合(Aggregate)函数或者标量(Scalar)函数。Window Function在函数和`OVER`子句之间，还可能带有`FILTER`子句。

Window Function的语法结构如下：

![Window function invocation](https://www.sqlite.org/images/syntax/window-function-invocation.gif)

不同于普通的函数，Window Function不能使用Distinct子句。另外，Window Function只能出现在查询结果中和`ORDER BY`后面。

Window Function可以划归为的两种不同类型：聚合窗函数(Aggregate Window Function)和内建窗函数(Built-in Window Function)。每个聚合窗函数也可以当做普通的聚合函数使用（只需要舍去`OVER`和`FILTER`子句即可）。内建窗函数，也可以通过合适地配置`OVER`子句从而具备聚合函数的功能。在应用中，我们也可以通过[sqlite3_create_window_function()](https://www.sqlite.org/c3ref/create_function.html)接口（C）来自定义新的聚合窗函数。

下面是使用内建的`row_number()`窗函数的例子：

```sql
CREATE TABLE t0(x INTEGER PRIMARY KEY, y TEXT);
INSERT INTO t0 VALUES (1, 'aaa'), (2, 'ccc'), (3, 'bbb');

-- The following SELECT statement returns:
--
--   x | y | row_number
-----------------------
--   1 | aaa | 1
--   2 | ccc | 3
--   3 | bbb | 2
--
SELECT x, y, row_number() OVER (ORDER BY y) AS row_number FROM t0 ORDER BY x;
```

`row_number()`窗函数函数可以每行添加一个行号。行号的顺序通过`OVER`后面的`ORDER BY y`确定。注意，`OVER`后面的`ORDER BY y`不会影响`SELECT`返回的查询结果的顺序。在上面的例子中，`SELECT`返回的顺序还是根据`x`来排序的。比对上面的「Window function invocation」图，`OVER`后的子句体称为`window-defn`。我们还可以在`SELECT`语句中通过`WINDOW`子句来声明`named window-defn`

```sql
SELECT x, y, row_number() OVER win1, rank() OVER win2
FROM t0
WINDOW win1 AS (ORDER BY y RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW),
       win2 AS (PARTITION BY y ORDER BY x)
ORDER BY x;
```

`WINDOW`子句，应当位于`HAVING`之后，`ORDER BY`之前。

## 聚合窗函数

在这个部分我们假设所有的数据库的结构都是：

```sql
CREATE TABLE t1(a INTEGER PRIMARY KEY, b, c);
INSERT INTO t1 VALUES   (1, 'A', 'one'  ),
                        (2, 'B', 'two'  ),
                        (3, 'C', 'three'),
                        (4, 'D', 'one'  ),
                        (5, 'E', 'two'  ),
                        (6, 'F', 'three'),
                        (7, 'G', 'one'  );
```

聚合窗函数类似于一般的聚合函数，添加聚合窗函数不会改变查询返回的行数。相反，聚合窗函数会将于「Window frame」中运行的得到的聚合结果添加到原本的每一行结果中。例如

```sql
-- The following SELECT statement returns:
--
--   a | b | group_concat
-------------------------
--   1 | A | A.B
--   2 | B | A.B.C
--   3 | C | B.C.D
--   4 | D | C.D.E
--   5 | E | D.E.F
--   6 | F | E.F.G
--   7 | G | F.G
--
SELECT a, b, group_concat(b, '.') OVER (
  ORDER BY a ROWS BETWEEN 1 PRECEDING AND 1 FOLLOWING
) AS group_concat FROM t1;
```

在上面的例子中，我们要做的将本行与上下两行的结果拼起来，而上下行关系，是根据`OVER`子句中的`ORDER BY`来确定的。

### `PARTITION BY` 子句

为了计算窗函数，查询的返回结果通过`PARTITION BY`子句分割成多个「partitions」。`PARTITION BY`类似于`GROUP BY`，可以将查询结果中，于`PARTITION BY`后的`window-defn`所指定列拥有相通值的行组成组。若没有`PARTITION BY`子句，则所有的查询结果组成一个单一的组。窗函数在各个「partition」上运行。

例如

```sql
-- The following SELECT statement returns:
-- 
--   c     | a | b | group_concat
---------------------------------
--   one   | 1 | A | A.D.G       
--   one   | 4 | D | D.G         
--   one   | 7 | G | G           
--   three | 3 | C | C.F         
--   three | 6 | F | F           
--   two   | 2 | B | B.E         
--   two   | 5 | E | E           
-- 
SELECT c, a, b, group_concat(b, '.') OVER (
  PARTITION BY c ORDER BY a RANGE BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
) AS group_concat
FROM t1 ORDER BY c, a;
```

在上面的查询例子中，`PARTITION BY c`将查询结果划分成了三个Partition。第一个Parition的`c = one`，第二个Partition的`c = three`，第三个Partition的`c = two`。注意，Partiion的划分，及其后续的的`ORDER BY`的排序，和最终查询结果的顺序是没有关系的。上面的查询的例子的输出也可能是：

```sql
-- The following SELECT statement returns:
-- 
--   c     | a | b | group_concat
---------------------------------
--   one   | 1 | A | A.D.G       
--   two   | 2 | B | B.E         
--   three | 3 | C | C.F         
--   one   | 4 | D | D.G         
--   two   | 5 | E | E           
--   three | 6 | F | F           
--   one   | 7 | G | G           
--
SELECT c, a, b, group_concat(b, '.') OVER (
  PARTITION BY c ORDER BY a RANGE BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
) AS group_concat
FROM t1 ORDER BY a;
```

### Frame Specification

Frame Specification是`OVER`子句的一个部分，规定了聚合窗函数读取的输出行的范围。`frame-spec`在`window-defn`中的位置如下:

![](https://www.sqlite.org/images/syntax/window-defn.gif)

`frame-spec`包含如下四个部分：

- Frame type: either ROWS, RANGE or GROUPS;
- A starting frame boundary;
- An ending frame broundary;
- An EXCLUDE clause;

细节的语法结构如下：

![](https://www.sqlite.org/images/syntax/frame-spec.gif)

其中ending frame boundary可以被省略，此时默认情况下ending frame boundary默认为 `CURRENT ROW`。

如果frame type为`RANGE`或者`GROUPS`，那么在`ORDER BY`所指定的列上具有相同值的行被归为一组「peers」。如果没有`ORDER BY`，那么所有的行归于一组Peer。注意Peers总是属于相同的frame。

默认的`frame-spec`为

```sql
RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW EXCLUDE NO OTHERS
```

默认的配置的意思是，聚合窗函数从Partition的开头开始读取直到当前的行的所有Peers。同Peer组的行对从窗函数获取的返回值是相通的（其Window frame是相同的）。例如

```sql
-- The following SELECT statement returns:
-- 
--   a | b | c | group_concat
-----------------------------
--   1 | A | one   | A.D.G       
--   2 | B | two   | A.D.G.C.F.B.E
--   3 | C | three | A.D.G.C.F   
--   4 | D | one   | A.D.G       
--   5 | E | two   | A.D.G.C.F.B.E
--   6 | F | three | A.D.G.C.F   
--   7 | G | one   | A.D.G       
-- 
SELECT a, b, c,
       group_concat(b, '.') OVER (ORDER BY c) AS group_concat 
FROM t1 ORDER BY a;
```

> 关于Frame的更多细节，参考出处原文（页面顶部）

### `FILTER` 子句

![](https://www.sqlite.org/images/syntax/filter.gif)

如果出现了`FILTER`子句，那么只有`expr`指定的行才会被包含到window frame中。这里的`FILTER`不会过滤查询结果，只是决定了窗函数作用的范围。

## 内建窗函数

内建窗函数也具备和聚合窗函数同样的`PARTITION BY`子句功能：每个行都从属于一个Partition，而每个Partition被单独地进行处理。`ORDER BY`的作用，我们在下面进行阐述。有一些特定的窗函数（`rank()`, `dense_rank`, `percent_rank` and `ntile()`）采用了`peer group`的概念（rows within the same partition that have the same values for all ORDER BY expressions）。此时`frame-spec`中`frame type`(`ROWS`, `GROUPS`, `RANGE`) 就不起作用了。

SQLite支持如下11个内建的窗函数

- `row_number()`: 当前行位于Partition中的位置（行号），从1开始排列，顺序由窗函数的`ORDER BY`决定。
- `rank()`: 每一个Group（同一个Partition内在`ORDER BY`指定的列上具有相同值的行归于一个Group）中的第一个peer（行）的`row_number`值。`rank`获取的序号可能是不连续的。
- `dense_rank()`: 相比于`rank()`, 压缩了序号的间隙，得到的序号总是连续的。从1开始排。
- `percent_rank()`: 将rank转化成百分比，等于`(rank - 1)/(partition-rows - 1)`。如果只有一个组，返回0.
- `cume_dist()`: 累积分布，等于`row-number/partition-rows`。
- `ntile(N)`: 参数N为整数，这个函数将partition划分为尽可能均匀的N份，并为每份分配一个1到N的整数，顺序由`ORDER BY`决定（若无`ORDER BY`，则为乱序）。如果需要的话，较大的组会先出现。
- `lag(expr)`
- `lag(expr, offset)`
- `lag(expr, offset, default)`: 返回对上一行执行`expr`得到的结果。如果没有上一行，返回空。可以通过`offset`修改偏移量（如设为2，返回往上数第二行执行结果，必须为费复制）。`offset`为0表示对当前行执行。`default`表示目标行不存在时需要返回的默认值。
- `lead(expr)`
- `lead(expr, offset)`
- `lead(expr, offset, default)`: 和`lag`函数类似，不过是向下获取。
- `first_value(expr)`: 返回第一个行的数据
- `last_value(expr)`: 返回最后一行的数据
- `nth_value(expr, N)`: 返回第N行的数据。

