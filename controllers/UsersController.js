import Model from '../models/Model';
import { InternalServerError } from '../utils/errorHandlers';
// import { dev_logger } from '../utils/loggers';

const users_model = new Model('users');

const UsersController = {

    get_user: async (req, res) => {
        const { id } = req.params;
        try {
            const { rows } = await users_model.select(
                `id, email, password, firstname,
                    lastname, phone, status, address`,
                `WHERE id=${id}`
            );
            if (rows.length === 0) {
                // user was not found
                return res.status(404).json({
                    error: `User with id ${id} not found`
                });
            }
            return res.status(200).json({ data: rows[0] });
        }
        catch (e) {
            return InternalServerError(res, e);
        }
    },

    verify_user: async (req, res) => {
        const { id } = req.params;
        try {
            await users_model.update(
                'status=\'verified\'',
                `WHERE id=${id}`
            );
            UsersController.get_user(req, res);
        }
        catch (e) { return InternalServerError(res, e); }
    
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

    update_user: async (req, res) => {
        const { id } = req.params;
        const { firstname, lastname, phone, home, office } = req.body;

        try {
            await users_model.update(
                `firstname='${firstname}',
                    lastname='${lastname}',
                    phone='${phone}',
                    address='{"home": "${home}", "office": "${office}"}'`,
                `WHERE id=${id}`
            );
            UsersController.get_user(req, res);
        }
        catch (e) {
            return InternalServerError(res, e);
        }
    }
};

export default UsersController;
