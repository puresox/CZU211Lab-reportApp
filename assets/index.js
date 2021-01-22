// All of the Node.js APIs are available in the process.
// It has the same sandbox as a Chrome extension.
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
const { getUsers, delUserById } = require('../db');
// 渲染模板
function renderUserRaws(users) {
  const userRawsArea = document.getElementById('userRawsArea');
  const template = document.getElementById('userRawTemplate'); // 获取template
  const templateContent = template.content; // 获取template里的内容（不包括template）
  users.forEach((user) => {
    const userRaw = document.importNode(templateContent, true); // 创建模板实列的副本
    userRaw.querySelector('tr').setAttribute('indexId', user.id);
    const tds = userRaw.querySelectorAll('td');
    tds[0].textContent = user.id;
    tds[1].textContent = user.name;
    tds[2].textContent = user.age;
    tds[3].textContent = user.gender;
    tds[4].textContent = user.type;
    // 监听查看被试事件
    const detailButton = userRaw.querySelector('button[name="detail"]');
    detailButton.addEventListener('click', () => {
      ipcRenderer.send('open-userDetail');
    });
    // 监听修改被试事件
    const editButton = userRaw.querySelector('button[name="edit"]');
    editButton.addEventListener('click', () => {
      ipcRenderer.send('open-editUser');
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
  // 监听添加被试事件
  const addUserBtn = document.getElementById('addUser');
  addUserBtn.addEventListener('click', () => {
    ipcRenderer.send('open-addUser');
  });
  // 生成用户列表
  const users = await getUsers();
  renderUserRaws(users);
});
