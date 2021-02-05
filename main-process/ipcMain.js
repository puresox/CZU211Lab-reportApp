// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain, BrowserWindow, dialog, screen } = require('electron');
const path = require('path');

// 监听打开addUser窗口的消息
ipcMain.on('open-addUser', () => {
  let addUserWin;
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
  let userDetailWin;
  userDetailWin = new BrowserWindow({
    width: 700,
    height: screen.getPrimaryDisplay().size.height,
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
// 监听选择文件夹事件
ipcMain.on('selectAppDataPath', (event) => {
  dialog
    .showOpenDialog({
      properties: ['openDirectory', 'promptToCreate'],
    })
    .then(({ canceled, filePaths: [dir] }) => {
      if (!canceled && dir) {
        event.sender.send('selectedAppDataPath', dir);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
