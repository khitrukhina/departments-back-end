const express = require('express');
const Department = require('../models/department.model');

const router = express.Router();

router.get('', (req, res, next) => {
  Department.find().then((departments) => {
    res.status(200).json(departments);
  });
});

router.post('', (req, res, next) => {
  const department = new Department({
    name: req.body.name,
    description: req.body.description,
    headOfDepartment: req.body.headOfDepartment,
  });
  department.save();
  res.status(201).send();
});

router.delete('/:id', (req, res, next) => {
  Department.deleteOne({_id: req.params.id}).then(() => {
    res.status(204).send();
  });
});

router.get('/:id', (req, res, next) => {
  Department.findById(req.params.id).then((department) => {
    res.status(200).json(department);
  });
});

router.put('/:id', (req, res, next) => {
  const department = new Department({
    _id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    headOfDepartment: req.body.headOfDepartment,
  });

  Department.updateOne({_id: req.params.id}, department).then(() => {
    res.status(202).send();
  });
});

module.exports = router;
