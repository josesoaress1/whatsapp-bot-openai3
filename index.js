require('dotenv').config();
const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL;

app.post('/webhook/receber', async (req, res) => {
  const body = req.body;
  const numero = body.numero || body.from;
  const mensagem = body.mensagem || body.body;

  console.log('Mensagem recebida:', mensagem);

  try {
    const chatResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Você é um atendente simpático de uma loja de produtos naturais.' },
          { role: 'user', content: mensagem }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const resposta = chatResponse.data.choices[0].message.content;

    await axios.post(WHATSAPP_API_URL, {
      phone: numero,
      message: resposta
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('Erro ao processar mensagem:', error.response?.data || error.message);
    res.sendStatus(500);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
