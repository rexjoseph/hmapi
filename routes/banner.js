const router = require('express').Router();
const Banner = require('../models/Banner');

const { 
  verifyToken, 
  verifyTokenAndAuthorization, 
  verifyTokenAndAdmin 
} = require('./verifyToken' );

// MAKE NEW BANNER
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newBanner = new Banner(req.body);
  try {
    const savedBanner = await newBanner.save();
    res.status(200).json(savedBanner);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/all', async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }).limit(1);
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json(err);
  }
})


module.exports = router;