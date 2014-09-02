var express = require('express'),
    m = require('../middleware'),
    app = module.exports = express(),
    // middleware composition
    createProduct = [m.newProduct, m.updateProduct, m.saveProduct],
    updateProduct = [m.loadProduct, m.updateProduct, m.saveProduct];

app.set('views', __dirname);

app.on('mount', function () {
    app.locals.mountpath = app.route;
});

app.get('/', m.loadProducts, function (req, res) {
    res.render('list');
});

function showForm(req, res) {
    res.render('product');
}

// new products
app.get('/new', m.newProduct, showForm);
app.post('/new', createProduct, showForm);
// update products
app.get('/:id', m.loadProduct, showForm);
app.post('/:id', updateProduct, showForm);
