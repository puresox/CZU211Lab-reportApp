function [fall,pxxall]=fenmu(f,Pxx)


fall=[];
pxxall=[];
 for i=1:length(f)
      if (f(i)>=0.3&&f(i)<=48)
        fall=[fall;f(i)];
        pxxall=[pxxall;Pxx(i)];
     end
end