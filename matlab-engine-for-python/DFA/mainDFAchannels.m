function DFAResult=mainDFAchannels(dataPath)
% 输入数据存储地址，输出64导联的值
warning off;
load(dataPath);
Alphaploy=[];
for i=1:64
    data=EEG.data';
    DATA=data(:,i);
    [~,Alpha1]=DFA_main(DATA);
    Alphaploy(i)=Alpha1;
    %     disp(i);
end
DFAResult=Alphaploy;
end