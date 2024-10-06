import type { Request, Response } from 'express';
import Note, { INote } from '../models/Note';

export class NoteController {
  static createNote = async (req: Request<{}, {}, INote>, res: Response) => {
    const { content } = req.body;
    const note = new Note({ content, createdBy: req.user.id, task: req.task.id });
    req.task.notes.push(note.id);
    try {
      await Promise.allSettled([req.task.save(), note.save()]);
      res.status(201).json({ message: 'Nota creada con exito' });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la nota' });
    }
  };
}
