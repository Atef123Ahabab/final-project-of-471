import React from 'react';

export function ResumePage({
  resumeUploadForm,
  setResumeUploadForm,
  resumeFile,
  setResumeFile,
  resumeLookupUserId,
  setResumeLookupUserId,
  resumes,
  fetchUserResumes,
  uploadResume,
  parseForm,
  setParseForm,
  parseResumeDetails,
}) {
  const setByName = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="grid two-col feature feature-resumes">
      <article className="card resume-upload-card">
        <h2>Resume Upload & Auto Parsing</h2>
        <form className="form-grid" onSubmit={uploadResume}>
          <input
            name="userId"
            value={resumeUploadForm.userId}
            onChange={setByName(setResumeUploadForm)}
            placeholder="User ID"
            required
          />
          <input
            name="fullName"
            value={resumeUploadForm.fullName}
            onChange={setByName(setResumeUploadForm)}
            placeholder="Full Name"
          />
          <input
            name="email"
            value={resumeUploadForm.email}
            onChange={setByName(setResumeUploadForm)}
            placeholder="Email"
          />
          <input
            name="phone"
            value={resumeUploadForm.phone}
            onChange={setByName(setResumeUploadForm)}
            placeholder="Phone"
          />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.rtf"
            onChange={(event) => setResumeFile(event.target.files?.[0] || null)}
            required
          />
          <button type="submit">Upload Resume</button>
        </form>
      </article>

      <article className="card resume-list-card">
        <h2>View User Resumes</h2>
        <form
          className="form-inline"
          onSubmit={async (event) => {
            event.preventDefault();
            await fetchUserResumes();
          }}
        >
          <input
            value={resumeLookupUserId}
            onChange={(event) => setResumeLookupUserId(event.target.value)}
            placeholder="User ID"
            required
          />
          <button type="submit">Load Resumes</button>
        </form>
        <div className="list">
          {resumes.map((resume) => (
            <div className="list-item" key={resume._id}>
              <div>
                <h3>{resume.fileName}</h3>
                <p>
                  Type: {resume.fileType} · Skills: {(resume.skills || []).join(', ') || 'N/A'}
                </p>
                <p>
                  Experience Entries: {(resume.experience || []).length} · Summary:{' '}
                  {resume.summary ? 'Available' : 'N/A'}
                </p>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() => setParseForm((prev) => ({ ...prev, resumeId: resume._id }))}
              >
                Parse/Update
              </button>
            </div>
          ))}
          {resumes.length === 0 ? <p>No resumes loaded.</p> : null}
        </div>
      </article>

      <article className="card span-2 resume-parse-card">
        <h2>Manual Parse Update (Optional)</h2>
        <form className="form-grid" onSubmit={parseResumeDetails}>
          <input
            name="resumeId"
            value={parseForm.resumeId}
            onChange={setByName(setParseForm)}
            placeholder="Resume ID"
            required
          />
          <textarea
            name="skills"
            value={parseForm.skills}
            onChange={setByName(setParseForm)}
            placeholder="Skills (comma separated)"
          />
          <textarea
            name="summary"
            value={parseForm.summary}
            onChange={setByName(setParseForm)}
            placeholder="Summary"
          />
          <button type="submit">Update Parsed Data</button>
        </form>
      </article>
    </section>
  );
}

export default ResumePage;
