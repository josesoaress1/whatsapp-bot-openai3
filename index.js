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
    console.log("📩 Corpo completo recebido:", JSON.stringify(req.body, null, 2));

    // Corrigido de acordo com estrutura da Z-API
    const message = req.body?.text?.message;
    const number = req.body?.phone;

    if (!message || !number) {
      console.log("❌ Mensagem ou número não detectado.");
      return res.sendStatus(400);
    }

    console.log(`✅ Mensagem recebida de ${number}: ${message}`);

    // Requisição para OpenAI
    const openaiResponse = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: message,
        max_tokens: 100,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resposta = openaiResponse.data.choices[0].text.trim();
    console.log(`🤖 Resposta gerada: ${resposta}`);

    // Envia resposta via WhatsApp (Z-API)
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
