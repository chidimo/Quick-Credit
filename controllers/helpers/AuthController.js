import bcrypt from 'bcrypt';
import titlecase from 'titlecase';

import { InternalServerError } from '../../utils/errorHandlers';
import sendEmail from '../../utils/sendEmail';
import hashPassword from '../../utils/hashPassword';

export const sendSignUpMessage = (user, req) => {
    const path = `/users/${user.id}/account/confirmation`;
    const url = `${req.protocol}://${req.hostname}/api/v1${path}`;

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

export const sendPassword = (email, new_password) => {
    const template_data = {
        new_password,
    };
    const data = {
        email,
        template_name: 'new_password',
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
    const { email, password } = req.body;

    try {
        return await model_instance.insert_with_return(
            '(email, password)', `'${email}', '${hashPassword(password)}'`
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
            return user;
        }
        return false;
    }
    catch (e) { return; }
};

export const update_pass = async (model_instance, password, clause, res) => {
    try {
        await model_instance.update(
            `password='${hashPassword(password)}'`, clause);
    }
    catch (e) { return InternalServerError(res, e); }
};
