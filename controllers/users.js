const _ = require('underscore');
const users = require('../utils/sample.users');

const dashboard = (req, res) => {
    res.render( 'dashboard', { title: 'Dashboard' });
};

const verify_user = (req, res) => {
    const { email } = req.params;
    const [ user, ] = _.filter(users, user => (user.email === email));

    if (user) {
        user.status = 'verified';
        res.send({ status: 200, data: user });
    }
    else res.send({ status: 404, error: 'User not found' });
};

const get_users = (req, res) => {

    const { status } = req.query;

    if (status) {
        const data = _.filter(users, user => (user.status === status));
        res.send({ status: 200, data });
    }
    else {
        const data = [];
        _.map(users, (user) => {
            data.push(user);
        });
        res.send({ status: 200, data });
    }
};

const get_user = (req, res) => {
    const { id } = req.params;
    const data = _.filter(users, user => (user.id === id));
    if (data.length === 0) {
        res.send({ status: 404, error: `User with id ${id} not found` });
    }
    else res.send({ status: 200, data: data[0] });
};

const update_user = (req, res) => {
    const { id } = req.params;
    const { firstName, lastName, phone, home, office } = req.body;
    const [ user, ] = _.filter(users, user => (user.id === id));

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;
    user.address.home = home;
    user.address.office = office;

    res.send({ status: 200, data: user });

};

module.exports = {
    dashboard,
    verify_user,
    get_users,
    get_user,
    update_user
};
