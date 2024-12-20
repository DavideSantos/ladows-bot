require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const keep_alive = require("./Handlers/keep_alive");
const { loadEvents } = require("./Handlers/eventHandler");
const { loadCommands } = require("./Handlers/commandHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

process.on("unhandledRejection", (error) => {
  console.error("Errore non gestito:", error);
});

client
  .login(process.env.DISCORD_TOKEN)
  .then(async () => {
    await loadEvents(client);
    await loadCommands(client);
  })
  .catch(console.error);
