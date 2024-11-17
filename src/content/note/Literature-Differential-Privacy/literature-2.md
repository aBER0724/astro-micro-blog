---
title: "ULDP-FL: Federated Learning with Across-Silo User-Level Differential Privacy"
date: 2024-10-29
tags:
  - Research/FederatedLearning
  - Research/DifferentialPrivacy/User-Level
  - Project/ULDP-FL/Literature-Note
---
## Concept/Idea

### Cross-silo FL

FL 变体, 在训练轮次中仅有相对较少的参与者.

#### Scenario

![202410191621045.png|573](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410191621045.png)

- A Central aggregation server
- Silos set *S* (2 ~ 100) 所有 silo 会参与所有训练轮次
- Users set *U*

### User-Level DP

![202410191621045.png|573](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410191621045.png)

单个用户的数据可能会分布在多个机构 (silos).
所以这里关注的 User-Level 是指**用户分布在不同机构的所有数据**, 而不是等价于 Client-Level 的**单个机构单个用户的数据** . 较多研究以后者作为定义进行 FL 研究.

**单个用户的所有记录**作为一个隐私单位, 这比标准的差分隐私定义更严格.

### Group DP

![202410191854369.png|533](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410191854369.png)

group-privacy 将**任意 k 条记录**作为一个隐私单位.

group-privacy 将隐私预算扩展到了多条记录. 

#### Convert DP to GDP
Rényi DP / DP $\rightarrow$ group Rényi DP / DP $\rightarrow$ Group DP
- DP $\rightarrow$ Group DP
	![CleanShot 2024-10-19 at 19.26.52@2x.png|523](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410191927017.png)
	![202410191855162.png|523](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410191855162.png)

- Rényi DP $\rightarrow$ Group DP
	![CleanShot 2024-10-19 at 18.56.09@2x.png|521](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410191856183.png)
	函数满足 $(\epsilon,\delta)-DP$, 也就满足 $(k,k\epsilon,k \ exp^{(k-1) \epsilon} \ \delta)-GDP$.

两种转换的隐私预算对比
![image.png|528](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410191916000.png)


#### Baseline solution

限制用户贡献 (记录数量), 再使用 group-privacy.

Lemma 5,6 将任意 DP 算法都可转化成 Group DP. 但这种转化会使得隐私边界非线性退化, 需要在分布式环境中对用户记录的最大数量 (组大小) 进行适当限制. **所以不如直接实现 ULDP**.

## Main Work
### ULDP-FL Framework
#### Trust Model & Assumptions
1. Participations
	- 2+ silos
	- An aggregation server (semi-honest / honest-but-curious)
2. Assumptions
	1. 安全聚合
		server 只能在聚合完成后访问模型. 也就是 server 不会拿到具体的数据信息.
	2. SSL/TLS 加密传输
		第三方即使监听通信, 也无法获得任何信息.
	3. 相互独立
		Silos 间不互通, Silos 间相互独立.
	4. Silos 间共享通用的用户 ID
	5.  Server 和 Silos 都已知 user 和 silo 的数量
	6. user(device)-level sub-sampling DP 放大时, 只有 Server 可以知道每一轮的 sub-sampling 结果

> 以上假设不影响最终模型对外部用户提供的隐私保障

#### (Cross-silo) User-Level DP  Re-Definition

![CleanShot 2024-10-19 at 21.47.32@2x.png|492](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410192147064.png)

ULDP 和 RLDP 最基本的不同在于**临近数据集的定义**.
User-Level 邻近数据库本质上定义了 User-Level 敏感度.
输入数据集 D 就代表综合各个 Silos 中的数据项集合.

##### GDP

GDP 最关键的一个合适的 k 值. (未有缺定的解决方案)
1. k 过大
	需要加入过多噪声来达到所需隐私等级.
2. k 过小
	会排除超过 k 条数据的用户, 模型训练结果会有偏差, 实用性也会下降.

##### ULDP

ULDP 不需要决定 k 值. 但需要设计一个特别的算法.

#### Baseline methods: ULDP-NAIVE/GROUP

![image.png|397](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410192210156.png)

##### ULDP-NAIVE

![CleanShot 2024-10-19 at 22.12.49@2x.png|412](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410192212140.png)

![CleanShot 2024-10-19 at 22.35.41@2x.png|429](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410192235772.png)

一种与 DP-FedAVG 相似的直接加入大量噪声的方法.
ULDP-NAIVE 中, 每个用户都对所有 Silos 都可能有贡献值. 在添加高斯噪声时, 方差乘上了 $|S|$, 即 $\sigma^2 C^2 |S|$.

> 与 DP-FedAVG 相比, ULDP-NAIVE 的 Silos 数量少, 所以方差会较大. 
> 虽满足 ULDP, 但效用会有所牺牲.

##### ULDP-GROUP-*k*

![CleanShot 2024-10-19 at 22.13.01@2x.png|430](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410192213546.png)

![CleanShot 2024-10-25 at 00.33.35@2x.png|430](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410250033761.png)

![CleanShot 2024-10-22 at 15.25.35@2x.png|430](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410221525359.png)

ULDP-GROUP-*k* 采用 Group DP, 限制了用户的记录数量为 k, 满足 ($k, \epsilon, \delta$)-GDP, 也满足 ($\epsilon, \delta$)-ULDP.

1. 隐私边界由于 DP 到 GDP 的转化而退化
2. 确定合适的 *k* 值, 确定标志 **B**
3. 使用 GDP 来保证 ULDP 需要从训练数据集中移除记录, 可能会引入偏差并导致效用下降

