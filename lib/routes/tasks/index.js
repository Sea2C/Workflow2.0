var moment = require('moment'),
    repositories = require('../../repositories'),
    repository = repositories.task;

exports.list = function (req, res, rep) {
    var page = req.param('page') || 1,
        pageSize = req.param('pageSize') || 25,
        effective = (typeof rep === 'object') ? rep : repository;

    effective.list(page, pageSize, function (error, tasks) {
        if (error) {
            return res.json(500, error);
        }

        res.json(200, tasks);
    });
};

exports.read = function (req, res, rep) {
    var effective = (typeof rep === 'object') ? rep : repository;
    effective.findById(req.param('id'), function (error, task) {
        if (error) {
            res.json(500, error);
        } else if (!task) {
            res.json(404, { error: 'not found' });
        } else {
            res.json(200, task);
        }
    });
};

exports.create = function (req, res, rep) {
    var task = {
            client: req.user,
            title: req.param('title'),
            description: req.param('description'),
            owner: req.param('owner'),
            dateCreated: moment.utc().format()
        },
        effective = (typeof rep === 'object') ? rep : repository;

    effective.create(task, function (error, persisted) {
        if (error) {
            return res.json(500, error);
        }

        res.json(201, persisted);
    });
};

exports.update = function (req, res, rep) {
    var task = {
            id: req.param('id'),
            client: req.user,
            title: req.param('title'),
            description: req.param('description'),
            owner: req.param('owner'),
            dateUpdated: moment.utc().format()
        },
        effective = (typeof rep === 'object') ? rep : repository;

    effective.findById(task.id, function (error, persisted) {
        if (error) {
            return res.json(500, error);
        } else if (!persisted) {
            return res.json(404, { error: 'not found' });
        } else {
            // todo: may not need this in a real db scenario
            Object.keys(task).forEach(function (key) {
                persisted[key] = task[key];
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
    effective.findById(req.param('id'), function (error, task) {
        if (error) {
            res.json(500, error);
        } else if (!task) {
            res.json(404, { error: 'not found' });
        } else {
            effective.delete(task, function (error, success) {
                if (error) {
                    return res.json(500, error);
                }
                res.json(200, { success: success });
            });
        }
    });
};