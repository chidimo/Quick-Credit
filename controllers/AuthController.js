import Model from '../models/Model';
import 
{ 
    check_user_exists,
    get_existing_user,
    add_user_to_db,
    check_password,
    sendSignUpMessage
} from './helpers/AuthController';

const users_model = new Model('users');

const AuthController = {
    signup: async (req, res) => {
        const { email } = req.body;
        const user_exists = await check_user_exists(
            users_model, `WHERE email='${email}'`, res);

        if (user_exists) {
            return res
                .status(409)
                .json({ error: `User with email ${email} already exists` });
        }
        try {
            const { rows } = await add_user_to_db(users_model, req, res);
            const [ { id }, ] = rows;
            const clause = `WHERE id=${id}`;
            const err_msg = `User with id ${id} not found`;
            const user = await get_existing_user(
                users_model, res, clause, err_msg);
            sendSignUpMessage(user, req);
            return res.status(201)
                .json({ data: { ...user, token: req.token } });
        }
        catch (e) { return; }
    },

    signin: async (req, res) => {
        const { email, password } = req.body;
        const clause = `WHERE email='${email}'`;
        const user_exists = await check_user_exists(
            users_model, `WHERE email='${email}'`, res
        );
        if (!user_exists) {
            return res.status(404)
                .json({ error: `User with email ${email} not found` });
        }
        const match = await check_password(users_model, email, password, res);
        if (match) {
            const user = await get_existing_user(
                users_model, res, clause);
            return res
                .status(200).json({ data: { ...user, token: req.token } });
        }
        return res.status(404).json({ error: 'Incorrect password' });
    },

    confirm_email: async (req, res) => {
        const { id } = req.params;
        try {
            const clause = `WHERE id=${id}`;
            const err_msg = `User with id ${id} not found`;
            const user = await get_existing_user(
                users_model, res, clause, err_msg);
            sendSignUpMessage(user, req);
            return res.status(200).json({ msg: 'Success' });
        }
        catch (e) { return; }

    },
};

export default AuthController;
