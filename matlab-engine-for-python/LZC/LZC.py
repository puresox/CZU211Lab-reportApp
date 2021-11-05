# 生成LZC数据
# input:[mat数据]
# output:[LZC一维数组]
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


def LZCs(dataPath):
    LZCResult = eng.LZC_main(dataPath)  # 返回二维矩阵
    return LZCResult


LZCResults = list(map(LZCs, datas))
normalized = eng.lzcNormalize(
    LZCResults[0], LZCResults[1], LZCResults[2], LZCResults[3], nargout=4
)
# 输出
print(eng.jsonencode(normalized))
