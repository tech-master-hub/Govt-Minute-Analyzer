import Ajv from 'ajv';

const ajv = new Ajv({ allErrors: true });

export const ExtractSchema = {
  type: "object",
  required: ["meta", "budgets", "actions", "totals"],
  properties: {
    meta: {
      type: "object",
      required: ["sourceFileName", "uploadedAt"],
      properties: {
        municipality: { type: "string", nullable: true },
        meetingDate: { type: "string", nullable: true },
        meetingType: { type: "string", nullable: true },
        language: { type: "array", items: { type: "string" }, nullable: true },
        sourceFileName: { type: "string" },
        uploadedAt: { type: "string" }
      }
    },
    budgets: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "purpose", "amount"],
        properties: {
          id: { type: "string" },
          purpose: { type: "string" },
          department: { type: "string", nullable: true },
          amount: {
            type: "object",
            required: ["amount", "currency"],
            properties: {
              amount: { type: "number" },
              currency: { const: "INR" },
              sourceText: { type: "string", nullable: true },
              pages: { type: "array", items: { type: "integer" } }
            }
          },
          pages: { type: "array", items: { type: "integer" } },
          evidence: { type: "string", nullable: true }
        }
      }
    },
    actions: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "title", "status"],
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          department: { type: "string", nullable: true },
          officer: {
            type: "object",
            nullable: true,
            properties: {
              name: { type: "string", nullable: true },
              title: { type: "string", nullable: true },
              dept: { type: "string", nullable: true },
              contact: { type: "string", nullable: true },
              pages: { type: "array", items: { type: "integer" } }
            }
          },
          budget: {
            type: "object",
            nullable: true,
            properties: {
              amount: { type: "number", nullable: true },
              currency: { const: "INR" },
              sourceText: { type: "string", nullable: true },
              pages: { type: "array", items: { type: "integer" } }
            }
          },
          deadline: { type: "string", nullable: true },
          status: { enum: ["proposed", "approved", "in-progress", "completed", "unknown"] },
          priority: { enum: ["low", "medium", "high"], nullable: true },
          pages: { type: "array", items: { type: "integer" } },
          evidence: { type: "string", nullable: true }
        }
      }
    },
    contacts: {
      type: "array",
      nullable: true,
      items: {
        type: "object",
        properties: {
          name: { type: "string", nullable: true },
          title: { type: "string", nullable: true },
          dept: { type: "string", nullable: true },
          contact: { type: "string", nullable: true },
          pages: { type: "array", items: { type: "integer" } }
        }
      }
    },
    totals: {
      type: "object",
      required: ["budgetTotal", "byDept"],
      properties: {
        budgetTotal: { type: "number" },
        byDept: {
          type: "array",
          items: {
            type: "object",
            required: ["department", "total"],
            properties: {
              department: { type: "string" },
              total: { type: "number" }
            }
          }
        }
      }
    },
    errors: { type: "array", items: { type: "string" }, nullable: true },
    version: { type: "number" }
  }
};

export const validateExtract = ajv.compile(ExtractSchema);

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export function validateExtractData(data: any): ValidationResult {
  const valid = validateExtract(data);
  
  if (!valid) {
    return {
      valid: false,
      errors: validateExtract.errors?.map(err => 
        `${err.instancePath} ${err.message}`
      ) || ['Unknown validation error']
    };
  }
  
  return { valid: true };
}