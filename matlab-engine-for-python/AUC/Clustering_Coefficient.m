function ACC=Clustering_Coefficient(Links_M)

%��������ľ���ϵ��
%����Ϊ������ڽӾ���
%���Ϊ����������ľ���ϵ��:ACC
%�㷨��˼���ǣ���ÿһ���ڵ�i�ҵ������ھӣ�����¼�ھӵ��±꣬Ȼ������Щ�ھ����Ҵ���0�������ܸ���(Ҳ�����ܱ���)


%ע��Matlab��find()�Ӻ����ĵ��ã����Ҵ������Ԫ�ز��������±�

Links_M0=Links_M;

n0=length(Links_M0);    %�����ά��

CC0=sparse(n0,1);       %���ÿ���ڵ������Ӧ�ľ���ϵ��

TCC=0;                   %��ʼ���ܵľ���ϵ��

for i=1:n0
    
    i_neighbor=find(Links_M0(i,:));      %����i����ھӣ�����Links(i,j)=1�ĵ�, ���ص����ھӽڵ��±����ɵ�����
    
    i_neighbor_number=length(i_neighbor);  %�ڵ�i���ھӵ���Ŀ
    
   if  i_neighbor_number>=2                %ע����ھ���Ϊ1�Ļ�����ôCC(i)=0, ������㣬���Դ��ھ������ڵ���2��ʼ��
        
       S=Links_M(i_neighbor,i_neighbor);      %��ȡi�ڵ�����е��ھ�����Ӧ���У���
        
       CC0(i)=sum(S(:))/(i_neighbor_number*(i_neighbor_number-1));    %ע��һ���ڵ���ȵĺ͵����������������sum(S(:))��ʾ����S����Ԫ�صĺ�=�ȣ�
                                                        %����ڵ�i�ľ���ϵ��
                                                                     
    end
    
end

TCC=full(sum(CC0));  %�ܵľ���ϵ��

ACC=TCC/n0;          %�����ƽ������ϵ��