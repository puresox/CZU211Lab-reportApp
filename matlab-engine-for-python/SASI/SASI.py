import os
import sys

import matlab.engine

eng = matlab.engine.start_matlab()
# 切换到当前文件夹
currentDir = os.path.dirname(__file__)
eng.cd(currentDir)
dataPath = sys.argv[1]
SASIresult = eng.SASImain(dataPath)
print(SASIresult)
