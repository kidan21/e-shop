const express = require('express');
const mongoose = require('mongoose');
const { Product } = require('../models/product');
const { Category } = require('../models/category');
const router = express.Router();

//localhost:3000/api/v1/products
router.get('/', async (req, res) => {

    //localhost:3000/api/v1/products?categories=123,456
    let filter = {}
    if (req.query.categoris) {
        filter = { category: req.query.categories.split(',') }
    }
    const productList = await Product.find(filter).populate('category')
    if (!productList) {
        res.status(500).json({ success: false })
    }
    res.send(productList);
});

router.get('/:id', async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category')
    if (!product) {
        res.status(500).json({ success: false })
    }
    res.send(product);
});

router.post('/', async (req, res) => {

    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send("Invalid category")

    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    });

    const products = await product.save();

    if (!products)
        return res.status(500).send("Product not created")
    res.send(products)
});

//update product validate id adn category
router.put('/:id', async (req, res) => {

    if (mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).send("Invalid product id")
    }
    const category = await Category.findById(req.body.category)
    if (!category) return res.status(400).send("Invalid category")

    let product = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    }, { new: true });
    if (!product) {
        res.status(500).json({ success: false, message: "Product Not Updates" })
    }
    res.send(product);
});

//delete product by id
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: "product deleted" })
        } else {
            return res.status(500).json({ success: false, message: "product not deleted" })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
});

//Get number of products
router.get('/get/count', async (req, res) => {
    const productCount = await Product.countDocuments((count) => count).clone();
    if (!productCount) {
        res.status(500).json({ success: false })
    }
    res.send({ productCount: productCount });
});

//Get list of featured products
router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count : 0;
    const featured = await Product.find({ isFeatured: true }).limit(+count);
    if (!featured) {
        res.status(500).json({ success: false })
    }
    res.send(featured);
});

module.exports = router;