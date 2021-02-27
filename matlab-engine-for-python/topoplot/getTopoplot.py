# 保存图片
import json
import os
import sys

import matlab.engine

eng = matlab.engine.start_matlab()
# 切换到当前文件夹
currentDir = os.path.dirname(__file__)
eng.cd(currentDir)
datavector = json.loads(sys.argv[1])
picPath = sys.argv[2]
eng.getTopoplot(datavector, picPath)
