const { Events, ActivityType } = require("discord.js");

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client) {
    console.log(`${client.user.tag} è online!`);

    // Set the Rich Presence
    client.user.setPresence({
      activities: [
        {
          name: "la community",
          type: ActivityType.Watching,
        },
      ],
      status: "online",
    });

    // Update the Rich Presence every 10 minutes with different statuses
    setInterval(() => {
      const activities = [
        {
          name: "la community",
          type: ActivityType.Watching,
        },
        {
          name: "i comandi",
          type: ActivityType.Listening,
        },
        {
          name: "/help",
          type: ActivityType.Playing,
        },
      ];

      const activity =
        activities[Math.floor(Math.random() * activities.length)];
      client.user.setPresence({
        activities: [activity],
        status: "online",
      });
    }, 600000); // 10 minutes
  },
};
