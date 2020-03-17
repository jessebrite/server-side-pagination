const express = require('express');
const router = express.Router();
const ctrlUsers = require('../controllers/users');

router
  .get('/', ctrlUsers.homelist)
  .get('/users', ctrlUsers.newUser)
  .post('/users', ctrlUsers.forkUser)
  .get('/users/:userid', ctrlUsers.userInfo)
  .post('/users/:userid', ctrlUsers.updateUser)
  .delete('/users/:userid', ctrlUsers.deleteUser)


module.exports = router;
