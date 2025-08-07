const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // postavi svoj API key kao env varijablu
});
const openai = new OpenAIApi(configuration);

// API endpoint
app.post('/generate', async (req, res) => {
  const { idea } = req.body;

  if (!idea) {
    return res.status(400).json({ error: 'No idea provided' });
  }

  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Generate 3 catchy, viral YouTube titles based on the idea: "${idea}"`,
      temperature: 0.8,
      max_tokens: 100,
      n: 1,
    });

    const titles = response.data.choices[0].text.trim().split('\n').filter(Boolean);
    res.json({ titles });
  } catch (error) {
    console.error('OpenAI Error:', error);
    res.status(500).json({ error: 'Failed to generate titles' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
