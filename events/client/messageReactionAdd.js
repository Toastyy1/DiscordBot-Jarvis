module.exports = async (client, Discord, reaction, user) => {
	try {
		if(reaction.partial) await reaction.fetch();
		if(user.partial) await user.fetch();
	}
	catch (e) {
		return console.log('An error has occured while handling the "messageReactionAdd" event: ' + e);
	}

	if(user.bot) return;

	const member = await reaction.message.guild.members.fetch(user.id);
	const memberName = member.displayName;

	switch (reaction.message.id) {
	case '845078187393941505':
		if(member.roles.cache.size <= 2) {
			if(reaction.emoji.name === '✅') {
				// Assigns the 'Roles:' role to the member
				member.roles.add('852085441745911838').then(() => {

					// Assigns the 'Recruit' role to the member
					member.roles.add('852065782317580339');

				}).then(() => {
					if(member.roles.cache.has('852615800434196501')) member.roles.remove('852615800434196501');

				}).catch((err) => {
					console.log('An error has occured while adding the basic roles to a new member: ' + err);
					reaction.message.channel.send('Unfortunately, I wasn\'t able to assign you your roles. Try again or report the problem');
				});

			}
			else if(reaction.emoji.name === '❌') {
				try {
					member.send('You got kicked from the server because you did not agree to the rules!');
					member.kick(`${memberName} did not agree to the rules.`);
				}
				catch (err) {
					console.log('An error has occured while kicking an user because he didnt agree to the rules: ' + err);
				}
			}
		}

		reaction.users.remove(member);
		break;

	default:
		return;
	}
};