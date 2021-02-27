# 输出二维数组的字符串
import json
import os
import sys

import matlab.engine

# 启动MATLAB进程
eng = matlab.engine.start_matlab()
# 切换到当前文件夹
currentDir = os.path.dirname(__file__)
eng.cd(currentDir)
# 获取输入参数，处理转义字符
datavectors = json.loads(sys.argv[1])


def AIACompares(dataPaths):
    [beforeDataPath, afterDataPath] = dataPaths
    AIACompareResult = eng.AIACompare(beforeDataPath, afterDataPath)
    return AIACompareResult


AIACompareResults = list(map(AIACompares, datavectors))
print(eng.jsonencode(AIACompareResults))
