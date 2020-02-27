import { body } from 'express-validator';
import { sanitizeBody } from 'express-validator';
import validate_error_or_next from './validate_error_or_next';
import titlecase from 'titlecase';

const validate_password = field => (
    body(field)
        .not().isEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).trim()
        .withMessage('Password must be at least 8 characters')
        .isLength({ max: 16 })
        .withMessage('Password must be at most 16 characters')
        .isAlphanumeric().withMessage('Password must be alphanumeric')
);

const validate_name = field => (
    body(field)
        .not().isEmpty().withMessage(`${titlecase(field)} is required`)
);

const UsersValidators = {
    emailValidator: [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        sanitizeBody('email').trim().escape(),
        validate_error_or_next
    ],

    passwordValidator: [
        validate_password('password'),
        sanitizeBody('password').trim().escape(),
        sanitizeBody('confirm_password').trim().escape(),
        validate_error_or_next
    ],

    confirmPasswordValidator: [
        body('confirm_password')
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error(
                        'Password confirmation does not match password'
                    );
                }
                else return value;
            }),
        validate_error_or_next
    ],

    newPasswordValidator: [    
        validate_password('current_password')
            .optional({ checkFalsy: true })
            .custom((value, { req }) => {
                if (req.body.new_pass !== req.body.confirm_new) {
                    throw new Error(
                        'Password confirmation does not match password'
                    );
                }
                if (!req.body.new_pass) {
                    throw new Error('Please enter a new password');
                }
                else return value;
            }),
        validate_password('new_pass')
            .optional({ checkFalsy: true }),
        validate_password('confirm_new')
            .optional({ checkFalsy: true }),
        validate_error_or_next
    ],

    updateProfileValidator: [
        validate_name('firstname'),
        validate_name('lastname'),
        body('phone')
            .not().isEmpty().withMessage('Phone number is required')
            .matches(/^0\d{10}$/).withMessage(
                'Wrong number format: E.G. 07012345678'),
        body('home')
            .not().isEmpty().withMessage('Home address is required'),
        body('office')
            .not().isEmpty().withMessage('Office address is required'),

        sanitizeBody('firstname').trim().escape(),
        sanitizeBody('lastname').trim().escape(),
        sanitizeBody('phone').trim().escape(),
        sanitizeBody('home').trim().escape(),
        sanitizeBody('office').trim().escape(),
        validate_error_or_next
    ]
};

export default UsersValidators;
