function loadCommands(client) {
  const ascii = require("ascii-table");
  const fs = require("fs");
  const table = new ascii().setHeading("Commands", "Category", "Status");

  let commandsArray = [];

  // Clear the collection before reloading
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
    return client.application.commands
      .set(commandsArray)
      .then(() => {
        console.log(table.toString(), "\nComandi registrati con successo");
      })
      .catch(console.error);
  }
}

module.exports = { loadCommands };
