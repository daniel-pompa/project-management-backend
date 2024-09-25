import { transporter } from '../config/nodemailer';

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    await transporter.sendMail({
      from: 'Daem Project Management" <admin@example.com>',
      to: user.email,
      subject: 'Confirma tu cuenta',
      text: 'Confirma tu cuenta en Daem',
      html: `
        <h1>Bienvenido a Daem</h1>
        <p>Hola ${user.name}, confirma tu cuenta en Daem.</p>
        <p>Haz clic en el siguiente enlace: 
          <a href="${process.env.REACT_APP_FRONTEND_URL}/auth/confirm-account">confirmar cuenta</a>
        </p>
        <p>Tu código de verificación de 6 dígitos es: <b>${user.token}</b></p>
        <p>Este código expirará en 10 minutos.</p>
        <p>Si no creaste esta cuenta, ignora este correo.</p>
      `,
    });
  };
}
