# reportApp

EEG指标分析与呈现。

![image](https://user-images.githubusercontent.com/17718921/202400252-54306cd4-6505-4934-b0f0-008eca254c0c.png)


## 安装说明

1. 额外安装 python，matlab。
2. 安装用于 Python 的 MATLAB 引擎 API（在默认位置安装）。[安装用于 Python 的 MATLAB 引擎 API - MATLAB & Simulink - MathWorks 中国](https://ww2.mathworks.cn/help/matlab/matlab_external/install-the-matlab-engine-for-python.html)
3. MATLAB 安装 EEGLAB，EEGLAB 要添加所有子目录。

## 注意

1. 数据文件以 o 结尾表示睁眼，以 c 结尾表示闭眼。
2. 代码中填写python路径。

## 开发

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/puresox/reportApp.git
# Go into the repository
cd reportApp
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

1. npm 要换源，electron 也要换源。

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
