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
      .setTitle("**Nuovo Membro!**")
      .setDescription(welcomeMessage)
      .setColor(0x037821)
      .addFields({ name: "Membri Totali", value: `${guild.memberCount}` })
      .setTimestamp();

    welcomeChannel.send({ embeds: [welcomeEmbed] });
    member.roles.add(memberRole);
  },
};
