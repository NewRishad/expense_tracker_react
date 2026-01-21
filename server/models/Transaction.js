const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  fee: { type: Number, default: 0 },
  merchant: { type: String, required: true },
  category: { type: String, default: 'Uncategorized' },
  date: { type: Date, default: Date.now },
  source: {
    type: String,
    enum: [
      'manual',
      'mpesa',
      'bank_equity',
      'bank_kcb',
      'bank_coop',
      'bank_ncba',
      'bank_stanbic',
      'bank_absa',
    ],
    default: 'manual',
  },
  raw_message: { type: String },
  externalId: { type: String },
});

module.exports = mongoose.model('Transaction', TransactionSchema);
