const httpError = require('../utils/httpError');

const userServices = require('../services/auth');

const createUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await userServices.createUser(username, password);
    res.status(201).json({
      message: 'User created successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof httpError) {
      res.status(error.code).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await userServices.login(username, password);
    console.log('REQ: ', result);
    res.status(200).json({
      message: 'User logged in successfully',
      data: {
        access_token: result,
      },
    });
  } catch (error) {
    if (error instanceof httpError) {
      res.status(error.code).json({ message: error.message });
    } else {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = {
  createUser,
  login,
};
