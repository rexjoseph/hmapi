const router = require('express').Router();
const sgMail = require('@sendgrid/mail');
const Esubscription = require('../models/Esubscription');
const EsubscriptionI = require('../models/EsubscriptionI');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const { 
  verifyToken, 
  verifyTokenAndAuthorization, 
  verifyTokenAndAdmin 
} = require('./verifyToken' );

router.post('/signup', async (req, res) => {
  const email = req.body.email;

  try {
    const foundEmail = await Esubscription.findOne({email: email});
    
    if (foundEmail) {
      return res.status(500).send({message: 'Email already subscribed'});
    }
    const subscriber = new Esubscription({
      email: email
    })
    await subscriber.save();
    res.status(200).json(subscriber);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.post('/signup/v2', async (req, res) => {
  const email = req.body.email;
  try {
    const foundEmail = await EsubscriptionI.findOne({email: email});
    
    if (foundEmail) {
      return res.status(500).json({message: 'Email already subscribed'});
    }

    const newsubscriber = new EsubscriptionI({
      email: email
    })
    await newsubscriber.save();
    let subscriber = newsubscriber._id;

    const msg = {
      to: email, // email address
      from: { // company friendly name & email address
        name: 'Hashingmart', email: 'help@hashingmart.com'
      },
      templateId: process.env.EMAIL_SIGNUPV2_ID,
      // dynamic_template_data: { // data object embedded in message
        // firstName: firstName // user' first name
      // }
    }
    await sgMail.send(msg);
    res.status(200).json(subscriber)
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/:subscriber/signup/success', async (req, res) => {
  const subscriberId = req.params.subscriber;

  try {
    const subscriber = await EsubscriptionI.findById(subscriberId);
    res.status(200).json(subscriber);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/v1/all', verifyTokenAndAdmin, async (req, res,) => {
  try {
    const subscribers = await Esubscription.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/v2/all', verifyTokenAndAdmin, async (req, res,) => {
  try {
    const subscribers = await EsubscriptionI.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;