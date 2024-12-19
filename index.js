// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require("discord.js");
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
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();

// Global error handling
process.on("unhandledRejection", (error) => {
  console.error("Errore non gestito:", error);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
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

// function before client.login
async function deployCommands() {
  try {
    const commands = [];
    const foldersPath = path.join(__dirname, "Commands");
    const commandFolders = fs.readdirSync(foldersPath);

    for (const folder of commandFolders) {
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
          commands.push(command.data.toJSON());
        }
      }
    }

    const rest = new REST().setToken(TOKEN);
    console.log(`Iniziando il refresh di ${commands.length} (/) comandi.`);

    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: commands,
    });

    console.log("Comandi registrati con successo.");
  } catch (error) {
    console.error("Errore durante il deploy dei comandi:", error);
  }
}

// Modify client.login to include command deployment
client.login(TOKEN).then(async () => {
  await deployCommands();
  loadEvents(client);
  loadCommands(client);
});
