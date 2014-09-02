"use strict";

function newProduct(req, res, next) {
    res.locals.product = {
        type: 'product'
    };
    return next();
}

exports.newProduct = newProduct;

function updateProduct(req, res, next) {
    ['name', 'description', 'price'].forEach(function (x) {
        res.locals.product[x] = req.body[x];
    });
    res.locals.product.tags = req.body.tags.split('\n').map(function (x) {
        return x.replace(/\r/g, '').trim();
    });
    return next();
}

exports.updateProduct = updateProduct;

function deleteProduct(req, res, next) {
    res.locals.product._deleted = true;
    return next();
}
exports.deleteProduct = deleteProduct;

function saveProduct(req, res, next) {
    var event = 'product' + (res.locals.product._rev ? 'Update' : 'Create');
    req.db.insert(res.locals.product, function (err, doc) {
        if (err) {
            console.error(err);
            res.locals.msg = err;
            return next(err);
        }
        res.locals.product._rev = doc.rev;
        req.app.emit(event, res.locals.product);
        res.redirect(req.app.route);
    });
}
exports.saveProduct = saveProduct;

function loadProducts(req, res, next) {
    req.db.view('products', 'byId', {
        include_docs: true,
        reduce: false
    }, function (err, docs) {
        if (err) {
            return next(err);
        }
        res.locals.products = docs;
        return next();

    });
}
exports.loadProducts = loadProducts;

function loadProduct(req, res, next) {
    req.db.get(req.params.id, function (err, doc) {
        if (err) {
            return next(err);
        }
        res.locals.product = doc;
        return next();
    });
}
exports.loadProduct = loadProduct;

function loadTags(req, res, next) {
    req.db.view('products', 'byTag', {
        group: true,
        reduce: true
    }, function (err, docs) {
        if (err) {
            return next(err);
        }
        res.locals.tags = docs;
        return next();

    });
}

exports.loadTags = loadTags;
