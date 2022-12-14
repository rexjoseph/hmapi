const router = require('express').Router();
const Esubscription = require('../models/esubscription');

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

module.exports = router;