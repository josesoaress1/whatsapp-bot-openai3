const express = require("express");
const axios = require("axios");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Configuração da OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Rota principal (opcional)
app.get("/", (req, res) => {
  res.send("Bot do WhatsApp com OpenAI está rodando!");
});

// Webhook para mensagens recebidas
app.post("/webhook/receive", async (req, res) => {
  try {
    const message = req.body.message?.body;
    const number = req.body.message?.from;

    if (!message || !number) {
      return res.status(400).send("Mensagem inválida.");
    }

    console.log(`Mensagem recebida de ${number}: ${message}`);

    // Gera resposta com OpenAI
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.data.choices[0].message.content;

    // Envia resposta para o WhatsApp
    await axios.post(process.env.WHATSAPP_API_URL, {
      phone: number,
      message: reply,
    });

    res.sendStatus(200);
  } catch (error) {
    console.error("Erro ao processar a mensagem:", error.message);
    res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
