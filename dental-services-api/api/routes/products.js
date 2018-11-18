const express = require('express');
const routes = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');

routes.get('/', (req, res, next) => {
    
    res.status(200).json({
        'Message': '/products handled in get'
    });
});

routes.get('/:productId', (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

routes.post('/', (req, res, next) => {

    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
            console.log(result);
        })
        .catch(err => console.log(err));

    res.status(200).json({
        'Message': '/products handled in post',
        product: product
    });
});

routes.patch('/:productId', (req, res, next) => {
    const id=req.params.productId;
    res.status(200).json({
        'Message': 'Update Product Id is '+id
    });
});

routes.delete('/:productId', (req, res, next) => {
    const id=req.params.productId;
    res.status(200).json({
        'Message': 'Delete Product Id is '+id
    });
});


module.exports=routes;