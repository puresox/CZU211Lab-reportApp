// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');
const Dexie = require('dexie');

const db = new Dexie('reportApp');
db.version(1).stores({
  users: '++id,name,age,gender,type,calcState', // 性别（男/女），类型（健康/对照），计算状态（未计算，计算中，已计算）
  calcResults: '&id', // power,aia,sasi,dfa,plv,auc
});

// 获取数据存储地址
async function getAppDataPath() {
  ipcRenderer.send('getSetting', 'appDataPath');

  const appDataPath = await new Promise((resolve) => {
    ipcRenderer.on('gottenSetting', (event, value) => {
      resolve(value);
    });
  });
  return appDataPath;
}

// 删除文件夹
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

// 获取所有被试信息
async function getUsers() {
  const appDataPath = await getAppDataPath();
  const usersWithoutDataPath = await db.users.toArray();
  const usersWithDataPath = usersWithoutDataPath.map((user) => {
    const copy = { ...user };
    copy.userDataPath = path.join(appDataPath, `./${user.id}`);
    return copy;
  });
  return usersWithDataPath;
}

// 获取指定id被试信息
async function getUserById(id) {
  const user = await db.users.where('id').equals(id);
  return user;
}

// 添加被试
async function addUser(name, age, gender, type) {
  const userId = await db.users.add({
    name,
    age,
    gender,
    type,
    calcState: '未计算',
  });
  const appDataPath = await getAppDataPath();
  const userDataPath = path.join(appDataPath, `./${userId}`);
  fs.mkdirSync(userDataPath);
  fs.mkdirSync(path.join(userDataPath, './训练前'));
  fs.mkdirSync(path.join(userDataPath, './训练中'));
  fs.mkdirSync(path.join(userDataPath, './训练后'));
  fs.mkdirSync(path.join(userDataPath, './数据缓存'));
}

// 更新被试信息
async function upgradeUser(data) {
  await db.users.put(data);
}

// 删除被试和计算结果
async function delUserById(id) {
  await db.users.delete(id);
  await db.calcResults.delete(id);
  const appDataPath = await getAppDataPath();
  const userDataPath = path.join(appDataPath, `./${id}`);
  removeDir(userDataPath);
}

// 获取指定id的计算结果
async function getCalcResultById(id) {
  const calcResult = await db.calcResults.where('id').equals(id);
  return calcResult;
}

// 更新计算结果
async function upgradeCalcResults(data) {
  await db.calcResults.put(data);
}

module.exports = {
  getUsers,
  getUserById,
  addUser,
  upgradeUser,
  delUserById,
  getCalcResultById,
  upgradeCalcResults,
};
