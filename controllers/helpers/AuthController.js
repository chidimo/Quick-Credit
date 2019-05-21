import bcrypt from 'bcrypt';

import { InternalServerError } from '../../utils/errorHandlers';

export const check_user_exists = async (model_instance, clause, res) => {
    try {
        const { rows } = await model_instance.select(
            'id, email', clause);
        const [ user, ] = rows;
        if (user) return true;
        return false;
    }
    catch (e) { throw InternalServerError(res, e);}
};

export const check_password = async (model_instance, email, password, res) => {
    try {
        const { rows } = await model_instance.select(
            'id, email, password', `WHERE email='${email}'`);
        const [ user, ] = rows;
        if (bcrypt.compareSync(password, user.password)) return true;
        return false;
    }
    catch (e) { throw InternalServerError(res, e);}
};

export const add_user_to_db = async (model_instance, req, res) => {
    const { email, password, firstname, lastname } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    try {
        return await model_instance.insert_with_return(
            '(email, firstname, lastname, password)',
            `'${email}', '${firstname}', '${lastname}', 
            '${hashedPassword}'`
        );                    
    }
    catch (e) { throw InternalServerError(res, e);}
};

export const get_existing_user = async (model_instance, res, clause) => {
    try {
        const { rows } = await model_instance.select(
            'id, email, firstname, photo, lastname, phone, status, address',
            clause
        );
        return rows[0];
    }
    catch (e) { throw InternalServerError(res, e); }
};
