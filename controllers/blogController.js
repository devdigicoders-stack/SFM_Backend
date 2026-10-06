const Blog = require('../models/Blog');

// @desc    Get all blogs directly from MongoDB Database
// @route   GET /api/blogs
exports.getBlogs = async (req, res) => {
  try {
    const dbBlogs = await Blog.find().sort({ createdAt: -1 });
    const formatted = dbBlogs.map(b => ({
      id: b._id.toString(),
      title: b.title,
      slug: b.slug,
      image: b.image || '',
      category: b.category,
      categoryId: b.categoryId || '',
      author: b.author,
      date: b.createdAt ? b.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      readTime: b.readTime,
      excerpt: b.excerpt,
      content: b.content,
      published: b.published
    }));
    return res.json({ success: true, count: formatted.length, data: formatted });
  } catch (error) {
    console.error('Error fetching blogs from DB:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single blog by ID or slug directly from MongoDB Database
// @route   GET /api/blogs/:id
exports.getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    let blog = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(id);
    }
    if (!blog) {
      blog = await Blog.findOne({ slug: id });
    }
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog article not found' });
    }

    return res.json({
      success: true,
      data: {
        id: blog._id.toString(),
        title: blog.title,
        slug: blog.slug,
        image: blog.image || '',
        category: blog.category,
        categoryId: blog.categoryId || '',
        author: blog.author,
        date: blog.createdAt ? blog.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        readTime: blog.readTime,
        excerpt: blog.excerpt,
        content: blog.content,
        published: blog.published
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new blog directly in MongoDB Database
// @route   POST /api/blogs
exports.createBlog = async (req, res) => {
  try {
    const { title, image, category, categoryId, author, readTime, excerpt, content, published } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide article title and content' });
    }

    // Generate clean slug with timestamp
    const baseSlug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `article-${Date.now()}`;
    const slug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newBlog = await Blog.create({
      title,
      slug,
      image: image || '',
      category: category || 'AI & Predictive FM',
      categoryId: categoryId || '',
      author: author || 'Spartans Facility Management — Sales Team',
      readTime: readTime || '4 min read',
      excerpt: excerpt || title,
      content,
      published: published !== false
    });

    return res.status(201).json({
      success: true,
      message: 'Article published successfully to Database',
      data: {
        id: newBlog._id.toString(),
        title: newBlog.title,
        slug: newBlog.slug,
        image: newBlog.image || '',
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
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'A blog with this title/slug already exists.' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update blog directly in MongoDB Database
// @route   PUT /api/blogs/:id
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, image, category, categoryId, author, readTime, excerpt, content, published } = req.body;

    const updateData = {};
    if (title) {
      updateData.title = title;
      updateData.slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    }
    if (image !== undefined) updateData.image = image;
    if (category) updateData.category = category;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
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
      message: 'Article updated successfully in Database',
      data: {
        id: blog._id.toString(),
        title: blog.title,
        slug: blog.slug,
        image: blog.image || '',
        category: blog.category,
        categoryId: blog.categoryId || '',
        author: blog.author,
        date: blog.createdAt ? blog.createdAt.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        readTime: blog.readTime,
        excerpt: blog.excerpt,
        content: blog.content,
        published: blog.published
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete blog directly from MongoDB Database
// @route   DELETE /api/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    let result = null;
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      result = await Blog.findByIdAndDelete(id);
    } else {
      result = await Blog.findOneAndDelete({ slug: id });
    }

    if (!result) return res.status(404).json({ success: false, message: 'Article not found' });

    return res.json({
      success: true,
      message: 'Article deleted successfully from Database'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
