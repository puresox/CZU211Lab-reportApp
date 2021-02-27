function []=getTopoplot(datavector,picPath)
warn off;
load('chanlocs64.mat','chanlocs');
%作图不显示
figure('visible','off');
topoplot(datavector, chanlocs,'electrodes','nums','chaninfo',[11 12 0; 13 14 15]);
clb = colorbar; clb.Label.String = 'SASI值'; clb.Label.FontSize = 10;
%保存图
saveas(gcf,picPath);
end