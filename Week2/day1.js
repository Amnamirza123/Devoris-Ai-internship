require('dotenv').config();
const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
});

async function main() {
  const response = await client.chat.completions.create({
    model: 'inclusionai/ling-3.0-flash:free',
    messages: [
       
      { role : 'system', content: 'you are a senior developer, with great mentorship skills.'} ,
      { role: 'user', content: 'Explain what a REST API is in one sentence.' }
    ],
  });

  console.log(response.choices[0].message.content);
}

main();