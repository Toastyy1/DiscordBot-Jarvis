const mongo = require('../../util/mongo');
const messageReactionSchema = require('../../schemas/messageReaction-schema');
const { cache } = require('../../events/client/messageReactionAdd');

module.exports = {
	name: 'addrolebyreaction',
	guildOnly: true,
	minArgs: 3,
	maxArgs: 3,
	expectedArgs: '<target message (ID)> <target reaction> <role (ID) you want to assign>',
	permissions: ['ADMINISTRATOR'],
	execute: async (message, args) => {
		const { guild } = message;
		const targetMessage = args[0];
		const targetMessageObj = await message.channel.messages.fetch(targetMessage);
		const targetReaction = args[1];
		const role = args[2];

		if (targetMessageObj.reactions.cache.find(msgReaction => msgReaction.emoji.name === targetReaction.split(':')[1])) return message.channel.send('Reaction already exists!');

		await targetMessageObj.react(targetReaction);

		await mongo().then(async mongoose => {
			try {
				await messageReactionSchema.findOneAndUpdate({
					_id: guild.id,
					message: {
						$elemMatch: {
							msgId: targetMessage,
						},
					},
				}, {
					_id: guild.id,
					$push: {
						message: [{
							msgId: targetMessage,
							$each: {
								reactionRole: [{
									reaction: targetReaction,
									role,
								}],
							},
						}],
					},

				}, {
					upsert: true,
				});

				cache[guild.id] = [
					[{
						msgId: targetMessage,
						reactionRole: [{
							reaction: targetReaction,
							role,
						}],
					}],
				];
			}
			finally {
				mongoose.connection.close();
			}
		});
	},
};