const express = require('express');
const Department = require('../models/department.model');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get('', (req, res, next) => {
  const params = req.query;
  const page = +params.page;
  const size = +params.size;
  let departments;

  Department.find()
    .skip(page * size)
    .limit(size)
    .then((data) => {
      departments = data;

      return Department.count();
    })
    .then((count) => {
      res.status(200).json({
        content: departments.map((department) => {
          return {
            id: department._id,
            description: department.description,
            headOfDepartment: department.headOfDepartment,
            name: department.name,
            creator: department.creator,
          };
        }),
        totalCount: count,
      });
    });
});

router.post('', checkAuth, (req, res, next) => {
  const department = new Department({
    name: req.body.name,
    description: req.body.description,
    headOfDepartment: req.body.headOfDepartment,
    creator: req.userData.userId,
  });
  department.save();
  res.status(201).send();
});

router.delete('/:id', checkAuth, (req, res, next) => {
  Department.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId,
  })
    .then((result) => {
      if (!result.deletedCount) {
        throw new Error('You have no rights to delete this department.');
      }
      res.status(204).send();
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

router.get('/:id', checkAuth, (req, res, next) => {
  Department.findById(req.params.id).then((department) => {
    res.status(200).json({
      id: department._id,
      name: department.name,
      description: department.description,
      headOfDepartment: department.headOfDepartment,
      creator: department.creator,
    });
  });
});

router.put('/:id', checkAuth, (req, res, next) => {
  const department = new Department({
    _id: req.params.id,
    name: req.body.name,
    description: req.body.description,
    headOfDepartment: req.body.headOfDepartment,
    creator: req.userData.userId,
  });

  Department.updateOne(
    {
      _id: req.params.id,
      creator: req.userData.userId,
    },
    department
  )
    .then((result) => {
      if (!result.modifiedCount) {
        throw new Error('You have no rights to update this department.');
      }
      res.status(202).send();
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

module.exports = router;
