function [q1,q2,q3,q4] = powerNormalize(beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen)
% 输入为4个4*64的矩阵
temp = [beforeEyeClose;afterEyeClose;beforeEyeOpen;afterEyeOpen];% 16*64
tempVector = reshape(temp,1,[]);%自动展开为向量
resultVector = normalize(tempVector);
result = reshape(resultVector,[],64);
q1 = result(1:4,:);
q2 = result(5:8,:);
q3 = result(9:12,:);
q4 = result(13:16,:);
end