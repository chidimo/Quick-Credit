import { body, validationResult } from 'express-validator/check';
import { sanitizeBody } from 'express-validator/filter';

import debug from 'debug';

import users from '../utils/sample.users';

const logger = message => (debug('dev')(message));

const UsersController = {

    dashboard: (req, res) => {
        res.render( 'dashboard', { title: 'Dashboard' });
    },
    
    verify_user: (req, res) => {
        const { email } = req.params;
        const user = users.find(user => (user.email === email));
        
        if (user === undefined) {
            res.send({ status: 404, error: 'User not found' });
        }
        else {
            user.status = 'verified';
            res.send({ status: 200, data: user });
        }
    },
    
    get_users: (req, res) => {
        const { status } = req.query;
        
        if (status) {
            const data = users.filter(user => (user.status === status));
            res.send({ status: 200, data });
        }
        else {
            const data = [];
            users.map(user => data.push(user));
            res.send({ status: 200, data });
        }
    },

    get_user: (req, res) => {
        const { id } = req.params;
        const user = users.find(user => (user.id === id));
        if (user === undefined) {
            res.send({ status: 404, error: `User with id ${id} not found` });
        }
        else res.send({ status: 200, data: user });
    },

    update_user: [
        body('firstName')
            .not().isEmpty().withMessage('First name cannot be empty'),
        body('lastName')
            .not().isEmpty().withMessage('Last namecannot be empty'),
        body('phone')
            .not().isEmpty().withMessage('Phone number cannot be empty')
            .matches(/^0\d{10}$/).withMessage(
                'Wrong number format: E.G. 07012345678'),
        body('home')
            .not().isEmpty().withMessage('Home address cannot be empty'),
        body('office')
            .not().isEmpty().withMessage('Office address cannot be empty'),

        sanitizeBody('firstName').trim().escape(),
        sanitizeBody('lastName').trim().escape(),
        sanitizeBody('phone').trim().escape(),
        sanitizeBody('home').trim().escape(),
        sanitizeBody('office').trim().escape(),

        (req, res) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const { firstName, lastName, phone, home, office } = req.body;
            const user = users.find(user => (user.id === id));
                
            user.firstName = firstName;
            user.lastName = lastName;
            user.phone = phone;
            user.address.home = home;
            user.address.office = office;
                
            res.send({ status: 200, data: user });
        }
    ],
};

export default UsersController;
