const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Mostra tutti i comandi disponibili"),

  async execute(interaction, client) {
    const commands = client.commands;
    const embed = new EmbedBuilder()
      .setTitle("💫 Lista Comandi")
      .setColor("#2F3136")
      .setDescription("Ecco la lista di tutti i comandi disponibili:")
      .setThumbnail(client.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({
        text: interaction.guild.name,
        iconURL: interaction.guild.iconURL(),
      });

    // Group commands by category
    const categories = {};
    commands.forEach((cmd) => {
      const category = cmd.category || "Altro";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push(cmd);
    });

    // Add each category to the embed
    for (const [category, cmds] of Object.entries(categories)) {
      const commandList = cmds
        .map(
          (cmd) =>
            `> \`/${cmd.data.name}\`\n> ${
              cmd.data.description || "Nessuna descrizione"
            }`
        )
        .join("\n\n");

      embed.addFields({
        name: `${category.toUpperCase()} [${cmds.length}]`,
        value: commandList,
        inline: false,
      });
    }

    await interaction.reply({ embeds: [embed] });
  },
};
