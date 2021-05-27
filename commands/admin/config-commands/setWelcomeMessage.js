const mongo = require('../../../util/mongo');
const welcomeSchema = require('../../../schemas/guildMemberAdd-schema');

module.exports = {
	name: 'setwelcomemessage',
	guildOnly: true,
	minArgs: 1,
	maxArgs: 4,
	expectedArgs: '<channel ID> <message> <embed title> <color>',
	permissions: ['ADMINISTRATOR'],
	execute: async (message, args) => {
		const { guild } = message;
		const memberUpdateChannel = args[0];
		let color = '0xffcc00';
		let messageText = 'Be respectful and polite & enjoy your stay!';
		let title = 'A new user joined the server!';

		if(args[1] && args[1].length > 0) messageText = args[1];

		if(args[2] && args[2].length > 0) title = args[2];

		if(args[3] && args[3].length > 0) color = args[3];

		await mongo().then(async mongoose => {
			try {
				await welcomeSchema.findOneAndUpdate({
					_id: guild.id,
				}, {
					_id: guild.id,
					memberUpdateChannel,
					color,
					message: messageText,
					title,
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