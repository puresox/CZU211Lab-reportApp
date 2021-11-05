
clear;clc;
load('F:\数据分析\graphchanlocs.mat');
data = 'F:\数据分析\静息态\';
index = 'LZC';graphName='LZC值';
dataPath = [data,'LZC-avg\'];
picPath = [data,'LZC-pic'];

colorlimit = 2;
for nor=1:2
    if(nor == 1)
        normal = '';
    else
        normal = '-n';
    end
    for i=1:9
        if(i == 1)
            Name = ['_avg-after',normal];
        elseif(i == 2)
            Name = ['_avg-before',normal];
        elseif(i == 3)
            Name = ['_avg-eyec-after',normal];
        elseif(i == 4)
            Name = ['_avg-eyec-before',normal];
        elseif(i == 5)
            Name = ['_avg-eyeo-after',normal];
        elseif(i == 6)
            Name = ['_avg-eyeo-before',normal];
        elseif(i == 7)
            Name = ['_avg-diff',normal];
        elseif(i == 8)
            Name = ['_avg-eyec-diff',normal];
        elseif(i == 9)
            Name = ['_avg-eyeo-diff',normal];
        end
        load([dataPath,index,Name,'.mat']);
        figure('visible','off');
        topoplot(LZCavg, chanlocs,'maplimits',[-colorlimit,colorlimit],'electrodes','nums','chaninfo',chanlocs);%[11 12 0; 13 14 15]
        clb = colorbar; clb.Label.String = graphName; clb.Label.FontSize = 30;
        %保存图
        filepath=pwd; %保存当前工作目录
        cd(picPath);  %把当前工作目录切换到指定文件夹
        saveas(gcf,[index,Name,'地形图.png']); 
        cd(filepath); %切回原工作目录
    end
end