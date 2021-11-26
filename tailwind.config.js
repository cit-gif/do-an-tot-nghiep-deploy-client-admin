const colors = require('tailwindcss/colors');

module.exports = {
	// important: "#__next",
	purge: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./src/components/**/*.{js,ts,jsx,tsx}',
		'./src/pages/**/*.{js,ts,jsx,tsx}',
	],
	darkMode: false, // or 'media' or 'class'
	mode: 'jit',
	theme: {
		extend: {},
		fontFamily: {
			sans: ['Roboto', 'sans-serif'],
			serif: ['"Roboto Slab"', 'serif'],
			body: ['Roboto', 'sans-serif'],
		},
		container: {
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
		},
		boxShadow: {
			sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
			DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
			md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
			lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
			xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			'2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
			'3xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
			inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
			none: 'none',
			dropdownRelative: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px',
			dropdownAbsolute:
				'rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px',
			nextShadow: '0 4px 14px 0 rgb(0, 150 ,167, .39)',
			upShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
			propductShadow: '0 24px 24px rgb(0 0 0 / 25%)',
		},
		colors: {
			transparent: 'transparent',
			current: 'currentColor',

			black: colors.black,
			white: colors.white,
			gray: colors.gray,

			indigo: colors.indigo,
			red: colors.rose,
			yellow: colors.amber,
			main: '#06c1d5',
			maindark: '#2d5bea',
			primary: '#06c1d5',
			primaryLight: '#80deea',
			primaryDark: '#0096a7',
			secondary: '#2d5bea',
			secondaryDark: '#242368',
			three: '#05042c',
			green: colors.green,
			orange: colors.orange,
			pink: colors.pink,
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
