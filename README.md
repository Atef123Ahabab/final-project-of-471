# Resume & Job Portal API

A complete REST API system for resume upload/parsing and job postings management using Node.js, Express, and MongoDB.

## Features

### Feature 01: Resume Upload & Parsing
- Upload resumes (PDF/DOC/DOCX)
- Extract and store skills, experience, and education
- Retrieve, update, and delete resume records
- Download resume files

### Feature 02: Job Posting & Management
- Create, edit, and close job postings
- Manage required skills and qualifications
- Search jobs by skills
- Track applicants
- Filter jobs by status, location, and type

### Feature 04: Fraud & Spam Detection (Admin)
- Flag suspicious user accounts
- Flag fake/spam job postings
- Unflag entities after review
- View all currently flagged users and jobs

### Feature 05: Audit Logs
- Automatic logging for important write actions (POST/PUT/PATCH/DELETE)
- Captures actor, endpoint, action type, status, and request metadata
- Filterable and paginated audit log endpoint

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **File Upload**: Multer
- **Frontend**: React + Vite
- **Port**: 1008

## Project Structure

```
backend/
├── server.js                    # Main entry point
├── package.json                 # Dependencies
├── .env                         # Environment variables
├── .gitignore
├── config/
│   └── database.js             # MongoDB connection
├── models/
│   ├── Resume.js               # Resume schema
│   └── JobPosting.js           # Job posting schema
├── controllers/
│   ├── resumeController.js      # Resume business logic
│   └── jobPostingController.js  # Job posting business logic
├── routes/
│   ├── resumeRoutes.js         # Resume API routes
│   └── jobPostingRoutes.js     # Job posting API routes
└── uploads/
    └── resumes/                 # Uploaded files storage
```

## Installation

### Prerequisites
- Node.js v14+
- MongoDB (local or remote)
- Postman (for testing)

### Setup Steps

1. **Clone/Extract the project**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure MongoDB** (optional)
   - Edit `.env` file if using remote MongoDB
   - Default: `mongodb://localhost:27017/resume-job-portal`

4. **Start the server**
   ```bash
   npm start
   ```

   Success output:
   ```
   ==========================================
   Server started successfully!
   Port: 1008
   URL: http://localhost:1008
   ==========================================
   ```

## API Endpoints

### Feature 01: Resume APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/upload` | Upload a resume |
| POST | `/api/resumes/:resumeId/parse` | Parse resume data |
| GET | `/api/resumes/:resumeId` | Get resume by ID |
| GET | `/api/resumes/user/:userId` | Get all user resumes |
| PUT | `/api/resumes/:resumeId` | Update resume |
| DELETE | `/api/resumes/:resumeId` | Delete resume |
| GET | `/api/resumes/:resumeId/download` | Download resume file |

### Feature 02: Job Posting APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/jobs/create` | Create job posting |
| GET | `/api/jobs/:jobId` | Get job by ID |
| GET | `/api/jobs` | Get all jobs (with filters) |
| GET | `/api/jobs/employer/:employerId` | Get employer's jobs |
| PUT | `/api/jobs/:jobId` | Update job posting |
| PUT | `/api/jobs/:jobId/close` | Close job posting |
| DELETE | `/api/jobs/:jobId` | Delete job posting |
| POST | `/api/jobs/search/skills` | Search jobs by skills |
| PUT | `/api/jobs/:jobId/apply` | Apply to job |

### Feature 04: Fraud & Spam Detection APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| PUT | `/api/admin/users/:userId/flag` | Flag suspicious user account |
| PUT | `/api/admin/users/:userId/unflag` | Remove user account flag |
| PUT | `/api/admin/jobs/:jobId/flag` | Flag fake/spam job posting |
| PUT | `/api/admin/jobs/:jobId/unflag` | Remove job posting flag |
| GET | `/api/admin/flags` | Get all currently flagged entities |

### Feature 05: Audit Log APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/audit-logs` | Get audit logs with filters and pagination |

