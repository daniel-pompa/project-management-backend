import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, User } from '../models';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const bearer = req.headers.authorization;
  if (!bearer) {
    return res.status(401).json({ message: 'No autorizado' });
  }
  const [, token] = bearer.split(' ');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (typeof decoded === 'object' && decoded.id) {
      const user = await User.findById(decoded.id).select('_id name email');
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: 'No autorizado' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Token no válido' });
  }
};
