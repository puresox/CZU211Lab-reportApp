// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');

let addUserWin;
// 监听打开addUser窗口的消息
ipcMain.on('open-addUser', () => {
  addUserWin = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, '../assets/addUser.js'),
    },
  });
  addUserWin.on('close', () => {
    addUserWin = null;
  });
  addUserWin.loadFile(path.join(__dirname, '../sections/addUser.html'));
});
// 监听关闭addUser窗口的消息
ipcMain.on('close-addUser', () => {
  addUserWin.close();
});
// 监听打开userDetail窗口的消息
ipcMain.on('open-userDetail', () => {
  //
});
// 监听打开editUser窗口的消息
ipcMain.on('open-editUser', () => {
  //
});
// 监听关闭editUser窗口的消息
ipcMain.on('close-editUser', () => {
  //
});
