# 生成AIA表格数据
# input:[[训练前mat数据,训练后mat数据]]
# output:[AIA表格二维数组]
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
datas = json.loads(sys.argv[1])


def AIACompares(dataPaths):
    [beforeDataPath, afterDataPath] = dataPaths
    AIACompareResult = eng.AIACompare(beforeDataPath, afterDataPath)
    return AIACompareResult


AIACompareResults = list(map(AIACompares, datas))
# 输出
print(eng.jsonencode(AIACompareResults))
