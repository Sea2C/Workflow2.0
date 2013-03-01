var path = require('path'),
    auth = require('./auth'),
    routes = require('./routes'),
    express = require('express'),
    dust = require('dustjs-linkedin'),
    less = require('less-middleware'),
    consolidate = require('consolidate'),
    app = express();

auth.configure(function () {
    var users = {};
    // todo: write some real repositories
    auth.use(auth.facebook({
        appId: '540127279341882',
        appSecret: process.env.FACEBOOK_SECRET,
        repository: {
            findById: function (id, callback) {
                return callback(null, users[id]);
            },
            create: function (user, callback) {
                // todo: don't cheat here
                user.role = 'client';
                return callback(null, (users[user.id] = user));
            }
        }
    }));
});

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'dust');
    app.engine('dust', consolidate.dust);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({ secret: 'stuff' }));
    app.use(auth.middleware());
    app.use(express.methodOverride());
    app.use(express.csrf());
    app.use(less({ src: path.join(__dirname, 'public') }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure("development", function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/login', routes.login);

module.exports = app;