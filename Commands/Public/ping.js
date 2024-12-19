const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Mostra la latenza del bot"),
  async execute(interaction) {
    await interaction.reply("🏓 Pong!");
  },
};
