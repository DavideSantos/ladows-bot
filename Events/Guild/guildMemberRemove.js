const { execute } = require("./guildMemberAdd");

module.exports = {
  name: "guildMemberRemove",
  execute(member) {
    member.guild.channels.cache
      .get("665168439261921290")
      .send(`<@${member.id}> ha lasciato il server!`);
  },
};