Supported query params:
- `actionType`
- `entityType`
- `actorId`
- `success`
- `from`
- `to`
- `page`
- `limit`

## Frontend (React + Vite)

The project now includes a professional admin UI in `frontend/` with a consistent design system for:
- Jobs
- Fraud & Spam Detection
- Audit Logs

### Run Frontend in Development

```bash
cd frontend
npm install
npm run dev
```

Vite runs on `http://localhost:5173` and proxies API calls to backend `http://localhost:1008`.

### Build Frontend for Production

```bash
cd frontend
npm run build
```

The production output is generated in `frontend/dist` and is served by backend under `/app` when build files exist.

## Testing with Postman

1. **Import Collection**
   - Open Postman
   - Click "Import"
   - Select `Resume_Job_Portal_API.postman_collection.json`

2. **Set Up Variables**
   - Collection → Variables
   - Set `resumeId` and `jobId` as needed

3. **Test Endpoints**
   - Follow the logical order in the collection
   - Check responses and status codes

## Example Requests

### Upload Resume
```bash
curl -X POST http://localhost:1008/api/resumes/upload \
  -F "resume=@resume.pdf" \
  -F "userId=user-001" \
  -F "fullName=John Doe" \
  -F "email=john@example.com"
```

### Create Job Posting
```bash
curl -X POST http://localhost:1008/api/jobs/create \
  -H "Content-Type: application/json" \
  -d '{
    "employerId": "emp-001",
    "jobTitle": "Senior Developer",
    "description": "Looking for experienced developer",
    "requiredSkills": ["JavaScript", "Node.js"],
    "location": "San Francisco",
    "salary": {"min": 120000, "max": 180000}
  }'
```

## Database Schemas

### Resume
```javascript
{
  userId: String,
  fileName: String,
  fileType: String,
  filePath: String,
  skills: [String],
  experience: [{jobTitle, company, duration, description}],
  education: [{degree, institution, year}],
  fullName: String,
  email: String,
  phone: String,
  summary: String,
  uploadedAt: Date
}
```

### JobPosting
```javascript
{
  employerId: String,
  jobTitle: String,
  description: String,
  requiredSkills: [String],
  qualifications: [String],
  location: String,
  salary: {min, max, currency},
  jobType: String,
  experience: {min, max},
  status: String,
  applicantsCount: Number,
  deadline: Date
}
```

## Environment Variables

Create a `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/resume-job-portal
PORT=1008
NODE_ENV=development
EMAIL_USER=ahababatef14@gmail.com
EMAIL_PASS=your_16_digit_gmail_app_password
EMAIL_NOTIFY_ADMIN=true
ADMIN_NOTIFY_EMAIL=ahababatef14@gmail.com
```

### Application Email Notifications

- Sender account uses `EMAIL_USER` (default is `ahababatef14@gmail.com`)
- When a user applies to a job via `PUT /api/jobs/:jobId/apply`, backend sends a confirmation email to the applicant's email.
- If `EMAIL_NOTIFY_ADMIN=true`, a copy is also sent to `ADMIN_NOTIFY_EMAIL`.
- If SMTP credentials are missing or email fails, the application is still saved and API response includes notification status details.

## Response Format

All responses follow this format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": { /* response data */ }
}
```

## Error Handling

- **400**: Bad Request (validation error)
- **404**: Not Found
- **500**: Server Error

## Development

### Available Scripts
- `npm start` - Start the server
- `npm run dev` - Start with nodemon (if installed)

### Adding New Features
1. Create model in `models/`
2. Create controller in `controllers/`
3. Create routes in `routes/`
4. Import routes in `server.js`

## Support

For issues or questions, check:
- API Documentation: `CSE471_Assignment_API_Documentation.txt`
- Postman Collection: `Resume_Job_Portal_API.postman_collection.json`

## Assignment Details

- **Course**: CSE471 - System Analysis and Design
- **Student ID**: 1008
- **Port**: 1008
- **Framework**: Node.js + Express
- **Database**: MongoDB
- **Status**: Complete with all APIs and documentation
