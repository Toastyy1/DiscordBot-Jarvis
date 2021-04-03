const discord = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	name: 'live',
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<Your channel name>',
	execute: async (message, args, Discord, client) => {
		const clientID = '3ror5a99eilg2qh0z45v7y17didoom';
		const clientSecret = '4db2bxr67ifa5dmdpwymh51el2kd4a';
		const streamer = args[0].toString();

		const twitchEmbed = new discord.MessageEmbed();

		fetch(`https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`, {
			method: 'POST',
		}).then(res => res.json())
			.then(data => {
				const authToken = data.access_token;
				console.log('authToken: ' + authToken);
				console.log('clientId: ' + clientID);

				fetch(`https://api.twitch.tv/helix/search/channels?query=${streamer}`, {
					method: 'GET',
					headers: {
						'CLIENT-ID': clientID,
						'Authorization': 'Bearer ' + authToken,
					},
				})
					.then(x => x.json())
					.then(x => {
						if(!data) return message.reply(`Den Twitch-Channel ${streamer} gibt es nicht!`);

						const broadcaster = x.data.filter(filter => filter.display_name.toLowerCase() === streamer.toLowerCase())[0];

						const isLive = broadcaster.is_live;
						twitchEmbed.setTitle(broadcaster.display_name);
						twitchEmbed.addFields(
							{ name: 'Ist live?', value: isLive },
						);

						message.channel.send(twitchEmbed);
					});
			});
	},
};