##### ULDP-AVG/SGD
不使用 group-privacy 直接实现 ULDP.
ULDP-AVG & ULDP-SGD $\sim$ DP-FedAVG & DP-FedSVG
FedAVG: 通信成本, privacy-utility 平衡更好.
FedSVG: 高速网络表现更好.

![CleanShot 2024-10-22 at 15.56.27@2x.png|430](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410221556782.png)

ULDP-AVG 比 ULDP-SGD 多了一步多轮计算随机梯度值. 所以 ULDP-AVG 相比于 DP-FedAVG 会在用户本地训练上会有更多计算开销.

![CleanShot 2024-10-22 at 16.30.39@2x.png|430](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410221631859.png)

使用 User-Level sub-sample 进行隐私放大, 将用户的权重 $\boldsymbol{w}_{s,u}$ 设置为 0 则未被采样.

##### Comparison

**ULDP-GROUP** VS **ULDP-AVG**

ULDP-AVG 
- 没有使用 group-privacy, 避免转换到 GDP 导致的隐私边界扩大.
- 需要确定 *k* 和去除一些记录.
- 可用于每个用户拥有任意数量记录.

**ULDP-NAIVE** VS **ULDP-AVG**

![image.png|430](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410221640801.png)

- ULDP-NAIVE 每个用户都可以贡献整个模型增量.
- ULDP-AVG  每个用户的贡献被限制在模型 delta 的一小部分, 即整个模型增量的 $1/|U|$，降低了用户级别的敏感性. 较大的 $|U|$ 会导致较低的高斯噪声方差, 也会同时引入新的偏差.

**ULDP-AVG** VS **FedAVG**

ULDP-AVG 引入了以下两项, 阻碍了收敛. 
1. 额外的 DP 噪声
	- 在 FedAVG 中也存在, 但随着 user 数量增加而减小.
2. user-silo 的粒度导致的偏差
	- 可以通过权重策略来最小化这个偏差.

### Enhanced Weighting and Private Weighting Protocol

用于解决收敛问题中存在的偏差.

设置权重(Algorithm 3 Line 16)

$w^{opt}_{s,u} := \frac{n_{s,u}}{\sum_{s \in |S|} n_{s,u}}$

- $n_{{s,u}}$ : number of records for user *u* in silo *s*.

#### The weighting protocol

中央服务器汇聚合每个 silo 中所有用户的记录的 histogram. 服务器再计算出每个 silo 适当的权重后, 返回给对应的 silo.

问题: 
1. histogram 直接与服务器共享
2. 权重广播, 会对所有 silo 中的所有用户 histogram 构成风险
##### Crypto

协议使用 **multiplicative blinding** 来隐藏用户的直方图, 使服务器无法获得. 同时允许服务器计算盲化 histogram 的逆，来计算权重.
服务器使用 **Paillier encryption** 来隐藏盲化直方图的逆, 避免 silo 知道盲化掩码.
这样可以使得服务器和 silo 能够使用加法同态性质计算私有加权和聚合.


##### Protocol
![CleanShot 2024-10-22 at 21.31.13@2x.png|430](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410222131808.png)

1. **Setup Phase**
	1. Generate Paillier encryption key-pair
	2. Exchange by Diffie-Hellman
	3. compute blinded inverses of user histogram 
2. **Weight Phase**
	1. server prepare encrypted weights
	2. silos compute User-Level weighted model deltas (in encrypted)
	3. server recover aggregated value

![CleanShot 2024-10-22 at 21.17.51@2x.png|430](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410222117348.png)

![[Note-Literature-ULDP-FL 2024-10-23 18.26.43.excalidraw|634]]

## Experiment

### Datasets
- Creditcard
- MNIST
- HeartDisease
- TcgaBrca

### Methods
#### Trade-offs Methods
- ULDP-AVG
  > $w_{s,u} = \frac{1}{|S|}$
- ULDP-AVG-*w*
  > $w^{opt}_{s,u}$
- ULDP-SGD
  > $w_{s,u} = \frac{1}{|S|}$
#### Baseline Methods
- ULDP-NAIVE
- ULDP-GROUP-*k*
	- ULDP-GROUP-*max*
	- ULDP-GROUP-*median*

### Allocation
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

### Result

- 在所有数据集中, ULDP-AVG 在效用方面始终具有竞争力, ULDP-AVG-*w* 的收敛速度更快, 而 ULDP-SGD 的收敛速度较慢. 
- ULDP-NAIVE 实现了较低的隐私边界, 但其效用远低于其他方法.
- ULDP-GROUP-*k* 在 n 较小时效用很高, 但隐私边界始终较大.
	- 取决于 k 和 本地训练数据集大小

#### Effect of non-IID data
- Default 和 ULDP-GROUP 使用按 silo 进行训练, 受影响较小
- ULDP-AVG 收敛速度会变慢, 但用户增多, 问题会减轻
	- 使用现有方法, 将 Client-Level 的聚类转换为 User-Level 的聚类

#### Effectiveness of enhanced weighting strategy
- ULDP-AVG 分配相同的权重
- 而 ULDP-AVG-*w* 分配优化的权重 $w^{opt}_{s,u}$

#### Effect of user-level sub-sampling
- 隐私预算和准确率是相平衡的
	- 采样更多, 消耗的隐私预算越多, 但可以获得更高的准确率
- MNIST 和 Creditcard 结果相比, MNIST 在不同的采样率下, 准确率变化不大
	- 在大量用户的场景下, sub-sampling 的效果更显著, 也更重要
		- Creditcard 1000 users
		- MNIST 10000 users

#### Overhead of private weighting protocol
- 本地训练的执行时间占主导地位，并且随着用户数量的增加而增加。
- 协议中耗时较长的部分
	- 是密钥交换
	- Silos 的本地训练
	- 服务器上的聚合
