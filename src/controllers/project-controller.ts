import type { Request, Response } from 'express';
import { Project } from '../models';

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    try {
      await project.save();
      res.status(201).json({ message: 'Proyecto creado con éxito', project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el proyecto' });
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({});
      res.status(200).json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener los proyectos' });
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
      res.status(200).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener el proyecto' });
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
      res.status(200).json({ message: 'Proyecto actualizado con éxito', project });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar el proyecto' });
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const project = await Project.findByIdAndDelete(id);
      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
      res.status(200).json({ message: 'Proyecto eliminado con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al eliminar el proyecto' });
    }
  };
}
