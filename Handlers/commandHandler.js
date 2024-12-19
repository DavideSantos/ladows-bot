function loadCommands(client) {
  const ascii = require("ascii-table");
  const fs = require("fs");
  const table = new ascii().setHeading("Commands", "Category", "Status");

  let commandsArray = [];

  const commandsFolder = fs.readdirSync("./Commands/");

  for (const folder of commandsFolder) {
    const commandFiles = fs
      .readdirSync(`./Commands/${folder}`)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const commandFile = require(`../Commands/${folder}/${file}`);

      commandFile.category = folder;

      client.commands.set(commandFile.data.name, commandFile);

      commandsArray.push(commandFile.data.toJSON());

      table.addRow(file, folder, "loaded");
      continue;
    }
  }

  client.application.commands.set(commandsArray);

  return console.log(table.toString(), "\n Loaded Commands");
}

module.exports = { loadCommands };
