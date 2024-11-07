const mongoose = require("mongoose");
const { Schema } = mongoose;
const date = new Date();
const hr = date.getHours();
const showTime =
  (hr > 12 ? hr - 12 : hr) +
  ":" +
  date.getMinutes() +
  (hr > 12 ? " PM" : " AM");
const messageSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, //same as foreign key
    ref: "user",
  },
  from: {
    type: String,
    default: "",
  },
  to: {
    type: String,
    default: "",
  },
  chatid: {
    type: Array,
    default: "",
  },
  message: {
    type: String,
    default: true,
  },
  time: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("messages", messageSchema);
