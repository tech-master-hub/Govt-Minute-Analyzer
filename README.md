# Government Minutes Explainer

A comprehensive MERN stack application that transforms scanned local government meeting minutes into citizen-friendly visualizations. Extract budget allocations, action items, and deadlines from PDF documents and present them in an accessible "Citizen Card" format.

## Overview

The Government Minutes Explainer addresses the critical need for transparency in local governance by making complex government documents accessible to citizens. Upload scanned meeting minutes in PDF format, and the system will automatically extract key information using OCR and AI, then present it in a clean, print-ready format that anyone can understand.

### Key Differentiators
- **Village-friendly visuals**: Large headings, icons, Tamil/English labels
- **Grounded extraction**: AI extraction with page references and evidence
- **Print-ready output**: A4 portrait layout optimized for printing and sharing
- **Bilingual support**: Tamil and English interface and content support
- **Mobile-first design**: Responsive across all devices

## Features

### Core Functionality
- **Secure PDF Upload**: Drag & drop interface with file validation (50MB limit)
- **Advanced OCR**: Tesseract.js with Tamil + English language support
- **AI-Powered Extraction**: OpenAI GPT-4 for structured data extraction
- **Citizen Card Generation**: Clean, accessible visualization format
- **Public Sharing**: Short URL generation for read-only access
- **Print Optimization**: A4 layout with print-friendly styles

### Citizen Card Components
- **Budget Summary**: Total allocations with department-wise breakdown
- **Action Items Table**: Tasks with responsible officers, deadlines, and status
- **Timeline View**: Upcoming deadlines in chronological order  
- **Contact Information**: Office details and contact numbers
- **Department Icons**: Visual indicators for different government departments
- **Evidence References**: Page numbers and text snippets for transparency

## Technology Stack

### Backend Infrastructure
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js with comprehensive middleware
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: OpenAI GPT-4 for intelligent data extraction
- **OCR Engine**: Tesseract.js with multi-language support
- **PDF Processing**: PDF-Poppler for high-quality image conversion
- **Storage**: AWS S3 compatible (supports Cloudflare R2)
- **Logging**: Winston with structured logging
- **Validation**: AJV for JSON schema validation

### Frontend Architecture  
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and building
- **Styling**: TailwindCSS with custom design system
- **Charts**: Chart.js for budget visualizations
- **Routing**: React Router for SPA navigation
- **HTTP Client**: Axios with interceptors
- **File Upload**: React Dropzone for drag & drop
- **Notifications**: React Hot Toast for user feedback

### Development & Deployment
- **Package Manager**: npm with workspace support
- **Code Quality**: ESLint + TypeScript strict mode
- **Concurrency**: Concurrent development servers
- **Build Process**: Automated frontend/backend building
- **Environment**: dotenv for configuration management

## Detailed Project Structure

