const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Store active generation jobs
const generationJobs = new Map();

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Upload image and generate video
app.post('/api/generate', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const { prompt, duration } = req.body;

    // Validate inputs
    if (!prompt || prompt.trim().length === 0) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!duration || isNaN(duration) || duration < 1 || duration > 60) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: 'Duration must be between 1 and 60 seconds' });
    }

    const jobId = Date.now().toString();
    const generationData = {
      jobId,
      imagePath: req.file.path,
      imageOriginalName: req.file.originalname,
      prompt,
      duration: parseInt(duration),
      status: 'processing',
      progress: 0,
      createdAt: new Date(),
      videoPath: null,
      error: null
    };

    generationJobs.set(jobId, generationData);

    // Start background processing
    processVideoGeneration(jobId, generationData);

    res.json({
      jobId,
      message: 'Video generation started',
      status: 'processing'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process upload: ' + error.message });
  }
});

// Get generation job status
app.get('/api/status/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = generationJobs.get(jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  res.json({
    jobId,
    status: job.status,
    progress: job.progress,
    videoPath: job.videoPath,
    error: job.error,
    createdAt: job.createdAt
  });
});

// Get job history
app.get('/api/jobs', (req, res) => {
  const jobs = Array.from(generationJobs.values()).map(job => ({
    jobId: job.jobId,
    imageOriginalName: job.imageOriginalName,
    prompt: job.prompt,
    duration: job.duration,
    status: job.status,
    progress: job.progress,
    createdAt: job.createdAt,
    videoPath: job.videoPath
  }));

  res.json(jobs);
});

// Download generated video
app.get('/api/download/:jobId', (req, res) => {
  const { jobId } = req.params;
  const job = generationJobs.get(jobId);

  if (!job || !job.videoPath || !fs.existsSync(job.videoPath)) {
    return res.status(404).json({ error: 'Video not found' });
  }

  res.download(job.videoPath);
});

// Simulate video generation process
function processVideoGeneration(jobId, generationData) {
  const steps = [
    { step: 1, progress: 10, message: 'Loading image...' },
    { step: 2, progress: 25, message: 'Processing prompt...' },
    { step: 3, progress: 50, message: 'Generating video frames...' },
    { step: 4, progress: 75, message: 'Encoding video...' },
    { step: 5, progress: 90, message: 'Finalizing...' }
  ];

  let currentStep = 0;

  const processStep = () => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      generationData.progress = step.progress;
      console.log(`[${jobId}] ${step.message} (${step.progress}%)`);
      currentStep++;
      setTimeout(processStep, 2000); // Simulate processing time
    } else {
      // Generate mock video file
      const outputDir = 'outputs';
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }

      const videoPath = path.join(outputDir, `video_${jobId}.mp4`);
      
      // Create a simple file to represent the video
      fs.writeFileSync(videoPath, 'Mock video file');

      generationData.status = 'completed';
      generationData.progress = 100;
      generationData.videoPath = videoPath;
      console.log(`[${jobId}] Video generation completed!`);
    }
  };

  processStep();
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🎬 Image-to-Video Generator running on http://localhost:${PORT}`);
});
