/* eslint-disable import/no-extraneous-dependencies */
const XLSX = require('xlsx');
const settings = require('electron-settings');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const appDataPath = settings.getSync('appDataPath');

function removeDir(dir) {
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

function getUsers() {
  const userDirs = fs.readdirSync(appDataPath, { withFileTypes: true });
  const users = [];
  userDirs.forEach((userDir) => {
    if (userDir.isDirectory()) {
      const userDataPath = path.join(appDataPath, `./${userDir.name}`);
      const [userName] = userDir.name.split('_');
      const wb = XLSX.readFile(path.join(userDataPath, `./${userName}.xlsx`));
      const ws = wb.Sheets[wb.SheetNames[0]];
      users.push({
        id: userDir.name,
        name: userName,
        age: ws.A1.v,
        gender: ws.A2.v,
        type: ws.B1.v,
        userDataPath,
      });
    }
  });
  return users;
}

function getUserById(id) {
  //
}

function addUser(name) {
  const userDataPath = path.join(appDataPath, `./${name}_${uuidv4()}`);
  fs.mkdirSync(userDataPath);
  fs.mkdirSync(path.join(userDataPath, './训练前'));
  fs.mkdirSync(path.join(userDataPath, './训练中'));
  fs.mkdirSync(path.join(userDataPath, './训练后'));
  const xlsxData = [
    ['姓名', '年龄', '性别（男/女）', '类型（健康/对照）'],
    [name],
  ];
  const ws = XLSX.utils.aoa_to_sheet(xlsxData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '被试信息');
  XLSX.writeFile(wb, path.join(userDataPath, `./${name}.xlsx`));
}

function upgradeUser(id, name) {
  //
}

function delUserById(id) {
  const userDataPath = path.join(appDataPath, `./${id}`);
  removeDir(userDataPath);
}

module.exports = { getUsers, getUserById, addUser, delUserById, upgradeUser };
