import type { Request, Response, NextFunction } from 'express';
import { IProject, Project } from '../models';

/**
 * Extend the Express Request interface to include the `project` property.
 * This allows middleware functions to attach a `project` object to the request, which can be used in subsequent route handlers.
 */
declare global {
  namespace Express {
    interface Request {
      project: IProject;
    }
  }
}

/** Middleware to validate that the project exists */
export const validateProjectExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    req.project = project;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el proyecto' });
  }
};