```
gov-minutes-explainer/
â”œâ”€â”€ ðŸ“„ README.md                    # This comprehensive guide
â”œâ”€â”€ ðŸ“„ package.json                 # Root workspace configuration
â”‚
â”œâ”€â”€ ðŸ”§ backend/                     # Node.js API server
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ ðŸ›£ï¸  routes/            # Express route handlers
â”‚   â”‚   â”‚   â”œâ”€â”€ uploads.ts         # File upload endpoints
â”‚   â”‚   â”‚   â”œâ”€â”€ extracts.ts        # Processing pipeline
â”‚   â”‚   â”‚   â””â”€â”€ shares.ts          # Public sharing API
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ ðŸ”§ services/           # Core business logic
â”‚   â”‚   â”‚   â”œâ”€â”€ ocr.ts            # Tesseract OCR integration
â”‚   â”‚   â”‚   â”œâ”€â”€ llm.ts            # OpenAI GPT integration  
â”‚   â”‚   â”‚   â”œâ”€â”€ storage.ts        # S3 storage operations
â”‚   â”‚   â”‚   â”œâ”€â”€ pdf.ts            # PDF processing utilities
â”‚   â”‚   â”‚   â””â”€â”€ icons.ts          # Icon generation service
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ ðŸ“Š models/             # MongoDB schemas
â”‚   â”‚   â”‚   â””â”€â”€ Extract.ts        # Main data model
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ ðŸ› ï¸  utils/             # Helper utilities
â”‚   â”‚   â”‚   â”œâ”€â”€ logger.ts         # Winston logging setup
â”‚   â”‚   â”‚   â””â”€â”€ schema.ts         # AJV validation schemas
â”‚   â”‚   â”‚
â”‚   â”‚   â””â”€â”€ ðŸš€ index.ts            # Express application entry
â”‚   â”‚
â”‚   â”œâ”€â”€ ðŸ“¦ package.json            # Backend dependencies
â”‚   â”œâ”€â”€ âš™ï¸  tsconfig.json          # TypeScript configuration
â”‚   â””â”€â”€ ðŸ” .env.example           # Environment template
â”‚
â”œâ”€â”€ ðŸŽ¨ frontend/                    # React application
â”‚   â”œâ”€â”€ src/
â”‚   â”‚   â”œâ”€â”€ ðŸ§© components/         # Reusable React components
â”‚   â”‚   â”‚   â”œâ”€â”€ UploadBox.tsx     # File upload interface
â”‚   â”‚   â”‚   â”œâ”€â”€ ProgressSteps.tsx  # Processing indicators
â”‚   â”‚   â”‚   â”œâ”€â”€ CitizenCard.tsx   # Main visualization
â”‚   â”‚   â”‚   â”œâ”€â”€ BudgetChart.tsx   # Budget pie/bar charts
â”‚   â”‚   â”‚   â”œâ”€â”€ ActionTable.tsx   # Action items table
â”‚   â”‚   â”‚   â””â”€â”€ ShareBar.tsx      # Sharing controls
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ ðŸ“„ pages/              # Page-level components
â”‚   â”‚   â”‚   â”œâ”€â”€ Home.tsx          # Upload and processing
â”‚   â”‚   â”‚   â””â”€â”€ ViewShare.tsx     # Public sharing view
â”‚   â”‚   â”‚
â”‚   â”‚   â”œâ”€â”€ ðŸŽ¯ App.tsx             # Main application component
â”‚   â”‚   â”œâ”€â”€ ðŸ main.tsx            # React DOM entry point
â”‚   â”‚   â””â”€â”€ ðŸŽ¨ index.css           # Global styles
â”‚   â”‚
â”‚   â”œâ”€â”€ ðŸ“„ index.html              # HTML template
â”‚   â”œâ”€â”€ ðŸ“¦ package.json            # Frontend dependencies  
â”‚   â”œâ”€â”€ âš™ï¸  vite.config.ts         # Vite build configuration
â”‚   â”œâ”€â”€ ðŸŽ¨ tailwind.config.js      # TailwindCSS configuration
â”‚   â””â”€â”€ ðŸ“ postcss.config.js       # PostCSS configuration
```

## Quick Start Guide

### Prerequisites
- **Node.js**: Version 18 or higher
- **MongoDB**: Local instance or MongoDB Atlas
- **OpenAI API**: Valid API key with GPT-4 access
- **S3 Storage**: AWS S3 or Cloudflare R2 account
- **System Dependencies**: 
  - Tesseract OCR libraries
  - PDF processing tools (poppler-utils)

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd gov-minutes-explainer
```

2. **Install All Dependencies**
```bash
npm run install:all
```
This command installs dependencies for both backend and frontend projects.

3. **Backend Configuration**
```bash
cd backend
cp .env.example .env
```

4. **Configure Environment Variables**
Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/gov-minutes
# For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/gov-minutes

# AI Services
OPENAI_API_KEY=sk-your-openai-api-key-here

# S3 Compatible Storage
BUCKET_ENDPOINT=https://your-bucket-endpoint.com
BUCKET_ACCESS_KEY=your-access-key
BUCKET_SECRET_KEY=your-secret-key
BUCKET_NAME=gov-minutes
BUCKET_REGION=auto

# Security
UPLOAD_SECRET=your-strong-secret-string-here

# OCR Configuration  
OCR_LANGS=tam+eng
PAGE_LIMIT=15

# CORS and URLs
FRONTEND_URL=http://localhost:5173
PUBLIC_BASE_URL=http://localhost:5173
```

5. **Start Development Servers**
```bash
# From project root directory
npm run dev
```

