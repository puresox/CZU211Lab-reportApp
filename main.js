// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow } = require('electron');
const path = require('path');
require('./main-process/ipcMain');
/**
 * @description 创建主窗口
 */
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, './assets/index.js'),
    },
  });
  mainWindow.loadFile(path.join(__dirname, './index.html'));
  mainWindow.on('focus', () => {
    mainWindow.reload();
  });
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
