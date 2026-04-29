# Resume & Job Portal API Documentation

**Project:** CSE471 - Resume & Job Portal
**Student ID:** 1008
**Backend Framework:** Node.js + Express.js
**Database:** MongoDB
**API Base URL:** http://localhost:1008/api
**Port:** 1008

---

## Table of Contents
1. [Feature 01: Resume Management APIs (7 endpoints)](#feature-01)
2. [Feature 02: Job Posting APIs (9 endpoints)](#feature-02)
3. [Response Format](#response-format)
4. [Error Handling](#error-handling)

---

# FEATURE 01: RESUME MANAGEMENT <a name="feature-01"></a>

## API 1.1: Upload Resume

**Description:** Upload a resume file (PDF, DOC, DOCX) and store it in the database.

**Endpoint URL:** `http://localhost:1008/api/resumes/upload`

**HTTP Method:** `POST`

**Headers:**
```
Content-Type: multipart/form-data
```

**Body (Form-Data):**
```
- userId (text): user-001
- fullName (text): John Doe
- email (text): john@example.com
- phone (text): 123-456-7890
- resume (file): [Select PDF/DOC/DOCX file]
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Resume uploaded successfully",
  "data": {
    "resumeId": "507f1f77bcf86cd799439011",
    "fileName": "resume.pdf",
    "uploadedAt": "2026-03-14T15:45:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "No file uploaded"
}
```

**Status Code:** 201 Created

---

## API 1.2: Parse Resume

**Description:** Extract and parse resume data including skills, experience, and education.

**Endpoint URL:** `http://localhost:1008/api/resumes/{resumeId}/parse`

**HTTP Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "skills": ["JavaScript", "React", "Node.js"],
  "experience": [
    {
      "jobTitle": "Senior Developer",
      "company": "Tech Corp",
      "duration": "2020-2024",
      "description": "Built web applications"
    }
  ],
  "education": [
    {
      "degree": "BS Computer Science",
      "institution": "University",
      "year": "2020"
    }
  ],
  "summary": "Experienced developer with 4+ years"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resume parsed successfully",
  "data": {
    "resumeId": "507f1f77bcf86cd799439011",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [
      {
        "jobTitle": "Senior Developer",
        "company": "Tech Corp",
        "duration": "2020-2024",
        "description": "Built web applications"
      }
    ],
    "education": [
      {
        "degree": "BS Computer Science",
        "institution": "University",
        "year": "2020"
      }
    ],
    "summary": "Experienced developer with 4+ years"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Resume not found"
}
```

**Status Code:** 200 OK

---

## API 1.3: Get Resume

**Description:** Retrieve a specific resume by its ID.

**Endpoint URL:** `http://localhost:1008/api/resumes/{resumeId}`

**HTTP Method:** `GET`

**Headers:**
```
None
```

**Parameters:**
```
- resumeId (path parameter): The ID of the resume to retrieve
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "userId": "user-001",
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "fileName": "resume.pdf",
    "fileType": "pdf",
    "filePath": "uploads/resumes/1710427500000-resume.pdf",
    "skills": ["JavaScript", "React", "Node.js"],
    "experience": [...],
    "education": [...],
    "uploadedAt": "2026-03-14T15:45:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Resume not found"
}
```

**Status Code:** 200 OK

---

## API 1.4: Get User Resumes

**Description:** Retrieve all resumes for a specific user.

**Endpoint URL:** `http://localhost:1008/api/resumes/user/{userId}`

**HTTP Method:** `GET`

**Headers:**
```
None
```

**Parameters:**
```
- userId (path parameter): The ID of the user
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "userId": "user-001",
      "fullName": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "skills": ["JavaScript", "React"],
      "uploadedAt": "2026-03-14T15:45:00.000Z"
    },
    {
      "_id": "507f1f77bcf86cd799439012",
      "userId": "user-001",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "phone": "123-456-7890",
      "skills": ["Python", "Django"],
      "uploadedAt": "2026-03-14T16:00:00.000Z"
    }
  ]
}
```

**Status Code:** 200 OK

---

## API 1.5: Update Resume

**Description:** Update resume information (skills, experience, education, contact details).

**Endpoint URL:** `http://localhost:1008/api/resumes/{resumeId}`

**HTTP Method:** `PUT`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "skills": ["Python", "Django", "React"],
  "fullName": "Jane Doe",
  "email": "jane@example.com",
  "phone": "987-654-3210",
  "summary": "Full-stack developer"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resume updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "fullName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "987-654-3210",
    "skills": ["Python", "Django", "React"],
    "summary": "Full-stack developer"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Resume not found"
}
```

**Status Code:** 200 OK

---

## API 1.6: Delete Resume

**Description:** Delete a resume and remove it from the database.

**Endpoint URL:** `http://localhost:1008/api/resumes/{resumeId}`

**HTTP Method:** `DELETE`

**Headers:**
```
None
```

**Body:**
```
None (Empty)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Resume deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Resume not found"
}
```

**Status Code:** 200 OK

---

## API 1.7: Download Resume

**Description:** Download the resume file (PDF/DOC/DOCX).

**Endpoint URL:** `http://localhost:1008/api/resumes/{resumeId}/download`

**HTTP Method:** `GET`

**Headers:**
```
None
```

**Response:**
```
File download (application/pdf, application/msword, or application/vnd.openxmlformats-officedocument.wordprocessingml.document)
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Resume not found"
}
```

**Status Code:** 200 OK (with file attachment)

---

# FEATURE 02: JOB POSTING <a name="feature-02"></a>

## API 2.1: Create Job Posting

**Description:** Create a new job posting with all required details.

**Endpoint URL:** `http://localhost:1008/api/jobs/create`

**HTTP Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "employerId": "employer-001",
  "jobTitle": "Senior React Developer",
  "description": "We are looking for an experienced React developer with 5+ years of experience in web development",
  "requiredSkills": ["React", "JavaScript", "Node.js", "CSS"],
  "qualifications": ["5+ years experience", "BS in Computer Science"],
  "location": "San Francisco, CA",
  "salary": {
    "min": 120000,
    "max": 150000,
    "currency": "USD"
  },
  "jobType": "Full-Time",
  "experience": {
    "min": 5,
    "max": 10
  },
  "deadline": "2026-04-14"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Job posting created successfully",
  "data": {
    "jobId": "507f1f77bcf86cd799439012",
    "jobTitle": "Senior React Developer",
    "status": "Open",
    "createdAt": "2026-03-14T15:45:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "employerId, jobTitle, description, and location are required"
}
```

**Status Code:** 201 Created

---

## API 2.2: Get Job Posting

**Description:** Retrieve a specific job posting by ID.

**Endpoint URL:** `http://localhost:1008/api/jobs/{jobId}`

**HTTP Method:** `GET`

**Headers:**
```
None
```

**Parameters:**
```
- jobId (path parameter): The ID of the job posting
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "employerId": "employer-001",
    "jobTitle": "Senior React Developer",
    "description": "We are looking for...",
    "requiredSkills": ["React", "JavaScript", "Node.js", "CSS"],
    "location": "San Francisco, CA",
    "salary": {
      "min": 120000,
      "max": 150000,
      "currency": "USD"
    },
    "jobType": "Full-Time",
    "status": "Open",
    "applicantsCount": 3,
    "createdAt": "2026-03-14T15:45:00.000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Job posting not found"
}
```

**Status Code:** 200 OK

---

## API 2.3: Get All Jobs

**Description:** Retrieve all job postings with optional filters.

**Endpoint URL:** `http://localhost:1008/api/jobs`

**HTTP Method:** `GET`

**Headers:**
```
None
```

**Query Parameters (Optional):**
```
- status: "Open", "Closed", or "On Hold"
- location: City name (e.g., "San Francisco")
- jobType: "Full-Time", "Part-Time", "Contract", or "Internship"

Example: http://localhost:1008/api/jobs?status=Open&location=San%20Francisco&jobType=Full-Time
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "jobTitle": "Senior React Developer",
      "location": "San Francisco, CA",
      "jobType": "Full-Time",
      "status": "Open",
      "applicantsCount": 3
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "jobTitle": "Python Developer",
      "location": "New York, NY",
      "jobType": "Full-Time",
      "status": "Open",
      "applicantsCount": 5
    }
  ]
}
```

**Status Code:** 200 OK

---

## API 2.4: Get Jobs by Employer

**Description:** Retrieve all job postings posted by a specific employer.

**Endpoint URL:** `http://localhost:1008/api/jobs/employer/{employerId}`

**HTTP Method:** `GET`

**Headers:**
```
None
```

**Parameters:**
```
- employerId (path parameter): The ID of the employer
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "jobTitle": "Senior React Developer",
      "location": "San Francisco, CA",
      "status": "Open",
      "applicantsCount": 3
    },
    {
      "_id": "507f1f77bcf86cd799439013",
      "jobTitle": "Jr Developer",
      "location": "San Francisco, CA",
      "status": "Open",
      "applicantsCount": 10
    }
  ]
}
```

**Status Code:** 200 OK

---

## API 2.5: Update Job Posting

**Description:** Update job posting details.

**Endpoint URL:** `http://localhost:1008/api/jobs/{jobId}`

**HTTP Method:** `PUT`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "salary": {
    "min": 130000,
    "max": 160000,
    "currency": "USD"
  },
  "status": "Open",
  "requiredSkills": ["React", "TypeScript", "Node.js"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Job posting updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "jobTitle": "Senior React Developer",
    "salary": {
      "min": 130000,
      "max": 160000,
      "currency": "USD"
    },
    "status": "Open"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Job posting not found"
}
```

**Status Code:** 200 OK

---

## API 2.6: Search Jobs by Skills

**Description:** Search for job postings that require specific skills.

**Endpoint URL:** `http://localhost:1008/api/jobs/search/skills`

**HTTP Method:** `POST`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "skills": ["React", "JavaScript", "Node.js"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "jobTitle": "Senior React Developer",
      "location": "San Francisco, CA",
      "requiredSkills": ["React", "JavaScript", "Node.js"],
      "status": "Open"
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "jobTitle": "Full Stack Developer",
      "location": "New York, NY",
      "requiredSkills": ["JavaScript", "React"],
      "status": "Open"
    }
  ]
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Skills array is required"
}
```

**Status Code:** 200 OK

---

## API 2.7: Apply to Job

**Description:** Record a job application and increment applicant count.

**Endpoint URL:** `http://localhost:1008/api/jobs/{jobId}/apply`

**HTTP Method:** `PUT`

**Headers:**
```
None
```

**Body:**
```
None (Empty)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Application recorded successfully",
  "data": {
    "jobId": "507f1f77bcf86cd799439012",
    "applicantsCount": 4
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Job posting not found"
}
```

**Status Code:** 200 OK

---

## API 2.8: Close Job Posting

**Description:** Close a job posting and change its status to "Closed".

**Endpoint URL:** `http://localhost:1008/api/jobs/{jobId}/close`

**HTTP Method:** `PUT`

**Headers:**
```
None
```

**Body:**
```
None (Empty)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Job posting closed successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "jobTitle": "Senior React Developer",
    "status": "Closed"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Job posting not found"
}
```

**Status Code:** 200 OK

---

## API 2.9: Delete Job Posting

**Description:** Delete a job posting from the database.

**Endpoint URL:** `http://localhost:1008/api/jobs/{jobId}`

**HTTP Method:** `DELETE`

**Headers:**
```
None
```

**Body:**
```
None (Empty)
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Job posting deleted successfully"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Job posting not found"
}
```

**Status Code:** 200 OK

---

# Response Format <a name="response-format"></a>

## Standard Success Response

All successful API responses follow this format:

```json
{
  "success": true,
  "message": "Description of success",
  "data": {
    // Response data
  }
}
```

## Standard Error Response

All error API responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

---

# Error Handling <a name="error-handling"></a>

## HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (new resource created) |
| 400 | Bad Request | Missing required fields |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

## Common Error Messages

```
1. No file uploaded
   Status: 400
   Message: "No file uploaded"

2. Resume not found
   Status: 404
   Message: "Resume not found"

3. Job not found
   Status: 404
   Message: "Job posting not found"

4. Missing required fields
   Status: 400
   Message: "employerId, jobTitle, description, and location are required"

5. Invalid file type
   Status: 400
   Message: "Invalid file type. Only PDF and DOC are allowed."
```

---

## Database Schema

### Resume Collection

```javascript
{
  _id: ObjectId,
  userId: String,
  fileName: String,
  fileType: String (pdf, doc, docx),
  filePath: String,
  skills: [String],
  experience: [
    {
      jobTitle: String,
      company: String,
      duration: String,
      description: String
    }
  ],
  education: [
    {
      degree: String,
      institution: String,
      year: String
    }
  ],
  fullName: String,
  email: String,
  phone: String,
  summary: String,
  rawText: String,
  uploadedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### JobPosting Collection

```javascript
{
  _id: ObjectId,
  employerId: String,
  jobTitle: String,
  description: String,
  requiredSkills: [String],
  qualifications: [String],
  location: String,
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  jobType: String (Full-Time, Part-Time, Contract, Internship),
  experience: {
    min: Number,
    max: Number
  },
  status: String (Open, Closed, On Hold),
  deadline: Date,
  applicantsCount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Testing in Postman

### Prerequisites
1. Backend server running on port 1008
2. MongoDB connected
3. Postman collection imported

### Testing Order
1. Upload Resume (API 1.1) - Get resumeId
2. Parse Resume (API 1.2) - Use resumeId from 1.1
3. Get Resume (API 1.3) - Use resumeId from 1.1
4. Get User Resumes (API 1.4)
5. Update Resume (API 1.5) - Use resumeId from 1.1
6. Delete Resume (API 1.6) - Use resumeId from 1.1
7. API 1.7: Download Resume
8. Create Job (API 2.1) - Get jobId
9. Get Job (API 2.2) - Use jobId from 2.1
10. Get All Jobs (API 2.3)
11. Get Employer Jobs (API 2.4)
12. Update Job (API 2.5) - Use jobId from 2.1
13. Search Jobs by Skills (API 2.6)
14. Apply to Job (API 2.7) - Use jobId from 2.1
15. Close Job (API 2.8) - Use jobId from 2.1
16. Delete Job (API 2.9) - Use jobId from 2.1

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Backend Framework | Node.js + Express.js |
| Database | MongoDB |
| File Upload | Multer |
| CORS | Enabled |
| Port | 1008 |
| Protocol | REST API |

---

**Last Updated:** March 14, 2026
**Version:** 1.0.0