This starts both servers concurrently:
-  Backend API: http://localhost:4000
-  Frontend App: http://localhost:5173

## ðŸ“Š Data Processing Pipeline

### Step 1: PDF Upload
- File validation (PDF only, max 50MB)
- Secure storage in S3-compatible bucket
- Metadata extraction and logging

### Step 2: PDF to Images
- Convert PDF pages to PNG images (300 DPI)
- Limit to first 15 pages for performance
- High-quality rendering for accurate OCR

### Step 3: OCR Processing
- Tesseract.js with Tamil + English models
- Page-by-page text extraction
- Confidence scoring and error handling
- Table detection and structure preservation

### Step 4: AI Extraction
- OpenAI GPT-4 powered analysis
- Structured data extraction using JSON schemas
- Evidence grounding with page references
- Validation and error correction loops

### Step 5: Database Storage
- MongoDB document creation with short URL
- Computed totals and department summaries
- Indexed for fast public access

### Step 6: Citizen Card Generation  
- React-based responsive visualization
- Print-optimized A4 layout
- Department icons and status indicators
- Public sharing link generation

## API Reference

### Authentication
Most endpoints require the `upload-secret` header for security:
```bash
curl -H "upload-secret: your-upload-secret" ...
```

### Upload Endpoints

#### Upload PDF File
```http
POST /api/uploads
Content-Type: multipart/form-data
upload-secret: your-secret

Body: PDF file as form data with key "pdf"

Response:
{
  "fileId": "pdfs/1694812800000-minutes.pdf",
  "fileName": "minutes.pdf", 
  "fileSize": 2048576,
  "mimeType": "application/pdf",
  "uploadedAt": "2025-09-15T15:30:00.000Z",
  "message": "PDF uploaded successfully"
}
```

#### Get File Information
```http
GET /api/uploads/{fileId}/info

Response:
{
  "fileId": "pdfs/1694812800000-minutes.pdf",
  "status": "uploaded",
  "message": "File information retrieved"
}
```

#### Delete Uploaded File
```http
DELETE /api/uploads/{fileId}
upload-secret: your-secret

Response:
{
  "message": "File deleted successfully",
  "fileId": "pdfs/1694812800000-minutes.pdf"
}
```

### Extraction Endpoints

#### Process PDF
```http
POST /api/extract
Content-Type: application/json

{
  "fileId": "pdfs/1694812800000-minutes.pdf"
}

Response:
{
  "shortId": "a7Kf3xQ2",
  "processingTime": 45000,
  "summary": {
    "pages": 5,
    "budgetItems": 3,
    "actionItems": 4,
    "totalBudget": 4200000,
    "errors": 0
  },
  "message": "Extraction completed successfully"
}
```

#### Get Processing Status
```http
GET /api/extract/{shortId}/status

Response:
{
  "shortId": "a7Kf3xQ2",
  "status": "completed",
  "createdAt": "2025-09-15T15:30:00.000Z",
  "summary": {
    "budgetItems": 3,
    "actionItems": 4, 
    "totalBudget": 4200000,
    "errors": 0
  }
}
```

### Sharing Endpoints

#### Get Public Extract Data
```http
GET /api/shares/{shortId}

Response:
{
  "shortId": "a7Kf3xQ2",
  "meta": {
    "municipality": "Keelapatti Panchayat",
    "meetingDate": "2025-07-14",
    "meetingType": "Monthly Panchayat Meeting",
    "sourceFileName": "minutes-july-2025.pdf",
    "uploadedAt": "2025-09-15T15:30:00Z"
  },
  "totals": {
    "budgetTotal": 4200000,
    "byDept": [
      {"department": "Water Supply", "total": 1500000},
      {"department": "Roads", "total": 1200000}
    ]
  },
  "budgets": [...],
  "actions": [...],
  "contacts": [...],
  "version": 1
}
```

### Health Check
```http
GET /api/health

Response:
{
  "status": "ok",
  "timestamp": "2025-09-15T15:30:00.000Z", 
  "version": "1.0.0"
}
```

## Database Schema

### Extract Document Structure

