const Category = require('../models/Category');

// @desc    Get all categories directly from MongoDB Database
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const dbCategories = await Category.find().sort({ createdAt: -1 });
    const formatted = dbCategories.map(c => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      count: c.count,
      color: c.color
    }));
    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category directly in MongoDB Database
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    const newCat = await Category.create({
      name,
      slug,
      count: 0,
      color: color || 'bg-slate-100 text-slate-800'
    });

    return res.status(201).json({
      success: true,
      data: {
        id: newCat._id.toString(),
        name: newCat.name,
        slug: newCat.slug,
        count: newCat.count,
        color: newCat.color
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category directly in MongoDB Database
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    const updateData = {};
    if (name) {
      updateData.name = name;
      updateData.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
    if (color) updateData.color = color;

    let cat = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      cat = await Category.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      cat = await Category.findOneAndUpdate({ slug: id }, updateData, { new: true });
    }

    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({
      success: true,
      data: {
        id: cat._id.toString(),
        name: cat.name,
        slug: cat.slug,
        count: cat.count,
        color: cat.color
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category directly from MongoDB Database
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    let result = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Category.findByIdAndDelete(id);
    } else {
      result = await Category.findOneAndDelete({ slug: id });
    }
    if (!result) return res.status(404).json({ success: false, message: 'Category not found' });
    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
