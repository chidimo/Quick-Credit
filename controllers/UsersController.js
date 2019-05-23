import generatePassword from 'password-generator';
import Model from '../models/Model';
import { InternalServerError } from '../utils/errorHandlers';
import {
    get_existing_user,
    check_user_exists,
    update_if_exists,
    check_password,
    update_pass,
    sendPassword
} from './helpers/AuthController';
import { aws_signed_url, } from './helpers/UsersController';

const users_model = new Model('users');

const UsersController = {
    reset_password: async (req, res) => {
        const { email } = req.params;
        const { current_password, confirm_new, new_pass } = req.body;

        const remember_password = (
            (current_password !== '') &&
            (new_pass !== '') &&
            (confirm_new !== '')
        );

        const clause = `WHERE email='${email}'`;
        try {
            const exists = await check_user_exists(users_model, clause, res);
            if (exists) {
                if (remember_password) {
                    const knows_pass = await check_password(
                        users_model, email, current_password, res);

                    if (knows_pass) {
                        await update_pass(users_model, new_pass, clause, res);
                        sendPassword(email, new_pass);
                        return res.status(204)
                            .json({ message: 'Password has been emailed to you.' });
                    }
                    return res.status(404)
                        .json({ error: 'You entered an incorrect password' });
                }
                const new_password = generatePassword();
                await update_pass(users_model, new_password, clause, res);
                sendPassword(email, new_password);
                return res.status(204).json({ message: 'Password has been emailed to you.' });
            }
            return res.status(404)
                .json({ error: `User with email ${email} not found` });
        }
        catch (e) { return; }
    },

    confirm_account: async (req, res) => {
        try {

            const { id } = req.params;
            const clause = `WHERE id=${req.params.id}`;
            const column = 'mailverified=true';
            update_if_exists(users_model, id, column, clause, res);
        }
        catch (e) { return; }
    },

    get_user: async (req, res) => {
        const { id } = req.params;
        const clause = `WHERE id=${id}`;
        try {
            const exists = await check_user_exists(users_model, clause, res);
            if (exists) {
                const user = await get_existing_user(users_model, res, clause);
                return res.status(200).json({ data: user });
            }
            return res.status(404)
                .json({ error: `User with id ${id} not found` });
        }
        catch (e) { return; }
    },

    verify_user: async (req, res) => {
        const { id } = req.params;
        const clause = `WHERE id=${id}`;
        const column = 'status=\'verified\'';
        try {
            update_if_exists(users_model, id, column, clause, res);
        }
        catch (e) { return; }
    },

    get_users: async (req, res) => {
        const { status } = req.query;
        const rows = `id, email, firstname, lastname, 
            phone, status, address, mailverified`;
        try {
            let data;
            if (status) {
                data = await users_model.select(
                    rows, `WHERE status='${status}'`
                );
            }
            else { data = await users_model.select(rows); }
            return res.status(200).json({ data: data.rows });
        }
        catch (e) { return InternalServerError(res, e); }
    },

    update_user_profile: async (req, res) => {
        const { id } = req.params;
        const { firstname, lastname, phone, home, office } = req.body;
        const clause = `WHERE id=${id}`;
        try {

            const exists = await check_user_exists(users_model, clause, res);
            if (exists) {
                await users_model.update(
                    `firstname='${firstname}', lastname='${lastname}', 
                    phone='${phone}', 
                    address='{"home": "${home}", "office": "${office}"}'`,
                    clause
                );
                const user = await get_existing_user(users_model, res, clause);
                return res.status(200).json({ data: user });
            }
            return res.status(404)
                .json({ error: `User with id ${id} not found` });
        }
        catch (e) { return; }
    },

    get_aws_signed_url: (req, res) => {
        const { id } = req.params;
        const { filetype } = req.body;
        const signed_url = aws_signed_url(id, filetype);
        return res.status(200).json({ signed_url });
    },

    update_photo_url: async (req, res) => {
        const { id } = req.params;
        const { photo_url } = req.body;
        const clause = `WHERE id=${id}`;
        try {

            const exists = await check_user_exists(users_model, clause, res);
            if (exists) {
                await users_model.update(`photo='${photo_url}'`, clause);
                const user = await get_existing_user(users_model, res, clause);
                return res.status(200).json({ data: user });
            }
            return res.status(404)
                .json({ error: `User with id ${id} not found` });
        }
        catch (e) { return; }

    }
};

export default UsersController;
