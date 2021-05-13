module.exports = (client, Discord, member) => {
	const basicRoles = ['827285756615458837', '841081335455678464'];

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

	member.roles.add(basicRoles).catch(err => console.log('An error has occured while adding basic roles to a new member! ' + err));
};