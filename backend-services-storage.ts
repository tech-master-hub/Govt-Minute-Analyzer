import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger';

interface StorageConfig {
  endpoint: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  region?: string;
}

class StorageService {
  private s3: AWS.S3;
  private bucketName: string;

  constructor(config: StorageConfig) {
    this.s3 = new AWS.S3({
      endpoint: config.endpoint,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region || 'auto',
      s3ForcePathStyle: true // Required for some providers like Cloudflare R2
    });
    this.bucketName = config.bucketName;
  }

  async savePdf(fileBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const key = `pdfs/${Date.now()}-${fileName}`;
      
      await this.s3.upload({
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: 'application/pdf',
        ACL: 'private'
      }).promise();

      logger.info(`PDF saved to storage: ${key}`);
      return key;
    } catch (error) {
      logger.error('Error saving PDF:', error);
      throw new Error(`Failed to save PDF: ${error}`);
    }
  }

  async saveImage(imageBuffer: Buffer, fileName: string): Promise<string> {
    try {
      const key = `images/${Date.now()}-${fileName}`;
      
      await this.s3.upload({
        Bucket: this.bucketName,
        Key: key,
        Body: imageBuffer,
        ContentType: 'image/png',
        ACL: 'private'
      }).promise();

      logger.info(`Image saved to storage: ${key}`);
      return key;
    } catch (error) {
      logger.error('Error saving image:', error);
      throw new Error(`Failed to save image: ${error}`);
    }
  }

  async getFile(key: string): Promise<Buffer> {
    try {
      const result = await this.s3.getObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      return result.Body as Buffer;
    } catch (error) {
      logger.error(`Error getting file ${key}:`, error);
      throw new Error(`Failed to get file: ${error}`);
    }
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    try {
      const url = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: this.bucketName,
        Key: key,
        Expires: expiresIn
      });

      return url;
    } catch (error) {
      logger.error(`Error getting signed URL for ${key}:`, error);
      throw new Error(`Failed to get signed URL: ${error}`);
    }
  }

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3.deleteObject({
        Bucket: this.bucketName,
        Key: key
      }).promise();

      logger.info(`File deleted from storage: ${key}`);
    } catch (error) {
      logger.error(`Error deleting file ${key}:`, error);
      throw new Error(`Failed to delete file: ${error}`);
    }
  }
}

// Initialize storage service
const storageService = new StorageService({
  endpoint: process.env.BUCKET_ENDPOINT || '',
  accessKeyId: process.env.BUCKET_ACCESS_KEY || '',
  secretAccessKey: process.env.BUCKET_SECRET_KEY || '',
  bucketName: process.env.BUCKET_NAME || 'gov-minutes',
  region: process.env.BUCKET_REGION || 'auto'
});

export default storageService;