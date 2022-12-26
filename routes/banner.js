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

router.get('/latest', async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }).limit(1);
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/', async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 });
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/:bannerId', async (req, res, next) => {
  const bannerId = req.params.bannerId;

  try {
   const foundBanner = await Banner.findById(bannerId);
   res.status(200).json(foundBanner);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.post('/edit/:id', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json(updatedBanner);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete('/:bannerId', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.bannerId);
    res.status(200).json('Banner deleted');
  } catch (err) {
    res.status(500).json(err);
  }
})


module.exports = router;