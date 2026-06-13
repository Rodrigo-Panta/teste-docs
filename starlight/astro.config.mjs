// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from "@astrojs/sitemap";


// https://astro.build/config
export default defineConfig({
	site: "https://Rodrigo-Panta.github.io",
	base: "/teste-docs",
	integrations: [
		sitemap(),
		starlight({
			title: 'Axis Result',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/fillippeprata/AxisResult' }],
			sidebar: [

				{
					label: 'Reference',
					items: [
						{ label: 'Railway Oriented Programming', link: 'docs/en-us/railway-oriented-programming' },
						{ label: 'Why AxisResult?', link: 'docs/en-us/why-axisresult' },
						{ label: 'Getting Started', link: 'docs/en-us/getting-started' },
						{ label: 'API Reference', link: 'docs/en-us/api-reference' },
					],
				},
				{
					label: 'API',
					items: [
						{ label: 'AxisResult', link: 'docs/en-us/api/axisresult' },
						{ label: 'Result', link: 'docs/en-us/api/result' },
					],
				},
			],
			defaultLocale: 'en-us',
			locales: {

				'en-us': {
					label: 'English',
				},
				'pt-br': {
					label: 'Português',
				},
			}
		}),
	],
});
