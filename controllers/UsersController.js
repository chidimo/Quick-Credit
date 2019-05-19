import Model from '../models/Model';
import { InternalServerError } from '../utils/errorHandlers';
import { get_user_clause } from './helpers/AuthController';
import {
    aws_signed_url,
    update_user_photo_url
} from './helpers/UsersController';

const users_model = new Model('users');

const UsersController = {
    get_user: async (req, res) => {
        const { id } = req.params;
        const clause = `WHERE id=${id}`;
        const err_msg = `User with id ${id} not found`;
        const user = await get_user_clause(users_model, res, clause, err_msg);
        return res.status(200).json({ data: user });
    },

    verify_user: async (req, res) => {
        const { id } = req.params;
        const clause = `WHERE id=${id}`;
        const err_msg = `User with id ${id} not found`;
        await users_model.update('status=\'verified\'', clause);
        const user = await get_user_clause(users_model, res, clause, err_msg);
        return res.status(200).json({ data: user });
    },

    get_users: async (req, res) => {
        const { status } = req.query;
        try {
            let data;
            if (status) {
                data = await users_model.select(
                    `id, email, password, firstname,
                    lastname, phone, status, address`,
                    `WHERE status='${status}'`
                );
            }
            else {
                data = await users_model.select(
                    `id, email, password, firstname,
                    lastname, phone, status, address`,
                );
            }
            return res.status(200).json({ data: data.rows });
        }
        catch (e) { return InternalServerError(res, e); }
    },

    update_user_profile: async (req, res) => {
        const { id } = req.params;
        const { firstname, lastname, phone, home, office } = req.body;
        const clause = `WHERE id=${id}`;
        const err_msg = `User with id ${id} not found`;
        try {
            await users_model.update(
                `firstname='${firstname}', lastname='${lastname}', 
                phone='${phone}', 
                address='{"home": "${home}", "office": "${office}"}'`,
                clause
            );
            const user = await get_user_clause(
                users_model, res, clause, err_msg);
            return res.status(200).json({ data: user });
        }
        catch (e) {
            return InternalServerError(res, e);
        }
    }
};

export default UsersController;
