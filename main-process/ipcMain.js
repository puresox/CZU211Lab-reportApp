// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcMain, BrowserWindow, dialog, screen } = require('electron');
const settings = require('electron-settings');
const path = require('path');

// 监听打开addUser窗口的消息
ipcMain.on('open-addUser', () => {
  let addUserWin = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
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
ipcMain.on('open-userDetail', (event, user) => {
  let userDetailWin = new BrowserWindow({
    width: 700,
    height: screen.getPrimaryDisplay().size.height,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      // preload: path.join(__dirname, '../assets/userDetail.js'),
    },
  });
  userDetailWin.webContents.on('dom-ready', () => {
    // 传递用户信息
    userDetailWin.webContents.send('getUser', user);
    // 获取打印设备
    const printers = userDetailWin.webContents.getPrinters();
    userDetailWin.webContents.send('getPrinters', printers);
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
        event.reply('selectedAppDataPath', dir);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
// 监听打印事件
ipcMain.on('print', (event, options) => {
  BrowserWindow.getFocusedWindow().webContents.print(
    options,
    (success, errorType) => {
      if (!success) console.log(errorType);
    }
  );
});
// 监听获取设置事件
ipcMain.on('getSetting', (event, key) => {
  event.reply('gottenSetting', settings.getSync(key));
});
// 监听设置设置事件
ipcMain.on('setSetting', (event, key, value) => {
  settings.setSync(key, value);
});
