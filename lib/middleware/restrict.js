module.exports = function (redirectPath) {
    return function (req, res, next) {
        if (req.user) {
            next();
        } else {
            res.redirect(redirectPath || '/');
        }
    };
};