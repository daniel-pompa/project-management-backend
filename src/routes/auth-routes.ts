import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers';
import { authenticateUser, checkValidationErrors } from '../middlewares';

const router = Router();

/**
 * @swagger
 * /api/auth/create-account:
 *  post:
 *    summary: Create a user account
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              confirm_password:
 *                type: string
 *    responses:
 *      201:
 *        description: User account created
 *      400:
 *        description: Invalid credentials
 *      409:
 *        description: User account already exists
 *      500:
 *        description: Internal server error
 *      503:
 *        description: Service unavailable
 */
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

/**
 * @swagger
 * /api/auth/confirm-account:
 *  post:
 *    summary: Confirm user account
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: Account confirmed successfully
 *      400:
 *        description: Invalid token
 */

router.post(
  '/confirm-account',
  body('token').notEmpty().withMessage('El token es obligatorio'),
  checkValidationErrors,
  AuthController.confirmAccount
);

/**
 * @swagger
 * /api/auth/login:
 *  post:
 *    summary: Log in a user
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: User logged in successfully
 *      400:
 *        description: Invalid email or password
 */
router.post(
  '/login',
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  checkValidationErrors,
  AuthController.login
);

/**
 * @swagger
 * /api/auth/request-code:
 *  post:
 *    summary: Request a confirmation code
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Confirmation code sent
 *      400:
 *        description: Invalid email
 */
router.post(
  '/request-code',
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  checkValidationErrors,
  AuthController.requestConfirmationCode
);

/**
 * @swagger
 * /api/auth/reset-password:
 *  post:
 *    summary: Reset user password
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Reset password instructions sent
 *      400:
 *        description: Invalid email
 */
router.post(
  '/reset-password',
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  checkValidationErrors,
  AuthController.resetPassword
);

/**
 * @swagger
 * /api/auth/verify-token:
 *  post:
 *    summary: Verify the token for password reset
 *    tags: [Auth]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *    responses:
 *      200:
 *        description: Token verified
 *      400:
 *        description: Invalid token
 */
router.post(
  '/verify-token',
  body('token').notEmpty().withMessage('El token es obligatorio'),
  checkValidationErrors,
  AuthController.verifyToken
);

/**
 * @swagger
 * /api/auth/reset-password/{token}:
 *  post:
 *    summary: Reset password with token
 *    tags: [Auth]
 *    parameters:
 *      - in: path
 *        name: token
 *        required: true
 *        schema:
 *          type: string
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *              confirm_password:
 *                type: string
 *    responses:
 *      200:
 *        description: Password reset successfully
 *      400:
 *        description: Invalid token or credentials
 */
router.post(
  '/reset-password/:token',
  param('token').isString().withMessage('El token no es válido'),
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/auth/user:
 *  get:
 *    summary: Get authenticated user details
 *    tags: [Auth]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *      200:
 *        description: User details retrieved successfully
 *      401:
 *        description: Unauthorized access
 */
router.get('/user', authenticateUser, AuthController.user);

/** Routes for user profile management */
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/auth/profile:
 *  put:
 *    summary: Update user profile
 *    tags: [Auth]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              email:
 *                type: string
 *    responses:
 *      200:
 *        description: Profile updated successfully
 *      400:
 *        description: Invalid input
 *      401:
 *        description: Unauthorized access
 */
router.put(
  '/profile',
  authenticateUser,
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email').isEmail().withMessage('El correo electrónico no es válido'),
  checkValidationErrors,
  AuthController.updateUserProfile
);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/auth/update-password:
 *  post:
 *    summary: Update user password
 *    tags: [Auth]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              current_password:
 *                type: string
 *              password:
 *                type: string
 *              confirm_password:
 *                type: string
 *    responses:
 *      200:
 *        description: Password updated successfully
 *      400:
 *        description: Invalid input or current password
 *      401:
 *        description: Unauthorized access
 */
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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/auth/check-password:
 *  post:
 *    summary: Check user password
 *    tags: [Auth]
 *    security:
 *      - BearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              password:
 *                type: string
 *    responses:
 *      200:
 *        description: Password is correct
 *      401:
 *        description: Unauthorized access
 *      400:
 *        description: Invalid input
 */
router.post(
  '/check-password',
  authenticateUser,
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
  checkValidationErrors,
  AuthController.checkUserPassword
);

export default router;
