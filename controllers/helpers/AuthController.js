import bcrypt from 'bcrypt';

import { InternalServerError } from '../../utils/errorHandlers';
import { dev_logger } from '../../utils/loggers';

export const check_user_existence = async (model_instance, req, res) => {
    const { email } = req.body;
    try {
        const { rows } = await model_instance.select(
            'id, email', `WHERE email='${email}'`);
        const [ user, ] = rows;
        if (user) return user;
    }
    catch (e) { return InternalServerError(req, res, e);}
};

export const create_user = async (model_instance, req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        await model_instance.insert('(email, password)',
            `'${email}', '${hashedPassword}'`);                    
    }
    catch (e) { return InternalServerError(req, res, e);}
};

export const get_user = async (model_instance, req, res, code) => {
    const { email } = req.body;

    try {
        const { rows } = await model_instance.select(
            `id, email, password, firstname,
            lastname, phone, status, address`,
            `WHERE email='${email}'`
        );
        const [ user, ] = rows;
        if (!user) {
            return res
                .status(404)
                .json({ error: `User with email ${email} not found` });
        }
        // token verification takes care of identifying the user
        dev_logger(`conde: ${code}, type: ${typeof code}`);
        return res
            .status(code)
            .json({ data: { ...rows[0], token: req.token } });
    }
    catch (e) { return InternalServerError(req, res, e); }
};
