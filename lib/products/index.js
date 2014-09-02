var express = require('express'),
    P = require('connect-parallel'),
    m = require('../middleware'),
    app = module.exports = express();

app.set('views', __dirname);

app.on('mount', function () {
    // on mont, app.route value will be "/products"
    // app.locals and res.locals are accesible 
    // to the views on render time
    app.locals.mountpath = app.route;
});

app.get('/', m.loadProducts, m.loadTags, function (req, res) {
    // will render ./lib/products/list.jade
    res.render('list');
});

app.get('/:id', m.loadProduct, function (req, res) {
    res.render('product');
});
