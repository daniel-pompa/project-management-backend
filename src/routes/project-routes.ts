import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  NoteController,
  ProjectController,
  TaskController,
  TeamMembersController,
} from '../controllers';
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects:
 *  post:
 *    summary: Create a new project
 *    tags: [Project]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the project
 *              client:
 *                type: string
 *                description: Client associated with the project
 *              description:
 *                type: string
 *                description: Description of the project
 *    responses:
 *      201:
 *        description: Project created successfully
 *      400:
 *        description: Invalid project data
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project not found
 *      409:
 *        description: Project already exists
 *      500:
 *        description: Internal server error
 */
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects:
 *  get:
 *    summary: Get all projects
 *    tags: [Project]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: List of projects
 *      401:
 *        description: Unauthorized access
 *      500:
 *        description: Internal server error
 */
router.get('/', ProjectController.getAllProjects);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects/{projectId}:
 *  get:
 *    summary: Get a project by ID
 *    tags: [Project]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *    responses:
 *      200:
 *        description: Project details
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project not found
 *      500:
 *        description: Internal server error
 */
router.get(
  '/:projectId',
  param('projectId').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  ProjectController.getProjectById
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects/{projectId}:
 *  put:
 *    summary: Update a project by ID
 *    tags: [Project]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the project
 *              client:
 *                type: string
 *                description: Client associated with the project
 *              description:
 *                type: string
 *                description: Description of the project
 *    responses:
 *      200:
 *        description: Project updated successfully
 *      400:
 *        description: Invalid project data
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project not found
 *      500:
 *        description: Internal server error
 */
router.put(
  '/:projectId',
  param('projectId').isMongoId().withMessage('Id no válido'),
  body('name').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('client').notEmpty().withMessage('El cliente es obligatorio'),
  body('description')
    .notEmpty()
    .withMessage('La descripción del proyecto es obligatoria'),
  checkValidationErrors,
  hasAuthorization,
  ProjectController.updateProject
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects/{projectId}:
 *  delete:
 *    summary: Delete a project by ID
 *    tags: [Project]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *    responses:
 *      200:
 *        description: Project deleted successfully
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project not found
 *      500:
 *        description: Internal server error
 */
router.delete(
  '/:projectId',
  param('projectId').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  hasAuthorization,
  ProjectController.deleteProject
);

/** Routes for tasks */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * /api/projects/{projectId}/tasks:
 *  post:
 *    summary: Create a new task within a project
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the task
 *              description:
 *                type: string
 *                description: Description of the task
 *    responses:
 *      201:
 *        description: Task created successfully
 *      400:
 *        description: Invalid task data
 *      404:
 *        description: Project not found
 *      500:
 *        description: Internal server error
 */
router.post(
  '/:projectId/tasks',
  hasAuthorization,
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
  checkValidationErrors,
  TaskController.createTask
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects/{projectId}/tasks:
 *  get:
 *    summary: Get all tasks within a project
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *    responses:
 *      200:
 *        description: List of tasks
 *      404:
 *        description: Project not found
 *      500:
 *        description: Internal server error
 */
router.get('/:projectId/tasks', TaskController.getProjectTasks);

/** Middlewares to validate that the task exists and belongs to the project */
router.param('taskId', taskExists);
router.param('taskId', taskBelongsToProject);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects/{projectId}/tasks/{taskId}:
 *  get:
 *    summary: Get a task by ID within a project
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *      - in: path
 *        name: taskId
 *        required: true
 *        schema:
 *          type: string
 *        description: The task ID
 *    responses:
 *      200:
 *        description: Task details retrieved successfully
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Task or project not found
 *      500:
 *        description: Internal server error
 */
router.get(
  '/:projectId/tasks/:taskId',
  param('taskId').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  TaskController.getTaskById
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects/{projectId}/tasks/{taskId}:
 *  put:
 *    summary: Update a task by ID within a project
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *      - in: path
 *        name: taskId
 *        required: true
 *        schema:
 *          type: string
 *        description: The task ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Name of the task
 *              description:
 *                type: string
 *                description: Description of the task
 *    responses:
 *      200:
 *        description: Task updated successfully
 *      400:
 *        description: Invalid task data
 *      404:
 *        description: Task or project not found
 *      500:
 *        description: Internal server error
 */
router.put(
  '/:projectId/tasks/:taskId',
  hasAuthorization,
  param('taskId').isMongoId().withMessage('Id no válido'),
  body('name').notEmpty().withMessage('El nombre de la tarea es obligatorio'),
  body('description').notEmpty().withMessage('La descripción de la tarea es obligatoria'),
  checkValidationErrors,
  TaskController.updateTask
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects/{projectId}/tasks/{taskId}:
 *  delete:
 *    summary: Delete a task by ID within a project
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *      - in: path
 *        name: taskId
 *        required: true
 *        schema:
 *          type: string
 *        description: The task ID
 *    responses:
 *      204:
 *        description: Task deleted successfully
 *      400:
 *        description: Invalid task ID
 *      404:
 *        description: Task or project not found
 *      500:
 *        description: Internal server error
 */
router.delete(
  '/:projectId/tasks/:taskId',
  hasAuthorization,
  param('taskId').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  TaskController.deleteTask
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/projects/{projectId}/tasks/{taskId}/status:
 *  put:
 *    summary: Update the status of a task by ID within a project
 *    tags: [Task]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *      - in: path
 *        name: taskId
 *        required: true
 *        schema:
 *          type: string
 *        description: The task ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *                description: The new status of the task
 *    responses:
 *      200:
 *        description: Task status updated successfully
 *      400:
 *        description: Invalid task ID or status
 *      404:
 *        description: Task or project not found
 *      500:
 *        description: Internal server error
 */
router.put(
  '/:projectId/tasks/:taskId/status',
  param('taskId').isMongoId().withMessage('Id no válido'),
  body('status').notEmpty().withMessage('El estado de la tarea es obligatorio'),
  checkValidationErrors,
  TaskController.updateTaskStatus
);

/** Routes for the development teams */
/**
 * @swagger
 * /api/projects/{projectId}/team/find:
 *  post:
 *    summary: Find a team member by email
 *    tags: [Team]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: The email of the user to find
 *    responses:
 *      200:
 *        description: Successfully found the team member
 *      400:
 *        description: Invalid email address
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project not found
 *      500:
 *        description: Internal server error
 */
router.post(
  '/:projectId/team/find',
  body('email').isEmail().toLowerCase().withMessage('El correo electrónico no es válido'),
  checkValidationErrors,
  TeamMembersController.findMemberByEmail
);

/**
 * @swagger
 * /api/projects/{projectId}/team:
 *  get:
 *    summary: Get all team members of a project
 *    tags: [Team]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *    responses:
 *      200:
 *        description: Successfully retrieved the team members
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project not found
 *      500:
 *        description: Internal server error
 */
router.get('/:projectId/team', TeamMembersController.getProjectTeam);

/**
 * @swagger
 * /api/projects/{projectId}/team:
 *  post:
 *    summary: Add a team member to a project
 *    tags: [Team]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: string
 *                description: The ID of the user to add as a team member
 *    responses:
 *      201:
 *        description: Team member added successfully
 *      400:
 *        description: Invalid user ID
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project not found
 *      500:
 *        description: Internal server error
 */
router.post(
  '/:projectId/team',
  body('id').isMongoId().withMessage('ID no válido'),
  checkValidationErrors,
  TeamMembersController.addTeamMemberById
);

/**
 * @swagger
 * /api/projects/{projectId}/team/{userId}:
 *  delete:
 *    summary: Remove a team member from a project
 *    tags: [Team]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *      - in: path
 *        name: userId
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the user to remove from the team
 *    responses:
 *      204:
 *        description: Team member removed successfully
 *      400:
 *        description: Invalid user ID
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project or user not found
 *      500:
 *        description: Internal server error
 */
router.delete(
  '/:projectId/team/:userId',
  param('userId').isMongoId().withMessage('ID no válido'),
  checkValidationErrors,
  TeamMembersController.removeTeamMemberById
);

/** Routes for notes */
/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}/notes:
 *  post:
 *    summary: Create a new note for a task
 *    tags: [Notes]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *      - in: path
 *        name: taskId
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the task to which the note belongs
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              content:
 *                type: string
 *                description: The content of the note
 *    responses:
 *      201:
 *        description: Note created successfully
 *      400:
 *        description: Invalid note content
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project or task not found
 *      500:
 *        description: Internal server error
 */
router.post(
  '/:projectId/tasks/:taskId/notes',
  body('content').notEmpty().withMessage('El contenido de la nota es obligatorio'),
  checkValidationErrors,
  NoteController.createNote
);

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}/notes:
 *  get:
 *    summary: Retrieve all notes for a task
 *    tags: [Notes]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *      - in: path
 *        name: taskId
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the task for which to retrieve notes
 *    responses:
 *      200:
 *        description: Successfully retrieved notes for the task
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: The note ID
 *                  content:
 *                    type: string
 *                    description: The content of the note
 *                  createdAt:
 *                    type: string
 *                    format: date-time
 *                    description: The creation date of the note
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project or task not found
 *      500:
 *        description: Internal server error
 */
router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes);

/**
 * @swagger
 * /api/projects/{projectId}/tasks/{taskId}/notes/{noteId}:
 *  delete:
 *    summary: Delete a note from a task
 *    tags: [Notes]
 *    security:
 *      - BearerAuth: []
 *    parameters:
 *      - in: path
 *        name: projectId
 *        required: true
 *        schema:
 *          type: string
 *        description: The project ID
 *      - in: path
 *        name: taskId
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the task from which to delete the note
 *      - in: path
 *        name: noteId
 *        required: true
 *        schema:
 *          type: string
 *        description: The ID of the note to delete
 *    responses:
 *      204:
 *        description: Note deleted successfully
 *      400:
 *        description: Invalid note ID
 *      401:
 *        description: Unauthorized access
 *      404:
 *        description: Project, task, or note not found
 *      500:
 *        description: Internal server error
 */
router.delete(
  '/:projectId/tasks/:taskId/notes/:noteId',
  param('noteId').isMongoId().withMessage('ID no válido'),
  checkValidationErrors,
  NoteController.deleteNote
);

export default router;
