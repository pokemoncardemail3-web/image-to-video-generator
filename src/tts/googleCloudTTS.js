const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Generate audio from text using Google Cloud Text-to-Speech API
 * @param {string} text - The text to convert to speech
 * @param {string} outputPath - Path where to save the audio file
 * @returns {Promise<string>} - Path to generated audio file
 */
async function generateAudio(text, outputPath) {
  try {
    if (!config.googleCloudApiKey) {
      throw new Error('GOOGLE_CLOUD_API_KEY not configured');
    }

    const response = await axios.post(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${config.googleCloudApiKey}`,
      {
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: 'en-US-Neural2-C',
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          pitch: 0,
          speakingRate: 1
        }
      }
    );

    if (!response.data.audioContent) {
      throw new Error('No audio content in response');
    }

    // Ensure output directory exists
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write audio file
    const audioBuffer = Buffer.from(response.data.audioContent, 'base64');
    fs.writeFileSync(outputPath, audioBuffer);

    console.log(`✓ Audio generated: ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error('Error generating audio with Google Cloud TTS:', error.message);
    throw error;
  }
}

module.exports = { generateAudio };
