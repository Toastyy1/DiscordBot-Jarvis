/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
const { prefix } = require('../config.json');

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

module.exports = (client, commandOptions) => {
	let {
		commands,
		aliases,
		expectedArgs = '',
		permissionError = 'You do not have permission to run this command.',
		minArgs = 0,
		maxArgs = null,
		permissions = [],
		requiredRoles = [],
		execute,
	} = commandOptions;

	// TODO: Handle aliases => seperate them into a extra option

	// Ensure the command and aliases are in an array
	if (typeof commands === 'string') {
		commands = [commands];
	}

	console.log(`Registering command "${commands[0]}"`);

	// Ensure the permissions are in an array and are all valid
	if (permissions.length) {
		if (typeof permissions === 'string') {
			permissions = [permissions];
		}

		validatePermissions(permissions);
	}

	// Listen for messages
	client.on('message', (message) => {
		const { member, content, guild } = message;

		if (message.author.bot) return;

		// let cmd0 = content.slice(prefix.length).trim().split(/ +/);
		// let cmd1 = cmd0.shift().toLowerCase();

		// if (cmd1 != commands) {
		// 	message.reply('Kein Befehl!');
		// 	return;
		// }
		console.log('Hallo');

		for (const alias of commands) {
			const command = alias.toLowerCase();
			const args = content.slice(prefix.length).trim().split(/ +/);
			const userCmd = args.shift().toLowerCase();

			if (!content.toLowerCase().startsWith(`${prefix}`)) return;

			// console.log(content.substring(1));

			if (userCmd !== command) continue;

			console.log('Geht weiter');
			// A command has been ran

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
					`Incorrect syntax! Use ${prefix}${alias} ${expectedArgs}`,
				);
			}

			// Handle the custom command code
			execute(message, args, args.join(' '), client);

			return;
		}
		console.log(`Abgleich mit ${commands}: ${content} ist kein Befehl`);
	});
};