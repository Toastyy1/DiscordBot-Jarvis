module.exports = async (client, Discord, reaction, user) => {
	try {
		if(reaction.partial) await reaction.fetch();
		if(user.partial) await user.fetch();
	}
	catch (e) {
		return console.log('An error has occured while handling the "messageReactionAdd" event: ' + e);
	}

	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);

	const member = await reaction.message.guild.members.fetch(user.id);
	const memberName = member.displayName;

	switch (reaction.message.id) {
	case '845078187393941505':
		if(member.roles.cache.size <= 1) {
			if(reaction.emoji.name === '✅') {
				// Assigns the 'Roles:' role to the member
				await member.roles.add('841081335455678464');

				// Assigns the 'User' role to the member
				await member.roles.add('827285756615458837');
			}
			else if(reaction.emoji.name === '❌') {
				await member.send('You got kicked from the server because you did not agree to the rules!');
				await member.kick(`${memberName} did not agree to the rules.`);
			}
		}

		await reaction.users.remove(member);
		break;

	default:
		return;
	}
};