function SASIResult=SASImain(dataPath)
% 输入数据存储地址，输出64导联的值
warning off;
load(dataPath);
A=EEG.data';
T=EEG.times;
sasimartix=[];
fcmartix=[];

for i=1:64
    x=A(:,i);%导联队
    Fs=500;
    nfft=1024;
    window=hamming(length(T));
    [Pxx,f]=periodogram(x,window,nfft,Fs);
    lpxx=Pxx(:,1);%取这一列
    
    P=10*log10(lpxx);
    % plot(f,P);
    
    [lfall,pxxall]=fenmu(f,lpxx);
    y=polyfit(lfall,pxxall,2);%求出拟合系数
    Fc=abs(y(2)/y(1)/2);%求出拟合后的最大值处的频率
    fcmartix(i)=Fc;
    F1=Fc-2-4;
    F2=Fc-2;
    F3=Fc+2;
    F4=Fc+26;
    [f12,pxx12,f34,pxx34]= F1234(f,Pxx,F1,F2,F3,F4);
    
    Wlmn=sum(pxx12);
    Whmn=sum(pxx34);
    SASI=(Whmn-Wlmn)/(Whmn+Wlmn);
    sasimartix(i)=SASI;
end
SASIResult=sasimartix;
end