// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain, BrowserWindow } = require('electron');
const path = require('path');

// 监听打开addUser窗口的消息
ipcMain.on('open-addUser', () => {
  let win = new BrowserWindow({
    width: 700,
    height: 500,
    webPreferences: {
      preload: path.join(__dirname, '../assets/addUser.js'),
    },
  });

  win.on('close', () => {
    win = null;
  });
  win.loadFile(path.join(__dirname, '../sections/addUser.html'));
});
