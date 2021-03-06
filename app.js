const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const departmentsRoutes = require('./routes/departments');
const employeesRoutes = require('./routes/employees');
const authRoutes = require('./routes/auth');

const app = express();
mongoose
  .connect(`mongodb+srv://ykhitrukhina:${process.env.MONGO_ATLAS_PW}@cluster0.sirvxsj.mongodb.net/node-angular?retryWrites=true&w=majority`)
  .catch(() => console.log('Connection failed'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE, PUT');
  next();
});

app.use('/api/departments', departmentsRoutes);
app.use('/api/departments', employeesRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
