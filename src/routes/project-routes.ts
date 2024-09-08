import { Router } from 'express';
import { ProjectController } from '../controllers/project-controller';

const router = Router();

router.post('/', ProjectController.createProject);
router.get('/', ProjectController.getAllProjects);

export default router;
