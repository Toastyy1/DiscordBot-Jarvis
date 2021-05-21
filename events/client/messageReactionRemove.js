module.exports = async (client, Discord, reaction, user) => {
	try {
		if(reaction.partial) await reaction.fetch();
		if(user.partial) await user.fetch();
	}
	catch (e) {
		return console.log('An error has occured while handling the "messageReactionAdd" event: ' + e);
	}

	if(user.bot) return;
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" removed a reaction!`);

	const member = await reaction.message.guild.members.fetch(user.id);
	const reactionRoles = [
		{
			reaction: 'develop',
			role: '827332590620246056',
		},

		{
			reaction: 'stackoverflow',
			role: '835926532723703849',
		},

		{
			reaction: 'age16',
			role: '827622099270762507',
		},

		{
			reaction: 'age18',
			role: '827622498689351711',
		},

		{
			reaction: 'csgo',
			role: ['841083180097208340', '841082846973394974'],
		},
	];

	if(reaction.message.id === process.env.ROLECLAIMMESSAGE) {
		reaction.message.reactions.cache.forEach(r => {
			if(reaction.emoji.name === r.emoji.name) {
				member.roles.remove(reactionRoles.find(rr => rr.reaction === reaction.emoji.name).role).catch(console.error());
			}
		});
	}
};