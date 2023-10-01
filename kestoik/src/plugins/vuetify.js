import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);


export default new Vuetify({
	theme: {
		dark: true,
		themes: {
			light: {
				primary: '#007BFF',
				secondary: '#6C757D',
				background: '#F8F9FA',
				backgroundAlt: '#E9ECEF',
				backgroundDark: '#343A40',
				textPrimary: '#212529',
				textSecondary: '#495057',
				textInverse: '#FFFFFF',
				border: '#CED4DA',
				borderAccent: '#17A2B8',
				error: '#FF5252',
				success: '#28A745',
				linkPrimary: '#007BFF',
				linkSecondary: '#6C757D',
				neutralLight: '#F8F9FA',
				neutralDark: '#343A40',
			},
			dark: {
				primary: '#007BFF',
				secondary: '#6C757D',
				background: '#121212',
				backgroundAlt: '#1E1E1E',
				backgroundDark: '#F8F9FA',
				textPrimary: '#FFFFFF',
				textSecondary: '#8E8E8E',
				textInverse: '#000000',
				border: '#8E8E8E',
				borderAccent: '#61DAFB',
				error: '#FF5252',
				success: '#28A745',
				linkPrimary: '#61DAFB',
				linkSecondary: '#BB86FC',
				neutralLight: '#121212',
				neutralDark: '#1E1E1E',
			},
			neon: {
				primary: '#00FFA3',
				secondary: '#FF00AA',
				background: '#0D0D0D',
				backgroundAlt: '#111111',
				backgroundDark: '#0F0F0F',
				textPrimary: '#FFFFFF',
				textSecondary: '#B2B2B2',
				textInverse: '#000000',
				border: '#B2B2B2',
				borderAccent: '#00FFA3',
				error: '#FF0000',
				success: '#00FF00',
				linkPrimary: '#00FFA3',
				linkSecondary: '#FF00AA',
				neutralLight: '#0D0D0D',
				neutralDark: '#111111',
			},
		},
	},
	options: {
		customProperties: true
	}
});
