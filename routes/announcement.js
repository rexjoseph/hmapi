const router = require('express').Router();
const Announcement = require('../models/Announcement');
const { verifyTokenAndAdmin } = require('./verifyToken');

// MAKE NEW ANNOUNCEMENT
router.post('/', verifyTokenAndAdmin, async (req, res, next) => {
  const newAnnouncement = new Announcement(req.body);
  try {
    const savedAnnouncement = await newAnnouncement.save();
    res.status(200).json(savedAnnouncement);
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET ALL ANNOUNCEMENT
router.get('/admin-all', async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({createdAt: -1});
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json(err);
  }
})

// GET ALL ANNOUNCEMENT
router.get('/all', async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({createdAt: -1}).limit(1);
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );
    res.status(200).json(updatedAnnouncement);
  } catch (err) {
    res.status(500).json(err);
  }
})

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json('Announcement deleted')
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;