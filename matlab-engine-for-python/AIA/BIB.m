function BIBResult = BIB(dataPath)
% 输入为数据存储地址，输出为AIA结果的矩阵
warning off;
load(dataPath);
T=EEG.times;
A=EEG.data;
A=A';

x=A;%导联矩阵
Fs=500;
nfft=1024;
window=hamming(length(T));
[Pxx,f]=periodogram(x,window,nfft,Fs);
W=[];

for i=1:64
    lpxx=Pxx(:,i);
    %     P=10*log10(lpxx);
    %     plot(f,P);
    [~,pxxl]=fenziB(f,lpxx);%分子
    [~,pxxall]=fenmu(f,lpxx);%分母
    W(i)=sum(pxxl)/sum(pxxall);
end
W10=W(:,10);%Fp1
W5=W(:,5);%Fp2
W12=W(:,12);%F3
W60=W(:,60);%F4
W18=W(:,18);%F7
W58=W(:,58);%F8

W9=W(:,9);%F1
W3=W(:,3);%F2
W13=W(:,13);%F5
W59=W(:,59);%F6
W11=W(:,11);%AF3
W2=W(:,2);%AF4
%plot(lfal,pxxl);
FBA=[];
FBA(1)=log(W12/W60);%F3 F4
FBA(2)=log((W10+W12+W18)/(W5+W60+W58));%Fp1, F3, F7---Fp2, F4, F8
FBA(3)=log((W10+W12+W18+W9+W13+W11)/(W5+W60+W58+W3+W59+W2));%Fp1, F3, F7, F1, F5, AF3---Fp2, F4, F8, F2, F6, AF4
% FBA分数
BIBResult = [FBA(1);FBA(2);FBA(3)];
end