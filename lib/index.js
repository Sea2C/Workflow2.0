var path = require('path'),
    auth = require('./auth'),
    routes = require('./routes'),
    express = require('express'),
    dust = require('dustjs-linkedin'),
    less = require('less-middleware'),
    consolidate = require('consolidate'),
    middleware = require('./middleware'),
    app = express(),
    RedisStore = require('connect-redis')(express),
    env = process.env;

auth.configure(function () {
    // todo: write some real repositories
    auth.use(auth.facebook({
        appId: env.FACEBOOK_ID,
        appSecret: env.FACEBOOK_SECRET,
        redirectPath: '/app',
        repository: require('./repositories').user
    }));
});

app.configure(function () {
    app.set('port', env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'dust');
    app.engine('dust', consolidate.dust);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        store: new RedisStore({ host: 'localhost', port: 6379 }),
        secret: 'stuff'
    }));
    app.use(auth.middleware());
    app.use(express.methodOverride());
    // todo: figure out whether we want to use this for our api or not
    // app.use(express.csrf());
    app.use(less({ src: path.join(__dirname, 'public') }));
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure("development", function () {
    app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/app', middleware.restrict('/login'), routes.app);
app.get('/login', routes.login);

//users
app.get('/users', routes.users.list);
app.get('/users/:id', routes.users.read);
app.put('/users/:id', routes.users.update);

//appointments
app.get('/appointments', routes.appointments.list);
app.post('/appointments', routes.appointments.create);
app.get('/appointments/:id', routes.appointments.read);
app.put('/appointments/:id', routes.appointments.update);
app.delete('/appointments/:id', routes.appointments.delete);

// tasks 
app.get('/tasks', routes.tasks.list);
app.post('/tasks', routes.tasks.create);
app.get('/tasks/:id', routes.tasks.read);
app.put('/tasks/:id', routes.tasks.update);
app.delete('/tasks/:id', routes.tasks.delete);


module.exports = app;