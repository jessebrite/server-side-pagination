const mongoose = require("mongoose");

// USER TIME SCHEMA
const UsersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true
  },
  ip_address: {
    type: String,
    required: true
  }
});

mongoose.model("Users", UsersSchema);
