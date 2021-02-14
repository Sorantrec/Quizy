const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  login: String,
  password: String
}, { strict: false })

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;