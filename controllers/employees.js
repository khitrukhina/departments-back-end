const Employee = require('../models/employee.model');

exports.getEmployees = (req, res) => {
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
    })
    .catch(() => {
      res.status(500).json('Error occurred!');
    });
};

exports.createEmployee = (req, res) => {
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
    image: req.file ? `${url}/images/${req.file.filename}` : '',
    creator: req.userData.userId,
  });

  employee
    .save()
    .then(() => {
      res.status(201).send();
    })
    .catch(() => {
      res.status(500).json('Error occurred!');
    });
};

exports.deleteEmployee = (req, res) => {
  Employee.deleteOne({
    departmentId: req.params.departmentId,
    _id: req.params.id,
    creator: req.userData.userId,
  })
    .then((result) => {
      if (!result.deletedCount) {
        throw new Error();
      }
      res.status(204).send();
    })
    .catch(() => {
      res.status(400).json('You have no rights to delete that employee.');
    });
};

exports.getEmployee = (req, res) => {
  Employee.find({
    departmentId: req.params.departmentId,
    _id: req.params.id,
  })
    .then((data) => {
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
    })
    .catch(() => {
      res.status(500).json('Error occurred!');
    });
};

exports.updateEmployee = (req, res) => {
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
        throw new Error();
      }
      res.status(202).send();
    })
    .catch(() => {
      res.status(400).json('You have no rights to update that employee.');
    });
};
