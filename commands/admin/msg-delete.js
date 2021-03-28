module.exports = {
	name: 'msgdelete',
	aliases: ['clear', 'prune'],
	expectedArgs: '<Nummer der zu löschenden Nachrichten>',
	permissionError: 'You need admin permissions to run this command',
	minArgs: 1,
	maxArgs: 1,
	execute: (message, args, text) => {
		const amount = parseInt(args[0]) + 1;
		if (!args.length > 0) {
			return message.channel.send('Parameter fehlen! ;)');
		}
		if (isNaN(amount)) {
			return message.channel.send('Der 1. Parameter ist keine Zahl!');
		}
		else if (amount < 1 || amount > 100) {
			return message.channel.send('Bitte eine Zahl zwischen 1 und 99 eingeben!');
		}

		message.channel.bulkDelete(amount, true).catch(err => {
			console.error(err);
			message.channel.send('Beim löschen von Nachrichten in diesem Chat ist ein Fehler aufgetreten');
		});
	},
	permissions: 'ADMINISTRATOR',
};