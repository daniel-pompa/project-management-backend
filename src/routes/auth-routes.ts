import { Router } from 'express';
import { body } from 'express-validator';
import { AuthController } from '../controllers';
import { checkValidationErrors } from '../middlewares';

const router = Router();

router.post(
  '/create-account',
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
    .withMessage(
      'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial'
    ),
  body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Las contraseñas no coinciden');
    }
    return true;
  }),
  checkValidationErrors,
  AuthController.createAccount
);

export default router;
