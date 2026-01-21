const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  currency: {
    type: String,
    default: 'KES',
    enum: ['KES', 'USD', 'UGX', 'TZS', 'RWF'],
  },
  savingsGoal: { type: Number, default: 0 },
  savingsPeriod: {
    type: String,
    default: 'monthly',
    enum: ['weekly', 'monthly', 'yearly'],
  },
  customCategories: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
