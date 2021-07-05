require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });
require('discord-buttons')(client);
const { MessageButton, MessageActionRow } = require('discord-buttons');

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

[process.env.COMMANDHANDLER, process.env.EVENTHANDLER].forEach(handler => {
	require(`./handlers/${handler}`)(client, Discord);
});

client.login(process.env.DJS_TOKEN);