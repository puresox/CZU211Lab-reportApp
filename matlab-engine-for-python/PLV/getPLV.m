function PLVResult=getPLV(dataPath,range,picPath1,picPath2)
warning('off','all');
load(dataPath);

a=EEG.data;
b=size(a,2);
c=fix(b/1500);%截尾取整
a(:,1500*c+1:b)=[];
a=a';
B=reshape(a,1500,64,c);
[~,~,n]=size(B);

for i=1:n
    C(:,:,i)=B(:,:,i)';
end

B=double(C);
filtSpec.order = 50;
if strcmp(range,'alpha')
    filtSpec.range = [8 14]; %alpha滤波
else
    filtSpec.range = [4 8]; %theta滤波
end
[plv]=pn_eegPLV(B,500,filtSpec);
% T=plv(:,1,2);

%%%%%%%%%%画34.36PLV图
% for i=35:40
%    plot((0:size(B, 2)-1)/500, squeeze(plv(:, 34, 36, :)));hold on;
%    xlabel('Time (s)'); ylabel('Plase Locking Value');
% end

for i=1:64
    for j=i:64
        fg(i,j)=mean(plv(:,i,j));
    end
end
fg=fg+fg';%构建矩阵

PLVResult = fg;
%被试平均
%fgall=(fg+fg2+fg3+fg4+fg5+fg6+fg7+fg8+fg9+fg10+fg11+fg12+fg13+fg14+fg15+fg16)/16;

p=0.04;
aij = threshold_proportional(fg, p); %thresholding networks due to proportion p
ijw = adj2edgeL(triu(aij));             %passing from matrix form to edge list form
n_features = sum(aij, 2);       % in this case the feature is the Strenght
cbtype = 'nocb';                 % colorbar for weigth

%连接矩阵
figure('visible','off');
clims = [0 0.7]; imagesc(fg,clims); xlabel('通道编号'); ylabel('通道编号');
clb = colorbar; clb.Label.String = 'PLV值'; clb.Label.FontSize = 10;
saveas(gcf,picPath1);

%连接拓扑图
figure('visible','off');
f_PlotEEG_BrainNetwork(64, ijw, 'w_wn2wx', n_features, 'n_nn2nx', cbtype);
clb = colorbar; clb.Label.String = '连接强度'; clb.Label.FontSize = 13;
saveas(gcf,picPath2);

end
