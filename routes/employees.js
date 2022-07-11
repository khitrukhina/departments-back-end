const express = require('express');
const Employee = require('../models/employee.model');

const router = express.Router();

router.get('/:id/employees', (req, res, next) => {
  Employee.find({departmentId: req.params.id}).then((employees) => {
    res.status(200).json(employees);
  });
});

router.post('/:departmentId/employees', (req, res, next) => {
  const body = req.body;
  const employee = new Employee({
    departmentId: body.departmentId,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    dateOfBirth: body.dateOfBirth,
    salary: body.salary,
  });
  employee.save();
  res.status(201).send();
});

router.delete('/:departmentId/employees/:id', (req, res, next) => {
  Employee.deleteOne({
    departmentId: req.params.departmentId,
    _id: req.params.id,
  }).then(() => {
    res.status(204).send();
  });
});

router.get('/:departmentId/employees/:id', (req, res, next) => {
  Employee.find({
    departmentId: req.params.departmentId,
    _id: req.params.id,
  }).then((employee) => {
    res.status(200).json(...employee);
  });
});

router.put('/:departmentId/employees/:id', (req, res, next) => {
  const body = req.body;
  const employee = new Employee({
    _id: req.params.id,
    departmentId: body.departmentId,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    dateOfBirth: body.dateOfBirth,
    salary: body.salary,
  });

  Employee.updateOne(
    {
      _id: req.params.id,
      departmentId: req.params.departmentId,
    },
    employee
  ).then(() => {
    res.status(202).send();
  });
});

module.exports = router;
