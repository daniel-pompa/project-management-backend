import type { Request, Response } from 'express';
import Note, { INote } from '../models/Note';
import { Types } from 'mongoose';

type NoteParams = {
  noteId: Types.ObjectId;
};

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;
    try {
      const note = new Note({ content, createdBy: req.user.id, task: req.task.id });
      req.task.notes.push(note.id);
      await Promise.allSettled([req.task.save(), note.save()]);
      res.status(201).json({ message: 'Nota creada con exito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la nota' });
    }
  };

  static getTaskNotes = async (req: Request, res: Response) => {
    try {
      const notes = await Note.find({ task: req.task.id });
      res.status(200).json({ notes });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener las notas' });
    }
  };

  static deleteNote = async (req: Request<NoteParams>, res: Response) => {
    const { noteId } = req.params;
    try {
      const note = await Note.findById(noteId);
      if (!note) {
        return res.status(404).json({ message: 'Nota no encontrada' });
      }
      if (note.createdBy.toString() !== req.user.id.toString()) {
        return res.status(401).json({ message: 'No autorizado' });
      }
      req.task.notes = req.task.notes.filter(
        note => note.toString() !== noteId.toString()
      );
      await Promise.allSettled([req.task.save(), note.deleteOne()]);
      res.status(200).json({ message: 'Nota eliminada con exito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar la nota' });
    }
  };
}
