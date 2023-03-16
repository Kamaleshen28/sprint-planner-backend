const {User} = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = (username, password) => {
  const user = User.findOne({where: {username}})
  if(user) {
    throw new Error('user already exists');
  }
  password = bcrypt.hashSync(password, 10);
  const result = User.create({username, password});
  return result;
}

const login = async (username, password) => {
  const result = await User.findOne({ where: { username } });
  if(!result) {
    throw new Error('user not found');
  }
  const comparePassword = bcrypt.compare(password, result.password);
  if(!comparePassword) {
    throw new Error('wrong password');
  }

  const token = jwt.sign({ username: username}, 'secret', { expiresIn: '1d' });
  return token;
}

module.exports = {
  createUser,
  login,
};