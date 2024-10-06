import type { Request, Response, NextFunction } from 'express';
import { ITask, Task } from '../models';

/**
 * Extend the Express Request interface to include the `task` property.
 * This allows middleware functions to attach a `task` object to the request, which can be used in subsequent route handlers.
 */
declare global {
  namespace Express {
    interface Request {
      task: ITask;
    }
  }
}

/** Middleware to validate that the task exists */
export const taskExists = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    req.task = task;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la tarea' });
  }
};

export const taskBelongsToProject = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.task.project.toString() !== req.project.id.toString()) {
    return res.status(400).json({ message: 'Solicitud no válida' });
  }
  next();
};

export const hasAuthorization = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.user.id.toString() !== req.project.manager.toString()) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  next();
};
