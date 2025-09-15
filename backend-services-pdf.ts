import pdf from 'pdf-poppler';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger';

export interface PagePng {
  pageNumber: number;
  buffer: Buffer;
  width: number;
  height: number;
}

class PdfService {
  private pageLimit: number;
  private tempDir: string;

  constructor() {
    this.pageLimit = parseInt(process.env.PAGE_LIMIT || '15');
    this.tempDir = path.join(__dirname, '../temp');
    
    // Ensure temp directory exists
    if (!fs.existsSync(this.tempDir)) {
      fs.mkdirSync(this.tempDir, { recursive: true });
    }
  }

  async renderPdfToPng(pdfBuffer: Buffer): Promise<PagePng[]> {
    const tempId = uuidv4();
    const tempPdfPath = path.join(this.tempDir, `${tempId}.pdf`);
    const outputDir = path.join(this.tempDir, tempId);

    try {
      // Write PDF buffer to temp file
      fs.writeFileSync(tempPdfPath, pdfBuffer);
      
      // Ensure output directory exists
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      logger.info(`Converting PDF to PNG images: ${tempPdfPath}`);

      // Convert PDF to PNG images
      const options = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: 'page',
        page: null as any, // Convert all pages
        file: tempPdfPath
      };

      await pdf.convert(options);

      // Read generated PNG files
      const pages: PagePng[] = [];
      const files = fs.readdirSync(outputDir)
        .filter(file => file.endsWith('.png'))
        .sort((a, b) => {
          const aNum = parseInt(a.replace('page-', '').replace('.png', ''));
          const bNum = parseInt(b.replace('page-', '').replace('.png', ''));
          return aNum - bNum;
        })
        .slice(0, this.pageLimit); // Limit pages

      for (const file of files) {
        const filePath = path.join(outputDir, file);
        const buffer = fs.readFileSync(filePath);
        const pageNumber = parseInt(file.replace('page-', '').replace('.png', ''));
        
        // For simplicity, using default dimensions
        // In production, you might want to read actual image dimensions
        pages.push({
          pageNumber,
          buffer,
          width: 1200,
          height: 1600
        });
      }

      logger.info(`Successfully converted ${pages.length} pages to PNG`);
      return pages;

    } catch (error) {
      logger.error('Error converting PDF to PNG:', error);
      throw new Error(`Failed to convert PDF: ${error}`);
    } finally {
      // Cleanup temp files
      try {
        if (fs.existsSync(tempPdfPath)) {
          fs.unlinkSync(tempPdfPath);
        }
        if (fs.existsSync(outputDir)) {
          const files = fs.readdirSync(outputDir);
          for (const file of files) {
            fs.unlinkSync(path.join(outputDir, file));
          }
          fs.rmdirSync(outputDir);
        }
      } catch (cleanupError) {
        logger.warn('Error cleaning up temp files:', cleanupError);
      }
    }
  }

  async extractTextAndImages(pdfBuffer: Buffer): Promise<{
    text: string;
    pageCount: number;
    metadata?: any;
  }> {
    try {
      // This is a simplified implementation
      // In production, you might use a more sophisticated PDF text extraction library
      const pages = await this.renderPdfToPng(pdfBuffer);
      
      return {
        text: `PDF with ${pages.length} pages detected. Text extraction requires OCR processing.`,
        pageCount: pages.length,
        metadata: {
          pages: pages.length,
          extractedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Error extracting text from PDF:', error);
      throw new Error(`Failed to extract PDF content: ${error}`);
    }
  }
}

export default new PdfService();