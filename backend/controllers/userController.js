const User = require('../models/User');

const getUserIdFromReq = (req) => {
  const sub = req.user?.sub;
  return sub ? String(sub) : '';
};

exports.getMe = async (req, res) => {
  try {
    if (req.user?.sub === 'admin') {
      return res.status(200).json({
        success: true,
        data: {
          userId: 'admin',
          email: req.user?.email || '',
          fullName: 'Administrator',
          role: 'admin',
          subscriptionPlan: 'enterprise',
        },
      });
    }

    const userId = getUserIdFromReq(req);
    const user = await User.findById(userId).select('email fullName role subscriptionPlan');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        userId: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        subscriptionPlan: user.subscriptionPlan || 'free',
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to load user', error: error.message });
  }
};

exports.updateMySubscription = async (req, res) => {
  try {
    if (req.user?.sub === 'admin') {
      return res.status(200).json({
        success: true,
        message: 'Admin subscription is always enterprise',
        data: {
          userId: 'admin',
          subscriptionPlan: 'enterprise',
        },
      });
    }

    const { planId } = req.body || {};
    const normalizedPlan = String(planId || '').trim().toLowerCase();

    if (!['free', 'premium', 'enterprise'].includes(normalizedPlan)) {
      return res.status(400).json({
        success: false,
        message: 'planId must be free, premium, or enterprise',
      });
    }

    const userId = getUserIdFromReq(req);
    const user = await User.findByIdAndUpdate(
      userId,
      { subscriptionPlan: normalizedPlan },
      { new: true }
    ).select('email fullName role subscriptionPlan');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Subscription updated',
      data: {
        userId: user._id.toString(),
        subscriptionPlan: user.subscriptionPlan,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update subscription', error: error.message });
  }
};

