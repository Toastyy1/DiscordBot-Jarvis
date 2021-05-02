module.exports = {
	name: 'create-webhook',
	permissions: ['ADMINISTRATOR'],
	expectedArgs: '<Name of the WebHooks> <Channel ID> (<Link to an icon for the WebHook>.)',
	permissionError: 'You need admin permissions to run this command',
	minArgs: 2,
	guildOnly: true,
	// maxArgs: 2,
	execute: async (message, args) => {
		const webhookName = args[0].toString();
		const channelID = args[1].toString();
		let iconUrl = '';
		if(args[2]) {
			iconUrl = args[2].toString();
		}

		if(iconUrl && !iconUrl.includes('https://')) return message.channel.send('The link to the icon is not valid!');

		const targetChannel = await message.client.channels.fetch(channelID);

		targetChannel.createWebhook(webhookName, iconUrl)
			.then(webhook => webhook.edit(webhookName, iconUrl)
				.catch(error => console.log(`An error has occurred while creating a webhook: ${error}`)
					.then(message.channel.send('Unfortunately an error has occurred :(')))
				.then(message.channel.send('Webhook created successfully!')));
	},
};