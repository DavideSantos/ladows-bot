const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Mostra tutti i comandi disponibili"),
  category: "Info",
  async execute(interaction, client) {
    if (!client?.commands) {
      console.error("client.commands non è inizializzato");
      return await interaction.reply({
        content: "Comando non disponibile al momento.",
        ephemeral: true,
      });
    }

    try {
      await interaction.deferReply();

      const embed = new EmbedBuilder()
        .setTitle("💫 Lista Comandi")
        .setColor("#2F3136")
        .setDescription("Ecco la lista di tutti i comandi disponibili:")
        .setThumbnail(client.user.displayAvatarURL())
        .setTimestamp();

      // Check if the guild is available
      if (interaction.guild) {
        embed.setFooter({
          text: interaction.guild.name,
          iconURL: interaction.guild.iconURL() || undefined,
        });
      }

      const categories = {};

      // Check if client.commands exists and has commands
      if (!client.commands || client.commands.size === 0) {
        return await interaction.editReply(
          "Nessun comando disponibile al momento."
        );
      }

      client.commands.forEach((cmd) => {
        const category = cmd.category || "Altro";
        if (!categories[category]) {
          categories[category] = [];
        }
        categories[category].push(cmd);
      });

      for (const [category, cmds] of Object.entries(categories)) {
        const commandList = cmds
          .map(
            (cmd) =>
              `> \`/${cmd.data.name}\`\n> ${
                cmd.data.description || "Nessuna descrizione"
              }`
          )
          .join("\n\n");

        if (commandList) {
          embed.addFields({
            name: `${category.toUpperCase()} [${cmds.length}]`,
            value: commandList,
            inline: false,
          });
        }
      }

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error("Errore nel comando help:", error);

      // If the reply has not been sent yet
      if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({
          content:
            "Si è verificato un errore durante l'esecuzione del comando.",
          ephemeral: true,
        });
      } else {
        await interaction.editReply({
          content:
            "Si è verificato un errore durante l'esecuzione del comando.",
          ephemeral: true,
        });
      }
    }
  },
};
