const express = require('express');
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');
const Employee = require('../models/employee.model');

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};
const storage = multer.diskStorage({
  /* when multer saves a file */
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    const error = isValid ? null : new Error('Invalid mime type');

    cb(error, 'images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, `${name}-${Date.now()}.${ext}`);
  },
});

router.get('/:id/employees', checkAuth, (req, res, next) => {
  const params = req.query;
  const page = +params.page;
  const size = +params.size;
  let employees;

  Employee.find({departmentId: req.params.id})
    .skip(page * size)
    .limit(size)
    .then((data) => {
      employees = data;

      return Employee.count();
    })
    .then((count) => {
      res.status(200).json({
        content: employees.map((employee) => {
          return {
            id: employee._id,
            departmentId: employee.departmentId,
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            password: employee.password,
            dateOfBirth: employee.dateOfBirth,
            salary: employee.salary,
            image: employee.image,
            creator: employee.creator,
          };
        }),
        totalCount: count,
      });
    });
});

router.post('/:departmentId/employees', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  const body = req.body;
  const url = `${req.protocol}://${req.get('host')}`;
  const employee = new Employee({
    departmentId: body.departmentId,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    dateOfBirth: body.dateOfBirth,
    salary: body.salary,
    image: `${url}/images/${req.file.filename}`,
    creator: req.userData.userId,
  });

  employee.save();
  res.status(201).send();
});

router.delete('/:departmentId/employees/:id', checkAuth, (req, res, next) => {
  Employee.deleteOne({
    departmentId: req.params.departmentId,
    _id: req.params.id,
    creator: req.userData.userId,
  })
    .then((result) => {
      if (!result.deletedCount) {
        throw new Error('You have no rights to delete that employee.');
      }
      res.status(204).send();
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

router.get('/:departmentId/employees/:id', checkAuth, (req, res, next) => {
  Employee.find({
    departmentId: req.params.departmentId,
    _id: req.params.id,
  }).then((data) => {
    const employee = data[0];
    res.status(200).json({
      id: employee._id,
      departmentId: employee.departmentId,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      password: employee.password,
      dateOfBirth: employee.dateOfBirth,
      salary: employee.salary,
      image: employee.image,
      creator: employee.creator,
    });
  });
});

router.put('/:departmentId/employees/:id', checkAuth, multer({storage: storage}).single('image'), (req, res, next) => {
  const body = req.body;
  let image = body.image;

  if (req.file) {
    const url = `${req.protocol}://${req.get('host')}`;
    image = `${url}/images/${req.file.filename}`;
  }

  const employee = new Employee({
    _id: req.params.id,
    departmentId: body.departmentId,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    dateOfBirth: body.dateOfBirth,
    salary: body.salary,
    image,
    creator: req.userData.userId,
  });

  Employee.updateOne(
    {
      _id: req.params.id,
      departmentId: req.params.departmentId,
      creator: req.userData.userId,
    },
    employee
  )
    .then((result) => {
      if (!result.modifiedCount) {
        throw new Error('You have no rights to update that employee.');
      }
      res.status(202).send();
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

module.exports = router;
