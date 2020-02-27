import { validationResult } from 'express-validator';

const validate_error_or_next = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    return next();
};

export default validate_error_or_next;
