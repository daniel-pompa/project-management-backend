import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController, TaskController } from '../controllers';
import {
  checkValidationErrors,
  projectExists,
  taskBelongsToProject,
  taskExists,
} from '../middlewares';

const router = Router();

/** Middleware to validate that the project exists */
router.param('projectId', projectExists);

router.post(
  '/',
  body('name').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('client').notEmpty().withMessage('El cliente es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción del proyecto es obligatoria'),
  checkValidationErrors,
  ProjectController.createProject
);

router.get('/', ProjectController.getAllProjects);

router.get(
  '/:projectId',
  param('projectId').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  ProjectController.getProjectById
);

router.put(
  '/:projectId',
  param('projectId').isMongoId().withMessage('Id no válido'),
  body('name').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('client').notEmpty().withMessage('El cliente es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción del proyecto es obligatoria'),
  checkValidationErrors,
  ProjectController.updateProject
);

router.delete(
  '/:projectId',
  param('projectId').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  ProjectController.deleteProject
);

/** Routes for tasks */
router.post(
  '/:projectId/tasks',
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
  checkValidationErrors,
  TaskController.createTask
);

router.get('/:projectId/tasks', TaskController.getProjectTasks);

/** Middlewares to validate that the task exists and belongs to the project */
router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

router.get(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  TaskController.getTaskById
);

router.put(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('Id no válido'),
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
  checkValidationErrors,
  TaskController.updateTask
);

router.delete(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  TaskController.deleteTask
);

router.put(
  '/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('Id no válido'),
  body('status').notEmpty().withMessage('El estado de la tarea es obligatorio'),
  checkValidationErrors,
  TaskController.updateTaskStatus
);

export default router;
