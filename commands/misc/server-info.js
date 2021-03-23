// const Discordd = require('discord.js');
// const exampleEmbed = new Discordd.MessageEmbed();

module.exports = {
	name: 'server-info',
	aliases: ['svinfo', 'si'],
	execute: (message, args, Discord, client) => {
		let serverIconUrl = message.guild.iconURL();
		const serverName = message.guild.name;
		const memberCount = message.guild.memberCount;
        const serverOwner = message.guild.members.resolveID(message.guild.ownerID);/*fetchMember(message.guild.ownerID).displayName;*/
		// Get a User by ID
		// client.users.get("user id here");
		// Returns <User>

		if(!serverIconUrl) {
			serverIconUrl = 'https://www.pngkey.com/png/full/17-179750_discord-icon-discord-logo.png';
		}

		const infoEmbed = {
			color: 0x0099ff,
			title: serverName + '\u200b',
			author: {
				name: 'Server Informationen',
				icon_url: serverIconUrl
			},

			thumbnail: {
				url: serverIconUrl
			},

			fields: [
				{
					name: 'Anzahl benutzer', 
					value: memberCount + '\n\u200b',
					inline: true
				},

				{
					name: 'Server Owner', 
					value: serverOwner, 
					inline: true
				}
			]
		};

		// exampleEmbed
		// 	.setColor('#0099ff')
		// 	.setAuthor('Server Informationen', serverIconUrl, 'https://discord.js.org')
		// 	.setTitle(serverName + '\n\u200b')
		// 	// .setURL('https://discord.js.org/')
		// 	// .setDescription('Some description here')
		// 	.setThumbnail(serverIconUrl)
		// 	.addFields(
		// 		{ name: 'Anzahl benutzer', value: memberCount + '\n\u200b', inline: true },
		// 		{ name: 'Server Owner', value: serverOwner, inline: true },
		// 		// { name: 'Inline field title', value: 'Some value here', inline: true },
		// 		// { name: 'Inline field title', value: 'Some value here', inline: true },
		// 	)
		// 	// .addField('Inline field title', 'Some value here', true)
		// 	.setTimestamp();
		// 	// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

		message.channel.send({ embed: infoEmbed });
	},
};