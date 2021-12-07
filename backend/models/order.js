const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({

    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orderItem',
        required: true
    }],
    shippingAdress1: {
        type: String,
        required: true
    },
    shippingAdress2: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: {
        type: Number
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dateOrderd: {
        type: Date,
        default: Date.now
    }
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true,
});

exports.Order = mongoose.model('Order', orderSchema);