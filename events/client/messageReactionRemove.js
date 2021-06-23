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
        const result = await messageReactionSchema.findById(message.id).lean();
        console.log(result);
      } catch(err) {
        console.log('An error has occured while fetching reactions & roles from the database: ' + err);
        member.send('Unfortunately an error has occured while removing your role :( Please contact the server-/bot owner or try again in a few minutes!');
      } finally {
        mongoose.connection.close();
      }
    });
  }

};