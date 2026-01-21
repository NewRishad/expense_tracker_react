const Transaction = require('../models/Transaction');
const User = require('../models/User');
const mongoose = require('mongoose');

const DEFAULT_CATEGORIES = [
  'Groceries',
  'Transport',
  'Utilities',
  'Rent',
  'Entertainment',
  'Health',
  'Education',
  'Shopping',
  'Personal Care',
  'Investments',
  'Debt',
  'Gifts',
  'Travel',
  'Food & Dining',
  'Mobile Money Fees',
];

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);

    const stats = await Transaction.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalBalance: { $sum: '$amount' },
          weeklySpend: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$amount', 0] },
                    { $gte: ['$date', startOfWeek] },
                  ],
                },
                '$amount',
                0,
              ],
            },
          },
          monthlySpend: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$amount', 0] },
                    { $gte: ['$date', startOfMonth] },
                  ],
                },
                '$amount',
                0,
              ],
            },
          },
          yearlySpend: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $lt: ['$amount', 0] },
                    { $gte: ['$date', startOfYear] },
                  ],
                },
                '$amount',
                0,
              ],
            },
          },
        },
      },
    ]);

    const user = await User.findById(userId);
    const data = stats[0] || {
      totalBalance: 0,
      weeklySpend: 0,
      monthlySpend: 0,
      yearlySpend: 0,
    };

    res.json({
      balance: data.totalBalance,
      spending: {
        weekly: Math.abs(data.weeklySpend),
        monthly: Math.abs(data.monthlySpend),
        yearly: Math.abs(data.yearlySpend),
      },
      goal: {
        amount: user.savingsGoal,
        period: user.savingsPeriod,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add manual transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
  try {
    const { amount, merchant, category, date } = req.body;
    // Ensure expenses are negative
    const finalAmount = -Math.abs(amount);

    const transaction = await Transaction.create({
      userId: req.user.id,
      amount: finalAmount,
      merchant,
      category,
      date: date || Date.now(),
      source: 'manual',
    });

    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get all transactions
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(100);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get categories (Default + Custom)
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const allCategories = [...DEFAULT_CATEGORIES, ...user.customCategories];
    const uniqueCategories = [...new Set(allCategories)];
    res.json(uniqueCategories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Add custom category
// @route   POST /api/categories
exports.addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category)
      return res.status(400).json({ error: 'Category name required' });

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { customCategories: category },
    });
    res.json({ message: `Category '${category}' added.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update savings goal
// @route   PUT /api/user/goal
exports.updateGoal = async (req, res) => {
  try {
    const { amount, period } = req.body;
    const updateData = {};
    if (amount !== undefined) updateData.savingsGoal = amount;
    if (period !== undefined) updateData.savingsPeriod = period;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
    });
    res.json({
      goal: { amount: user.savingsGoal, period: user.savingsPeriod },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
