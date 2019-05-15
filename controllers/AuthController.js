import Model from '../models/Model';
// import { dev_logger } from '../utils/loggers';
import 
{ 
    check_user_existence, create_user, get_user
} from './helpers/AuthController';

const users_model = new Model('users');

const AuthController = {
    signup: (req, res) => {
        const { email } = req.body;

        (async () => {
            const user = await check_user_existence(
                users_model, req, res);

            if (user) {
                return res
                    .status(404)
                    .json({ error: `User with email ${email} already exists` });
            }
            await create_user(users_model, req, res);
            return get_user(users_model, req, res, 201);
        })();
    },
    
    signin: (req, res) => {
        (async () => {
            get_user(users_model, req, res, 200);
        })();
    },
};

export default AuthController;
