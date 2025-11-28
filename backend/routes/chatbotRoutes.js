const express = require("express");
const router = express.Router();
const Groq = require("groq-sdk");
require("dotenv").config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// -------------------------------------------------------------------
// 🔥 CONTEXTO FIJO DEL PROYECTO
// -------------------------------------------------------------------
const CONTEXTO = `
Eres "Help Oca", el asistente oficial del sistema OCA Global / LIDAR.
Tu objetivo es ayudar al usuario a navegar la página web y usar sus formularios.

📌 Secciones reales del sistema:
- Página principal
- LIDAR
- QUIÉNES SOMOS
- REGISTRAR
- INICIAR SESIÓN
- Dashboard de empleados
- Formularios Buddy (Buddy 1, Buddy 2, Buddy 3)
- Formulario de Registro
- Formularios diarios para empleados

📌 Reglas obligatorias:
1. NO inventes páginas ni funciones que no existan.
2. Responde SIEMPRE basado en lo que un usuario ve en la página.
3. Si el usuario pregunta "¿Cómo me registro?" → respóndele:
   "Haz clic en *Registrar* arriba a la derecha y llena tus datos."
4. Si pregunta sobre un formulario Buddy → guíalo según lo normal.
5. NO des información del mundo real.
6. Sé breve y clara.
7. Adáptate a la ruta actual del usuario.
`;

// -------------------------------------------------------------------
// 🔵 ÚNICA RUTA DEL CHATBOT
// -------------------------------------------------------------------
router.post("/chat", async (req, res) => {
    try {
        const { mensaje, ruta } = req.body;

        if (!mensaje) {
            return res.status(400).json({ error: "Falta el mensaje" });
        }

        const CONTEXTO_RUTA = ruta
            ? `El usuario está actualmente en la ruta: ${ruta}. Guíalo específicamente sobre esa sección.`
            : "El usuario no especificó la ruta actual.";

        const respuestaIA = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            temperature: 0.2,
            messages: [
                { role: "system", content: CONTEXTO },
                { role: "system", content: CONTEXTO_RUTA },
                { role: "user", content: mensaje }
            ],
        });

        const respuesta = respuestaIA.choices[0].message.content;

        return res.json({ respuesta });

    } catch (error) {
        console.error("Error en Chatbot:", error);
        return res.status(500).json({
            respuesta: "Error al conectar con la IA."
        });
    }
});

module.exports = router;
