const {
  SlashCommandBuilder,
  CommandInteraction,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("pong!")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), //permesso settato solo per administratori
  execute(interaction) {
    interaction.reply({ content: "Pong", ephemeral: true }); //settato ephemeral su true il messaggio e visibile solo a te
  },
};
