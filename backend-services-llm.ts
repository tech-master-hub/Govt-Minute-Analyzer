import OpenAI from 'openai';
import { logger } from '../utils/logger';
import { validateExtractData } from '../utils/schema';
import { v4 as uuidv4 } from 'uuid';

interface ExtractRequest {
  pagedText: string;
  sourceFileName: string;
  uploadedAt: string;
}

interface ExtractResult {
  meta: {
    municipality?: string;
    meetingDate?: string;
    meetingType?: string;
    language?: string[];
    sourceFileName: string;
    uploadedAt: string;
  };
  budgets: Array<{
    id: string;
    purpose: string;
    department?: string;
    amount: {
      amount: number;
      currency: "INR";
      sourceText?: string;
      pages?: number[];
    };
    pages?: number[];
    evidence?: string;
  }>;
  actions: Array<{
    id: string;
    title: string;
    description?: string;
    department?: string;
    officer?: {
      name?: string;
      title?: string;
      dept?: string;
      contact?: string;
      pages?: number[];
    };
    budget?: {
      amount: number;
      currency: "INR";
      sourceText?: string;
      pages?: number[];
    };
    deadline?: string;
    status: "proposed" | "approved" | "in-progress" | "completed" | "unknown";
    priority?: "low" | "medium" | "high";
    pages?: number[];
    evidence?: string;
  }>;
  contacts?: Array<{
    name?: string;
    title?: string;
    dept?: string;
    contact?: string;
    pages?: number[];
  }>;
  totals: {
    budgetTotal: number;
    byDept: Array<{ department: string; total: number }>;
  };
  errors?: string[];
  version: number;
}

class LlmService {
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is required');
    }
    
    this.openai = new OpenAI({ apiKey });
  }

  async extractStructure(request: ExtractRequest): Promise<ExtractResult> {
    const systemPrompt = `You are a government minutes extraction engine. Output ONLY valid JSON per the schema.

Rules:
- Infer budgets and action items grounded in quoted evidence text and page numbers
- Currency is INR, numeric only (no symbols)
- If a value is uncertain, use null and add a note in "evidence"
- Dates → ISO if explicit; else keep original string
- Do not hallucinate; prefer "unknown" or null for uncertain values
- Ensure totals.byDept sums correctly to individual budget items
- Extract officer names, titles, and contact information when available
- Status should be "proposed" unless clearly stated otherwise
- Include page numbers where information was found
- Keep evidence snippets under 200 characters

Schema requirements:
- Each budget and action item needs a unique ID (UUID format)
- All monetary amounts should be numbers only (no currency symbols)
- Department names should be normalized (e.g., "Water Supply", "Roads", "Sanitation", "Education", "Health")
- Contact information should include phone numbers if available`;

    const userPrompt = `CONTEXT:
Municipality minutes OCR content follows, by page.
Source file: ${request.sourceFileName}
Upload time: ${request.uploadedAt}

TASKS:
1) Extract budget allocations and action items from the meeting minutes
2) Map officer names/titles/departments if present  
3) Compute totals: overall budget + by department
4) Provide contact information if present
5) Keep evidence snippets and page references

OCR CONTENT:
${request.pagedText}

Return JSON only with the extracted data following the schema.`;

    try {
      logger.info('Calling OpenAI for structure extraction');
      
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      });

      const responseText = completion.choices[0]?.message?.content;
      if (!responseText) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      let extractedData: any;
      try {
        extractedData = JSON.parse(responseText);
      } catch (parseError) {
        logger.error('Error parsing OpenAI JSON response:', parseError);
        throw new Error('Invalid JSON response from LLM');
      }

      // Add required fields if missing
      extractedData.meta = {
        ...extractedData.meta,
        sourceFileName: request.sourceFileName,
        uploadedAt: request.uploadedAt
      };

      // Generate UUIDs for items without them
      if (extractedData.budgets) {
        extractedData.budgets = extractedData.budgets.map((budget: any) => ({
          ...budget,
          id: budget.id || uuidv4()
        }));
      }

      if (extractedData.actions) {
        extractedData.actions = extractedData.actions.map((action: any) => ({
          ...action,
          id: action.id || uuidv4(),
          status: action.status || 'unknown'
        }));
      }

      // Compute totals if not provided or incorrect
      if (extractedData.budgets?.length > 0) {
        const budgetTotal = extractedData.budgets.reduce((sum: number, budget: any) => 
          sum + (budget.amount?.amount || 0), 0);
        
        const deptTotals = new Map<string, number>();
        extractedData.budgets.forEach((budget: any) => {
          const dept = budget.department || 'Other';
          const amount = budget.amount?.amount || 0;
          deptTotals.set(dept, (deptTotals.get(dept) || 0) + amount);
        });

        extractedData.totals = {
          budgetTotal,
          byDept: Array.from(deptTotals.entries()).map(([department, total]) => ({
            department,
            total
          }))
        };
      } else {
        extractedData.totals = {
          budgetTotal: 0,
          byDept: []
        };
      }

      // Set version
      extractedData.version = 1;

      // Validate the extracted data
      const validation = validateExtractData(extractedData);
      if (!validation.valid) {
        logger.warn('Initial validation failed, attempting to fix and retry');
        
        // Try once more with validation errors included
        const retryPrompt = `The previous extraction had validation errors:
${validation.errors?.join('\n')}

Please fix these issues and return valid JSON:
${userPrompt}`;

        const retryCompletion = await this.openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: retryPrompt }
          ],
          temperature: 0.1,
          max_tokens: 4000,
          response_format: { type: 'json_object' }
        });

        const retryResponseText = retryCompletion.choices[0]?.message?.content;
        if (!retryResponseText) {
          throw new Error('No response from OpenAI on retry');
        }

        extractedData = JSON.parse(retryResponseText);
        
        // Revalidate
        const retryValidation = validateExtractData(extractedData);
        if (!retryValidation.valid) {
          extractedData.errors = retryValidation.errors;
          logger.error('Validation still failed after retry:', retryValidation.errors);
        }
      }

      logger.info(`Successfully extracted ${extractedData.budgets?.length || 0} budget items and ${extractedData.actions?.length || 0} action items`);
      
      return extractedData as ExtractResult;

    } catch (error) {
      logger.error('Error in LLM extraction:', error);
      
      // Return a basic structure with error information
      return {
        meta: {
          sourceFileName: request.sourceFileName,
          uploadedAt: request.uploadedAt
        },
        budgets: [],
        actions: [],
        totals: {
          budgetTotal: 0,
          byDept: []
        },
        errors: [`LLM extraction failed: ${error}`],
        version: 1
      };
    }
  }
}

export default new LlmService();