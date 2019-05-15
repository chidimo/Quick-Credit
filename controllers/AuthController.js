import bcrypt from 'bcrypt';

import Model from '../models/Model';
import { InternalServerError, CriticalError } from '../utils/errorHandlers';
import { dev_logger } from '../utils/loggers';

// import { dev_logger, test_logger } from '../utils/loggers';

const users_model = new Model('users');

const AuthController = {
    signup: (req, res) => {
        const { email, password } = req.body;
        const hashedPassword = bcrypt.hashSync(password, 8);
        dev_logger(`token: ${req.token}`);

        // check if user exists
        const check_user_existence = async (email) => {
            try {
                const { rows } = await users_model.select(
                    'id, email', `email='${email}'`);
                const [ user, ] = rows;
                if (user) return user;
            }
            catch (e) { return InternalServerError(req, res, e);}
        };

        // add user to db
        const create_user = async (email, password) => {
            try {
                await users_model.insert('(email, password)',
                    `'${email}', '${password}'`);                    
            }
            catch (e) { return InternalServerError(req, res, e);}
        };

        const get_new_user = async (email) => {
            try {
                const { rows } = await users_model.select(
                    `id, email, password, firstname,
                    lastname, phone, status, address`,
                    `email='${email}'`);

                if (rows.length === 0) {
                    // user was not found.
                    // This is highly unlikely but should be handled
                    return CriticalError(
                        res, 'A supposedly created user is missing');
                }
                return res
                    .status(201)
                    .json({ data: { ...rows[0], token: req.token } });
            }
            catch (e) { return InternalServerError(req, res, e);}
        };

        (async () => {
            const user = await check_user_existence(email);
            dev_logger(`users******** ${user}`);
            if (user) {
                return res
                    .status(404)
                    .json({ error: `User with email ${email} already exists` });
            }
            await create_user(email, hashedPassword);
            return get_new_user(email);
        })();
    },
    
    signin: (req, res) => {
        const { email } = req.body;
        (async () => {
            try {
                const { rows } = await users_model.select(
                    `id, email, password, firstname,
                    lastname, phone, status, address`,
                    `email='${email}'`
                );
                const [ user, ] = rows;
                if (!user) {
                    return res
                        .status(404)
                        .json({ error: `User with email ${email} not found` });
                }
                // token verification takes care of identifying the user
                return res
                    .status(200)
                    .json({ data: { ...rows[0], token: req.token } });
            }
            catch (e) { return InternalServerError(req, res, e); }
        })();
    },
};

export default AuthController;
