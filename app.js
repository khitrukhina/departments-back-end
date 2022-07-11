const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const departmentsRoutes = require('./routes/departments');
const employeesRoutes = require('./routes/employees');

const app = express();
mongoose
  .connect('mongodb+srv://ykhitrukhina:odaiti83@cluster0.sirvxsj.mongodb.net/node-angular?retryWrites=true&w=majority')
  .catch(() => console.log('Connection failed'));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE, PUT');
  next();
});

app.use('/api/departments', departmentsRoutes);
app.use('/api/departments', employeesRoutes);

module.exports = app;
