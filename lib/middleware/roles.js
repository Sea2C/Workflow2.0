module.exports = function (roles) {
    var effective = roles;

    if (typeof roles === 'string') {
        effective = Array.prototype.slice.call(arguments, 0);
    }

    effective = effective || [];

    return function (req, res, next) {
        var userRole = req.user.role,
            hasRole = effective.some(function (role) {
                return role === userRole;
            });
        
        if (hasRole) {
            next();
        } else {
            res.json(403, { error: 'forbidden' });
        }
    };
};