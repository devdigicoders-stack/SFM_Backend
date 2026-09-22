const Blog = require('../models/Blog');
const { isConnected } = require('../config/db');
const { readCollection, writeCollection } = require('../config/jsonDB');

const COLLECTION_NAME = 'blogs';

const INITIAL_BLOGS = [
  {
    id: 'blog-1',
    title: 'How AI Predictive Telemetry Prevents HVAC Chiller Failures in Luxury Hotels',
    category: 'AI & Predictive FM',
    categoryId: 'cat-1',
    author: 'Pranjal Gupta',
    date: '2026-06-18',
    readTime: '4 min read',
    published: true,
    excerpt: 'Traditional maintenance is reactive. Learn how Vigyani.ai IoT vibration and thermal sensors predict motor bearing degradation 72 hours before catastrophic breakdown.',
    content: '<h2>The Shift from Reactive to Predictive Asset Oversight</h2><p>Commercial chiller plants in five-star hotels operate under continuous thermal strain. When a bearing fails unexpectedly during a banquet event, the financial and reputational cost is enormous.</p><p>By deploying <strong>Vigyani.ai IoT sensor arrays</strong>, engineering heads receive real-time alerts 72 hours in advance of mechanical failure.</p>'
  },
  {
    id: 'blog-2',
    title: 'Zero Liability Transfer: Why 100% ESIC, PF & LOTO Protocols Protect Property Owners',
    category: 'Safety & Compliance',
    categoryId: 'cat-3',
    author: 'SFM Safety Cell',
    date: '2026-06-12',
    readTime: '5 min read',
    published: true,
    excerpt: 'Uncertified third-party contractors expose corporate facilities to severe legal liabilities. Discover how Spartans FM enforces strict Lock-Out, Tag-Out and statutory insurance backing.',
    content: '<h2>Corporate Protection through Strict Statutory Compliance</h2><p>Facility owners often face severe liabilities if uncertified third-party contractors suffer accidents on site. Spartans FM guarantees 100% ESIC and Workmen Compensation backing.</p>'
  }
];

// Helper to get all blogs from DB / JSON file
const getLocalBlogs = () => readCollection(COLLECTION_NAME, INITIAL_BLOGS);
const saveLocalBlogs = (blogs) => writeCollection(COLLECTION_NAME, blogs);

