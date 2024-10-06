---
title: "Ch8.局部敏感度"
date: 2024-10-03
---

[**全局敏感度**](./note-6.md): 对于全部数据集中, 任意两个临近数据集的最大敏感度.  
**局部数据度**: 仅考虑特定数据集的临近数据集的最大敏感度.
$$
LS(f,x) = \underset{x':d(x,x') \leq 1}{max}|f(x) - f(x')|
$$

> eg.  
> $s_{X_1X_2} = 0.1$  
> $s_{X_1X_3} = 0.2$  
> $s_{X_2X_3} = 0.4$  
> $s_{X_1X_4} = 0.3$  
> 对于以上的敏感度, 全局敏感度是 0.4, $X_1$的局部敏感度是 0.3  

## 8.1 均值问询的局部敏感度

均值问询与数据集的大小有关. (均值问询 = $\frac{求和问询}{计数问询}$)


数据集新增一条值为$u$的数据后, 敏感度:
$$
\begin{align}
|f(x') - f(x)| & = \Bigg \vert \frac{\sum_{i=1}^n x_i + u}{n + 1} - \frac{\sum_{i=1}^n x_i}{n} \Bigg \vert \leq \Bigg \vert \frac{\sum_{i=1}^n x_i + u}{n + 1} - \frac{\sum_{i=1}^n x_i}{n+1} \Bigg \vert \\
& = \Bigg \vert \frac{\sum_{i=1}^n x_i + u - \sum_{i=1}^n x_i}{n + 1} \Bigg \vert \\
& = \Bigg \vert \frac{u}{n + 1} \Bigg \vert
\end{align}
$$

> 局部敏感度会与实际数据集的大小有关, 但全局敏感度不可能与数据集本身有关.
> 提高局部敏感度最好的方法就是减小 $n$.

## 8.2 通过局部敏感度实现差分隐私?

$LS(f,x)$ 与数据集相关, 所以攻击者可以借此进行推断数据集的信息, $F(x) = f(x) + Lap(\frac{LS(f,x)}{\epsilon})$ 也就**无法满足差分隐私**.  

若知道数据集的局部敏感度, 就可以通过公式推断出无噪声时数据集的准确行数:
$$
|x| = \frac{b}{LS(f,x)} - 1
$$
> $b$ 是噪声尺度.  

### 8.2.1 "建议-测试-发布" 框架

差分隐私仅保证了数据的隐私, 但并未保证局部敏感度的安全. 所以局部敏感度会泄露数据集的信息.   
可以让局部敏感度也满足差分隐私来进一步保证数据集的隐私. 函数局部敏感度的全局敏感度是无上界的, **直接实现差分隐私是有难度的**. 但可以提交满足差分隐私的问询来间接得到函数的局部敏感度.  

**"建议-测试-发布" 框架** Propose-Test-Release

1. 建议 Propose  
    问询数据分析者函数建议的局部敏感度上界.
    > 数据分析者自行估计, 但分析者也需要执行多次问询才能猜出可用的边界.  

2. 测试 Test  
    检验所问询的数据集是否"远离"了局部敏感度高于建议边界的数据集.  

    定义 **k 距离局部敏感度**来判断数据集是否远离.
    数据集 $x$ 执行 $k$ 步得到 $f$ 的最大局部敏感度.
    $$
    A(f,x,k) = \underset{y:d(x,y) \leq k}{max} LS(f,y)
    $$

    多少步可以实现比给定上界 $b$ 更大的局部敏感度:
    $$
    D(f,x,b) = argmin_k A(f,x,k) > b
    $$

3. 发布 Release  
    如果测试通过, 该框架发布噪声结果, 并将噪声量校准到建议的边界.

4. "建议-测试-发布" 框架满足 ($\epsilon$,$\delta$)-差分隐私  

    1. 步骤
        1. 建议一个局部敏感度的目标边界 $b$.
        2. 如果 $D(f,x,b) + Lap(\frac{1}{\epsilon}) < \frac{log(\frac{2}{\delta})}{2 \epsilon}$, 返回 $\bot$ (失败/拒绝).
        3. 否则, 返回 $f(x) + Lap(\frac{b}{\epsilon})$.

    2. 均值问询的"建议-测试-发布"框架  
        均值问询的 LS 为 $|\frac{u}{n+1}|$.  
        如果以数据集 $x$ 为出发点执行 $k$ 步,  
        剩余的有效数据集大小变为 $n-k$, LS 变为 $|\frac{u}{(n-k)+1}|$.
        > 有效数据集: 未经修改的数据.
        
        ```python
        import numpy as np
        import pandas as pd

        # 计算局部敏感度
        def calculate_local_sensitivity(data, k, u):
            n = len(data)
            return u / (n - k + 1)  # 计算局部敏感度的公式

        # 测试阶段
        def test_sensitivity(local_sensitivity, epsilon, delta):
            # 计算噪声
            noise = np.random.laplace(loc=0, scale=1/epsilon)  # 使用 1/ε 的尺度
            threshold = np.log(2 / delta) / (2 * epsilon)  # 计算阈值 log(2/δ)/2ε
            sensitivity_test_value = local_sensitivity + noise  # D(f, x, b) + Lap(1/ε)
            
            print(f"局部敏感度为: {local_sensitivity}")
            print(f"噪声为: {noise}")
            print(f"阈值为: {threshold}")
            print(f"敏感度测试值为: {sensitivity_test_value}")
            
            return sensitivity_test_value < threshold  # 如果测试通过, 返回 True

        # 均值问询的 PTR 框架实现
        def ptr_avg(data, u, b, epsilon, delta, logging=False):

            # 计算局部敏感度
            k = 1  # 假设执行一步修改
            local_sensitivity = calculate_local_sensitivity(data, k, u)
            
            # 测试敏感度是否通过
            if test_sensitivity(local_sensitivity, epsilon, delta):
                if logging:
                    print("测试未通过, 拒绝发布")
                return None  # 不发布结果
            else:
                if logging:
                    print("测试通过, 发布结果")
                # 发布带噪声的查询结果
                noise = np.random.laplace(loc=0, scale=b/epsilon) 
                noisy_result = np.mean(data) + noise # f(x) + Lap(b/ε)
                return noisy_result

        # 示例数据
        adult_data = pd.DataFrame({'Age': [23, 45, 56, 34, 67, 89, 21, 43, 25, 38, 70]})  # 人口数据中的年龄列
        df = adult_data['Age']  # 使用年龄数据
        u = 100  # 设置年龄的上限为100
        epsilon = 1  # 设置隐私预算 ε
        delta = 1/(len(df) ** 2)  # 设置 δ
        b = 0.005  # 建议的敏感度

        # 调用 PTR 框架, 计算加噪后的平均值
        noisy_avg = ptr_avg(df, u, b, epsilon, delta, logging=True)
        true_avg = np.mean(df)

        if noisy_avg is not None:
            print(f"发布的加噪平均值为: {noisy_avg}")
            print(f"真实的平均值为: {true_avg}")
        else:
            print("没有发布任何结果")
        ```

    均值查询可以通过拆分为求和和计数查询, 这两者的全局敏感度已知且有界, 因此**加入的噪声较少, 结果更准确**. 相比之下, 使用 PTR 框架的局部敏感度计算噪声, **可能因数据集结构导致噪声较大或不稳定**. 因此全局敏感度在这种情况下效果会更好.  

## 8.3 平滑敏感度

**平滑敏感度** Smooth Sensitivity

1. **平滑敏感度框架满足 ($\epsilon$,$\delta$)-差分隐私步骤**  
    1. 设置 $\beta = \frac{\epsilon}{2log(\frac{2}{\delta})}$  
    2. 令 $S = max_{k=1,\dots,n} e^{-\beta k} A(f,x,k)$  
    3. 发布 $f(x) + Lap(\frac{2S}{\epsilon})$  

    利用**临近数据集与实际数据集距离的指数函数**来缩放局部敏感度,并取缩放程度最大的结果作为最终的局部敏感度. 

2. SS 框架与 PTR 框架相比
    - 优点
        SS 框架**不需要分析者建议敏感度边界**.
    - 缺点
        1. 平滑敏感度通常比 LS 大(至少为 2 倍), 增加的噪声量也会更大.  
        2. 计算平滑敏感度时需要找到所有可能的 $k$ 中最大的平滑敏感度, 计算开销极大.  
            > 多数情况只需要考虑少量 $k$ 值, 但是需要证明问询函数只需要考虑少量的 $k$值.
    
![](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202410061458801.png)

## 8.4 "采样-聚合" 框架

**"采样-聚合" 框架** Sample & Aggregate

**"采样-聚合"框架满足 $\epsilon$-差分隐私步骤**  
1. 将数据集 $X \in D$ 拆分为 $k$ 个不相交的数据块 $x_i,\dots,x_k$.  
2. 计算每个数据块的裁剪回复值: $a_i = max(l, min(u, f(x_i)))$.  
3. 计算平均回复值并增加噪声: $A = \Bigl(\frac{1}{k} \sum_{i=1}^k a_i \Bigr) + Lap(\frac{u-l}{k \epsilon})$

SA 框架无需使用 LS, 也不需要知道有关 $f$ 敏感度的信息. 仅需对数据进行拆分, 好的随机拆分结果可获得更准确的回复(随机拆分不是 SA 框的的必要条件).

每个数据块的裁剪回复值为 $u-l$, 调用 $k$ 次 $f$, 取 $k$ 次的回复平均值, 所以均值的全局敏感度为 $\frac{u-l}{k}$. 

常规的均值问询可拆分为求和问询和计数问询, **平均数计算的分母计数问询与数据集的大小有关**. 而 SA 框架中并未使用常规的拆分, **平均数计算的分母由分析者决定, 也就与数据集大小无关, 可独立确定并公开**.

数据块的数量 $k$ 越大, 噪声均值的敏感度越小, 噪声量越小.  
但 $k$ 越大, 数据块就越小, 数据块的回复值也就越可能远离正确回复值(与整个数据集的均值偏离较多).

SA 框架的准确性无法与全局敏感度方法相比, 但能选择合适的 $k$ 值, 两者的效果也可非常接近.

**SA 框架最大的优势是可以用于任何函数 $f$**. 所以只要函数本身表现良好, 即可使用 SA 框架满足差分隐私的输出, 获得较好的准确度. 另外对于分析者也仅需裁剪边界 $u$ 和 $l$, 并设置数据块数 $k$. 