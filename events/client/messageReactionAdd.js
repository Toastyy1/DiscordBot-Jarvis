const mongo = require('../../util/mongo');
const messageReactionSchema = require('../../schemas/messageReaction-schema');
const cache = {};

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
		if(member.roles.cache.size <= 1) {
			if(reaction.emoji.name === '✅') {
				// Assigns the 'Roles:' role to the member
				member.roles.add('841081335455678464').then(() => {

					// Assigns the 'User' role to the member
					member.roles.add('827285756615458837');
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
	case '845101137816059934':
		switch (reaction.emoji.name) {
		case 'developer':
			// Assigns the 'Coder' role to the member
			member.roles.add('827332590620246056').catch(console.error());
			break;
		case 'stackoverflow':
			// Assigns the 'StackOverflow' role to the member
			member.roles.add('835926532723703849').catch(console.error());
			break;
		case 'age16':
			// Assigns the '16+' role to the member
			member.roles.add('827622099270762507').catch(console.error());
			break;
		case 'age18':
			// Assigns the '18+' role to the member
			member.roles.add('827622498689351711').catch(console.error());
			break;
		case 'csgo':
			// Assigns the 'CSGO' role to the member
			member.roles.add('841082846973394974').then(() => {
				member.roles.add('841083180097208340');
			}).catch(console.error());
			break;
		case 'deeprock':
			// Assigns the 'Deep Rock' role to the member
			member.roles.add('841082846973394974').then(() => {
				member.roles.add('846499645811195915');
			}).catch(console.error());
			break;
		default:
			break;
		}

		break;

	default:
		return;
	}
};

module.exports.cache = cache;