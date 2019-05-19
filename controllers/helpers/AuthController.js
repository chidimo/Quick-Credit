import bcrypt from 'bcrypt';

import { InternalServerError } from '../../utils/errorHandlers';

export const check_user_existence = async (model_instance, email, res) => {
    try {
        const { rows } = await model_instance.select(
            'id, email', `WHERE email='${email}'`);
        const [ user, ] = rows;
        
        if (user) return user;
    }
    catch (e) { return InternalServerError(null, res, e);}
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
    catch (e) { return InternalServerError(req, res, e);}
};

export const get_user = async (model_instance, res, clause, err_msg) => {
    try {
        const { rows } = await model_instance.select(
            `id, email, firstname,
            lastname, phone, status, address`,
            clause
        );
        if (rows.length === 0) return res.status(404).json({ 
            error: err_msg
        });
        return rows[0];
    }
    catch (e) { return InternalServerError(null, res, e); }
};
