import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// 🔧 caminho da pasta public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

// rota teste
app.get("/api", (req, res) => {
  res.send("API rodando 🚀");
});

// 🔥 ROTA IA
app.post("/gerar", async (req, res) => {

  const { prompt } = req.body;

  try {

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: "512x512" // ⚡ mais rápido
      })
    });

    const data = await response.json();

    console.log(data);

    const imagem = data?.data?.[0]?.url;

    if (!imagem) {
      return res.status(500).json({ error: "Erro ao gerar imagem", data });
    }

    res.json({ url: imagem });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro servidor" });
  }

});

// 🔥 SERVE SITE
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("servidor rodando"));