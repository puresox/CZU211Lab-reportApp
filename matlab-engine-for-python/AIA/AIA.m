function AIAResult = AIA(dataPath)
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
    [~,pxxl]=fenzi(f,lpxx);%分子
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

W28=W(:,28);%P3
W42=W(:,42);%P4
W30=W(:,30);%P7
W44=W(:,44);%P8
W35=W(:,35);%O1
W39=W(:,39);%O2
W20=W(:,20);%C3
W50=W(:,50);%C4
%plot(lfal,pxxl);
A1=[];
A1(1)=log(W60/W12);%F3 F4
A1(2)=log((W5+W60+W58)/(W10+W12+W18));%Fp1, F3, F7---Fp2, F4, F8
A1(3)=log((W5+W60+W58+W3+W59+W2)/(W10+W12+W18+W9+W13+W11));%Fp1, F3, F7, F1, F5, AF3---Fp2, F4, F8, F2, F6, AF4
A1(4)=log((W42+W44)/(W28+W30));%P3 P7---P4 P8
A1(5)=log(W39/W35);%O1 O2
A1(6)=log(W50/W20);%C3 C4
A2=[];
A2(1)=(W60-W12)/(W60+W12);%F3 F4
A2(2)=(W5-W10+W60-W12+W58-W18)/(W5+W10+W60+W12+W58+W18);%Fp1, F3, F7---Fp2, F4, F8
A2(3)=(W5-W10+W60-W12+W58-W18+W3-W9+W59-W13+W2-W11)/(W5+W10+W60+W12+W58+W18+W3+W9+W59+W13+W2+W11);%Fp1, F3, F7, F1, F5, AF3---Fp2, F4, F8, F2, F6, AF4
A2(4)=(W42-W28+W44-W30)/(W42+W28+W44+W30);%P3 P7---P4 P8
A2(5)=(W39-W35)/(W39+W35);%O1 O2
A2(6)=(W50-W20)/(W50+W20);%C3 C4
% A1分数
b(1,1)=A1(1);%F3 F4
b(2,1)=A1(2);%Fp1, F3, F7---Fp2, F4, F8
b(3,1)=A1(3);%Fp1, F3, F7, F1, F5, AF3---Fp2, F4, F8, F2, F6, AF4
b(4,1)=A1(4);%P3 P7---P4 P8
b(5,1)=A1(5);%O1 O2
b(6,1)=A1(6);%C3 C4
% A2分数
b(1,2)=A2(1);%F3 F4
b(2,2)=A2(2);%Fp1, F3, F7---Fp2, F4, F8
b(3,2)=A2(3);%Fp1, F3, F7, F1, F5, AF3---Fp2, F4, F8, F2, F6, AF4
b(4,2)=A2(4);%P3 P7---P4 P8
b(5,2)=A2(5);%O1 O2
b(6,2)=A2(6);%C3 C4
AIAResult = b;
end