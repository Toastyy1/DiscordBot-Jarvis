const fetch = require('node-fetch');

module.exports = {
	name: 'covid',
	expectedArgs: '<Bundesland> (<Landkreis>)',
	// minArgs: 1,
	maxArgs: 2,
	execute: async (messgae, args, Discord) => {
		// const state = args[0].toString();
		// const county = args[1].toString();
		const coronaIconUrl = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Coronavirus_icon.svg/1024px-Coronavirus_icon.svg.png';

		// console.log(state);
		// console.log(county);

		await fetch('https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Coronaf%C3%A4lle_in_den_Bundesl%C3%A4ndern/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json')
			.then(res => res.json())
			.then(data => {
				const { features } = data;
				const results = features.filter(filter => filter.attributes.AGS_TXT == 8 /* && filter.attributes.Landkreis == county*/)[0].attributes;
				let { Fallzahl, Death, cases7_bl_per_100k,
					faelle_100000_EW, LAN_ew_GEN, Aktualisierung } = results;

				cases7_bl_per_100k = '~ ' + Intl.NumberFormat().format(Math.round(cases7_bl_per_100k));
				faelle_100000_EW = '~ ' + Intl.NumberFormat().format(Math.round(faelle_100000_EW));
				Fallzahl = '~ ' + Intl.NumberFormat().format(Math.round(Fallzahl));
				Death = '~ ' + Intl.NumberFormat().format(Math.round(Death));

				const covidEmbed = {
					color: 0xDC143C,
					title: LAN_ew_GEN,
					author: {
						name: 'COVID-19 Informationen',
						icon_url: coronaIconUrl,
					},

					thumbnail: {
						url: coronaIconUrl,
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
							value: new Date().getDate(),
							inline: true,
						},
					],
					timestamp: new Date(),
				};

				messgae.channel.send({ embed: covidEmbed });
			})
			.catch(error => console.log('Error!' + error));

	},
};