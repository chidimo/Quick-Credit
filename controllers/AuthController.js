import Model from '../models/Model';
import 
{ 
    check_user_existence,
    get_user_clause,
    add_user_to_db
} from './helpers/AuthController';
// import { dev_logger } from '../utils/loggers';

const users_model = new Model('users');

const AuthController = {
    signup: async (req, res) => {
        const { email } = req.body;
        const user_exists = await check_user_existence(
            users_model, email, res);

        if (user_exists) {
            return res
                .status(404)
                .json({ error: `User with email ${email} already exists` });
        }
        const { rows } = await add_user_to_db(users_model, req, res);
        const [ { id }, ] = rows;
        const clause = `WHERE id=${id}`;
        const err_msg = `User with id ${id} does not exist.`;
        const user = await get_user_clause(users_model, res, clause, err_msg);
        return res.status(201).json({ data: { ...user, token: req.token } });
    },
    
    signin: async (req, res) => {
        const { email } = req.body;
        const clause = `WHERE email='${email}'`;
        const err_msg = `User with email ${email} does not exist.`;
        const user = await get_user_clause(users_model, res, clause, err_msg);
        return res.status(200).json({ data: { ...user, token: req.token } });
    },
};

export default AuthController;
