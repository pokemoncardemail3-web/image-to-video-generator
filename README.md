# Image to Video with Audio Generator

A simple Node.js workflow to convert images into MP4 videos with AI-generated audio from text prompts.

## Features

✨ **Simple workflow**: Image + Text Prompt → MP4 Video with Audio
🎙️ **Multiple TTS Providers**: Google Cloud, ElevenLabs, OpenAI
🎬 **FFmpeg Integration**: Professional video encoding
⚙️ **Configurable**: Customize bitrate, frame rate, and more

## Prerequisites

- Node.js >= 14.0.0
- FFmpeg installed on your system

### Install FFmpeg

**macOS (Homebrew):**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get install ffmpeg
```

**Windows (Chocolatey):**
```bash
choco install ffmpeg
```

## Installation

1. Clone or navigate to the repository:
```bash
cd image-to-video-generator
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Edit `.env` and add your API keys:
```env
TTS_PROVIDER=google
GOOGLE_CLOUD_API_KEY=your_api_key_here
```

## Configuration

### Choose Your TTS Provider

**Google Cloud Text-to-Speech** (Recommended)
- Free tier: 1 million characters per month
- High quality natural voices
- [Sign up and create API key](https://cloud.google.com/text-to-speech)

**ElevenLabs**
- Premium voices, emotional control
- [Sign up and get API key](https://elevenlabs.io)

### Environment Variables

```env
# TTS Configuration
TTS_PROVIDER=google              # Provider to use: google, elevenlabs
GOOGLE_CLOUD_API_KEY=...        # For Google Cloud TTS
ELEVENLABS_API_KEY=...          # For ElevenLabs

# Directories
OUTPUT_DIR=./output             # Where to save MP4 files
TEMP_DIR=./temp                 # Temporary files location

# Video Settings
VIDEO_BITRATE=2000k             # Video quality (1000k-5000k recommended)
AUDIO_BITRATE=192k              # Audio quality
FRAME_RATE=30                   # FPS (24, 30, or 60)
```

## Usage

### Basic Command

```bash
node src/generateVideo.js <image-path> <prompt> [output-name]
```

### Examples

**Simple video with default output name:**
```bash
node src/generateVideo.js ./images/photo.jpg "Welcome to my channel!"
```

**Custom output name:**
```bash
node src/generateVideo.js ./images/background.png "Check out this amazing feature" my-promo-video
```

**Full path example:**
```bash
node src/generateVideo.js /Users/username/Pictures/sunset.jpg "The sun sets over the ocean" sunset_video
```

### Output

- **Video**: `output/my-video.mp4`
- **Temporary audio**: `temp/my-video_audio.mp3`

## Project Structure

```
image-to-video-generator/
├── src/
│   ├── config.js              # Configuration management
│   ├── generateVideo.js       # Main entry point
│   ├── videoConverter.js      # FFmpeg conversion logic
│   └── tts/
│       ├── index.js           # TTS provider factory
│       ├── googleCloudTTS.js  # Google Cloud implementation
│       └── elevenLabsTTS.js   # ElevenLabs implementation
├── output/                     # Generated MP4 videos
├── temp/                       # Temporary audio files
├── .env.example               # Environment variable template
├── .gitignore                 # Git ignore rules
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Workflow

```
User Input (Image + Prompt)
    ↓
[TTS Service] → Generates Audio (MP3)
    ↓
[FFmpeg] → Combines Image + Audio → MP4 Video
    ↓
Output Video File
```

## Supported Image Formats

- JPG / JPEG
- PNG
- GIF
- BMP
- WebP

## Troubleshooting

### FFmpeg not found
```bash
# Verify FFmpeg is installed
ffmpeg -version

# Install if missing (see Prerequisites section)
```

### "API key not configured"
- Check your `.env` file has the correct API key
- Ensure you set `TTS_PROVIDER` to your service

### Audio generation fails
- Verify API key is valid
- Check internet connection
- Try a shorter prompt
- Check API quota/limits

### Video quality issues
- Adjust `VIDEO_BITRATE` in `.env`
- Increase `FRAME_RATE` for smoother video
- Ensure source image is high resolution

## Performance Tips

- **Bitrate**: Use 2000k-3000k for web, 5000k+ for high quality
- **Frame rate**: 24fps for cinema, 30fps standard, 60fps for smooth motion
- **Image size**: Larger images (1920x1080+) produce better results

## License

MIT

## Contributing

Contributions welcome! Feel free to submit issues and pull requests.

## Support

For issues and questions, open a GitHub issue in this repository.
