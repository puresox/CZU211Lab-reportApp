function LZCResult=LZC_main(dataPath)
% 输入数据存储地址，输出64导联的值
warning off;
load(dataPath);
LZCResult=LZC_EEG_wrapper(EEG);
%
% LZC_avg_r();
% cd(filepath);   %切回原工作目录
% LZC_avg_all_r();
% %cd(SASIPath);  %把当前工作目录切换到指定文件夹
end