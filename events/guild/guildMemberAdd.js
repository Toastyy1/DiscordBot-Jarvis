module.exports = (client, Discord, member) => {
	client.channels.cache.get(process.env.MEMBERUPDATECHANNEL)
		.send({
			embed: {
				title: 'A new user joined the server!',
				color: 	0xffcc00,
				thumbnail: {
					url: member.user.displayAvatarURL(),
				},
				fields: [
					{
						name: '⠀',
						value: '⠀',
						inline: true,
					},
					{
						name: 'Welcome ' + '`' + member.displayName + '`' + '!',
						value: 'Be respectful and polite & enjoy your stay!',
						inline: true,
					},
					{
						name: '⠀',
						value: '⠀',
						inline: true,
					},
				],
				footer: {
					text: 'Joined:',
				},
				timestamp: new Date(),
			},
		});
};