const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const createUser = (username, password) => {
  const user = User.findOne({ where: { username } });
  if (user) {
    throw new Error('user already exists');
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = User.create({ username, hashedPassword });
  return result;
};

const login = async (username, password) => {
  const result = await User.findOne({ where: { username } });
  if (!result) {
    throw new Error('user not found');
  }
  const comparePassword = bcrypt.compare(password, result.password);
  if (!comparePassword) {
    throw new Error('wrong password');
  }

  const token = jwt.sign({ username }, 'secret', { expiresIn: '1d' });
  return token;
};

module.exports = {
  createUser,
  login,
};
