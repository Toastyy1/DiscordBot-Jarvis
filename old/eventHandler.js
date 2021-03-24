function reqEvent(event) {
	return require(`../events/${event}`);
}

module.exports = bot => {
	bot.on('ready', function() { reqEvent('ready') (bot); });
};