var express = require('express');
var router = express.Router();
const ctrlUsers = require('../controllers/users');
const ctrlStudents = require('../controllers/students');
const ctrlAuth = require('../controllers/authentication');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Pagination' });
});

/* GET users listing. */
router
  .get('/users', ctrlUsers.getAll)
  .post('/users', ctrlUsers.validate('validation'), ctrlUsers.createOne)
  .get('/users/:userid', ctrlUsers.getOne)
  .put('/users/:userid', ctrlUsers.validate('validation'), ctrlUsers.updateOne)
  .delete('/users/:userid', ctrlUsers.deleteOne)

  // Students router
router
  .get('/students', ctrlStudents.getStudents)
  .post('/students', ctrlStudents.validate('createStudent'), ctrlStudents.createStudent)
  .get('/students/:studentid', ctrlStudents.retrieveOneStudent)
  .put('/students/:studentid', ctrlStudents.updateStudent)
  .delete('/students/:studentid', ctrlStudents.removeStudent)
  .post('/register', ctrlAuth.register)
  .post('/login', ctrlAuth.login)

module.exports = router;
