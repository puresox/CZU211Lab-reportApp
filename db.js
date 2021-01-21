const Dexie = require('dexie');

const db = new Dexie('reportApp');
db.version(1).stores({ users: '++id,name,age,gender,type' });

async function getUsers() {
  const users = await db.users.toArray();
  return users;
}

async function getUserById(id) {
  const user = await db.users.where('id').equals(id);
  return user;
}

async function addUser(name, age, gender, type) {
  await db.users.add({
    name,
    age,
    gender,
    type,
  });
}

async function upgradeUser(id, name, age, gender, type) {
  await db.users.put({ id, name, age, gender, type });
}

async function delUserById(id) {
  await db.users.delete(id);
}

module.exports = { getUsers, getUserById, addUser, delUserById, upgradeUser };
