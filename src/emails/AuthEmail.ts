import sendgrid from '../config/sendgrid';

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  static sendConfirmationEmail = async (user: IEmail) => {
    const msg = {
      to: user.email,
      from: 'info@daemsolutions.com',
      subject: 'Solicitud para confirmar tu cuenta',
      html: `
        <h1>Bienvenido a Daem Tech Solutions</h1>
        <p>Hola ${user.name}.</p>
        <p>Gracias por registrarte en Daem Tech Solutions. Para completar el proceso de creación de tu cuenta, por favor confirma tu dirección de correo electrónico.</p>
        <p>
          Haz clic en el siguiente enlace para confirmar tu cuenta:
          <a href="${process.env.REACT_APP_FRONTEND_URL}/auth/confirm-account">confirmar cuenta</a>
        </p>
        <p>Tu código de verificación de 6 dígitos es: <b>${user.token}</b></p>
        <p>Este código expirará en 10 minutos.</p>
        <p>Si no solicitaste la creación de esta cuenta, simplemente ignora este correo.</p>
        <p>Atentamente,</p>
        <p>El equipo de Daem</p>
      `,
    };

    try {
      await sendgrid.send(msg);
      console.log('Correo de confirmación enviado exitosamente');
    } catch (error) {
      console.error('Error al enviar el correo de confirmación:', error);
    }
  };

  static sendPasswordResetEmail = async (user: IEmail) => {
    const msg = {
      to: user.email,
      from: 'info@daemsolutions.com',
      subject: 'Solicitud para restablecer tu contraseña',
      html: `
      <h1>Restablecer tu contraseña en Daem</h1>
      <p>Hola ${user.name}.</p>
      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
      <p>
        Para proceder, por favor haz clic en el siguiente enlace:
        <a href="${process.env.REACT_APP_FRONTEND_URL}/auth/new-password">restablecer contraseña</a>
      </p>
      <p>Tu código de verificación es: <b>${user.token}</b></p>
      <p>Este código expirará en 10 minutos.</p>
      <p>Si no solicitaste este cambio, puedes ignorar este mensaje, tu cuenta está segura.</p>
      <p>Atentamente,</p>
      <p>El equipo de Daem</p>
    `,
    };

    try {
      await sendgrid.send(msg);
      console.log('Correo de restablecimiento de contraseña enviado con éxito');
    } catch (error) {
      console.error(
        'Error al enviar el correo de restablecimiento de contraseña:',
        error
      );
    }
  };
}
