module.exports = {
	name: 'add',
	aliases: ['addition', 'aa', 'plus'],
	expectedArgs: '<num1> <num2>',
	permissionError: 'You need admin permissions to run this command',
	minArgs: 2,
	maxArgs: 2,
	guildOnly: true,
	execute: (message, args, Discord) => {
		const num1 = +parseInt(args[0]);
		const num2 = +parseInt(args[1]);

		if (!isNaN(num1) && !isNaN(num2)) {
			return message.reply(`The sum is ${num1 + num2}`);
		}

		message.reply('Einer der angegebenen Parameter ist keine Zahl!');
	},
	permissions: 'ADMINISTRATOR',
	requiredRoles: '',
};