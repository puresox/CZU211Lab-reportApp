
function path=avepath(a)

n=length(a);
A=a;
b=a~=0;
c=1./a(b);
A(b)=c;
path=(n*(n-1))/sum(sum(A));