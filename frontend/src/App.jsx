import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from './api';
import { SubscriptionsPanel } from './SubscriptionsPanel';
import { PremiumSubscriptionPage } from './PremiumSubscriptionPage';
import { MonitoringPage } from './MonitoringPage';
import { MyApplicationsPage } from './MyApplicationsPage';
import { SkillRecommendationPage } from './SkillRecommendationPage';
import ResumePage from './ResumePage';
import FraudPage from './FraudPage';
import JobManagementPage from './JobManagementPage';

const TAB_ITEMS = [
  { id: 'jobs', label: 'Job Management' },
  { id: 'candidates', label: 'Candidate Shortlisting' },
  { id: 'resumes', label: 'Resume Upload & Parsing' },
  { id: 'apply', label: 'Job Applications' },
  { id: 'my-applications', label: 'My Applications' },
  { id: 'skill-recommendation', label: 'Skill Recommendation' },
  { id: 'fraud', label: 'Fraud & Spam' },
  { id: 'audit', label: 'Audit Logs' },
  { id: 'featured', label: 'Featured Jobs' },
  { id: 'premium', label: 'Premium Subscription' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'monitoring', label: 'System Monitoring', adminOnly: true },
];

const initialJobForm = {
  employerId: '',
  jobTitle: '',
  description: '',
  requiredSkills: '',
  qualifications: '',
  location: '',
  jobType: 'Full-Time',
};

const initialEditJobForm = {
  jobId: '',
  jobTitle: '',
  description: '',
  requiredSkills: '',
  qualifications: '',
  location: '',
  jobType: 'Full-Time',
};

const initialUserFlag = {
  userId: '',
  adminId: '',
  reason: '',
  riskLevel: 'Medium',
};

const initialJobFlag = {
  jobId: '',
  adminId: '',
  reason: '',
  riskLevel: 'Medium',
};

const initialResumeUpload = {
  userId: '',
  fullName: '',
  email: '',
  phone: '',
};

const initialParseForm = {
  resumeId: '',
  skills: '',
  summary: '',
};

const initialApplyForm = {
  jobId: '',
  resumeId: '',
  fullName: '',
  email: '',
  phone: '',
  city: '',
  country: '',
  coverLetter: '',
};

function FeaturedJobsList({ jobs, hasPremium, onUnfeature }) {
  return (
    <div className="list" style={{ marginTop: 14 }}>
      {jobs.map((job) => (
        <div className="list-item" key={job._id}>
          <div>
            <h3 style={{ margin: 0 }}>{job.jobTitle}</h3>
            <p style={{ margin: '6px 0 0' }}>
              {job.location} · {job.jobType} · {job.status}
            </p>
            <p style={{ margin: '6px 0 0', opacity: 0.85 }}>
              Featured at:{' '}
              {job.featuredAt ? new Date(job.featuredAt).toLocaleString() : '—'}
            </p>
          </div>
          <div className="action-row">
            {hasPremium ? (
              <button
                type="button"
                className="secondary"
                onClick={() => onUnfeature(job._id)}
              >
                Remove Featured
              </button>
            ) : null}
          </div>
        </div>
      ))}
      {jobs.length === 0 ? <p>No featured jobs yet.</p> : null}
    </div>
  );
}

