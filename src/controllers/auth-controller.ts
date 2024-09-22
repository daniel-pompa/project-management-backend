import type { Request, Response } from 'express';
import { User } from '../models';
import { hashPassword } from '../utils/auth';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      /** Avoid duplicates in the database */
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error('Ya existe una cuenta con ese correo electrónico.');
        return res.status(409).json({ message: error.message });
      }
      /** Create a new user */
      const user = new User(req.body);
      /** Password encryption using bcrypt */
      user.password = await hashPassword(password);
      await user.save();
      res.status(201).json({
        message:
          'Cuenta creada con éxito. Revisa tu correo electrónico para confirmarla.',
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la cuenta.' });
    }
  };
}
