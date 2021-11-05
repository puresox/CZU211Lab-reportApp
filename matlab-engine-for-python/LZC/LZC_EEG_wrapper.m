function [LZCOut] = LZC_EEG_wrapper(EEG)

LZCOut = zeros(1,EEG.nbchan);

% disp(' ')
% disp('Computing Lempel-Ziv Complexity...')

for c = 1:EEG.nbchan
%     fprintf([num2str(c) ' ']);
%     取一段数据
    [~,LZCOut(c)] = lzcomplexity_tramas(EEG.data(c,1:5000),'mediana',2,2500,0.9);
end