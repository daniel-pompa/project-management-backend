import type { Request, Response } from 'express';
import { Token, User } from '../models';
import { generateToken, hashPassword } from '../utils';

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      // Check if the user already exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        const error = new Error('Ya existe una cuenta con ese correo electrónico.');
        return res.status(409).json({ message: error.message });
      }
      // Create a new user and hash the password
      const user = new User(req.body);
      user.password = await hashPassword(password);
      // Generate a token for the new user
      const tokenValue = generateToken();
      const token = new Token({
        token: tokenValue,
        user: user.id,
      });
      // Save the user and the token in the database
      await Promise.allSettled([user.save(), token.save()]);
      res.status(201).json({
        message:
          'Cuenta creada con éxito. Revisa tu correo electrónico para confirmarla.',
      });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear la cuenta.' });
    }
  };
}
