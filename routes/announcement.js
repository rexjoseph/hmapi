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
router.get('/all', async (req, res, next) => {
  try {
    const announcements = await Announcement.find().sort({createdAt: -1}).limit(1);
    res.status(200).json(announcements);
  } catch (err) {
    res.status(500).json(err);
  }
})

module.exports = router;