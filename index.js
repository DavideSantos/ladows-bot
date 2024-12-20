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

async function initialize() {
  try {
    await client.login(process.env.DISCORD_TOKEN);
    console.log("Bot logged in");

    await loadEvents(client);
    console.log("Eventi caricati");

    await loadCommands(client);
    console.log("Comandi caricati");
  } catch (error) {
    console.error("Errore durante l'inizializzazione:", error);
  }
}

initialize();
