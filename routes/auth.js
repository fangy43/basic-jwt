const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../model/User')
const jwt = require('jsonwebtoken')
const { registerValidation, loginValidation } = require('../validation')

router.post('/register', async (req, res) => {
    //validate
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //check already exist
    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send('Email already exists')


    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save()
        res.send({ user: user._id })
    } catch (error) {
        res.status(400).send(error)
    }
})


router.post('/login', async (req, res) => {
    //validate
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message)

    //check if email exists
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send('Email or password is invalid')
    //validate password
    const validPass = await bcrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send('Email or password is invalid')

    //create and assign token
    const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token)
})


module.exports = router