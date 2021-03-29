const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const rootDir = path.dirname(require.main.filename);

const validateStateShortcuts = shortCut => {
	const validShortcuts = [
		{
			state: 'Baden-Württemberg',
			shortcut: 'BW',
		},

		{
			state: 'Nordrhein-Westfalen',
			shortcut: 'NRW',
		},

		{
			state: 'Sachsen-Anhalt',
			shortcut: 'SA',
		},

		{
			state: 'Schleswig-Holstein',
			shortcut: 'SH',
		},

		{
			state: 'Rheinland-Pfalz',
			shortcut: 'RP',
		},

		{
			state: 'Mecklenburg-Vorpommern',
			shortcut: 'MVP',
		},
	];

	for(const x of validShortcuts) {
		if(x.shortcut.toLowerCase() == shortCut.toLowerCase()) {
			return x.state;
		}
	}
	return null;
};

module.exports = {
	name: 'covid',
	expectedArgs: '<Bundesland>',
	minArgs: 1,
	maxArgs: 1,
	execute: async (message, args, Discord) => {
		try {
			let state = '';

			if(args[0]) {
				state = args[0].toString();

				if(state.length <= 3) {
					state = validateStateShortcuts(state);

					if(!state) {
						return message.channel.send(`"${args[0].toString()}" ist keine gültige Abkürzung!`);
					}
				}
			}

			const stateFlagsPath = `${rootDir}/State flags`;
			const stateFlagName = fs.readdirSync(stateFlagsPath).filter(flag => flag == `${state.toLowerCase().replace('ü', 'ue')}.png`)[0];
			let stateFlag = '';


			for(const flag of fs.readdirSync(stateFlagsPath)) {
				if(flag == stateFlagName) {
					stateFlag = `${stateFlagsPath}/${stateFlagName}`;
				}
			}

			const coronaIconUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Coronavirus_icon.svg/1024px-Coronavirus_icon.svg.png';
			const api = 'https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json';

			await fetch(api)
				.then(res => res.json())
				.then(data => {
					const { features } = data;
					const results = features.filter(filter => filter.attributes.LAN_ew_GEN.toLowerCase() == state.toLowerCase().replace('ue', 'ü'))[0];
					if(!results) {
						return message.channel.send(`"${state}" ist kein gültiges Bundesland!`);
					}

					let { Fallzahl, Death, cases7_bl_per_100k,
						faelle_100000_EW, LAN_ew_GEN, Aktualisierung } = results.attributes;

					cases7_bl_per_100k = '~ ' + Intl.NumberFormat().format(Math.round(cases7_bl_per_100k));
					faelle_100000_EW = '~ ' + Intl.NumberFormat().format(Math.round(faelle_100000_EW));
					Fallzahl = '~ ' + Intl.NumberFormat().format(Math.round(Fallzahl));
					Death = '~ ' + Intl.NumberFormat().format(Math.round(Death));
					Aktualisierung = new Date(Aktualisierung);
					Aktualisierung = `${Aktualisierung.getDate()}.${Aktualisierung.getMonth()}.${Aktualisierung.getFullYear()}`;

					const covidEmbed = {
						color: 0xDC143C,
						title: LAN_ew_GEN,
						author: {
							name: 'COVID-19 Informationen',
							icon_url: coronaIconUrl,
						},

						thumbnail: {
							url: `attachment://${stateFlagName}`,
						},

						fields: [
							{
								name: 'Fallzahl insgesamt',
								value: Fallzahl,
								inline: true,
							},

							{
								name: 'Todesfälle insgesamt',
								value: Death,
								inline: true,
							},

							{
								name: 'Fälle der letzten 7 Tage/100000 EW',
								value: cases7_bl_per_100k,
								inline: true,
							},

							{
								name: 'Fälle / 100.000 EW',
								value: faelle_100000_EW,
								inline: true,
							},

							{
								name: 'Stand',
								value: Aktualisierung,
								inline: true,
							},
						],
						timestamp: new Date(),
					};

					message.channel.send({ embed: covidEmbed, files: [{
						attachment: stateFlag,
						name: stateFlagName
					}] });
				})
				.catch(error => console.log('Error!' + error));

		}
		catch (error) {
			console.log('An error occured while executing the covid command: ' + error);
			message.channel.send('Leider ist ein Fehler aufgetreten :(');
		}
	},
};