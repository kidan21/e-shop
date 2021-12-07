const express = require('express');
const { User } = require('../models/user');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

//localhost:3000/api/v1/users
router.get('/', async (req, res) => {
    const usertList = await User.find().select('-passwordHash')
    if (!usertList) {
        res.status(500).json({ success: false })
    }
    res.send(usertList);
});

//get single user
router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id).select('-passwordHash')
    if (!user) {
        res.status(500).json({ success: false })
    }
    res.send(user);
});

//Register user
router.post('/', async (req, res) => {
    let user = new User({
        name: req.body.name,
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 12),
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        appartment: req.body.appartment,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country
    });
    user = await user.save();
    if (!user)
        return res.status(404).send('User not added');

    res.send(user);
});

//login
router.post('/login', async (req, res) => {
    const secret = process.env.SECRET;

    const user = await User.findOne({ email: req.body.email })
    if (!user) {
        return res.status(400).send("user not found")
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        const token = jwt.sign({
            userId: user.id,
            isAdmin: user.isAdmin
        }, secret, { expiresIn: '1d' })
        res.status(200).send({ email: user.email, token: token })
    } else {
        res.status(400).send("Wrong password")
    }

});

//delete user by id
router.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id).then(user => {
        if (user) {
            return res.status(200).json({ success: true, message: "user deleted" })
        } else {
            return res.status(500).json({ success: false, message: "user not deleted" })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, message: err })
    })
});

//Get number of users
router.get('/get/count', async (req, res) => {
    const userCount = await User.countDocuments((count) => count).clone();
    if (!userCount) {
        res.status(500).json({ success: false })
    }
    res.send({ userCount: userCount });
});

module.exports = router;