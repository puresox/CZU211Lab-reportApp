// All of the Node.js APIs are available in the process.
// It has the same sandbox as a Chrome extension.
// eslint-disable-next-line import/no-extraneous-dependencies
const { ipcRenderer } = require('electron');

function addUser() {
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const gender = document.getElementById('gender').value;
  const type = document.getElementById('type').value;
}

window.addEventListener('DOMContentLoaded', () => {
  const addUserBtn = document.getElementById('submit');
  addUserBtn.addEventListener('click', () => {
    addUser();
    ipcRenderer.send('close-addUser');
  });
});
