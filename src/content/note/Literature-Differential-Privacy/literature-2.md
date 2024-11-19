---
title: "ULDP-FL: Federated Learning with Across-Silo User-Level Differential Privacy"
date: 2024-10-29
tags:
  - Research/FederatedLearning
  - Research/DifferentialPrivacy/User-Level
  - Project/ULDP-FL/Literature-Note
---
## Scenario

保护用户分布在不同的 Silo 中的记录.

## Difference

1. 重新定义 ***User-Level***
	- 区分 ***Record-Level & User-Level***, ***User-Level Privacy & Group Privacy***

	![User-Level Cross-silo FL](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410191621045.png)


	| Record-Level DP            | User-Level DP                        | Group DP                    |
	| :--------------------------: | :------------------------------------: | :---------------------------: |
	| 1 record as a privacy unit | User's all records as a privacy unit | k records as a privacy unit |
	|相邻数据集最多 1 条记录不同|相邻数据集最多 1 个用户不同|相邻数据集最多 k 条记录不同|

    > 之前 ULDP 在 FL 上也有研究, 但研究仅将用户数据归属于单个设备. 
    > 相当于是 Client-Level DP.
    
1. 现有 Cross-Silo FL 聚焦于 Record-Level DP, 还没有研究过 User-Level DP.
1. 现有使用 Paillier 密码的进行加权求和的方法, 没有考虑到拥有 Paillier 私钥的一方可以得到原始数据. 本研究使用 Paillier, 安全聚合和乘法盲化进行了优化. 
## Baseline Method

转化为 GDP 实现 ULDP.

### ULDP-NAIVE

与 DP-FedAVG 类似, 添加 $\sigma^2C^2$ 的高斯噪声, 但因为用户会存在于各个 Silo 中, 所以单个用户会对所有 Silo 的模型都有贡献, 因此跨 Silo 的敏感度为 $C|S|$, 因此需要将噪声放大为 $\sigma^2 C^2 |S|$，使来自 $|S|$ 个 Silo 的聚合结果满足所需的 DP.

### ULDP-GROUP-k

先使用 flag **B** 限制每个用户在所有 Silo 中的记录在 k 条. 再使用 DP-SGD 将 Record-Level DP 转化为 GDP.
flag **B** 中用 $b^S_{u,i} = 1$ 表示用于训练.

> ULDP-NAIVE 和 ULDP-GROUP 在服务器处的全局学习率为 $\frac{\eta_{g}}{|S|}$. 

![image.png](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410221640801.png)

## Advance Method

直接实现 ULDP.

### ULDP-AVG/SGD

ULDP-AVG 比 ULDP-SGD 多了在本地进行多轮计算随机梯度值.

ULDP-AVG/SGD 在服务器处的全局学习率为 $\frac{\eta_{g}}{|U||S|}$. 默认权重为 $w_{s,u} = \frac{1}{|S|}$.
添加的高斯噪声大小为 $\frac{\sigma^2C^2}{|S|}$ . 将用户的贡献对模型的贡献压缩在一起, 在所有 Silo 中添加的噪声和为 $\sigma^2C^2$.

#### ULDP-AVG with user-level sub-sampling

若使用 ULDP-AVG with user-level sub-sampling, 则在服务器端对用户按概率为 q 进行泊松采样.

在服务器处的全局学习率为 $\frac{\eta_{g}}{q|U||S|}$.

- 采样更多, 消耗的隐私预算越多, 但可以获得更高的准确率.
- 在大量用户的场景下, sub-sampling 的效果更显著, 也更重要.
	- Creditcard 1000 users
	- MNIST 10000 users

## Private Weight Protocol 

ULDP-AVG-*w* 优化权重为 $w^{opt}_{s,u} := \frac{n_{s,u}}{\sum_{s \in |S|} n_{s,u}}$.

协议使用 **multiplicative blinding** 来隐藏用户的直方图. 
这样服务器可计算盲化 histogram 的逆后，来计算权重, 但仍不知用户真实的 histogram.
服务器再使用 **Paillier** 加密盲化直方图的逆, silo 知道盲化掩码可以对应得到真实值.

![Note-Literature-ULDP-FL Protocol.excalidraw](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202411192240050.png)

## Experiment
### Datasets

- Creditcard
- MNIST
- HeartDisease
- TcgaBrca

### Dataset Allocation
#### Creditcard & MNIST

1. *uniform*
> user-record, silo-record 等概率
2. *zipf*
> record-user: $zipf_{1}$
> record-silos: $zipf_{2}$

#### HeartDisease & TcgaBrca

1. *uniform*
> user-record 等概率, 不会将 record 分配到 silo
2. *zipf*
> 用户的记录数量首先按照 Zipf 分布生成, 80% records 分配到一个 silo,  20% records 等概率分配到其他 silos.