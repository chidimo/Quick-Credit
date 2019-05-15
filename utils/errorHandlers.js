export const InternalServerError = (req, res, e) => {
    return res.status(500).json({
        reason: e.toString(),
        error: e,
        message: 'Internal server error',
    });
};
