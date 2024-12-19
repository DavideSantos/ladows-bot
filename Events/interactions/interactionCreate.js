const { CommandInteraction } = require("discord.js");

module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    // Handling slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        return interaction.reply({
          content: "Comando non trovato o obsoleto",
          ephemeral: true,
        });
      }

      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Si è verificato un errore durante l'esecuzione del comando",
          ephemeral: true,
        });
      }
    }

    // Handling buttons
    else if (interaction.isButton()) {
      const role = interaction.guild.roles.cache.get("1122988315273068707");
      if (!role) return;

      try {
        await interaction.member.roles.add(role);
        await interaction.reply({
          content: `Il ruolo ${role.name} ti è stato assegnato`,
          ephemeral: true,
        });
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: "Non sono riuscito ad assegnare il ruolo",
          ephemeral: true,
        });
      }
    }
  },
};
