---
title: 车辆编队体系研究
date: 2019-05-09 21:56:41
mathjax: true
---

## 前言

车辆编队(platoon)是指多辆车，借助于车载传感器，车载计算机，车间通信系统等手段排成列或者更复杂的结构。编队系统可以减少车间距，提高道路承载能力。另一方面，基于空气动力学的特点，编队内车辆的阻力(aerodynamic drag)能够降低，从而降低能耗[@amoozadeh2015platoon][@tan1998demonstration]。

本文的主体框架基于[@jia2016survey]。

## 编队的优势

以编队方式形式有如下优势：

1. 编队内的车间距更小，故而可以提升道路承载能力(road capacity)，缓解交通拥堵。
2. 由于空气阻力降低，行驶的能耗也得到了降低，汽车排放量也减少了。
3. 在先进技术的辅助下，编队形式也能提升交通安全，提升驾驶/乘坐的舒适性、
4. 由于编队内的相对位置固定，车辆间的协作通信应用的效率能够改进，提升车联网的性能。

## Platoon as VCPS

这里的VCPS是指Vehicular [Cyber-Physical System](https://en.wikipedia.org/wiki/Cyber-physical_system)，CPS一般译为“赛博物理系统”，这个概念着重强调计算机及网络系统，与物理世界中的传感器和促动器(Acturator)的互动与联合。汽车编队可以视为是一种赛博物理系统。

![Platoon as VCPS](https://imgs.codewoody.com/uploads/big/fa3e23f5f855d0c9644b452580ef1aad.png)

从VCPS的角度看待编队系统，可以发现汽车编队的运动性能(mobility)和网络性能(VANETs)是彼此耦合，互相影响的。

## 文章条目

1. [多编队系统](./multi-platoon.html)
2. [基于Platoon的车间通信(V2V)机制设计](./platoon-v2v.html)

## Reference
