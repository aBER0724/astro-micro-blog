---
title: "Computer Composition Review Ch6 总线系统"
date: 2024-06-21
---

## 6.1.1 总线的基本概念
- 总线
	- 多个系统功能部件之间进行数据传送的公共通路
	- 分类
		- 内部总线
			- CPU 内连接各寄存器及运算部件之间的总线
		- 系统总线
			- CPU 与计算机系统内的其他高速部件间互连的总线，如存储器、通道等
		- I/O 总线
			- 中低速 I/O 之间互连的总线
- 特性
	- 物理特性
		- 总线的物理连接方式
	- 功能特性
		- 描述总线中每根的功能
	- 电气特性
		- 定义每根线上信号的传递方向及有效电平范围
	- 时间特性
		- 定义每根线什么时间有效
- 总线的标准化
	- 遵守相同的总线要求，部件可更换使用
### 6.1.2 总线连接方式
- 单总线结构
	- 使用单一的系统总线连接 CPU、主存和 I/O 设备
		- 连接到总线上的逻辑部件必须高速运行
		- 不再使用总线，能迅速放弃
	- ![image.png|334](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619233509.png)
- 多总线结构
	- 多总线结构确保高速、中速、低速连接到不同总线上同时工作，以提高总线效率和吞吐量
	- ![image.png|432](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619234556.png)
### 6.1.3 总线的内部结构
- 信号线
	- ![image.png|436](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619233154.png)
	- 地址线
		- 单向传送主存与设备的地址
	- 数据线
		- 双向传送数据
	- 控制线
		- 单向传送
- 总线组成
	- ![image.png|406](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619235322.png)
		- 数据传送总线
		- 仲裁总线
			- 总线请求线
			- 总线授权线
		- 中断和同步总线
			- 中断请求线
			- 中断认可线
		- 公用线
			- 时钟信号线
			- 电源线
			- ......
### 6.1.4 总线结构实例
- CPU 总线
	- CPU 引脚的信号的延伸
- PCI 总线
	- 用于连接高速的 I/O 设备
- ISA 总线
	- Pentium 使用 ISA 总线与低速 I/O 设备连接
- 北桥
	- CPU 总线 - PCI 总线
- 南桥
	- PCI 总线 - ISA 总线
## 6.2 总线接口
### 6.2.1 信息传送方式
- 串行传送
- 并行传送
### 6.2.2 总线接口的基本概念
- 功能
	- 控制
	- 缓冲
	- 状态
	- 转换
	- 整理
	- 程序中断
- 分类
	- 串行数据接口
	- 并行数据接口
## 6.3 总线仲裁
- 主方（主设备）
	- 启动总线周期
- 从方（从设备）
	- 只能响应主方的请求
- 总线占用期
	- 主方持续控制总线的时间
### 6.3.1  集中式仲裁
- 链式查询方式
	- 菊花链式顺次查询
		- 若无总线请求，则向下查询
		- 若有总线请求，则获得总线控制权
- 计数器定时查询方式
- 独立请求方式
	- 每台设备和总线仲裁器之间都有一对请求线和授权线
### 6.3.2 分布式仲裁
- 每个潜在的主方都有自己的仲裁号和仲裁器
- 通过比较仲裁号来确定优先级