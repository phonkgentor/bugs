import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import { randomInt } from 'crypto';

// Set up Express
const app = express();
const port = 3000;

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Helper function to get video duration using ffprobe
const getVideoDuration = (filePath: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      // Duration in seconds
      const duration = metadata.format.duration;
      resolve(duration);
    });
  });
};

// Helper function to extract a clip using ffmpeg
const extractClip = (inputPath: string, outputPath: string, start: number, clipDuration: number): Promise<void> => {
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

// POST endpoint to process the uploaded video
// Expects 'video' (file) and 'platform' (YouTube or Instagram) fields in the form-data.
app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const platform = req.body.platform; // "youtube" or "instagram"
    const filePath = req.file.path;
    
    // Determine desired clip duration based on platform.
    const clipDuration = platform === 'youtube' ? 180 : 60; // 180 sec for YouTube, 60 sec for Instagram
    
    // Use ffprobe to get total video duration.
    const duration = await getVideoDuration(filePath);
    
    // Ensure there is enough video to extract clip.
    if (duration <= clipDuration) {
      return res.status(400).send('Uploaded video is too short for the selected platform editing.');
    }
    
    // Instead of taking from the beginning, pick a random start time.
    // Here we avoid the very beginning (e.g., first 30 seconds) as a simple heuristic.
    const minStart = 30;
    const maxStart = Math.floor(duration - clipDuration);
    const startTime = randomInt(minStart, maxStart);
    
    // Define output filename.
    const outputFilename = `edited_${Date.now()}.mp4`;
    const outputPath = path.join('uploads', outputFilename);
    
    // Extract the clip.
    await extractClip(filePath, outputPath, startTime, clipDuration);
    
    res.json({
      message: 'Video successfully edited!',
      platform,
      clipDuration: clipDuration + ' seconds',
      startTime: startTime + ' seconds',
      editedVideo: outputFilename
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing video');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
