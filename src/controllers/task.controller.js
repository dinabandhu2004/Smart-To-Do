const Task = require('../models/Task');

/**
 * Create a new task
 * POST /api/tasks
 * Protected route - requires authentication
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    // Input validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required.',
      });
    }

    // Create new task associated with logged-in user
    const task = await Task.create({
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      user: req.user._id, // User ID from auth middleware
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      data: {
        task,
      },
    });
  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error.',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating task.',
      error: error.message,
    });
  }
};

/**
 * Get all tasks for the logged-in user
 * GET /api/tasks
 * Protected route - requires authentication
 */
const getTasks = async (req, res) => {
  try {
    // Find all tasks belonging to the logged-in user
    // Sort by creation date (newest first)
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: 'Tasks retrieved successfully.',
      data: {
        tasks,
        count: tasks.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving tasks.',
      error: error.message,
    });
  }
};

/**
 * Update a task
 * PUT /api/tasks/:id
 * Protected route - requires authentication
 * Only task owner can update
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Find task by ID
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Verify that the task belongs to the logged-in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own tasks.',
      });
    }

    // Update task fields if provided
    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status !== undefined) {
      if (status !== 'pending' && status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'Status must be either "pending" or "completed".',
        });
      }
      task.status = status;
    }

    // Save updated task
    await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      data: {
        task,
      },
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error.',
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating task.',
      error: error.message,
    });
  }
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 * Protected route - requires authentication
 * Only task owner can delete
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task by ID
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    // Verify that the task belongs to the logged-in user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own tasks.',
      });
    }

    // Delete task
    await Task.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID format.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting task.',
      error: error.message,
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
};

