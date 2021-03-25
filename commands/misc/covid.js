const fetch = require('node-fetch');


module.exports = {
	name: 'covid',
	execute: async (messgae, args, Discord) => {

		fetch('https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_COVID19/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json')
			.then(res => res.json())
			.then(data => {
				const { features } = data;
				console.log(features.filter(filter => filter.attributes.Bundesland == 'Baden-Württemberg' && filter.attributes.Landkreis == 'LK Schwäbisch Hall'));
			})
			.catch(error => console.log('Error!' + error));

	},
};