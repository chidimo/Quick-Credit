import Model from '../models/Model';
import 
{ 
    check_user_exists,
    get_existing_user,
    add_user_to_db,
    check_password
} from './helpers/AuthController';
// import { dev_logger } from '../utils/loggers';

const users_model = new Model('users');

const AuthController = {
    signup: async (req, res) => {
        const { email } = req.body;
        const user_exists = await check_user_exists(
            users_model, `WHERE email='${email}'`, res);

        if (user_exists) {
            return res
                .status(404)
                .json({ error: `User with email ${email} already exists` });
        }
        const { rows } = await add_user_to_db(users_model, req, res);
        const [ { id }, ] = rows;
        const clause = `WHERE id=${id}`;
        const err_msg = `User with id ${id} does not exist.`;
        const user = await get_existing_user(users_model, res, clause, err_msg);
        return res.status(201).json({ data: { ...user, token: req.token } });
    },

    signin: async (req, res) => {
        const { email, password } = req.body;
        const clause = `WHERE email='${email}'`;
        const err_msg = `User with email ${email} does not exist.`;
        // check user exists
        const match = await check_password(users_model, email, password, res);
        if (match) {
            const user = await get_existing_user(
                users_model, res, clause, err_msg);
            return res
                .status(200).json({ data: { ...user, token: req.token } });
        }
        return res.status(404).json({ error: 'Incorrect password' });
    },
};

export default AuthController;
