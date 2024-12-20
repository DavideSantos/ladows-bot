require("dotenv").config();
const { REST, Routes } = require("discord.js");

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Pulizia sincrona di entrambi i tipi di comandi
(async () => {
  try {
    console.log("Inizio pulizia comandi...");

    // Rimuove i comandi globali
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
      body: [],
    });
    console.log("✅ Comandi globali rimossi");

    // Rimuove i comandi della guild
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: [] }
    );
    console.log("✅ Comandi guild rimossi");

    console.log("Pulizia completata con successo!");
  } catch (error) {
    console.error("Errore durante la pulizia:", error);
  }
})();
