var http = require('http'),
    app = require('./lib'),
    port = app.get('port');

http.createServer(app).listen(port, function () {
    console.log('Express server listening on port %d', port);
    console.log('Press Ctrl+C to exit...')
});