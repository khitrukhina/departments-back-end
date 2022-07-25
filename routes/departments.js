const express = require('express');
const router = express.Router();

const DepartmentsController = require('../controllers/departments');
const checkAuth = require('../middleware/check-auth');

router.get('', DepartmentsController.getDepartments);

router.post('', checkAuth, DepartmentsController.createDepartment);

router.delete('/:id', checkAuth, DepartmentsController.deleteDepartment);

router.get('/:id', checkAuth, DepartmentsController.getDepartment);

router.put('/:id', checkAuth, DepartmentsController.updateDepartment);

module.exports = router;
