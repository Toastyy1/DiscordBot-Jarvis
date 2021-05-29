const mongo = require('../../util/mongo');

module.exports = async client => {
	const guildCount = client.guilds.cache.size > 1 ? `over ${client.guilds.cache.size} servers` : `over ${client.guilds.cache.size} server`;
	client.user.setActivity(guildCount, { type: 'WATCHING' });

	await mongo().then(mongoose => {
		try {
			console.log('Successfully connected to database!');
		}
		catch (error) {
			return console.log('An error has occured while connecting to the database! Stopping the bot now.\n' + error);
		}
		finally {
			mongoose.connection.close();
		}
	});

	console.log('Bot is online!');
};