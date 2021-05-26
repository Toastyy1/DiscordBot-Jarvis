module.exports = {
	name: 'createwelmsg',
	execute: async (message, args) => {
		message.channel.send({
			embed: {
				title: 'test',
				fields: [
					{
						name: 'Some test',
						value: 'Some more test',
					},
				],
			},
		}).then(async message => {
			await message.react('✔');
			await message.react('❌');

			const filter = reaction => reaction.emoji.name === '✔' || reaction.emoji.name === '❌';

			message.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
				.then(collected => {
					const reaction = collected.first();

					if(reaction.emoji.name === '✔') return message.reply('You reacted with ✔');

					if(reaction.emoji.name === '❌') return message.reply('You reacted with ❌');
				})
				.catch(collected => {
					message.reply('you reacted with neither a ✔, nor a ❌');
				});
		});
	},
};