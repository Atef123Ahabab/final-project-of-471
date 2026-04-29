const Bookmark = require('../models/Bookmark');

// POST /api/bookmarks  - bookmark a job
const addBookmark = async (req, res) => {
  try {
    const { userId, jobId, jobTitle, companyName } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({ success: false, message: 'userId and jobId are required' });
    }

    const bookmark = await Bookmark.create({ userId, jobId, jobTitle, companyName });

    res.status(201).json({
      success: true,
      message: 'Job bookmarked successfully',
      data: bookmark,
    });
  } catch (error) {
    console.error('addBookmark error:', error);

    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: 'Job is already bookmarked' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// GET /api/bookmarks/:userId  - list all bookmarks for a user
const getUserBookmarks = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookmarks = await Bookmark.find({ userId }).sort({ bookmarkedAt: -1 });

    res.status(200).json({ success: true, data: bookmarks });
  } catch (error) {
    console.error('getUserBookmarks error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE /api/bookmarks/:id  - remove a single bookmark by its _id
const removeBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const bookmark = await Bookmark.findByIdAndDelete(id);

    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    res.status(200).json({ success: true, message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('removeBookmark error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// DELETE /api/bookmarks/job/:jobId?userId=xxx  - remove by jobId (handy from the UI)
const removeBookmarkByJobId = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'userId query parameter is required' });
    }

    const bookmark = await Bookmark.findOneAndDelete({ userId, jobId });

    if (!bookmark) {
      return res.status(404).json({ success: false, message: 'Bookmark not found' });
    }

    res.status(200).json({ success: true, message: 'Bookmark removed successfully' });
  } catch (error) {
    console.error('removeBookmarkByJobId error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = { addBookmark, getUserBookmarks, removeBookmark, removeBookmarkByJobId };
