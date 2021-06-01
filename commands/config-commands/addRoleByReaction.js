const mongo = require('../../util/mongo');
const messageReactionSchema = require('../../schemas/messageReaction-schema');
const { cache } = require('../../events/client/messageReactionAdd');

module.exports = {
	name: 'reactionRole',
	aliases: [ 'rr' ],
	guildOnly: true,
	minArgs: 2,
	maxArgs: 3,
	expectedArgs: '<target message (ID)> <target reaction> <role (ID) you want to assign>',
	permissions: ['ADMINISTRATOR'],
	execute: async (message, args) => {
		const targetMessage = args[0];
		const targetMessageObj = await message.channel.messages.fetch(targetMessage);
		const targetReaction = args[1];
		const role = args[2];

		await mongo().then(async mongoose => {
			try {
				await messageReactionSchema.findById(targetMessage).then(async doc => {
					if(doc) {
						if(targetMessageObj.reactions.cache.find(msgReaction => msgReaction.emoji.name === targetReaction.split(':')[1])) {
							const existingReaction = doc.reactionRole.find(obj => obj.reaction === targetReaction).role;

							if(existingReaction === role) return message.reply('That reaction & role for the entered message already exists!');
						}
						await doc.update({
							_id: targetMessage,
							$push: {
								reactionRole: [{
									reaction: targetReaction,
									role,
								}],
							},
						});
					}
					else {
						await messageReactionSchema.create({
							_id: targetMessage,
							reactionRole: [{
								reaction: targetReaction,
								role,
							}],
						});
					}

					cache[targetMessage] = [{ reaction: targetReaction, role }];
				}).then(() => targetMessageObj.react(targetReaction));
			}
			finally {
				mongoose.connection.close();
			}
		});
	},
};