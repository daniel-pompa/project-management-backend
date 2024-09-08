import type { Request, Response } from 'express';
import { Task } from '../models';

export class TaskController {
  static createTask = async (req: Request, res: Response) => {
    try {
      const task = new Task(req.body);
      task.project = req.project.id;
      req.project.tasks.push(task.id);
      await Promise.allSettled([task.save(), req.project.save()]);
      res.status(201).json({ message: 'Tarea creada con éxito', task });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear la tarea' });
    }
  };
}
