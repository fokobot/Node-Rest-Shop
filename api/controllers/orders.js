const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name')
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
}

exports.orders_create_order = (req, res, next) => {
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
}

exports.orders_get_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('product quantity _id')
        .populate('product')
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
}

exports.orders_delete_order = (req, res, next) => {
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
}