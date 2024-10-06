import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController, TaskController, TeamMembersController } from '../controllers';
import {
  authenticateUser,
  checkValidationErrors,
  hasAuthorization,
  projectExists,
  taskBelongsToProject,
  taskExists,
} from '../middlewares';

const router = Router();

/** Middleware to validate that the project exists */
router.param('projectId', projectExists);

/** Apply authentication middleware to all routes under this router */
router.use(authenticateUser);

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
  hasAuthorization,
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
  hasAuthorization,
  param('taskId').isMongoId().withMessage('Id no válido'),
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
  checkValidationErrors,
  TaskController.updateTask
);

router.delete(
  '/:projectId/tasks/:taskId',
  hasAuthorization,
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

/** Routes for the development teams */
router.post(
  '/:projectId/team/find',
  body('email').isEmail().toLowerCase().withMessage('El correo electrónico no es válido'),
  checkValidationErrors,
  TeamMembersController.findMemberByEmail
);

router.get('/:projectId/team', TeamMembersController.getProjectTeam);

router.post(
  '/:projectId/team',
  body('id').isMongoId().withMessage('ID no válido'),
  checkValidationErrors,
  TeamMembersController.addTeamMemberById
);

router.delete(
  '/:projectId/team/:userId',
  param('userId').isMongoId().withMessage('ID no válido'),
  checkValidationErrors,
  TeamMembersController.removeTeamMemberById
);

export default router;
