const { EmbedBuilder } = require("@discordjs/builders");
const { GuildMember, Embed } = require("discord.js");

module.exports = {
  name: "guildMemberAdd",
  execute(member) {
    const { user, guild } = member;
    const welcomeChannel =
      member.guild.channels.cache.get("665168439261921290"); //* qui da inserire l'id del canale testuale dove si deve mandare l'embed
    const welcomeMessage = `Benvenuto <@${member.id}> nel discord di Ladows`;
    const memberRole = "254601565430743041";

    const welcomeEmbed = new EmbedBuilder()
      .setAuthor({
        name: member.user.username,
        iconURL: member.user.displayAvatarURL(),
      })
      .setDescription(welcomeMessage)
      .setThumbnail(member.user.displayAvatarURL())
      .addFields({
        name: "Ottieni i tuoi ruoli qui:",
        value: "<#832004980105281597>",
      })
      .setImage(
        "https://cdn.discordapp.com/attachments/1116776282160644106/1176282460959559753/trapezio.gif?ex=6626df68&is=66146a68&hm=567d3ae250cc204c5d18b0865943a06de5387a30d973f5b7a6645491a7b0e71e&"
      )
      .setColor(0x037821)
      .addFields({ name: "Membri Totali", value: `${guild.memberCount}` })
      .setTimestamp();

    welcomeChannel.send({ embeds: [welcomeEmbed] });
    member.roles.add(memberRole);
  },
};
