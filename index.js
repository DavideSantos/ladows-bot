// Require the necessary discord.js classes
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");
// variabili dei token del bot
require("dotenv").config();
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.CLIENT_ID;
const keep_alive = require("./Handlers/keep_alive");

const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences, // Aggiungi questo
  ],
});

client.commands = new Collection();

// Log in to Discord with your client's token
client.login(TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
});
