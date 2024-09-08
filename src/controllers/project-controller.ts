import type { Request, Response } from 'express';
import Project from '../models/Project';

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    try {
      await project.save();
      res.send('Proyecto creado');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al crear el proyecto');
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.json(projects);
    } catch (error) {
      console.error(error);
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ message: error.message });
      }
      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al obtener el proyecto');
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
      if (!project) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ message: error.message });
      }
      await project.save();
      res.send('Proyecto actualizado');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al actualizar el proyecto');
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        const error = new Error('Proyecto no encontrado');
        return res.status(404).json({ message: error.message });
      }
      res.send('Proyecto eliminado');
    } catch (error) {
      console.error(error);
      res.status(500).send('Error al eliminar el proyecto');
    }
  };
}
