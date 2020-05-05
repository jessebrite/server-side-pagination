const passport = require("passport");
const mongoose = require("mongoose");
const Member = mongoose.model("Member");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(404)
      .json({ message: "All fields are required. Please try again" });
  }

  let existingUser = await Member.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "Email already exists. Choose a new email" });
  }

  const member = new Member();
  member.name = name;
  (member.email = email), member.setPassword(password);
  member.save(err => {
    if (err) {
      return res.status(400).json({ message: "Error encountered" });
    } else {
      const token = member.generateJwt();
      return res.status(201).json({ token });
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(404).json({ message: "All fields are required" });
  }
  passport.authenticate("local", (err, user, info) => {
    let token;
    if (err) {
      return res.status(400).json(err);
    } else if (!user) {
      return res.status(400).json(info);
    } else {
      token = user.generateJwt();
      return res.status(200).json({ token });
    }
  })(req, res);
};

module.exports = {
  register,
  login
};
