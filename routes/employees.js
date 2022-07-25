const express = require('express');
const multer = require('multer');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const EmployeesController = require('../controllers/employees');

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

router.get('/:id/employees', checkAuth, EmployeesController.getEmployees);

router.post('/:departmentId/employees', checkAuth, multer({storage: storage}).single('image'), EmployeesController.createEmployee);

router.delete('/:departmentId/employees/:id', checkAuth, EmployeesController.deleteEmployee);

router.get('/:departmentId/employees/:id', checkAuth, EmployeesController.getEmployee);

router.put('/:departmentId/employees/:id', checkAuth, multer({storage: storage}).single('image'), EmployeesController.updateEmployee);

module.exports = router;
