function [q1,q2,q3,q4] = lzcNormalize(beforeEyeClose, afterEyeClose, beforeEyeOpen, afterEyeOpen)
% 输入为4个1*64的矩阵
temp = [beforeEyeClose;afterEyeClose;beforeEyeOpen;afterEyeOpen];% 4*64
tempVector = reshape(temp,1,[]);%自动展开为向量
resultVector = normalize(tempVector);
result = reshape(resultVector,[],64);
q1 = result(1,:);
q2 = result(2,:);
q3 = result(3,:);
q4 = result(4,:);
end