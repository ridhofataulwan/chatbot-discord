import dotenv from 'dotenv';
import discord from 'discord.js';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const client = new discord.Client({
  intents: [discord.GatewayIntentBits.Guilds, discord.GatewayIntentBits.GuildMessages, discord.GatewayIntentBits.MessageContent],
});

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
  console.log(`Received message from ${message.author.tag}: ${message.content}`);

  if (message.author.bot) return;

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: `${message.content}`,
    max_tokens: 1000,
    temperature: 0.2,
  });
  message.reply(`${response.data.choices[0].text}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
