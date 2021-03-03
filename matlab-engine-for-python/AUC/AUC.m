function result=AUC(fg)
warning off;
count=1;
for p = 0.01:0.01:0.8
    aij = threshold_proportional(fg, p);
    %aij为阈值选择后的邻接矩阵
    Strength(count)=strength(aij);
    cluster(count)=mean(Clustering_Coefficient(aij));
    Apath(count)=avepath(aij);
    count=count+1;
end

P=0.01:0.01:0.8;
%plot(P,Strength);
%figure;plot(P,cluster);
aucs=sum(Strength)*0.01/2;
aucpath=sum(Apath)*0.01/2;
auccluster=sum(cluster)*0.01/2;
result=[aucs,aucpath,auccluster];
end