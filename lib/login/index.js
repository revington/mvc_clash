var express = require('express'),
    app = module.exports = express();

app.set('views', __dirname);

app.on('mount', function () {
    app.locals.mountpath = app.route;
});

function auth(req, res, next) {
    if (req.body.username === 'pedro' && req.body.passwd === 'root') {
        req.session.user = 'pedro';
        return next();
    }
    res.render('index', {
        msg: 'bad login'
    });
}

app.get('/', function (req, res) {
    res.render('index');
});

app.post('/', auth, function (req, res) {
    res.redirect(req.query.r);
});
