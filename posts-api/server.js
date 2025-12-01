// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/socialmedia';
const PORT = process.env.PORT || 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// (Optional) avoid strictQuery warnings on some Mongoose versions
mongoose.set('strictQuery', false);

// Connect to MongoDB (no legacy options)
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Schema and model
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  comment: { type: String, default: null },
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Routes
const router = express.Router();

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/posts', async (req, res) => {
  try {
    const { title, body, comment } = req.body;
    const post = new Post({ title, body, comment });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/posts/:id', async (req, res) => {
  try {
    const { title, body, comment } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, body, comment },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

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
  console.log(`Server running on http://localhost:${PORT}`);
});
