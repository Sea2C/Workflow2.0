exports.index = function (req, res) {
    // todo: revisit strings for i18n
    res.render('index', { title: 'Workflow 2.0', lang: 'en', user: req.user });
};

exports.login = function(req, res){
    res.render('login', {
        lang: 'en',
        title: 'Workflow 2.0',
        token: req.session._csrf
    });
};