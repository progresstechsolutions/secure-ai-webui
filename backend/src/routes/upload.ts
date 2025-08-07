import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import sharp from 'sharp';
import { extractUserInfo } from '../middleware/userExtract.js';
import { AuthenticatedRequest } from '../types/index.js';

const router = express.Router();
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

// File type validation
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|pdf|doc|docx|txt|mp4|mov|avi|mp3|wav/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type'));
  }
};

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter
});

// Helper function to ensure directory exists
const ensureDir = async (dir: string): Promise<void> => {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
};

// Helper function to generate unique filename
const generateFileName = (originalName: string, userId: string): string => {
  const timestamp = Date.now();
  const ext = path.extname(originalName);
  const name = path.basename(originalName, ext).replace(/[^a-zA-Z0-9]/g, '_');
  return `${userId}_${timestamp}_${name}${ext}`;
};

// Upload avatar
router.post('/avatar', extractUserInfo, upload.single('avatar'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    await ensureDir(uploadDir);

    const fileName = generateFileName(req.file.originalname, req.user!.id);
    const filePath = path.join(uploadDir, fileName);

    // Optimize image for avatar (resize to 200x200)
    if (req.file.mimetype.startsWith('image/')) {
      const optimizedBuffer = await sharp(req.file.buffer)
        .resize(200, 200, {
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      await writeFile(filePath.replace(path.extname(filePath), '.jpg'), optimizedBuffer);
      
      res.json({
        success: true,
        url: `/uploads/avatars/${fileName.replace(path.extname(fileName), '.jpg')}`,
        filename: fileName.replace(path.extname(fileName), '.jpg')
      });
    } else {
      res.status(400).json({ error: 'Avatar must be an image file' });
    }
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: 'Failed to upload avatar' });
  }
});

// Upload files for messages
router.post('/files', extractUserInfo, upload.array('files', 5), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ error: 'No files uploaded' });
      return;
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'files');
    await ensureDir(uploadDir);

    const uploadResults = [];

    for (const file of req.files) {
      const fileName = generateFileName(file.originalname, req.user!.id);
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, file.buffer);

      uploadResults.push({
        originalName: file.originalname,
        filename: fileName,
        url: `/uploads/files/${fileName}`,
        size: file.size,
        mimetype: file.mimetype
      });
    }

    res.json({
      success: true,
      files: uploadResults
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Upload images for posts/messages
router.post('/images', extractUserInfo, upload.array('images', 5), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      res.status(400).json({ error: 'No images uploaded' });
      return;
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'images');
    await ensureDir(uploadDir);

    const uploadResults = [];

    for (const file of req.files) {
      if (!file.mimetype.startsWith('image/')) {
        continue; // Skip non-image files
      }

      const fileName = generateFileName(file.originalname, req.user!.id);
      const filePath = path.join(uploadDir, fileName);

      // Optimize image (max width 1200px, quality 85%)
      const optimizedBuffer = await sharp(file.buffer)
        .resize(1200, null, {
          withoutEnlargement: true
        })
        .jpeg({ quality: 85 })
        .toBuffer();

      await writeFile(filePath.replace(path.extname(filePath), '.jpg'), optimizedBuffer);

      uploadResults.push({
        originalName: file.originalname,
        filename: fileName.replace(path.extname(fileName), '.jpg'),
        url: `/uploads/images/${fileName.replace(path.extname(fileName), '.jpg')}`,
        size: optimizedBuffer.length,
        mimetype: 'image/jpeg'
      });
    }

    res.json({
      success: true,
      images: uploadResults
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
});

// Delete uploaded file
router.delete('/files/:filename', extractUserInfo, async (req: AuthenticatedRequest<{ filename: string }>, res: Response) => {
  try {
    const { filename } = req.params;
    
    // Security check - ensure filename belongs to user
    if (!filename.startsWith(req.user!.id + '_')) {
      res.status(403).json({ error: 'Not authorized to delete this file' });
      return;
    }

    const possiblePaths = [
      path.join(process.cwd(), 'uploads', 'files', filename),
      path.join(process.cwd(), 'uploads', 'images', filename),
      path.join(process.cwd(), 'uploads', 'avatars', filename)
    ];

    let deleted = false;
    for (const filePath of possiblePaths) {
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          deleted = true;
          break;
        }
      } catch (error) {
        // Continue to next path
      }
    }

    if (deleted) {
      res.json({ success: true, message: 'File deleted successfully' });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;
