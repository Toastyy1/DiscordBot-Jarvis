module.exports = (client, Discord, member) => {
	client.channels.cache.get(process.env.MEMBERUPDATECHANNEL)
		.send({
			embed: {
				title: 'A user left the server!',
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
						name: 'Goodbye ' + '`' + member.displayName + '`' + '!',
						value: 'It was nice having you as a member',
						inline: true,
					},
					{
						name: '⠀',
						value: '⠀',
						inline: true,
					},
				],
				footer: {
					text: 'Left:',
				},
				timestamp: new Date(),
			},
		});
};