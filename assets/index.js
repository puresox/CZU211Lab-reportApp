// All of the Node.js APIs are available in the process.
// It has the same sandbox as a Chrome extension.
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');
// 渲染模板
function renderUserRaws(users) {
  const userRawsArea = document.getElementById('userRawsArea');
  const template = document.getElementById('userRawTemplate'); // 获取template
  const templateContent = template.content; // 获取template里的内容（不包括template）
  users.forEach((user, index) => {
    const userRaw = document.importNode(templateContent, true); // 创建模板实列的副本
    const tds = userRaw.querySelectorAll('td');
    tds[0].textContent = index;
    tds[1].textContent = user;
    userRawsArea.append(userRaw);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // 监听按钮点击事件
  const addUserBtn = document.getElementById('addUser');
  addUserBtn.addEventListener('click', () => {
    ipcRenderer.send('open-addUser');
  });

  renderUserRaws([1, 2, 3]);
});
