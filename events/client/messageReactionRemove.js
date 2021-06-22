module.exports = async (client, Discord, reaction, user) => {
	try {
		if(reaction.partial) await reaction.fetch();
		if(user.partial) await user.fetch();
	}
	catch (e) {
		return console.log('An error has occured while handling the "messageReactionAdd" event: ' + e);
	}

	if(user.bot) return;

};