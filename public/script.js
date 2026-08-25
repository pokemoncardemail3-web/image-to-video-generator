// DOM Elements
const form = document.getElementById('generatorForm');
const imageInput = document.getElementById('imageInput');
const promptInput = document.getElementById('promptInput');
const durationInput = document.getElementById('durationInput');
const durationSlider = document.getElementById('durationSlider');
const generateBtn = document.getElementById('generateBtn');
const previewContainer = document.getElementById('previewContainer');
const imagePreview = document.getElementById('imagePreview');
const fileName = document.getElementById('fileName');
const charCount = document.getElementById('charCount');
const progressSection = document.getElementById('progressSection');
const resultsSection = document.getElementById('resultsSection');
const historySection = document.getElementById('historySection');

let currentJobId = null;
let statusCheckInterval = null;

// Image preview and drag-drop
imageInput.addEventListener('change', handleImageSelect);

const fileLabel = document.querySelector('.file-label');
fileLabel.addEventListener('dragover', (e) => {
  e.preventDefault();
  fileLabel.style.background = '#e8e8ff';
  fileLabel.style.borderColor = '#764ba2';
});

fileLabel.addEventListener('dragleave', () => {
  fileLabel.style.background = '#f8f9ff';
  fileLabel.style.borderColor = '#667eea';
});

fileLabel.addEventListener('drop', (e) => {
  e.preventDefault();
  fileLabel.style.background = '#f8f9ff';
  fileLabel.style.borderColor = '#667eea';
  
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    imageInput.files = files;
    handleImageSelect();
  }
});

function handleImageSelect() {
  const file = imageInput.files[0];
  if (file) {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      imageInput.value = '';
      return;
    }

    // Validate file size (50MB)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      imageInput.value = '';
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      fileName.textContent = `Selected: ${file.name}`;
      previewContainer.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  }
}

// Character count for prompt
prompInput.addEventListener('input', (e) => {
  const length = e.target.value.length;
  charCount.textContent = length;
  if (length > 500) {
    promptInput.value = promptInput.value.substring(0, 500);
    charCount.textContent = 500;
  }
});

// Sync duration slider and number input
durationSlider.addEventListener('input', (e) => {
  durationInput.value = e.target.value;
});

durationInput.addEventListener('input', (e) => {
  let value = parseInt(e.target.value);
  if (isNaN(value) || value < 1) value = 1;
  if (value > 60) value = 60;
  durationInput.value = value;
  durationSlider.value = value;
});

// Form submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Validate inputs
  if (!imageInput.files[0]) {
    alert('Please select an image');
    return;
  }

  if (!promptInput.value.trim()) {
    alert('Please enter a prompt');
    return;
  }

  const duration = parseInt(durationInput.value);
  if (isNaN(duration) || duration < 1 || duration > 60) {
    alert('Duration must be between 1 and 60 seconds');
    return;
  }

  // Prepare form data
  const formData = new FormData();
  formData.append('image', imageInput.files[0]);
  formData.append('prompt', promptInput.value);
  formData.append('duration', duration);

  // Show progress section
  progressSection.style.display = 'block';
  resultsSection.style.display = 'none';
  generateBtn.disabled = true;

  try {
    // Send request
    const response = await fetch('/api/generate', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate video');
    }

    currentJobId = data.jobId;
    startProgressTracking();
  } catch (error) {
    console.error('Error:', error);
    showError(error.message);
    progressSection.style.display = 'none';
    generateBtn.disabled = false;
  }
});

function startProgressTracking() {
  // Update progress every 500ms
  statusCheckInterval = setInterval(async () => {
    try {
      const response = await fetch(`/api/status/${currentJobId}`);
      const data = await response.json();

      updateProgress(data);

      if (data.status === 'completed') {
        clearInterval(statusCheckInterval);
        showSuccess(data);
        generateBtn.disabled = false;
      } else if (data.status === 'error') {
        clearInterval(statusCheckInterval);
        showError(data.error || 'Video generation failed');
        generateBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  }, 500);
}

function updateProgress(data) {
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const statusText = document.getElementById('statusText');

  progressBar.style.width = data.progress + '%';
  progressText.textContent = data.progress + '%';

  // Update status text based on progress
  if (data.progress < 25) {
    statusText.textContent = '📸 Loading image...';
    updateStepStatus(1, 'active');
  } else if (data.progress < 50) {
    statusText.textContent = '💭 Processing prompt...';
    updateStepStatus(1, 'completed');
    updateStepStatus(2, 'active');
  } else if (data.progress < 75) {
    statusText.textContent = '🎞️ Generating frames...';
    updateStepStatus(2, 'completed');
    updateStepStatus(3, 'active');
  } else if (data.progress < 90) {
    statusText.textContent = '🎬 Encoding video...';
    updateStepStatus(3, 'completed');
    updateStepStatus(4, 'active');
  } else if (data.progress < 100) {
    statusText.textContent = '✨ Finalizing...';
    updateStepStatus(4, 'completed');
    updateStepStatus(5, 'active');
  }
}

function updateStepStatus(stepNum, status) {
  const stepElement = document.getElementById(`step${stepNum}`);
  if (stepElement) {
    stepElement.classList.remove('active', 'completed');
    if (status) {
      stepElement.classList.add(status);
    }
  }
}

function showSuccess(data) {
  progressSection.style.display = 'none';
  resultsSection.style.display = 'block';

  document.getElementById('successResult').style.display = 'block';
  document.getElementById('errorResult').style.display = 'none';

  document.getElementById('resultPrompt').textContent = promptInput.value;
  document.getElementById('resultDuration').textContent = durationInput.value;
  document.getElementById('resultTime').textContent = new Date().toLocaleString();

  const downloadBtn = document.getElementById('downloadBtn');
  downloadBtn.onclick = () => {
    window.location.href = `/api/download/${currentJobId}`;
  };

  loadJobHistory();
}

function showError(errorMessage) {
  progressSection.style.display = 'none';
  resultsSection.style.display = 'block';

  document.getElementById('successResult').style.display = 'none';
  document.getElementById('errorResult').style.display = 'block';
  document.getElementById('errorMessage').textContent = errorMessage;
}

async function loadJobHistory() {
  try {
    const response = await fetch('/api/jobs');
    const jobs = await response.json();

    if (jobs.length > 0) {
      historySection.style.display = 'block';
      const jobsList = document.getElementById('jobsList');
      jobsList.innerHTML = jobs
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)
        .map(
          (job) => `
        <div class="job-item">
          <div class="job-details">
            <p><strong>Prompt:</strong> ${job.prompt}</p>
            <p><strong>Duration:</strong> ${job.duration} seconds</p>
            <p><strong>Created:</strong> ${new Date(job.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <span class="job-status status-${job.status}">${job.status.toUpperCase()}</span>
            ${job.status === 'completed' ? `<button class="btn btn-primary" style="margin-left: 10px;" onclick="window.location.href='/api/download/${job.jobId}'">⬇️ Download</button>` : ''}
          </div>
        </div>
      `
        )
        .join('');
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
}

// Load job history on page load
window.addEventListener('load', loadJobHistory);
