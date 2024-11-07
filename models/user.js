const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    user_id:{
        type: Number,
        require: true
    },
    username:{
        type:String,
        require:true,
        unique: true
    },
    password:{
        type:String,
        require: true
    }
  });

  const user  = mongoose.model("user", userSchema)
  module.exports = user