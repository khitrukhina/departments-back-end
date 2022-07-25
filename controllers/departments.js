const Department = require('../models/department.model');

exports.getDepartments = (req, res) => {
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
    })
    .catch(() => {
      res.status(500).json('Error occurred!');
    });
};

exports.createDepartment = (req, res) => {
  const department = new Department({
    name: req.body.name,
    description: req.body.description,
    headOfDepartment: req.body.headOfDepartment,
    creator: req.userData.userId,
  });
  department
    .save()
    .then(() => {
      res.status(201).send();
    })
    .catch(() => {
      res.status(500).json('Error occurred!');
    });
};

exports.deleteDepartment = (req, res) => {
  Department.deleteOne({
    _id: req.params.id,
    creator: req.userData.userId,
  })
    .then((result) => {
      if (!result.deletedCount) {
        throw new Error();
      }
      return result;
    })
    .catch(() => {
      res.status(400).json('You have no rights to delete this department.');
    })
    .then(() => {
      res.status(204).send();
    });
};

exports.getDepartment = (req, res) => {
  Department.findById(req.params.id)
    .then((department) => {
      res.status(200).json({
        id: department._id,
        name: department.name,
        description: department.description,
        headOfDepartment: department.headOfDepartment,
        creator: department.creator,
      });
    })
    .catch(() => {
      res.status(500).json('Error occurred!');
    });
};

exports.updateDepartment = (req, res) => {
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
        throw new Error();
      }
      res.status(202).send();
    })
    .catch(() => {
      res.status(400).json('You have no rights to update this department.');
    });
};
