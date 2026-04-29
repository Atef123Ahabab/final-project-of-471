import { useEffect, useState } from 'react';
import { apiRequest } from './api';

const STATUS_COLORS = {
  'Applied': '#5d675f',
  'Under Review': '#b65a2a',
  'Interview Scheduled': '#1f5f3f',
  'Shortlisted': '#1f7a52',
  'Rejected': '#a04526',
  'Accepted': '#1f7a52',
};

const STATUS_ICONS = {
  'Applied': '📝',
  'Under Review': '👀',
  'Interview Scheduled': '📅',
  'Shortlisted': '⭐',
  'Rejected': '✗',
  'Accepted': '✓',
};

export function MyApplicationsPage({ currentUser, setError }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  useEffect(() => {
    loadUserApplications();
  }, []);

  const loadUserApplications = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/applications/my');

      if (response?.data) {
        // Sort by date
        let sorted = [...response.data].sort(
          (a, b) => new Date(b.appliedAt) - new Date(a.appliedAt)
        );

        setApplications(sorted);
      } else {
        setApplications([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to load applications');
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterStatus === 'all') return true;
    return app.status === filterStatus;
  });

  const sortedApplications = [...filteredApplications].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.appliedAt) - new Date(a.appliedAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.appliedAt) - new Date(b.appliedAt);
    } else if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  const statuses = [
    'Applied',
    'Under Review',
    'Interview Scheduled',
    'Shortlisted',
    'Accepted',
    'Rejected',
  ];

  const statusCounts = {
    all: applications.length,
    ...statuses.reduce((acc, status) => {
      acc[status] = applications.filter((app) => app.status === status).length;
      return acc;
    }, {}),
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <section className="grid one-col feature feature-my-applications">
      <article className="card my-applications-header-card">
        <div>
          <h2>My Applications</h2>
          <p className="my-applications-subtitle">
            Track the status of all your job applications
          </p>
        </div>
        <button
          type="button"
          className="secondary"
          onClick={loadUserApplications}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </article>

      <article className="card my-applications-stats-card">
        <div className="my-applications-stats">
          <div
            className="my-applications-stat-item"
            onClick={() => setFilterStatus('all')}
            style={{
              cursor: 'pointer',
              opacity: filterStatus === 'all' ? 1 : 0.6,
            }}
          >
            <div className="my-applications-stat-number">
              {statusCounts.all}
            </div>
            <div className="my-applications-stat-label">Total</div>
          </div>

          {statuses.map((status) => (
            <div
              key={status}
              className="my-applications-stat-item"
              onClick={() => setFilterStatus(status)}
              style={{
                cursor: 'pointer',
                opacity: filterStatus === status ? 1 : 0.6,
              }}
            >
              <div className="my-applications-stat-number">
                {statusCounts[status] || 0}
              </div>
              <div className="my-applications-stat-label">{status}</div>
            </div>
          ))}
        </div>
      </article>

      <article className="card my-applications-controls-card">
        <div className="my-applications-controls">
          <div>
            <label htmlFor="status-filter">Filter by Status:</label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sort-by">Sort by:</label>
            <select
              id="sort-by"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="latest">Latest First</option>
              <option value="oldest">Oldest First</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>
      </article>

      {loading ? (
        <p className="loading">Loading your applications...</p>
      ) : sortedApplications.length === 0 ? (
        <article className="card my-applications-empty-card">
          <p className="my-applications-empty-message">
            {filterStatus === 'all'
              ? "You haven't applied to any jobs yet."
              : `No applications with status "${filterStatus}".`}
          </p>
        </article>
      ) : (
        <div className="my-applications-list">
          {sortedApplications.map((application) => (
            <article
              key={application._id}
              className="card my-applications-item-card"
              style={{
                borderLeftColor: STATUS_COLORS[application.status] || '#5d675f',
              }}
            >
              <div className="my-applications-item-header">
                <div className="my-applications-item-title">
                  <h3>{application.jobId?.jobTitle || 'Job Title'}</h3>
                  <p className="my-applications-item-company">
                    {application.jobId?.company || 'Company Name'}
                  </p>
                </div>
                <div className="my-applications-item-status">
                  <span
                    className="my-applications-status-badge"
                    style={{
                      backgroundColor: STATUS_COLORS[application.status] || '#5d675f',
                    }}
                  >
                    {STATUS_ICONS[application.status] || ''} {application.status}
                  </span>
                </div>
              </div>

              <div className="my-applications-item-details">
                <div className="my-applications-detail-row">
                  <span className="my-applications-detail-label">Location:</span>
                  <span className="my-applications-detail-value">
                    {application.jobId?.location || 'N/A'}
                  </span>
                </div>
                <div className="my-applications-detail-row">
                  <span className="my-applications-detail-label">Job Type:</span>
                  <span className="my-applications-detail-value">
                    {application.jobId?.jobType || 'N/A'}
                  </span>
                </div>
                <div className="my-applications-detail-row">
                  <span className="my-applications-detail-label">Applied on:</span>
                  <span className="my-applications-detail-value">
                    {formatDate(application.appliedAt)}{' '}
                    <span style={{ opacity: 0.7 }}>
                      at {formatTime(application.appliedAt)}
                    </span>
                  </span>
                </div>

                {application.interviewDate && (
                  <div className="my-applications-detail-row">
                    <span className="my-applications-detail-label">
                      Interview Date:
                    </span>
                    <span className="my-applications-detail-value">
                      {formatDate(application.interviewDate)}
                    </span>
                  </div>
                )}

                {application.coverLetter && (
                  <div className="my-applications-detail-row">
                    <span className="my-applications-detail-label">
                      Cover Letter:
                    </span>
                    <span className="my-applications-detail-value">
                      <em>{application.coverLetter.substring(0, 100)}...</em>
                    </span>
                  </div>
                )}
              </div>

              <div className="my-applications-item-footer">
                <p className="my-applications-item-meta">
                  Resume: {application.resumeId?.fileName || 'N/A'} · From:{' '}
                  {application.city}, {application.country}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
