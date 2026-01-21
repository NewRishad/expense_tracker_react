const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getTransactions,
  addTransaction,
  getDashboardStats,
  getCategories,
  addCategory,
  updateGoal,
} = require('../controllers/transactionController');

router.get('/', protect, getTransactions);
router.post('/', protect, addTransaction);
router.get('/dashboard/stats', protect, getDashboardStats);
router.get('/categories', protect, getCategories);
router.post('/categories', protect, addCategory);
router.put('/user/goal', protect, updateGoal);

module.exports = router;
