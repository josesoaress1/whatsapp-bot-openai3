const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

app.post("/webhook/receive", async (req, res) => {
  try {
    const message = req.body?.text?.message;
    const number = req.body?.phone;

    if (!message || !number) {
      console.log("Mensagem ou número não detectado.");
      console.log("Corpo completo recebido:", req.body);
      return res.sendStatus(400);
    }

    console.log(`✅ Mensagem recebida de ${number}: ${message}`);

    // Requisição para OpenAI com gpt-3.5-turbo
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resposta = openaiResponse.data.choices[0].message.content.trim();
    console.log(`🤖 Resposta gerada: ${resposta}`);

    // Envia mensagem via API do WhatsApp
    await axios.post(process.env.WHATSAPP_API_URL, {
      phone: number,
      message: resposta,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("❗ Erro ao processar a mensagem:", error.response?.data || error.message);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
