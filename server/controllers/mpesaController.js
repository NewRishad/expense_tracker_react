const Transaction = require('../models/Transaction');

// @desc    Parse M-Pesa SMS
// @route   POST /api/mpesa/parse
exports.parseMpesa = async (req, res) => {
  try {
    const { message } = req.body;

    // Logic for extraction
    const amountRegex = /Ksh([\d,]+)(\.\d{2})?/;
    const merchantRegex = /(sent to|paid to|bought) (.*?) on/;

    const amountMatch = message.match(amountRegex);
    const merchantMatch = message.match(merchantRegex);

    if (!amountMatch)
      return res.status(400).json({ error: 'Could not detect amount' });

    const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
    const merchant = merchantMatch ? merchantMatch[2] : 'Unknown Merchant';

    // Simple categorization
    let category = 'Uncategorized';
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('kplc') || lowerMsg.includes('token'))
      category = 'Utilities';
    if (lowerMsg.includes('uber') || lowerMsg.includes('fuel'))
      category = 'Transport';
    if (lowerMsg.includes('naivas') || lowerMsg.includes('food'))
      category = 'Groceries';

    const transaction = await Transaction.create({
      userId: req.user.id,
      amount: -amount,
      merchant,
      category,
      source: 'mpesa',
      raw_message: message,
    });

    res.json({ status: 'success', data: transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
