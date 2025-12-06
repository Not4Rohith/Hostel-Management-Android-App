const { LostItem, User } = require('../models');

// @desc    Report Lost Item (with Image)
// @route   POST /api/lostfound
exports.createLostItem = async (req, res) => {
  try {
    const { item, location, contact, type, reportedBy } = req.body;
    
    // If image was uploaded, Multer puts it in req.file
    // We save the path relative to the server root
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newItem = await LostItem.create({
      item,
      location,
      contact,
      type, 
      reportedBy,
      image: imagePath // Save path to DB
    });

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Create Lost Item Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// @desc    Get All Items
// @route   GET /api/lostfound
exports.getLostItems = async (req, res) => {
  try {
    const items = await LostItem.findAll({
      order: [['createdAt', 'DESC']],
      // Include user info if needed
      include: [{ model: User, attributes: ['name'] }] 
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @desc    Mark as Found
// @route   PUT /api/lostfound/:id/resolve
exports.resolveItem = async (req, res) => {
  try {
    const { foundByContact } = req.body;
    await LostItem.update(
        { isResolved: true, foundByContact }, 
        { where: { id: req.params.id } }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};