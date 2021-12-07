const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();

//localhost:3000/api/v1/categories
router.get('/', async (req, res) => {
    const categorytList = await Category.find()
    if (!categorytList) {
        res.status(500).json({ success: false })
    }
    res.send(categorytList);
});

router.get('/:id', async (req, res) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
        res.status(500).json({ success: false })
    }
    res.send(category);
});

router.put('/:id', async (req, res) => {
    let category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    }, { new: true });
    if (!category) {
        res.status(500).json({ success: false, message: "Not" })
    }
    res.send(category);
});

router.post('/', async (req, res) => {
    let category = new Category({
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color
    });
    category = await category.save();
    if (!category)
        return res.status(404).send('Category not added');

    res.send(category);
});

router.delete('/:id', (req, res) => {
    Category.findByIdAndRemove(req.params.id).then(category => {
        if (category) {
            return res.status(200).json({ success: true, message: "category deleted" })
        } else {
            return res.status(500).json({ success: false, message: "category not deleted" })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
})


module.exports = router;