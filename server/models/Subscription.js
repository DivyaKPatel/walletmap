const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'CAD' },
  billingCycle: { 
    type: String, 
    enum: ['monthly', 'yearly', 'weekly'], 
    default: 'monthly' 
  },
  category: { type: String, default: 'Entertainment' },
  renewalDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['active', 'cancelled', 'paused'], 
    default: 'active' 
  },
  notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);