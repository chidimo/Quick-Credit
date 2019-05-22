import bcrypt from 'bcrypt';
import titlecase from 'titlecase';

import { InternalServerError } from '../../utils/errorHandlers';
import sendEmail from '../../utils/sendEmail';
import { async } from 'rxjs/internal/scheduler/async';

export const sendSignUpMessage = (user, req) => {
    const path = `/users/${user.id}/account-confirmation`;
    const url = `${req.protocol}://${req.hostname}${path}`;

    const template_data = {
        firstname: titlecase(user.firstname),
        lastname: titlecase(user.lastname),
        confirm_account_link: url,
    };
    const data = {
        email: user.email,
        template_name: 'confirm_account',
    };
    sendEmail(data, template_data);
    return;
};

export const check_user_exists = async (model_instance, clause, res) => {
    try {
        const { rows } = await model_instance.select(
            'id, email', clause);
        const [ user, ] = rows;
        if (user) return true;
        return false;
    }
    catch (e) { return InternalServerError(res, e);}
};

export const check_password = async (model_instance, email, password, res) => {
    try {
        const { rows } = await model_instance.select(
            'id, email, password', `WHERE email='${email}'`);
        const [ user, ] = rows;
        if (bcrypt.compareSync(password, user.password)) return true;
        return false;
    }
    catch (e) { return InternalServerError(res, e);}
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
    catch (e) { return InternalServerError(res, e);}
};

export const get_existing_user = async (model_instance, res, clause) => {
    const select_rows = `id, email, firstname, mailverified,
        photo, lastname, phone, status, address`;
    try {
        const { rows } = await model_instance.select(
            select_rows,
            clause
        );
        return rows[0];
    }
    catch (e) { return InternalServerError(res, e); }
};

export const update_if_exists = async (model_instance, 
    id, column, clause, res) => {

    try {
        const exists = await check_user_exists(model_instance, clause, res);
        if (exists) {
            await model_instance.update(column, clause);
            const user = await get_existing_user(model_instance, res, clause);
            return res.status(200).json({ data: user });
        }
        return res.status(404)
            .json({ error: `User with id ${id} not found` });
    }
    catch (e) { return; }
};
