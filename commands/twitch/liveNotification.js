require('dotenv').config();
const discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'live',
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<Your channel name>',
	execute: async (message, args) => {
		const clientID = process.env.TWITCHCLIENTID;
		const clientSecret = process.env.TWITCHCLIENTSECRET;
		const streamer = args[0].toString();

		const twitchEmbed = new discord.MessageEmbed();

		fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`,
			{
				method: 'POST',
			},
		)
			.then((res) => res.json())
			.then((data) => {
				const authToken = data.access_token;

				fetch(`https://api.twitch.tv/helix/search/channels?query=${streamer}`, {
					method: 'GET',
					headers: {
						'CLIENT-ID': clientID,
						Authorization: 'Bearer ' + authToken,
					},
				})
					.then((x) => x.json())
					.then((x) => {
						if (!x.data) {
							return message.reply(
								`The Twitch-Channel ${streamer} does not exist!`,
							);
						}

						const broadcaster = x.data.filter(
							(filter) =>
								filter.display_name.toLowerCase() === streamer.toLowerCase(),
						)[0];
						let gameName = '';
						let streamStart = new Date(broadcaster.started_at);
						streamStart = `${streamStart.getDate()}.${streamStart.getMonth()}.${streamStart.getFullYear()}, ${streamStart.getHours()}:${streamStart.getMinutes()}`;

						fetch(`https://api.twitch.tv/helix/games?id=${broadcaster.game_id}`,
							{
								method: 'GET',
								headers: {
									'CLIENT-ID': clientID,
									Authorization: 'Bearer ' + authToken,
								},
							},
						)
							.then((gameInfo) => gameInfo.json())
							.then((gameInfo) => {
								try {
									gameName = gameInfo.data[0].name;
									twitchEmbed.setAuthor(
										`${broadcaster.display_name} is live on twitch!`,
										broadcaster.thumbnail_url,
									);
									twitchEmbed.setColor(0x6441a5);
									twitchEmbed.setTitle(broadcaster.title);
									twitchEmbed.setDescription(
										`https://www.twitch.tv/${broadcaster.display_name}`,
									);
									twitchEmbed.addFields(
										{ name: 'Playing', value: gameName, inline: true },
										{ name: 'Started at', value: streamStart, inline: true },
									);
									twitchEmbed.setImage(
										`https://static-cdn.jtvnw.net/previews-ttv/live_user_${broadcaster.display_name.toLowerCase()}-1280x720.jpg`,
									);
									twitchEmbed.setTimestamp();
								}
								catch (error) {
									console.log('An error has occured while processing the game info: ' + error);
									return message.channel.send({
										embed: {
											title: 'Error',
											description: 'Unfortunately an error has occured!',
											color: 0xff0000,
										},
									});
								}

								message.channel.send(twitchEmbed);
							});
					});
			});
	},
};
