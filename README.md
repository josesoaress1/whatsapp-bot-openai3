# WhatsApp Bot com OpenAI (ChatGPT)

Este é um webhook simples que conecta o WhatsApp com a API do ChatGPT usando Z-API.

## Como usar

1. Configure seu arquivo `.env` com:
   - `OPENAI_API_KEY` com sua chave da OpenAI
   - `WHATSAPP_API_URL` com a URL da instância Z-API

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
node index.js
```

4. No Z-API, configure o webhook "Ao receber" com:
```
https://seu-bot.onrender.com/webhook/receber
```

Pronto!
