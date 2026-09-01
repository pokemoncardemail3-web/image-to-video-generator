const fs = require('fs');
const path = require('path');
const config = require('./config');
const { generateAudio } = require('./tts');
const { convertToVideo } = require('./videoConverter');

/**
 * Main function to generate video from image and text prompt
 * @param {string} imagePath - Path to input image
 * @param {string} prompt - Text prompt to convert to audio
 * @param {string} outputName - Name of output video file (without extension)
 */
async function generateVideoFromImageAndPrompt(imagePath, prompt, outputName) {
  try {
    // Validate inputs
    if (!imagePath || !fs.existsSync(imagePath)) {
      throw new Error(`Image file not found: ${imagePath}`);
    }

    if (!prompt || prompt.trim().length === 0) {
      throw new Error('Prompt text is required');
    }

    if (!outputName) {
      throw new Error('Output name is required');
    }

    console.log('\n🎬 Starting image-to-video-with-audio workflow...\n');

    // Step 1: Generate audio from prompt
    console.log('📝 Step 1: Generating audio from prompt...');
    const audioPath = path.join(config.tempDir, `${outputName}_audio.mp3`);
    await generateAudio(prompt, audioPath);

    // Step 2: Convert image + audio to video
    console.log('\n🎥 Step 2: Converting image and audio to video...');
    const videoPath = path.join(config.outputDir, `${outputName}.mp4`);
    await convertToVideo(imagePath, audioPath, videoPath);

    console.log('\n✅ Video generation complete!');
    console.log(`📁 Output: ${videoPath}\n`);

    return videoPath;
  } catch (error) {
    console.error('\n❌ Error:', error.message, '\n');
    process.exit(1);
  }
}

// Get command line arguments
const imagePath = process.argv[2];
const prompt = process.argv[3];
const outputName = process.argv[4] || 'output';

if (!imagePath || !prompt) {
  console.log('\n📖 Usage:');
  console.log('  node src/generateVideo.js <image-path> <prompt> [output-name]\n');
  console.log('📋 Example:');
  console.log('  node src/generateVideo.js ./images/photo.jpg "This is my video description" my-video\n');
  process.exit(0);
}

// Run the generator
generatVideoFromImageAndPrompt(imagePath, prompt, outputName);

module.exports = { generateVideoFromImageAndPrompt };
