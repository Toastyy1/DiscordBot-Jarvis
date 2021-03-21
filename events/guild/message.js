const { prefix } = require('../../config.json');

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
			console.log('Fehler');
			// throw new Error(`Unknown permission node "${permission}"`);
		}
	}
};

module.exports = (Discord, client, message) => {
	const { member, content, guild } = message;

	if(!content.startsWith(prefix) || message.author.bot) return;

	const args = content.slice(prefix.length).split(/ +/);
	const cmd = args.shift().toLowerCase();
	const command = client.commands.get(cmd);

	if(!command) return message.reply('Kein Befehl');

	const {
		permissions = [],
		permissionError = 'Dir fehlt die Berechtigung, diesen Befehl auszuführen!',
		requiredRoles = [],
		minArgs = 0,
		maxArgs = null,
		expectedArgs = '',
		execute,
	} = command;


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
				`You must have the "${requiredRole}" role to use this command.`,
			);
		}
	}

	// Split on any number of spaces
	// const args = content.split(/[ ]+/);

	// Remove the command which is the first index

	// Ensure we have the correct number of arguments
	if (
		args.length < minArgs || (maxArgs !== null && args.length > maxArgs)
	) {
		return message.reply(
			`Incorrect syntax! Use ${prefix}${command.name} ${expectedArgs}`,
		);
	}

	execute(message, args, Discord);
};