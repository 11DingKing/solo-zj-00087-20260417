var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String
  }
}, {
  timestamps: true
});

var Contact = mongoose.model("Contact", ContactSchema);
module.exports = Contact;
