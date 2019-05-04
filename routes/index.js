const express = require('express');
const router = express.Router();

const auth_controller = require('../controllers/auth');
const users_controller = require('../controllers/users');
const loans_controller = require('../controllers/loans');

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

router.get('/loans', loans_controller.get_all_loans);
router.get('/loans/:id', loans_controller.get_loan);
router.get(
    '/loans?status=approved&repaid=false', loans_controller.get_all_loans);
router.get(
    '/loans?status=approved&repaid=true', loans_controller.get_all_loans);
router.post('/loans', loans_controller.create_loan);
router.patch('/loans/:id/approve', loans_controller.approve_loan);
router.patch('/loans/:id/reject', loans_controller.reject_loan);
router.get(
    '/loans/:id/repayments', loans_controller.loan_repayment_history
);
router.post('/loans/:id/repayment', loans_controller.post_repayment);

module.exports = router;
