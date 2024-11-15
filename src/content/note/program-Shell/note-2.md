---
title: "Shell Basic 02"
date: 2024-04-25
---

## Shell 变量
>[!caution] 
>注意声明变量时，等号左右不能有**空格**！
>```shell
> name='aBER'
>```

### 变量命名
1. 字母(大小写敏感)，数字(不能作为开头)，下划线(不能用其他特殊符号)
2. 大写字母表示常量，例如 `PI=3.14`
### 变量使用
1. `${variable_name}` 即可使用变量(`{}`可省略，仅为标记边界)
2. `readonly variable_name` 设置只读变量
3. `unset variable_name` 删除变量
### 变量类型
1. 字符串变量
2. 整数变量
1. 数组变量
2. 环境变量