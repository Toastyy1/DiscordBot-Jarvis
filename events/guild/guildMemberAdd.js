const mongo = require('../../util/mongo');
const welcomeSchema = require('../../schemas/guildMemberAdd-schema');
const cache = {};


module.exports = async (client, Discord, member) => {
	const { guild } = member;

	// Adding the 'Roles:' role
	await member.roles.add('852085441745911838');
	// Adding the 'Not yet verified' role
	//await member.roles.add('852615800434196501');

  // Adding the 'Recruit' role (TEMPORARILY SOLUTION)
  await member.roles.add('852065782317580339');

	let data = cache[guild.id];

	if (!data) {
		console.log('Fetching from database!');

		await mongo().then(async (mongoose) => {
			try {
				const result = await welcomeSchema.findOne({ _id: guild.id });

				if(result) {
					cache[guild.id] = data = [
						result.memberUpdateChannel,
						result.color,
						result.message,
						result.title,
					];
				}
				else {
					return;
				}
			}
			finally {
				mongoose.connection.close();
			}
		});
	}

	client.channels.cache.get(data[0]).send({
		embed: {
			title: data[3],
			color: data[1],
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
					value: data[2],
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

module.exports.cache = cache;
