function LZCResult=LZC_main(dataPath)
% �������ݴ洢��ַ�����64������ֵ
warning off;
load(dataPath);
LZCResult=LZC_EEG_wrapper(EEG);
%
% LZC_avg_r();
% cd(filepath);   %�л�ԭ����Ŀ¼
% LZC_avg_all_r();
% %cd(SASIPath);  %�ѵ�ǰ����Ŀ¼�л���ָ���ļ���
end