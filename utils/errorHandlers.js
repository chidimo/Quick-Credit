import { dev_logger } from '../utils/loggers';

export const InternalServerError = (req, res, e) => {
    dev_logger(`Location: ${req.url}\nError message: ${e.toString()}`);
    return res.status(500).json({
        reason: e.toString(),
        error: e,
        message: 'Internal server error',
    });
};

export const CriticalError = (res, error) => {
    return res.status(500).json({
        error,
        message: 'Something went wrong. Please try again'
    });
};
