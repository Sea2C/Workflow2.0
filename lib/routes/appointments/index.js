var moment = require('moment'),
    repositories = require('../../repositories'),
    repository = repositories.appointment;

exports.list = function (req, res, rep) {
    var page = req.param('page') || 1,
        pageSize = req.param('pageSize') || 25,
        effective = (typeof rep === 'object') ? rep : repository;

    effective.list(page, pageSize, function (error, appointments) {
        if (error) {
            return res.json(500, error);
        }

        res.json(200, appointments);
    });
};

exports.read = function (req, res, rep) {
    var effective = (typeof rep === 'object') ? rep : repository;
    effective.findById(req.param('id'), function (error, appointment) {
        if (error) {
            res.json(500, error);
        } else if (!appointment) {
            res.json(404, { error: 'not found' });
        } else {
            res.json(200, appointment);
        }
    });
};

exports.create = function (req, res, rep) {
    var appointment = {
            client: req.user,
            title: req.param('title'),
            description: req.param('description'),
            timezoneOffset: -req.param('timezoneOffset') / 60,
            date: req.param('date'),
            dateCreated: moment.utc().format()
        },
        effective = (typeof rep === 'object') ? rep : repository;

    effective.create(appointment, function (error, persisted) {
        if (error) {
            return res.json(500, error);
        }

        res.json(201, persisted);
    });
};

exports.update = function (req, res, rep) {
    var appointment = {
            id: req.param('id'),
            client: req.user,
            title: req.param('title'),
            description: req.param('description'),
            timezoneOffset: -req.param('timezoneOffset') / 60,
            date: req.param('date'),
            dateUpdated: moment.utc().format()
        },
        effective = (typeof rep === 'object') ? rep : repository;

    effective.findById(appointment.id, function (error, persisted) {
        if (error) {
            return res.json(500, error);
        } else if (!persisted) {
            return res.json(404, { error: 'not found' });
        } else {
            // todo: may not need this in a real db scenario
            Object.keys(appointment).forEach(function (key) {
                persisted[key] = appointment[key];
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


exports.delete = function (req, res, rep) {
    var effective = (typeof rep === 'object') ? rep : repository;
    effective.findById(req.param('id'), function (error, appointment) {
        if (error) {
            res.json(500, error);
        } else if (!appointment) {
            res.json(404, { error: 'not found' });
        } else {
            effective.delete(appointment, function (error, success) {
                if (error) {
                    return res.json(500, error);
                }
                res.json(200, { success: success });
            });
        }
    });
};