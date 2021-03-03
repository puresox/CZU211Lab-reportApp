function ACC=Clustering_Coefficient(Links_M)

%计算网络的聚类系数
%输入为网络的邻接矩阵
%输出为标量的网络的聚类系数:ACC
%算法的思想是：对每一个节点i找到它的邻居，并记录邻居的下标，然后在这些邻居中找大于0的数的总个数(也就是总边数)


%注意Matlab中find()子函数的调用，查找大于零的元素并返回其下标

Links_M0=Links_M;

n0=length(Links_M0);    %矩阵的维数

CC0=sparse(n0,1);       %存放每个节点的所对应的聚类系数

TCC=0;                   %初始化总的聚类系数

for i=1:n0
    
    i_neighbor=find(Links_M0(i,:));      %查找i点的邻居，就是Links(i,j)=1的点, 返回的是邻居节点下标的组成的向量
    
    i_neighbor_number=length(i_neighbor);  %节点i的邻居的数目
    
   if  i_neighbor_number>=2                %注如果邻居数为1的话，那么CC(i)=0, 无需计算，所以从邻居数大于等于2开始算
        
       S=Links_M(i_neighbor,i_neighbor);      %抽取i节点的所有的邻居所对应的行，列
        
       CC0(i)=sum(S(:))/(i_neighbor_number*(i_neighbor_number-1));    %注意一个节点其度的和等于其变数的两倍，sum(S(:))表示矩阵S所有元素的和=度，
                                                        %计算节点i的聚类系数
                                                                     
    end
    
end

TCC=full(sum(CC0));  %总的聚类系数

ACC=TCC/n0;          %网络的平均聚类系数