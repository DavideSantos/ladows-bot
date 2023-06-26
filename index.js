// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits } = require("discord.js");
// variabili dei token del bot
require("dotenv").config();
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.CLIENT_ID;

const { loadEvents } = require("./Handlers/eventHandler");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// Log in to Discord with your client's token
client.login(TOKEN).then(() => {
  loadEvents(client);
});
