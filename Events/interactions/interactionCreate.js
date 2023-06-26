const { CommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  execute(interaction, client) {
    if (!interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        interaction.reply({ content: "outdated command" });
      }

      command.execute(interaction, client);
    } else if (interaction.isButton()) {
      const role = interaction.guild.roles.cache.get("1122988315273068707");
      return interaction.member.role.add(role).then((member) =>
        interaction.reply({
          content: `${role} ti e stato assegnato`,
          ephemeral: true,
        })
      );
    } else {
      return;
    }
  },
};
