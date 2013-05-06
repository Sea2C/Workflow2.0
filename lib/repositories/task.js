module.exports = require('./repository').createRepository({
    database: 'workflow',
    host: '127.0.0.1',
    port: 27017,
    collection: 'tasks'
});
