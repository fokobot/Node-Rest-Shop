const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UsersControllers = require('../controllers/users');

router.post('/signup', UsersControllers.users_signup);

router.post('/login', UsersControllers.users_login);

router.delete('/:userId', checkAuth, UsersControllers.users_delete_user);


module.exports = router;