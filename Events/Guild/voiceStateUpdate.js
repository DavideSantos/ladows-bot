const { Events, AuditLogEvent } = require("discord.js");

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    // Se l'utente è stato disconnesso
    if (oldState.channel && !newState.channel) {
      // Attendi per il log di audit
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const auditLogs = await oldState.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberDisconnect,
        limit: 1,
      });

      const disconnectLog = auditLogs.entries.first();

      if (disconnectLog && disconnectLog.createdTimestamp > Date.now() - 5000) {
        const logChannel = oldState.guild.channels.cache.get(
          "1319273431606497340"
        ); // Sostituisci con l'ID del tuo canale privato

        if (logChannel) {
          logChannel.send({
            content: `🔴 **Disconnessione Forzata**\n${disconnectLog.executor.tag} ha disconnesso ${oldState.member.user.tag} dal canale ${oldState.channel.name}`,
          });
        }
      }
    }
  },
};
