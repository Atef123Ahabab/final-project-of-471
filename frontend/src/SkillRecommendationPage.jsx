import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from './api';

const PRIORITY_LABELS = {
  high: 'High priority',
  medium: 'Medium priority',
  low: 'Low priority',
};

const priorityRank = (priority) => {
  if (priority === 'high') return 0;
  if (priority === 'medium') return 1;
  if (priority === 'low') return 2;
  return 3;
};

export function SkillRecommendationPage({ currentUser, setError, showSuccess }) {
  const [roleQuery, setRoleQuery] = useState('backend developer');
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('recommended'); // 'recommended' | 'my-skills'

  const userSkills = analysis?.userSkills || [];
  const matchedSkills = analysis?.matchedSkills || [];
  const missingSkills = analysis?.missingSkills || [];
  const totals = analysis?.totals || {};

  const sortedUserSkills = useMemo(() => {
    return [...userSkills]
      .map((item) => String(item || '').trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));
  }, [userSkills]);

  const sortedMissingSkills = useMemo(() => {
    return [...missingSkills].sort((a, b) => {
      const byPriority = priorityRank(a.priority) - priorityRank(b.priority);
      if (byPriority !== 0) return byPriority;
      return String(a.name || '').localeCompare(String(b.name || ''));
    });
  }, [missingSkills]);

  const runAnalysis = async (nextRole) => {
    const role = String(nextRole || '').trim();
    if (!role) return;

    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ role });
      const response = await apiRequest(`/api/skills/analyze-skills?${params.toString()}`);
      setAnalysis(response?.data || null);
      if (showSuccess) showSuccess('Skill recommendations updated.');
    } catch (err) {
      setAnalysis(null);
      setError(err.message || 'Failed to load skill recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAnalysis(roleQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progressPercent = typeof totals.matchPercent === 'number' ? totals.matchPercent : 0;

  return (
    <section className="grid two-col feature feature-skill-recommendation">
      <article className="card span-2 skill-reco-header-card">
        <div>
          <h2>Skill Recommendation</h2>
          <p style={{ marginTop: 6, opacity: 0.85 }}>
            Search a target role and compare your current skills (from your latest uploaded resume)
            against in-demand market skills.
          </p>
        </div>
      </article>

      <article className="card skill-reco-search-card">
        <h2>Search Field</h2>
        <form
          className="form-inline"
          onSubmit={(event) => {
            event.preventDefault();
            runAnalysis(roleQuery);
          }}
        >
          <input
            value={roleQuery}
            onChange={(event) => setRoleQuery(event.target.value)}
            placeholder="e.g. backend developer"
            aria-label="Search target role"
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </form>

        <div className="skill-reco-meta">
          <div className="pill" title="Signed-in user id">
            User: {currentUser?.fullName || currentUser?.email || currentUser?.id || 'Me'}
          </div>
          <div className="pill" title="Target role used for analysis">
            Role: {analysis?.role || roleQuery}
          </div>
        </div>
      </article>

      <article className="card skill-reco-progress-card">
        <h2>Progress</h2>
        <p style={{ marginTop: 6, opacity: 0.85 }}>
          Match: <strong>{totals.matched || 0}</strong> / <strong>{totals.market || 0}</strong>{' '}
          skills ({progressPercent}%)
        </p>
        <div className="skill-reco-progress-bar" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="skill-reco-progress-fill" style={{ width: `${Math.max(0, Math.min(100, progressPercent))}%` }} />
        </div>

        <div className="skill-reco-progress-legend">
          <div>
            <span className="skill-reco-dot matched" /> Matched ({totals.matched || 0})
          </div>
          <div>
            <span className="skill-reco-dot missing" /> Missing ({totals.missing || 0})
          </div>
        </div>
      </article>

      <article className="card span-2 skill-reco-inner-tabs-card">
        <div className="skill-reco-inner-tabs" role="tablist" aria-label="skill recommendation tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'recommended'}
            className={activeTab === 'recommended' ? 'active' : ''}
            onClick={() => setActiveTab('recommended')}
          >
            Recommended Skills
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'my-skills'}
            className={activeTab === 'my-skills' ? 'active' : ''}
            onClick={() => setActiveTab('my-skills')}
          >
            My Skills
          </button>
        </div>
      </article>

      {activeTab === 'recommended' ? (
        <>
          <article className="card skill-reco-matched-card">
            <h2>Your Matched Skills</h2>
            <div className="skill-reco-skill-grid">
              {matchedSkills.map((skill) => (
                <span className="skill-tag matched" key={skill.name}>
                  {skill.name}
                </span>
              ))}
              {matchedSkills.length === 0 ? (
                <p style={{ margin: 0, opacity: 0.85 }}>
                  No matched skills found yet. Upload a resume with skills, then re-run the search.
                </p>
              ) : null}
            </div>
          </article>

          <article className="card skill-reco-missing-card">
            <h2>Recommended Skills (Missing)</h2>
            <p style={{ marginTop: 6, opacity: 0.85 }}>
              Prioritized skills to learn for <strong>{analysis?.role || roleQuery}</strong>.
            </p>
            <div className="list">
              {sortedMissingSkills.map((skill) => (
                <div className="list-item" key={skill.name}>
                  <div>
                    <h3 style={{ margin: 0 }}>{skill.name}</h3>
                    <p style={{ marginTop: 6 }}>
                      Priority:{' '}
                      <span
                        className={`skill-priority-pill ${skill.priority || 'low'}`}
                        title={PRIORITY_LABELS[skill.priority] || 'Priority'}
                      >
                        {String(skill.priority || 'low').toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              ))}
              {sortedMissingSkills.length === 0 ? (
                <p style={{ margin: 0, opacity: 0.85 }}>
                  Great job—no missing skills detected for the current market list.
                </p>
              ) : null}
            </div>
          </article>
        </>
      ) : (
        <article className="card span-2 skill-reco-my-skills-card">
          <h2>My Skills</h2>
          <p style={{ marginTop: 6, opacity: 0.85 }}>
            Loaded from your latest uploaded resume. Total: <strong>{sortedUserSkills.length}</strong>
          </p>
          <div className="skill-reco-skill-grid">
            {sortedUserSkills.map((skill) => (
              <span className="skill-tag" key={skill}>
                {skill}
              </span>
            ))}
            {sortedUserSkills.length === 0 ? (
              <p style={{ margin: 0, opacity: 0.85 }}>
                No skills found yet. Upload a resume (with skills extracted) and re-run the search.
              </p>
            ) : null}
          </div>
        </article>
      )}
    </section>
  );
}

