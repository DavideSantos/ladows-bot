require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");
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

async function clearCommands() {
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);
  try {
    console.log("Pulizia comandi...");
    // Rimuove comandi globali
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });
    // Rimuove comandi guild
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: [] }
    );
    console.log("Pulizia completata!");
  } catch (error) {
    console.error("Errore pulizia:", error);
  }
}

async function initialize() {
  try {
    await clearCommands(); // Aggiunto qui
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
