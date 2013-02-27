var path = require('path'),
    routes = require('./routes'),
    express = require('express'),
    dust = require('dustjs-linkedin'),
    less = require('less-middleware'),
    consolidate = require('consolidate'),
    app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'dust');
    app.engine('dust', consolidate.dust);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(less({ src: path.join(__dirname, 'public') }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure("development", function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', routes.login);

module.exports = app;