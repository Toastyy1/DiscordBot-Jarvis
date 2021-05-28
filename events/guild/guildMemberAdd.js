const mongo = require('../../util/mongo');
const welcomeSchema = require('../../schemas/guildMemberAdd-schema');
const cache = {};


module.exports = async (client, Discord, member) => {
	const { guild } = member;

	let data = cache[guild.id];

	if (!data) {
		console.log('Fetching from database!');

		await mongo().then(async (mongoose) => {
			try {
				const result = await welcomeSchema.findOne({ _id: guild.id });

				cache[guild.id] = data = [
					result.memberUpdateChannel,
					result.color,
					result.message,
					result.title,
				];
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
