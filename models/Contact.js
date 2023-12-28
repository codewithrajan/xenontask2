// models/Contact.js

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: String,
  mobileNumber: String,
  email: String,
  description: String,
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = { Contact };
