import Tesseract from 'tesseract.js';
import { logger } from '../utils/logger';
import { PagePng } from './pdf';

export interface PageText {
  page: number;
  text: string;
  confidence?: number;
  words?: Array<{
    text: string;
    confidence: number;
    bbox: { x0: number; y0: number; x1: number; y1: number };
  }>;
}

class OcrService {
  private languages: string;
  private workers: Map<string, Tesseract.Worker> = new Map();

  constructor() {
    this.languages = process.env.OCR_LANGS || 'tam+eng';
  }

  private async getWorker(): Promise<Tesseract.Worker> {
    const workerId = `worker_${Date.now()}_${Math.random()}`;
    
    try {
      const worker = await Tesseract.createWorker(this.languages, 1, {
        logger: (m: any) => {
          if (m.status === 'recognizing text') {
            logger.debug(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      });

      await worker.setParameters({
        tessedit_pageseg_mode: Tesseract.PSM.AUTO,
        tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY,
      });

      this.workers.set(workerId, worker);
      return worker;
    } catch (error) {
      logger.error('Error creating OCR worker:', error);
      throw new Error(`Failed to initialize OCR worker: ${error}`);
    }
  }

  private async terminateWorker(workerId: string): Promise<void> {
    const worker = this.workers.get(workerId);
    if (worker) {
      await worker.terminate();
      this.workers.delete(workerId);
    }
  }

  async ocrImages(pages: PagePng[]): Promise<PageText[]> {
    const results: PageText[] = [];

    for (const page of pages) {
      let worker: Tesseract.Worker | null = null;
      let workerId: string = '';

      try {
        logger.info(`Processing OCR for page ${page.pageNumber}`);
        
        worker = await this.getWorker();
        workerId = Array.from(this.workers.keys()).find(id => this.workers.get(id) === worker) || '';

        const { data } = await worker.recognize(page.buffer);

        // Extract text with better formatting
        let text = data.text;
        
        // Clean up the text
        text = this.cleanOcrText(text);

        // Extract word-level data for better analysis
        const words = data.words?.map(word => ({
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox
        })) || [];

        results.push({
          page: page.pageNumber,
          text,
          confidence: data.confidence,
          words
        });

        logger.info(`OCR completed for page ${page.pageNumber}, confidence: ${Math.round(data.confidence)}%`);

      } catch (error) {
        logger.error(`Error processing OCR for page ${page.pageNumber}:`, error);
        
        // Add empty result for failed page
        results.push({
          page: page.pageNumber,
          text: `[OCR Error on page ${page.pageNumber}: ${error}]`,
          confidence: 0
        });
      } finally {
        if (workerId) {
          await this.terminateWorker(workerId);
        }
      }
    }

    return results.sort((a, b) => a.page - b.page);
  }

  private cleanOcrText(text: string): string {
    return text
      // Remove excessive whitespace
      .replace(/\s+/g, ' ')
      // Fix common OCR errors for Indian languages
      .replace(/\|/g, 'I')
      .replace(/0/g, 'O')
      // Preserve line breaks for better structure
      .replace(/\n\s*\n/g, '\n\n')
      // Clean up special characters
      .replace(/[^\w\s\u0B80-\u0BFF\u0964\u0965₹\-.,;:()\[\]]/g, ' ')
      .trim();
  }

  async extractTables(pageText: PageText): Promise<Array<Array<string>>> {
    const tables: Array<Array<string>> = [];
    
    try {
      const lines = pageText.text.split('\n');
      let currentTable: Array<string> = [];
      
      for (const line of lines) {
        const cleanLine = line.trim();
        
        // Detect potential table rows (lines with multiple spaces/tabs)
        if (cleanLine.includes('  ') || cleanLine.includes('\t')) {
          // Split by multiple spaces or tabs
          const cells = cleanLine.split(/\s{2,}|\t/).map(cell => cell.trim()).filter(cell => cell);
          
          if (cells.length > 1) {
            currentTable.push(cells);
          }
        } else if (currentTable.length > 0) {
          // End of current table
          if (currentTable.length > 1) { // Only keep tables with multiple rows
            tables.push(currentTable);
          }
          currentTable = [];
        }
      }
      
      // Don't forget the last table
      if (currentTable.length > 1) {
        tables.push(currentTable);
      }
      
      logger.info(`Extracted ${tables.length} potential tables from page ${pageText.page}`);
      return tables;
      
    } catch (error) {
      logger.error(`Error extracting tables from page ${pageText.page}:`, error);
      return [];
    }
  }

  async processDocumentPages(pages: PagePng[]): Promise<{
    pagedText: string;
    allText: PageText[];
    tables: Array<{ page: number; tables: Array<Array<string>> }>;
  }> {
    try {
      logger.info(`Starting OCR processing for ${pages.length} pages`);
      
      const allText = await this.ocrImages(pages);
      
      // Extract tables from each page
      const tablesPerPage = [];
      for (const pageText of allText) {
        const tables = await this.extractTables(pageText);
        tablesPerPage.push({ page: pageText.page, tables });
      }
      
      // Format paged text for LLM
      const pagedText = allText
        .map(pageText => `###PAGE ${pageText.page}###\n${pageText.text}`)
        .join('\n\n');
      
      return { pagedText, allText, tables: tablesPerPage };
      
    } catch (error) {
      logger.error('Error processing document pages:', error);
      throw new Error(`OCR processing failed: ${error}`);
    }
  }
}

export default new OcrService();