```typescript
interface ExtractDoc {
  _id: ObjectId;
  shortId: string;           // 8-character public identifier
  
  meta: {
    municipality?: string;    // "Keelapatti Panchayat"
    meetingDate?: string;     // ISO date: "2025-07-14"  
    meetingType?: string;     // "Monthly Panchayat Meeting"
    language?: string[];      // ["ta", "en"]
    sourceFileName: string;   // Original filename
    uploadedAt: string;       // ISO timestamp
  };
  
  budgets: [{
    id: string;               // UUID
    purpose: string;          // "Overhead tank repair" 
    department?: string;      // "Water Supply"
    amount: {
      amount: number;         // 1200000
      currency: "INR";
      sourceText?: string;    // "Rs. 12 lakhs"
      pages?: number[];       // [2, 3]
    };
    pages?: number[];         // Pages where found
    evidence?: string;        // Text snippet (max 200 chars)
  }];
  
  actions: [{
    id: string;               // UUID
    title: string;            // "Repair village overhead tank"
    description?: string;     // Additional details
    department?: string;      // "Water Supply"
    officer?: {
      name?: string;          // "A. Kumar"
      title?: string;         // "Assistant Engineer"
      dept?: string;          // "PWD"
      contact?: string;       // "9876543210"
      pages?: number[];
    };
    budget?: {
      amount: number;
      currency: "INR";
      sourceText?: string;
      pages?: number[];
    };
    deadline?: string;        // "2025-09-30" or "End of September"
    status: "proposed" | "approved" | "in-progress" | "completed" | "unknown";
    priority?: "low" | "medium" | "high";
    pages?: number[];
    evidence?: string;
  }];
  
  contacts?: [{
    name?: string;            // "Panchayat Office"
    title?: string;           // "Village Development Officer"  
    dept?: string;            // "Administration"
    contact?: string;         // "04362-245678"
    pages?: number[];
  }];
  
  totals: {
    budgetTotal: number;      // 4200000
    byDept: [{
      department: string;     // "Water Supply"
      total: number;          // 1500000
    }];
  };
  
  errors?: string[];          // Processing errors if any
  version: number;            // Schema version (1)
  createdAt: Date;           // Auto-generated
  updatedAt: Date;           // Auto-generated
}
```

## Frontend Components

### UploadBox Component
```typescript
interface UploadBoxProps {
  onFileSelect: (file: File) => void;
  isUploading: boolean;
  uploadProgress: number;
}
```
- Drag & drop interface with visual feedback
- File validation and error messages  
- Progress indicators during upload
- Tamil/English bilingual labels

### ProgressSteps Component
```typescript
interface ProgressStepsProps {
  currentStep: 'upload' | 'ocr' | 'extract' | 'ready';
  progress: number;
  error?: string;
}
```
- Visual step indicators (1â†’2â†’3â†’4)
- Real-time progress updates
- Error state handling with retry options
- Estimated time remaining

### CitizenCard Component  
```typescript
interface CitizenCardProps {
  extractData: ExtractDoc;
  printMode?: boolean;
}
```
- Print-optimized A4 layout
- Budget visualization with Chart.js
- Action items table with sorting
- Timeline view of deadlines
- Contact information display
- Department-specific iconography

### BudgetChart Component
```typescript
interface BudgetChartProps {
  budgetData: BudgetLine[];
  totalAmount: number;
  chartType: 'pie' | 'bar';
}
```
- Interactive Chart.js visualizations
- Department-wise budget breakdown
- Responsive design for mobile
- Print-friendly color schemes
- Hover tooltips with details

### ActionTable Component
```typescript
interface ActionTableProps {
  actions: ActionItem[];
  sortBy: 'deadline' | 'priority' | 'status';
  showFilters?: boolean;
}
```
- Sortable and filterable table
- Status indicators with colors
- Officer contact information
- Mobile-responsive layout
- Print optimization

### ShareBar Component
```typescript
interface ShareBarProps {
  shortId: string;
  baseUrl: string;
  onCopySuccess: () => void;
}
```
- Short URL generation and display
- One-click copy to clipboard
- QR code generation for mobile sharing
- Social media integration hooks
- Print-friendly sharing options

## ðŸ”§ Configuration Guide

### MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB Community Edition
# Ubuntu/Debian:
sudo apt-get install mongodb

# macOS with Homebrew:
brew install mongodb-community

