const mongoose = require('mongoose');

const departmentSchema = mongoose.Schema({
  id: String,
  name: { type: String, required: true },
  description: String,
  headOfDepartment: { type: String, required: true },
});

module.exports = mongoose.model('Department', departmentSchema);
