import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { randomInt } from 'crypto';

const app = express();
const port = process.env.PORT || 3000;

// Configure multer to store uploaded files in the "uploads" directory
const upload = multer({ dest: 'uploads/' });

// Helper function to get the video duration using ffprobe
const getVideoDuration = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata.format.duration;
      resolve(duration);
    });
  });
};

// Helper function to extract a clip from the video using ffmpeg
const extractClip = (
  inputPath: string,
  outputPath: string,
  start: number,
  clipDuration: number
): Promise<void> => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(clipDuration)
      .output(outputPath)
      .on('end', () => resolve())
      .on('error', err => reject(err))
      .run();
  });
};

// Serve static files from the "public" directory (e.g., index.html)
app.use(express.static('public'));

// POST endpoint for file uploads and video editing
app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const platform = req.body.platform; // Expected values: "youtube" or "instagram"
    const filePath = req.file.path;

    // Set clip duration based on the selected platform:
    // 180 seconds (3 minutes) for YouTube, 60 seconds (1 minute) for Instagram
    const clipDuration = platform === 'youtube' ? 180 : 60;

    // Get the total duration of the uploaded video
    const duration = await getVideoDuration(filePath);

    // Ensure the video is long enough to extract the desired clip
    if (duration <= clipDuration) {
      return res
        .status(400)
        .send('Uploaded video is too short for the selected platform editing.');
    }

    // Choose a random start time (skipping the very beginning, e.g., first 30 seconds)
    const minStart = 30;
    const maxStart = Math.floor(duration - clipDuration);
    const startTime = maxStart > minStart ? randomInt(minStart, maxStart) : minStart;

    // Define the output filename and path
    const outputFilename = `edited_${Date.now()}.mp4`;
    const outputPath = path.join('uploads', outputFilename);

    // Extract the clip from the original video
    await extractClip(filePath, outputPath, startTime, clipDuration);

    res.json({
      message: 'Video successfully edited!',
      platform,
      clipDuration: `${clipDuration} seconds`,
      startTime: `${startTime} seconds`,
      editedVideo: outputFilename
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing video');
  }
});

// Basic route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Welcome to the Anime Episode Auto Editor!');
});

// Start the server listening on the specified port
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
