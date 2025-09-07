const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const ctrl = require('../controllers/taskController');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

router.get('/', ctrl.getAllTasks);

router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Max 200 chars'),
    body('description').optional().isString()
  ],
  validate,
  ctrl.createTask
);

router.get('/:id', ctrl.getTaskById);

router.put(
  '/:id',
  [
    body('title').optional().isLength({ max: 200 }).withMessage('Max 200 chars'),
    body('description').optional().isString(),
    body('completed').optional().isBoolean().withMessage('Completed must be boolean')
  ],
  validate,
  ctrl.updateTask
);

router.delete('/:id', ctrl.deleteTask);

module.exports = router;
