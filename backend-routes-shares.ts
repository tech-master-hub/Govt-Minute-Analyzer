import express from 'express';
import { logger } from '../utils/logger';
import { Extract } from '../models/Extract';

const router = express.Router();

// GET /api/shares/:shortId - Get public extract data
router.get('/:shortId', async (req, res) => {
  try {
    const { shortId } = req.params;

    // Find the extract document
    const extractDoc = await Extract.findOne({ shortId }).select('-_id -__v -createdAt -updatedAt');

    if (!extractDoc) {
      return res.status(404).json({
        error: 'Extract not found',
        shortId,
        message: 'The requested extract does not exist or may have been deleted'
      });
    }

    // Log access for analytics (optional)
    logger.info(`Public access to extract: ${shortId}`);

    // Return the public data
    res.json({
      shortId: extractDoc.shortId,
      meta: extractDoc.meta,
      budgets: extractDoc.budgets,
      actions: extractDoc.actions,
      contacts: extractDoc.contacts,
      totals: extractDoc.totals,
      errors: extractDoc.errors,
      version: extractDoc.version
    });

  } catch (error) {
    logger.error('Error getting shared extract:', error);
    res.status(500).json({
      error: 'Failed to retrieve extract',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/shares/:shortId/summary - Get extract summary only
router.get('/:shortId/summary', async (req, res) => {
  try {
    const { shortId } = req.params;

    const extractDoc = await Extract.findOne({ shortId })
      .select('shortId meta totals budgets actions errors version')
      .lean();

    if (!extractDoc) {
      return res.status(404).json({
        error: 'Extract not found',
        shortId
      });
    }

    // Return condensed summary
    res.json({
      shortId: extractDoc.shortId,
      meta: {
        municipality: extractDoc.meta.municipality,
        meetingDate: extractDoc.meta.meetingDate,
        meetingType: extractDoc.meta.meetingType
      },
      summary: {
        totalBudget: extractDoc.totals.budgetTotal,
        budgetItems: extractDoc.budgets.length,
        actionItems: extractDoc.actions.length,
        departments: extractDoc.totals.byDept.length,
        hasErrors: (extractDoc.errors && extractDoc.errors.length > 0),
        version: extractDoc.version
      }
    });

  } catch (error) {
    logger.error('Error getting extract summary:', error);
    res.status(500).json({
      error: 'Failed to retrieve extract summary',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/shares/:shortId/meta - Get extract metadata only
router.get('/:shortId/meta', async (req, res) => {
  try {
    const { shortId } = req.params;

    const extractDoc = await Extract.findOne({ shortId })
      .select('shortId meta version')
      .lean();

    if (!extractDoc) {
      return res.status(404).json({
        error: 'Extract not found',
        shortId
      });
    }

    res.json({
      shortId: extractDoc.shortId,
      meta: extractDoc.meta,
      version: extractDoc.version
    });

  } catch (error) {
    logger.error('Error getting extract metadata:', error);
    res.status(500).json({
      error: 'Failed to retrieve extract metadata',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/shares - List all public extracts (optional admin endpoint)
router.get('/', async (req, res) => {
  try {
    // This endpoint might be useful for admin purposes
    // Add authentication if needed in production
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const extracts = await Extract.find()
      .select('shortId meta totals createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Extract.countDocuments();

    res.json({
      extracts: extracts.map(extract => ({
        shortId: extract.shortId,
        municipality: extract.meta.municipality,
        meetingDate: extract.meta.meetingDate,
        totalBudget: extract.totals.budgetTotal,
        createdAt: extract.createdAt
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Error listing extracts:', error);
    res.status(500).json({
      error: 'Failed to list extracts',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;