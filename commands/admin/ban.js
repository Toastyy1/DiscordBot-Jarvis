module.exports = {
    name: 'ban',
    permissions: ['ADMINISTRATOR'],
    minArgs: 1,
    maxArgs: 2,
    guildOnly: true,
    execute: async (message, args) => {
        const mentionedUser = message.mentions.members.first();
        
        if(!mentionedUser) return message.reply(`Please use a proper member mention!`);

        if(!args[1]) {
            return message.reply('Please name a reason!');
        }
        
        const banReason = args[1].toString();

        try {
            await mentionedUser.ban({reason: banReason});
        } catch (error) {
            return sconsole.log(`Error while banning user ${mentionedUser.displayName}: ` + error);
        }

        return message.channel.send(`Successfully banned '${mentionedUser.displayName}' from the server!`);
    }
}