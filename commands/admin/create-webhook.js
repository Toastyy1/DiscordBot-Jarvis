module.exports = {
	name: 'create-webhook',
	permissions: ['ADMINISTRATOR'],
	expectedArgs: '<Name des WebHooks> <Channel ID> (<Link zu einem Icon für den WebHook>)',
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

		if(iconUrl && !iconUrl.includes('https://')) return message.channel.send('Der Link zum Icon ist nicht gültig!');

		const targetChannel = await message.client.channels.fetch(channelID);

		targetChannel.createWebhook(webhookName, iconUrl)
			.then(webhook => webhook.edit(webhookName, iconUrl)
				.catch(error => console.log(`Error: ${error}`)
					.then(message.channel.send('Ein Fehler ist aufgetreten :(')))
					.then(message.channel.send('Webhook erfolgreich erstellt!')));
	},
};