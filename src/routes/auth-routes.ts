import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers';
import { authenticateUser, checkValidationErrors } from '../middlewares';

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

router.post(
  '/confirm-account',
  body('token').notEmpty().withMessage('El token es obligatorio'),
  checkValidationErrors,
  AuthController.confirmAccount
);

router.post(
  '/login',
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  checkValidationErrors,
  AuthController.login
);

router.post(
  '/request-code',
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  checkValidationErrors,
  AuthController.requestConfirmationCode
);

router.post(
  '/reset-password',
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  checkValidationErrors,
  AuthController.resetPassword
);

router.post(
  '/verify-token',
  body('token').notEmpty().withMessage('El token es obligatorio'),
  checkValidationErrors,
  AuthController.verifyToken
);

router.post(
  '/reset-password/:token',
  param('token').isNumeric().withMessage('El token no es válido'),
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
  AuthController.resetPasswordWithToken
);

router.get('/user', authenticateUser, AuthController.user);

/** Routes for user profile management */
router.put(
  '/profile',
  authenticateUser,
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  checkValidationErrors,
  AuthController.updateUserProfile
);

router.post(
  '/update-password',
  authenticateUser,
  body('current_password').notEmpty().withMessage('La contraseña actual es obligatoria'),
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
  AuthController.updateUserPassword
);

router.post(
  '/check-password',
  authenticateUser,
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  checkValidationErrors,
  AuthController.checkUserPassword
);

export default router;
