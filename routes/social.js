const router = require('express').Router();
const Social = require('../models/Social');

const { 
  verifyToken, 
  verifyTokenAndAuthorization, 
  verifyTokenAndAdmin 
} = require('./verifyToken' );

// ADD NEW CONTENT
router.post('/new-ig', verifyTokenAndAdmin, async (req, res) => {
  const photourl = req.body.photourl;
  const handle = req.body.handle;

  try {
    const newUGC = new Social({
      photourl: photourl,
      handle: handle
    });

    const savedUGC = await newUGC.save();
    res.status(200).json(savedUGC);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.get('/all', async (req, res, next) => {
  try {
    const contents = await Social.find();
    res.status(200).json(contents);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.put('/:id', verifyTokenAndAdmin, async (req, res, next) => {
  try {
    const updatedContent = await Social.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
      res.status(200).json(updatedContent);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Social.findByIdAndDelete(req.params.id);
    res.status(200).json('UGC content deleted')
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;