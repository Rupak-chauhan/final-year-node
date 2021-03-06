const express = require('express');
const {loginUser, registerUser} = require('../controllers/authController');
const router = express.Router();

router.route('/signup').post(registerUser);
router.route('/login').post(loginUser);
module.exports = router;