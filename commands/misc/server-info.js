const Discordd = require('discord.js');
const exampleEmbed = new Discordd.MessageEmbed();

module.exports = {
	name: 'server-info',
	aliases: ['svinfo', 'si'],
	execute: (message, args, Discord, client) => {
		const serverIconUrl = message.guild.iconURL();
		const serverName = message.guild.name;
		const memberCount = message.guild.memberCount;
        const serverOwner = message.guild.owner;

		exampleEmbed
			.setColor('#0099ff')
			.setAuthor('Server Informationen', serverIconUrl, 'https://discord.js.org')
			.setTitle(serverName + '\n\u200b')
			// .setURL('https://discord.js.org/')
			// .setDescription('Some description here')
			.setThumbnail(serverIconUrl)
			.addFields(
				{ name: 'Anzahl benutzer', value: memberCount + '\n\u200b', inline: true },
				{ name: 'Server Owner', value: serverOwner, inline: true },
				// { name: 'Inline field title', value: 'Some value here', inline: true },
				// { name: 'Inline field title', value: 'Some value here', inline: true },
			)
			// .addField('Inline field title', 'Some value here', true)
			.setTimestamp();
			// .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

		message.channel.send(exampleEmbed);
	},
};