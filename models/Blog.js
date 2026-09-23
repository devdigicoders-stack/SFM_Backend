const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true, sparse: true },
  image: { type: String, default: '' },
  category: { type: String, required: true },
  categoryId: { type: String, default: '' },
  author: { type: String, default: 'Pranjal Gupta' },
  readTime: { type: String, default: '4 min read' },
  excerpt: { type: String, required: true },
  content: { type: String, required: true }, // HTML Rich Text
  published: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Blog', BlogSchema);

