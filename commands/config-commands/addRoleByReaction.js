const mongo = require('../../util/mongo');
const messageReactionSchema = require('../../schemas/messageReaction-schema');
const { cache } = require('../../events/client/messageReactionAdd');

module.exports = {
  name: 'reactionRole',
  aliases: ['rr'],
  guildOnly: true,
  minArgs: 3,
  maxArgs: 4,
  expectedArgs: '<target message (ID)> <target reaction> <role (ID) you want to assign> (<category role?>)',
  permissions: ['ADMINISTRATOR'],
  execute: async (message, args) => {
    const targetMessage = args[0];
    const targetMessageObj = await message.channel.messages.fetch(targetMessage)
      .catch(() => {
        console.log('Message not found!');
        message.reply('Could not find message! Try again with a valid MessageId');
      });
    const targetReaction = args[1];
    let role;
    args[2].startsWith('<@') ? role = args[2].substring(3, args[2].length - 1) : role = args[2];

    let isCategoryRole;
    isCategoryRole && typeof isCategoryRole === 'boolean'? isCategoryRole = args[3] : isCategoryRole = false;

    await mongo().then(async mongoose => {
      try {
        await messageReactionSchema.findById(targetMessage).then(async doc => {
          if (doc) {
            if (targetMessageObj.reactions.cache.find(msgReaction => msgReaction.emoji.name === targetReaction.split(':')[1])) {
              const existingReaction = doc.reactionRole.find(obj => obj.reaction === targetReaction).role;

              if (existingReaction === role) return message.reply('That reaction & role for the entered message already exists!');
            }
            await doc.update({
              _id: targetMessage,
              $push: {
                reactionRole: [{
                  reaction: targetReaction,
                  role,
                  isCategoryRole,
                }],
              },
            });
          }
          else {
            await messageReactionSchema.create({
              _id: targetMessage,
              reactionRole: [{
                reaction: targetReaction,
                role,
                isCategoryRole,
              }],
            });
          }

          cache[targetMessage] = [{ reaction: targetReaction, role, isCategoryRole }, ...(doc?.reactionRole.toObject() ?? [])]

        }).then(() => targetMessageObj.react(targetReaction));
      }
      finally {
        mongoose.connection.close();
      }
    });
  },
};