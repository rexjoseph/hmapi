const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// REGISTER ROUTE
router.post('/register', async (req, res) => {
  const firstName = req.body.firstName[0];
  const lastName = req.body.lastName[0];
  const email = req.body.email[0];
  const password = req.body.password[0];

  const newUser = new User({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: CryptoJS.AES.encrypt(
      password,
      process.env.PASS_SEC).toString()
  });

  try {
    const createdUser = await newUser.save();
    const msg = {
      to: email, // user email address
      from: { /* company friendly name & email address  */
        name: 'Hashingmart', email: 'help@hashingmart.com' 
      },
      templateId: process.env.WELCOME_TEMPLATE_ID,
      dynamic_template_data: { /* data object embedded in message */
        firstName: firstName /* user' first name */
      }
    }
    await sgMail.send(msg);
    res.status(200).json(createdUser);
  } catch (err) {
    res.status(500).json(err);
  }
})

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json('Wrong email provided');
    }
    // !user && res.status(401).json('Wrong email provided')
    
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const userPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (userPassword !== req.body.password) {
      return res.status(401).json('Some error occured');
    }
    // userPassword !== req.body.password && res.status(401).json('Some error occured')

    const accessToken = jwt.sign({
      id: user._id,
      isAdmin: user.isAdmin
    }, process.env.JWT_SEC, {expiresIn: "5d"});

    // do not send all information of the user
    const { password, ...others } = user._doc;
    res.status(200).json({...others, accessToken});
  } catch (err) {
    res.status(500).json(err);
  }
})

// RESET
router.post('/reset', async (req, res) => {
  let email;
  let firstName;
  let date = new Date();

  crypto.randomBytes(32, async (err, buffer) => {
    const token = buffer.toString('hex');
    const user = await User.findOne({ email: req.body.email })

    email = user.email;
    firstName = user.firstName;
    user.resetToken = token;
    // user.resetTokenExpiration = Date.now() + 3600000;
    user.resetTokenExpiration = date.setHours(date.getHours() + 24);
    await user.save();

    const msg = {
      to: email,
      from: {
        name: 'Hashingmart', email: 'help@hashingmart.com'
      },
      templateId: process.env.RESET_TEMPLATE_ID, 
      dynamic_template_data: { 
        token: token, 
        firstName: firstName 
      }
    }
    await sgMail.send(msg);
    res.status(200).send("Successfully emailed reset")
  })
})

router.get('/reset/:token', async (req, res) => {
  const token = req.params.token;
  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    const {password, ...others } = user._doc;
    res.status(200).json({...others});
  } catch (err) {
    res.status(500).json(err);
  }
})

router.post('/new-password', async (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  // console.log(newPassword, userId, passwordToken)
  
  try {
    let resetUser = await User.findOne({
      resetToken: passwordToken,
      resetTokenExpiration: { $gt: Date.now() },
      _id: userId
    })
    resetUser.password = CryptoJS.AES.encrypt(newPassword, process.env.PASS_SEC).toString()
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    await resetUser.save();
    res.status(200).json(resetUser);
  } catch (err) {
    res.status(500).json(err);
  }

})

module.exports = router;