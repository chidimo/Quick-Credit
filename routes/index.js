import express from 'express';

import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import LoansController from '../controllers/LoansController';

import AuthenticationMiddleware from '../middleware/authentication';
import ParamterValidators from '../middleware/validators.js';

const router = express.Router();

router.post('/auth/signup',
    AuthenticationMiddleware.generateToken,
    ParamterValidators.emailValidator,
    ParamterValidators.passwordValidator,
    ParamterValidators.confirmPasswordValidator,
    AuthController.signup
);

router.post('/auth/signin',
    AuthenticationMiddleware.verifyToken,
    ParamterValidators.passwordValidator,
    AuthController.signin
);

router.patch('/users/:id/verify', UsersController.verify_user);
router.get('/users', UsersController.get_users);
router.get('/users/:id', UsersController.get_user);
router.get('/users?status=verified', UsersController.get_users);
router.patch('/users/:id/update',
    ParamterValidators.updateProfileValidator,
    UsersController.update_user
);

router.get('/loans', LoansController.get_all_loans);
router.get('/loans/:id', LoansController.get_loan);
router.get(
    '/loans?status=approved&repaid=false', LoansController.get_all_loans);
router.get(
    '/loans?status=approved&repaid=true', LoansController.get_all_loans);
router.post('/loans', LoansController.create_loan);
router.patch('/loans/:id/approve', LoansController.approve_loan);
router.patch('/loans/:id/reject', LoansController.reject_loan);
router.get(
    '/loans/:id/repayments', LoansController.loan_repayment_history
);
router.post('/loans/:id/repayment', LoansController.post_repayment);

export default router;
