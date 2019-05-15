import Model from '../models/Model';
import { InternalServerError } from '../utils/errorHandlers';
// import { dev_logger } from '../utils/loggers';

const users_model = new Model('users');

const UsersController = {

    get_user: (req, res) => {
        const { id } = req.params;
        (async () => {
            try {
                const { rows } = await users_model.select(
                    `id, email, password, firstname,
                    lastname, phone, status, address`,
                    `id=${id}`
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
                return InternalServerError(req, res, e);
            }
        })();
    },

    verify_user: (req, res) => {
        const { id } = req.params;
        (async () => {
            try {
                await users_model.update(
                    'status=\'verified\'',
                    `id=${id}`
                );
                UsersController.get_user(req, res);
            }
            catch (e) { return InternalServerError(req, res, e); }
        })();
    },

    get_users: (req, res) => {
        const { status } = req.query;
        (async () => {
            try {
                let data;
                if (status) {
                    data = await users_model.select(
                        `id, email, password, firstname,
                    lastname, phone, status, address`,
                        `status='${status}'`
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
            catch (e) { return InternalServerError(req, res, e); }
        })();
    },

    update_user: (req, res) => {
        const { id } = req.params;
        const { firstname, lastname, phone, home, office } = req.body;

        (async () => {
            try {
                await users_model.update(
                    `firstname='${firstname}',
                    lastname='${lastname}',
                    phone='${phone}',
                    address='{"home": "${home}", "office": "${office}"}'`,
                    `id=${id}`
                );
                UsersController.get_user(req, res);
            }
            catch (e) {
                return InternalServerError(req, res, e);
            }
        })();
    }
};

export default UsersController;
