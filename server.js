import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/gerar", async (req, res) => {

  const { prompt } = req.body;

  try {

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: "1024x1024"
      })
    });

    const data = await response.json();

    // 🔥 CORREÇÃO PRINCIPAL
    const imagem = data?.data?.[0]?.url;

    if (!imagem) {
      return res.status(500).json({ error: "Erro ao gerar imagem" });
    }

    // 👉 agora envia do jeito que o front espera
    res.json({ url: imagem });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Erro na API" });

  }

});

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
