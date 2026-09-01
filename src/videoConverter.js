const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const config = require('./config');

/**
 * Convert image and audio to MP4 video
 * @param {string} imagePath - Path to input image
 * @param {string} audioPath - Path to input audio file
 * @param {string} outputPath - Path to output MP4 video
 * @returns {Promise<string>} - Path to generated video
 */
function convertToVideo(imagePath, audioPath, outputPath) {
  return new Promise((resolve, reject) => {
    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    ffmpeg()
      .input(imagePath)
      .loop()
      .input(audioPath)
      .withVideoCodec('libx264')
      .withAudioCodec('aac')
      .withAudioBitrate(config.video.audioBitrate)
      .withVideoBitrate(config.video.bitrate)
      .withFps(config.video.frameRate)
      .withPixelFormat('yuv420p')
      .withOption('-shortest')
      .on('end', () => {
        console.log(`✓ Video created: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Error during video conversion:', err.message);
        reject(err);
      })
      .on('progress', (progress) => {
        console.log(`  Processing: ${Math.round(progress.percent)}% done`);
      })
      .save(outputPath);
  });
}

module.exports = { convertToVideo };
