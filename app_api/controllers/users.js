const mongoose = require('mongoose');
const Users = mongoose.model('Users');
const colors = require('colors');
const { body, validationResult } = require('express-validator/check'); // Using version 5.3.1

const getAll = async (req, res) => {

  // The pagination
  const data = req.query.pageNo;
  const pageNo = (typeof data === 'undefined' || data < 1) ? 1 : parseInt(data);
  let query = {};
  const total = 10;
  query.skip = (total * pageNo) - total;
  query.limit = total;

  try {
    const totalCount = await Users.countDocuments();
    const pageTotal = Math.ceil(totalCount / total);
    const users = await Users.find({}, {}, query);

    return res.status(200).json({
      error: false,
      status: users,
      total: pageTotal,
      pageNo: pageNo
    });
  } catch (error) {
    console.error('Error ', error);
    return res.status(400).send(error)
  }
};

const getOne = async (req, res) => {
  try {
    const id = req.params.userid;
    const user = await Users.findById(id);
    if (user !== null) {
    return res.status(200).json(user);
  }
    return res.status(400).json({
      error: true,
      status: "invalid input",
      message: "no such user"
    });
  } catch (error) {
      return res.status(400).send(error);
  }
};

const updateOne = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).json({ error: true, errors: errors.array() });
  }

  const id = req.params.userid;
  const { first_name, last_name, email, gender, ip_address } = req.body;
  const queryText = { first_name, last_name, email, gender, ip_address };

  try {
    let user = await Users.findByIdAndUpdate(id, queryText);
    if (!first_name || !last_name || !email || !gender || !ip_address) {
      return res.status(400).json({
        error: true,
        status: "All fields are required",
        message: user
      });
    }
    if (user !== null) {
      console.log(colors.green('Update success!'));
      return res.status(200).json({
        error: false,
        status: 'Update success',
        message: user
      });
    }
  } catch (error) {
    console.log(colors.red('Error: update failed'));
    return res.status(400).json(error);
  }
}

const createOne = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).json({ errors: errors.array() });
  }
  const { first_name, last_name, email, gender, ip_address } = req.body;
  const queryText = { first_name, last_name, email, gender, ip_address };

  try {
    const user = await Users.create(queryText);

    if (!first_name || !last_name || !email || !gender || !ip_address) {
      console.log(colors.red('All fieds dey need'));
      return res.status(400).json({
        error: true,
        status: 'All fields are required'
      });
    } else
     if (user !== null) {
      console.log('Creation success!');
      return res.status(201).json({
        error: false,
        status: 'User created',
         message: user
      });
    }
    console.error('Error ', user)
    return res.status(400).json({
      error: true,
      status: 'Error creating user',
      message: user
    });
  }
  catch (error) {
    console.log(error)
    res.status(400).send(error);
  }
}

const deleteOne = async (req, res) => {
  const id = req.params.userid;
  try {
    const user = await Users.findByIdAndDelete(id);
    if (user !== null) {
      if (req.params && id) {
        return res.status(200).json({
          error: false,
          status: 'User killed',
          message: user
        });
      } else {
        return res.status(400).json({
          error: true,
          status: 'Problem with the requested param'
        });
      }
    }
    return res.status(400).json({ error: true, status: 'User  not found'})
  } catch (err) {
    return res.status(400).send(err);
  }
}

const validate = method => {
  switch (method) {
    case 'validation': {
      return [
        body('first_name', 'First name: min 3 chars').isLength({min: 3}).trim().escape(),
        body('last_name', 'Last name: min 3 chars').isLength({min: 3}).trim().escape(),
        body('email', 'Invalid email').isEmail().normalizeEmail().trim(),
        body('gender', 'Gender is required').isAlpha().trim(),
        body('ip_address', 'IP Address is required').isIP().trim(),
      ]
    }
  }
}

module.exports = {
  getOne,
  getAll,
  updateOne,
  createOne,
  deleteOne,
  validate,
}
