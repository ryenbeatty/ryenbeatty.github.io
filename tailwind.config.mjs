/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontSize: {
				xs: ['var(--step--2)', { lineHeight: '1.25rem' }],
				sm: ['var(--step--1)', { lineHeight: '1.5rem' }],
				base: ['var(--step--1)', { lineHeight: '1.5rem' }],
				lg: ['var(--step-0)', { lineHeight: '1.5rem' }],
				xl: ['var(--step-1)', { lineHeight: '1.4' }],
				'2xl': ['var(--step-2)', { lineHeight: '1.3' }],
				'3xl': ['var(--step-3)', { lineHeight: '1.2' }],
				'4xl': ['var(--step-4)', { lineHeight: '1.2' }],
				'5xl': ['var(--step-5)', { lineHeight: '1.1' }],
				'6xl': ['var(--step-5)', { lineHeight: '1.1' }],
				'7xl': ['var(--step-5)', { lineHeight: '1' }],
				'8xl': ['var(--step-5)', { lineHeight: '1' }],
				'9xl': ['var(--step-5)', { lineHeight: '1' }],
			},
		},
	},
	plugins: [],
}
