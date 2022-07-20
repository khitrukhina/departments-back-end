const express = require('express');
const crypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/auth.model');
const router = express.Router();

router.post('/signup', (req, res, next) => {
  crypt.hash(req.body.credentials.password, 10).then((hash) => {
    const user = new User({
      email: req.body.credentials.email,
      password: hash,
    });
    user
      .save()
      .then(() => {
        res.status(201).send();
      })
      .catch((error) => {
        const message = error.errors?.email.properties.message;
        res.status(500).json({
          error: message,
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  let foundUser;
  User.findOne({email: req.body.credentials.email})
    .then((user) => {
      if (!user) {
        throw new Error('Authentication has failed!');
      }
      foundUser = user;
      return crypt.compare(req.body.credentials.password, user.password);
    })
    .then((result) => {
      if (!result) {
        throw new Error('Authentication has failed!');
      }
      const token = jwt.sign(
        {
          email: foundUser.email,
          userId: foundUser._id,
        },
        'secret_this_should_be_longer',
        {expiresIn: '3h'}
      );

      res.status(201).json(token);
    })
    .catch((error) => {
      res.status(401).json({error});
    });
});

module.exports = router;
