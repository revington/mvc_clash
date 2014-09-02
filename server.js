var http = require('http'),
    app = require('./app');
http.createServer(app).listen(process.env.PORT, function () {
    console.log("listening on port ", process.env.PORT);
});
process.on('uncaughtException', function (err) {
    console.error('Uncaught process exception: ' + err);
    console.trace(err.stack);
    process.exit(1);
});
