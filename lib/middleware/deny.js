module.exports = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.json(403, { error: 'forbidden' });
    }
};