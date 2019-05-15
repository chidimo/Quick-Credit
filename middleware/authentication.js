import jwt from 'jsonwebtoken';
import Settings from '../settings';

const AuthenticationMiddleware = {
    generateToken: (req, res, next) => {
        req.token = jwt.sign(
            req.body,
            Settings.jwtSecret,
            { expiresIn: '24h' }
        );
        return next();
    },

    verifyToken: (req, res, next) => {
        const token = req.headers['x-access-token'];
        try {
            req.user = jwt.verify(token, Settings.jwtSecret);
            req.token = token;
            return next();
        }
        catch (e) {
            return res.status(422).json({ error: 'Invalid token' });
        }
    }
};

export default AuthenticationMiddleware;
