import users from '../utils/sample.users';

const AuthController = {
    signup: (req, res) => {
            
        if (req.method === 'GET') {
            res.render('authentication', { title: 'Sign Up' });
        }
        else {
            const { email, password } = req.body;

            res.status(200).json({
                status: 201,
                data: {
                    id: 2,
                    email,
                    password,
                    first_name: '',
                    last_name: '',
                    address: {
                        home: '',
                        office: '',
                    },
                    status: 'unverified',
                    isAdmin: false,
                    token: req.token,
                }
            });
        }
    },
    
    signin: (req, res) => {
        if (req.method === 'GET') {
            res.render( 'authentication', { title: 'Sign In' });
        }
        else {
            const { email } = req.body;
            const user = users.find(user => user.email === email);
            const data = { ... user, token: req.token };
            res.status(200).json({ data });
        }
    },
};

export default AuthController;

