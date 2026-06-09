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
					label: 'Guides',
					items: [
						// Each item here is one entry in the navigation menu.
					],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'reference' } }],
				},
			],
		}),
	],
});
