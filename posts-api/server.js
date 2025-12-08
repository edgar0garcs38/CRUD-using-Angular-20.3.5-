const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Crear carpeta uploads si no existe
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configuración de Multer: almacenamiento en carpeta /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
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

// Servir las imágenes subidas de forma estática
app.use('/uploads', express.static(uploadDir));

mongoose.set('strictQuery', false);

// Conexión única a MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => {
    console.error('Error de conexión a MongoDB:', err);
    process.exit(1);
  });

// Esquema de Post
const postSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  body:    { type: String, required: true },
  comment: { type: String, default: null },
  imageUrl:{ type: String, default: null }   // ruta opcional de la imagen
}, { timestamps: true });

const Post = mongoose.model('Post', postSchema);

// Rutas
const router = express.Router();

// Obtener todos los posts
router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear post con imagen opcional
router.post('/posts', upload.single('image'), async (req, res) => {
  try {
    // Solo para depuración
    console.log('BODY =>', req.body);
    console.log('FILE  =>', req.file);

    // Evitar error si req.body viene indefinido
    const { title, body, comment } = req.body || {};

    // Validar campos obligatorios
    if (!title || !body) {
      return res.status(400).json({ message: 'El título y el cuerpo son obligatorios.' });
    }

    const post = new Post({
      title,
      body,
      comment: comment || '',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await post.save();
    return res.status(201).json(post);
  } catch (err) {
    console.error('Error al crear post:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Obtener un solo post por id
router.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar post con posible reemplazo de imagen
router.put('/posts/:id', upload.single('image'), async (req, res) => {
  try {
    const { title, body, comment } = req.body || {};
    const update = { title, body, comment };

    if (!title || !body) {
      return res.status(400).json({ message: 'El título y el cuerpo son obligatorios.' });
    }

    if (req.file) {
      update.imageUrl = `/uploads/${req.file.filename}`;
    }

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualización parcial (por ejemplo solo comentario)
router.patch('/posts/:id', async (req, res) => {
  try {
    const update = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.json(post);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar post
router.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });
    res.json({ message: 'Post eliminado' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
