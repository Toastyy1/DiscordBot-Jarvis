const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(require.main.filename);

module.exports = {
	name: 'update',
	requiredRoles: ['Mods', 'Coder'],
	execute: (message, args, Discord) => {
		const changelogPath = `${rootDir}/CHANGELOG.md`;

		const data = '```' + fs.readFileSync(changelogPath, 'utf-8') + '```';

		message.channel.send(data)
	},
};