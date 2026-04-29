const express = require('express');
const router = express.Router();
const {
  addBookmark,
  getUserBookmarks,
  removeBookmark,
  removeBookmarkByJobId,
} = require('../controllers/bookmarkController');

// POST   /api/bookmarks               - add bookmark
router.post('/', addBookmark);

// GET    /api/bookmarks/:userId       - list user's bookmarks
router.get('/:userId', getUserBookmarks);

// DELETE /api/bookmarks/job/:jobId    - remove by jobId (?userId=xxx)
// NOTE: this route must be declared BEFORE /:id to avoid "job" being treated as an id
router.delete('/job/:jobId', removeBookmarkByJobId);

// DELETE /api/bookmarks/:id          - remove by bookmark _id
router.delete('/:id', removeBookmark);

module.exports = router;
