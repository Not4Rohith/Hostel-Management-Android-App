const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload'); // Ensure upload.js exists too
const { createLostItem, getLostItems, resolveItem } = require('../controllers/lostItemController');

// Define the routes
router.post('/', upload.single('image'), createLostItem);
router.get('/', getLostItems);
router.put('/:id/resolve', resolveItem);

module.exports = router;