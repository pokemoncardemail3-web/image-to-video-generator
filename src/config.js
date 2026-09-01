require('dotenv').config();

const config = {
  ttsProvider: process.env.TTS_PROVIDER || 'google',
  googleCloudApiKey: process.env.GOOGLE_CLOUD_API_KEY,
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
  openaiApiKey: process.env.OPENAI_API_KEY,
  
  outputDir: process.env.OUTPUT_DIR || './output',
  tempDir: process.env.TEMP_DIR || './temp',
  
  video: {
    bitrate: process.env.VIDEO_BITRATE || '2000k',
    audioBitrate: process.env.AUDIO_BITRATE || '192k',
    frameRate: parseInt(process.env.FRAME_RATE) || 30,
  }
};

module.exports = config;
