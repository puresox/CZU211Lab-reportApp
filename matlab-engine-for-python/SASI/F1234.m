function [f12,pxx12,f34,pxx34]=F1234(f,Pxx,F1,F2,F3,F4)


f12=[];
pxx12=[];
f34=[];
pxx34=[];
 for i=1:length(f)
      if (f(i)>=F1&&f(i)<=F2)
       f12=[f12;f(i)];
       pxx12=[pxx12;Pxx(i)];
      elseif(f(i)>=F3&&f(i)<=F4)
       f34=[f34;f(i)];
       pxx34=[pxx34;Pxx(i)];
      end
  
 end