# Start MongoDB service:
sudo systemctl start mongod    # Linux
brew services start mongodb-community    # macOS
```

**MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/atlas
2. Create new cluster (free tier available)
3. Configure network access (add your IP)
4. Create database user with read/write permissions
5. Get connection string and update `MONGODB_URI`

### OpenAI API Setup

1. Create account at https://platform.openai.com/
2. Generate API key in API Keys section
3. Ensure GPT-4 model access (may require billing setup)
4. Add key to `.env` file as `OPENAI_API_KEY`
5. Monitor usage in OpenAI dashboard

### S3 Storage Configuration

**AWS S3:**
```bash
# Install AWS CLI
pip install awscli

# Configure credentials
aws configure
```

**Cloudflare R2:**
1. Create Cloudflare account
2. Go to R2 Object Storage
3. Create new bucket
4. Generate API tokens with R2 permissions  
5. Use R2 endpoint format in `BUCKET_ENDPOINT`

### Environment-Specific Configurations

**Development (.env.development):**
```env
NODE_ENV=development
LOG_LEVEL=debug
BUCKET_ENDPOINT=http://localhost:9000  # MinIO for local testing
```

**Production (.env.production):**
```env
NODE_ENV=production
LOG_LEVEL=info
BUCKET_ENDPOINT=https://your-production-bucket.com
MONGODB_URI=mongodb+srv://prod-user:password@cluster.mongodb.net/
```

## Deployment Guide

### Backend Deployment

**Railway:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Render:**
1. Connect GitHub repository
2. Choose "Web Service"
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables in dashboard

**Fly.io:**
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Initialize and deploy
flyctl auth login
flyctl launch
flyctl deploy
```

### Frontend Deployment

**Vercel:**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

**Netlify:**
```bash
# Install Netlify CLI  
npm install -g netlify-cli

# Build and deploy
cd frontend
npm run build
netlify deploy --prod --dir=dist
```

### Environment Variables for Production

**Backend (.env.production):**
```env
PORT=4000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/gov-minutes-prod
OPENAI_API_KEY=sk-production-key
BUCKET_ENDPOINT=https://production-bucket.s3.amazonaws.com
BUCKET_NAME=gov-minutes-prod
UPLOAD_SECRET=super-strong-production-secret
FRONTEND_URL=https://your-frontend-domain.com
PUBLIC_BASE_URL=https://your-frontend-domain.com
```

**Frontend (Environment Variables):**
```env
VITE_API_BASE_URL=https://your-backend-api.com
VITE_PUBLIC_BASE_URL=https://your-frontend-domain.com
```

## ðŸ”’ Security Considerations

### File Upload Security
- PDF MIME type validation
- File size limits (50MB maximum)
- Virus scanning (recommended for production)
- Secure file storage with private access
- Upload rate limiting

### API Security
- Upload secret authentication
- CORS configuration for frontend domain
- Request rate limiting
- Input validation and sanitization
- MongoDB injection prevention

### Data Privacy
- Original PDFs stored privately (not publicly accessible)
- Extracted data anonymization options
- Audit logging for access tracking
- GDPR compliance considerations
- Data retention policies

### Infrastructure Security
- HTTPS enforcement in production
- Environment variable protection
- Database connection encryption
- S3 bucket access policies
- Regular security updates

## Testing

### Backend Testing
```bash
cd backend

# Unit tests
npm test

# Integration tests  
npm run test:integration

# API testing with coverage
npm run test:coverage
```

### Frontend Testing
```bash
cd frontend

# Component tests
npm test

# E2E tests with Cypress
npm run test:e2e

# Visual regression tests
npm run test:visual
```

### Manual Testing Checklist

**File Upload:**
- [ ] Valid PDF files upload successfully
- [ ] Invalid file types are rejected
- [ ] Large files (>50MB) are rejected
- [ ] Upload progress is displayed correctly
- [ ] Error messages are user-friendly

**OCR Processing:**
- [ ] Tamil text is recognized accurately
- [ ] English text is recognized accurately  
- [ ] Mixed language documents work
- [ ] Table structures are preserved
- [ ] Low-quality scans handle gracefully

**AI Extraction:**
- [ ] Budget items are extracted correctly
- [ ] Action items include all required fields
- [ ] Page references are accurate
- [ ] Department categorization works
- [ ] Error handling for unclear documents

