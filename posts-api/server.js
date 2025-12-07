const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const fs = require('fs');

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer setup: store files in /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/socialmedia';
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.set('strictQuery', false);

// ✅ Single connection
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// ✅ Post schema
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  comment: { type: String, default: null },
  imageUrl: { type: String, default: null } // optional image reference
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// ✅ Routes
const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Create post with optional image
router.post('/posts', upload.single('image'), async (req, res) => {
  try {
    const { title, body, comment } = req.body;

    if (!title || !body || !comment) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const post = new Post({
      title,
      body,
      comment,
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// ✅ Get single post
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update post with optional image replacement
router.put('/posts/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, body, comment } = req.body;
    const update = { title, body, comment };

    if (req.file) {
      update.imageUrl = `/uploads/${req.file.filename}`;
    }

    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Patch (comments only or partial updates)
router.patch('/posts/:id', async (req, res) => {
  try {
    const update = req.body;
    const post = await Post.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Delete post
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
