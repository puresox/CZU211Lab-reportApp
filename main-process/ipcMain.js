// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');

let addUserWin;
let userDetailWin;
// 监听打开addUser窗口的消息
ipcMain.on('open-addUser', () => {
  addUserWin = new BrowserWindow({
    width: 300,
    height: 200,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      preload: path.join(__dirname, '../assets/addUser.js'),
    },
  });
  addUserWin.on('close', () => {
    addUserWin = null;
  });
  addUserWin.loadFile(path.join(__dirname, '../sections/addUser.html'));
});
// 监听打开userDetail窗口的消息
ipcMain.on('open-userDetail', () => {
  userDetailWin = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      // preload: path.join(__dirname, '../assets/userDetail.js'),
    },
  });
  userDetailWin.on('close', () => {
    userDetailWin = null;
  });
  userDetailWin.loadFile(path.join(__dirname, '../sections/userDetail.html'));
});
