var knex = require('./knex');

function getUsers() {
  return knex('users')
    .select('*');
}

function getSingleUser(userID) {
  return knex('users')
    .select('*')
    .where('id', parseInt(userID));
}

function getSingleUserByUsername(username) {
  return knex('users')
    .select('*')
    .where('github_username', username)
    .returning('username');
}

function addUser(obj) {
  return knex('users')
    .insert(obj)
    .returning('*');
}

function makeAdmin(username, value) {
  return knex('users')
    .update({
      admin: value
    })
    .where('github_username', username);
}

function makeActive(username, value) {
  return knex('users')
    .update({
      active: value
    })
    .where('github_username', username);
}

function updateUser(userID, obj) {
  return knex('users')
    .update(obj)
    .where('id', parseInt(userID))
    .returning('*');
}

function deactivateUser(userID) {
  return knex('users')
    .update({
      active: false
    })
    .where('id', parseInt(userID))
    .returning('*');
}

module.exports = {
  getUsers: getUsers,
  getSingleUser: getSingleUser,
  getSingleUserByUsername: getSingleUserByUsername,
  addUser: addUser,
  makeAdmin: makeAdmin,
  makeActive: makeActive,
  updateUser: updateUser,
  deactivateUser: deactivateUser
};
