import { _ } from 'underscore';
import users from '../utils/sample.users';

const UsersController = {

    dashboard: (req, res) => {
        res.render( 'dashboard', { title: 'Dashboard' });
    },
    
    verify_user: (req, res) => {
        const { email } = req.params;
        const [ user, ] = _.filter(users, user => (user.email === email));
        
        if (user) {
            user.status = 'verified';
            res.send({ status: 200, data: user });
        }
        else res.send({ status: 404, error: 'User not found' });
    },
    
    get_users: (req, res) => {
        
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
    },
    
    get_user: (req, res) => {
        const { id } = req.params;
        const data = _.filter(users, user => (user.id === id));
        if (data.length === 0) {
            res.send({ status: 404, error: `User with id ${id} not found` });
        }
        else res.send({ status: 200, data: data[0] });
    },
    
    update_user: (req, res) => {
        const { id } = req.params;
        const { firstName, lastName, phone, home, office } = req.body;
        const [ user, ] = _.filter(users, user => (user.id === id));
        
        user.firstName = firstName;
        user.lastName = lastName;
        user.phone = phone;
        user.address.home = home;
        user.address.office = office;
        
        res.send({ status: 200, data: user });
    },
    
};

export default UsersController;
