module.exports = {
	name: 'create-webhook',
	aliases: ['crwh', 'newwh'],
	permissions: ['ADMINISTRATOR'],
	expectedArgs: '<Name of the WebHooks> <Channel ID> (<Link to an icon for the WebHook>.)',
	permissionError: 'You need admin permissions to run this command',
	minArgs: 2,
	maxArgs: 3,
	guildOnly: true,
	execute: async (message, args) => {
		const webhookName = args[0];
		let channelID;
		args[1].startsWith('<') ? channelID = args[1].substring(2, args[1].length - 1) : channelID = args[1];
		let iconUrl;
		args[2] ? iconUrl = args[2] : iconUrl = null;

		if(iconUrl && !iconUrl.includes('https://')) return message.channel.send('The link to the icon is not valid!');

		const targetChannel = await message.client.channels.fetch(channelID);

		if(targetChannel.type !== 'text') return message.channel.send('Webhooks can only be created for text channels!');

		targetChannel.createWebhook(webhookName, {
			avatar: iconUrl,
		})
			.then(async webhook => {
				message.channel.send(`Successfully created webhook ${webhook.name} in ${targetChannel}!`);
				await message.member.send(`Webhook-URL for '${webhook.name}' is: \n${webhook.url}`);
			})
			.catch(err => {
				message.channel.send('Webhook could not be created!');
				console.log('Webhook could not be created! Error ' + err);
			});
	},
};