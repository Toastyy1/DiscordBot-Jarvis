module.exports = {
	name: 'msgdelete',
	aliases: ['clear', 'prune'],
	expectedArgs: '<Number of the messages to be deleted>',
	permissionError: 'You need admin permissions to run this command',
	minArgs: 1,
	maxArgs: 1,
	guildOnly: true,
	execute: (message, args) => {
		const amount = parseInt(args[0]);
		if (!args.length > 0) {
			return message.channel.send('Missing parameters! ;)');
		}
		if (isNaN(amount)) {
			return message.channel.send('The first parameter is not a number!');
		}
		else if (amount < 1 || amount > 100) {
			return message.channel.send('Please enter a number between 1 and 99!');
		}

		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('An error occurred while deleting messages in this chat');
		});
	},
	permissions: 'ADMINISTRATOR',
};