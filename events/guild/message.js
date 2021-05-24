require('dotenv').config();
const censor = require('chat-censoring');
const prefix = process.env.PREFIX;

const validatePermissions = (permissions) => {
	const validPermissions = [
		'CREATE_INSTANT_INVITE',
		'KICK_MEMBERS',
		'BAN_MEMBERS',
		'ADMINISTRATOR',
		'MANAGE_CHANNELS',
		'MANAGE_GUILD',
		'ADD_REACTIONS',
		'VIEW_AUDIT_LOG',
		'PRIORITY_SPEAKER',
		'STREAM',
		'VIEW_CHANNEL',
		'SEND_MESSAGES',
		'SEND_TTS_MESSAGES',
		'MANAGE_MESSAGES',
		'EMBED_LINKS',
		'ATTACH_FILES',
		'READ_MESSAGE_HISTORY',
		'MENTION_EVERYONE',
		'USE_EXTERNAL_EMOJIS',
		'VIEW_GUILD_INSIGHTS',
		'CONNECT',
		'SPEAK',
		'MUTE_MEMBERS',
		'DEAFEN_MEMBERS',
		'MOVE_MEMBERS',
		'USE_VAD',
		'CHANGE_NICKNAME',
		'MANAGE_NICKNAMES',
		'MANAGE_ROLES',
		'MANAGE_WEBHOOKS',
		'MANAGE_EMOJIS',
	];

	for (const permission of permissions) {
		if (!validPermissions.includes(permission)) {
			throw new Error(`Unknown permission node "${permission}"`);
		}
	}
};

module.exports = (Discord, client, message) => {
	const { member, content, guild } = message;

	if(message.author.bot) return;

	if(!content.startsWith(prefix)) {
		if(content.length > 0) {
			if(censor.checkMessage(content)) {
				message.delete()
					.then(() => message.channel.send(`${message.author} said: ${censor.censorMessage(content, '#')}`))
					.catch(err => {
						console.log('An error occurred while censoring a message: ' + err);
						return message.channel.send('Unfortunately an error has occurred :(');
					});
			}
		}
		return;
	}

	const args = content.slice(prefix.length).split(/ +/);
	const cmdName = args.shift().toLowerCase();
	const command = message.client.commands.get(cmdName)
       || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(cmdName));

	if(!command) return message.reply(`"${content}" is not a valid command!`);

	let {
		permissions = [],
		permissionError = 'You are not authorized to execute this command!',
		requiredRoles = [],
		minArgs = 0,
		maxArgs = null,
		expectedArgs = '',
		execute,
		guildOnly,
	} = command;

	if(guildOnly && message.channel.type === 'dm') return message.reply('This command works only on a server!');

	// Ensure the permissions are in an array and are all valid
	if (permissions.length) {
		if (typeof permissions === 'string') {
			permissions = [permissions];
		}

		validatePermissions(permissions);
	}

	// Ensure the user has the required permissions
	for (const permission of permissions) {
		if (!member.hasPermission(permission)) {
			message.reply(permissionError);
			return;
		}
	}

	let roleCount = 0;
	let missingRole = '';

	// Ensure the user has the required roles
	for (const requiredRole of requiredRoles) {
		const role = guild.roles.cache.find(
			r => r.name === requiredRole,
		);

		if (role && member.roles.cache.has(role.id)) {
			roleCount++;
		}
		else {
			missingRole = requiredRole;
		}
	}

	if(roleCount === 0 && requiredRoles.length > 0) {
		return message.reply(
			`You need the "${missingRole}" role to use this command!`,
		);
	}

	// Ensure we have the correct number of arguments
	if (
		args.length < minArgs || (maxArgs !== null && args.length > maxArgs)
	) {
		return message.reply(
			`Wrong syntax! Try ${prefix}${command.name} ${expectedArgs}`,
		);
	}

	message.delete()
		.then(() => {
			message.channel.startTyping();
			execute(message, args, Discord, client);
		})
		.then(() => message.channel.stopTyping(true));
};