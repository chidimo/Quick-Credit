import express from 'express';

import AuthController from '../controllers/AuthController';
import UsersController from '../controllers/UsersController';
import LoansController from '../controllers/LoansController';

import AuthenticationMiddleware from '../middleware/authentication';
import UsersValidators from '../middleware/validators.users';
import LoansValidators from '../middleware/validators.loans';

const router = express.Router();

router.post('/auth/signup',
    UsersValidators.emailValidator,
    UsersValidators.passwordValidator,
    UsersValidators.validateNames,
    UsersValidators.confirmPasswordValidator,
    AuthenticationMiddleware.generateToken,
    AuthController.signup
);

router.post('/auth/signin',
    AuthenticationMiddleware.generateToken,
    UsersValidators.passwordValidator,
    AuthController.signin
);

router.patch('/users/:id/verify', UsersController.verify_user);
router.get('/users', UsersController.get_users);
router.get('/users/:id', UsersController.get_user);
router.get('/users?status=verified', UsersController.get_users);
router.patch('/users/:id/update',
    UsersValidators.updateProfileValidator,
    UsersController.update_user_profile
);
router.get('/users/:id/photo/upload/', 
    UsersController.get_aws_signed_url
);
router.patch('/users/:id/photo/update',
    UsersController.update_photo_url
);

router.get('/loans', LoansController.get_all_loans);
router.get('/loans/:id', LoansController.get_loan);
router.get(
    '/loans?status=approved&repaid=false', LoansController.get_all_loans);
router.get(
    '/loans?status=approved&repaid=true', LoansController.get_all_loans);
router.post('/loans',
    LoansValidators.validateAmount,
    LoansValidators.validateTenor,
    LoansController.create_loan);
router.patch('/loans/:id/approve', LoansController.approve_or_reject_loan);
router.patch('/loans/:id/reject', LoansController.approve_or_reject_loan);
router.get(
    '/loans/:id/repayments', LoansController.loan_repayment_history
);
router.post('/loans/:id/repayment',
    LoansValidators.validateRepayAmount,
    LoansController.post_repayment);
router.get('/repayments', LoansController.get_all_repayments);
router.get('/repayments/:id', LoansController.get_repayment);

export default router;
