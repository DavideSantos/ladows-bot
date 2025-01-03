const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const config = require("../../config.json");

class TwitchNotifier {
  #client;
  #config;
  #accessToken;
  #checkInterval;
  #streamStatus = new Map();

  constructor(client, config) {
    this.#client = client;
    this.#config = config;
  }

  async start() {
    try {
      await this.#authenticate();
      this.#startMonitoring();
      console.log(
        `Sistema di notifiche Twitch avviato con successo per ${
          this.#config.twitch.channels.length
        } canali`
      );
    } catch (error) {
      console.error(
        "Errore durante l'avvio del sistema di notifiche Twitch:",
        error
      );
    }
  }

  stop() {
    if (this.#checkInterval) {
      clearInterval(this.#checkInterval);
      this.#checkInterval = null;
    }
  }

  async #authenticate() {
    try {
      const authResponse = await axios.post(
        "https://id.twitch.tv/oauth2/token",
        new URLSearchParams({
          client_id: this.#config.twitch.clientId,
          client_secret: this.#config.twitch.clientSecret,
          grant_type: "client_credentials",
        })
      );

      this.#accessToken = authResponse.data.access_token;
    } catch (error) {
      console.error("Errore di autenticazione Twitch:", error);
      throw error;
    }
  }

  async #checkStreams() {
    try {
      const channelNames = this.#config.twitch.channels.map((ch) => ch.name);
      const query = channelNames.join("&user_login=");

      const response = await axios.get(
        `https://api.twitch.tv/helix/streams?user_login=${query}`,
        {
          headers: {
            Authorization: `Bearer ${this.#accessToken}`,
            "Client-Id": this.#config.twitch.clientId,
          },
        }
      );

      const liveStreams = new Map(
        response.data.data.map((stream) => [stream.user_login, stream])
      );

      for (const channel of this.#config.twitch.channels) {
        const streamData = liveStreams.get(channel.name);
        const wasLive = this.#streamStatus.get(channel.name);
        const isLive = Boolean(streamData);

        if (!wasLive && isLive) {
          await this.#sendLiveNotification(
            streamData,
            channel.discordChannelId
          );
        }

        this.#streamStatus.set(channel.name, isLive);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        await this.#authenticate();
      } else {
        console.error("Errore durante il controllo degli stream:", error);
      }
    }
  }

  async #sendLiveNotification(streamData, discordChannelId) {
    const channel = await this.#client.channels.fetch(discordChannelId);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setColor("#9146FF")
      .setTitle(`🔴 ${streamData.user_name} è in diretta!`)
      .setURL(`https://twitch.tv/${streamData.user_login}`)
      .setDescription(streamData.title || "Nessun titolo")
      .addFields(
        {
          name: "🎮 Categoria",
          value: streamData.game_name || "Nessuna categoria",
          inline: true,
        },
        {
          name: "👥 Spettatori",
          value: streamData.viewer_count.toString(),
          inline: true,
        }
      )
      .setImage(
        streamData.thumbnail_url
          ?.replace("{width}", "1280")
          .replace("{height}", "720")
      )
      .setTimestamp()
      .setFooter({ text: "Twitch Notification" });

    try {
      await channel.send({
        content: "# 📢 Nuova diretta su Twitch!",
        embeds: [embed],
      });
    } catch (error) {
      console.error("Errore nell'invio della notifica:", error);
    }
  }

  #startMonitoring() {
    this.#checkStreams();
    this.#checkInterval = setInterval(
      () => this.#checkStreams(),
      this.#config.twitch.checkInterval
    );
  }
}

module.exports = {
  name: "ready",
  once: true,
  async execute(client) {
    try {
      const twitchNotifier = new TwitchNotifier(client, config);
      await twitchNotifier.start();
      console.log("Sistema di notifiche Twitch inizializzato");
    } catch (error) {
      console.error("Errore nell'inizializzazione del sistema Twitch:", error);
    }
  },
};
