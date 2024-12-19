function loadCommands(client) {
  const ascii = require("ascii-table");
  const fs = require("fs");
  const table = new ascii().setHeading("Commands", "Category", "Status");

  let commandsArray = [];

  // Clear the existing commands collection
  client.commands.clear();

  const commandsFolder = fs.readdirSync("./Commands/");

  for (const folder of commandsFolder) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandFile = require(`../Commands/${folder}/${file}`);

      // Remove the command cache to avoid duplicates
      delete require.cache[require.resolve(`../Commands/${folder}/${file}`)];

      commandFile.category = folder;
      const commandName = commandFile.data.name;

      client.commands.set(commandName, commandFile);
      commandsArray.push(commandFile.data.toJSON());
      table.addRow(file, folder, "loaded");
    }
  }

  // Update global commands
  client.application.commands
    .set(commandsArray)
    .then(() => {
      console.log(table.toString(), "\nComandi caricati con successo");
    })
    .catch((error) => {
      console.error("Errore durante il caricamento dei comandi:", error);
    });
}

module.exports = { loadCommands };
