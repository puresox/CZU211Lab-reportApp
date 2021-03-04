# 生成四个频段的POWER数据
# input:[mat数据]
# output:[[theta一维数组,alpha一维数组,beta一维数组,gamma一维数组]]
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


def POWERs(dataPath):
    POWERResult = eng.getPOWER(dataPath)  # 返回二维矩阵
    return POWERResult


POWERResults = list(map(POWERs, datas))
# 输出
print(eng.jsonencode(POWERResults))
