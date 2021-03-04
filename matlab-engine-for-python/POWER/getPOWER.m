function result=getPOWER(dataPath)
warning('off','all');
load(dataPath);
% [~,nu]=size(EEG.data');%obtain size of data
T=EEG.times;
data=EEG.data';
% NOTE: filters designed using FDA tool box
% because of zero padding more points are observed

% %DELTA
% Fs = 500;  % Sampling Frequency
% Fpass = 0;               % Passband Frequency
% Fstop = 4;               % Stopband Frequency
% Dpass = 0.057501127785;  % Passband Ripple
% Dstop = 0.0001;          % Stopband Attenuation
% dens  = 20;              % Density Factor
% % Calculate the order from the parameters using FIRPMORD.
% [N, Fo, Ao, W] = firpmord([Fpass, Fstop]/(Fs/2), [1 0], [Dpass, Dstop]);
% % Calculate the coefficients using the FIRPM function.
% b1 = firpm(N, Fo, Ao, W, {dens});
% Hd1 = dfilt.dffir(b1);
% x1=filter(Hd1,data);
% %frequency spectrum of DELTA
L=1000;
% Fs=500;
NFFT = 2^nextpow2(L); % Next power of 2 from length of x1
window=hamming(length(T));
% % [pxx1,f1]=pwelch(x1,window,NFFT,Fs);
% % Plot single-sided amplitude spectrum

%THETA- BAND PASS FILTER (4-7)
Fs = 500;  % Sampling Frequency
Fstop1 = 3.5;             % First Stopband Frequency
Fpass1 = 4;               % First Passband Frequency
Fpass2 = 7;               % Second Passband Frequency
Fstop2 = 7.5;             % Second Stopband Frequency
Dstop1 = 0.0001;          % First Stopband Attenuation
Dpass  = 0.057501127785;  % Passband Ripple
Dstop2 = 0.0001;          % Second Stopband Attenuation
dens   = 20;              % Density Factor
% Calculate the order from the parameters using FIRPMORD.
[N, Fo, Ao, W] = firpmord([Fstop1 Fpass1 Fpass2 Fstop2]/(Fs/2), [0 1 ...
    0], [Dstop1 Dpass Dstop2]);
% Calculate the coefficients using the FIRPM function.
b2 = firpm(N, Fo, Ao, W, {dens});
Hd2 = dfilt.dffir(b2);
x2=filter(Hd2,data);
%FREQUENCY SPECTRUM OF THETA
% L=1000;
% Fs=500;
% NFFT = 2^nextpow2(L); % Next power of 2 from length of x2
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%¶Ô±È
% window=hamming(length(T));
[pxx2,~]=pwelch(x2,window,NFFT,Fs);

%ALPHA BAND PASS FILTER (8-12)
Fs = 500;  % Sampling Frequency
Fstop1 = 7.5;             % First Stopband Frequency
Fpass1 = 8;               % First Passband Frequency
Fpass2 = 12;              % Second Passband Frequency
Fstop2 = 12.5;            % Second Stopband Frequency
Dstop1 = 0.0001;          % First Stopband Attenuation
Dpass  = 0.057501127785;  % Passband Ripple
Dstop2 = 0.0001;          % Second Stopband Attenuation
dens   = 20;              % Density Factor
% Calculate the order from the parameters using FIRPMORD.
[N, Fo, Ao, W] = firpmord([Fstop1 Fpass1 Fpass2 Fstop2]/(Fs/2), [0 1 ...
    0], [Dstop1 Dpass Dstop2]);
% Calculate the coefficients using the FIRPM function.
b3  = firpm(N, Fo, Ao, W, {dens});
Hd3 = dfilt.dffir(b3);
x3=filter(Hd3,data);
%FREQUENCY SPECTRUM OF ALPHA BAND
% L=1000;
% Fs=500;
% NFFT = 2^nextpow2(L); % Next power of 2 from length of x3
% % Plot single-sided amplitude spectrum ALPHA
% window=hamming(length(T));
[pxx3,~]=pwelch(x3,window,NFFT,Fs);

%BETA  BAND PASS FILTER (12-30)
Fs = 500;  % Sampling Frequency
Fstop1 = 11.5;            % First Stopband Frequency
Fpass1 = 12;              % First Passband Frequency
Fpass2 = 30;              % Second Passband Frequency
Fstop2 = 30.5;            % Second Stopband Frequency
Dstop1 = 0.0001;          % First Stopband Attenuation
Dpass  = 0.057501127785;  % Passband Ripple
Dstop2 = 0.0001;          % Second Stopband Attenuation
dens   = 20;              % Density Factor
% Calculate the order from the parameters using FIRPMORD.
[N, Fo, Ao, W] = firpmord([Fstop1 Fpass1 Fpass2 Fstop2]/(Fs/2), [0 1 ...
    0], [Dstop1 Dpass Dstop2]);
% Calculate the coefficients using the FIRPM function
b4  = firpm(N, Fo, Ao, W, {dens});
Hd4 = dfilt.dffir(b4);
x4=filter(Hd4,data);                 %h15=figure;
%Frequency spectrum of BETA band
% L=1000;
% Fs=500;
% NFFT = 2^nextpow2(L); % Next power of 2 from length of x4
% window=hamming(length(T));
[pxx4,~]=pwelch(x4,window,NFFT,Fs);

%Gamma  BAND PASS FILTER (30-45)
Fs = 500;  % Sampling Frequency
Fstop1 = 29.5;            % First Stopband Frequency
Fpass1 = 30;              % First Passband Frequency
Fpass2 = 45;              % Second Passband Frequency
Fstop2 = 45.5;            % Second Stopband Frequency
Dstop1 = 0.0001;          % First Stopband Attenuation
Dpass  = 0.057501127785;  % Passband Ripple
Dstop2 = 0.0001;          % Second Stopband Attenuation
dens   = 20;              % Density Factor
% Calculate the order from the parameters using FIRPMORD.
[N, Fo, Ao, W] = firpmord([Fstop1 Fpass1 Fpass2 Fstop2]/(Fs/2), [0 1 ...
    0], [Dstop1 Dpass Dstop2]);
% Calculate the coefficients using the FIRPM function
b5  = firpm(N, Fo, Ao, W, {dens});
Hd5 = dfilt.dffir(b5);
x5=filter(Hd5,data);
%Frequency spectrum of BETA band
% L=1000;
% Fs=500;
% NFFT = 2^nextpow2(L); % Next power of 2 from length of x4
% window=hamming(length(T));
[pxx5,~]=pwelch(x5,window,NFFT,Fs);
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% pxx1abs=abs(10*log10(pxx1));%delta
pxx2abs=abs(10*log10(pxx2));%theta
pxx3abs=abs(10*log10(pxx3));%alpha
pxx4abs=abs(10*log10(pxx4));%beta
pxx5abs=abs(10*log10(pxx5));%gamma

% alldelta = mean(pxx1abs);
alltheta = mean(pxx2abs);
allalpha = mean(pxx3abs);
allbeta = mean(pxx4abs);
allgamma = mean(pxx5abs);
all4=[alltheta;allalpha;allbeta;allgamma];
result=all4;
end
