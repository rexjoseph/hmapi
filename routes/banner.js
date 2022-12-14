const router = require('express').Router();
const Banner = require('../models/Banner');

const { 
  verifyToken, 
  verifyTokenAndAuthorization, 
  verifyTokenAndAdmin 
} = require('./verifyToken' );

// MAKE NEW BANNER
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  // const name = req.body.name;
  // const icon = req.body.icon;
  // const banner = req.body.banner;
  // const slug = name.split(' ').join('-').toLowerCase();
  const newBanner = new Banner(req.body);
  try {
    const savedBanner = await newBanner.save();
    res.status(200).json(savedBanner);
    // const newCategory = new Category({
    //   name: name,
    //   icon: icon,
    //   banner: banner,
    //   slug: slug
    // });

    // const savedCategory = await newCategory.save();
    // res.status(200).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/all', async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ createdAt: -1 }).limit(5);
    res.status(200).json(banners);
  } catch (err) {
    res.status(500).json(err);
  }
})


module.exports = router;