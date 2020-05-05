const mongoose = require("mongoose");
const Member = mongoose.model("Member");
const passport = require("passport");

const register = async (req, res) => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existingUser = await Member.findOne({ email });
  if (existingUser) {
    return res
      .status(400)
      .json({ message: "email already exists. Choose new one" });
  }

  const member = new Member();
  member.email = email;
  member.name = name;
  member.setPassword(password);
  member.save(err => {
    if (err) {
      console.log("Yawa dey");
      return status(400).json(err);
    } else {
      const token = member.generateJwt();
      return res.status(201).json({ token });
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const member = new Member();
  passport.authenticate("local", (err, user, info) => {
    let token;
    if (err) {
      return res.status(400).json(err);
    } else if (!user) {
      console.log("No user found");
      return res.status(400).json(info);
    } else {
      token = member.generateJwt();
      console.log("token dey");
      return res.status(200).json({ token });
    }
  })(req, res);
};

module.exports = {
  register,
  login
};


