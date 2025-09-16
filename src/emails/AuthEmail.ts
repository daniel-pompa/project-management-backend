import transporter from '../config/nodemailer';

interface IEmail {
  email: string;
  name: string;
  token: string;
}

export class AuthEmail {
  // Send account confirmation email with token and link
  static sendConfirmationEmail = async (user: IEmail) => {
    const mailOptions = {
      from: '"Daem Tech Solutions" <info@daemsolutions.com>',
      to: user.email,
      subject: 'Solicitud para confirmar tu cuenta',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .footer { margin-top: 20px; padding: 20px; background-color: #f8f9fa; text-align: center; font-size: 12px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; }
            .code { font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0; padding: 10px; background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Daem Tech Solutions</h1>
            </div>
            
            <h2>Bienvenido a Daem Tech Solutions</h2>
            <p>Hola ${user.name},</p>
            <p>Gracias por registrarte en Daem Tech Solutions. Para completar el proceso de creación de tu cuenta, por favor confirma tu dirección de correo electrónico.</p>
            
            <p>Tu código de verificación de 6 dígitos es:</p>
            <div class="code">${user.token}</div>
            
            <p>Este código expirará en 10 minutos.</p>
            <p>También puedes hacer clic en el siguiente enlace para confirmar tu cuenta:</p>
            <p style="text-align: center;">
              <a href="${
                process.env.REACT_APP_FRONTEND_URL
              }/auth/confirm-account" class="button">Confirmar cuenta</a>
            </p>
            
            <p>Si no solicitaste la creación de esta cuenta, simplemente ignora este correo.</p>
            
            <div class="footer">
              <p>Atentamente,<br>El equipo de Daem Tech Solutions</p>
              <p>© ${new Date().getFullYear()} Daem Tech Solutions. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Bienvenido a Daem Tech Solutions
        
        Hola ${user.name},
        
        Gracias por registrarte en Daem Tech Solutions. Para completar el proceso de creación de tu cuenta, por favor confirma tu dirección de correo electrónico.
        
        Tu código de verificación de 6 dígitos es: ${user.token}
        
        Este código expirará en 10 minutos.
        
        También puedes visitar este enlace para confirmar tu cuenta: ${process.env.REACT_APP_FRONTEND_URL}/auth/confirm-account
        
        Si no solicitaste la creación de esta cuenta, simplemente ignora este correo.
        
        Atentamente,
        El equipo de Daem Tech Solutions
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      if (process.env.NODE_ENV === 'development') {
        console.log('Confirmation email sent successfully:', info.messageId);
      }
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error sending confirmation email:', error);
      } else {
        console.error('Error sending confirmation email:', error.message);
      }
      return { success: false, error };
    }
  };

  // Send password reset email with token and link
  static sendPasswordResetEmail = async (user: IEmail) => {
    const mailOptions = {
      from: '"Daem Tech Solutions" <info@daemsolutions.com>',
      to: user.email,
      subject: 'Solicitud para restablecer tu contraseña',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; text-align: center; }
            .footer { margin-top: 20px; padding: 20px; background-color: #f8f9fa; text-align: center; font-size: 12px; }
            .button { display: inline-block; padding: 10px 20px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; }
            .code { font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; margin: 20px 0; padding: 10px; background-color: #f8f9fa; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Daem Tech Solutions</h1>
            </div>
            
            <h2>Restablecer tu contraseña</h2>
            <p>Hola ${user.name},</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
            
            <p>Tu código de verificación es:</p>
            <div class="code">${user.token}</div>
            
            <p>Este código expirará en 10 minutos.</p>
            <p>También puedes hacer clic en el siguiente enlace para restablecer tu contraseña:</p>
            <p style="text-align: center;">
              <a href="${
                process.env.REACT_APP_FRONTEND_URL
              }/auth/new-password" class="button">Restablecer contraseña</a>
            </p>
            
            <p>Si no solicitaste este cambio, puedes ignorar este mensaje, tu cuenta está segura.</p>
            
            <div class="footer">
              <p>Atentamente,<br>El equipo de Daem Tech Solutions</p>
              <p>© ${new Date().getFullYear()} Daem Tech Solutions. Todos los derechos reservados.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Restablecer tu contraseña en Daem Tech Solutions
        
        Hola ${user.name},
        
        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.
        
        Tu código de verificación es: ${user.token}
        
        Este código expirará en 10 minutos.
        
        También puedes visitar este enlace para restablecer tu contraseña: ${process.env.REACT_APP_FRONTEND_URL}/auth/new-password
        
        Si no solicitaste este cambio, puedes ignorar este mensaje, tu cuenta está segura.
        
        Atentamente,
        El equipo de Daem Tech Solutions
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      if (process.env.NODE_ENV === 'development') {
        console.log('Password reset email sent successfully:', info.messageId);
      }
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error sending password reset email:', error);
      } else {
        console.error('Error sending password reset email:', error.message);
      }
      return { success: false, error };
    }
  };
}
