const express = require('express');
const router = express.Router();

const auth_controller = require('../controllers/auth');

/* GET home page. */
router.get('/', auth_controller.index);
router.get('/about', auth_controller.about);
router.post('/auth/signup', auth_controller.signup);
router.get('/auth/signup', auth_controller.signup);
router.post('/auth/signin', auth_controller.signin);
router.get('/auth/signin', auth_controller.signin);

module.exports = router;
