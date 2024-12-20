const { Events } = require("discord.js");

module.exports = {
  name: Events.PresenceUpdate,
  async execute(oldPresence, newPresence) {
    // Lista degli ID degli utenti da monitorare
    const allowedUsers = ["370643710205231104", "545941491789332481"];
    // Lista degli ID dei ruoli da monitorare
    const allowedRoles = ["665194419950977024", "792493584132735016"];

    // Controlla se l'utente è nella lista o ha uno dei ruoli permessi
    const isAllowedUser = allowedUsers.includes(newPresence.userId);
    const hasAllowedRole = newPresence.member.roles.cache.some((role) =>
      allowedRoles.includes(role.id)
    );

    if (!isAllowedUser && !hasAllowedRole) return;

    const oldGame = oldPresence?.activities.find(
      (activity) => activity.type === 0
    );
    const newGame = newPresence?.activities.find(
      (activity) => activity.type === 0
    );

    // Giochi da monitorare
    const gamesOfInterest = [
      "Apex Legends",
      "Fortnite",
      "League of Legends",
      "Valorant",
      "Escape from Tarkov",
    ];

    if (newGame && !oldGame) {
      try {
        if (newGame.name === "Escape from Tarkov") {
          await newPresence.member.send({
            content: "Nikita è sempre il daddy! OPACHKI! 🔫",
          });
        } else if (gamesOfInterest.includes(newGame.name)) {
          await newPresence.member.send({
            content: `Lota, ho visto che stai giocando a ${newGame.name}!, chiudilo prima che ti becchi un ban!`,
          });
        }
      } catch (error) {
        console.error("Non posso inviare DM a questo utente");
      }
    }
  },
};
