---
title: IEEE802.11 DCF中Basic Access和RTS/CTS机制的理论饱和吞吐率性能差异分析
date: 2019-05-01 23:49:40
mathjax: true
---

## 性能差异分析

在[Wireless Access in Vehicular Environments (WAVE)](./)文章的3.4章节我们梳理了对IEEE802.11 DCF机制的性能推导。通过推导的结论我们发现使用了RTS/CTS机制之后，相比于Basic Access手段，饱和吞吐率的性能有了大幅度的改进，如下图：

![饱和吞吐率与节点数量的关系](https://gitlab.vlionthu.com/mixed-autonomy/advanced-tdma-ns3-simulation/uploads/419e1e0df6b65ff0cebbc7b3f7f1b9a1/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7_2019-04-30_22.59.10.png)

注意到在[3.4.4](/knowledge-base/academic/its/wave/#%E5%90%9E%E5%90%90%E7%8E%87%E8%AE%A1%E7%AE%97)中给出的一般形式的饱和吞吐率对于Basic Access以及RTS/CTS机制是一样。两种机制的主要区别在于$T_c$和$T_s$的区别，如下图所示：

![$T_c$和$T_s$](https://imgs.codewoody.com/uploads/big/48c01d167935b42f5daa3cbb1d0b6145.png)

考虑到ACK, RTS, CTS这些包的体积非常小，因此Basic Access和RTS/CTS机制的区别在于$T_s$和$T_c$的相对大小不同。在Basic Access中两个值非常接近，而在RTS/CTS中两个值的差别非常大。

\begin{equation}
\label{1}
S=\frac{P_sP_{tr}E[P]}{(1-P_{tr})\sigma+P_{tr}P_sT_s+P_{tr}(1-P_s)T_c}
\end{equation}

上面的式子中，$P_{tr}P_s=n\tau (1-\tau)^{n-1}$随着$n$增加而递减。$P_{tr}$随着$n$增加而趋向于1，则分母项中，随着$n$升高，前两项都趋向于0，后一个趋向于$T_c$。可见$T_c$的值决定了最后下降的速度。

分母的形式其实很类似于两级[lerp function](https://learn.unity.com/tutorial/linear-interpolation?projectId=5c8920b4edbc2a113b6bc26a)，即从形状上来看，分母的取值从$\sigma$出发，逐渐靠近$T_s$，最终收拢到$T_c$。下图有助于理解：

![](https://imgs.codewoody.com/uploads/big/5f61dfa0ca56be6f035a7800a5be35d2.gif)

{% note info %}
上图其实是bezier曲线的原理示意图，出处是[贝塞尔曲线原理（简单阐述）](https://www.cnblogs.com/hnfxs/p/3148483.html)
{% endnote %}

## 混合性能

这里说的混合性能是指同时存在Basic Access和RTS/CTS的情况。具体的，如果包的大小超过了阈值$\overline{P}$，那么采用RTS/CTS发送，否则应用Basic Access规则。

记$F(\cdot)$为包大小的累积概率分布，那么$F(\overline{P})$就为Basic Access发送的概率，$1-F(\overline{P})$为使用RTS/CTS发送的概率。记:

\begin{equation}
O_{\mathrm{rts}}=T_{s}^{\mathrm{rts}}-T_{s}^{\mathrm{bas}}=\mathrm{RTS}+\mathrm{SIFS}+\delta+\mathrm{CTS}+\mathrm{SIFS}+\delta
\end{equation}

为RTS/CTS需要付出的额外传输开销。那么很容易有:

\begin{equation}
\begin{aligned} T_{s} &=T_{s}(\overline{P})=T_{s}^{\mathrm{bas}} F(\overline{P})+T_{s}^{\mathrm{rts}}(1-F(\overline{P})) \\ &=T_{s}^{\mathrm{bas}}+O_{\mathrm{rts}}(1-F(\overline{P})) \end{aligned}
\end{equation}

为了进一步推导，我们做一定的简化，忽略掉超过两个包发生碰撞的概率。那么，碰撞的可能情形就被约束到下面的三个类别：

1. 两个RTS帧碰撞，概率(条件概率)为$(1-F(\overline{P}))^2$;
2. 两个普通帧（Basic Access）的碰撞，概率为$F(\overline{P})^2$；
3. 普通帧和RTS之间的碰撞

这涉及到三种不同的$T_c$：$T^{rts/rts}$, $T^{bas/bas}$, $T_c^{bas/rts}$。基于上面总结的条件概率我们可以计算平均碰撞时间如下：

\begin{equation}
\begin{aligned} T_{c}(\overline{P})=&(1-F(\overline{P}))^{2} T_{c}^{\mathrm{rts} / \mathrm{rts}} \\ &+2 F(\overline{P})(1-F(\overline{P})) T_{c}^{\mathrm{rts} / \mathrm{bas}}+F^{2}(\overline{P}) T_{c}^{\mathrm{bas} / \mathrm{bas}} \end{aligned}
\end{equation}

记$O_{h}=\left(T_{c}^{\mathrm{bas}}-P-T_{c}^{\mathrm{rts}}\right)=(H-\mathrm{RTS})$为数据帧的Header相比于RTS的额外长度。$\alpha=H+\mathrm{DIFS}+\delta$。在[WAVE: $T_s$和$T_c$的确定](/knowledge-base/academic/its/wave/wave.html#t_s%E5%92%8Ct_c%E7%9A%84%E7%A1%AE%E5%AE%9A)中，我们已经计算得到了：

\begin{equation}
T_{c}^{\mathrm{rts} / \mathrm{rts}}=\mathrm{RTS}+\mathrm{DIFS}+\delta=\alpha-O_{h}
\end{equation}

为了计算RTS帧和数据帧的冲突时间，考虑到RTS的大小总是小于数据帧的大小，那么上面我们定义的$O_h$始终为正值。故这个平均冲突时间是由Basic Acces的数据帧的平均长度决定，从而有：

\begin{equation}
T_{c}^{\mathrm{rts} / \mathrm{bas}}=\alpha+\int_{0}^{\overline{P}}\left(1-\frac{F(x)}{F(\overline{P})}\right) d x
\end{equation}

此处$F(x) / F(\overline{P}), x \in(0, \overline{P})$为Basic Access发送时的包大小的条件概率。最后，对于Basic Access的数据包之间的冲突问题：

\begin{equation}
T_{c}^{\mathrm{bas} / \mathrm{bas}}=\alpha+\int_{0}^{\overline{P}}\left(1-\frac{F^{2}(x)}{F^{2}(\overline{P})}\right) d x
\end{equation}

最终我们可以得到整体的平均冲突时间为：

\begin{equation}
\begin{aligned} T_{c}(\overline{P})=& \alpha-(1-F(\overline{P}))^{2} O_{h} \\ &+2 F(\overline{P})(1-F(\overline{P})) \int_{0}^{\overline{P}}\left(1-\frac{F(x)}{F(P)}\right) d x \\ &+F^{2}(\overline{P}) \int_{0}^{\overline{P}}\left(1-\frac{F^{2}(x)}{F^{2}(P)}\right) d x \end{aligned}
\end{equation}
