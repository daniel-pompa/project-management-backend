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
      res.status(500).json({ message: 'Error al crear la tarea' });
    }
  };

  static getProjectTasks = async (req: Request, res: Response) => {
    try {
      const tasks = await Task.find({ project: req.project.id }).populate('project');
      res.status(200).json({ tasks });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las tareas' });
    }
  };

  static getTaskById = async (req: Request, res: Response) => {
    try {
      const task = await Task.findById(req.task.id)
        .populate({
          path: 'lastStatusChangedBy.user',
          select: 'id name email',
        })
        .populate({
          path: 'notes',
          populate: { path: 'createdBy', select: 'id name email' },
        });
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la tarea' });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      req.task.name = req.body.name;
      req.task.description = req.body.description;
      await req.task.save();
      res.status(200).json({ message: 'Tarea actualizada con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la tarea' });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      req.project.tasks = req.project.tasks.filter(
        task => task.toString() !== req.task.id.toString()
      );
      await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
      res.status(200).json({ message: 'Tarea eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la tarea' });
    }
  };

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      req.task.status = status;
      const data = { user: req.user.id, status };
      req.task.lastStatusChangedBy.push(data);
      await req.task.save();
      res.status(200).json({ message: 'Estado de la tarea actualizado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el estado de la tarea' });
    }
  };
}
