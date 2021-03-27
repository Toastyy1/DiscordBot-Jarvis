const fs = require('fs');
const path = require('path');

const rootDir = path.dirname(require.main.filename);

module.exports = {
	name: 'update',
	execute: (message, args, Discord) => {
		const changelogPath = `${rootDir}/CHANGELOG.md`;

		const data = fs.readFileSync(changelogPath, 'utf-8');
		console.log(data.toString());
	},
};