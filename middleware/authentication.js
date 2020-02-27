import jwt from 'jsonwebtoken';
import { jwtSecret } from '../settings';

const AuthenticationMiddleware = {
    generateToken: (req, res, next) => {
        const { email, password } = req.body;
        const payload = { email, password };
        req.token = jwt.sign(
            payload, jwtSecret, { expiresIn: '24h' }
        );
        return next();
    },

    verifyToken: (req, res, next) => {
        const token = req.headers['x-access-token'];
        if (!token) {
            const msg = 'Include a valid token in the x-access-token header';
            return res.status(422).json({ 
                error: 'No token provided',
                msg 
            });
        }
        try {
            req.user = jwt.verify(token, jwtSecret);
            req.token = token;
            return next();
        }
        catch (e) {
            return res.status(422).json({ error: 'Invalid token' });
        }
    }
};

export default AuthenticationMiddleware;
