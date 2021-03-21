// All of the Node.js APIs are available in the process.
// It has the same sandbox as a Chrome extension.
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer, shell } = require('electron');
const path = require('path');
const { upgradeUser } = require('./db');

function getRadioCheckedValue(name) {
  const radios = document.getElementsByName(name);
  for (let i = 0; i < radios.length; i += 1) {
    if (radios[i].checked) {
      return radios[i].value;
    }
  }
  return radios[0].value;
}

function setRadioCheckedValue(name, data) {
  const radios = document.getElementsByName(name);
  for (let i = 0; i < radios.length; i += 1) {
    if (radios[i].value === data) {
      radios[i].setAttribute('checked', true);
      break;
    }
  }
}

async function upgradeUserTodb(id) {
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const gender = getRadioCheckedValue('gender');
  const type = getRadioCheckedValue('type');
  await upgradeUser(id, { name, age, gender, type });
}

function renderUserInfo(user) {
  document.getElementById('name').setAttribute('value', user.name);
  document.getElementById('age').setAttribute('value', user.age);
  setRadioCheckedValue('gender', user.gender);
  setRadioCheckedValue('type', user.type);
}

window.addEventListener('DOMContentLoaded', () => {});

ipcRenderer.on('getUser', async (event, user) => {
  renderUserInfo(user);
  // 监听添加数据事件
  const addDataBtn = document.getElementById('addData');
  addDataBtn.addEventListener('click', async () => {
    const userDataFolder = path.join(user.userDataPath, `./训练前`);
    shell.showItemInFolder(userDataFolder);
  });
  // 监听修改事件
  const editUserBtn = document.getElementById('submit');
  editUserBtn.addEventListener('click', async () => {
    editUserBtn.disabled = true;
    await upgradeUserTodb(user.id);
    window.close();
  });
});
