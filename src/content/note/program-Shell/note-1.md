---
title: "Shell Basic 01"
date: 2024-04-24
---

## 什么是 Shell？ 
Shell 是命令行解释器，用于调用系统内核来执行用户输入的命令，再返回结果给用户。 

## Shell 的种类
sh / csh / ksh / bash / zsh / fish / powershell
> 不同 Shell 之间会有细微差异，大部分命令是相通的。

### 如何查看系统中的 Shell？
1. 查看系统中存在的 Shell
	```shell
	cat /etc/shells
	```
	输出路径即为系统中存在的 Shell。
	通过切换到对应 Shell 的目录，即可使用对应的 Shell。
2. 查看系统默认的 Shell
	```shell
	echo $SHELL
	```
	>  `$SHELL` 环境变量用于存储默认 Shell 的目录路径。
3. 查看当前脚本的名称
	```shell
	echo $0
	```
> [!tip] `$SHELL`& `$0`
> `$SHELL` 在切换 Shell 后，不会改变
> `$0` 会随着当前脚本的 Shell 而改变

## Shell 脚本
通过 Shell 脚本，一次性执行所有命令完成自动化任务。
> 默认使用`.sh`作为脚本文件扩展名
### Shell Example
```shell
#!/bin/bash
echo "Hello Shell" // 输出'Hello Shell'
date // 输出当前时间
whoami // 输出当前用户名
```
> `#!/bin/bash` 声明使用的 Shell 版本

### 执行 Shell 脚本
1. 作为可执行程序执行 `./script.sh` 
> 该方式执行需要注意设置执行权限。
> ```shell
> chmod a+x script.sh  // a-所有用户 x-执行权限
>```

1. 作为解释器参数执行 `Shell路径 script.sh` 
	```shell
	/bin/bash script.sh
	```