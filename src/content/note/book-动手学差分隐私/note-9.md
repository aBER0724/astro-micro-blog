---
title: "Ch9.差分隐私变体"
date: 2024-10-07
---

提出差分隐私变体的目的是为了更加紧致隐私消耗量.
> 之前所提到的隐私消耗量的计算方法, 得到的都是较为宽松的上界, 而实际的消耗远低于计算出的上界.  

## 9.1 最大散度和瑞丽散度

1. **最大散度** Max Divergence

    在统计学中, 散度是用来**度量两种概率分布差异**的方法.  
    最大散度是 KL 散度(Kullback-Leibler Divergence)的**最坏情况**.  
    两个概率分布 $Y$ 和 $Z$ 的最大散度定义为:  
    $$
    D_{\infty}(Y \parallel Z) = \underset{S \subseteq Supp(Y)}{max} \Biggl[ log \frac{Pr[Y \in S]}{Pr[Z \in S]} \Biggr]
    $$
    若证明:  
    $$
    D_{\infty}(F(x) \parallel F(x')) \leq \epsilon
    $$
    则 $F$ 满足 $\epsilon$-差分隐私.  

2. **瑞丽散度** Rényi Divergence  
    概率分布 $P$ 和 $Q$ 的 $\alpha$ 阶瑞丽散度定义为:  
    $$
    D_{\alpha}(P \parallel Q) = \frac{1}{\alpha - 1} log E_{x ~ Q} \Bigl( \frac{P(x)}{Q(x)} \Bigr)^{\alpha}
    $$
    > $P(x)$ 和 $Q(x)$ 分别为 $P$ 和 $Q$ 在 $x$ 处的概率密度.  

## 9.2 瑞丽差分隐私

**瑞丽差分隐私** Rényi Differential Privacy  
如果对与所有的临近数据集 $x$ 和 $x'$, 随机机制 $F$ 满足:  
$$
D_{\alpha}(F(x) \parallel F(x')) \leq \bar \epsilon
$$
则机制 $F$ 满足 ($\alpha$, $\bar \epsilon$)-RDP.  
> $\bar \epsilon$ 用于区别 $\epsilon$-差分隐私 和 ($\epsilon$,$\delta$)-差分隐私的 $\epsilon$.  

如果机制 $F$ 满足 ($\alpha$, $\bar \epsilon$)-RDP, 那对于任意给定的 $\delta > 0$, $F$ 满足 ($\epsilon$,$\delta$)-差分隐私.  
其中 $\epsilon = \bar \epsilon + \frac{log(\frac{1}{\delta})}{\alpha - 1}$, $\delta$ 应选择一个有意义的值, 如 $\delta \leq \frac{1}{n^2}$.  

实现瑞丽差分隐私的基本机制是高斯机制.  
对于一个 [$L2$ 敏感度](./note-7.md#732-l1-和-l2-敏感度)为 $\Delta f$ 的函数 $f$: $\mathcal{D} \rightarrow \mathbb{R}^k$. 
构造 ($\alpha$, $\bar \epsilon$)-瑞丽差分隐私机制:  
$$
F(x) = f(x) + \mathcal{N}(\sigma^2) \ where \  \sigma^2 = \frac{\Delta f^2 \alpha}{2 \bar \epsilon}
$$

```python
def gaussian_mech_RDP_vec(vec, sensitivity, alpha, epsilon_bar): 
    sigma = np.sqrt((sensitivity**2 * alpha) / (2 * epsilon_bar)) 
    return [v + np.random.normal(loc=0, scale=sigma) for v in vec]
```