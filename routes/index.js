const express = require('express');
const router = express.Router();

const auth_controller = require('../controllers/auth');
const users_controller = require('../controllers/users');

/* GET home page. */
router.get('/', auth_controller.index);
router.get('/about', auth_controller.about);
router.post('/auth/signup', auth_controller.signup);
router.get('/auth/signup', auth_controller.signup);
router.post('/auth/signin', auth_controller.signin);
router.get('/auth/signin', auth_controller.signin);


router.get('/users/dashboard', users_controller.dashboard);

router.patch('/users/:email/verify', users_controller.verify_user);
router.get('/users', users_controller.get_users);
router.get('/users/:id', users_controller.get_user);
router.get('/users?status=verified', users_controller.get_users);
router.patch('/users/:id/update', users_controller.update_user);

module.exports = router;
