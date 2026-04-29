const express = require('express');
const router = express.Router();

// Mock subscription plans data
const subscriptionPlans = [
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
];

// GET /api/subscriptions - Get all subscription plans
router.get('/', async (req, res) => {
  try {
    // In the future, this will fetch from database
    res.json({
      success: true,
      data: subscriptionPlans,
    });
  } catch (error) {
    console.error('Error fetching subscription plans:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscription plans',
    });
  }
});

// PUT /api/subscriptions/:planId - Update subscription plan (admin only)
router.put('/:planId', async (req, res) => {
  try {
    const { planId } = req.params;
    const updates = req.body;

    // Find the plan to update
    const planIndex = subscriptionPlans.findIndex(plan => plan.planId === planId);

    if (planIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Subscription plan not found',
      });
    }

    // Update the plan (in memory for now)
    subscriptionPlans[planIndex] = {
      ...subscriptionPlans[planIndex],
      ...updates,
    };

    res.json({
      success: true,
      data: subscriptionPlans[planIndex],
      message: 'Subscription plan updated successfully',
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating subscription plan',
    });
  }
});

module.exports = router;