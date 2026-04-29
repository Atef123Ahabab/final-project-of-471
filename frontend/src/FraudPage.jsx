import React from 'react';

export function FraudPage({
  flaggedUsers,
  flaggedJobs,
  userFlagForm,
  jobFlagForm,
  setUserFlagForm,
  setJobFlagForm,
  flagUser,
  flagJob,
  unflagUser,
  unflagJob,
}) {
  const setByName = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section className="grid two-col feature feature-fraud">
      <article className="card fraud-user-card">
        <h2>Flag Suspicious User Account</h2>
        <form className="form-grid" onSubmit={flagUser}>
          <input
            name="userId"
            value={userFlagForm.userId}
            onChange={setByName(setUserFlagForm)}
            placeholder="User ID"
            required
          />
          <input
            name="adminId"
            value={userFlagForm.adminId}
            onChange={setByName(setUserFlagForm)}
            placeholder="Admin ID"
            required
          />
          <select
            name="riskLevel"
            value={userFlagForm.riskLevel}
            onChange={setByName(setUserFlagForm)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <textarea
            name="reason"
            value={userFlagForm.reason}
            onChange={setByName(setUserFlagForm)}
            placeholder="Fraud reason"
            required
          />
          <button type="submit">Flag User</button>
        </form>
      </article>

      <article className="card fraud-job-card">
        <h2>Flag Fake/Spam Job Posting</h2>
        <form className="form-grid" onSubmit={flagJob}>
          <input
            name="jobId"
            value={jobFlagForm.jobId}
            onChange={setByName(setJobFlagForm)}
            placeholder="Job ID"
            required
          />
          <input
            name="adminId"
            value={jobFlagForm.adminId}
            onChange={setByName(setJobFlagForm)}
            placeholder="Admin ID"
            required
          />
          <select
            name="riskLevel"
            value={jobFlagForm.riskLevel}
            onChange={setByName(setJobFlagForm)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <textarea
            name="reason"
            value={jobFlagForm.reason}
            onChange={setByName(setJobFlagForm)}
            placeholder="Spam/Fraud reason"
            required
          />
          <button type="submit">Flag Job</button>
        </form>
      </article>

      <article className="card flagged-user-card">
        <h2>Flagged Users</h2>
        <div className="list">
          {flaggedUsers.map((user) => (
            <div className="list-item" key={user._id}>
              <div>
                <h3>{user.fullName || user.userId}</h3>
                <p>
                  {user.userId} · Risk {user.fraudStatus?.riskLevel}
                </p>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() => unflagUser(user.userId)}
              >
                Unflag
              </button>
            </div>
          ))}
          {flaggedUsers.length === 0 ? <p>No flagged users.</p> : null}
        </div>
      </article>

      <article className="card flagged-job-card">
        <h2>Flagged Job Postings</h2>
        <div className="list">
          {flaggedJobs.map((job) => (
            <div className="list-item" key={job._id}>
              <div>
                <h3>{job.jobTitle}</h3>
                <p>
                  {job.location} · Risk {job.fraudStatus?.riskLevel}
                </p>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={() => unflagJob(job._id)}
              >
                Unflag
              </button>
            </div>
          ))}
          {flaggedJobs.length === 0 ? <p>No flagged jobs.</p> : null}
        </div>
      </article>
    </section>
  );
}

export default FraudPage;
