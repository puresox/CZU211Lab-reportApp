const {
  ipcMain, BrowserWindow, dialog, screen, app,
// eslint-disable-next-line import/no-extraneous-dependencies
} = require('electron');
const settings = require('electron-settings');
const path = require('path');

// 监听打开addUser窗口的消息
ipcMain.on('open-addUser', () => {
  let addUserWin = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, '../assets/addUser.js'),
    },
  });
  addUserWin.on('close', () => {
    addUserWin = null;
  });
  addUserWin.loadFile(path.join(__dirname, '../sections/addUser.html'));
});
// 监听打开editUser窗口的消息
ipcMain.on('open-editUser', (event, user) => {
  let editUserWin = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      preload: path.join(__dirname, '../assets/editUser.js'),
    },
  });
  editUserWin.webContents.on('dom-ready', () => {
    // 传递用户信息
    editUserWin.webContents.send('getUser', user);
  });
  editUserWin.on('close', () => {
    editUserWin = null;
  });
  editUserWin.loadFile(path.join(__dirname, '../sections/editUser.html'));
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
ipcMain.handle('selectAppDataPath', async () => {
  const {
    canceled,
    filePaths: [dir],
  } = await dialog.showOpenDialog({
    properties: ['openDirectory', 'promptToCreate'],
  });
  if (!canceled && dir) {
    return dir;
  }
  return '';
});
// 监听打印事件
ipcMain.on('print', (event, options) => {
  BrowserWindow.getFocusedWindow().webContents.print(
    options,
    (success, errorType) => {
      if (!success) dialog.showErrorBox('错误', errorType);
    },
  );
});
// 监听获取设置事件
ipcMain.handle('getSetting', async (event, key) => settings.getSync(key));
// 监听获取是否打包事件
ipcMain.handle('isPackaged', async () => app.isPackaged);
// 监听设置设置事件
ipcMain.on('setSetting', (event, key, value) => {
  settings.setSync(key, value);
});
// 监听计算指标事件
ipcMain.on('calcIndicators', (event, user) => {
  let calcIndicatorsWin = new BrowserWindow({
    show: false,
    webPreferences: {
      preload: path.join(__dirname, '../assets/calcIndicators.js'),
    },
  });
  calcIndicatorsWin.once('ready-to-show', () => {
    // 传递用户信息
    calcIndicatorsWin.webContents.send('getUser', user);
  });
  calcIndicatorsWin.on('close', () => {
    calcIndicatorsWin = null;
  });
  calcIndicatorsWin.loadFile(path.join(__dirname, '../sections/blank.html'));
});
// 监听刷新主页事件
ipcMain.on('reloadIndex', () => {
  global.mainWindow.reload();
});
// 监听显示错误事件
ipcMain.on('showError', (event, error) => {
  dialog.showErrorBox('错误', error);
});
