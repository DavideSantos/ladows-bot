const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clearcommands")
    .setDescription("Pulisce tutti i comandi del bot")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction, client) {
    await interaction.deferReply({ ephemeral: true });

    try {
      // Pulisce i comandi
      await client.application.commands.set([]);
      await interaction.guild.commands.set([]);

      // Ricarica i comandi
      await require("../../Handlers/commandHandler").loadCommands(client);

      await interaction.editReply("Comandi puliti e ricaricati con successo!");
    } catch (error) {
      console.error(error);
      await interaction.editReply("Errore durante la pulizia dei comandi.");
    }
  },
};
