const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const axios = require("axios");
const OpenAI = require("openai");

dotenv.config();
const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(bodyParser.json());

app.post("/webhook/receive", async (req, res) => {
  const message = req.body.message?.text?.body || "Mensagem não encontrada";
  const number = req.body.message?.from;

  if (!message || !number) return res.sendStatus(400);

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = response.choices[0].message.content;

    await axios.post(`${process.env.WHATSAPP_API_URL}`, {
      phone: number,
      message: reply,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao processar:", error.message);
    res.sendStatus(500);
  }
});

app.listen(10000, () => console.log("Servidor rodando na porta 10000"));
