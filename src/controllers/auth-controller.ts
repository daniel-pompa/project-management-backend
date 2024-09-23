import type { Request, Response } from 'express';
import { Token, User } from '../models';
import { generateToken, hashPassword } from '../utils';
import { AuthEmail } from '../emails/AuthEmail';
import token from '../models/Token';

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
      const token = new Token({
        authToken: generateToken(),
        user: user.id,
      });
      // Send email confirmation
      await AuthEmail.sendConfirmationEmail({
        email: user.email,
        name: user.name,
        token: token.authToken,
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

  static confirmAccount = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const tokenExists = await Token.findOne({ authToken: token });
      if (!tokenExists) {
        const error = new Error('Token no válido o caducado.');
        return res.status(401).json({ message: error.message });
      }
      const user = await User.findById(tokenExists.user);
      if (!user) {
        const error = new Error('Usuario no encontrado.');
        return res.status(404).json({ message: error.message });
      }
      user.confirmed = true;
      await Promise.allSettled([user.save(), tokenExists.deleteOne()]);
      res.status(200).json({ message: 'Cuenta confirmada con exito.' });
    } catch (error) {
      res.status(500).json({ message: 'Error al confirmar la cuenta.' });
    }
  };
}
