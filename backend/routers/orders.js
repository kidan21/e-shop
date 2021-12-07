const express = require('express');
const { Order } = require('../models/order');
const router = express.Router();

router.get('/', async (req, res) => {
    const orderList = Order.find();
    if (!orderList) {
        res.status(500).json({ success: false });
    }
    res.send(orderList);

});

router.post('/', async (req, res) => {
    let order = new Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: totalPrice,
        user: req.body.user,
    });
    order = await order.save();
    if (!order)
        return res.status(404).send('Order not added');

    res.send(order);
});


module.exports = router;