const config = require('../config');
const googleTTS = require('./googleCloudTTS');
const elevenLabsTTS = require('./elevenLabsTTS');

/**
 * Generate audio using the configured TTS provider
 * @param {string} text - The text to convert to speech
 * @param {string} outputPath - Path where to save the audio file
 * @returns {Promise<string>} - Path to generated audio file
 */
async function generateAudio(text, outputPath) {
  switch (config.ttsProvider.toLowerCase()) {
    case 'google':
      return googleTTS.generateAudio(text, outputPath);
    case 'elevenlabs':
      return elevenLabsTTS.generateAudio(text, outputPath);
    default:
      throw new Error(`Unsupported TTS provider: ${config.ttsProvider}`);
  }
}

module.exports = { generateAudio };
