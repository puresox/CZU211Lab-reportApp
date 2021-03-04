# 生成脑网络图片和AUC数据
# input:[{data:mat数据,picPaths:[theta矩阵图存储地址,alpha矩阵图存储地址,theta拓扑图存储地址,alpha拓扑图存储地址,]}]
# output:[[[thetaaucs,thetaaucpath,thetaauccluster],[alphaaucs,alphaaucpath,alphaauccluster]]]
import json
import os
import sys

import matlab.engine

# 启动MATLAB进程
eng = matlab.engine.start_matlab()
# 切换到当前文件夹
currentDir = os.path.dirname(__file__)
eng.cd(currentDir)
eng.addpath("../AUC")
# 获取输入参数
datavectors = json.loads(sys.argv[1])


def PLVs(datavector):
    dataPath = datavector["data"]
    [thetapic1, alphapic1, thetapic2, alphapic2] = datavector["picPaths"]
    thetaPLVResult = eng.getPLV(dataPath, "theta", thetapic1, thetapic2)  # 返回二维矩阵
    [thetaAUCResult] = eng.AUC(thetaPLVResult)
    alphaPLVResult = eng.getPLV(dataPath, "alpha", alphapic1, alphapic2)  # 返回二维矩阵
    [alphaAUCResult] = eng.AUC(alphaPLVResult)
    return [thetaAUCResult, alphaAUCResult]


PLVResults = list(map(PLVs, datavectors))
# 输出
print(eng.jsonencode(PLVResults))