function App() {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [authToken, setAuthToken] = useState(
    typeof window !== 'undefined' ? window.localStorage.getItem('auth_token') : ''
  );
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = window.localStorage.getItem('auth_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [authForm, setAuthForm] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [flaggedUsers, setFlaggedUsers] = useState([]);
  const [flaggedJobs, setFlaggedJobs] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [editJobForm, setEditJobForm] = useState(initialEditJobForm);
  const [userFlagForm, setUserFlagForm] = useState(initialUserFlag);
  const [jobFlagForm, setJobFlagForm] = useState(initialJobFlag);
  const [resumeUploadForm, setResumeUploadForm] = useState(initialResumeUpload);
  const [parseForm, setParseForm] = useState(initialParseForm);
  const [applyForm, setApplyForm] = useState(initialApplyForm);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeLookupUserId, setResumeLookupUserId] = useState('');
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [applicationsJobId, setApplicationsJobId] = useState('');
  const [applicationFilter, setApplicationFilter] = useState('all');
  const [applicationSort, setApplicationSort] = useState('latest');
  const [auditFilters, setAuditFilters] = useState({
    actorId: '',
    actionType: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const openJobsCount = useMemo(
    () => jobs.filter((job) => job.status === 'Open').length,
    [jobs]
  );

  const shortlistedCount = useMemo(
    () => applications.filter((item) => item.status === 'Shortlisted').length,
    [applications]
  );

  const showSuccess = (message) => {
    setNotice(message);
    setError('');
    setTimeout(() => setNotice(''), 2500);
  };

  const loadJobs = async () => {
    const response = await apiRequest('/api/jobs');
    setJobs(response.data || []);
  };

  const loadFlags = async () => {
    const response = await apiRequest('/api/admin/flags');
    setFlaggedUsers(response.data?.flaggedUsers || []);
    setFlaggedJobs(response.data?.flaggedJobs || []);
  };

  const loadAuditLogs = async () => {
    const params = new URLSearchParams();

    if (auditFilters.actorId) params.set('actorId', auditFilters.actorId);
    if (auditFilters.actionType) params.set('actionType', auditFilters.actionType);

    const response = await apiRequest(`/api/audit-logs?${params.toString()}`);
    setAuditLogs(response.data || []);
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError('');
    try {
      await Promise.all([loadJobs(), loadFlags(), loadAuditLogs()]);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCurrentUser = async () => {
    try {
      const response = await apiRequest('/api/users/me');
      if (response?.data) {
        setCurrentUser(response.data);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('auth_user', JSON.stringify(response.data));
        }
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    if (authToken) {
      loadDashboardData();
      refreshCurrentUser();
    }
  }, []);

  useEffect(() => {
    if (!authToken) return;
    loadDashboardData();
    refreshCurrentUser();
  }, [authToken]);

  const setByName = (setter) => (event) => {
    const { name, value } = event.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const setAuthByName = (event) => {
    const { name, value } = event.target;
    setAuthForm((prev) => ({ ...prev, [name]: value }));
  };

  const persistAuth = (token, user) => {
    setAuthToken(token);
    setCurrentUser(user);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('auth_token', token);
      window.localStorage.setItem('auth_user', JSON.stringify(user));
    }
  };

  const logout = () => {
    setAuthToken('');
    setCurrentUser(null);
    setAuthForm({ fullName: '', email: '', password: '' });
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('auth_token');
      window.localStorage.removeItem('auth_user');
    }
  };

  const submitAuth = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');

    try {
      const path =
        authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const body =
        authMode === 'register'
          ? {
              fullName: authForm.fullName,
              email: authForm.email,
              password: authForm.password,
            }
          : {
              email: authForm.email,
              password: authForm.password,
            };

      const response = await apiRequest(path, {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const token = response?.data?.token;
      const user = response?.data?.user;
      if (!token || !user) {
        throw new Error('Invalid auth response from server');
      }

      persistAuth(token, user);
      showSuccess(`Welcome${user.fullName ? `, ${user.fullName}` : ''}!`);
    } catch (authError) {
      setError(authError.message);
    }
  };

  if (!authToken) {
    return (
      <div className="layout">
        <header className="hero">
          <div>
            <p className="eyebrow">Enterprise Hiring Suite</p>
            <h1>Resume & Job Portal Control Center</h1>
            <p>Login or create an account to continue.</p>
          </div>
        </header>

        {notice ? <div className="notice">{notice}</div> : null}
        {error ? <div className="error">{error}</div> : null}

        <section className="grid one-col feature">
          <article className="card">
            <div className="action-row" style={{ justifyContent: 'flex-start' }}>
              <button
                type="button"
                className={authMode === 'login' ? 'primary' : 'secondary'}
                onClick={() => setAuthMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={authMode === 'register' ? 'primary' : 'secondary'}
                onClick={() => setAuthMode('register')}
              >
                Register
              </button>
            </div>

            <form className="form-grid" onSubmit={submitAuth}>
              {authMode === 'register' ? (
                <input
                  name="fullName"
                  value={authForm.fullName}
                  onChange={setAuthByName}
                  placeholder="Full Name"
                  required
                />
              ) : null}
              <input
                name="email"
                value={authForm.email}
                onChange={setAuthByName}
                placeholder="Email"
                type="email"
                required
              />
              <input
                name="password"
                value={authForm.password}
                onChange={setAuthByName}
                placeholder="Password"
                type="password"
                required
              />
              <button type="submit">{authMode === 'register' ? 'Create account' : 'Login'}</button>
            </form>

            <p style={{ marginTop: 14, opacity: 0.8 }}>
              {authMode === 'login'
                ? 'Admin login uses ADMIN_EMAIL / ADMIN_PASSWORD from .env.'
                : 'Passwords must be at least 6 characters.'}
            </p>
          </article>
        </section>
      </div>
    );
  }

  const hasPremium = ['premium', 'enterprise'].includes(
    currentUser?.subscriptionPlan || 'free'
  ) || currentUser?.role === 'admin';

  const createJob = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await apiRequest('/api/jobs/create', {
        method: 'POST',
        body: JSON.stringify({
          ...jobForm,
          requiredSkills: jobForm.requiredSkills
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          qualifications: jobForm.qualifications
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
        }),
      });

      setJobForm(initialJobForm);
      await loadJobs();
      showSuccess('Job posting created successfully.');
    } catch (createError) {
      setError(createError.message);
    }
  };

  const startEditJob = (job) => {
    setEditJobForm({
      jobId: job._id,
      jobTitle: job.jobTitle || '',
      description: job.description || '',
      requiredSkills: (job.requiredSkills || []).join(', '),
      qualifications: (job.qualifications || []).join(', '),
      location: job.location || '',
      jobType: job.jobType || 'Full-Time',
    });
  };

  const updateJob = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await apiRequest(`/api/jobs/${editJobForm.jobId}`, {
        method: 'PUT',
        body: JSON.stringify({
          jobTitle: editJobForm.jobTitle,
          description: editJobForm.description,
          requiredSkills: editJobForm.requiredSkills
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          qualifications: editJobForm.qualifications
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          location: editJobForm.location,
          jobType: editJobForm.jobType,
        }),
      });

      setEditJobForm(initialEditJobForm);
      await loadJobs();
      showSuccess('Job posting updated successfully.');
    } catch (updateError) {
      setError(updateError.message);
    }
  };

  const closeJob = async (jobId) => {
    setError('');
    try {
      await apiRequest(`/api/jobs/${jobId}/close`, {
        method: 'PUT',
      });
      await loadJobs();
      showSuccess('Job posting closed successfully.');
    } catch (closeError) {
      setError(closeError.message);
    }
  };

  const featureJob = async (jobId) => {
    if (!hasPremium) {
      setActiveTab('premium');
      setError('Premium subscription required. Please choose a plan to feature jobs.');
      return;
    }

    try {
      await apiRequest(`/api/jobs/${jobId}/feature`, {
        method: 'PUT',
      });
      await loadJobs();
      showSuccess('Job added to featured jobs.');
    } catch (err) {
      setError(err.message);
    }
  };

  const loadApplications = async (jobId = applicationsJobId) => {
    if (!jobId) return;

    const params = new URLSearchParams();
    if (applicationFilter) params.set('status', applicationFilter);
    if (applicationSort) params.set('sort', applicationSort);

    const response = await apiRequest(
      `/api/jobs/${jobId}/applications?${params.toString()}`
    );

    setApplications(response.data?.applications || []);
  };

  const updateApplicationStatus = async (applicationId, status) => {
    setError('');
    try {
      await apiRequest(`/api/jobs/applications/${applicationId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      await loadApplications();
      showSuccess(`Candidate status updated to ${status}.`);
    } catch (statusError) {
      setError(statusError.message);
    }
  };

  const flagUser = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await apiRequest(`/api/admin/users/${userFlagForm.userId}/flag`, {
        method: 'PUT',
        body: JSON.stringify({
          adminId: userFlagForm.adminId,
          reason: userFlagForm.reason,
          riskLevel: userFlagForm.riskLevel,
        }),
      });

      setUserFlagForm(initialUserFlag);
      await loadFlags();
      showSuccess('User account flagged for review.');
    } catch (flagError) {
      setError(flagError.message);
    }
  };

  const flagJob = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await apiRequest(`/api/admin/jobs/${jobFlagForm.jobId}/flag`, {
        method: 'PUT',
        body: JSON.stringify({
          adminId: jobFlagForm.adminId,
          reason: jobFlagForm.reason,
          riskLevel: jobFlagForm.riskLevel,
        }),
      });

      setJobFlagForm(initialJobFlag);
      await loadFlags();
      showSuccess('Job posting flagged for spam/fraud review.');
    } catch (flagError) {
      setError(flagError.message);
    }
  };

  const unflagUser = async (userId, adminId = 'admin-default') => {
    setError('');
    try {
      await apiRequest(`/api/admin/users/${userId}/unflag`, {
        method: 'PUT',
        body: JSON.stringify({ adminId, note: 'Cleared after review' }),
      });

      await loadFlags();
      showSuccess('User account unflagged.');
    } catch (unflagError) {
      setError(unflagError.message);
    }
  };

  const unflagJob = async (jobId, adminId = 'admin-default') => {
    setError('');
    try {
      await apiRequest(`/api/admin/jobs/${jobId}/unflag`, {
        method: 'PUT',
        body: JSON.stringify({ adminId, note: 'Cleared after review' }),
      });

      await loadFlags();
      showSuccess('Job posting unflagged.');
    } catch (unflagError) {
      setError(unflagError.message);
    }
  };

  const searchAuditLogs = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await loadAuditLogs();
      showSuccess('Audit log filters applied.');
    } catch (searchError) {
      setError(searchError.message);
    }
  };

  const uploadResume = async (event) => {
    event.preventDefault();
    setError('');

    if (!resumeFile) {
      setError('Please choose a resume file.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      formData.append('userId', resumeUploadForm.userId);
      formData.append('fullName', resumeUploadForm.fullName);
      formData.append('email', resumeUploadForm.email);
      formData.append('phone', resumeUploadForm.phone);

      await apiRequest('/api/resumes/upload', {
        method: 'POST',
        body: formData,
      });

      setResumeUploadForm(initialResumeUpload);
      setResumeFile(null);
      if (resumeLookupUserId) {
        await fetchUserResumes(resumeLookupUserId);
      }
      showSuccess('Resume uploaded and auto-parsed successfully.');
    } catch (uploadError) {
      setError(uploadError.message);
    }
  };

  const fetchUserResumes = async (userId = resumeLookupUserId) => {
    if (!userId) return;

    setError('');
    try {
      const response = await apiRequest(`/api/resumes/user/${userId}`);
      setResumes(response.data || []);
    } catch (resumeError) {
      setError(resumeError.message);
      setResumes([]);
    }
  };

  const parseResumeDetails = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await apiRequest(`/api/resumes/${parseForm.resumeId}/parse`, {
        method: 'POST',
        body: JSON.stringify({
          skills: parseForm.skills
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean),
          summary: parseForm.summary,
        }),
      });

      await fetchUserResumes();
      setParseForm(initialParseForm);
      showSuccess('Resume parsing data updated.');
    } catch (parseError) {
      setError(parseError.message);
    }
  };

  const applyToJob = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await apiRequest(`/api/jobs/${applyForm.jobId}/apply`, {
        method: 'PUT',
        body: JSON.stringify({
          resumeId: applyForm.resumeId,
          fullName: applyForm.fullName,
          email: applyForm.email,
          phone: applyForm.phone,
          city: applyForm.city,
          country: applyForm.country,
          coverLetter: applyForm.coverLetter,
        }),
      });

      const notification = response?.data?.notification;
      const notificationSent = Boolean(notification?.sent);
      const notificationReason = notification?.reason;

      setApplyForm(initialApplyForm);

      if (notificationSent) {
        showSuccess('Job application submitted and email notification sent.');
      } else {
        showSuccess(
          `Job application submitted, but email notification failed${
            notificationReason ? `: ${notificationReason}` : '.'
          }`
        );
      }
    } catch (applyError) {
      setError(applyError.message);
    }
  };

  return (
    <div className="layout">
      <header className="hero">
        <div>
          <p className="eyebrow">Enterprise Hiring Suite</p>
          <h1>Resume & Job Portal Control Center</h1>
          <p>
            Job posting, shortlisting, resume parsing, applications, fraud
            controls, and security audit logs in one place.
          </p>
        </div>
        <div className="hero-stats" style={{ alignItems: 'flex-end' }}>
          <div style={{ textAlign: 'right' }}>
            <strong style={{ fontSize: 16 }}>
              {currentUser?.role === 'admin' ? 'Admin' : 'User'}
            </strong>
            <span style={{ display: 'block' }}>
              {currentUser?.email || 'Authenticated'}
            </span>
          </div>
          <button type="button" className="secondary" onClick={logout}>
            Logout
          </button>
        </div>
        <div className="hero-stats">
          <div>
            <strong>{jobs.length}</strong>
            <span>Total Jobs</span>
          </div>
          <div>
            <strong>{openJobsCount}</strong>
            <span>Open Jobs</span>
          </div>
          <div>
            <strong>{shortlistedCount}</strong>
            <span>Shortlisted</span>
          </div>
        </div>
      </header>

      <nav className="tabs" aria-label="dashboard tabs">
        {TAB_ITEMS.map((tab) => {
          // Hide admin-only tabs from non-admin users
          if (tab.adminOnly && currentUser?.role !== 'admin') {
            return null;
          }
          return (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {notice ? <div className="notice">{notice}</div> : null}
      {error ? <div className="error">{error}</div> : null}
      {isLoading ? <p className="loading">Loading dashboard data...</p> : null}

      {activeTab === 'jobs' ? (
        <JobManagementPage
          jobForm={jobForm}
          setJobForm={setJobForm}
          createJob={createJob}
          jobs={jobs}
          startEditJob={startEditJob}
          closeJob={closeJob}
          onFeatureJob={featureJob}
          editJobForm={editJobForm}
          setEditJobForm={setEditJobForm}
          updateJob={updateJob}
          initialEditJobForm={initialEditJobForm}
        />
      ) : null}

      {activeTab === 'featured' ? (
        <section className="grid one-col feature">
          <article className="card">
            <h2>Featured Jobs</h2>
            <p style={{ marginTop: 6, opacity: 0.85 }}>
              Featured jobs are highlighted and visible here.
            </p>

            <div className="action-row" style={{ justifyContent: 'flex-start', marginTop: 12 }}>
              <button
                type="button"
                className="secondary"
                onClick={async () => {
                  try {
                    const response = await apiRequest('/api/jobs/featured');
                    setJobs((prev) => prev); // keep
                    showSuccess(`Loaded ${response.data?.length || 0} featured jobs.`);
                    // store separately (simple approach: keep in local state below)
                    setFeaturedJobs(response.data || []);
                  } catch (err) {
                    setError(err.message);
                  }
                }}
              >
                Refresh
              </button>
            </div>

            <FeaturedJobsList
              jobs={featuredJobs}
              hasPremium={hasPremium}
              onUnfeature={async (jobId) => {
                try {
                  await apiRequest(`/api/jobs/${jobId}/unfeature`, { method: 'PUT' });
                  setFeaturedJobs((prev) => prev.filter((j) => j._id !== jobId));
                  await loadJobs();
                  showSuccess('Removed from featured jobs.');
                } catch (err) {
                  setError(err.message);
                }
              }}
            />
          </article>
        </section>
      ) : null}

      {activeTab === 'premium' ? (
        <PremiumSubscriptionPage
          currentUser={currentUser}
          setError={setError}
          showSuccess={showSuccess}
          onSubscriptionUpdated={(subscriptionPlan) => {
            const next = { ...(currentUser || {}), subscriptionPlan };
            setCurrentUser(next);
            if (typeof window !== 'undefined') {
              window.localStorage.setItem('auth_user', JSON.stringify(next));
            }
          }}
        />
      ) : null}

      {activeTab === 'candidates' ? (
        <section className="grid two-col feature feature-candidates">
          <article className="card candidate-load-card">
            <h2>Load Job Applications</h2>
            <form
              className="form-grid"
              onSubmit={async (event) => {
                event.preventDefault();
                await loadApplications();
              }}
            >
              <select
                value={applicationsJobId}
                onChange={(event) => setApplicationsJobId(event.target.value)}
                required
              >
                <option value="">Select a job</option>
                {jobs.map((job) => (
                  <option value={job._id} key={job._id}>
                    {job.jobTitle} ({job.status})
                  </option>
                ))}
              </select>
              <select
                value={applicationFilter}
                onChange={(event) => setApplicationFilter(event.target.value)}
              >
                <option value="all">All</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Accepted">Accepted</option>
                <option value="not_shortlisted">Not Shortlisted</option>
                <option value="Applied">Applied</option>
                <option value="Under Review">Under Review</option>
                <option value="Rejected">Rejected</option>
              </select>
              <select
                value={applicationSort}
                onChange={(event) => setApplicationSort(event.target.value)}
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
              <button type="submit">Load Candidates</button>
            </form>
          </article>

          <article className="card candidate-list-card">
            <h2>Candidates</h2>
            <div className="list">
              {applications.map((application) => (
                <div className="list-item" key={application._id}>
                  <div>
                    <h3>{application.fullName}</h3>
                    <p>
                      {application.email} · {application.city}, {application.country}
                    </p>
                    <p>
                      Resume: {application.resumeId?.fileName || 'N/A'} · Status:{' '}
                      {application.status}
                    </p>
                  </div>
                  <div className="action-row">
                    {application.status !== 'Shortlisted' && application.status !== 'Accepted' ? (
                      <button
                        type="button"
                        className="secondary"
                        onClick={() =>
                          updateApplicationStatus(application._id, 'Shortlisted')
                        }
                      >
                        Shortlist
                      </button>
                    ) : application.status === 'Shortlisted' ? (
                      <>
                        <button
                          type="button"
                          className="secondary"
                          onClick={() =>
                            updateApplicationStatus(application._id, 'Under Review')
                          }
                        >
                          Remove Shortlist
                        </button>
                        <button
                          type="button"
                          className="primary"
                          onClick={() =>
                            updateApplicationStatus(application._id, 'Accepted')
                          }
                        >
                          Accept
                        </button>
                      </>
                    ) : application.status === 'Accepted' ? (
                      <>
                        <span className="status-accepted">✓ Accepted</span>
                        <button
                          type="button"
                          className="warning"
                          onClick={() =>
                            updateApplicationStatus(application._id, 'Shortlisted')
                          }
                        >
                          Remove Acceptance
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
              {applications.length === 0 ? (
                <p>No applications loaded for selected filters.</p>
              ) : null}
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'resumes' ? (
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
                    onClick={() =>
                      setParseForm((prev) => ({ ...prev, resumeId: resume._id }))
                    }
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
      ) : null}

      {activeTab === 'apply' ? (
        <section className="grid two-col feature feature-applications">
          <article className="card apply-form-card">
            <h2>Apply for Job with Resume</h2>
            <form className="form-grid" onSubmit={applyToJob}>
              <select
                name="jobId"
                value={applyForm.jobId}
                onChange={setByName(setApplyForm)}
                required
              >
                <option value="">Select Job</option>
                {jobs
                  .filter((job) => job.status === 'Open')
                  .map((job) => (
                    <option value={job._id} key={job._id}>
                      {job.jobTitle}
                    </option>
                  ))}
              </select>
              <input
                name="fullName"
                value={applyForm.fullName}
                onChange={setByName(setApplyForm)}
                placeholder="Full Name"
                required
              />
              <input
                name="email"
                value={applyForm.email}
                onChange={setByName(setApplyForm)}
                placeholder="Email"
                required
              />
              <input
                name="phone"
                value={applyForm.phone}
                onChange={setByName(setApplyForm)}
                placeholder="Phone"
                required
              />
              <input
                name="city"
                value={applyForm.city}
                onChange={setByName(setApplyForm)}
                placeholder="City"
                required
              />
              <input
                name="country"
                value={applyForm.country}
                onChange={setByName(setApplyForm)}
                placeholder="Country"
                required
              />
              <input
                name="resumeId"
                value={applyForm.resumeId}
                onChange={setByName(setApplyForm)}
                placeholder="Resume ID"
                required
              />
              <textarea
                name="coverLetter"
                value={applyForm.coverLetter}
                onChange={setByName(setApplyForm)}
                placeholder="Cover Letter"
              />
              <button type="submit">Submit Application</button>
            </form>
          </article>

          <article className="card apply-helper-card">
            <h2>Quick Resume Lookup for Applicant</h2>
            <form
              className="form-inline"
              onSubmit={async (event) => {
                event.preventDefault();
                await fetchUserResumes(applyForm.applicantId);
              }}
            >
              <button type="submit">Load Applicant Resumes</button>
            </form>
            <div className="list">
              {resumes.map((resume) => (
                <div className="list-item" key={resume._id}>
                  <div>
                    <h3>{resume.fileName}</h3>
                    <p>Resume ID: {resume._id}</p>
                  </div>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() =>
                      setApplyForm((prev) => ({ ...prev, resumeId: resume._id }))
                    }
                  >
                    Use This Resume
                  </button>
                </div>
              ))}
              {resumes.length === 0 ? (
                <p>Load applicant resumes to auto-fill resume ID.</p>
              ) : null}
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'fraud' ? (
        <FraudPage
          flaggedUsers={flaggedUsers}
          flaggedJobs={flaggedJobs}
          userFlagForm={userFlagForm}
          jobFlagForm={jobFlagForm}
          setUserFlagForm={setUserFlagForm}
          setJobFlagForm={setJobFlagForm}
          flagUser={flagUser}
          flagJob={flagJob}
          unflagUser={unflagUser}
          unflagJob={unflagJob}
        />
      ) : null}

      {activeTab === 'audit' ? (
        <section className="grid one-col feature feature-audit">
          <article className="card audit-filter-card">
            <h2>Audit Log Filters</h2>
            <form className="form-inline" onSubmit={searchAuditLogs}>
              <input
                value={auditFilters.actorId}
                onChange={(event) =>
                  setAuditFilters((prev) => ({
                    ...prev,
                    actorId: event.target.value,
                  }))
                }
                placeholder="Actor ID"
              />
              <select
                value={auditFilters.actionType}
                onChange={(event) =>
                  setAuditFilters((prev) => ({
                    ...prev,
                    actionType: event.target.value,
                  }))
                }
              >
                <option value="">All Actions</option>
                <option value="CREATE">CREATE</option>
                <option value="UPDATE">UPDATE</option>
                <option value="DELETE">DELETE</option>
                <option value="FLAG">FLAG</option>
                <option value="UNFLAG">UNFLAG</option>
              </select>
              <button type="submit">Apply</button>
            </form>
          </article>

          <article className="card audit-log-card">
            <h2>Security & Transparency Logs</h2>
            <div className="audit-table-wrap">
              <table className="audit-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Actor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log._id}>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                      <td>{log.actionType}</td>
                      <td>{log.entityType}</td>
                      <td>{log.actorId}</td>
                      <td>
                        <span className={`pill ${log.success ? 'ok' : 'warn'}`}>
                          {log.statusCode}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan="5">No logs found for selected filters.</td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      ) : null}

      {activeTab === 'subscriptions' ? (
        <SubscriptionsPanel
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          notice={notice}
          setNotice={setNotice}
          error={error}
          setError={setError}
        />
      ) : null}

      {activeTab === 'my-applications' ? (
        <MyApplicationsPage
          currentUser={currentUser}
          setError={setError}
        />
      ) : null}

      {activeTab === 'skill-recommendation' ? (
        <SkillRecommendationPage
          currentUser={currentUser}
          setError={setError}
          showSuccess={showSuccess}
        />
      ) : null}

      {activeTab === 'monitoring' ? (
        <section className="grid one-col feature feature-monitoring">
          <MonitoringPage
            isAdmin={currentUser?.role === 'admin'}
            adminEmail={currentUser?.email}
          />
        </section>
      ) : null}
    </div>
  );
}

export default App;
