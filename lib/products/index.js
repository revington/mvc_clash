var express = require('express'),
    P = require('connect-parallel'),
    m = require('../middleware'),
    app = module.exports = express();

app.set('views', __dirname);

app.on('mount', function () {
    // url base path. This is not necessary on express 4
    app.locals.mountpath = app.route;
});

app.get('/', m.loadProducts, m.loadTags, function (req, res) {
    // will render ./lib/products/list.jade
    res.render('list');
});

app.get('/:id', m.loadProduct, function (req, res) {
    res.render('product');
});
