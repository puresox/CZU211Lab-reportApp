function AIACompareResult = AIACompare(beforeDataPath,afterDataPath)
% 输入为训练前后的数据存储地址，输出为AIA训练前后对比结果的矩阵
warning off;
beforeAIAResult=AIA(beforeDataPath);
afterAIAResult=AIA(afterDataPath);
beforeBIBResult=BIB(beforeDataPath);
afterBIBResult=BIB(afterDataPath);
AIACompareResult=[beforeAIAResult(:,1) afterAIAResult(:,1) beforeBIBResult(:,1) afterBIBResult(:,1)];
end