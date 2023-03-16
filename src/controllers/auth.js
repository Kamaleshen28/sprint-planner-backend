const userServices = require('../services/auth');

const createUser = async (req, res) => {
  try {
    const { username, password} = req.body;
    const result = await userServices.createUser(username, password);
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await userServices.login(username, password);
    res.status(200).json(result);
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createUser,
  login,
};