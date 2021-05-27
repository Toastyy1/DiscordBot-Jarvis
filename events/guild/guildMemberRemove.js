const mongo = require('../../util/mongo');
const goodbyeSchema = require('../../schemas/guildMemberRemove-schema');
const cache = {};

module.exports = async (client, Discord, member) => {
	const { guild } = member;

	let data = cache[guild.id];

	if(!data) {
		console.log('Fetching from database!');

		await mongo().then(async mongoose => {
			try {
				const result = goodbyeSchema.findOne({ _id: guild.id });

				cache[guild.id] = data = [
					result.memberUpdatechannel,
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

	client.channels.cache.get(data[0])
		.send({
			embed: {
				title: data[3],
				color: 	data[1],
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
					text: 'Left:',
				},
				timestamp: new Date(),
			},
		});
};