const mongo = require('../../util/mongo');
const prefixSchema = require('../../schemas/prefix-schema');
const { cache } = require('../../events/guild/message');

module.exports = {
	name: 'setprefix',
	guildOnly: true,
	minArgs: 1,
	maxArgs: 1,
	expectedArgs: '<prefix>',
	premissions: ['ADMINISTRATOR'],
	execute: async (message, args) => {
		const { guild } = message;
		let prefix = '!';

		if(args[0] && args[0].length === 1) prefix = args[0];

		await mongo().then(async mongoose => {
			try {
				await prefixSchema.findOneAndUpdate({
					_id: guild.id,
				}, {
					_id: guild.id,
					prefix,
				}, {
					upsert: true,
				});

				cache[guild.id] = [prefix];
			}
			finally {
				mongoose.connection.close();
			}
		});
	},
};