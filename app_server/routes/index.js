const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

router
  .get('/', ctrlUsers.homelist)
  .get('/users', ctrlUsers.newUser)
  .post('/users', ctrlUsers.forkUser)
  .get('/users/:userid', ctrlUsers.userInfo)
  // .put('/users/:userid', ctrlUsers.updateUser)
  .post('/users/:userid', ctrlUsers.deleteUser)


module.exports = router;
