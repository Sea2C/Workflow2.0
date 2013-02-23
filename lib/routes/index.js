exports.index = function (req, res) {
    // todo: revisit strings for i18n
    res.render('index', { title: 'Workflow 2.0', lang: 'en' });
};