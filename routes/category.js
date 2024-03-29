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
  const info = req.body.info;
  const slug = name.split(' ').join('-').toLowerCase();

  try {
    const newCategory = new Category({
      name: name,
      icon: icon,
      banner: banner,
      info: info,
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

router.get('/:name', async (req, res, next) => {
  const name = req.params.name;
  try {
    const category = await Category.findOne({name: name.toLowerCase()});
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json(updatedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json('Category deleted')
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;