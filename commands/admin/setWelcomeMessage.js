const mongo = require('../../util/mongo');
const welcomeSchema = require('../../schemas/guildMemberAdd-schema');

module.exports = {
	name: 'setwelcomemessage',
	guildOnly: true,
	minArgs: 1,
	maxArgs: 3,
	expectedArgs: '<channel ID> <message> <color>',
	permissions: ['ADMINISTRATOR'],
	execute: async (message, args) => {
		const { guild } = message;
		const memberUpdateChannel = args[0];
		let color = '0xffcc00';
		let messageText = 'Be respectful and polite & enjoy your stay!';

		if(args[1].length > 0) messageText = args[1];

		if(args[2].length > 0) color = args[2];

		await mongo().then(async mongoose => {
			try {
				await welcomeSchema.findOneAndUpdate({
					_id: guild.id,
				}, {
					_id: guild.id,
					memberUpdateChannel,
					color,
					message: messageText,
				}, {
					upsert: true,
				});
			}
			finally {
				mongoose.connection.close();
			}
		});
	},
};