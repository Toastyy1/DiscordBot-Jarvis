const fs = require('fs');
const path = require('path');
const { commandHandler } = require('../config.json');

module.exports = client => {
	client.user.setActivity('Diener');
	const commandBase = require(`../handlers/${commandHandler}`);

	const readCommands = (dir) => {
		// TODO: Find a better solution to determine the project folder
		const __dirname = 'C:\\Users\\marce\\Documents\\Discord-Test-Bot';

		// Read out all command files
		const files = fs.readdirSync(path.join(__dirname, dir));

		// Loop through all the files in ./commands
		for (const file of files) {
			// Get the status of 'file' (is it a file or directory?)
			const stat = fs.lstatSync(path.join(__dirname, dir, file));

			// If the 'file' is a directory, call the 'readCommands' function
			// again with the path of the subdirectory
			if (stat.isDirectory()) {
				readCommands(path.join(dir, file));
			}

			// If the 'file' is not the commandHandler itself, get all the
			// commandOptions of that file
			else if (file !== commandHandler) {
				const commandOption = require(path.join(__dirname, dir, file));
				// Call the commandHandler and pass the commandOptions and
				// the client
				commandBase(client, commandOption);
			}
		}
	};

	readCommands('commands');
	console.log(`${client.user.username} is online`);
};
