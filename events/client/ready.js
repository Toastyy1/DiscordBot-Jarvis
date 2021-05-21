module.exports = client => {
	const guildCount = client.guilds.cache.size > 1 ? `over ${client.guilds.cache.size} servers` : `over ${client.guilds.cache.size} server`;
	client.user.setActivity(`Prefix = '${process.env.PREFIX}'`, { type: 'WATCHING' });
	console.log('Bot is online!');
};