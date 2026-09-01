const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Generate audio from text using ElevenLabs API
 * @param {string} text - The text to convert to speech
 * @param {string} outputPath - Path where to save the audio file
 * @returns {Promise<string>} - Path to generated audio file
 */
async function generateAudio(text, outputPath) {
  try {
    if (!config.elevenLabsApiKey) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    const voiceId = '21m00Tcm4TlvDq8ikWAM'; // Default voice ID (Rachel)

    const response = await axios.post(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      { text },
      {
        headers: {
          'xi-api-key': config.elevenLabsApiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write audio file
    fs.writeFileSync(outputPath, response.data);

    console.log(`✓ Audio generated: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error generating audio with ElevenLabs:', error.message);
    throw error;
  }
}

module.exports = { generateAudio };
