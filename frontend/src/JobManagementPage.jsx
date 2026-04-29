import React from 'react';

export function JobManagementPage({
  jobForm,
  setJobForm,
  createJob,
  jobs,
  startEditJob,
  closeJob,
  onFeatureJob,
  editJobForm,
  setEditJobForm,
  updateJob,
  initialEditJobForm,
}) {
  const setByName = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="grid two-col feature feature-jobs">
      <article className="card job-create-card">
        <h2>Create Job Posting</h2>
        <form className="form-grid" onSubmit={createJob}>
          <input
            name="employerId"
            value={jobForm.employerId}
            onChange={setByName(setJobForm)}
            placeholder="Employer ID"
            required
          />
          <input
            name="jobTitle"
            value={jobForm.jobTitle}
            onChange={setByName(setJobForm)}
            placeholder="Job Title"
            required
          />
          <input
            name="location"
            value={jobForm.location}
            onChange={setByName(setJobForm)}
            placeholder="Location"
            required
          />
          <select name="jobType" value={jobForm.jobType} onChange={setByName(setJobForm)}>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
          <textarea
            name="description"
            value={jobForm.description}
            onChange={setByName(setJobForm)}
            placeholder="Description"
            required
          />
          <textarea
            name="requiredSkills"
            value={jobForm.requiredSkills}
            onChange={setByName(setJobForm)}
            placeholder="Required skills (comma separated)"
            required
          />
          <textarea
            name="qualifications"
            value={jobForm.qualifications}
            onChange={setByName(setJobForm)}
            placeholder="Qualifications (comma separated)"
          />
          <button type="submit">Create Job</button>
        </form>
      </article>

      <article className="card job-list-card">
        <h2>Edit or Close Job Posting</h2>
        <div className="list">
          {jobs.map((job) => (
            <div className="list-item" key={job._id}>
              <div>
                <h3>{job.jobTitle}</h3>
                <p>
                  {job.location} · {job.jobType} · {job.status}
                  {job.isFeatured ? ' · Featured' : ''}
                </p>
              </div>
              <div className="action-row">
                <button type="button" className="secondary" onClick={() => startEditJob(job)}>
                  Edit
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={() => onFeatureJob(job._id)}
                >
                  Add to Featured Jobs
                </button>
                {job.status !== 'Closed' ? (
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => closeJob(job._id)}
                  >
                    Close
                  </button>
                ) : null}
              </div>
            </div>
          ))}
          {jobs.length === 0 ? <p>No jobs found.</p> : null}
        </div>
      </article>

      {editJobForm.jobId ? (
        <article className="card span-2 job-edit-card">
          <h2>Update Job Posting</h2>
          <form className="form-grid" onSubmit={updateJob}>
            <input
              name="jobTitle"
              value={editJobForm.jobTitle}
              onChange={setByName(setEditJobForm)}
              placeholder="Job Title"
              required
            />
            <input
              name="location"
              value={editJobForm.location}
              onChange={setByName(setEditJobForm)}
              placeholder="Location"
              required
            />
            <select
              name="jobType"
              value={editJobForm.jobType}
              onChange={setByName(setEditJobForm)}
            >
              <option>Full-Time</option>
              <option>Part-Time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
            <textarea
              name="description"
              value={editJobForm.description}
              onChange={setByName(setEditJobForm)}
              placeholder="Description"
              required
            />
            <textarea
              name="requiredSkills"
              value={editJobForm.requiredSkills}
              onChange={setByName(setEditJobForm)}
              placeholder="Required skills (comma separated)"
              required
            />
            <textarea
              name="qualifications"
              value={editJobForm.qualifications}
              onChange={setByName(setEditJobForm)}
              placeholder="Qualifications (comma separated)"
            />
            <div className="action-row">
              <button type="submit">Save Changes</button>
              <button
                type="button"
                className="secondary"
                onClick={() => setEditJobForm(initialEditJobForm)}
              >
                Cancel
              </button>
            </div>
          </form>
        </article>
      ) : null}
    </section>
  );
}

export default JobManagementPage;
