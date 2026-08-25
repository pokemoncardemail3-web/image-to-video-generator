# 🎬 Image to Video Generator

A simple, easy-to-use web application that transforms static images into dynamic videos using AI. Just upload an image, describe what you want to happen, and let the generator create your video!

## ✨ Features

- **Simple & Intuitive UI** - Beautiful, user-friendly interface with step-by-step instructions
- **Drag & Drop Support** - Simply drag images into the upload area
- **Real-time Progress Tracking** - Watch your video generation progress in real-time
- **Flexible Duration Control** - Set video duration from 1-60 seconds
- **Image Preview** - See a preview before generating
- **Job History** - View all your generated videos
- **Download Support** - Download your completed videos
- **Responsive Design** - Works on desktop, tablet, and mobile

## 📋 Prerequisites

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js

## 🚀 Quick Start

### Step 1: Clone the Repository

```bash
git clone https://github.com/pokemoncardemail3-web/image-to-video-generator.git
cd image-to-video-generator
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Setup Environment Variables

Create a `.env` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` and add your configuration:

```
PORT=3000
NODE_ENV=development
```

### Step 4: Start the Server

```bash
npm start
```

For development with auto-reload:

```bash
npm run dev
```

### Step 5: Open in Browser

Navigate to: **http://localhost:3000**

You should see the Image to Video Generator interface!

## 📖 How to Use the Generator

### Step-by-Step Guide

#### **Step 1: Upload Your Image**
1. Click the upload box or drag & drop an image
2. Supported formats: **JPEG, PNG, GIF, WebP**
3. Maximum file size: **50MB**
4. You'll see a preview of your selected image

#### **Step 2: Enter Your Prompt**
1. Describe the motion or effects you want in your video
2. Examples:
   - "Camera slowly zooms in on the face"
   - "Image fades to black and back"
   - "Pan from left to right"
   - "Apply cinematic effects"
3. Character limit: 500 characters

#### **Step 3: Set Duration**
1. Use the slider or enter a number (1-60 seconds)
2. Longer durations may take more time to process
3. Recommended: 5-15 seconds for best results

#### **Step 4: Generate & Download**
1. Click **"🎬 Generate Video"**
2. Watch the progress bar as your video is created
3. Once complete, click **"⬇️ Download Video"** to save the file

## 🎯 Example Workflows

### Quick Portrait Video
- Image: Portrait photo
- Prompt: "Subtle head turn with soft lighting effects"
- Duration: 5 seconds

### Landscape Animation
- Image: Landscape photo
- Prompt: "Camera slowly pans across the landscape"
- Duration: 10 seconds

### Creative Effect
- Image: Any image
- Prompt: "Image rotates 360 degrees"
- Duration: 8 seconds

## 📁 Project Structure

```
image-to-video-generator/
├── public/
│   ├── index.html          # Main HTML interface
│   ├── styles.css          # Styling and responsive design
│   └── script.js           # Frontend functionality
├── server.js               # Backend Express server
├── package.json            # Dependencies
├── .env.example            # Environment variable template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🔧 API Endpoints

### Generate Video
- **POST** `/api/generate`
- Multipart form data with image, prompt, and duration
- Returns: `{ jobId, status, message }`

### Check Status
- **GET** `/api/status/:jobId`
- Returns: `{ jobId, status, progress, videoPath, error }`

### Download Video
- **GET** `/api/download/:jobId`
- Downloads the generated MP4 video file

### Job History
- **GET** `/api/jobs`
- Returns list of all generation jobs

## 📁 Folders Created

- **uploads/** - Temporary storage for uploaded images
- **outputs/** - Generated video files (ready for download)

## 🔴 Troubleshooting

### Issue: "Failed to process upload"
- **Solution:** Check that your image is a valid format (JPEG, PNG, GIF, WebP)
- Ensure file size is under 50MB

### Issue: Video generation hangs
- **Solution:** Check the console for errors
- Try with a smaller image file
- Reduce the duration to 5 seconds

### Issue: Cannot access localhost:3000
- **Solution:** Make sure the server is running (`npm start`)
- Try a different port: `PORT=3001 npm start`
- Check firewall settings

### Issue: File upload not working
- **Solution:** Clear browser cache
- Try a different browser
- Check that uploads/ directory exists and is writable

## 💻 System Requirements

- **OS:** Windows, macOS, or Linux
- **RAM:** Minimum 2GB (4GB+ recommended)
- **Disk Space:** At least 1GB free
- **Connection:** Internet connection (for AI processing)

## 📦 Dependencies

```json
{
  "express": "^4.18.2",      // Web framework
  "multer": "^1.4.5-lts.1",   // File upload handling
  "cors": "^2.8.5",           // Cross-origin requests
  "dotenv": "^16.3.1"         // Environment variables
}
```

## 🎨 Customization

### Change Port Number
Edit `.env`:
```
PORT=8080
```

### Add Custom Styling
Edit `public/styles.css`

### Modify Upload Limits
In `server.js`, change:
```javascript
limits: { fileSize: 50 * 1024 * 1024 } // 50MB
```

## 🔐 Security Notes

- File uploads are validated by type and size
- Temporary files in `uploads/` are stored locally
- Generated videos are stored in `outputs/`
- Consider adding authentication for production use

## 📝 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📞 Support

For issues and questions:
1. Check the Troubleshooting section
2. Review console errors (F12 in browser)
3. Check the API status endpoint

## 🚀 Future Features

- [ ] Batch processing
- [ ] Video filters and effects
- [ ] Audio addition
- [ ] Custom transition effects
- [ ] API integration with video generation services
- [ ] Cloud storage support
- [ ] User accounts and project management

---

**Happy video generating! 🎬✨**
