const router = require('express').Router();
const Category = require('../models/Category');

const { 
  verifyToken, 
  verifyTokenAndAuthorization, 
  verifyTokenAndAdmin 
} = require('./verifyToken' );

// MAKE NEW CATEGORY
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const name = req.body.name;
  const icon = req.body.icon;
  const banner = req.body.banner;
  const slug = name.split(' ').join('-').toLowerCase();

  try {
    const newCategory = new Category({
      name: name,
      icon: icon,
      banner: banner,
      slug: slug
    });

    const savedCategory = await newCategory.save();
    res.status(200).json(savedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/all', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
})


module.exports = router;