**Citizen Card:**
- [ ] Budget chart renders correctly
- [ ] Action table is sortable and filterable
- [ ] Print layout fits A4 paper properly
- [ ] Mobile layout is readable
- [ ] Icons display for all departments

**Sharing:**
- [ ] Short URLs are generated correctly
- [ ] Public access works without authentication
- [ ] QR codes scan correctly on mobile
- [ ] Copy to clipboard functionality works
- [ ] Social sharing integration works

## Troubleshooting

### Common Issues

**"Module not found" errors:**
```bash
# Clean install all dependencies
rm -rf node_modules package-lock.json
npm run install:all
```

**OCR not working:**
```bash
# Install Tesseract system dependencies
# Ubuntu/Debian:
sudo apt-get install tesseract-ocr tesseract-ocr-tam

# macOS:
brew install tesseract tesseract-lang
```

**PDF processing errors:**
```bash
# Install poppler-utils
# Ubuntu/Debian:  
sudo apt-get install poppler-utils

# macOS:
brew install poppler
```

**MongoDB connection issues:**
- Verify MongoDB is running: `systemctl status mongod`
- Check connection string format
- Ensure network access for MongoDB Atlas
- Verify authentication credentials

**OpenAI API errors:**
- Check API key validity and permissions
- Verify GPT-4 model access
- Monitor rate limits and quotas
- Check account billing status

**S3 storage issues:**
- Verify credentials and permissions  
- Check bucket name and region
- Ensure CORS policy allows uploads
- Test connection with AWS CLI

### Performance Optimization

**Backend Optimization:**
- Enable MongoDB indexing for shortId lookups
- Implement Redis caching for frequent requests
- Use connection pooling for database
- Optimize OCR processing with worker queues
- Implement request rate limiting

**Frontend Optimization:**
- Code splitting for large components
- Image optimization and lazy loading
- Chart.js performance configurations
- Bundle size analysis and reduction
- Service worker for offline capability

**Infrastructure Optimization:**
- CDN for static asset delivery
- Database read replicas for scaling
- Load balancing for multiple instances  
- Monitoring and alerting setup
- Automated backup strategies

## Monitoring and Analytics

### Application Monitoring
```javascript
// Winston logging configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});
```

### Key Metrics to Track
- Upload success/failure rates
- OCR processing times and accuracy  
- AI extraction success rates
- Public share link access patterns
- User engagement with Citizen Cards
- System resource usage
- Error rates by component

### Health Checks
```bash
# API health endpoint
curl http://localhost:4000/api/health

# Database connectivity
curl http://localhost:4000/api/health/db

# Storage availability  
curl http://localhost:4000/api/health/storage
```

## Contributing

### Development Setup
1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes with tests
5. Run the test suite: `npm test`  
6. Commit with conventional commits: `git commit -m "feat: add new feature"`
7. Push to your fork: `git push origin feature/your-feature`
8. Create a pull request

### Code Style Guidelines
- Use TypeScript for all new code
- Follow ESLint configurations
- Add JSDoc comments for public functions
- Write unit tests for new features
- Update documentation for API changes

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Pull Request Process
1. Ensure CI passes (tests, linting, build)
2. Update README if needed
3. Add/update tests for new functionality  
4. Get code review from maintainers
5. Squash commits before merging

##  License

MIT License

Copyright (c) 2025 Government Minutes Explainer

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Support and Community

### Getting Help
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides and API reference
- **Community Forum**: Discussion and help from other developers
- **Email Support**: Technical support for deployment issues

### Roadmap
- **Phase 2**: Multi-language OCR support (Hindi, Telugu, Kannada)
- **Phase 3**: Mobile app for citizen access
- **Phase 4**: Integration with government portals
- **Phase 5**: Real-time collaboration features
- **Phase 6**: Advanced analytics and reporting

### Acknowledgments
- **Tesseract.js** team for OCR capabilities
- **OpenAI** for AI-powered extraction
- **React** and **Node.js** communities
- **Government of India** for digital transparency initiatives
- **Open source contributors** worldwide

---

**Built with â¤ï¸ for transparent local governance in India**

For the latest updates and detailed documentation, visit our GitHub repository and official documentation site.

Last updated: September 15, 2025
