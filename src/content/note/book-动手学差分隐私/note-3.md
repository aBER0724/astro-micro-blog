---
title: "Ch3.k-匿名性"
date: 2024-09-21
---

- k-匿名性
  >把数据集按照数据集各个列中的特定子集分组, 即按照 准标识 (Quasi-Identifier) 分组, 使每个分组中的个体都拥有相同的准标识. 如果数据集中的每个个体所属分组的大小都至少为 k, 则我们称此数据集满足 k-匿名性.
  > ![image](https://gcore.jsdelivr.net/gh/aBER0724/ob_picture/Img/202409212124485.png)
- ??? 将数据集按所有标识 (属性) 进行分组 (筛选), 相当于使用辅助数据 (邮编, 生日) 进行筛选的过程. 如果使用每个属性进行分组后, 每组的数量相近, 则无法通过属性筛选, 而获得额外的信息. 满足 k-匿名性, 则是无论用哪个属性进行分组, 都无法获得额外的信息.
	>举一个例子 (不清楚是不是这个意思)
	>数据集中有 12 条记录, 每条记录包括: 国籍, 邮编, 学历.
	>国籍分组: 4-🇨🇳, 4-🇯🇵, 4-🇺🇸
	>邮编分组: 4-1111, 4-2222, 4-3333
	>学历分组: 4-硕士, 4-本科, 4-高中
	>无论使用哪个属性进行分组, 分布都相同(近似?), 也就无法通过辅助数据进行重标识了. 
- 每个数据集先天就满足 k=1 的匿名性了, 即每个个体为一组.

## 3.1 验证 k-匿名性

```python
import micropip 
await micropip.install('pandas')
import pandas as pd

def isKAnonymized(df, k): 
	for index, row in df.iterrows():
		query = ' & '.join([f'{col} == {row[col]}' for col in df.columns]) 
		rows = df.query(query) 
		if rows.shape[0] < k: 
			return False 
	return True

# 数据集
df = pd.DataFrame({
    'age': [42,52,36,24,73],
    'preTestScore': [4,24,31,2,3],
    'postTestScore': [25,94,57,62,70]
})

print('k=1:', isKAnonymized(df, 1))
print('k=2:', isKAnonymized(df, 2))
```

## 3.2 泛化数据以满足 k-匿名性

- 泛化 Generalization
	将数据修改为不那么特殊的数据, 使其更可能与数据集中其他个体的数据相匹配. 
	指修改数据集中的数据, 将特定的取值替换为更一般的 取值, 使数据更容易形成分组
	>年龄的个位四舍五入进十位
	>邮编的最后一位替换为 0
	>??? 锯齿状的曲线 => 平滑的取钱

```python
import micropip 
await micropip.install('pandas') 
import pandas as pd

def generalize(df, depths): 
	return df.apply(lambda x: x.apply(lambda y: int(int(y/(10**depths[x.name]))*(10**depths[x.name]))))

# 数据集 
df = pd.DataFrame({ 
	   'age': [42,52,36,24,73], 
	   'preTestScore': [4,24,31,2,3],
	   'postTestScore': [25,94,57,62,70] 
	})

depths = { 
		  'age': 1, 
		  'preTestScore': 1, 
		  'postTestScore': 1 
		  }  
df2 = generalize(df, depths) 
print(df2)

```
>对数据进行两层泛化 (depths = 2), 所有数据将会被删除 (全为 0).

挑战: 通常需要从数据中移除相当多的信息, 才能使数据集满足合理 k 取值下的 k-匿名性.

## 3.3 引入更多的数据可以减小泛化的影响吗?

数据集汇总包含 异常值 (Outlier), 与其他数据差异很大的个体. 即使经过泛化, 减小了差异的大小, 但是仍无法将这些异常值分到某一组中. 因此, 引入更多数据并不一定会降低满足 k-匿名性的难度.

挑战: 实现满足 k-匿名性的最优泛化方法是一个 NP-困难问题.

## 3.4 移除异常值

对于含有异常值的数据集进行泛化, 会对数据的可用性有较大的损害. 所以可以通过将异常值排除在外, 以筛选出正常范围内的数据. 

```python
# upper 为设置上限
# 可使用非常大值来绕开裁剪
dfp = df.clip(upper=np.array([60, 10000000000000]), axis='columns')
```