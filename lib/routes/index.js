exports.index = function (req, res) {
    // todo: revisit strings for i18n
    res.render('index', { title: 'Workflow 2.0', lang: 'en', user: req.user });
};

exports.login = function(req, res){
    res.render('login', { title: 'Workflow 2.0', lang: 'en', user: req.user });
};

exports.app = function (req, res) {
    res.render('app', { title: 'Workflow 2.0', lang: 'en', user: req.user });
};

exports.appointments = require('./appointments');
exports.users = require('./users');
exports.tasks = require('./tasks');