var express = require('express'),
    path = require('path'),
    // our sub apps
    products = require('./lib/products'),
    backend = require('./lib/backend'),
    login = require('./lib/login'),
    // the main app
    app = module.exports = express();

// allow access to our db api to every middleware
var http = require('http'),
    req = http.IncomingMessage.prototype;
    req.db = require('nano')(process.env.DB);

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('secret'));
app.use(express.cookieSession());
app.use(express['static'](path.join(__dirname, 'public')));
app.use(express['static'](path.join(__dirname, 'bower_components')));

app.use(express.errorHandler({
    dumpExceptions: true,
    showStack: true
}));

app.use(function (req, res, next) {
    res.locals.pretty = true;
    next();
});

app.get('/', function (req, res) {
    res.render('index');
});

app.use('/products', products);

app.use('/login', login);

function auth(req, res, next) {
    req.user = req.session.user;
    if (req.user) {
        return next();
    }
    res.redirect('/login?r=' + req.originalUrl);
}

// backend request should be authenticated
app.use('/backend', auth);
// backend requests shoulb be handled by backend module
app.use('/backend', backend);

backend.on('productUpdate', function (product) {
    console.log('product', product.name, 'updated');
});
backend.on('productCreate', function (product) {
    console.log('product', product.name, 'created');
});
