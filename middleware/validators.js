import { body, validationResult } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

// import { dev_logger } from '../utils/loggers';

const ParamterValidators = {
    emailValidator: [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        sanitizeBody('email').trim().escape(),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            return next();
        }
    ],

    passwordValidator: [
        body('password')
            .not().isEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).trim()
            .withMessage('Password must be at least 8 characters')
            .isLength({ max: 16 })
            .withMessage('Password must be at most 16 characters')
            .isAlphanumeric().withMessage('Password must be alphanumeric'),
        sanitizeBody('password').trim().escape(),
        sanitizeBody('confirm_password').trim().escape(),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            return next();
        }
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

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            return next();
        }
    ],

    updateProfileValidator: [
        body('firstname')
            .not().isEmpty().withMessage('First name cannot be empty'),
        body('lastname')
            .not().isEmpty().withMessage('Last namecannot be empty'),
        body('phone')
            .not().isEmpty().withMessage('Phone number cannot be empty')
            .matches(/^0\d{10}$/).withMessage(
                'Wrong number format: E.G. 07012345678'),
        body('home')
            .not().isEmpty().withMessage('Home address cannot be empty'),
        body('office')
            .not().isEmpty().withMessage('Office address cannot be empty'),

        sanitizeBody('firstname').trim().escape(),
        sanitizeBody('lastname').trim().escape(),
        sanitizeBody('phone').trim().escape(),
        sanitizeBody('home').trim().escape(),
        sanitizeBody('office').trim().escape(),

        (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            return next();
        }
    ]
};

export default ParamterValidators;
