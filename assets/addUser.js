// All of the Node.js APIs are available in the process.
// It has the same sandbox as a Chrome extension.
const { addUser } = require('./db')

function getRadioCheckedValue (name) {
  const radios = document.getElementsByName(name)
  for (let i = 0; i < radios.length; i += 1) {
    if (radios[i].checked) {
      return radios[i].value
    }
  }
  return radios[0].value
}

async function addUserTodb () {
  const name = document.getElementById('name').value
  const age = document.getElementById('age').value
  const gender = getRadioCheckedValue('gender')
  const type = getRadioCheckedValue('type')
  await addUser(name, age, gender, type)
}

window.addEventListener('DOMContentLoaded', () => {
  // 监听提交事件
  const addUserBtn = document.getElementById('submit')
  addUserBtn.addEventListener('click', async () => {
    addUserBtn.disabled = true
    await addUserTodb()
    window.close()
  })
})
