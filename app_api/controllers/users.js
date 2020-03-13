const mongoose = require('mongoose');
const Users = mongoose.model('Users');

const getAll = async (req, res) => {
  const pageNo = (typeof req.query.pageNo === "undefined") ? 1 : parseInt(req.query.pageNo);
  const size = (typeof req.query.size === "undefined") ? 1 : parseInt(req.query.size);
  let query = {}
  if (pageNo <= 0) {
    return res.status(400).json({
      message: {error: true, message: 'Yawa pae heavy!'}
    });
  }

  query.skip = size * (pageNo - 1);
  query.limit = size;
  try {
    const totalCount = await Users.countDocuments();
    const pageTotal = Math.ceil(totalCount / size);
    const users = await Users.find({}, {}, query);
    if (users !== null) {
      return res.status(200).json({ error: false, message: users, "Total Pages": pageTotal })
    } else {
      return res.status(400).json({ error: true, message: "OOps! No users were found" })
    }
  } catch (err) {
    res.status(400).send(err);
  }
};

const getOne = async (req, res) => {
  try {
    const id = req.params.userid;
    const user = await Users.findById(id);
    if (user !== null) {
    return res.status(200).json({ error: false, status:"User found", message:user });
  }
    return res.status(400).json({ error: true, status: "invalid input", message: "no such user" });
  } catch(error) {
      return res.status(400).send(error);
  }
};

const updateOne = async (req, res) => {
  const id = req.params.userid;
  const { first_name, last_name, email, gender, ip_address } = req.body;
  const queryText = { first_name, last_name, email, gender, ip_address };

  try {
    let user = await Users.findByIdAndUpdate(id, queryText);
    if (!queryText.first_name || !queryText.last_name || queryText.email
        || !queryText.gender || !queryText.ip_address) {
      return res.status(400).json({ error: true, status: "All fields are required", message: user });
    }
    if (user !== null) {
      console.log('Update success!', user);
      return res.status(200).json({ error: false, status: 'Update success', message: user});
    }
  } catch (error) {
    console.log('Error');
    return res.status(400).send(error);
  }
}

const createOne = async (req, res) => {
  const { first_name, last_name, email, gender, ip_address } = req.body;
  const queryText = { first_name, last_name, email, gender, ip_address };

  try {
    const user = await Users.create(queryText);

    if (!queryText.first_name || !queryText.last_name || !queryText.email
        || !queryText.gender || !queryText.ip_address) {
      return res.status(400).json({ eror: true, status: 'All fields are required' });
    }
    else if (user !== null) {
      console.log('Creation success!');
      return res.status(201).json({ error: false, status: 'User created', message: user });
    }
    return res.status(400).json({ error: true, status: 'Error creating user',  message: user });
  }
  catch (error) {
    res.status(400).send(error);
  }
}

const deleteOne = async (req, res) => {
  const id = req.params.userid;
  try {
    const user = await Users.findByIdAndDelete(id);
    if (user !== null) {
      if (req.params || id) {
        return res.status(200).json({ error: false, status: 'User killed', message: user  });
      } else {
        return res.status(400).json({ error: true, status: 'Problem with the requested param' });
      }
    }
    return res.status(200).json({ error: true, status: 'User  not found'})
  } catch (err) {
    return res.status(400).send(err);
  }
}

module.exports = {
  getOne,
  getAll,
  updateOne,
  createOne,
  deleteOne,
}
