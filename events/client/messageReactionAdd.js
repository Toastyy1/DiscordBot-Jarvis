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
	const { message } = reaction;

	let data = cache[message.id];

	if(!data) {
		console.log('Fetching reactions & roles from database!');
		await mongo().then(async mongoose => {
			try {
				const results = await messageReactionSchema.findById(message.id).lean();

				const reactionRoles = results.reactionRole.map(obj => ({ reaction: obj.reaction, role: obj.role }));

				cache[message.id] = data = reactionRoles;
			}
			finally {
				mongoose.connection.close();
			}
		});
	}

	const rolesToAdd = [];

	data.forEach(element => {
		if(element.reaction.split(':')[1] !== reaction.emoji.name) return;
		rolesToAdd.push(element.role);
	});

	member.roles.add(rolesToAdd)
		.then(() => console.log('Successfully assigned roles to the member!'))
		.catch(async err => {
			await member.send('Unfortunately an error has occured while assigning your selected role :(');
			console.log('An error has occurred while assigning roles to the member!' + err);
		});

};

module.exports.cache = cache;