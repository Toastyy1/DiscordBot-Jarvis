module.exports = {
	name: 'addreaction',
	aliases: ['ar'],
	permissions: ['ADMINISTRATOR'],
	minArgs: 2,
	expectedArgs: '<ID of target message> <reaction(s)>',
	permissionError: 'You need admin permissions to run this command',
	guildOnly: true,
	execute: async (message, args) => {
		const targetMessage = await message.channel.messages.fetch(args[0]);
		const reactions = args.slice(1);

		reactions.forEach(async reaction => {
			await targetMessage.react(reaction);
		});
	},
};