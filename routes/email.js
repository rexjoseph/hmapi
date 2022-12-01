const router = require('express').Router();
const Esubscription = require('../models/esubscription');

router.post('/signup', async (req, res) => {
  const email = req.body.email;

  try {
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