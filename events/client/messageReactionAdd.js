const mongo = require('../../util/mongo');
const messageReactionSchema = require('../../schemas/messageReaction-schema');
const cache = {};

module.exports = async (client, Discord, reaction, user) => {
  try {
    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();
  }
  catch (e) {
    return console.log('Could not fetch reaction or user. Error: ' + e);
  }

  if (user.bot) return;

  const member = await reaction.message.guild.members.fetch(user.id);
  const { message } = reaction;

  let data = cache[message.id];

  if (!data) {
    console.log('Fetching reactions & roles from database!');
    await mongo().then(async mongoose => {
      try {
        const results = await messageReactionSchema.findById(message.id).lean();

        if (!results) return;

        const reactionRoles = results.reactionRole.map(obj => ({ reaction: obj.reaction, role: obj.role, isCategoryRole: obj.isCategoryRole }));

        cache[message.id] = data = reactionRoles;
      }
      catch (error) {
        console.log('An error has occured while getting data from mongo! Error: ' + error);
      }
      finally {
        mongoose.connection.close();
      }
    });
  }

  if (!data) return;
  if (!data.find(x => x.reaction.split(':')[1] === reaction.emoji.name)) await reaction.remove();

  const rolesToAdd = [];

  data.forEach(element => {
    if (element.reaction.split(':')[1] !== reaction.emoji.name) return;
    rolesToAdd.push(element.role);
  });
  console.log(rolesToAdd);

  member.roles.add(rolesToAdd)
    .then(() => console.log('Successfully assigned roles to the member!'))
    .catch(err => {
      member.send('Unfortunately an error has occured while assigning your selected role :(');
      console.log('An error has occurred while assigning roles to the member! ' + err);
    });

};

module.exports.cache = cache;