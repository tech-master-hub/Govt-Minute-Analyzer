import mongoose, { Document, Schema } from 'mongoose';

// Type definitions
export interface Money {
  amount: number;
  currency: "INR";
  sourceText?: string;
  pages?: number[];
}

export interface Officer {
  name?: string;
  title?: string;
  dept?: string;
  contact?: string;
  pages?: number[];
}

export interface ActionItem {
  id: string;
  title: string;
  description?: string;
  department?: string;
  officer?: Officer;
  budget?: Money;
  deadline?: string;
  status: "proposed" | "approved" | "in-progress" | "completed" | "unknown";
  priority?: "low" | "medium" | "high";
  pages?: number[];
  evidence?: string;
}

export interface BudgetLine {
  id: string;
  purpose: string;
  department?: string;
  amount: Money;
  pages?: number[];
  evidence?: string;
}

export interface Meta {
  municipality?: string;
  meetingDate?: string;
  meetingType?: string;
  language?: string[];
  sourceFileName: string;
  uploadedAt: string;
}

export interface ExtractDoc extends Document {
  shortId: string;
  meta: Meta;
  budgets: BudgetLine[];
  actions: ActionItem[];
  contacts?: Officer[];
  totals: {
    budgetTotal: number;
    byDept: { department: string; total: number }[];
  };
  errors?: string[];
  version: number;
}

// Mongoose Schemas
const MoneySchema = new Schema({
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: "INR" },
  sourceText: String,
  pages: [Number]
}, { _id: false });

const OfficerSchema = new Schema({
  name: String,
  title: String,
  dept: String,
  contact: String,
  pages: [Number]
}, { _id: false });

const ActionItemSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  department: String,
  officer: OfficerSchema,
  budget: MoneySchema,
  deadline: String,
  status: {
    type: String,
    enum: ["proposed", "approved", "in-progress", "completed", "unknown"],
    required: true
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"]
  },
  pages: [Number],
  evidence: String
}, { _id: false });

const BudgetLineSchema = new Schema({
  id: { type: String, required: true },
  purpose: { type: String, required: true },
  department: String,
  amount: { type: MoneySchema, required: true },
  pages: [Number],
  evidence: String
}, { _id: false });

const MetaSchema = new Schema({
  municipality: String,
  meetingDate: String,
  meetingType: String,
  language: [String],
  sourceFileName: { type: String, required: true },
  uploadedAt: { type: String, required: true }
}, { _id: false });

const ExtractSchema = new Schema({
  shortId: { type: String, required: true, unique: true, index: true },
  meta: { type: MetaSchema, required: true },
  budgets: [BudgetLineSchema],
  actions: [ActionItemSchema],
  contacts: [OfficerSchema],
  totals: {
    budgetTotal: { type: Number, required: true },
    byDept: [{
      department: { type: String, required: true },
      total: { type: Number, required: true }
    }]
  },
  errors: [String],
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

export const Extract = mongoose.model<ExtractDoc>('Extract', ExtractSchema);