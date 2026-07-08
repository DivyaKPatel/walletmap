const express = require('express');
const axios = require('axios');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const subs = await Subscription.find({ 
      userId: req.user.id, 
      status: 'active' 
    });

    if (subs.length === 0) {
      return res.json({ insight: 'Add some subscriptions first and I will analyze them for you! 💳' });
    }

    const totalMonthly = subs.reduce((sum, s) => {
      if (s.billingCycle === 'monthly') return sum + s.amount;
      if (s.billingCycle === 'yearly') return sum + s.amount / 12;
      if (s.billingCycle === 'weekly') return sum + s.amount * 4;
      return sum;
    }, 0);

    const subList = subs.map(s =>
      `${s.name}: $${s.amount} ${s.currency}/${s.billingCycle} (${s.category})`
    ).join('\n');

    const prompt = `You are a friendly personal finance advisor. Analyze these subscriptions and give 3 specific actionable insights to save money. Be direct, friendly and concise. Format as 3 numbered points. Keep under 150 words total.

Subscriptions:
${subList}

Total monthly spend: $${totalMonthly.toFixed(2)} CAD`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    const insight = response.data.candidates[0].content.parts[0].text;
    res.json({ insight, totalMonthly: totalMonthly.toFixed(2) });
  } catch (err) {
    console.log('Insights error:', err.message);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;