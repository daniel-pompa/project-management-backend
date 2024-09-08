import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController, TaskController } from '../controllers';
import { checkValidationErrors, validateProjectExists } from '../middlewares';

const router = Router();

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
  '/:id',
  param('id').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  ProjectController.getProjectById
);

router.put(
  '/:id',
  param('id').isMongoId().withMessage('Id no válido'),
  body('name').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('client').notEmpty().withMessage('El cliente es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción del proyecto es obligatoria'),
  checkValidationErrors,
  ProjectController.updateProject
);

router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  ProjectController.deleteProject
);

/** Routes for tasks */
router.post(
  '/:projectId/tasks',
  validateProjectExists,
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
  checkValidationErrors,
  TaskController.createTask
);

router.get('/:projectId/tasks', validateProjectExists, TaskController.getProjectTasks);

export default router;
