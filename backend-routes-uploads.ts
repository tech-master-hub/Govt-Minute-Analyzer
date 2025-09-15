import express from 'express';
import multer from 'multer';
import { logger } from '../utils/logger';
import storageService from '../services/storage';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Middleware to check upload secret
const checkUploadAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const uploadSecret = process.env.UPLOAD_SECRET;
  
  if (uploadSecret) {
    const providedSecret = req.headers['upload-secret'] as string;
    
    if (!providedSecret || providedSecret !== uploadSecret) {
      return res.status(401).json({
        error: 'Unauthorized: Invalid or missing upload secret'
      });
    }
  }
  
  next();
};

// POST /api/uploads - Upload PDF file
router.post('/', checkUploadAuth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: 'No PDF file uploaded'
      });
    }

    const file = req.file;
    logger.info(`Received PDF upload: ${file.originalname}, size: ${file.size} bytes`);

    // Validate file size
    if (file.size > 50 * 1024 * 1024) {
      return res.status(400).json({
        error: 'File too large. Maximum size is 50MB.'
      });
    }

    // Save PDF to storage
    const fileKey = await storageService.savePdf(file.buffer, file.originalname);

    logger.info(`PDF saved to storage with key: ${fileKey}`);

    // Return file information
    res.json({
      fileId: fileKey,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      message: 'PDF uploaded successfully'
    });

  } catch (error) {
    logger.error('Error uploading PDF:', error);
    
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'File too large. Maximum size is 50MB.'
        });
      }
      if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          error: 'Too many files. Only one PDF file is allowed.'
        });
      }
    }

    res.status(500).json({
      error: 'Failed to upload PDF',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/uploads/:fileId/info - Get file information
router.get('/:fileId/info', async (req, res) => {
  try {
    const { fileId } = req.params;
    
    // In a real implementation, you might want to store file metadata
    // For now, we'll return basic info based on the fileId
    res.json({
      fileId,
      status: 'uploaded',
      message: 'File information retrieved'
    });

  } catch (error) {
    logger.error('Error getting file info:', error);
    res.status(500).json({
      error: 'Failed to get file information',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/uploads/:fileId - Delete uploaded file
router.delete('/:fileId', checkUploadAuth, async (req, res) => {
  try {
    const { fileId } = req.params;
    
    await storageService.deleteFile(fileId);
    
    logger.info(`File deleted: ${fileId}`);
    
    res.json({
      message: 'File deleted successfully',
      fileId
    });

  } catch (error) {
    logger.error('Error deleting file:', error);
    res.status(500).json({
      error: 'Failed to delete file',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;