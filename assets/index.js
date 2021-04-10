// All of the Node.js APIs are available in the process.
// It has the same sandbox as a Chrome extension.
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const { getUsers, delUserById } = require('./db');

// 显示数据存储路径
function renderPath(appDataPath) {
  const pathArea = document.getElementById('appDataPath');
  pathArea.textContent = appDataPath;
}
// 渲染模板
function renderUserRaws(users) {
  const userRawsArea = document.getElementById('userRawsArea');
  const template = document.getElementById('userRawTemplate'); // 获取template
  const templateContent = template.content; // 获取template里的内容（不包括template）
  users.forEach((user) => {
    const userRaw = document.importNode(templateContent, true); // 创建模板实列的副本
    const tds = userRaw.querySelectorAll('td');
    tds[0].textContent = user.id;
    tds[1].textContent = user.name;
    tds[2].textContent = user.age;
    tds[3].textContent = user.gender;
    tds[4].textContent = user.type;
    tds[5].textContent = user.calcState;
    if (user.calcState === '未计算') {
      tds[5].style.color = '#ff5050';
    } else if (user.calcState === '计算中') {
      tds[5].style.color = '#3366ff';
    } else {
      tds[5].style.color = '#00ff99';
    }
    // 监听计算事件
    const calcButton = userRaw.querySelector('button[name="calc"]');
    if (user.calcState !== '未计算') {
      calcButton.textContent = '重新计算';
    }
    calcButton.title = '计算需要至少几个小时';
    calcButton.addEventListener('click', async () => {
      calcButton.disabled = true;
      tds[5].textContent = '计算中';
      tds[5].style.color = '#3366ff';
      ipcRenderer.send('calcIndicators', user);
    });
    // 监听查看被试事件
    const detailButton = userRaw.querySelector('button[name="detail"]');
    if (user.calcState === '未计算') {
      detailButton.disabled = true;
      detailButton.title = '请先计算';
    }
    detailButton.addEventListener('click', () => {
      ipcRenderer.send('open-userDetail', user);
    });
    // 监听管理被试事件
    const manageButton = userRaw.querySelector('button[name="manage"]');
    manageButton.addEventListener('click', () => {
      ipcRenderer.send('open-editUser', user);
    });
    // 监听删除被试事件
    const delButton = userRaw.querySelector('button[name="del"]');
    delButton.addEventListener('click', async () => {
      await delUserById(user.id);
      window.location.reload();
    });
    userRawsArea.append(userRaw); // 先修改userRaw再append，append后无法修改userRaw
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  // 异步执行获取appDataPath，无需await
  ipcRenderer.invoke('getSetting', 'appDataPath').then((value) => {
    // 显示数据存储路径
    renderPath(value);
  });
  // 监听添加被试事件
  const addUserBtn = document.getElementById('addUser');
  addUserBtn.addEventListener('click', () => {
    ipcRenderer.send('open-addUser');
  });
  // 监听刷新事件
  const reloadBtn = document.getElementById('reload');
  reloadBtn.addEventListener('click', () => {
    window.location.reload();
  });
  // 监听修改路径事件
  const editPathBtn = document.getElementById('editPath');
  editPathBtn.addEventListener('click', async () => {
    const newAppDataPath = await ipcRenderer.invoke('selectAppDataPath');
    if (newAppDataPath) {
      ipcRenderer.send('setSetting', 'appDataPath', newAppDataPath);
      // 不需要刷新
    }
  });
  // 生成用户列表
  const users = await getUsers();
  renderUserRaws(users);
});
window.onfocus = () => {
  window.location.reload();
};
