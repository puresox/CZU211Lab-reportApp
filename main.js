// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow } = require('electron');
const settings = require('electron-settings');
const fs = require('fs');
const path = require('path');
require('./main-process/ipcMain');
/**
 * @description 初始化设置
 */
function settingInit() {
  let appDataPath = settings.getSync('appDataPath');
  if (!appDataPath) {
    appDataPath = path.join(__dirname, './appData');
    settings.setSync('appDataPath', appDataPath);
    try {
      fs.mkdirSync(appDataPath);
    } catch (error) {
      console.log(error);
    }
  }
}
/**
 * @description 创建主窗口
 */
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, './assets/index.js'),
    },
  });
  mainWindow.loadFile(path.join(__dirname, './index.html'));
}

app.whenReady().then(() => {
  settingInit();
  createWindow();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
