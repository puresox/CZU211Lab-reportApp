function [D,Alpha]=DFA_main(DATA)
% DATA should be a time series of length(DATA) greater than 2000,and of column vector.
%A is the alpha in the paper
%D is the dimension of the time series
%n can be changed to your interest
%%%%%%%%%%%%%%%%%%%%%%
%400HZ
%n=[4 8 20 32 60 112 200 364 664 812];
%%%%%%%%%%%%%%%%%%%%%%
n=[8 10 25 30 36 40 55 64 75 140 250 455 830 1015];
N1=length(n);
F_n=zeros(N1,1);
for i=1:N1
    
    % F_n2(i)=DFA(DATA,n(i),2);
    F_n(i)=DFA(DATA,n(i),1);
end

n=n';
%plot(log(n),log(F_n));
%scatter(log(n),log(F_n),'*');
%xlabel('log(n)');
%ylabel('log(F(n))');
A=polyfit(log(n(1:end)),log(F_n(1:end)),1);
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%增加拟合阶数
%  B=polyfit(log(n(1:end)),log(F_n2(1:end)),1);
%  C=polyfit(log(n(1:end)),log(F_n(1:end)),1);

Alpha=A(1);
% Alpha3=C(1);
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
D=3-A(1);
%  D2=3-B(1);
%  D3=3-C(1);
return