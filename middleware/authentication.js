import jwt from 'jsonwebtoken';
import Settings from '../settings';

const AuthenticationMiddleware = {
    generateToken: (req, res, next) => {
        const payload = { email: req.body.email, password: req.body.password };
        req.token = jwt.sign(
            payload, Settings.jwtSecret, { expiresIn: '24h' }
        );
        return next();
    },

    verifyToken: (req, res, next) => {
        if (Settings.skipTokenVerification()) {
            return next();
        }
        const token = req.headers['x-access-token'];
        if (!token) {
            const msg = 'Include a valid token in the x-access-token header';
            return res.status(422).json({ 
                error: 'No token provided',
                msg 
            });
        }
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
