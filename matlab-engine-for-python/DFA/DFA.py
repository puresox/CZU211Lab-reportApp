# 生成DFA数据
# input:[mat数据]
# output:[DFA一维数组]
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


def DFAs(dataPath):
    DFAResult = eng.mainDFAchannels(dataPath)  # 返回二维矩阵
    return DFAResult


DFAResults = list(map(DFAs, datas))
normalized = eng.dfaNormalize(
    DFAResults[0], DFAResults[1], DFAResults[2], DFAResults[3], nargout=4
)
# 输出
print(eng.jsonencode(normalized))
