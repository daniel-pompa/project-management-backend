import type { Request, Response } from 'express';
import { Project } from '../models';

export class ProjectController {
  static createProject = async (req: Request, res: Response) => {
    const project = new Project(req.body);
    // Set the manager of the project
    project.manager = req.user.id;
    console.log(req.user);

    try {
      await project.save();
      res.status(201).json({ message: 'Proyecto creado con éxito', project });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el proyecto' });
    }
  };

  static getAllProjects = async (req: Request, res: Response) => {
    try {
      const projects = await Project.find({
        $or: [{ manager: { $in: req.user._id } }],
      });
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener los proyectos' });
    }
  };

  static getProjectById = async (req: Request, res: Response) => {
    try {
      res.status(200).json(req.project);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el proyecto' });
    }
  };

  static updateProject = async (req: Request, res: Response) => {
    try {
      req.project.name = req.body.name;
      req.project.client = req.body.client;
      req.project.description = req.body.description;
      await req.project.save();
      res
        .status(200)
        .json({ message: 'Proyecto actualizado con éxito', project: req.project });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el proyecto' });
    }
  };

  static deleteProject = async (req: Request, res: Response) => {
    try {
      await req.project.deleteOne();
      res.status(200).json({ message: 'Proyecto eliminado con éxito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el proyecto' });
    }
  };
}
