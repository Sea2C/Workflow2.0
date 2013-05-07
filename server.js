var cpus,
    workers,
    listening,
    http = require('http'),
    app = require('./lib'),
    port = app.get('port'),
    cluster = require('cluster');

if (cluster.isMaster) {
    workers = listening = cpus = require('os').cpus().length;

    while(--workers >= 0) {
        cluster.fork();
    }

    // listen for the sake of indicating when the server is ready
    cluster.on('listening', function (worker, address) {
        if (!(--listening)) {
            console.log('%d Express server(s) listening on port %d', cpus, port);
            console.log('Press Ctrl+C to exit...');
        }
    });

    // restart a worker when it unexpectedly exits
    cluster.on('exit', function (worker, code, signal) {
        var process = worker.process;
        console.log('Worker %s died (%s). restarting...', process.pid, process.exitCode);
        cluster.fork();
    });
} else {
    // start the server
    http.createServer(app).listen(port);
}