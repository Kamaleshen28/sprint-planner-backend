const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const HttpError = require('../utils/httpError');

const createUser = async (username, password) => {
  const user = await User.findOne({ where: { username } });
  if (user) {
    throw new HttpError('user already exists', 409);
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const result = await User.create({ username, password: hashedPassword });
  return {
    id: result.id,
    username: result.username,
  };
};

const login = async (username, password) => {
  const result = await User.findOne({ where: { username } });
  if (!result) {
    throw new HttpError('user not found', 404);
  }
  const comparePassword = await bcrypt.compare(password, result.password);
  if (!comparePassword) {
    throw new HttpError('wrong password', 401);
  }

  const token = await jwt.sign({ username }, 'secret', { expiresIn: '1d' });
  return token;
};

module.exports = {
  createUser,
  login,
};
