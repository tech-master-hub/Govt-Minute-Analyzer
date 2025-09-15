import express from 'express';
import { nanoid } from 'nanoid';
import { logger } from '../utils/logger';
import { Extract } from '../models/Extract';
import storageService from '../services/storage';
import pdfService from '../services/pdf';
import ocrService from '../services/ocr';
import llmService from '../services/llm';

const router = express.Router();

// POST /api/extract - Extract data from uploaded PDF
router.post('/', async (req, res) => {
  const startTime = Date.now();
  let shortId = '';

  try {
    const { fileId } = req.body;

    if (!fileId) {
      return res.status(400).json({
        error: 'Missing fileId parameter'
      });
    }

    logger.info(`Starting extraction process for file: ${fileId}`);

    // Generate short ID for sharing
    shortId = nanoid(8);

    // Step 1: Download PDF from storage
    logger.info('Step 1: Downloading PDF from storage...');
    const pdfBuffer = await storageService.getFile(fileId);
    
    // Step 2: Convert PDF to PNG images
    logger.info('Step 2: Converting PDF to PNG images...');
    const pages = await pdfService.renderPdfToPng(pdfBuffer);
    
    if (pages.length === 0) {
      throw new Error('No pages could be extracted from PDF');
    }

    logger.info(`PDF converted to ${pages.length} PNG images`);

    // Step 3: Perform OCR on images
    logger.info('Step 3: Performing OCR on images...');
    const { pagedText, allText, tables } = await ocrService.processDocumentPages(pages);
    
    if (!pagedText.trim()) {
      throw new Error('No text could be extracted from PDF');
    }

    logger.info(`OCR completed, extracted ${pagedText.length} characters of text`);

    // Step 4: Extract structured data using LLM
    logger.info('Step 4: Extracting structured data using LLM...');
    const extractResult = await llmService.extractStructure({
      pagedText,
      sourceFileName: fileId.split('/').pop() || fileId,
      uploadedAt: new Date().toISOString()
    });

    // Step 5: Save results to database
    logger.info('Step 5: Saving results to database...');
    const extractDoc = new Extract({
      shortId,
      meta: extractResult.meta,
      budgets: extractResult.budgets,
      actions: extractResult.actions,
      contacts: extractResult.contacts,
      totals: extractResult.totals,
      errors: extractResult.errors,
      version: extractResult.version
    });

    await extractDoc.save();

    const processingTime = Date.now() - startTime;
    logger.info(`Extraction completed successfully in ${processingTime}ms. Short ID: ${shortId}`);

    // Return success response
    res.json({
      shortId,
      processingTime,
      summary: {
        pages: pages.length,
        budgetItems: extractResult.budgets.length,
        actionItems: extractResult.actions.length,
        totalBudget: extractResult.totals.budgetTotal,
        errors: extractResult.errors?.length || 0
      },
      message: 'Extraction completed successfully'
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error(`Extraction failed after ${processingTime}ms:`, error);

    // If we have a shortId, save the error state to database
    if (shortId) {
      try {
        const errorDoc = new Extract({
          shortId,
          meta: {
            sourceFileName: 'unknown',
            uploadedAt: new Date().toISOString()
          },
          budgets: [],
          actions: [],
          totals: {
            budgetTotal: 0,
            byDept: []
          },
          errors: [error instanceof Error ? error.message : 'Unknown extraction error'],
          version: 1
        });

        await errorDoc.save();
      } catch (saveError) {
        logger.error('Error saving failure state:', saveError);
      }
    }

    res.status(500).json({
      error: 'Extraction failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      processingTime,
      shortId: shortId || null
    });
  }
});

// GET /api/extract/:shortId/status - Get extraction status
router.get('/:shortId/status', async (req, res) => {
  try {
    const { shortId } = req.params;

    const extractDoc = await Extract.findOne({ shortId });

    if (!extractDoc) {
      return res.status(404).json({
        error: 'Extract not found',
        shortId
      });
    }

    res.json({
      shortId,
      status: extractDoc.errors && extractDoc.errors.length > 0 ? 'error' : 'completed',
      createdAt: extractDoc.createdAt,
      summary: {
        budgetItems: extractDoc.budgets.length,
        actionItems: extractDoc.actions.length,
        totalBudget: extractDoc.totals.budgetTotal,
        errors: extractDoc.errors?.length || 0
      }
    });

  } catch (error) {
    logger.error('Error getting extract status:', error);
    res.status(500).json({
      error: 'Failed to get extract status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/extract/:shortId - Delete extraction results
router.delete('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;

    const result = await Extract.findOneAndDelete({ shortId });

    if (!result) {
      return res.status(404).json({
        error: 'Extract not found',
        shortId
      });
    }

    logger.info(`Extract deleted: ${shortId}`);

    res.json({
      message: 'Extract deleted successfully',
      shortId
    });

  } catch (error) {
    logger.error('Error deleting extract:', error);
    res.status(500).json({
      error: 'Failed to delete extract',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;