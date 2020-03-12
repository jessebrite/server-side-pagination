const mongoose = require('mongoose');
const Students = mongoose.model('Users');
const { body, validationResult } = require('express-validator/check'); // Using version 5.3.1

const getStudents = async (req, res) => {
  const students = await Students.find().limit(5);

  try {
    if (students !== null) {
      console.log('Vim dey');
      res.status(200).json({
        status: 'Students found',
        message: students
      })
    }
  } catch (error) {
    console.log('Yawa ', error);
    res.send(error);
  }
}

const createStudent = async (req, res) => {

  const { first_name, last_name, email, gender, ip_address } = req.body;

  const queryText = { first_name, last_name, email, gender, ip_address }

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const student = await Students.create(queryText);
    if (!first_name || !last_name || !email || !gender || !ip_address) {
      return res.status(400).json({
        status: 'All fields are required'
      })
    }
    if (!student) {
      return res.status(400).json({
        status: 'Creation failed',
        message: student
      })
    } else if (student !== null) {
      return res.status(201).json({
        status: 'Student created',
        message: student
      })
    }
  } catch (error) {
    console.log('Yawa dey');
    return res.send(error);
  }
}
const retrieveOneStudent = async (req, res) => {
  try {
    const id = req.params.studentid;
    const student = await Students.findById(id);
    if (student !== null) {
      console.log('Student dey');
      res.status(200).json({
        status: 'Student retrieved',
        message: student
      });
    } else {
      console.log('Student no dey');
      res.status(400).json({
        status: 'Student not found',
        message: student
      });
    }
  } catch (error) {
    console.log('Tumor tantalabuteele');
    res.send(error);
  }
}

const updateStudent = async (req, res) => {
  const id = req.params.studentid;
  const { first_name, last_name, email, gender, ip_address } = req.body;
  const queryText = { first_name, last_name, email, gender, ip_address };

  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const student = await Students.findByIdAndUpdate(id, queryText);
    if (student !== null) {
      return res.status(200).json({
        status: 'Update success',
        message: student
      });
    } else {
      return res.status(400).json({
        status: 'Update failed',
        message: student
      });
    }
  } catch (error) {
    console.log('Heavy yawa paa!');
    return res.status(400).send(error);
  }
}

const removeStudent = async (req, res) => {
  const id = req.params.studentid;

  try {
    student = await Students.findByIdAndDelete(id);
    if (student !== null) {
      return res.status(200).json({
        status: 'Student deleted',
        message: student
      });
    } else {
      return res.status(400).json({
        status: 'Deletion failed',
        message: student
      });
    }
  } catch (error) {
    console.log('Yawa dey for delete');
    return res.status(404).send(error);
  }
}

const validate = method => {
  switch (method) {
    case 'createStudent': {
      return [
        body('first_name', 'First name: min 3 chars').isLength({min: 3}).trim(),
        body('last_name', 'Last name: min 3 chars').isLength({min: 3}).trim(),
        body('email', 'Invalid email').isEmail().trim(),
        body('gender', 'Gender is required').isAlpha().trim(),
        body('ip_address', 'IP Address is required').trim(),
       ]
    }
  }
}

module.exports = {
  getStudents,
  createStudent,
  retrieveOneStudent,
  validate,
  updateStudent,
  removeStudent
}
