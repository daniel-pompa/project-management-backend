import { Router } from 'express';
import { body, param } from 'express-validator';
import { ProjectController } from '../controllers/project-controller';
import { checkValidationErrors } from '../middlewares/validator';

const router = Router();

router.post(
  '/',
  body('name').notEmpty().withMessage('El nombre del proyecto es obligatorio'),
  body('client').notEmpty().withMessage('El cliente es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
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
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  checkValidationErrors,
  ProjectController.updateProject
);

router.delete(
  '/:id',
  param('id').isMongoId().withMessage('Id no válido'),
  checkValidationErrors,
  ProjectController.deleteProject
);

export default router;
