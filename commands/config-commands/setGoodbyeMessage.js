const mongo = require('../../util/mongo');
const goodbyeSchema = require('../../schemas/guildMemberRemove-schema');
const { cache } = require('../../events/guild/guildMemberRemove');

module.exports = {
	name: 'setgoodbyemessage',
	guildOnly: true,
	minArgs: 1,
	maxArgs: 4,
	expectedArgs: '<channel ID> <message> <embed title> <color>',
	permissions: ['ADMINISTRATOR'],
	execute: async (message, args) => {
		const { guild } = message;
		const memberUpdateChannel = args[0];
		let color = '0xffcc00';
		let messageText = 'It was nice having you as a member';
		let title = 'A user left the server!';

		if(args[1] && args[1].length > 0) messageText = args[1];

		if(args[2] && args[2].length > 0) title = args[2];

		if(args[3] && args[3].length > 0) color = args[3];

		await mongo().then(async mongoose => {
			try {
				await goodbyeSchema.findOneAndUpdate({
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

				cache[guild.id] = [memberUpdateChannel, color, messageText, title];
			}
			finally {
				mongoose.connection.close();
			}
		});
	},
};