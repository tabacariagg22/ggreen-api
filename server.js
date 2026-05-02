import express from "express";
import fetch from "node-fetch";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.post("/gerar", async (req, res) => {

  const prompt = req.body.prompt || "streetwear t-shirt design";

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

    const base64 = data.data[0].b64_json;
    const url = "data:image/png;base64," + base64;

    res.json({ url });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }

});

app.listen(3000, () => console.log("Servidor rodando"));