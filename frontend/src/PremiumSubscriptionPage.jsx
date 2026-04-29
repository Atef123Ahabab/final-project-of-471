import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from './api';

export function PremiumSubscriptionPage({ currentUser, onSubscriptionUpdated, setError, showSuccess }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  const activePlan = currentUser?.subscriptionPlan || 'free';

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiRequest('/api/subscriptions');
        setPlans(response.data || []);
      } catch (err) {
        setPlans([]);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const availablePlans = useMemo(() => {
    const raw = plans.length
      ? plans
      : [
          { planId: 'free', displayName: 'Free Plan', description: 'Basic access', pricing: { monthly: 0 } },
          { planId: 'premium', displayName: 'Premium Plan', description: 'Featured jobs + premium features', pricing: { monthly: 29.99 } },
          { planId: 'enterprise', displayName: 'Enterprise Plan', description: 'Everything unlocked', pricing: { monthly: 99.99 } },
        ];
    return raw.filter((p) => ['free', 'premium', 'enterprise'].includes(p.planId));
  }, [plans]);

  const choosePlan = async (planId) => {
    setError('');
    try {
      const response = await apiRequest('/api/users/me/subscription', {
        method: 'PUT',
        body: JSON.stringify({ planId }),
      });

      const updatedPlan = response?.data?.subscriptionPlan || planId;
      onSubscriptionUpdated(updatedPlan);
      showSuccess(`Subscription updated to ${updatedPlan}.`);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatPrice = (price) => {
    const n = Number(price || 0);
    return n === 0 ? 'Free' : `$${n.toFixed(2)}`;
  };

  const formatLimit = (limit) => {
    if (limit === -1) return 'Unlimited';
    if (limit === 0) return 'No';
    return String(limit);
  };

  return (
    <section className="premium-section">
      <header className="premium-header">
        <div>
          <p className="premium-eyebrow">Subscription</p>
          <h2>Upgrade to unlock premium features</h2>
          <p className="premium-subtitle">
            No payment gateway required for now—just choose a subscription to enable premium features like Featured Jobs.
          </p>
        </div>
        <div className="premium-current">
          <span className="pill ok">Current: {activePlan}</span>
        </div>
      </header>

      {loading ? <p className="loading">Loading plans...</p> : null}

      <div className="premium-grid">
        {availablePlans.map((plan) => {
          const isActive = plan.planId === activePlan;
          const isPopular = Boolean(plan?.isPopular) || plan.planId === 'premium';
          const price = plan?.pricing?.monthly ?? 0;
          const features = plan?.features || {};

          return (
            <article
              key={plan.planId}
              className={[
                'premium-card',
                isPopular ? 'popular' : '',
                isActive ? 'active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {plan?.metadata?.badge ? (
                <div className="premium-badge">{plan.metadata.badge}</div>
              ) : null}

              <div className="premium-card-top">
                <h3>{plan.displayName || plan.planId}</h3>
                <p className="premium-desc">{plan.description || ''}</p>
                <div className="premium-price">
                  <span className="premium-amount">{formatPrice(price)}</span>
                  <span className="premium-period">/month</span>
                </div>
              </div>

              <ul className="premium-features">
                <li>
                  <strong>{formatLimit(features.featuredJobsAllowed)}</strong> featured jobs
                </li>
                <li>
                  <strong>{formatLimit(features.jobPostingLimit)}</strong> job postings
                </li>
                {features.advancedAnalytics ? <li>✓ Advanced analytics</li> : <li className="muted">Advanced analytics</li>}
                {features.applicantTracking ? <li>✓ Applicant tracking</li> : <li className="muted">Applicant tracking</li>}
                {features.prioritySupport ? <li>✓ Priority support</li> : <li className="muted">Priority support</li>}
              </ul>

              <div className="premium-actions">
                {isActive ? (
                  <button type="button" className="secondary" disabled>
                    Active plan
                  </button>
                ) : (
                  <button type="button" onClick={() => choosePlan(plan.planId)}>
                    Choose subscription
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {availablePlans.length === 0 ? (
        <section className="grid one-col feature">
          <article className="card">
            <p>No plans available.</p>
          </article>
        </section>
      ) : null}
    </section>
  );
}

