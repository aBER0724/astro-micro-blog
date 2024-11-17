---
title: "Computer Composition Review Ch5  中央处理器"
date: 2024-06-19
---

## 5.1 CPU 的功能和组成
### 5.1.1 CPU 的功能
- 指令控制
- 操作控制
- 时间控制
- 数据加工
### 5.1.2 CPU 的基本组成
- ![image.png](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619194517.png)
- 控制器
	- 完成协调和指挥整个计算机系统的操作
		- 从 cache 中取出指令，并指出下一条指令位置
		- 对指令进行译码/测试，并产生相应的操作控制信号
		- 指挥并控制 CPU、数据 cache 和输入/输出设备之间的数据流动方向
	- 组成
		- 程序计数器
		- 指令寄存器
		- 指令译码器
		- 时序产生器
		- 操作控制器
- 运算器
	- 功能
		- 执行所有的算术运算
		- 执行所有的逻辑运算，并进行逻辑测试
	- 组成
		- 算术逻辑运算单元 ALU
		- 通用寄存器
		- 数据缓冲寄存器 DR
		- 程序状态字寄存器（状态条件寄存器 PSWR）
### 5.1.3 CPU 中的主要寄存器
- 数据缓冲寄存器 DR
	- 作为 ALU 运算结果和通用寄存器之间信息传送中时间上的缓冲
	- 补偿 CPU 和内存、外围设备间操作速度差异
- 指令寄存器 IR
	- 保存当初正在执行的指令
	- 指令译码器
		- 识别所要求的操作
		- 操作码经译码后，可向操作控制器发送具体操作信号
- 程序计数器 PC
	- 用于存放下条指令的地址
- 数据地址寄存器 AR
	- 保存当前 CPU 所访问的数据存储器单元的地址
- 通用寄存器
	- 为 ALU 提供一个工作区
- 程序状态字寄存器 PSWR
	- 保存算术运算指令和逻辑运算指令运算结果的条件代码
		- 进位标志、溢出标志等
	- 保存中断和系统工作状态等信息
## 5.4 微程序控制器
### 5.4.1 微程序控制原理
- 微命令和微操作
	- 微命令
		- 控制部件通过控制线向执行部件发出各种控制命令
	- 微操作
		- 执行部件接受微命令后所执行操作
		- 相容性的微操作
			- 能同时或同一 CPU 周期内可以并行执行的微操作
		- 相斥性的微操作
			- 不能同时或同一 CPU 周期内可以并行执行的微操作
- 微指令和微程序
	- 微指令
		- ![image.png|382](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619201450.png)
		- 在一个 CPU 周期中，一组实现一定操作功能的微命令的组合
	- 微程序
		- 许多条微指令组成的序列实现一个机器指令的功能
- 微程序控制器原理
	- 微程序控制器组成
		- 控制存储器
			- 存放实现全部指令系统的微程序
			- 微指令周期
				- 读出一条微指令并执行的时间和
		- 微指令寄存器
			- 微地址寄存器
				- 存放下一条微指令地址
			- 微命令寄存器
				- 保存微指令的操作控制字段和判别测试字段信息
		- 地址转移逻辑
			- 完成修改微地址的任务
- CPU 周期与微指令周期的关系
	- ![image.png|427](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619201143.png)
- 机器指令与微指令的关系
	- ![image.png|166](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619201254.png) 
### 5.4.2 微程序设计技术
- 微命令编码
	- 直接表示法
		- 控制字段每位代表一个微命令
	- 编码表示法
		- 把一组互斥性的微命令信号组成一个小组（字段）
		- ![image.png|328](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619201618.png)
	- 混合表示法
- 微指令的形成方法
	- 计数器方式
	- 多路转移方式
- 微指令格式
	- 水平型
		- 一次能定义并执行多个并行操作微命令的微指令
		- ![image.png](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619203109.png)
		- 分类
			- 全水平型（不译码）
			- 字段译码法水平型
			- 直接和译码相混合的水平型
	- 垂直型
		- 设微操作码，由微操作码来规定微指令功能
		- 采用较长的位程序结构换取较短的微指令结构
	- 水平型与垂直型对比
		- 水平型并行控制能力强，效率高，灵活性强
		- 水平型执行一条指令时间短
		- 水平型微指令字较长而微程序短，垂直型相反
		- 水平型用户难掌握，垂直型与指令相似易掌握
## 5.6 流水 CPU
### 5.6.1 并行处理技术
- 并行性
	- 同时性
		- 两个以上事件在同一时刻发生
	- 并发性
		- 两个以上事件在同一时间间隔内发生
- 时间并行
	- 时间重叠
	- 让多个处理过程在时间上相互错开，轮流重叠地使用同一套硬件设备
- 空间并行
	- 资源重复
	- 以数量取胜
- 时间并行+空间并行
### 5.6.2 流水 CPU 的结构
- 流水计算机的系统组成
	- ![image.png](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619212658.png)
	- 指令部件
		- 本身就构成一个流水线
		- 取指令、指令译码、计算操作数地址、取操作数等
	- 指令队列
		- FIFO 的寄存器栈
		- 存放经过译码的指令和取来的操作数
	- 执行部件
		- 多个算术逻辑运算部件
- 流水 CPU 的时空图
	- ![image.png|218](https://cdn.jsdelivr.net/gh/aBER0724/ob_picture/Img/20240619213002.png)
- 流水线分类
	- 指令流水线
		- 指令步骤的并行
	- 算术流水线
		- 运算步骤的并行
	- 处理机流水线
		- 程序步骤的并行
### 5.6.3 流水线中的主要问题
- 资源相关
	- 多条指令进入流水线后在同一时钟周期内争用同一个功能部件而发生冲突
- 数据相关
	- 在程序中，如果必须等前一条指令执行完毕后，才能执行后一条指令
- 控制相关
	- 由转移指令引起的冲突
	- 减小影响方法
		- 延迟转移法
			- 先执行再转移
		- 转移预测法
			- 依据指令过去行为预测将来行为
## 5.7 RISC CPU
- 三要素
	- 一个有限的简单的指令系统
	- CPU 配备大量的通用寄存器
	- 强调对指令流水线的优化
- RISC 机器特征
	- 等长指令，典型 4B
	- 寻址方式少，最多不超过 4 种，不存在存储器间接寻址
	- 只有取数指令、存数指令访问存储器。最多 RS 型指令，没有 SS 型指令
	- 指令数目小于 100 种，格式小于 4 种
	- 功能简单，控制器采用硬布线方式
	- 平均一个指令执行时间为一个时钟周期
	- 指令格式中，用于指派整数寄存器的个数不少于 32 个，浮点数的不少于 16 个
	- 强调通用寄存器资源的优化使用
	- 支持指令流水并强调指令流水的优化使用
	- RISC 技术复杂性在编译程序，开发时间比 CISC 机器长