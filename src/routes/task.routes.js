const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');

/**
 * Task Routes
 * Base path: /api/tasks
 * All routes are protected and require authentication
 */

// Apply authentication middleware to all task routes
router.use(authMiddleware);

// Create a new task
router.post('/', createTask);

// Get all tasks for logged-in user
router.get('/', getTasks);

// Update a task (only owner)
router.put('/:id', updateTask);

// Delete a task (only owner)
router.delete('/:id', deleteTask);

module.exports = router;

