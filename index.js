// Require the necessary discord.js classes
const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} = require("discord.js");
const fs = require("node:fs");
const path = require("node:path");
// variabili dei token del bot
require("dotenv").config();
const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
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
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

// Global error handling
process.on("unhandledRejection", (error) => {
  console.error("Errore non gestito:", error);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    try {
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content:
            "Si è verificato un errore durante l'esecuzione del comando.",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content:
            "Si è verificato un errore durante l'esecuzione del comando.",
          ephemeral: true,
        });
      }
    } catch (e) {
      console.error("Errore nel gestire l'errore:", e);
    }
  }
});

// Rimuovere la funzione deployCommands() completamente

// Modificare il login per usare solo loadCommands
client.login(TOKEN).then(() => {
  loadEvents(client);
  loadCommands(client);
});