// @desc    Get all blogs
// @route   GET /api/blogs
exports.getBlogs = async (req, res) => {
  try {
    if (isConnected()) {
      const dbBlogs = await Blog.find().sort({ createdAt: -1 });
      const formatted = dbBlogs.map(b => ({
        id: b._id.toString(),
        title: b.title,
        slug: b.slug,
        category: b.category,
        categoryId: b.categoryId || '',
        author: b.author,
        date: b.createdAt.toISOString().split('T')[0],
        readTime: b.readTime,
        excerpt: b.excerpt,
        content: b.content,
        published: b.published
      }));
      return res.json({ success: true, count: formatted.length, data: formatted });
    }

    const blogs = getLocalBlogs();
    return res.json({ success: true, count: blogs.length, data: blogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by ID or slug
// @route   GET /api/blogs/:id
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (isConnected()) {
      let blog = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        blog = await Blog.findById(id);
      }
      if (!blog) {
        blog = await Blog.findOne({ slug: id });
      }
      if (!blog) return res.status(404).json({ success: false, message: 'Blog article not found' });
      return res.json({
        success: true,
        data: {
          id: blog._id.toString(),
          title: blog.title,
          slug: blog.slug,
          category: blog.category,
          author: blog.author,
          date: blog.createdAt.toISOString().split('T')[0],
          readTime: blog.readTime,
          excerpt: blog.excerpt,
          content: blog.content,
          published: blog.published
        }
      });
    }

    const blogs = getLocalBlogs();
    const blog = blogs.find(b => b.id === id || b.slug === id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog article not found' });
    return res.json({ success: true, data: blog });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    const { title, category, categoryId, author, readTime, excerpt, content, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide article title and rich text content' });
    }

    // Generate slug with timestamp suffix to avoid duplicates
    const baseSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `article-${Date.now()}`;
    const slug = `${baseSlug}-${Date.now()}`;

    if (isConnected()) {
      const newBlog = await Blog.create({
        title,
        slug,
        category: category || 'AI & Predictive FM',
        categoryId: categoryId || '',
        author: author || 'Pranjal Gupta',
        readTime: readTime || '4 min read',
        excerpt: excerpt || title,
        content,
        published: published !== false
      });
      return res.status(201).json({
        success: true,
        message: 'Article published successfully to SFM Knowledge Hub',
        data: {
          id: newBlog._id.toString(),
          title: newBlog.title,
          slug: newBlog.slug,
          category: newBlog.category,
          categoryId: newBlog.categoryId || '',
          author: newBlog.author,
          date: newBlog.createdAt.toISOString().split('T')[0],
          readTime: newBlog.readTime,
          excerpt: newBlog.excerpt,
          content: newBlog.content,
          published: newBlog.published
        }
      });
    }

    const blogs = getLocalBlogs();
    const newBlog = {
      id: `blog-${Date.now()}`,
      title,
      slug,
      category: category || 'AI & Predictive FM',
      categoryId: categoryId || '',
      author: author || 'Pranjal Gupta',
      date: new Date().toISOString().split('T')[0],
      readTime: readTime || '4 min read',
      excerpt: excerpt || title,
      content,
      published: published !== false
    };

    blogs.unshift(newBlog);
    saveLocalBlogs(blogs);

    return res.status(201).json({
      success: true,
      message: 'Article published successfully to SFM Knowledge Hub',
      data: newBlog
    });
  } catch (error) {
    // Handle duplicate key error gracefully
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'A blog article with a similar title already exists. Please use a unique title.' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, author, readTime, excerpt, content, published } = req.body;

    if (isConnected()) {
      const updateData = {};
      if (title) {
        updateData.title = title;
        updateData.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      }
      if (category) updateData.category = category;
      if (author) updateData.author = author;
      if (readTime) updateData.readTime = readTime;
      if (excerpt) updateData.excerpt = excerpt;
      if (content) updateData.content = content;
      if (typeof published === 'boolean') updateData.published = published;

      let blog = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        blog = await Blog.findByIdAndUpdate(id, updateData, { new: true });
      } else {
        blog = await Blog.findOneAndUpdate({ slug: id }, updateData, { new: true });
      }

      if (!blog) return res.status(404).json({ success: false, message: 'Article not found' });
      return res.json({
        success: true,
        message: 'Article updated successfully',
        data: {
          id: blog._id.toString(),
          title: blog.title,
          slug: blog.slug,
          category: blog.category,
          author: blog.author,
          date: blog.createdAt.toISOString().split('T')[0],
          readTime: blog.readTime,
          excerpt: blog.excerpt,
          content: blog.content,
          published: blog.published
        }
      });
    }

    const blogs = getLocalBlogs();
    const blog = blogs.find(b => b.id === id);

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    if (title) {
      blog.title = title;
      blog.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
    if (category) blog.category = category;
    if (author) blog.author = author;
    if (readTime) blog.readTime = readTime;
    if (excerpt) blog.excerpt = excerpt;
    if (content) blog.content = content;
    if (typeof published === 'boolean') blog.published = published;

    saveLocalBlogs(blogs);

    return res.json({
      success: true,
      message: 'Article updated successfully',
      data: blog
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConnected()) {
      let result = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        result = await Blog.findByIdAndDelete(id);
      } else {
        result = await Blog.findOneAndDelete({ slug: id });
      }
      if (!result) {
        return res.status(404).json({ success: false, message: 'Article not found' });
      }
      return res.json({
        success: true,
        message: 'Article deleted successfully'
      });
    }

    const blogs = getLocalBlogs();
    const index = blogs.findIndex(b => b.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    blogs.splice(index, 1);
    saveLocalBlogs(blogs);

    return res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

