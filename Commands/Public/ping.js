const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Mostra la latenza del bot"),
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const ping = interaction.client.ws.ping;
      await interaction.editReply(`🏓 Pong!\nLatenza: ${ping}ms`);
    } catch (error) {
      console.error("Errore nel comando ping:", error);
      await interaction.reply({
        content: "Si è verificato un errore durante l'esecuzione del comando.",
        ephemeral: true,
      });
    }
  },
};
