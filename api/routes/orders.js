const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

//Handle incoming GET request to /orders
router.get('/', (req, res, next) => {
    Order.find()
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save()
        }).then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored sucessfully',
                createdOrder: {
                    _id: result.id,
                    product: result.product,
                    quantity: result.quantity
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('product quantity _id')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json(
                    { message: 'order not found' }
                )
            }
            res.status(200).json({
                order: order
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId })
        .exec()
        .then(result => {
            res.status(200).json({
                message: `Order ${req.params.orderId} deleted successfully`,

            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

module.exports = router;
