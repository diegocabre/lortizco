require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const nodemailer = require("nodemailer");
const twilio = require("twilio");
const { body, validationResult } = require("express-validator");

// Configuración del servidor Express
const app = express();
const port = process.env.PORT || 3000;

// Configuración de la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Conexión a la base de datos
pool.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos:", err);
    return;
  }
  console.log("Conectado a la base de datos");
});

// Middleware para habilitar CORS
app.use(cors());

// Middleware para analizar solicitudes JSON y codificadas en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Configuración de Twilio
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Función para enviar correo electrónico
const sendWelcomeEmail = (email, nombre) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Bienvenido a Nuestro Servicio",
    html: `
      <div style="text-align: center;">
        <img src="../client/public/Luis ortíz.png" alt="Logo de la Empresa" style="width: 150px; height: auto;"/>
        <h1>Bienvenido a Nuestro Servicio</h1>
        <p>Hola ${nombre},</p>
        <p>Gracias por contactarnos. Estamos felices de tenerte con nosotros.</p>
        <p>Visita nuestro sitio web para más información:</p>
        <a href="https://www.tu-sitio.com" style="display: inline-block; margin: 10px 0; padding: 10px 20px; color: white; background-color: #007bff; text-decoration: none; border-radius: 5px;">Ir a nuestro sitio web</a>
        <p>Saludos,<br>El equipo</p>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error al enviar el correo:", error);
    } else {
      console.log("Correo enviado:", info.response);
    }
  });
};

// Función para enviar mensaje de WhatsApp
const sendWhatsAppMessage = (telefono, nombre) => {
  client.messages
    .create({
      body: `Hola, el cliente ${nombre} ha contactado con nosotros por la página web.`,
      from: "whatsapp:+14155238886", // Número de WhatsApp de Twilio
      to: `whatsapp:${"+56947637541"}`,
    })
    .then((message) => console.log("Mensaje de WhatsApp enviado:", message.sid))
    .catch((error) =>
      console.error("Error al enviar el mensaje de WhatsApp:", error)
    );
};

// Ruta para manejar el formulario de contacto
app.post(
  "/contacto",
  [
    body("nombre")
      .matches(/^[a-zA-ZÀ-ÿ\s]+$/)
      .withMessage("El nombre solo puede contener letras, espacios y acentos."),
    body("email").isEmail().withMessage("Debe ser un email válido."),
    body("telefono")
      .matches(/^\+569\d{8}$/)
      .withMessage("El teléfono debe tener el formato +56912345678."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { nombre, email, telefono, mensaje } = req.body;

    try {
      // Verificar si el correo o el teléfono ya existen en la base de datos
      const result = await pool.query(
        "SELECT * FROM contactos WHERE email = $1 OR telefono = $2",
        [email, telefono]
      );

      if (result.rows.length > 0) {
        res.status(200).send({
          message: "El usuario ya ha enviado un mensaje",
          success: false,
        });
      } else {
        await pool.query(
          "INSERT INTO contactos (nombre, email, telefono, mensaje) VALUES ($1, $2, $3, $4)",
          [nombre, email, telefono, mensaje]
        );

        // Enviar correo de bienvenida
        console.log("Enviando correo de bienvenida a:", email);
        sendWelcomeEmail(email, nombre);

        // Enviar mensaje de WhatsApp
        console.log("Enviando mensaje de WhatsApp a:", telefono);
        sendWhatsAppMessage(telefono, nombre);

        res
          .status(201)
          .send({ message: "Datos guardados correctamente", success: true });
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      res.status(500).send("Ocurrió un error al guardar los datos");
    }
  }
);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
