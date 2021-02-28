# 生成训练前、训练后、训练前后差值的地形图
# input:[{datas:[训练前一维数组,训练后一维数组],picPaths:[地形图存储地址]}]
# output:null
import json
import os
import sys

import matlab.engine

# 启动MATLAB进程
eng = matlab.engine.start_matlab()
# 切换到当前文件夹
currentDir = os.path.dirname(__file__)
eng.cd(currentDir)
# 获取输入参数
datavectors = json.loads(sys.argv[1])
for datavector in datavectors:
    [beforedata, afterdata] = datavector["datas"]
    [pic1, pic2, pic3] = datavector["picPaths"]
    eng.getTopoplot(matlab.double(beforedata), pic1, nargout=0)
    eng.getTopoplot(matlab.double(afterdata), pic2, nargout=0)
    eng.getTopoplot(
        eng.minus(matlab.double(afterdata), matlab.double(beforedata)), pic3, nargout=0
    )
