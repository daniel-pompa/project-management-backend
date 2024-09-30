import type { Request, Response } from 'express';
import { Project, User } from '../models';

export class TeamMembersController {
  static findMemberByEmail = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email }).select('id name email');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el usuario' });
    }
  };

  static getProjectTeam = async (req: Request, res: Response) => {
    const project = await Project.findById(req.project.id).populate({
      path: 'team',
      select: 'id name email',
    });
    res.json(project.team);
  };

  static addTeamMemberById = async (req: Request, res: Response) => {
    const { id } = req.body;
    try {
      const user = await User.findById(id).select('id');
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      if (req.project.team.some(member => member.toString() === user.id.toString())) {
        return res
          .status(409)
          .json({ message: 'El usuario ya está en el equipo del proyecto' });
      }
      req.project.team.push(user.id);
      await req.project.save();
      res.status(200).json({ message: 'Usuario añadido correctamente al equipo' });
    } catch (error) {
      res.status(500).json({ message: 'Error al añadir un usuario al equipo' });
    }
  };

  static removeTeamMemberById = async (req: Request, res: Response) => {
    const { userId } = req.params;
    try {
      if (!req.project.team.some(member => member.toString() === userId)) {
        return res
          .status(409)
          .json({ message: 'El usuario no está en el equipo del proyecto' });
      }
      req.project.team = req.project.team.filter(member => member.toString() !== userId);
      await req.project.save();
      res.status(200).json({ message: 'Usuario eliminado correctamente del equipo' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar un usuario del equipo' });
    }
  };
}
