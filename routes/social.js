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

module.exports = router;