function [fall,pxxall]=fenmu(f,Pxx)


fall=[];
pxxall=[];
 for i=1:length(f)
      if (f(i)>=8 && f(i)<=13)
        fall=[fall;f(i)];
        pxxall=[pxxall;Pxx(i)];
     end
end