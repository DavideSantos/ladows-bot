const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Mostra la latenza del bot"),
  async execute(interaction) {
    const sent = await interaction.reply({
      content: "Calcolo ping...",
      fetchReply: true,
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;

    await interaction.editReply({
      content: `🏓 Pong!\nLatenza bot: ${latency}ms\nLatenza API: ${interaction.client.ws.ping}ms`,
    });
  },
};
