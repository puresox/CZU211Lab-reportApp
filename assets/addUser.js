// All of the Node.js APIs are available in the process.
// It has the same sandbox as a Chrome extension.
// eslint-disable-next-line import/no-extraneous-dependencies
const { addUser } = require('../db');

function addUserTodb() {
  const name = document.getElementById('name').value;
  addUser(name);
}

window.addEventListener('DOMContentLoaded', () => {
  // 监听提交事件
  const addUserBtn = document.getElementById('submit');
  addUserBtn.addEventListener('click', () => {
    addUserBtn.disabled = true;
    addUserTodb();
    window.close();
  });
});
