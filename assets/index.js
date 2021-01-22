// All of the Node.js APIs are available in the process.
// It has the same sandbox as a Chrome extension.
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const { getUsers } = require('../db');
// 渲染模板
function renderUserRaws(users) {
  const userRawsArea = document.getElementById('userRawsArea');
  const template = document.getElementById('userRawTemplate'); // 获取template
  const templateContent = template.content; // 获取template里的内容（不包括template）
  users.forEach((user) => {
    const userRaw = document.importNode(templateContent, true); // 创建模板实列的副本
    const tds = userRaw.querySelectorAll('td');
    console.log(userRaw.id);
    console.log(userRaw.name);
    console.log(userRaw.querySelector('tr').id);
    userRaw.querySelector('tr').id = user.id;
    tds[0].textContent = user.id;
    tds[1].textContent = user.name;
    tds[2].textContent = user.age;
    tds[3].textContent = user.gender;
    tds[4].textContent = user.type;
    userRawsArea.append(userRaw);
  });
}

window.addEventListener('DOMContentLoaded', async () => {
  // 监听按钮点击事件
  const addUserBtn = document.getElementById('addUser');
  addUserBtn.addEventListener('click', () => {
    ipcRenderer.send('open-addUser');
  });
  // 生成用户列表
  const users = await getUsers();
  renderUserRaws(users);
});
