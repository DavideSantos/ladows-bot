const { EmbedBuilder } = require("@discordjs/builders");
const { GuildMember, Embed } = require("discord.js");

module.exports = {
  name: "guildMemberRemove",
  execute(member) {
    const canaleDiscordUfficiale = "665168439261921290"; //* id canale welcome del discord ufficiale
    const canaleDiscordDiProva = "1229841317991809058"; //* id canale discord di prova

    const { user, guild } = member;
    const welcomeChannel = member.guild.channels.cache.get(
      canaleDiscordUfficiale
    ); //* qui da inserire l'id del canale testuale dove si deve mandare l'embed
    const welcomeMessage = `<@${member.id}> Si propr na lota!`;

    const welcomeEmbed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setDescription(welcomeMessage)
      .setThumbnail(member.user.displayAvatarURL())
      .setImage(
        "https://i.pinimg.com/originals/ba/36/c2/ba36c27fdc4dba0db46833c008c0b519.gif"
      )
      .setColor(0x037821)
      .addFields({ name: "Membri Totali", value: `${guild.memberCount}` })
      .setTimestamp();

    welcomeChannel.send({ embeds: [welcomeEmbed] });
  },
};
