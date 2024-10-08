---
title: "Ch7.近似差分隐私"
date: 2024-09-25
---

近似差分隐私 Approximate Differential Privacy / ($\epsilon , \delta$)-差分隐私:
$$
Pr[F(x) = S] \leq e^{\epsilon} Pr[F(x') = s] + \delta
$$

$\delta$ 是输出不满足近似差分隐私的**失败概率**. 即能够满足差分隐私的概率为 1-$\delta$.  
  > 因为是不满足差分隐私的情况, 所以 $\delta$ 的取值要很小, 一般要求 $\delta \leq \frac{1}{n^2}$ (n 为数据集总大小).  
  > 失败不会产生类似泄露整个数据集的严重后果.

## 7.1 近似差分隐私的性质

近似差分隐私也具有[串行组合性](./note-5#51-串行组合性), $\epsilon$ 和 $\delta$ 要分别相加.  
> $F_1(x)$ 满足 ($\epsilon_1$, $\delta_1$)-差分隐私.  
> $F_2(x)$ 满足 ($\epsilon_2$, $\delta_2$)-差分隐私.  
> $G(x) = (F_1(x), F_2(x))$ 满足 ($\epsilon_1 + \epsilon_2$, $\delta_1 + \delta_2$)-差分隐私.

近似差分隐私同样也具有[并行组合性](./note-5#52-并行组合性)和[后处理性](./note-5#53-后处理性).

## 7.2 高斯机制

高斯机制可以替代拉普拉斯机制. 使用高斯噪声替代拉普拉斯噪声.
> 高斯机制无法满足 $\epsilon$-差分隐私, 但可以满足 ($\epsilon , \delta$)-差分隐私.

使用高斯机制得到的满足 ($\epsilon , \delta$)-差分隐私
$$
F(x) = f(x) + \mathcal{N}(\sigma^2) \\
\sigma^2 = \frac{2s^2log(\frac{1.25}{\delta})}{\epsilon^2}
$$

$s$ 为 $f$ 的敏感度.  
$\mathcal{N}(\sigma^2)$ 表示均值为 0, 方差为 $\sigma^2$ 的高斯(正态)分布的采样结果.  

高斯机制与拉普拉斯机制的对比
![高斯机制与拉普拉斯机制的对比](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202409251425595.png)
> 上图使用相同的 $\epsilon$, 高斯机制的 $\delta = 10^{-5}$.  

高斯机制得到的输出相对较"平", 相较于拉普拉斯机制, 更偏离真实值.

## 7.3 向量值函数及其敏感度

之前提到的函数均为将数据集映射到单一实数**实值函数** $f:D \rightarrow \mathbb{R}$.  
拉普拉斯机制和高斯机制可扩展到**向量值函数** $f:D \rightarrow \mathbb{R}^k$.  

实值函数的敏感度的定义是两个个体的差.  
在向量值函数中, 敏感度就是两个向量的差所产生的新向量的标量长度.  
> ??? 向量的长度就是向量的维度, 也就是个体包含的属性.  

计算向量标量长度的方法: L1 范数 和 L2 范数.

### 7.3.1 L1 和 L2 范数

1. L1 范数 / 曼哈顿距离
    $$
    \lVert V \lVert _1 = \sum_{i=1}^k|V_i|
    $$
    > 向量各个元素的和.

2. L2 范数 / 欧式距离
    $$
    \lVert V \lVert _2 = \sqrt{\sum_{i=1}^kV_i^2}
    $$
    > 向量各个元素平方和再求平方根.

> L2 范数总是 $\leq$ L1 范数

### 7.3.2 L1 和 L2 敏感度

1. L1 敏感度
    $$
    GS(f) = \underset{d(x,x') \leq 1}{max} \lVert f(x) - f(x') \lVert_1
    $$
    若 $f(x) - f(x')$ 计算的到长度为 $k$ 的敏感度向量, 每个元素的敏感度为 1. 通过 L1 范数计算, $f$ 的敏感度即为 $k$.


2. L2 敏感度
    $$
    GS_2(f) = \underset{d(x,x') \leq 1}{max} \lVert f(x) - f(x') \lVert_2
    $$
    若 $f(x) - f(x')$ 计算的到长度为 $k$ 的敏感度向量, 每个元素的敏感度为 1. 通过 L2 范数计算, $f$ 的敏感度即为 $\sqrt{k}$.

### 7.3.3 选择 L1 还是 L2

向量值拉普拉斯机制**需要使用 L1 敏感度**.  
向量高斯机制**既可使用 L1 敏感度, 也可以使用 L2 敏感度**. 
  > 高斯机制的重要优势!

## 7.4 灾难机制

灾难机制 Catastrophe Mechanism
> 当 [0,1]中随机采样的数小于 差分隐私失败的概率 $\delta$ 时, 返回真实值. 反之, 则输出带有噪声的结果.

```python
import numpy as np

def catastrophe(x, sensitivity, epsilon, delta):
    r = np.random.uniform(0, 1)
    print("0,1中随机采样:",r)
    if r < delta: 
        print(f"{r} < {delta}")
        return x
    else: 
        print(f"{r} > {delta}")
        return x + np.random.laplace(0, sensitivity / epsilon)

x = 20
sensitity = 0.01
epsilon = 1
delta = 0.001
print("真实值:",x)
print("灾难机制输出:",catastrophe(x,sensitity,epsilon,delta))
```
---

⬇️ TODO ⬇️   
> 还没搞懂...  
> ## 7.5 高级组合性  
> k-折叠适应性组合 k-fold Adaptive Composition  
> ## 7.6 近似差分隐私的高级组合性  