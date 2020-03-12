var express = require('express');
var router = express.Router();
const ctrlUsers = require('../controllers/users');
const ctrlStudents = require('../controllers/students');
const { check, validationResult } = require('express-validator')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET users listing. */
router
  .get('/users', ctrlUsers.getAll)
  .post('/users', ctrlUsers.createOne)
  .get('/users/:userid', ctrlUsers.getOne)
  .put('/users/:userid', ctrlUsers.updateOne)
  .delete('/users/:userid', ctrlUsers.deleteOne)

  // Students router
  router
    .get('/students', ctrlStudents.getStudents)
    .post('/students', ctrlStudents.validate('createStudent'), ctrlStudents.createStudent)
    .get('/students/:studentid', ctrlStudents.retrieveOneStudent)
    .put('/students/:studentid', ctrlStudents.updateStudent)
    .delete('/students/:studentid', ctrlStudents.removeStudent)

module.exports = router;
