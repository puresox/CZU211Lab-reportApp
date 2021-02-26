function AIACompareResult = AIACompare(beforeDataPath,afterDataPath)
% 输入为训练前后的数据存储地址，输出为AIA训练前后对比结果的矩阵
warning off;
beforeResult=AIA(beforeDataPath);
afterResult=AIA(afterDataPath);
AIACompareResult=[beforeResult(:,1) afterResult(:,1) beforeResult(:,2) afterResult(:,2)];
end