import { useState, useEffect } from 'react';
import { apiRequest } from './api';

export function SubscriptionsPanel({
  isLoading,
  setIsLoading,
  notice,
  setNotice,
  error,
  setError,
}) {
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    loadSubscriptionPlans();
  }, []);

  const loadSubscriptionPlans = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await apiRequest('/api/subscriptions');
      if (response.success) {
        setSubscriptionPlans(response.data);
      } else {
        // Fallback to mock data if API fails
        setSubscriptionPlans([
          {
            planId: 'free',
            planName: 'Free',
            displayName: 'Free Plan',
            description: 'Perfect for getting started with basic job posting features.',
            pricing: {
              monthly: 0,
              yearly: 0,
              currency: 'USD',
            },
            features: {
              featuredJobsAllowed: 0,
              jobPostingLimit: 5,
              basicAnalytics: true,
              advancedAnalytics: false,
              applicantTracking: false,
              resumeDatabase: false,
              aiRecommendations: false,
              customBranding: false,
              prioritySupport: false,
            },
            metadata: {
              order: 1,
              icon: 'star',
              badge: null,
            },
            isActive: true,
            isPopular: false,
          },
          {
            planId: 'premium',
            planName: 'Premium',
            displayName: 'Premium Plan',
            description: 'Purchase premium subscription plans to post featured jobs and access advanced analytics',
            pricing: {
              monthly: 29.99,
              yearly: 299.99,
              currency: 'USD',
            },
            features: {
              featuredJobsAllowed: 5,
              jobPostingLimit: 50,
              basicAnalytics: true,
              advancedAnalytics: true,
              applicantTracking: true,
              resumeDatabase: true,
              aiRecommendations: true,
              customBranding: false,
              prioritySupport: true,
            },
            metadata: {
              order: 2,
              icon: 'crown',
              badge: 'Most Popular',
            },
            isActive: true,
            isPopular: true,
          },
          {
            planId: 'enterprise',
            planName: 'Enterprise',
            displayName: 'Enterprise Plan',
            description: 'Custom solutions for large organizations with unlimited access to all features.',
            pricing: {
              monthly: 99.99,
              yearly: 999.99,
              currency: 'USD',
            },
            features: {
              featuredJobsAllowed: -1, // unlimited
              jobPostingLimit: -1, // unlimited
              basicAnalytics: true,
              advancedAnalytics: true,
              applicantTracking: true,
              resumeDatabase: true,
              aiRecommendations: true,
              customBranding: true,
              prioritySupport: true,
            },
            metadata: {
              order: 3,
              icon: 'building',
              badge: 'Best Value',
            },
            isActive: true,
            isPopular: false,
          },
        ]);
      }
    } catch (err) {
      console.error('Error loading subscription plans:', err);
      setError(err.message || 'Error loading subscription plans');
      // Fallback to mock data
      setSubscriptionPlans([
        {
          planId: 'free',
          planName: 'Free',
          displayName: 'Free Plan',
          description: 'Perfect for getting started with basic job posting features.',
          pricing: {
            monthly: 0,
            yearly: 0,
            currency: 'USD',
          },
          features: {
            featuredJobsAllowed: 0,
            jobPostingLimit: 5,
            basicAnalytics: true,
            advancedAnalytics: false,
            applicantTracking: false,
            resumeDatabase: false,
            aiRecommendations: false,
            customBranding: false,
            prioritySupport: false,
          },
          metadata: {
            order: 1,
            icon: 'star',
            badge: null,
          },
          isActive: true,
          isPopular: false,
        },
        {
          planId: 'premium',
          planName: 'Premium',
          displayName: 'Premium Plan',
          description: 'Purchase premium subscription plans to post featured jobs and access advanced analytics',
          pricing: {
            monthly: 29.99,
            yearly: 299.99,
            currency: 'USD',
          },
          features: {
            featuredJobsAllowed: 5,
            jobPostingLimit: 50,
            basicAnalytics: true,
            advancedAnalytics: true,
            applicantTracking: true,
            resumeDatabase: true,
            aiRecommendations: true,
            customBranding: false,
            prioritySupport: true,
          },
          metadata: {
            order: 2,
            icon: 'crown',
            badge: 'Most Popular',
          },
          isActive: true,
          isPopular: true,
        },
        {
          planId: 'enterprise',
          planName: 'Enterprise',
          displayName: 'Enterprise Plan',
          description: 'Custom solutions for large organizations with unlimited access to all features.',
          pricing: {
            monthly: 99.99,
            yearly: 999.99,
            currency: 'USD',
          },
          features: {
            featuredJobsAllowed: -1, // unlimited
            jobPostingLimit: -1, // unlimited
            basicAnalytics: true,
            advancedAnalytics: true,
            applicantTracking: true,
            resumeDatabase: true,
            aiRecommendations: true,
            customBranding: true,
            prioritySupport: true,
          },
          metadata: {
            order: 3,
            icon: 'building',
            badge: 'Best Value',
          },
          isActive: true,
          isPopular: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (plan) => {
    setEditingPlan(plan.planId);
    setEditForm({
      displayName: plan.displayName,
      description: plan.description,
      monthlyPrice: plan.pricing.monthly,
      yearlyPrice: plan.pricing.yearly,
      featuredJobsAllowed: plan.features.featuredJobsAllowed,
      jobPostingLimit: plan.features.jobPostingLimit,
      advancedAnalytics: plan.features.advancedAnalytics,
      applicantTracking: plan.features.applicantTracking,
      resumeDatabase: plan.features.resumeDatabase,
      aiRecommendations: plan.features.aiRecommendations,
      customBranding: plan.features.customBranding,
      prioritySupport: plan.features.prioritySupport,
    });
  };

  const cancelEditing = () => {
    setEditingPlan(null);
    setEditForm({});
  };

  const savePlanChanges = async () => {
    try {
      // Transform editForm data to match backend structure
      const updateData = {
        displayName: editForm.displayName,
        description: editForm.description,
        pricing: {
          monthly: parseFloat(editForm.monthlyPrice),
          yearly: parseFloat(editForm.yearlyPrice),
          currency: 'USD',
        },
        features: {
          featuredJobsAllowed: parseInt(editForm.featuredJobsAllowed),
          jobPostingLimit: parseInt(editForm.jobPostingLimit),
          basicAnalytics: true, // Always true
          advancedAnalytics: editForm.advancedAnalytics,
          applicantTracking: editForm.applicantTracking,
          resumeDatabase: editForm.resumeDatabase,
          aiRecommendations: editForm.aiRecommendations,
          customBranding: editForm.customBranding,
          prioritySupport: editForm.prioritySupport,
        },
      };

      const response = await apiRequest(`/api/subscriptions/${editingPlan}`, {
        method: 'PUT',
        body: JSON.stringify(updateData),
      });

      if (response.success) {
        // Update local state with the response
        const updatedPlans = subscriptionPlans.map(plan => {
          if (plan.planId === editingPlan) {
            return response.data;
          }
          return plan;
        });
        setSubscriptionPlans(updatedPlans);
        setNotice('Plan updated successfully!');
        setTimeout(() => setNotice(''), 3000);
        cancelEditing();
      } else {
        setError(response.message || 'Error updating plan');
      }
    } catch (err) {
      console.error('Error saving plan changes:', err);
      setError(err.message || 'Error saving plan changes');
    }
  };

  const formatPrice = (price) => {
    return price === 0 ? 'Free' : `$${price.toFixed(2)}`;
  };

  const formatLimit = (limit) => {
    return limit === -1 ? 'Unlimited' : limit.toString();
  };

  return (
    <section className="subscriptions-section">
      <div className="subscriptions-header">
        <h1>Choose Your Plan</h1>
        <p className="subscriptions-subtitle">
          Purchase premium subscription plans to post featured jobs and access advanced analytics
        </p>
      </div>

      <div className="subscriptions-grid">
        {subscriptionPlans.map((plan) => (
          <div
            key={plan.planId}
            className={`subscription-card ${plan.isPopular ? 'popular' : ''} ${
              editingPlan === plan.planId ? 'editing' : ''
            }`}
          >
            {plan.metadata.badge && (
              <div className="plan-badge">{plan.metadata.badge}</div>
            )}

            <div className="plan-header">
              <h3>{plan.displayName}</h3>
              <div className="plan-pricing">
                <div className="monthly-price">
                  <span className="price">{formatPrice(plan.pricing.monthly)}</span>
                  <span className="period">/month</span>
                </div>
                {plan.pricing.yearly > 0 && (
                  <div className="yearly-price">
                    <span className="price">{formatPrice(plan.pricing.yearly)}</span>
                    <span className="period">/year</span>
                  </div>
                )}
              </div>
            </div>

            <div className="plan-description">
              <p>{plan.description}</p>
            </div>

            {editingPlan === plan.planId ? (
              <div className="plan-edit-form">
                <div className="form-group">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={editForm.displayName}
                    onChange={(e) => setEditForm({...editForm, displayName: e.target.value})}
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Monthly Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.monthlyPrice}
                      onChange={(e) => setEditForm({...editForm, monthlyPrice: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Yearly Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.yearlyPrice}
                      onChange={(e) => setEditForm({...editForm, yearlyPrice: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Featured Jobs</label>
                    <input
                      type="number"
                      value={editForm.featuredJobsAllowed}
                      onChange={(e) => setEditForm({...editForm, featuredJobsAllowed: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Job Posting Limit</label>
                    <input
                      type="number"
                      value={editForm.jobPostingLimit}
                      onChange={(e) => setEditForm({...editForm, jobPostingLimit: e.target.value})}
                    />
                  </div>
                </div>

                <div className="features-grid">
                  <label className="checkbox-group">
                    <input
                      type="checkbox"
                      checked={editForm.advancedAnalytics}
                      onChange={(e) => setEditForm({...editForm, advancedAnalytics: e.target.checked})}
                    />
                    Advanced Analytics
                  </label>
                  <label className="checkbox-group">
                    <input
                      type="checkbox"
                      checked={editForm.applicantTracking}
                      onChange={(e) => setEditForm({...editForm, applicantTracking: e.target.checked})}
                    />
                    Applicant Tracking
                  </label>
                  <label className="checkbox-group">
                    <input
                      type="checkbox"
                      checked={editForm.resumeDatabase}
                      onChange={(e) => setEditForm({...editForm, resumeDatabase: e.target.checked})}
                    />
                    Resume Database
                  </label>
                  <label className="checkbox-group">
                    <input
                      type="checkbox"
                      checked={editForm.aiRecommendations}
                      onChange={(e) => setEditForm({...editForm, aiRecommendations: e.target.checked})}
                    />
                    AI Recommendations
                  </label>
                  <label className="checkbox-group">
                    <input
                      type="checkbox"
                      checked={editForm.customBranding}
                      onChange={(e) => setEditForm({...editForm, customBranding: e.target.checked})}
                    />
                    Custom Branding
                  </label>
                  <label className="checkbox-group">
                    <input
                      type="checkbox"
                      checked={editForm.prioritySupport}
                      onChange={(e) => setEditForm({...editForm, prioritySupport: e.target.checked})}
                    />
                    Priority Support
                  </label>
                </div>

                <div className="form-actions">
                  <button className="btn-primary" onClick={savePlanChanges}>
                    Save Changes
                  </button>
                  <button className="btn-secondary" onClick={cancelEditing}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="plan-features">
                <ul>
                  <li>
                    <strong>{formatLimit(plan.features.featuredJobsAllowed)}</strong> Featured Jobs
                  </li>
                  <li>
                    <strong>{formatLimit(plan.features.jobPostingLimit)}</strong> Job Postings
                  </li>
                  {plan.features.advancedAnalytics && (
                    <li>✓ Advanced Analytics</li>
                  )}
                  {plan.features.applicantTracking && (
                    <li>✓ Applicant Tracking</li>
                  )}
                  {plan.features.resumeDatabase && (
                    <li>✓ Resume Database Access</li>
                  )}
                  {plan.features.aiRecommendations && (
                    <li>✓ AI-Powered Recommendations</li>
                  )}
                  {plan.features.customBranding && (
                    <li>✓ Custom Branding</li>
                  )}
                  {plan.features.prioritySupport && (
                    <li>✓ Priority Support</li>
                  )}
                </ul>

                <div className="plan-actions">
                  <button className="btn-primary">Choose Plan</button>
                  <button
                    className="btn-edit"
                    onClick={() => startEditing(plan)}
                  >
                    Edit Info
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}