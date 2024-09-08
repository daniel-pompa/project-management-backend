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
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      if (task.project.toString() !== req.project.id) {
        return res.status(400).json({ message: 'Solicitud no válida' });
      }
      res.status(200).json({ task });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la tarea' });
    }
  };

  static updateTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      if (task.project.toString() !== req.project.id) {
        return res.status(400).json({ message: 'Solicitud no válida' });
      }
      task.name = req.body.name;
      task.description = req.body.description;
      await task.save();
      res.status(200).json({ message: 'Tarea actualizada con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la tarea' });
    }
  };

  static deleteTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      req.project.tasks = req.project.tasks.filter(task => task.toString() !== taskId);
      await Promise.allSettled([task.deleteOne(), req.project.save()]);
      res.status(200).json({ message: 'Tarea eliminada con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener la tarea' });
    }
  };

  static updateTaskStatus = async (req: Request, res: Response) => {
    try {
      const { taskId } = req.params;
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Tarea no encontrada' });
      }
      const { status } = req.body;
      task.status = status;
      await task.save();
      res.status(200).json({ message: 'Estado de la tarea actualizado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el estado de la tarea' });
    }
  };
}
