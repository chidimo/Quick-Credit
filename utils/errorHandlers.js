export const InternalServerError = (res, e) => {
    return res.status(500).json({
        reason: e.toString(),
        error: e,
        message: 'Internal server error',
    });
};
