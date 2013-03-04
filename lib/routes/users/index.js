var repositories = require('../../repositories'),
    repository = repositories.user;

exports.list = function (req, res, rep) {
    var page = req.param('page') || 1,
        pageSize = req.param('pageSize') || 25,
        effective = (typeof rep === 'object') ? rep : repository;

    effective.list(page, pageSize, function (error, users) {
        if (error) {
            return res.json(500, error);
        }

        res.json(200, users);
    });
};

exports.read = function (req, res, rep) {
    var effective = (typeof rep === 'object') ? rep : repository;
    effective.findById(req.param('id'), function (error, user) {
        if (error) {
            res.json(500, error);
        } else if (!user) {
            res.json(404, { error: 'not found' });
        } else {
            res.json(200, user);
        }
    });
};

exports.update = function (req, res, rep) {
    var user = {
            id: req.param('id'),
            role: req.param('role')
        },
        effective = (typeof rep === 'object') ? rep : repository;

    effective.findById(user.id, function (error, persisted) {
        if (error) {
            return res.json(500, error);
        } else if (!persisted) {
            return res.json(404, { error: 'not found' });
        } else {
            // todo: may not need this in a real db scenario
            Object.keys(user).forEach(function (key) {
                persisted[key] = user[key];
            });

            effective.update(persisted, function (error, updated) {
                if (error) {
                    return res.json(500, error);
                }

                res.json(200, updated);
            });
        }
    });
};