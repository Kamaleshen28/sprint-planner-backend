const router = require('express').Router();
const userController = require('../controllers/auth');

router.post('/signup', userController.createUser);
router.post('/login', userController.login);

module.exports = router;
