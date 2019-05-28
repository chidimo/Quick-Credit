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
    UsersValidators.confirmPasswordValidator,
    AuthenticationMiddleware.generateToken,
    AuthController.signup
);

router.post('/auth/signin',
    UsersValidators.emailValidator,
    UsersValidators.passwordValidator,
    AuthenticationMiddleware.generateToken,
    AuthController.signin
);

router.get('/users',
    AuthenticationMiddleware.verifyToken,
    UsersController.get_users
);

router.get('/users/:id',
    AuthenticationMiddleware.verifyToken,
    UsersController.get_user
);

router.patch('/users/:id/verify',
    AuthenticationMiddleware.verifyToken,
    UsersController.verify_user
);

router.get('/users/:id/account/mail', AuthController.confirm_email);

router.get('/users/:id/account/confirmation',
    UsersController.confirm_account
);

router.get('/users?status=verified',
    AuthenticationMiddleware.verifyToken,
    UsersController.get_users
);

router.patch('/users/:id/update',
    AuthenticationMiddleware.verifyToken,
    UsersValidators.updateProfileValidator,
    UsersController.update_user_profile
);
router.get('/users/:id/photo/upload/',
    AuthenticationMiddleware.verifyToken,
    UsersController.get_aws_signed_url
);

router.patch('/users/:id/photo/update',
    AuthenticationMiddleware.verifyToken,
    UsersController.update_photo_url
);

router.post('/users/:email/reset_password',
    UsersValidators.newPasswordValidator,
    UsersController.reset_password    
);

router.get('/loans',
    AuthenticationMiddleware.verifyToken,
    LoansController.get_all_loans
);
router.get('/loans/:id',
    AuthenticationMiddleware.verifyToken,
    LoansController.get_loan
);
router.get('/loans?status=approved&repaid=false',
    AuthenticationMiddleware.verifyToken,
    LoansController.get_all_loans
);
router.get('/loans?status=approved&repaid=true',
    AuthenticationMiddleware.verifyToken,
    LoansController.get_all_loans
);
router.post('/loans',
    AuthenticationMiddleware.verifyToken,
    LoansValidators.validateAmount,
    LoansValidators.validateTenor,
    LoansController.create_loan
);
router.patch('/loans/:id/approve',
    AuthenticationMiddleware.verifyToken,
    LoansController.approve_or_reject_loan
);
router.patch('/loans/:id/reject',
    AuthenticationMiddleware.verifyToken,
    LoansController.approve_or_reject_loan
);
router.get('/loans/:id/repayments',
    AuthenticationMiddleware.verifyToken,
    LoansController.loan_repayment_history
);
router.post('/loans/:id/repayment',
    AuthenticationMiddleware.verifyToken,
    LoansValidators.validateRepayAmount,
    LoansController.post_repayment
);
router.get('/repayments',
    AuthenticationMiddleware.verifyToken,
    LoansController.get_all_repayments
);
router.get('/repayments/:id',
    AuthenticationMiddleware.verifyToken,
    LoansController.get_repayment
);

export default router;
