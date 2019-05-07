---
title: IEEE802.11 DCF中Basic Access和RTS/CTS机制的理论饱和吞吐率性能差异分析
date: 2019-05-01 23:49:40
mathjax: true
---
在[Wireless Access in Vehicular Environments (WAVE)](./)文章的3.4章节我们梳理了对IEEE802.11 DCF机制的性能推导。通过推导的结论我们发现使用了RTS/CTS机制之后，相比于Basic Access手段，饱和吞吐率的性能有了大幅度的改进，如下图：

![饱和吞吐率与节点数量的关系](https://gitlab.vlionthu.com/mixed-autonomy/advanced-tdma-ns3-simulation/uploads/419e1e0df6b65ff0cebbc7b3f7f1b9a1/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7_2019-04-30_22.59.10.png)

注意到在[3.4.4](/knowledge-base/academic/its/wave/#%E5%90%9E%E5%90%90%E7%8E%87%E8%AE%A1%E7%AE%97)中给出的一般形式的饱和吞吐率对于Basic Access以及RTS/CTS机制是一样。两种机制的主要区别在于$T_c$和$T_s$的区别，如下图所示：

![$T_c$和$T_s$](https://imgs.codewoody.com/uploads/big/48c01d167935b42f5daa3cbb1d0b6145.png)

考虑到ACK, RTS, CTS这些包的体积非常小，因此Basic Access和RTS/CTS机制的区别在于$T_s$和$T_c$的相对大小不同。在Basic Access中两个值非常接近，而在RTS/CTS中两个值的差别非常大。

$$
S=\frac{P_sP_{tr}E[P]}{(1-P_{tr})\sigma+P_{tr}P_sT_s+P_{tr}(1-P_s)T_c}
$$

上面的式子中，$P_{tr}P_s=n\tau (1-\tau)^{n-1}$随着$n$增加而递减。$P_{tr}$随着$n$增加而趋向于1，则分母项中，随着$n$升高，前两项都趋向于0，后一个趋向于$T_c$。可见$T_c$的值决定了最后下降的速度。

分母的形式其实很类似于两级[lerp function](https://learn.unity.com/tutorial/linear-interpolation?projectId=5c8920b4edbc2a113b6bc26a)，即从形状上来看，分母的取值从$\sigma$出发，逐渐靠近$T_s$，最终收拢到$T_c$。下图有助于理解：

![](https://imgs.codewoody.com/uploads/big/5f61dfa0ca56be6f035a7800a5be35d2.gif)

{% note info %}
上图其实是bezier曲线的原理示意图，出处是[贝塞尔曲线原理（简单阐述）](https://www.cnblogs.com/hnfxs/p/3148483.html)
{% endnote %}
