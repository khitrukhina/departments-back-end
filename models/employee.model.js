const mongoose = require('mongoose');

const employeeSchema = mongoose.Schema({
  departmentId: String,
  id: String,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: String,
    required: true,
  },
  salary: {
    type: String,
    required: true,
  },
  image: String,
});

module.exports = mongoose.model('Employee', employeeSchema);
