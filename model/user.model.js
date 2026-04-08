const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  user_name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please enter a valid email",
    ],
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
  },


  profile: {
    type: String,
    default: "https://dummyimage.com/200x200/000/fff&text=User",
  },
  
  address: {
    type: String,
    default:null,
  },

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);