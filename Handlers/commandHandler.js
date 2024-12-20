async function loadCommands(client) {
  const ascii = require("ascii-table");
  const fs = require("fs");
  const table = new ascii().setHeading("Commands", "Category", "Status");

  let commandsArray = [];

  // Clear existing commands first
  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (!guild) {
    console.error("Guild non trovata!");
    return;
  }

  // Clear all existing guild commands
  await guild.commands.set([]);

  // Clear the collection
  client.commands.clear();

  const commandsFolder = fs.readdirSync("./Commands/");

  for (const folder of commandsFolder) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      try {
        delete require.cache[require.resolve(`../Commands/${folder}/${file}`)];
        const commandFile = require(`../Commands/${folder}/${file}`);

        if (!commandFile.data || !commandFile.execute) {
          table.addRow(file, folder, "❌ Invalid");
          continue;
        }

        commandFile.category = folder;
        const commandName = commandFile.data.name;

        client.commands.set(commandName, commandFile);
        commandsArray.push(commandFile.data.toJSON());
        table.addRow(file, folder, "✅ Valid");
      } catch (error) {
        console.error(`Error loading command ${file}:`, error);
        table.addRow(file, folder, "❌ Error");
      }
    }
  }

  if (commandsArray.length > 0) {
    try {
      // Registra SOLO i comandi guild
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      if (!guild) {
        throw new Error("Guild non trovata!");
      }

      const data = await guild.commands.set(commandsArray);
      console.log(`🔰 Registrati ${data.size} comandi nella guild`);
      console.log(table.toString());
    } catch (error) {
      console.error("Errore nella registrazione dei comandi:", error);
    }
  }
}

module.exports = { loadCommands };
