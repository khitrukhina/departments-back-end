const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Department = require('./models/department.model');

const app = express();
mongoose.connect('mongodb+srv://ykhitrukhina:odaiti83@cluster0.sirvxsj.mongodb.net/node-angular?retryWrites=true&w=majority')
    .catch(() => console.log('Connection failed'));

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE, PUT');
    next();
})

app.get('/api/departments', (req, res, next) => {
    Department.find()
        .then(departments => {
            res.status(200).json(departments);
        });
    
});

app.post('/api/departments', (req, res, next) => {
    const department = new Department({
        name: req.body.name,
        description: req.body.description,
        headOfDepartment: req.body.headOfDepartment
    });
    post.save();
    res.status(201).send();
});

app.delete('/api/departments/:id', (req, res, next) => {
    Department.deleteOne({ _id: req.params.id })
        .then(() => {
            res.status(204).send();
        });
});

app.get('/api/departments/:id', (req, res, next) => {
    Department.findById(req.params.id )
        .then(department => {
            res.status(200).json(department);
        });
});

app.put('/api/departments/:id', (req, res, next) => {
    const department = new Department({
        _id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        headOfDepartment: req.body.headOfDepartment
    });

    Department.updateOne({ _id: req.params.id }, department)
        .then(() => {
            res.status(202).send();
        });
})

module.exports = app;