const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');
const extractFile = require('../middleware/file');
const EmployeesController = require('../controllers/employees');

router.get('/:id/employees', checkAuth, EmployeesController.getEmployees);

router.post('/:departmentId/employees', checkAuth, extractFile, EmployeesController.createEmployee);

router.delete('/:departmentId/employees/:id', checkAuth, EmployeesController.deleteEmployee);

router.get('/:departmentId/employees/:id', checkAuth, EmployeesController.getEmployee);

router.put('/:departmentId/employees/:id', checkAuth, extractFile, EmployeesController.updateEmployee);

module.exports = router;
