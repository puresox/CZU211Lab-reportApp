// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function getAppDataPath() {
  ipcRenderer.send('getSetting', 'appDataPath');

  const appDataPath = await new Promise((resolve) => {
    ipcRenderer.on('gottenSetting', (event, value) => {
      resolve(value);
    });
  });
  return appDataPath;
}

async function removeDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  files.forEach((file) => {
    const newPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      removeDir(newPath);
    } else {
      fs.unlinkSync(newPath);
    }
  });
  fs.rmdirSync(dir);
}

async function getUsers() {
  const appDataPath = await getAppDataPath();
  const userDirs = fs.readdirSync(appDataPath, { withFileTypes: true });
  const users = [];
  userDirs.forEach((userDir) => {
    if (userDir.isDirectory()) {
      const [xlsxName] = userDir.name.split('_');
      const userDataPath = path.join(appDataPath, `./${userDir.name}`);
      const wb = XLSX.readFile(path.join(userDataPath, `./${xlsxName}.xlsx`));
      const ws = wb.Sheets[wb.SheetNames[0]];
      users.push({
        id: userDir.name,
        name: ws.B1 ? ws.B1.v : '',
        age: ws.B2 ? ws.B2.v : '',
        gender: ws.B3 ? ws.B3.v : '',
        type: ws.B4 ? ws.B4.v : '',
        userDataPath,
      });
    }
  });
  return users;
}

async function addUser(name) {
  const appDataPath = await getAppDataPath();
  const userDataPath = path.join(appDataPath, `./${name}_${uuidv4()}`);
  fs.mkdirSync(userDataPath);
  fs.mkdirSync(path.join(userDataPath, './训练前'));
  fs.mkdirSync(path.join(userDataPath, './训练中'));
  fs.mkdirSync(path.join(userDataPath, './训练后'));
  fs.mkdirSync(path.join(userDataPath, './数据缓存'));
  const xlsxData = [
    ['姓名', name],
    ['年龄'],
    ['性别（男/女）'],
    ['类型（健康/对照）'],
  ];
  const ws = XLSX.utils.aoa_to_sheet(xlsxData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '被试信息');
  XLSX.writeFile(wb, path.join(userDataPath, `./${name}.xlsx`));
}

async function delUserById(id) {
  const appDataPath = await getAppDataPath();
  const userDataPath = path.join(appDataPath, `./${id}`);
  removeDir(userDataPath);
}

module.exports = { getUsers, addUser, delUserById };
