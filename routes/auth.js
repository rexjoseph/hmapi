const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const jwt = require('jsonwebtoken');

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  const newUser = new User({
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC).toString()
  });

  try {
    const createdUser = await newUser.save();
    res.status(200).json(createdUser);
  } catch (err) {
    res.status(500).json(err);
  }
})

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(401).json('Wrong email provided')
    
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    userPassword !== req.body.password && res.status(401).json('Some error occured')

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SEC, {expiresIn: "5"});

    // do not send all information of the user
    const { password, ...others } = user._doc;
    res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;