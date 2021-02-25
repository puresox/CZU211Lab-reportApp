function [fa,pxxa]=fenzi(f,Pxx)
fa=[];
pxxa=[];
 for i=1:length(f)
      if (f(i)>=8&&f(i)<=13)
        fa=[fa;f(i)];
        pxxa=[pxxa;Pxx(i)];
     end
 end