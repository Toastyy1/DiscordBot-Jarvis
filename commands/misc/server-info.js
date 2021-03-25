module.exports = {
	name: 'server-info',
	aliases: ['svinfo', 'si'],
	execute: async (message, args, Discord) => {
		const { name, memberCount, afkTimeout, createdAt } = message.guild;

		let serverIconUrl = message.guild.iconURL();
		const { username } = await message.client.users.fetch(message.guild.ownerID);
		const serverOwner = username;

		if(!serverIconUrl) {
			serverIconUrl = 'https://www.pngkey.com/png/full/17-179750_discord-icon-discord-logo.png';
		}

		const infoEmbed = {
			color: 0xDC143C,
			title: name + '\u200b',
			author: {
				name: 'Server Informationen',
				icon_url: serverIconUrl,
			},

			thumbnail: {
				url: serverIconUrl,
			},

			fields: [
				{
					name: 'Anzahl benutzer',
					value: memberCount + '\n\u200b',
					inline: true,
				},

				{
					name: 'Server Owner',
					value: serverOwner,
					inline: true,
				},

				{
					name: 'AFK-Timeout',
					value: afkTimeout / 60 + ' Minuten',
					inline: true,
				},

				{
					name: 'Erstellt am',
					value: createdAt,
					inline: false,
				},
			],
		};

		message.channel.send({ embed: infoEmbed });
	},
};