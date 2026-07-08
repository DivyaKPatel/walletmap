const express = require('express');
const { getSubscriptions, saveSubscriptions } = require('../models/Subscription');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all subscriptions for user
router.get('/', auth, (req, res) => {
  try {
    const subs = getSubscriptions().filter(s => s.userId === req.user.id);
    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add subscription
router.post('/', auth, (req, res) => {
  try {
    const subs = getSubscriptions();
    const sub = {
      id: Date.now().toString(),
      userId: req.user.id,
      name: req.body.name,
      amount: parseFloat(req.body.amount),
      currency: req.body.currency || 'CAD',
      billingCycle: req.body.billingCycle || 'monthly',
      category: req.body.category || 'Entertainment',
      renewalDate: req.body.renewalDate,
      status: req.body.status || 'active',
      notes: req.body.notes || ''
    };
    subs.push(sub);
    saveSubscriptions(subs);
    res.json(sub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update subscription
router.put('/:id', auth, (req, res) => {
  try {
    let subs = getSubscriptions();
    const index = subs.findIndex(
      s => s.id === req.params.id && s.userId === req.user.id
    );
    if (index === -1) return res.status(404).json({ message: 'Not found' });
    subs[index] = { ...subs[index], ...req.body };
    saveSubscriptions(subs);
    res.json(subs[index]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete subscription
router.delete('/:id', auth, (req, res) => {
  try {
    let subs = getSubscriptions();
    subs = subs.filter(
      s => !(s.id === req.params.id && s.userId === req.user.id)
    );
    saveSubscriptions(subs);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;