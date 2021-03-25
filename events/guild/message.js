const { prefix } = require('../../config.json');

// For server deployment
// const prefix = process.env.PREFIX;

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
			// throw new Error(`Unknown permission node "${permission}"`);
		}
	}
};

module.exports = (Discord, client, message) => {
	const { member, content, guild } = message;

	if(!content.startsWith(prefix) || message.author.bot) return;

	const args = content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();
	const command = message.client.commands.get(cmd);

	if(!command) return message.reply(`"${content}" ist kein gültiger Befehl!`);

	let {
		permissions = [],
		permissionError = 'Dir fehlt die Berechtigung, diesen Befehl auszuführen!',
		requiredRoles = [],
		minArgs = 0,
		maxArgs = null,
		expectedArgs = '',
		execute,
	} = command;

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

	// Ensure the user has the required roles
	for (const requiredRole of requiredRoles) {
		const role = guild.roles.cache.find(
			(r) => r.name === requiredRole,
		);

		if (!role || !member.roles.cache.has(role.id)) {
			return message.reply(
				`Du benötigst die "${requiredRole}" Rolle um diesen Befehl zu benutzen!`,
			);
		}
	}

	// Ensure we have the correct number of arguments
	if (
		args.length < minArgs || (maxArgs !== null && args.length > maxArgs)
	) {
		return message.reply(
			`Falscher Syntax! Versuche ${prefix}${command.name} ${expectedArgs}`,
		);
	}

	execute(message, args, Discord);
};