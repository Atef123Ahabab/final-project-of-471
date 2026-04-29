import { useState, useEffect } from 'react';
import { apiRequest } from './api';

export function MonitoringPage({ isAdmin, adminEmail }) {
  const [analytics, setAnalytics] = useState({ totalUsers: 0, totalJobs: 0 });
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [jobSearchQuery, setJobSearchQuery] = useState('');
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [jobSearchResults, setJobSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Load analytics on page load
  useEffect(() => {
    if (!isAdmin) return;
    loadAnalytics();
  }, [isAdmin]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiRequest('/api/admin/monitoring/analytics');
      setAnalytics({
        totalUsers: response.data.totalUsers,
        totalJobs: response.data.totalJobs,
      });
      setError('');
    } catch (err) {
      setError('Failed to load system analytics: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSearch = async (e) => {
    e.preventDefault();
    if (!userSearchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await apiRequest(
        `/api/admin/monitoring/users/search?query=${encodeURIComponent(userSearchQuery)}`
      );
      setUserSearchResults(response.data);
    } catch (err) {
      setError('Failed to search users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJobSearch = async (e) => {
    e.preventDefault();
    if (!jobSearchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await apiRequest(
        `/api/admin/monitoring/jobs/search?query=${encodeURIComponent(jobSearchQuery)}`
      );
      setJobSearchResults(response.data);
    } catch (err) {
      setError('Failed to search jobs: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`Are you sure you want to delete this user: ${userEmail}?`)) {
      return;
    }

    try {
      setLoading(true);
      await apiRequest(`/api/admin/monitoring/users/${userId}`, {
        method: 'DELETE',
      });
      setSuccessMessage('User deleted successfully');
      // Refresh user search results
      if (userSearchQuery.trim()) {
        handleUserSearch(new Event('submit'));
      }
      loadAnalytics();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to delete this job: ${jobTitle}?`)) {
      return;
    }

    try {
      setLoading(true);
      await apiRequest(`/api/admin/monitoring/jobs/${jobId}`, {
        method: 'DELETE',
      });
      setSuccessMessage('Job posting deleted successfully');
      // Refresh job search results
      if (jobSearchQuery.trim()) {
        handleJobSearch(new Event('submit'));
      }
      loadAnalytics();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete job: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="monitoring-page">
        <div className="alert alert-error">
          <strong>Access Denied</strong>
          <p>Only administrators can access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="monitoring-page">
      <h2>System Monitoring Dashboard</h2>
      <p className="admin-badge">Logged in as: {adminEmail}</p>

      {/* Analytics Section */}
      <div className="analytics-section">
        <h3>System Analytics</h3>
        {loading && <p className="loading">Loading analytics...</p>}
        {error && <div className="alert alert-error">{error}</div>}
        {successMessage && <div className="alert alert-success">{successMessage}</div>}

        <div className="analytics-grid">
          <div className="analytics-card">
            <div className="analytics-value">{analytics.totalUsers}</div>
            <div className="analytics-label">Total Users</div>
          </div>
          <div className="analytics-card">
            <div className="analytics-value">{analytics.totalJobs}</div>
            <div className="analytics-label">Total Job Postings</div>
          </div>
        </div>

        <button 
          className="primary" 
          onClick={loadAnalytics}
          disabled={loading}
          style={{ marginTop: '10px' }}
        >
          {loading ? 'Refreshing...' : 'Refresh Analytics'}
        </button>
      </div>

      {/* User Management Section */}
      <div className="management-section">
        <h3>User Management</h3>
        <form onSubmit={handleUserSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by email or full name..."
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search Users'}
          </button>
        </form>

        {userSearchResults.length > 0 && (
          <div className="results-list">
            <h4>Search Results ({userSearchResults.length})</h4>
            <div className="list">
              {userSearchResults.map((user) => (
                <div key={user._id} className="list-item">
                  <div className="item-content">
                    <div className="item-title">{user.fullName || 'N/A'}</div>
                    <div className="item-details">
                      <span>Email: {user.email}</span>
                      <span>Role: {user.role}</span>
                      <span>Plan: {user.subscriptionPlan}</span>
                      <span>
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="action-row">
                    <button
                      className="danger"
                      onClick={() => handleDeleteUser(user._id, user.email)}
                      disabled={loading}
                    >
                      Delete User
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Job Management Section */}
      <div className="management-section">
        <h3>Job Posting Management</h3>
        <form onSubmit={handleJobSearch} className="search-form">
          <input
            type="text"
            placeholder="Search by job title, description, or location..."
            value={jobSearchQuery}
            onChange={(e) => setJobSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search Jobs'}
          </button>
        </form>

        {jobSearchResults.length > 0 && (
          <div className="results-list">
            <h4>Search Results ({jobSearchResults.length})</h4>
            <div className="list">
              {jobSearchResults.map((job) => (
                <div key={job._id} className="list-item">
                  <div className="item-content">
                    <div className="item-title">{job.jobTitle}</div>
                    <div className="item-details">
                      <span>Employer ID: {job.employerId}</span>
                      <span>Location: {job.location}</span>
                      <span>Type: {job.jobType}</span>
                      <span>Status: {job.status}</span>
                      <span>
                        Posted: {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="action-row">
                    <button
                      className="danger"
                      onClick={() => handleDeleteJob(job._id, job.jobTitle)}
                      disabled={loading}
                    >
                      Delete Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
