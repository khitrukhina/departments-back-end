const crypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/auth.model');

exports.createUser = (req, res) => {
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
        res.status(500).json(message);
      });
  });
};

exports.loginUser = (req, res) => {
  let foundUser;
  User.findOne({email: req.body.credentials.email})
    .then((user) => {
      if (!user) {
        throw new Error();
      }
      foundUser = user;
      return crypt.compare(req.body.credentials.password, user.password);
    })
    .catch(() => {
      res.status(500).json('Error occurred!');
    })
    .then((result) => {
      if (!result) {
        throw new Error();
      }
      const token = jwt.sign(
        {
          email: foundUser.email,
          userId: foundUser._id,
        },
        process.env.JWT_KEY,
        {expiresIn: '1h'}
      );

      res.status(201).json(token);
    })
    .catch(() => {
      res.status(401).json('Authentication has failed!');
    });
};
