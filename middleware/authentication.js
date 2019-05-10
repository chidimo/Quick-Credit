import { body, validationResult } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';
import jwt from 'jsonwebtoken';
// import debug from 'debug';

import users from '../utils/sample.users';

const AuthenticationMiddleware = {
    generateToken: [

        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail(),
        body('password')
            .not().isEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).trim()
            .withMessage('Password must be at least 8 characters')
            .isLength({ max: 16 })
            .withMessage('Password must be at most 16 characters')
            .isAlphanumeric().withMessage('Password must be alphanumeric')
            .custom((value, { req }) => {
                if (value !== req.body.confirm_password) {
                    throw new Error(
                        'Password confirmation does not match password'
                    );
                }
                else return value;
            }),
        sanitizeBody('email').trim().escape(),
        sanitizeBody('password').trim().escape(),
        sanitizeBody('confirm_password').trim().escape(),
        
        (req, res, next) => {

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            req.token = jwt.sign(
                req.body,
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );
            return next();
        }
    ],

    verifyToken: [
        body('email')
            .isEmail()
            .withMessage('Please provide a valid email address')
            .normalizeEmail()
            .custom((value, { req }) => {
                const { email, password } = req.body;
                const user = users.find(user => (user.email === email));
                if (user === undefined) {
                    throw new Error('User not found');
                }
                if (user.password !== password) {
                    throw new Error('Wrong password');
                }
                return value;
            }),

        body('password')
            .not().isEmpty().withMessage('Password is required')
            .isLength({ min: 8 }).trim()
            .withMessage('Password must be at least 8 characters')
            .isLength({ max: 16 })
            .withMessage('Password must be at most 16 characters')
            .isAlphanumeric().withMessage('Password must be alphanumeric'),

        sanitizeBody('email').trim().escape(),
        sanitizeBody('password').trim().escape(),
        (req, res, next) => {
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            try {
                req.user = jwt.verify(req.body.token, process.env.JWT_SECRET);
                req.token = req.body.token;
                return next();
            }
            catch (err) {
                res.status(422).json({ error: 'Invalid token' });
            }
        }
    ]
};

export default AuthenticationMiddleware;
