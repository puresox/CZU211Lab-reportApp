function [fa,pxxa]=fenziB(f,Pxx)
fa=[];
pxxa=[];
for i=1:length(f)
    if (f(i)>=20&&f(i)<=30)
        fa=[fa;f(i)];
        pxxa=[pxxa;Pxx(i)];
    end
end