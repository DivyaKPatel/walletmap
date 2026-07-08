const express = require('express');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all subscriptions
router.get('/', auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ userId: req.user.id });
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add subscription
router.post('/', auth, async (req, res) => {
  try {
    const sub = new Subscription({ ...req.body, userId: req.user.id });
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update subscription
router.put('/:id', auth, async (req, res) => {
  try {
    const sub = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete subscription
router.delete('/:id', auth, async (req, res) => {
  try {
    await Subscription.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;