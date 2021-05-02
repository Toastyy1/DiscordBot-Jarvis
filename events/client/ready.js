module.exports = client => {
	const guildCount = client.guilds.cache.size > 1 ? `Serves on ${client.guilds.cache.size} servers` : `Serves on ${client.guilds.cache.size} server`;
	client.user.setActivity(guildCount, { type: 'WATCHING' });
	console.log('Bot is online!');
};