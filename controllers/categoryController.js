const Category = require('../models/Category');
const { isConnected } = require('../config/db');
const { readCollection, writeCollection } = require('../config/jsonDB');

const COLLECTION_NAME = 'categories';

const INITIAL_CATEGORIES = [
  { id: 'cat-1', name: 'AI & Predictive FM', slug: 'ai-predictive', count: 2, color: 'bg-sky-100 text-sky-800' },
  { id: 'cat-2', name: 'Hard Engineering', slug: 'hard-engineering', count: 2, color: 'bg-amber-100 text-amber-800' },
  { id: 'cat-3', name: 'Safety & Compliance', slug: 'safety-compliance', count: 1, color: 'bg-emerald-100 text-emerald-800' },
  { id: 'cat-4', name: 'Case Studies', slug: 'case-studies', count: 1, color: 'bg-purple-100 text-purple-800' }
];

const getLocalCategories = () => readCollection(COLLECTION_NAME, INITIAL_CATEGORIES);
const saveLocalCategories = (categories) => writeCollection(COLLECTION_NAME, categories);

// @desc    Get all categories
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    if (isConnected()) {
      const dbCategories = await Category.find().sort({ createdAt: -1 });
      const formatted = dbCategories.map(c => ({
        id: c._id.toString(),
        name: c.name,
        slug: c.slug,
        count: c.count,
        color: c.color
      }));
      return res.json({ success: true, count: formatted.length, data: formatted });
    }

    const categories = getLocalCategories();
    return res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

    if (isConnected()) {
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
    }

    const categories = getLocalCategories();
    const newCat = {
      id: `cat-${Date.now()}`,
      name,
      slug,
      count: 0,
      color: color || 'bg-slate-100 text-slate-800'
    };

    categories.push(newCat);
    saveLocalCategories(categories);
    return res.status(201).json({ success: true, data: newCat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    if (isConnected()) {
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
    }

    const categories = getLocalCategories();
    const cat = categories.find(c => c.id === id);
    if (!cat) return res.status(404).json({ success: false, message: 'Category not found' });

    if (name) {
      cat.name = name;
      cat.slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
    if (color) cat.color = color;

    saveLocalCategories(categories);
    return res.json({ success: true, data: cat });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnected()) {
      let result = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        result = await Category.findByIdAndDelete(id);
      } else {
        result = await Category.findOneAndDelete({ slug: id });
      }
      if (!result) return res.status(404).json({ success: false, message: 'Category not found' });
      return res.json({ success: true, message: 'Category deleted successfully' });
    }

    const categories = getLocalCategories();
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) return res.status(404).json({ success: false, message: 'Category not found' });

    categories.splice(index, 1);
    saveLocalCategories(categories);
    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

